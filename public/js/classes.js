var baseUrl = 'https://lit-harbor-94642.herokuapp.com/';
var checkSearch = false;



var time,timeSite;
var pageExitObj={};
window.addEventListener("load", function(event){
   
   time=new Date();
   var getTimeData = localStorage.getItem('timeSite');
   //alert(retrievedObject);
   if(typeof getTimeData === 'undefined' || !getTimeData || getTimeData==null){
       //alert("not previous page");
   }else{
       //var data  = JSON.parse(retrievedObject);
	   xhr = new XMLHttpRequest();
		var url = baseUrl+"trackExitPages";
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-type", "application/json");
		xhr.onreadystatechange = function () { 
		  if (xhr.readyState == 4 && xhr.status == 200) {
		    var json = JSON.parse(xhr.responseText);
		  }
		}
		var retrievedObject = localStorage.getItem('session');
		if(retrievedObject==null){
			
		}else{
			var getCompleteData = 	$.parseJSON(getTimeData);
			var item = $.parseJSON(retrievedObject);
			var d = new Date();
			pageExitObj.Minutes = getCompleteData['Minutes'];
			pageExitObj.Seconds = getCompleteData['Seconds'];
			pageExitObj.exitPage = getCompleteData['page'];
			pageExitObj.pageINtime = getCompleteData['pageINtime'];
			pageExitObj.browserid = item['browserId'];
			pageExitObj.browserid = item['browserId'];
			pageExitObj.sitecode = item['websitecode'];
			pageExitObj.page = document.location.host+""+document.location.pathname;
		}
		xhr.send(JSON.stringify(pageExitObj));
   }
	var retrievedObject = localStorage.getItem('session');
	if(retrievedObject==null){
		
	}else{
		
		/*var item = $.parseJSON(retrievedObject);
		var browserIdPush = item['browserId'];
		var browserWebsitecodePush = item['websitecode'];
		var iframe = document.createElement('iframe');
		iframe.style.display = "none";
		iframe.src = 'https://lit-harbor-94642.herokuapp.com/registerUser?browserIdPush='+browserIdPush+'&browserWebsitecodePush='+browserWebsitecodePush+'';
		document.body.appendChild(iframe);*/	
	}
	
});

window.addEventListener('unload', function(event){
    var elapsed_ms = new Date() - time;
    var seconds = Math.round(elapsed_ms / 1000);
    var minutes = Math.round(seconds / 60);
    var hours = Math.round(minutes / 60);
    var sec = TrimSecondsMinutes(seconds);
    var min = TrimSecondsMinutes(minutes);
    function TrimSecondsMinutes(elapsed){
        if (elapsed >= 60)
            return TrimSecondsMinutes(elapsed - 60);
        return elapsed;
    }
    var testObject = { 'Minutes': min, 'Seconds': sec, 'page': document.location.host+""+document.location.pathname,'pageINtime':time };
    localStorage.setItem('timeSite', JSON.stringify(testObject));
});


