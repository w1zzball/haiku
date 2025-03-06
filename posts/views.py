from django.shortcuts import render
from django.views.generic import ListView
from django.contrib.auth.models import User
from .models import Post
from profiles.models import Profile
from django.shortcuts import get_object_or_404

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
