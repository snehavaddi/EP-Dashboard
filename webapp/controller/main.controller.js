//test
var oDrop;
var Fullname;
var Fname;
var username;
var array = [];
var short = [];
var shortEP = [];
var grID; //store group ID of project
var EPgrID;
var textid;
var globalv1;
var globalv2;
var defaultfiltersTitle = [];
var main_globalme;
var k = 0;
var oEvent1;
var textmatch;
var textmatchEP;
var globalevt;
var HotFixglobal;
var selectId;
var selectedItems = [];
var videoUrl = [];
var assem_table_refresh_time = 0;
jQuery.sap.require("sap.m.MessageStrip");
jQuery.sap.require("sap.ui.commons.Callout");
jQuery.sap.require("sap.ui.commons.MessageBox");
jQuery.sap.require("sap.m.InstanceManager");
jQuery.sap.require("jquery.sap.history");
sap.ui.define([
	'jquery.sap.global',
	'sap/m/TablePersoController',
	'sap/ui/model/resource/ResourceModel',
	'epdash/epdash/model/formatter',
	'epdash/epdash/DemoPersoService',
	'sap/ui/model/json/JSONModel',
	'sap/m/Popover',
	'sap/ui/model/Sorter',
	'sap/ui/model/FilterOperator',
	'sap/m/MessageToast',
	'sap/m/MessageBox',
	'sap/m/Dialog',
	'sap/m/Button',
	'sap/m/BusyIndicator',
	'sap/m/Text',
	'sap/ui/table/Column',
	'sap/ui/codeeditor/CodeEditor',
	'epdash/epdash/controller/BaseController',
	'sap/ui/layout/HorizontalLayout',
	'sap/ui/layout/VerticalLayout',
	'sap/m/TextArea',
	'sap/m/Input'
], function (jQuery, TablePersoController, ResourceModel, formatter, DemoPersoService, JSONModel, Popover, Sorter, FilterOperator,
	MessageToast, MessageBox, Dialog, Button, BusyIndicator, Text, Column, CodeEditor, BaseController, HorizontalLayout, VerticalLayout,
	TextArea, Input) {

	return BaseController.extend("epdash.epdash.controller.main", {
		formatter: formatter,

		Cacheclear: function () {

		},
		onInit: function () {
			this._oRouter = this.getOwnerComponent().getRouter();
			main_globalme = this;
			main_globalme.oGlobalBusyDialog = new sap.m.BusyDialog();
			this.ep = '', this.epState = '', this.sps = '', this.pver = '', this.spsState = '', this.hf = '', this.hfState = '', this.code = '',
				this.codeState =
				'', this.Correction = '', this.CorrectionState = '';
			this.saveForm = '';
			this.comment_notification = [];
			var oPanel = this.getView().byId("idTablePanel");
			oPanel.setVisible(true);
			this.getView().byId("idProductsTable").setVisible(true);
			var oTable = this.getView().byId("idProductsTable");

			this.getView().byId("idTablePanel").addContent(oTable);
			var s1 = this.getView().byId("meta");
			oPanel.addContent(s1);
			//		this.getView().byId("footer").setVisible(false);
			var oView;
			var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/BRLT/PRODUCT_CATOGRY_DETAIL_SRV/");

			this.oModel_Assembly = new sap.ui.model.odata.ODataModel("/sap/opu/odata/BRLT/PQP_PROJECT_DETAIL_SRV/", {
				useBatch: true
			});
			oView = this.getView();
			oView.setModel(oModel);
			var that = this;

			var tab = this.getView().byId("idProductsTable");
			var oTable1 = that.getView().byId("idEPTable");

			var aFilterArray = [];
			var filterYear = new sap.ui.model.Filter("Variant", sap.ui.model.FilterOperator.EQ, "");
			aFilterArray.push(filterYear);
			//update comment notification list
			this._updateSelectedProducts(aFilterArray);

			var oTemplate = this.getView().byId("coloumid");
			tab.setMode("MultiSelect");
			oTable1.setMode("MultiSelect");
			this.showBusyIndicator(5000, 0);
			this.getView().byId("SearchHead").setVisible(true);
			this.getView().getModel().setSizeLimit(10000);
			var filterArray = [];
			var filter = new sap.ui.model.Filter("tool", sap.ui.model.FilterOperator.EQ, 'EPD');
			filterArray.push(filter);
			this.getView().getModel().read("/usernameSet", {
				filters: filterArray,
				success: function (oData) {
					if (oData.results.length != 0) {
						main_globalme.rm_member = oData.results[0].rm_member;
						main_globalme.hfg_member = oData.results[0].hfg_member;
						main_globalme.assembly_member = oData.results[0].assembly_member;
						//	that.getView().byId("user").setText(oData.results[0].Vorna + ' ' + oData.results[0].Nachn);
						//	let url = "https://ui-avatars.com/api/?name=" + oData.results[0].Vorna + '+' + oData.results[0].Nachn ;
						//
						that.getView().byId("user").setInitials(oData.results[0].Vorna.charAt(0) + oData.results[0].Nachn.charAt(0));
						username = oData.results[0].Vorna;
						if (main_globalme.assembly_member === 'true') {
							main_globalme._get_old_number_of_assembly_list();
							window.setInterval(main_globalme.b5buttonrefresh, 50000);
							window.setInterval(main_globalme._refreshassemblyQueue, 60000);

						}
						if (main_globalme.hfg_member === 'false') {
							that.getView().byId("Remindbutt").setEnabled(false);
							that.getView().byId("Triggerbutt").setEnabled(false);
						}

						if (oData.results[0].admin === 'true') {
							that.getView().byId("epd_admin").setVisible(true);
							that.getView().byId("video_button").setVisible(true);
						}
						that._getRole_for_user();

					}
				}
			});
			var that = this;
			this.getView().getModel().read("/Button_StatusSet", null, null, true,
				function (oData) {
					var panel = Boolean(Number(oData.results[0].Panel));
					var b1 = Boolean(Number(oData.results[0].B1));
					var b2 = Boolean(Number(oData.results[0].B2));
					var b3 = Boolean(Number(oData.results[0].B3));
					var b4 = Boolean(Number(oData.results[0].B4));
					var b5 = Boolean(Number(oData.results[0].B5));
					that.getView().byId("headpanel").setVisible(panel);
					that.getView().byId("Default").setVisible(b1);
					that.getView().byId("awaRmApproval").setVisible(b2);
					that.getView().byId("awaHfgApproval").setVisible(b3);
					//    that.getView().byId("Ready").setVisible(b4);
					//   that.getView().byId("Assembly").setVisible(b5);
				});
			//	this.getView().getModel().read("/hfs_sps_versionSet");
			this._oTPC = new TablePersoController({
				table: this.getView().byId("idProductsTable"),
				//specify the first part of persistence ids e.g. 'demoApp-productsTable-dimensionsCol'
				componentName: "epdash.epdash",
				persoService: DemoPersoService,
			}).activate();

			this._oTPC23 = new TablePersoController({
				table: this.getView().byId("idProductsTable23"),
				//specify the first part of persistence ids e.g. 'epdash.epdash-idProductsTable23-dimensionsCol'
				componentName: "epdash.epdash",
				persoService: DemoPersoService,
			}).activate();

			this._oTPC1 = new TablePersoController({
				table: this.getView().byId("idEPTable"),
				//specify the first part of persistence ids e.g. 'demoApp-productsTable-dimensionsCol'
				componentName: "epdash.epdash",
				persoService: DemoPersoService,
			}).activate();

			//   window.setTimeout(this.updatetable,25000);
			//group columns init, added by sahv(I333060)
			this.mGroupFunctions = {
				SpsName: function (oContext) {
					var name = oContext.getProperty("SpsName");
					return {
						key: name,
						text: name
					};
				},
				CodelineType: function (oContext) {
					var name = oContext.getProperty("CodelineType");
					var fText;
					switch (name) {
					case "1":
						fText = "MAO Codeline";
						break;
					case "2":
						fText = "Verification Patch Codeline";
						break;
					case "3":
						fText = "Emergency Patch Codeline";
						break;
					default:
						fText = name;
					}
					return {
						key: name,
						text: fText
					};
				},
				CodelineEpStat: function (oContext) {
					var name = oContext.getProperty("CodelineEpStat");
					var fText;
					switch (name) {
					case "70":
						fText = "New";
						break;
					case "72":
						fText = "In Risk Mitigation";
						break;
					case "74":
						fText = "In Approval";
						break;
					case "75":
						fText = "Verification Patch Approved";
						break;
					case "76":
						fText = "Approved";
						break;
					case "78":
						fText = "Rejected";
						break;
					case "80":
						fText = "Implementation on-going";
						break;
					case "82":
						fText = "Implementation Completed";
						break;
					case "84":
						fText = "Assembly Done";
						break;
					case "86":
						fText = "Deployment completed";
						break;
					case "88":
						fText = "Retest Successful";
						break;
					case "90":
						fText = "Finished";
						break;
					case "92":
						fText = "Canceled";
						break;
					default:
						fText = name;
					}
					return {
						key: name,
						text: name
					};
				},
				ProdVersName: function (oContext) {
					var name = oContext.getProperty("ProdVersName");
					return {
						key: name,
						text: name
					};
				},
				HeaderStatus: function (oContext) {
					var name = oContext.getProperty("HeaderStatus");
					var fText;
					switch (name) {
					case "70":
						fText = "New";
						break;
					case "72":
						fText = "In Risk Mitigation";
						break;
					case "74":
						fText = "In Approval";
						break;
					case "75":
						fText = "Verification";
						break;
					case "76":
						fText = "Approved";
						break;
					case "78":
						fText = "Rejected";
						break;
					case "88":
						fText = "In Process";
						break;
					case "90":
						fText = "Finished";
						break;
					case "92":
						fText = "Canceled";
						break;
					default:
						fText = name;
					}
					return {
						key: name,
						text: fText
					};
				},
				StatusRm: function (oContext) {
					var name = oContext.getProperty("StatusRm");
					var fText;
					switch (name) {
					case "01":
						fText = "Not yet decided";
						break;
					case "02":
						fText = "In Approval";
						break;
					case "03":
						fText = "Approved";
						break;
					case "04":
						fText = "Rejected";
						break;
					case "05":
						fText = "Not needed";
						break;
					default:
						fText = name;
					}
					return {
						key: name,
						text: fText
					};
				},
				StatusHf: function (oContext) {
					var name = oContext.getProperty("StatusHf");
					var fText;
					switch (name) {
					case "01":
						fText = "Not yet decided";
						break;
					case "02":
						fText = "In Approval";
						break;
					case "03":
						fText = "Approved";
						break;
					case "04":
						fText = "Rejected";
						break;
					case "05":
						fText = "Not needed";
						break;
					default:
						fText = name;
					}
					return {
						key: name,
						text: fText
					};
				}

			}

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("main").attachPatternMatched(this._onRouteMatchedmain, this);
			//shutdown
			//	oRouter.navTo("message_shutdow");
			//
			window.setTimeout(this.cacheclear, 100);
			window.setTimeout(this.readUserVideoSetting, 1000);
			window.setTimeout(this._get_cloud_products_flag, 2000);
			var nModel = new sap.ui.model.json.JSONModel({
				visible: "true"
			});
			this.getView().setModel(nModel, "visible_hot");
			window.setInterval(this._refresh_app_cache_data, 60000);

			window.setInterval(this._updateComment, 60000);
			main_globalme.ep_under_rm_hfg = new sap.ui.model.json.JSONModel();
			main_globalme.getView().setModel(main_globalme.ep_under_rm_hfg, 'ep_under_rm_hfg');
			this.onPressCodeline_In_Process('', "false", true);
		},
		addDelegate: function (oEvent) {
			if (oEvent !== null) {

				this.attachPopoverOnMouseover(this, this.byId("requester"), this.byId("popover"));
			}
			return oEvent;
		},
		attachPopoverOnMouseover: function (targetControl, popover) {
			targetControl.addEventDelegate({
				onmouseover: this._showPopover.bind(this, targetControl, popover),
				onmouseout: this._clearPopover.bind(this, popover),
			}, this);
		},

		_showPopover: function (targetControl, popover) {
			this._timeId = setTimeout(() => popover.openBy(targetControl), 100);
		},

		_clearPopover: function (popover) {
			clearTimeout(this._timeId) || popover.close();
		},

		_onRouteMatchedmain: function () {

			window.setTimeout(this.updatemaster, 200);

			window.setTimeout(this.deletealllock, 600000);
			window.setTimeout(this._hotlinerUpdate("CLOUD"), 2000);

			window.setTimeout(this.timing, 1000);

			window.setTimeout(this.holyday, 10000);
			window.setTimeout(this._notify_user, 30000);
			window.setTimeout(this.pending_vp_tab, 15000);
			//		window.setTimeout(this.clear_pending_vp_tab, 10000);
			window.setTimeout(this._number_of_deployment, 1500);
		},
		_bind_codelinestatus_tables: function (oModel, array) {
			var filter;
			var filtersTitle = [];
			oModel.read("/vp_ep_status_detailSet", {
				success: function (oData) {
					var CodelineModel = new sap.ui.model.json.JSONModel();
					CodelineModel.setData({
						values: oData.results
					});
					main_globalme.getView().setModel(CodelineModel, "codeline");

					for (var i = 0; i < array.length; i++) {
						filter = new sap.ui.model.Filter("ProductName", sap.ui.model.FilterOperator.EQ, array[i]);
						main_globalme.getView().byId("notification_panel").getContent()[i].getContent()[1].getContent()[0].bindRows(
							"codeline>/values");
						main_globalme.getView().byId("notification_panel").getContent()[i].getContent()[1].getContent()[0].getBinding("rows").filter(
							filter);
					}
				},
				error: function (err) {

				}
			});
		},

		_updateSelectedProducts: function (aFilterArray) {
			var com = [];
			var vName;
			var oModel = main_globalme.getView().getModel();
			oModel.read("/var_data_product_nameSet", {
				filters: aFilterArray,
				success: function (oData) {
					var oData = oData.results;
					for (var i = 0; i < oData.length; i++) {
						com[i] = oData[i].Product
						vName = oData[i].Variant;
					}
					var Product_noti_Model = new sap.ui.model.json.JSONModel();
					Product_noti_Model.setData(oData);
					main_globalme.getView().setModel(Product_noti_Model, 'product_noti_model');
					array = com;
					main_globalme.getView().byId("msgTrip").setText(" Product Selected :  " + com);
					if (com.length == 0) {
						main_globalme.getView().byId("msgTrip").setType("Error");
					}
					main_globalme._updateComment();
					main_globalme._bind_codelinestatus_tables(oModel, array);
				},
				async: false
			});
		},
		readUserVideoSetting: function () {
			main_globalme.getView().getModel().read("/video_disableSet", {
				success: function (oData) {
					if (oData.results.length != 0) {

						if (oData.results[0].Disable != 'X' && oData.results[0].GlobalDisable != 'X' && oData.results[0].NumberOfVideo != 'X') {
							main_globalme.oState = true;
							window.setTimeout(main_globalme.advertise, 100); // will come with new thing . for now block it
						}
					}
				},
				error: function () {
					console.log("error");
				},
				async: false

			});

		},
		advertise: function () {
			//Advertise window
			if (!main_globalme._oadvertiseDialog) {
				main_globalme._oadvertiseDialog = sap.ui.xmlfragment("epdash.epdash.view.advertising", main_globalme);
				main_globalme.getView().addDependent(main_globalme._oadvertiseDialog);
			}

			main_globalme._oadvertiseDialog.open();
			main_globalme._fillVideoData();
			////////////
		},
		_fillVideoData: function () {
			var vidArray = new Object();
			var collectVideo = [];
			main_globalme.getView().getModel().read("/video_logSet", {

				success: function (oData) {
					for (var i = 0; i < oData.results.length; i++) {
						vidArray.SerialNumber = oData.results[i].SerialNumber;
						vidArray.VUrl = oData.results[i].VUrl;
						vidArray.UrlContent = oData.results[i].UrlContent;
						collectVideo.push(vidArray);
						vidArray = {};
					}

				},
				error: function () {
					console.log("error");
				},
				async: false

			});

			if (collectVideo.length !== 0) {
				var url = collectVideo[0].VUrl + "?rel=0&amp;controls=0&amp;showinfo=0;autoplay=1";
				var value = collectVideo[0].UrlContent;
				$('#addVideoframe').attr('src', url, 'autoplay');
				//	$('#videoContentID').html(value);
				sap.ui.getCore().byId("videoContentID").setText(value);
				videoUrl = collectVideo;
				if (collectVideo.length > 1) {
					sap.ui.getCore().byId("videonext").setVisible(true);
				}
			}
		},
		// Video Setting Controls
		onPreviousVideo: function () {
			if (videoUrl.length !== 0) {
				videoUrl.push(videoUrl.shift());
				var url = videoUrl[0].VUrl + "?rel=0&amp;controls=0&amp;showinfo=0;autoplay=1";
				var value = videoUrl[0].UrlContent;
				$('#addVideoframe').attr('src', url);
				//	$('#videoContentID').html(value);
				sap.ui.getCore().byId("videoContentID").setText(value);

			}
		},
		onNextVideo: function () {

			sap.ui.getCore().byId("videoprevious").setVisible(true);
			if (videoUrl.length !== 0) {
				videoUrl.push(videoUrl.shift());
				var url = videoUrl[0].VUrl + "?rel=0&amp;controls=0&amp;showinfo=0;autoplay=1";
				var value = videoUrl[0].UrlContent;
				$('#addVideoframe').attr('src', url);
				//	$('#videoContentID').html(value);
				sap.ui.getCore().byId("videoContentID").setText(value);
			}

		},

		onCloseVideo: function () {
			main_globalme._oadvertiseDialog.close();
			if (sap.ui.getCore().byId("disablecheck").getSelected() == true) {
				var oParameter = {
					"Disable": "X"
				};
				this.showBusyIndicator(2000, 0);
				this.getView().getModel().create("/video_disableSet", oParameter);
			}
		},
		clickSkype: function (sText) {
			this.showBusyIndicator(2000, 0);
			var filtersTitle = [];
			// var text = this.getView().byId(oEvent.getParameters().id).mAggregations.tooltip;
			var oFil = sText.split("Start Chat with  ")[1];
			var oFilters1 = new sap.ui.model.Filter("HotRotEid", sap.ui.model.FilterOperator.EQ, oFil);
			filtersTitle.push(oFilters1);
			this.getView().getModel().read("/skype_chat_mail_startSet", {
				filters: filtersTitle,
				success: function (oData) {
					var result = oData.results;
					if (oData.results.length != '0') {
						window.location = "sip:" + oData.results[0].HotInRotComm;
					} else {
						MessageToast.show("No result Found");
					}
				}
			});

		},
		clickSkypeToChatReq: function (oEvent) {
			var sname = oEvent.getSource().getText();
			this.getView().getModel().read("/sname_to_inameSet('" + sname + "')", {
				//filters: filtersTitle,
				success: function (oData) {
					var result = oData.iname;
					var sText = "Start Chat with  " + result;
					main_globalme.clickSkype(sText);
				}
			});

		},

		clickmail: function (sMail) {
			this.showBusyIndicator(2000, 0);
			var filtersTitle = [];
			//  var text = this.getView().byId(oEvent.getParameters().id).mAggregations.tooltip;
			var oFil = sMail.split("Mail To ")[1];
			var oFilters1 = new sap.ui.model.Filter("HotRotEid", sap.ui.model.FilterOperator.EQ, oFil);
			filtersTitle.push(oFilters1);
			this.getView().getModel().read("/skype_chat_mail_startSet", {
				filters: filtersTitle,
				success: function (oData) {
					var result = oData.results;
					sap.m.URLHelper.triggerEmail(oData.results[0].HotInRotComm,
						"Patch Assembly Trigger for S4HANA CLOUD <Release> HFC ",
						"Dear AOF Cloud Patch Assembly Team,\n\n" +
						"The following EP requests are ready for delivery.\n" + "Action: Please start with assembly.\n\n\n\n\n\n\n\n\n\n\n\n" +
						"for the S/4HANA Hotfix Governance Team"
					);
				}
			});
		},

		hideBusyIndicator: function () {
			sap.ui.core.BusyIndicator.hide();
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

		ep_vp_status: function (value) {
			if (value == 'MAO') {
				this.getView().byId("ep_vp_text").addClass("inprepepvp");
				this.getView().byId("ep_vp_text").removeClass("inepepvp");
				this.getView().byId("ep_vp_text").addClass("invpepvp");
			} else if (value == 'EP') {
				this.getView().byId("ep_vp_text").addClass("inepepvp");
				this.getView().byId("ep_vp_text").removeClass("inprepepvp");
				this.getView().byId("ep_vp_text").addClass("invpepvp");
			} else if (value == 'VP') {
				this.getView().byId("ep_vp_text").addClass("invpepvp");
				this.getView().byId("ep_vp_text").removeClass("inepepvp");
				this.getView().byId("ep_vp_text").addClass("inprepepvp");
			}
		},

		timing: function () {

			var x = calcTime('+5.5');
			var hh = x.getHours();
			var mm = x.getMinutes();
			var ss = x.getSeconds();
			if (hh < 10) {
				hh = '0' + hh;
			}
			if (mm < 10) {
				mm = '0' + mm;
			}
			main_globalme.getView().byId("ISTTime").setText(hh + ':' + mm);
			if (hh >= 00 && mm >= 00 && hh < 09) {
				main_globalme.getView().byId("ISTTime").addStyleClass("Timegrey");
			} else if (hh >= 09 && hh < 12 && mm >= 00) {
				main_globalme.getView().byId("ISTTime").removeStyleClass("Timegrey");
				main_globalme.getView().byId("ISTTime").addStyleClass("Timegreen");
			} else if (hh == 12 && mm >= 30) {
				main_globalme.getView().byId("ISTTime").removeStyleClass("Timegreen");
				main_globalme.getView().byId("ISTTime").addStyleClass("Timeblue");
			} else if (hh == 13 && mm >= 00) {
				main_globalme.getView().byId("ISTTime").removeStyleClass("Timegreen");
				main_globalme.getView().byId("ISTTime").addStyleClass("Timeblue");
			} else if (hh == 14 && mm <= 30) {
				main_globalme.getView().byId("ISTTime").removeStyleClass("Timegreen");
				main_globalme.getView().byId("ISTTime").addStyleClass("Timeblue");
			} else if (hh == 14 && mm >= 30) {
				main_globalme.getView().byId("ISTTime").removeStyleClass("Timeblue");
				main_globalme.getView().byId("ISTTime").addStyleClass("Timegreen");
			} else if (hh >= 14 && mm >= 00 && hh < 16) {
				main_globalme.getView().byId("ISTTime").removeStyleClass("Timeblue");
				main_globalme.getView().byId("ISTTime").addStyleClass("Timegreen");
			} else if (hh == 16 && mm <= 30) {
				main_globalme.getView().byId("ISTTime").removeStyleClass("Timeblue");
				main_globalme.getView().byId("ISTTime").addStyleClass("Timegreen");
			} else if (hh == 16 && mm >= 30) {
				main_globalme.getView().byId("ISTTime").removeStyleClass("Timegreen");
				main_globalme.getView().byId("ISTTime").addStyleClass("Timegrey");
			} else if (hh >= 17 && mm >= 00) {
				main_globalme.getView().byId("ISTTime").removeStyleClass("Timegreen");
				main_globalme.getView().byId("ISTTime").addStyleClass("Timegrey");
			}

			var c_date = new Date();
			switch (c_date.getFullYear()) {
			case 2017:
				var dateFrom_2017 = "26/03/2017";
				var dateTo_2017 = "29/10/2017";
				var dateCheck = new Date();

				var d1 = dateFrom_2017.split("/");
				var d2 = dateTo_2017.split("/");

				var from_d = new Date(d1[2], parseInt(d1[1]) - 1, d1[0]);
				var to_d = new Date(d2[2], parseInt(d2[1]) - 1, d2[0]);

				var from = Date.parse(from_d);
				var to = Date.parse(to_d);
				var check = Date.parse(dateCheck);

				if ((check <= to && check >= from)) {
					var y = calcTime('+2');
				} else {
					var y = calcTime('+1');
				}
				break;
			case 2018:
				var dateFrom_2018 = "25/03/2018";
				var dateTo_2018 = "28/10/2018";
				var dateCheck = new Date();

				var d1 = dateFrom_2018.split("/");
				var d2 = dateTo_2018.split("/");

				var from_d = new Date(d1[2], parseInt(d1[1]) - 1, d1[0]);
				var to_d = new Date(d2[2], parseInt(d2[1]) - 1, d2[0]);

				var from = Date.parse(from_d);
				var to = Date.parse(to_d);
				var check = Date.parse(dateCheck);

				if ((check <= to && check >= from)) {
					var y = calcTime('+2');
				} else {
					var y = calcTime('+1');
				}
				break;
			case 2019:
				var dateFrom_2019 = "31/03/2019";
				var dateTo_2019 = "27/10/2019";
				var dateCheck = new Date();

				var d1 = dateFrom_2019.split("/");
				var d2 = dateTo_2019.split("/");

				var from_d = new Date(d1[2], parseInt(d1[1]) - 1, d1[0]);
				var to_d = new Date(d2[2], parseInt(d2[1]) - 1, d2[0]);

				var from = Date.parse(from_d);
				var to = Date.parse(to_d);
				var check = Date.parse(dateCheck);

				if ((check <= to && check >= from)) {
					var y = calcTime('+2');
				} else {
					var y = calcTime('+1');
				}
				break;
			case 2020:
				var dateFrom_2020 = "29/03/2020";
				var dateTo_2020 = "25/10/2020";
				var dateCheck = new Date();

				var d1 = dateFrom_2020.split("/");
				var d2 = dateTo_2020.split("/");

				var from_d = new Date(d1[2], parseInt(d1[1]) - 1, d1[0]);
				var to_d = new Date(d2[2], parseInt(d2[1]) - 1, d2[0]);

				var from = Date.parse(from_d);
				var to = Date.parse(to_d);
				var check = Date.parse(dateCheck);

				if ((check <= to && check >= from)) {
					var y = calcTime('+2');
				} else {
					var y = calcTime('+1');
				}
				break;
			default:

			}

			var ch = y.getHours();
			var cm = y.getMinutes();
			var cs = y.getSeconds();
			if (ch < 10) {
				ch = '0' + ch;
			}
			if (cm < 10) {
				cm = '0' + cm;
			}
			main_globalme.getView().byId("CETTime").setText(ch + ':' + cm);
			if (ch >= 00 && cm >= 00 && ch < 09) {
				main_globalme.getView().byId("CETTime").addStyleClass("Timegrey");
			} else if (ch >= 09 && cm >= 00 && ch < 11) {
				main_globalme.getView().byId("CETTime").removeStyleClass("Timegrey");
				main_globalme.getView().byId("CETTime").addStyleClass("Timegreen");
			} else if (ch >= 11 && cm >= 00 && ch < 13) {
				main_globalme.getView().byId("CETTime").removeStyleClass("Timegreen");
				main_globalme.getView().byId("CETTime").addStyleClass("Timeblue");
			} else if (ch >= 13 && cm >= 00 && ch < 17) {
				main_globalme.getView().byId("CETTime").removeStyleClass("Timeblue");
				main_globalme.getView().byId("CETTime").addStyleClass("Timegreen");
			} else if (ch >= 17 && cm >= 00) {
				main_globalme.getView().byId("CETTime").removeStyleClass("Timegreen");
				main_globalme.getView().byId("CETTime").addStyleClass("Timegrey");
			}
			if (ch == 09 && cm == 30) {
				main_globalme.triggerassmsg(ch, cm);
			} else if (ch == 13 && cm == 00) {
				main_globalme.triggerassmsg1(ch, cm);
			} else if (ch == 15 && cm == 00) {
				main_globalme.triggerassmsg2(ch, cm);
			} else if (ch == 18 && cm == 00) {
				main_globalme.triggerassmsg3(ch, cm);
			}

			//CANADA Timezone

			var v_date = new Date();
			switch (v_date.getFullYear()) {
			case 2017:
				var dateFrom_2017 = "12/03/2017";
				var dateTo_2017 = "5/11/2017";
				var dateCheck = new Date();

				var d1 = dateFrom_2017.split("/");
				var d2 = dateTo_2017.split("/");

				var from_d = new Date(d1[2], parseInt(d1[1]) - 1, d1[0]);
				var to_d = new Date(d2[2], parseInt(d2[1]) - 1, d2[0]);

				var from = Date.parse(from_d);
				var to = Date.parse(to_d);
				var check = Date.parse(dateCheck);

				if ((check <= to && check >= from)) {
					var z = calcTime('-7');
				} else {
					var z = calcTime('-8');
				}
				break;
			case 2018:
				var dateFrom_2018 = "11/03/2018";
				var dateTo_2018 = "4/11/2018";
				var dateCheck = new Date();

				var d1 = dateFrom_2018.split("/");
				var d2 = dateTo_2018.split("/");

				var from_d = new Date(d1[2], parseInt(d1[1]) - 1, d1[0]);
				var to_d = new Date(d2[2], parseInt(d2[1]) - 1, d2[0]);

				var from = Date.parse(from_d);
				var to = Date.parse(to_d);
				var check = Date.parse(dateCheck);

				if ((check <= to && check >= from)) {
					var z = calcTime('-7');
				} else {
					var z = calcTime('-8');
				}
				break;
			case 2019:
				var dateFrom_2019 = "10/03/2019";
				var dateTo_2019 = "03/11/2019";
				var dateCheck = new Date();

				var d1 = dateFrom_2019.split("/");
				var d2 = dateTo_2019.split("/");

				var from_d = new Date(d1[2], parseInt(d1[1]) - 1, d1[0]);
				var to_d = new Date(d2[2], parseInt(d2[1]) - 1, d2[0]);

				var from = Date.parse(from_d);
				var to = Date.parse(to_d);
				var check = Date.parse(dateCheck);

				if ((check <= to && check >= from)) {
					var z = calcTime('-7');
				} else {
					var z = calcTime('-8');
				}
				break;
			case 2020:
				var dateFrom_2020 = "8/03/2020";
				var dateTo_2020 = "8/11/2020";
				var dateCheck = new Date();

				var d1 = dateFrom_2020.split("/");
				var d2 = dateTo_2020.split("/");

				var from_d = new Date(d1[2], parseInt(d1[1]) - 1, d1[0]);
				var to_d = new Date(d2[2], parseInt(d2[1]) - 1, d2[0]);

				var from = Date.parse(from_d);
				var to = Date.parse(to_d);
				var check = Date.parse(dateCheck);

				if ((check <= to && check >= from)) {
					var z = calcTime('-7');
				} else {
					var z = calcTime('-8');
				}
				break;
			default:

			}

			var ph = z.getHours();
			var pm = z.getMinutes();
			var ps = z.getSeconds();
			if (ph < 10) {
				ph = '0' + ph;
			}
			if (pm < 10) {
				pm = '0' + pm;
			}
			main_globalme.getView().byId("PSTTime").setText(ph + ':' + pm);
			if (ph >= 00 && pm >= 00 && ph < 09) {
				main_globalme.getView().byId("PSTTime").addStyleClass("Timegreycanda");
			} else if (ph >= 09 && pm >= 00 && ph < 11) {
				main_globalme.getView().byId("PSTTime").removeStyleClass("Timegreycanda");
				main_globalme.getView().byId("PSTTime").addStyleClass("Timegreen");
			} else if (ph >= 11 && pm >= 00 && ph < 13) {
				main_globalme.getView().byId("PSTTime").removeStyleClass("Timegreen");
				main_globalme.getView().byId("PSTTime").addStyleClass("Timeblue");
			} else if (ph >= 13 && pm >= 00 && ph < 17) {
				main_globalme.getView().byId("PSTTime").removeStyleClass("Timeblue");
				main_globalme.getView().byId("PSTTime").addStyleClass("Timegreen");
			} else if (ph >= 17 && pm >= 00) {
				main_globalme.getView().byId("PSTTime").removeStyleClass("Timegreen");
				main_globalme.getView().byId("PSTTime").addStyleClass("Timegreycanda");
			}

			function calcTime(offset) {
				var d = new Date();
				var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
				var nd = new Date(utc + (3600000 * offset));
				return nd;
			}
			window.setTimeout(main_globalme.timing, 60000);
		},

		getGroupHeader: function (oGroup) {
			return new GroupHeaderListItem({
				title: oGroup.key,
				upperCase: false
			});
		},

		Format: function (value) {
			var oVal = value;
			if (value == "true") {
				return (value = true)
			} else {
				return (value === "true" ? true : false)
			}
		},

		datetime: function (value) {
			debugger;
		},

		hideBusyIndicator: function () {
			sap.ui.core.BusyIndicator.hide();
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

		onPressDefault: function () {
			shortEP = [];
			this.showBusyIndicator(3000, 0);
			//    this.getView().byId("viewsetting").setVisible(true);
			var that = this;
			var action = this.getView().byId("actionHFG");
			var oTable = that.getView().byId("idProductsTable");
			oTable.removeColumn(action);
			this.getView().byId("idProductsTable").setVisible(true);
			this.getView().byId("requestep").setVisible(false);
			this.getView().byId("deleteep").setVisible(false);
			this.getView().byId("idTablePanel").removeAllContent();
			var oTable = this.getView().byId("idProductsTable");
			this.getView().byId("idProductsTable23").setVisible(false);
			this.getView().byId("Default").setType("Emphasized");
			this.getView().byId("awaRmApproval").setType("Default");
			this.getView().byId("awaHfgApproval").setType("Default");
			this.getView().byId("Ready_EP").setType("Default");
			if (this.getView().byId("vp_awaiting").getVisible() == true) {
				this.getView().byId("vp_awaiting").setType("Default");
			}
			//    this.getView().byId("Ready").setType("Default");
			//  this.getView().byId("Assembly").setType("Default");
			this.getView().byId("Queue_EP").setType("Default");
			var deletechildpanel = this.getView().byId("dispalydelete");
			deletechildpanel.setVisible(false);
			this.getView().byId("idTablePanel").setVisible(true);
			this.getView().byId("Search").setValue("");
			this.getView().byId("SearchHead").setVisible(true);
			//	this.getView().byId("footer").setVisible(false);
			that.oData = null;
			var filtersTitle = [];
			var oTemplate = that.byId(this.createId("coloumid"));
			//      var oCombo = this.getView().byId("idComobo");
			//      var oValue = oCombo.getValue();
			for (var i = 0; i < array.length; i++) {
				var oFilters = new sap.ui.model.Filter("ProductName", sap.ui.model.FilterOperator.EQ, array[i]);
				filtersTitle.push(oFilters);
			};
			var that = this;
			this.getView().getModel().read("/all_ep_in_listSet", {
				filters: filtersTitle,
				success: function (oData) {
					that.oData = oData.results;
					that.json = new sap.ui.model.json.JSONModel();
					that.json.setData({
						path: that.oData
					});
					oTable.setModel(that.json);
					oTable.bindAggregation("items", {
						path: "/path",
						template: oTemplate,
						growing: "true"
					});
					that.getView().byId("idTablePanel").addContent(oTable);
					that.bindcolor();
					that.ClearSorting();
				}
			});

		},
		onPressRM_Approval: function () {
			short = [];
			this.showBusyIndicator(3000, 0);
			this.getView().byId("Commenthfg23").setVisible(true);
			this.getView().byId("commntareahfg23").setVisible(true);
			this.getView().byId("Comentrm23").setVisible(true);
			this.getView().byId("commentarearm23").setVisible(true);
			this.getView().byId("requestep").setVisible(false);
			this.getView().byId("deleteep").setVisible(false);
			this.getView().byId("idTablePanel").removeAllContent();
			this.getView().byId("idTablePanel").setVisible(true);
			var oTable = this.getView().byId("idProductsTable23");
			oTable.setVisible(true);
			this.getView().byId("idProductsTable").setVisible(false);
			this.getView().byId("Queue_EP").setType("Default");
			this.getView().byId("Default").setType("Default");
			this.getView().byId("awaRmApproval").setType("Emphasized");
			this.getView().byId("awaHfgApproval").setType("Default");
			if (this.getView().byId("vp_awaiting").getVisible() == true) {
				this.getView().byId("vp_awaiting").setType("Default");
			}
			// this.getView().byId("Assembly").setType("Default");
			this.getView().byId("Ready_EP").setType("Default");
			this.getView().byId("EpSortBut").setType("Transparent");
			this.getView().byId("ProdName").setType("Transparent");
			this.getView().byId("HotSortBut").setType("Transparent");
			this.getView().byId("HeadStatus").setType("Transparent");
			this.getView().byId("ApprovSta").setType("Transparent");
			this.getView().byId("StatHFG").setType("Transparent");
			var deletechildpanel = this.getView().byId("dispalydelete");
			deletechildpanel.setVisible(false);
			//     this.getView().byId("viewsetting").setVisible(false);
			this.getView().byId("Search").setValue("");
			this.getView().byId("SearchHead").setVisible(true);
			//	this.getView().byId("footer").setVisible(false);
			this.getView().byId("idEPTable").setVisible(false);
			var that = this;
			var action = this.getView().byId("actionHFG23");
			var oTable = that.getView().byId("idProductsTable23");
			oTable.addColumn(action);
			that.oData = null;
			var filtersTitle = [];
			var oTemplate = that.byId(this.createId("coloumid23"));
			//    var oCombo = this.getView().byId("idComobo");
			//    var oValue = oCombo.getValue();
			for (var i = 0; i < array.length; i++) {
				var oFilters1 = new sap.ui.model.Filter("ProductName", sap.ui.model.FilterOperator.EQ, array[i]);
				filtersTitle.push(oFilters1);
			};
			var that = this;
			this.getView().getModel().read("/ep_under_rmSet", {
				filters: filtersTitle,
				success: function (oData) {
					main_globalme.ep_under_rm_hfg.refresh(true);
					main_globalme.ep_under_rm_hfg.setData(oData.results);
					oTable.setModel(main_globalme.ep_under_rm_hfg, 'ep_under_rm_hfg');
					/*that.oData = oData.results;
					that.json = new sap.ui.model.json.JSONModel();
					that.json.setData({
						path: that.oData
					});
					oTable.setModel(that.json);
					oTable.bindAggregation("items", {
						path: "/path",
						template: oTemplate,
						growing: "true"
					});*/
					oTable.setVisible(true);
					that.getView().byId("idTablePanel").addContent(oTable);
					var oListBinding = oTable.getBinding();
					oTable.getModel().refresh(true);
					that.bindcolor();
					that.ClearSorting();
				}
			});

		},
		onPressHFG_Approval: function () {
			short = [];
			this.showBusyIndicator(3000, 0);
			this.getView().byId("Commenthfg23").setVisible(true);
			this.getView().byId("commntareahfg23").setVisible(true);
			this.getView().byId("Comentrm23").setVisible(true);
			this.getView().byId("commentarearm23").setVisible(true);
			this.getView().byId("requestep").setVisible(false);
			this.getView().byId("deleteep").setVisible(false);
			this.getView().byId("idTablePanel").removeAllContent();
			var oTable = this.getView().byId("idProductsTable23");
			var oTableHide = this.getView().byId("idProductsTable");
			oTableHide.setVisible(false);
			this.getView().byId("Default").setType("Default");
			this.getView().byId("awaRmApproval").setType("Default");
			this.getView().byId("awaHfgApproval").setType("Emphasized");
			//     this.getView().byId("Ready").setType("Default");
			//  this.getView().byId("Assembly").setType("Default");
			this.getView().byId("Ready_EP").setType("Default");
			this.getView().byId("Queue_EP").setType("Default");
			if (this.getView().byId("vp_awaiting").getVisible() == true) {
				this.getView().byId("vp_awaiting").setType("Default");
			}
			this.getView().byId("EpSortBut").setType("Transparent");
			this.getView().byId("ProdName").setType("Transparent");
			this.getView().byId("HotSortBut").setType("Transparent");
			this.getView().byId("HeadStatus").setType("Transparent");
			this.getView().byId("ApprovSta").setType("Transparent");
			this.getView().byId("StatHFG").setType("Transparent");
			var deletechildpanel = this.getView().byId("dispalydelete");
			deletechildpanel.setVisible(false);
			this.getView().byId("idTablePanel").setVisible(true);
			this.getView().byId("Search").setValue("");
			this.getView().byId("SearchHead").setVisible(true);
			//   this.getView().byId("viewsetting").setVisible(false);
			//	this.getView().byId("footer").setVisible(false);
			this.getView().byId("idEPTable").setVisible(false);
			var that = this;
			var action = this.getView().byId("actionHFG23");
			oTable.addColumn(action);
			that.oData = null;
			var filtersTitle = [];
			var oTemplate = that.byId(this.createId("coloumid23"));
			//   var oCombo = this.getView().byId("idComobo");
			//   var oValue = oCombo.getValue();
			var oTable = that.getView().byId("idProductsTable23");
			oTable.setVisible(true);
			var oBinding = oTable.getBinding("items");
			that.json = null;
			for (var i = 0; i < array.length; i++) {
				var oFilters1 = new sap.ui.model.Filter("ProductName", sap.ui.model.FilterOperator.EQ, array[i]);
				filtersTitle.push(oFilters1);
			};
			var that = this;
			this.getView().getModel().read("/ep_under_hfgSet", {
				filters: filtersTitle,
				success: function (oData) {
					main_globalme.ep_under_rm_hfg.refresh(true);
					main_globalme.ep_under_rm_hfg.setData(oData.results);
					oTable.setModel(main_globalme.ep_under_rm_hfg, 'ep_under_rm_hfg');
					/*that.oData = oData.results;
					that.json = new sap.ui.model.json.JSONModel();
					that.json.setData({
						path: that.oData
					});
					oTable.setModel(that.json);
					oTable.bindAggregation("items", {
						path: "/path",
						template: oTemplate,
						growing: "true"
					});*/
					that.getView().byId("idTablePanel").addContent(oTable);

					that.bindcolor();
					that.ClearSorting();
				}
			});

		},

		awaiting_vps: function () {
			this.getView().byId("idTablePanel").removeAllContent();
			this.getView().byId("Default").setType("Default");
			this.getView().byId("awaRmApproval").setType("Default");
			this.getView().byId("awaHfgApproval").setType("Default");
			this.getView().byId("Ready_EP").setType("Default");
			this.getView().byId("Queue_EP").setType("Default");
			this.getView().byId("vp_awaiting").setType("Emphasized");
			this.getView().byId("requestep").setVisible(false);
			this.getView().byId("deleteep").setVisible(false);
			var filtersTitle = [];
			var that = this;
			if (!this.pen_vp) {
				this.pen_vp = sap.ui.xmlfragment("epdash.epdash.view.pending_vps", this);
				this.getView().addDependent(this.pen_vp);
			}
			var oTable = sap.ui.getCore().byId("pending_vp_tab");
			var oItem = sap.ui.getCore().byId("pending_vp_item");
			for (var i = 0; i < array.length; i++) {
				var oFilters = new sap.ui.model.Filter("ProductName", sap.ui.model.FilterOperator.EQ, array[i]);
				filtersTitle.push(oFilters);

			};
			this.getView().getModel().read("/pending_vp_codelineSet", {
				filters: filtersTitle,
				success: function (oData) {
					that.oData = oData.results;
					that.json = new sap.ui.model.json.JSONModel();
					that.json.setData({
						path: that.oData
					});
					oTable.setModel(that.json);
					oTable.bindAggregation("items", {
						path: "/path",
						template: oItem,
						growing: "true"
					});
					that.getView().byId("idTablePanel").addContent(that.pen_vp);
				}
			});

		},

		onPressCodeline_In_Process: function (oEvent, setModel, a_sync) {
			var oPanel = this.getView().byId("idTablePanel");

			var oTable1 = this.getView().byId("idEPTable");
			if (setModel === "true") {
				oPanel.removeAllContent();
				shortEP = [];
				this.showBusyIndicator(3000, 0);
				oTable1.unbindAggregation();
				this.getView().byId("idProductsTable").setVisible(false);
				this.getView().byId("idProductsTable23").setVisible(false);
				this.getView().byId("requestep").setVisible(false);
				this.getView().byId("deleteep").setVisible(false);
				this.getView().byId("Ready_EP").setType("Emphasized");
				this.getView().byId("Default").setType("Default");
				this.getView().byId("awaRmApproval").setType("Default");
				this.getView().byId("awaHfgApproval").setType("Default");
				this.getView().byId("Queue_EP").setType("Default");
				if (this.getView().byId("vp_awaiting").getVisible() == true) {
					this.getView().byId("vp_awaiting").setType("Default");
				}
				var deletechildpanel = this.getView().byId("dispalydelete");
				deletechildpanel.setVisible(false);
				//	this.getView().byId("footer").setVisible(true);

				this.getView().byId("StatusEPNew").setIcon("sap-icon://sort");
				this.getView().byId("StatusEPNew").setPressed(false);
			}

			var filtersTitle = [];
			for (var i = 0; i < array.length; i++) {
				var oFilters = new sap.ui.model.Filter("ProductName", sap.ui.model.FilterOperator.EQ, array[i]);
				filtersTitle.push(oFilters);
			};
			if (a_sync === undefined) {
				a_sync = false;
			}
			var that = this;
			main_globalme.codeline_line_model = new sap.ui.model.json.JSONModel();
			this.getView().setModel(main_globalme.codeline_line_model, 'codeline_in_process');
			this.getView().getModel().read("/codeline_in_processSet", {
				filters: filtersTitle,
				success: function (oData) {
					main_globalme.codeline_line_model.refresh(true);
					main_globalme.codeline_line_model.setData(oData.results);
					oTable1.setModel(main_globalme.codeline_line_model, 'codeline_in_process');
					sap.ui.getCore().setModel(main_globalme.codeline_line_model, 'codeline_in_process');
					if (setModel === "true") {
						oTable1.setVisible(true);
						oPanel.addContent(oTable1);
						that.bindcolor1();
						that.ClearSorting();
					}
				},
				async: a_sync
			});
		},
		onPress_Assembly_in_Queue: function () {
			shortEP = [];
			this.showBusyIndicator(2000, 0);
			this.getView().byId("idTablePanel").removeAllContent();
			this.getView().byId("idProductsTable").setVisible(false);
			this.getView().byId("idProductsTable23").setVisible(false);
			this.getView().byId("idEPTable").setVisible(false);
			this.getView().byId("Default").setType("Default");
			this.getView().byId("awaRmApproval").setType("Default");
			this.getView().byId("awaHfgApproval").setType("Default");
			this.getView().byId("Ready_EP").setType("Default");
			this.getView().byId("Queue_EP").setType("Emphasized");
			if (this.getView().byId("vp_awaiting").getVisible() == true) {
				this.getView().byId("vp_awaiting").setType("Default");
			}
			var oPanel = this.getView().byId("idTablePanel");
			oPanel.setVisible(true);
			this.getView().byId("EP_req_table").setVisible(true);
			this.getView().byId("EP_req_tabledelete").setVisible(true);
			this.getView().byId("deleteep").setVisible(true);
			this.getView().byId("dispalydelete").setVisible(true);
			//	this.getView().byId("footer").setVisible(false);
			var requestpanel = this.getView().byId("requestep");
			requestpanel.setVisible(true);
			var deletedpanel = this.getView().byId("deleteep");
			deletedpanel.setVisible(true);
			var EPdeltable = this.getView().byId("EP_req_tabledelete");
			var EPdeleteCol = this.getView().byId("coloumidEP_del");
			var oTable = this.getView().byId("EP_req_table");
			var oTemplate = this.getView().byId("coloumidEP_req");
			var that = this;
			var filtersTitle = [];
			for (var i = 0; i < array.length; i++) {
				var oFilters = new sap.ui.model.Filter("ProductName", sap.ui.model.FilterOperator.EQ, array[i]);
				filtersTitle.push(oFilters);
			};
			this.getView().getModel().read("/assem_in_queueSet", {
				filters: filtersTitle,
				success: function (oData) {
					var result = oData.results;
					that.oData = oData.results;
					that.json = new sap.ui.model.json.JSONModel();
					that.json.setData({
						path: that.oData
					});
					oTable.setModel(that.json);
					oTable.bindAggregation("items", {
						path: "/path",
						template: oTemplate,
						growing: "true"
					});
					oPanel.addContent(requestpanel);
					that.bindcolorassem_queue();
					let items = oTable.getModel().getData().path;
					if (items.length !== 0) {
						for (var i = 0; i < items.length; i++) {
							if (items[i].TriggerType === 'R') {
								that.getView().byId("moveReuseProj").setVisible(true);
								break;
							}
							that.getView().byId("moveReuseProj").setVisible(false);
						}
					} else {
						that.getView().byId("moveReuseProj").setVisible(false);
					}
				},
				async: false

			});
			this.getView().getModel().read("/finished_assemblySet", { //delete_request_epsSet
				filters: filtersTitle,
				success: function (oData) {
					that.oData = oData.results;
					that.json = new sap.ui.model.json.JSONModel();
					that.json.setData({
						path: that.oData
					});
					EPdeltable.setVisible(true);
					EPdeltable.setModel(that.json);
					EPdeltable.bindAggregation("items", {
						path: "/path",
						template: EPdeleteCol,
						growing: "true"
					});
				},
				async: false
			});
			that._getStatus_of_form();
			//

			//
		},
		getGroupHeader_for_codeline_tab: function (oGroup) {
			return new sap.m.GroupHeaderListItem({
				title: oGroup.key,
				upperCase: false
			});
		},
		onFilter_del_tab_Click: function (oID) {

		},
		moveReuseToCompletedList: function (oEvent) {
			let context = main_globalme.getView().byId('EP_req_table').getSelectedContexts();
			var items = context.map(function (c) {
				return c.getObject();
			});
			if (items.length === 0) {
				sap.m.MessageBox.error(
					"Kindly select the REUSE component to move to completed List"
				);
			}
			for (var i = 0; i < items.length; i++) {
				if (items[i].TriggerType !== 'R') {
					sap.m.MessageBox.error(
						"Please select only REUSE triggers"
					);
					break;
				} else if (items[i].TriggerType === 'R') {
					var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/BRLT/PRODUCT_CATOGRY_DETAIL_SRV/");
					var oParameter = {
						"ProductId": items[i].ProductId,
						"ProductTriggerId": items[i].ProductTriggerId,
						"EpRequestId": items[i].EpRequestId,
						"SpsName": items[i].SpsName
					};
					main_globalme.oGlobalBusyDialog.open();
					oModel.remove("/reuse_manual_moveSet(ProductId='" + oParameter.ProductId + "',ProductTriggerId='" +
						oParameter.ProductTriggerId + "',EpRequestId='" + oParameter.EpRequestId + "',SpsName='" + oParameter.SpsName +
						"')", {
							success: function (oData) {
								main_globalme.getView().byId("reuse_start_assem").setEnabled(false);
								main_globalme.onPress_Assembly_in_Queue();
								sap.m.MessageToast.show('Project moved to Completed list');
							},
							async: false
						});
					main_globalme.onPress_Assembly_in_Queue();
					main_globalme.oGlobalBusyDialog.close();
				}
			}

			//	var items = this.getView().byId('EP_req_table').getModel().getProperty(oEvent.getSource().getParent().getBindingContext().getPath());
		},
		onFilterInvoices: function (oEvent) {
			var that = this;
			var sQuery = oEvent.getParameter("query");
			var oView = this.getView();
			var id = this.getView().byId("idTablePanel").getContent()[0].sId.split("--")[1];
			var oTable = oView.byId(id);
			var oBinding = oTable.getBinding("items");
			if (sQuery) {
				var filters = new Array();
				var oFilter = new sap.ui.model.Filter("EpRequestId", sap.ui.model.FilterOperator.EQ, sQuery);
				filters.push(oFilter);
				//get list created in view
				oBinding.filter(filters);
				if (id == 'idProductsTable') {
					that.bindcolor();
				} else if (id == 'idEPTable') {
					that.bindcolor1();
				};
			} else {
				var filtersTitle = [];
				that.oData = null;
				for (var i = 0; i < array.length; i++) {
					if (id == "idProductsTable") {
						var oFilters = new sap.ui.model.Filter("ProdVersName", sap.ui.model.FilterOperator.EQ, array[i]);
						filtersTitle.push(oFilters);
					};

					if (id == "idEPTable") {
						var oFilters = new sap.ui.model.Filter("SpsName", sap.ui.model.FilterOperator.EQ, array[i]);
						filtersTitle.push(oFilters);
					};
				}

				oBinding.filter(filtersTitle);
				if (id == 'idProductsTable') {
					that.bindcolor();
				} else if (id == 'idEPTable') {
					that.bindcolor1();
				};
			};
		},
		onPressAccept: function (event) {

			MessageToast.show(event.getSource().getText());
			var oTable = this.getView().byId("idProductsTable");
			oTable.getSelectedItems();
			var contexts = oTable.getSelectedContexts();
			var items = contexts.map(function (c) {
				return c.getObject();
			});
			var that = this;
			this.getView().getModel().read("/assembly_selected_dataSet", null, null, false, function (oData) {
				grID = oData.results[0].ProductTriggerId;
				for (var i = 0; i < items.length; i++) {
					var oParameter = {
						"ProductTriggerId": grID,
						"EpRequestId": items[i].EpRequestId,
						"ProdVersName": items[i].ProdVersName,
						"HotfixId": items[i].HotfixId,
						"Requester": items[i].Requester,
						"HeaderStatus": items[i].HeaderStatus,
						"ApproverRm": items[i].ApproverRm,
						"StatusRm": items[i].StatusRm,
						"ApproverHf": items[i].ApproverHf,
						"StatusHf": items[i].StatusHf,
						"BusinessReason": items[i].BusinessReason,
						"Details": items[i].Details,
						"Status": items[i].Status,
						"CodelineType": items[i].CodelineType,
						"SpsName": items[i].SpsName
					};
					that.getView().getModel().create("/assembly_selected_dataSet", oParameter);
				};
			});
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("detail");
		},
		startReusePatchAssembly: function (oEvent) {
			// Regreshing the Codeline_in_process table(EP in Process)	
			main_globalme.oGlobalBusyDialog.open();
			this.onPressCodeline_In_Process('', "false", false);
			main_globalme.oGlobalBusyDialog.close();
			////
			this.reuse_items_list;
			var items_list = [];
			var items = this.getView().byId('EP_req_table').getModel().getProperty(oEvent.getSource().getParent().getBindingContext().getPath());
			items_list.push(items);
			this.reuse_items_list = items;
			var sps_name = items.SpsName;
			var codeline_type = items.CodelineType;
			var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/BRLT/PRODUCT_CATOGRY_DETAIL_SRV/");
			var prod_name = items.ProductName;
			let reuse_p_collection_product = this.getModel('reuse_component').getData().ROLE;
			/*let refreshed_products = (reuse_p_collection_product.filter(c => {
				return c.Generated_Product === prod_name
			}));
			let reuse_prod_name = refreshed_products[0].Generated_Product;*/
			let codelineType = items.CodelineType;

			let all_codeline_ready_for_del = main_globalme._getReuseProductDetails(sps_name, codelineType);

			if (!this.trigger_assembly_dialog) {
				this.trigger_assembly_dialog = sap.ui.xmlfragment("epdash.epdash.view.AssemblyTrigger", this);

			}
			this.execute_reuse_assembly = 'true';
			// var resuse_model = new sap.ui.model.json.JSONModel({
			// 	"reuse_trigger": "true"
			// });
			// this.trigger_assembly_dialog.setModel(resuse_model, "resuse_model");
			if (all_codeline_ready_for_del.length > 0) {
				// if (items_list[0].CvoiFlag === '') {
				// 	this._check_special_case_for_products(items_list[0], items_list, this.trigger_assembly_dialog, all_codeline_ready_for_del);
				// } else {
				main_globalme._open_confirm_dialog_to_add_reuse(items_list, all_codeline_ready_for_del);
				// }

			} else {
				main_globalme._execute_reuse_independently(items);
			}
		},
		_getReuseProductDetails: function (sps_name, codeline_type) {

			var all_codeline_list = main_globalme.getView().getModel('codeline_in_process').getData();

			let all_codeline_ready_for_del = all_codeline_list.filter(c => {
				return c.SpsName === sps_name
			}).filter(c => {
				return c.Status === '61'
			}).filter(c => {
				return c.CodelineType === codeline_type
			});
			return all_codeline_ready_for_del;
		},
		_execute_reuse_independently: function (items) {
			//	main_globalme._createReuseProject(items, "");
			var items_array = [items];
			main_globalme._createReuseProject(items_array, "");
		},
		_open_confirm_dialog_to_add_reuse: function (items, code_ready_for_del) {
			let assem_table = sap.ui.getCore().byId("assemblyreq");
			let code_ready_for_del_with_cvoi_flag = code_ready_for_del.filter(c => {
				return c.CvoiFlag === ''
			});
			let add_codeline = new sap.m.Dialog({
				title: 'Confirm',
				type: 'Message',
				content: new sap.m.Text({
					text: 'There is an additional EP with "Ready for Delivery" Status in "EP in Process" tab. \n Would you link to merge with this trigger?'
				}),
				beginButton: new sap.m.Button({
					text: 'Yes',
					press: function () {
						//below methods will execute assembly and trigger and convert reuse to standerd 
						if ((main_globalme.cl_products_flag.ProductConstants.filter(c => c.ProductName === items[0].ProductName).filter(c => c.ProductConstants ===
								'9').length >= 1) && (items[0].Urgency === main_globalme.cl_products_flag.Urgency_EO ||
								items[0].Urgency === main_globalme.cl_products_flag.Urgency_NS) && code_ready_for_del_with_cvoi_flag.length >= 1) {
							var oModelJ = new sap.ui.model.json.JSONModel({
								"sales": code_ready_for_del
							});
							assem_table.setModel(oModelJ, "assembly_info");
							main_globalme._check_special_case_for_cvoi_flag(items, code_ready_for_del, assem_table);
							add_codeline.close();
						} else {
							sap.m.MessageToast.show('Submit Yes!');
							var oModelJ = new sap.ui.model.json.JSONModel({
								"sales": code_ready_for_del
							});
							assem_table.setModel(oModelJ, "assembly_info");
							add_codeline.close();
							main_globalme._open_assembly_form(code_ready_for_del[0].ProductName, code_ready_for_del[0].SpsName, code_ready_for_del[
								0].CodelineType);
						}

					}
				}),
				endButton: new sap.m.Button({
					text: 'No',
					press: function () {
						var oModelJ = new sap.ui.model.json.JSONModel({
							"sales": items
						});
						/////////// No dialogue for userinput/////////////
						main_globalme._createReuseProject(items, code_ready_for_del);
						/////////////////////////////////////////////////
						add_codeline.close();

						//assem_table.setModel(oModelJ, "assembly_info");
						//add_codeline.close();
						//main_globalme._open_assembly_form(items[0].ProductName, items[0].SpsName, items[0].CodelineType);
					}
				})
			});

			add_codeline.open();
		},
		_getcompRel_reuse: function (items) {
			let sps_name = items[0].SpsName;
			let comp_id = items[0].CompId;
			var aFilter = [];
			var oFilters1 = new sap.ui.model.Filter("SpsName", sap.ui.model.FilterOperator.EQ, sps_name);
			aFilter.push(oFilters1);
			var oFilters2 = new sap.ui.model.Filter("EpRequestId", sap.ui.model.FilterOperator.EQ, items[0].EpRequestId);
			aFilter.push(oFilters2);
			var oFilters3 = new sap.ui.model.Filter("g_product_name", sap.ui.model.FilterOperator.EQ, items[0].ProductName);
			aFilter.push(oFilters3);
			main_globalme.oModel.read("/reuse_fetch_comp_relSet", {
				filters: aFilter,
				success: function (oData) {
					// update reuse table with comp_id and comp_rel
				},
				error: function () {}
			});
			main_globalme._start_reuse_trigger_pqp_workflow(compId, compRel);
		},
		_createReuseProject: function (items, code_ready_for_del) {
			//main_globalme._getcompRel_reuse(items);  "uncomment once fn module moved to HFS"
			var compRel = {
				compRel: ""
			};
			main_globalme.assembly_trigged_id = "Reuse Project Log for Trigger ID = " + items[0].ProductId + items[0].ProductTriggerId;
			var compRelModel = new JSONModel(compRel);
			main_globalme.getView().setModel(compRelModel, 'compRel');
			var compRelDialog = new Dialog({
				title: 'Confirm',
				type: 'Message',
				content: [
					new HorizontalLayout({
						content: [
							new VerticalLayout({
								width: '120px',
								content: [
									new Text({
										text: 'Component ID:'
									}),
									new Text({
										text: 'Component Release:'
									})
								]
							}),
							new VerticalLayout({
								content: [
									new Text({
										text: items[0].CompId
									}),
									new Input('compRel', {
										width: '100%',
										type: 'Text',
										placeholder: 'enter Component Release',
										value: ''
									})
								]
							})
						]
					}),

				],
				beginButton: new Button({
					text: 'Submit',
					press: function (oData) {
						var compId = items[0].CompId;
						var compRel = sap.ui.getCore().byId('compRel').getValue();
						if (compRel === '') {
							sap.m.MessageBox.error(
								"Component Release input is mandatory"
							);
						} else {
							main_globalme._start_reuse_trigger_pqp_workflow(compId, compRel, items[0]);
							compRelDialog.close();
						}

					}
				}),
				endButton: new Button({
					text: 'Cancel',
					press: function () {
						compRelDialog.close();
					}
				}),
				afterClose: function () {
					compRelDialog.destroy();
				}
			});

			compRelDialog.open();
		},
		_start_reuse_trigger_pqp_workflow: function (compId, compRel, items) {

			main_globalme._start_pqp_workflow_automatically('', '', compId, compRel, items);
		},
		onPressTriggerAssembly: function () {
			this.showBusyIndicator(4000, 0);
			var that = main_globalme;
			//	that._hotlinerUpdate("CLOUD");
			var oTable1 = this.getView().byId("idEPTable");
			oTable1.getSelectedItems();
			var contexts = oTable1.getSelectedContexts();
			var selected_items = contexts.map(function (c) {
				return c.getObject();
			});
			if (selected_items.length === 0) {
				sap.m.MessageBox.error(
					"Kindly select some Codeline."
				);
			} else {
				let items = this._updateDowtimeforItems(selected_items);
				//get all sps which is of same type of sps and status equal to 61 of same codeline type 
				let code_ready_for_del = (oTable1.getModel('codeline_in_process').getData().filter(c => {
					return c.SpsName === items[0].SpsName
				})).filter(c => {
					return c.Status === '61'
				}).filter(c => {
					return c.CodelineType === items[0].CodelineType
				});
				//////
				if (!this.trigger_assembly_dialog) {
					this.trigger_assembly_dialog = sap.ui.xmlfragment("epdash.epdash.view.AssemblyTrigger", this);
				}

				switch (items.length) {

				case 1:
					if (items[0].Status !== '61') {
						sap.m.MessageBox.error(
							"Trigger not possible because EP's Status is not 'Ready for Delivery'."
						);
					} else if (code_ready_for_del.length !== items.length) {
						if (items[0].CvoiFlag === '') {
							this._check_special_case_for_products(items[0], items, this.trigger_assembly_dialog, code_ready_for_del);
						} else {
							main_globalme._open_confirm_dialog_to_add(items, code_ready_for_del);
						}

					} else {
						this._check_special_case_for_products(items[0], items, this.trigger_assembly_dialog, code_ready_for_del);
					}
					break;
				case 0:
					sap.m.MessageBox.error(
						"Kindly select some Codeline."
					);
					break;
				default:
					//get unique sps
					let all_sps = items.map(function (item) {
						return item.SpsName;
					});
					let unique_sps = Array.from(new Set(all_sps));

					if (unique_sps.length > 1) {
						sap.m.MessageBox.error(
							"Kindly select same SPS Version."
						);
					} else {
						let all_status = items.map(function (item) {
							return item.Status;
						});
						let unique_status = Array.from(new Set(all_status));
						if (unique_status.length > 1) {
							sap.m.MessageBox.error(
								"Trigger not possible because atleast one of the EP's Status is not 'Ready for Delivery."
							);
						} else {
							let all_codeline = items.map(function (item) {
								return item.CodelineType;
							});
							let unique_codelinetype = Array.from(new Set(all_codeline));
							if (unique_codelinetype.length > 1) {
								sap.m.MessageBox.error(
									"Trigger not possible ,Please select same Codeline Type!!."
								);
							} else {
								if (unique_status[0] !== '61') {
									sap.m.MessageBox.error(
										"Reminder not possible because EP's Status is not 'Ready for Delivery'."
									);
								} else if (code_ready_for_del.length !== items.length) {
									main_globalme._open_confirm_dialog_to_add(items, code_ready_for_del);
								} else {
									main_globalme._check_special_case_for_products(items[0], items, this.trigger_assembly_dialog, code_ready_for_del);
								}
							}
						}
					}
					break;
				}
			}

		},

		_check_special_case_for_products: function (item_obj, items, assem_trigger_dialog, code_ready_for_del) {
			// 	let code_ready_for_del_with_cvoi_flag = code_ready_for_del.filter(c => {
			// 	return c.CvoiFlag === ''
			// });
			let code_ready_for_del_with_cvoi_flag_f_buss_f = code_ready_for_del.filter(c =>
				c.CvoiFlag === ''
			).filter(c => c.EvBusinessDown === '');
			let code_ready_for_del_with_cvoi_flag_t_buss_t = code_ready_for_del.filter(c =>
				c.CvoiFlag === 'X'
			).filter(c => c.EvBusinessDown === 'X');
			let code_ready_for_del_with_cvoi_flag_f_buss_t = code_ready_for_del.filter(c =>
				c.CvoiFlag === ''
			).filter(c => c.EvBusinessDown === 'X');

			let assem_table = sap.ui.getCore().byId("assemblyreq");
			if ((main_globalme.cl_products_flag.ProductConstants.filter(c => c.ProductName === item_obj.ProductName).filter(c => c.ProductConstants ===
					'9').length >= 1) && (item_obj.Urgency === main_globalme.cl_products_flag.Urgency_LS || item_obj.Urgency === main_globalme.cl_products_flag
					.Urgency_EO ||
					item_obj.Urgency === main_globalme.cl_products_flag.Urgency_NS) && (code_ready_for_del_with_cvoi_flag_f_buss_f.length >= 1 ||
					code_ready_for_del_with_cvoi_flag_t_buss_t.length >= 1 || code_ready_for_del_with_cvoi_flag_f_buss_t.length >= 1)) {
				// if ((main_globalme.cl_products_flag.ProductConstants.filter(c => c.ProductName === item_obj.ProductName).filter(c => c.ProductConstants ===
				// 		'9').length >= 1) && (item_obj.Urgency === main_globalme.cl_products_flag.Urgency_LS || item_obj.Urgency === main_globalme.cl_products_flag
				// 		.Urgency_EO ||
				// 		item_obj.Urgency === main_globalme.cl_products_flag.Urgency_NS) && code_ready_for_del_with_cvoi_flag.length >= 1) {
				main_globalme.Toast_Msg;
				main_globalme.Dialog_Msg;
				if (code_ready_for_del_with_cvoi_flag_f_buss_f.length > 0) {
					main_globalme.Toast_Msg = 'Assembly Trigger for Downtime = False , Online Depl(CVOI) = False   !!';
					main_globalme.Dialog_Msg =
						'One or more EP mentioned below has Online Depl(CVOI) = "False" , Downtime = "False".Please Check and proceed further!!';
				} else if (code_ready_for_del_with_cvoi_flag_t_buss_t.length > 0) {
					main_globalme.Toast_Msg = 'Assembly Trigger for Downtime = True , Online Depl(CVOI) = True   !!';
					main_globalme.Dialog_Msg =
						'One or more EP mentioned below has Downtime = "True" , Online Depl(CVOI) = "True" .Please Check and proceed further!!';
				} else if (code_ready_for_del_with_cvoi_flag_f_buss_t.length > 0) {
					main_globalme.Toast_Msg = 'Assembly Trigger for Online Depl(CVOI) = False , Downtime = True !!';
					main_globalme.Dialog_Msg =
						'One or more EP mentioned below has Downtime = "True" , Online Depl(CVOI) = "False" .Please Check and proceed further!!';
				}
				sap.m.MessageToast.show(main_globalme.Toast_Msg);
				let all_cvoi_flag = items.map(function (item) {
					return item.CvoiFlag;
				});
				let unique_cvoi_flag = Array.from(new Set(all_cvoi_flag));

				//if (unique_cvoi_flag.length > 1 || unique_cvoi_flag[0] === '') {
				var oModelJ = new sap.ui.model.json.JSONModel({
					"sales": items
				});
				assem_table.setModel(oModelJ, "assembly_info");
				var dialog = new sap.m.Dialog({
					title: 'Confirm',
					type: 'Message',
					contentWidth: "auto",
					contentHeight: "auto",
					resizable: true,
					draggable: true,
					content: [new sap.m.Text({
							text: main_globalme.Dialog_Msg + "\n\n"
						}),
						assem_table
					],
					beginButton: new sap.m.Button({
						text: 'Confirm',
						press: function () {
							sap.m.MessageToast.show('Submit pressed!');
							if (code_ready_for_del.length !== items.length) {
								main_globalme._open_confirm_dialog_to_add(items, code_ready_for_del);
							} else {
								main_globalme._open_assembly_form(item_obj.ProductName, item_obj.SpsName, item_obj.CodelineType);
							}

							dialog.close();
						}
					}),
					endButton: new sap.m.Button({
						text: 'Cancel',
						press: function () {
							dialog.close();
						}
					})
				});

				dialog.open();

				// } else {
				// 	//open_assembly form
				// 	main_globalme._check_special_case_for_cvoi_flag(items, code_ready_for_del, assem_table);
				// }
			} else if ((main_globalme.cl_products_flag.ProductConstants.filter(c => c.ProductName === item_obj.ProductName).filter(c => c.ProductConstants ===
					'8').length >= 1)) {
				sap.m.MessageToast('Assembly Trigger for DownTime Flag true!!');

			} else {
				//open assembly form
				if (code_ready_for_del.length !== items.length) {
					main_globalme._open_confirm_dialog_to_add(items, code_ready_for_del);
				} else {
					var oModelJ = new sap.ui.model.json.JSONModel({
						"sales": items
					});
					assem_table.setModel(oModelJ, "assembly_info");
					main_globalme._open_assembly_form(item_obj.ProductName, item_obj.SpsName, item_obj.CodelineType);
				}
			}
		},

		_check_special_case_for_cvoi_flag: function (items, code_ready_for_del, assem_table) { //Logic for https://sapjira.wdf.sap.corp/browse/QGPAOFBACKLOG-2086

			// let code_ready_for_del_with_cvoi_flag = code_ready_for_del.filter(c => {
			// 	return c.CvoiFlag === ''
			// });
			// let code_ready_for_del_without_cvoi_flag = code_ready_for_del.filter(c => {
			// 	return c.CvoiFlag === 'X'
			// });
			let code_ready_for_del_with_cvoi_flag_f_buss_f = code_ready_for_del.filter(c =>
				c.CvoiFlag === ''
			).filter(c => c.EvBusinessDown === '');
			let code_ready_for_del_with_cvoi_flag_t_buss_t = code_ready_for_del.filter(c =>
				c.CvoiFlag === 'X'
			).filter(c => c.EvBusinessDown === 'X');
			let code_ready_for_del_with_cvoi_flag_f_buss_t = code_ready_for_del.filter(c =>
				c.CvoiFlag === ''
			).filter(c => c.EvBusinessDown === 'X');

			main_globalme.Toast_Msg;
			main_globalme.Dialog_Msg;
			if (code_ready_for_del_with_cvoi_flag_f_buss_f.length > 0) {
				main_globalme.Toast_Msg = 'Assembly Trigger for Downtime = False Online Depl(CVOI) = False  !!';
				main_globalme.Dialog_Msg =
					'One or more EP mentioned below has Downtime = "False" , Online Depl(CVOI) = "False" .Please Check and proceed further!!';
			} else if (code_ready_for_del_with_cvoi_flag_t_buss_t.length > 0) {
				main_globalme.Toast_Msg = 'Assembly Trigger for  Downtime = True ,Online Depl(CVOI) = True  !!';
				main_globalme.Dialog_Msg =
					'One or more EP mentioned below has Downtime = "True" , Online Depl(CVOI) = "True".Please Check and proceed further!!';
			} else if (code_ready_for_del_with_cvoi_flag_f_buss_t.length > 0) {
				main_globalme.Toast_Msg = 'Assembly Trigger for Downtime = True , Online Depl(CVOI) = False  !!';
				main_globalme.Dialog_Msg =
					'One or more EP mentioned below has  Downtime = "True" , Online Depl(CVOI) = "False".Please Check and proceed further!!';
			}

			if (code_ready_for_del_with_cvoi_flag_f_buss_f.length >= 1 || code_ready_for_del_with_cvoi_flag_t_buss_t.length >= 1 ||
				code_ready_for_del_with_cvoi_flag_f_buss_t.length >= 1) {
				let add_codeline_special = new sap.m.Dialog({
					title: 'Confirm',
					type: 'Message',
					content: [new sap.m.Text({
							text: main_globalme.Dialog_Msg + "\n\n"
						}),
						assem_table
					],
					beginButton: new sap.m.Button({
						text: 'Yes',
						press: function () {
							var oModelJ = new sap.ui.model.json.JSONModel({
								"sales": code_ready_for_del
							});
							assem_table.setModel(oModelJ, "assembly_info");
							add_codeline_special.close();
							main_globalme._open_assembly_form(code_ready_for_del[0].ProductName, code_ready_for_del[0].SpsName, code_ready_for_del[
								0].CodelineType);
						}
					}),
					endButton: new sap.m.Button({
						text: 'No',
						press: function () {
							// var oModelJ = new sap.ui.model.json.JSONModel({
							// 	"sales": code_ready_for_del_without_cvoi_flag
							// });
							// assem_table.setModel(oModelJ, "assembly_info");
							add_codeline_special.close();
							// main_globalme._open_assembly_form(code_ready_for_del_without_cvoi_flag[0].ProductName,
							// 	code_ready_for_del_without_cvoi_flag[0].SpsName, code_ready_for_del_without_cvoi_flag[0].CodelineType);
						}
					})
				});

				add_codeline_special.open();
			}

		},

		_open_confirm_dialog_to_add: function (items, code_ready_for_del) {
			let assem_table = sap.ui.getCore().byId("assemblyreq");
			let code_ready_for_del_with_cvoi_flag = code_ready_for_del.filter(c => {
				return c.CvoiFlag === ''
			});
			let add_codeline = new sap.m.Dialog({
				title: 'Confirm',
				type: 'Message',
				content: new sap.m.Text({
					text: 'There is an additional EP with same SPS in "Ready for Delivery" Status. \n Would you link to include?'
				}),
				beginButton: new sap.m.Button({
					text: 'Yes',
					press: function () {
						if ((main_globalme.cl_products_flag.ProductConstants.filter(c => c.ProductName === items[0].ProductName).filter(c => c.ProductConstants ===
								'9').length >= 1) && (items[0].Urgency === main_globalme.cl_products_flag.Urgency_EO ||
								items[0].Urgency === main_globalme.cl_products_flag.Urgency_NS) && code_ready_for_del_with_cvoi_flag.length >= 1) {
							var oModelJ = new sap.ui.model.json.JSONModel({
								"sales": code_ready_for_del
							});
							assem_table.setModel(oModelJ, "assembly_info");
							main_globalme._check_special_case_for_cvoi_flag(items, code_ready_for_del, assem_table);
							add_codeline.close();
						} else {
							sap.m.MessageToast.show('Submit Yes!');
							var oModelJ = new sap.ui.model.json.JSONModel({
								"sales": code_ready_for_del
							});
							assem_table.setModel(oModelJ, "assembly_info");
							add_codeline.close();
							main_globalme._open_assembly_form(code_ready_for_del[0].ProductName, code_ready_for_del[0].SpsName, code_ready_for_del[
								0].CodelineType);
						}

					}
				}),
				endButton: new sap.m.Button({
					text: 'No',
					press: function () {
						var oModelJ = new sap.ui.model.json.JSONModel({
							"sales": items
						});
						assem_table.setModel(oModelJ, "assembly_info");
						add_codeline.close();
						main_globalme._open_assembly_form(items[0].ProductName, items[0].SpsName, items[0].CodelineType);
					}
				})
			});

			add_codeline.open();
		},

		_open_assembly_form: function (ProductName, SpsName, CodelineType) {
			if (!this.assem_step) {
				this.assem_step = sap.ui.xmlfragment("epdash.epdash.view.template_assem_trigger", this);
				this.getView().addDependent(this.assem_step);
			}
			var filterY = [];
			var filter = new sap.ui.model.Filter("ProductId", sap.ui.model.FilterOperator.EQ, ProductName);
			var filterSPS = new sap.ui.model.Filter("SpsName", sap.ui.model.FilterOperator.EQ, SpsName);
			var filterCtype = new sap.ui.model.Filter("CodelineType", sap.ui.model.FilterOperator.EQ, CodelineType);
			filterY.push(filter, filterSPS, filterCtype);

			var that = this;
			var oTab = sap.ui.getCore().byId("itemassemb");
			var oTemplate = sap.ui.getCore().byId("itemstepcoloum");
			this.showBusyIndicator(2000, 0);
			this.getView().getModel().read("/step_in_assemblySet", {
				filters: filterY,
				success: function (oData) {
					if (oData.results.length !== 0) {
						that.oData = oData.results;
						that.json = new sap.ui.model.json.JSONModel();
						that.json.setData({
							path: that.oData
						});
						oTab.setModel(that.json);
						oTab.bindAggregation("items", {
							path: "/path",
							template: oTemplate,
							growing: "true"
						});
						that.assem_step.open();
						sap.ui.getCore().byId("assemblyconfirm").setEnabled(true);
					} else {
						that.procced_assembly();
					}
				},
				async: true

			});

			//Trigger assembly direct without Form
			//	that.procced_assembly();

		},
		change_form: function () {

		},
		procced_assembly: function (oEv) {
			var that = this;
			var oTableItem = sap.ui.getCore().byId("itemassemb");
			var form_date = [];
			var form_obj;
			for (var i = 0; i < oTableItem.getItems().length; i++) {
				var path = oTableItem.getItems()[i].getBindingContext().sPath;
				var enable = oTableItem.getItems()[i].getCells()[1].getState();
				if (enable === true) {
					form_obj = {
						"ProductId": oTableItem.getModel().getProperty(path).ProductId,
						"Phase": oTableItem.getModel().getProperty(path).Phase,
						"ItemId": oTableItem.getModel().getProperty(path).ItemId,
						"mandatory_field": oTableItem.getModel().getProperty(path).mandatory_field,
						"System_id": oTableItem.getModel().getProperty(path).System_id,
						"Client": oTableItem.getModel().getProperty(path).Client,
						"phase_searial_num": oTableItem.getModel().getProperty(path).phase_searial_num,
						"searil_num_clnt": oTableItem.getModel().getProperty(path).searil_num_clnt,
						"trigger_own_comment": oTableItem.getItems()[i].getCells()[4].getValue()
					}
					form_date.push(form_obj);
				}
			}
			this.form_model = new sap.ui.model.json.JSONModel();
			this.form_model.setData({
				path: form_date
			});
			//	this.getView().setModel(this.form_model,"trigger_model");
			var contextselection = oTableItem.getSelectedContexts();
			selectedItems = contextselection.map(function (c) {
				return c.getObject();
			});
			this.assem_step.close();
			this.assem_step.destroy();
			this.assem_step = undefined;

			let oTable = sap.ui.getCore().byId("assemblyreq");
			var filtersTitle = [];
			let items = oTable.getModel('assembly_info').getData()['sales'];
			var filterYear = new sap.ui.model.Filter("SpsName", sap.ui.model.FilterOperator.EQ, items[0].SpsName);
			var filtersid = new sap.ui.model.Filter("SourceSystemId", sap.ui.model.FilterOperator.EQ, items[0].SourceSystemId);
			//EEP MODEL SETTINGFOR DIALOG
			let urgency_filter_LOW = items.filter(c => c.Urgency === '1');
			let urgency_filter_EEP = items.filter(c => c.Urgency === '3');
			let urgency_filter_NSD = items.filter(c => c.Urgency === '5');
			let oModel_EEP = new sap.ui.model.json.JSONModel();
			if (urgency_filter_LOW.length >= 1 || urgency_filter_EEP.length >= 1 || urgency_filter_NSD.length >= 1) {
				oModel_EEP.setData({
					eep_visible: 'true'
				});
			} else {
				oModel_EEP.setData({
					eep_visible: 'false'
				});
			}
			this.trigger_assembly_dialog.setModel(oModel_EEP, 'oModel_eep');
			this.getView().setModel(oModel_EEP, 'oModel_eep');
			//
			filtersTitle.push(filterYear, filtersid);
			var oModel = this.getView().getModel();
			this.showBusyIndicator(3000, 0);

			oModel.read("/assembly_last_statusSet", {
				filters: filtersTitle,
				success: function (oData) {
					if (oData.results[0].Status == '30' || oData.results[0].Status == '40') {
						/////////////////////////////////
						main_globalme.oGlobalBusyDialog.open();
						that.get_downtimeInfo(oTable);
						main_globalme.oGlobalBusyDialog.close();
						//////////////////////////////////
						if (that.trigger_assembly_dialog.getContent()[0].getContent().length === 3) {
							let oForm = that.trigger_assembly_dialog.getContent()[0].getContent()[1];
							let oText_Area = that.trigger_assembly_dialog.getContent()[0].getContent()[2];
							that.trigger_assembly_dialog.getContent()[0].removeContent(1);
							that.trigger_assembly_dialog.getContent()[0].removeContent(1);
							that.trigger_assembly_dialog.getContent()[0].addContent(oTable);
							that.trigger_assembly_dialog.getContent()[0].addContent(oForm);
							that.trigger_assembly_dialog.getContent()[0].addContent(oText_Area);
						}
						that.trigger_assembly_dialog.open();
						//	sap.ui.core.BusyIndicator.hide();
					} else {

						var dialogsend = new sap.m.Dialog({
							resizable: true,
							draggable: true,
							contentWidth: "576px",
							contentHeight: "66px",
							title: 'Attention !!',
							type: 'Message',
							content: new sap.m.Text({
								text: 'Previous patch collection status is still not set to successful or complete. \nAre you sure you want to trigger next patch assembly ?'
							}),
							leftButton: new sap.m.Button({
								text: 'Yes, I checked manually and OK to trigger',
								type: "Accept",
								width: "275px",
								tooltip: "Yes, I checked manually and OK to trigger",
								press: function () {
									dialogsend.close();
									that.showBusyIndicator(2000, 0);
									that.get_downtimeInfo(oTable);
									that.trigger_assembly_dialog.open();
								}
							}),
							rightButton: new sap.m.Button({
								text: 'No, I don’t want to trigger assembly',
								type: "Reject",
								width: "275px",
								tooltip: 'No, I don’t want to trigger assembly',
								press: function () {
									dialogsend.close();
									//	that.confirmdialog.destroy();
								}
							}),
							afterClose: function () {
								dialogsend.destroy();
							}
						});

						dialogsend.open();

					}
				},
				error: function () {
					//	that.trigger_assembly_dialog.open();
					sap.m.MessageToast.show('Failed to read last assembly status');
				},
				async: false

			});
		},
		get_downtimeInfo: function (oTable) {
			var batchChanges = [];
			var downtime_obj = {};
			var downtime_array = [];
			let codeline_type;
			main_globalme.assemb_table_downtime = oTable;
			main_globalme.showBusyIndicator(3000, 0);
			var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/BRLT/PQP_PROJECT_DETAIL_SRV/");
			var items = oTable.getModel('assembly_info').getData()['sales'];
			for (var i = 0; i < oTable.getItems().length; i++) {

				codeline_type = items[i].CodelineType;

				var sps = items[i].SpsName.replace(/ /g, "%20");
				var path = "/update_downtime_infoSet(EpRequestId='" + items[i].EpRequestId +
					"',SpsName='" + sps +
					"',HotfixId='" + items[i].HotfixId + "',CodelineType='" + codeline_type + "',ProductName='" + items[i].ProductName.replace(
						/ /g,
						"%20") + "')";
				batchChanges.push(oModel.createBatchOperation(path, "GET"));
			};

			if (batchChanges.length !== 0) {
				oModel.addBatchReadOperations(batchChanges);
				oModel.submitBatch(function (data) {
						//	console.log(data);
						for (var i = 0; i < main_globalme.assemb_table_downtime.getItems().length; i++) {
							downtime_obj = {
								"EpRequestId": items[i].EpRequestId,
								"SpsName": items[i].SpsName,
								"HotfixId": items[i].HotfixId,
								"FinalASystem": items[i].FinalASystem,
								"CodelineType": codeline_type,
								"Status": items[i].Status,
								"EvBusinessDown": data.__batchResponses[i].data.EvBusinessDown,
								"CvoiFlag": items[i].CvoiFlag,
								"HeaderStatus": items[i].HeaderStatus,
								"Urgency": items[i].Urgency,
								"Sid": items[i].Sid,
								"ProductName": items[i].ProductName,
								"CollectionSystemRole": items[i].CollectionSystemRole

							}
							downtime_array.push(downtime_obj);
						};
						var oTemplate = sap.ui.getCore().byId("assemblycolo");
						//	var oTable = sap.ui.getCore().byId("assemblyreq");
						//	main_globalme.assemb_table_downtime.unbindAggregation();

						main_globalme.assemb_table_downtime.getModel("assembly_info").setData({
							"sales": downtime_array
						});

						main_globalme.assemb_table_downtime.bindItems("assembly_info>/sales", oTemplate);

					}, function (err) {
						alert("Error while reading downtime Infomation .\nKindly trigger again or Refresh the whole page!! ");
					},
					false);
			}

		},

		_updateDowtimeforItems: function (Items) {
			var batchChanges = [];
			var downtime_obj = {};
			var downtime_array = [];
			let codeline_type;
			main_globalme.oGlobalBusyDialog.open();
			var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/BRLT/PQP_PROJECT_DETAIL_SRV/");
			for (var i = 0; i < Items.length; i++) {

				codeline_type = Items[i].CodelineType;

				var sps = Items[i].SpsName.replace(/ /g, "%20");
				var path = "/update_downtime_infoSet(EpRequestId='" + Items[i].EpRequestId +
					"',SpsName='" + sps +
					"',HotfixId='" + Items[i].HotfixId + "',CodelineType='" + codeline_type + "',ProductName='" + Items[i].ProductName.replace(
						/ /g,
						"%20") + "')";
				batchChanges.push(oModel.createBatchOperation(path, "GET"));
			};

			if (batchChanges.length !== 0) {
				oModel.addBatchReadOperations(batchChanges);
				oModel.submitBatch(function (data) {
						//	console.log(data);
						for (var i = 0; i < Items.length; i++) {
							downtime_obj = Items[i];
							if (data.__batchResponses[i].data.EvBusinessDown === 'true') {
								downtime_obj.EvBusinessDown = 'X';
							} else {
								downtime_obj.EvBusinessDown = '';
							}

							downtime_array.push(downtime_obj);
						}
						main_globalme.oGlobalBusyDialog.close();
					}, function (err) {
						alert("Error while reading downtime Infomation .\nKindly trigger again or Refresh the whole page!! ");
						main_globalme.oGlobalBusyDialog.close();
					},
					false);
			}
			return downtime_array;
		},

		onaddrowsassem: function (oEv) {
			var oTableItem = sap.ui.getCore().byId("itemassemb");
			var oTemplate = sap.ui.getCore().byId("itemstepcoloum");
			var oModel = oTableItem.getModel().getProperty("/");
			var path = oEv.getSource().getParent().getBindingContext().sPath;
			var location = (parseFloat(oEv.getSource().getId().split("-itemassemb-")[1]) + 1);
			var dialog = new sap.m.Dialog({
				title: 'Phase Discription',
				type: 'Message',
				content: [new sap.m.TextArea('discription', {
						width: '100%',
						placeholder: 'Phase name maximum 255 Char....'
					}),
					new sap.m.TextArea('ItemId', {
						width: '100%',
						placeholder: 'Comment (Optional)....'
					})
				],
				beginButton: new sap.m.Button({
					text: 'OK',
					press: function () {

						var oNewObject = {
							"ProductId": oTableItem.getModel().getProperty(path).ProductId,
							"Phase": sap.ui.getCore().byId('discription').getValue(),
							"mandatory_field": '',
							"System_id": '',
							"Client": '',
							"phase_searial_num": (parseFloat(oTableItem.getModel().getProperty('/').path[oTableItem.getItems().length - 1].phase_searial_num) +
								1).toString(),
							"searil_num_clnt": '',
							"ItemId": '',
							"trigger_own_comment": sap.ui.getCore().byId('ItemId').getValue()
						};
						//	oModel.push(oNewObject);
						oModel.path.splice(location, 0, oNewObject);
						this.json = new sap.ui.model.json.JSONModel();
						this.json.setData({
							path: oModel.path
						});
						oTableItem.setModel(this.json);
						//  oTableItem.getModel().setProperty("/", oModel.path);
						dialog.close();
					}
				}),
				endButton: new sap.m.Button({
					text: 'Cancel',
					press: function () {
						dialog.close();
					}
				}),
				afterClose: function () {
					dialog.destroy();
				}
			});

			dialog.open();
			//	oTextA.addStyleClass("innerareaadd");

		},

		cancel_assembly: function () {
			this.assem_step.close();
			this.assem_step.destroy();
			this.assem_step = undefined;
		},
		// Sending Mail
		cancelcallAssemblyTrigger: function () {
			this.trigger_assembly_dialog.close();
			//	this.confirmdialog.destroy();
		},

		callAssemblyTrigger: function (oEvent) {
			//	var check_reuse = this.trigger_assembly_dialog.getModel('resuse_model');
			main_globalme.showBusyIndicator(3000, 0);
			if (this.execute_reuse_assembly === 'true') {
				this.execute_reuse_assembly = undefined;
				this._reuseCallAssemblyTrigger(this.reuse_items_list);

				this.reuse_items_list = undefined;
			} else {
				sap.ui.getCore().byId("assemblyconfirm").setEnabled(false);
				var oMessage = sap.ui.getCore().byId("assemblyinp").getValue();
				var that = this;
				if (this.getView().byId("rot").getText() == "" && this.getView().byId("rotback").getText() == "" && this.getView().byId("blr").getText() ==
					"" && this.getView().byId("blrback").getText() == "" && this.getView().byId("can").getText() == "" && this.getView().byId(
						"canback").getText() == "") {
					var dialog = new sap.m.Dialog({
						title: 'Error',
						type: 'Message',
						content: new sap.m.Text({
							text: 'Hotliner detail are missing in the DashBoard!\n\n Mail Will be Send to DL AOF CLOUD PATCH ASSEMBLY \n\n\n Please Confirm!!!'

						}),
						beginButton: new sap.m.Button({
							text: 'Send',
							press: function () {
								dialog.close();
								that._trigger_assembly();
							}
						}),
						endButton: new sap.m.Button({
							text: 'Cancel',
							press: function () {
								dialog.close();
							}
						}),
						afterClose: function () {
							dialog.destroy();
						}
					});

					dialog.open();

				} else {
					this._trigger_assembly();
				}
			}
		},

		_reuseCallAssemblyTrigger: function (reuse_items_list) {
			var items = this.assemb_table_downtime.getModel('assembly_info').getData().sales;
			var batch_for_assembly = [];
			var oModel = this.getView().getModel();
			for (var i = 0; i < items.length; i++) {
				if (items[i].EvBusinessDown === 'true') {
					items[i].EvBusinessDown = '1';
				} else {
					items[i].EvBusinessDown = '0';
				}
				if (items[i].FinalASystem === 'No Syste') {
					items[i].FinalASystem = 'NA';
				}
				var oParameter = {
					"ProductId": reuse_items_list.ProductId,
					"ProductTriggerId": reuse_items_list.ProductTriggerId,
					"EpRequestId": items[i].EpRequestId,
					"SpsName": items[i].SpsName,
					"EvBusinessDown": items[i].EvBusinessDown,
					"FinalASystem": items[i].FinalASystem,
					"HotfixId": items[i].HotfixId,
					"CodelineType": items[i].CodelineType,
					"HeaderStatus": items[i].HeaderStatus,
				};
				var ProductId = reuse_items_list.ProductId;
				var ProductTriggerId = reuse_items_list.ProductTriggerId;
				var EpRequestId = items[i].EpRequestId;
				var HeaderStatus = items[i].HeaderStatus;
				var HotfixId = items[i].HotfixId;
				//	batch_for_assembly.push(oModel.createBatchOperation("/trigger_assemblySet", "PUT", oParameter));
				batch_for_assembly.push(oModel.createBatchOperation("/trigger_assemblySet(ProductId='" + ProductId + "',ProductTriggerId='" +
					ProductTriggerId + "',EpRequestId='" + EpRequestId + "',HeaderStatus='" + HeaderStatus + "',HotfixId='" + HotfixId + "')",
					"PUT", oParameter));
				oParameter = {};
			}
			/*let final_assembly_system = items[0].FinalASystem;
			var oMessage = sap.ui.getCore().byId("assemblyinp").getValue();
			var assembly_admin_data = {
				"ProductId": reuse_items_list.ProductId,
				"ProductTriggerId": reuse_items_list.ProductTriggerId,
				"TriggerComment": oMessage
			};
			that.getView().getModel().create("/assem_admin_dataSet", assembly_admin_data, {
				success: function (oData, response) {

				},
				error: function (err) {
					sap.m.MessageBox.error(
						"Error while saving admin data!!", {
							styleClass: bCompact ? "sapUiSizeCompact" : ""
						}
					);
				},
				async: false
			});*/

			if (batch_for_assembly.length !== 0) {
				oModel.addBatchChangeOperations(batch_for_assembly);
				oModel.submitBatch(function (data) {
					main_globalme.assembly_trigged_id = "Reuse assembly started with trigger ID = " + reuse_items_list.ProductId +
						reuse_items_list
						.ProductTriggerId;
				}, function (err) {
					alert("Error occurred ");
				}, false);
			}
			//trigger mails for assembly and set job
			//	window.setTimeout(that._trigger_mail_and_start_pqp_workflow_automatically(that.PID, EPgrID, items, eep_status,
			//	final_assembly_system),
			//	50);
			///////
			oReuseParams = {
				"CProductId": reuse_items_list.ProductId,
				"CProductTriggerId": reuse_items_list.ProductTriggerId
			};
			oModel.update("/reuse_patch_collectionSet(PProductTriggerId='" + ' ' + "',PProductId='" + ' ' + "',EpRequestId='" + "" + "')",
				oReuseParams, {
					success: function (oData) {
						let msg = "Reuse Trigger changed to Standard Trigger!!";
						//trigger assembly automatically
						main_globalme.trigger_assembly_dialog.close();
						//update table 
						main_globalme.onPress_Assembly_in_Queue();
						//////////
						//Start PQP Workflow immediatly
						items[0].FinalASystem = 'HVF';
						if (items[0].FinalASystem === "") {
							sap.m.MessageBox.success(msg + "\n But Final Assembly System is missing!!\nPlease start assembly manually.");
						} else {
							main_globalme._start_pqp_workflow_automatically(items[0].FinalASystem, msg, '', '');
						}

						////////////////////////////
					},
					error: function () {

					},
					async: false
				});

			//Saving  selected items for each Trigger by HFG Member
			if (main_globalme.saveForm !== "false") {
				main_globalme.save_assembly_form(); //save form after selection
			}
			main_globalme.saveForm = "true";
			//get role of user
			main_globalme._getRole_for_user();
		},
		//logic to find entry of reuse codeline in trigger 
		_trigger_assembly: function () {
			var items = [];
			var Path;
			this.showBusyIndicator(3000, 0);
			var oTableAssem = sap.ui.getCore().byId("assemblyreq");
			var oMessage = sap.ui.getCore().byId("assemblyinp").getValue();
			let eep_status;
			if (this.getView().getModel('oModel_eep').getData().eep_visible === 'true') {
				eep_status = sap.ui.getCore().byId("get_eep_mail_confirmation").getSelected();
			} else {
				eep_status = false;
			}

			for (var i = 0; i < oTableAssem.getItems().length; i++) {
				Path = oTableAssem.getItems()[i].getBindingContext("assembly_info").sPath;
				items.push(oTableAssem.getModel("assembly_info").getProperty(Path));

			}
			////
			this.trigger_assembly_dialog.close();
			//	this.confirmdialog.destroy();
			if (!this.trigger_assembly_dialog == true) {
				that.trigger_assembly_dialog.close();
			}
			this.getView().byId("idTablePanel").removeAllContent();
			var oTemplate = this.getView().byId("coloumidEP_req");
			var oTable = this.getView().byId("EP_req_table");
			var EPdeltable = this.getView().byId("EP_req_tabledelete");
			var EPdeleteCol = this.getView().byId("coloumidEP_del");
			var that = this;
			var filterpush = [];
			var oFilters = new sap.ui.model.Filter("ProductName", sap.ui.model.FilterOperator.EQ, items[0].ProductName);
			filterpush.push(oFilters);
			this.PID;
			this.getView().getModel().read("/generate_trigger_idSet('" + items[0].ProductName + "')", {
				success: function (oData) {
					that.PID = oData.Product_id;
					EPgrID = oData.Product_trigger_id;
				},
				error: function (error) {

				},
				async: false
			});
			//find reuse patch collection entry
			///***********uncommment block in HFD release *************** I344811
			// *************************Block to check reuse assembly ********************** I344811
			let return_val = this._find_resuse_patch_collection_entry(items, that.PID, EPgrID, oMessage, eep_status);
			let collection_item_count = 0;
			if (return_val.execute_reuse_trigger === false) {
				//*************************Block to check reuse assembly **********************
				sap.m.MessageToast.show("Normal Trigger !!"); // standerd process 
				main_globalme._final_execution_of_assembly_with_all_user_setting(items, that.PID,
					EPgrID, oMessage, eep_status); // standerd process 
				//*************************Block to check reuse assembly **********************
			} else if (return_val.execute_reuse_trigger === true) {
				main_globalme._final_execution_of_assembly_with_all_user_setting(items, that.PID, EPgrID, oMessage, eep_status);
				let trigger_reuse = 0;
				let pop_dialog = return_val.found_entry_in_assembly_in_queue;
				var count_true = pop_dialog.reduce(function (n, val) {
					return n + (val === "true");
				}, 0);
				for (let k = 0; k <= return_val.found_entry_in_assembly_in_queue.length; k++) {
					if ((return_val.found_entry_in_assembly_in_queue[k] === "") || (return_val.found_entry_in_assembly_in_queue[k] === "false") || (
							return_val.found_entry_in_assembly_in_queue[k] === undefined)) { /// no entry found in assembly queue  //intially it was false
						sap.m.MessageToast.show("Reuse Trigger Type .\nNo entry found in Assembly in Queue with Generated SPS Name!!");
						//	main_globalme._final_execution_of_assembly_with_all_user_setting(items, that.PID, EPgrID, oMessage, eep_status); //execute for parent trigger with mail
						if (trigger_reuse === 0) {
							main_globalme._trigger_resue_patch_collection(return_val.collection, that.PID, EPgrID); //save and entry for reuse
							trigger_reuse = trigger_reuse + 1;
						}
					} else {
						sap.m.MessageToast.show("Reuse Trigger Type .\nEntry found in Assembly in Queue with Generated SPS Name!!");
						main_globalme._check_for_reuse_prods_to_include(
							return_val, items, that.PID, EPgrID, oMessage, eep_status, count_true);
						count_true = count_true - 1;
					}
				}
				/*if ((return_val.found_entry_in_assembly_in_queue === "") || (return_val.found_entry_in_assembly_in_queue === "false")) { /// no entry found in assembly queue  //intially it was false
					sap.m.MessageToast.show("Reuse Trigger Type .\nNo entry found in Assembly in Queue with Generated SPS Name!!");

					main_globalme._final_execution_of_assembly_with_all_user_setting(items, that.PID, EPgrID, oMessage, eep_status); //execute for parent trigger with mail

					main_globalme._trigger_resue_patch_collection(return_val.collection, that.PID, EPgrID); //save and entry for reuse
				} else {
					main_globalme._final_execution_of_assembly_with_all_user_setting(items, that.PID, EPgrID, oMessage, eep_status); //execute for parent trigger with mail
					sap.m.MessageToast.show("Reuse Trigger Type .\nEntry found in Assembly in Queue with Generated SPS Name!!");
					main_globalme._check_for_reuse_prods_to_include(
						return_val, items, that.PID, EPgrID, oMessage, eep_status);
				}*/
			}

			////***********************uncommment block after HFD release *************** I344811
			//*************************Block to check reuse assembly ********************** I344811
			//	final execution of assembly with mail trigger

		},
		_update_reuse_table_fields: function (g_productName, ep_request_id, Parent_ProductId, Parent_TriggeredId, g_sps_name, g_codelineType,
			return_val) {
			var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/BRLT/PRODUCT_CATOGRY_DETAIL_SRV/");
			let oParameter = {
				"g_product_name": g_productName,
				"EpRequestId": ep_request_id,
				"PProductId": Parent_ProductId,
				"PProductTriggerId": Parent_TriggeredId,
				"CProductId": return_val.Data.child_product_id,
				"CProductTriggerId": return_val.Data.child_product_tri_id,
				"SpsName": g_sps_name,
				"CodelineType": g_codelineType
			};
			oModel.create("/reuse_table_fill_jobSet", oParameter, {
				success: function (oData) {
					sap.m.MessageToast.show('Reuse Table updated successfully');
				},
				error: function (oData) {

				},
				async: true
			});
		},
		_final_execution_of_assembly_with_all_user_setting: function (items, PID, EPgrID, oMessage, eep_status) {
			var batch_for_assembly = [];
			var oModel = this.getView().getModel();
			for (var i = 0; i < items.length; i++) {
				if (items[i].EvBusinessDown === 'true') {
					items[i].EvBusinessDown = '1';
				} else {
					items[i].EvBusinessDown = '0';
				}
				if (items[i].FinalASystem === 'No Syste') {
					items[i].FinalASystem = 'NA';
				}
				var oParameter = {
					"ProductId": PID,
					"ProductTriggerId": EPgrID,
					"EpRequestId": items[i].EpRequestId,
					"SpsName": items[i].SpsName,
					"EvBusinessDown": items[i].EvBusinessDown,
					"FinalASystem": items[i].FinalASystem,
					"HotfixId": items[i].HotfixId,
					"CodelineType": items[i].CodelineType,
					"HeaderStatus": items[i].HeaderStatus,
					//	"CollectionSystemRole": items[i].CollectionSystemRole
				};
				batch_for_assembly.push(oModel.createBatchOperation("/trigger_assemblySet", "POST", oParameter));
				oParameter = {};
			}
			let final_assembly_system = items[0].FinalASystem;
			var assembly_admin_data = {
				"ProductId": PID,
				"ProductTriggerId": EPgrID,
				"TriggerComment": oMessage
			};
			this.getView().getModel().create("/assem_admin_dataSet", assembly_admin_data, {
				success: function (oData, response) {

				},
				error: function (err) {
					sap.m.MessageBox.error(
						"Error while saving admin data!!", {
							styleClass: bCompact ? "sapUiSizeCompact" : ""
						}
					);
				},
				async: false
			});

			if (batch_for_assembly.length !== 0) {
				oModel.addBatchChangeOperations(batch_for_assembly);
				oModel.submitBatch(function (data) {
					main_globalme.assembly_trigged_id = "Assembly Triggerd Successfully with ID = " + PID + EPgrID;
				}, function (err) {
					alert("Error occurred ");
				}, false);
			}
			//trigger mails for assembly and set job
			window.setTimeout(this._trigger_mail_and_start_pqp_workflow_automatically(PID, EPgrID, items, eep_status,
				final_assembly_system), 50);
			///////
			//trigger assembly automatically
			//	window.setTimeout(that._start_pqp_workflow_automatically(final_assembly_system), 60);
			//
			//Saving  selected items for each Trigger by HFG Member
			if (this.saveForm !== "false") {
				this.save_assembly_form(); //save form after selection
			}
			this.saveForm = "true";
			//get role of user
			this._getRole_for_user();

		},

		skip_assembly_form: function () {
			this.saveForm = "false";
			this.procced_assembly();
		},

		save_assembly_form: function () {
			var oModel = this.getView().getModel();
			var oSelectedItem = {};
			var batchItem = [];
			if (this.form_model.getData().path.length !== 0) {
				for (var i = 0; i < this.form_model.getData().path.length; i++) {
					oSelectedItem = {
						"SerialNum": i,
						"ProductTriggerId": EPgrID,
						"ProductId": this.PID,
						"Phase": this.form_model.getData().path[i].Phase,
						"ItemId": this.form_model.getData().path[i].ItemId,
						"SystemId": this.form_model.getData().path[i].System_id,
						"Client": this.form_model.getData().path[i].Client,
						"CommentByUser": this.form_model.getData().path[i].trigger_own_comment

					};
					batchItem.push(oModel.createBatchOperation("/item_status_projectSet", "POST", oSelectedItem));
					oSelectedItem = {};
				};
				//	that.form_model.setData().path("");
				//	selectedItems = [];
				oModel.addBatchChangeOperations(batchItem);
				oModel.submitBatch(function (data) {
						//	oModel.refresh();
					},
					function (err) {

					}, false);
			}
		},
		_getRole_for_user: function () {
			if (main_globalme.hfg_member === "false" && main_globalme.assembly_member === 'true') {
				this.onPress_Assembly_in_Queue();
			} else if (main_globalme.hfg_member === "false" && main_globalme.assembly_member === 'false' && main_globalme.rm_member ===
				'false') {
				this.onPressDefault();
			} else if (main_globalme.hfg_member === "false" && main_globalme.rm_member === 'true') {
				this.onPressRM_Approval();
			} else if (main_globalme.hfg_member === "true") {
				this.onPressHFG_Approval();
			}
		},
		_calculate_cases_for_items: function (object) {
			var str = object.CollectionSystemRole;
			if (str.indexOf(' ') >= 0) {
				var obj_list = str.split(" ");
			}
			switch (object.ProductName) {
			case "S4HANA CLOUD":
				if (object.CollectionSystemRole.includes('SCP_ABAP')) {
					return '4';
				} else if (object.CollectionSystemRole.includes('IBP_OD')) {
					return '3';
				} else if (object.CollectionSystemRole.includes('DWC')) {
					return '5';
				} else {
					return null;
				}
				break;
			case "SAPA1S":
				/*if ((object.CollectionSystemRole.includes('COD') === true || object.CollectionSystemRole.includes('C4C') === true) &&
					(object.CollectionSystemRole.includes('BYD') === false && object.CollectionSystemRole.includes('TEM') === false && object.CollectionSystemRole
						.includes('FAP') === false)) {
					return '1';
				} else if ((object.CollectionSystemRole.includes('COD') === true || object.CollectionSystemRole.includes('C4C') === true) &&
					(object.CollectionSystemRole.includes('BYD') === true || object.CollectionSystemRole.includes('TEM') === true || object.CollectionSystemRole
						.includes('FAP') === true)) {
					return '2';*/
				if (object.CollectionSystemRole.includes('COD') === true || object.CollectionSystemRole.includes('C4C') === true) {
					return '1';
				} else {
					return null;
				}
				break;
			default:
				return null;
				break;
			}
		},

		_calcualte_codeline_for_reuse: function (items) {
			let gen_prod = [];
			let gen_index = [];
			let collection = [];
			let child_prod_id = [];
			let child_trig_id = [];
			let reuse_p_collection_product = this.getModel('reuse_component').getData().ROLE;
			let collection_obj = {};
			let case_list = [];
			let obj = {
				CollectionSystemRole: ''
			};
			//changes here
			for (var t in items) {
				if ((items[t].CollectionSystemRole.includes('COD') === true || items[t].CollectionSystemRole.includes('C4C') === true) &&
					(items[t].CollectionSystemRole.includes('BYD') === false && items[t].CollectionSystemRole.includes('TEM') === false && items[t].CollectionSystemRole
						.includes('FAP') === false)) {
					gen_prod.push(reuse_p_collection_product.filter(c => c.key == 1)[0].Generated_Product);
					gen_index.push(t);
				} else if ((items[t].CollectionSystemRole.includes('COD') === true || items[t].CollectionSystemRole.includes('C4C') === true) &&
					(items[t].CollectionSystemRole.includes('BYD') === true || items[t].CollectionSystemRole.includes('TEM') === true || items[t].CollectionSystemRole
						.includes('FAP') === true)) {
					gen_prod.push(reuse_p_collection_product.filter(c => c.key == 1)[0].Generated_Product);
					gen_index.push(t);
				}
			}
			for (var i in items) {
				let find_cases = [];
				var str = items[i].CollectionSystemRole;
				// changes here
				if (str.indexOf(' ') >= 0 && !(gen_index.includes(i))) {
					case_list = str.split(" ");
				} else {
					case_list = [];
					case_list.push(items[i].CollectionSystemRole);
				}
				//	let find_cases = this._calculate_cases_for_items(items[i]);
				for (var k = 0; k < case_list.length; k++) {
					obj.CollectionSystemRole = case_list[k];
					obj.ProductName = items[i].ProductName;
					let ifReuseObj = this._calculate_cases_for_items(obj);
					if (ifReuseObj !== null) {
						find_cases.push(ifReuseObj);
					}
				}
				if (find_cases.length > 0) {
					for (var l = 0; l < find_cases.length; l++) {
						if (find_cases.length > 0) {
							//items[i].CollectionSystemRole = case_list[l];

							var data = {
								"CodelineType": items[i].CodelineType,
								"CollectionSystemRole": case_list[l],
								"CvoiFlag": items[i].CvoiFlag,
								"EpRequestId": items[i].EpRequestId,
								"EvBusinessDown": items[i].EvBusinessDown,
								"FinalASystem": items[i].FinalASystem,
								"HeaderStatus": items[i].HeaderStatus,
								"HotfixId": items[i].HotfixId,
								"ProductName": items[i].ProductName,
								"Sid": items[i].Sid,
								"SpsName": items[i].SpsName,
								"Status": items[i].Status,
								"Urgency": items[i].Urgency,
								"child_product_id": "",
								"child_product_tri_id": ""

							};
							let refreshed_products = reuse_p_collection_product.filter(c => c.key === find_cases[l]);
							collection_obj = {
								"g_ProductName": refreshed_products[0].Generated_Product,
								//	"Data": items[i],
								"Data": data,
								"Component_ID": refreshed_products[0].Component_ID
							};
							collection.push(collection_obj);
							if (find_cases.length > 1) {
								/*	filtersTitle = [];
									var oFilters1 = new sap.ui.model.Filter("SpsName", sap.ui.model.FilterOperator.EQ, collection[l].Data.SpsName);
									filtersTitle.push(oFilters1);
									var oFilters2 = new sap.ui.model.Filter("g_product_name", sap.ui.model.FilterOperator.EQ, collection[l].g_ProductName);
									filtersTitle.push(oFilters2);
									var oFilters3 = new sap.ui.model.Filter("CodelineType", sap.ui.model.FilterOperator.EQ, collection[l].Data.CodelineType);
									filtersTitle.push(oFilters3);
									main_globalme.getView().getModel().read("/reuse_patch_collectionSet", {
										filters: filtersTitle,
										success: function (oData) {
											return_parameter.execute_reuse_trigger = true;
											//	return_parameter.collection = collection;
											if (oData.results.length !== 0) {
												return_parameter[l].genrated_sps = oData.results[0].SpsName;
												return_parameter.fas_s[l] = oData.results[0].FinalASystem;
												return_parameter.found_entry_in_assembly_in_queue[l] = oData.results[0].return;
												//		return_parameter.child_product_id = oData.results[0].CProductId;
												//		return_parameter.child_product_tri_id = oData.results[0].CProductTriggerId;
												child_prod_id.push(oData.results[0].CProductId);
												child_trig_id.push(oData.results[0].CProductTriggerId);
											}

										},
										error: function () {},
										async: false
									});*/
							}
						}
					}
				}
			}
			//	collection.Data.child_product_id = child_prod_id;
			//	collection.Data.child_product_tri_id = child_trig_id;
			return collection;

		},
		_find_resuse_patch_collection_entry: function (items, ProductId, TriggeredId, oMessage, eep_status) {
			let find_codeline_required_for_reuse = this._calcualte_codeline_for_reuse(items);
			let genrated_sps = [],
				fas_s = [],
				found_entry_in_assembly_in_queue = [],
				child_product_id = [],
				child_product_tri_id = [];
			let return_parameter = {
				execute_reuse_trigger: "",
				collection: "", // main selected items , with selected sps
				genrated_sps: "", // crossponding generated SPS name 
				fas_s: "", // crossponding final a system for generated SPS name 
				found_entry_in_assembly_in_queue: "",
				child_product_id: "",
				child_product_tri_id: ""
			};
			let collection = find_codeline_required_for_reuse;
			if (collection.length > 0) {
				for (let l = 0; l < collection.length; l++) {
					//validation here it find reuse is availabel in codelines
					filtersTitle = [];
					var oFilters1 = new sap.ui.model.Filter("SpsName", sap.ui.model.FilterOperator.EQ, collection[l].Data.SpsName);
					filtersTitle.push(oFilters1);
					var oFilters2 = new sap.ui.model.Filter("g_product_name", sap.ui.model.FilterOperator.EQ, collection[l].g_ProductName);
					filtersTitle.push(oFilters2);
					var oFilters3 = new sap.ui.model.Filter("CodelineType", sap.ui.model.FilterOperator.EQ, collection[l].Data.CodelineType);
					filtersTitle.push(oFilters3);
					main_globalme.getView().getModel().read("/reuse_patch_collectionSet", {
						filters: filtersTitle,
						success: function (oData) {
							return_parameter.execute_reuse_trigger = true;
							return_parameter.collection = collection;
							if (oData.results.length !== 0) {
								/*return_parameter.genrated_sps = oData.results[0].SpsName;
								return_parameter.fas_s = oData.results[0].FinalASystem;
								return_parameter.found_entry_in_assembly_in_queue = oData.results[0].return;
								return_parameter.child_product_id = oData.results[0].CProductId;
								return_parameter.child_product_tri_id = oData.results[0].CProductTriggerId;*/
								found_entry_in_assembly_in_queue.push(oData.results[0].return);
								genrated_sps.push(oData.results[0].SpsName);
								fas_s.push(oData.results[0].FinalASystem);
								child_product_id.push(oData.results[0].CProductId);
								child_product_tri_id.push(oData.results[0].CProductTriggerId);
								return_parameter.collection[l].Data.child_product_id = oData.results[0].CProductId;
								return_parameter.collection[l].Data.child_product_tri_id = oData.results[0].CProductTriggerId;
							}

						},
						error: function () {},
						async: false
					});
				}
				return_parameter.collection = collection;
				return_parameter.generated_sps = genrated_sps;
				return_parameter.found_entry_in_assembly_in_queue = found_entry_in_assembly_in_queue;
				return_parameter.fas_s = fas_s;
				return_parameter.child_product_id = child_product_id;
				return_parameter.child_product_tri_id = child_product_tri_id;
				return return_parameter;
			} else {
				/*let assem_in_que_list = main_globalme.getView().byId('EP_req_table').getModel().getData().path;
				let uniqueArray_que_list = []
				for (i = 0; i < assem_in_que_list.length; i++) {
					if (uniqueArray_que_list.indexOf(assem_in_que_list[i].SpsName) === -1) {
						uniqueArray_que_list.push(assem_in_que_list[i].SpsName);
					}
				}
				for (let k = 0; k < items.length; k++) {
					if (uniqueArray_que_list.includes(items[k].SpsName)) {
						var index = uniqueArray_que_list.indexOf(items[k].SpsName);
						if (index > -1) {
							uniqueArray_que_list.splice(index, 1);
						}
					}
				}*/
				return_parameter.execute_reuse_trigger = false;
				return return_parameter;
			};
		},

		_check_for_reuse_prods_to_include: function (return_val, items, parent_product_id, parent_product_trigger_id, oMessage,
			eep_status, count_true) {
			let child_productId = return_val.child_product_id;
			let child_TriggerId = return_val.child_product_tri_id;

			if (count_true === 1) {
				let display_val;
				let display_item = [];

				for (var i = 0; i < return_val.generated_sps.length; i++) {
					if (return_val.found_entry_in_assembly_in_queue[i] === 'true') {
						display_val = {
							"spsname": return_val.generated_sps[i],
							"c_prod_id": return_val.collection[i].Data.child_product_id,
							"c_trig_id": return_val.collection[i].Data.child_product_tri_id
						};
						display_item.push(display_val);
					}
				}
				var otoBeIncludedItems = new sap.ui.model.json.JSONModel({
					//	"items": return_val
					//"items": return_val.generated_sps
					"items": display_item
				});
				main_globalme.getView().setModel(otoBeIncludedItems, 'IncludedItems');
				pass_params = {
					"return_val": return_val,
					"items": items,
					"parent_product_id": parent_product_id,
					"parent_product_trigger_id": parent_product_trigger_id,
					"oMessage": oMessage,
					"eep_status": eep_status
				};
				var oToPassParams = new sap.ui.model.json.JSONModel({
					"values": pass_params
				});
				if (!main_globalme._oCheckToIncludeReuseDialog) {
					main_globalme._oCheckToIncludeReuseDialog = sap.ui.xmlfragment("epdash.epdash.view.checkToIncludeReuse", this);
				}
				main_globalme.getView().addDependent(main_globalme._oCheckToIncludeReuseDialog);
				main_globalme._oCheckToIncludeReuseDialog.setModel(oToPassParams, 'toPassParams');
				// toggle compact style
				jQuery.sap.syncStyleClass("sapUiSizeCompact", main_globalme.getView(), main_globalme._oCheckToIncludeReuseDialog);
				main_globalme._oCheckToIncludeReuseDialog.open();

				/*let add_reuse = new sap.m.Dialog({
					title: 'Confirm',
					type: 'Message',
					content: new sap.m.Text({
						text: "Atleast one of the selected codeline has reuse trigger type for which there is an ongoing assembly with below information.\n\n" +
							"SPS Name = " + return_val.genrated_sps + ".\n\n" +
							"Trigger ID = " + child_productId + child_TriggerId + ".\n\n" +
							"Would you like to include?"
					}),
					beginButton: new sap.m.Button({
						text: 'Yes',
						press: function () {
							sap.m.MessageToast.show('Pressed Yes!!');
							//	main_globalme._final_execution_of_assembly_with_all_user_setting(items, parent_product_id, parent_product_trigger_id,
							//		oMessage, eep_status);
							main_globalme._combineReuse_insideParent(return_val, parent_product_id, parent_product_trigger_id);
							for (let i = 0; i < return_val.collection.length; i++) {
								if (return_val.collection[i].Data.child_product_id != "") {
									main_globalme._create_releation_of_reuse(parent_product_id, parent_product_trigger_id, child_productId[i],
										child_TriggerId[i], return_val.collection[i]);
								}
							}
							add_reuse.close();
						}
					}),
					endButton: new sap.m.Button({
						text: 'No',
						press: function () {
							sap.m.MessageToast.show('Pressed No!!');
							//execute for parent trigger with mail
							main_globalme._final_execution_of_assembly_with_all_user_setting(items, parent_product_id, parent_product_trigger_id,
								oMessage, eep_status);
							//save and entry for reuse
							main_globalme._trigger_resue_patch_collection(return_val.collection, parent_product_id, parent_product_trigger_id);

							add_reuse.close();
						}
					})
				});
				add_reuse.open(); */
			}
		},
		onPressToIncludeReuse: function (oEvent) {
			let return_val = main_globalme._oCheckToIncludeReuseDialog.getModel('toPassParams').getData().values.return_val;
			let items = main_globalme._oCheckToIncludeReuseDialog.getModel('toPassParams').getData().values.items;
			let oMessage = main_globalme._oCheckToIncludeReuseDialog.getModel('toPassParams').getData().values.oMessage;
			let parent_product_id = main_globalme._oCheckToIncludeReuseDialog.getModel('toPassParams').getData().values.parent_product_id;
			let parent_product_trigger_id = main_globalme._oCheckToIncludeReuseDialog.getModel('toPassParams').getData().values.parent_product_trigger_id;
			let eep_status = main_globalme._oCheckToIncludeReuseDialog.getModel('toPassParams').getData().values.eep_status;
			main_globalme._combineReuse_insideParent(return_val, parent_product_id, parent_product_trigger_id);
			for (let i = 0; i < return_val.collection.length; i++) {
				if (return_val.collection[i].Data.child_product_id != "") {
					main_globalme._create_releation_of_reuse(parent_product_id, parent_product_trigger_id, return_val.collection[i].Data.child_product_id,
						return_val.collection[i].Data.child_product_tri_id, return_val.collection[i]);
				}
			}
			main_globalme._oCheckToIncludeReuseDialog.close();
		},
		onPressToCancelIncludeReuse: function (oEvent) {
			let return_val = main_globalme._oCheckToIncludeReuseDialog.getModel('toPassParams').getData().values.return_val;
			let items = main_globalme._oCheckToIncludeReuseDialog.getModel('toPassParams').getData().values.items;
			let oMessage = main_globalme._oCheckToIncludeReuseDialog.getModel('toPassParams').getData().values.oMessage;
			let parent_product_id = main_globalme._oCheckToIncludeReuseDialog.getModel('toPassParams').getData().values.parent_product_id;
			let parent_product_trigger_id = main_globalme._oCheckToIncludeReuseDialog.getModel('toPassParams').getData().values.parent_product_trigger_id;
			let eep_status = main_globalme._oCheckToIncludeReuseDialog.getModel('toPassParams').getData().values.eep_status;
			sap.m.MessageToast.show('Pressed No!!');
			//execute for parent trigger with mail
			main_globalme._final_execution_of_assembly_with_all_user_setting(items, parent_product_id, parent_product_trigger_id,
				oMessage, eep_status);
			//save and entry for reuse
			main_globalme._trigger_resue_patch_collection(return_val.collection, parent_product_id, parent_product_trigger_id);

			main_globalme._oCheckToIncludeReuseDialog.close();
		},
		_trigger_resue_patch_collection: function (collection, Parent_ProductId, Parent_TriggeredId) {
			let gen_prod = [];
			let gen_index = [];
			let reuse_p_collection_product = this.getModel('reuse_component').getData().ROLE;
			for (var t in collection) {
				if ((collection[t].Data.CollectionSystemRole.includes('COD') === true || collection[t].Data.CollectionSystemRole.includes('C4C') ===
						true) &&
					(collection[t].Data.CollectionSystemRole.includes('BYD') === false && collection[t].Data.CollectionSystemRole.includes('TEM') ===
						false &&
						collection[t].Data.CollectionSystemRole
						.includes('FAP') === false)) {
					gen_prod.push(reuse_p_collection_product.filter(c => c.key == 1)[0].Generated_Product);
					gen_index.push(t);
				} else if ((collection[t].Data.CollectionSystemRole.includes('COD') === true || collection[t].Data.CollectionSystemRole.includes(
							'C4C') ===
						true) &&
					(collection[t].Data.CollectionSystemRole.includes('BYD') === true || collection[t].Data.CollectionSystemRole.includes('TEM') ===
						true ||
						collection[t].Data.CollectionSystemRole
						.includes('FAP') === true)) {
					gen_prod.push(reuse_p_collection_product.filter(c => c.key == 1)[0].Generated_Product);
					gen_index.push(t);
				}
			}
			//// to avoid additional trigger id in assembly_queue for 2 reuse triggers with same system_role
			if (!(Array.isArray(collection))) {
				let coll = [];
				coll.push(collection);
				collection = coll;
			}
			let g_Child_ProductID, g_Child_TriggerID;
			let j = 0;
			var sys_role_list = [];
			var sys_role_list1 = [];
			var gen_prod_list = [];
			var gen_prod_list1 = [];
			for (let a in collection) {
				var str = collection[a].Data.CollectionSystemRole;
				if (str.indexOf(' ') >= 0 && !(gen_index.includes(a))) {
					var sys_role_list = str.split(" ");
				} else {
					sys_role_list.push(collection[a].Data.CollectionSystemRole);
					gen_prod_list.push(collection[a].g_ProductName);
				}
			}
			var uniqueArray_sysroles = [];
			var uniqueArray_sysroles1 = [];
			var uniqueArray_genprod = [];
			var uniqueArray_genprod1 = [];
			let trigger_array = [];
			let check_obj = {
				g_ProductName: '',
				Child_ProductID: '',
				Child_TriggerID: ''
			};
			// Loop through array values
			for (i = 0; i < sys_role_list.length; i++) {
				if (uniqueArray_sysroles.indexOf(sys_role_list[i]) === -1) {
					uniqueArray_sysroles.push(sys_role_list[i]);
				}
			}
			for (i = 0; i < gen_prod_list.length; i++) {
				if (uniqueArray_genprod.indexOf(gen_prod_list[i]) === -1) {
					uniqueArray_genprod.push(gen_prod_list[i]);
				}
			}
			for (let a in collection) {
				if (collection[a].Data.child_product_id === "") {
					//generate TriggerId
					let Child_ProductID, Child_TriggerID;
					if (collection[a].Data.CollectionSystemRole.indexOf(' ') >= 0 && !(gen_index.includes(a))) {
						var sys_role_list1 = collection[a].Data.CollectionSystemRole.split(" ");
						sublist_length = sys_role_list1.length;
					}
					/*if (sys_role_list1.length > 1) {
						for (i = 0; i < sys_role_list1.length; i++) {
							if (uniqueArray_sysroles1.indexOf(sys_role_list1[i]) === -1) {
								uniqueArray_sysroles1.push(sys_role_list1[i]);
							}
						}
						do {
							if (uniqueArray_sysroles1.includes(sys_role_list1[j])) {
								this.getView().getModel().read("/generate_trigger_idSet('" + collection[a].g_ProductName + "')", {
									success: function (oData) {
										Child_ProductID = oData.Product_id;
										Child_TriggerID = oData.Product_trigger_id;
										sap.m.MessageToast.show("Child Trigger ID = " + Child_ProductID + Child_TriggerID);
									},
									error: function (error) {

									},
									async: false
								});
								check_obj = {
									g_ProductName: collection[a].g_ProductName,
									Child_ProductID: Child_ProductID,
									Child_TriggerID: Child_TriggerID
								};
								trigger_array[a] = check_obj;
								uniqueArray_sysroles1 = uniqueArray_sysroles1.filter(item => item !== sys_role_list1[j]);
							} else {
								for (let i in trigger_array) {
									if (trigger_array[i].g_ProductName === collection[a].g_ProductName) {
										Child_ProductID = trigger_array[i].Child_ProductID;
										Child_TriggerID = trigger_array[i].Child_TriggerID;
									}
								}
							}
							j = j + 1
						} while (j == sublist_length - 1);

					} else {*/
					if (uniqueArray_sysroles.includes(collection[a].Data.CollectionSystemRole) && uniqueArray_genprod.includes(collection[a].g_ProductName)) {
						this.getView().getModel().read("/generate_trigger_idSet('" + collection[a].g_ProductName + "')", {
							success: function (oData) {
								Child_ProductID = oData.Product_id;
								Child_TriggerID = oData.Product_trigger_id;
								sap.m.MessageToast.show("Child Trigger ID = " + Child_ProductID + Child_TriggerID);
							},
							error: function (error) {

							},
							async: false
						});
						check_obj = {
							g_ProductName: collection[a].g_ProductName,
							Child_ProductID: Child_ProductID,
							Child_TriggerID: Child_TriggerID
						};
						trigger_array[a] = check_obj;
						uniqueArray_sysroles = uniqueArray_sysroles.filter(item => item !== collection[a].Data.CollectionSystemRole);
						uniqueArray_genprod = uniqueArray_genprod.filter(item => item !== collection[a].g_ProductName);
					} else {
						for (let i in trigger_array) {
							if (trigger_array[i].g_ProductName === collection[a].g_ProductName) {
								Child_ProductID = trigger_array[i].Child_ProductID;
								Child_TriggerID = trigger_array[i].Child_TriggerID;
							}
						}
					}
					//	}
					if (collection[a].Data.EvBusinessDown === 'true') {
						collection[a].Data.EvBusinessDown = '1';
					} else {
						collection[a].Data.EvBusinessDown = '0';
					}
					if (collection[a].Data.EvBusinessDown === 'No Syste') {
						collection[a].Data.EvBusinessDown = 'NA';
					}
					//
					//Save Resuse Patch Collection Entry
					let oParameter = {
						"g_product_name": collection[a].g_ProductName,
						"PProductId": Parent_ProductId,
						"PProductTriggerId": Parent_TriggeredId,
						"CProductId": Child_ProductID,
						"CProductTriggerId": Child_TriggerID,
						"TriggerType": "R",
						"EpRequestId": collection[a].Data.EpRequestId,
						"SpsName": collection[a].Data.SpsName,
						"EvBusinessDown": collection[a].Data.EvBusinessDown,
						"FinalASystem": collection[a].Data.FinalASystem,
						"HotfixId": collection[a].Data.HotfixId,
						"CodelineType": collection[a].Data.CodelineType,
						"HeaderStatus": collection[a].Data.HeaderStatus,
						"operation_type": "CR",
						"CompId": collection[a].Component_ID,
						"DependentCollection": collection[a].Data.CollectionSystemRole
					};
					this.getView().getModel().create("/reuse_patch_collectionSet", oParameter, {
						success: function (oData) {
							if (oData.return === 'true') {
								collection[a].Data.child_product_id = oData.CProductId;
								collection[a].Data.child_product_tri_id = oData.CProductTriggerId;
								main_globalme.msg_resuse_patch_msg_1 = "Reuse Patch Collection Created With Trigger ID = " + oData.CProductId + oData.CProductTriggerId;
								sap.m.MessageBox.confirm(
									main_globalme.msg_resuse_patch_msg_1
								);
							}
						},
						error: function (oData) {

						},
						async: false
					});
					/*window.setInterval(this._update_reuse_table_fields(collection[a].g_ProductName, collection[a].Data.EpRequestId, Parent_ProductId,
						Parent_TriggeredId, collection[a]
						.Data.SpsName, collection[a].Data.CodelineType, collection[a]), 3000);*/
				}

			}
		},
		_combineReuse_insideParent: function (return_val, Parent_ProductId, Parent_TriggeredId) {
			for (let a in return_val.collection) {
				if (return_val.collection[a].Data.child_product_id !== "") {
					filtersTitle = [];
					var oFilters1 = new sap.ui.model.Filter("SpsName", sap.ui.model.FilterOperator.EQ, return_val.collection[a].Data.SpsName);
					filtersTitle.push(oFilters1);
					var oFilters2 = new sap.ui.model.Filter("g_product_name", sap.ui.model.FilterOperator.EQ, return_val.collection[a].g_ProductName);
					filtersTitle.push(oFilters2);
					var oFilters3 = new sap.ui.model.Filter("CodelineType", sap.ui.model.FilterOperator.EQ, return_val.collection[a].Data.CodelineType);
					filtersTitle.push(oFilters3);
					main_globalme.getView().getModel().read("/reuse_patch_collectionSet", {
						filters: filtersTitle,
						success: function (oData) {
							if (oData.results.length !== 0) {
								return_val.genrated_sps = oData.results[0].SpsName;
								return_val.fas_s = oData.results[0].FinalASystem;
								return_val.child_product_id = oData.results[0].CProductId;
								return_val.child_product_tri_id = oData.results[0].CProductTriggerId;
							}

						},
						error: function () {},
						async: false
					});
					if (return_val.collection[a].Data.EvBusinessDown === 'true') {
						return_val.collection[a].Data.EvBusinessDown = '1';
					} else {
						return_val.collection[a].Data.EvBusinessDown = '0';
					}
					if (return_val.collection[a].Data.EvBusinessDown === 'No Syste') {
						return_val.collection[a].Data.EvBusinessDown = 'NA';
					}
					let oParameter = {
						"g_product_name": return_val.collection[a].g_ProductName,
						"PProductId": Parent_ProductId,
						"PProductTriggerId": Parent_TriggeredId,
						"CProductId": return_val.child_product_id,
						"CProductTriggerId": return_val.child_product_tri_id,
						"TriggerType": "R",
						"EpRequestId": return_val.collection[a].Data.EpRequestId,
						"SpsName": return_val.collection[a].Data.SpsName,
						"generated_sps_name": return_val.genrated_sps,
						"EvBusinessDown": return_val.collection[a].Data.EvBusinessDown,
						"FinalASystem": return_val.fas_s,
						"HotfixId": return_val.collection[a].Data.HotfixId,
						"CodelineType": return_val.collection[a].Data.CodelineType,
						"HeaderStatus": return_val.collection[a].Data.HeaderStatus,
						"DependentCollection": return_val.collection[a].Data.CollectionSystemRole,
						"operation_type": "CR", // update entry in assembly queuer table
						"CompId": return_val.collection[a].Component_ID,
					};
					main_globalme.getView().getModel().update("/reuse_patch_collectionSet(PProductTriggerId='" + "" + "',PProductId='" + "" +
						"',EpRequestId='" + "" + "')",
						oParameter, {
							success: function (oData) {
								if (return_val.found_entry_in_assembly_in_queue[a] === 'true') {
									main_globalme.msg_resuse_patch_msg_2 = "Reuse Patch Included in = " + return_val.child_product_id + return_val.child_product_tri_id;
									sap.m.MessageBox.confirm(
										main_globalme.msg_resuse_patch_msg_2
									);
								}
							},
							error: function (oData) {

							},
							async: false
						});
				}
			}
		},
		_create_releation_of_reuse: function (parent_product_id, parent_product_trigger_id, child_productId, child_TriggerId,
			return_val_collection) {
			let oParameter = {
				"PProductId": parent_product_id,
				"PProductTriggerId": parent_product_trigger_id,
				"CProductId": child_productId,
				"CProductTriggerId": child_TriggerId,
				"TriggerType": "R",
				"operation_type": "NC",
				"EpRequestId": return_val_collection.Data.EpRequestId,
				"CompId": return_val_collection.Component_ID
			};
			this.getView().getModel().create("/reuse_patch_collectionSet", oParameter, {
				success: function (oData) {
					if (oData.return === 'true') {
						sap.m.MessageToast.show("Reuse relation created between Parent Trigger ID = " + parent_product_id +
							parent_product_trigger_id +
							" and Child Trigger Id = " +
							child_productId + child_TriggerId);
						// main_globalme.msg_resuse_patch_msg_1 = "Reuse Patch Collection Created With Trigger ID = " + oData.CProductId + oData.CProductTriggerId;
						// sap.m.MessageBox.confirm(
						// 	main_globalme.msg_resuse_patch_msg_1
						// );
					}
				},
				error: function (oData) {

				},
				async: false
			});
			/*window.setInterval(this._update_reuse_table_fields(return_val_collection.g_ProductName, return_val_collection.Data.EpRequestId,
				parent_product_id, parent_product_trigger_id,
				return_val_collection.Data.SpsName, return_val_collection.Data.CodelineType, return_val_collection), 3000);*/
		},

		onGoNext: function () {},
		onPressReject: function (evt) {
			MessageToast.show(evt.getSource().getText());
		},
		logout: function (event) {
			var that = this;
			var form = new sap.ui.layout.form.SimpleForm({

				content: [
					new sap.m.Label({
						text: "Tool/Tip Videos"
					}),
					new sap.m.Switch({
						state: main_globalme.oState,
						change: function (oEvent) {
							if (oEvent.getParameters().state == true) {
								var oParameter = {
									"Disable": ""
								};
								that.getView().getModel().create("/video_disableSet", oParameter);
								MessageToast.show("Tools/tip Video Successfully enable \n Please refresh the Application.");
							} else {
								var oParameter = {
									"Disable": "X"
								};
								that.getView().getModel().create("/video_disableSet", oParameter);
								MessageToast.show("Tools/tip Video Successfully disabled.");
							}
						}
					})
				]
			});
			var popover = new sap.m.Popover({
				resizable: true,
				placement: sap.m.PlacementType.Bottom,
				content: [
					form,
					new sap.m.Button({
						text: 'Release Note',
						type: sap.m.ButtonType.Transparent,
						press: function () {
							window.open("");
						}
					}),
					new sap.m.Button({
						text: 'Report Bug/Fr Request',
						type: sap.m.ButtonType.Transparent,
						press: function () {

							that.openReportBug();

						}
					}),
					new sap.m.Button({
						text: 'Feedback/Request',
						type: sap.m.ButtonType.Transparent,
						press: function () {
							//Dialog Creation
							if (!that.resizableDialog) {
								sap.m.URLHelper.triggerEmail("DL_59DC8E005F99B793F2000171@exchange.sap.corp", "Create Request/Send Feedback",
									"Hello Team,\n\nThis is my dummy Request/Feedback.\n\nThanks and Regards,\n" + username,
									"stalin.a@sap.com");

								//to get access to the global model
								that.getView().addDependent(that.resizableDialog);
							}

							that.resizableDialog.open();

							//Close
						}
					}),
					new sap.m.Button({
						text: 'Help',
						type: sap.m.ButtonType.Transparent,
						press: function () {
							window.open("https://wiki.wdf.sap.corp/wiki/display/AOF/Emergency+Patch+Dash-board+-+End+user+guide");
						}
					})
				]
			}).addStyleClass('sapMOTAPopover sapTntToolHeaderPopover');

			popover.openBy(event.getSource());
		},
		onsortEP: function (oEvent) {
			var that = this;
			if (oEvent.getSource().getPressed()) {
				sap.m.MessageToast.show(" Ascending Order");
				var Bid = oEvent.getParameters().id.split("--")[1];
				this.getView().byId(Bid).setIcon("sap-icon://sort-ascending");
				var aSorters = [];
				var oView = this.getView();
				var id = this.getView().byId("idTablePanel").getContent()[0].sId.split("--")[1];
				var oTable = oView.byId(id);
				var oTemplate = this.byId(this.createId("coloumid"));
				var sPath = "EpRequestId";
				this.ep = "EpRequestId";
				this.pver = '';
				this.sps = '';
				this.hf = '';
				this.epState = false;
				aSorters.push(new sap.ui.model.Sorter(sPath, false, null));
				var oBinding = oTable.getBinding("items");
				oBinding.sort(aSorters);
				if (id == 'idProductsTable') {
					this.getView().byId("ProdName").setPressed(false);
					this.getView().byId("ProdName").setIcon("sap-icon://sort");
					this.getView().byId("HotSortBut").setPressed(false);
					this.getView().byId("HotSortBut").setIcon("sap-icon://sort");
					that.bindcolor();
					that.bindcolor();
				} else if (id == 'idProductsTable23') {
					this.getView().byId("ProdName23").setPressed(false);
					this.getView().byId("ProdName23").setIcon("sap-icon://sort");
					this.getView().byId("HotSortBut23").setPressed(false);
					this.getView().byId("HotSortBut23").setIcon("sap-icon://sort");
					this.getView().byId("sortcorrection23").setPressed(false);
					this.getView().byId("sortcorrection23").setIcon("sap-icon://sort");
					that.bindcolor();
					that.bindcolor();
				} else if (id == 'idEPTable') {
					this.getView().byId("ProdNameEP").setPressed(false);
					this.getView().byId("ProdNameEP").setIcon("sap-icon://sort");
					this.getView().byId("HotSortButEP").setPressed(false);
					this.getView().byId("HotSortButEP").setIcon("sap-icon://sort");
					that.bindcolor1();
				};
			} else {
				sap.m.MessageToast.show("Descending Order");
				var Bid = oEvent.getParameters().id.split("--")[1];
				this.getView().byId(Bid).setIcon("sap-icon://sort-descending");
				var aSorters = [];
				var oView = this.getView();
				var id = this.getView().byId("idTablePanel").getContent()[0].sId.split("--")[1];
				var oTable = oView.byId(id);
				var oTemplate = this.byId(this.createId("coloumid"));
				var oBinding = oTable.getBinding("items");
				var sPath = "EpRequestId";
				this.ep = "EpRequestId";
				this.epState = true;
				aSorters.push(new sap.ui.model.Sorter(sPath, true, null));
				var oBinding = oTable.getBinding("items");
				oBinding.sort(aSorters);
				if (id == 'idProductsTable') {
					this.getView().byId("ProdName").setPressed(false);
					this.getView().byId("ProdName").setIcon("sap-icon://sort");
					this.getView().byId("HotSortBut").setPressed(false);
					this.getView().byId("HotSortBut").setIcon("sap-icon://sort");
					that.bindcolor();
					that.bindcolor();
				} else if (id == 'idProductsTable23') {
					this.getView().byId("ProdName23").setPressed(false);
					this.getView().byId("ProdName23").setIcon("sap-icon://sort");
					this.getView().byId("HotSortBut23").setPressed(false);
					this.getView().byId("HotSortBut23").setIcon("sap-icon://sort");
					this.getView().byId("sortcorrection23").setPressed(false);
					this.getView().byId("sortcorrection23").setIcon("sap-icon://sort");
					that.bindcolor();
					that.bindcolor();
				} else if (id == 'idEPTable') {
					this.getView().byId("ProdNameEP").setPressed(false);
					this.getView().byId("ProdNameEP").setIcon("sap-icon://sort");
					this.getView().byId("HotSortButEP").setPressed(false);
					this.getView().byId("HotSortButEP").setIcon("sap-icon://sort");
					that.bindcolor1();
				};
			}
		},
		onsortProduct: function (oEvent) {
			var that = this;
			if (oEvent.getSource().getPressed()) {
				sap.m.MessageToast.show(" Ascending Order");
				var Bid = oEvent.getParameters().id.split("--")[1];
				this.getView().byId(Bid).setIcon("sap-icon://sort-ascending");
				var aSorters = [];
				this.ep = '';
				this.hf = '';
				var oView = this.getView();
				var id = this.getView().byId("idTablePanel").getContent()[0].sId.split("--")[1];
				var oTable = oView.byId(id);
				var oTemplate = this.byId(this.createId("coloumid"));
				if (id == "idProductsTable") {
					this.getView().byId("EpSortBut").setPressed(false);
					this.getView().byId("EpSortBut").setIcon("sap-icon://sort");
					this.getView().byId("HotSortBut").setPressed(false);
					this.getView().byId("HotSortBut").setIcon("sap-icon://sort");
					var sPath = "ProdVersName";
					this.pver = "ProdVersName";
					this.spsState = false;
					aSorters.push(new sap.ui.model.Sorter(sPath, false, null));
					var oBinding = oTable.getBinding("items");
					oBinding.sort(aSorters);
					that.bindcolor();
				} else if (id == 'idProductsTable23') {
					this.getView().byId("EpSortBut23").setPressed(false);
					this.getView().byId("EpSortBut23").setIcon("sap-icon://sort");
					this.getView().byId("HotSortBut23").setPressed(false);
					this.getView().byId("HotSortBut23").setIcon("sap-icon://sort");
					this.getView().byId("sortcorrection23").setPressed(false);
					this.getView().byId("sortcorrection23").setIcon("sap-icon://sort");
					var sPath = "ProdVersName";
					this.pver = "ProdVersName";
					this.spsState = false;
					aSorters.push(new sap.ui.model.Sorter(sPath, false, null));
					var oBinding = oTable.getBinding("items");
					oBinding.sort(aSorters);
					that.bindcolor();
				} else if (id == "idEPTable") {
					this.getView().byId("EpSortButEP").setPressed(false);
					this.getView().byId("EpSortButEP").setIcon("sap-icon://sort");
					this.getView().byId("HotSortButEP").setPressed(false);
					this.getView().byId("HotSortButEP").setIcon("sap-icon://sort");
					var sPath = "SpsName";
					this.sps = "SpsName";
					this.spsState = false;
					aSorters.push(new sap.ui.model.Sorter(sPath, false, null));
					var oBinding = oTable.getBinding("items");
					oBinding.sort(aSorters);
					that.bindcolor1();
				};

			} else {
				sap.m.MessageToast.show("Descending Order");
				var Bid = oEvent.getParameters().id.split("--")[1];
				this.getView().byId(Bid).setIcon("sap-icon://sort-descending");
				var aSorters = [];
				var oView = this.getView();
				var id = this.getView().byId("idTablePanel").getContent()[0].sId.split("--")[1];
				var oTable = oView.byId(id);
				var oTemplate = this.byId(this.createId("coloumid"));
				var oBinding = oTable.getBinding("items");
				if (id == "idProductsTable") {
					this.getView().byId("EpSortBut").setPressed(false);
					this.getView().byId("EpSortBut").setIcon("sap-icon://sort");
					this.getView().byId("HotSortBut").setPressed(false);
					this.getView().byId("HotSortBut").setIcon("sap-icon://sort");
					var sPath = "ProdVersName";
					this.sps = "ProdVersName";
					this.spsState = true;
					aSorters.push(new sap.ui.model.Sorter(sPath, true, null));
					var oBinding = oTable.getBinding("items");
					oBinding.sort(aSorters);
					that.bindcolor();
				} else if (id == 'idProductsTable23') {
					this.getView().byId("EpSortBut23").setPressed(false);
					this.getView().byId("EpSortBut23").setIcon("sap-icon://sort");
					this.getView().byId("HotSortBut23").setPressed(false);
					this.getView().byId("HotSortBut23").setIcon("sap-icon://sort");
					this.getView().byId("sortcorrection23").setPressed(false);
					this.getView().byId("sortcorrection23").setIcon("sap-icon://sort");
					var sPath = "ProdVersName";
					this.sps = "ProdVersName";
					this.spsState = true;
					aSorters.push(new sap.ui.model.Sorter(sPath, true, null));
					var oBinding = oTable.getBinding("items");
					oBinding.sort(aSorters);
					that.bindcolor();
				} else if (id == "idEPTable") {
					this.getView().byId("EpSortButEP").setPressed(false);
					this.getView().byId("EpSortButEP").setIcon("sap-icon://sort");
					this.getView().byId("HotSortButEP").setPressed(false);
					this.getView().byId("HotSortButEP").setIcon("sap-icon://sort");
					var sPath = "SpsName";
					this.sps = "SpsName";
					this.spsState = true;
					aSorters.push(new sap.ui.model.Sorter(sPath, true, null));
					var oBinding = oTable.getBinding("items");
					oBinding.sort(aSorters);
					that.bindcolor1();
				};
			}
		},
		onsortHot: function (oEvent) {
			var that = this;
			if (oEvent.getSource().getPressed()) {
				sap.m.MessageToast.show(" Ascending Order");
				var Bid = oEvent.getParameters().id.split("--")[1];
				this.getView().byId(Bid).setIcon("sap-icon://sort-ascending");
				var aSorters = [];
				this.ep = '';
				this.pver = '';
				this.sps = '';
				var oView = this.getView();
				var id = this.getView().byId("idTablePanel").getContent()[0].sId.split("--")[1];
				var oTable = oView.byId(id);
				var oTemplate = this.byId(this.createId("coloumid"));
				var sPath = "HotfixId";
				aSorters.push(new sap.ui.model.Sorter(sPath, false, null));
				var oBinding = oTable.getBinding("items");
				oBinding.sort(aSorters);
				this.hf = "HotfixId";
				this.hfState = false;
				if (id == 'idProductsTable') {
					this.getView().byId("EpSortBut").setPressed(false);
					this.getView().byId("EpSortBut").setIcon("sap-icon://sort");
					this.getView().byId("ProdName").setPressed(false);
					this.getView().byId("ProdName").setIcon("sap-icon://sort");
					that.bindcolor();
				} else if (id == 'idProductsTable23') {
					this.getView().byId("EpSortBut23").setPressed(false);
					this.getView().byId("EpSortBut23").setIcon("sap-icon://sort");
					this.getView().byId("ProdName23").setPressed(false);
					this.getView().byId("ProdName23").setIcon("sap-icon://sort");
					this.getView().byId("sortcorrection23").setPressed(false);
					this.getView().byId("sortcorrection23").setIcon("sap-icon://sort");
					that.bindcolor();
				} else if (id == 'idEPTable') {
					this.getView().byId("EpSortButEP").setPressed(false);
					this.getView().byId("EpSortButEP").setIcon("sap-icon://sort");
					this.getView().byId("ProdNameEP").setPressed(false);
					this.getView().byId("ProdNameEP").setIcon("sap-icon://sort");
					that.bindcolor1();
				};
			} else {
				sap.m.MessageToast.show("Descending Order");
				var Bid = oEvent.getParameters().id.split("--")[1];
				this.getView().byId(Bid).setIcon("sap-icon://sort-descending");
				var aSorters = [];
				var oView = this.getView();
				var id = this.getView().byId("idTablePanel").getContent()[0].sId.split("--")[1];
				var oTable = oView.byId(id);
				var oTemplate = this.byId(this.createId("coloumid"));
				var oBinding = oTable.getBinding("items");
				var sPath = "HotfixId";
				this.hf = "HotfixId";
				this.hfState = true;
				aSorters.push(new sap.ui.model.Sorter(sPath, true, null));
				var oBinding = oTable.getBinding("items");
				oBinding.sort(aSorters);
				if (id == 'idProductsTable') {
					this.getView().byId("EpSortBut").setPressed(false);
					this.getView().byId("EpSortBut").setIcon("sap-icon://sort");
					this.getView().byId("ProdName").setPressed(false);
					this.getView().byId("ProdName").setIcon("sap-icon://sort");
					that.bindcolor();
				} else if (id == 'idProductsTable23') {
					this.getView().byId("EpSortBut23").setPressed(false);
					this.getView().byId("EpSortBut23").setIcon("sap-icon://sort");
					this.getView().byId("ProdName23").setPressed(false);
					this.getView().byId("ProdName23").setIcon("sap-icon://sort");
					this.getView().byId("sortcorrection23").setPressed(false);
					this.getView().byId("sortcorrection23").setIcon("sap-icon://sort");
					that.bindcolor();
				} else if (id == 'idEPTable') {
					this.getView().byId("EpSortButEP").setPressed(false);
					this.getView().byId("EpSortButEP").setIcon("sap-icon://sort");
					this.getView().byId("ProdNameEP").setPressed(false);
					this.getView().byId("ProdNameEP").setIcon("sap-icon://sort");
					that.bindcolor1();
				};
			}
		},

		onsortcorrection: function (oEvent) {
			var that = this;
			if (oEvent.getSource().getPressed()) {
				sap.m.MessageToast.show(" Ascending Order");
				var Bid = oEvent.getParameters().id.split("--")[1];
				this.getView().byId("sortcorrection23").setIcon("sap-icon://sort-ascending");
				var aSorters = [];

				var oView = this.getView();
				var id = this.getView().byId("idTablePanel").getContent()[0].sId.split("--")[1];
				var oTable = oView.byId(id);
				var oTemplate = this.byId(this.createId("coloumid"));
				var sPath = "Chash";
				aSorters.push(new sap.ui.model.Sorter(sPath, false, null));
				var oBinding = oTable.getBinding("items");
				oBinding.sort(aSorters);
				this.Correction = "Chash";
				this.CorrectionState = false;
				if (id == 'idProductsTable23') {
					this.getView().byId("EpSortBut23").setPressed(false);
					this.getView().byId("EpSortBut23").setIcon("sap-icon://sort");
					this.getView().byId("ProdName23").setPressed(false);
					this.getView().byId("ProdName23").setIcon("sap-icon://sort");
					this.getView().byId("HotSortBut23").setPressed(false);
					this.getView().byId("HotSortBut23").setIcon("sap-icon://sort");
					that.bindcolor();
				}
			} else {
				sap.m.MessageToast.show("Descending Order");
				var Bid = oEvent.getParameters().id.split("--")[1];
				this.getView().byId("sortcorrection23").setIcon("sap-icon://sort-descending");
				var aSorters = [];
				var oView = this.getView();
				var id = this.getView().byId("idTablePanel").getContent()[0].sId.split("--")[1];
				var oTable = oView.byId(id);
				var oTemplate = this.byId(this.createId("coloumid"));
				var oBinding = oTable.getBinding("items");
				var sPath = "Chash";
				this.Correction = "Chash";
				this.CorrectionState = true;
				aSorters.push(new sap.ui.model.Sorter(sPath, true, null));
				var oBinding = oTable.getBinding("items");
				oBinding.sort(aSorters);
				if (id == 'idProductsTable23') {
					this.getView().byId("EpSortBut23").setPressed(false);
					this.getView().byId("EpSortBut23").setIcon("sap-icon://sort");
					this.getView().byId("ProdName23").setPressed(false);
					this.getView().byId("ProdName23").setIcon("sap-icon://sort");
					this.getView().byId("HotSortBut23").setPressed(false);
					this.getView().byId("HotSortBut23").setIcon("sap-icon://sort");
					that.bindcolor();
				}

			}
		},

		onsortHstatus: function (oEvent) {
			var that = this;
			if (oEvent.getSource().getPressed()) {
				sap.m.MessageToast.show(" Ascending Order");
				var Bid = oEvent.getParameters().id.split("--")[1];
				this.getView().byId(Bid).setIcon("sap-icon://sort-ascending");
				var aSorters = [];
				var oView = this.getView();
				var id = this.getView().byId("idTablePanel").getContent()[0].sId.split("--")[1];
				var oTable = oView.byId(id);
				var oTemplate = this.byId(this.createId("coloumid"));
				var sPath = "HeaderStatus";
				aSorters.push(new sap.ui.model.Sorter(sPath, false, null));
				var oBinding = oTable.getBinding("items");
				oBinding.sort(aSorters);
				if (id == 'idProductsTable') {
					that.bindcolor();
				} else if (id == 'idProductsTable23') {
					that.bindcolor();
				} else if (id == 'idEPTable') {
					that.bindcolor1();
				};
			} else {
				sap.m.MessageToast.show("Descending Order");
				var Bid = oEvent.getParameters().id.split("--")[1];
				this.getView().byId(Bid).setIcon("sap-icon://sort-descending");
				var aSorters = [];
				var oView = this.getView();
				var id = this.getView().byId("idTablePanel").getContent()[0].sId.split("--")[1];
				var oTable = oView.byId(id);
				var oTemplate = this.byId(this.createId("coloumid"));
				var oBinding = oTable.getBinding("items");
				var sPath = "HeaderStatus";
				aSorters.push(new sap.ui.model.Sorter(sPath, true, null));
				var oBinding = oTable.getBinding("items");
				oBinding.sort(aSorters);
				if (id == 'idProductsTable') {
					that.bindcolor();
				} else if (id == 'idProductsTable23') {
					that.bindcolor();
				} else if (id == 'idEPTable') {
					that.bindcolor1();
				};
			}
		},
		onsortApStatus: function (oEvent) {
			var that = this;
			if (oEvent.getSource().getPressed()) {
				sap.m.MessageToast.show(" Ascending Order");
				this.getView().byId("ApprovSta").setIcon("sap-icon://sort-ascending");
				var aSorters = [];
				var oView = this.getView();
				var oTable = oView.byId("idProductsTable");
				var oTemplate = this.byId(this.createId("coloumid"));
				var sPath = "StatusRm";
				aSorters.push(new sap.ui.model.Sorter(sPath, false, null));
				var oBinding = oTable.getBinding("items");
				oBinding.sort(aSorters);
				that.bindcolor();
			} else {
				sap.m.MessageToast.show("Descending Order");
				this.getView().byId("ApprovSta").setIcon("sap-icon://sort-descending");
				var aSorters = [];
				var oView = this.getView();
				var oTable = oView.byId("idProductsTable");
				var oTemplate = this.byId(this.createId("coloumid"));
				var oBinding = oTable.getBinding("items");
				var sPath = "StatusRm";
				aSorters.push(new sap.ui.model.Sorter(sPath, true, null));
				var oBinding = oTable.getBinding("items");
				oBinding.sort(aSorters);
				that.bindcolor();
			}
		},
		onsortStaHFG: function (oEvent) {
			var that = this;
			if (oEvent.getSource().getPressed()) {
				sap.m.MessageToast.show(" Ascending Order");
				this.getView().byId("StatHFG").setIcon("sap-icon://sort-ascending");
				var aSorters = [];
				var oView = this.getView();
				var oTable = oView.byId("idProductsTable");
				var oTemplate = this.byId(this.createId("coloumid"));
				var sPath = "StatusHf";
				aSorters.push(new sap.ui.model.Sorter(sPath, false, null));
				var oBinding = oTable.getBinding("items");
				oBinding.sort(aSorters);
				that.bindcolor();
			} else {
				sap.m.MessageToast.show("Descending Order");
				this.getView().byId("StatHFG").setIcon("sap-icon://sort-descending");
				var aSorters = [];
				var oView = this.getView();
				var oTable = oView.byId("idProductsTable");
				var oTemplate = this.byId(this.createId("coloumid"));
				var oBinding = oTable.getBinding("items");
				var sPath = "StatusHf";
				aSorters.push(new sap.ui.model.Sorter(sPath, true, null));
				var oBinding = oTable.getBinding("items");
				oBinding.sort(aSorters);
				that.bindcolor();
			}
		},

		onsortstatus: function (oEvent) {
			var that = this;
			if (oEvent.getSource().getPressed()) {
				sap.m.MessageToast.show(" Ascending Order");
				this.getView().byId("StatusEPNew").setIcon("sap-icon://sort-ascending");
				var aSorters = [];
				var oView = this.getView();
				var oTable = oView.byId("idEPTable");
				var oTemplate = this.byId(this.createId("coloumid"));
				var sPath = "Status";
				this.code = "Status";
				this.codeState = false;
				aSorters.push(new sap.ui.model.Sorter(sPath, false, null));
				var oBinding = oTable.getBinding("items");
				oBinding.sort(aSorters);
				that.bindcolor1();
			} else {
				sap.m.MessageToast.show("Descending Order");
				this.getView().byId("StatusEPNew").setIcon("sap-icon://sort-descending");
				var aSorters = [];
				var oView = this.getView();
				var oTable = oView.byId("idEPTable");
				var oTemplate = this.byId(this.createId("coloumid"));
				var oBinding = oTable.getBinding("items");
				var sPath = "Status";
				this.code = "Status";
				this.codeState = true;
				aSorters.push(new sap.ui.model.Sorter(sPath, true, null));
				var oBinding = oTable.getBinding("items");
				oBinding.sort(aSorters);
				that.bindcolor1();

			}
		},

		closeproduct: function () {
			this._oDialog.close();

		},
		onItemPressProduct: function (oEvent) {

		},

		selectproduct: function (oEvent) {
			this.showBusyIndicator(3000, 0);
			this._oDialog.close();
			this.getView().byId("Default").setType("Default");
			this.getView().byId("awaRmApproval").setType("Default");
			this.getView().byId("awaHfgApproval").setType("Default");
			//    this.getView().byId("Ready").setType("Default");
			this.getView().byId("Ready_EP").setType("Default");
			//  this.getView().byId("Assembly").setType("Default");
			this.getView().byId("Queue_EP").setType("Default");
			var deletechildpanel = this.getView().byId("dispalydelete");
			deletechildpanel.setVisible(false);
			var requestpanel = this.getView().byId("requestep");
			requestpanel.setVisible(false);
			var deletedpanel = this.getView().byId("deleteep");
			deletedpanel.setVisible(false);
			//	this.getView().byId("footer").setVisible(false);
			this.getView().byId("idProductsTable23").setVisible(false);
			var that = this;
			var filtersTitle = [];
			that.oData = null;
			var oView = this.getView();
			var oTable = that.getView().byId("idProductsTable");
			oTable.setVisible(true);
			var oTable1 = this.getView().byId("idEPTable");
			var oPanel = this.getView().byId("idTablePanel");
			var action = this.getView().byId("actionHFG");
			var oTable2 = this.getView().byId("idProductsTable");
			oTable2.removeColumn(action);
			oPanel.addContent(oTable);
			oTable1.setVisible(false);
			oTable.unbindAggregation();
			oTable.unbindItems();
			var oTemplate = this.byId(this.createId("coloumid"));
			var ptable = that.byId(this.createId("idProductsTable"));
			var oTemplate = that.byId(this.createId("coloumid"));
			//  var oSelectedItem = oEvent.getParameter("selectedItems");
			//  var aContexts = oEvent.getParameter("selectedContexts");
			var oTable1 = sap.ui.getCore().byId("productTable");
			var contexts = oTable1.getSelectedContexts();
			var items = contexts.map(function (c) {
				return c.getObject();
			});
			//   var oCombo = this.getView().byId("idComobo");
			//   oCombo.setValue("");
			array = [];
			//   if (oSelectedItem.length != 0) {
			//     this.getView().byId("Default").setType("Emphasized");
			//   }
			for (var i = 0; i < contexts.length; i++) {
				var oSelect = items[i].ProductName; //"__identifier0-productTable-"+oEvent.mParameters.listItem.sId.split("__item3-productTable-")[1]
				array[i] = oSelect;
				var oFilters = new sap.ui.model.Filter("ProdVersName", sap.ui.model.FilterOperator.EQ, oSelect);
				filtersTitle.push(oFilters);
			};
			oCombo.setValue(array);
			var allFilterTitle = new sap.ui.model.Filter({
				filters: filtersTitle,
				or: true
			});
			var that = this;
			this._getRole_for_user();
			oCombo.setValue(array);
			this.getView().byId("idTablePanel").setVisible(true);
			this.getView().byId("SearchHead").setVisible(true);

		},
		onTableSettings: function (oEvent) {
			// Open the Table Setting dialog
			this._oDialog1 = sap.ui.xmlfragment("epdash.epdash.view.sort", this);
			this._oDialog1.open();
		},
		onConfirm: function (oEvent) {
			var aSorters = [];
			var oView = this.getView();
			var oTable = oView.byId("idProductsTable");
			var oTemplate = this.byId(this.createId("coloumid"));
			var mParams = oEvent.getParameters();
			var oBinding = oTable.getBinding("items");
			var oItems = oTable.getItems();
			//var json = new sap.ui.model.json.JSONModel();
			//json.setData({path:oItems});
			// oTable.setModel(this.json);
			var sPath = mParams.sortItem.getKey();
			var bDescending = mParams.sortDescending;
			aSorters.push(new sap.ui.model.Sorter(sPath, bDescending, null));
			//oTable.bindAggregation("items",{path:"/path" ,sorters:aSorters, template:oTemplate });
			oBinding.sort(aSorters);
			//apply grouping
			if (mParams.groupItem) {
				var bDescendingGroup = mParams.groupDescending;
				var vGroup = function (oContext) {
					var name = oContext.getProperty("StatusHf");
					return {
						key: name,
						text: name
					};
				};
				aSorters.push(new sap.ui.model.Sorter(sPath, bDescendingGroup, vGroup));
			}
		},
		onOpenPopoverAsscending: function (oEvent) {
			var aSorters = [];
			var oView = this.getView();
			var oTable = oView.byId("idProductsTable");
			var oTemplate = this.byId(this.createId("coloumid"));
			var sPath = "EpRequestId";
			aSorters.push(new sap.ui.model.Sorter(sPath, false, null));
			var oBinding = oTable.getBinding("items");
			oBinding.sort(aSorters);
		},
		onOpenPopoverdescending: function (oEvent) {
			var aSorters = [];
			var oView = this.getView();
			var oTable = oView.byId("idProductsTable");
			var oTemplate = this.byId(this.createId("coloumid"));
			var oBinding = oTable.getBinding("items");
			var sPath = "EpRequestId";
			aSorters.push(new sap.ui.model.Sorter(sPath, true, null));
			var oBinding = oTable.getBinding("items");
			oBinding.sort(aSorters);
		},
		onOpenProduct_list: function (oEvent) {
			if (!this._oDialogVariant) {
				this._oDialogVariant = sap.ui.xmlfragment("epdash.epdash.view.varinat_display", this);
				this.getView().addDependent(this._oDialogVariant);
				sap.ui.getCore().byId("productTable").setMode("MultiSelect");
				//   this._oDialogVariant.setModel(this.getView().getModel());
			}
			// toggle compact style

			var oButton = oEvent.getSource();
			jQuery.sap.delayedCall(0, this, function () {
				this._oDialogVariant.openBy(oButton);
			});
		},
		Search_product: function (oEvent) {
			short = [];
			shortEP = [];
			this.showBusyIndicator(5000, 0);
			this._oDialogVariant.close();
			var filtersTitle = [];
			var oTable = sap.ui.getCore().byId("productTable");
			var contexts = oTable.getSelectedContexts();
			var items = contexts.map(function (c) {
				return c.getObject();
			});
			array = [];
			for (var i = 0; i < contexts.length; i++) {
				var oSelect = items[i].ProductName; //"__identifier0-productTable-"+oEvent.mParameters.listItem.sId.split("__item3-productTable-")[1]
				array[i] = oSelect;
				var oFilters = new sap.ui.model.Filter("Variant", sap.ui.model.FilterOperator.EQ, oSelect);
				filtersTitle.push(oFilters);
			};
			//update top notification list
			this._updateSelectedProducts(filtersTitle);
			this._getRole_for_user();
			//	this.getView().byId("idTablePanel").setVisible(true);
			//	this.getView().byId("SearchHead").setVisible(true);
		},

		Save_product_as_variant: function (oEvent) {
			short = [];
			shortEP = [];
			var that = this;
			var oProduct = [];
			var oTable1 = sap.ui.getCore().byId("productTable");
			var contexts = oTable1.getSelectedContexts();
			var items = contexts.map(function (c) {
				return c.getObject();
			});
			if (items.length == 0) {
				alert("Kindly Select the Valid Product ");
			} else {
				this.showBusyIndicator(5000, 0);
				var aFilterArray = [];
				var filtersTitle = [];
				var oModel = this.getView().getModel();
				array = [];
				for (var i = 0; i < items.length; i++) {
					var filterYear = new sap.ui.model.Filter("Product", sap.ui.model.FilterOperator.EQ, items[i].ProductName);
					aFilterArray.push(filterYear);
					var oFilters = new sap.ui.model.Filter("Variant", sap.ui.model.FilterOperator.EQ, items[i].ProductName);
					filtersTitle.push(oFilters);
					array.push(items[i].ProductName);
				};
				this._updateSelectedProducts(filtersTitle); //call notification change 
				this._oDialogVariant.close();

				var that = this;
				this._getRole_for_user();
				this.getView().getModel().read("/Variant_table_eme_patchSet", {
					filters: aFilterArray
				});
				this.getView().byId("msgTrip").setText("");
				this.getView().byId("msgTrip").setText("Product Selected :  " + array);
				MessageToast.show("View Successfully Saved");

			}

		},
		CloseVar: function () {
			this._oDialogVariant.close();
		},
		filltable: function () {
			var that = this;
			this.getView().getModel().read("/VERSION_DATASet", {
				filters: defaultfiltersTitle,
				success: function (oData) {
					var result = oData.results;
					that.oData = oData.results;
					that.json = new sap.ui.model.json.JSONModel();
					that.json.setData({
						path: that.oData
					});
					//that.getView().setModel(json);
					var oTable = that.getView().byId("idProductsTable");
					oTable.setVisible(true);
					oTable.unbindAggregation();
					oTable.unbindItems();
					var oTemplate = that.getView().byId("coloumid");
					oTable.setModel(that.json);
					oTable.bindAggregation("items", {
						path: "/path",
						template: oTemplate,
						growing: "true"
					});
					that.bindcolor();
					defaultfiltersTitle = [];
				}
			});
		},
		oncloseemplist: function () {
			this._oDialogdefault.close();
		},
		ontake_overEP_by_RM_HFG: function (oEvent) {
			var oBut = oEvent.getSource();
			var property = oEvent.getSource().getParent().getParent().getBindingContext('ep_under_rm_hfg').getProperty(oEvent.getSource().getParent()
				.getParent()
				.getBindingContext('ep_under_rm_hfg').sPath);
			var Action_Type;
			if (this.getView().byId('awaHfgApproval').getType() === 'Emphasized') {
				this.onPressHFG_Approval();
				Action_Type = '2';
			} else if (this.getView().byId('awaRmApproval').getType() === 'Emphasized') {
				this.onPressRM_Approval();
				Action_Type = '1';
			}
			if (oBut.getText() === "PICK") {
				oBut.setText(username);
				oBut.setType("Emphasized");
				var oParameter = {
					"EpRequestId": property.EpRequestId,
					"HotfixId": property.HotfixId,
					"ActionType": Action_Type
				};
				this.getView().getModel().create("/ep_actions_f_userSet", oParameter);

			} else if (oBut.getText() === username) {
				oBut.setText("PICK");
				oBut.setType("Default");
				this.getView().getModel().remove("/ep_actions_f_userSet(EpRequestId='" + property.EpRequestId + "',HotfixId='" + property.HotfixId +
					"',ActionType='" + Action_Type + "')");

			} else if (oBut.getText() !== username && oBut.getText() !== "PICK") {
				sap.m.MessageBox.error(oBut.getText() + ' has already picked.');
			}
		},

		write_comment_by_RM_HFG: function (oEvent) {
			var property = oEvent.getSource().getParent().getParent().getBindingContext('ep_under_rm_hfg').getProperty(oEvent.getSource().getParent()
				.getParent()
				.getBindingContext('ep_under_rm_hfg').sPath);
			var oModel_EP_detail = new sap.ui.model.json.JSONModel({
				data: property
			});
			var Ep_request_filter = new sap.ui.model.Filter("EpRequestId", sap.ui.model.FilterOperator.EQ, property.EpRequestId);
			var hotfix_id_filter = new sap.ui.model.Filter("HotfixId", sap.ui.model.FilterOperator.EQ, property.HotfixId);
			var oFilter = [Ep_request_filter, hotfix_id_filter];
			var lock_status, locking_user;
			this.getView().getModel().read("/lock_ep_requestSet", {
				filters: oFilter,
				success: function (oData) {
					if (oData.results.length === 0) {
						lock_status = 'locked';
					} else {
						lock_status = 'open';
						locking_user = oData.results[0].LockVorna
					}
				},
				async: false
			});

			var oParameter = {
				"EpRequestId": property.EpRequestId,
				"HotfixId": property.HotfixId
			};

			//lock ep_request
			this._lock_ep_request(oParameter);
			//////////////////////
			var Ep_request_filter = new sap.ui.model.Filter("EpRequestId", sap.ui.model.FilterOperator.EQ, property.EpRequestId);
			var hotfix_id_filter = new sap.ui.model.Filter("HotfixId", sap.ui.model.FilterOperator.EQ, property.HotfixId);
			var oFilters = [Ep_request_filter, hotfix_id_filter];
			var that = this;
			this.getView().getModel().read("/ep_comment_f_userSet", {
				filters: oFilters,
				success: function (oData) {
					if (oData.results.length !== 0) {

						var RM_c_data = [],
							HFG_c_data = [];
						for (var i = 0; i < oData.results.length; i++) {
							switch (oData.results[i].CommentType) {
							case '1':
								RM_c_data.push(oData.results[i]);
								break;
							case '2':
								HFG_c_data.push(oData.results[i]);
								break;
							}
						}
					}
					var RM_c_model = new sap.ui.model.json.JSONModel();
					var HFG_c_model = new sap.ui.model.json.JSONModel();
					RM_c_model.setData({
						rm_comment: RM_c_data
					});
					HFG_c_model.setData({
						hfg_comment: HFG_c_data
					});

					if (!that.comment_on_ep) {
						that.comment_on_ep = sap.ui.xmlfragment("epdash.epdash.view.comments_on_ep", that);
						that.getView().addDependent(that.comment_on_ep);
						//  this._oPopover.bindElement("/ProductCollection/0");
					}
					that.comment_on_ep.setModel(RM_c_model, 'rm_comments');
					that.comment_on_ep.setModel(HFG_c_model, 'hfg_comments');
					that.comment_on_ep.setModel(oModel_EP_detail, 'ep_detail');
					/*that.BusyDialog.close();*/
					that.comment_on_ep.open();

				},
				error: function (err) {

				},
				async: false
			});

			if (lock_status === 'locked') {
				sap.ui.getCore().byId('ep_comment').setEnabled(true);
				sap.ui.getCore().byId('save_ep_cmnt_button').setEnabled(true);
				sap.ui.getCore().byId('ep_comment').setValue(" ");
			} else {
				sap.ui.getCore().byId('ep_comment').setValue("EP has been locked by " + locking_user);
				sap.ui.getCore().byId('ep_comment').setEnabled(false);
				sap.ui.getCore().byId('save_ep_cmnt_button').setEnabled(false);
				sap.m.MessageBox.warning("EP has been locked by " + locking_user);
			}
		},

		_lock_ep_request: function (oParameter) {
			main_globalme.getView().getModel().create("/lock_ep_requestSet", oParameter, {
				success: function () {
					sap.m.MessageToast.show("EP has been locked");
				},
				error: function () {
					sap.m.MessageToast.show("Fail to lock EP number.");
				},
				async: true
			});
		},
		_unlock_ep_request: function (oParameter) {
			main_globalme.getView().getModel().remove("/lock_ep_requestSet(EpRequestId='" + oParameter.EpRequestId + "',HotfixId='" +
				oParameter.HotfixId + "')", {
					success: function () {
						sap.m.MessageToast.show(" lock removed", {
							duration: 2000,
							animationTimingFunction: "ease",
							animationDuration: 1000
						});
					},
					async: false
				});
		},

		save_comment_for_an_ep: function (oEvent) {
			var Action_Type;
			if (this.getView().byId('awaHfgApproval').getType() === 'Emphasized') {
				Action_Type = '2';
			} else if (this.getView().byId('awaRmApproval').getType() === 'Emphasized') {
				Action_Type = '1';
			}
			if (sap.ui.getCore().byId('ep_comment').getValue() === '') {
				sap.m.MessageBox.error('Please add some comment!!');
			} else {
				var oParameter = {
					"EpRequestId": this.comment_on_ep.getModel('ep_detail').getData().data.EpRequestId,
					"HotfixId": this.comment_on_ep.getModel('ep_detail').getData().data.HotfixId,
					"Comments": sap.ui.getCore().byId('ep_comment').getValue(),
					"CommentType": Action_Type
				};
				this.getView().getModel().create("/ep_comment_f_userSet", oParameter);
				sap.m.MessageToast.show("Comment has been saved");
				var output = this.comment_on_ep.getModel("ep_detail").getData();
				this.comment_on_ep.getModel("ep_detail").setData(output);
				this.comment_on_ep.close();
				this._unlock_ep_request(oParameter);
				sap.ui.getCore().byId("ep_comment").setValue("");

			}

		},
		close_ep_comment_dialog: function () {
			var oParameter = {
				"EpRequestId": this.comment_on_ep.getModel('ep_detail').getData().data.EpRequestId,
				"HotfixId": this.comment_on_ep.getModel('ep_detail').getData().data.HotfixId
			};
			if (sap.ui.getCore().byId('ep_comment').getEnabled() !== false) {
				this._unlock_ep_request(oParameter);
			}
			this.comment_on_ep.close();

		},
		On_Comment_follow_up: function (oEvent) {
			if (!this.comment_on_follow_up) {
				this.comment_on_follow_up = sap.ui.xmlfragment("epdash.epdash.view.comments_on_follow_up", this);
				this.getView().addDependent(this.comment_on_follow_up);
			}
			var that = this;
			var property = oEvent.getSource().getParent().getParent().getBindingContext().getProperty(oEvent.getSource().getParent()
				.getParent().getBindingContext().getPath());
			var follow_up_comment_vp_row = new sap.ui.model.json.JSONModel();
			this.follow_up_comment_vp_row_property = property;
			follow_up_comment_vp_row.setData({
				follow_up_comment: property
			});

			var Ep_request_filter = new sap.ui.model.Filter("EpRequestId", sap.ui.model.FilterOperator.EQ, property.EpRequestId);
			var hotfix_id_filter = new sap.ui.model.Filter("HotfixId", sap.ui.model.FilterOperator.EQ, property.Id);
			var CommentType = 6;
			var CommentTypeFilter = new sap.ui.model.Filter("CommentType", sap.ui.model.FilterOperator.EQ, CommentType);

			var oFilters_follow_up = [Ep_request_filter, hotfix_id_filter, CommentTypeFilter];

			this.getView().getModel().read("/ep_comment_f_userSet", {
				filters: oFilters_follow_up,
				success: function (oData) {
					console.log(oData);
					var follow_up_data = [];
					if (oData.results.length !== 0) {

						for (var i = 0; i < oData.results.length; i++) {

							follow_up_data.push(oData.results[i]);

						}
					}
					var follow_up_data_model = new sap.ui.model.json.JSONModel();
					follow_up_data_model.setData({
						follow_up_data: follow_up_data
					});
					that.comment_on_follow_up.setModel(follow_up_data_model, 'followUpComments');

				},
				error: function () {

				},
				async: true
			});

			//this.comment_on_follow_up.setModel(follow_up_comment_vp_row, 'follow_up_comment_model');
			this.comment_on_follow_up.open();

		},
		save_comment_for_follow_up_vp: function () {
			if (sap.ui.getCore().byId('vp_comment').getValue() === '') {
				sap.m.MessageBox.error('Please add some comment!!');
			} else {
				var oParameter = {
					"EpRequestId": this.follow_up_comment_vp_row_property.EpRequestId,
					"HotfixId": this.follow_up_comment_vp_row_property.Id,
					"Comments": sap.ui.getCore().byId('vp_comment').getValue(),
					"CommentType": '6'
				};
				this.getView().getModel().create("/ep_comment_f_userSet", oParameter);
				sap.m.MessageToast.show("Comment has been saved");
				this.comment_on_follow_up.close();
				sap.ui.getCore().byId('vp_comment').setValue('');
				this.awaiting_vps();

			}
		},
		close_follow_up_vp_comment_dialog: function () {

			this.comment_on_follow_up.close();

		},
		On_Take_Over_Codeline_Assembly: function (oEvent) {

			var oBut = oEvent.getSource();
			var property = oEvent.getSource().getParent().getParent().getBindingContext('codeline_in_process').getProperty(oEvent.getSource()
				.getParent()
				.getParent()
				.getBindingContext('codeline_in_process').sPath);
			var Action_Type;
			if (this.getView().byId('Ready_EP').getType() === 'Emphasized') {
				this.onPressCodeline_In_Process();
				Action_Type = '3';
			} else if (this.getView().byId('Queue_EP').getType() === 'Emphasized') {
				this.onPress_Assembly_in_Queue();
				Action_Type = '4';
			}
			if (oBut.getText() === "PICK") {
				oBut.setText(username);
				oBut.setType("Emphasized");
				var oParameter = {
					"EpRequestId": property.EpRequestId,
					"HotfixId": property.HotfixId,
					"SpsName": property.SpsName,
					"CodelineType": property.CodelineType,
					"ActionType": Action_Type
				};
				this.getView().getModel().create("/codeline_a_f_userSet", oParameter);

			} else if (oBut.getText() === username) {
				oBut.setText("PICK");
				oBut.setType("Default");
				this.getView().getModel().remove("/codeline_a_f_userSet(EpRequestId='" + property.EpRequestId + "',HotfixId='" + property.HotfixId +
					"',SpsName='" + property.SpsName + "',ActionType='" + Action_Type + "')");

			} else if (oBut.getText() !== username && oBut.getText() !== "PICK") {
				sap.m.MessageBox.error(oBut.getText() + ' has already picked.');
			}
		},
		On_Comment_Codeline_Assembly: function (oEvent) {

			//    var busy = new sap.suite.ui.commons.statusindicator.StatusIndicator();
			var property = oEvent.getSource().getParent().getParent().getBindingContext('codeline_in_process').getProperty(oEvent.getSource()
				.getParent()
				.getParent()
				.getBindingContext('codeline_in_process').sPath);
			var oModel_EP_detail = new sap.ui.model.json.JSONModel({
				data: property
			});
			var Ep_request_filter = new sap.ui.model.Filter("EpRequestId", sap.ui.model.FilterOperator.EQ, property.EpRequestId);
			var hotfix_id_filter = new sap.ui.model.Filter("HotfixId", sap.ui.model.FilterOperator.EQ, property.HotfixId);
			var oFilter = [Ep_request_filter, hotfix_id_filter];
			var lock_status, locking_user;
			this.getView().getModel().read("/lock_ep_requestSet", {
				filters: oFilter,
				success: function (oData) {
					if (oData.results.length === 0) {
						lock_status = 'locked';
					} else {
						lock_status = 'open';
						locking_user = oData.results[0].LockVorna
					}
				},
				async: false
			});

			var oParameter = {
				"EpRequestId": property.EpRequestId,
				"HotfixId": property.HotfixId
			};

			//lock ep_request
			this._lock_ep_request(oParameter);
			//////////////////////
			var Comment_Type;
			if (this.getView().byId('Ready_EP').getType() === 'Emphasized') {
				Comment_Type = '3';
			} else if (this.getView().byId('Queue_EP').getType() === 'Emphasized') {
				Comment_Type = '4';
			}
			var Ep_request_filter = new sap.ui.model.Filter("EpRequestId", sap.ui.model.FilterOperator.EQ, property.EpRequestId);
			var sps_name_id_filter = new sap.ui.model.Filter("SpsName", sap.ui.model.FilterOperator.EQ, property.SpsName);
			var hotfix_id_filter = new sap.ui.model.Filter("HotfixId", sap.ui.model.FilterOperator.EQ, property.HotfixId);
			var CommentType_id_filter = new sap.ui.model.Filter("CommentType", sap.ui.model.FilterOperator.EQ, Comment_Type);
			var oFilters = [Ep_request_filter, sps_name_id_filter, hotfix_id_filter, CommentType_id_filter];
			var that = this;
			this.getView().getModel().read("/codeline_c_f_userSet", {
				filters: oFilters,
				success: function (oData) {
					if (oData.results.length !== 0) {

						var codeline_comment = [],
							assembly_comment = [];
						for (var i = 0; i < oData.results.length; i++) {
							switch (oData.results[i].CommentType) {
							case '3':
								codeline_comment.push(oData.results[i]);
								break;
							case '4':
								assembly_comment.push(oData.results[i]);
								break;
							}
						}
					}
					var codeline_comment_model = new sap.ui.model.json.JSONModel();
					var assembly_comment_model = new sap.ui.model.json.JSONModel();
					codeline_comment_model.setData({
						codeline_comment: codeline_comment
					});
					assembly_comment_model.setData({
						assembly_comment: assembly_comment
					});

					if (!that.comment_on_codeline) {
						that.comment_on_codeline = sap.ui.xmlfragment("epdash.epdash.view.comments_on_codeline", that);
						that.getView().addDependent(that.comment_on_codeline);
						//  this._oPopover.bindElement("/ProductCollection/0");
					}
					that.comment_on_codeline.setModel(codeline_comment_model, 'codeline_comment_model');
					//	that.comment_on_ep.setModel(assembly_comment_model, 'assembly_comment_model');
					that.comment_on_codeline.setModel(oModel_EP_detail, 'codeline_detail');
					that.comment_on_codeline.open();

				},
				error: function (err) {

				},
				async: false
			});
			//add comment from rm and hfg
			var oFilters_new = [Ep_request_filter, hotfix_id_filter];
			this.getView().getModel().read("/ep_comment_f_userSet", {
				filters: oFilters_new,
				success: function (oData) {
					if (oData.results.length !== 0) {

						var RM_c_data = [],
							HFG_c_data = [];
						for (var i = 0; i < oData.results.length; i++) {
							switch (oData.results[i].CommentType) {
							case '1':
								RM_c_data.push(oData.results[i]);
								break;
							case '2':
								HFG_c_data.push(oData.results[i]);
								break;
							}
						}

					}
					var RM_c_model = new sap.ui.model.json.JSONModel();
					var HFG_c_model = new sap.ui.model.json.JSONModel();
					RM_c_model.setData({
						rm_comment: RM_c_data
					});
					HFG_c_model.setData({
						hfg_comment: HFG_c_data
					});
					that.comment_on_codeline.setModel(RM_c_model, 'rm_comments');
					that.comment_on_codeline.setModel(HFG_c_model, 'hfg_comments');
				},
				error: function () {

				},
				async: true
			});
			///end of service here

			if (lock_status === 'locked') {
				sap.ui.getCore().byId('codeline_comment').setEnabled(true);
				sap.ui.getCore().byId('save_codeline_cmnt_button').setEnabled(true);
				sap.ui.getCore().byId('codeline_comment').setValue(" ");
			} else {
				sap.ui.getCore().byId('codeline_comment').setValue("EP has been locked by " + locking_user);
				sap.ui.getCore().byId('codeline_comment').setEnabled(false);
				sap.ui.getCore().byId('save_codeline_cmnt_button').setEnabled(false);
				sap.m.MessageBox.warning("EP has been locked by " + locking_user);
			}
		},

		save_comment_for_an_codeline_assembly: function () {
			var Comment_Type;
			if (this.getView().byId('Ready_EP').getType() === 'Emphasized') {
				Comment_Type = '3';
			} else if (this.getView().byId('Queue_EP').getType() === 'Emphasized') {
				Comment_Type = '4';
			}
			if (sap.ui.getCore().byId('codeline_comment').getValue() === '') {
				sap.m.MessageBox.error('Please add some comment!!');
			} else {
				var oParameter = {
					"EpRequestId": this.comment_on_codeline.getModel('codeline_detail').getData().data.EpRequestId,
					"SpsName": this.comment_on_codeline.getModel('codeline_detail').getData().data.SpsName,
					"HotfixId": this.comment_on_codeline.getModel('codeline_detail').getData().data.HotfixId,
					"CodelineType": this.comment_on_codeline.getModel('codeline_detail').getData().data.CodelineType,
					"Comments": sap.ui.getCore().byId('codeline_comment').getValue(),
					"CommentType": Comment_Type
				};
				this.getView().getModel().create("/codeline_c_f_userSet", oParameter);
				sap.m.MessageToast.show("Comment has been saved");
				this.comment_on_codeline.close();
				this._unlock_ep_request(oParameter);
				sap.ui.getCore().byId('codeline_comment').setValue('');
			}
		},
		close_codeline_comment_assembly_dialog: function () {
			var oParameter = {
				"EpRequestId": this.comment_on_codeline.getModel('codeline_detail').getData().data.EpRequestId,
				"HotfixId": this.comment_on_codeline.getModel('codeline_detail').getData().data.HotfixId
			};
			if (sap.ui.getCore().byId('codeline_comment').getEnabled() !== false) {
				this._unlock_ep_request(oParameter);
			}
			this.comment_on_codeline.close();

		},
		TakeOver_Assembly: function (oEvent) {
			this.showBusyIndicator(2000, 0);
			var property = oEvent.getSource().getParent().getBindingContext().getProperty(oEvent.getSource().getParent().getBindingContext()
				.getPath());
			var oParameter = {
				"ProductId": property.ProductId,
				"ProductTriggerId": property.ProductTriggerId
			};
			if (oEvent.getSource().getText().includes('PICK') === true) {
				oEvent.getSource().setText(username + '-' + parseFloat(property.ProductTriggerId));
				oEvent.getSource().setType("Emphasized");
				this.getView().getModel().create("/assem_a_f_userSet", oParameter);
				this.onPress_Assembly_in_Queue();
			} else if (oEvent.getSource().getText() === username + '-' + parseFloat(property.ProductTriggerId)) {
				oEvent.getSource().setText('PICK' + '-' + parseFloat(property.ProductTriggerId));
				oEvent.getSource().setType("Default");
				this.getView().getModel().update("/assem_a_f_userSet(ProductId='" + oParameter.ProductId + "',ProductTriggerId='" + oParameter
					.ProductTriggerId +
					"')", oParameter, null,
					function () {
						var oMsg = "Updated Sussefully!!";
						sap.m.MessageBox.success(oMsg);
					},
					function () {
						sap.m.MessageBox.error("Failed to Update");
					}
				);
				this.onPress_Assembly_in_Queue();
			} else if (oEvent.getSource().getText().includes('PICK') !== true && oEvent.getSource().getText() !== username) {
				var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
				sap.m.MessageBox.alert(
					"Sorry You can't takeover the assembly , It has already taken by " + oEvent.getSource().getText(), {
						styleClass: bCompact ? "sapUiSizeCompact" : ""
					}
				);
			}

		},

		Comment_on_Assembly: function (oEvent) {
			var property = oEvent.getSource().getParent().getBindingContext().getProperty(oEvent.getSource().getParent().getBindingContext()
				.getPath());
			var oModel_assembly_detail = new sap.ui.model.json.JSONModel({
				data: property
			});

			var Product_Id = new sap.ui.model.Filter("ProductId", sap.ui.model.FilterOperator.EQ, property.ProductId);
			var Product_Trigger_id = new sap.ui.model.Filter("ProductTriggerId", sap.ui.model.FilterOperator.EQ, property.ProductTriggerId);
			var CommentType_id_filter = new sap.ui.model.Filter("CommentType", sap.ui.model.FilterOperator.EQ, '4');
			var oFilters = [Product_Id, Product_Trigger_id, CommentType_id_filter];
			var that = this;
			this.getView().getModel().read("/assem_c_f_userSet", {
				filters: oFilters,
				success: function (oData) {
					if (oData.results.length !== 0) {

						var assembly_comment = [];
						for (var i = 0; i < oData.results.length; i++) {

							assembly_comment.push(oData.results[i]);

						}
					}
					var assembly_comment_model = new sap.ui.model.json.JSONModel();
					assembly_comment_model.setData({
						assembly_comment: assembly_comment
					});

					if (!that.comment_on_assembly) {
						that.comment_on_assembly = sap.ui.xmlfragment("epdash.epdash.view.comment_on_assembly_in_queue", that);
						that.getView().addDependent(that.comment_on_assembly);
						//  this._oPopover.bindElement("/ProductCollection/0");
					}
					that.comment_on_assembly.setModel(assembly_comment_model, 'assembly_comments');
					that.comment_on_assembly.setModel(oModel_assembly_detail, 'assembly_detail');
					that.comment_on_assembly.open();

				},
				error: function (err) {

				},
				async: false
			});

		},
		save_comment_for_assembly: function (oEvent) {
			var Comment_Type = '4';

			if (sap.ui.getCore().byId('assembly_comment').getValue() === '') {
				sap.m.MessageBox.error('Please add some comment!!');
			} else {
				var oParameter = {
					"ProductId": this.comment_on_assembly.getModel('assembly_detail').getData().data.ProductId,
					"ProductTriggerId": this.comment_on_assembly.getModel('assembly_detail').getData().data.ProductTriggerId,
					"Comments": sap.ui.getCore().byId('assembly_comment').getValue(),
					"CommentType": Comment_Type
				};
				this.getView().getModel().create("/assem_c_f_userSet", oParameter);
				sap.m.MessageToast.show("Comment has been saved");
				this.comment_on_assembly.close();
				sap.ui.getCore().byId('assembly_comment').setValue('');
				this.onPress_Assembly_in_Queue();
			}
		},

		close_assembly_comment_dialog: function () {
			sap.ui.getCore().byId('assembly_comment').setValue('');
			this.comment_on_assembly.close();
		},

		bindcolor: function (oEvent) {
			var oTable;

			if (this.getView().byId("idProductsTable").getVisible() == true) {
				oTable = this.getView().byId("idProductsTable");
				var Eid = oTable.sId.split("--")[0] + "--EpRequestId-" + oTable.sId.split("--")[0] + "--idProductsTable-";
				var Hid = oTable.sId.split("--")[0] + "--HotfixId-" + oTable.sId.split("--")[0] + "--idProductsTable-";
			} else {
				oTable = this.getView().byId("idProductsTable23");
				var Eid = oTable.sId.split("--")[0] + "--EpRequestId23-" + oTable.sId.split("--")[0] + "--idProductsTable23-";
				var Hid = oTable.sId.split("--")[0] + "--HotfixId23-" + oTable.sId.split("--")[0] + "--idProductsTable23-";
			}

			var row;

			var items = oTable.getItems();

			for (var k = 0; k < items.length; k++) {
				if (this.getView().byId("idProductsTable").getVisible() == true) {
					var main = oTable.getItems()[k].getCells().length - 1;
					var product = oTable.getModel().getProperty(oTable.getItems()[k].oBindingContexts.undefined.sPath).ProductName;
					var value = oTable.getModel().getProperty(oTable.getItems()[k].oBindingContexts.undefined.sPath).Urgency;
					var sys_role_value = oTable.getModel().getProperty(oTable.getItems()[k].oBindingContexts.undefined.sPath).CollectionSystemRole;
				} else {
					var main = oTable.getItems()[k].getCells().length - 2;
					var product = oTable.getModel('ep_under_rm_hfg').getProperty(oTable.getItems()[k].getBindingContext('ep_under_rm_hfg').getPath())
						.ProductName;
					var value = oTable.getModel('ep_under_rm_hfg').getProperty(oTable.getItems()[k].getBindingContext('ep_under_rm_hfg').getPath())
						.Urgency;
					var sys_role_value = oTable.getModel('ep_under_rm_hfg').getProperty(oTable.getItems()[k].getBindingContext('ep_under_rm_hfg')
							.getPath())
						.CollectionSystemRole;
				}

				if (this.getView().byId("idProductsTable23").getVisible() == true) {
					var Epsys23 = oTable.sId.split("--")[0] + "--EpRequestId23-" + oTable.sId.split("--")[0] + "--idProductsTable23-"; //__xmlview1--EpRequestId23-__xmlview1--idProductsTable23-0
					var prod23 = oTable.sId.split("--")[0] + "--ProductVer23-" + oTable.sId.split("--")[0] + "--idProductsTable23-";
					var hotsys23 = oTable.sId.split("--")[0] + "--HotfixId23-" + oTable.sId.split("--")[0] + "--idProductsTable23-";
					var hotfixreque23 = oTable.sId.split("--")[0] + "--requester23-" + oTable.sId.split("--")[0] + "--idProductsTable23-";
					var sysRole = oTable.sId.split("--")[0] + "--rm_sysRole_val-" + oTable.sId.split("--")[0] + "--idProductsTable23-";
					//	var headsys23 = oTable.sId.split("--")[0] + "--headerstatus23-" + oTable.sId.split("--")[0] + "--idProductsTable23-";
					this.getView().byId(Epsys23 + k).removeStyleClass("myCustomTablegreenEP");
					this.getView().byId(prod23 + k).removeStyleClass("myCustomTablegreenEP");
					this.getView().byId(hotsys23 + k).removeStyleClass("myCustomTablegreenEP");
					this.getView().byId(hotfixreque23 + k).removeStyleClass("myCustomTablegreenEP");
					//	this.getView().byId(headsys23 + k).removeStyleClass("myCustomTablegreenEP");
					this.getView().byId(Epsys23 + k).removeStyleClass("myCustomTablegreyEP");
					this.getView().byId(prod23 + k).removeStyleClass("myCustomTablegreyEP");
					this.getView().byId(hotsys23 + k).removeStyleClass("myCustomTablegreyEP");
					this.getView().byId(hotfixreque23 + k).removeStyleClass("myCustomTablegreyEP");
					//	this.getView().byId(headsys23 + k).removeStyleClass("myCustomTablegreyEP");
					this.getView().byId(Epsys23 + k).removeStyleClass("myCustomTableorangeEP");
					this.getView().byId(prod23 + k).removeStyleClass("myCustomTableorangeEP");
					this.getView().byId(hotsys23 + k).removeStyleClass("myCustomTableorangeEP");
					this.getView().byId(hotfixreque23 + k).removeStyleClass("myCustomTableorangeEP");
					if (product === 'SAPA1S' && ((sys_role_value.includes("COD") || sys_role_value.includes("C4C")) === true &&
							(sys_role_value.includes("BYD") || sys_role_value.includes("TEM")) === false)) {
						this.getView().byId(Epsys23 + k).addStyleClass("myCustomTablegreenEP");
						this.getView().byId(prod23 + k).addStyleClass("myCustomTablegreenEP");
						this.getView().byId(hotsys23 + k).addStyleClass("myCustomTablegreenEP");
						this.getView().byId(hotfixreque23 + k).addStyleClass("myCustomTablegreenEP");
						//	this.getView().byId(headsys23 + k).addStyleClass("myCustomTablegreenEP");
					} else if (product === 'SAPA1S' && ((sys_role_value.includes("COD") || sys_role_value.includes("C4C")) === true &&
							(sys_role_value.includes("BYD") || sys_role_value.includes("TEM")) === true)) {
						this.getView().byId(Epsys23 + k).addStyleClass("myCustomTablegreyEP");
						this.getView().byId(prod23 + k).addStyleClass("myCustomTablegreyEP");
						this.getView().byId(hotsys23 + k).addStyleClass("myCustomTablegreyEP");
						this.getView().byId(hotfixreque23 + k).addStyleClass("myCustomTablegreyEP");
						//	this.getView().byId(headsys23 + k).addStyleClass("myCustomTablegreyEP");
					} else if ((product === 'S4HANA CLOUD') && (sys_role_value.includes("IBP_OD") || sys_role_value.includes("SCP_ABAP "))) {
						this.getView().byId(Epsys23 + k).addStyleClass("myCustomTableorangeEP");
						this.getView().byId(prod23 + k).addStyleClass("myCustomTableorangeEP");
						this.getView().byId(hotsys23 + k).addStyleClass("myCustomTableorangeEP");
						this.getView().byId(sysRole + k).addStyleClass("myCustomTableorangeEP");
					}
				}
			}

		},

		bindcolor1: function () {
			var oTable = this.getView().byId("idEPTable");
			var Eid = oTable.sId.split("--")[0] + "--EpRequestIdEP-" + oTable.sId.split("--")[0] + "--idEPTable-";
			var Hid = oTable.sId.split("--")[0] + "--HotfixIdEP-" + oTable.sId.split("--")[0] + "--idEPTable-";
			var row;

			var items = oTable.getItems();

			for (var k = 0; k < items.length; k++) {
				if (oTable.getItems()[k].getBindingContextPath() !== undefined) {
					var product = oTable.getModel('codeline_in_process').getProperty(oTable.getItems()[k].getBindingContext('codeline_in_process')
							.getPath())
						.ProductName;
					var sys_role_value = oTable.getModel('codeline_in_process').getProperty(oTable.getItems()[k].getBindingContext(
							'codeline_in_process').getPath())
						.CollectionSystemRole;

					this.getView().byId(oTable.getItems()[k].mAggregations.cells[0].getContent()[0].sId).removeStyleClass("myCustomTablegreyEP");
					this.getView().byId(oTable.getItems()[k].mAggregations.cells[1].sId).removeStyleClass("myCustomTablegreyEP");
					this.getView().byId(oTable.getItems()[k].mAggregations.cells[2].sId).removeStyleClass("myCustomTablegreyEP");
					this.getView().byId(oTable.getItems()[k].mAggregations.cells[3].sId).removeStyleClass("myCustomTablegreyEP");
					this.getView().byId(oTable.getItems()[k].mAggregations.cells[0].getContent()[0].sId).removeStyleClass("myCustomTablegreenEP");
					this.getView().byId(oTable.getItems()[k].mAggregations.cells[1].sId).removeStyleClass("myCustomTablegreenEP");
					this.getView().byId(oTable.getItems()[k].mAggregations.cells[2].sId).removeStyleClass("myCustomTablegreenEP");
					this.getView().byId(oTable.getItems()[k].mAggregations.cells[3].sId).removeStyleClass("myCustomTablegreenEP");
					this.getView().byId(oTable.getItems()[k].mAggregations.cells[0].getContent()[0].sId).removeStyleClass("myCustomTableorangeEP");
					this.getView().byId(oTable.getItems()[k].mAggregations.cells[1].sId).removeStyleClass("myCustomTableorangeEP");
					this.getView().byId(oTable.getItems()[k].mAggregations.cells[2].sId).removeStyleClass("myCustomTableorangeEP");
					this.getView().byId(oTable.getItems()[k].mAggregations.cells[3].sId).removeStyleClass("myCustomTableorangeEP");

					if (product === 'SAPA1S' && ((sys_role_value.includes("COD") || sys_role_value.includes("C4C")) === true &&
							(sys_role_value.includes("BYD") || sys_role_value.includes("TEM")) === false)) {

						this.getView().byId(oTable.getItems()[k].mAggregations.cells[0].getContent()[0].sId).addStyleClass("myCustomTablegreenEP");
						this.getView().byId(oTable.getItems()[k].mAggregations.cells[1].sId).addStyleClass("myCustomTablegreenEP");
						this.getView().byId(oTable.getItems()[k].mAggregations.cells[2].sId).addStyleClass("myCustomTablegreenEP");
						this.getView().byId(oTable.getItems()[k].mAggregations.cells[3].sId).addStyleClass("myCustomTablegreenEP");

					} else if (product === 'SAPA1S' && ((sys_role_value.includes("COD") || sys_role_value.includes("C4C")) === true &&
							(sys_role_value.includes("BYD") || sys_role_value.includes("TEM")) === true)) {
						this.getView().byId(oTable.getItems()[k].mAggregations.cells[0].getContent()[0].sId).addStyleClass("myCustomTablegreyEP");
						this.getView().byId(oTable.getItems()[k].mAggregations.cells[1].sId).addStyleClass("myCustomTablegreyEP");
						this.getView().byId(oTable.getItems()[k].mAggregations.cells[2].sId).addStyleClass("myCustomTablegreyEP");
						this.getView().byId(oTable.getItems()[k].mAggregations.cells[3].sId).addStyleClass("myCustomTablegreyEP");

					} else if ((product === 'S4HANA CLOUD') && (sys_role_value.includes("IBP_OD") || sys_role_value.includes("SCP_ABAP"))) {
						this.getView().byId(oTable.getItems()[k].mAggregations.cells[0].getContent()[0].sId).addStyleClass("myCustomTableorangeEP");
						this.getView().byId(oTable.getItems()[k].mAggregations.cells[1].sId).addStyleClass("myCustomTableorangeEP");
						this.getView().byId(oTable.getItems()[k].mAggregations.cells[2].sId).addStyleClass("myCustomTableorangeEP");
						this.getView().byId(oTable.getItems()[k].mAggregations.cells[3].sId).addStyleClass("myCustomTableorangeEP");
					}
				}

			};

		},

		bindcolorassem_queue: function (oEvt) {
			var oTable = this.getView().byId("EP_req_table");
			var row;
			oTable.sId;
			var items = oTable.getItems();
			var gid = oTable.sId.split("--")[0] + "--GrID-" + oTable.sId.split("--")[0] + "--EP_req_table-";
			var ep_assem = oTable.sId.split("--")[0] + "--assemEP_com-" + oTable.sId.split("--")[0] + "--EP_req_table-";
			var sps_assem = oTable.sId.split("--")[0] + "--assemSPS_com-" + oTable.sId.split("--")[0] + "--EP_req_table-";
			var hot_assem = oTable.sId.split("--")[0] + "--assemhot_com-" + oTable.sId.split("--")[0] + "--EP_req_table-";
			//   this.getView().byId('__xmlview1--coloumidEP_req-__xmlview1--EP_req_table-0').addStyleClass('myCustomTablered');
			for (var k = 0; k < items.length; k++) {
				var oTableEP = this.getView().byId("EP_req_table");
				var sys_role_value = oTable.getItems()[k].getCells()[4].mBindingInfos.text.binding.oValue;

				//	var urgency = oTable.getItems()[k].getCells()[13].mBindingInfos.text.binding.oValue;
				var product = oTable.getModel().getProperty(oTable.getItems()[k].oBindingContexts.undefined.sPath).ProductName;
				var urgency = oTable.getModel().getProperty(oTable.getItems()[k].oBindingContexts.undefined.sPath).Urgency;
				this.getView().byId(gid + k).removeStyleClass("myCustomTablegreenEP");
				this.getView().byId(ep_assem + k).removeStyleClass("myCustomTablegreenEP");
				this.getView().byId(sps_assem + k).removeStyleClass("myCustomTablegreenEP");
				this.getView().byId(hot_assem + k).removeStyleClass("myCustomTablegreenEP");
				this.getView().byId(gid + k).removeStyleClass("myCustomTablegreyEP");
				this.getView().byId(ep_assem + k).removeStyleClass("myCustomTablegreyEP");
				this.getView().byId(sps_assem + k).removeStyleClass("myCustomTablegreyEP");
				this.getView().byId(hot_assem + k).removeStyleClass("myCustomTablegreyEP");
				this.getView().byId(gid + k).removeStyleClass("myCustomTableorangeEP");
				this.getView().byId(ep_assem + k).removeStyleClass("myCustomTableorangeEP");
				this.getView().byId(sps_assem + k).removeStyleClass("myCustomTableorangeEP");
				this.getView().byId(hot_assem + k).removeStyleClass("myCustomTableorangeEP");

				///
				if (product === 'SAPA1S' && ((sys_role_value.includes("COD") || sys_role_value.includes("C4C")) === true &&
						(sys_role_value.includes("BYD") || sys_role_value.includes("TEM")) === false)) {
					row = oTable.getItems()[k].sId;
					this.getView().byId(gid + k).addStyleClass("myCustomTablegreenEP");
					this.getView().byId(ep_assem + k).addStyleClass("myCustomTablegreenEP");
					this.getView().byId(sps_assem + k).addStyleClass("myCustomTablegreenEP");
					this.getView().byId(hot_assem + k).addStyleClass("myCustomTablegreenEP");
				} else if (product === 'SAPA1S' && ((sys_role_value.includes("COD") || sys_role_value.includes("C4C")) === true &&
						(sys_role_value.includes("BYD") || sys_role_value.includes("TEM")) === true)) {
					this.getView().byId(gid + k).addStyleClass("myCustomTablegreyEP");
					this.getView().byId(ep_assem + k).addStyleClass("myCustomTablegreyEP");
					this.getView().byId(sps_assem + k).addStyleClass("myCustomTablegreyEP");
					this.getView().byId(hot_assem + k).addStyleClass("myCustomTablegreyEP");
				} else if ((product === 'S4HANA CLOUD') && (sys_role_value.includes("IBP_OD") || sys_role_value.includes("SCP_ABAP"))) {
					this.getView().byId(gid + k).addStyleClass("myCustomTableorangeEP");
					this.getView().byId(ep_assem + k).addStyleClass("myCustomTableorangeEP");
					this.getView().byId(sps_assem + k).addStyleClass("myCustomTableorangeEP");
					this.getView().byId(hot_assem + k).addStyleClass("myCustomTableorangeEP");
				}
				// else if ((product === 'S4HANA CLOUD') && (sys_role_value.includes("IBP") || sys_role_value.includes("SCP_ABAP"))) {
				// 	this.getView().byId(Epsys23 + k).addStyleClass("myCustomTableorangeEP");
				// 	this.getView().byId(prod23 + k).addStyleClass("myCustomTableorangeEP");
				// 	this.getView().byId(hotsys23 + k).addStyleClass("myCustomTableorangeEP");
				// 	this.getView().byId(hotfixreque23 + k).addStyleClass("myCustomTableorangeEP");
				// }
				/*	if (urgency === '3') {
						this.getView().byId(items[k].sId).addStyleClass('myCustomTablered');
					} else if (urgency === '5') {
						this.getView().byId(items[k].sId).addStyleClass('myCustomTablewhite');
					} else if (urgency === '7') {
						this.getView().byId(items[k].sId).addStyleClass('myCustomTablegreen');
					}*/

			}
		},

		_refresh_app_cache_data: function () {
			document.addEventListener('DOMContentLoaded', function () {
				if (Notification.permission !== "granted")
					Notification.requestPermission();
			});
			var dts = Math.floor(Date.now());
			var b1 = main_globalme.getView().byId("Default");
			var b2 = main_globalme.getView().byId("awaRmApproval");
			var b3 = main_globalme.getView().byId("awaHfgApproval");
			var b4 = main_globalme.getView().byId("Ready_EP");
			var b5 = main_globalme.getView().byId("Queue_EP");
			var b6 = main_globalme.getView().byId("vp_awaiting");
			var oTable = main_globalme.getView().byId("idProductsTable23");
			var oTablehide = main_globalme.getView().byId("idProductsTable");
			var oTemplate = main_globalme.getView().byId("coloumid23");
			var oPanel = main_globalme.getView().byId("idTablePanel");
			var oTable1 = main_globalme.getView().byId("idEPTable");
			var oTemplate1 = main_globalme.getView().byId("coloumidEP");
			var that = main_globalme;
			//  oPanel.removeAllContent();
			if (b1.getType() == 'Emphasized') {
				//	window.setTimeout(that.cleartable, 37000);
			} else if (b2.getType() == 'Emphasized') {
				oTable.setVisible(true);
				oTablehide.setVisible(false);
				var filtersTitle = [];
				for (var i = 0; i < array.length; i++) {
					var oFilters1 = new sap.ui.model.Filter("ProductName", sap.ui.model.FilterOperator.EQ, array[i]);
					filtersTitle.push(oFilters1);
				};
				var prev_items = main_globalme.getView().getModel('ep_under_rm_hfg').getData();
				main_globalme.prev_items_ep_req = [];
				for (var i = 0; i < prev_items.length; i++) {
					main_globalme.prev_items_ep_req.push(prev_items[i].EpRequestId);
				}
				main_globalme.getView().getModel().read("/ep_under_rmSet", {
					filters: filtersTitle,
					success: function (oData) {
						main_globalme.ep_under_rm_hfg.refresh(true);
						main_globalme.ep_under_rm_hfg.setData(oData.results);
						oTable.setModel(main_globalme.ep_under_rm_hfg, 'ep_under_rm_hfg');
						var latest_items = main_globalme.getView().getModel('ep_under_rm_hfg').getData();
						var latest_items_ep_req = [];
						if (oData.results.length != '0') {
							for (var i = 0; i < latest_items.length; i++) {
								latest_items_ep_req.push(latest_items[i].EpRequestId);
							}
							for (var j = 0; j < latest_items_ep_req.length; j++) {
								if (main_globalme.prev_items_ep_req.indexOf(latest_items_ep_req[j]) === -1) {
									if (main_globalme.getView().byId("switch").getState() == true) {
										var notification = new Notification('New Entry for RM Approval', {
											icon: 'img/RM.png',
											body: "New EP's" + " " + parseFloat(latest_items_ep_req[j]) + " " + "added in the list",
											dir: "ltr",
											requireInteraction: true
										});
										var audio = document.getElementById("idErrorSound");
										audio.play();
									};
								}
							}
							var aSorters = [];
							if (main_globalme.ep !== "") {
								aSorters.push(new sap.ui.model.Sorter(main_globalme.ep, main_globalme.epState, null));
							}
							if (main_globalme.pver !== "") {
								aSorters.push(new sap.ui.model.Sorter(main_globalme.pver, main_globalme.spsState, null));
							}
							if (main_globalme.hf !== "") {
								aSorters.push(new sap.ui.model.Sorter(main_globalme.hf, main_globalme.hfState, null));
							}
							if (main_globalme.code !== "") {
								aSorters.push(new sap.ui.model.Sorter(main_globalme.code, main_globalme.codeState, null));
							}
							if (main_globalme.Correction !== "") {
								aSorters.push(new sap.ui.model.Sorter(main_globalme.Correction, main_globalme.CorrectionState, null));
							}
							var oBinding = oTable.getBinding("items");
							oBinding.sort(aSorters);
							that.bindcolor();
							if (short.length != 0) {
								var oBinding = oTable.getBinding("items");
								oBinding.filter(short);
							}
							//	oPanel.addContent(oTable);
							that.bindcolor();
						}

					}
				});
				//	window.setTimeout(that.cleartable, 37000);
			} else if (b3.getType() == 'Emphasized') {
				oTable.setVisible(true);
				oTablehide.setVisible(false);
				var filtersTitle = [];
				for (var i = 0; i < array.length; i++) {
					var oFilters1 = new sap.ui.model.Filter("ProductName", sap.ui.model.FilterOperator.EQ, array[i]);
					filtersTitle.push(oFilters1);
				};
				var prev_items = main_globalme.getView().getModel('ep_under_rm_hfg').getData();
				main_globalme.prev_items_ep_req = [];
				for (var i = 0; i < prev_items.length; i++) {
					main_globalme.prev_items_ep_req.push(prev_items[i].EpRequestId);
				}
				main_globalme.getView().getModel().read("/ep_under_hfgSet", {
					filters: filtersTitle,
					success: function (oData) {

						main_globalme.ep_under_rm_hfg.refresh(true);
						main_globalme.ep_under_rm_hfg.setData(oData.results);
						oTable.setModel(main_globalme.ep_under_rm_hfg, 'ep_under_rm_hfg');
						/*that.oData = oData.results;
						that.json = new sap.ui.model.json.JSONModel();
						that.json.setData({
							path: that.oData
						});
						oTable.setModel(that.json);
						oTable.bindAggregation("items", {
							template: oTemplate,
							growing: "true"
						});*/
						that.getView().byId("idTablePanel").addContent(oTable);
						var latest_items = main_globalme.getView().getModel('ep_under_rm_hfg').getData();
						var latest_items_ep_req = [];
						if (oData.results.length != '0') {
							for (var i = 0; i < latest_items.length; i++) {
								latest_items_ep_req.push(latest_items[i].EpRequestId);
							}
							for (var j = 0; j < latest_items_ep_req.length; j++) {
								if (main_globalme.prev_items_ep_req.indexOf(latest_items_ep_req[j]) === -1) {
									if (main_globalme.getView().byId("switch").getState() == true) {
										var notification = new Notification('New Entry for HFG Approval', {
											icon: 'img/HFG.png',
											body: "New EP's" + " " + parseFloat(latest_items_ep_req[j]) + " " + "added in the list",
											dir: "ltr",
											requireInteraction: true
										});
										var audio = document.getElementById("idErrorSound");
										audio.play();
									};
								}
							}

							var aSorters = [];
							if (main_globalme.ep !== "") {
								aSorters.push(new sap.ui.model.Sorter(main_globalme.ep, main_globalme.epState, null));
							}
							if (main_globalme.pver !== "") {
								aSorters.push(new sap.ui.model.Sorter(main_globalme.pver, main_globalme.spsState, null));
							}
							if (main_globalme.hf !== "") {
								aSorters.push(new sap.ui.model.Sorter(main_globalme.hf, main_globalme.hfState, null));
							}
							if (main_globalme.code !== "") {
								aSorters.push(new sap.ui.model.Sorter(main_globalme.code, main_globalme.codeState, null));
							}
							if (main_globalme.Correction !== "") {
								aSorters.push(new sap.ui.model.Sorter(main_globalme.Correction, main_globalme.CorrectionState, null));
							}
							var oBinding = oTable.getBinding("items");
							oBinding.sort(aSorters);

							if (short.length != 0) {
								var oBinding = oTable.getBinding("items");
								oBinding.filter(short);
							}
							that.bindcolor();
						}

					}
				});
				//	window.setTimeout(that.cleartable, 37000);
			} else if (b4.getType() == 'Emphasized') {
				/*	var run;
					var check = oTable1.sId.split("--")[0] + "--coloumidEP-" + oTable1.sId.split("--")[0] + "--idEPTable-";
					for (var j = 0; j < oTable1.getItems().length; j++) {
						if (main_globalme.getView().byId(check + j + "-selectMulti").getSelected() == true) {
							run = 'stop';
						}
					}*/
				if (oTable1.getSelectedItems().length === 0) {
					var filtersTitle = [];
					for (var i = 0; i < array.length; i++) {
						var oFilters = new sap.ui.model.Filter("ProductName", sap.ui.model.FilterOperator.EQ, array[i]);
						filtersTitle.push(oFilters);
					};
					if (shortEP.length != 0) {
						filtersTitle = shortEP;
					}
					main_globalme.getView().getModel().read("/codeline_in_processSet", {
						filters: filtersTitle,
						success: function (oData) {
							main_globalme.codeline_line_model.refresh(true);
							main_globalme.codeline_line_model.setData(oData.results);
							oTable1.setModel(main_globalme.codeline_line_model, 'codeline_in_process');
							oTable1.setVisible(true);
							oPanel.addContent(oTable1);
							var aSorters = [];
							if (main_globalme.ep !== "") {
								aSorters.push(new sap.ui.model.Sorter(main_globalme.ep, main_globalme.epState, null));
							}
							if (main_globalme.sps !== "") {
								aSorters.push(new sap.ui.model.Sorter(main_globalme.sps, main_globalme.spsState, null));
							}
							if (main_globalme.hf !== "") {
								aSorters.push(new sap.ui.model.Sorter(main_globalme.hf, main_globalme.hfState, null));
							}
							if (main_globalme.code !== "") {
								aSorters.push(new sap.ui.model.Sorter(main_globalme.code, main_globalme.codeState, null));
							}
							if (aSorters.length !== 0) {
								var oBinding = oTable1.getBinding("items");
								oBinding.sort(aSorters);

							}
							that.bindcolor1();
							//   }
							//};
						}
					});

				}
				//		window.setTimeout(that.cleartable, 60000);
			} else if (b5.getType() == 'Emphasized') {
				//	that._refreshassemblyQueue();
				// var EPdeltable = that.getView().byId("EP_req_tabledelete");
				// var EPdeleteCol = that.getView().byId("coloumidEP_del");
				var oTable = that.getView().byId("EP_req_table");
				var oTemplate = that.getView().byId("coloumidEP_req");
				var filtersTitle = [];
				for (var i = 0; i < array.length; i++) {
					var oFilters = new sap.ui.model.Filter("ProductName", sap.ui.model.FilterOperator.EQ, array[i]);
					filtersTitle.push(oFilters);
				};

				if (oTable.getSelectedItems().length === 0 || assem_table_refresh_time === 300) {
					assem_table_refresh_time = 0;
					that.getView().getModel().read("/assem_in_queueSet", {
						filters: filtersTitle,
						success: function (oData) {
							var result = oData.results;
							that.oData = oData.results;
							that.json = new sap.ui.model.json.JSONModel();
							that.json.setData({
								path: that.oData
							});
							oTable.setModel(that.json);
							oTable.bindAggregation("items", {
								path: "/path",
								template: oTemplate,
								growing: "true"
							});
							that.bindcolorassem_queue();
						}
					});
				} else {
					assem_table_refresh_time = assem_table_refresh_time + 60;
				}

				//  oTable.bindAggregation("items",{path: "/ep_get_listSet", template:oTemplate});
				//  EPdeltable.bindAggregation("items",{path: "/delete_request_epsSet", template:EPdeleteCol});
				//	window.setTimeout(that.cleartable, 60000);
			} else if (b6.getType() == 'Emphasized') {
				//	window.setTimeout(that.cleartable, 37000);
			}
			//	window.setTimeout(that.cleartable, 60000);
		},

		updatemaster: function () {
			main_globalme.getView().getModel().read("/init_var_data_tableSet");
		},

		deletealllock: function () {
			var that = main_globalme;
			that.getView().getModel().read("/all_lock_deleteSet");
			//	window.setTimeout(that.deletealllock, 600000);
		},

		onchangeswitch: function (oEvent) {
			if (oEvent.getParameters().state == true) {
				MessageToast.show("Notification truned ON");
				this.getView().byId("switch").setCustomTextOn("OFF");
				this.getView().byId("switch").setTooltip("Notification ON");
				// this.getView().byId("switch").addStyleClass("switchclass");

			} else if (oEvent.getParameters().state == false) {
				MessageToast.show("Notification truned OFF");
				this.getView().byId("switch").setCustomTextOff("ON");
				this.getView().byId("switch").setTooltip("Notification OFF");
				//   this.getView().byId("switch").removeStyleClass("switchclass");
			}
		},

		onPersoButtonPressed: function (oEvent) {
			this._oTPC.openDialog();
		},

		onTableGrouping: function (oEvent) {
			this._oTPC.setHasGrouping(oEvent.getSource().getSelected());
		},

		onPersoButtonPressed1: function (oEvent) {
			this._oTPC1.openDialog();
		},

		onPersoButtonPressed23: function (oEvent) {
			this._oTPC23.openDialog();
		},

		onTableGrouping1: function (oEvent) {
			this._oTPC1.setHasGrouping(oEvent.getSource().getSelected());
		},

		onPersoButtonNote: function (oEvent) {
			var that = this;
			if (!that.tablehelp) {
				that.tablehelp = sap.ui.xmlfragment("epdash.epdash.view.tablehelp", that);
			}
			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", that.getView(), that.tablehelp);
			that.tablehelp.open();
			var oButton = new sap.m.Button({
				text: "Close",
				press: function () {
					that.tablehelp.close();
				}
			});
			that.tablehelp.setBeginButton(oButton);
		},

		tool: function () {
			alert("Test");
		},

		handleViewSettingsDialogButtonPressed: function () {
			if (!this.table1viewsetting) {
				this.table1viewsetting = sap.ui.xmlfragment("epdash.epdash.view.table1viewsetting", this);
			}

			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this.table1viewsetting);
			this.table1viewsetting.open();
		},

		handleConfirm: function (oEvent) {

			var oView = this.getView();
			var oTable = oView.byId("idProductsTable");

			var mParams = oEvent.getParameters();
			var oBinding = oTable.getBinding("items");

			// apply sorter to binding
			// (grouping comes before sorting)
			var aSorters = [];
			if (mParams.groupItem) {
				var sPath = mParams.groupItem.getKey();
				var bDescending = mParams.groupDescending;
				var vGroup = this.mGroupFunctions[sPath];
				aSorters.push(new Sorter(sPath, bDescending, vGroup));
			}
			var sPath = mParams.sortItem.getKey();
			var bDescending = mParams.sortDescending;
			aSorters.push(new Sorter(sPath, bDescending));
			oBinding.sort(aSorters);

			// apply filters to binding
			var aFilters = [];
			jQuery.each(mParams.filterItems, function (i, oItem) {
				var aSplit = oItem.getKey().split("___");
				var sPath = aSplit[0];
				var sOperator = aSplit[1];
				var sValue1 = aSplit[2];
				var sValue2 = aSplit[3];
				var oFilter = new Filter(sPath, sOperator, sValue1, sValue2);
				aFilters.push(oFilter);
			});
			oBinding.filter(aFilters);

			// update filter bar
			oView.byId("vsdFilterBar").setVisible(aFilters.length > 0);
			oView.byId("vsdFilterLabel").setText(mParams.filterString);
			this.bindcolor();
		},

		handleViewSettingsDialogButtonPressedEPtable: function () {
			if (!this.table2viewsetting) {
				this.table2viewsetting = sap.ui.xmlfragment("epdash.epdash.view.table2viewsetting", this);
			}
			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this.table2viewsetting);
			this.table2viewsetting.open();
		},

		handleConfirmEP: function (oEvent) {

			var oView = this.getView();
			var oTable = oView.byId("idEPTable");

			var mParams = oEvent.getParameters();
			var oBinding = oTable.getBinding("items");

			// apply sorter to binding
			// (grouping comes before sorting)
			var aSorters = [];
			if (mParams.groupItem) {
				var sPath = mParams.groupItem.getKey();
				var bDescending = mParams.groupDescending;
				var vGroup = this.mGroupFunctions[sPath];
				aSorters.push(new Sorter(sPath, bDescending, vGroup));
			}
			var sPath = mParams.sortItem.getKey();
			var bDescending = mParams.sortDescending;
			aSorters.push(new Sorter(sPath, bDescending));
			oBinding.sort(aSorters);

			// apply filters to binding
			var aFilters = [];
			jQuery.each(mParams.filterItems, function (i, oItem) {
				var aSplit = oItem.getKey().split("___");
				var sPath = aSplit[0];
				var sOperator = aSplit[1];
				var sValue1 = aSplit[2];
				var sValue2 = aSplit[3];
				var oFilter = new Filter(sPath, sOperator, sValue1, sValue2);
				aFilters.push(oFilter);
			});
			oBinding.filter(aFilters);

			// update filter bar
			oView.byId("vsdFilterBar").setVisible(aFilters.length > 0);
			oView.byId("vsdFilterLabel").setText(mParams.filterString);
			this.bindcolor1();
		},
		assemblyLoadStart: function (oEvent) {
			var x = this.getView().byId("EP_req_table").getItems().length;
			var oTableEP = this.getView().byId("EP_req_table");
			for (var i = 0; i < x; i++) {
				var id = oEvent.oSource.sId.split("--")[0] + "--coloumidEP_req-" + oEvent.oSource.sId.split("--")[0] + "--EP_req_table-" + i;
				this.getView().byId(id).removeStyleClass("evenRowColors");
			}
		},
		assemblyLoadComplete: function (oControlEvent) {
			var cssClass = 0;
			var text, prevText;
			var x = this.getView().byId("EP_req_table").getItems().length;
			var oTableEP = this.getView().byId("EP_req_table");
			var oEv = oControlEvent.oSource.sId;
			if (x != 0) {
				for (var i = 0; i < x; i++) {
					text = this.getView().byId(oControlEvent.oSource.sId.split("--")[0] + "--coloumidEP_req-" + oControlEvent.oSource.sId.split(
						"--")[
						0] + "--EP_req_table-" + i).mAggregations.cells[0].getText();
					if (text !== prevText && i !== 0) { //same class
						cssClass = cssClass + 1;
					}

					//__xmlview1--coloumidEP_req-__xmlview1--EP_req_table-0
					var id = oControlEvent.oSource.sId.split("--")[0] + "--coloumidEP_req-" + oControlEvent.oSource.sId.split("--")[0] +
						"--EP_req_table-" + i;
					//var row = oTable.getItems()[k].sId;

					if (prevText !== text) { //cssClass % 2 === 0
						this.getView().byId(id).addStyleClass("evenRowColors");
						// $(id).addClass("");
					} else {
						//$(id).addClass("oddRowColors");
					}
					prevText = text;
				}

			}
		},

		_hotlinerUpdate: function (parameter) {
			var that = main_globalme;
			var filtersTitle = [];

			var oFiltersPID = new sap.ui.model.Filter("IV_HOTLINE", sap.ui.model.FilterOperator.EQ, parameter);

			filtersTitle.push(oFiltersPID);
			main_globalme.getView().getModel().read("/Hotline_Cloud_PatchSet", {
				filters: filtersTitle,
				success: function (oData) {
					var result = oData.results;
					if (oData.results.length != 0) {
						if (that.getView().byId("rot").getText() != result[0].HotlinerInRot || that.getView().byId("rotback").getText() != result[
								0].RotBackup ||
							that.getView().byId("blr").getText() != result[0].HotlinerInBlr || that.getView().byId("blrback").getText() != result[0]
							.BlrBackup
						) {
							that.getView().byId("rot").setText(result[0].HotlinerInRot);
							that.getView().byId("rot").setTooltip(createCallout("Start Chat with  " + result[0].HotRotEid, "Mail To " + result[0].HotRotEid));

							that.getView().byId("rotback").setText(result[0].RotBackup);
							that.getView().byId("rotback").setTooltip(createCallout("Start Chat with  " + result[0].RotBackupEid, "Mail To " +
								result[
									0]
								.RotBackupEid));

							that.getView().byId("blr").setText(result[0].HotlinerInBlr);
							that.getView().byId("blr").setTooltip(createCallout("Start Chat with  " + result[0].HotBlrEid, "Mail To " + result[0].HotBlrEid));

							that.getView().byId("blrback").setText(result[0].BlrBackup);
							that.getView().byId("blrback").setTooltip(createCallout("Start Chat with  " + result[0].BlrBackupEid, "Mail To " +
								result[
									0]
								.BlrBackupEid));

							that.getView().byId("can").setText(result[0].HotlinerInCan);
							that.getView().byId("can").setTooltip(createCallout("Start Chat with  " + result[0].HotCanEid, "Mail To " + result[0].HotCanEid));

							that.getView().byId("canback").setText(result[0].HotlinerCanBack);
							that.getView().byId("canback").setTooltip(createCallout("Start Chat with  " + result[0].HotCanBackId, "Mail To " +
								result[
									0]
								.HotCanBackId));

							function createCallout(sText, sMail) {
								var oButton1 = new sap.ui.commons.Button({
									press: function (oEvent) {
										that.clickSkype(sText);
									},
									icon: "{imageModel>/path}/skype.png",
									tooltip: sText,
								});
								var oButton2 = new sap.ui.commons.Button({
									press: function (oEvent) {
										that.clickmail(sMail);
									},
									icon: "{imageModel>/path}/mail.png",
									tooltip: sMail,
								});

								var HBox = new sap.ui.layout.HorizontalLayout({
									content: [oButton1, oButton2]
								})
								oButton1.addStyleClass("B1tool");
								oButton2.addStyleClass("B2tool");

								var oCallout = new sap.ui.commons.Callout({
									content: HBox
								});
								oCallout.addStyleClass("Callout");
								return oCallout;
							}
						}
					} else {
						that.getView().byId("rot").setText("");
						that.getView().byId("rotback").setText("");
						that.getView().byId("blr").setText("");
						that.getView().byId("blrback").setText("");
						that.getView().byId("can").setText("");
						that.getView().byId("canback").setText("");
					}
				},
				async: false
			});
		},

		onpatchassembly: function () {
			window.open("http://ldcihfs.wdf.sap.corp:50000/sap/bc/gui/sap/its/webgui?~TRANSACTION=*hf_patch_assembly  ")
		},

		open_hfs_hfx_EP: function (oEvent, val) {
			let Source_System, EP_Request_Id, Hotfix_Id, EP_UUID, Hotfix_UUID;
			let Model_Property;

			if (val === "") {
				Model_Property = oEvent.getSource().getParent().getParent().getModel().getProperty(oEvent.getSource().getBindingContext().getPath());
			} else {
				Model_Property = oEvent.getSource().getParent().getParent().getModel(val).getProperty(oEvent.getSource().getBindingContext(val)
					.getPath());
			}
			Source_System = Model_Property.SourceSystemId;
			EP_Request_Id = Model_Property.EpRequestId;
			Hotfix_Id = Model_Property.HotfixId;

			this.open_dialog_view(Source_System, EP_Request_Id, true, Hotfix_Id, false, oEvent.getSource());
		},

		open_hfs_hfx_Hot: function (oEvent, val) {
			let Source_System, EP_Request_Id, Hotfix_Id, EP_UUID, Hotfix_UUID;
			let Model_Property;

			if (val === "") {
				Model_Property = oEvent.getSource().getParent().getParent().getModel().getProperty(oEvent.getSource().getBindingContext().getPath());
			} else {
				Model_Property = oEvent.getSource().getParent().getParent().getModel(val).getProperty(oEvent.getSource().getBindingContext(val)
					.getPath());
			}
			Source_System = Model_Property.SourceSystemId;
			EP_Request_Id = Model_Property.EpRequestId;
			Hotfix_Id = Model_Property.HotfixId;

			this.open_dialog_view(Source_System, EP_Request_Id, false, Hotfix_Id, true, oEvent.getSource());
		},
		open_dialog_view: function (Source_System, EP_Request_Id, ep_val, Hotfix_Id, hot_val, Source) {
			let Hbox = new sap.m.VBox({
				items: [new sap.m.Button({
						text: "Login to Classic GUI",
						tooltip: "EP Request ID = " + EP_Request_Id,
						visible: ep_val,
						width: "100%",
						press: function () {
							main_globalme.classicGuilogin(Source_System, EP_Request_Id, "");
						}
					}),
					new sap.m.Button({
						text: "Login to Web GUI",
						tooltip: "EP Request ID = " + EP_Request_Id,
						visible: ep_val,
						width: "100%",
						press: function () {
							main_globalme.webGuilogin(Source_System, EP_Request_Id, "");
						}
					}),
					new sap.m.Button({
						text: "Login to Fiori GUI",
						tooltip: "Ep Request ID = " + EP_Request_Id,
						visible: ep_val,
						width: "100%",
						press: function () {
							main_globalme.Fiori_GUI(Source_System, EP_Request_Id, "");
						}
					}),
					new sap.m.Button({
						text: "Login to Classic GUI",
						tooltip: "Hotfix ID = " + Hotfix_Id,
						visible: hot_val,
						width: "100%",
						press: function () {
							main_globalme.classicGuilogin(Source_System, "", Hotfix_Id);
						}
					}),
					new sap.m.Button({
						text: "Login to Web GUI",
						tooltip: "Hotfix ID = " + Hotfix_Id,
						visible: hot_val,
						width: "100%",
						press: function () {
							main_globalme.webGuilogin(Source_System, "", Hotfix_Id);
						}
					}),
					new sap.m.Button({
						text: "Login to Fiori GUI",
						tooltip: "Hotfix ID = " + Hotfix_Id,
						visible: hot_val,
						width: "100%",
						press: function () {
							main_globalme.Fiori_GUI(Source_System, "", Hotfix_Id);
						}
					})
				]
			});
			// for(let itr in Hbox.getItems() ){
			// 	Hbox.getItems()[itr].addStyleClass("btn btn-secondary");
			// }
			this.open_ep_hotfix = new sap.m.Popover({
				title: "Login type",
				content: Hbox

			});
			this.open_ep_hotfix.addStyleClass("sapUiLargeMargin");
			this.open_ep_hotfix.openBy(Source);
		},

		classicGuilogin: function (Source_System, EP_Request_Id, Hotfix_Id) {
			let T_Code, c_val, parameter;
			if (EP_Request_Id !== "") {
				T_Code = 'hf_epatch';
				c_val = EP_Request_Id;
				parameter = "S_EP_ID";

			} else {
				T_Code = 'hotfix';
				c_val = Hotfix_Id;
				parameter = "S_HF_ID";
			}
			this.showBusyIndicator(8000, 0);
			var textFile = null;
			var text = "[System]\n" + "Name=" + Source_System + "\n" + "Client=300" + "\n" + "[User]" + "\n" + "Name=" + "\n" +
				"Language=EN" +
				"\n" +
				"[Function]" + "\n" + "Command=*" + T_Code + " " + parameter + "-LOW=" + c_val +
				";DYNP_OKCODE=CRET";
			var type = 'link.sap'
			var file = new Blob([text], {
				type: type
			});

			saveAs(file, Source_System + ".sap");
		},
		webGuilogin: function (Source_System, EP_Request_Id, Hotfix_Id) {
			let T_Code, c_val;
			if (EP_Request_Id !== "") {
				T_Code = 'hf_epatch';
				c_val = EP_Request_Id;
				parameter = "S_EP_ID";

			} else {
				T_Code = 'hotfix';
				c_val = Hotfix_Id;
				parameter = "S_HF_ID";
			}

			window.open("http://ldcihfs.wdf.sap.corp:50000/sap/bc/gui/sap/its/webgui?~TRANSACTION=*" + T_Code + " " + parameter + "-LOW=" +
				c_val +
				";DYNP_OKCODE=CRET ");
		},

		Fiori_GUI: function (Source_System, EP_Request_Id, Hotfix_Id) {
			if (EP_Request_Id !== "") {
				window.open(
					"https://simplifiedcodelinecreation-a95972b99.dispatcher.hana.ondemand.com/index.html?hc_reset&ep_request_id=" +
					EP_Request_Id + "&system=" + Source_System);
			} else if (Hotfix_Id !== "") {
				window.open("https://simplifiedcodelinecreation-a95972b99.dispatcher.hana.ondemand.com/index.html?hc_reset&hotfixid=" +
					Hotfix_Id +
					"&system=" +
					Source_System);
			}
		},

		onExit: function () {
			if (!this._oDialogVariant) {
				this._oDialogVariant.destroy();
			};
		},
		_get_old_number_of_assembly_list: function () {
			var filtersTitle = [];
			for (var i = 0; i < array.length; i++) {
				var oFilters = new sap.ui.model.Filter("ProductName", sap.ui.model.FilterOperator.EQ, array[i]);
				filtersTitle.push(oFilters);
			};
			var oTable = main_globalme.getView().byId("EP_req_table");
			var oTemplate = main_globalme.getView().byId("coloumidEP_req");
			main_globalme.getView().getModel().read("/assem_in_queueSet", {
				filters: filtersTitle,
				success: function (oData) {
					if (oData.results.length !== 0) {

						var model = new sap.ui.model.json.JSONModel();
						model.setData({
							path: oData.results
						});
						oTable.setModel(model);
						oTable.bindAggregation("items", {
							path: "/path",
							template: oTemplate,
							growing: "true"
						});
					}
				},

				async: false

			});
		},
		_refreshassemblyQueue: function () {
			var oTable = main_globalme.getView().byId("EP_req_table");
			var oTemplate = main_globalme.getView().byId("coloumidEP_req");
			var old_assm_list = [];
			if (main_globalme.getView().byId("EP_req_table").getItems().length != 0) {
				for (var i = 0; i < main_globalme.getView().byId("EP_req_table").getItems().length; i++) {
					old_assm_list.push(main_globalme.getView().byId("EP_req_table").getModel().getData().path[i].ProductId + parseFloat(
						main_globalme
						.getView().byId("EP_req_table").getModel().getData().path[i].ProductTriggerId));

				}
			}
			var unique_new_assm_list = [];
			var unique_old_assm_list = old_assm_list.filter((v, i, a) => a.indexOf(v) === i);
			var new_assm_list = [];
			var new_assm_list_with_ep = [];
			//get number of items in queue
			var filtersTitle = [];
			for (var i = 0; i < array.length; i++) {
				var oFilters = new sap.ui.model.Filter("ProductName", sap.ui.model.FilterOperator.EQ, array[i]);
				filtersTitle.push(oFilters);
			};
			main_globalme.getView().getModel().read("/assem_in_queueSet", {
				filters: filtersTitle,
				success: function (oData) {
					if (oData.results.length !== 0) {
						for (var i = 0; i < oData.results.length; i++) {
							new_assm_list.push(oData.results[i].ProductId + parseFloat(oData.results[i].ProductTriggerId));
							new_assm_list_with_ep.push(oData.results[i]);
						}
						unique_new_assm_list = new_assm_list.filter((v, i, a) => a.indexOf(v) === i);
						var model = new sap.ui.model.json.JSONModel();
						model.setData({
							path: oData.results
						});
						oTable.setModel(model);
						oTable.bindAggregation("items", {
							path: "/path",
							template: oTemplate,
							growing: "true"
						});
					}
				},

				async: false

			});
			var epid = '';
			for (var i = 0; i < unique_new_assm_list.length; i++) {
				if (unique_old_assm_list.indexOf(unique_new_assm_list[i]) === -1) {
					for (var j = 0; j < new_assm_list_with_ep.length; j++) {
						if ((new_assm_list_with_ep[j].ProductId + parseFloat(new_assm_list_with_ep[j].ProductTriggerId)) === unique_new_assm_list[i]) {
							epid += parseFloat(new_assm_list_with_ep[j].EpRequestId) + ",";
						}

					}
					main_globalme._notification_for_assembly_trigger(unique_new_assm_list[i], epid);
				}

			}

		},

		_notification_for_assembly_trigger: function (unique_new_assm_list, epid) {
			document.addEventListener('DOMContentLoaded', function () {
				if (Notification.permission !== "granted")
					Notification.requestPermission();
			});

			if (main_globalme.getView().byId("switch").getState() == true) {
				var notification = new Notification('New Assembly Request' + ' ' + unique_new_assm_list, {
					icon: 'img/AOF.png',
					body: "New Assembly triggerd with EPID " + epid,
					dir: "rtl",
					vibrate: [200, 100, 200],
					requireInteraction: true
				});
				var audio = document.getElementById("idErrorSound");
				audio.play();
			};
		},

		b5buttonrefresh: function () {
			var that = main_globalme;
			var oTable = that.getView().byId("EP_req_table");
			var B1 = oTable.sId.split("--")[0] + "--pickeps-" + oTable.sId.split("--")[0] + "--EP_req_table-";
			var B2 = oTable.sId.split("--")[0] + "--commenteps-" + oTable.sId.split("--")[0] + "--EP_req_table-";
			var comment = oTable.sId.split("--")[0] + "--finalcommentassem-" + oTable.sId.split("--")[0] + "--EP_req_table-";
			var filtersTitle = [];
			var buttonText = [];
			for (var i = 0; i < array.length; i++) {
				var oFilters = new sap.ui.model.Filter("ProductName", sap.ui.model.FilterOperator.EQ, array[i]);
				filtersTitle.push(oFilters);
			};;

			if (that.getView().byId("Queue_EP").getType() === 'Emphasized' && oTable.getItems().length !== 0) {
				for (var j = 0; j < oTable.getItems().length; j++) {
					var path = oTable.getItems()[j].getBindingContext().sPath;
					buttonText.push(oTable.getModel().getProperty(path).TakeOverButton);
				}
				if (buttonText.includes('Take Over')) {
					that.getView().getModel().read("/b5_button_refreshSet", {
						filters: filtersTitle,
						success: function (oData) {
							if (oTable.getItems().length == oData.results.length) {
								for (var i = 0; i < oData.results.length; i++) {
									if (oData.results[i].TakeOverColor != "") {
										that.getView().byId(B1 + i).setType(oData.results[i].TakeOverColor);
									}
									if (oData.results[i].TakeOverButton != "") {
										that.getView().byId(B1 + i).setText(parseFloat(oData.results[i].ProductTriggerId) + "-" + oData.results[i].TakeOverButton);
									}
									if (oData.results[i].CommentColor != "") {
										that.getView().byId(B2 + i).setType(oData.results[i].CommentColor);
									}
									if (oData.results[i].CommentOwner != "" && oData.results[i].Comment != "") {
										that.getView().byId(comment + i).setText(oData.results[i].CommentOwner + ":" + oData.results[i].Comment);
									}

								}
							}
						}
					});
				}
			}
		},

		triggerautoassembly: function () {
			alert("");
		},

		onpatchassemblypqp: function () {
			window.open("https://pqpmain.wdf.sap.corp:44376/sap/bc/gui/sap/its/webgui?~TRANSACTION=*za84");
		},

		onPersofilterProduct: function (oEvent) {
			if (!this.product_oPopover) {
				this.product_oPopover = sap.ui.xmlfragment("epdash.epdash.view.Productversion", this);
				this.getView().addDependent(this.product_oPopover);
			}

			var aFilterArray = [];
			for (var i = 0; i < array.length; i++) {
				var filterYear = new sap.ui.model.Filter("ProductName", sap.ui.model.FilterOperator.EQ, array[i]);
				aFilterArray.push(filterYear);
			}
			var that = this;
			this.getView().getModel().read("/PRODUCT_VERSIONSet", {
				filters: aFilterArray,
				success: function (oData) {
					that.oData = oData.results;
					that.json = new sap.ui.model.json.JSONModel();
					that.json.setData({
						path: that.oData
					});
					var oList = sap.ui.getCore().byId("ProductversionList");
					var oTemplate = sap.ui.getCore().byId("productversionitem");
					oList.setModel(that.json);
					oList.bindAggregation("items", {
						path: "/path",
						template: oTemplate,
						growing: "true"
					});

				}

			});
			var oButton = oEvent.getSource();
			jQuery.sap.delayedCall(0, this, function () {
				this.product_oPopover.openBy(oButton);
			});

		},

		onSelectproductversion: function () {
			this.product_oPopover.close();
			var oList = sap.ui.getCore().byId("ProductversionList");
			var context = oList.getSelectedContexts();
			var items = context.map(function (c) {
				return c.getObject();
			});
			var that = this;
			var filtersTitle = [];
			var oTemplate = this.byId(this.createId("coloumid"));
			if (items.length === 0) {
				alert("Please select some value");
			} else {
				for (var i = 0; i < items.length; i++) {
					var oFilters = new sap.ui.model.Filter("ProdVersName", sap.ui.model.FilterOperator.EQ, items[i].ProdVersName);
					filtersTitle.push(oFilters);
				};

				if (this.getView().byId("idProductsTable").getVisible() == true) {
					short = filtersTitle;
					var oTable = this.getView().byId("idProductsTable");
					if (short.length != 0) {
						var oBinding = oTable.getBinding("items");
						oBinding.filter(short);
					}
					that.bindcolor();

				} else if (this.getView().byId("idProductsTable23").getVisible() == true) {
					short = filtersTitle;
					var oTable = this.getView().byId("idProductsTable23")
					if (short.length != 0) {
						var oBinding = oTable.getBinding("items");
						oBinding.filter(short);
					}
					oTable.getModel('ep_under_rm_hfg').aBindings[0].aFilters = [];
					oTable.getModel('ep_under_rm_hfg').aBindings[0].aSorter = [];
					that.bindcolor();
					/*var oTemplate = this.byId(this.createId("coloumid23"));
					var oTable = this.getView().byId("idProductsTable23");
					this.getView().getModel().read("/app_sta_hea_sta1Set", {
						filters: filtersTitle,
						success: function (oData) {
							that.oData = oData.results;
							that.json = new sap.ui.model.json.JSONModel();
							that.json.setData({
								path: that.oData
							});
							oTable.setModel(that.json);
							oTable.bindAggregation("items", {
								path: "/path",
								template: oTemplate,
								growing: "true"
							});
							oTable.setVisible(true);
							that.bindcolor();
						}
					});*/
				} else if (this.getView().byId("idEPTable").getVisible() == true) {
					//	filtersTitle = [];
					var oTable = this.getView().byId("idEPTable");
					/*	for (var i = 0; i < items.length; i++) {
							var oFilters = new sap.ui.model.Filter("ProductName", sap.ui.model.FilterOperator.EQ, items[i].ProdVersName);
							filtersTitle.push(oFilters);
						};*/
					shortEP = filtersTitle;
					if (short.length != 0) {
						var oBinding = oTable.getBinding("items");
						oBinding.filter(short);
					}
					oTable.getModel('codeline_in_process').aBindings[0].aFilters = [];
					oTable.getModel('codeline_in_process').aBindings[0].aSorter = [];
					that.bindcolor1();
				}
			}

		},

		oncloseproductversion: function () {
			this.product_oPopover.close();
		},

		onExit: function () {

		},

		_trigger_mail_and_start_pqp_workflow_automatically: function (PID, PTID, items, eep_status, final_assembly_system) {
			var oGlobalBusyDialog = new sap.m.BusyDialog();
			var oModel = main_globalme.getView().getModel();
			var filtersTitle = [];

			var filterPID = new sap.ui.model.Filter("ProductId", sap.ui.model.FilterOperator.EQ, PID);

			var filterPTID = new sap.ui.model.Filter("ProductTriggerId", sap.ui.model.FilterOperator.EQ, PTID);

			var filtereep = new sap.ui.model.Filter("Trigger_Eep", sap.ui.model.FilterOperator.EQ, eep_status);

			filtersTitle.push(filterPID, filterPTID, filtereep);

			/*oModel.read("/tri_assm_mailSet", {
				filters: filtersTitle,
				success: function (oData) {
					let msg =
						"Triggered Mail has been Successfully sent from 'ARES Notification Services'\nto corresponding DL's and Configured below Address too : \n\n";
					for (let loop in oData.results) {
						msg += (parseInt(loop) + 1) + '.' + oData.results[loop].DlText + '.' + '\n';
					}
					//Start PQP Workflow execution
					oGlobalBusyDialog.open();
					main_globalme._start_pqp_workflow_automatically(final_assembly_system, msg, '', '');
					oGlobalBusyDialog.close();
					/////////////////////////////
				},
				error: function (err) {

					sap.m.MessageBox.error(
						"Opps!! Mail has some technical issue.\nPlease try later or create Jira from Dashboard."
					);
				},
				async: false
			});*/
			oGlobalBusyDialog.open();
			main_globalme._start_pqp_workflow_automatically(final_assembly_system, '', '', '');
			oGlobalBusyDialog.close();

		},
		///Without Starting of  PQP WOrkflow automatically with triggered person name 
		// _start_pqp_workflow_automatically: function (final_assembly_system, msg) {
		// 	let html = main_globalme.assembly_trigged_id + '\n\n' + msg;
		// 	let vbox = new sap.m.VBox({
		// 		items: [
		// 			new sap.m.Text({
		// 				text: html
		// 			})
		// 		]
		// 	});
		// 	main_globalme.showProjectDetail = new sap.m.Dialog({
		// 		title: "Assembly Detail",
		// 		content: [
		// 			vbox
		// 		],
		// 		type: sap.m.DialogType.Message,
		// 		endButton: new sap.m.Button({
		// 			text: 'Close',
		// 			press: function () {
		// 				main_globalme.showProjectDetail.close();
		// 			}.bind(main_globalme)
		// 		}),

		// 	});
		// 	main_globalme.showProjectDetail.open();
		// },

		///Start PQP WOrkflow automatically with triggered person name 
		_start_pqp_workflow_automatically: function (final_assembly_system, msg, compID, compRel, items) {

			var filtersTitle = [];
			if (final_assembly_system !== '') {
				var filtersys = new sap.ui.model.Filter("final_assembly_sys", sap.ui.model.FilterOperator.EQ, final_assembly_system);
				filtersTitle.push(filtersys);
			} else if (compID !== '' && compRel !== '') {
				var filterCompId = new sap.ui.model.Filter("CompId", sap.ui.model.FilterOperator.EQ, compID);
				var filterCompRel = new sap.ui.model.Filter("CompRel", sap.ui.model.FilterOperator.EQ, compRel);
				var filterReuseChildProdId = new sap.ui.model.Filter("CProductId", sap.ui.model.FilterOperator.EQ, items.ReuseChildProdId);
				var filterReuseChildProdTriggerId = new sap.ui.model.Filter("CProductTriggerId", sap.ui.model.FilterOperator.EQ, items.ReuseChildProdTriggerId);
				filtersTitle.push(filterCompId, filterCompRel, filterReuseChildProdId, filterReuseChildProdTriggerId);
			}

			var oModel = main_globalme.getView().getModel();
			oModel.read("/start_assemblySet", {
				filters: filtersTitle,
				success: function (oData) {
					if (oData.results.length !== 0) {
						var CodeEditor = new sap.ui.codeeditor.CodeEditor({
							type: 'json',
							height: "500px",
							width: "700px",
							colorTheme: "tomorrow_night_bright",
							editable: false
						});
						var obj = {};
						var array = [];
						for (let i in oData.results) {
							obj = {
								PROJECT_GROUP_ID: oData.results[i].projectgrp_id,
								PROJECT_STATUS: oData.results[i].status,
								MESSAGE1: oData.results[i].Var1,
								MESSAGE2: oData.results[i].Var2,
								MESSAGE3: oData.results[i].Var3,
								MESSAGE4: oData.results[i].Var4
							};
							array.push(obj);
						}
						CodeEditor.setValue(JSON.stringify(array, null, "\t"));
					}
					if (oData.results[0].rc === '0') {
						let html = main_globalme.assembly_trigged_id + '\n\n' + msg +
							"\n\n\nAssembly Started With below parameters and Logs.\n\t\t\tProject Group ID :" +
							oData.results[0].projectgrp_id + ".\nPlease PICK and Monitor Assembly Items.\n\n";
						let vbox = new sap.m.VBox({
							items: [
								new sap.m.Text({
									text: html
								}),
								new sap.m.Title({
									text: "Generated Logs:",
									level: "H4"
								})
							]
						});
						main_globalme.showProjectDetail = new sap.m.Dialog({
							title: "Assembly Detail",
							content: [
								vbox,
								CodeEditor
							],
							type: sap.m.DialogType.Message,
							// beginButton: new sap.m.Button({
							// 	text: 'View Job Log',
							// 	press: function () {
							// 		main_globalme._generate_pqp_workflow_log(oData.results[0].projectgrp_id);
							// 	}.bind(main_globalme)
							// }),
							endButton: new sap.m.Button({
								text: 'Close',
								press: function () {
									if (items !== undefined) {
										main_globalme.getView().byId("reuse_start_assem").setEnabled(false);
										var oDisableParams = {
											"CProductId": items.ReuseChildProdId,
											"CProductTriggerId": items.ReuseChildProdTriggerId,
											"TriggerType": ' '
										};
										oModel.update("/reuse_patch_collectionSet(PProductTriggerId='" + ' ' + "',PProductId='" + ' ' + "',EpRequestId='" +
											"" + "')", oDisableParams, {
												success: function (oData) {
													main_globalme.onPress_Assembly_in_Queue(); //refresh assem_in_queue tab
												},
												error: function () {}
											});
									}
									main_globalme.showProjectDetail.close();
								}.bind(main_globalme)
							}),

						});
						main_globalme.showProjectDetail.open();
					} else if (oData.results[0].rc === '1') {
						let status;
						if (oData.results[0].projectgrp_id === '') {
							status = main_globalme.assembly_trigged_id + '\n\n' + msg +
								"\n\n\nNo Project Found.\nPlease Start Assembly Manually.\n\n"
						} else if (oData.results[0].projectgrp_id !== '') {
							status = main_globalme.assembly_trigged_id + '\n\n' + msg +
								"\n\n\nProject Found.\nBut Status of Project is not Initial.\nPlease Start Assembly Manually.\n\n"
						}
						main_globalme.showProjectDetail_npf = new sap.m.Dialog({
							title: "Assembly Detail",
							content: [
								new sap.m.Text({
									text: status
								}),
								CodeEditor
							],
							type: sap.m.DialogType.Message,
							endButton: new sap.m.Button({
								text: 'Close',
								press: function () {
									main_globalme.getView().byId("reuse_start_assem").setEnabled(false);
									main_globalme.showProjectDetail_npf.close();
								}.bind(main_globalme)
							}),

						});
						main_globalme.showProjectDetail_npf.open();
					} else {
						main_globalme.showProjectDetail_error = new sap.m.Dialog({
							title: "Assembly Detail",
							content: [
								new sap.m.Text({
									text: main_globalme.assembly_trigged_id + '\n\n' + msg +
										"\n\n\nAssembly execution Failed.Please check below Logs and Start Manually.\n\n"
								}),
								CodeEditor
							],
							type: sap.m.DialogType.Message,
							beginButton: new sap.m.Button({
								text: 'View Job Log',
								press: function () {
									main_globalme._generate_pqp_workflow_log(oData.results[0].projectgrp_id);
								}.bind(main_globalme)
							}),
							endButton: new sap.m.Button({
								text: 'Close',
								press: function () {
									main_globalme.showProjectDetail_error.close();
								}.bind(main_globalme)
							}),

						});
						main_globalme.showProjectDetail_error.open();

					}
				},
				error: function (err) {

					sap.m.MessageBox.error(
						"Opps!! \nAssembly failed Please do it Manually."
					);
				},
				async: false
			});

		},
		_generate_pqp_workflow_log: function (project_group) {

		},

		checkassemblyenteriestwice: function () {
			//      var oModel = main_globalme.getView().getModel();
			//      var filtersTitle = [];

			//     var trigger = 2 ;
			//    var filterYear1 = new sap.ui.model.Filter("Count", sap.ui.model.FilterOperator.EQ, trigger);
			//     filtersTitle.push(filterYear1);

			//    oModel.read("/send_mail_from_hfsSet",{
			//      filters: filtersTitle
			//     });

		},

		clearassemblyenteries: function () {

		},

		onCollapseExapandPress: function (oEvent) {

			this.getView().byId("closeb1").setVisible(false);
			var oSplitContainer = this.getView().byId("mySplitContainer");
			oSplitContainer.setShowSecondaryContent(!oSplitContainer.getShowSecondaryContent());

		},

		onCollapseExapandPressBack: function () {
			this.getView().byId("closeb1").setVisible(true);
			var oSplitContainer = this.getView().byId("mySplitContainer");
			oSplitContainer.setShowSecondaryContent(!oSplitContainer.getShowSecondaryContent());
		},

		triggerassmsg: function (ch, cm) {

			var oModel = main_globalme.getView().getModel();
			oModel.read("/member_hfg_userSet", {
				success: function (oData) {
					if (oData.results[0].user == 'HFG') {
						document.addEventListener('DOMContentLoaded', function () {
							if (Notification.permission !== "granted")
								Notification.requestPermission();
						});
						if (main_globalme.getView().byId("switch").getState() == true) {
							oModel.read("/get_ep_vp_numberSet", {
								success: function (oData) {
									var notification = new Notification('Reminder for Assembly Trigger at ' + ' ' + ch + ':' + cm + ' ' + 'CET', {
										icon: 'img/Mkho-Christmas.png ',
										body: "S4HANA EP Trigger \n •   EP's in Ready for Delivery = " + oData.results[0].s4hana_ep +
											"\n •   EP's in Final Double-Check by MAO =  " + oData.results[0].s4hana_ep_fdm,
										dir: "ltr",
										requireInteraction: true
									});
									var audio = document.getElementById("idErrorSound");
									audio.play();
								}
							});

						}
					}
				}
			});

		},

		triggerassmsg1: function (ch, cm) {

			var oModel = main_globalme.getView().getModel();
			oModel.read("/member_hfg_userSet", {
				success: function (oData) {
					if (oData.results[0].user == 'HFG') {
						document.addEventListener('DOMContentLoaded', function () {
							if (Notification.permission !== "granted")
								Notification.requestPermission();
						});

						if (main_globalme.getView().byId("switch").getState() == true) {
							oModel.read("/get_ep_vp_numberSet", {
								success: function (oData) {
									var text = "• S4HANA EP's in Ready for Delivery = " + oData.results[0].s4hana_ep +
										"\n• S4HANA EP's in Final Double-Check = " + oData.results[0].s4hana_ep_fdm +
										"\n\n• IBP EP's in Ready for Delivery = " + oData.results[0].ibp_ep + "\n• IBP EP's in Final Double-Check = " +
										oData.results[
											0].ibp_ep_fdm;

									var notification = new Notification('Reminder for assembly trigger at ' + ' ' + ch + ':' + cm + ' ' + 'CET', {
										icon: 'img/Mkho-Christmas.png',
										body: text,
										dir: "ltr",
										requireInteraction: true
									});
									var audio = document.getElementById("idErrorSound");
									audio.play();
								}
							});
						}
					}
				}
			});
		},

		triggerassmsg2: function (ch, cm) {
			var oModel = main_globalme.getView().getModel();
			oModel.read("/member_hfg_userSet", {
				success: function (oData) {
					if (oData.results[0].user == 'HFG') {
						document.addEventListener('DOMContentLoaded', function () {
							if (Notification.permission !== "granted")
								Notification.requestPermission();
						});
						var oModel = main_globalme.getView().getModel();
						if (main_globalme.getView().byId("switch").getState() == true) {
							oModel.read("/get_ep_vp_numberSet", {
								success: function (oData) {
									var notification = new Notification('Reminder for Assembly Trigger at ' + ' ' + ch + ':' + cm + ' ' + 'CET', {
										icon: 'img/Mkho-Christmas.png ',
										body: "S4HANA VP Trigger \n •   VP's in Ready for Delivery = " + oData.results[0].s4hana_vp +
											"\n •   VP's in Final Double-Check by MAO =  " + oData.results[0].s4hana_vp_fdm,
										dir: "ltr",
										requireInteraction: true
									});
									var audio = document.getElementById("idErrorSound");
									audio.play();
								}
							});
						}
					}
				}
			});
		},

		triggerassmsg3: function (ch, cm) {
			var oModel = main_globalme.getView().getModel();
			oModel.read("/member_hfg_userSet", {
				success: function (oData) {
					if (oData.results[0].user == 'HFG') {
						document.addEventListener('DOMContentLoaded', function () {
							if (Notification.permission !== "granted")
								Notification.requestPermission();
						});
						if (main_globalme.getView().byId("switch").getState() == true) {
							var oModel = main_globalme.getView().getModel();
							oModel.read("/get_ep_vp_numberSet", {
								success: function (oData) {

									var notification = new Notification('Reminder for Assembly Trigger at ' + ' ' + ch + ':' + cm + ' ' + 'CET', {
										icon: 'img/Mkho-Christmas.png ',
										body: "IBP EP Trigger \n •   EP's in Ready for Delivery = " + oData.results[0].ibp_ep +
											"\n •   EP's in Final Double-Check by MAO =  " + oData.results[0].ibp_ep_fdm,
										dir: "ltr",
										requireInteraction: true
									});
									var audio = document.getElementById("idErrorSound");
									audio.play();
								}
							});
						}
					}
				}
			});
		},

		cacheclear: function () {
			var oModel = main_globalme.getView().getModel();
			oModel.read("/cache_clearSet", {
				success: function (oData) {
					if (oData.results != 0) {
						if (oData.results[0].CurrentVersion == "LOAD") {
							alert(
								"Executing Assembly directely from Dashboard has been released.\nPlease check QGPAOFBACKLOG-2013.\nIn case if it doesn't work kindly drop mail to DL ARES Development India or Contact Resposible Developer."
								/*"2.HFX/HFS EP Comments are merge with Dashborad Comment Section.'\n" +
								"3.Jira Bug reporting feature."*/
								//	"3.Uptime/Downtime Info in Assembly Trigger Dialog.\n" +
								//	"4.New Row Color for Urgency 'Extraordinary Downtime/Low activity period'.\n" +
								//	"5.RM and HFG Comment both are enable in 2nd and 3rd tab.\n"
								//	"6.New Dialog for tools,tips,features."
								//	"2.Handover Mail Option.'Under Pilot testing'\n" +
							);
							//  location.reload(true);

						}
					}
				}
			});
		},

		Cache_clear: function () {
			window.location = window.location.href + '?eraseCache=true';
		},

		dl_mail_trigger: function (oEvent) {
			var id = oEvent.getSource().mProperties.key;
			sap.m.URLHelper.triggerEmail(id);
		},

		wiki_link_open: function (oEvent) {
			var id = oEvent.getSource().mProperties.key;
			window.open(id, target = "_blank");
		},

		onPressAcceptReminder: function () {
			this.showBusyIndicator(3000, 0);
			var oTable1 = this.getView().byId("idEPTable");
			oTable1.getSelectedItems();
			var contexts = oTable1.getSelectedContexts();
			var items = contexts.map(function (c) {
				return c.getObject();
			});

			//initilize dialog box
			if (!this.reminder_mail_dialog) {
				this.reminder_mail_dialog = sap.ui.xmlfragment("epdash.epdash.view.Remindermail", this);
			}
			sap.ui.getCore().byId("DP2").setValue() == "";
			sap.ui.getCore().byId("TP3").setValue() == "";
			sap.ui.getCore().byId("timezone").setSelectedKey() == "";
			sap.ui.getCore().byId("dayvalue").setSelectedKey() == "";
			sap.ui.getCore().byId("remindertarea").setValue() == "";
			var oTable = sap.ui.getCore().byId("reminderTable");
			var oTemplate = sap.ui.getCore().byId("remindertemplate");
			////

			//get all codeline which is of same type of sps and status not equal to 61
			let codeline = (oTable1.getModel('codeline_in_process').getData().filter(c => {
				return c.SpsName === items[0].SpsName
			})).filter(c => {
				return c.Status !== '61'
			});
			//////

			switch (items.length) {
			case 1:
				if (items[0].Status === '61') {
					sap.m.MessageBox.error(
						"Reminder not possible because EP's Status is  'Ready for Delivery'."
					);
				} else if (codeline.length !== items.length) {
					_open_confirm_dialog_to_add();
				} else {
					var oModelJ = new sap.ui.model.json.JSONModel({
						"sales": items
					});
					oTable.setModel(oModelJ);
					oTable.bindAggregation("items", {
						path: "/sales",
						template: oTemplate,
						growing: true
					});
					this.reminder_mail_dialog.open();
				}
				break;
			case 0:
				sap.m.MessageBox.error(
					"Kindly select some Codeline."
				);
				break;
			default:
				//get unique sps
				let all_sps = items.map(function (item) {
					return item.SpsName;
				});
				let unique_sps = Array.from(new Set(all_sps));
				//get unique status
				if (unique_sps.length > 1) {
					sap.m.MessageBox.error(
						"Kindly select same SPS Version."
					);
				} else {
					let all_status = items.map(function (item) {
						return item.Status;
					});
					let unique_status = Array.from(new Set(all_status));
					let unique_status_rfd = unique_status.filter(c => c === '61');
					if (unique_status_rfd.length > 1) {
						sap.m.MessageBox.error(
							"Reminder not possible because atleast one of the EP's Status is not 'Ready for Delivery."
						);
					} else {
						if (unique_status[0] === '61') {
							sap.m.MessageBox.error(
								"Reminder not possible because EP's Status is  'Ready for Delivery'."
							);
						} else if (codeline.length !== items.length) {
							_open_confirm_dialog_to_add();
						} else {
							var oModelJ = new sap.ui.model.json.JSONModel({
								"sales": items
							});
							oTable.setModel(oModelJ);
							oTable.bindAggregation("items", {
								path: "/sales",
								template: oTemplate,
								growing: true
							});
							this.reminder_mail_dialog.open();
						}

					}
				}

				break;
			}

			function _open_confirm_dialog_to_add() {
				let add_codeline = new sap.m.Dialog({
					title: 'Confirm',
					type: 'Message',
					content: new sap.m.Text({
						text: 'There is an additional EP with not "Ready for Delivery" Status. \n Would you link to include?'
					}),
					beginButton: new sap.m.Button({
						text: 'Yes',
						press: function () {
							sap.m.MessageToast.show('Submit Yes!');
							var oModelJ = new sap.ui.model.json.JSONModel({
								"sales": codeline
							});
							oTable.setModel(oModelJ);
							oTable.bindAggregation("items", {
								path: "/sales",
								template: oTemplate,
								growing: true
							});
							add_codeline.close();
							main_globalme.reminder_mail_dialog.open();

						}
					}),
					endButton: new sap.m.Button({
						text: 'No',
						press: function () {
							var oModelJ = new sap.ui.model.json.JSONModel({
								"sales": items
							});
							oTable.setModel(oModelJ);
							oTable.bindAggregation("items", {
								path: "/sales",
								template: oTemplate,
								growing: true
							});
							add_codeline.close();
							main_globalme.reminder_mail_dialog.open();
						}
					}),
					afterClose: function () {
						add_codeline.destroy();
					}
				});

				add_codeline.open();
			};
		},

		sendreminderconfirm: function () {
			if (sap.ui.getCore().byId("DP2").getValue() == "" || sap.ui.getCore().byId("TP3").getValue() == "" ||
				sap.ui.getCore().byId("timezone").getSelectedKey() == "") {

				sap.m.MessageBox.show("Please Maintain all Parameters", {
					icon: sap.m.MessageBox.Icon.ERROR,
					title: "Error",
					actions: [sap.m.MessageBox.Action.OK],
					id: "messageBoxId1",
					defaultAction: sap.m.MessageBox.Action.OK,

					contentWidth: "100px"

				});

			} else {
				this.showBusyIndicator(5000, 0);
				let filter_array = [];
				// sap.ui.getCore().byId("reminderTable").getModel().getData()['sales'][1] = sap.ui.getCore().byId("reminderTable").getModel().getData()[
				// 	'sales'][0];
				let codeline_data = sap.ui.getCore().byId("reminderTable").getModel().getData()['sales'];
				for (let loop in codeline_data) {
					var filter_ep = new sap.ui.model.Filter("EpRequestId", sap.ui.model.FilterOperator.EQ, codeline_data[loop].EpRequestId);
					var filter_sps = new sap.ui.model.Filter("SpsName", sap.ui.model.FilterOperator.EQ, codeline_data[loop].SpsName);
					filter_array.push(filter_ep, filter_sps);
				};
				var filter_codeline_type = new sap.ui.model.Filter("CodelineType", sap.ui.model.FilterOperator.EQ, codeline_data[0].CodelineType);
				var filter_last_data = new sap.ui.model.Filter("DateEp", sap.ui.model.FilterOperator.EQ, sap.ui.getCore().byId("DP2").getValue());
				var filter_last_time = new sap.ui.model.Filter("TimeEp", sap.ui.model.FilterOperator.EQ, sap.ui.getCore().byId("TP3").getValue());
				var filter_timezone = new sap.ui.model.Filter("TimezoneEp", sap.ui.model.FilterOperator.EQ, sap.ui.getCore().byId("timezone").getSelectedKey());
				var filter_last_day = new sap.ui.model.Filter("DayEp", sap.ui.model.FilterOperator.EQ, sap.ui.getCore().byId("dayvalue").getSelectedKey());
				var filter_message = new sap.ui.model.Filter("Message", sap.ui.model.FilterOperator.EQ, sap.ui.getCore().byId("remindertarea")
					.getValue());
				filter_array.push(filter_codeline_type, filter_last_data, filter_last_time, filter_timezone, filter_last_day, filter_message);

				main_globalme.getView().getModel().read("/send_reminder_mailSet", {
					filters: filter_array,
					success: function (oData) {
						let msg =
							"Reminder Mail have been Successfully send from 'SAP Notification Services'\nto crossponding MAO/DEV and Configured below Address too : \n\n";
						for (let loop in oData.results) {
							msg += (parseInt(loop) + 1) + '.' + oData.results[loop].DlText + '.' + '\n';
						}
						sap.m.MessageBox.success(msg);
					},
					error: function (err) {
						sap.m.MessageBox.error(
							"Opps!! Mail has some technical issue.\nPlease try later or create Jira from Dashboard."
						);
					},
					async: false
				});
				this.reminder_mail_dialog.close();

			}

		},

		cancelreminder: function () {
			this.reminder_mail_dialog.close();
		},
		onChangeDateReminder: function () {
			var oDate = sap.ui.getCore().byId("DP2").getValue();
			var oDateFormat = new Date(oDate);
			var weekday = new Array(7);
			weekday[0] = "Sunday";
			weekday[1] = "Monday";
			weekday[2] = "Tuesday";
			weekday[3] = "Wednesday";
			weekday[4] = "Thursday";
			weekday[5] = "Friday";
			weekday[6] = "Saturday";
			var n = weekday[oDateFormat.getDay()];
			sap.ui.getCore().byId("dayvalue").setValue(n);
		},

		expandDLNode: function (evt) {

			if (this.getView().byId(evt.getSource().sId).getExpanded() == false) {
				this.showBusyIndicator(1000, 0);
				var filtersTitle = [];
				var that = this;
				this.getView().byId(evt.getSource().sId).setExpanded(true);
				var oFilValue = this.getView().byId(evt.getSource().sId).getText();
				var filter = new sap.ui.model.Filter("DlParentText", sap.ui.model.FilterOperator.EQ, oFilValue);
				filtersTitle.push(filter);
				var oDLFather = this.getView().byId(evt.getSource().sId);
				oDLFather.destroyItems();
				var oDLChild = this.getView().byId("DLchildnode");
				this.getView().getModel().read("/dl_child_nodeSet", {
					filters: filtersTitle,
					success: function (oData) {
						if (oData.results.length != 0) {
							for (var i = 0; i < oData.results.length; i++) {
								var oNavItem = new sap.tnt.NavigationListItem({
									text: oData.results[i].DlChildText,
									key: oData.results[i].DlChildAddress,
									select: function (oEvent) {
										that.dl_mail_trigger(oEvent);
									}
								});
								oDLFather.addItem(oNavItem);
							}
						}
					}
				});

			} else {
				this.getView().byId(evt.getSource().sId).setExpanded(false);
				this.getView().byId(evt.getSource().sId).destroyItems();

			}
		},

		expandWikiNode: function (evt) {

			if (this.getView().byId(evt.getSource().sId).getExpanded() == false) {
				this.showBusyIndicator(1000, 0);
				var filtersTitle = [];
				var that = this;
				this.getView().byId(evt.getSource().sId).setExpanded(true);
				var oFilValue = this.getView().byId(evt.getSource().sId).getText();
				var filter = new sap.ui.model.Filter("WikiLinkParent", sap.ui.model.FilterOperator.EQ, oFilValue);
				filtersTitle.push(filter);
				var oWIKIFather = this.getView().byId(evt.getSource().sId);
				oWIKIFather.destroyItems();
				this.getView().getModel().read("/wiki_child_nodeSet", {
					filters: filtersTitle,
					success: function (oData) {
						if (oData.results.length != 0) {
							for (var i = 0; i < oData.results.length; i++) {
								var oNavItem = new sap.tnt.NavigationListItem({
									text: oData.results[i].WikiChildText,
									key: oData.results[i].WikiChildLink,
									select: function (oEvent) {
										that.wiki_link_open(oEvent);
									}
								});
								oWIKIFather.addItem(oNavItem);
							}
						}
					}
				});

			} else {
				this.getView().byId(evt.getSource().sId).setExpanded(false);
				this.getView().byId(evt.getSource().sId).destroyItems();

			}
		},
		_updateComment: function () {

			document.addEventListener('DOMContentLoaded', function () {
				if (Notification.permission !== "granted")
					Notification.requestPermission();
			});
			var batchItem = [];
			var filtersTitle = [];

			for (var i = 0; i < array.length; i++) {
				var oFilters = new sap.ui.model.Filter("ProductName", sap.ui.model.FilterOperator.EQ, array[i]);
				filtersTitle.push(oFilters);
			};
			//	batchItem.push(main_globalme.getView().getModel().createBatchOperation("/product_comment_detailSet", "GET"));
			//	batchItem.push(main_globalme.getView().getModel().createBatchOperation("/aap_asm_b5_refreshSet", "GET", filtersTitle));
			// 	main_globalme.getView().getModel().addBatchReadOperations(batchItem);
			var h_box = main_globalme.getView().byId("notification_panel");
			//	main_globalme.getView().getModel().submitBatch(function (data) {}, function (err) {});
			var comment_array = [];
			var product_model = main_globalme.getView().getModel('product_noti_model').getData();
			main_globalme.getView().getModel().read("/product_comment_detailSet", {
				filters: filtersTitle,
				success: function (oData) {
					if (oData.results != 0) {
						for (var i = 0; i < oData.results.length; i++) {
							comment_array.push(oData.results[i]);
						}
						if (main_globalme.comment_notification.length !== 0) {

							for (var j = 0; j < comment_array.length; j++) {
								for (var k = 0; k < main_globalme.comment_notification.length; k++) {
									if (main_globalme.comment_notification[k].ProductName == comment_array[j].ProductName) {
										if (main_globalme.comment_notification[k].CommentOwner !== comment_array[j].CommentOwner ||
											main_globalme.comment_notification[k].NameText !== comment_array[j].NameText) {
											if (main_globalme.getView().byId("switch").getState() == true) {
												var notification = new Notification('New Comment for ' + comment_array[j].ProductName, {
													icon: 'img/Chat.png  ',
													body: comment_array[j].CommentOwner + "\n By -  " + comment_array[j].NameText,
													dir: "ltr",
													requireInteraction: true
												});
												var audio = document.getElementById("idErrorSound");
												audio.play();
											}
										}
									}
								}
							}

						} else {

						}
						main_globalme.comment_notification = comment_array;
						main_globalme.getView().getModel('product_noti_model').setData(comment_array);
						main_globalme.getView().getModel('product_noti_model').refresh(true);
					}

					var Product_noti_comment_model = new sap.ui.model.json.JSONModel();
					Product_noti_comment_model.setData(oData);
					main_globalme.getView().setModel(Product_noti_comment_model, 'product_noti_comment_model');

				},
				async: false

			});

		},

		handleMessageViewPress: function (oEv) {

			var oTextArea = new sap.m.TextArea("commentptext", {
				rows: 7,
				width: "100%",
				placeholder: "Provide Some Comment",
				growing: true
			});

			var oLink = new sap.m.Link({
				text: "Show more information",
				href: "http://sap.com",
				target: "_blank"
			});

			var oMessageTemplate = new sap.m.MessageItem({
				type: '{CommentType}',
				title: '{CommentOwner}',
				description: '{NameText}',
				subtitle: '{NameText}' + '   :   ' + '{FormatDate}',
				markupDescription: "{markupDescription}",
				link: new sap.m.Link({
					text: '{FormatDate}'

				})

			});

			var oMessageView = new sap.m.MessageView({
				items: {
					path: "/sales",
					template: oMessageTemplate
				}

			});

			var textname = new sap.m.Text({
				text: username
			});
			var text = new sap.m.Label({
				design: sap.m.LabelDesign.Bold,
				text: 'History of Comments',
				textAlign: 'Center'
			});
			var sData = ["Information", "Success", "Error", "Warning"];
			var oJSModel = new JSONModel();
			oJSModel.setData({
				path: sData
			});
			var oListTemplate = new sap.ui.core.Item({
				key: "{}",
				text: "{}"
			});
			var oSelectList = new sap.m.Select().bindAggregation("items", "/path", oListTemplate);
			oSelectList.setModel(oJSModel);
			var oVbox = new sap.m.VBox({});
			var oHbox = new sap.m.HBox({});
			var textAction = new sap.m.Label({
				design: sap.m.LabelDesign.Bold,
				text: 'Type of Comment',
				textAlign: 'Center'
			});

			var that = this;
			var PID;
			var path;
			path = oEv.getSource().getParent().getParent().getParent().oBindingContexts.product_noti_model.sPath;
			PID = oEv.getSource().getParent().getParent().getParent().getModel('product_noti_model').getProperty(path).ProductName;
			if (PID === undefined) {
				PID = oEv.getSource().getParent().getParent().getParent().getModel('product_noti_model').getProperty(path).Product;
			}
			this.model_property = oEv.getSource().getParent().getParent().getParent().getModel('product_noti_model');
			this.path = path;
			var filterTitle = [];
			var aData = [];
			var filterStatus = new sap.ui.model.Filter("ProductName", sap.ui.model.FilterOperator.EQ, PID);
			var filterQuery = new sap.ui.model.Filter("Query_type", sap.ui.model.FilterOperator.EQ, 'ALL');
			filterTitle.push(filterStatus, filterQuery);

			this.showBusyIndicator(3000, 0);

			this.getView().getModel().read("/product_comment_detailSet", {
				filters: filterTitle,
				success: function (oData) {
					aData = oData.results;
					var oModelProduct = new sap.ui.model.json.JSONModel({
						"sales": aData
					});
					oMessageView.setModel(oModelProduct);
				},
				async: false

			});

			this.showBusyIndicator(3000, 0);
			var vLay = new sap.ui.layout.VerticalLayout();
			var oLab = new sap.m.Label({
				design: sap.m.LabelDesign.Bold,
				text: 'Message Type',
				textAlign: 'Center'
			});

			vLay.addContent(oLab);
			//		vLay.addContent(oSel);
			vLay.addContent(text);
			// vLay.addContent(oMessageView);
			var omDialog = new sap.m.Dialog({
				content: [textname, oTextArea, textAction, oHbox, oSelectList, oVbox, text, oMessageView],
				// content : [oMessageView],
				title: "Comment Dialog",
				contentHeight: "600px",
				contentWidth: "640px",
				resizable: true,
				draggable: true,
				verticalScrolling: true,

				beginButton: new sap.m.Button({
					text: "Save",
					type: "Accept",
					press: function (oEvent) {
						if (oTextArea.getValue() == '') {
							MessageToast.show('Please provide input');
						} else {

							that.showBusyIndicator(2000, 0);
							var oParameter = {
								"ProductName": PID,
								"CommentOwner": oTextArea.getValue(),
								"CommentType": oSelectList.getSelectedKey()
							};
							that.getView().getModel().create("/product_comment_detailSet", oParameter);
							omDialog.close();
							that.model_property.getProperty(that.path).CommentOwner = oTextArea.getValue();
							that.model_property.getProperty(that.path).NameText = username;
							that.model_property.getProperty(that.path).FormatDate = new Date();
							that.model_property.refresh(true);
						}
					}
				}),
				endButton: new sap.m.Button({
					text: "Close",
					type: "Reject",
					press: function () {

						omDialog.close();
					}
				}),
				afterClose: function () {
					omDialog.destroy();
				},
				verticalScrolling: false
			});
			omDialog.addStyleClass("sapUiSizeCompact");
			sap.ui.core.BusyIndicator.show();
			omDialog.open();
			sap.ui.core.BusyIndicator.hide();
		},
		navlandscape: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("landscape");
		},

		hfc_view: function (oEvent) {
			sap.ui.core.BusyIndicator.show();
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("hfc_view", {
				holiday_flag: false
			});
			sap.ui.core.BusyIndicator.hide();
		},
		holiday_calendar: function () {
			sap.ui.core.BusyIndicator.show();
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("hfc_view", {
				holiday_flag: true
			});
			sap.ui.core.BusyIndicator.hide();

		},
		holyday: function () {
			main_globalme.getView().getModel().read("/holiday_calenderSet", {
				success: function (oData) {

					for (var i = 0; i < oData.results.length; i++) {
						var calDate = new Date(oData.results[i].DateFrom);
						var tDate = new Date();
						if (calDate.getYear() == tDate.getYear() && calDate.getMonth() == tDate.getMonth() && calDate.getDate() == tDate.getDate()) {
							switch (oData.results[i].Title) {
							case "BLR on Vacation":
								main_globalme.getView().byId("ISTTime").addStyleClass("Timered");
								break;
							case "ROT on Vacation":
								main_globalme.getView().byId("CETTime").addStyleClass("Timered");
								break;
							case "VAN on Vacation":
								main_globalme.getView().byId("PSTTime").addStyleClass("Timered");
								break;
							}
						} else {
							main_globalme.getView().byId("ISTTime").removeStyleClass("Timered");
							main_globalme.getView().byId("CETTime").removeStyleClass("Timered");
							main_globalme.getView().byId("PSTTime").removeStyleClass("Timered");
						}
					}

				}

			});
		},

		openLandscape: function (oEvent) {

			this.showBusyIndicator(3000, 0);
			if (!this._oDialog_land) {
				this._oDialog_land = sap.ui.xmlfragment("epdash.epdash.view.landscape_runtime", this);
				this._oDialog_land.setModel(this.getView().getModel());
			}
			var filterTitle = [];
			var oFill = oEvent.getSource().mProperties.text;
			var oFill2 = oEvent.oSource.mAggregations.tooltip;
			var oFilters1 = new sap.ui.model.Filter("Sps_name", sap.ui.model.FilterOperator.BT, oFill, oFill2);
			var oTable = sap.ui.getCore().byId("landscape_table");
			var oTemplate = sap.ui.getCore().byId("landscape_colom");

			oTable.bindAggregation("items", {
				path: "/landscape_overviewSet",
				template: oTemplate,
				growing: "true",
				filters: [oFilters1]
			});

			sap.ui.getCore().byId("landtext").setText("Landscape for " + oFill);
			this._oDialog_land.open();

		},
		finish_landscape: function () {
			if (sap.ui.getCore().byId("landscape_colom") != undefined) {
				sap.ui.getCore().byId("landscape_colom").addStyleClass("light_green");
			};
			if (sap.ui.getCore().byId("landscape_colom-landscape_table-1") != undefined) {
				sap.ui.getCore().byId("landscape_colom-landscape_table-1").addStyleClass("light_yellow");
			};
			if (sap.ui.getCore().byId("landscape_colom-landscape_table-2") != undefined) {
				sap.ui.getCore().byId("landscape_colom-landscape_table-2").addStyleClass("light_red");
			};
		},

		closelandscape: function () {
			sap.ui.getCore().byId("landscape_table").unbindAggregation();
			this._oDialog_land.close();
			this._oDialog_land.destroy();
			this._oDialog_land = undefined;
		},

		jump_to_pqp_project: function (oEvent) {
			var path = oEvent.getSource().getBindingContext().getPath();
			var data = oEvent.getSource().getParent().getModel().getProperty(path);
			ProductData = data;
			var grId = new sap.ui.model.Filter("ProductTriggerId", sap.ui.model.FilterOperator.EQ, data.ProductTriggerId);
			groupId = grId;
			var prId = new sap.ui.model.Filter("ProjectId", sap.ui.model.FilterOperator.EQ, data.ProductId);
			projectId = prId;
			if (!this._oDialogpqp) {
				this._oDialogpqp = sap.ui.xmlfragment("epdash.epdash.view.login_pqp_project", this);
			}
			var oButton = oEvent.getSource();
			jQuery.sap.delayedCall(0, this, function () {
				this._oDialogpqp.openBy(oButton);
			});

		},
		fioriGuilogin_pqp: function (oEvent) {
			var login = oEvent.getSource().getText();
			var filterTitle = [];
			filterTitle.push(groupId, projectId);
			var that = this;
			this.showBusyIndicator(4000, 0);
			// if (ProductData.ProductId === "BYD" || ProductData.ProductId === "C4C") {
			// 	this.getView().getModel().read("/pqp_assembly_project_detailSet", {
			// 		filters: filterTitle,
			// 		success: function (oData) {
			// 			if (oData.results.length != 0) {

			// 				var bCompact = !!that.getView().$().closest(".sapUiSizeCompact").length;
			// 				sap.m.MessageBox.show(
			// 					"Collection Id " + " " + oData.results[0].collection + " " + "found for selected Assembly project.", {
			// 						icon: sap.m.MessageBox.Icon.SUCCESS,
			// 						title: "Project Detail Found", // default
			// 						actions: [sap.m.MessageBox.Action.CLOSE],
			// 						styleClass: "",
			// 						initialFocus: "Custom Button",
			// 						styleClass: bCompact ? "sapUiSizeCompact" : "",
			// 						textDirection: sap.ui.core.TextDirection.Inherit
			// 					}
			// 				);
			// 				//window.open ("https://pqpmain.wdf.sap.corp:44376/sap/bc/gui/sap/its/webgui?~TRANSACTION=*za84", target = "_blank");
			// 				if (login === "Login to Classic GUI") {
			// 					var textFile = null;
			// 					var prjGrpId = oData.results[0].ProjgrpId;
			// 					var text = "[System]\n" + "Name=PQP" + "\n" + "Client=001" + "\n" + "[User]" + "\n" + "Name=" + "\n" + "Language=EN" +
			// 						"\n" +
			// 						"[Function]" + "\n" + "Command=*/BAOF/EC_PROJECT PRJGRP=" + prjGrpId + "";
			// 					var type = 'link.sap'
			// 					var file = new Blob([text], {
			// 						type: type
			// 					});
			// 					saveAs(file, "PQP.sap");
			// 				} else if (login === "Login to Web GUI") {
			// 					var prjGrpId = oData.results[0].ProjgrpId;
			// 					window.open("https://ldcipqp.wdf.sap.corp:44376/sap/bc/gui/sap/its/webgui?~TRANSACTION=*/baof/ec_project PRJGRP=" +
			// 						prjGrpId + "");
			// 					//window.open("https://ldcipqe.wdf.sap.corp:44301/sap/bc/gui/sap/its/webgui?~TRANSACTION=*/baof/ec_project PRJGRP=" +
			// 					//	prjGrpId + "");
			// 				}
			// 			} else if (oData.results.length == 0) {
			// 				var bCompact = !!that.getView().$().closest(".sapUiSizeCompact").length;
			// 				sap.m.MessageBox.error(
			// 					"No project Found!!", {
			// 						styleClass: bCompact ? "sapUiSizeCompact" : ""
			// 					})
			// 			}

			// 		},
			// 		async: false
			// 	});
			// } else {

			this.getView().getModel().read("/pqp_assembly_project_detailSet", {
				filters: filterTitle,
				success: function (oData) {
					if (oData.results.length != 0) {
						if (oData.results[0].ProjgrpId == 'null') {
							var bCompact = !!that.getView().$().closest(".sapUiSizeCompact").length;
							sap.m.MessageBox.error(
								"No project Found!!", {
									styleClass: bCompact ? "sapUiSizeCompact" : ""
								})
						} else {
							//window.open ("https://pqpmain.wdf.sap.corp:44376/sap/bc/gui/sap/its/webgui?~TRANSACTION=*za84", target = "_blank");
							if (login === "Login to Classic GUI") {
								var textFile = null;
								var prjGrpId = oData.results[0].ProjgrpId;
								var text = "[System]\n" + "Name=PQP" + "\n" + "Client=001" + "\n" + "[User]" + "\n" + "Name=" + "\n" + "Language=EN" +
									"\n" +
									"[Function]" + "\n" + "Command=*/BAOF/EC_PROJECT PRJGRP=" + prjGrpId + "";
								var type = 'link.sap'
								var file = new Blob([text], {
									type: type
								});

								saveAs(file, "PQP.sap");
							} else if (login === "Login to Web GUI") {
								var prjGrpId = oData.results[0].ProjgrpId;
								window.open("https://ldcipqp.wdf.sap.corp:44376/sap/bc/gui/sap/its/webgui?~TRANSACTION=*/baof/ec_project PRJGRP=" +
									prjGrpId + "");
								//	window.open("https://ldcipqe.wdf.sap.corp:44301/sap/bc/gui/sap/its/webgui?~TRANSACTION=*/baof/ec_project PRJGRP=" +
								//		prjGrpId + "");
							} else if (login === "Login to Fiori GUI") {

								var bCompact = !!that.getView().$().closest(".sapUiSizeCompact").length;
								var busy = new sap.m.BusyIndicator({
									text: "Redirecting to Project page"
								});
								sap.m.MessageBox.show(
									"Following Project Group found with ID " + " " + oData.results[0].ProjgrpId + "\nand Collection ID" + " " + oData.results[
										0].collection +
									"\nRedirecting to Project page.....\n", {
										icon: sap.m.MessageBox.Icon.SUCCESS,
										title: "Project Detail Found", // default
										actions: [sap.m.MessageBox.Action.CLOSE], //"Check Project Status",
										/*onClose: function(sAction) {
											if (sAction == "Check Project Status") {
												var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
												oRouter.navTo("pqp_project_detail", {
													projectid: oData.results[0].ProjgrpId
												});
											}
										},*/
										styleClass: "",
										initialFocus: "Custom Button",
										styleClass: bCompact ? "sapUiSizeCompact" : "",
										textDirection: sap.ui.core.TextDirection.Inherit
									}
								);
								setTimeout(function () {
									var oRouter_nav = sap.ui.core.UIComponent.getRouterFor(that);
									oRouter_nav.navTo("pqp_project_detail", {
										projectid: oData.results[0].ProjgrpId
									});
								}, 300);
							}

						}
					} else if (oData.results.length == 0) {
						var bCompact = !!that.getView().$().closest(".sapUiSizeCompact").length;
						sap.m.MessageBox.error(
							"No project Found!!", {
								styleClass: bCompact ? "sapUiSizeCompact" : ""
							})
					}

				},
				async: false
			});
			//}
		},

		classicGuilogin_pqp: function (oEvent) {
			this.showBusyIndicator(8000, 0);
			var textFile = null;
			var grpId = groupId.oValue1.slice(4, 10);
			var prjGrpId = "PQPG" + grpId;
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
			var grpId = groupId.oValue1.slice(4, 10);
			var prjGrpId = "PQPG" + grpId;
			window.open("https://ldcipqp.wdf.sap.corp:44376/sap/bc/gui/sap/its/webgui?~TRANSACTION=*/baof/ec_project PRJGRP=" + prjGrpId +
				"");
		},
		onOpenPQPProject: function () {
			alert("Hello");
		},

		pending_vp_tab: function () {
			var that = main_globalme;
			var filtersTitle = [];
			for (var i = 0; i < array.length; i++) {
				var oFilters = new sap.ui.model.Filter("ProductName", sap.ui.model.FilterOperator.EQ, array[i]);
				filtersTitle.push(oFilters);

			};
			main_globalme.getView().getModel().read("/pending_vp_codelineSet", {
				filters: filtersTitle,
				success: function (oData) {
					if (oData.results.length != 0) {
						that.getView().byId("vp_awaiting").setVisible(true);
					}
				}
			});

		},

		clear_pending_vp_tab: function () {
			var filtersTitle = [];
			for (var i = 0; i < array.length; i++) {
				var oFilters = new sap.ui.model.Filter("ProductName", sap.ui.model.FilterOperator.EQ, array[i]);
				filtersTitle.push(oFilters);

			};
			if (main_globalme.getView().byId("vp_awaiting").getVisible() === 'true') {
				main_globalme.getView().getModel().read("/pending_vp_codelineSet", {
					filters: filtersTitle,
					success: function (oData) {
						if (oData.results.length === 0) {
							main_globalme.getView().byId("vp_awaiting").setVisible(false);
						}
					}
				});
			}

		},

		onPressTableEPs: function (evt) {
			this.showBusyIndicator(3000, 0);
			var property = evt.getSource().getParent().getBindingContext().getProperty(evt.getSource().getParent().getBindingContext().getPath());
			/*var oTable = this.getView().byId(evt.getSource().getParent().getId());
			oTable.getModel().getProperty(path);*/
			var fill = [];
			var Id = property.ProductTriggerId;
			var oProduct = property.ProductId;
			var filterGid = new sap.ui.model.Filter("ProductTriggerId", sap.ui.model.FilterOperator.EQ, Id);
			var filterPr = new sap.ui.model.Filter("ProductId", sap.ui.model.FilterOperator.EQ, oProduct);
			fill.push(filterGid, filterPr);
			var that = this;
			if (!this.assem_stepsta) {
				//	this.showBusyIndicator(5000, 0);
				this.assem_stepsta = sap.ui.xmlfragment("epdash.epdash.view.ItemStatus_assem_trigger", this);
			}
			this.getView().addDependent(this.assem_stepsta);

			var oTab = sap.ui.getCore().byId("itemassembinqueue");
			var oTemplate = sap.ui.getCore().byId("itemstepinqueue");
			//Convert trigger time to timestant

			var date_time = property.TriggerDate.replace(/[/]+/g, '-').split("T")[0].split("-").concat(property.TriggerTime.replace(
				/[PT,H,M,S]+/g, '-').split(
				'-'));
			date_time.push("00");
			var date = new Date(date_time[0], date_time[1] - 1, date_time[2], date_time[4], date_time[5], date_time[6]);
			var Start_timestamp = date.getTime();
			////
			this.getView().getModel().read("/item_status_projectSet", {
				filters: fill,
				success: function (oData) {
					if (oData.results[0].ProductId !== '' && oData.results[0].ProductTriggerId !== '') {
						that.oData = oData.results;
						that.json = new sap.ui.model.json.JSONModel();
						that.json.setData({
							path: that.oData
						});
						oTab.setModel(that.json, "item_of_assem");
						that.getView().setModel(that.json, "item_of_assem");
						var oName;

						that.assem_stepsta.open();
						sap.ui.getCore().byId("assemsteptitle").setText('Assembly Form for Collection ID -' + oData.results[0].CollectionName +
							' and Project Group Id - ' + oData.results[0].ProjectGrpId);
						var bar = [];
						var timeline_array;
						var total_time = 0;
						var valueColor = ["Good", "Neutral", "Error", "Critical", "Good", "Neutral", "Error", "Critical", "Good", "Neutral",
							"Error",
							"Critical"
						];
						for (var m = 0; m < oData.results.length; m++) {

							if (oData.results[m].ItemId !== '' && oData.results[m].ChangeDate !== null) {
								var com_time = new Date(oData.results[m].ChangeDate.substring(0, 4),
									oData.results[m].ChangeDate.substring(5, 7) - 1,
									oData.results[m].ChangeDate.substring(8, 10),
									oData.results[m].ChangeTime.substring(2, 4),
									oData.results[m].ChangeTime.substring(5, 7),
									oData.results[m].ChangeTime.substring(8, 10));
								com_time = com_time.getTime();
								diffrence = com_time - Start_timestamp;
								total_time = diffrence + total_time;
								Start_timestamp = com_time;
								timeline_array = {
									"Phase": oData.results[m].Phase,
									"Time": diffrence,
									"valueColor": valueColor[m]
								};
								bar.push(timeline_array);
							}

						}
						total_time_taken = {
							"total_time": total_time
						};
						var unique = [];
						for (var x = 0; x < bar.length; x++) {
							if (x > 0) {
								if (bar[x - 1] !== undefined && bar[x].Phase !== bar[x - 1].Phase) {
									bar[x].Time = Math.round((bar[x].Time / total_time) * 100);
									unique.push(bar[x]);
								}
							} else {
								bar[x].Time = Math.round((bar[x].Time / total_time) * 100);
								unique.push(bar[x]);
							}
						}
						//	var unique = _.uniq(bar,function(p){return p.Phase}) ;
						var time_model = new sap.ui.model.json.JSONModel(unique);
						that.assem_stepsta.setModel(time_model, "time_model");
					} else {
						sap.m.MessageBox.error('No Form found for ' +
							oData.results[0].CollectionName);
					}
				}
			});

		},
		add_item_assembly: function (oEv) {
			var oTableItem = sap.ui.getCore().byId("itemassembinqueue");
			var oTemplate = sap.ui.getCore().byId("itemstepinqueue");
			var oModel = oTableItem.getModel("item_of_assem").getProperty("/");
			var oTextA = new sap.m.TextArea({
				rows: 4
			});
			var that = this;
			var dialog = new sap.m.Dialog({
				title: 'Phase Discription',
				type: 'Message',
				content: [new sap.m.TextArea('discription_in_Assm', {
						width: '100%',
						placeholder: 'Phase name maximum 255 Char....'
					}),
					new sap.m.TextArea('ItemId_in_Assm', {
						width: '100%',
						placeholder: 'Comment (Optional)....'
					})
				],
				beginButton: new sap.m.Button({
					text: 'OK',
					press: function () {
						var oNewObject = {
							"ProductId": oModel.path[oTableItem.getItems().length - 1].ProductId,
							"ProductTriggerId": oModel.path[oTableItem.getItems().length - 1].ProductTriggerId,
							"Phase": sap.ui.getCore().byId('discription_in_Assm').getValue(),
							"ItemId": '',
							"SerialNum": (parseFloat(oTableItem.getModel("item_of_assem").getProperty('/').path[oTableItem.getItems().length - 1]
									.SerialNum) +
								1).toString(),
							"System_id": '',
							"Client": '',
							"Activity": '',
							"CommentByUser": sap.ui.getCore().byId('ItemId_in_Assm').getValue(),
							"Status": ''
						};
						oModel.path.push(oNewObject);
						//	oModel.path.splice(parseInt(oEv.getSource().sId.split("-itemassemb-")[1]) + 1, 0, oNewObject);
						that.json = new sap.ui.model.json.JSONModel();
						that.json.setData({
							path: oModel.path
						});
						//	oTab.setModel(that.json, "item_of_assem");
						oTableItem.setModel(that.json, "item_of_assem");
						dialog.close();
					}
				}),
				endButton: new sap.m.Button({
					text: 'Cancel',
					press: function () {
						dialog.close();
					}
				}),
				afterClose: function () {
					dialog.destroy();
				}
			});

			dialog.open();

			//  oTableItem.getModel().setProperty("/", oModel.path);
		},

		onChangevalue: function (even) {
			selectId = even.oSource.sId.split("-itemassembinqueue-")[1];
			var oButt = sap.ui.getCore().byId("itembuttontext-itemassembinqueue-" + even.oSource.sId.split("-itemassembinqueue-")[1]).setVisible(
				true);
			var Status = even.getSource().getSelectedKey();
			var oText;
			var path = even.getSource().getParent().getBindingContext('item_of_assem').getPath();
			var oTableItem = sap.ui.getCore().byId("itemassembinqueue");
			var oModel = oTableItem.getModel('item_of_assem').getProperty(path);
			oModel.Status = Status;
			switch (Status) {
			case "9999":
				oText = "Workflow aborted completely";
				Status = "{imageModel>/path}/messagetype/workabortedcompletly.JPG";
				break;
			case "8888":
				oText = "Workflow Confirmed";
				Status = "{imageModel>/path}/messagetype/workconfirm.JPG";
				break;
			case "4100":
				oText = "waiting for return of process";
				Status = "{imageModel>/path}/messagetype/waitingforreturn.JPG";
				break;
			case "4000":
				oText = "Inprocess";
				Status = "{imageModel>/path}/messagetype/Inprocess.JPG";
				break;
			case "0800":
				oText = "Reset";
				Status = "{imageModel>/path}/messagetype/Reset.JPG";
				break;
			case "0400":
				oText = "Initial";
				Status = "";
				break;
			case "0012":
				oText = "Aborted";
				Status = "{imageModel>/path}/messagetype/Aborted.JPG";
				break;
			case "0008":
				oText = "Terminated";
				Status = "{imageModel>/path}/messagetype/Terminated.JPG";
				break;
			case "0007":
				oText = "Reset";
				Status = "{imageModel>/path}/messagetype/Reset.JPG";
				break;
			case "0006":
				oText = "Not processed";
				Status = "{imageModel>/path}/messagetype/notprocessed.JPG";
				break;
			case "0004":
				oText = "Finished with warning";
				Status = "{imageModel>/path}/messagetype/finishwithwarnig.JPG";
				break;
			case "0002":
				oText = "Manually set to finished"
				Status = "{imageModel>/path}/messagetype/manuallysetfinish.JPG";
				break;
			case "0000":
				oText = "Finished";
				Status = "{imageModel>/path}/messagetype/Finish.JPG";
				break;
			}

			oButt.setText(oText);
			oButt.setIcon(Status);
			oButt.setTooltip(even.getSource().getSelectedKey());

		},
		update_form: function (oEvent) {
			var path = oEvent.getSource().getParent().getBindingContext('item_of_assem').getPath();
			var oTableItem = sap.ui.getCore().byId("itemassembinqueue");
			var oModel = oTableItem.getModel('item_of_assem').getProperty(path);
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
			this.getView().getModel().update("item_status_projectSet(SerialNum='" + oModel.SerialNum + "',ProductTriggerId='" + oModel.ProductTriggerId +
				"',ProductId='" + oModel.ProductId + "')", oSelectedItem, null,
				function () {
					var oMsg = "Saved Sussefully!!";
					sap.m.MessageBox.success(oMsg);
				},
				function () {
					sap.m.MessageBox.error("Failed to Update");
				},
				false
			);
			this._refreshItem_Table(oModel.ProductTriggerId, oModel.ProductId);
		},
		_refreshItem_Table: function (ProductTriggerId, ProductId) {
			var fill = [];
			var filterGid = new sap.ui.model.Filter("ProductTriggerId", sap.ui.model.FilterOperator.EQ, ProductTriggerId);
			var filterPr = new sap.ui.model.Filter("ProductId", sap.ui.model.FilterOperator.EQ, ProductId);
			fill.push(filterGid, filterPr);
			var that = this;
			var oTab = sap.ui.getCore().byId("itemassembinqueue");
			var oTemplate = sap.ui.getCore().byId("itemstepinqueue");
			this.getView().getModel().read("/item_status_projectSet", {
				filters: fill,
				success: function (oData) {
					if (oData.results.length !== 0) {
						that.oData = oData.results;
						that.json = new sap.ui.model.json.JSONModel();
						that.json.setData({
							path: that.oData
						});
						oTab.setModel(that.json, "item_of_assem");
						that.getView().setModel(that.json, "item_of_assem");
					} else {
						var bCompact = !!that.getView().$().closest(".sapUiSizeCompact").length;
						sap.m.MessageBox.information(
							"No Form Found!!.", {
								styleClass: bCompact ? "sapUiSizeCompact" : ""
							}
						);
					}
				}
			});

		},

		validateClient: function (evt) {
			var inputValue = evt.getSource().getValue();
			if (inputValue.trim().length > 3) {

				alert("Please enter correct Client,It can't be more than 3 Character!! ");

			} else {

				return "None";

			}

		},

		cancel_assembly_item: function () {
			this.assem_stepsta.close();
			//	this.assem_stepsta.destroy();
			//	this.assem_stepsta = undefined;
		},
		onPressTitleEp: function (oEv) {
			this.showBusyIndicator(2000, 0);
			var oTableItem = this.getView().byId("idEPTable");
			var Path = oEv.getSource().getParent().getBindingContext('codeline_in_process').getPath();
			var oModel = oTableItem.getModel('codeline_in_process').getProperty(Path);
			if (oModel.Status == "61") {
				var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
				sap.m.MessageBox.error(
					"Sorry You can't Subscribe for 'Ready for Delivery' Status", {
						styleClass: bCompact ? "sapUiSizeCompact" : ""
					}
				);
			} else {
				var oParameter = {
					"EpRequestId": oModel.EpRequestId,
					"SpsName": oModel.SpsName,
					"HotfixId": oModel.HotfixId,
					"CodelineType": oModel.CodelineType,
					"HeaderStatus": oModel.HeaderStatus,
					"Status": oModel.Status
				};
				this.getView().getModel().create("/notify_user_for_ep_statusSet", oParameter);
				sap.m.MessageToast.show("Successfully set Notification for EP = " + oModel.EpRequestId + " , SPS = " + oModel.SpsName +
					" and Hotfix = " +
					oModel.HotfixId);
				oEv.getSource().setType("Emphasized");
				oEv.getSource().setTooltip("You have set it for Notification");
			}
		},

		_notify_user: function () {
			main_globalme.getView().getModel().read("/notify_user_for_ep_statusSet", {
				success: function (oData) {
					if (oData.results.length != 0) {
						for (var i = 0; i < oData.results.length; i++) {
							document.addEventListener('DOMContentLoaded', function () {
								if (Notification.permission !== "granted")
									Notification.requestPermission();
							});
							if (main_globalme.getView().byId("switch").getState() == true) {
								var notification = new Notification('Codeline Status Changed', {
									icon: 'img/notify_for_stat.JPG',
									body: "Hi " + username + " Status of EP with ID: " + " " + oData.results[i].EpRequestId + " and Hotfix ID :" + " " +
										oData.results[i].HotfixId + " have been changed to 'Ready for Delivery'",
									dir: "ltr",
									requireInteraction: true
								});
							}

						}
						var audio = document.getElementById("idErrorSound");
						audio.play();

					}
				}
			});
			window.setTimeout(main_globalme._notify_user, 180000);
		},

		ClearSorting: function () {

			this.ep = '', this.epState = '', this.sps = '', this.pver = '', this.spsState = '', this.hf = '', this.hfState = '', this.code =
				'',
				this.codeState =
				'', this.Correction = '', this.CorrectionState = '';
		},

		openLogofUser: function () {
			window.open("https://ldcipqe.wdf.sap.corp:44301/sap/bc/ui5_ui5/brlt/user_log/index.html", target = "_blank");
		},

		disableVideo: function (oEvent) {
			// if (oEvent.getParameters().selected == true) {
			// 	var oParameter = {
			// 		"Disable": "X"
			// 	};
			// 	this.showBusyIndicator(2000, 0);
			// 	this.getView().getModel().create("/video_disableSet", oParameter, false);
			// } else {
			// 	var oParameter = {
			// 		"Disable": ""
			// 	};
			// 	this.showBusyIndicator(2000, 0);
			// 	this.getView().getModel().create("/video_disableSet", oParameter, false);
			// }
		},
		onChangeVideo: function () {
			window.open("https://pqpmain.wdf.sap.corp:44376/sap/bc/ui5_ui5/brlt/video_log/index.html", target = "_blank");
		},
		sendRetestMail: function (oEvent) {
			var that = this;
			var path = oEvent.getSource().getBindingContext().getPath();
			var data = oEvent.getSource().getModel().getProperty(path);
			this.showBusyIndicator(3000, 0);
			this.getView().getModel().read("/usernameSet", {
				success: function (oData) {
					if (oData.results[0].Persnumber != 'Found') {
						var bCompact = !!that.getView().$().closest(".sapUiSizeCompact").length;
						sap.m.MessageBox.error(
							"You are not authorized to Change the State , Please Contact HFG Members to Change it.", {
								styleClass: bCompact ? "sapUiSizeCompact" : ""
							}
						);
					} else {
						if (!that._oDialogRetest) {
							that._oDialogRetest = sap.ui.xmlfragment("epdash.epdash.view.retestmail", that);
							that.getView().addDependent(that._oDialogRetest);
						}

						// toggle compact style
						jQuery.sap.syncStyleClass("sapUiSizeCompact", that.getView(), that._oDialogRetest);
						var oJson = new sap.ui.model.json.JSONModel();
						oJson.setData({
							path: data
						});
						that._oDialogRetest.setModel(oJson);
						that._oDialogRetest.open();
					}

					async: false,
					function (error) {}

				}
			});
		},
		ChangeStateRestest: function (oEvent) {
			var oEntry = this._oDialogRetest.getModel().getData().path;
			var oParameter = {};
			oParameter.ProductTriggerId = oEntry.ProductTriggerId;
			oParameter.ProductId = oEntry.ProductId;
			if (oEntry.ProductId === 'S4H' || oEntry.ProductId === 'IBP') {
				var aFilterArray = [];
				var filterGrp = new sap.ui.model.Filter("ProductTriggerId", sap.ui.model.FilterOperator.EQ, oEntry.ProductTriggerId);
				var filterProd = new sap.ui.model.Filter("ProductId", sap.ui.model.FilterOperator.EQ, oEntry.ProductId);
				aFilterArray.push(filterGrp, filterProd);
				this.showBusyIndicator(4000, 0);
				var that = this;
				this.getView().getModel().read("/retest_mail_sendSet", {
					filters: aFilterArray,
					success: function (oData) {
						if (oData.results.length !== 0) {
							if (oData.results[0].RetestMail === 'F') {
								var bCompact = !!that.getView().$().closest(".sapUiSizeCompact").length;
								sap.m.MessageBox.error(
									"Failed to Update the Entry . Please login to PQP and Set Assembly Item 'Inform developers to retest (HFS: TA HF_PATCH_ASSEMBLY)' to 'Manually Finished' first. Then try Again!!!", {
										styleClass: bCompact ? "sapUiSizeCompact" : ""
									}
								);
								that._oDialogRetest.close();
							} else if (oData.results[0].RetestMail === 'S') {
								that.getView().getModel().update("/retest_mail_sendSet(ProductTriggerId='" + oEntry.ProductTriggerId + "',ProductId='" +
									oEntry.ProductId +
									"')", oParameter, null,
									function () {
										var oMsg = "Updated Sussefully Please wait for refresh!!";
										sap.m.MessageBox.success(oMsg);
									},
									function () {
										sap.m.MessageBox.error("Failed to Update");
									}
								);
								that._oDialogRetest.close();
								that.getView().byId("EP_req_tabledelete").getModel().refresh(true);
							}
						}
					},
					error: function (error) {
						sap.m.MessageBox.error("Failed to find . Please try after sometime!!!");
					},
					async: false
				});

			} else if (oEntry.ProductId === 'BYD' || oEntry.ProductId === 'C4C') {
				this.getView().getModel().update("/retest_mail_sendSet(ProductTriggerId='" + oEntry.ProductTriggerId + "',ProductId='" +
					oEntry
					.ProductId +
					"')", oParameter, null,
					function () {
						var oMsg = "Updated Sussefully";
						sap.m.MessageBox.success(oMsg);
					},
					function () {
						sap.m.MessageBox.error("Failed to Update");
					}
				);
				this._oDialogRetest.close();
			}
		},
		SendRetestMailtodev: function (oEvent) {
			var oEntry = this._oDialogRetest.getModel().getData().path;
			var oParameter = {};
			oParameter.ProductTriggerId = oEntry.ProductTriggerId;
			oParameter.ProductId = oEntry.ProductId;
			var that = this;
			this.showBusyIndicator(4000, 0);
			if (oEntry.ProductId === 'S4H' || oEntry.ProductId === 'IBP') {
				var aFilterArray = [];
				var filterGrp = new sap.ui.model.Filter("ProductTriggerId", sap.ui.model.FilterOperator.EQ, oEntry.ProductTriggerId);
				var filterProd = new sap.ui.model.Filter("ProductId", sap.ui.model.FilterOperator.EQ, oEntry.ProductId);
				aFilterArray.push(filterGrp, filterProd);

				this.getView().getModel().read("/retest_mail_sendSet", {
					filters: aFilterArray,
					success: function (oData) {
						if (oData.results.length !== 0) {
							if (oData.results[0].RetestMail === 'F') {
								var bCompact = !!that.getView().$().closest(".sapUiSizeCompact").length;
								sap.m.MessageBox.error(
									"Failed to Update the Entry and Sending retest mail. Please login to PQP and Set Assembly Item 'Inform developers to retest (HFS: TA HF_PATCH_ASSEMBLY)' to 'Manually Finished' first. Then try Again!!!", {
										styleClass: bCompact ? "sapUiSizeCompact" : ""
									}
								);
								that._oDialogRetest.close();
							} else if (oData.results[0].RetestMail === 'S') {
								//Write logic to send mails for S4 and IBP product
								//RetestMail
								that._oDialogRetest.close();
								that.getView().byId("EP_req_tabledelete").getModel().refresh(true);
								aFilterArray = [];
								var filterGrp = new sap.ui.model.Filter("ProductTriggerId", sap.ui.model.FilterOperator.EQ, oEntry.ProductTriggerId);
								var filterProd = new sap.ui.model.Filter("ProductId", sap.ui.model.FilterOperator.EQ, oEntry.ProductId);
								var filterRetest = new sap.ui.model.Filter("RetestMail", sap.ui.model.FilterOperator.EQ, 'T');
								aFilterArray.push(filterGrp, filterProd, filterRetest);
								that.getView().getModel().read("/retest_mail_sendSet", {
									filters: aFilterArray,
									success: function (oData) {
										if (oData.results.length !== 0) {
											if (oData.results[0].RetestMail === 'D') {
												sap.m.MessageBox.success("Mail Successfully Send :)");
												that.getView().getModel().update("/retest_mail_sendSet(ProductTriggerId='" + oEntry.ProductTriggerId +
													"',ProductId='" + oEntry.ProductId +
													"')", oParameter, null,
													function () {
														var oMsg = "Entry Updated Sussefully Please wait for refresh!!";
														sap.m.MessageBox.success(oMsg);
													},
													function () {
														sap.m.MessageBox.error("Failed to Update");
													}
												);
											} else if (oData.results[0].RetestMail === 'R') {
												for (var i = 0; i < oData.results.length; i++) {
													sap.m.MessageBox.error("Failed to Send for EP = " + oData.results[i].EpRequestId + " Hotfix = " + oData.results[
															i]
														.HotfixId);
												}
											}
										}
									},
									async: false
								});
							}
						}
					},
					error: function (error) {
						sap.m.MessageBox.error("Failed to find . Please try after sometime!!!");
					},
					async: false
				});

			} else if (oEntry.ProductId === 'BYD' || oEntry.ProductId === 'C4C') {
				//Write logic to send mails for BYD and C4C product
				//retest mail for BYD/C4C without check from PQP Project
				that._oDialogRetest.close();
				that.getView().byId("EP_req_tabledelete").getModel().refresh(true);
				aFilterArray = [];
				var filterGrp = new sap.ui.model.Filter("ProductTriggerId", sap.ui.model.FilterOperator.EQ, oEntry.ProductTriggerId);
				var filterProd = new sap.ui.model.Filter("ProductId", sap.ui.model.FilterOperator.EQ, oEntry.ProductId);
				var filterRetest = new sap.ui.model.Filter("RetestMail", sap.ui.model.FilterOperator.EQ, 'T');
				aFilterArray.push(filterGrp, filterProd, filterRetest);
				that.getView().getModel().read("/retest_mail_sendSet", {
					filters: aFilterArray,
					success: function (oData) {
						if (oData.results.length !== 0) {
							if (oData.results[0].RetestMail === 'D') {
								sap.m.MessageBox.success("Mail Successfully Send :)");
								that.getView().getModel().update("/retest_mail_sendSet(ProductTriggerId='" + oEntry.ProductTriggerId + "',ProductId='" +
									oEntry.ProductId +
									"')", oParameter, null,
									function () {
										var oMsg = "Entry Updated Sussefully Please wait for refresh!!";
										sap.m.MessageBox.success(oMsg);
									},
									function () {
										sap.m.MessageBox.error("Failed to Update");
									}
								);
							} else if (oData.results[0].RetestMail === 'R') {
								sap.m.MessageBox.error("Failed to Send for EP = " + oData.results[0].EpRequestId + " Hotfix = " + oData.results[0].HotfixId);
							}
						}
					},
					async: false
				});
			}
		},
		onCloseretestDialog: function () {
			this._oDialogRetest.close();
		},
		_number_of_deployment: function () {
			var filtersTitle = [];
			for (var i = 0; i < array.length; i++) {
				var oFilters = new sap.ui.model.Filter("ProductName", sap.ui.model.FilterOperator.EQ, array[i]);
				filtersTitle.push(oFilters);
			};
			var res;
			var sarray = [];
			var bArray = [];
			main_globalme.getView().getModel().read("/assem_in_queueSet", {
				filters: filtersTitle,
				success: function (oData) {
					if (oData.results.length !== 0) {
						main_globalme.getView().byId("menubutton").setVisible(true);
						for (var i = 0; i < oData.results.length; i++) {
							res = oData.results[i].ProductId + oData.results[i].ProductTriggerId;
							sarray.push(res);
						}
						$.each(sarray, function (i, el) {
							if ($.inArray(el, bArray) === -1) bArray.push(el);
						});
						var menuModel = new sap.ui.model.json.JSONModel({
							property: [{
								text: bArray
							}]
						});
						main_globalme.getView().setModel(menuModel, "product");
						main_globalme.getView().getModel("product").refresh(true);
					} else if (oData.results.length === 0) {
						if (main_globalme.getView().byId("menubutton").getVisible() === true) {
							main_globalme.getView().byId("menubutton").setVisible(false);
						}
						if (main_globalme.getView().byId("deploymentindicator").getVisible() === true) {
							main_globalme.getView().byId("deploymentindicator").setVisible(false);
						}
						if (main_globalme.getView().byId("closebar").getVisible() === true) {
							main_globalme.getView().byId("closebar").setVisible(false);
						}

					}
				},
				error: function (err) {},
				async: false

			});
			window.setTimeout(main_globalme._number_of_deployment, 300000);
		},
		showDeploymentStep: function (oEvent) {
			main_globalme.getView().byId("deploymentindicator").setVisible(true);
			main_globalme.getView().byId("closebar").setVisible(true);
			var filtersTitle = [];
			if (oEvent !== undefined) {
				main_globalme.deplygrId = oEvent.getParameters().item.getText().slice(0, 3);
				main_globalme.deplyprId = oEvent.getParameters().item.getText().slice(3);
			}
			var oFilter1 = new sap.ui.model.Filter("ProductId", sap.ui.model.FilterOperator.EQ, main_globalme.deplygrId);
			var oFilter2 = new sap.ui.model.Filter("ProductTriggerId", sap.ui.model.FilterOperator.EQ, main_globalme.deplyprId);
			filtersTitle.push(oFilter1, oFilter2);
			main_globalme.showBusyIndicator(3000);
			main_globalme.getView().getModel().read("/deplyment_statusSet", {
				filters: filtersTitle,
				success: function (oData) {
					if (oData.results.length !== 0) {
						main_globalme.getView().byId("deploymentindicator").setPercentValue((oData.results[0].completed_item / oData.results[0].total_item) *
							100);
						main_globalme.getView().byId("deploymentindicator").setDisplayValue(Math.round((oData.results[0].completed_item / oData.results[
									0]
								.total_item) *
							100) + "% " + "(" + "Currently in " + oData.results[0].item_short_text + ")");
					} else {
						//	main_globalme.getView().byId("deploymentindicator").setPercentValue((oData.results[0].completed_item / oData.results[0].total_item) *100);
						main_globalme.getView().byId("deploymentindicator").setDisplayValue("No Data found");
					}

				},
				async: true
			});
			window.setTimeout(main_globalme.getDeployment_state, 1000);

		},
		closeProgressbar: function () {
			this.getView().byId("deploymentindicator").setVisible(false);
			this.getView().byId("closebar").setVisible(false);
			this.deplygrId = '';
			this.deplyprId = '';
		},
		getDeployment_state: function () {
			var win = window.setTimeout(main_globalme.getDeployment_state, 180000);
			if (main_globalme.deplygrId !== '' && main_globalme.deplyprId !== '') {
				win;
				console.log("On");
				var filtersTitle = [];
				var oFilter1 = new sap.ui.model.Filter("ProductId", sap.ui.model.FilterOperator.EQ, main_globalme.deplygrId);
				var oFilter2 = new sap.ui.model.Filter("ProductTriggerId", sap.ui.model.FilterOperator.EQ, main_globalme.deplyprId);
				filtersTitle.push(oFilter1, oFilter2);
				main_globalme.getView().getModel().read("/deplyment_statusSet", {
					filters: filtersTitle,
					success: function (oData) {
						if (oData.results.length !== 0) {
							main_globalme.getView().byId("deploymentindicator").setPercentValue((oData.results[0].completed_item / oData.results[0].total_item) *
								100);
							if (((oData.results[0].completed_item / oData.results[0].total_item) * 100) > 90) {
								main_globalme.getView().byId("deploymentindicator").setState("Success");
							}
							main_globalme.getView().byId("deploymentindicator").setDisplayValue(Math.round((oData.results[0].completed_item / oData.results[
											0]
										.total_item) *
									100) + "% " + main_globalme.deplygrId + main_globalme.deplyprId + "(" + "Currently in " + oData.results[0].phase_short_text +
								" Phase & Item = " + oData.results[0].item_short_text + ")");
							if (((oData.results[0].completed_item / oData.results[0].total_item) * 100) === 100) {
								main_globalme.getView().byId("deploymentindicator").setDisplayValue(main_globalme.deplygrId + main_globalme.deplyprId +
									" Deployed Successfull");
							}
						} else {
							//	main_globalme.getView().byId("deploymentindicator").setPercentValue((oData.results[0].completed_item / oData.results[0].total_item) *100);
							main_globalme.getView().byId("deploymentindicator").setDisplayValue("No Data found");
							main_globalme.getView().byId("deploymentindicator").setPercentValue(0);
						}

					},
					async: true
				});
			} else {
				window.clearTimeout(win);
				console.log("Off");
			}
		},

		onHotlinerInfo: function (oEvent) {
			var keyValue = oEvent.mParameters.value;
			//	var sData = this.getView().getModel("visible_hot").getData();
			if (keyValue === "BYD/C4C") {
				//		sData.visible = "false";
				this._hotlinerUpdate("BYD");
			} else if (keyValue === "S4HANA/IBP") {
				//		sData.visible = "true";
				this._hotlinerUpdate("CLOUD");
			} else if (keyValue === "A4C") {
				// 	//		sData.visible = "true";
				this._hotlinerUpdate("Steampunk");
			}
			//	this.getView().getModel("visible_hot").refresh(true);
		},

		onpatchassembly: function (oEvent) {

		},
		retest_success_filter: function (oEvent) {
			this._getDialog().open("filter");
		},
		_getDialog: function () {
			if (!this._CompletedEP) {
				this._CompletedEP = sap.ui.xmlfragment("epdash.epdash.view.Ep_completed_filter", this);
				this.getView().addDependent(this._CompletedEP);
			}
			return this._CompletedEP;
		},
		handleConfirmFilter: function (oEvent) {
			if (oEvent.getParameters().filterKeys) {
				this.ComFilters = [];
				var EPdeltable = this.getView().byId("EP_req_tabledelete");
				var sPath = "RetestSuccess";
				for (var i = 0; i < oEvent.getParameters().filterItems.length; i++) {
					this.ComFilters.push(new sap.ui.model.Filter(sPath, sap.ui.model.FilterOperator.EQ, oEvent.getParameters().filterItems[i].mProperties
						.key));
				}
				this.ComOBinding = EPdeltable.getBinding("items");
				this.ComOBinding.filter(this.ComFilters);
			}
		},
		retest_reminder: function () {
			var that = this;
			var oGlobalBusyDialog = new sap.m.BusyDialog();
			this.showBusyIndicator(3000, 0);
			var batchItem = [];
			var Json = {
				"EpRequestId": '',
				"SpsName": '',
				"HotfixId": ''
			};
			var oModel_auto = new sap.ui.model.odata.ODataModel("/sap/opu/odata/BRLT/PQP_PROJECT_DETAIL_SRV/");
			//	var retest_oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/BRLT/PQP_PROJECT_DETAIL_SRV/");
			var oModel = this.getView().getModel();

			oModel_auto.read("/get_ho_user_detSet", {
				success: function (oData) {
					if (oData.results.length !== 0) {
						if (oData.results[0].user_autorz === 'B' || oData.results[0].user_autorz === 'R' || oData.results[0].user_autorz === 'V') {
							var EPdeltable = that.getView().byId("EP_req_tabledelete");
							var bCompact = !!that.getView().$().closest(".sapUiSizeCompact").length;
							if (EPdeltable.getSelectedItem() === null) {

								sap.m.MessageBox.error(
									"Please Select Items.", {
										styleClass: bCompact ? "sapUiSizeCompact" : ""
									}
								);
							} else {
								var contexts = EPdeltable.getSelectedContexts();
								var items = contexts.map(function (c) {
									return c.getObject();
								});
								var array = [];
								this.openreminder_dialog = null;
								for (var j = 0; j < items.length; j++) {
									var check = EPdeltable.getModel().getProperty(contexts[j].sPath).RetestSuccess;
									array.push(check);
								}
								if (array.includes("X")) {
									sap.m.MessageBox.error(

										"One of the selected EP is Already Retested kindly select correct value. ", {
											styleClass: bCompact ? "sapUiSizeCompact" : ""
										}
									);
								} else {
									var dialog = new sap.m.Dialog({
										title: 'Select Option how you want to send reminder?',
										contentWidth: "500px",
										contentHeight: "50px",
										resizable: true,
										draggable: true,
										content: [
											new sap.m.Text({
												text: ""
											})
										],
										beginButton: new sap.m.Button({
											text: 'Use Default Mail template .',
											press: function () {
												for (var j = 0; j < items.length; j++) {
													var sps = items[0].SpsName.split(' ').join('%20');
													var sps = EPdeltable.getModel().getProperty(contexts[j].sPath).SpsName.split(' ').join('%20');
													var oPath = "/retest_mail_sendSet(ProductTriggerId='',ProductId='',body='',EpRequestId='" + EPdeltable.getModel()
														.getProperty(
															contexts[j].sPath).EpRequestId +
														"',SpsName='" + sps +
														"',HotfixId='" + EPdeltable.getModel().getProperty(contexts[j].sPath).HotfixId + "')";
													batchItem.push(oModel.createBatchOperation(oPath, "GET"));
													// oModel.addBatchReadOperations([oModel.createBatchOperation(oPath , "GET")]);

												}
												oModel.addBatchReadOperations(batchItem);
												batchItem = [];
												that._sendreminder_retest(oModel, oPath);
												dialog.close();
											}
										}),
										endButton: new sap.m.Button({
											text: 'Edit Content of Mail before sending.',
											press: function () {

												that._create_mail_temp(items, EPdeltable);
												that.changebody.open();

												dialog.close();
											}
										}),
										afterClose: function () {
											dialog.destroy();
										}
									});

									dialog.open();
								}

								that.showBusyIndicator(2000, 0);
							}
						} else if (oData.results[0].user_autorz === 'U') {
							var bCompact = !!that.getView().$().closest(".sapUiSizeCompact").length;
							sap.m.MessageBox.error(
								"You are not authorized to Send Reminder .\n Only Memebers of \nDL ARES CLOUD HOTFIX GOVERNANCE - BANGALORE \nDL ARES CLOUD HOTFIX GOVERNANCE - ROT \nDL ARES CLOUD HOTFIX GOVERNANCE - VANCOUVER \ncan send!!", {
									styleClass: bCompact ? "sapUiSizeCompact" : ""
								}
							);
						}
					}
				},
				async: false
			});

		},
		_create_mail_temp: function (items, EPdeltable) {
			var batchItem = [];
			var oModel = this.getView().getModel();
			var that = this;
			var oGlobalBusyDialog = new sap.m.BusyDialog();
			var body = 'Dear colleagues,' + '\n\n' +
				'Correction for ' + "<Sps_name>" + ' has been deployed into the deploy test system ' + "<Sys_Id>." + '\n' +
				'Please login to the deploy test system and perform the retest of the corrections.\n' +
				"If the retest is successful, select the corresponding codeline in the EP request and click on the button 'Retest Successful'.  If needed, some additional information can be entered in the field 'Retest Msg'.\n\n" +
				"In case of issues, please contact:\n" +
				"For BYD, TEM, COD: DL Update Patch Governance\n" +
				"For S/4HANA: DL S4HANA_HotfixGovernance\n" +
				"For IBP: DL IBP_HotfixGovernance\n" +
				"Regards,\n" +
				"Hotfix Governance ";
			var oTextArea = new sap.m.TextArea({
				value: body,
				height: "100%",
				width: "100%",
				growing: true
			});
			var contexts = EPdeltable.getSelectedContexts();

			if (!that.changebody) {
				that.changebody = new sap.m.Dialog({
					title: 'Mail Body',
					contentWidth: "800px",
					contentHeight: "400px",
					resizable: true,
					draggable: true,
					content: [oTextArea,
						new sap.m.Text({
							text: "Note:Please don't change <> content . It could affect the Reminder Mails."
						})
					],
					beginButton: new sap.m.Button({
						text: 'OK',
						press: function () {
							oGlobalBusyDialog.open();
							var oParameter = {
								body: oTextArea.getValue().replace(/(?:\r\n|\r|\n)/g, '<br>')
							};
							oModel.create("/retest_mail_sendSet", oParameter, {
								success: function (success) {

								},
								error: function (err) {
									alert('Error');
								},
								async: false
							});
							for (var j = 0; j < items.length; j++) {
								var sps = EPdeltable.getModel().getProperty(contexts[j].sPath).SpsName.split(' ').join('%20');
								var oPath = "/retest_mail_sendSet(ProductTriggerId='',ProductId='',EpRequestId='" + EPdeltable.getModel().getProperty(
										contexts[j]
										.sPath)
									.EpRequestId +
									"',SpsName='" + sps +
									"',body='" + 'X' +
									"',HotfixId='" + EPdeltable.getModel().getProperty(contexts[j].sPath).HotfixId + "')";
								batchItem.push(oModel.createBatchOperation(oPath, "GET"));
								// oModel.addBatchReadOperations([oModel.createBatchOperation(oPath , "GET")]);

							}
							oModel.addBatchReadOperations(batchItem);
							batchItem = [];
							that._sendreminder_retest(oModel, oPath);
							that.changebody.close();
							oGlobalBusyDialog.close();
						}.bind(that)
					}),
					endButton: new sap.m.Button({
						text: 'Cancel',
						press: function () {

							that.changebody.close();
						}.bind(that)
					})
				});

				//to get access to the global model
				that.getView().addDependent(that.changebody);
			}
		},
		_sendreminder_retest: function (oModel, oPath) {
			var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
			oModel.submitBatch(function (data) {
				if (data.__batchResponses.length !== 0) {
					for (var i = 0; i < data.__batchResponses.length; i++) {
						if (data.__batchResponses[i].data.RetestMail === 'S') {

							sap.m.MessageBox.success(
								"Retest Mail reminder successfully send for " +
								"EP Id = " + parseFloat(data.__batchResponses[i].data.EpRequestId) +
								", SPS = " + data.__batchResponses[i].data.SpsName +
								" & Hotfix Id = " + parseFloat(data.__batchResponses[i].data.HotfixId), {
									styleClass: bCompact ? "sapUiSizeCompact" : ""
								}
							);
						} else if (data.__batchResponses[i].data.RetestMail === 'F') {
							sap.m.MessageBox.error(
								"Retest Mail reminder for " +
								"EP Id = " + parseFloat(data.__batchResponses[i].data.EpRequestId) +
								", SPS = " + data.__batchResponses[i].data.SpsName +
								" & Hotfix Id = " + parseFloat(data.__batchResponses[i].data.HotfixId) +
								" has Failed.\nEither EP is too old or Problem with email Id .", {
									styleClass: bCompact ? "sapUiSizeCompact" : ""
								}
							);
						}
					}
				}
			});

		},
		goto_handover_page: function () {
			var oData = {
				username
			};
			var gModel = new sap.ui.model.json.JSONModel(oData);
			sap.ui.getCore().setModel(gModel, "GModel");
			this.showBusyIndicator(3000, 0);
			var oRouter_hand = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter_hand.navTo("handover");
		},
		open_form: function (evt) {

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("item_form");

		},
		_getStatus_of_form: function () {
			var oTable = main_globalme.getView().byId("EP_req_tabledelete");
			var items = oTable.getItems();
			var path;
			var form_status;
			for (var i = 0; i < items.length; i++) {
				path = oTable.getItems()[i].getBindingContext().getPath();
				form_status = oTable.getItems()[i].getModel().getProperty(path).FormStatus;
				if (form_status === "true") {
					//	oTable.getItems()[i].addStyleClass("delete_table_color");
				} else {
					//	oTable.getItems()[i].removeStyleClass("delete_table_color");
				}
			}
		},
		search_assembly_form: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("external_form", {
				collection_id: 'null'
			});
		},
		single_smart_search: function (oEvent) {
			var key = oEvent.getSource().getValue();
			oEvent.getSource().setValue("");
			window.open("https://singlesmartsearch-a315af559.dispatcher.hana.ondemand.com/#/search/" + key, target = "_blank");
		},
		onStartAssembly: function () {
			var that = this;
			var oTable_Item = this.getView().byId("EP_req_table").getSelectedItem();

			if (oTable_Item === null) {
				sap.m.MessageBox.error('Please Select Trigger Item!!');
			} else {
				var Path = oTable_Item.getBindingContext().getPath();
				var takeOver = oTable_Item.getModel().getProperty(Path).TakeOverButton;
				if (takeOver === 'Take Over') {
					sap.m.MessageBox.error("Please pick the assembly first.!!!");
				} else {
					var grId = new sap.ui.model.Filter("ProductTriggerId", sap.ui.model.FilterOperator.EQ, oTable_Item.getModel().getProperty(
							Path)
						.ProductTriggerId);
					var prId = new sap.ui.model.Filter("ProjectId", sap.ui.model.FilterOperator.EQ, oTable_Item.getModel().getProperty(Path).ProductId);
					var filterTitle = [];
					filterTitle.push(grId, prId);
					var that = this;
					var oGlobalBusyDialog = new sap.m.BusyDialog();
					oGlobalBusyDialog.open();
					this.getView().getModel().read("/pqp_assembly_project_detailSet", {
						filters: filterTitle,
						success: function (oData) {
							if (oData.results.length !== 0) {
								if (oData.results[0].collection !== '' && oData.results[0].ProjgrpId === '') {
									sap.m.MessageBox.show(
										"Assembly is OnGoing with Collection ID " + " " + oData.results[0].collection + " " + ".", {
											icon: sap.m.MessageBox.Icon.SUCCESS,
											title: "Assembly is OnGoing!!", // default
											actions: [sap.m.MessageBox.Action.CLOSE],
											styleClass: "",
											initialFocus: "Custom Button",
											textDirection: sap.ui.core.TextDirection.Inherit
										}
									);
								} else if (oData.results[0].collection !== '' && oData.results[0].ProjgrpId !== '') {
									sap.m.MessageBox.show(
										"Assembly is OnGoing with Collection ID " + " " + oData.results[0].collection + " and Project Group Id " + oData.results[
											0].ProjgrpId + ".", {
											icon: sap.m.MessageBox.Icon.SUCCESS,
											title: "Assembly is OnGoing!!", // default
											actions: [sap.m.MessageBox.Action.CLOSE],
											styleClass: "",
											initialFocus: "Custom Button",
											textDirection: sap.ui.core.TextDirection.Inherit
										}
									);
								}
							} else {
								that._trigger_patch_assembly(oTable_Item, Path);
							}
							oGlobalBusyDialog.close();
						},
						error: function () {
							oGlobalBusyDialog.close();
						},
						async: false
					});
				}
			}
		},

		_trigger_patch_assembly: function (oTable_Item, Path) {
			var ProdName = oTable_Item.getModel().getProperty(Path).ProductName;
			var SpsName = oTable_Item.getModel().getProperty(Path).SpsName;
			var FaSystem = oTable_Item.getModel().getProperty(Path).FaSystem;
			var ProdName_Filter = new sap.ui.model.Filter("ProductName", sap.ui.model.FilterOperator.EQ, ProdName);
			var Sps_Filter = new sap.ui.model.Filter("SpsName", sap.ui.model.FilterOperator.EQ, SpsName);
			var Fa_Filter = new sap.ui.model.Filter("FaSystem", sap.ui.model.FilterOperator.EQ, FaSystem);
			var oFilter = [];
			var that = this;
			oFilter.push(ProdName_Filter, Sps_Filter, Fa_Filter);
			var oGlobalBusyDialog = new sap.m.BusyDialog();
			oGlobalBusyDialog.open();
			this.oModel_Assembly.read("/assembly_executeSet", {
				filters: oFilter,
				success: function (oData) {
					if (oData.results.length === 0) {
						sap.m.MessageBox.error("No Project Found.\nPlease do it Manually.!!!");
					} else {
						if (!that.assembly_swcv) {
							that.assembly_swcv = sap.ui.xmlfragment("epdash.epdash.view.start_assembly", that);
							that.getView().addDependent(that.assembly_swcv);
						}
						var swcv_model = new sap.ui.model.json.JSONModel(oData.results);
						that.assembly_swcv.setModel(swcv_model, "swcv_model");
						that.assembly_swcv.open();
					}
					oGlobalBusyDialog.close();
				},
				error: function (err) {
					sap.m.MessageBox.error("Error while processing!!!");
					oGlobalBusyDialog.close();
				},
				async: false
			});
		},
		on_press_patch_collection: function (oEvent) {

		},
		confirm_assembly: function () {
			sap.m.MessageBox.alert("Under Testing!!!");
		},
		close_assembly: function () {
			this.assembly_swcv.close();
		},
		closeBug: function () {
			this.reportBugSheet.close();
		},
		submitBug: function (oEvent) {
			var aData = this.reportBugSheet.getModel("bug").getData();
			var bState = this._validateFields(aData);
			if (bState) {
				var oEntry = {
					Tool: aData.Tool,
					Priority: aData.Priority,
					Summary: aData.Summary,
					Description: aData.Description,
					IssueType: aData.IssueType,
					Component: aData.Component
				};
				var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/BRLT/ASSEMBLY_ON_DEVICE_SRV");
				oModel.create("/ReportBugSet", oEntry);
				sap.m.MessageToast.show(
					"Respective developer will be informed and you will get notified via mail once the backlog is created in JIRA");
				this.closeBug();
			} else {
				sap.m.MessageToast.show("All Fields are mandatory");
			}
		},
		_validateFields: function (aData) {
			if (aData.Summary.length === 0) {
				return false;
			}
			if (aData.Description.length === 0) {
				return false;
			}
			return true;
		},
		openReportBug: function () {
			if (!this.reportBugSheet) {
				// TO-DO :Replace “Hotline” with your app’s namespace
				this.reportBugSheet = sap.ui.xmlfragment(
					"epdash.epdash.view.ReportBug",
					this
				);
				this.getView().addDependent(this.reportBugSheet);
				var oCompModel = new sap.ui.model.json.JSONModel();
				var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/BRLT/ASSEMBLY_ON_DEVICE_SRV");
				oModel.read("/ComponentSet", {
					success: function (oData) {
						oCompModel.setData(oData);
					},
					error: function () {
						var oData = {};
						oData.results = [];
						oData.results[0] = {
							ComponentId: "72963",
							Text: "TOOLS - DASHBOARDS"
						};
						oCompModel.setData(oData);
					}
				});
				this.reportBugSheet.setModel(oCompModel, "comp");
			}
			var oBugModel = new sap.ui.model.json.JSONModel({
				Tool: "EPD", // TO-DO : Replace your app id here>
				Priority: "3",
				Summary: "",
				Description: "",
				IssueType: "1",
				Component: "72963"
			});
			this.reportBugSheet.setModel(oBugModel, "bug");
			this.reportBugSheet.open();
		},
		_get_cloud_products_flag: function () {
			main_globalme.cl_products_flag = {
				"ProductConstants": [],
				"Urgency_LS": '1',
				"Urgency_EO": '3',
				"Urgency_NS": '5'
			};
			var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/BRLT/PRODUCT_CATOGRY_DETAIL_SRV/");
			oModel.read("/get_products_flagsSet", {
				success: function (oData) {
					if (oData.results.length !== 0) {
						for (let loop in oData.results) {
							let flag_value = {
								"ProductName": oData.results[loop].ProductName,
								"ProductConstants": oData.results[loop].ProductConstants,
								"Value": oData.results[loop].Value
							}
							main_globalme.cl_products_flag['ProductConstants'].push(flag_value);
						}
					}
				},
				error: function () {

				}
			});

		},
		onNavToEDPAdmin: function () {
			window.open("https://epdashadmin-a95972b99.dispatcher.hana.ondemand.com/", target = "_blank");
		},
		onMenuAction: function (oEvent) {
			this.beckend_system_status(oEvent);
		},
		handlePressOpenAdvanceMenu: function (oEvent) {
			var oButton = oEvent.getSource();

			// create menu only once
			if (!this._menu) {
				this._menu = sap.ui.xmlfragment(
					"epdash.epdash.view.advancedOption",
					this
				);
				this.getView().addDependent(this._menu);
			}

			var eDock = sap.ui.core.Popup.Dock;
			this._menu.open(this._bKeyboard, oButton, eDock.BeginTop, eDock.BeginBottom, oButton);
		},
		beckend_system_status: function (oEvent) {
			var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/BRLT/ASSEMBLY_ON_DEVICE_SRV/");
			var oStatusModel = new sap.ui.model.json.JSONModel();
			var oGlobalBusyDialog = new sap.m.BusyDialog();
			oGlobalBusyDialog.open();
			oModel.read("/BackendSet('X')", {
				success: function (oData) {
					var oEntry = {
						SYSTEM: oData
					};
					oStatusModel.setData(oEntry);
					oGlobalBusyDialog.close();
					if (oEvent === undefined) {
						if (oData.HfsStatus !== 'X' && oData.SystemId === 'PQP') {
							sap.m.MessageBox.error("HFS System is Down.!!");
						}
						if (oData.HfxStatus !== 'X' && oData.SystemId === 'PQP') {
							sap.m.MessageBox.error("HFX System is Down.!!");
						}
						if (oData.SystemId !== 'PQP') {
							sap.m.MessageBox.error("PQP System is Down.!!");
						}
					}
				},
				error: function () {
					oStatusModel.setData({
						SYSTEM: null
					});
					oGlobalBusyDialog.close();
				},
				async: false
			});
			if (oEvent !== undefined) {
				if (!this._SystemStatus) {
					this._SystemStatus = sap.ui.xmlfragment("epdash.epdash.view.backend_system_status", this);
				}
				this._SystemStatus.setModel(oStatusModel, "status");
				//var oButton = oEvent.getSource().getParent().getParent();
				var oButton = this.byId("openAdvanceMenu");
				jQuery.sap.delayedCall(0, this, function () {
					//this._SystemStatus.openBy(oButton);
					this._SystemStatus.openBy(oButton);

				});
			}

		},
		open_bcp_ares_incidents: function () {
			main_globalme.oGlobalBusyDialog.open();
			let count = this.open_bcp_incidents();
			this.getView().byId('bcp_count').setText(count);
			main_globalme.oGlobalBusyDialog.close();
		},

		//Close Video Control
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf product_version_detail.main
		 */
		//  onBeforeRendering: function() {
		//
		//
		//  },
		/**
		 * Called case the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf product_version_detail.main
		 */
		onAfterRendering: function () {
				this.beckend_system_status();
				// this.byId("requester").attachBrowserEvent("mouseenter", oCallout);
				// this.byId("requester").attachBrowserEvent("mouseleave", close);
			}
			/**
			 * Called case the Controller is destroyed. Use this one to free resources and finalize activities.
			 * @memberOf product_version_detail.main
			 */

	});
	//

});