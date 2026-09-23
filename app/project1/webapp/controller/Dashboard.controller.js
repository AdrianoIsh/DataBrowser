sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
    "use strict";

    return Controller.extend(
        "project1.controller.Dashboard",
        {

            onInit: function () {

                this._loadDashboard();
                this._loadUltimosErros();

            },

            _loadDashboard: async function () {

                const response = await fetch(
                    "/odata/v4/monitor/getDashboard",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json"
                        },
                        body: "{}"
                    }
                );

                const data =
                    await response.json();

                const oModel =
                    new JSONModel(data);

                this.getView().setModel(
                    oModel,
                    "dashboard"
                );

            },
            _loadUltimosErros: async function () {

                const response = await fetch(
                    "/odata/v4/monitor/getUltimosErros",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: "{}"
                    }
                );

                const data = await response.json();

                const oModel = new JSONModel({
                    erros: data.value
                });

                this.getView().setModel(
                    oModel,
                    "ultimos"
                );

            },
            onAbrirMonitor: function () {

                this.getOwnerComponent()
                    .getRouter()
                    .navTo("monitor");

            }

        }
    );

});