var statusDisplay = null;
var valueSet;
var logging = false;
var uid;
var url="";
var urlSend="";
var val1;
var prev;
var token;
var status="true";
var eventSource=null;
var textarea;
var chatType;
var cssAdd;
var count;
var divChangeTime=0;
var db = openDatabase('chat', '1.0', 'Test DB', 2 * 1024 * 1024);
chrome.browserAction.onClicked.addListener( function() {
	chrome.tabs.executeScript( { file: 'javaScriptFiles/background.js' } );
	chrome.tabs.executeScript( { file: 'javaScriptFiles/jquery.js' } );


});

chrome.tabs.query({'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT},	
		function(tabs){
	document.getElementById("get_url").innerHTML=tabs[0].url;
	url =tabs[0].url;
	urlSend=tabs[0].url;
	console.log(urlSend);			//to print sending url
	uid=window.localStorage.getItem("tokenId");
	chatType ="Exact";
	//chatType ="Similar";
	db.transaction(function (tx) {
		tx.executeSql('DROP TABLE SimilarTemp');
	});
	window.localStorage.setItem("chatType",chatType);
	url=url.replace(/[^a-zA-Z0-9 ]/g, "");
	if(url.indexOf('#') === -1)
	{
		cssAdd="<style>ul{margin:0; padding:0; list-style:none; display:inline-block; width:300px; text-align:left; vertical-align:middle; }ul li{ line-height:30px; overflow:hidden; padding:4px 0; }.togglebox input{ display:none; }.togglebox{ display:inline-block; border:1px solid #BBB; width:90px; height:30px; position:relative; border-radius:20px; color:#FFF; font-weight:bold; overflow:hidden; box-shadow:0 1px 0 #CCC; }.togglebox label{ width:200%; height:100%; line-height:30px; border-radius:0.4em; position:absolute; top:0; left:0; z-index:1; font-size:1.1em; cursor:pointer; -webkit-transition:height 0.12s; -moz-transition:height 0.12s; transition:height 0.12s; }.togglebox span{ position:absolute; right:-100px; }.togglebox label::before{ content:'Exact'; width:62px; float:left; margin-right:-16px; padding-right:13px; text-align:center; background:#333; text-shadow:0 -1px 0px #093B5C; box-shadow:0 4px 5px -2px rgba(0,0,0,0.3) inset; }.togglebox label b{ display:block; height:100%; width:30px; float:left; position:relative; z-index:1; border:1px solid #AAA; background:#F6F6F6; box-shadow:0 4px 0 -2px #F1F1F1 inset, 0 2em 2em -2em #AAA inset, 0 0 2px rgba(0,0,0,.5); border-radius:20px; }.togglebox label:hover b{ background:#E5E5E5; }.togglebox label::after{ content:'Similar'; width:62px; float:left; margin-left:-15px; padding-left:13px; text-align:center; background:#333; box-shadow:0 4px 5px -2px rgba(0,0,0,0.3) inset; }.togglebox input:checked ~ label{ left:-60px; }<style>";
		$(document).ready(function(){
			$( "table td").html(cssAdd);
			//$('#tableMenu td:first-child').addClass(cssAdd);
			console.log("hi jquery");
		});

		chatType=window.localStorage.getItem("chatType");
		chrome.extension.getBackgroundPage().callSSEfromBackground(urlSend,uid,status,chatType);
		toCallDtabase();
	}
	else
	{
		note.innerHTML ="<font color='red'><b>This is a private page<br>You cannot chat on this..<b></font>";
	}

	chrome.extension.getBackgroundPage().findCredentials();
});

function toCallDtabase()
{
	readDataBase(url,0);
	setInterval(function(){
		//console.log("from toCallDtabase");
		getUsersCount();
		readDataBase(url,1);
	},1500);
}

window.addEventListener('load', function(evt) {

	tokenSaved=window.localStorage.getItem("tokenId");
	//alert("token found is : "+token);
	if(tokenSaved!=null)
	{
		//alert("from token !=null, login as"+window.localStorage.getItem("token"));
		document.getElementById('chatInside').addEventListener('submit', sendMessage);
		statusDisplay = document.getElementById('summary');
		note= document.getElementById('notice');
		count=document.getElementById('users');
		chrome.extension.getBackgroundPage().backgroundAjaxStart();
		submitMessageWhenEnteredMessage();
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


function submitMessageWhenEnteredMessage()
{
	$(document).ready(function(){
		//console.log("loaded");
		/*$('#enterTextHere').keydown(function(event) {
			if (event.keyCode == 13) 
			{
				console.log("inside if");
				sendMessage();
			}
		});
	});
		 */
		$("#enterTextHere").keydown(function(e) {
			/*if((e.which == 10 || e.which == 13) && e.shiftKey) {
				console.log("inside  if");
			}
			else*/ if (e.which == 10 || e.which == 13) {
				//console.log("inside else if");
				sendMessage();
			}
		});
	});
}

function readDataBase(url,opening)
{
	//console.log("from readDataBase");
	if(window.localStorage.getItem("data") =="0001-0010-0100-1000" || opening==0)
	{
		if(window.localStorage.getItem("chatType")=="Similar"){
			url="SimilarTemp";
		}
		url=url.replace(/[^a-zA-Z0-9 ]/g, "");
		console.log("from readDataBase if condition");
		db.transaction(function (tx) {
			tx.executeSql('SELECT * FROM '+url+';', [], function (tx, results) {
				var len = results.rows.length, i;
				msg = "<p>Found rows: " + len + "</p>";
				//console.log(msg);
				//statusDisplay.value="";
				var sample="";
				var sampleT="";
				var undb="";
				var mesdb="";
				var urldb="";
				var profileUid="";
				var img="";
				var intrests="";
				for (i = 0; i < len; i++){
					undb=results.rows.item(i).sender;
					mesdb=results.rows.item(i).message;
					urldb=results.rows.item(i).SenderUrlRcvd;
					profileUid=results.rows.item(i).uidSender;
					img=results.rows.item(i).img;
					intrests=results.rows.item(i).intrests;
					if(profileUid==uid)
					{
						sample='<div class="Area" id="yours">' 
							+'<div class="R">'
							+'<a id='+profileUid+'>'
							+'<img name="'+profileUid+'s" src='+img+'>'
							+'</a>'
							+'</div>'
							+'<div class="text L textL" id="message">'+mesdb
							+'</div>'
							+'</div>';
					}
					else
					{
						sample='<div class="Area" id="others">' 
							+'<div class="L">'
							+'<a id='+profileUid+'>'
							+'<img name="'+profileUid+'s" src='+img+'>'
							+'<div class="tooltip"> name: '+undb+'<br> url:'+urldb+'<br> intrests:'+intrests+'</div></a>'
							+'</div>'
							+'<div class="text R textR" id="message">'+mesdb
							+'</div>'
							+'</div>';
					}
					sampleT+=sample;
					var objDiv = document.getElementById("cntn");
					objDiv.scrollTop = objDiv.scrollHeight;
					//	textBoxSize();
				}
				$( "#cntn").html(sampleT);
				/*to get the id's of the elements dynamically*/
				var element = $('<a>');
				element.attr('id', profileUid);
				element.text("Whatever");
				element.click(gotoGoogleProfile());
				//element.appendTo(parent);
				var objDiv = document.getElementById("cntn");
				objDiv.scrollTop = objDiv.scrollHeight;
			}, null);
		});		/*		var textarea = document.getElementById('summary');
		textarea.scrollTop = textarea.scrollHeight+1;
		 */		
		window.localStorage.setItem("data", "0000-0000-0000-0000");
	}
	else 
	{
		//window.localStorage.setItem("data", "0000-0000-0000-0000");
		console.log("from readDataBase else condition");
	}

}

function getUsersCount()
{
	chrome.extension.sendRequest({greeting: "count"},
			function(response) { 
		// console.log(response.count)	  	  
		count.innerHTML ="<font>"+response.count+"</font>";
		divChangeTime++;
		if(divChangeTime>=3)
		{
			note.innerHTML ="";
			divChangeTime=0;
		}
	});
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


	// Cancel the form submit
	event.preventDefault();

	// The URL to POST our data to

	var enteredData=document.getElementById('enterTextHere').value;
	enteredData=enteredData.trim();
	if(!(enteredData==""||enteredData==" "||enteredData==null))
	{
		chatType=window.localStorage.getItem("chatType");
		console.log("from send message");
		note.innerHTML ="<font color='red'><b>sending..<b></font>";
		var postUrl = "http://10.10.11.97:8080/SimilarPracticum2.1/AddMessageServlet?uid="+uid+"&url="+urlSend+"&mes="+enteredData+"&chatType="+chatType;
		document.getElementById('enterTextHere').value="";
		// Set up an asynchronous AJAX POST request
		var xhr = new XMLHttpRequest();
		xhr.open('get', postUrl, true);
		// Prepare the data to be POSTed
		var post = encodeURIComponent(document.getElementById('enterTextHere').value);
		var params = post;
		// Set correct header for form data 
		xhr.setRequestHeader('Content-type', 'multipart/form-data');
		// Handle request state change events
		xhr.onreadystatechange = function() { 
			if (xhr.readyState == 4) {
				if (xhr.status == 200) {
					b=xhr.responseText;
					if(prev!=b)
						prev=b;
					//alert("message sent sucessfully"+b);
					if(xhr.responseText=="rcvd")
					{
						note.innerHTML ="<font color='blue'><b>message sent sucessfully..<b></font>";
					}
					else
					{
						note.innerHTML ="<font color='red'><b>message not sent..<b></font>";
					}
				} else {
					document.getElementById('enterTextHere').value="";
					note.innerHTML = "<b>something went wrong..</b><br>please check your net connection...";
				}
			}
		};
		// Send the request and set status
		xhr.send(params);
		console.log('Add message servlet..');
	}
	else
	{
		document.getElementById('enterTextHere').value="";
	}
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
	document.getElementById('chkbx').addEventListener('click', setChatType2);
	console.log("from here");
});

function setChatType2()
{	
	console.log("from setChatType2");
	console.log(urlSend,uid,status);
	if(window.localStorage.getItem("chatType")=="Exact"){
		console.log("from setChatType2 Exact");
		window.localStorage.setItem("chatType","Similar");
		$( "#cntn" ).empty();
//		window.localStorage.setItem("isRun", "Similar");
		window.localStorage.setItem("data", "0001-0010-0100-1000");
		chrome.extension.getBackgroundPage().changingEventSource(urlSend,uid,status);
	}
	else if(window.localStorage.getItem("chatType")=="Similar"){
		console.log("from setChatType2 Similar");
		window.localStorage.setItem("chatType","Exact");
		$( "#cntn" ).empty();
//		window.localStorage.setItem("isRun", "Exact");
		window.localStorage.setItem("data", "0001-0010-0100-1000");
		chrome.extension.getBackgroundPage().changingEventSource(urlSend,uid,status);
	}
}
//for combobox,uncomment in popup.html also if below is uncommented
/*document.addEventListener('DOMContentLoaded', function () {
document.getElementById('chatType').addEventListener('change', setChatType);
//console.log("from here");
});*/

/*function setChatType()
{	
	chatType = document.getElementById('chatType').value;
	//console.log("from setChatType, set chat type to : "+chatType);
	window.localStorage.setItem("chatType",chatType);
	//console.log(url,uname,uid,status);
	chrome.extension.getBackgroundPage().changingEventSource(url,uname,uid,status);
}*/
function deleteToken()
{
	//console.log("from delete token");
	chrome.extension.getBackgroundPage().closingEventSource();
	window.localStorage.removeItem("token");
	window.localStorage.removeItem("tokenId");
	chrome.tabs.create({url:'https://mail.google.com/mail/ca/u/0/?logout&hl=en&hlor'});
	//toggleElement('chat');
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
function best()
{
	console.log("from best");
	//chrome.tabs.onUpdated.addListener('DOMContentLoaded', function () {
	document.addEventListener('DOMContentLoaded', function () {
		console.log("from DOMContentLoaded1");
		document.getElementById('img').addEventListener('click',gotoGoogleProfile());
	});
}
function gotoGoogleProfile(){
	//console.log("in gotoGoogleProfile");
	$(function() {
		$('a').click(function() {
			console.log(this.id);
			//alert(this.id);
			chrome.tabs.create({url:'https://plus.google.com/'+this.id+'/posts'});
		});
	});
}
function closeEventSourceWhenIdle() {

	$(document).ready(function () {
		//console.log("hieer");
		//Zero the idle timer on mouse movement.
		$(this).mousemove(function (e) {
			idleTime = 0;
			console.log(idleTime);
			chrome.extension.getBackgroundPage().closeEventSourceWhenIdleFromBackground();
		});
		$(this).keypress(function (e) {
			idleTime = 0;
			console.log(idleTime);
			chrome.extension.getBackgroundPage().closeEventSourceWhenIdleFromBackground();
		});
	});

}