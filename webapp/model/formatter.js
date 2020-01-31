sap.ui.define([], function () {
	"use strict";
	return {
		statusText: function (HeaderStatus) {
			switch (HeaderStatus) {
			case "70":
				return "New";
			case "72":
				return "In Risk Mitigation";
			case "74":
				return "In Approval";
			case "75":
				return "Hotfix Governance Approved";
			case "76":
				return "Approved";
			case "78":
				return "Rejected";
			case "88":
				return "In Process";
			case "90":
				return "Finished";
			case "92":
				return "Canceled";
			default:
				return HeaderStatus;
			}
		},
		statusText3: function (Epheaderstatus) {
			switch (Epheaderstatus) {
			case "00":

				return "Request Created By Developer";
			case "05":
				return "In Development";
			case "06":
				return "Development Done";
			case "10":
				return "To be Approved by MAO";
			case "20":
				return "Request Approved By MAO";
			case "30":
				return "Ready for Testing";
			case "35":
				return "Import Test Failed";
			case "40":
				return "Import Test Ok";
			case "50":
				return "Final Double-Check by MAO";
			case "53":
				return "Released in SPS";
			case "58":
				return "Single Corr. Import test failed";
			case "59":
				return "Consolidation Import failed";
			case "61":
				return "Ready for Delivery";
			case "62":
				return "Single Corr. Import test started";
			case "64":
				return "Regression import finished";
			case "65":
				return "Ready for Consolidation";
			case "67":
				return "Single Corr. Import test ok";
			case "68":
				return "Consolidation Import ok";
			case "69":
				return "Included in Patch Collection";
			case "80":
				return "Request Rejected";
			case "90":
				return "Request Expired";
			case "91":
				return "Included in ABAP transport";
			case "95":
				return "SPS is not affected";
			default:
				return Epheaderstatus;
			}
		},
		statusText1: function (StatusHf) {
			switch (StatusHf) {
			case "01":

				return "Not yet decided";
			case "02":
				return "In Approval";
			case "03":
				return "Approved";
			case "04":
				return "Rejected";
			case "05":
				return "Not needed";
			default:
				return StatusHf;
			}
		},
		statusText2: function (StatusRm) {
			switch (StatusRm) {
			case "01":

				return "Not yet decided";
			case "02":
				return "In Approval";
			case "03":
				return "Approved";
			case "04":
				return "Rejected";
			case "05":
				return "Not needed";
			default:
				return StatusRm;
			}
		},

		statusText5: function (CodelineType) {
			switch (CodelineType) {
			case "1":

				return "MAO Codeline";
			case "2":
				return "Verification Patch Codeline";
			case "3":
				return "Emergency Patch Codeline";
			case "9":
				return "Need Double Miantanance";
			default:
				return CodelineType;
			}
		},
		statusText6: function (Status) {
			switch (Status) {
			case "00":

				return "Request Created By Developer";
			case "05":
				return "In Development";
			case "06":
				return "Development Done";
			case "10":
				return "To be Approved by MAO";
			case "20":
				return "Request Approved By MAO";
			case "30":
				return "Ready for Testing";
			case "35":
				return "Import Test Failed";
			case "40":
				return "Import Test Ok";
			case "50":
				return "Final Double-Check by MAO";
			case "53":
				return "Released in SPS";
			case "58":
				return "Single Corr. Import test failed";
			case "59":
				return "Consolidation Import failed";
			case "61":
				return "Ready for Delivery";
			case "62":
				return "Single Corr. Import test started";
			case "64":
				return "Regression import finished";
			case "65":
				return "Ready for Consolidation";
			case "67":
				return "Single Corr. Import test ok";
			case "68":
				return "Consolidation Import ok";
			case "69":
				return "Included in Patch Collection";
			case "80":
				return "Request Rejected";
			case "90":
				return "Request Expired";
			case "91":
				return "Included in ABAP transport";
			case "95":
				return "SPS is not affected";
			default:
				return Status;
			}
		},

		statusText7: function (CodelineEpStat) {
			switch (CodelineEpStat) {
			case "70":
				return "New";
			case "72":
				return "In Risk Mitigation";
			case "74":
				return "In Approval";
			case "75":
				return "Hotfix Governance Approved";
			case "76":
				return "Approved";
			case "78":
				return "Rejected";
			case "80":
				return "Implementation on-going";
			case "82":
				return "Implementation Completed";
			case "84":
				return "Assembly Done";
			case "86":
				return "Deployment completed";
			case "88":
				return "Retest Successful";
			case "90":
				return "Finished";
			case "92":
				return "Canceled";
			default:
				return CodelineEpStat;
			}
		},
		urgency: function (Urgency) {
			var oTable = this.getView().byId("idProductsTable");
			switch (Urgency) {
			case "3":
				return "0";
			case "5":
				return "1";
			case "7":
				return "2";

			}
		},
		hfgapproval_state: function (header, rm_state, hfg_state, urg, mao_state) {
			switch (urg) {
			case '1':
				if (header >= '76' && rm_state >= '03' && hfg_state >= '03' && mao_state >= '61') {
					return 'Success';
				}
				break;
			case '3':
				if (header >= '76' && rm_state >= '03' && hfg_state >= '03' && mao_state >= '61') {
					return 'Success';
				}
				break;
			case '5':
				if (header >= '76' && rm_state >= '03' && hfg_state >= '03' && mao_state >= '61') {
					return 'Success';
				}
				break;
			case "7":
				if (header >= '75' && hfg_state >= '03' && mao_state >= '61') {
					return 'Success';
				}
				break;
			}

		},
		hfgapproval_icon: function (header, rm_state, hfg_state, urg, mao_state) {
			switch (urg) {
			case '1':
				if (header >= '76' && rm_state >= '03' && hfg_state >= '03' && mao_state >= '61') {
					return 'sap-icon://sys-enter-2';
				}
				break;
			case '3':
				if (header >= '76' && rm_state >= '03' && hfg_state >= '03' && mao_state >= '61') {
					return 'sap-icon://sys-enter-2';
				}
				break;
			case '5':
				if (header >= '76' && rm_state >= '03' && hfg_state >= '03' && mao_state >= '61') {
					return 'sap-icon://sys-enter-2';
				}
				break;
			case "7":
				if (header >= '75' && hfg_state >= '03' && mao_state >= '61') {
					return 'sap-icon://sys-enter-2';
				}
				break;
			}

		},
		statusText11: function (Chash) {
			switch (Chash) {
			case "00":
				return "No";
			case "01":
				return "Yes, Individual";
			case "02":
				return "Yes ,Master";
			default:
				return Chash;

			}
		},
		statusText10: function (CodelineStatus) {
			switch (CodelineStatus) {
			case "00":
				return "Request Created By Developer";
			case "05":
				return "In Development";
			case "06":
				return "Development Done";
			case "10":
				return "To be Approved by MAO";
			case "20":
				return "Request Approved By MAO";
			case "30":
				return "Ready for Testing";
			case "35":
				return "Import Test Failed";
			case "40":
				return "Import Test Ok";
			case "50":
				return "Final Double-Check by MAO";
			case "53":
				return "Released in SPS";
			case "58":
				return "Single Corr. Import test failed";
			case "59":
				return "Consolidation Import failed";
			case "61":
				return "Ready for Delivery";
			case "62":
				return "Single Corr. Import test started";
			case "64":
				return "Regression import finished";
			case "65":
				return "Ready for Consolidation";
			case "67":
				return "Single Corr. Import test ok";
			case "68":
				return "Consolidation Import ok";
			case "69":
				return "Included in Patch Collection";
			case "80":
				return "Request Rejected";
			case "90":
				return "Request Expired";
			case "91":
				return "Included in ABAP transport";
			case "95":
				return "SPS is not affected";
			default:
				return CodelineStatus;
			}
		},
		buttonicon: function (Status) {
			switch (Status) {
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
		buttontext: function (Status) {
			switch (Status) {
			case "9999":

				return "Workflow aborted completely";

			case "8888":

				return "Workflow Confirmed";
			case "4100":

				return "waiting for return of process";
			case "4000":

				return "In process";
			case "0800":

				return "Reset";
			case "0400":

				return "Initial";
			case "0012":

				return "Aborted";
			case "0008":

				return "Terminated";
			case "0007":

				return "Reset";
			case "0006":

				return "Not processed";
			case "0004":

				return "Finished with warning";
			case "0002":

				return "Manually set to finished";
			case "0000":

				return "Finished";
			case "9899":

				return "Assembly:In Process";
			case "9900":

				return "Assembly:Done";
			case "8899":

				return "Deployment:In Process";
			case "8900":

				return "Deployment:Done";
			case "9898":

				return "Initial";
			}
		},
		Collectiontype: function (Type) {
			switch (Type) {
			case '01':
				return 'Success';
			case '02':
				return 'Warning';
			case '03':
				return 'Error';
			}
		},

		Collectiontype_Text: function (Type) {
			switch (Type) {
			case '01':
				return 'Hotfix Collection';
			case '02':
				return 'Validation Patch Collection';
			case '03':
				return 'Extraordinary Patch Collection';
			default:
				return Type;
			}
		},

		Collection_status: function (Type) {
			switch (Type) {
			case '00':
				return 'Planned';
			case '05':
				return 'In Preparation';
			case '09':
				return 'Consolidated';
			case '10':
				return 'Started';
			case '15':
				return 'in Assembly';
			case '20':
				return 'Failed';
			case '25':
				return 'Ready for test';
			case '26':
				return 'Sent to Verification SPC';
			case '30':
				return 'Successful';
			case '40':
				return 'Completed';
			default:
				return Type;
			}
		},

		buttonvisible: function (Status) {
			if (Status === "9898" || Status === "") {
				return false;
			}
		},
		EnableStatus: function (EnableStatus) {
			switch (EnableStatus) {
			case "T":
				return true;
			case "F":
				return false;
			}

		},
		Subscribetext: function (Subscribe) {
			switch (Subscribe) {
			case "true":
				return "Emphasized";
			default:
				return "Transparent";
			}
		},
		Subscribetooltip: function (Subscribe) {
			switch (Subscribe) {
			case "true":
				return "You have set it for Notification";
			default:
				return "Please Click on button to Notify yourself about Codeline Status";
			}
		},
		restestcheckbox: function (RetestMail) {
			switch (RetestMail) {
			case "0002":
				return false;
			default:
				return true;
			}

		},
		restestcheckboxs: function (RetestMail) {
			switch (RetestMail) {
			case "0002":
				return true;
			default:
				return false;
			}
		},
		restestcheckboxstate: function (RetestMail) {
			switch (RetestMail) {
			case "0002":
				return "Success";
			default:
				return "Warning";
			}
		},
		retesttooltip: function (RetestSuccess) {
			switch (RetestSuccess) {
			case "X":
				return "Yes";
			default:
				return "No";
			}
		},
		retestsuccess: function (RetestSuccess) {
			switch (RetestSuccess) {
			case "X":
				return 'Success';
			default:
				return 'Error';
			}
		},
		retestsuccess_switch: function (mandatory_field) {
			switch (mandatory_field) {
			case "X":
				return true;
			default:
				return false;
			}
		},
		retesticon: function (RetestSuccess) {
			switch (RetestSuccess) {
			case "X":
				return 'sap-icon://accept';
			default:
				return 'sap-icon://decline';
			}
		},
		setDate: function (value) {
			if (value !== null || value !== undefined) {
				var dateString = value;
				var year = dateString.substring(0, 4);
				var month = dateString.substring(4, 6);
				var day = dateString.substring(6, 8);

				var date = day + '.' + month + '.' + year;
				/*	year = date.getDate();
					month = date.getMonth();
					day = date.getDay();
					date = day + '.' + month + '.' + year;*/
				return date;
			}
		},
		setTime: function (value) {
			if (value != null || value != undefined) {
				var timeString = value;
				var hh = timeString.substring(0, 2);
				var mm = timeString.substring(2, 4);
				var ss = timeString.substring(4, 6);
				var time = hh + ':' + mm + ':' + ss;

				return time;
			}

		},
		ChangeTime: function (value) {
			if (value != null || value != undefined) {
				var hh = value.substring(2, 4);
				var mm = value.substring(5, 7);
				var ss = value.substring(8, 10);
				var time = hh + ':' + mm + ':' + ss + ' CET';
				return time;
			}
		},
		timestamp: function (value) {
			if (value != null || value != undefined) {
				var year = value.substring(0, 4);
				var month = value.substring(4, 6);
				var day = value.substring(6, 8);

				var date = day + '.' + month + '.' + year;

				var hh = value.substring(8, 10);
				var mm = value.substring(10, 12);
				var ss = value.substring(12, 14);
				var time = hh + ':' + mm + ':' + ss + ' CET';
				return date + '-' + time;
			}

		},
		CheckBox: function (value) {
			switch (value) {
			case "true":
				return true;
			case "false":
				return false;
			case "X":
				return true;
			case "":
				return false;
			default:
				return value;
			}

		},
		CheckBoxEPinProcess: function (value) {
			switch (value) {
			case "1":
				return true;
			case "X":
				return true;
			case "0":
				return false;
			default:
				return false;
			}

		},
		buttonType: function (value) {
			if (value === '') {
				return 'Default';

			} else {
				return 'Emphasized';
			}
		},

		buttonTextPick: function (value) {
			if (value === '') {
				return 'PICK';
			} else {
				return value;
			}
		},
		CommentFormat: function (val1, val2) {
			if (val1 !== '' && val2 !== '') {
				return val1 + '-' + val2;
			}
		},
		assembly_button_format: function (val1, val2) {
			if (val1 !== '' && val2 !== '') {
				return val2 + '-' + parseFloat(val1);
			} else {
				return 'PICK' + '-' + parseFloat(val1);
			}
		},
		columnStyle: function (urgency) {
			if (urgency === '3') {
				return 'myCoustomClass';
			} else {

			}
		},
		schedulestatus: function (state) {
			switch (state) {
			case "01":
				return 'Initial';
			case "02":
				return 'Mail Scheduled';
			case "03":
				return 'Mail Sent';
			case "04":
				return 'Error';
			case "05":
				return 'On Hold';
			default:
				return state;
			}
		},
		mailType: function (state) {
			switch (state) {
			case "01":
				return 'Assembly Trigger Mail';
			case "02":
				return 'Reminder to DEV/MAO for Ready for delivery Status';
			case "03":
				return 'Retest Mail to DEV/MAO for any EP Request Id';
			case "04":
				return 'Cuttoff reminders mail to DEV/MAO';
			case "05":
				return 'Cutoff start mails';
			case "06":
				return 'Cutoff end mails';
			case "07":
				return 'Cutoff Non-ABAP reminders';
			default:
				return state;
			}
		},
		dlrecipient: function (state) {
			switch (state) {
			case "01":
				return 'TO';
			case "02":
				return 'CC';
			case "03":
				return 'BCC';
			default:
				return state;
			}
		},
		addDelegate:function(v){
			if (v !== null) {
				
				this.getParent().getParent().getParent().getParent().getParent().getController().attachPopoverOnMouseover(this,this.getAggregation('dependents')[0]);
			}
			return v;
		}
	};

},true);