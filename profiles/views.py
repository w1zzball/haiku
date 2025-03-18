from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.models import User
from .models import Profile
from posts.models import Post
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.http import require_POST
import logging
from django.contrib import messages

# Add logger configuration
logger = logging.getLogger(__name__)

# Create your views here.


def profile_view(request, username):
    """
    View to display a user's profile and posts
    """
    # Get the user and profile
    user = get_object_or_404(User, username=username)
    profile = get_object_or_404(Profile, user=user)

    # Get the user's posts
    posts = Post.objects.filter(author=profile).order_by('-created_at')

    context = {
        'viewed_user': user,
        'profile': profile,
        'posts': posts,
    }

    return render(request, 'profiles/profile.html', context)


@login_required
@require_POST
def update_bio(request):
    """Update the user's bio"""
    profile = request.user.profile
    bio = request.POST.get('bio', '')

    # Update the bio
    profile.bio = bio
    profile.save()

    return JsonResponse({
        'success': True,
        'bio': bio
    })


@login_required
@require_POST
def update_profile_pic(request):
    """Update the user's profile picture"""
    profile = request.user.profile

    if 'profile_pic' in request.FILES:
        profile.profile_pic = request.FILES['profile_pic']
        profile.save()

        return JsonResponse({
            'success': True,
            'profile_pic_url': profile.profile_pic.url
        })
    else:
        return JsonResponse({
            'success': False,
            'error': 'No image was uploaded.'
        }, status=400)


@login_required
def delete_profile(request):
    """Delete the user's profile"""
    user = request.user

    try:
        # Delete user (this will delete the profile due to OneToOneField)
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
