var handover_globalme;
sap.ui.define([
	'jquery.sap.global',
	'sap/m/MessageBox',
	'sap/m/MessageToast',
	//	'sap.m.DatePicker',
	"epdash/epdash/model/formatter",
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel'
], function (jQuery, MessageBox, MessageToast, formatter, Controller, JSONModel) {
	"use strict";

	var TableController = Controller.extend("epdash.epdash.controller.handover", {
		formatter: formatter,
		onInit: function () {
			handover_globalme = this;
			handover_globalme.oModel_PQP = new sap.ui.model.odata.ODataModel("/sap/opu/odata/BRLT/PQP_PROJECT_DETAIL_SRV/");
			handover_globalme.oModel_PR = new sap.ui.model.odata.ODataModel("/sap/opu/odata/BRLT/PRODUCT_CATOGRY_DETAIL_SRV/");
			this.getView().setModel(handover_globalme.oModel_PQP);
			//Dl model set
			var Dl_Model = new JSONModel("./model/dl_information.json", false);
			this.getView().setModel(Dl_Model, 'Dl_Model');
			//
			handover_globalme.oGlobalBusyDialog = new sap.m.BusyDialog();
			//get product name
			this._getProductName();
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("handover").attachPatternMatched(this._onRouteMatchedmain_handover, this);
			var oIcon_Tab_Model = new sap.ui.model.json.JSONModel({
				key: "view",
				search: "off"
			});
			this.getView().setModel(oIcon_Tab_Model, "selectItem");
			var oButtons_Model = new sap.ui.model.json.JSONModel({
				table_edit: "false",
				row_edit: false,
				mode: "None"
			});
			this.getView().setModel(oButtons_Model, "button_setting");
			if (sap.ui.getCore().getModel("GModel") !== undefined) {
				handover_globalme.username = (sap.ui.getCore().getModel("GModel").getData().username).charAt(0).toUpperCase() + (sap.ui.getCore().getModel(
					"GModel").getData().username).slice(1).toLowerCase();
			} else {
				this._getuser_detail(handover_globalme.oModel_PR);
			}
			this.oSF = this.getView().byId("searchField");
			this._bindSearchHelp();

		},
		_getuser_detail: function (Pr_oModel) {
			Pr_oModel.read("/usernameSet", null, null, true,
				function (oData) {
					handover_globalme.username = oData.results[0].Vorna;
				},
				function (error) {});
		},
		_onRouteMatchedmain_handover: function () {
			this._getLastHandOver();
		},
		_getProductName: function () {
			handover_globalme.oModel_PR.read("/ProductSet", {
				success: function (oData) {
					var product_short_Model = new sap.ui.model.json.JSONModel(oData.results);
					product_short_Model.oData = product_short_Model.oData.concat({
						"ProductShortText": "NGAP",
						"ProductName": "Next gen Application Platform"
					});

					handover_globalme.getView().setModel(product_short_Model, "product_short_name");
				},
				error: function () {

				},
				async: true
			});
		},
		handleIconTabBarSelect: function (oEvent) {
			this.IconTabevt = oEvent;
			var sData = this.getView().getModel("selectItem").getData();
			if (oEvent.getSource().getSelectedKey() === 'View') {
				sData.key = "view";
				sData.search = "off";
				this.getView().getModel("selectItem").refresh(true);
				this._getLastHandOver();
			} else if (oEvent.getSource().getSelectedKey() === 'Draft') {
				sData.key = "draft";
				sData.search = "off";
				this.getView().getModel("selectItem").refresh(true);
				this._fillDraftContent();
			} else if (
				oEvent.getSource().getSelectedKey() === 'Search') {
				sData.key = "";
				sData.search = "on";
				this.getView().getModel("selectItem").refresh(true);
			}
		},
		_getLastHandOver: function (hoid, ho_date, ho_location) {
			handover_globalme.oGlobalBusyDialog.open();
			if (hoid === '' || hoid === undefined) {
				hoid = '';
			}
			if (ho_date === '' || ho_date === undefined) {
				ho_date = '';
			} else {
				ho_date = ho_date.getFullYear() + (('0' + (ho_date.getMonth() + 1)).slice(-2)) + ('0' + ho_date.getDate()).slice(-2);
			}
			if (ho_location === '' || ho_location === undefined) {
				ho_location = '';
			}
			handover_globalme.oModel_PQP.read("/ho_contentSet(HoId='" + hoid + "',SyTimeStamp='" + ho_date + "',HoFrom='" + ho_location + "')", {
				success: function (oData) {
					if (oData.HoId !== '') {
						handover_globalme.LastHo_Model = new sap.ui.model.json.JSONModel(oData);
						handover_globalme.getView().setModel(handover_globalme.LastHo_Model, 'last_HO');
						handover_globalme.L_HOID = oData.HoId;
					}
				},
				error: function () {
					sap.m.MessageToast.show('Error while reading last handover!!');
				},
				async: false
			});
			//fill TO_DO Table
			var aFilterArray = [];
			var filterYear = new sap.ui.model.Filter("HoId", sap.ui.model.FilterOperator.EQ, handover_globalme.L_HOID);
			aFilterArray.push(filterYear);
			handover_globalme.oModel_PQP.read("/ho_to_do_contentSet", {
				filters: aFilterArray,
				success: function (oData) {

					handover_globalme.LastHo_Todo_Model = new sap.ui.model.json.JSONModel(oData.results);
					handover_globalme.getView().setModel(handover_globalme.LastHo_Todo_Model, 'last_HO_TODO');

				},
				error: function () {
					sap.m.MessageToast.show('Error while reading last handover TODO Content!!');
				},
				async: false
			});
			// fill EP_VP Table
			handover_globalme.oModel_PQP.read("/ho_ep_vp_contentSet", {
				filters: aFilterArray,
				success: function (oData) {

					handover_globalme.LastHo_EpVp_Model = new sap.ui.model.json.JSONModel(oData.results);
					handover_globalme.getView().setModel(handover_globalme.LastHo_EpVp_Model, 'last_HO_EPVP');

				},
				error: function () {
					sap.m.MessageToast.show('Error while reading last handover EPVP Content!!');
				},
				async: false
			});
			handover_globalme.oGlobalBusyDialog.close();
		},
		_fillDraftContent: function () {
			var today = new Date();
			var DateTime = ("00" + today.getDate()).slice(-2) + ("00" + (today.getMonth() + 1)).slice(-2) + today.getFullYear() + ("00" + today
					.getHours())
				.slice(-2) + ("00" + today.getMinutes()).slice(-2) + ("00" + today.getSeconds()).slice(-2);
			var Date_F = ("00" + today.getDate()).slice(-2) + '.' + ("00" + (today.getMonth() + 1)).slice(-2) + '.' + today.getFullYear();
			var Time_F = ("00" + today.getHours()).slice(-2) + ':' + ("00" + today.getMinutes()).slice(-2) + ':' + ("00" + today.getSeconds()).slice(-
				2);
			this.hand_over_ID;
			this.hand_over_from;
			this.hand_over_to;

			handover_globalme.oGlobalBusyDialog.open();
			var that = this;
			handover_globalme.oModel_PQP.read("/get_ho_user_detSet", {

				success: function (oData) {
					if (oData.results.length !== 0) {
						if (oData.results[0].user_autorz === 'B' || oData.results[0].user_autorz === 'R' ||
							oData.results[0].user_autorz === 'V') {

							switch (oData.results[0].user_autorz) {
							case 'B':
								that.hand_over_ID = 'BLR' + DateTime
								that.hand_over_from = 'BLR';
								that.hand_over_to = 'ROT';
								break;
							case 'R':
								that.hand_over_ID = 'ROT' + DateTime;
								that.hand_over_from = 'ROT';
								that.hand_over_to = 'VAN';
								break;
							case 'V':
								that.hand_over_ID = 'VAN' + DateTime;
								that.hand_over_from = 'VAN';
								that.hand_over_to = 'BLR';
								break;
							}
							let Header_Object = that._getMailvalidation(oData.results[0].hand_over_content + ' ' + Date_F, Date_F, Time_F);
							that._fillDraftTables(Header_Object);

						} else if (oData.results[0].user_autorz === 'U') {
							var bCompact = !!that.getView().$().closest(".sapUiSizeCompact").length;
							MessageBox.error(
								"You are not authorized to Create Handover .\n Only Memebers of \nDL ARES CLOUD HOTFIX GOVERNANCE - BANGALORE \nDL ARES CLOUD HOTFIX GOVERNANCE - ROT \nDL ARES CLOUD HOTFIX GOVERNANCE - VANCOUVER \ncan create!!", {
									styleClass: bCompact ? "sapUiSizeCompact" : ""
								}
							);
							var sData = that.getView().getModel("selectItem").getData();
							sData.key = "view";
							that.getView().getModel("selectItem").refresh(true);
							that.getView().byId("idIconTabBar").setSelectedKey('View');

						}
					}
					handover_globalme.oGlobalBusyDialog.close();
				},
				error: function (err) {
					handover_globalme.oGlobalBusyDialog.close();
					var bCompact = !!that.getView().$().closest(".sapUiSizeCompact").length;
					if (err.message === "HTTP request failed") {

						MessageBox.error(
							"There is problem in DL Web Service \nPlease try later!!!.", {
								styleClass: bCompact ? "sapUiSizeCompact" : ""
							}
						);
					} else {
						MessageBox.error(
							"Error during reading DB .", {
								styleClass: bCompact ? "sapUiSizeCompact" : ""
							}
						);
					}

				},
				async: false
			});
		},
		_getMailvalidation: function (value, Date_F, Time_F) {
			var aFilterArray = [];
			var filterYear = new sap.ui.model.Filter("HoSubject", sap.ui.model.FilterOperator.EQ, value);
			aFilterArray.push(filterYear);
			let object = {};
			handover_globalme.oModel_PQP.read("/get_ho_user_detSet", {
				filters: aFilterArray,
				success: function (oData) {
					if (oData.results.length !== 0) {

						object = {
							HoSubject: value,
							HoDate: Date_F,
							HoTime: Time_F,
							last_saved: oData.results[0].last_saved,
							UserComment: oData.results[0].UserComment
						}

					}
				},
				error: function (err) {

				},
				async: false

			});
			return object;
		},
		_fillDraftTables: function (Header_Object) {
			handover_globalme.oModel_PQP.read("/draft_contentSet", {
				success: function (oData) {
					if (oData.results.length !== 0) {
						if (oData.results[0].HoId !== '') {
							Header_Object.HoTopMsg = oData.results[0].HoTopMsg;
							Header_Object.TopMsgRow = oData.results[0].TopMsgRow;
							Header_Object.HoBottomMsg = oData.results[0].HoBottomMsg;
							Header_Object.BottomMsgRow = oData.results[0].BottomMsgRow;
							Header_Object.Sender = oData.results[0].Sender;
							Header_Object.HoId = oData.results[0].HoId;
						} else {
							Header_Object.HoId = handover_globalme.hand_over_ID;
							Header_Object.HoTopMsg = "Hello team,these are the tasks and priorities for today:";
							Header_Object.HoBottomMsg = "Thanks & Regards,\n" + handover_globalme.username;
						}
						handover_globalme.Draft_Header_Model = new sap.ui.model.json.JSONModel(Header_Object);
						handover_globalme.getView().setModel(handover_globalme.Draft_Header_Model, 'Draft_Header_Model');
					}
				},
				async: false
			});
			if (Header_Object.HoId !== '') {
				var aFilterArray = [];
				var filterYear = new sap.ui.model.Filter("HoId", sap.ui.model.FilterOperator.EQ, Header_Object.HoId);
				aFilterArray.push(filterYear);
				handover_globalme.oModel_PQP.read("/draft_todoSet", {
					filters: aFilterArray,
					success: function (oData) {
						var todo = [];
						handover_globalme.Draft_TODO_Model = new sap.ui.model.json.JSONModel(todo);
						handover_globalme.getView().setModel(handover_globalme.Draft_TODO_Model, 'Draft_TODO_Model');
						if (oData.results.length !== 0) {
							todo.push(oData.results);
							handover_globalme.Draft_TODO_Model.setData(todo);

							sap.m.MessageToast.show('Draft generated from last saved version.')
						} else {
							handover_globalme._generate_draft_from_assembly_list();
							sap.m.MessageToast.show('Draft generated from assembly in queue.')
						}

					},
					async: false
				});
				handover_globalme.oModel_PQP.read("/draft_epvpSet", {
					filters: aFilterArray,
					success: function (oData) {
						var epvp = [];
						handover_globalme.Draft_EPVP_Model = new sap.ui.model.json.JSONModel(epvp);
						handover_globalme.getView().setModel(handover_globalme.Draft_EPVP_Model, 'Draft_EPVP_Model');
						if (oData.results.length !== 0) {
							epvp.push(oData.results);
							handover_globalme.Draft_EPVP_Model.setData(epvp);
						} else {
							let arr = [{
								"ProductId": "",
								"EpVpProcess": "EpVpProcess",
								"HeadsUp": "HeadsUp"
							}];
							epvp.push(arr);
							handover_globalme.Draft_EPVP_Model.setData({
								0: arr
							});
						}

					},
					async: false
				});
			}
		},
		_generate_draft_from_assembly_list: function () {
			handover_globalme.oModel_PQP.read("/filldraft_dataSet", {
				success: function (oData) {

					let Draft_TODO_Content = [];
					if (handover_globalme.getView().getModel('Draft_TODO_Model').getData()[0] !== undefined) {
						Draft_TODO_Content = handover_globalme.getView().getModel('Draft_TODO_Model').getData()[0];
					}
					Array.prototype.isExists = function (element) {
						for (var i = 0; i < this.length; i++) {
							if (element.prodId === this[i].ProductId && element.collectionName === this[i].CollectionName) {
								return true;
							}

						}
						return false;
					};
					var Final_TODO_Content = Draft_TODO_Content;
					var oList = oData.results;
					for (var i = 0; i < oList.length; i++) {
						let prodId = oList[i].ProductId;
						let collectionName = oList[i].CollectionName;
						if (!Final_TODO_Content.isExists({
								"prodId": prodId,
								"collectionName": collectionName
							})) {
							Final_TODO_Content.push(oList[i]);
						}
					};

					handover_globalme.getView().getModel('Draft_TODO_Model').setData({
						'0': Final_TODO_Content
					});
					handover_globalme.getView().getModel('Draft_TODO_Model').refresh(true);
				},
				error: function (err) {

				},
				async: false
			});
		},
		_generate_draft_from_last_ho: function () {

		},
		on_Save_draft: function (open_mail_dialog) {
			if (handover_globalme.getView().getModel('Draft_Header_Model').getData().HoSubject === '' || handover_globalme.getView().getModel(
					'Draft_Header_Model').getData().HoSubject === undefined) {
				MessageBox.error("Error!!\nPlease maintain Subject.");
				handover_globalme.oGlobalBusyDialog.close();
			} else {
				handover_globalme.oGlobalBusyDialog.open();
				this.on_cancel_draft('true');
				this._openCommentDialog(open_mail_dialog);
				///
			}
		},
		_openCommentDialog: function (open_mail_dialog) {
			var dialog = new sap.m.Dialog({
				title: 'Message to next Editor',
				type: 'Message',
				content: [
					new sap.m.Label({
						text: 'Kindly add some comment for next draft editor.',
						labelFor: 'submitDialogTextarea'
					}),
					new sap.m.TextArea('submitDialogTextarea', {
						width: '100%',
						placeholder: 'Optional'
					})
				],
				beginButton: new sap.m.Button({
					text: 'Save',
					press: function () {
						handover_globalme.oGlobalBusyDialog.close();
						var sText = sap.ui.getCore().byId('submitDialogTextarea').getValue();
						handover_globalme._save_Draft_From_Comment_Dialog(sText);
						dialog.close();
						if (open_mail_dialog === 'open_mail_dialog') {
							handover_globalme._ohandover.open();
							// var array = handover_globalme.getView().getModel('Draft_Header_Model').getData();
							// var newArray = Object.assign(array);
							// var oCV_Header_Model = new sap.ui.model.json.JSONModel(newArray);
							var TODO_CV_Model = new sap.ui.model.json.JSONModel({
								"0": jQuery.extend([], handover_globalme.getView().getModel(
									'Draft_TODO_Model').getData()[0])
							});
							var EPVP_CV_Model = new sap.ui.model.json.JSONModel({
								"0": jQuery.extend([], handover_globalme.getView().getModel(
									'Draft_EPVP_Model').getData()[0])
							});
							handover_globalme._ohandover.setModel(handover_globalme.getView().getModel('Draft_Header_Model'), 'Draft_Header_Model_CV');
							handover_globalme._ohandover.setModel(TODO_CV_Model, 'Draft_TODO_Model_CV');
							handover_globalme._ohandover.setModel(EPVP_CV_Model, 'Draft_EPVP_Model_CV');
							handover_globalme._ohandover.setModel(handover_globalme.getView().getModel('Dl_Model'), 'Dl_Model');
							handover_globalme.oGlobalBusyDialog.close();
						}
					}
				}),
				endButton: new sap.m.Button({
					text: 'Cancel',
					press: function () {
						handover_globalme.oGlobalBusyDialog.close();
						dialog.close();
					}
				}),
				afterClose: function () {
					handover_globalme.oGlobalBusyDialog.close();
					dialog.destroy();
				}
			});

			dialog.open();
		},
		_save_Draft_From_Comment_Dialog: function (comments) {
			handover_globalme.oGlobalBusyDialog.open();
			handover_globalme.oModel_PQP.remove("/draft_contentSet(HoId='')", {
				success: function () {

				},
				error: function () {

				},
				async: false
			});
			var handover_Content = [];
			var handover_todo_Content = [];
			var handover_ep_vp_Content = [];
			let oModel = handover_globalme.oModel_PQP;
			let HOID = handover_globalme.hand_over_ID;
			var Json_content = {
				"HoId": HOID,
				"HoSubject": handover_globalme.getView().getModel('Draft_Header_Model').getData().HoSubject,
				"HoDate": handover_globalme.getView().getModel('Draft_Header_Model').getData().HoDate,
				"HoTime": handover_globalme.getView().getModel('Draft_Header_Model').getData().HoTime,
				"HoFrom": this.hand_over_from,
				"HoTo": this.hand_over_to,
				"HoTopMsg": handover_globalme.getView().getModel('Draft_Header_Model').getData().HoTopMsg,
				"HoBottomMsg": handover_globalme.getView().getModel('Draft_Header_Model').getData().HoBottomMsg,
				"TopMsgRow": this.getView().byId("content_msg_draft").getRows(),
				"BottomMsgRow": this.getView().byId("bottom_msg_draft").getRows(),
				"UserComment": comments
			};
			handover_Content.push(oModel.createBatchOperation("/draft_contentSet", "POST", Json_content, false));
			let Json_draft_header = new sap.ui.model.json.JSONModel(Json_content);
			handover_globalme.getView().setModel(Json_draft_header, "Draft_Header_Model");
			let Json_todo = handover_globalme.getView().getModel('Draft_TODO_Model').getData()[0];

			var array_todo = [];
			var oTab_to_do = this.getView().byId("to_do_draft_tab");
			for (let i in Json_todo) {
				var TODO_JSON = {
					"HoId": HOID,
					"RowNumber": i,
					"ColNumber": oTab_to_do.getItems()[0].mAggregations.cells.length + parseInt(i) + 1,
					"RowHeight": '100',
					"ProductId": Json_todo[i].ProductId,
					"CollectionName": Json_todo[i].CollectionName,
					"AssemStatus": Json_todo[i].AssemStatus,
					"CommentByUserAssem": Json_todo[i].CommentByUserAssem,
					"DeplStatus": Json_todo[i].DeplStatus,
					"CommentByUserDepl": Json_todo[i].CommentByUserDepl,
					"ToDo": Json_todo[i].ToDo
				}
				handover_todo_Content.push(oModel.createBatchOperation("/draft_todoSet", "POST", TODO_JSON, false));
			}
			//	

			let Json_epvp = handover_globalme.getView().getModel('Draft_EPVP_Model').getData()[0];
			var oTab_ep_vp = this.getView().byId("ep_vp_draft_tab");
			var array_epvp = [];
			for (let i in Json_epvp) {

				var EPVP_JSON = {
					"HoId": HOID,
					"RowNumber": i,
					"ColNumber": oTab_ep_vp.getItems()[0].mAggregations.cells.length + parseInt(i) + 1,
					"RowHeight": '100',
					"ProductId": Json_epvp[i].ProductId,
					"EpVpProcess": Json_epvp[i].EpVpProcess,
					"HeadsUp": Json_epvp[i].HeadsUp
				}
				handover_ep_vp_Content.push(oModel.createBatchOperation("/draft_epvpSet", "POST", EPVP_JSON, false));

			}

			if (handover_Content.length !== 0) {

				oModel.addBatchChangeOperations(handover_Content);
				oModel.submitBatch(function (data) {
						sap.m.MessageToast.show(
							"Draft Content Saved Successfully!!"
						);
					}, function (err) {
						sap.m.MessageToast.show(
							"Error while saving Draft Content!!"
						);
					},
					false);
			}
			if (handover_todo_Content.length !== 0) {
				oModel.addBatchChangeOperations(handover_todo_Content);
				oModel.submitBatch(function (data) {
						sap.m.MessageToast.show(
							"Draft TODO Content Saved Successfully!!"
						);
					}, function (err) {
						sap.m.MessageToast.show(
							"Error while saving EPVP Content!!"
						);
					},
					false);
			}
			if (handover_ep_vp_Content.length !== 0) {
				oModel.addBatchChangeOperations(handover_ep_vp_Content);
				oModel.submitBatch(function (data) {
						sap.m.MessageToast.show(
							"Draft EPVP Content Saved Successfully!!"
						);
					}, function (err) {
						MessageBox.error(
							"Error while saving EPVP Content!!"
						);
					},
					false);
			}
			handover_globalme.save = 'Save Done';
			handover_globalme.oGlobalBusyDialog.close();
		},
		onClose: function () {
			this._ohandover.close();
		},
		onPressback: function () {
			var sData = this.getView().getModel("selectItem").getData();
			sData.key = "view";
			this.getView().getModel("selectItem").refresh(true);
			this.getView().byId("idIconTabBar").setSelectedKey('View');
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("main");
		},
		on_edit_draft: function (oEvent) {
			//checking locking of draft//
			let lock_status = this._getDraftLockStatus();

			if (lock_status !== 'unlock') {
				sap.m.MessageBox.alert(
					lock_status + '\nPlease wait for some time!!'
				);
			} else {
				//updated latest draft from saved one
				this._fillDraftContent();
				//Lock Draft //
				this._lockDraftForCurrentUser();
				//enbale all edit button for table//
				let array = {
					table_edit: "true",
					mode: "MultiSelect",
					row_edit: true,
				}
				this.getView().getModel("button_setting").setData(array);
				this.getView().getModel("button_setting").refresh(true);

				let bottom_msg;
				if (handover_globalme.getView().getModel('Draft_Header_Model').getData().HoBottomMsg.search('Thanks & Regards,\n') !== -1) {
					handover_globalme.getView().getModel('Draft_Header_Model').getData().HoBottomMsg = handover_globalme.getView().getModel(
						'Draft_Header_Model').getData().HoBottomMsg.replace(handover_globalme.getView().getModel('Draft_Header_Model').getData().HoBottomMsg
						.split(
							"Thanks & Regards,\n").pop(), handover_globalme.username);
					handover_globalme.getView().getModel('Draft_Header_Model').refresh(true);
				}

			}
		},
		on_cancel_draft: function (parameter) {
			if (parameter !== "false") {
				this._unlockDraftForCurrentUser();
			}
			let array = {
				table_edit: "false",
				mode: "None",
				row_edit: false,
			}
			this.getView().getModel("button_setting").setData(array);
			this.getView().getModel("button_setting").refresh(true);

		},
		_getDraftLockStatus: function () {
			let lock_status;
			handover_globalme.oModel_PQP.read("/draft_lockSet('')", {
				success: function (oData) {
					if (oData.LockStatus === 'X') {
						lock_status = 'Draft is currently locked by ' + oData.UserName;

					} else {
						lock_status = 'unlock';
					}
				},
				error: function () {
					lock_status = 'Error while reading locked status';
				},
				async: false
			});
			return lock_status;
		},
		_lockDraftForCurrentUser: function () {
			let oData = {
				"UserName": ''
			}
			handover_globalme.oModel_PQP.create("/draft_lockSet", oData, {
				success: function (oData) {
					handover_globalme.useName = oData.UserName;
					handover_globalme.SyTimeStamp = oData.SyTimeStamp;
					sap.m.MessageBox.success(
						"Draft has been successfully locked by your user.\nKindly unlock it after use."
					);
				},
				error: function () {
					sap.m.MessageBox.error(
						"Error while locking draft."
					);
				},
				async: false
			});

		},
		_unlockDraftForCurrentUser: function () {
			let oData = {
				"UserName": handover_globalme.useName,
				"SyTimeStamp": handover_globalme.SyTimeStamp
			}
			handover_globalme.oModel_PQP.update("/draft_lockSet(UserName='" + handover_globalme.useName + "')", oData, {
				success: function (oData) {
					sap.m.MessageToast.show(
						"Draft has been unlocked successfully."
					);
				},
				error: function () {
					sap.m.MessageBox.error(
						"Error while unlocking draft."
					);
				},
				async: false
			});
		},

		on_Send_handover_mail: function () {
			handover_globalme.oGlobalBusyDialog.open();
			if (!this._ohandover) {
				this._ohandover = sap.ui.xmlfragment("epdash.epdash.view.handover_mail_setting", this);
			}
			//save draft first//
			this._ohandover.setModel(this.getView().getModel("product_short_name"), 'product_short_name');
			//	this._ohandover.setModel(this.getView().getModel());
			var jModel = new sap.ui.model.json.JSONModel({
				key: "multiple"
			});
			//	this.getView().setModel(jModel, "inputmodel");
			this._ohandover.setModel(jModel, "inputmodel");
			this._ohandover.setModel(this.getView().getModel());
			sap.ui.getCore().byId('dl_change').setState(true);
			//	sap.ui.getCore().byId("dl_change").setState(true);
			this.on_Save_draft('open_mail_dialog');
		},
		send_to_specific_dl: function (oEvent) {
			var switchModel = this._ohandover.getModel("inputmodel").getData();
			handover_globalme.Todo_Draft_Array = jQuery.extend([], handover_globalme.getView().getModel('Draft_TODO_Model').getProperty('/0'));
			handover_globalme.Epvp_Draft_Array = jQuery.extend([], handover_globalme.getView().getModel('Draft_EPVP_Model').getProperty('/0'));
			let ProductList = [];
			if (oEvent.getSource().getState() === false) {
				switchModel.key = 'single';
			} else {
				switchModel.key = 'multiple';
				this._getColoumForTable(ProductList, handover_globalme.Todo_Draft_Array, handover_globalme.Epvp_Draft_Array);
			}
			this._ohandover.getModel("inputmodel").refresh(true);
		},
		onChangeProductSelection: function (oEvent) {
			let ProductList = [];
			for (let i in oEvent.getSource().getSelectedItems()) {
				ProductList.push(oEvent.getSource().getSelectedItems()[i].getKey());
			}

			this._getColoumForTable(ProductList, handover_globalme.Todo_Draft_Array, handover_globalme.Epvp_Draft_Array);
		},
		_getColoumForTable: function (ProductList, Todo_Draft_Array, Epvp_Draft_Array) {

			if (ProductList.length !== 0) {
				let Final_TODO_Content = [
					[]
				];
				let Final_EPVP_Content = [
					[]
				];
				for (let j in ProductList) {
					if (ProductList[j] !== '') {
						let a1 = Todo_Draft_Array.filter(c => c.ProductId ===
							ProductList[j]);
						let a2 = Epvp_Draft_Array.filter(c => c.ProductId ===
							ProductList[j]);;
						for (let itr1 in a1) {
							Final_TODO_Content[0].push(a1[itr1]);
						}
						for (let itr2 in a2) {
							Final_EPVP_Content[0].push(a2[itr2]);
						}
					}

				}
				this._ohandover.getModel('Draft_TODO_Model_CV').setData(
					Final_TODO_Content
				);
				this._ohandover.getModel('Draft_TODO_Model_CV').refresh(true);
				this._ohandover.getModel('Draft_EPVP_Model_CV').setData(Final_EPVP_Content);
				this._ohandover.getModel('Draft_EPVP_Model_CV').refresh(true);
			} else {
				this._ohandover.getModel('Draft_TODO_Model_CV').setData({
					"0": Todo_Draft_Array
				});
				this._ohandover.getModel('Draft_TODO_Model_CV').refresh(true);
				this._ohandover.getModel('Draft_EPVP_Model_CV').setData({
					"0": Epvp_Draft_Array
				});
				this._ohandover.getModel('Draft_EPVP_Model_CV').refresh(true);
			}
			if (ProductList.length !== 0) {
				sap.ui.getCore().byId("to_dl").removeAllSelectedItems();
				sap.ui.getCore().byId("to_dl").removeSelectedKeys();

				sap.ui.getCore().byId("cc_dl").removeAllSelectedItems();
				sap.ui.getCore().byId("cc_dl").removeSelectedKeys();
				let array_in_TO_ADD_items = [];
				let array_in_CC_ADD_items = [];
				let array_in_TO_ADD = [];
				let array_in_CC_ADD = [];
				for (let counter in ProductList) {
					//	let array_in_TO_NAME = this.getView().getModel('Dl_Model').getData()['products'].filter(c => c.key === ProductList[counter])[0].TO_NAME;
					//	let array_in_CC_NAME = this.getView().getModel('Dl_Model').getData()['products'].filter(c => c.key === ProductList[counter])[0].CC_NAME;
					let dl_for_products = this.getView().getModel('Dl_Model').getData()['products'].filter(c => c.key === ProductList[counter])[0];
					if (dl_for_products !== undefined) {
						array_in_TO_ADD = dl_for_products.TO_ADDRESS;
					}
					if (dl_for_products !== undefined) {
						array_in_CC_ADD = dl_for_products.CC_ADDRESS;
					}

					if (array_in_TO_ADD[0] !== '' || array_in_TO_ADD[0] !== undefined) {
						array_in_TO_ADD_items.push(array_in_TO_ADD[0]);
					}
					if (array_in_CC_ADD[0] !== '' || array_in_CC_ADD[0] !== undefined) {
						array_in_CC_ADD_items.push(array_in_CC_ADD[0]);
					}

				}
				//	sap.ui.getCore().byId("to_dl").setSelectedItems(array_in_TO_NAME);
				sap.ui.getCore().byId("to_dl").setSelectedKeys(array_in_TO_ADD_items);

				//	sap.ui.getCore().byId("cc_dl").setSelectedItems(array_in_CC_NAME);
				sap.ui.getCore().byId("cc_dl").setSelectedKeys(array_in_CC_ADD_items);

			} else {
				// let dl_to = ["DL_5A87DB787BCF84462C000003 @exchange.sap.corp",
				// 	"DL_5ADFE02F5F99B71213000003 @exchange.sap.corp",
				// 	"DL_580DF3485F99B741C5000030 @exchange.sap.corp"
				// ];
				// let dl_cc = ["DL_589ACBC05F99B79FE9000026 @exchange.sap.corp",
				// 	"DL_59410F115F99B7DD5B0005C1 @exchange.sap.corp",
				// 	"DL_580626965F99B722B6000148 @exchange.sap.corp",
				// 	"DL_5B17FB8C7BCF84EEED000040 @global.corp.sap"
				// ];
				// let dl_to_name = ["DL ARES CLOUD HOTFIX GOVERNANCE",
				// 	"DL ARES CLOUD BYD_C4C",
				// 	"DL ARES CLOUD A4C_BW4"
				// ];
				// let dl_cc_name = ["DL S4HANA_HotfixGovernance_Operations",
				// 	"DL IBP_HotfixGovernance_Operations",
				// 	"DL BYDC4C_HotfixGovernance_Operations",
				// 	"DL ABAPSCP_HotfixGovernance_Operations"
				// ];
				//	sap.ui.getCore().byId("to_dl").setSelectedItems(dl_to_name);
				//	sap.ui.getCore().byId("cc_dl").setSelectedItems(dl_cc);
				let dl_to = [];
				let dl_cc = [];
				let dl_model = this.getView().getModel('Dl_Model').getData()['products'];
				for (let itration in dl_model) {
					dl_to.push(dl_model[parseInt(itration)].TO_ADDRESS[0]);
				}
				for (let itration in dl_model) {
					dl_cc.push(dl_model[parseInt(itration)].CC_ADDRESS[0]);
				}
				sap.ui.getCore().byId("to_dl").setSelectedKeys(dl_to);
				sap.ui.getCore().byId("cc_dl").setSelectedKeys(dl_cc);
			}
		},
		onSendMail: function () {
			var to_dl = [];
			to_dl = sap.ui.getCore().byId("to_dl").getSelectedKeys();
			// sap.ui.getCore().byId("to_dl").getSelectedItems();
			// sap.ui.getCore().byId("cc_dl").getSelectedItems();
			var cc_dl = [];
			cc_dl = sap.ui.getCore().byId("cc_dl").getSelectedKeys();
			var prod_list = [];
			if (sap.ui.getCore().byId("specific_prod").getVisible() === true) {
				prod_list = sap.ui.getCore().byId("specific_prod").getSelectedKeys().toString();
			}
			if (sap.ui.getCore().byId("specific_prod").getVisible() === true && sap.ui.getCore().byId("specific_prod").getSelectedKeys().length ===
				0) {
				MessageBox.error(
					"Kindly Select Some Products."
				);
			} else {
				handover_globalme.oGlobalBusyDialog.open();
				this._Save_Handover();

				handover_globalme._triggerMail(to_dl, cc_dl, prod_list);

				this._ohandover.close();
				handover_globalme.oGlobalBusyDialog.close();
			}
		},
		_Save_Handover: function (oEvent, prod_list) {
			var today = new Date();
			var DateTime = ("00" + today.getDate()).slice(-2) + ("00" + (today.getMonth() + 1)).slice(-2) + today.getFullYear() + ("00" + today
					.getHours())
				.slice(-2) + ("00" + today.getMinutes()).slice(-2) + ("00" + today.getSeconds()).slice(-2);
			var handover_Content = [];
			var handover_todo_Content = [];
			var handover_ep_vp_Content = [];
			let oModel = handover_globalme.oModel_PQP;
			handover_globalme.HOID = handover_globalme.hand_over_ID.slice(0, 3) + DateTime;
			var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
			var Json_content = {
				"HoId": handover_globalme.HOID,
				"HoSubject": handover_globalme.getView().getModel('Draft_Header_Model').getData().HoSubject,
				"HoDate": handover_globalme.getView().getModel('Draft_Header_Model').getData().HoDate,
				"HoTime": handover_globalme.getView().getModel('Draft_Header_Model').getData().HoTime,
				"HoFrom": this.hand_over_from,
				"HoTo": this.hand_over_to,
				"HoTopMsg": handover_globalme.getView().getModel('Draft_Header_Model').getData().HoTopMsg,
				"HoBottomMsg": handover_globalme.getView().getModel('Draft_Header_Model').getData().HoBottomMsg,
				"TopMsgRow": this.getView().byId("content_msg_draft").getRows(),
				"BottomMsgRow": this.getView().byId("bottom_msg_draft").getRows()
			};
			handover_Content.push(oModel.createBatchOperation("/ho_contentSet", "POST", Json_content, false));

			var Json_todo = this._ohandover.getModel('Draft_TODO_Model_CV').getData()[0];
			var oTab_to_do = sap.ui.getCore().byId("to_do_cv_tab");
			for (let i in Json_todo) {
				var TODO_JSON = {
					"HoId": handover_globalme.HOID,
					"RowNumber": i,
					"ColNumber": oTab_to_do.getItems()[0].mAggregations.cells.length + parseInt(i) + 1,
					"RowHeight": '100',
					"ProductId": Json_todo[i].ProductId,
					"CollectionName": Json_todo[i].CollectionName,
					"AssemStatus": Json_todo[i].AssemStatus,
					"CommentByUserAssem": Json_todo[i].CommentByUserAssem,
					"DeplStatus": Json_todo[i].DeplStatus,
					"CommentByUserDepl": Json_todo[i].CommentByUserDepl,
					"ToDo": Json_todo[i].ToDo
				}
				handover_todo_Content.push(oModel.createBatchOperation("/ho_to_do_contentSet", "POST", TODO_JSON, false));
			}
			//	
			let Json_epvp = this._ohandover.getModel('Draft_EPVP_Model_CV').getData()[0];
			var oTab_ep_vp = sap.ui.getCore().byId("ep_vp_cv_tab");
			var array_epvp = [];
			for (let i in Json_epvp) {

				var EPVP_JSON = {
					"HoId": handover_globalme.HOID,
					"RowNumber": i,
					"ColNumber": oTab_ep_vp.getItems()[0].mAggregations.cells.length + parseInt(i) + 1,
					"RowHeight": '100',
					"ProductId": Json_epvp[i].ProductId,
					"EpVpProcess": Json_epvp[i].EpVpProcess,
					"HeadsUp": Json_epvp[i].HeadsUp
				}
				handover_ep_vp_Content.push(oModel.createBatchOperation("/ho_ep_vp_contentSet", "POST", EPVP_JSON, false));

			}

			if (handover_Content.length !== 0) {
				oModel.addBatchChangeOperations(handover_Content);
				oModel.submitBatch(function (data) {
						sap.m.MessageToast.show(
							"Handover Header content saved successfully!!"
						);
					}, function (err) {
						MessageBox.error(
							"Error while saving Header content!!"
						);
					},
					false);
			}
			if (handover_todo_Content.length !== 0) {
				oModel.addBatchChangeOperations(handover_todo_Content);
				oModel.submitBatch(function (data) {
						sap.m.MessageToast.show(
							"Handover EPVP Processing Saved successfully!!"
						);
					}, function (err) {
						MessageBox.error(
							"Error while saving EPVP Processing!!"
						);
					},
					false);
			}
			if (handover_ep_vp_Content.length !== 0) {
				oModel.addBatchChangeOperations(handover_ep_vp_Content);
				oModel.submitBatch(function (data) {
						sap.m.MessageToast.show(
							"Handover TODO content saved successfully!!"
						);
					}, function (err) {
						MessageBox.error(
							"Error while saving TODO content!!"
						);
					},
					false);
			}
			return handover_globalme.HOID;
		},
		_triggerMail: function (to_dl, cc_dl, prod_list) {
			var aFilterArray = [];
			var filterYear = new sap.ui.model.Filter("HoId", sap.ui.model.FilterOperator.EQ, handover_globalme.HOID);
			var filterTO = new sap.ui.model.Filter("To_dl", sap.ui.model.FilterOperator.EQ, to_dl);
			var filterCC = new sap.ui.model.Filter("Cc_dl", sap.ui.model.FilterOperator.EQ, cc_dl);
			var filterProd = new sap.ui.model.Filter("Prod_key", sap.ui.model.FilterOperator.EQ, prod_list);
			aFilterArray.push(filterYear, filterTO, filterCC, filterProd);
			var bCompact = !!handover_globalme.getView().$().closest(".sapUiSizeCompact").length;
			handover_globalme.oModel_PQP.read("/generate_handover_mailSet", {
				filters: aFilterArray,
				success: function (Odata) {
					MessageBox.success(
						"Mail Generated Successfully!!", {
							styleClass: bCompact ? "sapUiSizeCompact" : ""
						}
					);
				},
				error: function (err) {
					MessageBox.error(
						"Fail to send Mail!!", {
							styleClass: bCompact ? "sapUiSizeCompact" : ""
						}
					);
				},
				async: false
			});
		},
		onMenuActionPullRequest: function (oEvent) {
			let key = oEvent.getParameters().item.getKey();
			if (key === 'assemblyPull') {
				this._pullDataFromAssemblyQueue();
			} else if (key === 'lastHandover') {
				this._pullDataFromLastHandover()
			}
		},
		_pullDataFromAssemblyQueue: function () {
			handover_globalme.oGlobalBusyDialog.open();
			this._generate_draft_from_assembly_list();
			handover_globalme.oGlobalBusyDialog.close();
		},
		_pullDataFromLastHandover: function () {
			var datePicker = new sap.m.DatePicker({

			});

			var that = this;
			var date_dialog = new sap.m.Dialog({
				title: 'Draggable Available Products',
				contentWidth: "550px",
				contentHeight: "300px",
				draggable: true,
				content: [datePicker,
					new sap.m.ComboBox({
						items: [
							new sap.ui.core.Item({
								key: "BLR",
								text: "BLR"
							}),
							new sap.ui.core.Item({
								key: "ROT",
								text: "ROT"
							}),
							new sap.ui.core.Item({
								key: "VAN",
								text: "VAN"
							})

						]
					})

				],

				beginButton: new sap.m.Button({
					text: 'Submit',
					press: function (event) {

						let data_f_from = date_dialog.getContent()[0].getDateValue();
						let location_f_user = date_dialog.getContent()[1].getSelectedItem().getProperty("key");
						if (data_f_from !== '' && location_f_user !== '') {
							that._getLastHandOver('', data_f_from, location_f_user);
						} else {
							sap.m.MessageBox.show('Please select some value');
						}

						date_dialog.close();
					}
				}),
				endButton: new sap.m.Button({
					text: 'Cancel',
					press: function () {
						date_dialog.close();
					}
				})

			});
			// var p_shot_model = this.getOwnerComponent().getModel('product_s_name');
			// date_dialog.setModel(p_shot_model, 'product_s_name');
			date_dialog.open();

			let Last_Ho_TODO_Content = handover_globalme.getView().getModel('last_HO_TODO').getData();
			let Last_Ho_EPVP_Content = handover_globalme.getView().getModel('last_HO_EPVP').getData();

			let Draft_TODO_Content = handover_globalme.getView().getModel('Draft_TODO_Model').getData()[0];
			let Draft_EPVP_Content = handover_globalme.getView().getModel('Draft_EPVP_Model').getData()[0];

			let Final_TODO_Content = Draft_TODO_Content.concat(Last_Ho_TODO_Content);
			let Final_EPVP_Content = Draft_EPVP_Content.concat(Last_Ho_EPVP_Content);
			handover_globalme.getView().getModel('Draft_TODO_Model')
				.setData({
					'0': Final_TODO_Content
				});
			handover_globalme.getView().getModel('Draft_TODO_Model').refresh(true);
			handover_globalme.getView().getModel(
				'Draft_EPVP_Model').setData({
				'0': Final_EPVP_Content
			});
			handover_globalme.getView().getModel('Draft_EPVP_Model').refresh(true);
		},

		_bindSearchHelp: function () {
			var aFilterArray = [];
			var filterHoId = new sap.ui.model.Filter("HoId", sap.ui.model.FilterOperator.EQ, 'X');
			aFilterArray.push(filterHoId);
			handover_globalme.oModel_PQP.read("/ho_contentSet", {
				filters: aFilterArray,
				success: function (oData) {
					handover_globalme.SearchHelp = new sap.ui.model.json.JSONModel(oData.results);
					handover_globalme.getView().setModel(handover_globalme.SearchHelp, 'SearchHelp');
				},
				error: function (err) {
					MessageBox.error(
						"Fail during finding search help."
					);
				},
				async: false
			});
		},
		onSearch: function (oEvent) {
			var item = oEvent.getParameter("suggestionItem");
			if (item !== undefined) {
				handover_globalme._getLastHandOver(item.getKey());
				var sData = this.getView().getModel("selectItem").getData();
				sData.key = "view";
				this.getView().getModel("selectItem").refresh(true);
			}

		},
		onSuggest: function (oEvent) {

			var value = oEvent.getParameter("suggestValue");
			var filters = [];
			if (value) {
				filters = [
					new sap.ui.model.Filter([
						new sap.ui.model.Filter("HoId", function (sText) {
							return (sText || "").toUpperCase().indexOf(value.toUpperCase()) > -1;
						})
					], false)
				];

				this.oSF.getBinding("suggestionItems").filter(filters);
			} else {
				this._bindSearchHelp();
			}

			this.oSF.suggest();

		},
		add_row_to_do_table: function (oEvent) {
			var oTable = this.getView().byId('to_do_draft_tab');

			if (oTable.getItems().length !== 0) {
				var cell_length = oTable.getItems()[0].getCells().length;
			} else {
				var cell_length = 7;
			}
			var v_length = oTable.getSelectedItems().length;
			let array = this.getView().getModel('Draft_TODO_Model').getData()[0];
			var TODO_JSON = {
				"ProductId": "",
				"CollectionName": "",
				"AssemStatus": "",
				"CommentByUserAssem": "",
				"DeplStatus": "",
				"CommentByUserDepl": "",
				"ToDo": ""
			}
			if (v_length === 1) {
				let index = oTable.indexOfItem(oTable.getSelectedItems()[0]);
				array.splice(index, 0, TODO_JSON);
				this.getView().getModel('Draft_TODO_Model').setData({
					"0": array
				});
			} else if (v_length > 1) {
				sap.m.MessageBox.error("Kindly select one row.")
			} else {
				array.splice(0, 0, TODO_JSON);
				this.getView().getModel('Draft_TODO_Model').setData({
					"0": array
				});
			}

		},
		add_row_ep_vp_table: function (oEvent) {
			var oTable = this.getView().byId('ep_vp_draft_tab');
			if (oTable.getItems().length !== 0) {
				var cell_length = oTable.getItems()[0].getCells().length;
			} else {
				var cell_length = 7;
			}
			var v_length = oTable.getSelectedItems().length;
			let array = this.getView().getModel('Draft_EPVP_Model').getData()[0];
			var EPVP_JSON = {
				"ProductId": "",
				"EpVpProcess": "",
				"HeadsUp": ""
			}
			if (v_length === 1) {
				let index = oTable.indexOfItem(oTable.getSelectedItems()[0]);
				array.splice(index, 0, EPVP_JSON);
				this.getView().getModel('Draft_EPVP_Model').setData({
					"0": array
				});
			} else if (v_length > 1) {
				sap.m.MessageBox.error("Kindly select one row.")
			} else {
				array.splice(0, 0, EPVP_JSON);
				this.getView().getModel('Draft_EPVP_Model').setData({
					"0": array
				});
			}
		},
		on_Adding_link: function () {

		},
		convert_Dl_To_Name: function (oEvent) {

			if (oEvent !== '' && this.getOwnerComponent().getModel('Dl_Model_comp') !== undefined) {
				let arry = oEvent.split(',');
				let string_to = '';
				for (let itr in arry) {
					if (arry[itr] !== '') {
						if (this.getOwnerComponent().getModel('Dl_Model_comp').getData()['default_dl'][0]['dls'].length !== 0) {
							if (this.getOwnerComponent().getModel('Dl_Model_comp').getData()['default_dl'][0]['dls'].filter(c => c.alias ===
									arry[
										itr])[0] !== undefined) {
								let dl_name = this.getOwnerComponent().getModel('Dl_Model_comp').getData()['default_dl'][0]['dls'].filter(c => c.alias ===
									arry[
										itr])[0].name;
								string_to = string_to + dl_name + '\n';
							}

						}

					}
				}
				return string_to;
			};
		},

		remove_row_to_do_table: function (oEvent) {
			var oTable = this.getView().byId('to_do_draft_tab');
			var v_length = oTable.getSelectedItems().length;
			let array = this.getView().getModel('Draft_TODO_Model').getData()[0];
			let new_array = jQuery.extend([], array);
			let selected_item = [];
			for (var i = 0; i < v_length; i++) {
				//	let index = oTable.indexOfItem(oTable.getSelectedItems()[i]);
				//	new_array = new_array.filter(c => c.RowNumber !== array[index].RowNumber);
				selected_item.push(oTable.getModel('Draft_TODO_Model').getProperty(oTable.getSelectedItems()[i].getBindingContext(
					'Draft_TODO_Model').getPath()));
			};
			for (var j = 0; j < selected_item.length; j++) {
				let index = new_array.indexOf(selected_item[j]);
				new_array.splice(index, 1);
			}
			this.getView().getModel('Draft_TODO_Model').setData({
				"0": new_array
			});
			this.getView().getModel('Draft_TODO_Model').refresh(true);
			oTable.removeSelections();
		},
		remove_row_ep_vp_table: function (oEvent) {
			var oTable = this.getView().byId('ep_vp_draft_tab');
			var v_length = oTable.getSelectedItems().length;
			let array = this.getView().getModel('Draft_EPVP_Model').getData()[0];
			let new_array = jQuery.extend([], array);
			let selected_item = [];
			for (var i = 0; i < v_length; i++) {
				//	let index = oTable.indexOfItem(oTable.getSelectedItems()[i]);
				//	new_array = new_array.filter(c => c.RowNumber !== array[index].RowNumber);
				selected_item.push(oTable.getModel('Draft_EPVP_Model').getProperty(oTable.getSelectedItems()[i].getBindingContext(
					'Draft_EPVP_Model').getPath()));
			};
			for (var j = 0; j < selected_item.length; j++) {
				let index = new_array.indexOf(selected_item[j]);
				new_array.splice(index, 1);
			}
			this.getView().getModel('Draft_EPVP_Model').setData({
				"0": new_array
			});
			this.getView().getModel('Draft_EPVP_Model').refresh(true);
			oTable.removeSelections();
		},

	});

	return TableController;
});