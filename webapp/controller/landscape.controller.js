sap.ui.define([
	'jquery.sap.global',
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel'
], function(jQuery, Controller, JSONModel) {
	"use strict";


	return Controller.extend("epdash.epdash.controller.landscape", {

		onInit: function () {

			
		},
		backtomain:function(){
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("main");
			
		},
		press:function(oEvent){
		var Index = oEvent.getSource().getId().split("lan_")[1];
			this.getView().byId("carousel").setActivePage(this.getView().byId("carousel").getPages()[Index-1]);
		}

	});

});