from django.urls import path
from .views import UserPostsListView, create_post, edit_post, delete_post
from . import views
urlpatterns = [
    path('<username>/posts/', UserPostsListView.as_view(), name='user-posts'),
    path('create/', create_post, name='create-post'),
    path('edit/<int:post_id>/', edit_post, name='edit-post'),
    path('delete/<int:post_id>/', delete_post, name='delete-post'),
    path('delete-profile/', views.delete_profile,
         name='delete-profile'),  # Add this line

]
