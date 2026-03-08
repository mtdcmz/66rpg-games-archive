String.prototype.replaceAll = function(reallyDo, replaceWith, ignoreCase) {
    if (!RegExp.prototype.isPrototypeOf(reallyDo)) {
        return this.replace(new RegExp(reallyDo, (ignoreCase ? "gi": "g")), replaceWith);
    } else {
        return this.replace(reallyDo, replaceWith);
    }
}

Array.prototype.contains = function (arr){  
    for(var i=0;i<this.length;i++){//this指向真正调用这个方法的对象
        if(this[i] == arr){
        return true;
        }
    }   
    return false;
}

String.prototype.insert = function(text,at) {
    if(at == null || at > this.length)
        at = this.length;
    else if(at < 0)
        at = 0;
    return this.substring(0,at)+text+this.substring(at);
}
var AJAX_URL=new Ajax_Url();
var g;//canvs的Context对象

var sb;
var ib;
var tv;

var onTouchDown = false;
var onTouchUp = false;
var onTouchMove = false;//0423 这个非常有问题 几乎永远为true 导致使用该标记的有些判断有问题
//var onTouchMark=false;//标识onTouch是否起作用


var onTouchDX = 0;
var onTouchDY = 0;
var onTouchX = 0;
var onTouchY = 0;
var onTouchLong = false;
var downTime = 0;
var clickThrough = false;
//控制点击策略
var onTouchClick=false;


var fastTime=0;
var fastImg;


var time = 0;
var oaudio = null;
var ovideo = null;

var fontName = "微软雅黑";
var fontSpeedWeb = null; //web控制字体速度

var guid = "";
var ver = "";
var gIndex="";
var isPhone = false;
var tempPhone = false;
var isWX = false;
var roated = false;
var fileList = {};
var infoList={};
var zoom = 1.0;
var gDleft = 0; //缩放后左边黑边x值 event.clentx - dlefx即游戏场景的x
var gDTop = 0;
var gGameWidth = 960;//游戏的分辨率 高度
var gGameHeight = 540;//游戏的分辨率 宽度
var gLoadAssets = null;//资源加载
var sVLoadImg = null; //405加载 以及自定义图片数组加载

var gIsApple = false;
var gMpngBox = null;

var div_postion = {dx:0,dy:0};
//var evt = "onorientationchange" in window ? "orientationchange" : "resize";

//var FPS = 60;//20
var FPS = 30;//20
var curUser={uid:0,uname:""};//记录初次进入游戏--当前用户id  未登录为0,uname为空；
//var noShow = false;
//var reGame = false;

var title = "";

var mark = "";//ios盒子='ios' android盒子='android...'
var session = "";
var quality = "";

var musicPlay = new Array();

var img_base_path;
var gdebug = false;
var gGameDebug = null;
var IEventMaker;

//鲜花档位相关
//控制是否使用有野花开启全部存档
var isOpen=true;
//鲜花开启全部存档
var allOpen=false;
//玩吧的云存儲：true 打开/false 关闭
var isCloud=false;

var CloudLimitExData;
var isFirstDownVarEx = true;
var isMoveDaveFile = false;	//是否有新用户存储信息
//var conWebUrl="http://www.test.66rpg.com/";

var gameTitle="";
var bBuying=false;
var game_bin_path =-1;
//流量统计
var allFlow=0;
var allFileNum=0;

var bLevel = {
    qq: {forbid: 0, lower: 1, higher: 2},
    uc: {forbid: 0, allow: 1}
};
var UA  ;
var isqqBrowser ;
var isucBrowser ;

var userflowerNumber=0;

var isIos;
var isAndroid;

//竖屏游戏相关
var isVertical=null;
var isPhoneVer=false;

//wmovd
var ismod;//是否有录音
var modId;//组合id
var modVer; //组合版本
var GameVer;//游戏版本
var segPath;
//随机数map.bin不一样
var isNewMapBin = false;


