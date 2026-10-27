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
type TileInfo {
    number     : Integer;
    title      : String;
    info       : String;
    state      : String;
}

service MonitorService {

    @readonly
    entity Logs as projection on monitor.Logs;

    @readonly
    entity UsuarioPacote as projection on monitor.UsuarioPacote;

    function getDashboard()
        returns Dashboard;

    function getErrosPorPacote()
        returns array of PacoteErro;

    function getUltimosErros()
        returns array of UltimoErro;

function getTileInfo()
    returns TileInfo;
}