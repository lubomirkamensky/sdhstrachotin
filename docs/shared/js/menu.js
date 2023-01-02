Menu = {
	_isIE : ((navigator.userAgent.toLowerCase().indexOf("msie") != -1) && (navigator.userAgent.toLowerCase().indexOf("opera") == -1)),
	_isGecko : (navigator.product == "Gecko"),
	// pridani eventu
	_addEvent : function (oElement, sType, oFunction, bUseCapture) {		
		// Opera hack
		if (window.opera && (oElement == window)) {
			oElement = document;
		}
		if (oElement.addEventListener){
			oElement.addEventListener(sType, oFunction, bUseCapture);
			return true;
		} else if (oElement.attachEvent){
			var r = oElement.attachEvent("on"+sType, oFunction);
			return r;
		} else {
			return false;
		}
	},
	// zpracovani polozky
	_associate : function (oLi, oUl) {
		oLi.onmouseover = function () {
			this.className += " over";
			if (oUl) {oUl.style.display = "block";}
		}
		oLi.onmouseout = function() {
			this.className = this.className.replace(" over", "");
			if (oUl) {oUl.style.display = "none";}
		}
	},	
	// zpracovani menu
	_process : function (oUl) {
		for (var i = 0; i < oUl.childNodes.length; i++) {
			var oLi = oUl.childNodes[i];

			if(oLi.nodeName == "LI") {
				var oSubUl = null;

				for (var j = 0; j < oLi.childNodes.length; j++) {
					var oNode = oLi.childNodes[j];		

					if (oNode.nodeName == "UL") oSubUl = oNode;
				}
				Menu._associate(oLi, oSubUl);
				if (oSubUl) Menu._process(oSubUl);
			}		
		}	
	},
	// inicializace
	init : function () {
		// inicializace jen pro IE, Gecko umi li:hover
		if (Menu._isIE) {
			var oUls = document.getElementsByTagName("ul");

			for (var i = 0; i < oUls.length; i++) {
				if (oUls[i].nodeName == "UL" && oUls[i].className == "menu") Menu._process(oUls[i]);
			}
		}
	}
};
// inicializace pri window.onload
Menu._addEvent(window, "load", Menu.init);
// inicializace pro PRC
if (typeof(RPC) != "undefined") {RPC.addOnLoad("Menu.init();");}