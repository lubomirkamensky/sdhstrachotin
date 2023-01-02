Form = {
	// identifikace prohlizece IE
	_isIE : ((navigator.userAgent.toLowerCase().indexOf("msie") != -1) && (navigator.userAgent.toLowerCase().indexOf("opera") == -1)),
	// identifikace prohlizecu Gecko
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
	// kontrola prvku formulare
	_checkItem : function (oItem) {
		var bCheck = true;
		
		switch (oItem.type) {
			case "hidden":
				oItem.value = Form._getXhtmlText(oItem.value);
				break;
			case "text":				
				if (oItem.getAttribute("required") && Form._trim(oItem.value) == "") {
					alert(oItem.getAttribute("alert")); bCheck = false;
				} else {
					oItem.value = Form._getXhtmlText(oItem.value);
				}		
				break;
			case "password":
				if (oItem.getAttribute("required") && oItem.value == "") {
					alert(oItem.getAttribute("alert")); bCheck = false;
				}
				break;
			case "file":
				if (oItem.getAttribute("required") && oItem.value == "") {
					alert(oItem.getAttribute("alert")); bCheck = false;
				}
				break;
			case "textarea":
				if (oItem.getAttribute("required") && Form._trim(oItem.value) == "") {
					alert(oItem.getAttribute("alert")); bCheck = false;
				} else {
					// priprava na odeslani HTML editoru (prevod na XHTML a cisteni)
					if (oItem.className == "editor" && typeof(Editor) != "undefined") {
						Editor.doCmd(oItem.getAttribute("id"),"CheckContent");
					} else {				
						oItem.value = Form._getXhtmlText(oItem.value);
					}
				}
				break;
			case "select-one":
				if (oItem.getAttribute("required") && oItem.value == "") {
					alert(oItem.getAttribute("alert")); bCheck = false;
				}
				break;	
			case "select-multiple":
				// vybereme vsechny moznosti
				if (oItem.getAttribute("selectAll")) {
					for (var j = 0; j < oItem.options.length; j++) {
						oItem.options[j].selected = true;
					}
				}
				if (oItem.getAttribute("required") && oItem.options.length < 1) {
					alert(oItem.getAttribute("alert")); bCheck = false;
				}
				break;	
			case "checkbox":
				if (oItem.getAttribute("required") && !oItem.checked) {
					alert(oItem.getAttribute("alert")); bCheck = false;
				}
				break;
			case "radio":
				if (oItem.getAttribute("required") && !oItem.checked) {
					alert(oItem.getAttribute("alert")); bCheck = false;
				}
				break;
		}
		return bCheck;
	},
	// opraveni Event objektu
	_fixEvent : function(oEvent) {
		if (typeof oEvent == 'undefined') oEvent = window.event;
		if (typeof oEvent.target == 'undefined') oEvent.target = oEvent.srcElement;
		if (typeof oEvent.layerX == 'undefined') oEvent.layerX = oEvent.offsetX;
		if (typeof oEvent.layerY == 'undefined') oEvent.layerY = oEvent.offsetY;
		if ((typeof oEvent.which == 'undefined') && oEvent.keyCode) oEvent.which = oEvent.keyCode;
		if (!oEvent.preventDefault) oEvent.preventDefault = function() {
			oEvent.returnValue = false;
		}
		return oEvent;
	},
	// prevod textu na XHTML validni text
	_getXhtmlText : function (sText) {
		sText = sText.replace(/\&(?!#[0-9]*;)/g,"&#38;");	// nahrazeni znaku & (ele jen pokud to neni entita &#cislo;
		sText = sText.replace(/\"/g,"&#34;");			// nahrazeni znaku "
		sText = sText.replace(/\'/g,"&#39;");			// nahrazeni znaku '	
		sText = sText.replace(/\</g,"&#60;");			// nahrazeni znaku < 
		sText = sText.replace(/\>/g,"&#62;");			// nahrazeni znaku >
		sText = Form._trim(sText);
		
		return sText;
	},
	// orezani mezer z textove hodnoty
	_trim: function (sText) {
		return sText.replace(/^\s*|\s*$/g,"");
	},
	// pridani vyberu ze selectu
	addFromOption : function (oToInput,oFromSelect) {
		// pokud je vybrana polozka ve zdrojovem selectu
		if (oFromSelect.selectedIndex != -1) {
			switch (oToInput.type) {
				// cilovy prvek je text input
				case "text":
					oToInput.value = oFromSelect[oFromSelect.selectedIndex].value;
					break;
				// cilem je select
				case "select-multiple":
					var iFromSelectedIndex = oFromSelect.selectedIndex;
					var oFromOption = oFromSelect[iFromSelectedIndex];
					var oToOption = document.createElement("option");
					
					oToOption.value = oFromOption.value;
					oToOption.text = oFromOption.text;
					oToInput.options.add(oToOption);
					oFromSelect.remove(iFromSelectedIndex);					
					break;
			}
		}
	},
	// kontrola fomulare
	checkForm : function (oForm) {		
		var bSubmit = true;	
		
		for (var i = 0; i < oForm.elements.length; i ++) {			
			if(!Form._checkItem(oForm.elements[i])) {bSubmit = false;}
		}
		return bSubmit;
	},
	// kontrola stisknute klavesy
	checkKey : function(oEvent, sType) {
		var oEvent = Form._fixEvent(oEvent);

		with (oEvent) {
			var iKeyCode = oEvent.which;
			
			switch (sType) {
				// zadavani jen cisel
				case "number":			
					if (!(iKeyCode >= 48 && iKeyCode <= 57)) 
						oEvent.preventDefault();
					break;
				// zadavani malych pismen
				case "lowerChar":
					if (!(iKeyCode >= 97 && iKeyCode <= 122))
						oEvent.preventDefault();
					break;
				// zadavani URL: cisla, pismena, - , . , \ , : , _ 
				case "url":
					if (!(iKeyCode >= 48 && iKeyCode <= 57) && !(iKeyCode >= 97 && iKeyCode <= 122) && !(iKeyCode == 45 || iKeyCode == 46 || iKeyCode == 47 || iKeyCode == 58 || iKeyCode == 95))
						oEvent.preventDefault();
					break;
				// zadavani URL pro adresare: cisla, pismena, - , _
				case "folderUrl":
					if (!(iKeyCode >= 48 && iKeyCode <= 57) && !(iKeyCode >= 97 && iKeyCode <= 122) && !(iKeyCode == 45 || iKeyCode == 95))
						oEvent.preventDefault();
					break;
				// zadavani emailu: cisla, pismena, - , . , @ , _
				case "email":
					if (!(iKeyCode >= 48 && iKeyCode <= 57) && !(iKeyCode >= 97 && iKeyCode <= 122) && !(iKeyCode == 45 || iKeyCode == 46 || iKeyCode == 64 || iKeyCode == 95 ))
						oEvent.preventDefault();
					break;
			}
		}
	},
	// oznaci/odznaci vsechny Checkboxy
	checkUncheck : function (field,thisField) {		
		var checkedVal = thisField.checked;	
		
		for (i = 0; i < field.length; i++) {			
			field[i].checked = checkedVal ;
		}
	},	
  // generovani nahodneho retezce
	genRandom : function (oInput, iSize) {
		var sChars = "abcdefghijklmnopqrstuvwxyz1234567890";
		var sTemp = "";

		for (i = 0; i < iSize; i++) {
			sChar = sChars.charAt(Math.random() * sChars.length + 1); 
			sTemp += sChar;
		}
		oInput.value = sTemp;
	},
	// inicializace
	init : function () {
		var oInputs = document.getElementsByTagName("input");
		
		for (var i = 0; i < oInputs.length; i++) {
			var oInput = oInputs[i];
			
			// nastaveni focus-u na prvek formulare
			if(oInput.getAttribute("focused") == "true") {
				oInput.focus();
				oInput.select();
			}
		}
	},
	// vlozeni zadane hodnoty do jineho prvku
	pasteContent : function (oFromInput,oToInput) {
		oToInput.value = oToInput.value + oFromInput.value;
	},
	// vlozeni terminu Od Do na n dnu dopredu
	pasteDate : function (InputOd,InputDo,ValueD,thisField,secondField) {
		if (thisField.checked) {
			InputOd.value = new Date().getDate() + '.' + (new Date().getMonth() + 1) + '.' + new Date().getFullYear();
			var D = new Date();
			D.setDate(D.getDate()+ValueD);
			InputDo.value = D.getDate() + '.' + (D.getMonth() + 1) + '.' + D.getFullYear();
			for (i = 0; i < secondField.length; i++) {			
				secondField[i].checked = false ;
			}
		}
		else {
			InputOd.value = "";
			InputDo.value = "";
		}
	},
	// vlozeni jmena vybraneho souboru do input
	pasteFileName : function (oFromInput,oToInput) {
		var sPath = oFromInput.value;
		
		oToInput.value = sPath.substring(sPath.lastIndexOf("\\") + 1,sPath.lastIndexOf("."));
	},
	// odstraneni moznosti ze selectu
	removeOption : function (oFromSelect) {
		if (oFromSelect.selectedIndex != -1) {
			oFromSelect.remove(oFromSelect.selectedIndex);
		}	
	},
	// odeslani formulare pomoci odkazu
	submitForm : function (oForm, sWaitElementId) {
		var bSubmit = true;	
		
		// zkontrolujeme polozky formulare
		for (var i = 0; i < oForm.elements.length; i ++) {			
			if(!Form._checkItem(oForm.elements[i])) {bSubmit = false;}
		}	
		// odeslani formulare
		if (bSubmit) {
			oForm.submit();
			// zobrazime hlaseni o praci systemu
			if (typeof(RPC) != "undefined") {
				RPC.wait(sWaitElementId);
			}
		}
	}
};
// inicializace pri window.onload
Form._addEvent(window, "load", Form.init);
// inicializace pro PRC
if (typeof(RPC) != "undefined") {RPC.addOnLoad("Form.init();");}