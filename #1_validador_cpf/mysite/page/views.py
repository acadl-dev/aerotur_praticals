from django.shortcuts import render
from .utils import *
from django.contrib import messages
from django.http import HttpResponse

def home(request):
    return render(request, 'home.html')

def valida_cpf_view(request):
    if request.method == "POST":
        cpf = request.POST.get('cpf')  # Pega o CPF enviado no formulário
        valido, regiao = valida_cpf(cpf)  # Valida o CPF utilizando a função
        print('chegou na função')
        
        if valido:
            messages.success(request, f"CPF válido! Região: {regiao}")
        else:
            messages.error(request, "CPF inválido!")  # Mensagem de erro em vez de resultado
    
    return render(request, 'validar_cpf.html')



def validador_cpf(request, cpf):
    return HttpResponse(valida_cpf(cpf))