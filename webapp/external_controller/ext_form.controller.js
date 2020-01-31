var global_form_me;
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

	return Controller.extend("epdash.epdash.external_controller.ext_form", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf product_version_detail.main
		 */
		formatter: formatter,
		onInit: function () {
			global_form_me = this;
			this.collection_id = window.location.href.split('/external_form/')[1];

			var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/BRLT/PRODUCT_CATOGRY_DETAIL_SRV/", {
				useBatch: true
			});
			this.oModel_form = new sap.ui.model.odata.ODataModel("/sap/opu/odata/BRLT/PQP_PROJECT_DETAIL_SRV/", {
				useBatch: true
			});
			this._get_Product_Name(oModel);
			//	this.getView().setModel(oModel);
			var oFilterModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oFilterModel, 'searchModel');

			var oTableModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oTableModel, 'table');
			this.hide_advanced_search();
			if (this.collection_id !== "null") {
				this.getView().byId('search_hfc_id').setValue(this.collection_id);
				this.search_collection_id(this.collection_id);
			}
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("external_form").attachPatternMatched(this._onRoute_external_form, this);

		},
        _onRoute_external_form:function(){
        	
        },
		back_to_main: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("main");
		},
		hide_advanced_search: function () {
			global_form_me.getView().getModel('searchModel').setData({
				key: "normal"
			});
			global_form_me.getView().getModel('searchModel').refresh(true);

		},
		hide_normal_search: function () {
			this.getView().getModel('searchModel').setData({
				key: "advanced"
			});
			this.getView().getModel('searchModel').refresh(true);
		},
		_hide_Table: function () {
			global_form_me.getView().getModel('table').setData({
				key: "hide"
			});
			global_form_me.getView().getModel('table').refresh(true);
		},
		_display_Table: function () {
			global_form_me.getView().getModel('table').setData({
				key: "show"
			});
			global_form_me.getView().getModel('table').refresh(true);
		},
		_get_Product_Name: function (oModel) {
			oModel.read("/ProductSet", {
				success: function (oData) {
					var oProduct_Model = new sap.ui.model.json.JSONModel();
					oProduct_Model.setData(oData.results);
					global_form_me.getView().setModel(oProduct_Model, 'ProductName');
				},
				error: function (err) {

				},
				async: true
			});
		},
		on_select_product: function (oEvent) {
			var oFilter = [];
			var product_name = oEvent.getSource().getSelectedItem().getText();
			this.getView().byId("sps").setValue(null);
			this.getView().byId("collection").setValue(null);
			if (product_name !== null) {
				var FilterValue = new sap.ui.model.Filter("ProductName", sap.ui.model.FilterOperator.EQ, product_name);
				oFilter.push(FilterValue);
				this.oModel_form.read("/get_prod_versionSet", {
					filters: oFilter,
					success: function (oData) {
						var oProduct_ver_Model = new sap.ui.model.json.JSONModel();
						oProduct_ver_Model.setData(oData.results);
						global_form_me.getView().setModel(oProduct_ver_Model, 'Pv_Version');
					},
					error: function (err) {

					},
					async: false
				});
			}
		},
		on_select_product_version: function (oEvent) {
			var oFilter = [];
			var product_version_name = oEvent.getSource().getSelectedItem().getText();
			this.getView().byId("collection").setValue(null);
			if (product_version_name !== null) {
				var FilterValue1 = new sap.ui.model.Filter("ProductName", sap.ui.model.FilterOperator.EQ, this.getView().byId('product').getSelectedItem()
					.getText());
				var FilterValue2 = new sap.ui.model.Filter("ProdVersName", sap.ui.model.FilterOperator.EQ, product_version_name);
				oFilter.push(FilterValue1, FilterValue2);
				this.oModel_form.read("/get_sps_versionSet", {
					filters: oFilter,
					success: function (oData) {
						var sps_Model = new sap.ui.model.json.JSONModel();
						sps_Model.setData(oData.results);
						global_form_me.getView().setModel(sps_Model, 'Sps_Version');
					},
					error: function (err) {

					},
					async: false
				});
			}
		},
		on_select_sps: function (oEvent) {
			var oFilter = [];
			var sps_name = oEvent.getSource().getSelectedItem().getText();
			this.getView().byId('collection_group').setSelectedIndex(-1);
			if (sps_name !== null) {
				var FilterValue1 = new sap.ui.model.Filter("ProductName", sap.ui.model.FilterOperator.EQ, this.getView().byId('product').getSelectedItem()
					.getText());
				var FilterValue2 = new sap.ui.model.Filter("SpsName", sap.ui.model.FilterOperator.EQ, sps_name);
				oFilter.push(FilterValue1, FilterValue2);
				this.oModel_form.read("/get_patch_collectionSet", {
					filters: oFilter,
					success: function (oData) {
						var oPatch_Coll = new sap.ui.model.json.JSONModel();
						oPatch_Coll.setData(oData.results);
						global_form_me.getView().setModel(oPatch_Coll, 'Patch_Collection');
					},
					error: function (err) {

					},
					async: false
				});
			}
		},

		on_select_collection: function (oEvent) {
			var oForm_Model = new sap.ui.model.json.JSONModel();
			global_form_me.getView().setModel(oForm_Model, 'form_model');
			var oFilter = [];
			var patch_collection = oEvent.getSource().getValue();

			if (patch_collection !== '') {
				var FilterValue = new sap.ui.model.Filter("CollectionName", sap.ui.model.FilterOperator.EQ, patch_collection);
				oFilter.push(FilterValue);
				this.oModel_form.read("/get_assembly_formSet", {
					filters: oFilter,
					success: function (oData) {
						if (oData.results[0].ProductId !== '' && oData.results[0].ProductTriggerId !== '') {

							oForm_Model.setData(oData.results);
							oForm_Model.refresh(true);
							global_form_me._display_Table();
						} else {
							oForm_Model.setData(null);
							oForm_Model.refresh(true);
							MessageBox.error('No Form found for ' +
								oData.results[0].CollectionName);
							global_form_me._hide_Table();
						}
					},
					error: function (err) {

					},
					async: false
				});

			} else {
				MessageBox.error('Please enter value!!');
			}
		},
		search_collection_id: function () {
			var oForm_Model = new sap.ui.model.json.JSONModel();
			global_form_me.getView().setModel(oForm_Model, 'form_model');
			var oFilter = [];
			if (this.collection_id !== "null") {
				this.getView().byId('search_hfc_id').setValue(this.collection_id);
			}
			var patch_collection = this.getView().byId('search_hfc_id').getValue();
			if (patch_collection !== null) {
				var FilterValue = new sap.ui.model.Filter("CollectionName", sap.ui.model.FilterOperator.EQ, patch_collection);
				oFilter.push(FilterValue);
				this.oModel_form.read("/get_assembly_formSet", {
					filters: oFilter,
					success: function (oData) {
						if (oData.results[0].ProductId !== '' && oData.results[0].ProductTriggerId !== '') {
							oForm_Model.setData(oData.results);
							oForm_Model.refresh(true);
							global_form_me._display_Table();
						} else {
							oForm_Model.setData(null);
							oForm_Model.refresh(true);
							MessageBox.error('No Form found for ' +
								oData.results[0].CollectionName);
							global_form_me._hide_Table();
						}
					},
					error: function (err) {

					},
					async: false
				});

			}

		},
		update_form: function (oEvent) {
			var path = oEvent.getSource().getParent().getBindingContext('form_model').getPath();
			var oTableItem = this.getView().byId("itemassembinqueue");
			var oModel = oTableItem.getModel('form_model').getProperty(path);
			var index = oTableItem.indexOfItem(oEvent.getSource().getParent());
			if (oModel.Status === '') {
				oModel.Status = '9898';
			}
			var oSelectedItem = {
				"ProductTriggerId": oModel.ProductTriggerId,
				"ProductId": oModel.ProductId,
				"Phase": oModel.Phase,
				"ItemId": oModel.ItemId,
				"SerialNum": oModel.SerialNum,
				"SystemId": oModel.SystemId,
				"Client": oModel.Client,
				"Activity": oModel.Activity,
				"CommentByUser": oModel.CommentByUser,
				"Status": oModel.Status

			};
			var update_Model = new sap.ui.model.odata.ODataModel("/sap/opu/odata/BRLT/PRODUCT_CATOGRY_DETAIL_SRV/", {
				useBatch: true
			});
			update_Model.update("item_status_projectSet(SerialNum='" + oModel.SerialNum + "',ProductTriggerId='" + oModel.ProductTriggerId +
				"',ProductId='" + oModel.ProductId + "')", oSelectedItem, null,
				function () {
					var oMsg = "Saved Sussefully!!";
					sap.m.MessageBox.success(oMsg);
				},
				function () {
					sap.m.MessageBox.error("Failed to Update");
				}
			);
			this._refreshItem_Table(oModel.ProductTriggerId, oModel.ProductId);
		},
		_refreshItem_Table: function (ProductTriggerId, ProductId) {
			var fill = [];
			var filterGid = new sap.ui.model.Filter("ProductTriggerId", sap.ui.model.FilterOperator.EQ, ProductTriggerId);
			var filterPr = new sap.ui.model.Filter("ProductId", sap.ui.model.FilterOperator.EQ, ProductId);
			fill.push(filterGid, filterPr);
			var that = this;
			var oTab = this.getView().byId("itemassembinqueue");
			var oTemplate = this.getView().byId("itemstepinqueue");
			var update_Model = new sap.ui.model.odata.ODataModel("/sap/opu/odata/BRLT/PRODUCT_CATOGRY_DETAIL_SRV/", {
				useBatch: true
			});
			update_Model.read("/item_status_projectSet", {
				filters: fill,
				success: function (oData) {
					if (oData.results.length !== 0) {
						that.oData = oData.results;
						that.json = new sap.ui.model.json.JSONModel();
						that.json.setData({
							path: that.oData
						});
						oTab.setModel(that.json, "form_model");
						that.getView().setModel(that.json, "form_model");
					} else {
						var bCompact = !!that.getView().$().closest(".sapUiSizeCompact").length;
						MessageBox.information(
							"No Form Found!!.", {
								styleClass: bCompact ? "sapUiSizeCompact" : ""
							}
						);
					}
				}
			});

		},
		link_get: function () {
			var coll_id = this.getView().byId('search_hfc_id').getValue();
			var coll_id1 = this.getView().byId('collection').getValue();
			var final_id;
			var type_of_search = this.getView().getModel('searchModel').getData('key');

			if (type_of_search.key === 'normal') {
				final_id = coll_id;
			} else if (type_of_search.key === 'advanced') {
				final_id = coll_id1;
			}

			if (final_id !== '' || final_id !== 'null') {
				var link = "https://pqpmain.wdf.sap.corp:44376/sap/bc/ui5_ui5/brlt/emy_patch/index.html#/external_form/" + final_id;
				var oText = new sap.m.Text({
					text: link,
					type: "Text"
				});
				var dialog = new sap.m.Dialog({
					title: 'Link',
					type: 'Message',
					state: 'Success',
					width: '500px',
					content: oText,
					beginButton: new sap.m.Button({
						text: 'OK',
						press: function () {
							dialog.close();
						}
					}),
					afterClose: function () {
						dialog.destroy();
					}
				});

				dialog.open();
			}
		},
		on_select_coll_type: function (oEvent) {
			if (this.getView().byId("sps").getValue() === '') {
				MessageBox.error('Please select SPS Version!!');
				this.getView().byId('collection_group').setSelectedIndex(-1);
			} else {
				var Index = oEvent.getSource().getSelectedIndex();
				var patch_list = this.getView().byId('collection');
			//	var patch_temp = this.getView().byId('collection_list');
			
				var aFilter = [];
				switch (Index) {
				case 0:
					aFilter.push(new Filter("CollectionType", FilterOperator.Contains, '01'));
					break;
				case 1:
					aFilter.push(new Filter("CollectionType", FilterOperator.Contains, '02'));
					break;
				case 2:
					aFilter.push(new Filter("CollectionType", FilterOperator.Contains, '03'));
					break;
				}
				var oBinding = patch_list.getBinding("items");
			    oBinding.filter(aFilter);
			}
		}

	});
});