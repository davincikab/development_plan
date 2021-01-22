from django.urls import path
from .views import main_view, data_view, comment_section

urlpatterns = [
    path('', main_view, name='home'),
    path('data/', data_view, name='data'),
    path('comment_section/', comment_section, name="comment-section")
]
