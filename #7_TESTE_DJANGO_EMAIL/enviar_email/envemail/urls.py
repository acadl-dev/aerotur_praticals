from django.urls import path
from .views import enviar_email, gerar_pdf

urlpatterns = [
    path("enviar-email/", enviar_email, name="enviar_email"),
    path('gerar-pdf/', gerar_pdf, name='gerar_pdf'),
]