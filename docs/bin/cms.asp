<%@ Language = "Python" %>
<!doctype html public "-//W3C//DTD HTML 4.0 Transitional//EN">
<!--#include file="..\..\..\..\timetree\bin\asp\lib\MSXMLGate.py.asp"-->
<!--#include file="..\..\..\..\timetree\bin\asp\lib\MSFORMGate.py.asp"-->
<!--#include file="..\..\..\..\timetree\bin\asp\lib\MySQLGate.py.asp"-->
<!--#include file="..\..\..\..\timetree\bin\asp\lib\UTILITYGate.py.asp"-->
<html>
	<head>
   		<title>Machine</title>
   		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<meta http-equiv="Expires" content="-1"/>
		<meta http-equiv="Cache-Control" content="no-cache"/>
		<meta http-equiv="pragma" content="no-cache"/>
		<meta content="index,nofollow" name="robots"/>
		<meta name="Author" content="Ing. Michal Bucek [bucek@timetree.info]">
		<meta name="Copyright" content="TimeTree, s.r.o. [www.timetree.info]">
  	</head>
  	<body>
<%
from TimeTree2.cms import *
start = utilitygate.getStart()

cms = Cms(utilityGate = utilitygate, xmlGate = xmlgate, sqlGate = sqlgate, formGate = formgate, projectName = "sdhstrachotin")
output = cms.executeMacro(cms.getQueryStringParam("m"))
utilitygate.getTimeControl(start,"Celkem: ")
utilitygate.recordSystemUsage ("sdhstrachotin","5",start)
%>
		<script type="text/javascript">
		<!--
		window.parent.RPC.disable("title");
		window.parent.RPC.fill(<%= Response.write(output) %>);
		-->
		</script>
  	</body>
</html>