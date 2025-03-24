from django import template
from posts.models import Like
import re

register = template.Library()


@register.filter
def is_liked_by(post, profile):
    """Check if a post is liked by a specific profile"""
    return Like.objects.filter(post=post, user=profile).exists()


@register.filter
def sanitize_meta(value):
    """Remove HTML tags, newlines and extra spaces for meta tags"""
    if value:
        # Remove HTML tags
        value = re.sub(r'<[^>]*>', '', value)
        # Replace newlines and carriage returns with spaces
        value = value.replace('\n', ' ').replace('\r', ' ')
        # Replace multiple spaces with single space
        value = re.sub(r'\s+', ' ', value)
        return value.strip()
    return ''
