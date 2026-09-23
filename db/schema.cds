namespace monitor;

@cds.persistence.exists
@cds.persistence.name : 'LOGINTEGRACOES_CPI_IFLOW'
entity Logs {
    key ID      : UUID;
    key PACOTE  : String;
    key IFLOW   : String;
    key DATE    : Timestamp;
        ERROLOG : String;
        PAYLOAD : String;
}

@cds.persistence.exists
@cds.persistence.name : 'USUARIO_PACOTE'
entity UsuarioPacote {

    key USERID : String(255);
    key PACOTE : String(100);

        ADMIN  : Boolean;

}