from django.urls import path
from .views import UserPostsListView, create_post

urlpatterns = [
    path('<username>/posts/', UserPostsListView.as_view(), name='user-posts'),
    path('create/', create_post, name='create-post'),
]
