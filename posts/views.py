from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from .forms import PostForm
from django.views.generic import ListView
from django.contrib.auth.models import User
from .models import Post, Like
from profiles.models import Profile
from django.template.loader import render_to_string
import logging
from static.helpers.haiku_helpers import format_haiku
from django.views.decorators.csrf import ensure_csrf_cookie

# Set up logger
logger = logging.getLogger(__name__)
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


@ensure_csrf_cookie
@login_required
def create_post(request):
    if request.method == 'POST':
        form = PostForm(request.POST)
        if form.is_valid():
            text = form.cleaned_data['body']
            formatted_haiku = format_haiku(text)

            if not formatted_haiku:
                error_msg = ('Text must follow the 5-7-5 syllable pattern '
                             'of a haiku.')
                return JsonResponse({
                    'success': False,
                    'errors': {'body': [error_msg]}
                })

            post = form.save(commit=False)
            # Changed from request.user to request.user.profile
            post.author = request.user.profile
            post.body = formatted_haiku
            post.save()

            return JsonResponse({
                'success': True,
                'post_id': post.id,
                'body': post.body
            })
        return JsonResponse({'success': False, 'errors': form.errors})

    form = PostForm()
    form_html = render_to_string(
        'posts/includes/post_form.html',
        {'form': form},
        request=request  # Add this line to provide request context
    )
    return JsonResponse({'form': form_html})


@ensure_csrf_cookie
@login_required
def edit_post(request, post_id):
    # Changed from author=request.user to author=request.user.profile
    post = get_object_or_404(Post, id=post_id, author=request.user.profile)

    if request.method == 'POST':
        form = PostForm(request.POST, instance=post)
        if form.is_valid():
            text = form.cleaned_data['body']
            formatted_haiku = format_haiku(text)

            if not formatted_haiku:
                error_message = ('Text must follow the 5-7-5 syllable pattern '
                                 'of a haiku.')
                return JsonResponse({
                    'success': False,
                    'errors': {'body': [error_message]}
                })

            post = form.save(commit=False)
            post.body = formatted_haiku
            post.save()

            return JsonResponse({
                'success': True,
                'body': post.body
            })
        return JsonResponse({'success': False, 'errors': form.errors})

    form = PostForm(instance=post)
    form_html = render_to_string(
        'posts/includes/post_form.html', {'form': form})
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


@login_required
def like_post(request, post_id):
    """Add a like to a post"""
    post = get_object_or_404(Post, id=post_id)
    user_profile = request.user.profile

    # Check if already liked
    if not post.is_liked_by(user_profile):
        # Create the like
        Like.objects.create(user=user_profile, post=post)

    # Return JSON response for AJAX requests
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return JsonResponse({
            'success': True,
            'likes_count': post.likes_count,
            'is_liked': True
        })

    # For regular requests, redirect back
    return redirect('post-detail', post_id=post_id)


@login_required
def unlike_post(request, post_id):
    """Remove a like from a post"""
    post = get_object_or_404(Post, id=post_id)
    user_profile = request.user.profile

    # Delete the like
    Like.objects.filter(user=user_profile, post=post).delete()

    # Return JSON response for AJAX requests
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return JsonResponse({
            'success': True,
            'likes_count': post.likes_count,
            'is_liked': False
        })

    # For regular requests, redirect back
    return redirect('post-detail', post_id=post_id)


def post_detail(request, post_id):
    """Display a single post"""
    post = get_object_or_404(Post, id=post_id)

    # Check if the current user has liked this post
    liked_post_ids = []
    if request.user.is_authenticated:
        liked_post_ids = Like.objects.filter(
            user=request.user.profile,
            post=post
        ).values_list('post_id', flat=True)

    context = {
        'post': post,
        'liked_post_ids': liked_post_ids,
        'page_title': f'Post by {post.author.user.username}'
    }

    return render(request, 'posts/post_detail.html', context)
