sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"com/databrowser/usuariosmonitor/project2/test/integration/pages/UsuarioPacoteList.gen",
	"com/databrowser/usuariosmonitor/project2/test/integration/pages/UsuarioPacoteObjectPage.gen"
], function (JourneyRunner, UsuarioPacoteListGenerated, UsuarioPacoteObjectPageGenerated) {
    'use strict';

    const runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('com/databrowser/usuariosmonitor/project2') + '/test/flp.html#app-preview',
        pages: {
			onTheUsuarioPacoteListGenerated: UsuarioPacoteListGenerated,
			onTheUsuarioPacoteObjectPageGenerated: UsuarioPacoteObjectPageGenerated
        },
        async: true
    });

    return runner;
});

