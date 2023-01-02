Map = {
	_map : null,
	_points : null,
	_switchs : [],
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
	// zobrazeni / skryti mapovych bodu
	_displayMapPoints : function (sName, bDisplay) {
		for (var i = 0; i < Map._points.length; i++) {
			if (Map._points[i].className == sName) {
				Map._points[i].style.display = bDisplay ? "block" : "none" ;				
			}
		}	
	},
	// zjiskani prepinace z kolekce prepinacu
	_getSwitch : function(sId) {
		for (var i = 0; i < Map._switchs.length; i++) {
			if(Map._switchs[i].id == sId) return Map._switchs[i];
		}		
	},
	// zobrazi / skryje vrstvu
	display : function (sName, oInput) {
		var oSwitch = Map._getSwitch(oInput.id);

		Map._displayMapPoints(sName,oInput.checked);
		oSwitch.checked = oInput.checked;
	},
	// zobrazi vsechny vrstvy
	displayAll : function (bDisplay) {
		var oInputs = document.getElementsByTagName("input");

		// inicializujeme prepinace
		for (var j = 0; j < oInputs.length; j++) {
			if(oInputs[j].className == "switch") {
				var oInput = oInputs[j];
				var oSwitch = Map._getSwitch(oInput.id);
				
				// prepinac prepina vice vrstev (jmena oddelena carkou)
				if (oInput.id.indexOf(",") != -1) {
					var aSwitchesId = oInput.id.split(",");

					for (var k = 0; k < aSwitchesId.length; k++) {
						Map._displayMapPoints(aSwitchesId[k], bDisplay);								
					}									
				// pokud prepinac prepina jen jednu vrstvu
				} else {
					Map._displayMapPoints(oInput.id, bDisplay);
				}
				oSwitch.checked = oInput.checked = bDisplay;
			}
		}
	},
	// inicializace
	init : function () {
		var oDIVs = document.getElementsByTagName("div");
		var oInputs = document.getElementsByTagName("input");
		
		for (var i = 0; i < oDIVs.length; i++) {
			if(oDIVs[i].className == "map") {
				Map._map = oDIVs[i];
				Map._points = oDIVs[i].getElementsByTagName("a");
				// inicializujeme prepinace
				for (var j = 0; j < oInputs.length; j++) {
					if(oInputs[j].className == "switch") {
						var oInput = oInputs[j];
						var oSwitch = Map._getSwitch(oInput.id);

						// mame prepinac v kolekci prepinacu, inicializujeme ho
						if (oSwitch) {
							oInput.checked = oSwitch.checked;
							// prepinac prepina vice vrstev (jmena oddelena carkou)
							if (oInput.id.indexOf(",") != -1) {
								var aSwitchesId = oInput.id.split(",");

								for (var k = 0; k < aSwitchesId.length; k++) {
									Map._displayMapPoints(aSwitchesId[k],oInput.checked);								
								}									
							// pokud prepinac prepina jen jednu vrstvu
							} else {
								Map._displayMapPoints(oInput.id,oInput.checked);
							}
						// nemame prepinac v kolekci, pridame ho
						} else {
							Map._switchs[Map._switchs.length] = oInput;
						}
					}
				}		
			}
		}
	},
	// vlozeni souradnic do inputu v administraci sdilenych sluzeb
	pasteCoords : function (oEvent, oInputX, oInputY) {
		var oEvent = Form._fixEvent(oEvent);
		var oCursor = document.getElementById("cursor");
		var oPoint =  document.getElementById("point");
		var iX = Math.round(oEvent.layerX - oCursor.width / 2);
		var iY = Math.round(oEvent.layerY - oCursor.height / 2);
		
		oInputX.value = iX;
		oInputY.value = iY;
		oPoint.style.left = iX +"px";
		oPoint.style.top = iY +"px";
	},	
	// zobrazeni mapy v administraci sdilenych sluzeb
	showMap : function (sImgName) {
		var oMap = document.getElementById("map");
		var oPoint = document.getElementById("point");
		
		if (sImgName != "") {
			oMap.src = "/images/maps/map_"+ sImgName +".gif";
			oMap.style.display = "block";
			oPoint.style.display = "block";
		}
	}	
};
// inicializace pri window.onload	
Map._addEvent(window, "load", Map.init);
// inicializace pro PRC
if (typeof(RPC) != "undefined") {RPC.addOnLoad("Map.init();");}