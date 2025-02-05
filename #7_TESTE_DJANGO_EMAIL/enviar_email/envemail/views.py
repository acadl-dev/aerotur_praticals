from django.core.mail import EmailMessage
from django.http import HttpResponse
from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image
import os
from django.conf import settings  # 🔹 Importar settings para usar o caminho correto da assinatura
from django.shortcuts import render

def enviar_email(request):
    if request.method == "POST":
        email_destino = request.POST.get("email")

        if not email_destino:
            return HttpResponse("Erro: E-mail do destinatário não informado!", status=400)

        buffer = BytesIO()
        pdf = SimpleDocTemplate(buffer, pagesize=letter)
        elementos = []
        styles = getSampleStyleSheet()

        elementos.append(Paragraph("<b>AEROTUR</b>", styles['Title']))
        elementos.append(Paragraph("<b>RECEIPT</b>", styles['Title']))
        elementos.append(Spacer(1, 12))

        dados_cliente = [
            ["Bill To", "Receipt #", "Receipt Date"],
            ["JOAO DA SILVA", "100", "04/02/2025"],
        ]
        tabela_cliente = Table(dados_cliente, colWidths=[200, 100, 100])
        tabela_cliente.setStyle(TableStyle([
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ]))
        elementos.append(tabela_cliente)
        elementos.append(Spacer(1, 12))

        dados_pagamento = [
            ["DESCRIPTION", "AMOUNT"],
            ["PAGAMENTO REFERENTE AO PACOTE DE VIAGEM PARA MARAGOGI", "1,200.00"],
            ["", ""],
            ["Subtotal", "1,200.00"],
            ["IDVP 0.3%", "3.60"],
            ["TOTAL", "R$ 1.203,60"]
        ]
        tabela_pagamento = Table(dados_pagamento, colWidths=[300, 100])
        tabela_pagamento.setStyle(TableStyle([
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey),
            ('ALIGN', (1, 0), (1, -1), 'RIGHT'),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ]))
        elementos.append(tabela_pagamento)
        elementos.append(Spacer(1, 12))

        assinatura_path = os.path.join(settings.BASE_DIR, 'static', 'assinatura.png')
        if os.path.exists(assinatura_path):
            assinatura = Image(assinatura_path, width=120, height=50)
            elementos.append(assinatura)

        pdf.build(elementos)
        buffer.seek(0)

        email = EmailMessage(
            subject="Seu Comprovante de Pagamento",
            body="Segue em anexo o seu comprovante de pagamento.",
            from_email="seuemail@gmail.com",
            to=[email_destino],
        )

        email.content_subtype = "html"
        email.attach("comprovante.pdf", buffer.read(), "application/pdf")

        try:
            email.send()
            return HttpResponse("✅ E-mail enviado com sucesso!")
        except Exception as e:
            return HttpResponse(f" Erro ao enviar e-mail: {e}", status=500)

    return render(request, 'envemail/email_comprovante.html')

def gerar_pdf(request):
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="comprovante.pdf"'

    buffer = []
    pdf = SimpleDocTemplate(response, pagesize=letter)
    elementos = []

    styles = getSampleStyleSheet()

    # 📌 Cabeçalho (Empresa e Título)
    elementos.append(Paragraph("<b>AEROTUR</b>", styles['Title']))
    elementos.append(Paragraph("<b>RECEIPT</b>", styles['Title']))
    elementos.append(Spacer(1, 12))

    # 📌 Informações do Cliente e Data
    dados_cliente = [
        ["Bill To", "Receipt #", "Receipt Date"],
        ["JOAO DA SILVA", "100", "04/02/2025"],
    ]
    tabela_cliente = Table(dados_cliente, colWidths=[200, 100, 100])
    tabela_cliente.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
    ]))
    elementos.append(tabela_cliente)
    elementos.append(Spacer(1, 12))

    # 📌 Tabela de Descrição e Valor
    dados_pagamento = [
        ["DESCRIPTION", "AMOUNT"],
        ["PAGAMENTO REFERENTE AO PACOTE DE VIAGEM PARA MARAGOGI", "1,200.00"],
        ["", ""],
        ["Subtotal", "1,200.00"],
        ["IDVP 0.3%", "3.60"],
        ["TOTAL", "R$ 1.203,60"]
    ]
    tabela_pagamento = Table(dados_pagamento, colWidths=[300, 100])
    tabela_pagamento.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey),
        ('ALIGN', (1, 0), (1, -1), 'RIGHT'),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
    ]))
    elementos.append(tabela_pagamento)
    elementos.append(Spacer(1, 12))

    # 📌 Adicionar Assinatura
    assinatura_path = os.path.join(os.path.dirname(__file__), 'static/assinatura.png')  # Ajuste o caminho da assinatura
    if os.path.exists(assinatura_path):
        assinatura = Image(assinatura_path, width=120, height=50)
        elementos.append(assinatura)

    # 📌 Construir o PDF
    pdf.build(elementos)

    return response
