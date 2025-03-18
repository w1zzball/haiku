from django.shortcuts import render
from posts.models import Post
import random
# Create your views here.


def home_view(request):
    """
    View to render the home page with content based on authentication status.
    """
    context = {}

    if request.user.is_authenticated:
        # For logged-in users, display personalized content
        user_profile = request.user.profile
        user_posts = Post.objects.filter(
            author=user_profile).order_by('-created_at')[:5]
        context['user_posts'] = user_posts
        context['page_title'] = "Your Feed"
    else:
        # For anonymous users, display random selection of posts
        all_posts = list(Post.objects.all())
        if all_posts:
            # Get up to 5 random posts, or all if less than 5 exist
            random_posts = random.sample(all_posts, min(5, len(all_posts)))
            context['random_posts'] = random_posts
        context['page_title'] = "Welcome to Haiku"

    return render(request, 'home/index.html', context)
