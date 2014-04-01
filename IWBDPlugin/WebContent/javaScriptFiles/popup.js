// This callback function is called when the content script has been 
// injected and returned its results
function onPageInfo(o)  { 
    
}

// Global reference to the status display SPAN
var statusDisplay = null;

// POST the data to the server using XMLHttpRequest
function addBookmark() {
    // Cancel the form submit
    event.preventDefault();

    // The URL to POST our data to
    var postUrl = "http://localhost:8080/IWBDP/SentMessage?wrd="+document.getElementById('summary').value+"&ed="+document.getElementById('enterTextHere').value;

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
					//alert(b);
					//alert(a+b);
                statusDisplay.innerHTML =   a+b;
                
                window.setTimeout(window.close, 60000);
            } else {
                // Show what went wrong
                statusDisplay.innerHTML = document.getElementById("enterTextHere").value + xhr.statusText;
            }
        }
    };

    // Send the request and set status
    xhr.send(params);
    //statusDisplay.innerHTML = 'Sending...';
}

// When the popup HTML has loaded
window.addEventListener('load', function(evt) {
    // Bind our addBookmark function to the form submit event
    document.getElementById('addbookmark').addEventListener('submit', addBookmark);
    // Cache a reference to the status display SPAN
    statusDisplay = document.getElementById('summary');
    // Call the getPageInfo function in the background page, injecting
    // content_script.js into the current HTML page and passing in our 
    // onPageInfo function as the callback
    chrome.extension.getBackgroundPage().getPageInfo(onPageInfo);
});


chrome.tabs.query({'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT},	
		function(tabs){
			//alert(tabs[0].url);
			// console.log(tab[0].url);
			//console.log(tab[0].title);
			document.getElementById("get_url").innerHTML=tabs[0].title;
			setInterval(function(){getChat();},3000);	
		}
		);

		/*to view all tabs in the chrome*/
		chrome.tabs.getAllInWindow(null, function(tabs) {
		    tabs.forEach(function(tab){
		      myFunction(tab.title);  
		    });
		  });

		  function myFunction(tablink) {
		    //console.log(tablink);
		    var oNewNode = document.createElement("LI");
		    urlList.appendChild(oNewNode);
		    oNewNode.innerText=tablink;  
		  }

		  
		  
		  function getChat() {
			    // Cancel the form submit
			   // event.preventDefault();

			    // The URL to POST our data to
			    var postUrl = "http://localhost:8080/IWBDP/TestMessage";//?wrd="+document.getElementById('summary').value+"&ed="+document.getElementById('enterTextHere').value;

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
							a=document.getElementById("summary").value;
							b=xhr.responseText;
								//alert(b);
								//alert(a+b);
			                statusDisplay.innerHTML =   a+b;
			                
			                window.setTimeout(window.close, 60000);
			            } else {
			                // Show what went wrong
			                statusDisplay.innerHTML = document.getElementById("enterTextHere").value + xhr.statusText;
			            }
			        }
			    };

			    // Send the request and set status
			    xhr.send(params);
			    //statusDisplay.innerHTML = 'Sending...';
			}