function isSafrai(){  //这个很不准 有很多浏览器也有这个标志比如android webview  pc chrome
    var ua = navigator.userAgent.toLowerCase(), app = navigator.appVersion;
    if(ua.match(/Safari/i) == 'safari'){ 
        return true; 
    }else{ 
        return false; 
    } 
}

function isWeiXin(){ 
    var ua = window.navigator.userAgent.toLowerCase(); 
    if(ua.match(/MicroMessenger/i) == 'micromessenger'){ 
        return true; 
    }else{ 
        return false; 
    } 
} 

function isIphone(){
    var u = navigator.userAgent.toLowerCase(), app = navigator.appVersion;
    return u.indexOf('iphone') > -1 || u.indexOf('ipad') > -1 || u.indexOf('midp') > -1;
}

function isChrome(){
    var u = navigator.userAgent.toLowerCase();
    return u.indexOf("chrome") > -1;

}

function browserRedirect() { 

    var sUserAgent= navigator.userAgent.toLowerCase(); 
    var bIsIpad= sUserAgent.match(/ipad/i) == "ipad"; 
    var bIsIphoneOs= sUserAgent.match(/iphone os/i) == "iphone os"; 
    var bIsMidp= sUserAgent.match(/midp/i) == "midp"; 
    var bIsUc7= sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4"; 
    var bIsUc= sUserAgent.match(/ucweb/i) == "ucweb"; 
    var bIsUc2= sUserAgent.match(/ucbrowser/i) == "ucbrowser"; 
    var bIsAndroid= sUserAgent.match(/android/i) == "android"; 
    var bIsCE= sUserAgent.match(/windows ce/i) == "windows ce"; 
    var bIsWM= sUserAgent.match(/windows mobile/i) == "windows mobile"; 
    if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM || bIsUc2) { //移动
        return false;
    }else{ //pc 
        return true;
    } 
} 
