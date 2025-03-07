from django.shortcuts import render, get_object_or_404
from django.contrib.auth.models import User
from .models import Profile
from posts.models import Post
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
