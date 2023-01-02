<%@ Language = "Python" %>
<!--#include file="..\..\..\..\timetree\bin\asp\lib\MSXMLGate.py.asp"-->
<!--#include file="..\..\..\..\timetree\bin\asp\lib\MSFORMGate.py.asp"-->
<!--#include file="..\..\..\..\timetree\bin\asp\lib\MySQLGate.py.asp"-->
<!--#include file="..\..\..\..\timetree\bin\asp\lib\UTILITYGate.py.asp"-->
<html>
	<head>
	    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<meta http-equiv="Expires" content="-1">
		<meta http-equiv="Cache-Control" content="no-cache">
		<meta http-equiv="PRAGMA" content="NO-CACHE">
		<meta content="INDEX,NOFOLLOW" name="robots">
	<head>
	<body>
<%
import TimeTree2
start = utilitygate.getStart()


ID = 10
if str(Request.QueryString("tool_id")) <> "" and str(Request.QueryString("tool_id")) <> "None":
	ID = int(Request.QueryString("tool_id"))

cachepath="D:/projects/sdhstrachotin/machine/cache/webtools/"
output = utilitygate.readCache(cachepath)
if output == None:
	sqlgate.cn = sqlgate.open("dsn=webtools;uid=root;pwd=securemarc")
	sqlgate.cn2 = ""
	requests = TimeTree2.webtools.Requests(utilitygate=utilitygate, xmlgate=xmlgate, sqlgate=sqlgate, formgate=formgate, session=Session.SessionID, user="aet", appname="sdhstrachotin", cachepath=cachepath, project="sdhstrachotin")
	output = requests.tools[ID].output(ID)
	utilitygate.writeCache(cachepath,output)

utilitygate.getTimeControl(start,"Celkem: ")
utilitygate.recordSystemUsage ("sdhstrachotin","2",start)

%>
		<script type="text/javascript">
		<!--
		window.parent.RPC.enable("title");
		window.parent.RPC.fill(<%=output%>);
		-->
		</script>
	</body>
</html>