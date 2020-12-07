from django.urls import path
from .views import main_view, data_view

urlpatterns = [
    path('', main_view, name='home'),
    path('data/', data_view, name='data')
]
