from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('validador_cpf/<str:cpf>/', views.validador_cpf, name='validador_cpf'),  # Adiciona a rota para validação de CPF
]