using monitor from '../db/schema';

type Dashboard {
    totalErros   : Integer;
    totalPacotes : Integer;
    totalIflows  : Integer;
}

type PacoteErro {
    pacote : String;
    total  : Integer;
}

type UltimoErro {
    pacote  : String;
    iflow   : String;
    date    : Timestamp;
    errolog : String;
}

service MonitorService {

    @readonly
    entity Logs as projection on monitor.Logs;

    @readonly
    entity UsuarioPacote as projection on monitor.UsuarioPacote;

    action getDashboard()
        returns Dashboard;

    action getErrosPorPacote()
        returns array of PacoteErro;

    action getUltimosErros()
        returns array of UltimoErro;

}