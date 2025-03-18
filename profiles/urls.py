from django.urls import path
from .views import profile_view
from . import views

urlpatterns = [
    path('update/bio/', views.update_bio, name='update-bio'),
    path('update/pic/', views.update_profile_pic, name='update-pic'),
    path('delete-profile/', views.delete_profile, name='delete-profile'),
    path('<username>/', profile_view, name='profile'),
]
