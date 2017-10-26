function fingerprint_display() {
    "use strict";

    new Fingerprint2().get(function(result, components){
      console.log(components[0]['value']); // an array of FP components
    });
    var strSep, strPair, strOnError, strScreen, strDisplay, strOut;

    strSep = "";
    strPair = "=";
    strOnError = "Error";
    strScreen = null;
    strDisplay = null;
    strOut = null;
    try {
        strScreen = window.screen;
        if (strScreen) {
            var date = new Date()
            var getTimezone = date.getTimezoneOffset();
            strDisplay = strScreen.colorDepth + strSep + strScreen.width + strSep + strScreen.height + strSep + strScreen.availWidth + strSep + strScreen.availHeight;
            strDisplay +=getTimezone;
        }
        strOut = strDisplay;
        return strOut;
    } catch (err) {
        return strOnError;
    }
}