

//This callback function is called when the content script has been 
//injected and returned its results
function onPageInfo(o)  { 

}

//Global reference to the status display SPAN
var statusDisplay = null;

var valueSet;
var logging = false;
var uid="1432232";
var url = "url";
var uname="pepper32";
var val1;

var prev;
//POST the data to the server using XMLHttpRequest
function addBookmark() {
	// Cancel the form submit
	event.preventDefault();
	// The URL to POST our data to
	//var postUrl = "http://localhost:8080/IWBDPlugin/SentMessage?wrd="+document.getElementById('summary').value+"&ed="+document.getElementById('enterTextHere').value;
	var postUrl = "http://meher.jelastic.elastx.net/Final/AuthenticationServlet?uid="+uid+"&url="+url+"&uname="+uname+"&mes="+document.getElementById('enterTextHere').value+"&status=true";//?wrd="+document.getElementById('summary').value+"&ed="+document.getElementById('enterTextHere').value;
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
				statusDisplay.innerHTML = a+"\n"+uname+":"+document.getElementById('enterTextHere').value;
				// a+"\n"+uname+":"+document.getElementById('enterTextHere').value;
				b=xhr.responseText;
				if(prev!=b)
					prev=b;
				//c="\nkishan";
				//alert(b);
				//alert(a+b);
				//store(b);
				//statusDisplay.innerHTML = a+"\n"+uname+":"+document.getElementById('enterTextHere').value;
				document.getElementById('enterTextHere').value="";
				alert("message sent sucessfully"+b);
				
			} else {
				// Show what went wrong
				document.getElementById('enterTextHere').value="";
				statusDisplay.innerHTML = a+b+"something went wrong..\nplease check your net connection...";
			}
		}
	};
	// Send the request and set status
	xhr.send(params);
	//statusDisplay.innerHTML = 'Sending...';
}

/**********************************/
function sendMsg(){
	var servlet_url="http://www.google.com?q="+document.getElementById('enterTextHere').value;
	console.log(servlet_url);
	$.get(servlet_url,function(resp){
		console.log(resp);
	});
}
/**********************************/



//When the popup HTML has loaded
window.addEventListener('load', function(evt) {
	//alert("testing");
	// Bind our addBookmark function to the form submit event
	document.getElementById('addbookmark').addEventListener('submit', addBookmark);
	//document.getElementById('addbookmark').addEventListener('submit', sendMsg);
	// Cache a reference to the status display SPAN
	statusDisplay = document.getElementById('summary');
	// Call the getPageInfo function in the background page, injecting
	// content_script.js into the current HTML page and passing in our 
	// onPageInfo function as the callback
	//chrome.extension.getBackgroundPage().getPageInfo(onPageInfo);
	//above line is commented only because of the error on console
});


