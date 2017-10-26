var myApp = angular.module('adverApp', []);
myApp.controller('AdvertismentCtrl', ['$scope', '$http','$timeout', function($scope, $http,$timeout) { 
	
	$scope.responsetext="";
	$scope.faildMessage = true;
	$scope.successMessage = true;
	$scope.addLocation = function(data){
	  if(data){
	  	if((data.locations=="" || data.locations==null) || (data.adData=="" || data.adData==null)){
	   	 $scope.responsetext = "Please Fill All the Fields";
	   	  $scope.faildMessage=false; 
          $timeout(function () { $scope.faildMessage = true; }, 2000);   
	    }else{	
	     $http.post('/addAdvertisementByLocation', data).then(function(response){
	     	$scope.Responsesucess = response.data;
	  	 	$scope.successMessage = false;
	  	 	$timeout(function () { $scope.successMessage = true; }, 2000);
	  	 	$scope.data="";
	  	 });
	    }	
	  }	else{
	  	$scope.faildMessage=false; 
        $timeout(function () { $scope.faildMessage = true; }, 2000); 
	    $scope.responsetext = "Please Fill All the Fields";
	  }
	}





	/*** User Advertising ***/
	$scope.userresponsetext="";
	$scope.userfaildMessage = true;
	$scope.usersuccessMessage = true;
	$scope.addUserAdd = function(data){
	  if(data){
	  	if((data.userIds=="" || data.userIds==null) || (data.UserAdData=="" || data.UserAdData==null)){
	   	 $scope.userresponsetext = "Please Fill All the Fields";
	   	  $scope.userfaildMessage=false; 
          $timeout(function () { $scope.userfaildMessage = true; }, 2000);   
	    }else{	
	     
	     $http.post('/addAdvertisementByUser', data).then(function(response){
	     	$scope.useresponsesucess = response.data;
	  	 	$scope.usersuccessMessage = false;
	  	 	$timeout(function () { $scope.usersuccessMessage = true; }, 2000);
	  	 	$scope.data="";
	  	 });

	    }	
	  }	else{
	  	$scope.userfaildMessage=false; 
        $timeout(function () { $scope.userfaildMessage = true; }, 2000); 
	    $scope.userresponsetext = "Please Fill All the Fields";
	  }
	}





}
]); 