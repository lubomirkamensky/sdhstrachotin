Window = {
	_windows : [],
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
	// vrati okno ze seznamu oken (Window._windows)
	_getWindow : function (sWindowID) {
		for (var i = 0; i < Window._windows.length; i++) {			
			if (Window._windows[i].id == sWindowID) return Window._windows[i];
		}
	},
	// inicializace
	init : function () {
		var oDIVs = document.getElementsByTagName("div");
		
		Window._windows = []; // pri RPC zustavala kolekce naplnena
		for (var i = 0; i < oDIVs.length; i++) {
			if(oDIVs[i].className == "window") {
				Window._windows[Window._windows.length] = oDIVs[i];
			}
		}
	},
	// zavreni okna
	close : function (sWindowID) {
		var oWindow = Window._getWindow(sWindowID);
		
		oWindow.parentNode.removeChild(oWindow);
	}
};
// inicializace pri window.onload
Window._addEvent(window, "load", Window.init);
// inicializace pro PRC
if (typeof(RPC) != "undefined") {RPC.addOnLoad("Window.init();");}