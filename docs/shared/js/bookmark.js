Bookmark = {
	// vsechny sady zalozek na strance
	_bookmarks : [],
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
	// vrati sadu zalozek ze seznamu (Bookmark._bookmarks)
	_getBookmark : function (sBookmarkID) {
		for (var i = 0; i < Bookmark._bookmarks.length; i++) {
			if (Bookmark._bookmarks[i]._id == sBookmarkID) return Bookmark._bookmarks[i];
		}
	},
	// vrati vsechny zalozky v zalozkach
	_getBookmarkItems : function (oBookmark) {
		var oItems = [];
		var oBookmarkChilds = oBookmark.childNodes;
		
		for (var i = 0; i < oBookmarkChilds.length; i++) {
			var oBookmarkChild = oBookmarkChilds[i];			
			
			if (oBookmarkChild.nodeType == 1 && oBookmarkChild.className.indexOf("bookmark") != -1 && oBookmarkChild.tagName == "DIV") {
				oItems[oItems.length] = oBookmarkChild;
			}
		}
		
		return oItems;
	},
	// vrati vsechny prepinase v zalozkach
	_getBookmarkSwitches : function (oBookmark) {
		var oSwitches = [];
		var oBookmarkChilds = oBookmark.childNodes;
		
		for (var i = 0; i < oBookmarkChilds.length; i++) {
			var oBookmarkChild = oBookmarkChilds[i];
			
			if (oBookmarkChild.className == "switches" && oBookmarkChild.tagName == "UL") {
				var oSwitchesChilds = oBookmarkChild.childNodes;
				
				for (var j = 0; j < oSwitchesChilds.length; j++) {
					var oSwitchesChild = oSwitchesChilds[j];
					
					if (oSwitchesChild.nodeType == 1 && oSwitchesChild.className.indexOf("switch") != -1 && oSwitchesChild.tagName == "LI") {
						oSwitches[oSwitches.length] = oSwitchesChild;
					}
				}
			}
		}
		return oSwitches;
	},
	// inicializace
	init : function () {
		var oBookmarks = document.getElementsByTagName("div");
		
		Bookmark._bookmarks = []; // pri RPC zustavala kolekce naplnena
		for (var i = 0; i < oBookmarks.length; i++) {
			if (oBookmarks[i].className == "bookmarks") {
				var oBookmark = oBookmarks[i];				
				var oItems = Bookmark._getBookmarkItems(oBookmark);
				var oSwitches = Bookmark._getBookmarkSwitches(oBookmark);
				
				for (var j = 0; j < oItems.length; j++) {
					if (oItems[j].className == "bookmark active") {
						oItems[j].style.display = "block";
					} else {
						oItems[j].style.display = "none";
					}		
				}			
				Bookmark._bookmarks[Bookmark._bookmarks.length] = {
					_id : oBookmark.id,
					_items : oItems,
					_switches : oSwitches
				};
			}
		}
	},
	// zobrazeni zalozky ve formulari
	show : function (sBookmarkID, sItemID) {
		var oBookmark = Bookmark._getBookmark(sBookmarkID);		
		
		for (var i = 0; i < oBookmark._switches.length; i++) {
			var oSwitch = oBookmark._switches[i];
			
			if (oSwitch.id == sItemID) {
				oSwitch.className = "switch active";
			} else {
				oSwitch.className = "switch";
			}
		}
		for (var j = 0; j < oBookmark._items.length; j++) {
			var oItem = oBookmark._items[j];

			if (oItem.id == sItemID) {				
				oItem.style.display = "block";
				oItem.className = "bookmark active";
			} else {
				oItem.style.display = "none";
				oItem.className = "bookmark";
			}		
		}	
	}
};
// inicializace pri window.onload
Bookmark._addEvent(window, "load", Bookmark.init);
// inicializace pro PRC
if (typeof(RPC) != "undefined") {RPC.addOnLoad("Bookmark.init();");}