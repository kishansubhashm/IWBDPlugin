var tempUrl;
var curUrl;
var setUrl;
var uId="";
var uP="dummy2";
var img="";
var intrests="";
var statusToSend="lolz";
var ttlNoOfusers="";
var eventSource=null;
var idleTime;
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

function callSSEfromBackground(url,uid,status,chatType)
{
	idleTime = 0;
	tokenSaved=window.localStorage.getItem("tokenId");
	if(tokenSaved!=null)
	{
		/*if(window.localStorage.getItem("isRun")=="Similar")
		{
			//console.log("from similar changing");
			changingEventSourceWithoutAlert(url,uid,status);
		}*/
		statusDisplay = document.getElementById('summary');
		if(chatType=="Similar")    
			//eventSource=new EventSource('http://54.187.111.78:8080/SimilarPracticum2.1/GetMessagesServlet?uid='+uid+"&url="+url+"&uname="+uname+'&mes='+''+'&chatType='+chatType);
			eventSource=new EventSource('http://10.10.11.97:8080/SimilarPracticum2.1/GetMessagesServlet?uid='+uid+"&url="+url+'&mes='+''+'&chatType='+chatType);
		else if(chatType=="Exact")
			//eventSource=new EventSource('http://54.187.111.78:8080/SimilarPracticum2.1/GetMessagesServlet?uid='+uid+"&url="+url+"&uname="+uname+'&mes='+''+'&chatType='+chatType);
			eventSource=new EventSource('http://10.10.11.97:8080/SimilarPracticum2.1/GetMessagesServlet?uid='+uid+"&url="+url+'&mes='+''+'&chatType='+chatType);
		window.localStorage.setItem("isRun",chatType);

		console.log('sse called');
		eventSource.onopen=function(){console.log('sse called from connected');};
		eventSource.onmessage=function(message){
			console.log('http://10.10.11.97:8080/SimilarPracticum/GetMessagesServlet?uid='+uid+"&url="+url+'&mes='+''+'&chatType='+chatType);
			console.log('sse called from message');
			if(message.data!="empty")
			{
				var mes=message.data;
				console.log("mes:"+mes);
				var checkurl="";
				chatTypeFromRcvdServer="";
				temp1=mes.split("[(:-,;,-:)]");
				checkurl=temp1[0];					//to which it is to be stored
				chatTypeFromRcvdServer=temp1[1];	//gives info abt chat type 
				dataTtlRcvd=temp1[2];				//data we get
				ttlNoOfusers=temp1[3];				//total no.of user online

				console.log("temp is"+dataTtlRcvd);

				/*
				 * temp is hi[(:-,-:)]1401294349113[(:-,-:)]100823943353644264890[(:-,-:)]kishan subhash[(:-,-:)]https://www.youtube.com/watch?v=N1jH5nBQs0c
				 * 		[(:-,-:)]https://lh4.googleuserc…com/-tAdqoOZQZ6M/AAAAAAAAAAI/AAAAAAAAA18/rl28_cwZFoU/photo.jpg?sz=50[(:-,-:)] 
				 * 
				 * */				


				dataIndividualMessages=dataTtlRcvd.split("[(:-;-:)]");
				for(var j=0;j<dataIndividualMessages.length-1;j++)
				{		var arrTemp=dataIndividualMessages[j].split("[(:-,-:)]");
				message=arrTemp[0];
				time=arrTemp[1];
				uidSender=arrTemp[2];
				sender=arrTemp[3];
				SenderUrlRcvd=arrTemp[4];
				img=arrTemp[5];//profile image
				intrests=arrTemp[6];
				console.log("chatType recieved is"+chatTypeFromRcvdServer);
				console.log("temp is"+dataTtlRcvd);
				console.log("sender is"+sender);
				console.log("message is"+message);
				console.log("time is"+time);
				console.log("user id is"+uidSender);
				console.log("image is"+img);
				console.log("intrests are"+intrests);

				console.log("SenderUrlRcvd id is"+SenderUrlRcvd);
				if(chatTypeFromRcvdServer=="Exact" || chatTypeFromRcvdServer=="exact"){
					saveIntoDb(checkurl, sender, message, time, uidSender, SenderUrlRcvd, img, intrests);}
				else{
					saveIntoDb("SimilarTemp", sender, message, time, uidSender, SenderUrlRcvd, img, intrests);}
				}
			}
			else
				statusToSend="lolz";
		};
		eventSource.onerror=function(){console.log('sse called from error');console.log('error');};
	}
}

