/**
 * Created by 七夕小雨 on 2014/11/16.
 */

function CMain(){
    this.viewport = new OViewport(0,0,tv.data.Headr.GWidth,tv.data.Headr.GHeight);
    this.GamePictrue = new Array();
    for(var i = 0;i<50;i++){
        this.GamePictrue[i] = new OSprite(null,this.viewport);
        this.GamePictrue[i].opacity = 0;
        this.GamePictrue[i].setZ(i);
        this.GamePictrue[i].visible = false;
    }
    this.ButtonChoice = new CButtonChoice();
    this.TextChoice = new CTextChoice();

    /*
    * 文本显示方式
    * 0: 默认方式
    * 1：生命线方式
    * */
    this.isShowTextStyle = 0;

    //--0422 震动相关
    this.shakePower = 0;
    this.shakeSpeed = 0;
    this.shakeDuration = 0;
    this.shakeDirection = 1;
    this.shake = 0;
    //--

    //-- 悬浮组件
    this.floatButFlag = false;
    //--

    //--0422 闪烁
    //闪烁部分
    this.flashSprite = new OSprite(null,null);
    this.flashSprite.setZ(4999);
    this.flashSprite.bflashbright = true;
    this.flashDuration = 0;
    this.flashSprite.visible = false;

    /*
    * 天气相关
    * */
    this.weatherType = 0;
    this.weather = null;

    //this.message = new CMessage();

    this.msgIndex=0;
    this.message=new Array(3);
    for(var i=0;i<this.message.length;i++){
        this.message[i] = new CMessage();
        this.message[i].setLevel(3000+(i*2));
        this.message[i].msgBoxFadeOut();
    }

    //this.lifeLine = new CLifeLine();
    //this.message[this.msgIndex].msgBoxFadeOut();

    /*悬浮组件相关
     * by heshang
     * 2015-11-19
     * */
    this.sFloatButton;

    //判断橙光菜单是否关闭
    this.isCGClose=false;
    //判断菜单是否关闭
    this.isCMClose=false;

    var showMenu=false;
    //菜单
    var pmenu = new OSprite();
    var t_img,t_img_1;
    //橙光菜单
    var cmenu = new OSprite();
    var t_img3,t_img3_1;
    this.createMenu = function () {
        t_img = new Image();
        t_img_1 = new Image();
        t_img3 =new Image();
        t_img3_1 = new Image();
        if(mark=="isFlash"){
            t_img.src = M_IMG_SERVER_URL + "hfplayer/img/game_menu2_web.png?t="+imgVer;
            t_img_1.src = M_IMG_SERVER_URL + "hfplayer/img/game_menu2_web_pitch.png?t="+imgVer;
            t_img3.src = M_IMG_SERVER_URL + "hfplayer/img/game_menu3_web.png?t="+imgVer;
            t_img3_1.src = M_IMG_SERVER_URL + "hfplayer/img/game_menu3_web_pitch.png?t="+imgVer;
        }else{
            t_img.src = M_IMG_SERVER_URL + "hfplayer/img/game_menu2.png?t="+imgVer;
            t_img_1.src = M_IMG_SERVER_URL + "hfplayer/img/game_menu2_pitch.png?t="+imgVer;
            t_img3.src = M_IMG_SERVER_URL + "hfplayer/img/game_menu3.png?t="+imgVer;
            t_img3_1.src = M_IMG_SERVER_URL + "hfplayer/img/game_menu3_pitch.png?t="+imgVer;
        }

        t_img.onload = function () {
            pmenu.setBitmap(this);
            pmenu.visible = false;
        }
        t_img3.onload = function () {
            cmenu.setBitmap(this);
            cmenu.visible = false;
        }
        pmenu.setBitmap(t_img);
        pmenu.visible = false;
        //if(isVertical){
        //    pmenu.x = 462*zoom;
        //    pmenu.y = 55*zoom;
        //}else{
        //    //pmenu.x = 892*zoom;
        //    pmenu.x = (gGameWidth - 72)*zoom;
        //    pmenu.y = 22*zoom;
        //}
        /*pmenu.x = (gGameWidth - 72)*zoom;
        pmenu.y = 22*zoom;

        pmenu.zoom_x=pmenu.zoom_y=.6*zoom;*/

        if(mark == "isFlash"){
            pmenu.x = (gGameWidth - 60);
            pmenu.y = 28;
        }else{
            pmenu.x = (gGameWidth - 72);
            pmenu.y = 22;
            pmenu.zoom_x=pmenu.zoom_y=.6;
        }

        pmenu.visible = showMenu;
        pmenu.setZ(5500);
        //橙光菜单
        cmenu.setBitmap(t_img3);
        cmenu.visible = false;
        //if(isVertical){
        //    cmenu.x = 462*zoom;
        //    cmenu.y = 153*zoom;
        //}else{
        //    //cmenu.x = 892*zoom;
        //    cmenu.x = (gGameWidth - 72)*zoom;
        //    cmenu.y = 120*zoom;
        //}
        //cmenu.x = (gGameWidth - 72)*zoom;
        if(mark == "isFlash"){
            cmenu.x = (gGameWidth - 60);
            cmenu.y = 98;
        }else{
            cmenu.x = (gGameWidth - 72);
            cmenu.y = 120;
            cmenu.zoom_x=cmenu.zoom_y=.6;
        }

        cmenu.visible = showMenu;
        cmenu.setZ(5500);
        //tv.scene = new SCGMenu3();
    }
    this.createMenu();
    this.menuIsShow = function (bool) {
        if(tv.data.System.ShowSystemMenu){
            pmenu.visible=bool;
        }else{
            pmenu.visible = false;
        }
        cmenu.visible=bool;
        if( guid == "25c96147b98c231eaf446050ed712911"||guid == "1730682ed107cfe283fc506aec6912c9"){
            //掌中挚爱
            cmenu.visible = false;
        }
    };


    this.updateMenu = function(){
        if(!tv.inter.isFinish()){
            this.menuIsShow(true);
        }
        if(this.isCGClose){
            cmenu.setBitmap(t_img3);
            this.isCGClose=false;
        }
        if(this.isCMClose){
            pmenu.setBitmap(t_img);
            this.isCMClose=false;
        }

        //if(pmenu.isSelected() && onClick()){
        //if(pmenu.isSelected() && onTouchDown){
        if(pmenu.isClick()){
            pmenu.setBitmap(t_img_1);
            this.isCMClose=true;
            //如果有视频，隐藏
            if(ovideo._video){
                ovideo.videoHide();
            }
            //正常手机菜单
            if(tv.data.System.MenuIndex == 0 && (tv.data.System.Cuis == null || tv.data.System.Cuis.length <= 0)){
                tv.scene = new SMenu();
            }else{
                if(tv.data.System.MenuIndex == 10001){
                    tv.scene = new SMenu();
                }else{
                    tv.scene = new SCUI(tv.data.System.MenuIndex);
                }
            }
        }
        if(cmenu.isClick()){
            cmenu.setBitmap(t_img3_1);
            //cmenu.opacity=.2;
            this.isCGClose=true;
            //如果有视频，隐藏
            if(ovideo._video){
                ovideo.videoHide();
            }
            tv.scene=new SCGMenu3(function (data) {
                if(data=="close"){
                }
            });
        }
    }


    if(tv.DataVer >= 104) { //兼容旧数据版本防止103以前数据版本无悬浮控件读取报错  椰壳  2015/08/27
        this.sFloatButton = new SFloatButton();
        //初始隐藏，控制显示的时候显示
        this.sFloatButton.setVisible(false);
    }

    this.update = function(){
        this.updateMenu();
        if(tv.scene instanceof SCGMenu3){
            return;
        }
        this.ButtonChoice.update();

        if(tv.DataVer>=104){
            this.sFloatButton.update();
        }
        this.TextChoice.update();
        if(this.isShowTextStyle == 0){
            this.message[this.msgIndex].update();
        }else if(this.isShowTextStyle == 1){
            this.lifeLine.update();
        }


        if(gGameDebug.bshake){
            this.updateShack();//0422 震动
        }
        if(gGameDebug.bflash){
            this.updateFalsh();//0422 闪烁
        }
        this.updateViewPort();
        if(this.weather){
            this.weather.update();
        }
    };

    this.clear = function(){
        for(var i = 0;i<50;i++){
            this.GamePictrue[i].setBitmap(null);
        }
        //清除视频
        if(ovideo){
            ovideo.clear();
        }
        //清空震动相关
        this.stopShack();
        //清空闪烁相关
        //this.stopFlash();
        this.flashSprite.opacity = 0;
        this.flashSprite.visible = false;

        this.TextChoice.dispose();
        this.ButtonChoice.dispose();
        this.TextChoice = new CTextChoice();
        this.ButtonChoice = new CButtonChoice();

        if(this.message[this.msgIndex]){
            this.message[this.msgIndex].visible(false);
            this.message[this.msgIndex].megboxClear();
            this.message[this.msgIndex].msgBoxFadeOut();
        }

        if(this.lifeLine){
            this.lifeLine.dispose();
        }
        //this.lifeLine.visible(false);
        //this.lifeLine.megboxClear();
        //this.lifeLine.msgBoxFadeOut();
        this.menuIsShow(false);
        this.startWeather(0);
        if(fastImg){
            fastImg.dispose();
            fastImg=null;
        }
    }

    this.fadeOut = function(){
        for (var i = 0; i < this.GamePictrue.length; i++) {
            this.GamePictrue[i].FadeTo(0, 30);
        }
        this.TextChoice.closeChoice();
        this.ButtonChoice.closeChoice();
        this.message[this.msgIndex].msgBoxFadeOut();
    }

    ///---------Cmain save----------
    this.saveData = function(arr){
        this.savePic(arr);
        this.saveMusic(arr);
        this.saveMsg(arr);
        this.saveFloatBut(arr);
        this.saveRotate(arr);

    };

    this.savePic = function(arr){
        for(var i = 0 ; i < this.GamePictrue.length; i++){
            var os = this.GamePictrue[i];
            var path = os.e["path"] == null ? "" : os.e["path"];
            arr.push(path + "|");
            arr.push(os.x + "|");
            arr.push(os.y + "|");
            arr.push(os.opacity + "|");
            arr.push((os.visible ? 1 : 0) + "|");
            arr.push(parseInt(os.zoom_x * 100) + "|");
            arr.push(parseInt(os.zoom_y * 100) + "|");
        }
    };

    this.saveMusic = function(arr){
        oaudio.saveData(arr);
    }

    this.saveMsg = function(arr){
        if(this.isShowTextStyle == 0){
            this.message[this.msgIndex].saveArgs(arr);
        }else{
            this.lifeLine.saveArgs(arr);
        }
    };
    //旋转
    this.saveRotate = function(arr){
        crotate.saveData(arr);
    };
    this.saveFloatBut = function(arr){
        if (tv.DataVer >= 104) { //兼容旧数据版本防止103以前数据版本无悬浮控件读取报错  heshang  2015/11/25
            if(this.sFloatButton){
                this.sFloatButton.saveDate(arr);
            }else{
                arr.push(false+"|");
            }
        }
    }

    ///----------Cmain load------------
    this.loadData = function(arr) {
        this.clear();
        if (tv.DataVer >= 104) { //兼容旧数据版本防止103以前数据版本无悬浮控件读取报错  heshang  2015/11/25
            this.sFloatButton.dispose();
        }
        this.loadPic(arr);
        this.loadMusic(arr);
        this.loadMsg(arr);
        //this.isShowTextStyle = 1;
        //this.lifeLine = new CLifeLine();
        //读档的时候实例化一个新的悬浮控件
        if (tv.DataVer >= 104){
            this.loadSFloatButton(arr);
        }
        //旋转
        this.loadRotate(arr);
    }
    this.loadCloudData = function(canvas){
        this.clear();
        if(tv.data.DFloatButton){
            if (tv.DataVer >= 104) { //兼容旧数据版本防止103以前数据版本无悬浮控件读取报错  heshang  2015/11/25
                this.sFloatButton.dispose();
            }
            if(parseInt(canvas.FloatStatus) == 1){
                this.sFloatButton = new SFloatButton();
                tv.canvas.sFloatButton.setVisible(true);
            }else{
                this.sFloatButton = new SFloatButton();
                tv.canvas.sFloatButton.setVisible(false);
            }
        }

        this.startWeather(parseInt(canvas.WeatherType));
        if(parseInt(canvas.CuiIndex)!=-1){
            tv.scene.dispose();
            tv.scene = new SCUI(parseInt(canvas.CuiIndex));
        }
        var picStr = canvas.Layers;
        var picArr;
        if(picStr.length>0){
            picArr = picStr.split('|');
        }
        //var length = picArr.shift();
        this.loadPic(picArr);
        var rotateStr = canvas.LayerRotateInfo;
        crotate.loadData(rotateStr);
       /* //云上生命线
        var lifelineStr = canvas.LifeLine;
        var lifelineArr;
        if(lifelineStr && lifelineStr.length>0){
            lifelineArr = decodeURIComponent(lifelineStr[0]).split('|');
            this.loadCloudLifeLineData(lifelineArr);
        }
*/
    }

    this.loadLifeData = function(arr) {
        this.clear();
        if (tv.DataVer >= 104) { //兼容旧数据版本防止103以前数据版本无悬浮控件读取报错  heshang  2015/11/25
            this.sFloatButton.dispose();
        }
        this.loadPic(arr);
        this.loadMusic(arr);
        this.loadLifeLine(arr);

        //读档的时候实例化一个新的悬浮控件
        if (tv.DataVer >= 104){
            this.loadSFloatButton(arr);
        }
    }
    //新提出来的---生命线
    this.loadLifeLine = function(arr){
        if(tv.system.rwFile.isCloud){
            //云上
        }else{
            //本地 argv开始
            if(arr[0] == "Argv"){
                arr.shift();
                var code = parseInt(arr.shift());
                //var  = arr.shift();
                var indent = parseInt(arr.shift());
                var argv = new Array(6);
                argv[0] = arr.shift();
                argv[1] = arr.shift();
                argv[2] = arr.shift();
                argv[3] = arr.shift();
                argv[4] = arr.shift();
                argv[5] = arr.shift();
                arr.shift();
                var interUser = argv[1];
                if(parseInt(interUser) == 1){
                    //新版
                    if (arr[0] != "false" && arr.length >= 18){
                        var event = new DEvent1(code,indent,null,argv);
                        //console.log(event,arr);
                        this.createLifeLine(event,null);
                        this.lifeLine.loadArgs(arr);
                    }

                }else{
                    //旧版
                    if (arr[0] != "false" && arr.length >=18){
                        var event = new DEvent1(code,indent,null,argv);
                        //console.log(event,arr);
                        this.createLifeLine(event,null);
                        //this.lifeLine.loadArgs(arr);
                    }
                }
            }
        }
    }
    this.loadCloudLifeLineData = function (arr){
        /*if (tv.DataVer >= 104) { //兼容旧数据版本防止103以前数据版本无悬浮控件读取报错  heshang  2015/11/25
         this.sFloatButton.dispose();
         }*/
        if(arr[0] == "Argv"){
            arr.shift();
            var code = parseInt(arr.shift());
            //var  = arr.shift();
            var indent = parseInt(arr.shift());
            var argv = new Array(6);
            argv[0] = arr.shift();
            argv[1] = arr.shift();
            argv[2] = arr.shift();
            argv[3] = arr.shift();
            argv[4] = arr.shift();
            argv[5] = arr.shift();
            arr.shift();
            if (arr[0] != "false" && arr.length >= 18){
                var event = new DEvent1(code,indent,null,argv);
                this.createLifeLine(event,null);
                this.lifeLine.loadArgs(arr);
            }

        }
    };
    this.createLifeLine = function (e,m) {
        this.isShowTextStyle = 1;
        if(this.lifeLine){
            this.lifeLine.dispose();
        }
        this.lifeLine = new CLifeLine(e,m);
        //console.log(this.lifeLine);
    }
    
    this.loadSFloatButton = function(arr){
        var bshowFb = arr.shift();
        if(tv.data.DFloatButton){
            if( bshowFb =="true"){
                this.sFloatButton = new SFloatButton();
                tv.canvas.sFloatButton.setVisible(true);
            }else{
                this.sFloatButton = new SFloatButton();
                tv.canvas.sFloatButton.setVisible(false);
            }
        }
    }

    this.loadPic = function(arr){
        var imgData=new Array();
        for(var i = 0 ; i < this.GamePictrue.length; ++i){
            var os = this.GamePictrue[i];
            os.StopToGoal();
            os.StopTrans();
            var path = arr.shift();
            if(fileList[path] != null){
                os.e["path"] = path;
                imgData.push(path);
                var timg = new Image();
                timg.src = fileList[path].url();
                os.setBitmap(timg);
            }
            os.x = parseInt(arr.shift());
            os.y = parseInt(arr.shift());
            os.opacity = parseInt(arr.shift());
            os.visible = (parseInt(arr.shift()) != 0);
            os.zoom_x = parseInt(arr.shift()) / 100;
            os.zoom_y = parseInt(arr.shift()) / 100;
        }
        //gLoadAssets.loadImgData(imgData);
    };

    this.loadMusic = function(arr){
        oaudio.loadData(arr);
    }

    this.loadMsg = function(arr){
        this.message[this.msgIndex].loadArgs(arr);
    }
    //读旋转
    this.loadRotate = function(arr){
        crotate.loadData(arr);

    };

    ///---------------震动-----------------
    this.startShack = function(power,speed,duration){
        //--0422 震动相关
        this.shakePower = 0;
        this.shakeSpeed = 0;
        this.shakeDuration = 0;
        this.shakeDirection = 1;
        this.shake = 0;

        this.shakePower = power;
        this.shakeSpeed = speed;
        this.shakeDuration = duration;
    }
    this.startWeather = function (type) {
        if(type!=0){
            if(this.weather){
                this.weather.dispose();
                this.weather = null;
            }
            this.weather = new CWeather(type);
        }else{
            if(this.weather){
                this.weather.dispose();
                this.weather = null;
            }
        }
    }
    this.stopShack = function(){
        this.shakePower = 0;
        this.shakeSpeed = 0;
        this.shakeDuration = 0;
        this.shakeDirection = 1;
        this.shake = 0;
    }

    this.updateShack = function(){
        if(this.shakeDuration >= 1  || this.shake != 0 || this.shakeDuration == -1){
            var delta = this.shakePower * this.shakeSpeed * this.shakeDirection / 10.0;//parseInt()后delta值为0
            if(this.shakeDuration != -1 && this.shakeDuration <= 1 && this.shake * (this.shake + delta) < 0){
                this.shake = 0;
            }else{
                this.shake += delta;
            }
            if(this.shake > this.shakePower * 2){
                this.shakeDirection -= 1;
            }
            if(this.shake < this.shakePower * -2){
                this.shakeDirection += 1;
            }
            if(this.shakeDuration >= 1){
                this.shakeDuration -= 1;
            }
        }
    }

    this.updateViewPort= function(){
        var f = parseInt(Math.random() * 10);
        this.viewport.ox = f % 2 == 0 ? this.shake : this.shake * -1;
        f = parseInt(Math.random() * 10);
        this.viewport.oy = f % 2 == 0 ? this.shake : this.shake * -1;
    }

    ///---------------闪烁----------------
    this.startFlash = function(color,time){
        //flashSprite.zoom_x = TempVar.GameWidth * 1.0f / 10.0f;
        //flashSprite.zoom_y = TempVar.GameHeight * 1.0f / 10.0f;
        //flashSprite.DrawRect(flashSprite.GetRect(), color);
        this.flashSprite.visible = true;
        this.flashSprite.opacity = 255;
        this.flashSprite.color = color.getColor();
        this.flashDuration = time;
    }
    this.stopFlash= function () {
        this.flashSprite = new OSprite(null,null);
        this.flashSprite.setZ(4999);
        this.flashSprite.bflashbright = true;
        this.flashDuration = 0;
        this.flashSprite.opacity = 0;
        this.flashSprite.visible = false;
    }

    this.updateFalsh = function(){
        if(this.flashDuration >= 1){
            var d = this.flashDuration;
            this.flashSprite.opacity = this.flashSprite.opacity * (d - 1) / d;
            this.flashDuration -= 1;
        }else{
            this.flashSprite.visible = false;
        }
    }

}