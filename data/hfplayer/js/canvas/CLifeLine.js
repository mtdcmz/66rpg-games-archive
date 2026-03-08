/**
 * Created by Administrator on 2016/5/31.
 */
function CLifeLine(e, m) {
    this.isEnd = false;
    var self = this;
    //对话框初始化部分
    this.interUser = parseInt(e.Argv[1]);//显示信息--掌中挚爱中标识为新生命线
    var data = tv.data.System.MessageBox;
    var imaget = new Image();
    if (fileList[("Graphics/UI/" + e.Argv[4]).toLowerCase()]) {
        imaget.src = fileList[("Graphics/UI/" + e.Argv[4]).toLowerCase()].url();
    }
    var talkIndex = 0;
    var talkMsg = new Array(10);
    var talkMsgArgs = new Array();

    this.talkIndex = 0;
    this.talkMsg = new Array();
    //for(var i = 0;i< talkMsg.length;i++){
    //    talkMsg[i] = new OSprite(null,null);
    //    //if(i>0){
    //    //    //talkMsg[i].y = talkMsg[i-1].y+talkMsg[i-1].getHeight();
    //    //}
    //}
    //var talkMsg = new OSprite(null,null);
    //talkMsg.setBitmap(imaget);
    this.lineHeight = tv.data.System.FontSize;
    var lineSpace = this.lineHeight * 1.8;  //16 * 2.3
    var imagen = new Image();
    if (fileList[("Graphics/UI/" + data.Name.backimage).toLowerCase()]) {
        imagen.src = fileList[("Graphics/UI/" + data.Name.backimage).toLowerCase()].url();
    }

    //高级中用到的背景
    var imageBack = null;
    //判断是否点击隐藏
    var isClickHide = false;
    var showingText = "";
    var messageText = "";
    var color = tv.data.System.FontTalkColor;
    //临时变量系列
    var tempBackV = false;
    var tempButtonV = false;
    var messageShowing = false;
    var Args;
    var fastShowText = false;
    var drawSpeed = 0;

    var faceOfsX = 0;
    var drawWait = 0;
    var waitPress = false;
    var pause = false;
    var autoWaitCount = 0;

    var drawX = 0;
    var drawY = 0;

    var SHOWTEXTNUBER = 3;

    var setLocal;
    //强调对话人的旧的数值
    var oldPicArr;
    var isResave = false;

    //滚动字幕
    var isRoll = false;


    this.oListView;

    //起始坐标
    var talkPos = e.Argv[3].split(",");
    var talkTalkX = parseInt(talkPos[0]), talkTalkY = parseInt(talkPos[1]), talkTalkWidth = parseInt(talkPos[2]), talkTalkHeight = parseInt(talkPos[3]);
    if (this.interUser == 1) {
        this.oListView = new OListView(talkTalkX, talkTalkY, talkTalkWidth, talkTalkHeight);
        this.oListView.setZ(6002);
        this.viewPort = this.oListView.viewPort;
        this.viewPort.SetZ(3100);
        //滚动：end;
    } else {
        this.viewPort = new OViewport(talkTalkX, talkTalkY, talkTalkWidth, talkTalkHeight);
        this.viewPort.SetZ(3100);
    }


    var isSetPos = false;
    //拉伸图片的上下左右
    var stretPos = e.Argv[5].split(',');
    var lifeX = parseInt(stretPos[2]), lifeY = parseInt(stretPos[0]);

    var talkY = 0;

    var choiceBack = null;

    //0325 移动端
    //var isMobile = tv.isMobile;
    var isMobile = true;

    this.cloneObject = function (obj) {
        var o = obj.constructor === Array ? [] : {};
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                o[i] = typeof obj[i] === "object" ? cloneObject(obj[i]) : obj[i];
            }
        }
        return o;
    }

    this.visible = function (f) {
        //talkWin.visible = f;
        //nameWin.visible = f;
    }

    this.msgboxFadeIn = function () {
        //talkWin.visible = tempBackV;
        talkMsg[talkIndex].visible = tempBackV;
        //nameWin.visible = tempNameV;
        ////pmenu.visible = isMobile ? tempButtonV : false;
    }

    this.msgBoxFadeOut = function () {
        //tempBackV = talkWin.visible;
        //tempNameV = nameWin.visible;
        tempButtonV = tempBackV;
        //talkWin.visible = false;
        talkMsg[talkIndex].visible = false;
        //nameWin.visible = false;
    }

    this.msgScreenRoll = function (str, Args) {
        var AAar = Args.split('|');
        //0：开关、1：帧数、2：起始相对位置类型X,Y(0左(上) 1中 2右(下))、3：终止相对位置类型X,Y(同前)、4：起始位置X,Y、5：终点位置X,Y
        var txt_switch = AAar[0];
        if (txt_switch == 1) {
            var txt_fps = AAar[1];
            var txt_start_type = AAar[2];
            var txt_end_type = AAar[3];
            var txt_start_pos = AAar[4];
            var txt_end_pos = AAar[5];
            //类型
            var txt_start_type_x = AAar[2].split(',')[0];
            var txt_start_type_y = AAar[2].split(',')[1];
            var txt_end_type_x = AAar[3].split(',')[0];
            var txt_end_type_y = AAar[3].split(',')[1];
            //坐标
            var txt_start_pos_x = AAar[4].split(',')[0];
            var txt_start_pos_y = AAar[4].split(',')[1];
            var txt_end_pos_x = AAar[5].split(',')[0];
            var txt_end_pos_y = AAar[5].split(',')[1];
            var sx, sy, ex, ey;
            switch (parseInt(txt_start_type_x)) {
                //0左 1中 2右  default自定义
                case 0:
                    sx = 0;
                    break;
                case 1:
                    sx = gGameWidth / 2;
                    break;
                case 2:
                    sx = gGameWidth;
                    break;
                default :
                    sx = txt_start_pos_x;
                    break;
            }
            switch (parseInt(txt_start_type_y)) {
                //0上 1中 2下  default自定义
                case 0:
                    sy = 0;
                    break;
                case 1:
                    sy = gGameHeight / 2 - tv.data.System.FontSize;
                    break;
                case 2:
                    sy = gGameHeight;
                    break;
                default :
                    sy = txt_start_pos_y;
                    break;
            }
            switch (parseInt(txt_end_type_x)) {
                //0左 1中 2右  default自定义
                case 0:
                    ex = 0;
                    break;
                case 1:
                    ex = gGameWidth / 2;
                    break;
                case 2:
                    ex = gGameWidth;
                    break;
                default :
                    ex = txt_end_pos_x;
                    break;
            }
            switch (parseInt(txt_end_type_y)) {
                //0上 1中 2下  default自定义
                case 0:
                    ey = 0;
                    break;
                case 1:
                    ey = gGameHeight / 2 - tv.data.System.FontSize;
                    break;
                case 2:
                    ey = gGameHeight;
                    break;
                default :
                    ey = txt_end_pos_y;
                    break;
            }
            sx = sx - data.Talk.textX;
            sy = sy - data.Talk.textY;

            g.font = tv.data.System.FontSize + "px " + fontName;
            var strArr = str.split('\\n');
            var width = 0;
            var height = 0;
            if (strArr.length > 0) {
                for (var i = 0; i < strArr.length; i++) {
                    if (g.measureText(strArr[i]).width > width) {
                        width = g.measureText(strArr[i]).width;
                    }
                }
                height = strArr.length * lineSpace;
            } else {
                width = g.measureText(str).width;
                height = lineSpace;
            }

            if (ex <= 0 || parseInt(txt_end_type_x) == 3) {
                ex = ex - data.Talk.textX;
            } else if (parseInt(txt_end_type_x) == 1) {
                ex = ex - data.Talk.textX - width / 2;
            } else {
                ex = ex - data.Talk.textX - width;
            }
            ey = ey - data.Talk.textY;
            //if(ey<=0||parseInt(txt_end_type_y)==3){
            //    ey=ey - data.Talk.textY;
            //}else{
            //    ey=ey - data.Talk.textY-height;
            //}

            //位置初始化
            talkMsg[talkIndex].x = sx;
            talkMsg[talkIndex].y = sy;

            //移动
            talkMsg[talkIndex].SlideTo(ex, ey, txt_fps / 2);
        } else {
            //停止移动
            talkMsg[talkIndex].StopTrans();
        }
    }

    this.megboxClear = function () {
        drawX = drawY = 0;
        talkMsg[talkIndex].texts.length = 0;//0115 sprite是复用并为重置 重新开始游戏会显示talkmsg上次保存的内容 直至第一次刷新被替换掉
        waitPress = false;//0115 重新开始游戏后waitPress标志未被清除 第一句无法正常显示
        showingText = "";
        messageText = "";
    }

    this.isShowing = function () {
        if (this.loadingItem)return true;
        if (this.interUser == 1) {
            if (this.talkMsg[this.talkIndex]) {
                if (this.talkMsg[this.talkIndex].isEnd) {
                    this.talkIndex++;
                    var bShow = this.talkMsg[this.talkIndex - 1].isShowing();                   

                    //this.talkMsg[this.talkIndex].isEnd = false;
                    return bShow;
                } else {
                    return this.talkMsg[this.talkIndex].isShowing();
                }
            } else {
                return this.talkMsg[this.talkIndex - 1].isShowing();
            }

        } else {
            return messageShowing || showingText.length > 0;
        }
    }

    this.isShow = function () {
        //return talkWin.visible || messageText.length > 0;
        return messageText.length > 0;
    }

    this.messageTextisNull = function () {

        if (talkMsg[talkIndex] instanceof OSprite) {
            return !talkMsg[talkIndex].visible;
        }
    }

    this.getHeight = function () {
        //return talkWin.height;
    }

    this.setMessagePosition = function (pos) {
        //talkWin.x = data.Talk.backX;
        //talkWin.getRect();
        //switch (pos){
        //    case 0 :
        //        talkWin.y = data.Talk.backY;
        //        break;
        //    case 1:
        //        talkWin.y = (tv.data.Headr.GHeight - talkWin.height) / 2;
        //        break;
        //    case 2:
        //        talkWin.y = tv.data.Headr.GHeight - (data.Talk.backY + talkWin.height);
        //        break;
        //}
        //talkMsg.x = talkWin.x;
        //talkMsg.y = talkWin.y;
    }

    this.setHightMessagePosition = function (pos, x, y) {
        //talkWin.x = x;
        //talkWin.y = y;
        //talkWin.getRect();
        //talkMsg.x = talkWin.x;
        //talkMsg.y = talkWin.y;
    }

    //根据上下左右宽高拉伸图片
    this.stretImage = function (sp, posArr, width, height) {
        sp.stretImage(posArr, width, height);
    }
    this.setAllChoice = function (list) {
        var lheight = 0;
        var theight = 0;
        for (var i = 0; i < list.length; i++) {
            if (talkIndex == 0) {
                lheight = talkTalkX;
            } else if (talkMsg[talkIndex - 1] instanceof OSprite) {
                lheight = talkMsg[talkIndex - 1].y + talkMsg[talkIndex - 1].getStretHeight() + 5;
            }
            list[i].setX(talkTalkX);
            list[i].setY(lheight + i * (tv.canvas.TextChoice.image1.height + tv.canvas.TextChoice.choiceSpace));
            theight = lheight + i * (tv.canvas.TextChoice.image1.height + tv.canvas.TextChoice.choiceSpace);
            list[i].setZ(3000 + 10 + i);
            list[i].setVisible(true);
            talkMsg[talkIndex] = list[i];
            talkMsg[talkIndex].isLifeLine = true;
            //this.setStretPos();
            talkIndex++;
        }
        if (talkIndex > 0) {
            theight += talkMsg[talkIndex - 1].height();
        }
        this.setChoicePos(theight);
        tv.canvas.TextChoice.waiting = true;
    }
    this.Talk = function (args, showUpdate) {
        if (this.interUser == 1) {
            if (this.loadingItem) {
                this.loadSaveData += 1;
                loadSaveTalk.push(args);
                // if(this.loadSaveData>0){
                this.drawLoadItem();
                // }
                return;
            }
            //内部使用
            //console.log("new 生命线");
            if(this.oListView.isMove){
                return;
            }
            /*if(this.talkMsg&&this.talkMsg.length>=5){
             var theOne = this.talkMsg.shift();
             //theOne.dispose();
             console.log(this.talkMsg,this.viewPort.oy,theOne._itemHeight);
             this.talkIndex--;
             this.viewPort.oy = this.viewPort.oy+theOne._itemHeight;
             for(var i=0;i<this.talkMsg.length;i++){
             console.log(this.talkMsg[i]._y);
             //this.talkMsg[i]._y = this.talkMsg[i]._y-theOne._itemHeight;
             }
             }*/
            var item = new CLifeLineItem();
            item.stretPos = stretPos;
            item.talkPos = talkPos;
            item.lineSpace = lineSpace;
            item.MsgBack = imaget;
            item.isEnd = false;
            item._wait_frame = parseInt(e.Argv[2]) / 2;
            if (args[16].indexOf('?') !== -1) {
                args[16] = args[16].replace(/\?/g, '|')
            }
            if (args[17].indexOf('?') !== -1) {
                args[17] = args[17].replace(/\?/g, '|')
            }
            talkMsgArgs[this.talkIndex] = args;
            this.talkMsg[this.talkIndex] = item;
            item.LifeLineItem(args, showUpdate, this.viewPort, this.talkIndex);


        } else {
            //console.log("原工程");
            //tv.scene=new SCGMenu2(function () {
            //});
            //talkMsg[talkIndex] = new OSprite(null,this.viewPort);
            talkMsg[talkIndex] = new OSprite(null, null);
            talkMsgArgs[talkIndex] = args;
            if (!isSetPos && talkIndex == 0) {
                isSetPos = true;
                talkMsg[0].x = talkTalkX;
                talkMsg[0].y = talkTalkY;
            }
            talkMsg[talkIndex].x = talkTalkX;
            Args = this.cloneObject(args);
            fastShowText = showUpdate;
            //talkWin.visible = args[7] == "1";
            drawSpeed = parseInt(args[6]);

            setLocal = null;
            //对话框
            if (Args[16]) {
                var msgArr = Args[16].split('|');//背景图更换开关，背景图 | 是否自定义XY，X，Y | 强调说话人开关，图层编号，类型 | 双重对话，上或下，点后是否消失
                //目前支持临时更换背景图，更改xy坐标
                var back = msgArr[0].split(',');
                setLocal = msgArr[1].split(',');
                var talkPerson = msgArr[2].split(',');
                var talkMore = msgArr[3].split(',');
                talkMsg[talkIndex].visible = args[2].length > 0;
                //强调对话人/*生命线关闭*/
                talkPerson = false;
                if (talkPerson) {
                    if (parseInt(talkPerson[0]) == 1) {
                        isResave = true;
                        oldPicArr = new Array();
                        //console.log(tv.canvas.GamePictrue);
                        for (var i = 3; i < 22; i++) {
                            if (tv.canvas.GamePictrue[i]) {
                                var oldObj = new Object();
                                oldObj.x = tv.canvas.GamePictrue[i].x;
                                oldObj.y = tv.canvas.GamePictrue[i].y;
                                oldObj.zoom_x = tv.canvas.GamePictrue[i].zoom_x;
                                oldObj.zoom_y = tv.canvas.GamePictrue[i].zoom_y;
                                oldObj.opacity = tv.canvas.GamePictrue[i].opacity;
                                oldPicArr[i] = oldObj;
                                tv.canvas.GamePictrue[i].opacity = 255 * .8;
                            }
                        }
                        var pic = tv.canvas.GamePictrue[parseInt(talkPerson[1])];
                        if (pic) {
                            var x = pic.x - (pic.width * 1.15 - pic.width) / 2;
                            var y = pic.y - (pic.height * 1.15 - pic.height) / 2;
                            pic.opacity = 255;
                            pic.Scale(pic.zoom_x, pic.zoom_y, 1.15, 1.15, 5);
                            pic.Slide(pic.x, pic.y, x, y, 5);
                            //pic.x = x;
                            //pic.y = y;
                        }
                    } else {
                        oldPicArr = null;
                    }
                } else {
                    oldPicArr = null;
                }

                //isClickHide控制点后消失
                if (talkMore) {
                    if (parseInt(talkMore[2]) == 1) {
                        isClickHide = true;
                    } else {
                        isClickHide = false;
                    }
                }
                //更改背景图片
                if (back[0] == 1) {
                    imageBack = new Image();
                    imageBack.src = fileList[("Graphics/UI/" + back[1]).toLowerCase()].url();
                    //talkWin.image=imageBack;
                    //talkWin.height=imageBack.height;
                } else {//默认
                    //talkWin.image=imaget;
                    //talkWin.height=imaget.height;
                }

                //
                //if(setLocal[0]==1){
                //    this.setHightMessagePosition(parseInt(args[5]),setLocal[1],setLocal[2]);
                //}else{
                //    if(tv.canvas.msgIndex==1){//上的默认位置
                //        this.setHightMessagePosition(parseInt(args[5]),data.Talk.backX,data.Talk.backY);
                //    }else{
                //        this.setMessagePosition(parseInt(args[5]));
                //    }
                //}
            } else {
                this.setMessagePosition(parseInt(args[5]));
            }
            ////滚动字幕
            //if(Args[17]&&parseInt(Args[17])!=0){
            //    //解析移动
            //    isRoll=true;
            //    self.msgScreenRoll(Args[2],Args[17]);
            //}else{
            //    //停止移动
            //    isRoll=false;
            //    talkMsg[talkIndex].StopTrans();
            //}
            messageText = args[2];
            messageShowing = true;
            this.updateMessage(fastShowText);
        }
    };
    this.setBG = function (sp) {
        if (choiceBack) {
            choiceBack.dispose;
            choiceBack = null;
            if (sp) {
                choiceBack = sp;
            }
        } else {
            choiceBack = sp;
        }
    }
    this.setChoicePos = function (height) {
        if (height > gGameHeight) {
            if (choiceBack) {
                choiceBack.SlideTo(choiceBack.x, choiceBack.y - ( height - gGameHeight), parseInt(e.Argv[2]) / 2);
            }
            for (var i = 0; i < talkIndex; i++) {
                if (talkMsg[i] instanceof OSprite) {
                    talkMsg[i].SlideTo(talkMsg[i].x, talkMsg[i].y - ( height - gGameHeight), parseInt(e.Argv[2]) / 2);
                } else {
                    talkMsg[i].SlideTo(talkMsg[i].getX(), talkMsg[i].getY() - ( height - gGameHeight), parseInt(e.Argv[2]) / 2);
                }
            }
            for (var i = 0; i <= talkIndex; i++) {
                if (talkMsg[i]) {
                    if (talkMsg[i] instanceof OSprite) {
                        if (talkMsg[i].y + talkMsg[i].getStretHeight() <= 0) {
                            talkMsg[i].dispose();
                            talkMsg.splice(i, 1);
                            talkIndex--;
                            talkMsg.push(new OSprite(null, null));
                        }
                    } else {
                        if (talkMsg[i].getY() + talkMsg[i].height() <= 0) {
                            talkMsg[i].dispose();
                            talkMsg.splice(i, 1);
                            talkIndex--;
                            talkMsg.push(null);
                        }
                    }
                }
            }
            if (choiceBack) {
                if (parseInt(choiceBack.y + choiceBack.getStretHeight()) < 0) {
                    choiceBack.dispose();
                    choiceBack = null;
                }
            }
        }
    }
    this.setStretPos = function (height, posIndex) {
        if (height > gGameHeight) {
            if (choiceBack) {
                choiceBack.SlideTo(choiceBack.x, choiceBack.y - ( height - gGameHeight), parseInt(e.Argv[2]) / 2);
            }
            for (var i = 0; i <= posIndex; i++) {
                if (talkMsg[i]) {
                    if (talkMsg[i] instanceof OSprite) {
                        talkMsg[i].SlideTo(talkMsg[i].x, talkMsg[i].y - (height - gGameHeight), parseInt(e.Argv[2]) / 2);
                    } else {
                        talkMsg[i].SlideTo(talkMsg[i].getX(), talkMsg[i].getY() - (height - gGameHeight), parseInt(e.Argv[2]) / 2);
                    }
                }
            }
        }
        for (var i = 0; i <= posIndex; i++) {
            if (talkMsg[i]) {
                if (talkMsg[i] instanceof OSprite) {
                    if (talkMsg[i].y + talkMsg[i].getStretHeight() <= 0) {
                        talkMsg[i].dispose();
                        talkMsg.splice(i, 1);
                        talkIndex--;
                        talkMsg.push(new OSprite(null, null));
                    }
                } else {
                    if (talkMsg[i].getY() + talkMsg[i].height() < 0) {
                        talkMsg[i].dispose();
                        talkMsg.splice(i, 1);
                        talkIndex--;
                        talkMsg.push(null);
                    }
                }
            }

        }
        if (choiceBack) {
            if (parseInt(choiceBack.y + choiceBack.getStretHeight()) < 0) {
                choiceBack.dispose();
                choiceBack = null;
            }
        }
    }

    this.setLevel = function (z) {
        //talkWin.setZ(z);
        //talkMsg.setZ(z + 1);
        for (var i = 0; i < talkMsg.length; i++) {
            talkMsg[i].setZ(z + 1);
        }
    };

    this.dispose = function () {
        this.viewPort = null;
        if (this.oListView) {
            this.oListView.dispose();
        }

        //talkWin.dispose();
        //talkMsg.dispose();
        if (choiceBack) {
            choiceBack.dispose();
        }

        for (var i = 0; i < talkMsg.length; i++) {
            if (talkMsg[i]) {
                talkMsg[i].dispose();
            }
        }
        for (var i = 0; i < this.talkMsg.length; i++) {
            if (this.talkMsg[i]) {
                this.talkMsg[i].dispose();
            }
        }
        this.talkMsg = [];
        this.talkIndex = 0;
        talkMsgArgs = [];
        loadSaveTalk = [];
        this.loadSaveData = 0;


    };
    this.showFastTip = function () {
        if (tv.scene instanceof SGame) {
            if (downTime > FPS * 0.3) {
                if (fastImg != null) {
                    fastImg.opacity = 255;
                    var src = img_base_path + "speedfast/fast" + fastTime + ".png";
                    var image;
                    if (!otherImgArr[src]) {
                        image = new Image();
                        image.src = src;
                    } else {
                        image = otherImgArr[src];
                    }
                    fastImg.setBitmap(image);
                    fastImg.x = onTouchX - image.width / 2;
                    fastImg.y = onTouchY - image.height / 2 - 20;
                    fastTime += 1;
                    if (fastTime > 8) {
                        fastTime = 8;
                    }
                }
            }
        }
    }
    this.updateChoice = function () {
        //console.log(tv.canvas.TextChoice.usedList);
    }
    this.loadingIteming = false;
    this.update = function () {
        this.updateChoice();
        //this.showFastTip();

        if (this.interUser == 1) {
                // if(this.loadingIteming){
                //     return;
                // }
                if (this.loadingItem && !this.loadingIteming) {
                        this.loadingIteming = true;
                        this.drawLoadItem();

                    return;
                }
                if (this.oListView.isMove) {
                    return;
                }

                for (var i = 0; i < this.talkMsg.length; i++) {
                    if (this.talkMsg[i]) {
                        //console.log(this.talkMsg[i]._sp_back.isClick(),i);
                        if (this.talkMsg[i].update()) {
                            return;
                        }


                        /*if(this.talkMsg[i]._sp_back.isClick()){
                         console.log("点到了")

                         liftInter = new IMain();
                         liftInter.isCui = true;
                         liftInter.jumpStory(this.talkMsg[i]._eventList);
                         liftInter.UpdateSCUI(true);
                         }
                         }*/
                        //this.talkMsg[i].updateMessage();
                        /*if(this.talkMsg[i].updateMessage()){
                         return;
                         }*/
                        /*if(this.talkMsg[i]._sp_back.isClick()&&this.talkMsg[i]._eventList.length>0){
                         console.log("点中了有事件",i)
                         }*/
                    }
                }

            } else {
                this.showFastTip();
                this.updateMessage(fastShowText);


            }
        }
        this.TerminateMessage = function () {
            if (isClickHide) {
                tv.canvas.msgIndex = 0;
                this.msgBoxFadeOut();
            }
            if (isResave) {
                isResave = false;
                for (var i = 3; i < 22; i++) {
                    if (tv.canvas.GamePictrue[i]) {
                        var pic = tv.canvas.GamePictrue[i];
                        pic.zoom_x = oldPicArr[i].zoom_x;
                        pic.zoom_y = oldPicArr[i].zoom_y;
                        pic.x = oldPicArr[i].x;
                        pic.y = oldPicArr[i].y;
                        pic.opacity = oldPicArr[i].opacity;
                    }
                }
            }

            messageText = "";
            messageShowing = false;
            showingText = "";
            drawWait = 0;
            waitPress = false;
        };

        this.isSpeedRead = function () {
            return onTouchLong || tv.system.quickRun;
        };

        this.isNextMessage = function () {
            return onClick();
        };

        this.isAutoNext = function () {
            return tv.system.autoRun;
        };

        this.updateMessage = function (f) {
            if (pause && !f && !this.isSpeedRead()) {
                if (this.isNextMessage()) {
                    pause = false;
                }
                return;
            }
            if (waitPress) {
                if (autoWaitCount > 0) {
                    autoWaitCount -= 1;
                }
                if (this.isAutoNext() && autoWaitCount <= 0 && showingText.length <= 0) {
                    this.TerminateMessage();
                    drawX = 0;
                    drawY = 0;
                    waitPress = false;
                }
                if (this.isSpeedRead() || this.isNextMessage()) {
                    if (showingText.length <= 0) {
                        this.TerminateMessage();
                    }
                    drawX = 0;
                    drawY = 0;
                    waitPress = false;
                }
                return;
            }
            var textNotSkip = false;//false
            //var directShow = true;
            if (this.isSpeedRead()) {
                textNotSkip = false; //true
                //directShow = false;
                drawSpeed = 0;
                drawWait = 0;
            }
            if (isRoll) {
                textNotSkip = false;
            }
            var drawWidth = 0, drawHeight = 0;
            if (showingText.length > 0) {
                //textNotSkip = directShow || this.isSpeedRead();
                if (this.isNextMessage()) {
                    textNotSkip = false;
                    drawSpeed = 0;
                    drawWait = 0;
                }
                if (drawWait > 0 && !this.isSpeedRead()) {
                    drawWait -= 1;
                    return;
                }
                var looptime = SHOWTEXTNUBER;

                var blastTextIsSpace = false;//0212 兼容作者用space来对齐的临时方法 如果检测连续两个空格，则认为它是在用空格来对齐
                if (!talkMsg[talkIndex]) {

                }
                while (true) {
                    if (showingText.length <= 0) {
                        break;
                    }
                    var smin = showingText.substr(0, 1);
                    showingText = showingText.substring(1, showingText.length);
                    var c = smin.charCodeAt(0);
                    if (c == 200) {
                        drawX = 0;
                        drawY += lineSpace;
                    } else if (c == 201) {
                        drawWait += parseInt(this.TextToTemp("[", "]", /\[([0-9]+)]/g));
                    } else if (c == 202) {
                        color = new OColor(this.TextToTemp("[", "]", /\[([0-9]+,[0-9]+,[0-9]+)]/g));
                    } else if (c == 203) {
                        drawSpeed = parseInt(this.TextToTemp("[", "]", /\[([0-9]+)]/g));
                    } else if (c == 204) {
                        drawWait += 10;
                    } else if (c == 205) {
                        drawWait += 5;
                    } else if (c == 206) {
                        this.TerminateMessage();
                        break;
                    } else if (c == 207) {
                        if (textNotSkip) {
                            pause = true;
                            break;
                        }
                    } else if (c == 208) {
                        var index = parseInt(this.TextToTemp("[", "]", /\[([0-9]+)]/g));
                        showingText = tv.system.vars.getVar(index - 1) + showingText;
                    } else if (c == 209) {
                        var index = parseInt(this.TextToTemp("[", "]", /\[([0-9]+)]/g));
                        showingText = tv.system.varsEx.getVar(index - 1) + showingText;
                    } else if (c == 210) {
                        var index = parseInt(this.TextToTemp("[", "]", /\[([0-9]+)]/g));
                        // add by ysxx -↓↓↓↓↓-2014/6/4--- 投票添加
                        // --增加code判断事件类型是资源引入的类型还是文本显示类型----
                        showingText = this.madeString(tv.system.string.getVar(index - 1), 0, 210) + showingText;
                        // add by ysxx
                        // -↑↑↑↑↑-2014/6/4---------------------------------------------
                    } else {
                        g.font = tv.data.System.FontSize + "px " + fontName;
                        var w = g.measureText(smin).width;
                        //var w = tv.data.System.FontSize*.9;

                        //0212 用空格对齐的方式是不好的游戏设计。临时修复33105作者用" "用文本对齐图片。
                        //0504 w扩大2.5倍后 239262 48432等游戏 空格偏差位子明显不对 调整为1.2

                        if (smin == " ") {
                            var a = g.measureText(" ").width;
                            var b = g.measureText("　").width;
                            var c = g.measureText("哈").width;

                            if (guid == "8516389e5f89a41f8ad113a5cec968a4") {
                                w = (a + b + c) / 3;
                            } else {
                                w = w;
                            }
                            ////如果是连续空格则认为它在对齐
                            if (blastTextIsSpace) {
                                w = w;
                            } else if (showingText.length > 0) {
                                if (showingText.substr(0, 1) == " ") {
                                    w = w;
                                }
                            }
                            blastTextIsSpace = true;
                        } else {
                            blastTextIsSpace = false;
                        }

                        talkMsg[talkIndex].texts.push(new DTextA(smin, drawX + lifeX, drawY + lifeY, color.getColor()));
                        drawX += w;

                        if (SHOWTEXTNUBER > 0) {
                            drawWait = 0;
                        } else {
                            drawWait += drawSpeed;
                        }

                    }
                    if (showingText.length <= 0) {
                        showingText = "";
                        waitPress = true;
                        if (this.isAutoNext()) {
                            autoWaitCount = 60;
                        }
                    }
                    if (textNotSkip) {
                        if (looptime > 0) {
                            looptime -= 1;
                            if (looptime <= 0) {
                                break;
                            }
                        } else {
                            break;
                        }

                    }
                    if (drawX > drawWidth) {
                        drawWidth = drawX;
                    }
                }//while结束
                drawHeight = drawY + lineSpace;
                //var width = drawX,;
                this.setAllPos(drawWidth, drawHeight);

                if (this.loadSaveData > 0) {
                    this.loadSaveData--;
                    if (this.loadSaveData > 0) {
                        talkIndex++;
                        waitPress = false;
                        this.drawLoadData();
                    } else {
                        this.isEnd = true;
                        talkIndex++;
                    }
                } else {
                    if (talkMsg[talkIndex] instanceof OSprite) {
                        if (talkMsg[talkIndex].texts.length <= 0) {
                            this.isEnd = true;
                        }
                    }

                    talkIndex++;
                }
            }
            if (messageText.length > 0) {
                messageShowing = true;
                this.refresh();
            }
        };
        this.setAllPos = function (width, height) {
            var posIndex = talkIndex;

            function next() {
                var lheight = 0;
                /*设置坐标*/
                if (posIndex > 0) {
                    if (talkMsg[posIndex]) {
                        //默认情况
                        if (talkMsg[posIndex - 1] instanceof OSprite) {
                            talkMsg[posIndex].y = talkMsg[posIndex - 1].y + talkMsg[posIndex - 1].getStretHeight() + 5;
                        } else {
                            talkMsg[posIndex].y = talkMsg[posIndex - 1].getY() + talkMsg[posIndex - 1].height() + 5;
                        }
                        //当设置了自定义坐标的时候将以前坐标改变
                        if (setLocal && setLocal[0] == 1) {
                            talkMsg[posIndex].x += parseInt(setLocal[1]);
                            talkMsg[posIndex].y += parseInt(setLocal[2]);
                            lheight += parseInt(setLocal[2]);
                        }
                        if (talkMsg[posIndex] instanceof OSprite) {
                            lheight = talkMsg[posIndex].y + talkMsg[posIndex].getStretHeight();
                        } else {
                            lheight = talkMsg[posIndex].getY() + talkMsg[posIndex].height();
                        }
                    }
                }
                self.setStretPos(lheight, posIndex);
            }

            var self = this;
            if (!imageBack) {
                getImage(imaget, function () {
                    talkMsg[posIndex].setBitmap(imaget);
                    self.stretImage(talkMsg[posIndex], stretPos, width, height);
                    next();
                });

            } else {
                getImage(imageBack, function () {
                    talkMsg[posIndex].setBitmap(imageBack);
                    //this.setHightMessagePosition(parseInt(Args[5]),data.Talk.backX,data.Talk.backY);
                    imageBack = null;
                    next();
                });
            }


        }

        this.refresh = function () {
            //drawX = 0;
            //drawY = 0;
            drawWait = 0;
            waitPress = false;
            showingText = "";
            //talkMsg[talkIndex].drawText("",0,0);
            //talkMsg[talkIndex].texts.length = 0;
            color = tv.data.System.FontTalkColor;
            tv.system.replay.Add(messageText);
            tv.system.replay.Add(" ");
            showingText = new String(messageText);
            showingText = this.TextAnalysis(showingText);
            messageText = "";
        };

        /// <summary>
        /// 正则替换
        /// </summary>
        /// <param name="str">需要进行的替换的字符串</param>
        /// <returns>替换过后的字符串</returns>
        this.TextAnalysis = function (str) {
            var s = new String(str);
            s = s.replaceAll(/\|[Nn]/g, String.fromCharCode(200));//0507
            s = s.replaceAll(/\\[Nn]/g, String.fromCharCode(200));
            s = s.replaceAll(/\\[Ww]\[([0-9]+)]/g, String.fromCharCode(201) + "[$1]");
            s = s.replaceAll(/\\[Cc]\[([0-9]+,[0-9]+,[0-9]+)]/g, String.fromCharCode(202) + "[$1]");
            s = s.replaceAll(/\\[Ss]\[([0-9]+)]/g, String.fromCharCode(203) + "[$1]");
            s = s.replaceAll(/\\\|/g, String.fromCharCode(204));
            s = s.replaceAll(/\\\./g, String.fromCharCode(205));
            s = s.replaceAll(/\\\>/g, String.fromCharCode(206));
            s = s.replaceAll(/\\\=/g, String.fromCharCode(207));
            s = s.replaceAll(/\\[Vv]\[([0-9]+)]/g, String.fromCharCode(208) + "[$1]");
            s = s.replaceAll(/\\[Xx]\[([0-9]+)]/g, String.fromCharCode(209) + "[$1]");
            s = s.replaceAll(/\\[Tt]\[([0-9]+)]/g, String.fromCharCode(210) + "[$1]");
            return s;
        };

        this.TextAnalysisNull = function (str) {
            var s = new String(str);
            s = s.replaceAll("\\\\[Nn]", "");
            s = s.replaceAll("\\\\[Ww]\\[([0-9| ]+)]", "");
            s = s.replaceAll("\\\\[Cc]\\[([0-9| ]+[，,][0-9| ]+[，,][0-9| ]+)]", "");
            s = s.replaceAll("\\\\[Ss]\\[([0-9| ]+)]", "");
            s = s.replaceAll("\\\\\\|", "");
            s = s.replaceAll("\\\\\\.", "");
            s = s.replaceAll("\\\\\\>", "");
            s = s.replaceAll("\\\\\\=", "");
            s = s.replaceAll("\\\\[Vv]\\[([0-9| ]+)]", "");
            s = s.replaceAll("\\\\[Xx]\\[([0-9| ]+)]", "");
            s = s.replaceAll("\\\\[Tt]\\[([0-9| ]+)]", "");
            return s;
        }

        // add by ysxx -↓↓↓↓↓-2014/6/4--- 投票添加 --增加code判断事件类型是资源引入的类型还是文本显示类型----
        this.madeString = function (str, index, code) {
            index += 1;
            if (index >= 20) {
                return "";
            }
            str = this.TextAnalysis(str);
            var end = "";
            while (true) {
                if (str.length <= 0) {
                    break;
                }
                var smin = str.substring(0, 1);
                str = str.substring(1, str.length);
                var c = smin.charCodeAt(0);
                if (c == 200) {
                    end += "|n";
                } else if (c == 202) {
                    var s = this.TextToTemp2(str, "[", "]",
                        "\\[([0-9| ]+[，,][0-9| ]+[，,][0-9| ]+)]");
                    str = s[1];
                    end += s[0];
                } else if (c == 208) {
                    var s = this.TextToTemp2(str, "[", "]", "\\[([0-9| ]+)]");
                    str = s[1];
                    var i = parseInt(s[0]);
                    end += tv.system.vars.getVar(i - 1);
                } else if (c == 209) {
                    var s = this.TextToTemp2(str, "[", "]", "\\[([0-9| ]+)]");
                    str = s[1];
                    var i = parseInt(s[0]);
                    end += tv.system.varsEx.getVar(i - 1);
                } else if (c == 210) {
                    var s = this.TextToTemp2(str, "[", "]", "\\[([0-9| ]+)]");
                    str = s[1];
                    var i = parseInt(s[0]);
                    // add by ysxx -↓↓↓↓↓-2014/6/4--- 投票添加
                    // --增加code判断事件类型是资源引入的类型还是文本显示类型----
                    end += this.madeString(tv.system.string.getVar(i - 1),
                        index, code);
                    // add by ysxx
                    // -↑↑↑↑↑-2014/6/4---------------------------------------------
                } else {
                    end += smin;
                }
            }
            // add by ysxx -↓↓↓↓↓-2014/6/4--- 投票添加
            // --增加code判断事件类型是资源引入的类型还是文本显示类型----
            if (code == 215) {

            } else {
                // add by ysxx
                // -↑↑↑↑↑-2014/6/4---------------------------------------------
                end = end.replace('\\', '/');
            }
            return end;
        }

        this.TextToTemp = function (s, e, rex) {
            var tmp = showingText.substring(showingText.indexOf(s) + 1,
                showingText.indexOf(e));
            showingText = showingText.substring(tmp.length + s.length + e.length, showingText.length);
            var temp1 = tmp.replaceAll(rex, "$1");
            var temp2 = temp1.replaceAll(" ", "");
            return temp2;
        }

        this.TextToTemp2 = function (str, s, e, rex) {
            var tmp = str.substring(str.indexOf(s) + 1, str.indexOf(e));
            str = str.substring(tmp.length + s.length + e.length, str.length);
            var arr = new Array(tmp.replaceAll(rex, "$1"), str);
            return arr;
        }
        //线上
        /*this.saveArgs = function(arr){
            arr.push("Argv|");
            arr.push(e.Code+"|");
            arr.push(e.Indent+"|");
            for(var i=0;i< e.Argv.length;i++){
                arr.push(e.Argv[i]+"|");
            }
        }*/





        //掌中挚爱开始
        this.saveArgs = function (arr,item_arr) {
            if(tv.system.rwFile.isCloud){
                //云端
               if(this.interUser == 1){
                   //新生命线
               }else{
                   //老生命线
               }
            }else{
                //本地
                if(this.interUser == 1){
                    //新生命线
                    if(this.talkMsg.length<=0){
                        return;
                    }
                    var args = "";
                    args += "Argv|";
                    args += e.Code + "|";
                    args += e.Indent + "|";
                    args += "1" + "|";
                    args += e.Argv[1] + "|";
                    args += e.Argv[2] + "|";
                    args += e.Argv[3] + "|";
                    args += e.Argv[4] + "|";
                    args += e.Argv[5] + "|";
                    args += "" + "|";
                    //存档时pos-1
                    var nowEvent,prevEvent;
                    if(tv.canvas.isShowTextStyle==1&&tv.inter.story[tv.inter.pos-1].Code == 100){
                       prevEvent = tv.inter.story[tv.inter.pos-1].Argv;
                    }
                    if(tv.canvas.isShowTextStyle==1&&tv.inter.story[tv.inter.pos].Code == 100){
                        nowEvent = tv.inter.story[tv.inter.pos].Argv;
                    }
                    var itemArr = new Array();
                    for (var i = 0; i < this.talkIndex; i++) {
                        //处理100 pos-1
                        if (this.talkMsg[i]) {
                            if(prevEvent){
                                if(this.talkMsg[i].argv[2] == prevEvent[2]){
                                    break;
                                }
                            }
                            if(nowEvent){
                                if(this.talkMsg[i].argv[2] == nowEvent[2]){
                                    break;
                                }
                            }
                            //args += this.getMsgArgv(this.talkMsg[i].argv,itemArr);
                            this.getMsgArgv(this.talkMsg[i].argv,itemArr);
                        }
                    }
                    if (loadSaveTalk.length> 0) {
                        for (var j = 0; j < loadSaveTalk.length; j++) {
                            if (loadSaveTalk[j]) {
                                //console.log(loadSaveTalk[j]);
                                //args += this.getMsgArgv(loadSaveTalk[j],itemArr);
                                this.getMsgArgv(loadSaveTalk[j],itemArr);
                            }
                        }
                    }

                    //item_arr = itemArr;
                    //+
                    args+="lifeItem="+JSON.stringify(itemArr)+"|";
                    arr.push(args);
                }else{
                    //老生命线---整个事件而已
                    var str = "";
                    arr.push("Argv|");
                    arr.push(e.Code+"|");
                    arr.push(e.Indent+"|");
                    str+="Argv|"+e.Code+"|"+e.Indent+"|";
                    for(var i=0;i< e.Argv.length;i++){
                        arr.push(e.Argv[i]+"|");
                        str+=e.Argv[i]+"|";
                    }
                }
            }
        };
    //保存的 100中所有的
        this.getMsgArgv = function (argv,itemArr) {
            var length = argv.length;
            var lifeItem = {};
            var arg = "";
            for (var i = 0; i < length; i++) {
                /*if (i == 16 || i == 17) {
                    if (argv[i].indexOf('|') !== -1) {
                        argv[i] = argv[i].replace(/\|/g, '?')
                    }
                }*/
                lifeItem[''+i]= encodeURIComponent(argv[i]);
                //arg += argv[i] + "|";
            }
            itemArr.push(lifeItem);
            //arg += encodeURIComponent(lifeItem)+'|';
            //arg = arg.substr(0, arg.length);
            //return arg;
        }
        this.loadSaveData = 0;
        var loadSaveTalk = [];
        this.loadArgs = function (arr) {
            // if(this.interUser ==1){



            drawX = 0;
            drawY = 0;
            this.talkMsg = [];
            this.talkIndex = 0;
            talkIndex = 0;
            talkMsgArgs = [];
            loadSaveTalk = [];
            this.loadSaveData = 0;
            //for(var i in itemArr){
            //    var obj = itemArr[i];
            //    for(var k in obj){
            //        console.log(decodeURIComponent(obj[k]));
            //    }
            //}
            //为新生命线添加
            var lifeindex = arr[0].indexOf("lifeItem=")>-1;
            if(lifeindex){
                var str = (arr.shift()).split("lifeItem=");
                if(str.length>1){
                    var item = JSON.parse(str[1]);
                    for(var i =0;i<item.length;i++){
                        var argv = [];
                        for(var k in item[i]){
                            argv[k] = decodeURIComponent(item[i][k]);
                        }
                        this.loadSaveData += 1;
                        loadSaveTalk.push(argv);
                    }
                }
            }
            /*while (arr.length > 0) {
             console.log(arr);
             /!*if (arr[0] == "false" || arr.length < 19)break;
             var argv = [];
             var argvCodeStr;
             if(arr[0]=="MsgEnd")break;
             var saveArr = arr.shift();
             argvCodeStr = decodeURIComponent(saveArr);
             console.log('###',argvCodeStr);
             /!*if(argvCodeStr["16"]||argvCodeStr["17"]){
             saveArr = saveArr.replace(/\?/g, '|')
             }*!/

             /!*for (var i = 0; i < 19; i++) {
             var saveArr = arr.shift();
             if (i == 16 || i == 17) {
             if (saveArr.indexOf('?') !== -1) {
             saveArr = saveArr.replace(/\?/g, '|')
             }
             }
             argv.push(saveArr)
             }*!/!*!/
             this.loadSaveData += 1;
             loadSaveTalk.push(argv);
             }*/
            if (this.loadSaveData > 0) {
                if (this.interUser == 1) {
                    this.loadingItem = true;
                     //tv.inter.pos +=1;
                     this.drawLoadItem();
                } else {
                    this.drawLoadData();
                }
                // }
            }


        };
        this.loadingItem = false;
        this.drawLoadItem = function () {
            // if(this.talkIndex>0){
            //     this.talkMsg[this.talkIndex-1].isEnd = true;
            // }
            var temparg = loadSaveTalk.shift();
            if(temparg&&temparg.length>0){
                var item = new CLifeLineItem();
                item.stretPos = stretPos;
                item.talkPos = talkPos;
                item.lineSpace = lineSpace;
                item.MsgBack = imaget;
                item._wait_frame = parseInt(e.Argv[2]) / 2;
                item.isLoad = true;
                /*if (temparg[16].indexOf('?') !== -1) {
                 temparg[16] = temparg[16].replace(/\?/g, '|')
                 }
                 if (temparg[17].indexOf('?') !== -1) {
                 temparg[17] = temparg[17].replace(/\?/g, '|')
                 }*/
                talkMsgArgs[self.talkIndex] = temparg;
                self.talkMsg[self.talkIndex] = item;
                item.LifeLineItem(temparg, false, self.viewPort, self.talkIndex++);
            }
        };
        this.drawLoadData = function () {
            drawX = 0;
            // this.isEnd = false;
            var temparg = loadSaveTalk.shift();
            this.Talk(temparg, false);

        }
    }
