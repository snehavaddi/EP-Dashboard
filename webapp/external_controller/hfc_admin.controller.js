let global_hfc_admin;
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"epdash/epdash/model/formatter",
], function (Controller, formatter) {
	"use strict";

	return Controller.extend("epdash.epdash.external_controller.hfc_admin", {
		formatter: formatter,
		onInit: function () {
			global_hfc_admin = this;
			global_hfc_admin.oModel_01 = new sap.ui.model.odata.ODataModel("/sap/opu/odata/BRLT/PQP_PROJECT_DETAIL_SRV/");
			global_hfc_admin.oModel_02 = new sap.ui.model.odata.ODataModel("/sap/opu/odata/BRLT/PRODUCT_CATOGRY_DETAIL_SRV/");
			this.getView().byId("AppType").setModel(global_hfc_admin.oModel_02);
			global_hfc_admin.oGlobalBusyDialog = new sap.m.BusyDialog();
		},

		onSearchCustom: function (oEvent) {
			global_hfc_admin.getView().byId("mailpanel").setVisible(false);
			let key = this.getView().byId('AppType').getSelectedKey();
			let product_name_filter = new sap.ui.model.Filter("ProductName", sap.ui.model.FilterOperator.EQ, key);
			let arrayFilter = [product_name_filter];
			global_hfc_admin.oGlobalBusyDialog.open();
			global_hfc_admin.oModel_01.read('/get_scheduled_mailsSet', {
				filters: arrayFilter,
				success: function (oData) {
					if (oData.results.length !== 0) {
						global_hfc_admin.oModel_Mail_Type = new sap.ui.model.json.JSONModel({
							data: oData.results
						});
						global_hfc_admin.getView().setModel(global_hfc_admin.oModel_Mail_Type, 'mail_type');
						global_hfc_admin.getView().byId("tablepanel").setVisible(true);
					}else{
						global_hfc_admin.getView().byId("tablepanel").setVisible(false);
						sap.m.MessageToast.show('Nothing is Configured for mails!!');
					}
					global_hfc_admin.oGlobalBusyDialog.close();
				},
				error: function (err) {
					sap.m.MessageToast.show('Nothing is Configured for mails!!');
					global_hfc_admin.oGlobalBusyDialog.close();
				},
				async: false
			})

		},
		getDls: function (oEvt) {
			var property = oEvt.getSource().getModel('mail_type').getProperty(oEvt.getSource().getBindingContextPath());
			let url_string = "get_scheduled_mailsSet(ProductName='" + property.ProductName + "',MailsType='" + property.MailsType +
				"')/Mails_recipients";
			global_hfc_admin.oModel_01.read(url_string, {
				success: function (oData) {
					if (oData.results.length !== 0) {
						global_hfc_admin.oModel_Mail_dl = new sap.ui.model.json.JSONModel({
							data: oData.results
						});
						global_hfc_admin.getView().byId("mailpanel").setVisible(true);
						global_hfc_admin.getView().setModel(global_hfc_admin.oModel_Mail_dl, 'mail_dl');
					}else{
						global_hfc_admin.getView().byId("mailpanel").setVisible(false);
					sap.m.MessageToast.show('Nothing is Configured for mails!!');
					}

				},
				error: function (err) {
					sap.m.MessageToast.show('Nothing is Configured in recipients list!!');
				},
				async: true
			});

		},

		onSaveColoum: function (oEvt) {
			oEvt.getSource().getParent().getItems()[0].setVisible(false);
			oEvt.getSource().getParent().getItems()[1].setVisible(false);
			oEvt.getSource().getParent().getItems()[2].setVisible(true);
			oEvt.getSource().getParent().getParent().getCells()[2].setEnabled(false);
			oEvt.getSource().getParent().getParent().getCells()[3].setEditable(false);
			oEvt.getSource().getParent().getParent().getCells()[4].setEditable(false);
			var id = oEvt.getSource().getParent().getParent().getCells()[2].getId();
			var sno = oEvt.getSource().getParent().getParent().getCells()[0].getText();
			var app_name = oEvt.getSource().getParent().getParent().getCells()[1].getText();
			var enable = oEvt.getSource().getParent().getParent().getCells()[2].getSelectedItem().getText();
			var oParameter = {
				"SerialNumber": sno,
				"AppName": app_name,
				"Enable": enable,
				"VUrl": oEvt.getSource().getParent().getParent().getCells()[3].getValue(),
				"UrlContent": oEvt.getSource().getParent().getParent().getCells()[4].getValue()
			};
			//	this.getView().byId(id).setText(enable);
			this.getView().byId(id).removeItem(this.oItem);
			this.getView().getModel().update("/video_editSet(SerialNumber='" + sno + "',AppName='" + app_name + "')", oParameter, null,
				function () {
					var oMsg = "Change Sussefully";
					sap.m.MessageBox.success(oMsg);
				},
				function () {
					sap.m.MessageBox.error("Failed to Update");
				}
			);
			this._updateTable();
		},

		onCancelColoum: function (oEvt) {
			oEvt.getSource().getParent().getItems()[0].setVisible(false);
			oEvt.getSource().getParent().getItems()[1].setVisible(false);
			oEvt.getSource().getParent().getItems()[2].setVisible(true);
			oEvt.getSource().getParent().getParent().getCells()[2].setEnabled(false);
			oEvt.getSource().getParent().getParent().getCells()[3].setEditable(false);
			oEvt.getSource().getParent().getParent().getCells()[4].setEditable(false);
			var id = oEvt.getSource().getParent().getParent().getCells()[2].getId();
			this.getView().byId(id).removeItem(this.oItem);
			this._updateTable();
		},
		onaddVideo: function () {
			var oView = this.getView();
			var oDialog = oView.byId("helloDialog");
			// create dialog lazily
			if (!oDialog) {
				// create dialog via fragment factory
				oDialog = sap.ui.xmlfragment(oView.getId(), "video_log_edit.view.add_video", this);
				// connect dialog to view (models, lifecycle)
				oView.addDependent(oDialog);
			}
			oDialog.open();
			var path = this.oTable.getItems()[this.oTable.getItems().length - 1].getBindingContext().getPath();
			var s_no = parseInt(this.oTable.getModel().getProperty(path).SerialNumber) + 1;
			var appName = this.oTable.getModel().getProperty(path).AppName;
			this.getView().byId("S_num").setValue(s_no);
			this.getView().byId("app_namef").setValue(appName);
		},
		//Save data from Dialog
		onSaveDialogData: function () {
			var oParameter = {
				"SerialNumber": this.getView().byId("S_num").getValue(),
				"AppName": this.getView().byId("app_namef").getValue(),
				"Enable": this.getView().byId("enabledid").getSelectedKey(),
				"VUrl": this.getView().byId("fragURL").getValue(),
				"UrlContent": this.getView().byId("fragDiscription").getValue()
			};
			this.getView().getModel().create("/video_editSet", oParameter, null,
				function () {
					var oMsg = "URL added to list Successfully";
					sap.m.MessageBox.success(oMsg);
				},
				function () {
					sap.m.MessageBox.error("Failed to add");
				}
			);
			this._updateTable();
			this.getView().byId("helloDialog").close();
		},
		onCloseDialog: function () {
			this.getView().byId("helloDialog").close();
		},
		globalDisable: function (oEvt) {
			var oState = oEvt.getSource().getState();
			var oValue;
			var oPass = "X";
			if (oState === true) {
				oValue = "X";
			} else {
				oValue = '';
			}

			var oParameter = {
				"UserName": "",
				"Disable": "",
				"GlobalDisable": oValue
			};

			this.getView().getModel().update("/global_disable_videoSet(UserName='" + oPass + "',Disable='" + oPass + "')", oParameter, null,
				function () {
					var oMsg = "Update Sussefully";
					sap.m.MessageBox.success(oMsg);
				},
				function () {
					sap.m.MessageBox.error("Failed to Update");
				}
			);
		},

		getBooleanValue: function (state) {

		},
		onDeletedata: function (oEvt) {
			var path = oEvt.getParameters().listItem.getBindingContext().getPath();
			var s_no = parseInt(this.oTable.getModel().getProperty(path).SerialNumber) + 1;
			var appName = this.oTable.getModel().getProperty(path).AppName;
			this.getView().getModel().remove("/video_editSet(SerialNumber='" + s_no + "',AppName='" + appName + "')", null,
				function () {
					var oMsg = "Delete Sussefully";
					sap.m.MessageBox.success(oMsg);
				},
				function () {
					sap.m.MessageBox.error("Failed to Delete");
				}
			);
			this._updateTable();
		},
		_updateTable: function () {
			var that = this;
			var filterTitle = [];
			var key = that.getView().byId("AppType").getSelectedKey();
			var oFilters = new sap.ui.model.Filter("AppName", sap.ui.model.FilterOperator.EQ, key);
			filterTitle.push(oFilters);
			that.getView().getModel().read("/video_editSet", {
				filters: filterTitle,
				success: function (oData) {
					that.JModel = new sap.ui.model.json.JSONModel();
					that.JModel.setData({
						path: oData.results
					});
					that.oTable.setModel(that.JModel);
					that.oTable.bindAggregation("items", {
						path: "/path",
						template: that.oTemplate,
						growing: "true"
					});
				},
				error: function () {

				},
				async: false

			});
		}
	});
});