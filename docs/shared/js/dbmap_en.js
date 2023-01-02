// JavaScript Document
DbMap = {
  // data source
  connectionString : null,
  gLatValue : null,
  gLngValue : null,
  gZoomLevel : null,
  
  // sql queries for DB List
  _sqlQueries : null,
  
  // data source GID
  _gid : null,
  
  _gmarkers : [],
  _map : null,
  _categD : {},

  myclick : function(i) {
    GEvent.trigger(DbMap._gmarkers[i],"click");
  },
 
   // parse URL to get parameters from
	_querySt : function (key) {
	  var result = {};
    var urlString = window.location.search.substring(1);
	  var x = urlString.split("&");
	  for (i=0;i<x.length;i++) {
	    xParam = x[i].split("=");
	    if (xParam[0] == key) {
        if (!result[key]) {result[key]=[]}
        result[key].push(decodeURIComponent(xParam[1]).replace(/\+/g, ' '));
	    }
	  }
	  if (result[key]) {result[key]=result[key].join(';')}
	  return result[key];
	},
	
  _resizeIframe : function(id) {
	var height = document.body.scrollHeight+45;
	var iframe = parent.document.getElementById(id);
	
	if (height>400) {iframe.style.height = height}  	
  },
	
  _hide : function(categoryStr) {
    for (var i=0; i<DbMap._gmarkers.length; i++) {
      if (DbMap._gmarkers[i].mycategory == categoryStr) {
        DbMap._gmarkers[i].hide();
      }
    }
    // == clear the checkbox ==
    //document.getElementById(categoryStr+"box").checked = false;
    
    // == close the info window, in case its open on a marker that we just hid
    DbMap._map.closeInfoWindow();
  },
  
  _show :function(category) {
    for (var i=0; i<DbMap._gmarkers.length; i++) {
      if (DbMap._gmarkers[i].mycategory == category) {
        DbMap._gmarkers[i].show();
      }
    }
    // == check the checkbox ==
    document.getElementById(category+"box").checked = true;
  },

  _makeSidebar : function() {
    var html = ""; 
    var checkStr = "|";
    for (var i=0; i<DbMap._gmarkers.length; i++) {
      if (!DbMap._gmarkers[i].isHidden() && checkStr.indexOf("|" + DbMap._gmarkers[i].myname +  "|") == -1 ) {
        html += '<tr><td><a href="javascript:DbMap.myclick(' + i + ')">' + DbMap._gmarkers[i].myname + '<\/a></tr></td>';
        checkStr += DbMap._gmarkers[i].myname + "|"
      }
    }
    document.getElementById("side_bar").innerHTML = '<table class="detail">' + html + '</table>';
  },
  
  boxclick : function(box,category) {
    if (box.checked) {
      DbMap._show(category);
    } else {
      DbMap._hide(category);
    }
    // == rebuild the side bar
    DbMap._makeSidebar();
  },

  _createMarker : function(point,html,name,category) {
    var marker = new GMarker(point);
    marker.mycategory = category;
    marker.myname = name;
    GEvent.addListener(marker, "click", function() {
      marker.openInfoWindowHtml(html);
    });
    DbMap._gmarkers.push(marker);
    return marker;
  },

  _drawCheckForm : function(response) {

      if (response.isError()) {
        alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
        return;
      }
      var data = response.getDataTable();
      var rowsnum = data.getNumberOfRows();
      var html = "";
      for (var i = 0; i < rowsnum; i++) {
        if (data.getValue(i, 0) != "" && data.getValue(i, 1) != "") {
          //alert(data.getValue(i, 0) + "=" + data.getValue(i, 1));
          DbMap._categD[data.getValue(i, 0)]  =   data.getValue(i, 1);
          
          html = html + '<input type="checkbox" id="' + data.getValue(i, 1) + 'box" onclick="DbMap.boxclick(this,\'' + data.getValue(i, 1) + '\')" /> ' + data.getValue(i, 2) + '<br/>';
        }
      }
      if (document.getElementById("check_form")) {
        document.getElementById("check_form").innerHTML = '<form action="#">' + html + '<br /></form>';
      }
      if (document.getElementById("db_title")) {
        document.getElementById("db_title").innerHTML = DbMap._sqlQueries[DbMap._gid][2];
      }
      
      DbMap._sendToDraw(DbMap._gid,0,DbMap._drawMarkers);
  },
  
  _drawMarkers : function(response) {

    if (response.isError()) {
      alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
      return;
    }
    var data = response.getDataTable();
    var rowsnum = data.getNumberOfRows();
    //alert(rowsnum);
    for (var i = 0; i < rowsnum; i++) {
      //alert(i);
      var lat = parseFloat(data.getValue(i, 2));
      var lng = parseFloat(data.getValue(i, 3));
      var point = new GLatLng(lat,lng);
      var address = data.getValue(i, 1);
      var description = data.getValue(i, 4);
      var name = data.getValue(i, 0);
      var html = "<div style='width:240px'><b>"+name+"<\/b><p>"+description+"<\/p><p>"+address+"<\/p><\/div>";
      var category = data.getValue(i, 5).split(", ");
      // create the marker
      //alert(name);
      for(z = 0; z < category.length; z++){
        //alert(DbMap._categD[category[z]]);
        var marker = DbMap._createMarker(point,html,name,DbMap._categD[category[z]]);
        DbMap._map.addOverlay(marker);
        DbMap._hide(DbMap._categD[category[z]]);
      }
    }
    // == create the initial sidebar ==
    DbMap._makeSidebar();
    DbMap._resizeIframe('db');
  },
  
   _sendToDraw : function(sourceStr,queryStr,sendFunctionStr) {
    //alert(sourceStr)
    var query = new google.visualization.Query(DbMap.connectionString + sourceStr);
    var sqlQuery = DbMap._sqlQueries[DbMap._gid][queryStr];
    query.setQuery(sqlQuery);
    query.send(sendFunctionStr);
  },

   _setupMap : function() {
    DbMap._map = new GMap2(document.getElementById("map_canvas"));
    DbMap._map.addControl(new GLargeMapControl());
    DbMap._map.addControl(new GMapTypeControl());
    DbMap._map.setCenter(new GLatLng(DbMap.gLatValue, DbMap.gLngValue), DbMap.gZoomLevel);
  },

  // initialization
  init : function() {
    
    // array with sql queries, filter parameters, form sql queries, form options names for all data sources based on GID
    DbMap._sqlQueries =  [];
    DbMap._sqlQueries.push(['SELECT U,AE,N,O,X,B WHERE N contains "48." AND O contains "16."','select A, B, Q where not A starts with "_"','Touristsights']);
    DbMap._sqlQueries.push(['SELECT W,AI,R,S,AA,B WHERE R contains "48." AND S contains "16."','select L, M, W where not A starts with "_"','Events']);
    DbMap._sqlQueries.push(['SELECT R,Z,K,L,T,B WHERE K contains "48." AND L contains "16."','select C, D, S where not A starts with "_"','Activities']);
    DbMap._sqlQueries.push(['','']);
    DbMap._sqlQueries.push(['','']);
    DbMap._sqlQueries.push(['SELECT A,AX,AH,AI,AL,B WHERE AH contains "48." AND AI contains "16."','select N, O, Y where not A starts with "_"','Accommodations']);
    DbMap._sqlQueries.push(['SELECT A,V,M,N,P,B WHERE M contains "48." AND N contains "16."','select I, J, U where not A starts with "_"','Other services']);
    DbMap._gid = DbMap._querySt('gid');

    if (GBrowserIsCompatible()) {
      DbMap._setupMap();
      DbMap._resizeIframe('db');
      DbMap._sendToDraw('7',1,DbMap._drawCheckForm);
    }
	}
};