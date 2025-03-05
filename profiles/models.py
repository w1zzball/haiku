from django.db import models
#
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
# Create your models here.


class Profile(models.Model):
    """ extends the user model with additional fields"""
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    # email = models.EmailField(max_length=254, blank=True)
    bio = models.TextField(max_length=500, blank=True)
    # TODO implement profile picture with cloudinary
    # profile_pic = CloudinaryField('image', default='placeholder')
    # default user model has
    # date_joined field
    # last_login field
    # is_active field
    # email field

    def __str__(self):
        return self.user.username

    @receiver(post_save, sender=User)
    def create_or_update_user_profile(sender, instance, created, **kwargs):
        if created:
            Profile.objects.create(user=instance)
        instance.profile.save()