function changingEventSource(urlSend,uid,status)
{
	url=urlSend;
	console.log("from changingEventSource to : "+window.localStorage.getItem("chatType"));
	closingEventSource();
	closingEventSource();
	if(window.localStorage.getItem("chatType")=="Similar")
		alert("you have swiched to "+window.localStorage.getItem("chatType")+" mode\nYour messages can be seen to all Domain members");
	else if(window.localStorage.getItem("chatType")=="Exact")
		alert("you have swiched to "+window.localStorage.getItem("chatType")+" mode");
	chatType=window.localStorage.getItem("chatType");
	callSSEfromBackground(url,uid,status,chatType);
//	console.log("after again calling callSSEfromBackground");
}
function changingEventSourceWithoutAlert(url,uid,status)
{
	console.log("from changingEventSource to : "+window.localStorage.getItem("chatType"));
	closingEventSource();
	closingEventSource();
	chatType=window.localStorage.getItem("chatType");
	callSSEfromBackground(url,uid,status,chatType);
}
function closingEventSource()
{
	console.log("from closingEventSource");
	eventSource.close();
}
function saveIntoDb(checkurl, sender, message, time, uidSender, SenderUrlRcvd, img, intrests)
{

	try
	{
		var curDatAndTime=getCurDateAndTime();
		console.log("url is"+checkurl);
		//var str = "abc's test#s";
		checkurl=checkurl.replace(/[^a-zA-Z0-9 ]/g, "");
		var db = openDatabase('chat', '1.0', 'Test DB', 2 * 1024 * 1024);
		db.transaction(function (tx) {
			tx.executeSql('CREATE TABLE IF NOT EXISTS '+checkurl+' (localDateTime, sender, message, time, uidSender, SenderUrlRcvd, img, intrests)');
			console.log('INSERT INTO '+checkurl+' (localDateTime, sender, message, time, uidSender, SenderUrlRcvd, img, intrests) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [curDatAndTime, sender, message, time, uidSender, SenderUrlRcvd, img, intrests]+')');
			tx.executeSql('INSERT INTO '+checkurl+' (localDateTime, sender, message, time, uidSender, SenderUrlRcvd, img, intrests) VALUES (?, ?, ?, ?, ?, ?, ?, ? )', [curDatAndTime, sender, message, time, uidSender, SenderUrlRcvd, img, intrests]);
			window.localStorage.setItem("data", "0001-0010-0100-1000");
			console.log("message saved successfully to database");
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
			if (request.greeting == "count")
				sendResponse({count: ttlNoOfusers});
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
	var availToken=window.localStorage.getItem("tokenId");
	var found="yes";
	var matchUrl="http://rahul:8080/SimilarPracticum2.1/loginSucessfulPage.html";
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
	var temp=got.split("=");
	console.log(temp[0]);
	console.log(temp[1]);
	var temp2=temp[1].split("&uname");
	console.log(temp2[0]);
	console.log(temp2[1]);
	uId=temp2[0];
	window.localStorage.setItem("tokenId", uId);
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

function closeEventSourceWhenIdleFromBackground()
{
	console.log("reached timerIncrement");
	idleTime = idleTime + 1;
	if (idleTime > 5) { // 5 minutes
		closingEventSource();
	}
}
