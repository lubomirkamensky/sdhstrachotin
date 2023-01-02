Rollover = {
	// ID casovace
	_timerID : null,
	// indikace, jestli je casovac spusteny
	_timerRunning : false,
	// index aktualni polozky
	_index : 0,
	// pole polozek pro rotovani
	_items : null,
	// interval mezi zmenami
	interval : 3000,
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
	// zmena polozky
	_roll : function () {
		// jsme na zacatku seznamu pro rolovani
		if (Rollover._index == 0) {
			Rollover._items[Rollover._items.length - 1].style.display = "none";
		} else {
			Rollover._items[Rollover._index - 1].style.display = "none";
		}
		Rollover._items[Rollover._index].style.display = "block";
		Rollover._index ++;
		// jsme na konci seznamu k rolovani
		if (Rollover._index == Rollover._items.length) {
			Rollover._index = 0;
		}
		Rollover._start();
	},
	// spusteni casovace
	_start : function () {
		Rollover._stop();
		Rollover._timerID = setTimeout("Rollover._roll()", Rollover.interval);
		Rollover._timerRunning = true;
	},
	// zastaveni casovace
	_stop : function () {
		if (Rollover._timerRunning) {
			clearTimeout(Rollover._timerID);
		}
		Rollover._timerRunning = false;
	},
	// inicializace
	init : function () {
		var oULs = document.getElementsByTagName("ul");
		
		for (var i = 0; i < oULs.length; i++) {
			if(oULs[i].className == "rollover") {
				var oUl = oULs[i];
				
				Rollover._items = oUl.getElementsByTagName("li");
				
				for (var j = 0; j < Rollover._items.length; j++) {
					var oItem = Rollover._items[j];
					
					oItem.style.display = "none";
					oItem.style.position = "absolute";
					
					Rollover._addEvent(oUl, "mouseover", Rollover._stop);
					Rollover._addEvent(oUl, "mouseout", Rollover._start);
				}
				Rollover._roll();
			}
		}
	}
};
// inicializace pri window.onload
Rollover._addEvent(window, "load", Rollover.init);
// inicializace pro PRC
if (typeof(RPC) != "undefined") {RPC.addOnLoad("Rollover.init();");}