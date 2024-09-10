CREATE PROC FI_SP_IncBeneficiario
    @NOME          VARCHAR (50),
    @CPF           VARCHAR (11),
    @IdCliente     BIGINT
AS
BEGIN
	INSERT INTO BENEFICIARIOS (NOME, CPF, IdCliente) 
	VALUES (@NOME, @CPF, @IdCliente)

	SELECT SCOPE_IDENTITY()
END
