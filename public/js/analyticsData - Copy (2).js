function loadScript(a,b){var c=new Array;for(c=a.split(","),i=0;i<c.length;i++){var d=document.getElementsByTagName("head")[0],e=document.createElement("script");e.type="text/javascript",e.src=c[i],e.onreadystatechange=b,e.onload=b,d.appendChild(e)}}a=0;var ip="",country="",loc="",region="",city="",zip="",org="",lat="notAvailable",lang="notAvailable",myPrettyCode=function(){a++;var b=new ClientJS,c=b.getOSVersion(),d=b.getOS()+" "+c,e=b.getCPU(),f=b.isMobileIOS(),g=b.isIphone(),w=b.getBrowserVersion();h=b.getBrowser()+" "+w,i=b.isIpad(),j=b.isIpod(),k=b.getCurrentResolution(),l=b.getAvailableResolution(),m=b.getColorDepth(),n=b.isMobileAndroid(),o=b.isMobileBlackBerry(),p=b.isMobileWindows(),q=b.getFingerprint(),r=(b.isMobileOpera(),b.getTimeZone()),k=k.replace("x",""),l=l.replace("x",""),s=new Date,t=s.getTimezoneOffset(),u=k+""+l+m+t,v={osVersion:c,OS:d,CPU:e,isIphone:g,isIpod:j,isMobileIOS:f,locationLatLang:loc,browser:h,isIpad:i,browserID:q,fingerPrints:u,isMobileAndroid:n,isMobileBlackBerry:o,isMobileWindows:p,timeZone:r,isMobileWindows:p,ip:ip,country:country,city:city,region:region,org:org,zip:zip},2==a&&(callBack2(v),a=0)};var ip_data='http://ip-api.com/json';$.getJSON(ip_data,function(a){ip=a.query,org=a.org,country=a.country,region=a.regionName,city=a.city,loc=a.lat+","+a.lon,zip=a.zip,Myjs="https://clientjs.org/js/client.min.js,https://lit-harbor-94642.herokuapp.com/socket.io/socket.io.js",loadScript(Myjs,myPrettyCode)});