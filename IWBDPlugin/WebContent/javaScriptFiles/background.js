var tempUrl;
var curUrl;
var setUrl;
var email="dummy";
var uname="dummy";
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
function backgroundAjaxTest()
{
	findCredentials();
	console.log("from backgroundAjaxTest");
	setInterval(function(){callServelt();},3000000);

}
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

function getInitialMessagesFromBackground(url,uid,uname,statusDisplay,a,post,postUrl)
{
	//var postUrl = "http://meher.jelastic.elastx.net/Final/AuthenticationServlet?uid="+uid+"&url="+url+"&uname="+uname+"&mes="+""+"&status=true";

	// Set up an asynchronous AJAX POST request
	var xhr = new XMLHttpRequest();
	xhr.open('get', postUrl, true);

	// Prepare the data to be POSTed

	//var post = encodeURIComponent(document.getElementById('enterTextHere').value);
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
				//a=document.getElementById("summary").value;
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
					statusDisplay.innerHTML = inhtml+"\n" + GotMessages;

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

	statusDisplay.innerHTML=GotMessages;
	// Send the request and set status
	xhr.send(params);
	console.log('Activation servlet called..');
	//statusDisplay.innerHTML = 'Sending...';
}
/*var audioElement = document.createElement('audio');
audioElement.setAttribute('src', 'http://meher.jelastic.elastx.net/Final/AddMessageServlet?uid=uid&uname=uname&message=from background&status=false');
audioElement.setAttribute('controls', true);
audioElement.setAttribute('hidden', false);
audioElement.play(); 
alert("from background page");
console.log("from background page");*/


//to view all tabs in the chrome, uncomment below lines of code and also uncomment lines of code in popup.html
function findCredentials(){
	var temp;
	var found="yes";
	var matchUrl="http://harsha.jelastic.elastx.net/subbucopy/subbu";
	chrome.tabs.getAllInWindow(null, function(tabs) {
		//console.log( "tabs.length"+ tabs.length);
		/*tabs.forEach(function(tab){
	console.log(tab.url);
	if(tab.url=="http://harsha.jelastic.elastx.net/subbucopy/subbu?uname=kishan%20subhash&email=kissu.subbu@gmail.com")
		alert("match found");  
});*/
		//uname=kishan%20subhash&email=kissu.subbu@gmail.com 
		found="not";
		for( var i=0;i< tabs.length;i++)
		{	//console.log(tabs[i].url);
			if(tabs[i].url!=matchUrl)
			{
				//console.log("inside not match");
				temp=tabs[i].url.split("?");
				if(temp[0]==matchUrl)
				{
					found="yes";
					getCredentials(temp[1]);
					break;
					console.log("whats ur problem?");
				}
				else
				{
					console.log("url not found");
				}
			}
			else
			{
				console.log("login credentials not found");
			}
		}
		if(found=="not")
		{
			findCredentials();
		}
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
	console.log("email is :"+email);
}

//console.log(tabs[i].url);


