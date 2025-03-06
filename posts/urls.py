from django.urls import path
from .views import UserPostsListView

urlpatterns = [
    path('<username>/posts/', UserPostsListView.as_view(), name='user-posts'),
]
