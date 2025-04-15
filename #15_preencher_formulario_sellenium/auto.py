from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select

import pandas as pd
import time

# Caminho para o seu chromedriver
CHROMEDRIVER_PATH = "C:/Users/ailton.costa_aerotur/Documents/chromedriver-win64/chromedriver.exe"

# Ler Excel
df = pd.read_excel('teste_automatizar.xlsx')

# Iniciar navegador
service = Service(CHROMEDRIVER_PATH)
driver = webdriver.Chrome(service=service)

# Acessar o site
driver.get('http://127.0.0.1:8000/atendimentos_salinas')

# Fazer login
username_input = driver.find_element(By.NAME, 'username')  # Ajuste conforme o 'name' do campo
password_input = driver.find_element(By.NAME, 'password')  # Ajuste conforme o 'name' do campo

username_input.send_keys('bi')
password_input.send_keys('aero98104546')
password_input.send_keys(Keys.RETURN)

# Esperar página carregar após login
time.sleep(2)

#clicar no card "Rocket Salinas"
# Espera até o card aparecer na tela
salinas_card = WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.XPATH, "//*[contains(text(), 'Rocket Salinas')]"))
)
salinas_card.click()




# Preencher o formulário para cada linha
for index, row in df.iterrows():
    time.sleep(2)

    novo_lead = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//*[contains(text(), 'Novo lead')]"))
    )
    novo_lead.click()

    # Esperar que o formulário esteja pronto
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.NAME, 'form_fill')))

    # Preencher os campos (ajustar o 'name' ou 'id' dos inputs conforme o formulário)

    # Esperar que o select esteja visível
    select_element = WebDriverWait(driver, 10).until(
        EC.visibility_of_element_located((By.NAME, "status"))  # ou pelo ID, depende do seu HTML
    )

    # Criar o objeto Select
    select = Select(select_element)

    # Selecionar a opção desejada (por texto visível)
    select.select_by_visible_text(row['status'])  # Ajuste o nome da coluna do seu Excel



    # Esperar que o select esteja visível
    select_element = WebDriverWait(driver, 10).until(
        EC.visibility_of_element_located((By.NAME, "atuacao"))  # ou pelo ID, depende do seu HTML
    )

    # Criar o objeto Select
    select = Select(select_element)

    # Selecionar a opção desejada (por texto visível)
    select.select_by_visible_text(row['seguimento'])  # Ajuste o nome da coluna do seu Excel
    time.sleep(1)
    driver.find_element(By.NAME, 'nome_empresa').send_keys(row['nome_empresa'])
    time.sleep(1)
    driver.find_element(By.NAME, 'cnpj').send_keys(row['cnpj'])
    time.sleep(1)
    driver.find_element(By.NAME, 'cep').send_keys(row['cep'])
    time.sleep(1)
    driver.find_element(By.NAME, 'telefone').send_keys(row['telefone'])
    time.sleep(1)
    driver.find_element(By.NAME, 'email').send_keys(row['email'])
    time.sleep(1)
    driver.find_element(By.NAME, 'funcao').send_keys(row['funcao'])
    time.sleep(1)
    driver.find_element(By.NAME, 'niver_contato').send_keys(
    row['aniversario'].strftime('%d/%m/%Y')
)

    # ... continue para os outros campos

    # Clicar no botão de salvar
    # Espera o botão ficar clicável até 10 segundos
    WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, '//button[@name="salvar_atendimento"]'))
    ).click()

    # Esperar e ir para novo formulário, se necessário
    time.sleep(2)
    novo_lead = WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.XPATH, "//*[contains(text(), 'Novo lead')]"))
)

# Fechar navegador
driver.quit()
