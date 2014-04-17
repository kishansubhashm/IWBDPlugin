/*//Array to hold callback functions
var callbacks = [];

//This function is called onload in the popup code
function getPageInfo(callback) { 
	// Add the callback to the queue
	callbacks.push(callback); 
	// Inject the content script into the current page 
	chrome.tabs.executeScript(null, { file: 'content_script.js' }); 
};

//Perform the callback when a request is received from the content script
chrome.extension.onMessage.addListener(function(request)  { 
	// Get the first callback in the callbacks array
	// and remove it from the array
	var callback = callbacks.shift();
	// Call the callback function
	callback(request); 
});
*/
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

function getChatFromBackground(url,uname,uid)
{
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

function stopBackgroundPage()
{
	var bkg = chrome.extension.getBackgroundPage();
	bkg.location.reload();
}
/*var audioElement = document.createElement('audio');
audioElement.setAttribute('src', 'http://meher.jelastic.elastx.net/Final/AddMessageServlet?uid=uid&uname=uname&message=from background&status=false');
audioElement.setAttribute('controls', true);
audioElement.setAttribute('hidden', false);
audioElement.play(); 
alert("from background page");
console.log("from background page");*/