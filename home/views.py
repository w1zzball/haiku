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
        context['page_title'] = "Your Feed"
    else:
        context['page_title'] = "Welcome to Haiku"
    all_posts = list(Post.objects.all())
    if all_posts:
        # Get up to 5 random posts, or all if less than 5 exist
        random_posts = random.sample(all_posts, min(5, len(all_posts)))
        context['random_posts'] = random_posts

    return render(request, 'home/index.html', context)
