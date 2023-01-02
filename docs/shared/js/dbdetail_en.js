// JavaScript Document
DbDetail = {
  // data source
  connectionString : null,
  // picasa albums user name
  picasaUser : null,
  // width of image
  imageWidth : null,
  // width of ico
  icoWidth : null,
  
  // element for table data
  _dbDetail : null,
  // element for images
  _images : null,
  // dictionary for direct Relations
  _directRelations: null,  
  // source Data for DB Detail
  _sourceData : null,
  // sql queries for DB Detail
  _sqlQueries : null,
  // data source GID
  _gid : null,
  // initialization
  init : function() {
    // array with sql queries, filter parameters, form sql queries, form options names for all data sources based on GID
    var generallRelations = [];
    generallRelations.push(['select U,0 where M contains "#lokalita#"','0','Points of interest','atraktivity']);
    generallRelations.push(['select W,1 where date "' + new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() + '" <= F and  C contains "#lokalita#"','1','Events','akce']);
    generallRelations.push(['select R,2 where C contains "#lokalita#"','2','Activities','aktivity']);
    generallRelations.push(['select A,3 where B contains "#lokalita#"','5','Accommodations','ubytovani']);
    generallRelations.push(['select A,4 where B contains "#lokalita#"','6','Other services','ostatni']);
    
    DbDetail._directRelations = {};
    DbDetail._directRelations['Programy'] = [3,'programy','Turistický cíl je součástí programu: '];
    DbDetail._directRelations['Trasy'] = [4,'trasy','Destinatilocated on route: '];
    
    DbDetail._sqlQueries =  [];
    DbDetail._sqlQueries.push(['select A,U,AE,V,W,E,F,G,H,X,Y where A = "#nazev#" or U = "#nazev#" label A "Nic",U "Title",AE "Contact",V "Opening hours",W "Admission",E "Telephone",F "Fax",G "Email",H "Web",X "Characteristics",Y "Description"',generallRelations,'select P,R where U = "#nazev#" label P "Trasy",R "Programy"','Atraktivita','Points of interest'])
    DbDetail._sqlQueries.push(['select A,W,X,Y,Z,AI,AA,AB where A = "#nazev#" or W = "#nazev#" label A "Nic",W "Title",X "Held at",Y "Time",Z "Admission",AI "Contact",AA "Characteristics",AB "Description"',generallRelations,'select U where W = "#nazev#" label U "Programy"','Akce','Events'])
    DbDetail._sqlQueries.push(['select A,R,S,Z,F,G,H,I,T,U where A = "#nazev#" or R = "#nazev#" label A "Nic",R "Title",S "Opening hours",Z "Kontakt",F "Telephone",G "Fax",H "Email",I "Web",T "Characteristics",U "Description"',generallRelations,'select P where R = "#nazev#" label P "Programy"','Aktivita','Activities'])
    DbDetail._sqlQueries.push(['select A,Q,C,R,E,S,T,H,I where A = "#nazev#" or Q = "#nazev#" label A "Nic",Q "Title",C "Map of route",R "Time needed",E "Length of route",S "Characteristics", T "Description",H "Hlavní témata",I "Cílové skupiny"',[],'','Program','Programs'])
    DbDetail._sqlQueries.push(['select A,P,C,Q,E,R,S,H where A = "#nazev#" or P = "#nazev#" label A "Nic",P "Title",C "Map of route",Q "Time needed",E "Length of route",R "Characteristics", S "Description",H "Cílové skupiny"',[],'','Trasa','Routes'])
    DbDetail._sqlQueries.push(['select A,AX,E,F,G,H,AL,AM,Q,AN,P,AO,AP,AK,AQ where A = "#nazev#" label A "Title",AX "Contact",E "Telephone",F "Fax",G "Email",H "Web",AL "Characteristics",AM "Provoz recepce", Q "Estimated price", AN "Capacity", P "Allotment of rooms", AO "Furnishings",AP "Shared facilities and services",AK "Aktuální dostupnost",AQ "Způsoby platby"',generallRelations,'','Ubytování','Accommodations'])
    DbDetail._sqlQueries.push(['select A,Q,V,E,F,G,H,P,R where A = "#nazev#" label A "Title",Q "Opening hours",V "Contact",E "Telephone",F "Fax",G "Email",H "Web",P "Characteristics",R "Description"',generallRelations,'','Ostatní služby','Other services'])
  
    DbDetail._gid = DbDetail._querySt('gid')
    document.getElementById('pageTitle').innerHTML = DbDetail._sqlQueries[DbDetail._gid][4];
    var sqlQuery = DbDetail._sqlQueries[DbDetail._gid][0].replace(/#nazev#/g, DbDetail._querySt('nazev')); 
    DbDetail._sourceData = new google.visualization.Query(DbDetail.connectionString + DbDetail._gid);
    
    DbDetail._sourceData.setQuery(sqlQuery);
    DbDetail._sourceData.send(DbDetail._drawDetail);
      
    var sqlQueryDirectRelations = DbDetail._sqlQueries[DbDetail._gid][2].replace(/#nazev#/g, DbDetail._querySt('nazev')) ;
    if (sqlQueryDirectRelations != '') {
      //alert(sqlQueryDirectRelations);
      DbDetail._sourceData = new google.visualization.Query(DbDetail.connectionString + DbDetail._gid);
      DbDetail._sourceData.setQuery(sqlQueryDirectRelations);
      DbDetail._sourceData.send(DbDetail._drawDirectRelations);
    }
    
    for (var i = 0; i < DbDetail._sqlQueries[DbDetail._gid][1].length; i++) {
      var orderString =  ' order by A';
      if (i == 1) { 
        orderString =  ' order by E'; 
      }
      var sqlQueryGenerallRelations =  DbDetail._sqlQueries[DbDetail._gid][1][i][0].replace('#lokalita#', DbDetail._querySt('lokalita')) + orderString + ' limit 10';   
      //alert(sqlQueryGenerallRelations);
      DbDetail._sourceData = new google.visualization.Query(DbDetail.connectionString + DbDetail._sqlQueries[DbDetail._gid][1][i][1]);
      DbDetail._sourceData.setQuery(sqlQueryGenerallRelations);
      DbDetail._sourceData.send(DbDetail._drawGenerallRelations);
    }
  },

  _drawDetail : function(response) {
    if (response.isError()) {
      alert("Error in query: "+ response.getMessage() +" "+ response.getDetailedMessage() +" "+ response);
    }
    DbDetail._dbDetail = document.getElementById('db_detail');
    DbDetail._images = document.getElementById('images');
    var dataTable = response.getDataTable();
    var title = "";
    var charakteristika = "";
    var popis = "";
    var html = [];
    html.push('<table class="data">');
    
    for (var j = 0; j < dataTable.getNumberOfColumns(); j++) {
      var label = dataTable.getColumnLabel(j);
      var value = dataTable.getValue(0, j);
      
      if (j == 0) {
          title = value;
      }
      
      if (label == 'Characteristics') {
	charakteristika = value;
	
	continue;
      }
      
      if (label == 'Description') {
      	popis = value;

	continue;
      }
      
      if (label == 'Web') {
    	  if (value) {
          html.push('<tr>');
          html.push('<td>'+ label +':</td>');
          html.push('<td><a href="http://'+ value +'" target="_blank">'+ value +'</a></td>');
          html.push('</tr>');
    	  }
    	} else if (label == 'Aktuální dostupnost') {  
	       if (value == 'ano') {
          html.push('<tr>');
          html.push('<td>'+ label +':</td>');
          html.push('<td><a onclick="Popup.open(this,\'capacity\'); return false;" href="http://volneubytovani.mikulovskoregion.cz/freecapacity/small_form/?hotel=' + encodeURIComponent(DbDetail._querySt('nazev')) + '" rel="nofollow">Ověřit volnou kapacitu</a></td>');
          html.push('</tr>');
        }
    	} else if (label == 'Title') {  
	       if (value) {
          html.push('<tr>');
          html.push('<td colspan="2"><b>'+ value +'</b></td>');
          html.push('</tr>');
        }
      } else if (label == 'Nic') {  
          html.push('');
      } else {
    	  if (value) {
          html.push('<tr>');
          html.push('<td>'+ label + ':</td>');
          html.push('<td>' + value + '</td>');
          html.push('</tr>');
        }
      }      
    }
    
    // load images
    var album = DbDetail._getAlbumId(title);
    
    if (album) {
      DbDetail._loadJson('http://picasaweb.google.com/data/feed/api/user/'+ DbDetail.picasaUser +'/album/'+ album +'?kind=photo&alt=json&callback=DbDetail._processAlbum');
        
    } else {
      DbDetail._images.innerHTML = '';
    }

    html.push('</table><hr/>');
    html.push('<b>Characteristics:</b><br/>'+ charakteristika +'<br/><br/>');
    html.push('<b>Description:</b><br/>'+ popis +'<br/><hr/>');
    
    DbDetail._dbDetail.innerHTML = html.join('');
    DbDetail._resizeIframePlus('db');
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
  	
  	title = tx.replace(/\s+/g, '').replace(/-/g, '').replace(/,/g, '').replace(/\./g, '').replace(/–/g, '').replace(/\(/g, '').replace(/\)/g, ''); 
  	//alert(title) ;
  	
  	return title;
  },

  _drawGenerallRelations : function(response) {
    if (response.isError()) {
      alert("Error in query: "+ response.getMessage() +" "+ response.getDetailedMessage() +" "+ response);
    }
    var dataTable = response.getDataTable();
    var htmlRelations = [];
    
    if (dataTable.getNumberOfRows() > 0) {
      htmlRelations.push('<h5>#typ# in area: </h5>')
      var xorder = null;
      for (var i = 0; i < dataTable.getNumberOfRows(); i++) {
        var value = dataTable.getValue(i, 0);
        xorder = dataTable.getValue(i, 1);
        if (value) {
          htmlRelations.push('<a href="dbdetail_en.htm?gid='+ DbDetail._sqlQueries[DbDetail._gid][1][xorder][1] +'&nazev='+ encodeURIComponent(value) +'&lokalita=' + encodeURIComponent(DbDetail._querySt('lokalita')) + '">'+ value +'</a><br/>');
        }
      }
      document.getElementById(DbDetail._sqlQueries[DbDetail._gid][1][xorder][3]).innerHTML = htmlRelations.join('').replace('#typ#',DbDetail._sqlQueries[DbDetail._gid][1][xorder][2]);
      DbDetail._resizeIframe('db');
    }
  },

  _drawDirectRelations : function(response) {
    if (response.isError()) {
      alert("Error in query: "+ response.getMessage() +" "+ response.getDetailedMessage() +" "+ response);
    }
    var dataTable = response.getDataTable();
    for (var j = 0; j < dataTable.getNumberOfColumns(); j++) {
      var label = dataTable.getColumnLabel(j);
      var value = dataTable.getValue(0, j);
      if (value) {
        var links = value.split(', ');
        var htmlRelations = [];
        
        htmlRelations.push('<h5>' + DbDetail._directRelations[label][2] + '</h5>')
        
        for (var i = 0; i < links.length; i++) {
          htmlRelations.push('<a href="dbdetail_en.htm?gid='+ DbDetail._directRelations[label][0] +'&nazev='+ encodeURIComponent(links[i]) +'">'+ links[i] +'</a><br/>');
        }
        document.getElementById(DbDetail._directRelations[label][1]).innerHTML = htmlRelations.join('');
        DbDetail._resizeIframe('db');
      }
    }
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
    var html = [];
  
    html.push('<div class="images">');
    
    for (var i = 0; i < json.feed.entry.length; i++) {
      var entry = json.feed.entry[i];
      var src = entry.content.src;
      var summary = entry.summary.$t;
      
      html.push('<div class="ico">');
      html.push('<a href="'+ src +'?imgmax='+ DbDetail.imageWidth +'" title="'+ summary +'" onclick="Popup.openSingleImage(this,&quot;image640&quot;); return false;">');
      html.push('<img src="'+ src +'?imgmax='+ DbDetail.icoWidth +'&crop=1" alt="'+ summary +'"/>');
      html.push('</a>');
      html.push('</div>');
    }
    
    html.push('</div>');
    
    DbDetail._images.innerHTML = html.join('');
    DbDetail._resizeIframe('db');
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
  
  _resizeIframePlus : function(id) {
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
	_querySt : function (key) {
	  var urlString = window.location.search.substring(1);
	  var x = urlString.split("&");
	  for (i=0;i<x.length;i++) {
	    xParam = x[i].split("=");
	    if (xParam[0] == key) {
        return decodeURIComponent(xParam[1]);
	    }
	  }
	}
}