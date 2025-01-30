from django.shortcuts import render
from django.shortcuts import render, redirect
from django.http import JsonResponse
from .models import Contato  # Certifique-se de que o modelo está correto

# Create your views here.
def home(request):
    return render(request, 'home.html')        


def contato(request):
    if request.method == "POST":
        nome = request.POST.get('nome')
        telefone = request.POST.get('telefone')
        
        # Validação simples
        if not nome or not telefone:
            return JsonResponse({'error': 'Nome e telefone são obrigatórios'}, status=400)
        
        # Salvar no banco de dados
        Contato.objects.create(nome=nome, telefone=telefone)

        # Redireciona para a página de contatos (substitua 'contato' pelo nome correto da URL)
        return redirect('contato')  

    # Para GET, renderizar o template com os contatos
    contatos = Contato.objects.all()
    return render(request, 'home.html', {'contatos': contatos})
