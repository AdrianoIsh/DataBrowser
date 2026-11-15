namespace monitor;
entity Logs {
    key ID      : UUID;
    key PACOTE  : String(50);
    key IFLOW   : String(50);
    key DATE    : Timestamp;
        PACOTE_DESC  : String(50);
        ERROLOG : String;
        LAUDO_IA : String;
        PAYLOAD : LargeString @cds.persistence.type:'NCLOB';
}

entity UsuarioPacote {

    key USERID : String(50);
    key PACOTE : String(100);
        PACOTE_DESC : String;

       // ADMIN  : Boolean;

}