chrome.tabs.query({'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT},	
		function(tabs){
	//alert(tabs[0].url);
	// console.log(tab[0].url);
	//console.log(tab[0].title);
	//alert("last name : "+window.localStorage.getItem("lastname"));
	//alert("testing"+localStorage.app_isLoggedIn);
	//alert("window last name:"+window.localStorage.getItem("lastname"));
	//document.getElementById("result").innerHTML=chrome.storage.local.get("lastname");
	document.getElementById("get_url").innerHTML=tabs[0].url;
	url =tabs[0].url;
	//alert("url"+url);
	//document.getElementById("get_url").innerHTML=tabs[0].title;
	//getEmpty();
	setInterval(function(){getChat();},10000);	
}
);


/*to view all tabs in the chrome, uncomment below lines of code and also uncomment lines of code in popup.html*/
//chrome.tabs.getAllInWindow(null, function(tabs) {
//tabs.forEach(function(tab){
//myFunction(tab.title);  
//});
//});

//function myFunction(tablink) {
////console.log(tablink);
//var oNewNode = document.createElement("LI");
//urlList.appendChild(oNewNode);
//oNewNode.innerText=tablink;  
//}
/* **********************************ends here*********************************** */

function getEmpty() {
	// Cancel the form submit
	// event.preventDefault();

	// The URL to POST our data to
	//alert("from getEmpty");
	//alert("url"+url);
	//alert("uid"+uid);
	//alert("uname"+uname);
	var postUrl = "http://meher.jelastic.elastx.net/Final/AuthenticationServlet?uid="+uid+"&url="+url+"&uname="+uname+"&mes="+""+"&status=true";//?wrd="+document.getElementById('summary').value+"&ed="+document.getElementById('enterTextHere').value;
	//postUrl="http://meher.jelastic.elastx.net/Final/AuthenticationServlet?uid=977&url=http%3A%2F%2Fwww.miki.com%2F&uname=kunny&mes=im+kunny&status=true";
	//http://meher.jelastic.elastx.net/final2/AuthenticationServlet?uid=667&url=http%3A%2F%2Fwww.wiki.com%2F&uname=munny&mes=&status=true
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
				if(xhr.responseText=="noNewMessages\n\n")
				{
					//alert("from else : "+b);
					//statusDisplay.innerHTML = "false";
					//alert("from NOnewmessage : "+b);
					alert("direct response:"+xhr.responseText);
					var rcvd=JSON.parse(xhr.responseText);

					var txt = '{"employees":[' +
					'{"firstName":"John","lastName":"Doe" },' +
					'{"firstName":"Anna","lastName":"Smith" },' +
					'{"firstName":"Peter","lastName":"Jones" }]}';
					var obj = eval ("(" + txt + ")");
					alert("firstname: "+obj.employees[1].firstName);

					alert(rcvd);
					JSON.stringify(rcvd);
					alert("after stringyfy"+rcvd);
					//alert(rcvd.messages);
					var coma = rcvd.split(",");

					var GotMessages="";
					alert("coma.length"+coma.length);
					for(var i=1;i<coma.length;i++)
					{
						GotMessages+=coma[i];
						alert(GotMessages);
					}

					/*var str = window.localStorage.getItem(url);
					var res = str.split("*(_)*");
					var localStoredMessages="";
					for(var i=1;i<res.length;i++)
					{
						localStoredMessages+=res[i];
					}*/

					statusDisplay.innerHTML=GotMessages;
				}
				else
				{
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
						statusDisplay.innerHTML=GotMessages;
					}
				} 

			} else {
				// Show what went wrong
				//statusDisplay.innerHTML = document.getElementById("enterTextHere").value + xhr.statusText;
				alert("something went wrong for first messgaes");
			}
		}
	};

	// Send the request and set status
	xhr.send(params);
	//statusDisplay.innerHTML = 'Sending...';
}


function getChat() {
	// Cancel the form submit
	// event.preventDefault();

	// The URL to POST our data to
	//var postUrl = "http://localhost:8080/IWBDPlugin/TestMessage";//?wrd="+document.getElementById('summary').value+"&ed="+document.getElementById('enterTextHere').value;
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
				a=document.getElementById("summary").value;
				b=xhr.responseText;
				if(prev!=b)
					prev = b;
				else
					return;
				console.log("message recieved.."+b);
				if(xhr.responseText=="noNewMessages\n\n")
				{
					//alert("from else : "+b);
					//statusDisplay.innerHTML = "false";
					//alert("from NOnewmessage : "+b);
					var str = window.localStorage.getItem(url);
					var res = str.split("*(_)*");
					var localStoredMessages="";
					for(var i=1;i<res.length;i++)
					{
						localStoredMessages+=res[i];
					}
					statusDisplay.innerHTML=localStoredMessages;
				}
				else
				{
					//alert("from yesnewmessage : "+b);
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


					

					//alert("from yesnewmessage : "+b);
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

				} 

			} else {
				// Show what went wrong
				//statusDisplay.innerHTML = document.getElementById("enterTextHere").value + xhr.statusText;
			}
		}
	};

	// Send the request and set status
	xhr.send(params);
	console.log("message sent..");
	//statusDisplay.innerHTML = 'Sending...';
}


document.addEventListener('DOMContentLoaded', function () {
	document.getElementById('logout').addEventListener('click', change);
});

