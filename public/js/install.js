var baseUrl = 'https://lit-harbor-94642.herokuapp.com/';
var endpoint;
var key;
var authSecret;
var pageExitObj={};

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

navigator.serviceWorker.register('./service-worker.js').then(function(registration) {
    // Use the PushManager to get the user's subscription to the push service.
    //service worker.ready will return the promise once the service worker is registered. This can help to get rid of
    //errors that occur while fetching subscription information before registration of the service worker
    //alert(JSON.stringify(registration));
    return navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
      return serviceWorkerRegistration.pushManager.getSubscription().then(function(subscription) {
         
          // If a subscription was found, return it.
          if (subscription) {
            //alert(JSON.stringify(subscription));
            return subscription;
          }
          // Otherwise, subscribe the user (userVisibleOnly allows to specify that we don't plan to
          // send web push notifications that don't have a visible effect for the user).
          return serviceWorkerRegistration.pushManager.subscribe({
            userVisibleOnly: true
          });
        });

    });

  }).then(function(subscription) { //chaining the subscription promise object\
      
      var browserIdPush = getQueryVariable("browserIdPush");
      var browserWebsitecodePush = getQueryVariable("browserWebsitecodePush");
      xhr = new XMLHttpRequest();
      var url = baseUrl+"registerForPushNot";
      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-type", "application/json");
      xhr.onreadystatechange = function () { 
        if (xhr.readyState == 4 && xhr.status == 200) {
          var json = JSON.parse(xhr.responseText);
        }
      }
      pageExitObj['pushToken']=subscription;
      pageExitObj['browserID']=browserIdPush;
      pageExitObj['websiteCode']=browserWebsitecodePush;
      xhr.send(JSON.stringify(pageExitObj));
    
    // Retrieve the user's public key.
    var rawKey = subscription.getKey ? subscription.getKey('p256dh') : '';
    key = rawKey ?
      btoa(String.fromCharCode.apply(null, new Uint8Array(rawKey))) :
      '';
    var rawAuthSecret = subscription.getKey ? subscription.getKey('auth') : '';
    authSecret = rawAuthSecret ?
      btoa(String.fromCharCode.apply(null, new Uint8Array(rawAuthSecret))) :
      '';

    endpoint = subscription.endpoint;

    // Send the subscription details to the server using the Fetch API.

    /*fetch('/register', {
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        endpoint: subscription.endpoint,
        key: key,
        authSecret: authSecret,
      }),
    });*/

  });

