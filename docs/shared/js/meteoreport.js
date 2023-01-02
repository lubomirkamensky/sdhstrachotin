// JavaScript Document
MeteoReport = {
  // measure
  _meas : null,
  // start date
  _start : null,
  // end date
  _end : null,
  // data grain
  _grain : null,
  // number of days from comparison period
  _minus : null,
  //day/night split required
  _split : null,

  // initialization
  init : function() {
    //
    MeteoReport._meas =  MeteoReport._querySt('meas');
    MeteoReport._start =  MeteoReport._querySt('start');
    MeteoReport._end =  MeteoReport._querySt('end');
    MeteoReport._grain =  MeteoReport._querySt('grain');
    MeteoReport._minus =  MeteoReport._querySt('minus');
    MeteoReport._split =  MeteoReport._querySt('split');
  },

  // parse URL to get parameters from
  // multimple values for one parameter allowed
	_querySt : function (key) {
	  var result = {};
    var urlString = window.location.search.substring(1);
	  var x = urlString.split("&");
	  for (i=0;i<x.length;i++) {
	    xParam = x[i].split("=");
	    if (xParam[0] == key) {
        if (!result[key]) {result[key]=[]}
        var finalString = decodeURIComponent(xParam[1]).replace(/\+/g, ' ');
        result[key].push(finalString);
	    }
	  }
	  if (result[key]) {result[key]=result[key].join(';')}
	  return result[key]
	}
};
