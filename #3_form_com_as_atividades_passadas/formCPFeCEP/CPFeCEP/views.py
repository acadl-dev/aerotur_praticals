from django.shortcuts import render
import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .utils import valida_cpf


def home(request):
    return render(request, 'home.html')

@csrf_exempt
def executarAPICEP(request, cep):
    url = f"https://viacep.com.br/ws/{cep}/json/"
    response = requests.get(url)
    
    if response.status_code == 200:
        data = response.json()
        return JsonResponse(data)
    else:
        return JsonResponse({'error': 'Unable to fetch data from API'}, status=response.status_code)
    
@csrf_exempt
def validador_cpf(request, cpf):
    valido = valida_cpf(cpf)  # Chama a função de validação
    if valido:
        response_data = {'valido': True, 'mensagem': f"CPF válido!"}
        return JsonResponse(response_data, status=200)
    response_data = {'valido': False, 'mensagem': "CPF inválido!"}
    return JsonResponse(response_data, status=200)