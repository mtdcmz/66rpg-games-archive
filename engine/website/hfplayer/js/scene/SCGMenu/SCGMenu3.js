/**
 * Created by heshang on 2016/2/17.
 */
var CGLogin=null;
var userInfo=new Array();
/*
 * 橙光菜单* -------------------------*
 * */
function SCGMenu3(callBack){
    var self = this;
    this.isCmdClose=false;
    var imgArr=new Array();
    var imgPathHead=M_IMG_SERVER_URL+"hfplayer/img/";
    var wait;
    var isExit = false;
    var back;
    var headIcon;
    var buttons=new Array(),
        sprites=new Array();
    var imageVer = "20170519001";

    var parent_op;

    var zbase = 6004;

    var btnAgree,btnKeep,btnConcern;
    var spKeep,spArgee;

    var viewportArr = new Array();
    var initOk = false;
    this.isNeedSendFlower="SCGMENU";
    var types = new Array("btnAgree","btnBack","btnConcern","btnExit","btnKeep","btnMore","btnMoreGame","btnSend","btnShare");
    if(isVertical){
        var ov_x=63,
            ov_y=22,
            ov_w=745,
            ov_h=508;
    }else{
        //var ov_x=320,
        var ov_x=65,
            ov_y=7,
            ov_w=745,
            ov_h=508,
            test_x_spArgee = 325,
            test_x_spKeep= 165;
    }
    //800 600 游戏添加
    if(gGameWidth == 800&&gGameHeight == 600){
        var ov_x=0,
            ov_y=7,
            ov_w=745,
            ov_h=508,
            test_x_spArgee = 260,
            test_x_spKeep = 100;
    }

    this.loadNeedImg= function () {
        var self=this;
        var imgList;
        //$("#hScreen")[0].src = "http://m.66rpg.com/redirect/start?gameScreen=true&plat=h5";
        //$("#vScreen")[0].src = "http://m.66rpg.com/redirect/start?plat=h5";
        //加载橙光菜单用的图片资源
        /*
        * src:路径
        * type:默认不写代表游戏内部资源，1代表外部
        * */
        imgList=[
            {"name":"btnAgree","src":imgPathHead+"cgMenu1/btnAgree.png?v="+imageVer,type:1},
            {"name":"btnAgreeOk","src":imgPathHead+"cgMenu1/btnAgreeOk.png?v="+imageVer,type:1},
            {"name":"btnBack","src":imgPathHead+"cgMenu1/btnBack.png?v="+imageVer,type:1},
            {"name":"btnBack1","src":imgPathHead+"cgMenu1/btnBack1.png?v="+imageVer,type:1},
            {"name":"btnConcern","src":imgPathHead+"cgMenu1/btnConcern.png?v="+imageVer,type:1},
            {"name":"btnConcern1","src":imgPathHead+"cgMenu1/btnConcern1.png?v="+imageVer,type:1},
            {"name":"btnConcernOk","src":imgPathHead+"cgMenu1/btnConcernOk.png?v="+imageVer,type:1},
            {"name":"btnExit","src":imgPathHead+"cgMenu1/btnExit.png?v="+imageVer,type:1},
            {"name":"btnExit1","src":imgPathHead+"cgMenu1/btnExit1.png?v="+imageVer,type:1},
            {"name":"btnKeep","src":imgPathHead+"cgMenu1/btnKeep.png?v="+imageVer,type:1},
            {"name":"btnKeepOk","src":imgPathHead+"cgMenu1/btnKeepOk.png?v="+imageVer,type:1},
            {"name":"btnMore","src":imgPathHead+"cgMenu1/btnMore.png?v="+imageVer,type:1},
            {"name":"btnMoreGame","src":imgPathHead+"cgMenu1/btnMoreGame.png?v="+imageVer,type:1},
            {"name":"btnMoreGame1","src":imgPathHead+"cgMenu1/btnMoreGame1.png?v="+imageVer,type:1},
            {"name":"btnComment","src":imgPathHead+"cgMenu1/btnComment.png?v="+imageVer,type:1},
            {"name":"btnComment1","src":imgPathHead+"cgMenu1/btnComment1.png?v="+imageVer,type:1},
            {"name":"btnSend","src":imgPathHead+"cgMenu1/btnSend.png?v="+imageVer,type:1},
            {"name":"btnSend1","src":imgPathHead+"cgMenu1/btnSend1.png?v="+imageVer,type:1},
            {"name":"btnShare","src":imgPathHead+"cgMenu1/btnShare.png?v="+imageVer,type:1},
            {"name":"btnShare1","src":imgPathHead+"cgMenu1/btnShare1.png?v="+imageVer,type:1},
            {"name":"loading","src":imgPathHead+"cgMenu1/loading.png?v="+imageVer,type:1}
        ];
        if(mark == "isFlash"){
            imgList.push({"name":"btnScrFull","src":imgPathHead+"cgMenu1/screenFull.png?v="+imageVer,type:1});
            imgList.push({"name":"btnScrFull1","src":imgPathHead+"cgMenu1/screenFull1.png?v="+imageVer,type:1});
            imgList.push({"name":"btnScrQuit","src":imgPathHead+"cgMenu1/screenQuit.png?v="+imageVer,type:1});
            imgList.push({"name":"btnScrQuit1","src":imgPathHead+"cgMenu1/screenQuit1.png?v="+imageVer,type:1});
            if(isVertical){
                imgList.push( {"name":"backgroundV","src":imgPathHead+"cgMenu1/backgroundV_web.png?v="+imageVer,type:1});
            }else{
                imgList.push( {"name":"background","src":imgPathHead+"cgMenu1/background_web.png?v="+imageVer,type:1});
            }
        }else{
            if(isVertical){
                imgList.push( {"name":"backgroundV","src":imgPathHead+"cgMenu1/backgroundV.png?v="+imageVer,type:1});
            }else{
                imgList.push( {"name":"background","src":imgPathHead+"cgMenu1/background.png?v="+imageVer,type:1});
            }
        }
        this.init(imgList);
    }
    this.init = function(imgList){
        if(isVertical){
            parent_op = new OViewport(ov_x,ov_y,ov_w+50,(ov_h+2)*2);
        }else{
            parent_op = new OViewport(ov_x,ov_y,ov_w+ov_x,ov_h);
        }
        viewportArr.push(parent_op);
        function getInitState(callBack){
            if(typeof window.org_box == 'undefined'){
                sLoading.hideMask();
            }else{
                serverAjax.get_gameInfo(function () {
                    imgList.push(  {"name":"gameIcon","src":img_src,type:1});
                    sVLoadImg.loadImgData(imgList, function (arr) {
                        imgArr = arr;
                        self.createGameInfo();
                        self.createMenuBack(function () {
                            self.isCmdClose = true;
                        });
                        self.createMenuButton();
                        //self.createMenuUserInfo(userInfo);
                        self.changeInitState();
                        initOk = true;
                        callBack && callBack();
                    });
                });
                return;
                //var a=window.org_box.GetLoginStatus();
                //if(a){
                //    window.org_box.newMenuSendFlower(!isVertical,gIndex);
                //}else{
                //    window.org_box.isLandscape(!isVertical,gIndex);
                //}
            }
            if(publicUses.keepState == 0 && publicUses.argeeState == 0 && publicUses.concernState == 0){
                sLoading.showMask();
                serverAjax.get_gameInfo(function () {
                    imgList.push(  {"name":"gameIcon","src":img_src,type:1});
                    publicUses.p_ComArgee(gIndex, function (data) {
                        publicUses.p_ComKeep(gIndex, function (data) {
                            publicUses.p_ComConcern(serverAjax.gameInfo.game.author_uid,function(data){
                                sLoading.hideMask();
                                sVLoadImg.loadImgData(imgList,function(arr){
                                    imgArr=arr;
                                    self.createGameInfo();
                                    self.createMenuBack(function(){
                                        self.isCmdClose=true;
                                    });
                                    self.createMenuButton();
                                    //self.createMenuUserInfo(userInfo);
                                    self.changeInitState();
                                    initOk = true;
                                    callBack&&callBack();
                                });
                            });
                        });
                    });
                });
            }else{
                serverAjax.get_gameInfo(function () {
                    imgList.push({"name": "gameIcon", "src": img_src, type: 1});
                    sVLoadImg.loadImgData(imgList, function (arr) {
                        imgArr = arr;
                        self.createGameInfo();
                        self.createMenuBack(function () {
                            self.isCmdClose = true;
                        });
                        self.createMenuButton();
                        //self.createMenuUserInfo(userInfo);
                        self.changeInitState();
                        initOk = true;
                        callBack && callBack();
                    });
                });
            }
        }
        if(publicUses.ArgeeNum!=null){//是否获取到了游戏信息
            getInitState();
        }else{
            //serverAjax.get_gameInfo(function (data) {
                publicUses.p_GetArgeeNum(gIndex, function (data) {
                    if(data.data){
                        publicUses.ArgeeNum=parseInt(data.data);
                    }else{
                        publicUses.ArgeeNum=0;
                    }
                    getInitState();
                });
            //});
        }
    }
    this.createMenuBack = function (callSuc) {
        //创建背景 三角 等
        //if(isVertical){
            //var back=new OSprite(imgArr["background"],one_op);
            //sprites.push(back);
        //}else{
        try{
            if(isVertical){
                var op = new OViewport(parent_op.x,parent_op.y,313+35,176+22);
                if(imgArr["gameIcon"]){
                    var gameIcon = new OSprite(imgArr["gameIcon"],op);
                    gameIcon.x = 35;
                    gameIcon.y = 22;
                    gameIcon.setZ(zbase);
                    gameIcon.zoom_x = gameIcon.zoom_y = 313/imgArr["gameIcon"].width;
                }
                back=new OSprite(imgArr["backgroundV"],parent_op);
                back.setZ(zbase);
            }else{
                var op = new OViewport(parent_op.x,parent_op.y,parent_op.width,176+44);
                if(imgArr["gameIcon"]){
                    var gameIcon = new OSprite(imgArr["gameIcon"],op);
                    gameIcon.x = ov_x+41;
                    gameIcon.y = parent_op.y+34;
                    gameIcon.setZ(zbase);
                    gameIcon.zoom_x = gameIcon.zoom_y = 313/imgArr["gameIcon"].width;
                }
                back=new OSprite(imgArr["background"],parent_op);
                back.x = ov_x;
                back.y = parent_op.y;
                back.setZ(zbase);
            }
            viewportArr.push(op);
            sprites.push(gameIcon);
            sprites.push(back);
            //sprites.push(back);

            //}
            if(callSuc){
                callSuc();
            }
        }catch(e){
            console.log(e);
        }
    }

    this.createMenuButton = function () {
        //更新日志，分享游戏，更多游戏，制作工具，游戏首页，返回游戏
        if(isVertical){
            /*
            * 创建竖屏的按钮
            * */
            //菜单按钮
            btnConcern = new OButton(imgArr["btnConcern"],imgArr["btnConcern1"],"",parent_op,null);
            btnConcern.setX(262);
            btnConcern.setY(288);
            btnConcern.setZ(zbase+1);
            btnConcern.tag = types[2];
            buttons.push(btnConcern);

            //查看更多
            var btnMore = new OButton(imgArr["btnMore"],imgArr["btnMore"],"",parent_op,null);
            btnMore.setX(36);
            btnMore.setY(654);
            btnMore.setZ(zbase+1);
            btnMore.tag = types[5];
            buttons.push(btnMore);

            //收藏按钮
            btnKeep = new OButton(imgArr["btnKeep"],imgArr["btnKeep"],"",parent_op,null);
            btnKeep.setX(36);
            btnKeep.setY(340);
            btnKeep.setZ(zbase+1);
            btnKeep.tag = types[4];
            buttons.push(btnKeep);
            //点赞按钮
            btnAgree = new OButton(imgArr["btnAgree"],imgArr["btnAgree"],"",parent_op,null);
            btnAgree.setX(192);
            btnAgree.setY(340);
            btnAgree.setZ(zbase+1);
            btnAgree.tag = types[0];
            buttons.push(btnAgree);
            //更多游戏
            var btnMoreGame = new OButton(imgArr["btnComment"],imgArr["btnComment1"],"",parent_op,null);
            btnMoreGame.setX(36);
            btnMoreGame.setY(717);
            btnMoreGame.setZ(zbase+1);
            btnMoreGame.tag = types[6];
            buttons.push(btnMoreGame);
            //分享游戏
            var btnShare = new OButton(imgArr["btnShare"],imgArr["btnShare1"],"",parent_op,null);
            btnShare.setX(200);
            btnShare.setY(717);
            btnShare.setZ(zbase+1);
            btnShare.tag = types[8];
            buttons.push(btnShare);

            //打赏按钮
            var btnSend = new OButton(imgArr["btnSend"],imgArr["btnSend1"],"",parent_op,null);
            btnSend.setX(36);
            btnSend.setY(408);
            btnSend.setZ(zbase+1);
            btnSend.tag = types[7];
            buttons.push(btnSend);


            //flash--全屏/退出全屏    H5--退出游戏
            if(mark == "isFlash"){
                //全屏---退出全屏
                var ScreenBtn = "";
                if(window.parent.asUserOperate.windowChange()){
                    //全屏
                    ScreenBtn = "btnScrQuit";
                }else{
                    //退出全屏
                    ScreenBtn = "btnScrFull";
                }
                var btnExit = new OButton(imgArr[ScreenBtn],imgArr[ScreenBtn+'1'],"",parent_op,null);
                btnExit.setX(36);
                btnExit.setY(787);
                btnExit.setZ(zbase+1);
                btnExit.tag = types[3];
                buttons.push(btnExit);
            }else{
                //退出游戏
                var btnExit = new OButton(imgArr["btnExit"],imgArr["btnExit1"],"",parent_op,null);
                btnExit.setX(36);
                btnExit.setY(787);
                btnExit.setZ(zbase+1);
                btnExit.tag = types[3];
                buttons.push(btnExit);
            }

            //返回游戏
            var btnBack = new OButton(imgArr["btnBack"],imgArr["btnBack1"],"",parent_op,null);
            btnBack.setX(200);
            btnBack.setY(787);
            btnBack.setZ(zbase+1);
            btnBack.tag = types[1];
            buttons.push(btnBack);

            spArgee = new OSprite();
            var str = publicUses.ArgeeNum;
            if(str.toString().length > 6){
                str =  parseInt(publicUses.ArgeeNum/10000)+"万";
            }
            spArgee.drawLineTxt(str,0,0,"#ffffff",20);
            spArgee.x = 325;
            spArgee.y = 375;
            sprites.push(spArgee);
            spKeep = new OSprite();
            var str = gamefv_times;
            if(str.toString().length > 6){
                str =  parseInt(gamefv_times/10000)+"万";
            }
            spKeep.drawLineTxt(str,0,0,"#ffffff",20);
            spKeep.x = 165;
            spKeep.y = 375;
            sprites.push(spKeep);
        }else{
            /*
             * 创建横屏的按钮
             * */
            //var types = new Array("btnAgree","btnBack","btnConcern","btnExit","btnKeep","btnMore","btnMoreGame","btnSend","btnShare");
            //关注按钮              ( 0           1           2          3          4         5           6           7          8   )
            btnConcern = new OButton(imgArr["btnConcern"],imgArr["btnConcern1"],"",parent_op,null);
            btnConcern.setX(ov_x+267);
            btnConcern.setY(parent_op.y+291);
            btnConcern.setZ(zbase+1);
            btnConcern.tag = types[2];
            buttons.push(btnConcern);
            //查看更多
            var btnMore = new OButton(imgArr["btnMore"],imgArr["btnMore"],"",parent_op,null);
            btnMore.setX(ov_x+375);
            btnMore.setY(parent_op.y+283);
            btnMore.setZ(zbase+1);
            btnMore.tag = types[5];
            buttons.push(btnMore);

            //收藏按钮
            btnKeep = new OButton(imgArr["btnKeep"],imgArr["btnKeep"],"",parent_op,null);
            btnKeep.setX(ov_x+40);
            btnKeep.setY(parent_op.y+342);
            btnKeep.setZ(zbase+1);
            btnKeep.tag = types[4];
            buttons.push(btnKeep);
            //点赞按钮
            btnAgree = new OButton(imgArr["btnAgree"],imgArr["btnAgree"],"",parent_op,null);
            btnAgree.setX(ov_x+197);
            btnAgree.setY(parent_op.y+342);
            btnAgree.setZ(zbase+1);
            btnAgree.tag = types[0];
            buttons.push(btnAgree);
            //更多游戏
            var btnMoreGame = new OButton(imgArr["btnComment"],imgArr["btnComment1"],"",parent_op,null);
            btnMoreGame.setX(ov_x+375);
            btnMoreGame.setY(parent_op.y+342);
            btnMoreGame.setZ(zbase+1);
            btnMoreGame.tag = types[6];
            buttons.push(btnMoreGame);
            //分享游戏
            var btnShare = new OButton(imgArr["btnShare"],imgArr["btnShare1"],"",parent_op,null);
            btnShare.setX(ov_x+538);
            btnShare.setY(parent_op.y+342);
            btnShare.setZ(zbase+1);
            btnShare.tag = types[8];
            buttons.push(btnShare);

            //打赏按钮
            var btnSend = new OButton(imgArr["btnSend"],imgArr["btnSend1"],"",parent_op,null);
            btnSend.setX(ov_x+40);
            btnSend.setY(parent_op.y+411);
            btnSend.setZ(zbase+1);
            btnSend.tag = types[7];
            buttons.push(btnSend);

            if(mark == "isFlash"){
                //全屏游戏
                var ScreenBtn = "";
                if(window.parent.asUserOperate.windowChange()){
                    //全屏
                    ScreenBtn = "btnScrQuit";
                }else{
                    //退出全屏
                    ScreenBtn = "btnScrFull";
                }
                var btnExit = new OButton(imgArr[ScreenBtn],imgArr[ScreenBtn+'1'],"",parent_op,null);
                btnExit.setX(ov_x+375);
                btnExit.setY(parent_op.y+411);
                btnExit.setZ(zbase+1);
                btnExit.tag = types[3];
                buttons.push(btnExit);
            }else{
                //退出游戏
                var btnExit = new OButton(imgArr["btnExit"],imgArr["btnExit1"],"",parent_op,null);
                btnExit.setX(ov_x+375);
                btnExit.setY(parent_op.y+411);
                btnExit.setZ(zbase+1);
                btnExit.tag = types[3];
                buttons.push(btnExit);
            }

            //返回游戏
            var btnBack = new OButton(imgArr["btnBack"],imgArr["btnBack1"],"",parent_op,null);
            btnBack.setX(ov_x+538);
            btnBack.setY(parent_op.y+411);
            btnBack.setZ(zbase+1);
            btnBack.tag = types[1];
            buttons.push(btnBack);

            spArgee = new OSprite();
            var str = publicUses.ArgeeNum;
            if(str.toString().length > 6){
                str =  parseInt(publicUses.ArgeeNum/10000)+"万";
            }
            spArgee.drawLineTxt(str,0,0,"#ffffff",20);
            spArgee.x = ov_x + test_x_spArgee;
            spArgee.y = ov_y + 365;
            sprites.push(spArgee);
            spKeep = new OSprite();
            var str = gamefv_times;
            if(str.toString().length > 6){
                str =  parseInt(gamefv_times/10000)+"万";
            }
            spKeep.drawLineTxt(str,0,0,"#ffffff",20);
            spKeep.x = ov_x + test_x_spKeep;
            spKeep.y = ov_y + 365;
            sprites.push(spKeep);
            //菜单按钮
            //for(var i=0;i<6;i++){
            //    var btn=new OButton(imgArr["btn"+(i+1)],imgArr["btn"+(i+1)+"_1"],"",tow_op,false,false);
            //    btn.setY(i*77);
            //    //btn.setX(ov_w);
            //    btn.tag = types[i];
            //    buttons.push(btn);
            //}
        }
    }

    this.createGameInfo = function () {
        if(isVertical){
            var titleOp = new OViewport(41,228,313,56);
            var spTitle = new OSprite(null,titleOp);
            spTitle.x= ov_x;
            var strArray = getStrarr(gameTitle,22,titleOp.width-ov_x,spTitle);
            spTitle.drawUpdateLogList(strArray,0,0,"#ffffff",22,29);
            sprites.push(spTitle);

            var spName = new OSprite(null,parent_op);
            var strArray = getStrarr(serverAjax.gameInfo.game.author_uname,22,150,spName);
            spName.drawUpdateLogList([strArray[0]],0,0,"#cdcdce",20,29);
            //spName.y = ov_y+290;
            spName.x= 35;
            spName.y= 295;
            //btnConcern.setX(ov_x+267);
            //btnConcern.setY(parent_op.y+291);
            spName.setZ(zbase);
            sprites.push(spName);

            var desOp = new OViewport(36,495,311+ov_x,155);
            //游戏简介四个字
            var spDesTitle = new OSprite(null,desOp);
            spDesTitle.x = ov_x;
            spDesTitle.drawLineTxt("作品简介：",0,0,"#ffffff",20);
            sprites.push(spDesTitle);
            //游戏简介内容
            var spDes = new OSprite(null,desOp);
            spDes.x=ov_x;
            spDes.firstX = 100;
            var str;
            if(serverAjax.gameInfo&&serverAjax.gameInfo.game.description){
                str = serverAjax.gameInfo.game.description;
            }else{
                str = "暂无作品简介！";
            }
            var strArray = getStrarr(str,18,desOp.width-ov_x,spDes);
            spDes.drawUpdateLogList(strArray,0,2,"#999b9f",18,25);
            sprites.push(spDes);
        }else{
            var titleOp = new OViewport(ov_x+41,parent_op.y+222,313+ov_x,56);
            var spTitle = new OSprite(null,titleOp);
            spTitle.x= ov_x;
            var strArray = getStrarr(gameTitle,22,titleOp.width-ov_x,spTitle);
            spTitle.drawUpdateLogList(strArray,0,0,"#ffffff",22,29);
            sprites.push(spTitle);

            var spName = new OSprite(null,null);
            var strArray = getStrarr(serverAjax.gameInfo.game.author_uname,22,150,spName);
            spName.drawUpdateLogList([strArray[0]],0,0,"#cdcdce",20,29);
            //spName.y = ov_y+290;
            spName.x= ov_x+110;
            spName.y= parent_op.y+300;
            //btnConcern.setX(ov_x+267);
            //btnConcern.setY(parent_op.y+291);
            spName.setZ(zbase);
            sprites.push(spName);

            var desOp = new OViewport(ov_x+383,parent_op.y+34,311+ov_x,229);
            //游戏简介四个字
            var spDesTitle = new OSprite(null,desOp);
            spDesTitle.x = ov_x;
            spDesTitle.drawLineTxt("作品简介：",0,0,"#ffffff",20);
            sprites.push(spDesTitle);
            //游戏简介内容
            var spDes = new OSprite(null,desOp);
            spDes.x=ov_x;
            spDes.firstX = 100;
            var str;
            if(serverAjax.gameInfo&&serverAjax.gameInfo.game.description){
                str = serverAjax.gameInfo.game.description;
            }else{
                str = "暂无作品简介！";
            }
            var strArray = getStrarr(str,18,desOp.width-ov_x,spDes);
            spDes.drawUpdateLogList(strArray,0,2,"#999b9f",18,25);
            sprites.push(spDes);
        }
        viewportArr.push(titleOp);
        viewportArr.push(desOp);
    }
    //控制图片 和 按钮 的显示隐藏
    this.fadeScene= function (start,To,is_Exit) {
        wait = 5;
        for (var i = 0; i < buttons.length; i++) {
            if(buttons[i]!=null){
                buttons[i].setOpactiy(start);
                buttons[i].SetFade(To, wait);
            }
        }
        for(var i= 0;i<sprites.length;i++){
            if(sprites[i]!=null){
                sprites[i].opacity = start;
                sprites[i].FadeTo(To, wait);
            }
        }
        isExit = is_Exit;
    }
    this.cmdClose= function () {
        if(this.isCmdClose){
            this.fadeScene(255,0,true);
        }
    }
    this.updateButton= function () {
        if(buttons != null){
            for(var i = 0 ; i < buttons.length;++i){
                var b = buttons[i];
                if(b!= null){
                    if(mark == "isFlash"){
                        //全屏---退出全屏
                        if(imgArr){
                            if(b.tag == types[3]){
                                var ScreenBtn = "";
                                if(window.parent.asUserOperate.windowChange()){
                                    //全屏
                                    ScreenBtn = "btnScrQuit";
                                    b.setBitmap(imgArr[ScreenBtn],imgArr[ScreenBtn+'1']);
                                }else{
                                    //退出全屏
                                    ScreenBtn = "btnScrFull";
                                    b.setBitmap(imgArr[ScreenBtn],imgArr[ScreenBtn+'1']);
                                }
                            }
                        }
                    }
                    b.update();
                    if(b.isClick()) {
                        //tv.data.System.SEClick.Play();  //无play
                        this.buttonClick(b);
                        //return;
                    }
                }
            }
        }

        if(headIcon!=null){
            if(headIcon.isSelected()){
                if(onClick()){
                    this.buttonClick("head");
                    //return;
                }
            }
        }
        if(onClick()&& back &&!back.isSelected()){
            this.cmdClose();//关闭    这个菜单
            //callBack("close");
        }

    }

    this.changeABoxState = function () {
        if(mark == "aBox"){
            if(aBoxState.keepState == 1){
                btnKeep.setFrontImg(imgArr["btnKeepOk"],0,0);
            }else if(aBoxState.keepState == 0){
                btnKeep.setFrontImg(imgArr["btnKeep"],0,0);
            }
            if(aBoxState.argeeState == 0){
                btnAgree.setFrontImg(imgArr["btnAgree"],0,0);
            }else if(aBoxState.argeeState == 1){
                btnAgree.setFrontImg(imgArr["btnAgreeOk"],0,0);
            }
            if(aBoxState.concernState == 101 || aBoxState.concernState == 0){
                btnConcern.setFrontImg(imgArr["btnConcern"],0,0);
            }else if(aBoxState.concernState == 1){
                btnConcern.setFrontImg(imgArr["btnConcernOk"],0,0);
            }
        }else if(mark == "isFlash"){
            if(aBoxState.keepState == 1){
                btnKeep.setFrontImg(imgArr["btnKeepOk"],0,0);

                var collect_sum = window.parent.asUserOperate.gameDetail().detail.collect_sum;
                gamefv_times =  parseInt(collect_sum);
                var str=gamefv_times;
                if(str.toString().length > 6){
                    str =  parseInt(gamefv_times/10000)+"万";
                }
                spKeep.drawLineTxt(str,0,0,"#ffffff",20);
            }else if(aBoxState.keepState == 0){
                btnKeep.setFrontImg(imgArr["btnKeep"],0,0);
                var collect_sum = window.parent.asUserOperate.gameDetail().detail.collect_sum;
                gamefv_times =  parseInt(collect_sum);
                var str=gamefv_times;
                if(str.toString().length > 6){
                    str =  parseInt(gamefv_times/10000)+"万";
                }
                spKeep.drawLineTxt(str,0,0,"#ffffff",20);
            }
            if(aBoxState.argeeState == 0){
                btnAgree.setFrontImg(imgArr["btnAgree"],0,0);
                var like_sum = window.parent.asUserOperate.gameDetail().detail.like_sum;
                publicUses.ArgeeNum = parseInt(like_sum);
                var str = publicUses.ArgeeNum;
                if(str.toString().length > 6){
                    str =  parseInt(publicUses.ArgeeNum/10000)+"万";
                }
                spArgee.drawLineTxt(str,0,0,"#ffffff",20);
            }else if(aBoxState.argeeState == 1){
                btnAgree.setFrontImg(imgArr["btnAgreeOk"],0,0);
                var like_sum = window.parent.asUserOperate.gameDetail().detail.like_sum;
                publicUses.ArgeeNum = parseInt(like_sum);
                var str = publicUses.ArgeeNum;
                if(str.toString().length > 6){
                    str =  parseInt(publicUses.ArgeeNum/10000)+"万";
                }
                spArgee.drawLineTxt(str,0,0,"#ffffff",20);
            }
            if(aBoxState.concernState == 101 || aBoxState.concernState == 0){
                btnConcern.setFrontImg(imgArr["btnConcern"],0,0);
            }else if(aBoxState.concernState == 1){
                btnConcern.setFrontImg(imgArr["btnConcernOk"],0,0);
            }
        }

    }
    //改变初始状态
    this.changeInitState = function () {
        try{
            if(mark == "aBox"){
                if(typeof window.org_box == 'undefined'){
                    sLoading.hideMask();
                }else{
                    if(CGLogin){
                    }else{
                        var a=window.org_box.GetLoginStatus();
                        CGLogin = a;
                    }
                    sLoading.showMask();
                    //盒子 type 值：0 : 查看收藏状态 1：收藏 2：取消收藏 3：查看关注状态 4：关注5：取消关注 6：查看点赞状态  7：点赞
                    var uid = serverAjax.gameInfo.game.author_uid;
                    window.org_box.orgMeunFun(0,parseInt(gIndex),parseInt(uid));
                    window.org_box.orgMeunFun(3,parseInt(gIndex),parseInt(uid));
                    window.org_box.orgMeunFun(6,parseInt(gIndex),parseInt(uid));
                }
                return;
            }
            if(mark == "isFlash"){
                if(publicUses.getUserInfo()&&publicUses.getUserInfo().uid !=0){
                    sLoading.showMask();
                    //盒子 type 值：0 : 查看收藏状态 1：收藏 2：取消收藏 3：查看关注状态 4：关注5：取消关注 6：查看点赞状态  7：点赞
                    //window.parent.NewGame.menuUserState(1);
                    window.parent.NewGame.loadComplete();
                }
                return;
            }
            if(publicUses.keepState == 1){
                btnKeep.setFrontImg(imgArr["btnKeepOk"],0,0);
            }else if(publicUses.keepState == 0){
                btnKeep.setFrontImg(imgArr["btnKeep"],0,0);
            }
            if(publicUses.argeeState == 0){
                btnAgree.setFrontImg(imgArr["btnAgree"],0,0);
            }else if(publicUses.argeeState == 1){
                btnAgree.setFrontImg(imgArr["btnAgreeOk"],0,0);
            }
            if(publicUses.concernState == 101 || publicUses.concernState == 0){
                btnConcern.setFrontImg(imgArr["btnConcern"],0,0);
            }else if(publicUses.concernState == 1){
                btnConcern.setFrontImg(imgArr["btnConcernOk"],0,0);
            }
        }catch(e){
            sLoading.hideMask();
        }
    }
    //改变点赞状态
    this.changeArgeeState = function (data) {
        try{
            if(mark == "aBox"){
                if(typeof window.org_box == 'undefined'){
                    sLoading.hideMask();
                }else{
                    if(aBoxState.argeeState == 0){
                        btnAgree.setFrontImg(imgArr["btnAgree"],0,0);
                    }else if(aBoxState.argeeState == 1){
                        btnAgree.setFrontImg(imgArr["btnAgreeOk"],0,0);
                        var level = parseInt(window.org_box.GetAllMoney()/100);
                        if(level == 1){
                            publicUses.ArgeeNum+=3;
                        }else if(level >1){
                            publicUses.ArgeeNum+=10;
                        }else{
                            publicUses.ArgeeNum++;
                        }
                        var str = publicUses.ArgeeNum;
                        if(str.toString().length > 6){
                            str =  parseInt(publicUses.ArgeeNum/10000)+"万";
                        }
                        spArgee.drawLineTxt(str,0,0,"#ffffff",20);
                        sLoading.showAlert("点赞成功！");
                    }
                }
                return;
            }

            if(mark == "isFlash"&&!data){
                sLoading.hideMask();
                if(aBoxState.argeeState == 0){
                    //btnAgree.setFrontImg(imgArr["btnAgree"],0,0);
                }else if(aBoxState.argeeState == 1){
                    btnAgree.setFrontImg(imgArr["btnAgreeOk"],0,0);
                    var like_sum = window.parent.asUserOperate.gameDetail().detail.like_sum;
                    publicUses.ArgeeNum = parseInt(like_sum);
                    var str = publicUses.ArgeeNum;
                    if(str.toString().length > 6){
                        str =  parseInt(publicUses.ArgeeNum/10000)+"万";
                    }
                    spArgee.drawLineTxt(str,0,0,"#ffffff",20);
                }
                return;
            }
            if(data.Code == 4002 && data.status == -1000){
                if(!this.checkLogin()){
                    return;
                }
            }
            if(data.Code == 4003){//4003 不能给自己点赞
                sLoading.showAlert("不能给自己点赞哦!");
                return;
            }
            if(publicUses.argeeState == 1 && data.Code == 4000){
                btnAgree.setFrontImg(imgArr["btnAgreeOk"],0,0);
                var level = publicUses.getUserInfo().vip_level;
                if(level == 1){
                    publicUses.ArgeeNum+=3;
                }else if(level >1){
                    publicUses.ArgeeNum+=10;
                }else{
                    publicUses.ArgeeNum++;
                }
                var str = publicUses.ArgeeNum;
                if(str.toString().length > 6){
                    str =  parseInt(publicUses.ArgeeNum/10000)+"万";
                }
                spArgee.drawLineTxt(str,0,0,"#ffffff",20);
                sLoading.showAlert("点赞成功！");
                return;
            }
            if(publicUses.argeeState == 1){
                sLoading.showAlert("您已经点过赞了哦！");
            }
        }catch(e){
            sLoading.hideMask();
        }
    }
    //改变收藏状态
    this.changeKeepState = function (data) {
        try{
            if(mark == "aBox"){
                if(typeof window.org_box == 'undefined'){
                    sLoading.hideMask();
                }else{
                    if(aBoxState.keepState == 1){
                        sLoading.showAlert("收藏成功！");
                        gamefv_times+=1;
                        var str = gamefv_times;
                        if(str.toString().length > 6){
                            str =  parseInt(gamefv_times/10000)+"万";
                        }
                        spKeep.drawLineTxt(str,0,0,"#ffffff",20);

                        btnKeep.setFrontImg(imgArr["btnKeepOk"],0,0);
                    }else if(aBoxState.keepState == 0){
                        sLoading.showAlert("取消收藏成功！");
                        gamefv_times-=1;
                        var str = gamefv_times;
                        if(str.toString().length > 6){
                            str =  parseInt(gamefv_times/10000)+"万";
                        }
                        spKeep.drawLineTxt(str,0,0,"#ffffff",20);

                        btnKeep.setFrontImg(imgArr["btnKeep"],0,0);
                    }
                }
                return;
            }
            if(mark == "isFlash"&&!data){
                sLoading.hideMask();
                if(aBoxState.keepState == 1){
                    var collect_sum = window.parent.asUserOperate.gameDetail().detail.collect_sum;
                    gamefv_times =  parseInt(collect_sum);
                    var str=gamefv_times;
                    if(str.toString().length > 6){
                        str =  parseInt(gamefv_times/10000)+"万";
                    }
                    spKeep.drawLineTxt(str,0,0,"#ffffff",20);

                    btnKeep.setFrontImg(imgArr["btnKeepOk"],0,0);
                }else if(aBoxState.keepState == 0){
                    var collect_sum = window.parent.asUserOperate.gameDetail().detail.collect_sum;
                    gamefv_times =  parseInt(collect_sum);
                    var str=gamefv_times;
                    if(str.toString().length > 6){
                        str =  parseInt(gamefv_times/10000)+"万";
                    }
                    spKeep.drawLineTxt(str,0,0,"#ffffff",20);

                    btnKeep.setFrontImg(imgArr["btnKeep"],0,0);
                }
                return;
            }
            if(data.Code != 404 && data.data &&data.data.status == -2){
                sLoading.showAlert(data.data.msg);
                //alert(data.data.msg);
                return;
            }else{
                if(!this.checkLogin()){
                    return;
                }
            }
            if(publicUses.keepState == 1){
                btnKeep.setFrontImg(imgArr["btnKeepOk"],0,0);
                gamefv_times+=1;
                var str = gamefv_times;
                if(str.toString().length > 6){
                    str =  parseInt(gamefv_times/10000)+"万";
                }
                spKeep.drawLineTxt(str,0,0,"#ffffff",20);
                sLoading.showAlert("收藏成功！");
            }else if(publicUses.keepState == 0){
                btnKeep.setFrontImg(imgArr["btnKeep"],0,0);
                gamefv_times-=1;
                var str = gamefv_times;
                if(str.toString().length > 6){
                    str =  parseInt(gamefv_times/10000)+"万";
                }
                spKeep.drawLineTxt(str,0,0,"#ffffff",20);
                sLoading.showAlert("取消收藏成功！");
            }
        }catch(e){
            sLoading.hideMask();
        }

    }
    //改变关注状态
    this.changeConcernState = function (data) {
        try{
            if(mark == "aBox"){
                if(typeof window.org_box == 'undefined'){
                    sLoading.hideMask();
                }else{
                    if(aBoxState.concernState == 101 || aBoxState.concernState == 0){
                        btnConcern.setFrontImg(imgArr["btnConcern"],0,0);
                        sLoading.showAlert("取消关注成功！");
                    }else if(aBoxState.concernState == 1){
                        sLoading.showAlert("关注成功！");
                        btnConcern.setFrontImg(imgArr["btnConcernOk"],0,0);
                    }else{
                        sLoading.showAlert("操作失败！");
                    }
                }
                return;
            }
            if(mark == "isFlash"&&!data){
                sLoading.hideMask();
                if(aBoxState.concernState == 101 || aBoxState.concernState == 0){
                    btnConcern.setFrontImg(imgArr["btnConcern"],0,0);
                }else if(aBoxState.concernState == 1){
                    btnConcern.setFrontImg(imgArr["btnConcernOk"],0,0);
                }else{
                    sLoading.showAlert("操作失败！");
                }
                return;
            }
            if(data.Code == 3002){
                if(!this.checkLogin()){
                    return;
                }
            }else if(data.Code == 3013){//3013 不能关注自己
                sLoading.showAlert("不能关注自己哦！");
                return;
            }
            if(publicUses.concernState == 101 || publicUses.concernState == 0){
                btnConcern.setFrontImg(imgArr["btnConcern"],0,0);
                sLoading.showAlert("取消关注成功！");
            }else if(publicUses.concernState == 1){
                sLoading.showAlert("关注成功！");
                btnConcern.setFrontImg(imgArr["btnConcernOk"],0,0);
            }else{
                sLoading.showAlert("操作失败！");
            }
        }catch(e){
            sLoading.hideMask();
        }
    }


    this.selectMore = function () {
        this.dispose();
        tv.scene = new SCGMoreDes();
    }
    this.selectSend = function (menu) {
        if(!this.checkLogin()){
            return;
        }
        sLoading.showMask();
        serverAjax.get_userInfo(function () {
            sLoading.hideMask();
            tv.scene = new SCGSendFlower(menu);
        },true);
    }
    //登录
    this.checkLogin = function () {
        sLoading.showMask();
        if(publicUses.getUserInfo().uid==0 && !serverAjax.userInfo){
            sLoading.hideMask();
            if(mark == "isFlash"){
                window.parent.asUserOperate.userLogin();
            }else{
                $(".ssologin")[0].click();
            }
            return false;
        }else{
            sLoading.hideMask();
        }
        return true;
    }
    this.buttonClick= function (button) {
        try{
            //var types = new Array("btnAgree","btnBack","btnConcern","btnExit","btnKeep","btnMore","btnMoreGame","btnSend","btnShare");
            //关注按钮              ( 0           1           2          3          4         5           6           7          8   )
            function showLoginModel(){
                $(".ssologin")[0].click();
            }
            if(sLoading.loading){
                return;
            }
            if(mark == "aBox"&&(button.tag == types[0] || button.tag == types[2] || button.tag == types[4]) || button.tag == types[7]){
                if(typeof window.org_box == 'undefined'){
                    sLoading.hideMask();
                }else{
                    if(CGLogin){
                    }else{
                        var a=window.org_box.GetLoginStatus();
                        CGLogin = a;
                        if(!a){
                            window.org_box.newMenuLogin(!isVertical);
                        }
                        return;
                    }
                }
            }
            if((mark != "aBox"&&(button.tag == types[0] || button.tag == types[2] || button.tag == types[4] || button.tag == types[7])&&!this.checkLogin())){
                return;
            }
            var uid = serverAjax.gameInfo.game.author_uid;
            switch (button.tag){
                case types[0]://点赞
                    sLoading.showMask();
                    if(mark == "aBox"){
                        if(typeof window.org_box == 'undefined'){
                            sLoading.hideMask();
                        }else{
                            if(aBoxState.argeeState == 0){
                                //盒子 type 值：0 : 查看收藏状态 1：收藏 2：取消收藏 3：查看关注状态 4：关注5：取消关注 6：查看点赞状态  7：点赞
                                window.org_box.orgMeunFun(7,parseInt(gIndex),parseInt(uid));
                            }else if(aBoxState.argeeState == 1){
                                sLoading.showAlert("您已经点过赞了哦！");
                                sLoading.hideMask();
                            }
                        }
                        return;
                    }
                    if(mark == "isFlash"){
                        if(aBoxState.argeeState == 0){
                            //盒子 type 值：0 : 查看收藏状态 1：收藏 2：取消收藏 3：查看关注状态 4：关注5：取消关注 6：查看点赞状态  7：点赞
                            window.parent.asUserOperate.asUserBtn("dz","点赞");
                        }else if(aBoxState.argeeState == 1){
                            sLoading.showAlert("您已经点过赞了哦！");
                            sLoading.hideMask();
                        }
                        return;
                    }else{
                        publicUses.p_Argee(function (data) {
                            sLoading.hideMask();
                            self.changeArgeeState(data);
                        });
                    }
                    break;
                case types[1]://返回游戏
                    self.dispose();
                    break;
                case types[2]://关注
                    sLoading.showMask();
                    if(mark == "aBox"){
                        if(typeof window.org_box == 'undefined'){
                            sLoading.hideMask();
                        }else{
                            if(aBoxState.concernState == 101 || aBoxState.concernState == 0){
                                //盒子 type 值：0 : 查看收藏状态 1：收藏 2：取消收藏 3：查看关注状态 4：关注5：取消关注 6：查看点赞状态  7：点赞
                                window.org_box.orgMeunFun(4,parseInt(gIndex),parseInt(uid));
                            }else if(aBoxState.concernState == 1){
                                //盒子 type 值：0 : 查看收藏状态 1：收藏 2：取消收藏 3：查看关注状态 4：关注5：取消关注 6：查看点赞状态  7：点赞
                                window.org_box.orgMeunFun(5,parseInt(gIndex),parseInt(uid));
                            }else{

                            }
                        }
                        return;
                    }
                    if(mark == "isFlash"){
                        if(aBoxState.concernState == 101 || aBoxState.concernState == 0){
                            //盒子 type 值：0 : 查看收藏状态 1：收藏 2：取消收藏 3：查看关注状态 4：关注5：取消关注 6：查看点赞状态  7：点赞
                            window.parent.asUserOperate.asUserBtn("gz","关注");
                        }else if(aBoxState.concernState == 1){
                            //盒子 type 值：0 : 查看收藏状态 1：收藏 2：取消收藏 3：查看关注状态 4：关注5：取消关注 6：查看点赞状态  7：点赞
                            window.parent.asUserOperate.asUserBtn("qxgz","取消关注");
                        }else{

                        }
                        return;
                    } else {
                        publicUses.p_Concern(function(data){
                            sLoading.hideMask();
                            self.changeConcernState(data);
                        });
                    }
                    break;
                case types[3]://退出游戏
                    if(mark == "aBox"){
                        if(typeof window.org_box == 'undefined'){
                        }else{
                            window.org_box.exitGame(!isVertical);
                        }
                        return;
                    }else if(mark == "isFlash"){
                        if(window.parent.asUserOperate.windowChange()){
                            //全屏
                            window.parent.asUserOperate.quitFullScreen();
                        }else{
                            //退出全屏
                            window.parent.asUserOperate.fullScreen();
                        }
                        this.dispose();
                        tv.scene= tv.scene=new SCGMenu3(function(data){
                        });

                        return;
                    }
                    var a = confirm("确定要退出作品吗？");
                    if(a){
                        var Exiturl = "http://m.66rpg.com/game/mobileDown/"+gIndex;
                        window.location.href= Exiturl;
                    }
                    break;
                case types[4]://收藏
                    sLoading.showMask();
                    if(mark == "aBox"){
                        if(typeof window.org_box == 'undefined'){
                            sLoading.hideMask();
                        }else{
                            if(aBoxState.keepState == 1){
                                //盒子 type 值：0 : 查看收藏状态 1：收藏 2：取消收藏 3：查看关注状态 4：关注5：取消关注 6：查看点赞状态  7：点赞
                                window.org_box.orgMeunFun(2,parseInt(gIndex),parseInt(uid));
                            }else if(aBoxState.keepState == 0){
                                //盒子 type 值：0 : 查看收藏状态 1：收藏 2：取消收藏 3：查看关注状态 4：关注5：取消关注 6：查看点赞状态  7：点赞
                                window.org_box.orgMeunFun(1,parseInt(gIndex),parseInt(uid));
                            }
                        }
                        return;
                    }
                    if(mark == "isFlash"){
                        if(aBoxState.keepState == 1){
                            //盒子 type 值：0 : 查看收藏状态 1：收藏 2：取消收藏 3：查看关注状态 4：关注5：取消关注 6：查看点赞状态  7：点赞
                            window.parent.asUserOperate.asUserBtn("sc","取消收藏");

                        }else if(aBoxState.keepState == 0){
                            //盒子 type 值：0 : 查看收藏状态 1：收藏 2：取消收藏 3：查看关注状态 4：关注5：取消关注 6：查看点赞状态  7：点赞
                            window.parent.asUserOperate.asUserBtn("sc","收藏");
                        }
                        return;
                    }else{
                        publicUses.p_Keep(function(data){
                            sLoading.hideMask();
                            self.changeKeepState(data);
                        });
                    }

                    break;
                case types[5]://查看更多
                    if(mark == "aBox"){
                        if(typeof window.org_box == 'undefined'){
                            sLoading.hideMask();
                        }else{
                            window.org_box.newMenuGameDetail(!isVertical,parseInt(gIndex));
                        }
                        return;
                    }
                    this.selectMore();
                    break;
                case types[6]://更多游戏
                    //var HomeUrl = "http://m.66rpg.com/list/index";
                    //window.location.href= HomeUrl;

                    //if(mark == "aBox"){
                    //    if(typeof window.org_box == 'undefined'){
                    //        sLoading.hideMask();
                    //    }else{
                    //        window.org_box.newMenuComm(!isVertical,parseInt(gIndex),serverAjax.gameInfo.game.gname,parseInt(uid));
                    //    }
                    //    return;
                    //}
                    if(mark == "isFlash"){
                        window.parent.asUserOperate.jumpComment();
                    }else{
                        this.dispose();
                        tv.scene = new SCGComment();

                    }
                    break;
                case types[7]://打赏
                    if(mark == "aBox"){
                        if(typeof window.org_box == 'undefined'){
                            sLoading.hideMask();
                        }else{
                            if(ismod == "true"){
                                window.org_box.newMenuSendFlower(!isVertical,parseInt(gIndex),modId);
                            }else{
                                window.org_box.newMenuSendFlower(!isVertical,parseInt(gIndex));
                            }
                        }
                        return;
                    }else if(mark == "isFlash"){
                        //flash打赏----要用
                        window.parent.asUserOperate.sendFlowerWindow();
                        return;
                    }
                    this.selectSend(tv.scene);
                    break;
                case types[8]://分享

                    if(mark == "aBox"){
                        if(typeof window.org_box == 'undefined'){
                            sLoading.hideMask();
                        }else{
                            window.org_box.newMenuShare(!isVertical,parseInt(gIndex),serverAjax.gameInfo.game.gname);
                        }
                        return;
                    }else if(mark == "isFlash"){
                        window.parent.asUserOperate.shareBox();
                        return;
                    }
                    androidFlower();
                    break;
            }
        }catch(e){
            sLoading.hideMask();
        }
    }

    this.update= function () {
        if(!initOk){
            return;
        }
        if(wait > 0){
            wait -= 1;
            if(isExit && wait == 0){
                this.dispose();
            }
            return;
        }
        //this.updateIcon();
        this.updateButton();
    }

    this.dispose= function () {
        for(var i = 0;i<viewportArr.length;i++){
            if(viewportArr[i]){
                viewportArr[i].dispose();
            }
        }
        viewportArr.length = 0;
        for(var i = 0 ; i < buttons.length;++i){
            if(buttons[i] != null){
                buttons[i].dispose();
            }
        }

        for(var i= 0;i<sprites.length;i++){
            if(sprites[i]!=null){
                sprites[i].dispose();
            }
        }
        imgArr = null;
        tv.scene = new SGame();
    }
    gLoadAssets.curLoadScene = "SCGMenu";
    if(gLoadAssets.isNeedLoad()){

    }else{
        this.loadNeedImg();
    }
}



