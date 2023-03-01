sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/core/Fragment"
], function(Controller, JSONModel, MessageToast, Fragment) {
	"use strict";

	return Controller.extend("aemp.guarderia.controller.App", {
		onInit: function() {
			this.today = new Date();
		},

		onBeforeRendering: function() {
			
		},

		mostrarHijos: function() {
			//Mostrar los hijos que cumplan con condicion de edad durante el periodo de imputacion
			var oMes = this.byId("inp_mes").getValue();
			var oAnioInput = this.byId("inp_anio").getDateValue();
			var oTable = this.byId("tabla_hijos");

			if (oMes === "" || oAnioInput === null) {
				MessageToast.show("Llene los campos obligatorios");
			} else {
				var oAnio = oAnioInput.getFullYear();
				var oNumMes = parseInt(this.byId("inp_mes").getSelectedKey(), 10);
				var oAnioActual = this.today.getFullYear();
				var oNumMesActual = this.today.getMonth() + 1;

				if (oAnio === oAnioActual && oNumMes === oNumMesActual) {
					var userInfo = sap.ushell.Container.getService("UserInfo");
					var sUserId = userInfo.getId();

					/* CONEXION CON BACK-END */

					oTable.setVisible(true);
				} else {
					oTable.setVisible(false);
					MessageToast.show("El mes o año seleccionado no coincide con el periodo de imputacion actual.");
				}
			}
		},

		subirArchivo: function(oEvent) {
			var oSelectedItem = oEvent.getSource().getBindingContext("hijos").getObject().DNI;

			if (!this.UploadArchivos) {
				Fragment.load({
					name: "aemp.guarderia.view.Upload",
					controller: this,
					id: "upload"
				}).then(function (oDialog) {
					this.UploadArchivos = oDialog;
					this.getView().addDependent(oDialog);
					this.UploadArchivos.open();
				}.bind(this));
			} else {
				this.UploadArchivos.open();
			}
			
			MessageToast.show(oSelectedItem);
		},
		
		onUploadCancel: function(){
			this.UploadArchivos.close();
		},
		
		onUploadPress: function(){
			//Se carga el archivo subido
		},

		onUploadComplete: function (oEvent) {
			var oSource = oEvent.getSource();
			oSource.clear();
			oSource.removeAllHeaderParameters();
			this.UploadArchivos.close();
			MessageToast.show("Se cargo el archivo de manera correcta");
		},

		onUploadAbort: function (oEvent) {
			this.UploadArchivos.close();
			MessageToast.show("Error al subir el archivo");
		},

		visualizarComprobante: function() {
			MessageToast.show("La idea es hacer algo similar a teletrabajo");
		}
	});
});