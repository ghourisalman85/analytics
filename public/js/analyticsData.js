var globalUrl = "https://lit-harbor-94642.herokuapp.com";
var externalLinks = ["js/classes.js"];

for(var i=1;i<=1;i++){
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src = globalUrl+"/"+externalLinks[i-1];
    $("head").append(s);
}
function loadScript(a, b) {
    var c = new Array;
    for (c = a.split(","), i = 0; i < c.length; i++) {
        var d = document.getElementsByTagName("head")[0],
            e = document.createElement("script");
        e.type = "text/javascript", e.src = c[i], e.onreadystatechange = b, e.onload = b, d.appendChild(e)
    }
}



a = 0;
var ip = "",
    country = "",
    loc = "",
    region = "",
    city = "",
    zip = "",
    org = "",
    lat = "notAvailable",
    lang = "notAvailable",
    myPrettyCode = function() {
        a++;
        var b = new ClientJS,
            c = b.getOSVersion(),
            z = b.getOS(),
            d = b.getOS() + " " + c,
            e = b.getCPU(),
            f = b.isMobileIOS(),
            g = b.isIphone(),
            w = b.getBrowserVersion();
            h = b.getBrowser() + " " + w, 
            i = b.isIpad(), 
            j = b.isIpod(), 
            k = b.getCurrentResolution(), 
            l = b.getAvailableResolution(), 
            m = b.getColorDepth(), 
            n = b.isMobileAndroid(), 
            o = b.isMobileBlackBerry(), 
            p = b.isMobileWindows(), 
            q = b.getFingerprint(), 
            r = (b.isMobileOpera(), b.getTimeZone()), 
            k = k.replace("x", ""), l = l.replace("x", ""), 
            s = new Date,
            t = s.getTimezoneOffset(), 
            u = k + "" + l + m + t, 
            v = {
            osVersion: c,
            OS: d,
            CPU: e,
            isIphone: g,
            isIpod: j,
            isMobileIOS: f,
            locationLatLang: loc,
            browser: h,
            isIpad: i,
            platforms:z,
            browserID: q.toString(),
            fingerPrints: u,
            isMobileAndroid: n,
            isMobileBlackBerry: o,
            isMobileWindows: p,
            timeZone: r,
            isMobileWindows: p,
            ip: ip,
            country: country,
            city: city,
            region: region,
            org: org,
            zip: zip
        }, 2 == a && (callBack2(v),advertisementByUser(u),advertisementByLocation(city), a = 0)
    };
var ip_data = '//freegeoip.net/json/';
$.getJSON(ip_data, function(a) {
    ip = a.ip, org = '', country = a.country_name, region = a.region_name, city = a.city, loc = a.latitude + "," + a.longitude, zip = a.zip_code, Myjs = "https://lit-harbor-94642.herokuapp.com/js/client.min.js,https://lit-harbor-94642.herokuapp.com/socket.io/socket.io.js", loadScript(Myjs, myPrettyCode)
});


function advertisementByLocation(city){
   
  socket.emit("getLocationAd", {'location':city,"websitecode":"tes31754031"});
    socket.on('LocatiosendAdvertisment', function(LocatiosendAdvertisment){
    document.getElementById("footerDiv1").innerHTML = LocatiosendAdvertisment.data;
  });
}

function advertisementByUser(userID){  
  socket.emit("getUSerAd", {'user_id':userID,"websitecode": "tes31754031"});
    socket.on('sendAdvertisment', function(sendAdvertisment){
    document.getElementById("footerDiv").innerHTML = sendAdvertisment.data;
  });
}





