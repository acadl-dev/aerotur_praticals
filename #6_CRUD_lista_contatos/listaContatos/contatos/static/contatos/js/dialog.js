document.addEventListener("DOMContentLoaded", () => {
    const openDialogButton = document.getElementById("openDialog")
    const closeDialogButton = document.getElementById("closeDialog")
    const saveChangesButton = document.getElementById("saveChanges")
    const dialog = document.getElementById("dialog")



    openDialogButton.addEventListener("click", () => {
        dialog.classList.remove("hidden")
    })

    closeDialogButton.addEventListener("click", () => {
        dialog.classList.add("hidden")
    })

    saveChangesButton.addEventListener("click", () => {
        // Aqui você pode adicionar a lógica para salvar as alterações
        // Por exemplo, enviar os dados para o servidor usando fetch
        let name_value = document.getElementById('nome').value;
        let phone_value = document.getElementById('telephone').value;
        console.log("variaveis:   " + name_value, phone_value)

        $.ajax({
            type: 'POST',
            url: 'contato/',
            data: { nome: name_value, telefone: phone_value },
            success: function (data) {

                window.location.reload(true);
            },
            error: function (error) {
                // Código a ser executado em caso de erro
                console.log('algo deu errado dentro no ajax')
            }
        });
        // Fechar o diálogo após salvar
        dialog.classList.add("hidden")
    })


    document.querySelectorAll('.delete-button').forEach(function (delbtn) {
        delbtn.addEventListener("click", function () {
            const contatoId = this.getAttribute('data-id');  // Pega o ID do contato através do data-id

            if (confirm("Tem certeza que deseja excluir este contato?")){

            $.ajax({
                type: 'POST',
                url: '/delete_contact/' + contatoId + '/',  // Passa o contatoId na URL
                data: {
                    'csrfmiddlewaretoken': document.querySelector('[name=csrfmiddlewaretoken]').value  // Inclui o CSRF token
                },
                success: function (response) {
                    console.log("Contato deletado com sucesso");
                    // Remover a linha da tabela
                    document.getElementById('contact-' + contatoId).remove();
                    // Exibir a mensagem dinamicamente
                    const messageDiv = document.getElementById("message-box");
                    messageDiv.innerHTML = `<div class="alert alert-success">${response.message}</div>`;

                    // Opcional: Remover a mensagem após alguns segundos
                    setTimeout(() => {
                        messageDiv.innerHTML = "";
                    }, 3000);
                },
                error: function (error) {
                    console.log("Erro ao deletar:", error);
                }
            });
        }
        });
    });

    document.getElementById('telephone').addEventListener('input', function (e) {
        var value = document.getElementById('telephone').value;
        var cpfPattern = value.replace(/\D/g, '') // Remove qualquer coisa que não seja número
            .replace(/(\d{0})(\d)/, '$1($2') // Adiciona ponto após o terceiro dígito
            .replace(/(\d{2})(\d)/, '$1)$2') // Adiciona ponto após o sexto dígito
            .replace(/(\d{4})(\d)/, '$1-$2') // Adiciona traço após o nono dígito        
        e.target.value = cpfPattern;
    });

})

// Formata o cpf no front










