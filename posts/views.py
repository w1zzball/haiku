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
import logging
from django.contrib import messages
from django.views.decorators.http import require_POST
from static.helpers.haiku_helpers import format_haiku, is_haiku
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
                return JsonResponse({
                    'success': False,
                    'errors': {'body': ['Text must follow the 5-7-5 syllable pattern of a haiku.']}
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
    return JsonResponse({'form': render_to_string('posts/includes/post_form.html', {'form': form})})


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
                return JsonResponse({
                    'success': False,
                    'errors': {'body': ['Text must follow the 5-7-5 syllable pattern of a haiku.']}
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
    return JsonResponse({'form': render_to_string('posts/includes/post_form.html', {'form': form})})


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
@require_POST
def delete_profile(request):
    """Delete the user's profile"""
    user = request.user

    try:
        # Delete the user (this will cascade delete the profile due to OneToOneField)
        user.delete()

        # If AJAX request
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return JsonResponse({
                'success': True,
                'redirect_url': '/'
            })

        # For non-AJAX requests
        return redirect('home')

    except Exception as e:
        # Log the error
        logger.error(f"Error deleting profile for {user.username}: {str(e)}")

        # If AJAX request
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return JsonResponse({
                'success': False,
                'error': 'There was an error deleting your profile.'
            }, status=500)

        # For non-AJAX requests
        messages.error(request, 'There was an error deleting your profile.')
        return redirect('profile', username=user.username)