function showFrame(src){
    $("#mainFrameDiv").show();
    var mainFrame = document.getElementById("mainFrame");
    if(mainFrame.src==""){
        mainFrame.src =src;
        mainFrame.style.height = 920+"px";
        sLoading.showMask();
        mainFrame.onload = function () {
            sLoading.hideMask();
        }
        mainFrame.onerror = function () {
            sLoading.hideMask();
            sLoading.showAlert("请求失败，请检查网络情况并重试！");
        }
    }
    //$(mainFrame).contents().find(".back").click(function () {
    //    alert("dfadfa");
    //});

    $("#btn_con_frame").click(function () {
        mainFrame.style.display="none";
        $(this).hide();
    });
}



function getStrarr(str,fontSize,lineWidth,sp){
    g.font = fontSize+"px 微软雅黑";
    var arr = new Array();
    var string = str;
    function getArr(){
        var width = 0;
        for(var i = 0;i<string.length;i++){
            width+= g.measureText(string.substr(i,1)).width;
            if(arr.length <= 0 && sp.firstX>0 && width > (lineWidth-sp.firstX)){
                arr.push(string.substr(0,i));
                string = string.substr(i,string.length);
                getArr();
                break;
            }else if(width>lineWidth){
                arr.push(string.substr(0,i));
                string = string.substr(i,string.length);
                getArr();
                break;
            }
        }
        sp.width = width;
    }
    getArr();
    arr.push(string);
    return arr;
}

