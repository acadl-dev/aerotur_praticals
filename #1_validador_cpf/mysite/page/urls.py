from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('validar-cpf/', views.valida_cpf_view, name='validar_cpf'),  # Adiciona a rota para validação de CPF
]