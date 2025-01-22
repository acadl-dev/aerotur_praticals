from django.shortcuts import render
from .utils import *
from django.contrib import messages
from django.http import HttpResponse
from django.http import JsonResponse

def home(request):
    return render(request, 'home.html')

def validador_cpf(request, cpf):
    valido = valida_cpf(cpf)  # Chama a função de validação
    if valido:
        return JsonResponse({'valido': True, 'mensagem': f"CPF valido!"}, status=200)
    return JsonResponse({'valido': False, 'mensagem': "CPF invalido!"}, status=200)