function getAjax(url,callBack){
    $.ajax({
        url:url,
        type:"get",
        dataType:"jsonp",
        jsonp:"jsonCallBack",
        success: function (data) {
            if(data.status==1){
                callBack(data);
            }else{
                callBack(-1);
            }
        },
        error: function () {
            callBack(null);
        }
    });
}
//登录成功
loginSuc=function(){
    try{
        CGLogin=true;
        //如果没有弹框，把弹框加上
        if(!sLoading.loading){
            sLoading.showMask();
        }
        //登录成功后获取玩家是否开启云存档状态
        //operationCloud.getOpenCloudState();
        //获取所有需要的数据
        serverAjax.get_userInfo(function () {
            serverAjax.get_gameInfo(function () {
                publicUses.p_ComArgee(gIndex, function (data) {
                    publicUses.p_ComKeep(gIndex, function (data) {
                        publicUses.p_ComConcern(serverAjax.gameInfo.game.author_uid,function(data){
                            serverAjax.get_flower(function () {
                                //中途登录

                                if(mark == "isFlash"){
                                    //记录用户最初的uid 未登录时curUser.uid为0一旦登录或者登录进游戏--(只记录一次)
                                    if(publicUses.getUserInfo()){
                                        var uid = parseInt(publicUses.getUserInfo().uid);
                                        if(uid>0&&curUser.uid==0){
                                            curUser.uid = uid;
                                            curUser.uname = publicUses.getUserInfo().uname;
                                        }
                                    }
                                }

                                sLoading.hideMask();
                                //分情况初始化二周目
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
                                operationFrame.initCloudExData();
                                flowerHua=parseInt(serverAjax.userFlowerInfo.num);
                                //登陆后初始化档位
                                if(tv && tv.scene && tv.scene.isNeedSendFlower == "SCGMENU"){
                                    tv.scene.cmdClose();
                                    tv.scene=new SCGMenu3(function(data){
                                    });
                                }else if(tv && tv.scene && tv.scene.isNeedSendFlower == "SCUI"){
                                    //getWebUserInfo(function () {
                                    tv.system.varsEx.loadExData();
                                    tv.scene.refresh();
                                    //});
                                }else if(tv && tv.scene && tv.scene.isNeedSendFlower == "SSaveFile"){
                                    tv.scene.dispose();
                                    tv.scene = new SSavefile();
                                }
                            });
                        });
                    });
                });
            });
        });
    }catch(e){}
}
//退出
loginOut=function(callBack){
    if(mark == "isFlash"){
        try{
            CGLogin=true;
            sLoading.showMask();
            //登录成功后获取玩家是否开启云存档状态
            //operationCloud.getOpenCloudState();
            //获取所有需要的数据
            serverAjax.get_userInfo(function () {
                serverAjax.get_gameInfo(function () {
                    publicUses.p_ComArgee(gIndex, function (data) {
                        publicUses.p_ComKeep(gIndex, function (data) {
                            publicUses.p_ComConcern(serverAjax.gameInfo.game.author_uid,function(data){
                                //云存档关上
                                operationCloud.isOpen = false;
                                serverAjax.userInfo = null;

                                //退出登录后直接让用户 花，全部为0； 用户也为0；
                                serverAjax.userFlowerInfo={
                                    num:0,
                                    fresh_flower_num:0,
                                    wild_flower_num:0,
                                    tanhua_flower_num:0,
                                    sum:0
                                };
                                flowerHua = 0;

                                sLoading.hideMask();
                                //分情况初始化二周目
                                operationFrame.initCloudExData();
                                //退出后个页面刷新
                                if(tv && tv.scene && tv.scene.isNeedSendFlower == "SCGMENU"){
                                    tv.scene.cmdClose();
                                    tv.scene=new SCGMenu3(function(data){
                                    });
                                }else if(tv && tv.scene && tv.scene.isNeedSendFlower == "SCUI"){
                                    //getWebUserInfo(function () {
                                    tv.system.varsEx.loadExData();
                                    tv.scene.refresh();
                                    //});
                                }else if(tv && tv.scene && tv.scene.isNeedSendFlower == "SSaveFile"){
                                    tv.scene.dispose();
                                    tv.scene = new SSavefile();
                                }
                            });
                        });
                    });
                });
            });
        }catch(e){}
    }else{
        //H5走此等方法
        if(CGLogin!=null){
            CGLogin=false;
            tv.scene.cmdClose();
            userInfo = new Array();
            tv.scene=new SCGMenu3(function(data){
            });
        }
    }
}

