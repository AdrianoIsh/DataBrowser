sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function (Controller, JSONModel, MessageToast) {
    "use strict";

    return Controller.extend("project1.controller.View1", {

        onInit: function () {

            this._loadDashboard();
            this._loadChart();
            this._loadPacotes();
            this._loadLogs();

        },

        _loadDashboard: async function () {

            try {

                const response = await fetch(
                    "/odata/v4/monitor/getDashboard",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: "{}"
                    }
                );

                const data = await response.json();

                const oModel = new JSONModel(data);

                this.getView().setModel(
                    oModel,
                    "dashboard"
                );

            } catch (error) {

                console.error(error);

                MessageToast.show(
                    "Erro ao carregar Dashboard"
                );

            }

        },

        _loadChart: async function () {

            try {

                const response = await fetch(
                    "/odata/v4/monitor/getErrosPorPacote",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: "{}"
                    }
                );

                const data = await response.json();

                const oChartModel = new JSONModel({
                    data: data.value
                });

                this.getView().setModel(
                    oChartModel,
                    "chart"
                );

                const oVizFrame = this.byId("idVizFrame");

                if (oVizFrame) {

                    oVizFrame.setVizProperties({

                        title: {
                            visible: false
                        },

                        legend: {
                            visible: false
                        },

                        plotArea: {
                            dataLabel: {
                                visible: true
                            }
                        },

                        categoryAxis: {
                            title: {
                                visible: false
                            }
                        },

                        valueAxis: {
                            title: {
                                visible: false
                            }
                        }

                    });

                }

            } catch (error) {

                console.error(error);

                MessageToast.show(
                    "Erro ao carregar gráfico"
                );

            }

        },

        _loadPacotes: async function () {

            try {

                const response = await fetch(
                    "/odata/v4/monitor/UsuarioPacote"
                );

                const data = await response.json();

                const pacotes = [
                    {
                        PACOTE: "Todos"
                    },
                    ...data.value
                ];

                const oModel = new JSONModel({
                    pacotes: pacotes
                });

                this.getView().setModel(
                    oModel,
                    "pacotes"
                );
                this.byId("cmbPacote")
                    .setSelectedKey("Todos");

            } catch (error) {

                console.error(error);

                MessageToast.show(
                    "Erro ao carregar pacotes"
                );

            }

        },

        onPesquisar: function () {

            const pacote = this.byId("cmbPacote")
                .getSelectedKey();

            const iflow = this.byId("inpIflow")
                .getValue()
                .toUpperCase();

            const dataInicial = this.byId("dtInicial")
                .getDateValue();

            const dataFinal = this.byId("dtFinal")
                .getDateValue();

            let resultado = [...this._allLogs];

            if (
                pacote &&
                pacote !== "Todos"
            ) {

                resultado = resultado.filter(
                    item => item.PACOTE === pacote
                );

            }

            if (iflow) {

                resultado = resultado.filter(
                    item =>
                        item.IFLOW
                            .toUpperCase()
                            .includes(iflow)
                );

            }
            if (dataInicial) {

                resultado = resultado.filter(item => {

                    const dataLog = new Date(item.DATE);

                    return dataLog >= dataInicial;

                });

            }

            if (dataFinal) {

                const fimDoDia = new Date(dataFinal);

                fimDoDia.setHours(
                    23,
                    59,
                    59,
                    999
                );

                resultado = resultado.filter(item => {

                    const dataLog = new Date(item.DATE);

                    return dataLog <= fimDoDia;

                });

            }

            const oModel = new JSONModel({
                logs: resultado
            });

            this.getView().setModel(
                oModel,
                "logs"
            );
            this.byId("pnlResultado")
                .setHeaderText(
                    `Resultado (${resultado.length} registros)`
                );

            MessageToast.show(
                resultado.length +
                " registro(s) encontrado(s)"
            );

        },
        formatDate: function (sDate) {

            if (!sDate) {
                return "";
            }

            const data = new Date(sDate);

            return data.toLocaleString(
                "pt-BR",
                {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );

        },
        showDownloadButton: function (sPayload) {

            return !!(
                sPayload &&
                sPayload.trim()
            );

        },
        hasPayload: function (sPayload) {

            return !!(
                sPayload &&
                sPayload.trim()
            );

        },
        hasPayload: function (sPayload) {

            return !!(
                sPayload &&
                sPayload.trim()
            );

        },

        hasNoPayload: function (sPayload) {

            return !(
                sPayload &&
                sPayload.trim()
            );

        },
        onDownloadPayload: function (oEvent) {

            const oContext = oEvent.getSource().getBindingContext("logs");

            const payload = oContext.getProperty("PAYLOAD");

            if (!payload) {
                MessageToast.show("Payload vazio");
                return;
            }

            let extensao = "txt";

            const conteudo = payload.trim();

            if (
                conteudo.startsWith("{") ||
                conteudo.startsWith("[")
            ) {
                extensao = "json";
            } else if (
                conteudo.startsWith("<")
            ) {
                extensao = "xml";
            }

            const blob = new Blob(
                [payload],
                {
                    type: "text/plain"
                }
            );

            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");

            link.href = url;
            link.download = `payload.${extensao}`;

            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);

            window.URL.revokeObjectURL(url);

        },
        onLimpar: function () {

            this.byId("dtInicial").setValue("");
            this.byId("dtFinal").setValue("");

            this.byId("inpIflow").setValue("");

            this.byId("cmbPacote")
                .setSelectedKey("Todos");

            const oModel = new JSONModel({
                logs: this._allLogs
            });

            this.getView().setModel(
                oModel,
                "logs"
            );

            this.byId("pnlResultado")
                .setHeaderText(
                    `Resultado (${this._allLogs.length} registros)`
                );

        },
        _loadLogs: async function () {

            try {

                const response = await fetch(
                    "/odata/v4/monitor/Logs"
                );

                const data = await response.json();

                this._allLogs = data.value.sort(
                    (a, b) => new Date(b.DATE) - new Date(a.DATE)
                );
                const oModel = new JSONModel({
                    logs: this._allLogs
                });

                this.getView().setModel(
                    oModel,
                    "logs"
                );
                this.byId("pnlResultado")
                    .setHeaderText(
                        `Resultado (${this._allLogs.length} registros)`
                    );

            } catch (error) {

                console.error(error);

                MessageToast.show(
                    "Erro ao carregar logs"
                );

            }

        }

    });

});