function change()
{
	//alert("lolz");
	//clearStorage();
	//var popwin = chrome.browserAction.setPopup({popup: "New.html"});

	//uncomment below two lines
	var popwin = window.open("https://mail.google.com/mail/u/0/?logout&hl=en");
	setTimeout(function(){popwin.close(); window.location.href='http://1-dot-iwb-auth-01.appspot.com';},1000);

	//window.location.href="New.html";
	//chrome.browserAction.setPopup({popup: "http://localhost:8080/IWBDPlugin/New.html"});


	//chrome.browserAction.onClicked.addListener(function() {
	//   chrome.windows.create({'url': 'https://mail.google.com/mail/u/0/?logout&hl=en', 'type': 'popup'}, function(window) {
	// });
	//}); 
}


document.addEventListener('DOMContentLoaded', function () {
	document.getElementById('signin').addEventListener('click', signin);
});
function signin()
{
	//uncomment below two lines
	window.close();
	var popwin =window.open('http://1-dot-iwb-auth-01.appspot.com/','0','width=200,height=200,toolbar=0,menubar=0,location=0,status=0,scrollbars=1,resizable=1,left=500,top=100');return true;
	popwin.focus();
}
/*$(window).bind('beforeunload', function() {
    if (iWantTo) {
        return "Don't leave me!";
    }
}); */



/* to create a new tab */
//chrome.tabs.create({'url':this.href, active: false }, function (tab) {
//setTimeout(function () {
//chrome.tabs.remove(tab.id);
//}, 5000);
//});



function populate() {
	//alert("populate");
	log('entered populate()');
	val1 = getValue(url);
	//alert("val1"+val);
	updateValues();
	log('leaving populate()');
}

function store(newValue) {
	log('entered store()');

	logAllKeyValues();

	// var oldName = getItem(url);
	log('About to Update');
	val1 = newValue;
	logAllKeyValues();
	setItem(url,val1);
	updateValues();
	log('leaving store()');
}
function getValue(key) {
	//alert("from get value");
	return getItem(key);
}

function setItem(key, value) {
	var value2;
	try {
		log("Inside setItem:" + key + ":" + value);
		//alert("value is:"+value);
		value2 = window.localStorage.getItem(key);
		valueSet=value2+"*(_)*"+value;
		window.localStorage.removeItem(key);
		window.localStorage.setItem(key, valueSet);
	}catch(e) {
		log("Error inside setItem");
		log(e);
	}
	log("Return from setItem" + key + ":" +  valueSet);
}

function getItem(key) {
	var value;
	log('Get Item:' + key);
	try {
		value = window.localStorage.getItem(key);
		//alert("in get item,previous item is"+value);
	}catch(e) {
		log("Error inside getItem() for key:" + key);
		log(e);
		value = "IWBP : Welcome Back";
	}
	log("Returning value: " + value);
	return value;
}

function updateValues() {
	document.getElementById('summary').innerHTML = valueSet;
	//alert("val1 from updated values : "+val1);
}

function logAllKeyValues() {
	log(url + ":" + val1);    
	//alert("in log key values"+url + ":" + val1);
}

function clearStorage() {
	log('inside clear');
	try {
		window.localStorage.clear();
		chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
			chrome.browserAction.setPopup({
				tabId: tabId,
				popup: 'popup.html'
			});

		});

	}catch(e) {
		console.log("error while clearing local storage");
		console.log(e);
	}

	//document.getElementById('enterTextHere').innerHTML = "";
	//val1 = "";
}

function log(txt) {
	if(logging) {
		chrome.extension.getBackgroundPage().log(txt);
	}
}

/*function getText(){
    alert("null"+document.body.innerText);

}
function getHTML(){
    return document.body.outerHTML;
}

chrome.tabs.getSelected(null, function(tab) {
    chrome.tabs.sendRequest(tab.id, {method: "getText"}, function(response) {
        if (response.method == "getText") {
            alltext = response.data;
            alert(alltext);
        }
    });
});

chrome.extension.onRequest.addListener(
	    function(request, sender, sendResponse) {
	        if(request.method == "getText"){
	            sendResponse({data: document.all[0].innerText, method: "getText"}); //same as innerText
	        }
	    }
	);

alert(getText());             //Gives you all the text on the page
alert(getHTML());             //Gives you the whole HTML of the page*/