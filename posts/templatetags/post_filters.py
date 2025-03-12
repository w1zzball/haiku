from django import template
from posts.models import Like

register = template.Library()


@register.filter
def is_liked_by(post, profile):
    """Check if a post is liked by a specific profile"""
    return Like.objects.filter(post=post, user=profile).exists()
