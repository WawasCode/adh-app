from django.shortcuts import render

# Create your views here.

# from django.http import HttpResponse
from django.http import JsonResponse 
# einfache hello world api, return in JSON Format
def hello_world(request):
    return JsonResponse({"message": "Hello, world!"})