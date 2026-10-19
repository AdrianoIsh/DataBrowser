import cds from '@sap/cds';

export default (srv) => {

srv.on('READ', 'Logs', async () => {

    const db = await cds.connect.to('db');

    const userId = 'adriano.ishibara@hotmail.com';

    const pacotes = await db.run(`
        SELECT PACOTE
        FROM MONITOR_USUARIOPACOTE
        WHERE USERID = '${userId}'
    `);

    if (!pacotes.length) {
        return [];
    }

    const listaPacotes = pacotes
        .map(p => `'${p.PACOTE}'`)
        .join(',');

    return await db.run(`
        SELECT *
        FROM MONITOR_LOGS
        WHERE PACOTE IN (${listaPacotes})
        ORDER BY DATE DESC
    `);

});

    srv.on('READ', 'UsuarioPacote', async () => {

        const db = await cds.connect.to('db');

        return await db.run(`
            SELECT *
            FROM MONITOR_USUARIOPACOTE
        `);

    });

    srv.on('getDashboard', async () => {

        const db = await cds.connect.to('db');

        const userId = 'adriano.ishibara@hotmail.com';

        const pacotes = await db.run(`
            SELECT PACOTE
            FROM MONITOR_USUARIOPACOTE
            WHERE USERID = '${userId}'
        `);

        if (!pacotes.length) {
            return {
                totalErros: 0,
                totalPacotes: 0,
                totalIflows: 0
            };
        }

        const listaPacotes = pacotes
            .map(p => `'${p.PACOTE}'`)
            .join(',');

        const totalErros = await db.run(`
            SELECT COUNT(*) TOTAL
            FROM MONITOR_LOGS
            WHERE PACOTE IN (${listaPacotes})
        `);

        const totalPacotes = await db.run(`
            SELECT COUNT(DISTINCT PACOTE) TOTAL
            FROM MONITOR_LOGS
            WHERE PACOTE IN (${listaPacotes})
        `);

        const totalIflows = await db.run(`
            SELECT COUNT(DISTINCT IFLOW) TOTAL
            FROM MONITOR_LOGS
            WHERE PACOTE IN (${listaPacotes})
        `);

        return {
            totalErros: totalErros[0].TOTAL,
            totalPacotes: totalPacotes[0].TOTAL,
            totalIflows: totalIflows[0].TOTAL
        };

    });

    srv.on('getErrosPorPacote', async () => {

        const db = await cds.connect.to('db');

        const userId = 'adriano.ishibara@hotmail.com';

        const pacotes = await db.run(`
            SELECT PACOTE
            FROM MONITOR_USUARIOPACOTE
            WHERE USERID = '${userId}'
        `);

        if (!pacotes.length) {
            return [];
        }

        const listaPacotes = pacotes
            .map(p => `'${p.PACOTE}'`)
            .join(',');

        const result = await db.run(`
            SELECT
                PACOTE,
                COUNT(*) AS TOTAL
            FROM MONITOR_LOGS
            WHERE PACOTE IN (${listaPacotes})
            GROUP BY PACOTE
            ORDER BY TOTAL DESC
        `);

        return result.map(item => ({
            pacote: item.PACOTE,
            total: item.TOTAL
        }));

    });

    srv.on('getUltimosErros', async () => {

        const db = await cds.connect.to('db');

        const userId = 'adriano.ishibara@hotmail.com';

        const pacotes = await db.run(`
            SELECT PACOTE
            FROM MONITOR_USUARIOPACOTE
            WHERE USERID = '${userId}'
        `);

        if (!pacotes.length) {
            return [];
        }

        const listaPacotes = pacotes
            .map(p => `'${p.PACOTE}'`)
            .join(',');

        const result = await db.run(`
            SELECT TOP 3
                PACOTE,
                IFLOW,
                DATE,
                ERROLOG
            FROM MONITOR_LOGS
            WHERE PACOTE IN (${listaPacotes})
            ORDER BY DATE DESC
        `);

        return result.map(item => ({
            pacote: item.PACOTE,
            iflow: item.IFLOW,
            date: item.DATE,
            errolog: item.ERROLOG
        }));

    });

};