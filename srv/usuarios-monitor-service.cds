using monitor from '../db/schema';

service UsuariosMonitorService {
    // @odata.draft.enabled: Habilita o modo rascunho no HANA Cloud, obrigatório para criar/editar no Fiori Elements OData V4
    @odata.draft.enabled
    entity UsuarioPacote as projection on monitor.UsuarioPacote;

    // View de leitura que extrai os usuários únicos já cadastrados para alimentar a ajuda de pesquisa
    @readonly
    entity UsuariosVH as select from monitor.UsuarioPacote {
        key USERID
    } group by USERID;

    // View de leitura que extrai os pacotes únicos e sua descrição para alimentar a ajuda de pesquisa
    @readonly
    entity PacotesVH as select from monitor.UsuarioPacote {
        key PACOTE,
        max(PACOTE_DESC) as PACOTE_DESC : String
    } group by PACOTE;
}

// ============================================================================
// RÓTULOS DAS JANELAS DE AJUDA DE PESQUISA (Value Help)
// ============================================================================
annotate UsuariosMonitorService.UsuariosVH with {
    USERID @Common.Label: 'ID do Usuário';
};

annotate UsuariosMonitorService.PacotesVH with {
    PACOTE      @Common.Label: 'Código do Pacote';
    PACOTE_DESC @Common.Label: 'Descrição do Pacote';
};

// ============================================================================
// CONFIGURAÇÃO DOS CAMPOS DA ENTIDADE PRINCIPAL
// ============================================================================
annotate UsuariosMonitorService.UsuarioPacote with {
    USERID @(
        Common.Label: 'ID do Usuário',
        // Configura o matchcode (lupa) buscando da view UsuariosVH
        Common.ValueList: {
            CollectionPath: 'UsuariosVH',
            FetchValues: 1, // 1 = Carrega os dados automaticamente ao abrir o pop-up sem precisar clicar em "Iniciar"
            Parameters: [
                {
                    $Type: 'Common.ValueListParameterInOut',
                    LocalDataProperty: USERID,
                    ValueListProperty: 'USERID'
                }
            ]
        }
    );

    PACOTE @(
        Common.Label: 'Pacote',
        // Configura o matchcode (lupa) buscando da view PacotesVH
        Common.ValueList: {
            CollectionPath: 'PacotesVH',
            FetchValues: 1,
            Parameters: [
                {
                    $Type: 'Common.ValueListParameterInOut',
                    LocalDataProperty: PACOTE,
                    ValueListProperty: 'PACOTE'
                },
                {
                    // Preenche automaticamente o campo PACOTE_DESC na tela ao escolher um pacote existente
                    $Type: 'Common.ValueListParameterOut',
                    LocalDataProperty: PACOTE_DESC,
                    ValueListProperty: 'PACOTE_DESC'
                }
            ]
        }
    );

    PACOTE_DESC @Common.Label: 'Descrição do Pacote';
};

// ============================================================================
// ANOTAÇÕES VISUAIS DA TELA (Tabela Principal, Filtros e Tela de Detalhes)
// ============================================================================
annotate UsuariosMonitorService.UsuarioPacote with @(
    // Título e subtítulo exibidos no cabeçalho da tela de detalhes (Object Page)
    UI.HeaderInfo: {
        TypeName: 'Pacote do Usuário',
        TypeNamePlural: 'Pacotes dos Usuários',
        Title: { Value: USERID },
        Description: { Value: PACOTE }
    },

    // Caixas de filtro que aparecem na barra superior da tela inicial (List Report)
    UI.SelectionFields: [
        USERID,
        PACOTE
    ],

    // Ordem exata das colunas exibidas na tabela principal (List Report)
    UI.LineItem: [
        { Value: USERID },
        { Value: PACOTE },
        { Value: PACOTE_DESC }
    ],

    // Estrutura de seções/abas da tela de detalhes (Object Page)
    UI.Facets: [
        {
            $Type: 'UI.ReferenceFacet',
            Label: 'Dados do Acesso',
            Target: '@UI.FieldGroup#Geral'
        }
    ],

    // Ordem exata dos campos exibidos dentro do formulário da tela de detalhes (Object Page)
    UI.FieldGroup #Geral: {
        Data: [
            { Value: USERID },
            { Value: PACOTE },
            { Value: PACOTE_DESC }
        ]
    }
);
