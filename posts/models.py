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
