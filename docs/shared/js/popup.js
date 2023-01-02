loadScript("/shared/highslide/highslide-with-gallery.js");
loadScript("/shared/js/highslide.js");

function loadScript(src) {
	var script = document.createElement('script');

	script.setAttribute("type", "text/javascript");
	script.setAttribute("src", src);

	document.getElementsByTagName("head")[0].appendChild(script);
}

Popup = {
	// slovnik popisku
	_labels : [
		{_name: "close_window",_translations: [
			{_lang: "cs",_label: "Kliknutím zavøete okno"},
			{_lang: "en",_label: "Click to close window"},
			{_lang: "de",_label: "Fenster schließen mit einem Klick"}
		]},
		{_name: "first",_translations: [
			{_lang: "cs",_label: "první"},
			{_lang: "en",_label: "first"},
			{_lang: "de",_label: "erste"}
		]},
		{_name: "prev",_translations: [
			{_lang: "cs",_label: "pøedchozí"},
			{_lang: "en",_label: "previous"},
			{_lang: "de",_label: "vorige"}
		]},
		{_name: "next",_translations: [
			{_lang: "cs",_label: "následující"},
			{_lang: "en",_label: "next"},
			{_lang: "de",_label: "nächste"}
		]},
		{_name: "last",_translations: [
			{_lang: "cs",_label: "poslední"},
			{_lang: "en",_label: "last"},
			{_lang: "de",_label: "letzten"}
		]},
		{_name: "gallery",_translations: [
			{_lang: "cs",_label: "Fotogalerie"},
			{_lang: "en",_label: "Gallery"},
			{_lang: "de",_label: "Bildergalerie"}
		]}
	],
	// jazyk ve kterem je napsana stranka
	_lang : document.getElementsByTagName("html")[0].getAttribute("lang") ? document.getElementsByTagName("html")[0].getAttribute("lang") : "cs",
	// parametry pro otevirani stanky
	_params : [
		{_name : "image", _params : "location=0,statusbar=1,scrollbars=1,menubar=0,width=540,height=440", _type : ""},
		{_name : "image200", _params : "location=0,statusbar=1,scrollbars=1,menubar=0,width=240,height=260", _type : ""},
		{_name : "image300", _params : "location=0,statusbar=1,scrollbars=1,menubar=0,width=340,height=360", _type : ""},
		{_name : "image400", _params : "location=0,statusbar=1,scrollbars=1,menubar=0,width=440,height=360", _type : ""},
		{_name : "image500", _params : "location=0,statusbar=1,scrollbars=1,menubar=0,width=540,height=460", _type : ""},
		{_name : "image600", _params : "location=0,statusbar=1,scrollbars=1,menubar=0,width=640,height=560", _type : ""},
		{_name : "image700", _params : "location=0,statusbar=1,scrollbars=1,menubar=0,width=740,height=660", _type : ""},
		{_name : "image900", _params : "location=0,statusbar=1,scrollbars=1,menubar=0,width=940,height=860", _type : ""},
		{_name : "shared", _params : "location=0,statusbar=1,scrollbars=1,menubar=0,width=540,height=500", _type : ""}
	],
	// aktualne zobrazeny obrazek v popup okne
	_currentImage : "0",
	// ziskani labelu ze slovniku (Editor._labels)
	_getLabel : function (sLabel) {
		for (var i = 0; i < Popup._labels.length; i++) {
			if (Popup._labels[i]._name == sLabel) {				
				for (var j = 0; j < Popup._labels[i]._translations.length; j++) {
					if (Popup._labels[i]._translations[j]._lang == Popup._lang) return Popup._labels[i]._translations[j]._label;
				}
			}
		}		
	},
	// vrati parametry z kolekce parametru
	_getParams : function (sName) {
		// mame jmeno parametru
		if (sName) {
			for (var i = 0; i < Popup._params.length; i++) {
				if (Popup._params[i]._name == sName) return Popup._params[i]._params;
			}
		// neni zadano jmeno parametru, bereme vychozi (prvni parametry s type = default)
		} else {
			for (var i = 0; i < Popup._params.length; i++) {
				if (Popup._params[i]._type == "default") return Popup._params[i]._params;
			}	
		}
	},
	// pridani nove polozky do kolekce parametru
	addParams : function (sName, sParams, sType) {
		Popup._params[Popup._params.length] = {
			_name : sName,
			_params : sParams,
			_type : sType
		};		
	},
	// upraveni stavajicich parametru
	updateParams : function (sName, sParams, sType) {
		for (var i = 0; i < Popup._params.length; i++) {
			var oParams = Popup._params[i];
			
			if (oParams._name == sName) {			
				oParams._params = sParams;
				oParams._type = sType;
			}
		}
	},
	// otevreni stranky v novem okne
	open : function (oLink, sParamsName) {
		var oWindow = window.open(oLink.href, oLink.target, Popup._getParams(sParamsName));

		oWindow.focus();
	},
	// otevreni stranky v novem okne
	openImage : function (oLink, sParamsName) {
		var oWindow = window.open("", oLink.target, Popup._getParams(sParamsName));
		var sHtml = "";
		var oLinks = oLink.parentNode.parentNode.getElementsByTagName("a");
		
		sHtml += "<html>";
		sHtml += 	"<head>";
		sHtml += 		"<title>"+ Popup._getLabel("gallery") +"</title>";
		sHtml += 		"<link rel='stylesheet' type='text/css' href='/css/popup.css'/>";
		sHtml += 		"<script type='text/javascript' src='/shared/js/popup.js'></script>";
		sHtml += 	"</head>";
		sHtml += 	"<head>";
		sHtml += 		"<div class='image' id='"+ sParamsName +"'>";
		sHtml += 			"<div class='navigation'>";
		sHtml += 				"<a class='first' onclick='Popup.changeImageInPopup(this); return false;' href='' title='"+ Popup._getLabel("first") +"' class='"+ sClass +"'><< "+ Popup._getLabel("first") +"</a>";
		sHtml += 				"<a class='prev' onclick='Popup.changeImageInPopup(this); return false;' href='' title='"+ Popup._getLabel("prev") +"' class='"+ sClass +"'>< "+ Popup._getLabel("prev") +"</a>";
		sHtml += 				"<a class='next' onclick='Popup.changeImageInPopup(this); return false;' href='' title='"+ Popup._getLabel("next") +"' class='"+ sClass +"'>"+ Popup._getLabel("next") +" ></a>";
		sHtml += 				"<a class='last' onclick='Popup.changeImageInPopup(this); return false;' href='' title='"+ Popup._getLabel("last") +"' class='"+ sClass +"'>"+ Popup._getLabel("last") +" >></a>";
		sHtml += 			"</div>";
		sHtml += 			"<a href='javascript: window.close();' title='"+ Popup._getLabel("close_window") +"'><img id='popup_image' src='"+ oLink.href +"'/></a>";
		sHtml += 			"<div id='popup_text' class='text'>"+ oLink.getAttribute("title") +"</div>";		
		sHtml += 			"<div id='links' class='links'>";
		
		for (var i = 0; i < oLinks.length; i++) {
			var oNextLink = oLinks[i];
			var sClass = "";
			
			if (oNextLink.href == oLink.href) {
				sClass = "active";
			}
			
			sHtml += 			"<a onclick='Popup.replaceImageInPopup(this); return false;' href='"+ oNextLink.getAttribute("href") +"' title='"+ oNextLink.getAttribute("title") +"' class='"+ sClass +"'>"+ (i + 1) +"</a>";
		}
		
		sHtml += 			"</div>";
		sHtml += 		"</div>";
		sHtml += 	"</head>";
		sHtml += "</html>";

		oWindow.document.write(sHtml);
		oWindow.document.close();
		oWindow.focus();
	},
	// otevreni stranky v novem okne
	openSingleImage : function (oLink, sParamsName) {
		var oWindow = window.open("", oLink.target, Popup._getParams(sParamsName));
		var sHtml = "";
		
		sHtml += "<html>";
		sHtml += 	"<head>";
		sHtml += 		"<title>"+ Popup._getLabel("gallery") +"</title>";
		sHtml += 		"<link rel='stylesheet' type='text/css' href='/css/popup.css'/>";
		sHtml += 		"<script type='text/javascript' src='/shared/js/popup.js'></script>";
		sHtml += 	"</head>";
		sHtml += 	"<head>";
		sHtml += 		"<div class='image' id='"+ sParamsName +"'>";
		sHtml += 			"<a href='javascript: window.close();' title='"+ Popup._getLabel("close_window") +"'><img id='popup_image' src='"+ oLink.href +"'/></a>";
		sHtml += 			"<div id='popup_text' class='text'>"+ oLink.getAttribute("title") +"</div>";
		sHtml += 		"</div>";
		sHtml += 	"</head>";
		sHtml += "</html>";

		oWindow.document.write(sHtml);
		oWindow.document.close();
		oWindow.focus();
	},	
	// zmena obrazku
	replaceImage : function (oLink, sImageId) {
		var oImage = document.getElementById(sImageId);
		
		oImage.src = oLink.href;
		oImage.alt = oLink.title;
	},
	// zmena obrazku v popup okne
	replaceImageInPopup : function (oLink) {
		var oImage = document.getElementById("popup_image");
		var oText = document.getElementById("popup_text");
		var oLinks = oLink.parentNode.getElementsByTagName("a");
		
		for (var i = 0; i < oLinks.length; i++) {
			var oNextLink = oLinks[i];
			var sClass = "";
			
			if (oNextLink.href == oLink.href) {
				sClass = "active";
			}
			
			oNextLink.className = sClass;
		}
		
		oImage.src = oLink.href;
		oImage.alt = oLink.title;
		oText.innerHTML = oLink.title;
	},
	// zmena obrazku v popup okne
	changeImageInPopup : function (oLink) {
		var sType = oLink.className;
		var oImage = document.getElementById("popup_image");
		var oText = document.getElementById("popup_text");
		var oLinks = document.getElementById("links").getElementsByTagName("a");
		var oOldLink = null;
		var oNewLink = null;
		
		for (var i = 0; i < oLinks.length; i++) {
			var oLink = oLinks[i];
			
			if (oLink.className == "active") {
				oOldLink = oLink;
				
				if (sType == "first") {
					oNewLink = oLinks[0];
				
				} else if (sType == "prev") {							
					if (i == 0) {
						oNewLink = oLinks[oLinks.length - 1];
					} else {
						oNewLink = oLinks[i - 1];
					}
				} else if (sType == "next") {
					if (i == (oLinks.length - 1)) {
						oNewLink = oLinks[0];
					} else {
						oNewLink = oLinks[i + 1];
					}
				} else if (sType == "last") {
					oNewLink = oLinks[oLinks.length - 1];
				}				
			}
		}
				
		oImage.src = oNewLink.href;
		oImage.alt = oNewLink.title;
		oText.innerHTML = oNewLink.title;
		oOldLink.className = "";
		oNewLink.className = "active";
	}	
};