var loadingz;
function start(gid,version,m,s,q,gamebinpath,screen_code){
    loadingz = document.getElementById('loadingz');
     UA = navigator.appVersion;
     isqqBrowser = (UA.split("MQQBrowser/").length > 1) ? bLevel.qq.higher : bLevel.qq.forbid;
     isucBrowser = (UA.split("UCBrowser/").length > 1) ? bLevel.uc.allow : bLevel.uc.forbid;
    // start('8516389e5f89a41f8ad113a5cec968a4','94','','','32','web/8516389e5f89a41f8ad113a5cec968a4/93/Game_mini.bin');

    //meout(function(){window.scrollTo(0,0);},1);setInterval(resizeGame,1000);setInterval(showNoMusic,1000);       start('ea9d44f04fce292f572e5321972574f8','3','','','32','');
    var newVer = GetQueryString("newVer");
    var newGuid = GetQueryString("newGuid");
    if(newVer) {
        version = newVer;
        gamebinpath = "";
    }
    if(newGuid){
        gid = newGuid;
    }
     

    ismod = GetQueryString("ismod"); //是否有录音
    modId = GetQueryString("modId");   //组合id
    modVer = GetQueryString("modVer");  //组合版本
    GameVer = GetQueryString("GameVer");  //游戏版本
    segPath = GetQueryString("segPath");
    //   start('17f804063cdf42c9d1a3ec0df1705e70','184','','','0','web/17f804063cdf42c9d1a3ec0df1705e70/184/Game_mini.bin');
    if(ismod == "true"&&segPath){
        gamebinpath = decodeURIComponent(segPath);
    }else{
    if(gamebinpath.length>0){
        var oldVer = parseInt(gamebinpath.split('/')[2]);
        if(oldVer<version){
            //没有拆分读旧版拆分数据
            version = oldVer;
            //没有拆分读最新版未拆分数据
            //if(oldVer != version){
            //    gamebinpath="";
            //}
            }
        }
    }
      gameTitle=document.title;
      if(q==32)
      {
          document.title ="【高清】"+ document.title;
      }
      else if (q==31)
      {
          document.title ="【低清】"+ document.title;
      }
      else if (q==25)
      {
          document.title ="【索引】"+ document.title;
      }
      else
      {
          document.title ="【原画】"+ document.title;
      }

    if(gamebinpath!=null && gamebinpath!="undefined" && gamebinpath!="" && gamebinpath )
    {
        game_bin_path = gamebinpath ;
        //console.log("game_bin_path is "+gamebinpath);
    }
    else
    {
        game_bin_path = -1 ;
    }
    //gindex
    var href=window.location.href;
    var isPara=href.split('?');
    if(isPara[1]){
        var num=href.split('/');
        gIndex=num[num.length-1].split('?')[0];
    }else{
        var num=href.split('/');
        gIndex=num[num.length-1];
    }
    //var isMapBin = MathRandom(1,100);
    //小于30走新

    //if(isMapBin&&isMapBin<=30){
        //走新的map.bin
        // isNewMapBin = true;  // 本地模式已禁用：直接 ORead 读取本地 .bin
    //}

    gGameDebug = new TGameDebug(); 
    if(gGameDebug.bshowversion){
        //alert(gGameDebug.debugversion);
    }

    ///< 2. 优先获取img_base_path路径,开始预加载资源
    var tempimg =  document.getElementById("s_img");

    img_base_path = tempimg.src.substring(0,tempimg.src.lastIndexOf("/") + 1);
    gLoadAssets = new LoadAssets();
    sVLoadImg = new SVLoad();
    sLoading = new SLoading();
    ///< 3. 初始化主画布（显示区域）
    var div = document.getElementById("main_div");
    var canvas = document.getElementById("main_canvas");
    guid = gid;
    ver = version;
    //如果是盒子在线玩
    if(m.length > 0){
        //android盒子访问游戏
        if(m.indexOf('android') > -1){
            m = 'aBox';
        }else if(m.indexOf('isFlash') > -1){
            m = 'isFlash';
        }
    }
    mark = m;
    gIsApple = isIphone();
    quality = q;

    webview = GetQueryString("webview");
    setAudio(document.getElementById("bgm"));
    setAudio(document.getElementById("bgs"));
    setAudio(document.getElementById("se"));
    setAudio(document.getElementById("voice"));
    oaudio = new OAudio(document.getElementById("bgm"),document.getElementById("bgs"),
        document.getElementById("se"),document.getElementById("voice"))
    //视频
    ovideo = new OVideo();
    g = canvas.getContext("2d");

    if(parseInt(screen_code) == 3){
        gGameHeight = 960;
        gGameWidth = 540;
        isVertical = true;
    }else if(parseInt(screen_code) == 0){
        gGameHeight = 600;
        gGameWidth = 800;
    }else{
       isVertical = false;
        gGameHeight = 540;
        gGameWidth = 960;
    }


    tv = new TempVar();
    sb = new OSpriteBox();
    ib = new OInputBox();
    gMpngBox = new OMpngBox();
    gLoadAssets.showRun();
    tv.scene = new SLoad();
    document.getElementById("div_button").style.display = "none";
    document.getElementById("div_frontcover").style.display = "none";
    //noShow = true;
    //为WEB--单独设置的东西
    if(mark == "isFlash"){
        //帧数
        FPS = 60;//flash用60帧 --- H5及web用30帧
        var user_level = parseInt(publicUses.getUserInfo().vip_level);
        //广告
        if(user_level !=1||(user_level ==1&&(parseInt(publicUses.getUserInfo().screen_game_ad) == 0))){
            //不是天使会员
            //获取广告
            serverAjax.get_ad_list(function(data){
                if(parseInt(data.ret) == 1){
                    cAdvert.isAdAjax = true;
                    cAdvert.ADBox=data.ad;
                    };
            });
        }
    }

    serverAjax.init(function () {
        if(mark != "aBox") {
            operationFrame.initCloudExData();
        }
    });
    /*统计只需要发出请求，并不需要接收*/
    $.ajax({
        url:"http://cgv2.66rpg.com/api/oweb_log.php?op=5001&gindex="+gIndex+"&guid="+gid+"&name="+encodeURI(gameTitle)+"&token=",
        type:"get",
        dataType:"jsonp",
        jsonp: 'jsonCallBack',
        success: function (data) {
            //console.log(data,"统计");
        },
        error: function (e) {
            //console.log(data,"失败");
        }
    });

    //所以的事件
    if(mark == "isFlash"){
        fouchWeb();
        var parentBody = window.parent.document;
	//为兼容浏览器添加
        if(parentBody){
            parentBody.addEventListener("keydown",keydown,false);
            parentBody.addEventListener("keyup",keyup,false);
        }
        document.addEventListener("keydown",keydown,false);
        document.addEventListener("keyup",keyup,false);
    }
    if(tv.isMobile){ //0420 andoird如果判断为非移动走入下面的mouse事件 每次点击屏幕会有蓝屏现象
        div.addEventListener("touchstart",tDown,false);
        div.addEventListener("touchmove",tMove,false);
        div.addEventListener("touchend",mUp,false);
    }else{
        div.addEventListener("mousedown",mDown,false);
        div.addEventListener("mousemove",mMove,false);
        div.addEventListener("mouseup",mUp,false);
        //window.addEventListener("mouseup",Tup,false);
    }

    run();
    // setTimeout(function(){ run();},5000)

    title = document.title;
    session = s;
    gIsApple = isIphone();

    var left = document.getElementById("div_button");
}

