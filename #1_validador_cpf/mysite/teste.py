def valida_cpf(cpf):
    # Remove qualquer caractere não numérico
    cpf = ''.join([c for c in cpf if c.isdigit()])
    
    # Verifica se o CPF tem 11 dígitos
    if len(cpf) != 11:
        return False

    # Verifica se todos os dígitos são iguais
    if cpf == cpf[0] * 11:
        return False

    # Validação do primeiro dígito verificador
    soma1 = sum(int(cpf[i]) * (10 - i) for i in range(9))
    digito1 = (soma1 * 10) % 11
    if digito1 == 10 or digito1 == 11:
        digito1 = 0
    if digito1 != int(cpf[9]):
        return False

    # Validação do segundo dígito verificador
    soma2 = sum(int(cpf[i]) * (11 - i) for i in range(10))
    digito2 = (soma2 * 10) % 11
    if digito2 == 10 or digito2 == 11:
        digito2 = 0
    if digito2 != int(cpf[10]):
        return False
    
    # Através do nono digito saber em qual região o cpf foi emitido
    nono_digito = int(cpf[8])
    regiao  = ''
    
    if nono_digito == 1:
        regiao = 'DF, GO, MS, MT ou  TO'
    elif nono_digito == 2:
        regiao = 'AC, AM, AP, PA, RO ou RR'
    elif nono_digito == 3:
        regiao = 'CE, MA ou PI'
    elif nono_digito == 4:
        regiao = 'AL, PB, PE ou RN'
    elif nono_digito == 5:
        regiao = 'BA e SE'
    elif nono_digito == 6:
        regiao = 'MG'
    elif nono_digito == 7:
        regiao = 'ES ou RJ'
    elif nono_digito == 8:
        regiao = 'SP'
    elif nono_digito == 9:
        regiao = 'PR ou SC'
    elif nono_digito == 0:
        regiao = 'RS'
    else:
        return "Valor inválido"
    

    return True, regiao

# Exemplo de uso  

cpf = input("Digite o CPF para validar: ")
valido, regiao = valida_cpf(cpf)
if valido:
    print(f'CPF válido! E ele é originário da região: {regiao}')
else:
    print("CPF inválido!")
