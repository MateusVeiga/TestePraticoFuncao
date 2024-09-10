$(document).ready(function () {

    $('#btnBeneficiario').on('click', function () {
        var idCliente = $('#formCadastro #Id').val();

        if (!idCliente || idCliente == 0) {
            ModalDialog('Erro', 'Selecione ou cadastre um cliente antes de adicionar beneficiários.');
            return;
        }

        limparFormularioBeneficiario();

        carregarBeneficiarios(idCliente);

        $('#beneficiarioModal').modal('show');

        $('#salvarBeneficiario').off('click').on('click', function () {
            var novoNome = $('#novoNome').val();
            var novoCPF = $('#novoCPF').cleanVal();

            const cpf = $("#novoCPF").val();
            if (!validarCPF(cpf)) {
                ModalDialog("Erro", "O CPF informado é inválido.");
                return;
            }

            if (!novoNome || !novoCPF) {
                alert('Por favor, preencha todos os campos.');
                return;
            }

            $.ajax({
                url: urlSalvarBeneficiario,
                type: 'POST',
                data: {
                    "CPF": novoCPF,
                    "Nome": novoNome,
                    "IdCliente": idCliente
                },
                success: function (response) {
                    if (response.success) {
                        carregarBeneficiarios(idCliente);
                        $('#formBeneficiario')[0].reset();
                        $('#beneficiarioModal').modal('hide');
                        alert('Beneficiário salvo com sucesso.');
                    } else {
                        alert(response.message || 'Erro ao salvar o beneficiário.');
                    }
                },
                error: function (xhr, status, error) {
                    if (xhr.status === 400) {

                        alert(xhr.responseText);
                    } else {
                        console.error("Erro ao salvar:", status, error);
                        alert('Erro ao salvar o beneficiário.');
                    }
                }
            });
        });
    });

    function carregarBeneficiarios(idCliente) {
        $.ajax({
            url: '/Beneficiario/BeneficiarioList',
            type: 'POST',
            data: { idCliente: idCliente },
            success: function (data) {
                var beneficiariosTabela = $('#beneficiariosTabela tbody');
                beneficiariosTabela.empty();

                $('#beneficiariosTabela thead').html('<tr><th>CPF</th><th>Nome</th><th>Ações</th></tr>');

                if (data.Result === "OK") {
                    var beneficiarios = data.Records;

                    console.log("Dados recebidos:", data);

                    if (beneficiarios.length > 0) {
                        for (var i = 0; i < beneficiarios.length; i++) {
                            var cpfComMascara =

                            beneficiariosTabela.append(
                                '<tr><td class="cpf">' + beneficiarios[i].CPF + '</td>' +
                                '<td>' + beneficiarios[i].Nome + '</td>' +
                                '<td>' +
                                '<button class="btn btn-primary btn-sm btn-alterar" data-id="' + beneficiarios[i].Id + '" style="margin-right: 5px;">Alterar</button>' +
                                '<button class="btn btn-danger btn-sm btn-excluir" data-id="' + beneficiarios[i].Id + '">Excluir</button>' +
                                '</td></tr>'
                            );
                        }
                        $('.cpf').mask('000.000.000-00');

                    } else {
                        beneficiariosTabela.append('<tr><td colspan="3">Nenhum beneficiário encontrado.</td></tr>');
                    }
                } else {
                    beneficiariosTabela.html('<tr><td colspan="3">Erro ao carregar os dados dos beneficiários.</td></tr>');
                }
            },
            error: function () {
                $('#beneficiariosTabela tbody').html('<tr><td colspan="3">Erro ao carregar os dados dos beneficiários.</td></tr>');
            }
        });
    }

    function carregarBeneficiario(idBeneficiario) {
        $.ajax({
            url: '/Beneficiario/GetBeneficiario',
            type: 'GET',
            data: { id: idBeneficiario },
            success: function (response) {
                if (response.success) {
                    $('#IdBeneficiario').val(response.data.Id);
                    $('#novoNome').val(response.data.Nome);
                    $('#novoCPF').val(response.data.CPF);
                    $('#novoCPF').trigger('input');
                    $('#beneficiarioModal').modal('show');

                    $('#salvarBeneficiario').off('click').on('click', function () {
                        var idBeneficiario = $('#IdBeneficiario').val();
                        var novoNome = $('#novoNome').val();
                        var novoCPF = $('#novoCPF').cleanVal();
                        var idCliente = $('#formCadastro #Id').val();


                        if (!novoNome || !novoCPF) {
                            alert('Por favor, preencha todos os campos.');
                            return;
                        }

                        $.ajax({
                            url: '/Beneficiario/Alterar',
                            type: 'POST',
                            data: {
                                Id: idBeneficiario,
                                Nome: novoNome,
                                CPF: novoCPF,
                                IdCliente: idCliente
                            },
                            success: function (response) {
                                if (response.success) {
                                    carregarBeneficiarios(idCliente);
                                    $('#formBeneficiario')[0].reset();
                                    $('#beneficiarioModal').modal('hide');
                                    alert('Beneficiário alterado com sucesso.');
                                } else {
                                    alert('Erro ao alterar o beneficiário.');
                                }
                            },
                            error: function (xhr, status, error) {
                                if (xhr.status === 400) {
                                    alert(xhr.responseText);
                                } else {
                                    console.error("Erro ao alterar:", status, error);
                                    alert('Erro ao alterar o beneficiário.');
                                }
                            }
                        });
                    });
                } else {
                    alert('Erro: ' + response.message);
                }
            },
            error: function () {
                alert('Erro ao carregar os dados do beneficiário.');
            }
        });
    }

    $(document).on('click', '.btn-excluir', function () {
        var idBeneficiario = $(this).data('id');
        if (confirm('Tem certeza que deseja excluir este beneficiário?')) {
            $.ajax({
                url: '/Beneficiario/Excluir',
                type: 'POST',
                data: { id: idBeneficiario },
                success: function (response) {
                    if (response.success) {
                        var idCliente = $('#formCadastro #Id').val();
                        carregarBeneficiarios(idCliente);
                        alert('Beneficiário excluído com sucesso.');
                    } else {
                        alert('Erro ao excluir beneficiário.');
                    }
                },
                error: function () {
                    alert('Erro ao excluir beneficiário.');
                }
            });
        }
    });

    function limparFormularioBeneficiario() {
        $('#beneficiarioId').val('');
        $('#novoNome').val('');
        $('#novoCPF').val('');
    }

    $(document).on('click', '.btn-alterar', function () {
        var idBeneficiario = $(this).data('id');
        carregarBeneficiario(idBeneficiario);
    });

});