function Tup()
{
    onTouchUp = true;
    time = 0;
    onTouchMove = false;
    onTouchDown = false;
    //和尚--------区分滑动跟点击
        if(downTime<FPS*0.35){
            onTouchClick=true;
    }
    downTime = 0;
    onTouchLong = false;
    fastTime=0;
    if(fastImg!=null){
        fastImg.opacity=0;
    }
}

//
//获得div的绝对坐标
//
function getAbsPoint(e) {
    var x = e.offsetLeft,y = e.offsetTop;
    while(e = e.offsetParent){
        x += e.offsetLeft;
        y += e.offsetTop;
    }
    return {
        dx:x*zoom,
        dy:y*zoom
    };
}

function setAudio(audio){
    audio.autoplay = true;
    audio.isLoadedmetadata = false;
    audio.touchstart = true;
    audio.audio = true;
}

function showNoMusic(){
}

function tDown(event){
    event.preventDefault();
    onTouchClick =false;
    onTouchDown = true;
    onTouchUp = false;
    downTime=0;
    onTouchX = onTouchDX = (event.touches[0].clientX * zoom) - div_postion.dx;
    onTouchY = onTouchDY = (event.touches[0].clientY * zoom) - div_postion.dy;
    if(isPhone){
        if(isVertical){
            var temp =onTouchX;
            onTouchX =gGameWidth - onTouchY;
            onTouchY =temp;

            onTouchDX=onTouchX;
            onTouchDY=temp;
        }else{
            var temp = onTouchX;
            onTouchX = onTouchY;
            onTouchY = gGameHeight - temp;//540

            onTouchDX= onTouchX;
            onTouchDY=onTouchY;
        }
    }
    if(gIsApple && mark != "ios"){ //0227 是ios且不是盒子登录时暂时使用touch触发音乐相关
        //console.log("iosPlay");
        oaudio.touchBGM();
        oaudio.touchBGS();
    }
    else
    {
        if(isucBrowser)
        {
            oaudio.touchBGM();
            oaudio.touchBGS();
        }
        else if(mark!="aBox")
        {
            oaudio.touchBGM();
            oaudio.touchBGS();
        }
    }
    if(ovideo){
        ovideo.touchVideo();
    }
}
function tMove(event){
    event.preventDefault();
    onTouchMove = true;
    onTouchX = (event.touches[0].clientX * zoom) - div_postion.dx;
    onTouchY = (event.touches[0].clientY * zoom) - div_postion.dy;
    if(isPhone){
        if(isVertical){
            var temp =onTouchX;
            onTouchX =gGameWidth - onTouchY;
            onTouchY =temp;
        }else{
            var temp = onTouchX;
            onTouchX = onTouchY;
            onTouchY = gGameHeight - temp;//540
        }
    }
}


function mDown(event){
    event.preventDefault();
    fouchWeb();
    downTime=0;
    onTouchDown = true;
    onTouchUp = false;
    onTouchClick = false;
    onTouchX = onTouchDX = (event.clientX - gDleft) * zoom;
    //onTouchY = onTouchDY = event.layerY * zoom;
    onTouchY = onTouchDY = (event.clientY- gDTop)* zoom;
    if(isPhone){
        if(isVertical){
            var temp =onTouchX;
            onTouchX =gGameWidth - onTouchY;
            onTouchY =temp;

            onTouchDX=onTouchX;
            onTouchDY=temp;
        }else{
            var temp = onTouchX;
            onTouchX = onTouchY;
            onTouchY = gGameHeight - temp;//540

            onTouchDX= onTouchX;
            onTouchDY=onTouchY;
        }
    }
    if(ovideo){
        ovideo.touchVideo();
    }
}

