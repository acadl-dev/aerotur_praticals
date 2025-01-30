gifrom django.shortcuts import render, redirect
from django.http import JsonResponse
from .models import Contato  # Certifique-se de que o modelo está correto
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt



# Create your views here.
def home(request):
    lista_contatos = []  # Garante que a variável existe      

    if request.method == "GET":
        lista_contatos = Contato.objects.all()       
        
    return render(request, 'home.html', {'contatos': lista_contatos})        

@csrf_exempt
def contato(request):
    if request.method == "POST":
        nome = request.POST.get('nome')
        telefone = request.POST.get('telefone')       
        
        # Salvar no banco de dados (devido ao create não necessita do .save())
        Contato.objects.create(nome=nome, telefone=telefone)

        # Redireciona para a página de contatos (substitua 'contato' pelo nome correto da URL)
        return redirect('contato')  

    # Para GET, renderizar o template com os contatos
    contatos = Contato.objects.all()
    return render(request, 'home.html', {'contatos': contatos})



@csrf_exempt
def contactdelete(request, id):
    if request.method == 'POST':        
        try: 
            contato = Contato.objects.get(id=id)                        
            contato.delete()    
            
            
            return JsonResponse({"succes": True,  "message": "O contato foi excluído com sucesso!"}, status=200)
        except Contato.DoesNotExist: return JsonResponse({"error": "Contato não encontrado"}, status=404)
    return JsonResponse({"error": "Método inválido"}, status=405)