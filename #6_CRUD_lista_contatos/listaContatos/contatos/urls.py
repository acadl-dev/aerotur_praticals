from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),   
    path('contato/', views.contato, name='contato'),
    path('delete_contact/<int:id>/', views.contactdelete, name='contactdelete'),
    
]
