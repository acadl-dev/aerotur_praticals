
// Formata o cpf no front
document.getElementById('cpf').addEventListener('input', function (e) {
    var value = document.getElementById('cpf').value;
    var cpfPattern = value.replace(/\D/g, '') // Remove qualquer coisa que não seja número
        .replace(/(\d{3})(\d)/, '$1.$2') // Adiciona ponto após o terceiro dígito
        .replace(/(\d{3})(\d)/, '$1.$2') // Adiciona ponto após o sexto dígito
        .replace(/(\d{3})(\d)/, '$1-$2') // Adiciona traço após o nono dígito
        .replace(/(-\d{2})\d+?$/, '$1'); // Impede entrada de mais de 11 dígitos
    e.target.value = cpfPattern;
}
)
// Formata o cnpj no front
document.getElementById('cnpj').addEventListener('input', function (e) {
    var value = document.getElementById('cnpj').value;
    var cnpjPattern = value.replace(/\D/g, '') // Remove qualquer coisa que não seja número
        .replace(/(\d{2})(\d)/, '$1.$2') // Adiciona ponto após o terceiro dígito
        .replace(/(\d{3})(\d)/, '$1.$2') // Adiciona ponto após o sexto dígito
        .replace(/(\d{3})(\d)/, '$1/$2') // Adiciona barra após o nono dígito
        .replace(/(\d{4})(\d)/, '$1-$2') // Adiciona traço após o nono dígito
        .replace(/(-\d{2})\d+?$/, '$1'); // Impede entrada de mais de 11 dígitos
    e.target.value = cnpjPattern;
}
)
// Formata o cpf no front
document.getElementById('cep').addEventListener('input', function (e) {
    var value = document.getElementById('cep').value;
    var cepPattern = value.replace(/\D/g, '') // Remove qualquer coisa que não seja número        
        .replace(/(\d{5})(\d)/, '$1-$2')
        .replace(/(-\d{3})\d+?$/, '$1'); // Limita a entrada de numeros
    e.target.value = cepPattern;
}
)

function tratar_cep() {
    console.log('teste ok')

    let cepvalue = document.getElementById('cep').value;
    cepvalue = cepvalue.replace(/\D/g, '') // Remove qualquer coisa que não seja número     

    $.ajax({
        type: 'POST',
        url: 'executarAPICEP/' + cepvalue + '/',
        data: { cep: cepvalue },
        success: function (data) {
            // Código a ser executado em caso de sucesso
            console.log(cepvalue)

            const div_rua = document.getElementById('rua')
            div_rua.textContent = data['logradouro']
            console.log(div_rua)

            const div_bairro = document.getElementById('bairro')
            div_bairro.textContent = data['bairro']

            const div_cidade = document.getElementById('cidade')
            div_cidade.textContent = data['localidade']

            const div_uf = document.getElementById('uf')
            div_uf.textContent = data['uf']

            const div_regiao = document.getElementById('regiao')
            div_regiao.textContent = data['regiao']
        },
        error: function (error) {
            // Código a ser executado em caso de erro
        }
    });
}

function tratar_cpf() {
    console.log('ok')
    let cpfvalue = document.getElementById('cpf').value;
    cpfvalue = cpfvalue.replace(/\D/g, '') // Remove qualquer coisa que não seja número

    const tamanho = cpfvalue.length



    if (tamanho == 11) {
        if(verificaCaracteresIguais(cpfvalue)){
            alert("CPF não existe!");
        }
        if (!verificaCaracteresIguais(cpfvalue)) {

            console.log("esta dentro do laço")


            $.ajax({
                type: 'POST',
                url: '/validador_cpf/' + cpfvalue + '/',
                data: { cpf: cpfvalue },
                success: function (response_data) {

                    const mensagemDiv = document.getElementById('recebe_validacao_cpf')
                    mensagemDiv.textContent = response_data['mensagem'];
                },
                error: function (error) {
                    // Código a ser executado em caso de erro
                    console.log("deu errado!")
                }
            });
        }
    }
}

function verificaCaracteresIguais(entrada_usuario) {
    return /^(\d)\1{10}$/.test(entrada_usuario);
}



