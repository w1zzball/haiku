from django.urls import path
from .views import profile_view, UserPostsListView
from . import views

urlpatterns = [
    path('<username>/', profile_view, name='profile'),
    path('update/bio/', views.update_bio, name='update-bio'),
    path('update/pic/', views.update_profile_pic, name='update-pic'),
    path('<username>/posts/', UserPostsListView.as_view(), name='user-posts'),
]
