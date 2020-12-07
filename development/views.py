from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.views.generic import ListView

# from .models import Alert

# Create your views here.
# @login_required
def main_view(request):
    return render(request, 'development/index.html')