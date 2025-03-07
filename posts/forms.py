from django import forms
from .models import Post


class PostForm(forms.ModelForm):
    body = forms.CharField(
        widget=forms.Textarea(attrs={
            'rows': 3,
            'placeholder': 'Write your haiku...',
            'class': 'post-form-textarea'
        }),
        label=''
    )

    class Meta:
        model = Post
        fields = ['body']
