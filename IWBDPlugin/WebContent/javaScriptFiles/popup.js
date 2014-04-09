//This callback function is called when the content script has been 
//injected and returned its results
function onPageInfo(o)  { 

}

//Global reference to the status display SPAN
var statusDisplay = null;

var valueSet;
 var logging = false;
      var key1 = "Name";
	  var val1;
	  
	  
//POST the data to the server using XMLHttpRequest
function addBookmark() {
	// Cancel the form submit
	event.preventDefault();

	// The URL to POST our data to
	var postUrl = "http://localhost:8080/IWBDPlugin/SentMessage?wrd="+document.getElementById('summary').value+"&ed="+document.getElementById('enterTextHere').value;

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
				// If it was a success, close the popup after a short delay
				document.getElementById('enterTextHere').value="";
				a=document.getElementById("summary").value;
				b=xhr.responseText;
				//c="\nkishan";
				//alert(b);
				//alert(a+b);
				 store(b);
				statusDisplay.innerHTML = a+b;
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

//When the popup HTML has loaded
window.addEventListener('load', function(evt) {
	//alert("testing");
	// Bind our addBookmark function to the form submit event
	document.getElementById('addbookmark').addEventListener('submit', addBookmark);
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
	document.getElementById("get_url").innerHTML=tabs[0].url;
	//document.getElementById("get_url").innerHTML=tabs[0].title;
	setInterval(function(){getChat();},3000);	
}
);

				/*to view all tabs in the chrome, uncomment below lines of code and also uncomment lines of code in popup.html*/
//chrome.tabs.getAllInWindow(null, function(tabs) {
//	tabs.forEach(function(tab){
//		myFunction(tab.title);  
//	});
//});
//
//function myFunction(tablink) {
//	//console.log(tablink);
//	var oNewNode = document.createElement("LI");
//	urlList.appendChild(oNewNode);
//	oNewNode.innerText=tablink;  
//}
/* **********************************ends here*********************************** */


function getChat() {
	// Cancel the form submit
	// event.preventDefault();

	// The URL to POST our data to
	var postUrl = "http://localhost:8080/IWBDPlugin/TestMessage";//?wrd="+document.getElementById('summary').value+"&ed="+document.getElementById('enterTextHere').value;

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

				if(xhr.responseText=="noNewMessages\n\n")
					{
						//alert("from else : "+b);
						//statusDisplay.innerHTML = "false";
					//alert("from NOnewmessage : "+b);
					var str = window.localStorage.getItem(key1);
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
						store(b);
						var str = window.localStorage.getItem(key1);
						var res = str.split("*(_)*");
						var localStoredMessages="";
						for(var i=1;i<res.length;i++)
						{
							localStoredMessages+=res[i];
						}
						if(localStoredMessages==null)
							localStoredMessages="";
						statusDisplay.innerHTML=localStoredMessages+b;
					} 

			} else {
				// Show what went wrong
				//statusDisplay.innerHTML = document.getElementById("enterTextHere").value + xhr.statusText;
			}
		}
	};

	// Send the request and set status
	xhr.send(params);
	//statusDisplay.innerHTML = 'Sending...';
}


document.addEventListener('DOMContentLoaded', function () {
	document.getElementById('logout').addEventListener('click', change);
	});

function change()
{
	alert("lolz");
	//var popwin = chrome.browserAction.setPopup({popup: "New.html"});
	var popwin = window.open("https://mail.google.com/mail/u/0/?logout&hl=en");
	setTimeout(function(){popwin.close(); window.location.href='http://1-dot-iwb-auth-01.appspot.com';},1000);
	//window.location.href="New.html";
	//chrome.browserAction.setPopup({popup: "http://localhost:8080/IWBDPlugin/New.html"});
	 
	 
	 //chrome.browserAction.onClicked.addListener(function() {
		//   chrome.windows.create({'url': 'https://mail.google.com/mail/u/0/?logout&hl=en', 'type': 'popup'}, function(window) {
		  // });
		//}); 
}



/*$(window).bind('beforeunload', function() {
    if (iWantTo) {
        return "Don't leave me!";
    }
}); */



/* to create a new tab */
//chrome.tabs.create({'url':this.href, active: false }, function (tab) {
//	  setTimeout(function () {
//	    chrome.tabs.remove(tab.id);
//	  }, 5000);
//	});



function populate() {
	  //alert("populate");
  log('entered populate()');
  val1 = getValue(key1);
	  //alert("val1"+val);
  updateValues();
  log('leaving populate()');
}

function store(newValue) {
  log('entered store()');

  logAllKeyValues();

 // var oldName = getItem(key1);
  log('About to Update');
  val1 = newValue;
  logAllKeyValues();
  setItem(key1,val1);
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
	  alert("value is:"+value);
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
  log(key1 + ":" + val1);    
	//alert("in log key values"+key1 + ":" + val1);
}

function clearStorage() {
  log('inside clear');
    try {
      chrome.extension.getBackGroundPage().clearStrg();
    }catch(e) {
      console.log("error while clearing local storage");
      console.log(e);
    }

    document.getElementById('enterTextHere').innerHTML = "";
    val1 = "";
}
function log(txt) {
  if(logging) {
    chrome.extension.getBackgroundPage().log(txt);
  }
}