from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from .forms import PostForm
from django.views.generic import ListView
from django.contrib.auth.models import User
from .models import Post
from profiles.models import Profile
from django.shortcuts import get_object_or_404
from django.template.loader import render_to_string

# Create your views here.


class UserPostsListView(ListView):
    model = Post
    template_name = 'posts/user_posts.html'  # Specify your template name
    context_object_name = 'posts'
    # Order posts by creation date in descending order
    ordering = ['-created_at']

    def get_queryset(self):
        username = self.kwargs.get('username')
        user = get_object_or_404(User, username=username)
        # Get the Profile instance
        profile = get_object_or_404(Profile, user=user)
        return Post.objects.filter(author=profile).order_by('-created_at')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['viewed_user'] = get_object_or_404(
            User, username=self.kwargs.get('username'))
        return context


@login_required
def create_post(request):
    if request.method == 'POST':
        form = PostForm(request.POST)
        if form.is_valid():
            post = form.save(commit=False)
            post.author = request.user.profile
            post.save()
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({'success': True})
            return redirect('home')
    else:
        form = PostForm()

    # If it's an AJAX request, return the form HTML
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        form_html = render_to_string(
            'posts/includes/post_form.html', {'form': form}, request=request)
        return JsonResponse({'form': form_html})

    # Otherwise redirect to home
    return redirect('home')


@login_required
def edit_post(request, post_id):
    post = get_object_or_404(Post, id=post_id)

    # Check if user is the author
    if post.author != request.user.profile:
        return JsonResponse({'error': 'Not authorized'}, status=403)

    if request.method == 'POST':
        form = PostForm(request.POST, instance=post)
        if form.is_valid():
            form.save()
            return JsonResponse({
                'success': True,
                'body': post.body,
                'post_id': post.id
            })
        return JsonResponse({'error': form.errors}, status=400)

    # GET request returns form HTML
    form_html = render_to_string(
        'posts/includes/edit_post_form.html',
        {'post': post},
        request=request
    )
    return JsonResponse({'form': form_html})


@login_required
def delete_post(request, post_id):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    post = get_object_or_404(Post, id=post_id)

    # Check if user is the author
    if post.author != request.user.profile:
        return JsonResponse({'error': 'Not authorized'}, status=403)

    post.delete()
    return JsonResponse({'success': True})
