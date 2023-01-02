Calendar = {
	// kalendar
	_calendar : null,
	// format datumu
	_format : "",
	// formularovy prvek
	_input : null,
	// popisky
	_labels : [
		{_name: "calendar",_translations: [
			{_lang: "cs",_label: "Kalendáø"},
			{_lang: "en",_label: "Calendar"},
			{_lang: "de",_label: "Kalender"}
		]},
		{_name: "close",_translations: [
			{_lang: "cs",_label: "Zavøít"},
			{_lang: "en",_label: "Close"},
			{_lang: "de",_label: "Schließen"}
		]},
		{_name: "today",_translations: [
			{_lang: "cs",_label: "Dnes"},
			{_lang: "en",_label: "Today"},
			{_lang: "de",_label: "Heute"}
		]},
		{_name: "month_previous",_translations: [
			{_lang: "cs",_label: "Pøedchozí mìsíc"},
			{_lang: "en",_label: "Previous month"},
			{_lang: "de",_label: "Voriger Monat"}
		]},
		{_name: "month_next",_translations: [
			{_lang: "cs",_label: "Další mìsíc"},
			{_lang: "en",_label: "Next month"},
			{_lang: "de",_label: "Weiteren Monat"}
		]},
		{_name: "year_previous",_translations: [
			{_lang: "cs",_label: "Pøedchozí rok"},
			{_lang: "en",_label: "Previous year"},
			{_lang: "de",_label: "Voriges Jahr"}
		]},
		{_name: "year_next",_translations: [
			{_lang: "cs",_label: "Další rok"},
			{_lang: "en",_label: "Next year"},
			{_lang: "de",_label: "Weiteres Jahr"}
		]},
		{_name: "day_1",_translations: [
			{_lang: "cs",_label: "Po"},
			{_lang: "en",_label: "Mon"},
			{_lang: "de",_label: "Mo"}
		]},
		{_name: "day_2",_translations: [
			{_lang: "cs",_label: "Út"},
			{_lang: "en",_label: "Tue"},
			{_lang: "de",_label: "Di"}
		]},
		{_name: "day_3",_translations: [
			{_lang: "cs",_label: "St"},
			{_lang: "en",_label: "Wed"},
			{_lang: "de",_label: "Mi"}
		]},
		{_name: "day_4",_translations: [
			{_lang: "cs",_label: "Èt"},
			{_lang: "en",_label: "Thu"},
			{_lang: "de",_label: "Do"}
		]},
		{_name: "day_5",_translations: [
			{_lang: "cs",_label: "Pá"},
			{_lang: "en",_label: "Fri"},
			{_lang: "de",_label: "Fr"}
		]},
		{_name: "day_6",_translations: [
			{_lang: "cs",_label: "So"},
			{_lang: "en",_label: "Sat"},
			{_lang: "de",_label: "Sa"}
		]},
		{_name: "day_7",_translations: [
			{_lang: "cs",_label: "Ne"},
			{_lang: "en",_label: "Sun"},
			{_lang: "de",_label: "So"},
		]},
		{_name: "month_1",_translations: [
			{_lang: "cs",_label: "Leden"},
			{_lang: "en",_label: "Jan"},
			{_lang: "de",_label: "Januar"}
		]},
		{_name: "month_2",_translations: [
			{_lang: "cs",_label: "Únor"},
			{_lang: "en",_label: "Feb"},
			{_lang: "de",_label: "Februar"}
		]},
		{_name: "month_3",_translations: [
			{_lang: "cs",_label: "Bøezen"},
			{_lang: "en",_label: "Mar"},
			{_lang: "de",_label: "März"}
		]},
		{_name: "month_4",_translations: [
			{_lang: "cs",_label: "Duben"},
			{_lang: "en",_label: "Apr"},
			{_lang: "de",_label: "April"}
		]},
		{_name: "month_5",_translations: [
			{_lang: "cs",_label: "Kvìten"},
			{_lang: "en",_label: "May"},
			{_lang: "de",_label: "Mai"}
		]},
		{_name: "month_6",_translations: [
			{_lang: "cs",_label: "Èerven"},
			{_lang: "en",_label: "Jun"},
			{_lang: "de",_label: "Juni"}
		]},
		{_name: "month_7",_translations: [
			{_lang: "cs",_label: "Èervenec"},
			{_lang: "en",_label: "Jul"},
			{_lang: "de",_label: "Juli"}
		]},
		{_name: "month_8",_translations: [
			{_lang: "cs",_label: "Srpen"},
			{_lang: "en",_label: "Aug"},
			{_lang: "de",_label: "August"}
		]},
		{_name: "month_9",_translations: [
			{_lang: "cs",_label: "Záøí"},
			{_lang: "en",_label: "Sep"},
			{_lang: "de",_label: "September"}
		]},
		{_name: "month_10",_translations: [
			{_lang: "cs",_label: "Øíjen"},
			{_lang: "en",_label: "Oct"},
			{_lang: "de",_label: "Oktober"}
		]},
		{_name: "month_11",_translations: [
			{_lang: "cs",_label: "Listopad"},
			{_lang: "en",_label: "Nov"},
			{_lang: "de",_label: "November"}
		]},
		{_name: "month_12",_translations: [
			{_lang: "cs",_label: "Prosinec"},
			{_lang: "en",_label: "Dec"},
			{_lang: "de",_label: "Dezember"}
		]}
	],	
	// jazyk ve kterem je napsana stranka
	_lang : document.getElementsByTagName("html")[0].getAttribute("lang") ? document.getElementsByTagName("html")[0].getAttribute("lang") : "cs",
	
	// zjiskani labelu ze slovniku
	_getLabel : function (sLabel) {		
		for (var i = 0; i < Calendar._labels.length; i++) {
			if (Calendar._labels[i]._name == sLabel) {				
				for (var j = 0; j < Calendar._labels[i]._translations.length; j++) {
					if (Calendar._labels[i]._translations[j]._lang == Calendar._lang) return Calendar._labels[i]._translations[j]._label;
				}
			}
		}		
	},
	// zavreni okno s kalendarem
	_close : function () {
		Calendar._calendar.parentNode.removeChild(Calendar._calendar);
		Calendar._calendar = null;
		Calendar._input = null;
	},
	// vytvoreni kalendare
	_create : function (iDay, iMonth, iYear) {
		var sHTML = "";
		var oToday = new Date();
		var iDay = Number(iDay ? iDay : oToday.getDate());
		var iMonth = Number(iMonth ? iMonth : oToday.getMonth() + 1);		
		var iYear = Number(iYear ? iYear : oToday.getFullYear());
		// poradi prvniho dne mesice v tydnu (nedele = 0 ... sobota = 6)
		var iFirstMonthDay = Number(new Date(iYear,iMonth - 1,1).getDay());
		// pocet dni v mesici
		var iMonthDaysCount = Number(new Date(iYear,iMonth,0).getDate());
		// pomocna promena pro vypis dnu v mesici
		var iDayInWeek = 0;
		
		sHTML += "<table class='calendar'>";
		sHTML += "<tr class='navigation'>";
		// o rok zpet
		sHTML += "<td><a href='javascript: Calendar._create("+ iDay +","+ iMonth +","+ (iYear - 1) +")' title='"+ Calendar._getLabel("year_previous") +"'><<</a></td>";
		// o mesic zpet
		sHTML += "<td><a href='javascript: Calendar._create("+ iDay +","+ (iMonth == 1 ? 12 : iMonth - 1) +","+ (iMonth == 1 ? iYear - 1 : iYear) +")' title='"+ Calendar._getLabel("month_previous") +"'><</a></td>";	
		sHTML += "<td align='center' colspan='3'>"+ Calendar._getLabel("month_"+ iMonth) +"<br/>"+ iYear +"</td>";
		// o mesic dopredu
		sHTML += "<td><a href='javascript: Calendar._create("+ iDay +","+ (iMonth == 12 ? 1 : iMonth + 1) +","+ (iMonth == 12 ? iYear + 1 : iYear) +")' title='"+ Calendar._getLabel("month_next") +"'>></a></td>";
		// o rok dopredu
		sHTML += "<td><a href='javascript: Calendar._create("+ iDay +","+ iMonth +","+ (iYear + 1) +")' title='"+ Calendar._getLabel("year_next") +"'>>></a></td>";
		sHTML += "</tr>";
		// zahlavi dnu mesice
		sHTML += "<tr class='head'>";	
		for (var i = 1; i <= 7; i++) {
			sHTML += "<td align='center'>"+ Calendar._getLabel("day_"+ i); +"</td>";
		}
		// vypis dni mesice
		sHTML += "<tr class='days'>";
		// upravime poradi prvnoho dne (pondeli = 1 ... nedele = 7)
		iFirstMonthDay = iFirstMonthDay == 0 ? 7 : iFirstMonthDay;		
		// vynechane misto pred prvnim dnem mesice		
		for (i = 1; i < iFirstMonthDay; i++) {
			sHTML += "<td>&nbsp;</td>";
			iDayInWeek ++;
		}
		// jednotive dni v mesici
		for (i = 1; i <= iMonthDaysCount; i++) {
			var sClass = "";
			
			if (i == iDay) {
				sClass = "active";
			}
		
			if (iDayInWeek == 7) {
				sHTML += "</tr><tr class='days'>";
				iDayInWeek = 0;
			}
			iDayInWeek ++;			
			sHTML += "<td class='"+ sClass+"'><a href='javascript: Calendar._paste("+ i +","+ iMonth +","+ iYear +")' title='"+ i +"."+ iMonth +"."+ iYear +"'>" + i + "</a></td>"
		}
		// vynechane misto za poslednim dnem mesice
		for (i = iDayInWeek; i < 7; i++) {
			sHTML += "<td>&nbsp;</td>";
		}	
		sHTML += "</tr>";
		sHTML += "<tr class='foot'>";
		// vybrani dnesniho datumu
		sHTML += "<td align='left' colspan='3'><a class='today' href='javascript: Calendar._create("+ oToday.getDate() +","+ (oToday.getMonth() + 1) +","+ oToday.getFullYear() +");'>"+ Calendar._getLabel("today") +"</a></td>";
		sHTML += "<td></td>";
		// zavreni okna kalendare
		sHTML += "<td align='right' colspan='3'>";
		sHTML += "<a class='close' href='javascript: Calendar._close();'>"+ Calendar._getLabel("close") +"</a>";			
		sHTML += "<td>";
		sHTML += "</tr>";
		sHTML += "</table>";
		
		//alert(sHTML);
		Calendar._calendar.innerHTML = sHTML;
	},
	// vlozeni vybraneho datumu zpet do input prvku
	_paste : function (iDay, iMonth, iYear) {
		switch (Calendar._format) {
			case "MySQL":
				Calendar._input.value = iYear +"."+ iMonth +"."+ iDay;
				break;
			default:
				Calendar._input.value = iDay +"."+ iMonth +"."+ iYear;
				break;
		}
		Calendar._close();
	},	
	// otevreni okna s kalendarem
	open : function (oInput, sFormat) {
		var oCalendar = document.createElement("div");
		var aDate = oInput.value.split(".");
		
		oCalendar.className = "calendar";
		oCalendar.style.position = "absolute";
		oInput.parentNode.appendChild(oCalendar);
		// pokud je nejaky kalendar na strance otevreny, zavreme ho
		if (Calendar._calendar) Calendar._close();
		Calendar._calendar = oCalendar;
		Calendar._input = oInput;
		Calendar._format = sFormat;
		
		switch (sFormat) {
			case "MySQL":
				Calendar._create(aDate[2],aDate[1],aDate[0]);
				break;
			default:
				Calendar._create(aDate[0],aDate[1],aDate[2]);
				break;
		}		
	}
};