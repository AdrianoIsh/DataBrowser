namespace monitor;
entity Logs {
    key ID      : UUID;
    key PACOTE  : String;
    key IFLOW   : String;
    key DATE    : Timestamp;
        PACOTE_DESC  : String;
        ERROLOG : String;
        LAUDO_IA : String;
        PAYLOAD : LargeString @cds.persistence.type:'NCLOB';
}

entity UsuarioPacote {

    key USERID : String(255);
    key PACOTE : String(100);
        PACOTE_DESC : String;

       // ADMIN  : Boolean;

}