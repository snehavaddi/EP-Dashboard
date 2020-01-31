var global_me_basecontroller;
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History"
], function (Controller, History) {
	"use strict";

	return Controller.extend("epdash.epdash.controller.BaseController", {
		/**
		 * Convenience method for accessing the router.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter: function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		/**
		 * Convenience method for getting the view model by name.
		 * @public
		 * @param {string} [sName] the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel: function (sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel: function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Getter for the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		open_bcp_incidents: function () {

			// var settings = {
			// 	"async": true,
			// 	"crossDomain": true,
			// 	"url": "https://support.wdf.sap.corp/sap/bc/devdb/my_saved_search?sap-client=001",
			// 	"method": "GET",
			// 	"headers": {
			// 		"authorization": "Basic STM0NDgxMTpKdW5lQDEyMw==",
			// 		"baisc": "STM0NDgxMTpKdW5lQDEyMw==",
			// 		"host": "webidecp-a315af559.dispatcher.hana.ondemand.com",
			// 		"referer": "https://accounts.sap.com/saml2/idp/sso/accounts.sap.com",
			// 		"cache-control": "no-cache",
			// 		"postman-token": "39e3887e-5da2-af58-c247-6506487dcd1b"
			// 	}
			// }

			// $.ajax(settings).done(function (response) {
			// 	console.log(response);
			// });
			global_me_basecontroller = this;
			global_me_basecontroller.count;
			//	global_me_basecontroller.oGlobalBusyDialog = new sap.m.BusyDialog();
			//	global_me_basecontroller.oGlobalBusyDialog.open();
			let url = "https://support.wdf.sap.corp/sap/bc/devdb/my_saved_search?sap-client=001";
			$.ajax({
					"async": false,
					"crossDomain": true,
					"baisc": "STM0NDgxMTpKdW5lQDEyMw==",
					"url": url,
					"method": "GET",
					"contentType": "application/xml",
					"postman-token": "39e3887e-5da2-af58-c247-6506487dcd1b",
					"headers": {
						'Access-Control-Allow-Origin': '*'
					}
				})
				.done(function (responseData, textStatus, jqXHR) {
					//        global_me_basecontroller.oGlobalBusyDialog.close();
					console.log(responseData);
					let json_response = global_me_basecontroller.xmlToJson(responseData);
					let number_of_saved_search = json_response['asx:abap']['asx:values']["RESULTNODE1"]["_-SID_-SAVED_SEARCH_LINE"];
					if (number_of_saved_search.length !== 0) {
						let bcp_component = number_of_saved_search.filter(c => c.DESCRIPTION['#text'].includes("#ARES_CLOUD_HFG#"));
						global_me_basecontroller.find_ares_dev_component(bcp_component);
					} else {
						sap.m.MessageBox.error('No Saved search found for your user.');
					}
				}).fail(function (responseData, textStatus, jqXHR) {
					//	global_me_basecontroller.oGlobalBusyDialog.close();
					console.log(responseData);
					sap.m.MessageBox.error('Error while getting roles type from BCP System.\nPlease continue with Backend System.');
				});
			//	global_me_basecontroller.oGlobalBusyDialog.close();
			return global_me_basecontroller.count;

		},
		find_ares_dev_component: function (bcp_component) {
			if (bcp_component.length !== 0) {
				let uuid = bcp_component[0].PARAMETER_["#text"];
				global_me_basecontroller.get_OpenIncidents(uuid);
			} else {
				sap.m.MessageBox.error(
					'No Seaved search found for component "DEV-HOTFIX-ARES".\nPlease create one save search and provide name as "#ARES_CLOUD_HFG#".'
				);
			}
		},
		get_OpenIncidents: function (uuid) {
			//	global_me_basecontroller.oGlobalBusyDialog.open();
			global_me_basecontroller = this;
			if (uuid !== "") {
				let url = "https://support.wdf.sap.corp/sap/bc/devdb/saved_search?sap-client=001&search_id=" + uuid;
				$.ajax({
						"async": false,
						"crossDomain": true,
						"url": url,
						"method": "GET",
						"contentType": "application/xml",
						"headers": {
							'Access-Control-Allow-Origin': '*'
						}
					})
					.done(function (responseData, textStatus, jqXHR) {
						let json_response = global_me_basecontroller.xmlToJson(responseData);
						global_me_basecontroller.reponse_all_incidents(json_response["asx:abap"]["asx:values"]["RESULTNODE1"][
							"_-SID_-CN_IF_DEVDB_INC_OUT_S"
						]);
					}).fail(function (responseData, textStatus, jqXHR) {
						console.log(responseData);
						sap.m.MessageBox.error('Error while getting roles type.\nPlease continue with Backend System.');
					});
			} else {
				sap.m.MessageBox.error(
					'No Id found with "#ARES_CLOUD_HFG#" search.'
				);
			}
			//	global_me_basecontroller.oGlobalBusyDialog.close();
		},
		reponse_all_incidents: function (incidents) {
			let array = [];
			if (incidents.length !== 0) {
				for (let i in incidents) {
					let obj = {
						OBJECT_GUID: incidents[i].OBJECT_GUID["#text"],
						OBJECT_ID: incidents[i].OBJECT_ID["#text"],
						DESCRIPTION: incidents[i].DESCRIPTION["#text"],
						PRIORITY_DESCR: incidents[i].PRIORITY_DESCR["#text"],
						PRIORITY_KEY: incidents[i].PRIORITY_KEY["#text"],
						PROCESS_TYPE: incidents[i].PROCESS_TYPE["#text"],
						STATUS_DESCR: incidents[i].STATUS_DESCR["#text"],
						STATUS_KEY: incidents[i].STATUS_KEY["#text"],
						REPORTER_NAME: incidents[i].REPORTER_NAME["#text"],
						REPORTER_ID: incidents[i].REPORTER_ID["#text"],
						PROCESSOR_ID: incidents[i].PROCESSOR_ID["#text"],
						PROCESSOR_NAME: incidents[i].PROCESSOR_NAME["#text"],
						CREATE_DATE: incidents[i].CREATE_DATE["#text"],
						CHANGE_DATE: incidents[i].CHANGE_DATE["#text"],
						URL_MESSAGE: incidents[i].URL_MESSAGE["#text"]
					}
					array.push(obj);
				}
			}
			let p_new = array.filter(c => c.STATUS_KEY === 'E0001');
			let p_inprocess = array.filter(c => c.STATUS_KEY === 'E0002');
			array = p_new.concat(p_inprocess);
			var incident_model = new sap.ui.model.json.JSONModel({
				incidents: array
			});
			if (!this.bcp_incidents) {
				this.bcp_incidents = sap.ui.xmlfragment("epdash.epdash.view.bcp_incidents", this);
			}
			this.bcp_incidents.setModel(incident_model, "incident_model");
			this.bcp_incidents.open();
			global_me_basecontroller.count = array.length;

		},
		close_bcp_dialog: function () {
			this.bcp_incidents.close();
		},
		backtomain: function () {
			var oHistory, sPreviousHash;
			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				//	this.getRouter().navTo("main", {}, true /*no history*/);
			}
		},
		//xml to json parsing********************************
		xmlToJson: function (xml) {
				var global_me_base = this;
				// Create the return object
				var obj = {};

				if (xml.nodeType == 1) { // element
					// do attributes
					if (xml.attributes.length > 0) {
						obj["@attributes"] = {};
						for (var j = 0; j < xml.attributes.length; j++) {
							var attribute = xml.attributes.item(j);
							obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
						}
					}
				} else if (xml.nodeType == 3) { // text
					obj = xml.nodeValue;
				}

				// do children
				if (xml.hasChildNodes()) {
					for (var i = 0; i < xml.childNodes.length; i++) {
						var item = xml.childNodes.item(i);
						var nodeName = item.nodeName;
						if (typeof (obj[nodeName]) == "undefined") {
							obj[nodeName] = this.xmlToJson(item);
						} else {
							if (typeof (obj[nodeName].push) == "undefined") {
								var old = obj[nodeName];
								obj[nodeName] = [];
								obj[nodeName].push(old);
							}
							obj[nodeName].push(this.xmlToJson(item));
						}
					}
				}
				return obj;
			}
			///////////////////////////////////////////////////////////////////////

	});

});