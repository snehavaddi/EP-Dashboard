sap.ui.define([
	'jquery.sap.global',
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel',
	'sap/m/BusyIndicator',
	'epdash/epdash/controller/BaseController',
], function (jQuery, Controller, JSONModel, BusyIndicator, BaseController) {
	"use strict";
	return BaseController.extend("epdash.epdash.controller.pqp_project_detail", {

		onInit: function () {
			var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/BRLT/PQP_PROJECT_DETAIL_SRV/", {
				useBatch: true
			});
			this.getView().setModel(oModel);
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("pqp_project_detail").attachPatternMatched(this._onRouteMatched, this);

		},

		_onRouteMatched: function (oEvent) {
			//	this.getView().byId("__mainContent").bindAggregation(); 
			this.getView().byId("panelheadtext").setText("");
			oEvent.getParameters();
			var oPid = oEvent.getParameters().arguments.projectid;
			//	this.getView().byId("panelhead").setHeaderText(oPid);
			var aFilterArray = [];
			var filterprg = new sap.ui.model.Filter("ProjgrpId", sap.ui.model.FilterOperator.EQ, oPid);
			aFilterArray.push(filterprg);
			var oTab = this.getView().byId("iconTabHeader");
			var binding = oTab.getBinding("items");
			binding.filter(filterprg);
			var that = this;
			this.getView().getModel().read("/pqp_project_idSet", {
				filters: aFilterArray,
				success: function (oData) {
					that.getView().byId("panelheadtext").setText(oPid + " " + "(" + oData.results[0].short_text + ")");
				},
				async: true
			});
			this.onPressdetailgroup(oPid);
		},

		showBusyIndicator: function (iDuration, iDelay) {
			sap.ui.core.BusyIndicator.show(iDelay);

			if (iDuration && iDuration > 0) {
				if (this._sTimeoutId) {
					jQuery.sap.clearDelayedCall(this._sTimeoutId);
					this._sTimeoutId = null;
				}

				this._sTimeoutId = jQuery.sap.delayedCall(iDuration, this, function () {
					this.hideBusyIndicator();
				});
			}

		},

		hideBusyIndicator: function () {
			sap.ui.core.BusyIndicator.hide();
		},

		onSelectTab: function (oEvent) {

			var oPanel = this.getView().byId("projectexppanel");
			oPanel.setVisible(true);
			oPanel.setExpanded(true);
			this.showBusyIndicator(3000, 0);
			var pgrp = oEvent.getParameters().selectedItem.mProperties.text;
			pgrp.toString();
			var filter = new sap.ui.model.Filter("ProjectId", sap.ui.model.FilterOperator.EQ, pgrp);
			var oTab = this.getView().byId("__mainContent");
			var binding = oTab.getBinding("items");
			binding.filter(filter);
			var oTab = this.getView().byId("proitemtable");
			//   oTab.unbindAggregation();

		},
		onexpandpanel: function (oEvent) {
			var path = oEvent.getSource().getBindingContext().getPath();
			var oVbox = this.getView().byId("__mainContent");
			var oPro = oVbox.getModel().getProperty(path);
			var filter1 = new sap.ui.model.Filter("ProjectId", sap.ui.model.FilterOperator.EQ, oPro.ProjectId);
			var filter2 = new sap.ui.model.Filter("Phase", sap.ui.model.FilterOperator.EQ, oPro.Phase);
			var aFilterArray = [];
			var that = this;
			aFilterArray.push(filter1, filter2);
			this.evt = this.getView().byId(oEvent.oSource.sId);
			if (oEvent.oSource.mProperties.expanded == false) {
				//	oTab.unbindAggregation();
			} else {
				this.getView().getModel().read("/project_subdetail_phaseSet", {
					filters: aFilterArray,
					success: function (oData) {
						that.oData = oData.results;
						that.json = new sap.ui.model.json.JSONModel();
						that.json.setData({
							path: that.oData
						});

						var oTab = that.getView().byId(that.evt.getContent()[0].sId); // __table0-__xmlview1--__mainContent-0
						if (oTab == undefined) {
							that.showBusyIndicator(3000, 0);
							var oTab = that.getView().byId(that.evt.getContent()[0].sId);
						}
						var oTemplate = that.getView().byId("proitemtableitem");
						oTab.setModel(that.json);
						oTab.bindAggregation("items", {
							path: "/path",
							template: oTemplate,
							growing: "true"
						});

					}
				});
			}
		},

		onPressdetailgroup: function (oPid) {
			var VBox = this.getView().byId("__mainContent").setVisible(true);
			var oPanel = this.getView().byId("projectexppanel");
			oPanel.setVisible(true);
			oPanel.setExpanded(true);
			this.showBusyIndicator(3000, 0);
			var pgrp = this.getView().byId("panelheadtext").getText().split(" ")[0];
			pgrp.toString();
			if (pgrp === "") {
				pgrp = oPid;
			}
			var filter = new sap.ui.model.Filter("ProjectId", sap.ui.model.FilterOperator.EQ, pgrp);
			var oTab = this.getView().byId("__mainContent");
			var binding = oTab.getBinding("items");
			binding.filter(filter);
			var oTab = this.getView().byId("proitemtable");
		},
		textformat: function (value) {
			switch (value) {
			case "9999":

				return "{imageModel>/path}/messagetype/workabortedcompletly.JPG";

			case "8888":

				return "{imageModel>/path}/messagetype/workconfirm.JPG";
			case "4100":

				return "{imageModel>/path}/messagetype/waitingforreturn.JPG";
			case "4000":

				return "{imageModel>/path}/messagetype/Inprocess.JPG";
			case "0800":

				return "{imageModel>/path}/messagetype/Reset.JPG";
			case "0400":

				return "";
			case "0012":

				return "{imageModel>/path}/messagetype/Aborted.JPG";
			case "0008":

				return "{imageModel>/path}/messagetype/Terminated.JPG";
			case "0007":

				return "{imageModel>/path}/messagetype/Reset.JPG";
			case "0006":

				return "{imageModel>/path}/messagetype/notprocessed.JPG";
			case "0004":

				return "{imageModel>/path}/messagetype/finishwithwarnig.JPG";
			case "0002":

				return "{imageModel>/path}/messagetype/manuallysetfinish.JPG";
			case "0000":

				return "{imageModel>/path}/messagetype/Finish.JPG";
			}
		},
		iconformat: function (value) {
			if (value == 'F') {
				return '{imageModel>/path}/itemicon/Green.png';

			} else if (value == 'E') {

				return '{imageModel>/path}/itemicon/Red.png';
			} else {

				return '{imageModel>/path}/itemicon/Yellow.png';
			}
		},
		timeformat: function (val) {
			if (val) {
				val = val.replace(/^PT/, '').replace(/S$/, '');
				val = val.replace('H', ':').replace('M', ':');

				var multipler = 60 * 60;
				var result = 0;
				val.split(':').forEach(function (token) {
					result += token * multipler;
					multipler = multipler / 60;
				});
				var timeinmiliseconds = result * 1000;

				var timeFormat = sap.ui.core.format.DateFormat.getTimeInstance({
					pattern: "KK:mm:ss a"
				});
				var TZOffsetMs = new Date(0).getTimezoneOffset() * 60 * 1000;
				return timeFormat.format(new Date(timeinmiliseconds + TZOffsetMs));
			} else {
				return val;
			}

		},

		OnBeforeRendering: function () {

		}

	});

});