var MyClass = (function(){

  var MyClass = function () {

	this.track = function(eventName,eventProperties) {
	    xhr = new XMLHttpRequest();
		var url1 = baseUrl+"trackEvents";
		xhr.open("POST", url1, true);
		xhr.setRequestHeader("Content-type", "application/json");
		xhr.onreadystatechange = function () { 
		  if (xhr.readyState == 4 && xhr.status == 200) {
		    var json = JSON.parse(xhr.responseText);
		  }
		}
		var retrievedObject = localStorage.getItem('session');
		if(retrievedObject==null){
			
		}else{
			var item = $.parseJSON(retrievedObject);
			var d = new Date();
			eventProperties.browserid = item['browserId'];
			eventProperties.sitecode = item['websitecode'];
		}
		eventProperties.eventName = eventName;
		var data = JSON.stringify(eventProperties);
		xhr.send(data);
	}
	this.trackSignup = function(eventData) {
			

		var obj = eventData;

		xhr1 = new XMLHttpRequest();
		var url = baseUrl+"newSignups";
		xhr1.open("POST", url, true);
		xhr1.setRequestHeader("Content-type", "application/json");
		xhr1.onreadystatechange = function () { 
		  if (xhr1.readyState == 4 && xhr1.status == 200) {
		    var json = JSON.parse(xhr1.responseText);
		    if(json=='done'){
		    	localStorage.removeItem('data');
		    }else{
		    }
		  }
		}
		var retrievedObject = localStorage.getItem('session');
		if(retrievedObject==null){
			
		}else{
			var item = $.parseJSON(retrievedObject);
			var d = new Date();
			obj.browserid = item['browserId'];
			obj.sitecode = item['websitecode'];
		}
		var data = JSON.stringify(obj);
		xhr1.send(data);

	}     
 	this.linksClicked = function(element,eventName){
      var el = $(element);
      var check = localStorage.getItem('sendEvent');
	  if(check=="yes"){
	  	//console.log(document.location.href+"  "+document.referrer);
	  	var linksData = {};
	  	linksData.menu=document.location.href;
	  	linksData.referrermenu=document.referrer;
	  	
	  	xhr = new XMLHttpRequest();
		var url = baseUrl+"track_links";
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-type", "application/json");
		xhr.onreadystatechange = function () { 
		  if (xhr.readyState == 4 && xhr.status == 200) {
		    var json = JSON.parse(xhr.responseText);
		  	localStorage.removeItem('sendEvent');
		  }
		}
		var retrievedObject = localStorage.getItem('session');
		if(retrievedObject==null){
		}else{
			var item = $.parseJSON(retrievedObject);
			var d = new Date();
			linksData.browserid = item['browserId'];
			linksData.sitecode = item['websitecode'];
		}
		var data = JSON.stringify(linksData);
		xhr.send(data);

	  }else{
	  	console.log("no send");
	  }

      el.on('click',function(e){
      	var attr = $(this).attr('href');
      	if(attr == 'null' || attr == 'javascript:void(0);' || attr == 'javascript:void(0)' || attr == '#' ){
      	}else{
	      localStorage.setItem('sendEvent','yes');      		
      	}
  	  });
  	}

  	this.searchTrack = function(eventName,searchData){
  		checkSearch=true;
  		xhr = new XMLHttpRequest();
		var url = baseUrl+"track_searches";
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-type", "application/json");
		xhr.onreadystatechange = function () { 
		  if (xhr.readyState == 4 && xhr.status == 200) {
		    var json = JSON.parse(xhr.responseText);
		  }
		}
		var retrievedObject = localStorage.getItem('session');
		if(retrievedObject==null){
		}else{
			var item = $.parseJSON(retrievedObject);
			var d = new Date();
			searchData.browserid = item['browserId'];
			searchData.sitecode = item['websitecode'];
		}
		var data = JSON.stringify(searchData);
		xhr.send(data);
  		
  	}

  	this.searchAutomaticTrack = function(eventName,searchData){
  		function getParam( name )
		{
		 name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
		 var regexS = "[\\?&]"+name+"=([^&#]*)";
		 var regex = new RegExp( regexS );
		 var results = regex.exec( window.location.href );
		 if( results == null )
		  return "";
		else
		 return results[1];
		}
		var frank_param = getParam('search');
		var obj = {};
  		if(frank_param==null || frank_param==''){
  		    
  		}else{
			xhr = new XMLHttpRequest();
			var url = baseUrl+"track_searches";
			xhr.open("POST", url, true);
			xhr.setRequestHeader("Content-type", "application/json");
			xhr.onreadystatechange = function () { 
			  if (xhr.readyState == 4 && xhr.status == 200) {
			    var json = JSON.parse(xhr.responseText);
			  }
			}
			var retrievedObject = localStorage.getItem('session');
			if(retrievedObject==null){
			}else{
				var item = $.parseJSON(retrievedObject);
				var d = new Date();
				obj.browserid = item['browserId'];
				obj.sitecode = item['websitecode'];
				obj.searchedKeyword = frank_param;
				obj.totalSearchResults = '';
			}
			var data = JSON.stringify(obj);
			xhr.send(data);
  		}
  	}
  	 	
  };
  return MyClass;
})();


var geeksroot = new MyClass();

$(window).load(function(){
	if(checkSearch==true){
	
	}else{
		geeksroot.searchAutomaticTrack();
	}
});

