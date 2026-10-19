namespace monitor;
entity Logs {
    key ID      : UUID;
    key PACOTE  : String;
    key IFLOW   : String;
    key DATE    : Timestamp;
        ERROLOG : String;
        PAYLOAD : String;
}

entity UsuarioPacote {

    key USERID : String(255);
    key PACOTE : String(100);

        ADMIN  : Boolean;

}