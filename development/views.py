from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.core.serializers import serialize

from .models import Boundary, Parcels, Rivers, Roads

# Create your views here.
# @login_required
def main_view(request):
    return render(request, 'development/index.html')

def data_view(request):
    context = {
        'rivers':serialize('geojson', Rivers.objects.all()),
        'roads':serialize('geojson', Roads.objects.all()),
        'boundary':serialize('geojson', Boundary.objects.all()),
        'parcels':serialize('geojson', Parcels.objects.all())
    }
    
    return JsonResponse(context)