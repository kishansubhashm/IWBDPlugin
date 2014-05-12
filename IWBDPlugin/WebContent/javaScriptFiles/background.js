var tempUrl;
var curUrl;
var setUrl;
var email="dummy2";
var uname="dummy2";
var gId="dummy2";
var uP="dummy2";
var statusToSend="lolz";
function testing(a,b)
{
	console.log("sum of 3+4 is : "+7);
	//setInterval(function(){testFromBackground();},3000);	
	//return(a+b);
	testFromBackground();
}

function testFromBackground()
{
	/*	var str = window.localStorage.getItem("time");
	console.log(str);
	if(new Date().getTime()<str+1000000)
	{
		console.log("date is:"+new Date().getTime());
		console.log("from background testing function");
		setInterval(function(){testFromBackground();},30000);
	}
	else
		console.log("time exceeded");
	 */
}
function backgroundAjaxStart()
{
	window.localStorage.setItem("data", "0000-0000-0000-0000");
	if(window.localStorage.getItem("token")=="" || window.localStorage.getItem("token")==null)
	{
		findCredentials();
	}
	console.log("from backgroundAjaxTest");
	//setInterval(function(){callServelt();},3000000);

}

function callSSEfromBackground(url,uname,uid,status)
{
	chatType=window.localStorage.getItem("chatType");
	tokenSaved=window.localStorage.getItem("token");
	if(tokenSaved!=null)
	{
		statusDisplay = document.getElementById('summary');
		eventSource=new EventSource('http://shalini-pc:8080/SimilarPracticum/GetMessagesServlet?uid='+uid+"&url="+url+"&uname="+uname+'&mes='+''+'&chatType='+chatType);
		//eventSource=new EventSource('http://shalini-pc:8080/NewOne/SSE?uid='+uid+"&url="+url+"&uname="+uname+'&mes='+''+'&status='+status);
		//eventSource=new EventSource('http://54.187.111.78:8080/NewOne/SSE?uid='+uid+"&url="+url+"&uname="+uname+'&mes='+''+'&status='+status);
		console.log('sse called');
		eventSource.onopen=function(){console.log('sse called from connected');};
		eventSource.onmessage=function(message){
			console.log('sse called from message');
			//console.log(message.data);
			if(message.data!="empty")
			{
				var mes=message.data;
				console.log("got is : "+mes);
				//got is : emptyhie3::1399871739629::100823943353644264890::kishan subhash,
				temp1=mes.split(",");
				console.log("temp is : "+temp1.length);
				console.log("temp is : "+temp1[0]);
				
				for(var i=0;i<temp1.length-1;i++)
				{
					//temp2=temp1[i];
					//console.log("got inside loop is"+temp2);
					temp3=temp1[i].split("::");
					message=temp3[0];
					sender=temp3[3];
					console.log("sender is"+sender);
					console.log("message is"+message);
					saveIntoDb(url, sender, message);
				}
			}
			else
				statusToSend="lolz";
			console.log("empty msg rcvd");
			//saveIntoDb(url,message.data,sender);
		};
		eventSource.onerror=function(){console.log('sse called from error');console.log('error');};
	}
}

function changingEventSource(url,uname,uid,status)
{
	console.log("from changingEventSource");
	closingEventSource();
	callSSEfromBackground(url,uname,uid,status);
	//console.log("after again calling callSSEfromBackground");
}
function closingEventSource()
{
	console.log("from closingEventSource");
	eventSource.close();
	
}
function saveIntoDb(url, sender, message)
{

	try
	{
		var curDatAndTime=getCurDateAndTime();
		console.log("url is"+url);
		//var str = "abc's test#s";
		url=url.replace(/[^a-zA-Z0-9 ]/g, "");
		var db = openDatabase('chat', '1.0', 'Test DB', 2 * 1024 * 1024);
		db.transaction(function (tx) {
			tx.executeSql('CREATE TABLE IF NOT EXISTS '+url+' (datetime, sender, message)');
			console.log('INSERT INTO '+url+' (datetime, sender, message) VALUES (?, ?, ?)', [curDatAndTime, sender, message]+')');
			tx.executeSql('INSERT INTO '+url+' (datetime, sender, message) VALUES (?, ?, ?)', [curDatAndTime, sender, message]);
			window.localStorage.setItem("data", "0001-0010-0100-1000");
			console.log("message saved successfully");
			flag=1;
			statusToSend="\n"+sender+" : "+message;
			//readDataBase(url);
		});
	}

	catch(err)
	{
		alert("error is :"+err);
		console.log("error is :"+err);
	}
}

