import cds from '@sap/cds';

export default (srv) => {

    srv.on('getTileInfo', async () => {

        const dashboard = await srv.send('getDashboard');

        return {
            number: dashboard.totalErros,
            info: `erros em ${dashboard.totalIflows} integrações`,
            state: dashboard.totalErros > 0 ? 'Error' : 'Success'
        };

    });

    srv.on('READ', 'Logs', async (req) => {

        const db = await cds.connect.to('db');

        const userId = req.user.id;

        const pacotes = await db.run(`
        SELECT PACOTE
        FROM MONITOR_USUARIOPACOTE
        WHERE USERID = '${userId}'
    `);
        const acessoTotal = pacotes.some(
            p => p.PACOTE === '*'
        );
        if (!pacotes.length) {
            return [];
        }

        const listaPacotes = pacotes
            .map(p => `'${p.PACOTE}'`)
            .join(',');

        const logs = await db.run(`
        SELECT *
        FROM MONITOR_LOGS
        WHERE ${acessoTotal
                ? '1 = 1'
                : `UPPER("PACOTE") IN (${listaPacotes})`
            }

    `);

        return logs.map(log => ({
            ...log,
            pacoteDescricao: log.PACOTE_DESC,
            PAYLOAD: Buffer.isBuffer(log.PAYLOAD)
                ? log.PAYLOAD.toString('utf8')
                : log.PAYLOAD,
            ERROLOG: Buffer.isBuffer(log.ERROLOG)
                ? log.ERROLOG.toString('utf8')
                : log.ERROLOG
        }));

    });

    srv.on('READ', 'UsuarioPacote', async (req) => {

        const db = await cds.connect.to('db');
        const userId = req.user.id;

        return await db.run(`
            SELECT *
            FROM MONITOR_USUARIOPACOTE
            WHERE USERID = '${userId}'
        `);
        const acessoTotal = pacotes.some(
            p => p.PACOTE === '*'
        );
    });

    srv.on('getDashboard', async (req) => {

        const db = await cds.connect.to('db');

        const userId = req.user.id;

        const pacotes = await db.run(`
            SELECT PACOTE
            FROM MONITOR_USUARIOPACOTE
            WHERE USERID = '${userId}'
        `);
        const acessoTotal = pacotes.some(
            p => p.PACOTE === '*'
        );
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
            WHERE ${acessoTotal
                ? '1 = 1'
                : `UPPER("PACOTE") IN (${listaPacotes})`
            }
                AND DATE >= ADD_DAYS(CURRENT_DATE, -7)
                GROUP BY PACOTE_DESC
                ORDER BY TOTAL DESC
        `);

        const totalPacotes = await db.run(`
            SELECT COUNT(DISTINCT PACOTE) TOTAL
            FROM MONITOR_LOGS
            WHERE UPPER("PACOTE") IN (${listaPacotes})
            AND DATE >= ADD_DAYS(CURRENT_DATE, -7)
        `);

        const totalIflows = await db.run(`
            SELECT COUNT(DISTINCT IFLOW) TOTAL
            FROM MONITOR_LOGS
            WHERE UPPER("PACOTE") IN (${listaPacotes})
            AND DATE >= ADD_DAYS(CURRENT_DATE, -7)
        `);

        return {
            totalErros: totalErros[0].TOTAL,
            totalPacotes: totalPacotes[0].TOTAL,
            totalIflows: totalIflows[0].TOTAL
        };

    });

    srv.on('getErrosPorPacote', async (req) => {

        const db = await cds.connect.to('db');

        const userId = req.user.id;

        const pacotes = await db.run(`
            SELECT PACOTE
            FROM MONITOR_USUARIOPACOTE
            WHERE USERID = '${userId}'
        `);
        const acessoTotal = pacotes.some(
            p => p.PACOTE === '*'
        );
        if (!pacotes.length) {
            return [];
        }

        const listaPacotes = pacotes
            .map(p => `'${p.PACOTE}'`)
            .join(',');

        const result = await db.run(`
            SELECT
                PACOTE_DESC,
                COUNT(*) AS TOTAL
            FROM MONITOR_LOGS
              WHERE ${acessoTotal
                ? '1 = 1'
                : `UPPER("PACOTE") IN (${listaPacotes})`
            }
              AND DATE >= ADD_DAYS(CURRENT_DATE, -7)
              GROUP BY PACOTE_DESC
              ORDER BY TOTAL DESC
        `);

        return result.map(item => ({
            pacote: item.PACOTE_DESC,
            total: item.TOTAL
        }));

    });

    srv.on('getUltimosErros', async (req) => {

        const db = await cds.connect.to('db');

        const userId = req.user.id;

        const pacotes = await db.run(`
            SELECT PACOTE
            FROM MONITOR_USUARIOPACOTE
            WHERE USERID = '${userId}'
        `);
        const acessoTotal = pacotes.some(
            p => p.PACOTE === '*'
        );
        if (!pacotes.length) {
            return [];
        }

        const listaPacotes = pacotes
            .map(p => `'${p.PACOTE}'`)
            .join(',');

        const result = await db.run(`
            SELECT TOP 3
                PACOTE_DESC,
                IFLOW,
                DATE,
                ERROLOG
            FROM MONITOR_LOGS
            WHERE ${acessoTotal
                ? '1 = 1'
                : `UPPER("PACOTE") IN (${listaPacotes})`
            }

        `);

        return result.map(item => ({
            pacote: item.PACOTE_DESC,
            iflow: item.IFLOW,
            date: item.DATE,
            errolog: item.ERROLOG
        }));

    });

};