var statusDisplay = null;
var valueSet;
var logging = false;
var uid="103365";
var url = "url";
var uname="pepper146";
var val1;
var prev;


chrome.browserAction.onClicked.addListener( function() {
	  chrome.tabs.executeScript( { file: 'javaScriptFiles/background.js' } );
	});

chrome.tabs.query({'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT},	
		function(tabs){

	
	document.getElementById("get_url").innerHTML=tabs[0].url;
	url =tabs[0].url;
	getInitialMessages();
	getChat();
	chrome.extension.getBackgroundPage().testing(3,4);
	//setInterval(function(){/*alert("3+4 is :"+*/chrome.extension.getBackgroundPage().testing(3,4);/*);*/},1000);	
	//setInterval(function(){getChat();},1000);	
});

window.addEventListener('load', function(evt) {
	document.getElementById('addbookmark').addEventListener('submit', sendMessage);
	statusDisplay = document.getElementById('summary');
	note= document.getElementById('notice');
});

//POST the data to the server using XMLHttpRequest
function sendMessage() {
	var a,b;
	//alert("from send message");
	console.log("from send message");
	note.innerHTML ="<font color='red'><b>sending..<b></font>";
	// Cancel the form submit
	event.preventDefault();
	// The URL to POST our data to
	//var postUrl = "http://localhost:8080/IWBDPlugin/SentMessage?wrd="+document.getElementById('summary').value+"&ed="+document.getElementById('enterTextHere').value;
	var postUrl = "http://meher.jelastic.elastx.net/Final/AddMessageServlet?uid="+uid+"&url="+url+"&uname="+uname+"&mes="+document.getElementById('enterTextHere').value+"&status=true";//?wrd="+document.getElementById('summary').value+"&ed="+document.getElementById('enterTextHere').value;
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
		// If the request completed
		if (xhr.readyState == 4) {
			//statusDisplay.innerHTML = '';
			if (xhr.status == 200) {
				a=document.getElementById("summary").value;
				//statusDisplay.innerHTML = a+"\n"+uname+":"+document.getElementById('enterTextHere').value;
				// a+"\n"+uname+":"+document.getElementById('enterTextHere').value;
				b=xhr.responseText;
				if(prev!=b)
					prev=b;
				//statusDisplay.innerHTML = a+"\n"+uname+":"+document.getElementById('enterTextHere').value;
				document.getElementById('enterTextHere').value="";
				//alert("message sent sucessfully"+b);
				note.innerHTML ="<font color='blue'><b>message sent sucessfully..<b></font>";
			} else {
				// Show what went wrong
				document.getElementById('enterTextHere').value="";
				note.innerHTML = "<b>something went wrong..</b><br>please check your net connection...";
			}
		}
		getChat();
	};
	// Send the request and set status
	xhr.send(params);
	console.log('Add message servlet..');
	//statusDisplay.innerHTML = 'Sending...';
}


function getInitialMessages() {
	var postUrl = "http://meher.jelastic.elastx.net/Final/AuthenticationServlet?uid="+uid+"&url="+url+"&uname="+uname+"&mes="+""+"&status=true";

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
		// If the request completed
		if (xhr.readyState == 4) {
			//statusDisplay.innerHTML = '';
			if (xhr.status == 200) {

				//alert("last name:"+window.localStorage.getItem("lastname"));
				a=document.getElementById("summary").value;
				b=xhr.responseText;	
				//alert("response is:"+xhr.responseText);

				//alert("from yesnewmessage : "+b);
				//store(b);
				var str = window.localStorage.getItem(url);
				//var res = str.split("*(_)*");
				var localStoredMessages="";

				//alert("direct response:"+xhr.responseText);
				var rcvd=xhr.responseText;
				var obj=JSON.parse(rcvd);
				//alert("after parsing: "+obj.Messages);
				if(obj.Messages=="")
				{
					//alert("from no reply getEmpty: "+obj.Messages);
				}
				else if(obj.Messages!="")
				{
					var coma = obj.Messages.split(",");
					var GotMessages="";
					//alert("coma.length"+coma.length);

					GotMessages=coma[1];

					for(var i=2;i<coma.length;i++)
					{
						GotMessages+="\n"+coma[i];
						//store(GotMessages);//storing in local storage
					}
					console.log(GotMessages);
					AppendMessages(GotMessages);

				}

				note.innerHTML ="";
				getChat();
			} else {
				// Show what went wrong
				//statusDisplay.innerHTML = document.getElementById("enterTextHere").value + xhr.statusText;
				alert("something went wrong for first messgaes");
			}
		}
	};
