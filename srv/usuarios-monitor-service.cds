using monitor from '../db/schema';

service UsuariosMonitorService {

    entity UsuarioPacote
        as projection on monitor.UsuarioPacote;

}