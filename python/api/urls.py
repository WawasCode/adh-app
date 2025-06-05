from django.urls import path
from .views import hello_world, incidents

urlpatterns = [
    path('hello/', hello_world, name='hello_world'),
    path('incidents/', incidents, name='incidents'),
]