function AppendMessages(GotMessages)
{
	statusDisplay.innerHTML=GotMessages;
}
	// Send the request and set status
	xhr.send(params);
	console.log('Activation servlet called..');
	//statusDisplay.innerHTML = 'Sending...';
}


function getChat() {
	// Cancel the form submit
	// event.preventDefault();

	// The URL to POST our data to
	//var postUrl = "http://localhost:8080/IWBDPlugin/TestMessage";//?wrd="+document.getElementById('summary').value+"&ed="+document.getElementById('enterTextHere').value;
	var postUrl = "http://meher.jelastic.elastx.net/Final/UpdateMessageServlet?uid="+uid+"&url="+url+"&uname="+uname+"&mes="+""+"&status=true";
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
		// If the request completed
		if (xhr.readyState == 4) {
			//statusDisplay.innerHTML = '';
			if (xhr.status == 200) {
				a=document.getElementById("summary").value;
				b=xhr.responseText;
				console.log("response from getchat"+b);
				if(prev!=b)
					prev = b;
				else
				{
				//	getChat();
					return;
				}

				console.log("message recieved.."+b);

				/*store(b);
					var str = window.localStorage.getItem(url);
					var res = str.split("*(_)*");
					var localStoredMessages="";
					for(var i=1;i<res.length;i++)
					{
						localStoredMessages+=res[i];
					}
					if(localStoredMessages==null)
						localStoredMessages="";
					statusDisplay.innerHTML=localStoredMessages+b;*/
				//store(b);
				var str = window.localStorage.getItem(url);
				//var res = str.split("*(_)*");
				var localStoredMessages="";

				//alert("direct response:"+xhr.responseText);
				var rcvd=xhr.responseText;
				var obj=JSON.parse(rcvd);
				//alert("after parsing: "+"test"+obj.Messages+"ends");
				if(obj.Messages=="")
				{
					//alert("from no reply getChat: "+obj.Messages);
				}
				else if(obj.Messages!=""||obj.Messages.length>0)
				{


					/*var str = window.localStorage.getItem(url);
						var res = str.split("*(_)*");
						var localStoredMessages="";
						for(var i=1;i<res.length;i++)
						{
							localStoredMessages+=res[i];
							//store(localStoredMessages);
						}
						if(localStoredMessages==null)
							localStoredMessages="";
						statusDisplay.innerHTML=localStoredMessages+b;*/


					var coma = obj.Messages.split(",");

					var GotMessages="";
					//console.log("coma.length"+coma.length);

					GotMessages+=coma[1];
					for(var i=2;i<coma.length;i++)
					{
						GotMessages+="\n"+coma[i];
						//store(GotMessages);//storing in local storage
					}
					var inhtml = statusDisplay.innerHTML;
					statusDisplay.innerHTML = "";
					statusDisplay.innerHTML = inhtml+"\n" + GotMessages;

				}
				note.innerHTML ="";
				getChat();
			} else {
				// Show what went wrong
				//statusDisplay.innerHTML = document.getElementById("enterTextHere").value + xhr.statusText;
			}
		}
	};

	// Send the request and set status
	xhr.send(params);
	console.log("reqest_message sent from getChat..");
	//statusDisplay.innerHTML = 'Sending...';
}

