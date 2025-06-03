from django.http import JsonResponse
from django.shortcuts import render 

def index(request):
    return render(request, "base.html")

def hello_world(request):
    return JsonResponse({"message": "Hello, world!"})