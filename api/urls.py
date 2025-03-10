from django.urls import path
from . import views

app_name = 'api'

urlpatterns = [
    path('validate-haiku/', views.validate_haiku, name='validate-haiku'),
]
