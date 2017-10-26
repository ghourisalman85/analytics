var websiteid ="";
var superUser = angular.module('superUser', []);
superUser.filter('myDate', function($filter) {    
    var angularDateFilter = $filter('date');
    return function(theDate) {
       return angularDateFilter(theDate, 'dd MMMM HH:mm:ss');
    }
});

superUser.controller('superUser', ['$scope', '$http', function($scope, $http) { 
	
	
	$scope.showSubmit = true;
	$scope.loginSuperUser = function(){

	 $scope.showLoader = true;
	 $scope.showSubmit = false;

	 if($scope.login=="" || $scope.login==null || $scope.login=='undefined' || $scope.login.password =="" || $scope.login.password ==null || $scope.login.email =="" || $scope.login.email ==null){
	 	$scope.showLoader = false;
	 	$scope.showSubmit = true;
	 	new PNotify({
	      title: 'Warning',
	      text: 'Please Fill All the fields',
	      type: 'warning',
	      styling: 'bootstrap3',
		  hide:true,
		  delay: 3000
	  	});
	 }else{
         

 	  $http.post('/loginProcess' , $scope.login).then(function(response){
 	  	$scope.showLoader = false;
 	  	$scope.showSubmit = true;
	  	if(response.data=="email"){
	  		new PNotify({
	          title: 'Error',
	          text: 'Sorry Email you have Entered is not found.',
	          type: 'error',
	          styling: 'bootstrap3',
	          hide:true,
	          delay: 3000
	      	});
	  		//$scope.loginStatus =  "Sorry Email you have Entered is not found.";
	  	}else if(response.data=="password"){
	  		new PNotify({
	          title: 'Error',
	          text: 'Sorry you have entered invalid password',
	          type: 'error',
	          styling: 'bootstrap3',
	          hide:true,
	          delay: 3000
	      	});
	  		//$scope.loginStatus =  'Sorry you have entered invalid password';
	  	}else{
	  		new PNotify({
	          title: 'Great',
	          text: 'You are Logged in successfully',
	          type: 'success',
	          styling: 'bootstrap3'
	      	});
	  		window.location = response.data.redirect;
	  	}
	  });
	 }
	}

	$scope.getAdminData = function(){
		$http.post('/getAdminData').then(function(response){
	  		$scope.username =response.data.username;
	  	});
	  	$http.post('/getSitesList').then(function(response){
	  		$scope.sitesList =response.data;
	  	});
	}

	$scope.editSite = function(){
		websiteid = getQueryVariable("id");
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
		$http.post('/getAdminData').then(function(response){
	  		$scope.username =response.data.username;
	  	});
	 	$http.post('/geteditSite',{'websiteid':websiteid}).then(function(response){
	 		$scope.names =response.data.websitename;
	  		$scope.url =response.data.websiteurl;
	  	});
	}

	$scope.siteReport = function(){
		$http.post('/getAdminData').then(function(response){
	  		$scope.username =response.data.username;
	  	});
	}

	$scope.edit = function(){
		var obj={};
		if($scope.names=="" || $scope.names==null)
		{}else{
			obj['websitename']=$scope.names;
		}
		if($scope.url=="" || $scope.url==null)
		{}else{
			obj['websiteurl']=$scope.url;
		}
		if($scope.url=="" || $scope.url==null || $scope.names=="" || $scope.names==null){
			new PNotify({
		      title: 'Warning',
		      text: 'Please Fill All the fields',
		      type: 'warning',
		      styling: 'bootstrap3',
			  hide:true,
			  delay: 3000
		  	});
		}else{
			obj['id']=websiteid;
			$http.post('/seteditSite',obj).then(function(response){
		  		new PNotify({
			      title: 'Great',
			      text: 'Record Updated',
			      type: 'success',
			      styling: 'bootstrap3',
				  hide:true,
				  delay: 3000
			  	});
		  	});
		}
	}
}


]); 