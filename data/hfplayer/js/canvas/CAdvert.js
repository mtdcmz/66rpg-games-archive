/**
 * Created by lilinlin on 2017/3/22.
 */
function CAdvert (){
    this.iNum = 0;
    var self = this;
    this.isAdAjax = false;
    this.fristLoad = false;
    this.adEnd = false; //广告已经结束了
    this.ADBox;
    this.haveUrl="";
    this.payUrl = "http://www.66rpg.com/home/silver_vip";
    this.waitAd = false;
    this.init = function(){
        if(parseInt(publicUses.getUserInfo().vip_level) ==1&&parseInt(publicUses.getUserInfo().screen_game_ad) == 1){
            this.sec = 4;
            if(this.iNum < this.sec*FPS) {
                this.vipUserSp();
            }
            return;
        }
        //如果没有获取到接口
        if(!this.ADBox){
            return;
        }
        this.loadAdSp();
    };
    this.vipUserSp = function(){
        //是天使会员
        var angQxUrl = M_IMG_SERVER_URL + "hfplayer/img/cgMenu1/angadxs.png";
        var angQx = new Image();
        angQx.src = angQxUrl;
        this.angQx = new OSprite(angQx, null);
        this.angQx.y = 20;
        this.angQx.width = 790;
        this.angQx.height = 55;

        if (isVertical) {
            this.angQx.x = 0;
        } else {
            this.angQx.x = 85;
        }
    }
    //普通用户
    this.loadAdSp = function(){
        this.fristLoad = true;
        this.sec = parseInt(this.ADBox.sec);
        this.adurl = this.ADBox.adurl;
        this.imgurl = this.ADBox.imgurl;
        if(this.iNum < this.sec*FPS){
            //加载广告
            var img = new Image();
            img.src = this.imgurl;
            var img2 = new Image();
            img2.src = M_IMG_SERVER_URL+"hfplayer/img/cgMenu1/angad.png";

            if(isVertical){
                //竖屏
                //背景层加载完才加载别的
                img.onload = function(){
                    self.adBg = new OSprite(img,null);
                    self.adBg.x = 0;
                    self.adBg.y = 250;
                    self.adBg.width = 553;
                    self.adBg.height =237;

                    self.adRIcon = new OSprite(img2,null);
                    self.adRIcon.x = 443;
                    self.adRIcon.y = 250;
                    self.adRIcon.width = 110;
                    self.adRIcon.height =40;

                    self.adTimer = new OSprite(null,null);
                    self.adTimer.fontSize = 16;
                    self.adTimer.setZ(9000);
                    self.adTimer.color = new OColor(255, 255, 255).getColor();
                }

            }else{
                //横屏
                //等第一张图片加载完了
                img.onload = function(){
                    self.adBg = new OSprite(img,null);
                    self.adBg.x = 200;
                    self.adBg.y = 150;
                    self.adBg.width = 553;
                    self.adBg.height =237;

                    self.adRIcon = new OSprite(img2,null);
                    self.adRIcon.x = 643;
                    self.adRIcon.y = 150;
                    self.adRIcon.width = 110;
                    self.adRIcon.height =40;

                    self.adTimer = new OSprite(null,null);
                    self.adTimer.fontSize = 16;
                    self.adTimer.setZ(6003);
                    self.adTimer.color = new OColor(255, 255, 255).getColor();
                }
            }
        }
    };
    this.update = function(callBack){
        if(callBack&&!this.cAdvertFn){
            self.cAdvertFn = callBack;
        }
        //天使会员+去广告
        if(parseInt(publicUses.getUserInfo().vip_level) ==1&&parseInt(publicUses.getUserInfo().screen_game_ad) == 1){
            if(this.iNum < this.sec*FPS){
                this.iNum++;
                if(this.adTimer||this.adRIcon||this.adBg){
                    this.adTimer.dispose();
                    this.adRIcon.dispose();
                    this.adBg.dispose();
                    this.adTimer = null;
                    this.adRIcon = null;
                    this.adBg = null;
                    this.vipUserSp();
                }
            }else{
                this.dispose();
                callBack&&callBack();
            }
            if(this.angQx){
                if(this.angQx.isClick()){
                    this.dispose();
                    callBack&&callBack();
                }
            }
            return;
        }
        if(this.ADBox&&!this.fristLoad){
            cAdvert.isAdAjax = false;
            this.loadAdSp();
        }

        if(!this.adTimer||!this.adRIcon||!this.adBg){
            return;
        }
        if(this.iNum < this.sec*FPS){
            var timer = (8-parseInt(this.iNum/FPS))+"";
            if(isVertical){
                //竖屏
                this.adTimer.drawText(timer,519,244,true);
            }else{
                //横屏
                this.adTimer.drawText(timer,719,144,true);
            }
            this.iNum++;
            if(this.adRIcon.isSelectedText("ad")){
                this.haveUrl = this.payUrl;
            }else{
                this.haveUrl = "";
            }
            if(this.adBg.isSelectedText("ad")){
                if(this.haveUrl&&this.haveUrl == this.payUrl){
                    return;
                }
                this.haveUrl = this.adurl;
            }else{
                this.haveUrl="";
            }
        }else{
            this.haveUrl="";
            this.iNum = this.sec*FPS;
            this.adTimer.dispose();
            this.adRIcon.dispose();
            this.adBg.dispose();
            this.adEnd = true;
            if(this.waitAd){
                this.waitAd = false;
                callBack&&callBack();
            }
        }
    };
    this.dispose=function(){
        this.waitAd = false;
        this.haveUrl = "";
        this.iNum = this.sec*FPS;
        this.adTimer&&this.adTimer.dispose();
        this.adRIcon&&this.adRIcon.dispose();
        this.adBg&&this.adBg.dispose();
        this.angQx&&this.angQx.dispose();
        this.adEnd = true;

    }
    this.openNewWin = function(url,id){
        var a = document.createElement("a");
        a.href = url;
        a.onclick = function () {
            window.open();
        }
        //a.href = url;
        if(open){
            a.target="_blank";
        }
        //a.click();
        var evt = document.createEvent("MouseEvents");
        evt.initEvent("click", true, true);
        a.dispatchEvent(evt);

    }
}
var cAdvert = new CAdvert();