function mMove(event){
    event.preventDefault();
    fouchWeb();
    if(onTouchDown){
        onTouchMove = true;
    }
    onTouchX = (event.clientX - gDleft) * zoom; //0113 event.layerX 360exp chrome版本比较低 layerx的值还不是div的值
    //onTouchY = event.layerY * zoom;
    onTouchY = (event.clientY - gDTop) * zoom;
    if(isPhone){
        if(isVertical){
            var temp =onTouchX;
            onTouchX =gGameWidth - onTouchY;
            onTouchY =temp;
        }else{
            var temp = onTouchX;
            onTouchX = onTouchY;
            onTouchY = gGameHeight - temp;//540
        }
    }
}

function mUp(event){
    onTouchUp = true;
    time = 0;
    onTouchMove = false;
    onTouchDown = false;
    //和尚--------区分滑动跟点击
    /*if(downTime<FPS*0.35){
        onTouchClick=true;
    }*/
    if(clickThrough){
        // 再 200； 被點鐘了
        onTouchClick = false;
        clickThrough = false;
    }else{
        if(downTime<FPS*0.35){
            onTouchClick=true;
        }
    }
    downTime = 0;
    onTouchLong = false;
    fastTime=0;
    if(fastImg!=null){
        fastImg.opacity=0;
    }
    if(mark == "isFlash"){
        if(cAdvert.haveUrl&&cAdvert.haveUrl!=""){
            if(cAdvert.haveUrl.indexOf("silver_vip")!=-1){
                if(parseInt(publicUses.getUserInfo().vip_level) ==1){
                    cAdvert.haveUrl="";
                    cAdvert.iNum = this.sec*FPS;
                    cAdvert.adTimer.dispose();
                    cAdvert.adRIcon.dispose();
                    cAdvert.adBg.dispose();
                    cAdvert.adEnd = true;
                    if(cAdvert.waitAd){
                        cAdvert.waitAd = false;
                        if(gLoadAssets.backSceneCountdown <= 0){
                            cAdvert.cAdvertFn&&cAdvert.cAdvertFn();
                        }
                    }
                }else{
                    window.open(cAdvert.haveUrl);
                }
            }else{
                window.open(cAdvert.haveUrl);
            }
        }
    }
}

function onClick(){
    //if(onTouchUp&&onTouchClick){
    //    onTouchClick=false;
    //    onTouchX = -1;
    //    onTouchY = -1;
    //    onTouchUp = false;
    //    return true;
    //}else if(onTouchUp){
    //    onTouchX = -1;
    //    onTouchY = -1;
    //    onTouchUp = false;
    //    return false;
    //}
    //return false;
    if(onTouchClick){
        onTouchClick=false;
        return true;
    }
    return false;
}
function run (){
    if(!allOpen && serverAjax && serverAjax.userFlowerInfo && serverAjax.userFlowerInfo.sum>0){
        allOpen = true;
    }
    g.fillStyle = "black";
    if(isVertical){
        g.clearRect(0,0,gGameHeight,gGameHeight);//960,540
    }else{
        g.clearRect(0,0,gGameWidth,gGameHeight);//960,540
    }
    if(gLoadAssets.bloadAssets){
        gLoadAssets.update();
    }else {
       
        if(sVLoadImg.isLoad){
            sVLoadImg.update();
        }else{
            if(sLoading.loading){
                sLoading.update();
            }else if(sLoading.alertFlag){
                sLoading.updateAlert();
            }else{
                tv.scene.update();
            }
        }

    }

    //if(isVertical==null){
    //}else{

        //旋转屏幕的的时候触发   第一次竖屏游戏在 loadAssets.js中
        if(isPhone && !roated){
            if(isVertical){
                g.translate(0, gGameWidth);//540
                g.rotate(270 * Math.PI/180);
                roated = true;
            }else if(isVertical==false){
                g.translate(gGameHeight, 0);//540
                g.rotate(90 * Math.PI/180);
                roated = true;
            }
        }
        //sb.update(g);
        sb.update(g);
        //更新精灵
        if(!sLoading.loading){
            //更新input框
            ib.update(g);
        }

        oaudio.update();
        ovideo.update();
    //}
    operationCloud && operationCloud.update();
    if(isVertical){
        if(isPhoneVer && isPhone){
            isPhoneVer=false;
        }
    }

    if(onTouchUp && time >= 1){
        onTouchUp = false;
        onTouchClick=false;
        time = -1;
    }
    if(gIsApple && onTouchDX - onTouchX > 100 && onTouchMove){
        onTouchDX = onTouchX;
        if(mark == 'ios'){//0413 盒子专用 网页safrai浏览器左滑会弹找不到网页
            window.location.href = 'ios://backButton';  //小黄 盒子里用ios调用oc的方法，需要向oc发送一个http请求
        }
        //confirm("test");//给小黄ios测试用
    }
    if(time >= 0){
        time += 1;
    }
    //--0109 长按键标志
    if(onTouchDown){
        downTime += 1;
    }

    if(downTime >= FPS * 0.5 && fastTime==8){ //FPS * 0.8
        onTouchLong = true;
    }

    setTimeout("run()",1000 / FPS);
}

