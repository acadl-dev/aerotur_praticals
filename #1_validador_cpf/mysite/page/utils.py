
def valida_cpf(cpf):     
    cpf_lista = list(cpf)  
    cpf_sum = 0
    cpf_sum_sd = 0
    cont = 0
    cont_sd = 0
    contagem_regressiva_pdf = 10
    contagem_regressiva_sdf = 11
    valor_onze = 11

    # Cálculo para avaliar o primeiro digito validador
    for digitos in cpf_lista[:9]:      

      cpf_sum = int(digitos) * contagem_regressiva_pdf
      cont += cpf_sum
      contagem_regressiva_pdf -= 1
         

    resto = cont % valor_onze

  
    primeiro_digito_verificador = valor_onze - resto

    if (primeiro_digito_verificador >= 10):
      primeiro_digito_verificador = 0  
    
    # Cálculo para avaliar o segundo digito validador

    for digito in cpf_lista[:10]:
      cpf_sum_sd = int(digito) * contagem_regressiva_sdf
      cont_sd += cpf_sum_sd
      contagem_regressiva_sdf -= 1
      

    resto_sd = cont_sd % valor_onze
    

    segundo_digito_verificador = valor_onze - resto_sd
    if (segundo_digito_verificador >= 10):
      segundo_digito_verificador = 0

    #lógica para checar a validação do cpf
    
    cpf_correto = cpf_lista[:9] + [str(primeiro_digito_verificador)] + [str(segundo_digito_verificador)]    

    cpf_corret_str = ''.join(cpf_correto)    

    if (cpf_corret_str == cpf):
      return True
    else:
      return False
      





