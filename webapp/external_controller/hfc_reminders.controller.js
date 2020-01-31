let global_me_hfc_reminder;
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

	return Controller.extend("epdash.epdash.external_controller.hfc_reminders", {

		formatter: formatter,

		onInit: function () {
			global_me_hfc_reminder = this;
			global_me_hfc_reminder.mail_type = {
				ASMT: '01', ///Assembly Trigger Mail
				RTDV: '02', //Reminder to DEV/MAO for Ready for delivery Status
				RMDM: '03', //Retest Mail to DEV/MAO for any EP Request Id
				CRDV: '04', //Cuttoff reminders mail to DEV/MAO
				CSM: '05', //Cutoff start mails
				CEM: '06', //Cutoff end mails
				NACM: '07', //Cutoff Non-ABAP reminders
			}
			var obj = {
				"hfc_mail": "Emphasized",
				"hfc_hotline": "Default"
			};
			var oControls = new sap.ui.model.json.JSONModel({
				data: obj
			});
			this.getView().setModel(oControls, 'Controls');
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("hfc_reminder").attachPatternMatched(this._onRoute_hfc_schedule, this);
			global_me_hfc_reminder.oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/BRLT/PRODUCT_CATOGRY_DETAIL_SRV/");
			global_me_hfc_reminder.oModel_pqp = new sap.ui.model.odata.ODataModel("/sap/opu/odata/BRLT/PQP_PROJECT_DETAIL_SRV/");
			global_me_hfc_reminder.oModel_hotliner = new sap.ui.model.odata.ODataModel("/sap/opu/odata/BRLT/HOTLINE_TOOL_SRV/");
			global_me_hfc_reminder.oGlobalBusyDialog = new sap.m.BusyDialog();
			global_me_hfc_reminder.oModel_Mail_Type = new sap.ui.model.json.JSONModel({
				data: null
			});
			//define models for al mail type 
			global_me_hfc_reminder.oModel_Mail_Type_ASMT = new sap.ui.model.json.JSONModel({
				data: null
			});
			this.getView().setModel(global_me_hfc_reminder.oModel_Mail_Type_ASMT, 'ASMT');
			global_me_hfc_reminder.oModel_Mail_Type_RTDV = new sap.ui.model.json.JSONModel({
				data: null
			});
			this.getView().setModel(global_me_hfc_reminder.oModel_Mail_Type_RTDV, 'RTDV');
			global_me_hfc_reminder.oModel_Mail_Type_RMDM = new sap.ui.model.json.JSONModel({
				data: null
			});
			this.getView().setModel(global_me_hfc_reminder.oModel_Mail_Type_RMDM, 'RMDM');
			global_me_hfc_reminder.oModel_Mail_Type_CRDV = new sap.ui.model.json.JSONModel({
				data: null
			});
			this.getView().setModel(global_me_hfc_reminder.oModel_Mail_Type_CRDV, 'CRDV');
			global_me_hfc_reminder.oModel_Mail_Type_CSM = new sap.ui.model.json.JSONModel({
				data: null
			});
			this.getView().setModel(global_me_hfc_reminder.oModel_Mail_Type_CSM, 'CSM');
			global_me_hfc_reminder.oModel_Mail_Type_CEM = new sap.ui.model.json.JSONModel({
				data: null
			});
			this.getView().setModel(global_me_hfc_reminder.oModel_Mail_Type_CEM, 'CEM');
			global_me_hfc_reminder.oModel_Mail_Type_NACM = new sap.ui.model.json.JSONModel({
				data: null
			});
			this.getView().setModel(global_me_hfc_reminder.oModel_Mail_Type_NACM, 'NACM');
			////////////////////////

			global_me_hfc_reminder.oModel_recipient_Type_to = new sap.ui.model.json.JSONModel({
				recipient: null
			});
			global_me_hfc_reminder.oModel_recipient_Type_cc = new sap.ui.model.json.JSONModel({
				recipient: null
			});

		},
		_onRoute_hfc_schedule: function (oEvent) {
			this.getView().setModel(sap.ui.getCore().getModel('hfc_reminder_header_model'), 'hfc_model');
			this.getView().setModel(sap.ui.getCore().getModel('patch_data'), 'patch_model');
			let page_type = oEvent.getParameter("arguments").page;
			this.hfc_icon_tab_page(undefined, page_type)
			this._update_hfcHotliner();
			//	window.setTimeout(this._update_recipients, 5000);
		},
		_update_hfcHotliner: function () {
			let cuttoff_date = this.getView().getModel('hfc_model').getData()['data'].Cutoffdatestart;
			let date = new Date(cuttoff_date.substring(0, 4), (cuttoff_date.substring(4, 6) - 1).toString(),
				cuttoff_date.substring(6, 8));
			var aFilter = [];
			var Month = new sap.ui.model.Filter("Month", sap.ui.model.FilterOperator.EQ, cuttoff_date.substring(4, 6));
			var Year = new sap.ui.model.Filter("Year", sap.ui.model.FilterOperator.EQ, cuttoff_date.substring(0, 4));
			aFilter.push(Month, Year);
			global_me_hfc_reminder.oGlobalBusyDialog.open();
			let hfc_property = this.getView().getModel('hfc_model').getData()['data'];
			global_me_hfc_reminder.oModel_hotliner.read("HfcHotlinerSet", {
				filters: aFilter,
				success: function (oData) {
					let filter_hfc = oData.results.filter(c => c.ProductName === hfc_property.ProductName).filter(c => c.ProdVersIntern ===
						hfc_property.ProdVersIntern).filter(c => c.Spslevel === hfc_property.SpsIntern);
					global_me_hfc_reminder.oModel_HFC_Hotliner = new sap.ui.model.json.JSONModel({
						data: filter_hfc
					});
					global_me_hfc_reminder.getView().setModel(global_me_hfc_reminder.oModel_HFC_Hotliner, 'hfc_hotliner');
					global_me_hfc_reminder.oGlobalBusyDialog.close();
				},
				error: function (err) {
					global_me_hfc_reminder.oGlobalBusyDialog.close();
				},
				async: false
			});
		},
		hfc_icon_tab_page: function (oEvent, key) {
			let key_val = '';
			if (oEvent !== undefined) {
				key_val = oEvent.getSource().getSelectedKey();
			} else {
				key_val = key;
			}
			let Icon_Tab = this.getView().byId('hfc_icon_tab_bar');
			Icon_Tab.setSelectedKey(key_val);
			switch (key_val) {
			case "hfc_header":
				break;
			case "hfc_hotliner":

				break;
			case "hfc_reminder":
				global_me_hfc_reminder.oGlobalBusyDialog.open();
				this._update_type_of_mails_configured();
				global_me_hfc_reminder.oGlobalBusyDialog.close();
				break;
			}
		},
		schedule_mail: function () {
			var obj = {
				"hfc_mail": "Emphasized",
				"hfc_hotline": "Default"
			};
			this.getView().getModel('Controls').getData().data = obj;
			this.getView().getModel('Controls').refresh(true);
		},
		get_hfc_hotliner: function () {
			var obj = {
				"hfc_mail": "Default",
				"hfc_hotline": "Emphasized"
			};
			this.getView().getModel('Controls').getData().data = obj;
			this.getView().getModel('Controls').refresh(true);
		},
		back_to_main: function () {
			let PV_Model = new sap.ui.model.json.JSONModel({
				switch_on: true
			});
			this.getOwnerComponent().setModel(PV_Model, 'open_pv_hfc');
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("hfc_view", {
				holiday_flag: false
			});
		},
		onAfterRendering: function () {

		},
		jump_to_pqp_project: function (oEvent) {
			var data = oEvent.getSource().getText();
			let PQP_Model = new sap.ui.model.json.JSONModel({
				project_grp: data
			});
			this.getView().setModel(PQP_Model, 'pqp_model');
			if (!this._oDialogpqp_project) {
				this._oDialogpqp_project = sap.ui.xmlfragment("epdash.epdash.view.login_pqp_project", this);
			}
			var oButton = oEvent.getSource();
			jQuery.sap.delayedCall(0, this, function () {
				this._oDialogpqp_project.openBy(oButton);
			});
		},
		fioriGuilogin_pqp: function (oEvent) {
			var oRouter_nav = sap.ui.core.UIComponent.getRouterFor(this);
			let projgrp = this.getView().getModel('pqp_model').getData().project_grp;
			oRouter_nav.navTo("pqp_project_detail", {
				projectid: projgrp
			});

		},

		classicGuilogin_pqp: function (oEvent) {
			this.showBusyIndicator(8000, 0);
			var prjGrpId = this.getView().getModel('pqp_model').getData().project_grp;
			//	var text = "[System]\n" + "Name=PQP" + "\n" + "Client=001" + "\n" + "[User]" + "\n" + "Name=" + "\n" + "Language=EN" + "\n" +
			//		"[Function]" + "\n" + "Command=*/baof/ec_cockpit S_PRJGRP-LOW=" + prjGrpId + ";DYNP_OKCODE=CRET";
			var text = "[System]\n" + "Name=PQP" + "\n" + "Client=001" + "\n" + "[User]" + "\n" + "Name=" + "\n" + "Language=EN" + "\n" +
				"[Function]" + "\n" + "Command=*/BAOF/EC_PROJECT PRJGRP=" + prjGrpId + "";
			var type = 'link.sap'
			var file = new Blob([text], {
				type: type
			});

			saveAs(file, "PQP.sap");
		},
		webGuilogin_pqp: function (oEvent) {
			var prjGrpId = this.getView().getModel('pqp_model').getData().project_grp;
			window.open("https://ldcipqp.wdf.sap.corp:44376/sap/bc/gui/sap/its/webgui?~TRANSACTION=*/baof/ec_project PRJGRP=" + prjGrpId +
				"");
		},
		_update_type_of_mails_configured: function () {
			sap.ui.getCore().getModel('hfc_reminder_header_model');
			let product_name = sap.ui.getCore().getModel('hfc_reminder_header_model').getData()['data'].ProductName;
			let sps_name = sap.ui.getCore().getModel('hfc_reminder_header_model').getData()['data'].SpsName;
			let Cutoffdatestart = sap.ui.getCore().getModel('hfc_reminder_header_model').getData()['data'].Cutoffdatestart;
			let Cutoffdateend = sap.ui.getCore().getModel('hfc_reminder_header_model').getData()['data'].Cutoffdateend;
			let Cutofftimestart = sap.ui.getCore().getModel('hfc_reminder_header_model').getData()['data'].Cutofftimestart;

			let Cutofftimeend = sap.ui.getCore().getModel('hfc_reminder_header_model').getData()['data'].Cutofftimeend;

			let product_name_filter = new sap.ui.model.Filter("ProductName", sap.ui.model.FilterOperator.EQ, product_name);
			let sps_name_filter = new sap.ui.model.Filter("SpsName", sap.ui.model.FilterOperator.EQ, sps_name);
			let cut_off_start_date_filter = new sap.ui.model.Filter("Cutoffdatestart", sap.ui.model.FilterOperator.EQ, Cutoffdatestart);
			let cut_off_end_date_filter = new sap.ui.model.Filter("Cutoffdateend", sap.ui.model.FilterOperator.EQ, Cutoffdateend);
			let cut_off_start_time_filter = new sap.ui.model.Filter("Cutofftimestart", sap.ui.model.FilterOperator.EQ, Cutofftimestart);
			let cut_off_end_time_filter = new sap.ui.model.Filter("Cutofftimeend", sap.ui.model.FilterOperator.EQ, Cutofftimeend);
			let arrayFilter = [product_name_filter, sps_name_filter, cut_off_start_date_filter, cut_off_end_date_filter];
			global_me_hfc_reminder.oModel_pqp.read('/get_scheduled_mailsSet', {
				filters: arrayFilter,
				success: function (oData) {
					for (let itration in global_me_hfc_reminder.mail_type) {
						let mail_data = oData.results.filter(m_type => m_type.MailsType === global_me_hfc_reminder.mail_type[itration]);
						global_me_hfc_reminder.getView().getModel(itration).setData(null);
						if (mail_data.length > 0) {
							let model = 'global_me_hfc_reminder.oModel_Mail_Type_' + itration;
							global_me_hfc_reminder.getView().getModel(itration).setData({
								data: mail_data,
								visible: true
							});
							//	global_me_hfc_reminder.getView().setModel(global_me_hfc_reminder.oModel_Mail_Type, itration);
							//	global_me_hfc_reminder._update_recipients(mail_data, itration);

						} else {

						}

					}
				},
				error: function (err) {
					MessageBox.error('Nothing is Configured for mails!!')
				},
				async: false
			})
		},
		_update_recipients: function (mail_data, itration) {
			let url_string = "get_scheduled_mailsSet(ProductName='" + mail_data[0].ProductName + "',MailsType='" + mail_data[0].MailsType +
				"')/Mails_recipients";
			global_me_hfc_reminder.oModel_pqp.read(url_string, {
				success: function (oData) {
					let mail_recipients_to = oData.results.filter(m_type => m_type.RecipientType === '01');
					let mail_recipients_cc = oData.results.filter(m_type => m_type.RecipientType === '02');
					let oModel_to = 'global_me_hfc_reminder.oModel_recipient_Type_to_' + itration + 'recipients_to';
					let oModel_cc = 'global_me_hfc_reminder.oModel_recipient_Type_cc_' + itration + 'recipients_cc';
					if (mail_recipients_to.length > 0) {
						oModel_to = new sap.ui.model.json.JSONModel({
							recipient: mail_recipients_to
						});
						global_me_hfc_reminder.getView().setModel(oModel_to, itration + 'recipients_to');
					}
					if (mail_recipients_cc.length > 0) {
						oModel_cc = new sap.ui.model.json.JSONModel({
							recipient: mail_recipients_cc
						});
						global_me_hfc_reminder.getView().setModel(oModel_cc, itration + 'recipients_cc');
					}

				},
				error: function (err) {
					MessageBox.error('Nothing is Configured in recipients list!!')

				},
				async: true
			});
		},
		open_hfc_mail_content: function (oEvent, bValue) {
			let id = this.getView().getModel(bValue).getProperty(oEvent.getSource().getBindingContext(bValue).getPath()).Uuid;
			let parent_id_filter = new sap.ui.model.Filter("ParentUuid", sap.ui.model.FilterOperator.EQ, id);
			let arrayFilter = [parent_id_filter];
			//get mail content
			let content;
			let found;
			let dl_in_to = {
				value: [],
			};
			let dl_in_cc = {
				value: []
			};
			let url_string = "/hfc_mail_contentSet(ParentUuid='" + id + "')";
			global_me_hfc_reminder.oModel_pqp.read(url_string, {
				success: function (oData) {
					if ( oData.ParentUuid !== 'NA') {
						content = oData.Content;
						found = oData.ParentUuid;
					}else{
						found = oData.ParentUuid;
					}
					console.log(oData);
				},
				error: function (err) {
					MessageBox.error('No Data found!!')

				},
				async: false
			});
			//get recipient list
			global_me_hfc_reminder.oModel_pqp.read("/hfc_mail_recipientSet", {
				filters: arrayFilter,
				success: function (oData) {
					if (oData.results.length !== 0) {
						for (let itrations in oData.results) {
							if (oData.results[itrations].Cp1RecipientType === '01') {
								dl_in_to.value.push({
									text: oData.results[itrations].DlText,
									key: oData.results[itrations].DlAddress
								});

							} else if (oData.results[itrations].Cp1RecipientType === '02') {
								dl_in_cc.value.push({
									text: oData.results[itrations].DlText,
									key: oData.results[itrations].DlAddress
								});

							}
						}

					}
					console.log(oData);
				},
				error: function (err) {
					MessageBox.error('No Recipient Found!!');

				},
				async: false
			});
			if (found !== 'NA' ) {
				let dl_to = dl_in_to.value;
				let dl_cc = dl_in_cc.value;
				var HFC_Mail_Model = new sap.ui.model.json.JSONModel({
					dl_to,
					dl_cc,
					content:content
				});
				if (!this.hfc_mail_content) {
					if (!this._hfc_content_dilaog) {
						this._hfc_content_dilaog = sap.ui.xmlfragment("epdash.epdash.external_view.reminder_content", this);
					}
					this._hfc_content_dilaog.setModel(HFC_Mail_Model, 'hfc_content');
					this._hfc_content_dilaog.open();
				}
			} else {
                 MessageBox.information('No Mail Content Found!!'); 
			}
		},
		close_dialog:function(){
			this._hfc_content_dilaog.close();
		}

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf fun.v1
		 */
		//  onExit: function() {
		//
		//  }
	});
});