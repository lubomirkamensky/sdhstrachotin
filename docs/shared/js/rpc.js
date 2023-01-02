RPC = {
	// pole inicializacnich funkci
	_aOnLoad : new Array,
	// slovnik popisku
	_labels : [
		{_name: "wait",_translations: [
			{_lang: "cs",_label: "Prosím èekejte ..."},
			{_lang: "en",_label: "Please wait ..."},
			{_lang: "de",_label: "Bitte Warten ..."}
		]}
	],
	// jazyk ve kterem je napsana stranka
	_lang : document.getElementsByTagName("html")[0].getAttribute("lang") ? document.getElementsByTagName("html")[0].getAttribute("lang") : "cs",
	// inicializace po nacteni noveho obsahu
	_init : function () {
		for (var i = 0; i < RPC._aOnLoad.length; i++) {		
			eval(RPC._aOnLoad[i]);
		}
	},
	// zjiskani labelu ze slovniku
	_getLabel : function (sLabel) {
		for (var i = 0; i < RPC._labels.length; i++) {
			if (RPC._labels[i]._name == sLabel) {				
				for (var j = 0; j < RPC._labels[i]._translations.length; j++) {
					if (RPC._labels[i]._translations[j]._lang == RPC._lang) return RPC._labels[i]._translations[j]._label;
				}
			}
		}
	},
	// pridani inicializacni funkce
	addOnLoad : function (sFunName) {
		
		RPC._aOnLoad[RPC._aOnLoad.length] = sFunName;
	},
	// odeslani s potvrzenim
	confirm : function (oLink) {
		var bSubmit = window.confirm(oLink.innerHTML);

		if(bSubmit) {
			RPC.wait();
			return true;
		} else {
			return false;
		}
	},
	// skryti elementu title
	disable : function (sElementId) {
		var oElement = window.parent.document.getElementById(sElementId);

		if (oElement && oElement.style.display != "none") {oElement.style.display = "none";}
	},
	// zobrazeni elementu title
	enable : function (sElementId) {
		var oElement = window.parent.document.getElementById(sElementId);

		if (oElement && oElement.style.display != "block") {oElement.style.display = "block";}
	},
	// naplneni elementu novym obsahem
	fill : function (aContents) {

		for (var i = 0; i < aContents.length; i++) {
			var oElement = document.getElementById(aContents[i][0]);
			
			//alert(oElement.id +":"+ aContents[i][1]);
			if (oElement) {
				oElement.innerHTML = aContents[i][1];
			}
		}
		RPC._init();
	},
	// zpracovani vysledku
	process : function (sType, aContents, sUrl) {
	
		// zpracovavame vysledek v CMS
		if (sType == "CMS") {
			RPC.disable("title");
			
		// zpracovavame vysledek z ostatich aplikaci
		} else {
			RPC.enable("title");
		}
		
		// naplnime elementy novym obsahem
		RPC.fill(aContents);
	},
	// zmena URL
	redirect : function(sUrl) {
		location = sUrl;
	},
	// hlaseni o praci systemu
	wait : function (sElementId) {
		if (sElementId) {
			RPC.fill([[sElementId,"<div class='wait'>"+ RPC._getLabel("wait") +"</div>"]]);
		} else {
			RPC.fill([["main","<div class='wait'>"+ RPC._getLabel("wait") +"</div>"]]);
		}
	},
  resizeIframe : function(id) {
	  var height = document.body.scrollHeight;
	  var iframe = parent.document.getElementById(id);
	
	  if (height>200) {iframe.style.height = height} 	
  }
};