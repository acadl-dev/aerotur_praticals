from django.shortcuts import render
from .utils import *
from django.contrib import messages
from django.http import HttpResponse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

def home(request):
    return render(request, 'home.html')

@csrf_exempt
def validador_cpf(request, cpf):
    valido = valida_cpf(cpf)  # Chama a função de validação
    if valido:
        response_data = {'valido': True, 'mensagem': f"CPF valido!"}
        return JsonResponse(response_data, status=200)
    response_data = {'valido': False, 'mensagem': "CPF invalido!"}
    return JsonResponse(response_data, status=200)



