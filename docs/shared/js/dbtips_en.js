// JavaScript Document
DbTips = {
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
    DbTips._sqlQueries =  [];
    DbTips._sqlQueries.push(['select U,M where not A starts with "_" #where# label U "nazev",M "lokalita"',['B','M','T'],'select A, M where not A starts with "_" label A "Typ",M "Lokalita"','Atraktivity'])
    DbTips._sqlQueries.push(['select W,Q where not A starts with "_" #where# label W "nazev",Q "lokalita"',['B','Q','V'],'select L, K where not L starts with "_" label L "Typ",K "Lokalita"','Akce'])
    DbTips._sqlQueries.push(['select R,J where not A starts with "_" #where# label R "nazev",J "lokalita"',['B','J','Q'],'select C, K where not C starts with "_" label C "Typ",K "Lokalita"','Aktivity'])
    DbTips._sqlQueries.push(['select Q where not A starts with "_" #where# label Q "nazev"',['B','J','C'],'select E where not E starts with "_" label E "Typ"','Programy'])
    DbTips._sqlQueries.push(['select P where not A starts with "_" #where# label P "nazev"',['B','I','C'],'select G where not G starts with "_" label G "Typ"','Trasy'])
    DbTips._sqlQueries.push(['select A,I where not A starts with "_" #where# label A "nazev",I "lokalita"',['I','B','R','S','T','U','V','W','X','Y','Z','AA','AB','AC','AD','AE','AF','AG','AJ'],'select N, K where not N starts with "_" label N "Typ",K "Lokalita"','Ubytování'])
    DbTips._sqlQueries.push(['select A,I where not A starts with "_" #where# label A "nazev",I "lokalita"',['I','B','O'],'select I, K where not I starts with "_" label I "Typ",K "Lokalita"','Ostatní služby'])
    DbTips._gid = DbTips._querySt('gid')
    
    //document.getElementById('pageTitle').innerHTML = DbTips._sqlQueries[DbTips._gid][3];
    //document.getElementById('pageTitle').innerHTML = "Nepřehlédněte";
    var where = '';
    
    for (var i = 0; i < DbTips._sqlQueries[DbTips._gid][1].length; i ++) {
      var name = DbTips._sqlQueries[DbTips._gid][1][i];
      var value = DbTips._querySt(name);
      
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
    
    if (DbTips._gid == 1 &&  DbTips._querySt('H') && DbTips._querySt('I') ) {
      var fromStr = DbTips._querySt('H').split('.') ;
      var toStr = DbTips._querySt('I').split('.');
      for (var x = 0; x < fromStr.length; x++) {
           if (fromStr[x].length == 1) {fromStr[x]= '0' + fromStr[x]};
           if (toStr[x].length == 1) {toStr[x]= '0' + toStr[x]};
      }
      
      where = where +  ' and date "' + fromStr[2] + '-' + fromStr[1] + '-' + fromStr[0] + '" <= I';
      where = where + ' and  date "' + toStr[2] + '-' + toStr[1] + '-' + toStr[0]  + '" >=H';
    }
   
    if (where != '')  {
      where = where + ' order by A'
      var sqlQuery = DbTips._sqlQueries[DbTips._gid][0].replace('#where#', where); 
      DbTips._sourceData = new google.visualization.Query(DbTips.connectionString + DbTips._gid);
      DbTips._sourceData.setQuery(sqlQuery);
      DbTips._sourceData.send(DbTips._drawDbTips);  
    }
    
    else  {
      var sqlQueryForm = DbTips._sqlQueries[DbTips._gid][2] + ' order by A';
      DbTips._sourceFormData = new google.visualization.Query(DbTips.connectionString + '7');
      DbTips._sourceFormData.setQuery(sqlQueryForm);
      DbTips._sourceFormData.send(DbTips._drawSearchForm);
    }
  },
  
  _drawDbTips : function(response) {
    if (response.isError()) {
      alert("Error in query: "+ response.getMessage() +" "+ response.getDetailedMessage() +" "+ response);
    }
    DbTips._dbList = document.getElementById('db_list');
    var html = [];
    html.push('<table class="detail">');
    var dataTable = response.getDataTable();
    
    for (var i = 0; i < dataTable.getNumberOfRows(); i++) {
      var title = dataTable.getValue(i, 0);
      var params = ''
      for (var j = 0; j < dataTable.getNumberOfColumns(); j++) {
        var label = dataTable.getColumnLabel(j);
        var value = dataTable.getValue(i, j);
        params += '&'+ label +'='+ encodeURIComponent(value)

      }
     if (value) {
        html.push('<tr><td><a href="dbdetail_en.htm?gid='+ DbTips._gid + params +'" target="db">'+ title +'</a></td></tr>');
     }
    }
    html.push('</table>');
    if (html.join('') == '<table class="detail"></table>')  {
      DbTips._dbList.innerHTML = '<p></p>'
    }
    else   {
      DbTips._dbList.innerHTML =  html.join(''); 
    }
    DbTips._resizeIframe('left');
  },

  _drawSearchForm : function(response) {
    if (response.isError()) {
      alert("Error in query: "+ response.getMessage() +" "+ response.getDetailedMessage() +" "+ response);
    }
    DbTips._searchForm = document.getElementById('search_form');
    var html = [];
    html.push('<form method="get" action="dblist.htm">');
    html.push('<input type="hidden" name="gid" value="' + DbTips._gid + '">');
    var dataTable = response.getDataTable();
    for (var j = 0; j < dataTable.getNumberOfColumns(); j++) {
      var label = dataTable.getColumnLabel(j);
      html.push(' ' + label + ': <select name="' + DbTips._sqlQueries[DbTips._gid][1][j] + '" size="5" multiple><option value="">--- Vyberte podmínky ---</option>')
      for (var i = 0; i < dataTable.getNumberOfRows(); i++) {
        var value = dataTable.getValue(i, j);
        if (value) {
          html.push('<option>' + value + '</option>')
        }
      }
      html.push('</select>')
    }
    html.push('<input type="submit"/></form> <p>Zadejte alespoň jednu podmínku pro hledání</p>');
    DbTips._searchForm.innerHTML = html.join(''); 
    DbTips._resizeIframe('left');
  },
  
  _resizeIframe : function(id) {
	var height = document.body.scrollHeight+40;
	var iframe = parent.document.getElementById(id);
	iframe.style.height = height;  	
  },  

  // parse URL to get parameters from
  // multimple values for one parameter allowed
  // using DbTips.charsetDictionary to solve charset problem
	_querySt : function (key) {
	  var result = {};
    var urlString = window.location.search.substring(1);
	  var x = urlString.split("&");
	  for (i=0;i<x.length;i++) {
	    xParam = x[i].split("=");
	    if (xParam[0] == key) {
        if (!result[key]) {result[key]=[]}
        var finalString = decodeURIComponent(xParam[1]).replace(/\+/g, ' ');
        if (DbTips.charsetDictionary[finalString]) {
         finalString = DbTips.charsetDictionary[finalString];
        }
        result[key].push(finalString);
	    }
	  }
	  if (result[key]) {result[key]=result[key].join(';')}
	  return result[key]
	}
};
