// JavaScript Document
DbList = {
  // data source
  connectionString : null,
  
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

  // initialization
  init : function() {
    
    // array with sql queries, filter parameters, form sql queries, form options names for all data sources based on GID
    DbList._sqlQueries =  [];
    DbList._sqlQueries.push(['select A,E where not A starts with "_" #where# label A "nazev",E "lokalita"',['B','E'],'select A, K where not A starts with "_" label A "Typ",K "Lokalita"','Atraktivity'])
    DbList._sqlQueries.push(['select A,C where not A starts with "_" #where# label A "nazev",C "lokalita"',['B','C'],'select L, K where not L starts with "_" label L "Typ",K "Lokalita"','Akce'])
    DbList._sqlQueries.push(['select A,C where not A starts with "_" #where# label A "nazev",C "lokalita"',['B','C'],'select C, K where not C starts with "_" label C "Typ",K "Lokalita"','Aktivity'])
    DbList._sqlQueries.push(['select A where not A starts with "_" #where# label A "nazev"',['B'],'select E where not E starts with "_" label E "Typ"','Programy'])
    DbList._sqlQueries.push(['select A where not A starts with "_" #where# label A "nazev"',['B'],'select G where not G starts with "_" label G "Typ"','Trasy'])
    DbList._sqlQueries.push(['select A,B where not A starts with "_" #where# label A "nazev",B "lokalita"',['D','B','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],'select N, K where not N starts with "_" label N "Typ",K "Lokalita"','Ubytování'])
    DbList._sqlQueries.push(['select A,B where not A starts with "_" #where# label A "nazev",B "lokalita"',['D','B'],'select I, K where not I starts with "_" label I "Typ",K "Lokalita"','Ostatní služby'])
    DbList._gid = DbList._querySt('gid')
    
    document.getElementById('pageTitle').innerHTML = DbList._sqlQueries[DbList._gid][3];
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
    
    if (DbList._gid == 1 &&  DbList._querySt('H') && DbList._querySt('I') ) {
      var fromStr = DbList._querySt('H').split('.') ;
      var toStr = DbList._querySt('I').split('.');
      for (var x = 0; x < fromStr.length; x++) {
           if (fromStr[x].length == 1) {fromStr[x]= '0' + fromStr[x]};
           if (toStr[x].length == 1) {toStr[x]= '0' + toStr[x]};
      }
      
      where = where +  ' and date "' + fromStr[2] + '-' + fromStr[1] + '-' + fromStr[0] + '" <= I';
      where = where + ' and  date "' + toStr[2] + '-' + toStr[1] + '-' + toStr[0]  + '" >=H';
    }
    
    if (where != '')  {
      where = where + ' order by A'
      var sqlQuery = DbList._sqlQueries[DbList._gid][0].replace('#where#', where); 
      //alert(sqlQuery);
      DbList._sourceData = new google.visualization.Query(DbList.connectionString + DbList._gid);
      DbList._sourceData.setQuery(sqlQuery);
      DbList._sourceData.send(DbList._drawDbList);  
    }
    
    else  {
      var sqlQueryForm = DbList._sqlQueries[DbList._gid][2] + ' order by A';
      DbList._sourceFormData = new google.visualization.Query(DbList.connectionString + '7');
      DbList._sourceFormData.setQuery(sqlQueryForm);
      DbList._sourceFormData.send(DbList._drawSearchForm);
    }
  },
  
  _drawDbList : function(response) {
    if (response.isError()) {
      alert("Error in query: "+ response.getMessage() +" "+ response.getDetailedMessage() +" "+ response);
    }
    DbList._dbList = document.getElementById('db_list');




    var html = [];
    html.push('<table class="detail">');
    var dataTable = response.getDataTable();
    
    //alert(dataTable.getNumberOfRows());
    for (var i = 0; i < dataTable.getNumberOfRows(); i++) {
      var title = dataTable.getValue(i, 0);
      var params = ''
      for (var j = 0; j < dataTable.getNumberOfColumns(); j++) {
        var label = dataTable.getColumnLabel(j);
        var value = dataTable.getValue(i, j);
        params += '&'+ label +'='+ encodeURIComponent(value)

      }
     if (value) {
        html.push('<tr><td><a href="dbdetail.htm?gid='+ DbList._gid + params +'">'+ title +'</a></td></tr>');
     }
    }
    html.push('</table>');
    if (html.join('') == '<table class="detail"></table>')  {
      DbList._dbList.innerHTML = '<p>Žádná položka neodpovídá zadání. </p>'
    }
    else   {
      DbList._dbList.innerHTML =  html.join(''); 
    }
    DbList._resizeIframe('db');
  },

  _drawSearchForm : function(response) {
    if (response.isError()) {
      alert("Error in query: "+ response.getMessage() +" "+ response.getDetailedMessage() +" "+ response);
    }
    DbList._searchForm = document.getElementById('search_form');
    var html = [];
    html.push('<form method="get" action="dblist.htm">');
    html.push('<input type="hidden" name="gid" value="' + DbList._gid + '">');
    var dataTable = response.getDataTable();
    for (var j = 0; j < dataTable.getNumberOfColumns(); j++) {
      var label = dataTable.getColumnLabel(j);
      html.push(' ' + label + ': <select name="' + DbList._sqlQueries[DbList._gid][1][j] + '" size="5" multiple><option value="">--- Vyberte podmínky ---</option>')
      for (var i = 0; i < dataTable.getNumberOfRows(); i++) {
        var value = dataTable.getValue(i, j);
        if (value) {
          html.push('<option>' + value + '</option>')
        }
      }
      html.push('</select>')
    }
    html.push('<input type="submit"/></form> <p>Zadejte alespoň jednu podmínku pro hledání</p>');
    DbList._searchForm.innerHTML = html.join(''); 
    DbList._resizeIframe('db');
  },
  
  _resizeIframe : function(id) {
	var height = document.body.scrollHeight;
	var iframe = parent.document.getElementById(id);
	
	if (height>200) {iframe.style.height = height}  	
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
