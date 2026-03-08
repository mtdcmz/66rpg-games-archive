/**
 * Created by heshang on 2016/3/24.
 */

var imgVer=20170215001;
function SVLoad (){
    this.isLoad = false;

    this.preImgArr = {};
    var isPreload = null;

    var loadTime = null;
    var imgPathHead = img_base_path;
    var imgLength;
    var allLength;
    var imgArr = new Array();
    var imgData;

    var baseBarValue,maxBar;
    var baseBarValue = 0;
    var maxBarValue = 100;
    var scrollBar;
    var run1;
    var viewport;
    //小人相关
    var image1,image2,imgrun,nowFrame,frameRun;

    var callFun;
    var self = this;
    var type = "";
    var loadFinish = function(){
        //clearInterval(loadTime);
        loadTime=null;
        if(viewport){
            viewport.dispose();
        }
        if(scrollBar){
            scrollBar.setVisible(false);
            scrollBar.disPose();
            scrollBar=null;
        }
        if(run1){
            run1.visible=false;
            run1.dispose();
            run1=null;
        }
        viewport=null;
        self.isLoad = false;
        if(type == "object"){
            callFun&&callFun(imgArr);
        }else{
            callFun&&callFun(imgData);
        }
        imgArr.length = 0;
    };
    var imgLoadOk = function(img){
        var image = img;
        imgLength--;
        if(image){
            if(isPreload){
                self.preImgArr[img.name.toLowerCase()] = img;
            }
            if(type == "object"){
                if(image){
                    if(!imgArr[image.name]){
                        imgArr[image.name]=image;
                    }
                }
            }else{
                imgData =image;
            }
            var value=parseInt((((allLength-imgLength)/allLength))*100);
            if(scrollBar){
                scrollBar.setValue(value,maxBarValue);
                scrollBar.moveBar();
            }
            if(imgLength==0){
                loadFinish();
            }
        }else{
            loadFinish();
        }
    };
    var runGirl=function(){
        function setImage(src){
            var image;
            if(!otherImgArr[src]){
                image = new Image();
                image.src = src;
            }else{
                image = otherImgArr[src];
            }
            return image;
        }
        var src=imgPathHead+'qg_run_01.png?v=20170228001';
        image1 = setImage(src);


        src=imgPathHead+'qg_run_02.png?v=20170228001';
        image2 = setImage(src);
        src = imgPathHead + "LoadingBar.png";
        var t_img = setImage(src);

        if(type == "img"){
            image1 = image2 = "";
        }

        scrollBar = new OScrollbar('',t_img,baseBarValue,maxBarValue,false);
        scrollBar.setX(0);
        scrollBar.setY(gGameHeight -10);
        scrollBar.setVisible(true);
        run1.setBitmap(image1);
        run1.x = gGameWidth-130-50;
        run1.y = gGameHeight-150-70;
    };
    this.init = function (imgList) {
        baseBarValue = 0;
        maxBarValue = 100;
        frameRun =5;
        nowFrame = 0;
        imgrun = 0;
        imgData =null;
        imgArr = new Array(imgList.length);
        var w,h;
        if(isVertical){
            w=540;
            h=960;
        }else{
            w=960;
            h=540;
        }
        viewport = new OViewport(0,0,w,h);
        run1 = new OSprite(null,viewport);
        runGirl();
        if(type =="object"){
            for(var i =0;i<imgList.length;i++){
                var image = new Image();
                var path = imgList[i].src;
                if(imgList[i].type == 1){
                    image.src=imgList[i].src+"?t="+imgVer;
                    image.name =imgList[i].name;
                }else if(imgList[i].type == 2){
                    image.src=imgList[i].src;
                    image.name =imgList[i].name;
                }else{
                    image.name =imgList[i].name;
                    image.src=fileListFato(path,'image in extPreLoad');
                }
                if(image){
                    image.onload=function(){
                        imgLoadOk(this);
                    };
                    image.onerror=function(){
                        imgLoadOk(null);
                    };
                }
            }
        }else{
            if(imgList.complete){
                imgLoadOk(imgList);
                return;
            }
            imgList.onload = function () {
                imgLoadOk(this);
            }
            imgList.onerror = function () {
                imgLoadOk(null);
            }
        }

    };
    function setFrame(){
        if(imgrun == 0){
            imgrun = 1;
            if(type == "img"){
                run1.drawLineTxt("请稍等...",gGameWidth - gLoadAssets.textInfoWidth - gLoadAssets.textInfoRightOff, - gLoadAssets.textInfoBottomOff);
            }
            run1.setBitmap(image2);
        }else if(imgrun == 1){
            imgrun = 0;
            if(type == "img"){
                run1.drawLineTxt("请稍等.....",gGameWidth - gLoadAssets.textInfoWidth - gLoadAssets.textInfoRightOff, - gLoadAssets.textInfoBottomOff);
            }
            run1.setBitmap(image1);
        }else{
            imgrun = 0;
        }
    }
    this.update = function () {
        if(this.isLoad){
            nowFrame++;
            if(nowFrame > frameRun){
                nowFrame = 0;
                setFrame();
            }
        }
    }
    this.loadImgData=function(imgList,callBack,bool){
        isPreload = bool;
        if(isPreload){
            this.preImgArr = {};
        }
        type ="";
        if(imgList instanceof Array){
            type = "object";
            imgLength = imgList.length;
            allLength = imgLength;
        }else{
            type = "img";
            imgLength = 1;
            allLength = 1;
        }
        callFun = callBack;
        if(imgLength <= 0){
            loadFinish();
            callBack();
            return;
        }
        this.init(imgList);
        this.isLoad = true;
    };
}