/*
* type:类型 标识
* res: 结果
* */
function ABoxState(){
    this.count = 0;
    this.keepState = 0;
    this.argeeState = 0;
    this.concernState = 101;
}

var aBoxState = new ABoxState();

function aBoxCallSCGMenuLoginSuc(){
    try{
        if(tv.scene instanceof SCGMenu3){
            //tv.scene.changeInitState();
        }
    }catch(e){

    }
}

function aBoxCallSCGMenuUserState(type,res){
    switch (type){
        case 0://查看收藏状态
            aBoxState.keepState = res;
            aBoxState.count++;
            break;
        case 1://收藏
            if(res == 1){
                aBoxState.keepState = 1;
            }else if(res == 6){
                aBoxState.keepState = 1;
            }else{
                aBoxState.keepState = 0;
            }
            aBoxState.keepState = res;
            if(tv.scene instanceof SCGMenu3){
                tv.scene.changeKeepState();
            }
            break;
        case 2://取消收藏
            if(res == 1){
                aBoxState.keepState = 0;
            }else{
                aBoxState.keepState = 1;
            }
            if(tv.scene instanceof SCGMenu3){
                tv.scene.changeKeepState();
            }
            break;
        case 3://查看关注状态
            aBoxState.concernState = res;
            aBoxState.count++;
            break;
        case 4://关注
            aBoxState.concernState = res;
            if(tv.scene instanceof SCGMenu3){
                tv.scene.changeConcernState();
            }
            break;
        case 5://取消关注
            aBoxState.concernState = res;
            if(tv.scene instanceof SCGMenu3){
                tv.scene.changeConcernState();
            }
            break;
        case 6://查看点赞状态
            aBoxState.argeeState = res;
            aBoxState.count++;
            break;
        case 7://点赞
            aBoxState.argeeState = res;
            if(tv.scene instanceof SCGMenu3){
                tv.scene.changeArgeeState();
            }
            break;

    }
    if(!(type == 0||type == 3 || type == 6)){
        sLoading.hideMask();
        return;
    }
    if(aBoxState.count == 3 && (type == 0||type == 3 || type == 6)){
        if(tv.scene instanceof SCGMenu3){
            tv.scene.changeABoxState();
        }
        sLoading.hideMask();
        aBoxState.count =0;
    }
}