function onPageInfo(o)  { 
}
//Global reference to the status display SPAN
var statusDisplay = null;
var valueSet=null;
 var logging = false;
      var key1 = "Name";
	  var val1;
      function populate() {
		  event.preventDefault();
		  alert("populate");
        log('entered populate()');
        val1 = getValue(key1);
		  alert("val1"+val);
        updateValues();
        log('leaving populate()');
      }

      function store() {
        log('entered store()');

        logAllKeyValues();

        var oldName = getItem(key1);
        var newName = document.form1.fname.value;
        log('About to Update');
        val1 = newName;
        logAllKeyValues();
        setItem(key1,val1);
        updateValues();
        log('leaving store()');
      }
		  function getValue(key) {
			  alert("from get value");
			return getItem(key);
		  }
	  
	  function setItem(key, value) {
		var value2;
		try {
		  log("Inside setItem:" + key + ":" + value);
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
		  alert("in get item,previous item is"+value);
		}catch(e) {
		  log("Error inside getItem() for key:" + key);
		  log(e);
		  value = "null";
		}
		log("Returning value: " + value);
		return value;
	  }
      
	  function updateValues() {
        document.getElementById('val1').innerHTML = valueSet;
		alert("val1 from updated values : "+val1)
      }
      
	  function logAllKeyValues() {
        log(key1 + ":" + val1);    
		alert("in log key values"+key1 + ":" + val1);
      }

      function clearStorage() {
	    log('inside clear');
	      try {
	        chrome.extension.getBackGroundPage().clearStrg();
	      }catch(e) {
	        console.log("error while clearing local storage");
	        console.log(e);
	      }

	      document.getElementById('val1').innerHTML = "";
	      val1 = null;
      }
      function log(txt) {
        if(logging) {
          chrome.extension.getBackgroundPage().log(txt);
        }
      }

window.addEventListener('load', function(evt) {
	document.getElementById('populate').addEventListener('submit', populate);
// alert(window.localStorage.getItem(key));
});


document.addEventListener('DOMContentLoaded', function () {
	document.getElementById('submit').addEventListener('click', start);
	});

	
function start()
{
	alert("from start");
	store();
	
}
