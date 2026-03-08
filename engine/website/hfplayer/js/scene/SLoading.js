/**
 * Created by Administrator on 2016/6/29.
 */
function SLoading(){
    this.loading = false;
    this.alertFlag = false;
    this.blackFlg = false;
    var mask = new Image();
    var spMask,spLoading,spTips,spAlert;
    var alertArr = new Array();

    var alertBtnArr = new Array();

    var alertFlag = false;

    var fun1,fun2;
    mask.src =  M_IMG_SERVER_URL+"hfplayer/img/mask.png";
    mask.onload = function () {
    };
    var mask1 = new Image();
    mask1.src =  M_IMG_SERVER_URL+"hfplayer/img/mask1.png";
    mask1.onload = function () {
    };
    //800 600 游戏添加
    var mask3 = new Image();
    mask3.src =  M_IMG_SERVER_URL+"hfplayer/img/mask3.png";
    mask3.onload = function () {
    };
    var loading = new Image();
    loading.src =  M_IMG_SERVER_URL+"hfplayer/img/cgMenu1/loading.png";
    loading.onload = function () {
    }
    var alertBack = new Image();
    alertBack.src = M_IMG_SERVER_URL+"hfplayer/img/alert.png";
    alertBack.onload = function () {
    }
    var alertBtn = new Image();
    alertBtn.src = M_IMG_SERVER_URL+"hfplayer/img/alertBtn.png";
    alertBtn.onload = function () {
    }
    var alertBtnDown = new Image();
    alertBtnDown.src = M_IMG_SERVER_URL+"hfplayer/img/alertBtnDown.png";
    alertBtnDown.onload = function () {
    }

    this.showAlertMoreBtn = function (back,str,obj) {
        /**
         * obj[
         *     {Fun：按钮回调*
          *    Name:按钮名称*
          *    Color:名字颜色
          *    Size:按钮字体大小
          *    image1:按钮图片1 *
          *    image2:按下
          *    x:xxx,
          *    y:xxx},
          *    ......
          *
         * ]
         *
         * */
        this.alertFlag = true;
        //alert("dfafd");
        if(isVertical&&!spMask){
            spMask = new OSprite(mask1,null);
        }else if(!isVertical&&!spMask){
            //为800--600游戏添加
            if(gGameWidth == 800&&gGameHeight == 600){
                spMask = new OSprite(mask3,null);
            }else{
                spMask = new OSprite(mask,null);
            }
        }
        spMask.setZ(7000);
        //back.onload = function () {

        spAlert = new OSprite(back,null);
        spAlert.x = gGameWidth/2-spAlert.width/2;
        spAlert.y = gGameHeight/2-spAlert.height/2;
        spAlert.setZ(7010);
        alertArr.push(spAlert);
        //}

        for(var i = 0;i<obj.length;i++){
            var btn = new OButton(obj[i].image1,obj[i].image2," ",null,false,false);
            btn.setX(obj[i].x+spAlert.x);
            btn.setY(obj[i].y+spAlert.y);
            if(obj[i].Name&&obj[i].Name.length>0){
                if(!obj[i].Size){
                    obj[i].Size=20;

                }
                btn.drawTitleEx2(obj[i].Name,55,12,obj[i].Size,obj[i].Color);
            }
            btn.setZ(7020);
            btn.fun = obj[i].callBack;
            alertBtnArr.push(btn);
        }
        //for(var i in obj){
        //    console.log(obj[i]);
        //    //console.log(obj[i].image1.width,obj[i].image2.width);
        //    var btn = new OButton(obj[i].image1,obj[i].image2,obj[i].name,null,false,false);
        //    //btn.x = obj[i].x;
        //    //btn.y = obj[i].y;
        //    //btn.fun = obj[i].Fun;
        //}

        var spAlertInfo = new OSprite();
        spAlertInfo.y = spAlert.y+55;
        spAlertInfo.setZ(7012);
        var strArr = getStrarr(str,20,spAlert.width - 40,spAlertInfo);
        spAlertInfo.drawUpdateLogList(strArr,0,0,"#333333",18,22);
        if(spAlertInfo.width<spAlert.width - 40){
            spAlertInfo.x =gGameWidth/2 -spAlertInfo.width/2;
        }else{
            spAlertInfo.x = spAlert.x+30;
        }
        alertArr.push(spAlertInfo);
    }

    this.showAlert = function (str,fun) {
        if(fun){
            fun1 = fun;
        }
        this.alertFlag = true;
        //alert("dfafd");
        if(isVertical&&!spMask){
            spMask = new OSprite(mask1,null);
        }else if(!isVertical&&!spMask){
            if(gGameWidth == 800&&gGameHeight == 600){
                spMask = new OSprite(mask3,null);
            }else{
                spMask = new OSprite(mask,null);
            }
        }
        spMask.setZ(7000);

        spAlert = new OSprite(alertBack,null);
        spAlert.stretImage([8,8,8,8],300,180);
        spAlert.x = gGameWidth/2-spAlert.stretWidth/2;
        spAlert.y = gGameHeight/2-spAlert.stretImgHeight/2;
        spAlert.setZ(7010);
        alertArr.push(spAlert);


        //spAlertBtn = new OSprite(alertBtn,null);
        //spAlertBtn.stretImage([8,2,8,8],300,35);
        //spAlertBtn.x = gGameWidth/2 -spAlert.stretWidth/2;
        //spAlertBtn.y = spAlert.y+50;
        //spAlertBtn.setZ(7011);
        //spAlertBtn.zoom_y = -1;

        var spAlertTitle = new OSprite();
        spAlertTitle.x = gGameWidth/2 -spAlert.stretWidth/2;
        spAlertTitle.y = spAlert.y+20;
        var strArr = getStrarr("橙光小贴士",22,250,spAlertTitle);
        spAlertTitle.drawUpdateLogList(strArr,0,0,"#333333",22,22);
        spAlertTitle.setZ(7012);
        spAlertTitle.drawUpdateLogList(strArr,0,10,"#000000",22,24);
        if(spAlertTitle.width<200){
            spAlertTitle.x =gGameWidth/2 -spAlertTitle.width/2;
        }else{
            spAlertTitle.x = spAlert.x+25;
        }

        alertArr.push(spAlertTitle);

        var spAlertInfo = new OSprite();
        spAlertInfo.y = spAlert.y+75;
        spAlertInfo.setZ(7012);
        var strArr = getStrarr(str,20,250,spAlertInfo);
        spAlertInfo.drawUpdateLogList(strArr,0,0,"#333333",20,22);
        if(spAlertInfo.width<200){
            spAlertInfo.x =gGameWidth/2 -spAlertInfo.width/2;
        }else{
            spAlertInfo.x = spAlert.x+25;
        }
        alertArr.push(spAlertInfo);

        var spAlertBtn = new OSprite(alertBtn,null);
        spAlertBtn.stretImage([8,8,8,8],300,40);
        spAlertBtn.x = gGameWidth/2 -spAlert.stretWidth/2;
        spAlertBtn.y = spAlert.y+140;
        spAlertBtn.setZ(7012);
        spAlertBtn.drawLineTxt("好",140,10,"#1884fb",24);

        spAlertBtn.tag = "ok";
        alertBtnArr.push(spAlertBtn);
        //var
    }


    this.hideAlert = function () {
        if(spMask){
            spMask.dispose();
            spMask = null;
        }
        for(var i = 0;i<alertArr.length;i++){
            if(alertArr[i]){
                alertArr[i].dispose();
            }
        }
        for(var i = 0;i<alertBtnArr.length;i++){
            if(alertBtnArr[i]){
                alertBtnArr[i].dispose();
            }
        }
        this.alertFlag = false;
    }
    this.showBlack=function(setZ){
        this.blackFlg = true;
        if(isVertical){
            spMask = new OSprite(mask1,null);
        }else{
            if(gGameWidth == 800&&gGameHeight == 600){
                spMask = new OSprite(mask3,null);
            }else{
            spMask = new OSprite(mask,null);
            }
        }
        spMask.setZ(setZ);

    };
    this.hideBlack=function(){
        if(spMask){
            spMask.dispose();
            spMask = null;
        }
        this.blackFlg = false;
    };

    this.showMask = function () {
        this.loading = true;
        if(isVertical){
            spMask = new OSprite(mask1,null);
        }else{
            if(gGameWidth == 800&&gGameHeight == 600){
                spMask = new OSprite(mask3,null);
            }else{
                spMask = new OSprite(mask,null);
            }
        }
        spMask.setZ(7000);
        spLoading = new OSprite(loading,null);
        spLoading.setZ(7001);
        spLoading.x = gGameWidth/2-50;
        spLoading.y = gGameHeight/2-50;
        spTips = new OSprite();
        spTips.setZ(7001);
        spTips.drawLineTxt("请稍等...",0,0,"#ffffff",20);
        spTips.opacity =200;
        //spTips.setOpacity(150);
        spTips.x = gGameWidth/2-50;
        spTips.y = gGameHeight/2+50;
    }
    this.hideMask = function(){
        this.loading = false;
        if(spMask){
            spMask.dispose();
            spMask = null;
        }
        if(spLoading){
            spLoading.loadingRotate = false;
            spLoading.loadingRotateAngle=0;
            spLoading.dispose();
            spLoading = null;
        }
        if(spTips){
            spTips.dispose();
            spTips = null;
        }
    }
    this.runFun = function (btn) {
        this.hideAlert();
        if(btn.tag == "ok"){
            fun1&&fun1();
        }else {
            btn.fun&&btn.fun();
        }
        return;
    }
    var k=0;
    var frame = 0;
    this.update = function(){
        spLoading.loadingRotate = true;
        spLoading.loadingRotateAngle+=.3;
        frame++;
        if(frame>4){
            k++;
            frame=0;
            if(k>6){
                k=0;
            }
            var str = "请稍等";
            for(var i=0;i<k;i++){
                str+='.';
            }
            spTips.drawLineTxt(str,0,0,"#ffffff",20);
        }
        return;
    }
    
    this.updateAlert = function () {
        if(this.alertFlag){
            //var a = onClick();
            for(var i = 0;i<alertBtnArr.length;i++){
                if(alertBtnArr[i] instanceof OButton){
                    if(alertBtnArr[i].isClick()){
                        this.runFun(alertBtnArr[i]);
                    }
                }else if(alertBtnArr[i] instanceof OSprite){
                    if(alertBtnArr[i].isSelectedStretText()&&onClick()){
                        this.runFun(alertBtnArr[i]);
                    }
                    if(alertBtnArr[i].isSelectedStretText()&&onTouchDown){
                        alertBtnArr[i].setBitmap(alertBtnDown);
                    }else{
                        alertBtnArr[i].setBitmap(alertBtn);
                    }
                }

            }
        }
    }
}