var global_me_hfc_view;
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

	return Controller.extend("epdash.epdash.external_controller.hfc_view", {

		formatter: formatter,

		onInit: function () {
			global_me_hfc_view = this;
			global_me_hfc_view.oGlobalBusyDialog = new sap.m.BusyDialog();

			global_me_hfc_view.oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/BRLT/PRODUCT_CATOGRY_DETAIL_SRV/");
			global_me_hfc_view.oModel_form = new sap.ui.model.odata.ODataModel("/sap/opu/odata/BRLT/PQP_PROJECT_DETAIL_SRV/");
			global_me_hfc_view.oModel_hotliner = new sap.ui.model.odata.ODataModel("/sap/opu/odata/BRLT/HOTLINE_TOOL_SRV/");
			// bind tree with product and product versions
			this._bind_tree_with_product(global_me_hfc_view.oModel);

			global_me_hfc_view.pv_ver_colors = ['#E52B50', '#FFBF00', '#9966CC', '#FBCEB1', '#7FFFD4', '#0095B6', '#DE5D83', '#CD7F32', ,
				'#DE3163', '#7FFF00', '#00FFFF', '#EDC9Af', '#50C878', '#FFD700',
				'#808080', '#008000', '#B57EDC', '#FFF700', '#FF00FF', '#FF00AF', '#E0B0FF', '#FF6600', '#FF4500', '#808000', '#D1E231',
				'#CCCCFF', '#FD6C9E', '#8E4585', '#CC8899', '#E30B5C', '#C71585',
				'#FF007F', '#FA8072', '#C0C0C0', '#FFFF00', '#7F00FF', '#E52B50', '#FFBF00', '#9966CC', '#FBCEB1', '#7FFFD4', '#0095B6',
				'#DE5D83', '#CD7F32', '#DE3163', '#7FFF00', '#00FFFF', '#EDC9Af', '#50C878', '#FFD700',
				'#808080', '#008000', '#B57EDC', '#FFF700', '#FF00FF', '#FF00AF', '#E0B0FF', '#FF6600', '#FF4500', '#808000', '#D1E231',
				'#CCCCFF', '#FD6C9E', '#8E4585', '#CC8899', '#E30B5C', '#C71585',
				'#FF007F', '#FA8072', '#C0C0C0', '#FFFF00', '#7F00FF'
			];

			//control and color visibilty
			var obj = {
				"hfc_btn": "Emphasized",
				"hot_btn": "Default",
				"hol_btn": "Default",
				"content_visiblty": "hfc_view",
				"header_name": "HFC Calendar"
			};
			var oControls = new sap.ui.model.json.JSONModel({
				data: obj
			});
			this.getView().setModel(oControls, 'Controls');
			/////

			///visibilty if frequency
			var oJModel_hot_type = new sap.ui.model.json.JSONModel({
				"frequency": ''
			});
			this.getView().setModel(oJModel_hot_type, "hotliner_type_freq");
			///

			global_me_hfc_view.product_selected = [];
			global_me_hfc_view.product_v_selected = [];
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("hfc_view").attachPatternMatched(this._onRoute_hfc_view, this);

		},
		_onRoute_hfc_view: function (oEvent) {
			let pv_hfc = this.getOwnerComponent().getModel('open_pv_hfc');
			if (pv_hfc !== undefined) {
				if (pv_hfc.getData().switch_on === true) {
					this.hfc_header_dialog.open();
				}
			}
			var show_holiday_calender = oEvent.getParameter("arguments").holiday_flag;
			if (show_holiday_calender === "true") {
				this.new_holiday_cal();
			} else {
				this.hfc_enable();
			}

		},
		back_to_main: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("main");
		},
		//bind product and product version with tree
		_bind_tree_with_product: function (oModel) {
			var product_name = [];
			oModel.read("/ProductSet", {
				success: function (oData) {
					for (var i = 0; i < oData.results.length; i++) {
						product_name.push({
							'ProductName_ver': oData.results[i].ProductName
						});
					}
					/*oProduct_Model.setData({nodes:product_name});
					global_me_hfc_view.getView().setModel(oProduct_Model, 'ProductName');*/
				},
				error: function (err) {

				},
				async: false
			});
			var prod_vers = [];
			oModel.read("/PRODUCT_VERSIONSet", {
				success: function (oData) {
					var oProduct_Model = new sap.ui.model.json.JSONModel();
					for (var i = 0; i < product_name.length; i++) {
						product_name[i].node = [];
						for (var j = 0; j < oData.results.length; j++) {
							if (oData.results[j].ProductName == product_name[i].ProductName_ver) {

								//	prod_vers.push({"ProductName_ver":oData.results[j].ProdVersName});
								prod_vers.push({
									"ProductName": oData.results[j].ProductName,
									"ProductVersName": oData.results[j].ProdVersName
								});
							}
						}
						for (var k = 0; k < prod_vers.length; k++) {
							product_name[i].node.push({
								"ProductName_ver": prod_vers[k].ProductVersName,
								"ProductName": prod_vers[k].ProductName
							});
						}

						prod_vers = [];

					}
					oProduct_Model.setData({
						nodes: product_name
					});
					global_me_hfc_view.getView().setModel(oProduct_Model, 'ProductName');
				},
				error: function (err) {

				},
				async: false
			});
		},

		expand_product: function (oEvent) {
			var aFilterArray = [];
			var list = this.getView().byId('Product_list').getSelectedItems();
			global_me_hfc_view.product_selected = [];

			for (let i in list) {
				let prod_name = list[i].getTitle();
				let oFilter_pr = new sap.ui.model.Filter("ProductName", sap.ui.model.FilterOperator.EQ, prod_name);
				aFilterArray.push(oFilter_pr);
				global_me_hfc_view.product_selected.push(prod_name);
			}
			// var getData = oEvent.getSource().getModel('ProductName').getProperty(oEvent.getSource().getBindingContextPath());
			// var aFilterArray = [];
			// if (getData.node === undefined) {
			// 	var prod_name = oEvent.getSource().getModel('ProductName').getProperty(oEvent.getSource().getBindingContextPath()).ProductName;
			// 	var prod_v_name = oEvent.getSource().getModel('ProductName').getProperty(oEvent.getSource().getBindingContextPath()).ProductName_ver;
			// 	var oFilter_pr = new sap.ui.model.Filter("ProductName", sap.ui.model.FilterOperator.EQ, prod_name);
			// 	var oFilter_pv = new sap.ui.model.Filter("ProdVersName", sap.ui.model.FilterOperator.EQ, prod_v_name);
			// 	aFilterArray.push(oFilter_pr, oFilter_pv);

			// } else {
			// 	var prod_name = oEvent.getSource().getModel('ProductName').getProperty(oEvent.getSource().getBindingContextPath()).ProductName_ver;
			// 	var oFilter_pr = new sap.ui.model.Filter("ProductName", sap.ui.model.FilterOperator.EQ, prod_name);
			// 	aFilterArray.push(oFilter_pr);

			// }

			global_me_hfc_view.oGlobalBusyDialog.open();
			global_me_hfc_view.oModel_form.read("/hfc_scheduleSet", {
				filters: aFilterArray,
				success: function (oData) {
					global_me_hfc_view.product_v_selected = oData.results;
				},
				error: function (err) {},
				async: false
			});

			if (global_me_hfc_view.product_v_selected.length !== 0) {
				//remove legend 
				this.getView().byId("legend_hfc_product").removeAllItems();
				this.getView().byId("legend_hfc_product_version").removeAllItems();

				//remove all div from calendar
				this._remove_all_divs_from_calendar();

				//addind legend to calender
				this._add_legend_to_calender(global_me_hfc_view.product_selected, global_me_hfc_view.product_v_selected);

				//adding multiple colors to calender
				this._add_colors_to_calender(global_me_hfc_view.product_selected, global_me_hfc_view.product_v_selected);
				//add holydays
				if (global_me_hfc_view.getView().byId('holiday_switch').getState() === true) {
					this.add_public_holiday_to_hfc(true);
				}
			} else {
				MessageBox.error('No Data Found!!');
			}
			global_me_hfc_view.oGlobalBusyDialog.close();

		},
		_get_selected_prod_as_variant: function (oModel) {
			var aFilterArray = [];
			var oFilters = new sap.ui.model.Filter("Variant", sap.ui.model.FilterOperator.EQ, '');
			aFilterArray.push(oFilters);
			oModel.read("/var_data_product_nameSet", {
				filters: aFilterArray,
				success: function (oData) {
					global_me_hfc_view.selectedProduct.push(oData.results);
				},
				async: false
			});
			return global_me_hfc_view.selectedProduct;
		},
		_bind_calender_with_hfc_schedule: function (oModel_form, product_selected, product_name, product_v_name) {
			global_me_hfc_view.product = [];
			global_me_hfc_view.pv_version = [];
			oModel_form.read("/hfc_scheduleSet", {
				success: function (oData) {
					var array = oData.results;
					for (var i = 0; i < product_selected[0].length; i++) {
						for (var j = 0; j < array.length; j++) {
							if (array[j].ProductName === product_selected[0][i].Product) {
								global_me_hfc_view.pv_version.push(array[j]);
							}
						}
						global_me_hfc_view.product.push(product_selected[0][i].Product);
					}
				},
				error: function (err) {},
				async: false
			});
			//addind legend to calender
			this._add_legend_to_calender(global_me_hfc_view.product, global_me_hfc_view.pv_version);

			//adding multiple colors to calender
			this._add_colors_to_calender(global_me_hfc_view.product, global_me_hfc_view.pv_version);

		},
		_add_legend_to_calender: function (product, pv_version) {
			var Products = new sap.ui.model.json.JSONModel();
			Products.setData({
				values: product
			});
			this.getView().setModel(Products, "Products");
			var Product_v = new sap.ui.model.json.JSONModel();
			Product_v.setData({
				values: pv_version
			});
			this.getView().setModel(Product_v, "Product_v");
			var pr_legend = this.getView().byId("legend_hfc_product");
			var pv_legend = this.getView().byId("legend_hfc_product_version");
			for (var i = 0; i < product.length; i++) {
				var Item1 = new sap.ui.unified.CalendarLegendItem({
					text: product[i]
				});
				pr_legend.addItem(Item1);
			}
			for (var i = 0; i < pv_version.length; i++) {
				var Item2 = new sap.ui.unified.CalendarLegendItem({
					text: pv_version[i].ProdVersName + ' ' + parseFloat(pv_version[i].SpsIntern),
					color: global_me_hfc_view.pv_ver_colors[i]
				});
				pv_legend.addItem(Item2);
			}

		},
		_add_colors_to_calender: function (product, pv_version) {

			var divs = $('.sapMeCalendarMonthDays').children();
			for (var i = 0; i < divs.length; i++) {
				var d = divs[i].children[1].value;
				var convert_date = this._convert_date(d);
				var filter_pv_version = pv_version.filter(c => c.Cutoffdatestart === convert_date);
				var classes = $(divs[i]).attr('class');
				var color;
				if (filter_pv_version.length > 0) {
					for (var j = 0; j < filter_pv_version.length; j++) {
						color = global_me_hfc_view.pv_ver_colors[pv_version.indexOf(filter_pv_version[j])];
						$(divs[i]).append(
							'<div style="background-color:' + color + ';height:18px;margin-bottom:2px;font-weight:bold;font-size:10px;overflow: hidden;">' +
							filter_pv_version[j].ProdVersName + ' ' + parseFloat(filter_pv_version[j].SpsIntern) + '</div>'
						);
					}
				}

			}

		},
		add_public_holiday_to_hfc: function (oEvent) {
			if (oEvent === true || oEvent.getSource().getState() === true) {
				global_me_hfc_view.oModel.read("/holiday_calenderSet", {
					success: function (oData) {
						var divs = $('.sapMeCalendarMonthDays').children();
						for (var i = 0; i < divs.length; i++) {
							var d = divs[i].children[1].value;
							var convert_date = global_me_hfc_view._convert_date(d);
							var final_date = new Date(d.substring(0, 4) + "." + d.substring(4, 6) + "." + d.substring(6,
								8));
							final_date.setHours(0, [1], [1]);
							var filter_vacation = oData.results.filter(c => c.DateFrom === convert_date);
							global_me_hfc_view.holyday_list = oData.results;
							var classes = $(divs[i]).attr('class');
							if (filter_vacation.length > 0) {
								for (var j = 0; j < filter_vacation.length; j++) {
									//color = global_me_hfc_view.pv_ver_colors[pv_version.indexOf(filter_vacation[j])];
									$(divs[i]).append(
										'<div style="background-color:#4C4CFF;height:18px;margin-bottom:2px;font-weight:bold;font-size:8px;overflow: hidden;color:white ;border-radius: 10px;">' +
										filter_vacation[j].Title + '-' + filter_vacation[j].HolidayText + '</div>'
									);
								}
							}

						}

					},
					error: function (err) {

					},
					async: false
				});
			} else {
				this._remove_public_holiday_to_hfc();
			}

		},
		_remove_all_divs_from_calendar: function () {
			var divs = $('.sapMeCalendarMonthDays').children();
			var length;
			for (var i = 0; i < divs.length; i++) {
				length = $(divs[i]).children().length;
				for (var j = 0; j < $(divs[i]).children().length; j++) {
					if ($(divs[i]).children()[j].outerHTML.includes('div') === true) {
						$(divs[i]).children()[j].remove();
						j = j - 1;
					};
				}

			}
		},
		_remove_public_holiday_to_hfc: function () {
			var divs = $('.sapMeCalendarMonthDays').children();
			var length;
			for (var i = 0; i < divs.length; i++) {
				length = $(divs[i]).children().length;
				for (var j = 0; j < $(divs[i]).children().length; j++) {
					if ($(divs[i]).children()[j].outerHTML.includes('#4C4CFF') === true) {
						$(divs[i]).children()[j].remove();
						j = j - 1;
					};
				}

			}
		},
		_convert_date: function (d) {
			var d_c = new Date(d);
			var month = '' + (d_c.getMonth() + 1);
			var day = '' + d_c.getDate();
			var year = d_c.getFullYear();

			if (month.length < 2) month = '0' + month;
			if (day.length < 2) day = '0' + day;

			return year + month + day;
		},

		onTapOnDate: function (oEvent) {
			var get_date = this._convert_date(oEvent.getParameters().date);
			if (global_me_hfc_view.product_v_selected.length !== 0) {
				var filter_pv_version = global_me_hfc_view.product_v_selected.filter(c => c.Cutoffdatestart === get_date);
			} else {
				var filter_pv_version = global_me_hfc_view.pv_version.filter(c => c.Cutoffdatestart === get_date);
			}

			var final_date = get_date.slice(0, 4) + "-" + get_date.slice(4, 6) + "-" + get_date.slice(6, 8) +
				"T00:00:00";
			var filter_vacation = global_me_hfc_view.holyday_list.filter(c => c.DateFrom === get_date);
			if (!this.hfc_header_dialog) {
				this.hfc_header_dialog = sap.ui.xmlfragment("epdash.epdash.external_view.pv_hfc_detail", this);
			}
			var oModel_hfc = new sap.ui.model.json.JSONModel({
				"visible": false
			});
			this.hfc_header_dialog.setModel(oModel_hfc, "hfc_header");

			var oModel_holiday = new sap.ui.model.json.JSONModel({
				"visible": false
			});
			this.hfc_header_dialog.setModel(oModel_holiday, "holydays");
			if (filter_pv_version.length > 0 || filter_vacation.length > 0) {
				if (filter_pv_version.length > 0) {
					//hfc cuttoff
					oModel_hfc.setData({
						"hfc_header_data": filter_pv_version,
						"visible": true
					});

				}
				if (filter_vacation.length > 0) {
					oModel_holiday.setData({
						"holyday_list": filter_vacation,
						"visible": true
					});

				}
				this.hfc_header_dialog.open();
			} else {
				MessageToast.show('No Value Found!!');
			}

		},

		onNextMonth: function (oEvent) {
			var calender = this.getView().byId('calendar');
			if (global_me_hfc_view.product_selected.length !== 0 && global_me_hfc_view.product_v_selected.length !== 0) {
				calender.onAfterRendering = function (oEvent) {
					global_me_hfc_view._add_colors_to_calender(global_me_hfc_view.product_selected, global_me_hfc_view.product_v_selected);
					if (global_me_hfc_view.getView().byId('holiday_switch').getState() === true) {
						global_me_hfc_view.add_public_holiday_to_hfc(true);
					}
				}
			} else {
				calender.onAfterRendering = function (oEvent) {
					global_me_hfc_view._add_colors_to_calender(global_me_hfc_view.product, global_me_hfc_view.pv_version);
					if (global_me_hfc_view.getView().byId('holiday_switch').getState() === true) {
						global_me_hfc_view.add_public_holiday_to_hfc(true);
					}
				}
			}

		},
		close_hfc_header_dialog: function () {
			let pv_hfc = this.getOwnerComponent().getModel('open_pv_hfc');
			if (pv_hfc !== undefined) {
				pv_hfc.getData().switch_on = false
				this.getOwnerComponent().getModel('open_pv_hfc').refresh(true);
			}

			this.hfc_header_dialog.close();
		},
		hfc_enable: function () {
			var obj = {
				"hfc_btn": "Emphasized",
				"hot_btn": "Default",
				"hol_btn": "Default",
				"content_visiblty": "hfc_view",
				"header_name": "HFC Calendar"
			};
			this.getView().getModel('Controls').setData({
				data: obj
			});
			this.getView().getModel('Controls').refresh(true);
			this.onNextMonth();
		},

		// holiday_enable: function () {
		// 	var obj = {
		// 		"hfc_btn": "Default",
		// 		"hot_btn": "Emphasized",
		// 		"hol_btn": "Default",
		// 		"content_visiblty": "hol_view",
		// 		"header_name": "Holyday Calendar"
		// 	};
		// 	this.getView().getModel('Controls').setData({
		// 		data: obj
		// 	});
		// 	this.getView().getModel('Controls').refresh(true);
		// 	var that = this;
		// 	var oJModel = new sap.ui.model.json.JSONModel();

		// 	oJModel.setData({
		// 		startDate: new Date(),
		// 		people: [{
		// 				pic: "",
		// 				name: "",
		// 				appointments: [

		// 				]
		// 			}

		// 		]
		// 	});
		// 	global_me_hfc_view.oGlobalBusyDialog.open();
		// 	global_me_hfc_view.oModel.read("/holiday_calenderSet", {
		// 		success: function (oData) {
		// 			for (var i = 0; i < oData.results.length; i++) {
		// 				var eDate = new Date(oData.results[i].DateTo).setHours(23);
		// 				eDate = new Date(oData.results[i].DateTo).setMinutes(59);
		// 				var sData = {
		// 					"start": new Date(oData.results[i].DateFrom),
		// 					"end": new Date(oData.results[i].DateTo),
		// 					"title": oData.results[i].Title,
		// 					"info": oData.results[i].HolidayText,
		// 					"pic": oData.results[i].Pic,
		// 					"type": oData.results[i].Type,
		// 					"tentative": false
		// 				}
		// 				oJModel.oData.people[0].appointments.push(sData);
		// 			}
		// 			if (!that._oholiday_win) {
		// 				that._oholiday_win = sap.ui.xmlfragment("epdash.epdash.view.holiday_plan", that);
		// 				that.getView().addDependent(that._oholiday_win);
		// 			}
		// 			// toggle compact style
		// 			sap.ui.getCore().byId("PC1").setModel(oJModel);
		// 			that.getView().byId('Holiday_Panel').addContent(that._oholiday_win);
		// 			global_me_hfc_view.oGlobalBusyDialog.close();
		// 		}

		// 	});

		// },
		new_holiday_cal: function () {
			var obj = {
				"hfc_btn": "Default",
				"hot_btn": "Default",
				"hol_btn": "Default",
				"namrata_btn": "Emphasized",
				"content_visiblty": "hol_view",
				"header_name": "Holiday Calendar"
			};
			this.getView().getModel('Controls').setData({
				data: obj
			});
			this.getView().getModel('Controls').refresh(true);

			var t = this;
			var oJModel = new sap.ui.model.json.JSONModel();
			var myData = {
				startDate: new Date(),
				people: [{
						pic: "",
						name: "",
						appointments: [

						]
					}

				]
			};

			global_me_hfc_view.oGlobalBusyDialog.open();

			global_me_hfc_view.oModel.read("/holiday_calenderSet", {
				success: function (oData) {
					for (var i = 0; i < oData.results.length; i++) {
						var d = oData.results[i];
						var sDate = new Date(d.DateFrom.substring(0, 4), (d.DateFrom.substring(4, 6) - 1).toString(),
							d.DateFrom.substring(6, 8));
						sDate.setHours(0, [1], [1]);
						var eDate = new Date(d.DateTo.substring(0, 4), (d.DateTo.substring(4, 6) - 1).toString(),
							d.DateTo.substring(6, 8));
						eDate.setHours(23, [59], [59]);

						var sData = {
							"start": sDate,
							"end": eDate,
							"title": oData.results[i].Title,
							"info": oData.results[i].HolidayText,
							"pic": oData.results[i].Pic,
							"type": oData.results[i].Type,
							"tentative": false
						}
						if (i == 0) {
							myData.startDate = sDate;
						}
						myData.people[0].appointments.push(sData);
					}
					if (!t.holiday_frag) {
						t.holiday_frag = sap.ui.xmlfragment("epdash.epdash.external_view.new_holiday"),
							t.getView().addDependent(t.holiday_frag);
					}
					oJModel.setData(myData);
					sap.ui.getCore().byId("HC").setModel(oJModel);
					t.getView().byId('Holiday_Panel').addContent(t.holiday_frag);
					global_me_hfc_view.oGlobalBusyDialog.close();
				}
			});

		},
		hotliner_enable: function () {
			var obj = {
				"hfc_btn": "Default",
				"hot_btn": "Default",
				"hol_btn": "Emphasized",
				"content_visiblty": "hot_view",
				"header_name": "Hotliner Calendar"
			};
			this.getView().getModel('Controls').setData({
				data: obj
			});
			this.getView().getModel('Controls').refresh(true);
			global_me_hfc_view.oModel_hotliner.read("/UserHotlinesSet", {
				success: function (oData) {
					let object = {
						Frequency: "5",
						HotlineNum: "HFC",
						HotlineTxt: "HFC Hotliner",
						Priority: "0"
					};
					oData.results.push(object);
					var oHot_l_Model = new sap.ui.model.json.JSONModel({
						hotliner_type: oData.results
					});
					global_me_hfc_view.getView().setModel(oHot_l_Model, 'hotliner_type');
				},
				error: function () {

				},
				async: false
			});
			this._get_User_details();
		},
		_get_User_details: function () {
			global_me_hfc_view.oModel_hotliner.read("/UserDetailsSet", {
				success: function (oData) {
					var oUserDetail_Model = new sap.ui.model.json.JSONModel(oData.results);
					global_me_hfc_view.getView().setModel(oUserDetail_Model, 'UserDetail');
				},
				error: function () {

				},
				async: false
			});
		},
		On_Change_hotliner_Type: function (oEvent) {
			var Frequency = oEvent.getSource().getModel('hotliner_type').getProperty(oEvent.getSource().getSelectedItem().oBindingContexts.hotliner_type
				.sPath).Frequency;
			this.getView().getModel('hotliner_type_freq').setData({
				"frequency": Frequency
			});

		},
		refreshAssignments: function () {
			var Frequency = this.getView().getModel('hotliner_type_freq').getData().frequency;
			var hotline_num = this.getView().byId('hotline_num').getSelectedKey();
			var quarter = this.getView().byId('__input0').getSelectedKey();
			var month = this.getView().byId('__input1').getSelectedKey();
			var year = this.getView().byId('step_year').getValue().toString();
			switch (Frequency) {
			case '0':
				var entityset = '/HotlinerSet';
				this._fill_hotliner_in_calandar_quarter(hotline_num, quarter, year, entityset);
				break;
			case '1':
				break;
			case '2':
				break;
			case '3':
				var entityset = '/HotlinerSet';
				this._fill_hotliner_in_calandar_quarter(hotline_num, quarter, year, entityset);
				break;
			case '4':
				var entityset = '/DailyHotlinerSet';
				this._fill_hotliner_in_calandar_daily(hotline_num, quarter, year, entityset);
				break;
			case '5':
				var entityset = '';
				if (hotline_num === 'HFC') {
					entityset = '/HfcHotlinerSet';
					this._fill_hotliner_in_calandar_for_hfc(hotline_num, month, year, entityset);
				} else {
					entityset = '/MonthlyHotlinerSet';
					this._fill_hotliner_in_calandar_daily(hotline_num, month, year, entityset);
				}

				break;
			default:
				MessageToast.show('Please select hotliner type!!');
				break;
			}
		},
		_fill_hotliner_in_calandar_daily: function (hotline_num, frequency_time, year, entityset) {
			this.getView().byId('PC2').setVisible(true);
			var oJModel_hot = new sap.ui.model.json.JSONModel();
			oJModel_hot.setData(null);
			if (this.getView().byId('PC2').getModel() !== undefined) {
				this.getView().byId('PC2').getModel().setData(null);
				this.getView().byId('PC2').getModel().refresh(true);
			}

			oJModel_hot.setData({
				startDate: new Date(),
				people: [{
						pic: "{imageModel>/path}/India.png",
						name: "BANGALORE ",
						role: "Hotliners",
						appointments: [

						]
					}, {
						pic: "{imageModel>/path}/India.png",
						name: "BANGALORE",
						role: "Backup Hotliners",
						appointments: [

						]
					}, {
						pic: "{imageModel>/path}/german.png",
						name: "GERMANY",
						role: "Hotliners",
						appointments: [

						]
					}, {
						pic: "{imageModel>/path}/german.png",
						name: "GERMANY",
						role: "Backup Hotliners",
						appointments: [

						]
					}, {
						pic: "{imageModel>/path}/canada.png",
						name: "CANADA",
						role: "Hotliners",
						appointments: [

						]
					}, {
						pic: "{imageModel>/path}/canada.png",
						name: "CANADA",
						role: "Backup Hotliners",
						appointments: [

						]
					}

				]

			});
			var aFilter = [];
			var hotline_num_filter = new sap.ui.model.Filter("HotlineNum", sap.ui.model.FilterOperator.EQ, hotline_num);
			var quarter_filter = new sap.ui.model.Filter("CalendarWeek", sap.ui.model.FilterOperator.EQ, frequency_time);
			var year_filter = new sap.ui.model.Filter("CalYear", sap.ui.model.FilterOperator.EQ, year);
			aFilter.push(hotline_num_filter,
				quarter_filter, year_filter);
			global_me_hfc_view.oGlobalBusyDialog.open();
			global_me_hfc_view.oModel_hotliner.read(entityset, {
				filters: aFilter,
				success: function (oData) {
					for (var i = 0; i < oData.results.length; i++) {
						var sDate = new Date(oData.results[i].Date.substring(0, 4), (oData.results[i].Date.substring(4, 6) - 1).toString(), oData.results[
							i].Date.substring(6, 8))
						var eDate = new Date(oData.results[i].Date.substring(0, 4), (oData.results[i].Date.substring(4, 6) - 1).toString(), sDate.getDate() +
							1);
						if (oData.results[i].PrimaryName !== '') {
							var sData_in_pri = global_me_hfc_view._arrange_in_array(sDate, eDate, oData.results[i].PrimaryName, oData.results[i].HlPrimary,
								"Type07");
							oJModel_hot.oData.people[0].appointments.push(sData_in_pri);
						}
						if (oData.results[i].BackupName !== '') {
							var sData_in_back = global_me_hfc_view._arrange_in_array(sDate, eDate, oData.results[i].BackupName, oData.results[i].HlBackup,
								"Type01");
							oJModel_hot.oData.people[1].appointments.push(sData_in_back);
						}
						if (oData.results[i].PrimaryName_DE !== '') {
							var sData_de_pri = global_me_hfc_view._arrange_in_array(sDate, eDate, oData.results[i].PrimaryName_DE, oData.results[i].HlPrimary_DE,
								"Type07");
							oJModel_hot.oData.people[2].appointments.push(sData_de_pri);
						}
						if (oData.results[i].BackupName_DE !== '') {
							var sData_de_back = global_me_hfc_view._arrange_in_array(sDate, eDate, oData.results[i].BackupName_DE, oData.results[i].HlBackup_DE,
								"Type01");
							oJModel_hot.oData.people[3].appointments.push(sData_de_back);
						}
						if (oData.results[i].PrimaryName_CA !== '') {
							var sData_can_pri = global_me_hfc_view._arrange_in_array(sDate, eDate, oData.results[i].PrimaryName_CA, oData.results[i].HlPrimary_CA,
								"Type07");
							oJModel_hot.oData.people[4].appointments.push(sData_can_pri);
						}
						if (oData.results[i].BackupName_CA !== '') {
							var sData_can_back = global_me_hfc_view._arrange_in_array(sDate, eDate, oData.results[i].BackupName_CA, oData.results[i].HlBackup_CA,
								"Type01");
							oJModel_hot.oData.people[5].appointments.push(sData_can_back);
						}

					}
					global_me_hfc_view.getView().byId("PC2").setModel(oJModel_hot);
					global_me_hfc_view.oGlobalBusyDialog.close();
				}

			});

		},

		_fill_hotliner_in_calandar_quarter: function (hotline_num, frequency_time, year, entityset) {
			this.getView().byId('PC2').setVisible(true);
			var oJModel_hot = new sap.ui.model.json.JSONModel();
			oJModel_hot.setData(null);
			if (this.getView().byId('PC2').getModel() !== undefined) {
				this.getView().byId('PC2').getModel().setData(null);
				this.getView().byId('PC2').getModel().refresh(true);
			}

			oJModel_hot.setData({
				startDate: new Date(),
				people: [{
						pic: "{imageModel>/path}/India.png",
						name: "BANGALORE ",
						role: "Hotliners",
						appointments: [

						]
					}, {
						pic: "{imageModel>/path}/India.png",
						name: "BANGALORE",
						role: "Backup Hotliners",
						appointments: [

						]
					}, {
						pic: "{imageModel>/path}/german.png",
						name: "GERMANY",
						role: "Hotliners",
						appointments: [

						]
					}, {
						pic: "{imageModel>/path}/german.png",
						name: "GERMANY",
						role: "Backup Hotliners",
						appointments: [

						]
					}

				]

			});
			var aFilter = [];
			var hotline_num_filter = new sap.ui.model.Filter("HotlineNum", sap.ui.model.FilterOperator.EQ, hotline_num);
			var quarter_filter = new sap.ui.model.Filter("CalendarWeek", sap.ui.model.FilterOperator.EQ, frequency_time);
			var year_filter = new sap.ui.model.Filter("CalYear", sap.ui.model.FilterOperator.EQ, year);
			aFilter.push(hotline_num_filter,
				quarter_filter, year_filter);
			global_me_hfc_view.oGlobalBusyDialog.open();
			global_me_hfc_view.oModel_hotliner.read(entityset, {
				filters: aFilter,
				success: function (oData) {
					for (var i = 0; i < oData.results.length; i++) {
						var sDate = new Date(oData.results[i].FromDate.substring(0, 4), (oData.results[i].FromDate.substring(4, 6) - 1).toString(),
							oData.results[
								i].FromDate.substring(6, 8));
						var eDate = new Date(oData.results[i].ToDate.substring(0, 4), (oData.results[i].ToDate.substring(4, 6) - 1).toString(),
							oData
							.results[
								i].ToDate.substring(6, 8), '23', '59', '59');
						if (oData.results[i].PrimaryName !== '') {
							var sData_in_pri = global_me_hfc_view._arrange_in_array(sDate, eDate, oData.results[i].PrimaryName, oData.results[i].HlPrimary,
								"Type07");
							oJModel_hot.oData.people[0].appointments.push(sData_in_pri);
						}
						if (oData.results[i].BackupName !== '') {
							var sData_in_back = global_me_hfc_view._arrange_in_array(sDate, eDate, oData.results[i].BackupName, oData.results[i].HlBackup,
								"Type01");
							oJModel_hot.oData.people[1].appointments.push(sData_in_back);
						}
						if (oData.results[i].PrimaryName_DE !== '') {
							var sData_de_pri = global_me_hfc_view._arrange_in_array(sDate, eDate, oData.results[i].PrimaryName_DE, oData.results[i].HlPrimary_DE,
								"Type07");
							oJModel_hot.oData.people[2].appointments.push(sData_de_pri);
						}
						if (oData.results[i].BackupName_DE !== '') {
							var sData_de_back = global_me_hfc_view._arrange_in_array(sDate, eDate, oData.results[i].BackupName_DE, oData.results[i].HlBackup_DE,
								"Type01");
							oJModel_hot.oData.people[3].appointments.push(sData_de_back);
						}

					}
					global_me_hfc_view.getView().byId("PC2").setModel(oJModel_hot);
					global_me_hfc_view.oGlobalBusyDialog.close();
				}

			});

		},
		_fill_hotliner_in_calandar_for_hfc: function (hotline_num, month, year, entityset) {
			this.getView().byId('PC2').setVisible(true);
			var oJModel_hot = new sap.ui.model.json.JSONModel();
			oJModel_hot.setData(null);
			if (this.getView().byId('PC2').getModel() !== undefined) {
				this.getView().byId('PC2').getModel().setData(null);
				this.getView().byId('PC2').getModel().refresh(true);
			}

			oJModel_hot.setData({
				startDate: new Date(),
				people: [{
						pic: "{imageModel>/path}/India.png",
						name: "BANGALORE ",
						role: "Hotliners",
						appointments: [

						]
					}, {
						pic: "{imageModel>/path}/India.png",
						name: "BANGALORE",
						role: "Backup Hotliners",
						appointments: [

						]
					}, {
						pic: "{imageModel>/path}/german.png",
						name: "GERMANY",
						role: "Hotliners",
						appointments: [

						]
					}, {
						pic: "{imageModel>/path}/german.png",
						name: "GERMANY",
						role: "Backup Hotliners",
						appointments: [

						]
					}, {
						pic: "{imageModel>/path}/canada.png",
						name: "CANADA",
						role: "Hotliners",
						appointments: [

						]
					}, {
						pic: "{imageModel>/path}/canada.png",
						name: "CANADA",
						role: "Backup Hotliners",
						appointments: [

						]
					}

				]

			});
			var aFilter = [];
			var Month = new sap.ui.model.Filter("Month", sap.ui.model.FilterOperator.EQ, month);
			var Year = new sap.ui.model.Filter("Year", sap.ui.model.FilterOperator.EQ, year);
			aFilter.push(Month, Year);
			global_me_hfc_view.oGlobalBusyDialog.open();
			global_me_hfc_view.oModel_hotliner.read(entityset, {
				filters: aFilter,
				success: function (oData) {
					for (var i = 0; i < oData.results.length; i++) {
						var sDate = new Date(oData.results[i].FromDate.substring(0, 4), (oData.results[i].FromDate.substring(4, 6) - 1).toString(),
							oData.results[
								i].FromDate.substring(6, 8));
						var eDate = new Date(oData.results[i].ToDate.substring(0, 4), (oData.results[i].ToDate.substring(4, 6) - 1).toString(),
							oData
							.results[
								i].ToDate.substring(6, 8), '23', '59', '59');
						if (oData.results[i].InPrimary !== '') {
							var sData_in_pri = global_me_hfc_view._arrange_in_array(sDate, eDate, oData.results[i].TaskName,
								oData.results[i].InPrimary, "Type07");
							oJModel_hot.oData.people[0].appointments.push(sData_in_pri);
						}
						if (oData.results[i].InBackup !== '') {
							var sData_in_back = global_me_hfc_view._arrange_in_array(sDate, eDate, oData.results[i].TaskName,
								oData.results[i].InBackup, "Type01");
							oJModel_hot.oData.people[1].appointments.push(sData_in_back);
						}
						if (oData.results[i].DePrimary !== '') {
							var sData_de_pri = global_me_hfc_view._arrange_in_array(sDate, eDate, oData.results[i].TaskName,
								oData.results[i].DePrimary, "Type07");
							oJModel_hot.oData.people[2].appointments.push(sData_de_pri);
						}
						if (oData.results[i].DeBackup !== '') {
							var sData_de_back = global_me_hfc_view._arrange_in_array(sDate, eDate, oData.results[i].TaskName,
								oData.results[i].DeBackup, "Type01");
							oJModel_hot.oData.people[3].appointments.push(sData_de_back);
						}
						if (oData.results[i].CaPrimary !== '') {
							var sData_ca_pri = global_me_hfc_view._arrange_in_array(sDate, eDate, oData.results[i].TaskName,
								oData.results[i].CaPrimary, "Type07");
							oJModel_hot.oData.people[4].appointments.push(sData_ca_pri);
						}
						if (oData.results[i].CaBackup !== '') {
							var sData_ca_back = global_me_hfc_view._arrange_in_array(sDate, eDate, oData.results[i].TaskName,
								oData.results[i].CaBackup, "Type01");
							oJModel_hot.oData.people[5].appointments.push(sData_ca_back);
						}

					}
					global_me_hfc_view.getView().byId("PC2").setModel(oJModel_hot);
					global_me_hfc_view.oGlobalBusyDialog.close();
				}

			});

		},

		handleAppointmentSelect: function (oEvent) {
			var property = oEvent.getParameters().appointment.mProperties;
			var aFilter = [];
			var email_id;
			var filter = new sap.ui.model.Filter("Bname", sap.ui.model.FilterOperator.EQ, property.text);
			aFilter.push(filter);
			global_me_hfc_view.oGlobalBusyDialog.open();
			global_me_hfc_view.oModel.read('/usernameSet', {
				filters: aFilter,
				success: function (oData) {
					if (oData.results.length !== 0) {
						email_id = oData.results[0].SmtpMail;
					}
					global_me_hfc_view.oGlobalBusyDialog.close();
				},
				error: function (err) {
					global_me_hfc_view.oGlobalBusyDialog.close();
				},
				async: false
			});

			this.hotliner_dialog = new sap.m.Dialog({
				title: 'Connect to Hotliner',
				contentWidth: "auto",
				contentHeight: "auto",
				resizable: true,
				content: [
					new sap.m.Button({
						text: 'Mail to ' + property.title,
						type: "Emphasized",
						width: '100%',
						icon: 'sap-icon://email',
						press: function () {
							sap.m.URLHelper.triggerEmail(email_id, "Info", "Dear " + property.title + ",");
						}.bind(this)
					}),
					new sap.m.Button({
						text: 'Chat with ' + property.title,
						type: "Emphasized",
						width: '100%',
						icon: 'sap-icon://message-popup',
						press: function () {
							window.location = "sip:" + email_id;
						}.bind(this)
					})
				],
				beginButton: new sap.m.Button({
					text: 'Close',
					press: function () {
						this.hotliner_dialog.close();
						this.hotliner_dialog.destroy();
					}.bind(this)
				})
			});

			//to get access to the global model
			this.getView().addDependent(this.hotliner_dialog);

			this.hotliner_dialog.open();
		},

		_arrange_in_array: function (sDate, eDate, name, us_id, type) {
			var sData = {
				"start": sDate,
				"end": eDate,
				"title": name,
				"info": us_id,
				"type": type,
				"tentative": false
			};

			return sData;

		},
		comment_on_hfc: function (oEvent) {
			var property = oEvent.getSource().getParent().getBindingContext('hfc_header').getProperty(oEvent.getSource().getParent()
				.getBindingContext('hfc_header').sPath);
			var oModel_hfc_c_model = new sap.ui.model.json.JSONModel({
				data: property
			});
			global_me_hfc_view.cmnt_button_text = oEvent.getSource();
			var Comment_Type = '5';
			var product_name = new sap.ui.model.Filter("ProductName", sap.ui.model.FilterOperator.EQ, property.ProductName);
			var product_v_intern = new sap.ui.model.Filter("ProdVersIntern", sap.ui.model.FilterOperator.EQ, property.ProdVersIntern);
			var sps_intern = new sap.ui.model.Filter("SpsIntern", sap.ui.model.FilterOperator.EQ, property.SpsIntern);
			var oFilters = [product_name, product_v_intern, sps_intern];
			var that = this;
			global_me_hfc_view.oGlobalBusyDialog.open();
			global_me_hfc_view.oModel_form.read("/hfc_commentsSet", {
				filters: oFilters,
				success: function (oData) {
					if (oData.results.length !== 0) {
						var hfc_comment = [];
						hfc_comment.push(oData.results);
					}
					var hfc_comment_model = new sap.ui.model.json.JSONModel();
					hfc_comment_model.setData({
						hfc_comments: hfc_comment
					});

					if (!that.comment_on_hfc_dia) {
						that.comment_on_hfc_dia = sap.ui.xmlfragment("epdash.epdash.external_view.comments_on_hfc", that);
						that.getView().addDependent(that.comment_on_hfc_dia);
						//  this._oPopover.bindElement("/ProductCollection/0");
					}
					that.comment_on_hfc_dia.setModel(oModel_hfc_c_model, 'hfc_c_model');
					that.comment_on_hfc_dia.setModel(hfc_comment_model, 'hfc_comment');
					that.comment_on_hfc_dia.open();
					global_me_hfc_view.oGlobalBusyDialog.close();

				},
				error: function (err) {
					global_me_hfc_view.oGlobalBusyDialog.open();
				},
				async: false
			});
		},
		save_comment_for_an_hfc: function (oEvent) {
			var Action_Type = '5';
			if (sap.ui.getCore().byId('hfc_comment').getValue() === '') {
				sap.m.MessageBox.error('Please add some comment!!');
			} else {
				var oParameter = {
					"ProductName": this.comment_on_hfc_dia.getModel('hfc_c_model').getData().data.ProductName,
					"ProdVersIntern": this.comment_on_hfc_dia.getModel('hfc_c_model').getData().data.ProdVersIntern,
					"SpsIntern": this.comment_on_hfc_dia.getModel('hfc_c_model').getData().data.SpsIntern,
					"Comments": sap.ui.getCore().byId('hfc_comment').getValue(),
					"CommentType": Action_Type
				};
				global_me_hfc_view.oModel_form.create("/hfc_commentsSet", oParameter);
				MessageToast.show("Comment has been saved");
				global_me_hfc_view.cmnt_button_text.setText((parseInt(global_me_hfc_view.cmnt_button_text.getText()) + 1).toString());
				this.comment_on_hfc_dia.close();
				sap.ui.getCore().byId('hfc_comment').setValue('');
				//	this.comment_on_hfc_dia.getModel('hfc_c_model').getData().data.CommentsNumber = (parseFloat(this.comment_on_hfc_dia.getModel('hfc_c_model').getData().data.CommentsNumber)+1).toString();
				//	this.comment_on_hfc_dia.getModel('hfc_c_model').refresh(true);
				global_me_hfc_view.oGlobalBusyDialog.open();
				if (global_me_hfc_view.product_selected.length !== 0) {
					this._rearrange_calander_data();
				} else {
					//remove legend 
					this.getView().byId("legend_hfc_product").removeAllItems();
					this.getView().byId("legend_hfc_product_version").removeAllItems();

					//remove all div from calendar
					this._remove_all_divs_from_calendar();
					this._bind_calandar();
				}

				global_me_hfc_view.oGlobalBusyDialog.close();
			}

		},
		_rearrange_calander_data: function () {
			//remove legend 
			this.getView().byId("legend_hfc_product").removeAllItems();
			this.getView().byId("legend_hfc_product_version").removeAllItems();

			//remove all div from calendar
			this._remove_all_divs_from_calendar();

			//addind legend to calender
			this._add_legend_to_calender(global_me_hfc_view.product_selected, global_me_hfc_view.product_v_selected);

			//adding multiple colors to calender
			this._add_colors_to_calender(global_me_hfc_view.product_selected, global_me_hfc_view.product_v_selected);
			//add holydays
			if (global_me_hfc_view.getView().byId('holiday_switch').getState() === true) {
				this.add_public_holiday_to_hfc(true);
			}
		},
		close_codeline_comment_hfc: function () {
			this.comment_on_hfc_dia.close();
		},
		enable_reminders: function (oEvent, parameter) {
			var property = oEvent.getSource().getParent().getBindingContext('hfc_header').getProperty(oEvent.getSource().getParent()
				.getBindingContext('hfc_header').sPath);
			var oModel_hfc_c_model = new sap.ui.model.json.JSONModel({
				data: property
			});
			sap.ui.getCore().setModel(oModel_hfc_c_model, 'hfc_reminder_header_model');
			var oRouter = sap.ui.core.UIComponent.getRouterFor(global_me_hfc_view);
			global_me_hfc_view.oGlobalBusyDialog.open();
			global_me_hfc_view.oModel_form.read("/get_hf_pc_for_spsSet(ProductName='" + property.ProductName + "',SpsName='" + property.SpsName +
				"')", {
					success: function (oData) {
						if (oData.hfg_member === "true") {
							var oModel_patch_data = new sap.ui.model.json.JSONModel({
								patch: oData
							});
							sap.ui.getCore().setModel(oModel_patch_data, 'patch_data');
							global_me_hfc_view.oGlobalBusyDialog.close();
							oRouter.navTo("hfc_reminder", {
								page: parameter
							});
						} else {
							global_me_hfc_view.oGlobalBusyDialog.close();
							var bCompact = !!global_me_hfc_view.getView().$().closest(".sapUiSizeCompact").length;
							MessageBox.error(
								"Not Authorized.\nYou are not member of \"Hotfix Governanace Team\"!!.", {
									styleClass: bCompact ? "sapUiSizeCompact" : ""
								}
							);
						}
					},
					error: function (err) {
						MessageBox.error(
							"Error.\n Please drop mail to crossponding DL."

						);
						global_me_hfc_view.oGlobalBusyDialog.close();
					},
					async: false
				});

		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf fun.v1
		 */
		//  onBeforeRendering: function() {
		//
		//  },

		onAfterRendering: function () {
			this._bind_calandar();
		},

		_bind_calandar: function () {
			//***********************************************//			
			//get selected variants 
			global_me_hfc_view.selectedProduct = [];
			var product_selected = this._get_selected_prod_as_variant(global_me_hfc_view.oModel);
			//bind calanar with hfc data
			this._bind_calender_with_hfc_schedule(global_me_hfc_view.oModel_form, product_selected);
			//**************************************************//
			//enable holidays
			this.add_public_holiday_to_hfc(true);
			//
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