function dispose(){
    sb.dispose();
}

function resizeGame(){
    if(isVertical!=null){
        //window.scrollTo(0, 1);//0420 Hide the address bar!
        var div = document.getElementById("main_div");
        var gameCanvas = document.getElementById("main_canvas");
        var widthToheight = gGameWidth / gGameHeight;// 16 / 9
        var newWidth = window.innerWidth;
        var newHeight = window.innerHeight;
        if(isVertical){
            isPhone = newHeight < newWidth;
        }else{
            isPhone = newHeight > newWidth;
        }
        if(isPhone){
            var newWidthToHeight = newHeight / newWidth;//960 540  1.777
            var widthToheight = gGameHeight / gGameWidth; //800 600   1.333
            //newWidth = 414;
            //newHeight = 552;
            if(!isVertical){
                var newWidthToHeight = newWidth / newHeight;
                if(newWidthToHeight > widthToheight){
                    newWidth = newHeight * widthToheight;
                }else{
                    newHeight = newWidth / widthToheight;
                }
            }else{
                if(newWidthToHeight > widthToheight){
                    newWidth = newWidth / widthToheight;
                }else{
                    newHeight = newWidth / widthToheight;
                }
            }
        }else{

            var newWidthToHeight = newWidth / newHeight;
            if(newWidthToHeight > widthToheight){
                newWidth = newHeight * widthToheight;
            }else{
                newHeight = newWidth / widthToheight;
            }
        }

        if(isPhone){
            zoom = gGameHeight / newWidth;//540
        }else{
            zoom = gGameWidth / newWidth; //960
        }

        //0113 解决360jsexp mouseevent.enent.layerx问题 做的通用处理
        //0212 最准确应该用这个document.body.scrollWidth 获取滚动条到左边的垂直宽度  window.innerWidth包含了滚动条的值
        gDleft = parseInt((window.innerWidth - newWidth)/2);
        gDTop = parseInt((window.innerHeight - newHeight)/2);
        if(gDTop<0){
            gDTop = 0;
        }
        if(gDleft < 0){
            gDleft = 0;
        }
        if(gameCanvas != null){ //0430 ogmian执行 window.addEventListener 后续把这个放到放到onload里
            gameCanvas.style.width = newWidth + "px";
            gameCanvas.style.height = newHeight + "px";
            div_postion = getAbsPoint(gameCanvas);

            if(tempPhone != isPhone){
                tempPhone = isPhone;
                if(isPhone){
                    gameCanvas.width = gGameHeight;//540
                    gameCanvas.height = gGameWidth;//960
                }else{
                    gameCanvas.width = gGameWidth;//940
                    gameCanvas.height = gGameHeight;//540
                }
                roated = false;
            }
        }

        if(div != null){
            div.style.width = newWidth + "px";
            div.style.height = newHeight + "px";
        }

        ReDirectSharetes();
    }
    if(mark != "isFlash") {
        changeSence();
    }else{
        if(cAdvert.adEnd){
            changeSence();
        }
    }
}

function testIos(){
    return "test";
}

/** ios盒子 每秒调用
 * action:状态 开始或停止
 * type:类型；0:BGM，1:SE，2:Voice，3:BGS
 * volume:音量
 * url:URL
 */

function iosMusic(){
    //return "1,0,http://wcdn1.cgyouxi.com/shareres/ab/ab930266807dd1d434e99c32a2dcfe6c.mp3"
    if(musicPlay.length > 0){
        var action = musicPlay[0].action;
        var type   = musicPlay[0].type;
        var volume = musicPlay[0].volume;
        var url    = musicPlay[0].url;
        musicPlay.shift();
        return action + "," + type + "," + volume + "," + url;
    }else{
        return "";
    }
}

function musichTask(a,t,v,u){
    this.action = a;
    this.type = t;
    this.volume = v;
    this.url = u;
}


/** 0323 macId tes
 * html页面加载时调用 获取mac id
 */
var gMacId = "";
function getmacID(){
    //console.log("OGMain : getmacID 函数，暂时没什么卵用~");
    /*
     $.get("demo_test.asp",
     function(data,status){
     gMacId = JSON.parse(data);
     }
     );
     */

    /*
     $.ajax({
     type: 'get',
     url: '/Blogs/SaveBlog/',
     datatype:'json',
     success: function (msg) {
     //gMacId = JSON.parse(msg);
     console.log("senddata success");
     }
     });
     */

    /*
     rd = new XHR2Get(url,null,'json',function(read){
     gMacId = JSON.parse(read);
     })
     */
}