function getCurDateAndTime() {
	var currentdate = new Date(); 
	var currentMonth=currentdate.getMonth() +1;
	if (currentMonth < 10) { currentMonth = '0' + currentMonth; }
	var currentDate=currentdate.getDate();
	if (currentDate< 10) { currentDate= '0' + currentDate; }
	var currentHours=currentdate.getHours();
	if (currentHours< 10) { currentHours= '0' + currentHours; }
	var currentMinutes=currentdate.getMinutes();
	if (currentMinutes< 10) { currentMinutes= '0' + currentMinutes; }
	var currentSeconds=currentdate.getSeconds();
	if (currentSeconds< 10) { currentSeconds= '0' + currentSeconds; }
	var datetime = ""  + currentdate.getFullYear()   
	+ currentMonth
	+ currentDate 
	+ currentHours 
	+ currentMinutes 
	+ currentSeconds;
	return datetime ;
}
function readChatConversation(url)
{
	url=url.replace(/[^a-zA-Z ]/g, "");
}

/*function readDataBase(url)
{
	console.log("readDataBase called in background successfully");
	var db = openDatabase('chat', '1.0', 'Test DB', 2 * 1024 * 1024);
	var msg;
	url=url.replace(/[^a-zA-Z0-9 ]/g, "");
	console.log("from readDataBase");
	db.transaction(function (tx) {
		tx.executeSql('SELECT * FROM '+url+';', [], function (tx, results) {
			var len = results.rows.length, i;
			msg = "<p>Found rows: " + len + "</p>";
			//console.log(msg);
			for (i = 0; i < len; i++){
				msg = "\n"+results.rows.item(i).sender +" : "+results.rows.item(i).message;
				statusToSend+=  msg;
				//	alert(msg);
			}
		}, null);
	}); 
}*/
chrome.extension.onRequest.addListener(
		function(request, sender, sendResponse) {
			if (request.message == "send")
				sendResponse({farewell:statusToSend});
		});
/*function callServelt()
{
	var postUrl = "http://localhost:8080/IWBDPlugin/TestMessage";
	var xhr = new XMLHttpRequest();
	xhr.open('get', postUrl, true);
	var params = "hi";
	xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhr.onreadystatechange = function(progress) { 
		if (xhr.readyState == 4) {
				var b=this.response;
				console.log("message recieved.."+b);
		}
	};
	xhr.send(params);
	console.log("message sent..\n");
}*/
function stopBackgroundPage()
{
	var bkg = chrome.extension.getBackgroundPage();
	bkg.location.reload();
}

//to view all tabs in the chrome, uncomment below lines of code and also uncomment lines of code in popup.html
function findCredentials(){
	var temp;
	var availToken=window.localStorage.getItem("token");
	var found="yes";
	var matchUrl="http://harsha.jelastic.elastx.net/subbucopy/subbu";
	chrome.tabs.getAllInWindow(null, function(tabs) {
		//uname=kishan%20subhash&email=kissu.subbu@gmail.com 
		found="not";
		if(availToken=="" || availToken==null)
		{
			for( var i=0;i< tabs.length;i++)
			{	//console.log(tabs[i].url);

				if(tabs[i].url!=matchUrl)
				{
					temp=tabs[i].url.split("?");
					if(temp[0]==matchUrl)
					{
						found="yes";
						getCredentials(temp[1]);
						break;
						console.log("whats ur problem?");
					}
					else
						console.log("url not found");
				}
				else
					console.log("login credentials not found");
			}
		}
		if(found=="not")
			findCredentials();
	});
}
function getCredentials(got)
{
	console.log("from getCredentials");
	var forUname,fname,lname,imgId;
	uname="",email="";
	forUname=got.split("uname=");
	console.log("String found getCredentials :"+forUname[1]);
	fname=forUname[1].split("%20");
	//console.log("first name is :"+fname[0]);
	lname=fname[1].split("&email=");
	//console.log("second name is :"+lname[0]);
	uname=fname[0]+" "+lname[0];
	console.log("user name is :"+uname);
	email=lname[1];
	email=email.split("&gId=");
	console.log("email is :"+email[0]);
	gId=email[1].split("&uP=");
	gId=gId[0];
	console.log("Id is :"+gId);
	uP=gId[1];
	console.log("uP is :"+uP);
	window.localStorage.setItem("tokenId", gId);
	window.localStorage.setItem("token", uname);

	//sendAuthenticateDetails(uname,email[0],gId,uP);
}

function sendAuthenticateDetails(uname,email,gplusId,userPage)
{
	var postUrl = "http://localhost:8080/IWBDPlugin/TestMessage?uname="+uname+"&email="+email+"&gplusId="+gplusId+"&userPage="+userPage;
	var xhr = new XMLHttpRequest();
	xhr.open('get', postUrl, true);
	var params = "hi";
	xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhr.onreadystatechange = function(progress) { 
		if (xhr.readyState == 4) {
			var b=this.response;
			console.log("message recieved.."+b);
			if(b=="allow")
				window.localStorage.setItem("token", tokenEntered);
		}
	};
	xhr.send(params);
	console.log("message sent..\n");
}
