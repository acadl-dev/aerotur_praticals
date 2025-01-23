from django.shortcuts import render
from django.contrib import messages
from django.http import HttpResponse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

def home(request):
    return render(request, 'home.html')