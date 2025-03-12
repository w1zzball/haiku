from django.db import models
from django.contrib.auth.models import User

# Create your models here.


class Post(models.Model):
    """Model for blog posts"""
    body = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(
        'profiles.Profile',
        on_delete=models.CASCADE,
        related_name='posts'
    )
    likes = models.PositiveIntegerField(default=0)
    # likes currently not tied to any user TODO full implementation

    def __str__(self):
        return f"{self.body[:50]}... | {self.author}"

    # m2m relationship with likes
    liked_by = models.ManyToManyField(
        'profiles.Profile', through='Like', related_name='liked_posts', blank=True)

    @property
    def likes_count(self):
        return self.likes_set.count()

    def is_liked_by(self, user_profile):
        """Check if a post is liked by a specific user profile"""
        return self.likes_set.filter(user=user_profile).exists()


class Like(models.Model):
    user = models.ForeignKey('profiles.Profile', on_delete=models.CASCADE)
    post = models.ForeignKey(
        'Post', on_delete=models.CASCADE, related_name='likes_set')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'post')  # Prevent duplicate likes

    def __str__(self):
        return f"{self.user} likes {self.post}"
