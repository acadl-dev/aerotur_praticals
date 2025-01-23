console.log('teste ok')

        document.getElementById('cep-form').addEventListener('submit', function (event) {
            event.preventDefault();  // Impede o envio normal do formulário
            $.ajax({
                type: 'POST',
                url: 'executarAPICEP/' + document.getElementById('cep').value + '/',
                data: { cep: document.getElementById('cep').value },
                success: function (response) {
                    // Código a ser executado em caso de sucesso
                    const div_rua = document.getElementById('rua')
                    div_rua.textContent = response['logradouro']

                    const div_bairro = document.getElementById('bairro')
                    div_bairro.textContent = response['bairro']

                    const div_cidade = document.getElementById('cidade')
                    div_cidade.textContent = response['localidade']

                    const div_uf = document.getElementById('uf')
                    div_uf.textContent = response['uf']

                    const div_regiao = document.getElementById('regiao')
                    div_regiao.textContent = response['regiao']
                },
                error: function (error) {
                    // Código a ser executado em caso de erro
                }
            });
        });