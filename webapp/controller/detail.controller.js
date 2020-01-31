 var that = this;

 sap.ui.define([
 	"sap/ui/core/mvc/Controller",
 	"sap/ui/model/resource/ResourceModel",
 	"epdash/epdash/model/formatter",
 	"sap/ui/model/json/JSONModel",
 	"sap/m/Popover",
 	"sap/ui/model/Filter",
 	"sap/ui/model/FilterOperator",
 	'sap/m/MessageToast',
 	'sap/m/MessageBox'

 ], function (Controller, ResourceModel, formatter, JSONModel, Popover, Filter, FilterOperator, MessageToast, MessageBox) {
 	"use strict";
 	return Controller.extend("epdash.epdash.controller.detail", {

 		/**
 		 * Called when a controller is instantiated and its View controls (if available) are already created.
 		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
 		 * @memberOf fun.v1
 		 */
 		formatter: formatter,
 		onInit: function () {
 			var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/BRLT/PRODUCT_CATOGRY_DETAIL_SRV/");
 			this.getView().setModel(oModel);

 			var that = this;
 			this.getView().getModel().read("/usernameSet", null, null, true,
 				function (oData) {
 					var oName = oData.results[0].McNamefir;
 					var fname = oName;
 					var lname = "Welcome";
 					var sname = lname + " " + fname;
 					that.getView().byId("user1").setText(sname);
 				});
 			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
 			oRouter.getRoute("detail").attachPatternMatched(this._onObjectMatched, this);

 		},

 		_onObjectMatched: function (oEvent) {
 			var oTable1 = this.getView().byId("idProductsTabletwo");
 			var oTemplate1 = this.getView().byId("coloumid1");
 			var that = this;
 			that.oData = null;
 			this.getView().getModel().read("/assembly_get_dataSet", {
 				success: function (oData) {
 					var result = oData.results;
 					that.oData = oData.results;
 					that.json = new sap.ui.model.json.JSONModel();
 					that.json.setData({
 						path: that.oData
 					});
 					oTable1.setModel(that.json);
 					oTable1.bindAggregation("items", {
 						path: "/path",
 						template: oTemplate1,
 						growing: "true"
 					});
 				}
 			});

 			//   var oModel = sap.ui.getCore().getModel();
 			//   this.getView().setModel(oModel);
 			//   oTable1.setModel(oModel);
 			//   oTable1.bindAggregation("items",{path:"/path" , template:oTemplate1 });
 		},

 		ondelete: function () {

 		},

 		/**
 		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
 		 * (NOT before the first rendering! onInit() is used for that one!).
 		 * @memberOf fun.v1
 		 */
 		//  onBeforeRendering: function() {
 		//
 		//  },

 		/**
 		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
 		 * This hook is the same one that SAPUI5 controls get after being rendered.
 		 * @memberOf fun.v1
 		 */
 		onAfterRendering: function () {
 			var oTable = this.getView().byId("idProductsTabletwo");
 			var oTable1 = sap.ui.getCore().byId("idProductsTable");
 		},

 		/**
 		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
 		 * @memberOf fun.v1
 		 */
 		//  onExit: function() {
 		//
 		//  }
 		onNavBack: function () {
 			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
 			oRouter.navTo("main");
 		},

 	});
 });