from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.core.serializers import serialize
from django.core.paginator import Paginator


from .models import Boundary, Parcels, Rivers, Roads, Comment, Sewerlines, Powerlines
from .forms import CommentForm

# Create your views here.
# @login_required
def main_view(request):
    return render(request, 'development/index.html')

def data_view(request):
    context = {
        'rivers':serialize('geojson', Rivers.objects.all()),
        'roads':serialize('geojson', Roads.objects.all()),
        'boundary':serialize('geojson', Boundary.objects.all()),
        'parcels':serialize('geojson', Parcels.objects.all()),
        'sewerlines':serialize('geojson', Sewerlines.objects.all()),
        'powerlines':serialize('geojson', Powerlines.objects.all()),
    }

    return JsonResponse(context)

def comment_section(request):
    comments = Comment.objects.all()
    
    paginator = Paginator(comments, 30)
    page = request.GET.get('page')
    comments = paginator.get_page(page)

    if request.method == 'POST':
        form = CommentForm(request.POST)

        if form.is_valid():
            form.save()

            return redirect('/comment_section/')

    form = CommentForm()
    return render(request, "development/comment.html", {'form':form, 'comments':comments})