/** 0402
 * 移动浏览器锁屏
 */
function ReDirectSharetes(){
    var share_div = $('#share-modal');
    var share_div_box = $('.share-modal-box');
    var loginModal=$('#sso_login_modal');
    var toolDiv=$('.tools_popup');
    var sendFlower=$('.send_flowers_box');
    var  chongzhi=$('.recharge_box');

    //竖屏旋转90度，横屏取消旋转
    if(share_div != null){
        if(share_div.css("display")!="none"){
            if(isVertical){
                if(isPhone){
                    share_div.height($(window).height()).width($(window).width());
                    share_div_box.css({'transform':'rotate(270deg)',"width":share_div.height() *.8,'top':parseInt(share_div_box.height() *.1),"left":parseInt((share_div.width()-share_div_box.height())/2)});
                }else{
                    //share_div.removeAttr("style");
                    share_div.height('100%').width('100%');
                    share_div_box.css({'-webkit-transform':'none',"width":share_div.width() *.8,'left':'10%','top':parseInt((share_div.height()-share_div_box.height())/2)});
                }
            }else{
                $(".share-modal-sp > .share-modal-box > .box2 ").css("width","64%");
                $(".share-modal-sp > .share-modal-box > .box3 ").css({'padding':"0",'width':"34%"});
                $(".share-modal-sp > .share-modal-box > .box3 > ul > li ").css({'width':"50%","margin-top":"1rem"});
                $("#shareCon_v").css({'width':"80%"});
                if(isPhone){
                    share_div.height($(window).height()).width($(window).width());
                    share_div_box.css({'transform':'rotate(90deg)',"width":share_div.height() *.8,'top':parseInt((share_div.height()-share_div_box.height())/2),"left":parseInt((share_div.width()-share_div_box.width())/2)});
                }else{
                    //share_div.removeAttr("style");
                    share_div.height('100%').width('100%');
                    share_div_box.css({'-webkit-transform':'none',"width":share_div.width() *.8,'left':'10%','top':parseInt((share_div.height()-share_div_box.height())/2)});
                }
            }
        }
    }


    if(loginModal!=null){
        if(loginModal.css("display")!="none") {
            if (isPhone) {
                if(isVertical){
                    loginModal.height($(window).width()).width($(window).height()).css({
                        'transform-origin': 'left 100%',
                        'margin-left': '100%',
                        '-webkit-transform': 'rotate(270deg)',
                        'top': -loginModal.height()+loginModal.width()
                    });
                }else{
                    loginModal.height($(window).width()).width($(window).height()).css({
                        'transform-origin': 'left 100%',
                        '-webkit-transform': 'rotate(90deg)',
                        'top': -loginModal.height()
                    });
                }

            } else {
                loginModal.height('100%').width('100%').css({'-webkit-transform': 'none', 'top': '0','margin-left': '0%'});
            }
        }
    }
    if(toolDiv!=null){
        if(toolDiv.css("display")!="none") {
            if (isPhone) {
                if(isVertical){
                    toolDiv.height($(window).width()).width($(window).height()).css({
                        'transform-origin': 'left 100%',
                        'margin-left': '100%',
                        '-webkit-transform': 'rotate(270deg)',
                        'top': -toolDiv.height()+toolDiv.width()
                    });
                }else{
                    toolDiv.height($(window).width()).width($(window).height()).css({
                        'transform-origin': 'left 100%',
                        '-webkit-transform': 'rotate(90deg)',
                        'top': -toolDiv.height()
                    });
                }
            } else {
                toolDiv.height('100%').width('100%').css({'-webkit-transform': 'none', 'top': '0', 'margin-left': '0%'});
            }
        }
    }

    if(sendFlower!=null){
        if(sendFlower.css("display")!="none") {
            if(isVertical){
                $(".send_flowers_sp").css({'width':"86%","margin-left":"7%"});
            }
            if (isPhone) {
                if(isVertical){
                    sendFlower.height($(window).width()).width($(window).height()).css({
                        'transform-origin': 'left 100%',
                        'margin-left': '100%',
                        '-webkit-transform': 'rotate(270deg)',
                        'top':  -sendFlower.height()+sendFlower.width()
                    });
                }else{
                    sendFlower.height($(window).width()).width($(window).height()).css({
                        'transform-origin': 'left 100%',
                        '-webkit-transform': 'rotate(90deg)',
                        'top': -sendFlower.height()
                    });
                }
            } else {
                sendFlower.height('100%').width('100%').css({'-webkit-transform': 'none', 'top': '0', 'margin-left': '0'});
            }
        }
    }

    if(chongzhi!=null){
        if(chongzhi.css("display")!="none") {
            if(isVertical){
                $(".recharge").css({'width':"86%","margin-left":"7%"});
            }
            if (isPhone) {
                if(isVertical){
                    chongzhi.height($(window).width()).width($(window).height()).css({
                        'transform-origin': 'left 100%',
                        'margin-left': '100%',
                        '-webkit-transform': 'rotate(270deg)',
                        'top': -chongzhi.height()+chongzhi.width()
                    });
                }else{
                    chongzhi.height($(window).width()).width($(window).height()).css({
                        'transform-origin': 'left 100%',
                        '-webkit-transform': 'rotate(90deg)',
                        'top': -chongzhi.height()
                    });
                }

            } else {
                chongzhi.height('100%').width('100%').css({'-webkit-transform': 'none', 'top': '0', 'margin-left': '0'});
            }
        }
    }

    //var input_box=$(".show_input_div");
    //if(input_box != null){
    //    if(input_box.css("display")!="none"){
    //        if(isVertical){
    //            $(".input_box").css("width","100%");
    //            $('.input_box tr td').height('35px');
    //            if(isPhone){
    //                input_box.height($(window).width()).width($(window).height()).css({
    //                    'transform-origin': 'left 100%',
    //                    'margin-left': '100%',
    //                    "margin-top":"-33%",
    //                    '-webkit-transform': 'rotate(270deg)',
    //                    'top':0
    //                });
    //            }else{
    //                input_box.css({'-webkit-transform':'none',
    //                    "height":"100%",
    //                    "width":"100%",
    //                    "margin-left":"-19.5%",
    //                    "margin-top":0,
    //                    top:0});
    //            }
    //        }else{
    //            $(".input_box").css("width","61.5%");
    //            $('.input_box tr td').height('22px');
    //            if(isPhone){
    //                input_box.height($(window).width()).width($(window).height()).css({
    //                    'margin-left':'0',
    //                    'transform-origin': 'left 100%',
    //                    'margin-top': "-100%",
    //                    "top":"0",
    //                    '-webkit-transform': 'rotate(90deg)'
    //                });
    //            }else{
    //                input_box.height($(window).height()).width($(window).width()).css({
    //                    'margin-left': '0',
    //                    'margin-top': '0',
    //                    "top":"0",
    //                    '-webkit-transform':'none'
    //                });
    //            }
    //        }
    //    }
    //}
    var wechatEWM=$(".share-wechat-qrcode");
    if($(".share-wechat-qrcode")[0]){
        if(isPhone){
            if(isVertical){
                wechatEWM.css({
                    'height':"20rem",
                    'width':'16rem',
                    'transform-origin': 'left 100%',
                    '-webkit-transform': 'rotate(270deg)',
                    "left":"90%",
                    'top': "45%"
                });
            }else{
                wechatEWM.css({
                    'height':"20rem",
                    'width':'16rem',
                    'margin-top':$(window).height()/2-wechatEWM.height()/2,
                    //'transform-origin': 'center center',
                    '-webkit-transform': 'rotate(90deg)',
                    'top':0,
                    "margin-left":"-8rem"
                });
            }
        }else{
            if(isVertical){
                wechatEWM.css({
                    'height':"20rem",
                    'width':'16rem',
                    '-webkit-transform': 'none',
                    'left':"50%",
                    'top':"55%"
                });
            }else{
                wechatEWM.css({
                    'height':"20rem",
                    'width':'16rem',
                    'margin-top':"0",
                    '-webkit-transform': 'none',
                    'left':"50%",
                    'top':($(window).height()-wechatEWM.height())/2
                });
            }
        }
    }
}
var audioList=new Array();
function oadioPlusFlow(src){
    if(!audioList[src]){
        audioList[src]=1;
        if(fileList[src]){
            allFileNum+=1;
            allFlow+=parseInt(fileList[src].fileSize);
            submitAllFlow();
        }
    }
}
function submitAllFlow(){

    if(allFlow>10*1024*1024){
        var data=new Object();
        data.op=201;
        data.guid=guid;
        data.fb=allFlow;
        data.fc=allFileNum;
        data.ref="h5";
        data.token="";
        $.ajax({
            url:"http://cgv2.66rpg.com/api/oweb_log.php",
            type:"post",
            dataType:"json",
            data:data,
            success: function (data) {
                console.log(data,"run allow up success");
            },
            error: function () {
            }
        });
        allFileNum=0;
        allFlow=0;
    }
}
var errorNum =0;
var errorString ='';
function fileListFato(path,strFrom){
    this.Asyn = function(path){
        var url = 'http://support.66rpg.com/report/bug';
        var Data = new Date();
        var DataTime = Data.getTime()/1000;
        var data= {
            sn:'7',
            sv:'1',
            ei:errorString+','+guid+','+ver+','+gIndex+';    ',
            rt:'1',
            sign:DataTime
        };
        $.ajax({
            type:"get",
            url:url,
            data:data,
            dataType:"json",
            success:function(result){
                if(parseInt(result.status) == 1){
                    console.log(result.msg,'bug_id:'+result.data['bug_id'])
                }else{
                    console.log(result.msg)
                }
            },
            error:function(e){
                console.log('网络不给力呀',e);
            }
        })
    };
    
    path = path.toLowerCase().replace(/\\/g,'/');
    path = path.replace(/\/\//g,'/');
    if(!fileList[path]){
        errorNum++;
        
        errorString += 'error path is:'+path+','+strFrom;
        if(errorNum == 3){
            this.Asyn(errorString);
            errorNum = 0;
            errorString='';
        }
        
        console.log(errorString);
        return '';
    }
    return fileList[path].url();
}
//获取一个随机数，在max,min之间
//max 需大于 min
//如果输入 10，则产生 0~9 的数
//如果输入 4,10，则产生 4~9 的数
//如果输入 40,10，则返回 false
function MathRandom(min,max){
    var rand=false;
    rand=Math.floor(Math.random()*max);
    if(!(min==undefined) && (max>=min)){
        rand=Math.floor(Math.random()*(max-min)+min);
    }else if(max<min){
        return false;
    }
    return rand;
}

var keyCFlg = false; //键盘按住C标识
//键盘按下
function keydown(e){
    ev = (e) ? e : ((window.event) ? window.event : "");
    if(ev&&ev.keyCode == 27){
        //按的Esc 退出全屏
        window.parent.asUserOperate.quitFullScreen();
    }
    if(ev&&ev.keyCode == 90){
        //按的z
        onTouchLong = true;
    }
    if(ev&&ev.keyCode == 67){
        //按的67----c
        if( guid == "25c96147b98c231eaf446050ed712911"||guid == "1730682ed107cfe283fc506aec6912c9"){
            //掌中挚爱
           return;
        }
        //在加载中
        if((tv.scene&&tv.scene instanceof SLoad)||gLoadAssets.bloadAssets){
            return;
        }
        if(keyCFlg){
            return;
        }
        keyCFlg = true;
        if(tv.data.System.MenuIndex == 0 && (tv.data.System.Cuis == null || tv.data.System.Cuis.length <= 0)){
            if(tv.scene instanceof SMenu){
                tv.scene.dispose();

            }else{
                if(tv.scene instanceof SGame){
                    tv.scene = new SMenu();
                }
            }
        }else{
            if(tv.data.System.MenuIndex == 10001){
                if(tv.scene instanceof SMenu){
                    tv.scene.dispose();
                }else{
                    if(tv.scene instanceof SGame){
                        tv.scene = new SMenu();
                    }
                }
            }else{
                if(tv.scene instanceof SCUI){
                    tv.scene.dispose();
                    tv.scene = new SGame();
                }else{
                    if(tv.scene instanceof SGame){
                        tv.scene = new SCUI(tv.data.System.MenuIndex);
                    }
                }
            }
        }
    }

}
//键盘抬起
function keyup(e){
    ev = (e) ? e : ((window.event) ? window.event : "");
    if(ev&&ev.keyCode == 27){
        //按的Esc
    }
    if(ev&&ev.keyCode == 90){
        //按的z
        onTouchLong=false;
    }
    if(ev&&ev.keyCode == 67){
        //按的69
        keyCFlg=false;

    }
}
//获取焦点
function fouchWeb(){
    if(mark == "isFlash"){
        var gameMainBox = window.parent.document.getElementById("gameMainBox");
        if(gameMainBox){
            gameMainBox.focus();
        }
    }
}
//字体速度
function controlFontSpeed(val){
    if(mark == "isFlash"){
        //fast---centre---low
        if(val == "fast"){
            //超快字速
            fontSpeedWeb = val;
        }else if(val == "center"){
            //较快字速
            fontSpeedWeb = val;
        }else{
            //正常字速
            fontSpeedWeb = val;
        }
    }
}
//静音
function controlSilence(muted){
    if(mark == "isFlash"){
        //设置静音
        var bgm = document.getElementById("bgm");
        var bgs = document.getElementById("bgs");
        var se = document.getElementById("se");
        var voice = document.getElementById("voice");
        if(muted){
            //静音
            bgm.muted = true;
            bgs.muted = true;
            se.muted = true;
            voice.muted = true;
        }else{
            //取消静音
            bgm.muted = false;
            bgs.muted = false;
            se.muted = false;
            voice.muted = false;
        }
    }
}
//1028*720  屏幕显示有误
function changeSence(){
    if (!isPhone && tv && tv.data) {
        var gameCanvas = document.getElementById("main_canvas");
        if (gameCanvas.width != tv.data.Headr.GWidth && gameCanvas.height != tv.data.Headr.GHeight) {
            gGameWidth = tv.data.Headr.GWidth;
            gameCanvas.width = gGameWidth;
            gGameHeight = tv.data.Headr.GHeight;
            gameCanvas.height = gGameHeight
        }
    }
}


window.addEventListener("load",resizeGame,false);
window.addEventListener("resize",resizeGame,false);


