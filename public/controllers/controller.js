var myApp = angular.module('myApp', []);
myApp.filter('myDate', function($filter) {    
    var angularDateFilter = $filter('date');
    return function(theDate) {
       return angularDateFilter(theDate, 'dd MMMM HH:mm:ss');
    }
});

myApp.controller('AppCtrl', ['$scope', '$http','$location', function($scope, $http, $location) { 
	
	$scope.responsetext="";
	$scope.registerSite = function(){
	  if($scope.site=="" || $scope.site==null || $scope.site=='undefined'){
	 	$scope.regStatus="Please Fill All the fields";
	  }else{
		$http.post('/registerSite' , $scope.site).then(function(response){
			if(response.data=="sorry"){
			  $scope.responsetext="Sorry You are already Registered";
			}else{
				$scope.responsetextsucess="YOu have Successfully Registered Your Site";
				var script = '<script type="text/javascript" src="https://lit-harbor-94642.herokuapp.com/js/analyticsData.js"></script> \n';
				script +='<script> \n';
					script +='   function callBack2(obj){ \n';
					script +='   var socket = io("https://lit-harbor-94642.herokuapp.com"); \n';
					script +='     var visitorData = { \n';
					script +='       referringSite: document.referrer, \n';
						script +='   page: location.pathname, \n';
						script +='   userfingerprints:obj, \n';
						script +='   webSiteCode: "'+response.data[0].websitecode+'", \n';
					script +='     } \n';
					script +=   'socket.emit("visitor-data", visitorData); \n';
					script +='  } \n';
				script +='</script>';
				$scope.script = script;
			}
		});	
	  }	
	}

	$scope.loginSite = function(){
	 	
	 if($scope.login=="" || $scope.login==null || $scope.login=='undefined'){
	 	$scope.loginStatus="Please Fill All the fields";
	 }else{
 	 $http.post('/loginSite' , $scope.login).then(function(response){
	  	if(response.data=="sorry"){
			$scope.loginStatus="Invalid Credentials";
		}else{
			window.location = response.data.redirect;
		}
	  });
	 }		
	 
	}

	function getParameterByName(name, url) {
	    if (!url) {
	      url = window.location.href;
	    }
	    name = name.replace(/[\[\]]/g, "\\$&");
	    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
	        results = regex.exec(url);
	    if (!results) return null;
	    if (!results[2]) return '';
	    return decodeURIComponent(results[2].replace(/\+/g, " "));
	}



	$scope.getAll = function(){
		var pageId = getParameterByName('id');
		$http.post('/getAllpageData',{'pageId':pageId}).then(function(response){
		   	if(response.data=="sorry"){
				$scope.dataAll ="empty";
			}else{
				$scope.dataAllrecord = response.data;
			}
		});	
	}



	$scope.allData = function(){
	  $http.post('/allData').then(function(response){
	  	if(response.data=="sorry"){
			$scope.dataAll ="empty";
		}else{
			$scope.dataAll = response.data;
		}
	  });	
	}


	$scope.getAllUsers = function(){
	  $http.post('/getAllUsers').then(function(response){
	  	if(response.data=="sorry"){
			$scope.getAllUsers ="empty";
		}else{
			$scope.getAllUsers = response.data;
		}
	  });	
	}

	$scope.getUsersession = function(){
		$http.post('/getUserInfo').then(function(response){
	  		$scope.websiteName =response.data.websitename;
	  	});
		$http.post('/checkLastDay').then(function(response){
			$scope.dataSession =response.data;
		});
		$http.post('/checkLastminutes').then(function(response){
			$scope.dataSessions =response.data;
		});
		$http.post('/monthlyUserGraph').then(function(response){
			//$scope.dataSessions =response.data;
			var Users = Array();
			var Months = Array();
			angular.forEach(response.data, function(value, key) {
				Months.push(key);
				Users.push(value);
			});
		  var ctx = document.getElementById("mybarChart");
	      var mybarChart = new Chart(ctx, {
	        type: 'bar',
	        data: {
	          labels: Months,
	          datasets: [{
	            label: '# Views',
	            backgroundColor: "#26B99A",
	            data: Users
	          }]
	        },
	        options: {
	          scales: {
	            yAxes: [{
	              ticks: {
	                beginAtZero: true
	              }
	            }]
	          }
	        }
	      });
		});
	}	  	
	$scope.getUserInfo = function(){


	 	$http.post('/getUserInfo').then(function(response){
	  		$scope.websiteName =response.data.websitename;
	  		$scope.getAllUsers();
	  	});
	  	$http.post('/checkUserAndCountries').then(function(response){
	  		$scope.checkUserAndCountries =response.data;
	  	});
	  	$http.post('/getUsersPercent').then(function(response){
	  		$scope.getUsersPercent =response.data;
	  	});

	  	$http.post('/getDevicePercent').then(function(response){
	  		$scope.getDevicePercent =response.data;
	  		
	  		var names = Array();	
	  		var values = Array();	
	  		var colors = Array();
	  		var Hovercolors = Array();
	  		angular.forEach(response.data, function(value, key) {
			  
			  if(key=="null" || key==null){
			  	names.push('other');
			  }else{
			  	names.push(key);
			  }

			  values.push(value);
			  Hovercolors.push("#000");
			  if(key=="Android"){
			  	colors.push("#3498DB");
			  }
			  if(key=="Windows"){
			  	colors.push("#9B59B6");
			  }
			  if(key=="BlackBerry"){
			  	colors.push("#1ABB9C");
			  }
			  if(key=="Ubuntu"){
			  	colors.push("#3cbe10");
			  }
			  if(key=="Symbian"){
			  	colors.push("#Symbian");
			  }	
			  if(key=="iOS"){
			  	colors.push("#34495E");
			  }	
			  if(key=="other"){
			  	colors.push("#effb13");
			  }
			  if(key=="Linux"){
			  	colors.push("#7c77df");
			  }
			  if(key=="Mac OS"){
			  	colors.push("#d07e53");
			  }
			  if(key=="Chromium OS"){
			  	colors.push("#44a3aa");
			  }
			  if(key=="" || key==null){
			  	colors.push("#E74C3C");
			  }	

			});

	  		var options = {
	          legend: false,
	          responsive: true
	        };
	        

	        new Chart(document.getElementById("canvas1"), {
	          type: 'doughnut',
	          tooltipFillColor: "rgba(51, 51, 51, 0.55)",
	          data: {
	            labels: names,
	            datasets: [{
	              data: values,
	              backgroundColor:colors,
	              hoverBackgroundColor: Hovercolors
	            }]
	          },
	          options: options
	        });
	  	});
	  	
	}

	$scope.getVisitorInfo = function(){

		var param1var = getQueryVariable("id");
		function getQueryVariable(variable) {
		  var query = window.location.search.substring(1);
		  var vars = query.split("&");
		  for (var i=0;i<vars.length;i++) {
		    var pair = vars[i].split("=");
		    if (pair[0] == variable) {
		      return pair[1];
		    }
		  } 
		}

	 	$http.post('/getVisitorInfo',{'user_id':param1var}).then(function(response){
	  		$scope.visitorsScope =response.data;
	  	});

		$http.post('/getVisitorEvents',{'browserid':param1var}).then(function(response){
	  		$scope.visitorsEventData =response.data;
	  	});

	  	$http.post('/getVisitorPages',{'userfingerprints':param1var}).then(function(response){
	  		$scope.visitorsPagesData =response.data;
	  	});


	}

	$scope.getUserByplatform = function(){

		var param1var = getQueryVariable("platform");
		function getQueryVariable(variable) {
		  var query = window.location.search.substring(1);
		  var vars = query.split("&");
		  for (var i=0;i<vars.length;i++) {
		    var pair = vars[i].split("=");
		    if (pair[0] == variable) {
		      return pair[1];
		    }
		  } 
		}
		param1var = param1var.replace(/%20/g, " ");
		$scope.platformname=param1var;
	 	$http.post('/getUserByplatform',{'platforms':param1var}).then(function(response){
	  		$scope.getAllUsers =response.data;
	  	});
	  	$http.post('/getUserInfo').then(function(response){
	  		$scope.websiteName =response.data.websitename;
	  	});
	}

	$scope.getUserBycountry = function(){

		var param1var = getQueryVariable("country");
		function getQueryVariable(variable) {
		  var query = window.location.search.substring(1);
		  var vars = query.split("&");
		  for (var i=0;i<vars.length;i++) {
		    var pair = vars[i].split("=");
		    if (pair[0] == variable) {
		      return pair[1];
		    }
		  } 
		}
		param1var = param1var.replace(/%20/g, " ");
		$scope.countryName=param1var;
	 	$http.post('/getUserBycountry',{'country':param1var}).then(function(response){
	  		$scope.getAllUsers =response.data;
	  		$scope.getVisitorInfo();
	  	});
	  	$http.post('/getUserInfo').then(function(response){
	  		$scope.websiteName =response.data.websitename;
	  	});
	}

	$scope.getUserInfoInner = function(){
	 	$http.post('/getUserInfo').then(function(response){
	  		$scope.websiteName =response.data.websitename;
	  		$scope.getVisitorInfo();
	  	});
	}

	

}


]); 