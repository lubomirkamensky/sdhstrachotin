Editor = {	
	// vsechny editory na strance
	_editors : [],
	// identifikace prohlizece IE
	_isIE : ((navigator.userAgent.toLowerCase().indexOf("msie") != -1) && (navigator.userAgent.toLowerCase().indexOf("opera") == -1)),
	// identifikace prohlizecu Gecko
	_isGecko : (navigator.product == "Gecko"),
	// slovnik popisku
	_labels : [
		{_name: "enter_link",_translations: [
			{_lang: "cs",_label: "Zadejte odkaz"},
			{_lang: "en",_label: "Enter link"},
			{_lang: "de",_label: "Verweis einfügen"}
		]},
		{_name: "enter_url",_translations: [
			{_lang: "cs",_label: "Zadejte URL"},
			{_lang: "en",_label: "Enter URL"},
			{_lang: "de",_label: "URL einfügen"}
		]},
		{_name: "enter_rows",_translations:[
			{_lang: "cs",_label: "Zadejte poèet øádkù tabulky"},
			{_lang: "en",_label: "Enter table rows count"},
			{_lang: "de",_label: "Anzahl von Tabellenzeilen"}
		]},
		{_name: "enter_cols",_translations:[
			{_lang: "cs",_label: "Zadejte poèet sloupcù tabulky"},
			{_lang: "en",_label: "Enter table cols count"},
			{_lang: "de",_label: "Anzahl von Tabellenspalten"}
		]},
		{_name: "enter_border",_translations:[
			{_lang: "cs",_label: "Zadejte velikost rámeèku tabulky"},
			{_lang: "en",_label: "Enter table border size"},
			{_lang: "de",_label: "Größe von Tabellenrahmen einfügen"}
		]},
		{_name: "enter_width",_translations:[
			{_lang: "cs",_label: "Zadejte šíøku tabulky"},
			{_lang: "en",_label: "Enter table width"},
			{_lang: "de",_label: "Einfügen Breite der Tabelle"}
		]},
		{_name: "open_in_new_window",_translations:[
			{_lang: "cs",_label: "Otevøít v novém oknì"},
			{_lang: "en",_label: "Open in new window"},
			{_lang: "de",_label: "öffnen im neuen Fenster"}
		]}
	],
	// jazyk ve kterem je napsana stranka
	_lang : document.getElementsByTagName("html")[0].getAttribute("lang") ? document.getElementsByTagName("html")[0].getAttribute("lang") : "cs",
	// povolene tagy a jejich dalsi nastaveni
	_tags : [
		{_name: "a",_attrs: [{_name: "class",_required: false,_default: ""},{_name: "href",_required: false,_default: ""},{_name: "target", _required: false,_default: ""},{_name: "title",_required: false,_default: ""}],_short: false,_empty: false},
		{_name: "b",_attrs: [],_short: false,_empty: false},
		{_name: "blockquote",_attrs: [],_short: false,_empty: false},
		{_name: "big",_attrs: [],_short: false,_empty: false},
		{_name: "small",_attrs: [],_short: false,_empty: false},
		{_name: "span",_attrs: [{_name: "class",_required: false,_default: ""}],_short: false,_empty: false},
		{_name: "sub",_attrs: [],_short: false,_empty: false},
		{_name: "sup",_attrs: [],_short: false,_empty: false},
		{_name: "strong",_attrs: [],_short: false,_empty: false},
		{_name: "u",_attrs: [],_short: false,_empty: false},
		{_name: "i",_attrs: [],_short: false,_empty: false},
		{_name: "img",_attrs: [{_name: "align",_required: false,_default: ""},{_name: "class",_required: false,_default: ""},{_name: "src",_required: false,_default: ""},{_name: "title",_required: false,_default: ""},{_name: "alt",_required: false,_default: ""}],_short: true,_empty: true},
		{_name: "em",_attrs: [],_short: false,_empty: false},
		{_name: "p",_attrs: [{_name: "align",_required: false,_default: ""},{_name: "class",_required: false,_default: ""}],_short: false,_empty: false},
		{_name: "br",_attrs: [],_short: true,_empty: true},
		{_name: "hr",_attrs: [],_short: true,_empty: true},
		{_name: "table",_attrs: [{_name: "border",_required: false,_default: ""},{_name: "class",_required: false,_default: ""},{_name: "height",_required: false,_default: ""},{_name: "width",_required: false,_default: ""},{_name: "cellspacing",_required: false,_default: ""}],_short: false,_empty: false},
		{_name: "thead",_attrs: [],_short: false,_empty: false},
		{_name: "tbody",_attrs: [],_short: false,_empty: false},
		{_name: "tfoot",_attrs: [],_short: false,_empty: false},
		{_name: "tr",_attrs: [{_name: "class",_required: false,_default: ""}],_short: false,_empty: false},
		{_name: "td",_attrs: [{_name: "align",_required: false,_default: ""},{_name: "class",_required: false,_default: ""},{_name: "colspan",_required: false,_default: ""},{_name: "rowspan",_required: false,_default: ""}],_short: false,_empty: true},
		{_name: "ul",_attrs: [{_name: "class",_required: false,_default: ""}],_short: false,_empty: false},
		{_name: "ol",_attrs: [{_name: "class",_required: false,_default: ""}],_short: false,_empty: false},
		{_name: "li",_attrs: [{_name: "class",_required: false,_default: ""}],_short: false,_empty: false},
		{_name: "object",_attrs: [{_name: "classid",_required: false,_default: ""},{_name: "codebase",_required: false,_default: ""},{_name: "width",_required: false,_default: ""},{_name: "height",_required: false,_default: ""}],_short: false,_empty: false},
		{_name: "param",_attrs: [{_name: "name",_required: false,_default: ""},{_name: "value",_required: false,_default: ""}],_short: true,_empty: true}
	],
	// pomocna promena pro prevod obsahu na XHTML validni kod
	_xhtml : "",
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
	// test jestli je mozne hodnotu atribut pouzit
	_canUseAttributeValue : function (oAttribute) {
		// hodnota je zadana a nejedna se o atributy colspan, nebo rowspan s hodnotou = 1 (vychozi hodnota, tudis nemusi tam byt)
		if (oAttribute.value != null && oAttribute.value != "" && !((oAttribute.name.toLowerCase() == "colspan" || oAttribute.name.toLowerCase() == "rowspan") && oAttribute.value == 1)) {
			return true;
		} else {
			return false;
		}
	},
	// zaktivni pracovni okno editoru
	_focus : function (oEditor) {	
		if (oEditor._mode == "text") {
			oEditor._textArea.focus();
		} else {
			oEditor._win.focus();
		}
	},
	// vrati editor ze seznamu editoru (Editor._editors)
	_getEditor : function (sEditorID) {
		for (var i = 0; i < Editor._editors.length; i++) {
			if (Editor._editors[i]._id == sEditorID) return Editor._editors[i];
		}
	},
	// najde atribut element podle zadaneho jmena (musime dohledavat pomoci funkce kvuli IE srackometarne - colspan x colSpan, rowspan x rowSpan, ...)
	_getElementAttribute : function (oAttributes, sAttributeName) {
		for (var i = 0; i < oAttributes.length; i++) {		
			var oAttribute = oAttributes[i];
			
			if (oAttribute.name.toLowerCase() == sAttributeName) {
				return oAttribute;
			}
		}
	},
	// ziskani labelu ze slovniku
	_getLabel : function (sLabel) {
		for (var i = 0; i < Editor._labels.length; i++) {
			if (Editor._labels[i]._name == sLabel) {				
				for (var j = 0; j < Editor._labels[i]._translations.length; j++) {
					if (Editor._labels[i]._translations[j]._lang == Editor._lang) return Editor._labels[i]._translations[j]._label;
				}
			}
		}
	},
	// nalezeni nadrazeneho elementu
	_getParentNode : function (oNode, sNodeName) {					
		var oParentNode = oNode.parentNode;
		
		if (oParentNode) {
			if (oParentNode.nodeName.toLowerCase() == sNodeName) {
				return oParentNode;			
			} else {
				Editor._getParentNode(oParentNode, sNodeName);
			}
		}
	},
	// vrati tag ze seznamu tagu (Editor._tags)
	_getTag : function (sTagName) {
		for (var i = 0; i < Editor._tags.length; i++) {
			if (Editor._tags[i]._name == sTagName.toLowerCase()) return Editor._tags[i];
		}
	},	
	// prevod obsahu editoru na XHTML validni kod
	_getXhtml : function (oEditor) {
		// vymazani pomocne promene pro ukladani XHTML kodu		
		Editor._xhtml = "";
		
		if (oEditor._mode == "text") oEditor._doc.body.innerHTML = oEditor._textArea.value;
		Editor._getXhtmlElement(oEditor._doc.body);
		oEditor._textArea.value = Editor._xhtml;
		oEditor._doc.body.innerHTML = Editor._xhtml;
	},
	// prevod atributu na XHTML validni atribut
	_getXhtmlAttribut : function (oElementAttribute, oTagAttribute) {
		// pokud je predany atribut elementu
		if (oElementAttribute) {
			// atribut je povinny
			if (oTagAttribute._required) {
				// hodnota je zadana
				if (Editor._canUseAttributeValue(oElementAttribute)) {
					Editor._xhtml += " "+ oElementAttribute.name.toLowerCase() +"=\""+ Editor._getXhtmlText(oElementAttribute.value) +"\"";
				// hodnota neni zadana, vlozime vychozi
				} else {
					Editor._xhtml += " "+ oTagAttribute._name +"=\""+ oTagAttribute._default +"\"";
				}
			// atribut neni povinny
			} else {
				// hodnota je zadana a nejedna se o atributy colspan, nebo rowspan s hodnotou = 1 (vychozi hodnota, tudis nemusi tam byt)
				if (Editor._canUseAttributeValue(oElementAttribute)) {
					Editor._xhtml += " "+ oElementAttribute.name.toLowerCase() +"=\""+ Editor._getXhtmlText(oElementAttribute.value) +"\"";
				}
			}
		}
	},
	// prevod elementu na XHTML validni element
	_getXhtmlElement : function (oElement, oTag) {
		switch (oElement.nodeType) {
			// element je tag
			case 1:
				var oTag = Editor._getTag(oElement.nodeName);
				
				// tag je povoleny, zpracujeme ho
				if (oTag) {
					// ma zanorene tagy
					if (oElement.childNodes.length > 0) {
						Editor._xhtml += "<"+ oTag._name;
						// atributy
						for (var i = 0; i < oTag._attrs.length; i++) {
							var oTagAttribute = oTag._attrs[i];
							var oElementAttribute = Editor._getElementAttribute(oElement.attributes, oTagAttribute._name);
							
							Editor._getXhtmlAttribut(oElementAttribute, oTagAttribute);
						}
						Editor._xhtml += ">";
						// zanorene tagy
						for (var i = 0; i < oElement.childNodes.length; i++) {
							Editor._getXhtmlElement(oElement.childNodes[i]);
						}
						Editor._xhtml += "</"+ oTag._name +">";
					}
					// nema zanorene tagy a je povoleno aby byl tag prazdny
					if (oElement.childNodes.length == 0 && oTag._empty) {
						Editor._xhtml += "<"+ oTag._name;
						// atributy
						for (var i = 0; i < oTag._attrs.length; i++) {
							var oTagAttribute = oTag._attrs[i];
							var oElementAttribute = Editor._getElementAttribute(oElement.attributes, oTagAttribute._name);
												
							Editor._getXhtmlAttribut(oElementAttribute, oTagAttribute);
						}
						// zkraceny zapis tagu
						if (oTag._short) {
							Editor._xhtml += "/>";
						// nezkraceny zapis
						} else {
							Editor._xhtml += "></"+ oTag._name +">";
						}
					}
				// tag neni povoleny, projdeme zanorene tagy
				} else {
					for (var i = 0; i < oElement.childNodes.length; i++) {
						Editor._getXhtmlElement(oElement.childNodes[i]);
					}
				}
				break;
			// element je text
			case 3:
				Editor._xhtml += Editor._getXhtmlText(oElement.nodeValue);
				break;			
		}
	},
	// prevod textu na XHTML validni text
	_getXhtmlText : function (sText) {
		sText = sText.replace(/\&(?!#[0-9]*;)/g,"&#38;");	// nahrazeni znaku & (ele jen pokud to neni entita &#cislo;
		sText = sText.replace(/\"/g,"&#34;");			// nahrazeni znaku "
		sText = sText.replace(/\'/g,"&#39;");			// nahrazeni znaku '	
		sText = sText.replace(/\</g,"&#60;");			// nahrazeni znaku < 
		sText = sText.replace(/\>/g,"&#62;");			// nahrazeni znaku > 
		
		return sText;
	},
	// vlozeni HTML kodu
	_pasteHtml : function (oEditor, sHTML) {
		if (Editor._isIE) {			
			oEditor._doc.selection.createRange().pasteHTML(sHTML);
		}
		if (Editor._isGecko) {
			var oInsertNode = oEditor._doc.createDocumentFragment();
			var div = oEditor._doc.createElement("div");
			
			div.innerHTML = sHTML;
			while (div.firstChild) {
				oInsertNode.appendChild(div.firstChild);
			}
			
			var sel = oEditor._win.getSelection();			
			var range = sel.getRangeAt(0);
			
			sel.removeAllRanges();
			range.deleteContents();
			
			var container = range.startContainer;
			var pos = range.startOffset;
			
			range=document.createRange();
			
			if (container.nodeType==3 && oInsertNode.nodeType==3) {
				container.insertData(pos, oInsertNode.nodeValue);
				range.setEnd(container, pos+oInsertNode.length);
				range.setStart(container, pos+oInsertNode.length);
			} else {
				var afterNode;
				if (container.nodeType==3) {
					var textNode = container;
					
					container = textNode.parentNode;
					
					var text = textNode.nodeValue;
					var textBefore = text.substr(0,pos);
					var textAfter = text.substr(pos);
					var beforeNode = document.createTextNode(textBefore);
					var afterNode = document.createTextNode(textAfter);

					container.insertBefore(afterNode, textNode);
					container.insertBefore(oInsertNode, afterNode);
					container.insertBefore(beforeNode, oInsertNode);
					container.removeChild(textNode);
				} else {
					afterNode = container.childNodes[pos];
					container.insertBefore(oInsertNode, afterNode);
				}
				range.setEnd(afterNode, 0);
				range.setStart(afterNode, 0);
			}
			sel.addRange(range);
		}	
	},
	// zmena modu editoru
	_switchMode : function (oEditor) {
		switch (oEditor._mode) {
			case "html":
				oEditor._textArea.style.display = "block";				
				oEditor._iframe.style.display = "none";				
				oEditor._mode = "text";
				break;
			case "text":
				oEditor._textArea.style.display = "none";
				oEditor._iframe.style.display = "block";				
				oEditor._mode = "html";
				// v gecko vypadava designMode
				if (Editor._isGecko) {
					oEditor._doc.designMode = "off";
					oEditor._doc.designMode = "on";
				}
				break;
		}
	},
	// provedeni prikazu
	doCmd : function (sEditorID, sCmd, bUserInterface, sValue) {
		var oEditor = Editor._getEditor(sEditorID);

		Editor._focus(oEditor);
		switch (sCmd) {
			// pridani radku
			case "AddRow":
				if (oEditor._mode == "html") {
					var oTr = Editor._getParentNode(Editor._isIE ? oEditor._doc.selection.createRange().parentElement() : oEditor._win.getSelection().getRangeAt(0).startContainer,"tr");
					
					if (oTr) {
						var oNewTr = oEditor._doc.createElement("tr");

						for (var i = 0; i < oTr.childNodes.length; i++) {
							var oTdTag = Editor._getTag("td");
							var oOldTd = oTr.childNodes[i];
							var oNewTd = oEditor._doc.createElement("td");
														
							oNewTd.innerHTML = "text";
							oNewTr.appendChild(oNewTd);
						}
						oTr.parentNode.insertBefore(oNewTr, oTr.nextSibling);
					}
				}
				break;
			// kontrola obsahu (prevod na XHTML)
			case "CheckContent":
				Editor._getXhtml(oEditor);
				break;
			// vlozeni tabulky
			case "CreateTable":
				if (oEditor._mode == "html") {
					var iRows = prompt(Editor._getLabel("enter_rows"),"1");
					var iCols = prompt(Editor._getLabel("enter_cols"),"1");
					var iBorder = prompt(Editor._getLabel("enter_border"),"1");
					var sWidth = prompt(Editor._getLabel("enter_width"),"100%");

					if (iRows > 0 && iCols > 0) {
						sHTML = "<table border="+ iBorder +" width="+ sWidth +">";
						for (var i = 0; i < iRows; i++) {
							sHTML += "<tr>";
							for (var j = 0; j < iCols; j++) {
								sHTML += "<td>text</td>";
							}
							sHTML += "</tr>";
						}
						sHTML += "</table>";
						Editor._pasteHtml(oEditor, sHTML);
					}
				}
				break;
			// vlozeni odkazu
			case "CreateLink":
				if (oEditor._mode == "html") {
					var sURL = prompt(Editor._getLabel("enter_url"),"http://");
					var sLink = prompt(Editor._getLabel("enter_link"),Editor._isIE ? oEditor._doc.selection.createRange().text : oEditor._win.getSelection().getRangeAt(0).toString());
					var bOpenInNewWindow = confirm(Editor._getLabel("open_in_new_window"))
					
					if (sURL && sLink) {
						// otevreme odkaz v novem okne
						if (bOpenInNewWindow) {
							Editor._pasteHtml(oEditor,"<a href='"+ sURL +"' target='_blank'>"+ sLink +"</a>");
						// odkaz se otevre ve stejnem okne
						} else {
							Editor._pasteHtml(oEditor,"<a href='"+ sURL +"'>"+ sLink +"</a>");
						}
					}
				}
				break;
			// odstraneni radku
			case "DelRow":
				if (oEditor._mode == "html") {
					var oTr = Editor._getParentNode(Editor._isIE ? oEditor._doc.selection.createRange().parentElement() : oEditor._win.getSelection().getRangeAt(0).startContainer,"tr");

					if (oTr) oTr.parentNode.removeChild(oTr);
				}
				break;
			// prepnuti modu
			case "SwitchMode":
				Editor._getXhtml(oEditor);
				Editor._switchMode(oEditor);
				break;
			// provedeni prikazu pomoci "execCommand"
			default:
				// zrusime ukladani formatovani v Gecku jako css vlastnosti do atributu style
				if (Editor._isGecko) oEditor._doc.execCommand("useCSS", false, true);
				if (oEditor._mode == "html") oEditor._doc.execCommand(sCmd, bUserInterface, sValue);
		}	
	},
	// inicializace
	init : function () {
		var oTextAreas = document.getElementsByTagName("textarea");		
		
		Editor._editors = []; // pri RPC zustavala kolekce naplnena
		for (var i = 0; i < oTextAreas.length; i++) {		
			if(oTextAreas[i].className == "editor") {
				oTextArea = oTextAreas[i];
				oTextArea.style.display = "none";
				oIframe = document.createElement("iframe");				
				oTextArea.parentNode.appendChild(oIframe);
				oIframe.style.width = oTextArea.style.width;
				oIframe.style.height = oTextArea.style.height;
				oIframe.contentWindow.document.open();
				oIframe.contentWindow.document.write("<html><head><link rel='stylesheet' type='text/css' href='../css/editor_content.css'/></head><body>"+ oTextArea.value +"</body></html>");
				oIframe.contentWindow.document.close();
				oIframe.contentWindow.document.designMode = "on";				
				// inicializace vsech editoru na strance
				Editor._editors[Editor._editors.length] = {
					_id : oTextArea.getAttribute("id"),
					_textArea : oTextArea,
					_iframe : oIframe,
					_win : oIframe.contentWindow,
					_doc : oIframe.contentWindow.document,
					_mode : "html"			
				};
			}
		}
	},	
	// vlozeni obrazku
	// MBU: 01.08.2006 - pridana class "system_link_deposit", ktera budou slouzit ke kontrole aktualnosti URL (atribut ID nejde k predavani pouzit, protoze se podle nej dohledavaji elementy pri publikovani sdilenych stranek)
	
	pasteImage : function (sEditorID, sURL, sName, sAlignSelectID, sDeposit) {
		var oEditor = Editor._getEditor(sEditorID);
		var oAlignSelect = document.getElementById(sAlignSelectID);
		
		// pokud je editor v textovem rezimu, prepneme ho do editovaciho rezimu
		if (oEditor._mode == "text") Editor._switchMode(oEditor);
		Editor._focus(oEditor);
		Editor._pasteHtml(oEditor,"<img class='foto system_link_"+ sDeposit +"' src='"+ sURL +"' alt='"+ sName +"' align='"+ oAlignSelect.value +"'/>");
	},
	// vlozeni souboru do editoru
	// MBU: 01.08.2006 - pridana class "system_link_deposit", ktera budou slouzit ke kontrole aktualnosti URL (atribut ID nejde k predavani pouzit, protoze se podle nej dohledavaji elementy pri publikovani sdilenych stranek)
	
	pasteFile : function (sEditorId, sURL, sName, sDeposit) {
		var oEditor = Editor._getEditor(sEditorId);

		// pokud je editor v textovem rezimu, prepneme ho do editovaciho rezimu
		if (oEditor._mode == "text") Editor._switchMode(oEditor);
		Editor._focus(oEditor);
		Editor._pasteHtml(oEditor,"<a class='system_link_"+ sDeposit +"' href='"+ sURL +"' target='_blank'>"+ sName +"</a>");
	},
	// vlozeni tagu
	pasteTag : function (sEditorId, oSelectTag) {
		var oEditor = Editor._getEditor(sEditorId);
		
		if (oEditor._mode == "html") {
			Editor._focus(oEditor);
			
			switch (oSelectTag.value) {
				// zvetseny text
				case "big":
					Editor._pasteHtml(oEditor,"<big>text</big> ");
					break;
				// zmenseny text
				case "small":
					Editor._pasteHtml(oEditor,"<small>text</small> ");
					break;
				// dolni index
				case "sub":
					Editor._pasteHtml(oEditor,"<sub>text</sub> ");
					break;
				// horni index
				case "sup":
					Editor._pasteHtml(oEditor,"<sup>text</sup> ");
					break;
				// citace
				case "cite":
					Editor._pasteHtml(oEditor,"<cite>text</site> ");
					break;	
				// dulezite
				case "important":
					Editor._pasteHtml(oEditor,"<span class='important'>text</span> ");
					break;						
			}
		}
		// smazeme vyber
		oSelectTag.selectedIndex = 0;
	}
};
// inicializace pri window.onload
Editor._addEvent(window, "load", Editor.init);
// inicializace pro PRC
if (typeof(RPC) != "undefined") {RPC.addOnLoad("Editor.init();");}