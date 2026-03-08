/**
 * 预加载资源到缓存
 */
var isNew=false;
//var loadOkImgList=[];
//快进
var fastBtnArr=new Array();
var otherImgArr = new Array();
var imgTemp = new Array();
var faceImageArr = new Array();

var oActPicArrData = new Object();
var oActPicArr = new Array();

var oVideoArr = new Object();
function LoadAssets(){

    //预加载任务容器
    var pic_task = new Array();

    //预加载结束，切换场景准备
    this.backSceneCountdown = 0;
    var isupdate = false;//预加载任务是否完成,能否准备切换场景

    //预加载开关与逻辑标志变量
    this.bloadAssets = false;//只允许内层修改，外层只在ogmain判断主逻辑，其余场景通过isNeedload函数判断相应处理
    this.curLoadScene = "";//相当于枚举变量 之前具体场景内不能用tv.scene instanceof 去判断前后加载 new完后指针才有具体的值 
    this.bInit = false;//预加载前执行初始化开关

    //游戏场景控制是否预加载变量
    var pos_index = 0;
    var pos_story = 0;

    //视频加载变量
    var mainDiv = document.getElementById("main_div");
    //其他场景控制是否预加载变量
    this.doneScuiList = new Array();
    this.otherSceneUI = {
        SMenu : false,
        SReplay : false,
        SSavefile : false,
        SSystem : false,
        SBGM: false,
        SCG: false
    };
    var otherUI = "";

    var dataTipsList = {
        start:"作品初始化",//图片资源提示
        ImgData:"正在加载资源",//图片资源提示
        mapData:"正在加载数据列表",//map.bin
        gameData:"正在加载数据",//game.bin
        fontData:"正在加载字体数据",//font.xfi
        parseData:"正在解析资源，此过程不消耗流量"//解析数据
    }

    //downing文字信息
    var downingText = "请稍等......";

    this.textInfoSp = null;
    this.textInfoWidth = 0;

    //downing文字放于左下角的偏移测试值 
    this.textInfoBottomOff = 40;
    this.textInfoRightOff = 20;
    this.textInfoFontHeight = 24;

    //橙光小人儿跑动图
    this.orgRunimg1 = null;
    this.orgRunimg2 = null;

    this.orgRunSp = null;
    this.curRunSpimgIndex = 1;
    this.imgChangeFps = 10;//小人加载频率
    this.fpsCount = 0;//fps计数
    //var test_size = 10;//??

    //进度条相关
    var curBarValue = 0;
    var maxBarValue = 100;
    var baseBarValue = 0;
    var fulltasknum = 0;
    this.scrollbar = null;
    this.baseimgpath = img_base_path;

    //头像
    var face_task = new Array();

    //加载 快进图、小人图  进度条图
    var self = this;
    function loadOtherPic(){
        function loadOk(img,src){
            otherImgArr[src] = img;
        }
        //加载快进图
        var src;
        function loadImg(src){
            if(!otherImgArr[src]) {
                var img = new Image();
                img.src = src;
                img.onload = function () {
                    loadOk(this, this.src);
                }
            }
        }
        for(var i = 0;i<9;i++){
            src = img_base_path + "speedfast/fast"+i+".png";
            loadImg(src)
        }
        src = img_base_path + "qg_run_01.png?v=20170228001";
        loadImg(src);
        src = img_base_path + "qg_run_02.png?v=20170228001";
        loadImg(src);
        src = img_base_path + "LoadingBar.png";
        loadImg(src);
    }
    loadOtherPic();
    //判断是否需要加载，并处理与加载相关的逻辑,外层根据返回值处理场景逻辑
    this.isNeedLoad = function(){
        this.bloadAssets = false;

        if(this.curLoadScene.length > 0){ //this.curLoadScene标志判断
            if(this.curLoadScene == "SCUI"){
                if(!this.doneScuiList.contains(tv.CUIFromIndex)){
                    this.doneScuiList.push(tv.CUIFromIndex);
                    this.bloadAssets = true;
                }
            }else{
                if(this.otherSceneUI[this.curLoadScene] != null && this.otherSceneUI[this.curLoadScene] == false){
                    otherUI = this.curLoadScene;
                    this.otherSceneUI[this.curLoadScene] = true;
                    this.bloadAssets = true;
                }
            }
        }else{ // instanceof判断
            if(tv.scene instanceof SGame){
                if(tv.inter.storyId == pos_story && tv.inter.pos > pos_index ){
                    pos_index = tv.inter.pos;
                    this.bloadAssets = true;
                }
                if(tv.inter.storyId != pos_story){
                    pos_story = tv.inter.storyId;
                    pos_index = 0;
                    this.bloadAssets = true;
                }
            }else if(tv.scene instanceof SLoad){
                this.bloadAssets = true;
            }
        }
        //不需要加载则清除标志
        if(this.bloadAssets == false){
            this.curLoadScene = "";
        }
        // alert("init Start "+(new Date().getTime()-t1)/1000+"s") ;
        return this.bloadAssets;
    }

    this.init = function(){
        //初始化
        this.bIsInit = true;
        //加载广告
        if(mark == "isFlash"){
            if(!cAdvert.adEnd) {
                cAdvert.init();
            }
        }

        //downing文字
        if(! this.textInfoSp){
            this.textInfoSp = new OSprite(null,null);
        }
        this.textInfoSp.fontSize = 22;
        this.textInfoSp.setZ(6002);
        this.textInfoSp.color = new OColor(255, 255, 255).getColor();

        //loading界面小人跑动图
        if(!this.orgRunSp){
            var src = this.baseimgpath + "qg_run_01.png?v=20170228001";
            if(!otherImgArr[src]){
                this.orgRunimg1 = new Image();
                this.orgRunimg1.src = src;
            }else{
                this.orgRunimg1 = otherImgArr[src]
            }

            src = this.baseimgpath + "qg_run_02.png?v=20170228001";
            if(!otherImgArr[src]){
                this.orgRunimg2 = new Image();
                this.orgRunimg2.src = src;
            }else{
                this.orgRunimg2 = otherImgArr[src]
            }
            this.orgRunSp = new OSprite(this.orgRunimg1);
        }
        this.orgRunSp.x = gGameWidth - 130 - gLoadAssets.textInfoFontHeight; //130 150为图片大小直接外部取值了
        this.orgRunSp.y = gGameHeight - 150 - gLoadAssets.textInfoRightOff - gLoadAssets.textInfoFontHeight;
        this.orgRunSp.setZ(6003);

        //0427 bar
        curBarValue = 0;
        baseBarValue = 0;
        fulltasknum = 0;

        if(!this.scrollbar){
            src = this.baseimgpath + "LoadingBar.png";
            var t_img;
            if(!otherImgArr[src]){
                t_img = new Image();
                t_img.src = this.baseimgpath + "LoadingBar.png";
            }else{
                t_img = otherImgArr[src];
            }
            this.scrollbar = new OScrollbar("",t_img, baseBarValue, maxBarValue,false);
        }
        this.scrollbar.setX(0);
        this.scrollbar.setY(gGameHeight - 10);//10为imgheight
        this.scrollbar.setVisible(true);
        this.scrollbar.setZ(6004);

        //加载
        if(this.curLoadScene.length > 0){
            if(this.curLoadScene == "SCUI"){
                this.scuiSceneLoad();
            }else{
                this.otherUILoad();
            }
        }else{
            if(tv.scene instanceof SGame){
                this.gameSceneLoad();
            }else if(tv.scene instanceof SLoad){

                this.firstLoad();
            }
        }
    }
    //加载游戏内部资源 图片数组的时候外部调用
    this.loadImgData = function (data) {
        if(data){
            for(var i=0;i<data.length;i++){
                if(data[i]);
                addTask(data[i]);
            }
        }else{
            return;
        }
    }
    this.showRun = function (code) {
       // code =3;
        var src = this.baseimgpath + "qg_run_01.png?v=20170228001";
        if(!otherImgArr[src]){
            this.orgRunimg1 = new Image();
            this.orgRunimg1.src = src;
        }else{
            this.orgRunimg1 = otherImgArr[src]
        }

        src = this.baseimgpath + "qg_run_02.png?v=20170228001";
        if(!otherImgArr[src]){
            this.orgRunimg2 = new Image();
            this.orgRunimg2.src = src;
        }else{
            this.orgRunimg2 = otherImgArr[src]
        }

        if(!gLoadAssets.orgRunSp){
            gLoadAssets.orgRunSp = new OSprite(this.orgRunimg1);
        }
        src = this.baseimgpath + "LoadingBar.png";
        var t_img;
        if(!otherImgArr[src]){
            t_img = new Image();
            t_img.src = this.baseimgpath + "LoadingBar.png";
        }else{
            t_img = otherImgArr[src];
        }
        if(!this.scrollbar){
            this.scrollbar = new OScrollbar("",t_img, baseBarValue, maxBarValue,false);
        }
        this.scrollbar.setX(0);
        this.scrollbar.setY(gGameHeight - 10);//10为imgheight
        this.scrollbar.setVisible(true);
        this.scrollbar.setZ(6004);

        var newWidth = window.innerWidth;
        var newHeight = window.innerHeight;
        var gamecanvas = document.getElementById("main_canvas");
        if(!this.textInfoSp){
            this.textInfoSp = new OSprite(null,null);
            this.textInfoSp.setZ(6002);
            this.textInfoSp.color = new OColor(255, 255, 255).getColor();
            this.setDrawText(dataTipsList.start);
        }
        if(parseInt(gGameHeight)>parseInt(gGameWidth)){//竖屏
            isPhone = newHeight < newWidth;
            isVertical=true;
            //////竖屏游戏第一次横屏加载出问题的解决方案
            roated=false;
            if(isPhone){
                //resizeGame();
                gamecanvas.width = gGameHeight;
                gamecanvas.height = gGameWidth;
                isPhoneVer=true;
            }else{
                gamecanvas.width = gGameWidth;
                gamecanvas.height = gGameHeight;

                gLoadAssets.scrollbar.setX(0);
            }
            gLoadAssets.orgRunSp.x = gGameWidth - 130 - gLoadAssets.textInfoFontHeight; //130 150为图片大小直接外部取值了
            gLoadAssets.orgRunSp.y = gGameHeight - 150 - gLoadAssets.textInfoRightOff - gLoadAssets.textInfoFontHeight;
            gLoadAssets.scrollbar.setY(gGameHeight - 10);//10为imgheight
        }else{//横屏
            isPhone = newHeight > newWidth;
            roated=false;
            if(isPhone){
                gamecanvas.width = gGameHeight;
                gamecanvas.height = gGameWidth;
            }else{
                gamecanvas.width = gGameWidth;
                gamecanvas.height = gGameHeight;
            }
            gLoadAssets.orgRunSp.x = gGameWidth - 130 - gLoadAssets.textInfoFontHeight; //130 150为图片大小直接外部取值了
            gLoadAssets.orgRunSp.y = gGameHeight - 150 - gLoadAssets.textInfoRightOff - gLoadAssets.textInfoFontHeight;
            gLoadAssets.scrollbar.setX(0);
            gLoadAssets.scrollbar.setY(gGameHeight - 10);//10为imgheight
            isVertical=false;
        }

       // gLoadAssets.orgRunSp.x = 0; //130 150为图片大小直接外部取值了
       // gLoadAssets.orgRunSp.y = 0;
        resizeGame();

    }
    //load场景后加载
    this.firstLoad = function(){
        var t1 = new Date().getTime() ;
        //文字显示
        this.textInfoSp.visible = true ;
        if(quality==32)
        {
            //downingText = "加载 高清 游戏数据中......";
        }
        else if(quality==31)
        {
            //downingText = "加载 低清 游戏数据中......";
        }
        else if(quality==25)
        {
            //downingText = "加载 索引 游戏数据中......";
        }
        else
        {
            //downingText = "加载 原画 游戏数据中......";
        }

        //downingText = "正在加载游戏数据文件 data/game.bin";
        /*g.save();
        g.font = 22 + "px " +fontName;
        this.textInfoWidth = g.measureText(downingText).width;
        g.restore();*/

        //this.textInfoSp.drawText(downingText,gGameWidth - this.textInfoWidth - this.textInfoRightOff,gGameHeight - this.textInfoBottomOff);
        //return ;
        var url ;
        //console.log(fileList["data/game00.bin"]);
        if(fileList["game00.bin"])
        {
            //console.log("走的新版本");
            isNew=true;
            //url=fileList[guid+"/"+ver+"/game00.bin"].url();
            url=fileList["game00.bin"].url();
        }
        else
        {
            var newVer = GetQueryString("newVer");
            if(newVer){
                //url="http://testcdn.66rpg.com/web/"+ver+"/"+guid+"/game.bin";
                url=fileList["data/game.bin"].url();
                url = url.replace("http://dlcdn1.cgyouxi.com/",M_WC_SERVER_URL);
                //var urlguid = url.substr(url.length-32,32);
                //url = "http://testcdn.66rpg.com/"+ver+"/"+urlguid;
            }else{
                url=fileList["data/game.bin"].url();
                allFlow+=parseInt(fileList["data/game.bin"].fileSize);
                allFileNum+=1;
                submitAllFlow();
            }
        }
        //console.log("the start game bin url is "+url);
        // url = "http://test.66rpg.com/gamebin/Game00.bin" ;
        gLoadAssets.setDrawText(dataTipsList.gameData);
        var rd = new ORead(url,function(read){
            gLoadAssets.setDrawText(dataTipsList.parseData);
            var gamecanvas = document.getElementById("main_canvas");
            if(read.readCString(6) == "ORGDAT"){
                var a = new Date().getTime() ;
                tv.data = new DMain(read);
                //test_size = tv.data.System.FontSize;
                tv.inter = new IMain();
                gLoadAssets.setDrawText(dataTipsList.fontData);
                bitmapFont.init(function () {
                    tv.canvas = new CMain();
                    gGameHeight=parseInt(tv.data.Headr.GHeight);
                    gGameWidth=parseInt(tv.data.Headr.GWidth);
                    var newWidth = window.innerWidth;
                    var newHeight = window.innerHeight;
                    pos_story = tv.data.System.StartStoryId;
                    pos_index = 0;
                    //预加载标题画面
                    //预加载标题画面
                    if(!tv.data.System.SkipTitle){

                        var data = tv.data.System.Title;
                        addTask("Graphics/UI/" + data.logoImage);
                        addTask("Graphics/Background/" + data.titleImagle);
                        for (var i = 0; i < data.buttons.length; ++i) {
                            var d = tv.data.System.Buttons[data.buttons[i].index];
                            addTask("Graphics/Button/" + d.image1);
                            addTask("Graphics/Button/" + d.image2);
                        }
                    }

                    curBarValue = 30;//0427 bar
                    //加载资源列表
                    if (tv.data.getStory(pos_story)==null)
                    {
                        tv.data.loadStory(pos_story , function(){
                            var data = tv.data.getStory(pos_story);
                            pic_load(data) ;
                        });
                    }
                    else{
                        var data = tv.data.getStory(pos_story);
                        pic_load(data) ;
                    }
                    var saveFileNum = tv.data.System.SaveData.max;
                    if(saveFileNum>0&&operationCloud.getUid()){
                        for(var i = 0;i<parseInt(saveFileNum);i++){
                            var a=window.localStorage.getItem("orgsave"+ guid + i+'|'+operationCloud.getUid());
                            if(a){
                                //这个用户已经有新的存档了，不需要将匿名档位通过来
                                isMoveDaveFile = true;
                            }
                        }
                        for(var i = 0;i<parseInt(saveFileNum);i++){
                            oldMoveNewData(i);
                        }
                    }
                });
            }
        });
        curBarValue = 10;
    };



    //场景中加载
    this.gameSceneLoad = function(){
        //文字显示
        this.textInfoSp.visible = true;
        //downingText = "游戏场景预加载";

        //加载资源列表
        //pic_load();

        if (tv.data.getStory(pos_story)==null)
        {
            tv.data.loadStory(pos_story , function(){
                var data = tv.data.getStory(pos_story);
                pic_load(data) ;
            })
        }
        else{
            var data = tv.data.getStory(pos_story);
            pic_load(data) ;
        }


    }

    //SCUI场景加载
    this.scuiSceneLoad = function(){
        //文字显示
        this.textInfoSp.visible = true;
        //downingText = "高级ui资源预加载";

        //加载ui
        scui_load();
    }
    //外部设置drawtexs
    this.setDrawText = function (str) {
        downingText = str;
        this.drawTextInfo(str);
    }
    this.getDataTipsList = function () {
        return dataTipsList;
    }
    //其它场景UI加载
    this.otherUILoad = function(){
        //文字显示
        this.textInfoSp.visible = true;
        //downingText = "UI预加载";

        //加载ui
        otherUI_load();
    }
    var tempFrame = 0;
    this.update = function(){
        //初始化
        if(!this.bInit){
            this.bInit = true;
            this.init();
        }

        //插入flash广告
        if(mark == "isFlash"){
            if(!cAdvert.adEnd) {
                cAdvert.update(function () {
                    // 1028*720的游戏画面切换
                    if(mark == "isFlash") {
                        changeSence();
                    }
                    //广告加载完后回调
                    gLoadAssets.bInit = false;
                    gLoadAssets.bloadAssets = false;
                    if (tv.data.System.SkipTitle) {
                        var data = tv.data.getStory(tv.data.System.StartStoryId);
                        if (data) {
                            tv.inter.jumpStory(tv.data.System.StartStoryId);
                            tv.scene = new SGame();
                        } else {
                            tv.data.loadStory(tv.data.System.StartStoryId, function () {
                                tv.inter.jumpStory(tv.data.System.StartStoryId);
                                tv.scene = new SGame();
                            });
                        }
                        //tv.inter.jumpStory(tv.data.System.StartStoryId);
                        //tv.scene = new SGame();
                    } else {
                        tv.scene = new STitle(true);
                    }
                });
            }
        }


        //加载完毕
        if(this.backSceneCountdown >= 0){
            this.backSceneCountdown -= 1;
            if(this.backSceneCountdown == 0){
                this.endScene();
            }
            return;
        }
        //loading信息显示
        //if(tv.data != null){
            g.save();
            //g.font = tv.data.System.FontSize + "px " +fontName;
            g.font = 22 + "px " +fontName;
            this.textInfoWidth = g.measureText(downingText).width+24;
            g.restore();
        //}
        if(this.orgRunSp != null)
        {
            if(this.fpsCount % this.imgChangeFps == 0){

                if(this.curRunSpimgIndex % 2 == 0){
                    this.orgRunSp.setBitmap(this.orgRunimg1);
                }else{
                    this.orgRunSp.setBitmap(this.orgRunimg2);
                }
                //切帧
                this.curRunSpimgIndex += 1;
                if (this.curRunSpimgIndex == 2) {
                    this.curRunSpimgIndex = 0;
                }
            }
            this.fpsCount += 1;
        }
        //console.log( this.fpsCount);
        if(this.fpsCount%5 ==0){
            tempFrame++;
        }
        var tempTxt = downingText;
        var temp = "......";
        temp = temp.substr(0,tempFrame);
        tempTxt = tempTxt+temp;
        if(tempFrame == 6){
            tempFrame = 1;
        }
        this.drawTextInfo(tempTxt);

        //0427 bar
        //console.log(curBarValue);
        if(this.scrollbar != null){
            this.scrollbar.setValue(curBarValue,maxBarValue);
            this.scrollbar.moveBar();
        }

        if(tv.data == null){return;}
    }
    this.drawTextInfo = function (tempTxt) {
        if(!this.textInfoSp){
            return;
        }
        g.save();
        //g.font = tv.data.System.FontSize + "px " +fontName;
        g.font = 22 + "px " +fontName;
        this.textInfoWidth = g.measureText(downingText).width+24;
        g.restore();
        this.textInfoSp.fontSize =22;
        
        if(isupdate){
            this.backSceneCountdown = 5;
            this.textInfoSp.drawText(tempTxt,gGameWidth - this.textInfoWidth - this.textInfoRightOff, - this.textInfoBottomOff,true);
            this.textInfoSp.loadText = false;
        }else{
            this.textInfoSp.drawText(tempTxt,gGameWidth - this.textInfoWidth - this.textInfoRightOff,gGameHeight - this.textInfoBottomOff,true);
        }

    }
    this.endScene = function(){
        //flash天使会员广告
        if(mark =="isFlash"){
            if(parseInt(publicUses.getUserInfo().vip_level) ==1&&parseInt(publicUses.getUserInfo().screen_game_ad) == 1){
                if(cAdvert.angQx){
                    cAdvert.dispose();
                }
            }else{
                if((cAdvert.iNum < cAdvert.sec*FPS)||!cAdvert.isAdAjax){
                    cAdvert.waitAd = true;
                    isupdate = false;
                    this.dispose();
                    this.fpsCount = 0;
                    //0427 bar
                    curBarValue = 0;
                    baseBarValue = 0;
                    fulltasknum = 0;
                    return;
                }
            }
        }
        //告知web 可以给我信息了
        if(mark == "isFlash"){
            //告知web给我方法
            //window.parent.asUserOperate.loadComplete();
        }
        // 1028*720的游戏画面切换
        if(mark == "isFlash") {
            changeSence();
        }

        //数据还原
        isupdate = false;
        this.bInit = false;
        this.bloadAssets = false;
        this.dispose();
        this.fpsCount = 0;

        //0427 bar
        curBarValue = 0;
        baseBarValue = 0;
        fulltasknum = 0;

        //场景切换
        if(this.curLoadScene.length > 0){
            tv.scene.init();
            //清除标志
            this.curLoadScene = "";
        }else{
            if(tv.scene instanceof SLoad){
                if(tv.data.System.SkipTitle){
                    var data=tv.data.getStory(tv.data.System.StartStoryId);
                    if(data){
                        tv.inter.jumpStory(tv.data.System.StartStoryId);
                        tv.scene = new SGame();
                    }
                    else
                    {
                        tv.data.loadStory(tv.data.System.StartStoryId, function(){
                            tv.inter.jumpStory(tv.data.System.StartStoryId);
                            tv.scene = new SGame();
                        }) ;
                    }
                    //tv.inter.jumpStory(tv.data.System.StartStoryId);
                    //tv.scene = new SGame();
                }else{
                    tv.scene = new STitle(true);
                }
            }
        }
    }

    this.dispose = function(){
        this.orgRunSp.dispose();
        this.orgRunSp = null;
        this.orgRunimg1 = null;
        this.orgRunimg2 = null;
        this.textInfoSp.dispose();
        this.textInfoSp = null;
        if(this.scrollbar != null){
            this.scrollbar.disPose();
            this.scrollbar = null;
        }
    }


    var listStrImg=new Array();
    var childStrImg=new Array();
    //-----------------------------加载相关--------------------------------
    //资源列表
    pic_load = function(dataAll){
        gLoadAssets.setDrawText(dataTipsList.ImgData);
        while(true){
            var data=dataAll.events[pos_index];
            pos_index++;
            if(data == null){//0312 防止data数据为空引发游戏卡加载处不动
                console.error("LoadAssets:pic_load<<data is null :",pos_index);
                break;
            }
            //预加载图片
            if(data.Code == 400){
                //console.log(data);
                var userString = false;
                if(data.Argv.length > 11){
                    userString = data.Argv[11] == "1";
                }else{
                    userString = false;
                }
                if(userString){
                    if(data.Argv[12]){
                        if(listStrImg.indexOf(data.Argv[12]) == -1){
                            listStrImg.push(data.Argv[12]);
                        }
                    }
                }else{
                    addTask("Graphics/" + data.Argv[1]);
                    addTaskImgTemp("Graphics/" + data.Argv[1]);
                }
            }
            //预加载头像
            if(data.Code == 100){
                if(data.Argv[3].length > 0){
                    addTask("Graphics/Face/" + data.Argv[3]);
                    addFaceImg("Graphics/Face/" + data.Argv[3])
                }
                if(data.Argv[16]){
                    var msgArr=data.Argv[16].split('|');//背景图更换开关，背景图 | 是否自定义XY，X，Y | 强调说话人开关，图层编号，类型 | 双重对话，上或下，点后是否消失
                    //目前支持临时更换背景图，更改xy坐标
                    var back=msgArr[0].split(',');
                    if(back[0]==1) {
                        addTask("Graphics/UI/" + back[1]);
                    }
                }
            }
            //预加载底图
            if(data.Code == 1011){
                var ChoiceArraySize = data.Argv[0] ;
                var argIndex = {};
                var isOpenBimg = (data.Argv[9]=="1");//是否开启背景图片
                var path = isOpenBimg ? data.Argv[10]:"";
                path="Graphics/UI/"+path;
                var isDiyeve = (data.Argv[14]=="1");//是否开启每项自定义
                if(isDiyeve){
                    for(var i = 0 ; i < ChoiceArraySize ;++i){
                        if(data.Argv[17+i*3]){
                            argIndex[i] = data.Argv[17+i*3].split(',')[0]; // 17 20
                            var d = tv.data.System.Buttons[argIndex[i]];
                            addTask("Graphics/Button/" + d.image1);
                            addTask("Graphics/Button/" + d.image2);
                        }
                    }
                }

                addTask(path);
                addFaceImg(path)
            }
            //预加载生命线
            if(data.Code == 219){
                var path = data.Argv[4] ? data.Argv[4]:"";
                if(path!=""){
                    path="Graphics/UI/"+path;
                    addTask(path);
                    //for(var i=0;i<pic_task.length;i++){
                    //    console.log(pic_task[i].path,pic_task[i].name);
                    //}
                }
            }
            //预加载容错图
            if(data.Code == 406){
               //  console.log(data.Argv);
                if(data.Argv[1].indexOf(".oaf")>-1){
                    var path = ("Graphics/"+data.Argv[1]+"x").toLowerCase();
                    if(fileList[path]){
                        //var url =fileList[path].url();
                        //console.log(path,url);
                        addTask(path);
                        /*var rd = new ORead(url,function(read){
                            DAnimateData(read);
                        });*/
                    }else{
                        if(data.Argv[13]){
                            if((data.Argv[13].indexOf(".jpg")> -1 || data.Argv[13].indexOf(".png")>-1)){
                                if(data.Argv[13].toLowerCase().indexOf('graphics/') !== -1){
                                    data.Argv[13]= data.Argv[13].substring(9);
                                }
                                addTask(data.Argv[13]);
                            }
                        }
                    }
                }
            }
            if( data.Code == 600 ){
                videoLoadEnd = false;
                //var videoPath = fileListFato(("graphics/"+data.Argv[0]).toLowerCase(),"IStartVideo");
                var videoPath = "graphics/"+data.Argv[0];
                //videoObj['' + videoPath] = videoPath;
                addTask(videoPath);
            }

            ////预加载预加载图
            //if(data.Code == 405){
            //    if(data){
            //        otherUI="beforeLoadImg"
            //        this.otherUILoad();
            //    }
            //}

            //预加载按钮
            if(data.Code == 204){
                var buttons = new Array();
                for(var i = 0;i<data.Argv.length;i++){
                    var s = data.Argv[i].split(",");
                    var dbi = new DButtonIndex(s);
                    var d = tv.data.System.Buttons[dbi.index];
                    addTask("Graphics/Button/" + d.image1);
                    addTask("Graphics/Button/" + d.image2);
                }
            }

            //呼叫子剧情
            if(data.Code == 251){
                var childStory=tv.data.getStory(data.Argv[0]);
                childPicLoad(childStory);
            }
            //呼叫游戏界面(高级ui)
            if(data.Code == 214){
                scui_load();
            }
            /*
             if(data.Code == 206){//0204 会有死循环
             pos_story = parseInt(data.Argv[0]);
             pos_index = 0;
             }
             */

            if(pic_task.length >= 20){
                pos_index-=1;
                break;
            }
            if(pos_index > dataAll.events.length - 1){
                break;
            }
        }

        for(var i=0;i<dataAll.events.length;i++){
            var data=dataAll.events[i];
            if(data.Code==215){
                if(listStrImg.indexOf(data.Argv[0])){
                    //使用字符串指定图片
                    //console.log(data.Argv);
                    var path="Graphics/Other/"+data.Argv[1];
                    path = path.replace("//", "/");
                    path = path.replace("\\\\", "/");
                    path = path.replace("\\", "/");
                    addTask(path);
                }
            }
        }
        //0427 bar
        fulltasknum = pic_task.length;
        baseBarValue = curBarValue;
        down();
    }
    //子剧情加载资源调用的方法
    childPicLoad= function (dataAll) {
        var index=0;
        if(dataAll==null){
            return;
        }
        for(var i=0;i<dataAll.events.length;i++){
            var data=dataAll.events[i];
            index++;
            if(data.Code == 400){
                //console.log(data);
                var userString = false;
                if(data.Argv.length > 11){
                    userString = data.Argv[11] == "1";
                }else{
                    userString = false;
                }
                if(userString){
                    if(data.Argv[12]){
                        if(listStrImg.indexOf(data.Argv[12]) == -1){
                            listStrImg.push(data.Argv[12]);
                        }
                    }
                }else{
                    addTask("Graphics/" + data.Argv[1]);
                }
            }
            if(data.Code == 251){
                var childStory=tv.data.getStory(data.Argv[0]);
                if(!childStory){
                    childPicLoad(childStory);
                }else{
                    break;
                }
            }
            //预加载头像
            if(data.Code == 100){
                if(data.Argv[3].length > 0){
                    addTask("Graphics/Face/" + data.Argv[3]);
                    addFaceImg("Graphics/Face/" + data.Argv[3])
                }
                if(data.Argv[16]){
                    var msgArr=data.Argv[16].split('|');//背景图更换开关，背景图 | 是否自定义XY，X，Y | 强调说话人开关，图层编号，类型 | 双重对话，上或下，点后是否消失
                    //目前支持临时更换背景图，更改xy坐标
                    var back=msgArr[0].split(',');
                    if(back[0]==1) {
                        addTask("Graphics/UI/" + back[1]);
                    }
                }
            }
        }
    }

    //scui资源列表
    var strIndexPath=new Array();
    scui_load = function(){
        var data = tv.data.System.Cuis[tv.CUIFromIndex];
        if(!data){
            return;
        }
        var indexPathArr=new Array();
        var AllNumEvent=new Array();
        for(var i = 0 ; i < data.controls.length;++i){
            var c = data.controls[i];
            switch(c.type){
                case 0: //-按钮
                {
                    var index = c.isUserIndex ? tv.system.vars.getVar(c.index) - 1 : c.index;
                    if(index == -1){
                        index = tv.data.System.Buttons.length - 1;
                    }
                    var db = tv.data.System.Buttons[index];
                    addTask("Graphics/Button/" + db.image1);
                    addTask("Graphics/Button/" + db.image2);
                    break;
                }
                case 3://-图片
                {
                    var str = c.isUserString ? tv.system.string.getVar(c.stringIndex) : c.image1;
                    if(str!=""){
                        var path = "Graphics/Other/" + str;
                        path = path.replace("//", "/");
                        path = path.replace("\\\\", "/");
                        path = path.replace("\\", "/");
                        if(c.isUserString){
                            var obj=new Object();
                            obj.index= c.stringIndex;
                            obj.path=path;
                            indexPathArr.push(obj);
                        }
                        addTask(path);
                    }
                    break;
                }
                case 4://-滚动条
                {
                    addTask("Graphics/Other/" + c.image1);
                    addTask("Graphics/Other/" + c.image2);
                    break;
                }
            }
        }
        scuiEventPic_load(data,indexPathArr,AllNumEvent);
        //0427 bar
        fulltasknum = pic_task.length;
        baseBarValue = curBarValue;

        down();
    }
    //var pathArr=new Array();
    scuiEventPic_load = function(data,indexPathArr,AllNumEvent){
        var pathArr=new Array();
        var isLoad=false;
        /*
         *   取出所有的指定字符串 放到indexPathArr中
         *   取出所有的数值操作事件放到AllNumEvent中
         * */
        for(var i=0;i<data.afterEvent.length;i++){
            var event=data.afterEvent[i];
            if(event.Code==215){
                //console.log(path,"______________afterEvent")
                var path="Graphics/Other/"+event.Argv[1];
                var obj=new Object();
                obj.index= event.Argv[0];
                obj.path=path;
                indexPathArr.push(obj);
            }
            if(event.Code==207){
                AllNumEvent.push(event);
            }
        }
        //console.log(indexPathArr);
        /*
         *
         * 取出所有的有/v[]的path放到pathArr中
         * */
        var firstPath="";
        for(var i in indexPathArr){
            var path=indexPathArr[i].path;
            var reg=/.*(\\v[\d+]*.*)/;
            //var reg=/\/*.*(\*)/;
            var result=reg.exec(path);
            //console.log(result);
            if(result){
                if(firstPath==""){
                    firstPath=path.substring(0,path.length-result[1].length).toLowerCase();
                    //如果用到了other的子文件夹下的内容把这个文件夹下的内容全部加载
                    if(firstPath.split('/').length>3){
                        for(var j in fileList){
                            if(j.indexOf(firstPath)!=-1){
                                //console.log(j);
                                addTask(j);
                            }
                        }
                    }else{//加载other下面包含数字的资源

                    }
                }
                var inPath=path.substring(0,path.length-result[1].length).toLowerCase();
                if(firstPath!=inPath){
                    firstPath=inPath;
                    if(inPath.split('/').length>3){
                        for(var j in fileList){
                            if(j.indexOf(inPath)!=-1){
                                //console.log(j);
                                addTask(j);
                            }
                        }
                    }else{//加载other下面包含数字的资源

                    }
                }
            }else{
                addTask(path);
            }
        }
    }

    otherUI_load = function(){

        var data = null;
        var db = null;
        var tbuttonIndexs = null;

        if(otherUI == "SMenu"){

            data = tv.data.System.GameMenu;
            if(!data.backImage.IsNil()){
                addTask("Graphics/UI/" + data.backImage);
            }

            for(var i = 0 ; i < data.buttons.length;++i){
                db = tv.data.System.Buttons[data.buttons[i].index];
                if(db.image1.IsNil() || db.image2.IsNil()) continue;
                addTask("Graphics/Button/" + db.image1);
                addTask("Graphics/Button/" + db.image2);
            }

        }else if(otherUI == "SReplay"){

            data = tv.data.System.Replay;
            if(!data.backimage.IsNil()){
                addTask("Graphics/UI/" + data.backimage);
            }
            db = tv.data.System.Buttons[data.closeButton.index];
            if(db.image1.IsNil() || db.image2.IsNil()) {

            }else{
                addTask("Graphics/Button/" + db.image1);
                addTask("Graphics/Button/" + db.image2);
            }

        }else if(otherUI == "SSavefile"){
            data = tv.data.System.SaveData;
            addTask("Graphics/Background/" + tv.data.System.Title.titleImagle);
            if(!data.backimage.IsNil()){
                addTask("Graphics/UI/" + data.backimage);
            }

            tbuttonIndexs = new Array(data.closeButton,data.backButton);
            for(var i = 0 ; i < tbuttonIndexs.length ; ++i){
                db = tv.data.System.Buttons[tbuttonIndexs[i].index];
                if(db.image1.IsNil() || db.image2.IsNil()) {

                }else{
                    addTask("Graphics/Button/" + db.image1);
                    //console.log(fileList[("Graphics/Button/" + db.image1).toLowerCase()].url(),"Graphics/Button/" + db.image1);
                    addTask("Graphics/Button/" + db.image2);
                }
            }

        }else if(otherUI == "SSystem"){

            data = tv.data.System.Setting;
            if(!data.backimage.IsNil()){
                addTask("Graphics/UI/" + data.backimage);
            }

            tbuttonIndexs = new Array(data.closeButton,data.TitleButton);
            if(data.SHowAuto){
                tbuttonIndexs.push(data.AutoOn);
                tbuttonIndexs.push(data.AutoOff);
            }
            if(data.ShowFull){
                tbuttonIndexs.push(data.fullButton);
                tbuttonIndexs.push(data.winButton);
            }

            for(var i = 0 ; i < tbuttonIndexs.length ; ++i){
                db = tv.data.System.Buttons[tbuttonIndexs[i].index];
                if(db.image1.IsNil() || db.image2.IsNil()) {

                }else{
                    addTask("Graphics/Button/" + db.image1);
                    addTask("Graphics/Button/" + db.image2);
                }
            }


            if(data.ShowBGM || data.ShowSE || data.ShowVoice){
                if(!data.barNone.IsNil()){
                    addTask("Graphics/UI/" + data.barNone);
                }
                if(!data.barMove.IsNil()){
                    addTask("Graphics/UI/" + data.barMove);
                }
            }

        }else if(otherUI == "SBGM"){
            data = tv.data.System.BGM;
            if(!data.backimage.IsNil()){
                addTask("Graphics/UI/" + data.backimage);
            }

            tbuttonIndexs = new Array(data.closeButton,data.selectButton);
            for(var i = 0 ; i < tbuttonIndexs.length ; ++i){
                db = tv.data.System.Buttons[tbuttonIndexs[i].index];
                if(db.image1.IsNil() || db.image2.IsNil()) {

                }else{
                    addTask("Graphics/Button/" + db.image1);
                    addTask("Graphics/Button/" + db.image2);
                }
            }

        }else if(otherUI == "SCG"){
            data = tv.data.System.CG;
            if(!data.backimage.IsNil()){
                addTask("Graphics/UI/" + data.backimage);
            }
            tbuttonIndexs = new Array(data.closeButton,data.backButton);
            for(var i = 0 ; i < tbuttonIndexs.length ; ++i){
                db = tv.data.System.Buttons[tbuttonIndexs[i].index];
                if(db.image1.IsNil() || db.image2.IsNil()) {

                }else{
                    addTask("Graphics/Button/" + db.image1);
                    addTask("Graphics/Button/" + db.image2);
                }
            }
        }else if(otherUI=="SFloat"){
            var data = tv.data.DFloatButton[tv.CUIFromIndex];
            for(var i = 0 ; i < data.DFloatItem.length;++i) {
                var c = data.DFloatItem[i];
                switch (c.type) {
                    case 0: //图片
                    {
                        var str = c.isUserString ? tv.system.string.getVar(c.stringIndex) : c.image;
                        var path = "Graphics/Other/" + str;
                        path = path.replace("//", "/");
                        path = path.replace("\\\\", "/");
                        addTask(path);
                    }
                }
            }
        }
        //else if(){
        //    var data=tv.data;
        //    var loadArr=data.Argv[0].split('|');
        //    for(var i=0;i<loadArr.length;i++){
        //        if(loadArr[i]){
        //            addTask(loadArr[i]);
        //        }
        //    }
        //}

        //清除标记
        otherUI = "";


        //0427 bar
        fulltasknum = pic_task.length;
        baseBarValue = curBarValue;

        down();
    }

    // ── 并行下载补丁：同时允许 8 个图片下载（原版为串行1个）──
    var _PARALLEL = 8;
    var _activeDown = 0;

    downNext = function(){
        if(fulltasknum > 0){
            curBarValue = curBarValue + parseInt((maxBarValue - baseBarValue) * (1 / fulltasknum));
        }
        _activeDown--;
        down();
    };

    down = function(){
        gLoadAssets.setDrawText(dataTipsList.ImgData);
        while(pic_task.length > 0 && _activeDown < _PARALLEL){
            var t = pic_task.shift();
            _activeDown++;
            (function(task){
                if(task.name.indexOf('.mp4') > -1 || task.name.indexOf('.oafx') > -1){
                    downNext.call();
                    return;
                }
                var img = new Image();
                img.name = task.name;
                img.src  = task.path;
                if(img.complete){
                    downNext.call();
                    return;
                }
                img.onload = function(){
                    // ── 缓存到 preImgArr，使 getImage() 能立即拿到 ──
                    if(sVLoadImg) sVLoadImg.preImgArr[task.name] = this;
                    if(fileList[task.name]){
                        allFlow += parseInt(fileList[task.name].fileSize);
                    }
                    allFileNum += 1;
                    submitAllFlow();
                    downNext.call();
                };
                img.onerror = function(){
                    downNext.call();
                };
            })(t);
        }
        if(pic_task.length === 0 && _activeDown === 0){
            curBarValue = maxBarValue;
            isupdate = true;
        }
    };

    //任务队列
    addTask = function(p){
        if (!p) {
            return;
        }
        p = intPath(p);
        var fd = fileList[p.toLowerCase()];
        if (fd != null) {
            var path = fd.url();
            var t = new task();
            t.path = path;
            t.name = p.toLowerCase();
            var isAdd = true;
            for (var i = 0; i < pic_task.length; i++) {
                if (pic_task[i].name == t.name) {
                    isAdd = false;
                    break;
                }
            }
            if (isAdd) {
                if(t.name.indexOf('.mp4') > -1){
                    if($(".videos").length>0){
                        var  pushItFlg = false;
                        $(".videos").each(function(){
                            if(this.src == t.path){
                                //1 2 3 ----3  不插
                                pushItFlg = true;
                            }
                        });
                        if(!pushItFlg){
                            pic_task.push(t);
                        }
                    }else{
                        pic_task.push(t);
                    }
                }else{
                    //非视频
                    pic_task.push(t);
                }
            }
        }
    }

    function addFaceImg(p){
        if (!p) {
            return;
        }
        p = intPath(p);
        var fd = fileList[p.toLowerCase()];
        if (fd != null) {
            var path = fd.url();
            var t = new task();
            t.path = path;
            t.name = p.toLowerCase();
            var isAdd = true;
            for (var i = 0; i < face_task.length; i++) {
                if (face_task[i].name == t.name) {
                    isAdd = false;
                    break;
                }
            }
            if (isAdd) {
                face_task.push(t);
                var img = new Image();
                img.src = t.path;
                faceImageArr.push(img);
            }
        }
    }
}


//由于图片加载速度慢，这里做缓存处理(一次性缓存50张图片)
//任务队列
addTaskImgTemp = function(p){
    if(!p){
        return;
    }
    var fd = fileList[p.toLowerCase()];
    if(fd != null){
        var path = fd.url();
        var t = new task();
        t.path = path;
        t.name = p.toLowerCase();
        var isAdd=true;
        for(var i=0;i<imgTemp.length;i++){
            if(imgTemp[i].name==t.name){
                isAdd=false;
                break;
            }
        }
        if(imgTemp.length>50){
            return;
        }
        if(isAdd&&t!=null&&t!=""){
            var img = new Image();
            img.name = t.name;
            img.src = t.path;
            img.onload =function(){
                imgTemp.push(img);
            }
        }
    }
}

function task(){
    this.path = "";
    this.name = "";
}
function intPath(path){
    path = path.toLowerCase().replace(/\\/g,'/');
    path = path.replace(/\/\//g,'/');
    return path;
}

