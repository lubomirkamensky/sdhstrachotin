// JavaScript Document
DbList = {
  // data source
  connectionString : null,
  // picasa albums user name
  picasaUser : null,
  // width of ico
  icoWidth : null,
  
  charsetDictionary : {},
  
  // element for table data
  _dbList : null,
  // element for search form
  _searchForm : null,
  // source Data for DB List
  _sourceData : null,
  // source Data for search form
  _sourceFormData : null,
  // sql queries for DB List
  _sqlQueries : null,
  // data source GID
  _gid : null,
  _dataTable : null,
  _imgItem : null,
  
  _imageNum : null,

  // initialization
  init : function() {

    // array with sql queries, filter parameters, form sql queries, form options names for all data sources based on GID
    DbList._sqlQueries =  [];
    DbList._sqlQueries.push(['select U,X,M,A where not A starts with "_" #where# label U "nazev",M "lokalita",X "popis",A "title"',['B','M','T'],'select A, M where not A starts with "_" label A "Typ",M "Lokalita"','Points of interest'])
    DbList._sqlQueries.push(['select W,AA,Q,Y,X,A where not A starts with "_" #where# label W "nazev",Q "lokalita",AA "popis",Y "termin",X "kde",A "title"',['B','Q','V'],'select L, K where not L starts with "_" label L "Typ",K "Lokalita"','Events'])
    DbList._sqlQueries.push(['select R,T,J,A where not A starts with "_" #where# label R "nazev",J "lokalita",T "popis",A "title"',['B','J','Q'],'select C, K where not C starts with "_" label C "Typ",K "Lokalita"','Activities'])
    DbList._sqlQueries.push(['select Q,S,A where not A starts with "_" #where# label Q "nazev", S "popis",A "title"',['B','J','C'],'select E where not E starts with "_" label E "Typ"','Programs'])
    DbList._sqlQueries.push(['select P,R,A where not A starts with "_" #where# label P "nazev", R "popis",A "title"',['B','I','C'],'select G where not G starts with "_" label G "Typ"','Routes'])
    DbList._sqlQueries.push(['select A,AL,I where not A starts with "_" #where# label A "nazev",I "lokalita",AL "popis"',['I','B','R','S','T','U','V','W','X','Y','Z','AA','AB','AC','AD','AE','AF','AG','AJ'],'select N, K where not N starts with "_" label N "Typ",K "Lokalita"','Accommodations'])
    DbList._sqlQueries.push(['select A,P,I where not A starts with "_" #where# label A "nazev",I "lokalita",P "popis"',['I','B','O'],'select I, K where not I starts with "_" label I "Typ",K "Lokalita"','Other services'])
    DbList._gid = DbList._querySt('gid')
    
    var pageTitle = document.getElementById('pageTitle');
    if (pageTitle) {
      pageTitle.innerHTML = DbList._sqlQueries[DbList._gid][3];
    }
    
    var where = '';
    
    for (var i = 0; i < DbList._sqlQueries[DbList._gid][1].length; i ++) {
      var name = DbList._sqlQueries[DbList._gid][1][i];
      var value = DbList._querySt(name);
      
      if (name && value) {
        var delimeter = ' and ';
        var arrayValue = value.split(';')
        if (arrayValue.length > 1) {
          where += ' and ('
          delimeter = ' or ';
          for (var q = 0; q < arrayValue.length; q++) {
            if (q == 0) {where = where + name +' contains "'+ arrayValue[q] +'"'}
            else {where = where + delimeter + name +' contains "'+ arrayValue[q] +'"'}
          }
          where += ')'
        }
        else {
        where = where + delimeter + name +' contains "'+ value +'"';  
        }      
      }
    }
    var orderString =  ' order by A';
    if (DbList._gid == 0)   {orderString =  ' order by M,A' }
    if (DbList._gid == 2)   {orderString =  ' order by J,A' }
    if (DbList._gid == 5)   {orderString =  ' order by I,A' }
    if (DbList._gid == 6)   {orderString =  ' order by I,A' }
    
    if (DbList._gid == 1 &&  DbList._querySt('E') && DbList._querySt('F') ) {
      var fromStr = DbList._querySt('E').split('.') ;
      var toStr = DbList._querySt('F').split('.');
      for (var x = 0; x < fromStr.length; x++) {
           if (fromStr[x].length == 1) {fromStr[x]= '0' + fromStr[x]};
           if (toStr[x].length == 1) {toStr[x]= '0' + toStr[x]};
      }
      
      where = where +  ' and date "' + fromStr[2] + '-' + fromStr[1] + '-' + fromStr[0] + '" <= F';
      where = where + ' and  date "' + toStr[2] + '-' + toStr[1] + '-' + toStr[0]  + '" >=E';
      orderString =  ' order by E';
    }
    
   else if (DbList._gid == 1)   {
      where = where +  ' and date "' + new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() + '" <= F';
      orderString =  ' order by E';
    }

    if (where != '')  {
      DbList._imageNum = 0
      if (DbList._gid == 0 ) {
        where = where + ' and U is not null and U <> ""';
        DbList._imageNum = 3;
      }
      if (DbList._gid == 1 ) {
        where = where + ' and W is not null and W <> ""';
        DbList._imageNum = 5;
      }
      if (DbList._gid == 2 ) {
        where = where + ' and R is not null and R <> ""';
        DbList._imageNum = 3;
      }
      if (DbList._gid == 3 ) {
        where = where + ' and Q is not null and Q <> ""';
        DbList._imageNum = 2;
      }
      if (DbList._gid == 4 ) {
        where = where + ' and P is not null and P <> ""';
        DbList._imageNum = 2;
      }
        where = where + orderString
      var sqlQuery = DbList._sqlQueries[DbList._gid][0].replace('#where#', where); 
      //alert(sqlQuery);
      DbList._sourceData = new google.visualization.Query(DbList.connectionString + DbList._gid);
      DbList._sourceData.setQuery(sqlQuery);
      DbList._sourceData.send(DbList._drawDbList);  
    }
    
    else  {
      var sqlQueryForm = DbList._sqlQueries[DbList._gid][2];
      DbList._sourceFormData = new google.visualization.Query(DbList.connectionString + '7');
      //alert(sqlQueryForm);
      DbList._sourceFormData.setQuery(sqlQueryForm);
      DbList._sourceFormData.send(DbList._drawSearchForm);
    }
  },
  
  _drawDbList : function(response) {
    if (response.isError()) {
      alert("Error in query: "+ response.getMessage() +" "+ response.getDetailedMessage() +" "+ response);
    }
    DbList._dbList = document.getElementById('db_list');
    DbList._dataTable = response.getDataTable();
    DbList._dataTable.setColumnLabel(0, 'Title');
    DbList._dataTable.setColumnLabel(1, 'Description');
    if (DbList._dataTable.getNumberOfColumns() > 2) {
      DbList._dataTable.setColumnLabel(2, 'Held at')
    }
    if (DbList._dataTable.getNumberOfColumns() > 4) {
      DbList._dataTable.setColumnLabel(3, 'Kdy')
      DbList._dataTable.setColumnLabel(4, 'Kde')
    }
    DbList._dataTable.addColumn('string', 'Photo');
  	var title = null;
  	var album = null;
    for(i = 0; i < DbList._dataTable.getNumberOfRows(); i++) { 
      //alert(DbList._imageNum);
      title =  DbList._dataTable.getValue(i, DbList._imageNum);
      album = DbList._getAlbumId(title);
      if (album) {
        DbList._dataTable.setCell(i, DbList._dataTable.getNumberOfColumns()-1, '<span id="' + album +  '"><img src="/images/ico/empty.gif" height="72" width="72" alt="Není dostupná žádná fotografie"/></span>');

      } else {
        DbList._dataTable.setCell(i, DbList._dataTable.getNumberOfColumns()-1, '<img src="/images/ico/empty.gif" alt="Není dostupná žádná fotografie"/>');
      }
    
  	} 
    
    if (DbList._dataTable.getNumberOfRows() > 0) {
      var options = {'showRowNumber': false};
      options['cssClassNames'] = {headerRow: 'headerRow', tableRow: 'tableRow', selectedTableRow: 'selectedTableRow', hoverTableRow: 'hoverTableRow', oddTableRow: 'oddTableRow'};
      options['page'] = 'enable';
      options['width'] = '100%';
      options['pageSize'] = 100;
      options['pagingSymbols'] = {prev: 'předchozí', next: 'následující'};
      options['pagingButtonsConfiguration'] = 'auto';  
      options['allowHtml'] = true;
      options['sort'] = 'disable';
      var table = new google.visualization.Table(DbList._dbList);
      
      
      if (DbList._dataTable.getNumberOfColumns() > 5) {
        var formatter = new google.visualization.PatternFormat('<b><u>{0}</u></b><br><i>{2} ({3})</i><br><div class="space">{1}</div>'); 
      }
      else if (DbList._dataTable.getNumberOfColumns() > 3) {
        var formatter = new google.visualization.PatternFormat('<b><u>{0}, {4}</u></b><br><div class="space">{1}</div>');
      }
      else  {
        var formatter = new google.visualization.PatternFormat('<b><u>{0}</u></b><br><div class="space">{1}</div>');
      }
      formatter.format(DbList._dataTable, [0, 1, 3, 4, 2], 1); // Apply formatter and set the formatted value of the first column.

      var view = new google.visualization.DataView(DbList._dataTable);
      // 0 nazev,  1 popis, 2 misto (neni u vsech), 3 foto
      if (DbList._dataTable.getNumberOfColumns() > 3) {
        view.setColumns([DbList._dataTable.getNumberOfColumns()-1,1]); 
      }
      else  {
        view.setColumns([DbList._dataTable.getNumberOfColumns()-1,1]);
      }
      
      table.draw(view, options); 
      DbList._resizeIframe('db'); 
      
      google.visualization.events.addListener(table, 'select', function() {
        paramName = ["nazev", "lokalita"];
        var params = ''
        var row = table.getSelection()[0].row;
        params += '&' + paramName[0] + '='+ encodeURIComponent(DbList._dataTable.getValue(row, 0));
        if (DbList._dataTable.getNumberOfColumns() > 3) {
          params += '&' + paramName[1] + '='+ encodeURIComponent(DbList._dataTable.getValue(row, 2));
        }
        window.location = 'dbdetail_en.htm?gid='+ DbList._gid + params
        //window.open('dbdetail.htm?gid='+ DbList._gid + params, 'tab')
      }); 
    }
    else  {
      DbList._dbList.innerHTML = '<p>No match. </p>'
    }
    // vsechny fotogalerie uzivatele
    DbList._loadJson('http://picasaweb.google.com/data/feed/api/user/'+ DbList.picasaUser +'?alt=json&callback=DbList._processAlbum');

  },

  _getAlbumId : function(title) {
	sdiak = "áäčďéěíĺľňóô öŕšťúů üýřžÁÄČĎÉĚÍĹĽŇÓÔ ÖŔŠŤÚŮ ÜÝŘŽ";
	bdiak = "aacdeeillnoo orstuu uyrzAACDEEILLNOO ORSTUU UYRZ"; 
	tx = ""; 
	txt = title; 
	
  	for(p = 0; p < txt.length; p++) { 
		if (sdiak.indexOf(txt.charAt(p)) != -1) { 
			tx += bdiak.charAt(sdiak.indexOf(txt.charAt(p))); 
		} else {
			tx += txt.charAt(p);
		}
  	} 
  	
  	title = tx.replace(/\s+/g, '');
  	
  	return title;
  },
  
    _loadJson : function(url) {
    // remove old JSON script
    var script = document.getElementById('json');

    if (script) {
      script.parentNode.removeChild(script);
    }

    script = document.createElement('script');
  
    script.setAttribute('src', url);
    script.setAttribute('id', 'json');
    script.setAttribute('type', 'text/javascript');
  
    document.documentElement.firstChild.appendChild(script);
  },
  
  _processAlbum : function(json) {
    DbList._imgItem = '<img src="/images/ico/ico.gif" alt="Není dostupná žádná fotografie"/>'
    for(i=0;i<json.feed.entry.length;i++){
      var img_base = json.feed.entry[i].media$group.media$content[0].url;
      var id_base = DbList._getAlbumId(json.feed.entry[i].title.$t);  
      var photoSp = document.getElementById(id_base)
      if (photoSp) {
        photoSp.innerHTML ='<img src="'+ img_base +'?imgmax='+ DbList.icoWidth +'&crop=1"/>';
      }
    }
  },

  _drawSearchForm : function(response) {
    if (response.isError()) {
      alert("Error in query: "+ response.getMessage() +" "+ response.getDetailedMessage() +" "+ response);
    }
    DbList._searchForm = document.getElementById('search_form');
    var html = [];
    html.push('<form method="get" action="dblist_en.htm">');
    html.push('<input type="hidden" name="gid" value="' + DbList._gid + '">');
    DbList._dataTable = response.getDataTable();
    for (var j = 0; j < DbList._dataTable.getNumberOfColumns(); j++) {
      var label = DbList._dataTable.getColumnLabel(j);
      html.push(' ' + label + ': <select name="' + DbList._sqlQueries[DbList._gid][1][j] + '" size="5" multiple><option value="">--- Vyberte podmínky ---</option>')
      for (var i = 0; i < DbList._dataTable.getNumberOfRows(); i++) {
        var value = DbList._dataTable.getValue(i, j);
        if (value) {
          html.push('<option>' + value + '</option>')
        }
      }
      html.push('</select>')
    }
    html.push('<input type="submit"/></form> <p>Zadejte alespoň jednu podmínku pro hledání</p>');
    if (DbList._searchForm) {
      DbList._searchForm.innerHTML = html.join(''); 
    }

    DbList._resizeIframe('db');
  },
  
  _resizeIframe : function(id) {
  var D = document;
  var height = Math.max(
        Math.max(D.body.scrollHeight, D.documentElement.scrollHeight),
        Math.max(D.body.offsetHeight, D.documentElement.offsetHeight),
        Math.max(D.body.clientHeight, D.documentElement.clientHeight)
  );
	var iframe = parent.document.getElementById(id);
	iframe.style.height = height; 	
  },  

  // parse URL to get parameters from
  // multimple values for one parameter allowed
  // using DbList.charsetDictionary to solve charset problem
	_querySt : function (key) {
	  var result = {};
    var urlString = window.location.search.substring(1);
	  var x = urlString.split("&");
	  for (i=0;i<x.length;i++) {
	    xParam = x[i].split("=");
	    if (xParam[0] == key) {
        if (!result[key]) {result[key]=[]}
        var finalString = decodeURIComponent(xParam[1]).replace(/\+/g, ' ');
        if (DbList.charsetDictionary[finalString]) {
         finalString = DbList.charsetDictionary[finalString];
        }
        result[key].push(finalString);
	    }
	  }
	  if (result[key]) {result[key]=result[key].join(';')}
	  return result[key]
	}
};
