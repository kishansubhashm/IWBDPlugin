var statusDisplay = null;
var valueSet;
var logging = false;
var uid;
var url="";
var uname;
var val1;
var prev;
var token;
var status="true";
var eventSource=null;
var textarea;
var chatType;
var loadMore=false;

chrome.browserAction.onClicked.addListener( function() {
	chrome.tabs.executeScript( { file: 'javaScriptFiles/background.js' } );
	chrome.tabs.executeScript( { file: 'javaScriptFiles/jquery.js' } );
	chrome.tabs.executeScript( { file: 'javaScriptFiles/jquery_1_11_0s.js' } );
});

chrome.tabs.query({'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT},	
		function(tabs){
	if (jQuery) {
		//alert("loaded");
		$(document).ready(function(){
			$("#summary").scroll(function(){
				if($("#summary").scrollTop()==0)
				{	
					//alert("reachedTop");
					loadMore=true;
				}
			});
		});
	} else {
		//alert("jQuery loaded");
		// jQuery not loaded
	}
	document.getElementById("get_url").innerHTML=tabs[0].url;
	url =tabs[0].url;
	uname=window.localStorage.getItem("token");
	uid=window.localStorage.getItem("tokenId");
	chatType = document.getElementById('chatType').value;
	window.localStorage.setItem("chatType",chatType);
	url=url.replace(/[^a-zA-Z0-9 ]/g, "");
	if(url.indexOf('#') === -1)
	{
		//callSSE(url,uname,uid);
		chrome.extension.getBackgroundPage().callSSEfromBackground(url,uname,uid,status);
		readDataBase(url,0);
		setInterval(function(){
			readDataBase(url,1);
			if(loadMore)
				loadMoreMessagesFromDataBase(url);
		},1500);
		/*setInterval(function(){
			forMessages();
		},2000);*/
	}
	else
	{
		//alert("hash found.");
		note.innerHTML ="<font color='red'><b>This is a private page<br>You cannot chat on this..<b></font>";
	}
	chrome.extension.getBackgroundPage().findCredentials();
});

window.addEventListener('load', function(evt) {

	tokenSaved=window.localStorage.getItem("token");
	//alert("token found is : "+token);
	if(tokenSaved!=null)
	{
		//alert("from token !=null, login as"+window.localStorage.getItem("token"));
		document.getElementById('chatInside').addEventListener('submit', sendMessage);
		statusDisplay = document.getElementById('summary');
		note= document.getElementById('notice');
		chrome.extension.getBackgroundPage().backgroundAjaxStart();
	}
	else
	{
		//alert("from token==null");
//		window.localStorage.setItem("token", "kishansubhash");
		/*document.getElementById('enterToken').addEventListener('submit', enterToken);
		toggleElement('chat');*/
		authenticate();
	}
});

function readDataBase(url,opening)
{
	//console.log("from readDataBase");
	if(window.localStorage.getItem("data") =="0001-0010-0100-1000" || opening==0)
	{
		var db = openDatabase('chat', '1.0', 'Test DB', 2 * 1024 * 1024);
		var msg;
		url=url.replace(/[^a-zA-Z0-9 ]/g, "");
		console.log("from readDataBase if condition");
		db.transaction(function (tx) {
			tx.executeSql('SELECT * FROM '+url+';', [], function (tx, results) {
				var len = results.rows.length, i;
				msg = "<p>Found rows: " + len + "</p>";
				//console.log(msg);
				statusDisplay.value="";
				for (i = 0; i < len; i++){
					msg = "\n"+results.rows.item(i).sender +" : "+results.rows.item(i).message;
					statusDisplay.value+=  msg;
					//	alert(msg);
					textBoxSize();
				}
			}, null);
		}); 
		/*		var textarea = document.getElementById('summary');
		textarea.scrollTop = textarea.scrollHeight+1;
		 */		window.localStorage.setItem("data", "0000-0000-0000-0000");
	}
	else 
	{
		//window.localStorage.setItem("data", "0000-0000-0000-0000");
		console.log("from readDataBase else condition");
	}

}
function loadMoreMessagesFromDataBase(url,opening)
{
	console.log("from load more");
	loadMore=false;
}
function textBoxSize()
{
	textarea = document.getElementById('summary');
	textarea.scrollTop = textarea.scrollHeight+1;
}



function forMessages()
{
	if(window.localStorage.getItem("data") =="0001-0010-0100-1000")
	{
		console.log("from forMessages");
		chrome.extension.sendRequest({message: "send"}, function(response) {
			console.log(response.statusToSend);
			if(response.statusToSend!="lolz")
			{
				statusDisplay.value+=response.farewell;
			}
		});
		window.localStorage.setItem("data", "0000-0000-0000-0000");
		textarea = document.getElementById('summary');
		textarea.scrollTop =99999;
	}
	else 
	{
		console.log("from forMessages else condition");
	}
}
function callSSE(url,uname,uid)
{
	tokenSaved=window.localStorage.getItem("token");
	if(tokenSaved!=null)
	{
		//console.log("status is"+status);
		eventSource=new EventSource('http://shalini-pc:8080/SimilarPracticum/GetMessagesServlet?uid='+uid+"&url="+url+"&uname="+uname+'&mes='+''+'&chatType='+chatType);
		//eventSource=new EventSource('http://shalini-pc:8080/NewOne/SSE?uid='+uid+"&url="+url+"&uname="+uname+'&mes='+''+'&status='+status);
		//eventSource=new EventSource('http://54.187.111.78:8080/NewOne/SSE?uid='+uid+"&url="+url+"&uname="+uname+'&mes='+''+'&status='+status);
		console.log('sse called');
		eventSource.onopen=function(){console.log('sse called from connected');statusDisplay.value+='connected...'+'\n';};
		eventSource.onmessage=function(message){console.log('sse called from message');statusDisplay.value+=message.data+'\n\n';};
		eventSource.onerror=function(){console.log('sse called from error');statusDisplay.value+="error";};
	}
}

function toggleElement(id) {
	var arr = [ "chat", "enterToken" ];
	var el = document.getElementById(id);
	for (var i = 0; i < arr.length; i++) {
		//if(arr[i]!=id){
		//   alert(id);
		if (el.getAttribute('class') == 'hide') {
			document.getElementById(arr[i]).style.display = '';
			el.setAttribute('class', 'show');
		} else {
			document.getElementById(arr[i]).style.display = 'none';
			el.setAttribute('class', 'hide');
		}
	}
}

chrome.runtime.onStartup.addListener(function () {
	console.log('Extension started up...');
	//chrome.storage.local.set({alarm_suffix: Date.now()});
	window.localStorage.setItem(key, valueSet);
});
//POST the data to the server using XMLHttpRequest
function sendMessage() {
	var b;
	//alert("from send message");
	console.log("from send message");
	note.innerHTML ="<font color='red'><b>sending..<b></font>";

	// Cancel the form submit
	event.preventDefault();

	// The URL to POST our data to
	var postUrl = "http://shalini-pc:8080/SimilarPracticum/AddMessageServlet?uid="+uid+"&url="+url+"&uname="+uname+"&mes="+document.getElementById('enterTextHere').value+"&chatType="+chatType;
	//var postUrl = "http://shalini-pc:8080/NewOne/AddMessageServlet?uid="+uid+"&url="+url+"&uname="+uname+"&mes="+document.getElementById('enterTextHere').value+"&status="+status ;
	//var postUrl = "http://54.187.111.78:8080/NewOne/AddMessageServlet?uid="+uid+"&url="+url+"&uname="+uname+"&mes="+document.getElementById('enterTextHere').value+"&status="+status ;

	// Set up an asynchronous AJAX POST request
	var xhr = new XMLHttpRequest();
	xhr.open('get', postUrl, true);
	// Prepare the data to be POSTed
	var post = encodeURIComponent(document.getElementById('enterTextHere').value);
	// var summary = encodeURIComponent(document.getElementById('summary').value);
	var params = post;
	// Set correct header for form data 
	xhr.setRequestHeader('Content-type', 'multipart/form-data');
	// Handle request state change events
	xhr.onreadystatechange = function() { 
		if (xhr.readyState == 4) {
			if (xhr.status == 200) {
				a=document.getElementById("summary").value;
				b=xhr.responseText;
				if(prev!=b)
					prev=b;
				document.getElementById('enterTextHere').value="";
				//alert("message sent sucessfully"+b);
				if(xhr.responseText="rcvd")
					note.innerHTML ="<font color='blue'><b>message sent sucessfully..<b></font>";
				else
					note.innerHTML ="<font color='red'><b>message not sent..<b></font>";
			} else {
				// Show what went wrong
				document.getElementById('enterTextHere').value="";
				note.innerHTML = "<b>something went wrong..</b><br>please check your net connection...";
			}
		}
	};
	// Send the request and set status
	xhr.send(params);
	console.log('Add message servlet..');
}

document.addEventListener('DOMContentLoaded', function () {
	document.getElementById('getToken').addEventListener('click', authenticate);
});
function authenticate()
{
	//uncomment below two lines
	//window.close();
	//for popup
	/*	var popwin =window.open('http://1-dot-iwb-auth-01.appspot.com/','0','width=500,height=500,toolbar=0,menubar=0,location=0,status=0,scrollbars=1,resizable=1,left=500,top=100');return true;*/
	//for new tab
	window.open('http://1-dot-iwb-auth-01.appspot.com/');
	popwin.focus();
}

document.addEventListener('DOMContentLoaded', function () {
	document.getElementById('logout').addEventListener('click', deleteToken);
});

document.addEventListener('DOMContentLoaded', function () {
	document.getElementById('chatType').addEventListener('change', setChatType);
	//console.log("from here");
});
function setChatType()
{	
	chatType = document.getElementById('chatType').value;
	//console.log("from setChatType, set chat type to : "+chatType);
	window.localStorage.setItem("chatType",chatType);
	//console.log(url,uname,uid,status);
	chrome.extension.getBackgroundPage().changingEventSource(url,uname,uid,status);
}
function deleteToken()
{
	//console.log("from delete token");
	chrome.extension.getBackgroundPage().closingEventSource();
	window.localStorage.removeItem("token");
	window.localStorage.removeItem("tokenId");
	toggleElement('chat');
}

function enterToken()
{
	event.preventDefault();
	var tokenEntered= document.getElementById('enterTokenTxt').value;
	alert("enterTokenTxt is : "+enterTokenTxt.value);
	if(tokenEntered!="" || tokenEntered!=null)
	{
		window.localStorage.setItem("token", tokenEntered);
		toggleElement('enterToken');
		alert("working");
	}
}

