function CLifeLineItem() {
    var self = this;
    this._x = 0; //此item在viewPort内的x坐标
    this._y = 0; //此item在viewPort内的y坐标
    this._itemWith = 0;//此item的真实宽
    this._itemHeight = 0;//此item的真实高

    this._wait_frame = 0;//等待的帧数
    this._top_margin = 0;//上边距
    this._bottom_margin = 0;//下边距
    this._left_margin = 0;//左边距
    this._right_margin = 0;//右边距

    this._sp_back = null;//支持拉伸点击的气泡背景
    this._sp_face = null;//头像

    this._viewPort = null;//显示的viewPort区域
    this._eventList = new Array();//点击需要执行的事件列表
    this._show_text = "";//显示的文本

    this.liftInter = null;
    this.isLoad = false;
    //自加入
    var color;
    //文字相关
    this.showingText = "";
    var messageText = "";
    //脸相关
    var faceW;
    var faceH;
    //头像相关 0 左 1右  2没给
    var facePos = 2;
    this.loadingMsgBack = false;

    //字相关
    var drawWait = 0;
    var waitPress = false;
    var pause = false;
    var autoWaitCount = 0;
    var drawX = 0;
    var drawY = 0;
    var lifeX;
    var lifeY;

    //临时变量系列
    var tempBackV = false;
    var tempButtonV = false;
    this.messageShowing = false;
    var Args;
    var fastShowText = false;
    var drawSpeed = 0;
    var preMsg;
    var liftInter = null;


    //索引
    this.index;
    this.MsgBack;
    this.lineSpace;
    this.stretPos;
    this.talkPos;
    this.isEnd = false;
    var talkTalkX;
    var talkTalkY;
    var talkTalkWidth;
    var talkTalkHeight;


    var faceSpace = 5;

    var clickSkip = true;


    //对话框相关
    var setLocal;

    //跳过
    var isRoll = false;
    var jumpTheMsg = false;


    var SHOWTEXTNUBER = 3;


    //var data = tv.data.System.MessageBox;
    //array--x,y,w,h  background   face  viewport  text
    /*if(data.faceInMessageBox()){
     var imagef = new Image();
     try
     {
     faceBorder = new OSprite(null,null);
     if(!data.Talk.FaceBorderImage.IsNil()){
     var pathF = ("Graphics/UI/" + data.Talk.FaceBorderImage).toLowerCase();
     imagef.src = fileListFato(pathF,'imagef in CMessage from CMessage.js');
     //faceBorder = new OSprite(imagef,null);
     faceBorder.setBitmap(imagef);
     faceBorder.visible = false;
     }
     }
     catch(e)
     {
     }
     }*/

    this.backVisible = false;
    this.faceVisible = false;
    this.argv;
    this.LifeLineItem = function (args, showUpdate, viewp, index) {
        waitPress =false;
        this.argv = args;
        this._top_margin = parseInt(this.stretPos[0]);//上边距
        this._bottom_margin = parseInt(this.stretPos[1]);//下边距
        this._left_margin = parseInt(this.stretPos[2]);//左边距
        this._right_margin = parseInt(this.stretPos[3]);//右边距
        talkTalkX = parseInt(this.talkPos[0]);
        talkTalkY = parseInt(this.talkPos[1]);
        talkTalkWidth = parseInt(this.talkPos[2]);
        talkTalkHeight = parseInt(this.talkPos[3]);

        lifeX = this._left_margin;
        lifeY = this._top_margin;
        this.index = index;
        this._viewPort = viewp;
        this._show_text = args[2];

        fastShowText = showUpdate;
        //talkWin.visible = args[7] == "1";
        drawSpeed = parseInt(args[6]);


        this._sp_back = new OSprite(null, this._viewPort); //气泡背景+字
        this._sp_back.loadingImage = false;
        this._sp_back.tag = this.index;
        this._sp_back.visible = false;
        this.backVisible = args[2].length > 0;

        this._sp_face = new OSprite(null, this._viewPort);//头像
        this._sp_face.tag = this.index;
        this._sp_face.visible = false;
        this.faceVisible = args[3].length > 0;


        if (parseInt(args[9]) == 6) {
            //内部效果有事件   "503>Voice\店长 (01).mp3>80>Voice\店长 (01).mp3>2 <210>50"
            //事件间隔使用<区分
            //事件参数间隔使用>区分
            var eventAgs = args[10].split("<");
            for (var i = 0; i < eventAgs.length; i++) {
                var eventList = eventAgs[i].split(">");

                var code = parseInt(eventList[0]);
                var argv = [];
                for (var j = 1; j < eventList.length; j++) {
                    argv.push(eventList[j]);
                }
                var argc = null;
                var indent = 0;
                var LiftEvent = new DEvent1(code, indent, argc, argv);
                self._eventList.push(LiftEvent);
            }
            /*//如果有事件
             if(self._eventList.length>0){
             liftInter = new IMain();
             liftInter.isCui = true;
             liftInter.jumpStory(self._eventList);
             /!*if(liftInter && !liftInter.isFinish()){
             //onloadInter.update();
             liftInter.UpdateSCUI(false);
             return;
             //onloadInter.isEnd=true;
             //}*!/
             }*/
        }

        if (this.backVisible) {
            //头像
            this.setfacePos(args, function () {
                self.setTalkMsg(args);
            });
        } else {
            return;
        }

    };
    //渲染对话框
    this.setTalkMsg = function (args) {
        //对话框
        if (args[16]) {
            var msgArr = args[16].split('|');//背景图更换开关，背景图 | 是否自定义XY，X，Y | 强调说话人开关，图层编号，类型 | 双重对话，上或下，点后是否消失
            //目前支持临时更换背景图，更改xy坐标
            var back = msgArr[0].split(',');
            setLocal = msgArr[1].split(',');
            var talkPerson = msgArr[2].split(',');
            var talkMore = msgArr[3].split(',');
            //更改背景图片
            if (back[0] == 1) {
                self.MsgBack = new Image();
                self.MsgBack.src = fileList[("Graphics/UI/" + back[1]).toLowerCase()].url();
            }
        }
        // if(self.MsgBack){
        //      var size = self.getTextSize(args);
        //      console.log(size.w+"----------"+size.h);
        //      self.setAllPos(size.w,size.h,function(){
        //           self.loadingMsgBack = false;
        //           messageText = args[2];
        //           self.messageShowing = true;
        //           self.updateMessage(fastShowText);
        //
        //      });
        // }else{
        messageText = args[2];
        this.messageShowing = true;
        this.updateMessage(fastShowText);
        // }

    };
    this.getTextSize = function (args) {

        var message = new String(args[2]);
        message = this.TextAnalysis(message);
        var tempW = 0, tempH = 0;
        var tempX = drawX, tempY = drawY;
        if (message.length > 0) {
            while (true) {
                if (message.length <= 0) {
                    break;
                }
                var smin = message.substr(0, 1);
                message = message.substring(1, message.length);
                var c = smin.charCodeAt(0);
                if (c == 200) {
                    tempX = 0;
                    tempY += this.lineSpace;
                } else {
                    g.font = tv.data.System.FontSize + "px " + fontName;
                    var w = g.measureText(smin).width;
                    if (smin == " ") {
                        var a = g.measureText(" ").width;
                        var b = g.measureText("　").width;
                        var c = g.measureText("哈").width;
                        if (guid == "8516389e5f89a41f8ad113a5cec968a4") {
                            w = (a + b + c) / 3;
                        } else {
                            w = w;
                        }
                    }
                    tempX += w;
                }
                if (tempX > tempW) {
                    tempW = tempX;
                }
            }
            tempH = tempY + this.lineSpace;
            console.log("drawX:" + drawX + "--drawY:" + drawY + "--tempX:" + tempX + "--tempY:" + tempY)
            return {w: tempW, h: tempH};

        }
    }
    //渲染头像
    this.setfacePos = function (args, callBack) {
        facePos = 2;
        //开始调整位置
        if (this.faceVisible) {

            facePos = args[4]; //0左 1右
            this._sp_face.setBitmap(null);
            var image;
            var path = fileListFato(("Graphics/Face/" + args[3]).toLowerCase(), 'image in setfacePos from CMessage.js');
            if (faceImageArr.length > 0 && path) {
                var hasFace = false;
                for (var i = 0; i < faceImageArr.length; i++) {
                    if (faceImageArr[i].src == path) {
                        hasFace = true;
                        image = faceImageArr[i];
                        faceW = image.width;
                        faceH = image.height;
                        //console.log('1---1',talkIndex,posIndex,faceArr[posIndex],faceW,faceH);
                        self._sp_face.setBitmap(image);
                        self._sp_face.visible = false;
                        callBack && callBack();
                        break;
                    }
                }
                if (!hasFace) {
                    image = new Image();
                    image.src = path;
                    getImage(image, function (img) {
                        if (img == null) {
                            return;
                        }
                        image = img;
                        faceW = img.width;
                        faceH = img.height;

                        self._sp_face.setBitmap(image);
                        self._sp_face.visible = false;
                        callBack && callBack();
                    });
                }
            } else {
                image = new Image();
                image.src = path;
                getImage(image, function (img) {
                    if (img == null) {
                        return;
                    }
                    image = img;
                    faceW = img.width;
                    faceH = img.height;
                    self._sp_face.setBitmap(image);
                    self._sp_face.visible = false;
                    callBack && callBack();
                });
            }
        } else {
            self._sp_face.x = 0;
            self._sp_face.y = 0;
            self._sp_face.width = 0;
            self._sp_face.height = 0;
            image = new Image();
            self._sp_face.setBitmap(image);
            self._sp_face.visible = false;
            faceW = 0;
            faceH = 0;
            callBack && callBack();
        }
    };

    //加载文字；
    this.updateMessage = function (f) {
        //0 false true false 0
        //0 false false 0

        if (drawWait > 0) {
            drawWait--;
            if (drawWait <= 0) {
                if (jumpTheMsg) {
                    this.TerminateMessage()
                }
            }
            return;

        }
        if (jumpTheMsg) {
            this.TerminateMessage()
        }
        //等待玩家操作
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
            //自动进行
            if (this.isAutoNext() && autoWaitCount <= 0 && this.showingText.length <= 0) {
                this.TerminateMessage();
                drawX = 0;
                drawY = 0;
                waitPress = false;
            }
            //点击或快进
            if (this.isSpeedRead() || this.isNextMessage()) {
                if (this.showingText.length <= 0) {
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
        // if(this.loadingMsgBack)return;
        if (this.showingText.length > 0) {

            //textNotSkip = directShow || this.isSpeedRead();
            if (this.isNextMessage()) {
                textNotSkip = false;
                drawSpeed = 0;
                drawWait = 0;
            }
            /*if(drawWait > 0 && !this.isSpeedRead()){
             drawWait -= 1;
             return;
             }*/
            var looptime = SHOWTEXTNUBER;

            var blastTextIsSpace = false;//0212 兼容作者用space来对齐的临时方法 如果检测连续两个空格，则认为它是在用空格来对齐
            while (true) {

                if (this.showingText.length <= 0) {
                    break;
                }

                var smin = this.showingText.substr(0, 1);
                this.showingText = this.showingText.substring(1, this.showingText.length);
                var c = smin.charCodeAt(0);

                if (c == 200) {
                    //\n换行
                    drawX = 0;
                    drawY += this.lineSpace;
                } else if (c == 201) {
                    //等待 \w[80]自定义帧数
                    var fps = parseInt(this.TextToTemp("[", "]", /\[([0-9]+)]/g));
                    if(mark == "isFlash"){
                        drawWait += fps;
                    }else{
                        drawWait += Math.ceil(fps / 2);
                    }
                } else if (c == 202) {
                    //console.log("202变色");
                    color = new OColor(this.TextToTemp("[", "]", /\[([0-9]+,[0-9]+,[0-9]+)]/g));
                } else if (c == 203) {
                    drawSpeed = parseInt(this.TextToTemp("[", "]", /\[([0-9]+)]/g));
                } else if (c == 204) {
                    //\| 204等10帧
                    if(mark == "isFlash"){
                        drawWait += 10;
                    }else{
                        drawWait += 10 / 2;
                    }
                } else if (c == 205) {
                    //\. 205等5帧
                    if(mark == "isFlash"){
                        drawWait += 5;
                    }else{
                        drawWait += Math.ceil(5 / 2);
                    }
                } else if (c == 206) {
                    //\> 跳过本次对话
                    /*this.TerminateMessage();
                     break;*/
                    jumpTheMsg = true;
                } else if (c == 207) {
                    //\= 等待玩家操作
                    if (textNotSkip) {
                        pause = true;
                        break;
                    }
                } else if (c == 208) {
                    //定义的数值
                    var index = parseInt(this.TextToTemp("[", "]", /\[([0-9]+)]/g));
                    this.showingText = tv.system.vars.getVar(index - 1) + this.showingText;
                } else if (c == 209) {
                    //定义的二周目
                    var index = parseInt(this.TextToTemp("[", "]", /\[([0-9]+)]/g));
                    this.showingText = tv.system.varsEx.getVar(index - 1) + this.showingText;
                } else if (c == 210) {
                    //定义的字符串
                    var index = parseInt(this.TextToTemp("[", "]", /\[([0-9]+)]/g));
                    // --增加code判断事件类型是资源引入的类型还是文本显示类型----
                    this.showingText = this.madeString(tv.system.string.getVar(index - 1), 0, 210) + this.showingText;
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
                        } else if (this.showingText.length > 0) {
                            if (this.showingText.substr(0, 1) == " ") {
                                w = w;
                            }
                        }
                        blastTextIsSpace = true;
                    } else {
                        blastTextIsSpace = false;
                    }
                    this._sp_back.texts.push(new DTextA(smin, drawX + lifeX, drawY + lifeY, color.getColor()));
                    drawX += w;

                    //if(SHOWTEXTNUBER > 0){
                    //    drawWait = 0;
                    //}else{
                    //    drawWait += drawSpeed;
                    //}

                }
                if (drawX > drawWidth) {
                    drawWidth = drawX;
                }

                //没有字了！去等待，去清空
                if (this.showingText.length <= 0) {
                    this.showingText = "";
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

            }//while结束
            drawHeight = drawY + this.lineSpace;
            //var width = drawX,;
            //渲染
            this.setAllPos(drawWidth, drawHeight);
            //渲染完毕
            // if(facePos== "0"){
            //      //左边
            //      /*face.x=100;
            //       face.y=100;*/
            //
            //
            // }else {
            //      //右边
            //      /*face.x=100;
            //       face.y=100;*/
            // }
            //没等待，要跳过


            //console.log("渲染完毕-------------------------------------------------------");
            //tv.canvas.lifeLine.talkIndex++;
        }
        if (this._sp_back instanceof OSprite) {
            if (this._sp_back.texts.length <= 0) {
                //this.isEnd = true;
                //this.messageShowing = false;
                if (tv.canvas.lifeLine.loadSaveData > 0) {
                    tv.canvas.lifeLine.loadSaveData--;
                    if (tv.canvas.lifeLine.loadSaveData > 0) {
                        // tv.canvas.lifeLine.talkIndex++;
                         tv.canvas.lifeLine.drawLoadItem();
                    }
                } else {
                    tv.canvas.lifeLine.loadingItem = false;
                    tv.canvas.lifeLine.loadingIteming = false;
                }
                this.isEnd = true;
                this.messageShowing = false;
                this.showingText = "";
                waitPress = false;
                // tv.canvas.lifeLine.talkIndex++;
            }
        }
        if (messageText.length > 0) {
            this.messageShowing = true;
            this.refresh();
        }
    };

    this.isSpeedRead = function () {
        return onTouchLong || tv.system.quickRun;
    };
    this.isNextMessage = function () {
        if(this.isLoad){
            return true;
        }
        return onClick();
    };

    this.isAutoNext = function () {
        return tv.system.autoRun;
    };

    this.visible = function (f) {
        talkWin.visible = f;
        nameWin.visible = f;
        face.visible = f;
        talkMsg.visible = f;
        this.setFontVisible(f);
        if (faceBorder != null) {
            faceBorder.visible = f;
        }
        for (var i = 0; i < buttons.length; i++) {
            if (buttons[i] != null) {
                buttons[i].setVisible(isMobile ? false : f);// 0415 f
            }
        }

    };


    this.setXY = function (x, y) {//改变item的x,y值

    };
    this.isClickSelf = function () {
        if (this._eventList.length > 0) {
            var TouchX = onTouchX - this._sp_back.viewport.ox;
            var TouchY = onTouchY - this._sp_back.viewport.oy;
            if (TouchX > this._sp_back.x + this._sp_back.viewport.x + this._sp_back.width * this._sp_back.zoom_x ||
                TouchX < this._sp_back.x + this._sp_back.viewport.x || TouchY > this._sp_back.y + this._sp_back.viewport.y + this._sp_back.height * this._sp_back.zoom_y ||
                TouchY < this._sp_back.y + this._sp_back.viewport.y) {
                return false;
            }
            onClick();
            return true;
        }
        return false;
    }
    this.update = function () {

        //if(this._eventList.length>0){
        if (onTouchClick && this.isClickSelf()) {

            if (this.liftInter == null || this.liftInter.isFinish()) {
                this.liftInter = null;
                this.liftInter = new IMain();
                this.liftInter.isCui = true;
                this.liftInter.jumpStory(this._eventList);
            }
            return true;
        }
        if (this.liftInter) {
            this.liftInter.UpdateSCUI(true);
        }
        //}
        if (!this.loadingMsgBack) {

            this.updateMessage(fastShowText);
        }
    };

    //根据上下左右宽高拉伸图片
    this.stretImage = function (sp, posArr, width, height) {
        sp.stretImage(posArr, width, height);
    };

    this.setAllPos = function (width, height) {
        // var self = this;
        //stretPos
        var posIndex = self.index;
        var paoHeight = self._top_margin + parseInt(height) + self._bottom_margin;
        var paoWidth = self._left_margin + parseInt(width) + self._right_margin;

        self._itemWith = self._sp_face.width + faceSpace + paoWidth;
        if (faceH) {
            if (faceH > paoHeight) {
                self._itemHeight = faceH;
            } else {
                self._itemHeight = paoHeight;
            }
        } else {
            self._itemHeight = paoHeight;
        }

        function next() {
            var lheight = 0;
            if (posIndex > 0) {
                if (tv.canvas.lifeLine.talkMsg.length > 0) {
                    preMsg = tv.canvas.lifeLine.talkMsg[self.index - 1];
                }
                self._y = preMsg._y + preMsg._itemHeight + 5;
                //console.log('preMsg----',preMsg._y , preMsg._itemHeight);
                //默认情况
                if (preMsg._sp_back instanceof OSprite) {
                    //头像的位置
                    self._sp_face.y = self._y;
                    self._sp_back.y = self._y;
                } else {
                    self._sp_face.y = preMsg._sp_back.getY() + preMsg._sp_back.height() + 5;
                    self._sp_back.y = preMsg._sp_back.getY() + preMsg._sp_back.height() + 5;
                    //talkMsg[posIndex].y = talkMsg[posIndex-1].getY()+talkMsg[posIndex-1].height() + 5;
                }
            } else if (posIndex == 0) {
                if (self._sp_back) {
                    self._sp_face.y = 0;
                    self._sp_back.y = 0;
                }
                self._y = 0;
            }
            //x
            if (setLocal && parseInt(setLocal[0]) == 1 && parseInt(setLocal[1]) > 0) {
                self._x = parseInt(setLocal[1]);
                if (facePos == 0) {
                    //左边
                    self._sp_face.x = parseInt(setLocal[1]);
                    self._sp_back.x = parseInt(setLocal[1]) + paoWidth + faceSpace;
                } else if (facePos == 1) {
                    //右边
                    self._sp_back.x = parseInt(setLocal[1]);
                    self._sp_face.x = parseInt(setLocal[1]) + paoWidth + faceSpace;
                }
            } else {
                self._x = 0;
                if (facePos == 0) {
                    //左边
                    self._sp_face.x = 0;
                    self._sp_back.x = self._sp_face.x + self._sp_face.width + faceSpace;

                } else if (facePos == 1) {
                    //右边
                    self._sp_face.x = self._viewPort.width - faceSpace - self._sp_face.width;
                    self._sp_back.x = self._sp_face.x - paoWidth - faceSpace;
                } else {
                    //没有设置头像
                    self._sp_back.x = 0;
                }
            }


            /*if(self._sp_back instanceof OSprite){

             var MsgH = self._sp_back.y + self._sp_back.getStretHeight();
             var faceH = self._sp_face.y + self._sp_face.getStretHeight();
             console.log('#_#',self._sp_face.y,self._sp_face.getStretHeight(),self._itemHeight);
             if(MsgH>faceH){
             lheight = MsgH;
             }else{
             lheight = faceH;
             }
             //console.log("lheight--11",lheight);

             }else{
             var MsgH = self._sp_back.getY()+self._sp_back.height();
             var faceH = self._sp_face.getY()+self._sp_face.height();
             if(MsgH>faceH){
             lheight = MsgH;
             }else{
             lheight = faceH;
             }
             //console.log("lheight--22",lheight);

             }*/
            lheight = self._itemHeight + self._y + self._viewPort.oy;
            self.setStretPos(lheight, posIndex);


        }

        if (self.MsgBack) {

            getImage(self.MsgBack, function () {

                self._sp_back.setBitmap(self.MsgBack);
                self.stretImage(self._sp_back, self.stretPos, width, height);
                if (faceH) {
                    if (faceH > paoHeight) {
                        self._sp_back.stretImgHeight = faceH;
                    }
                }
                next();
                self._sp_back.visible = self.backVisible;
                self._sp_face.visible = self.faceVisible;
                this.isEnd = true;
                if (tv.canvas.lifeLine.loadSaveData <= 0 &&  tv.canvas.lifeLine.loadingItem) {
                    tv.canvas.lifeLine.loadingItem = false;
                    this.messageShowing = false;
                    tv.canvas.lifeLine.loadingIteming = false;
                    // tv.inter.UpdateSCUI(true);
                    // tv.canvas.lifeLine.isEnd = true;

                }


            });
        }

    };
    this.setStretPos = function (height, posIndex) {
        //gGameHeight
        var slideH;
        if (self._viewPort.height <= gGameHeight) {
            slideH = self._viewPort.height;
        } else {
            slideH = gGameHeight;
        }
        var endPos = this._y + this._itemHeight;
        if (tv.canvas.lifeLine.oListView.isMove) {
            return;
        } else {
            tv.canvas.lifeLine.oListView.setListHeight(endPos);
        }
        if (!tv.canvas.lifeLine.oListView.isMove) {
            if (height > slideH) {
                if (self._viewPort) {
                    self._viewPort.scrollY = true;
                    //self._viewPort.oy = self._viewPort.oy-(height-slideH);
                    self._viewPort.OFrames = parseInt(this._wait_frame);

                    self._viewPort.tmpOY = self._viewPort.oy;
                    self._viewPort.endOY = self._viewPort.oy - (height - slideH);
                    self._viewPort.diffOY = (self._viewPort.endOY - self._viewPort.tmpOY) / self._viewPort.OFrames
                }
            }
        }
        //console.log('1',tv.canvas.lifeLine.talkMsg.length);

        /*//console.log('talkmsg---',tv.canvas.lifeLine.talkMsg);
         for(var i = 0;i<=posIndex;i++){
         var curTalkMsg = tv.canvas.lifeLine.talkMsg[i];
         if(curTalkMsg){
         var curBack = tv.canvas.lifeLine.talkMsg[i]._sp_back;
         var curFace = tv.canvas.lifeLine.talkMsg[i]._sp_face;
         if(curBack instanceof OSprite) {
         //if (curTalkMsg._y + curTalkMsg._itemHeight <= 0) {
         if (curTalkMsg._y + curTalkMsg._itemHeight <= 0) {
         curTalkMsg.dispose();
         tv.canvas.lifeLine.talkMsg.shift();
         tv.canvas.lifeLine.talkIndex--;
         //tv.canvas.lifeLine.talkMsg.push(null);
         }
         }else{
         if (curBack.getY() + curBack.height() < 0) {
         curTalkMsg.dispose();
         tv.canvas.lifeLine.talkMsg.shift();
         tv.canvas.lifeLine.talkIndex--;
         //tv.canvas.lifeLine.talkMsg.push(null);
         }
         }
         }

         }*/
    };

    this.cloneObject = function (obj) {
        var o = obj.constructor === Array ? [] : {};
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                o[i] = typeof obj[i] === "object" ? cloneObject(obj[i]) : obj[i];
            }
        }
        return o;
    };
    this.refresh = function () {
        //drawX = 0;
        //drawY = 0;
        // console.log('messageText---',messageText);
        drawWait = 0;
        waitPress = false;
        this.showingText = "";
        //talkMsg[talkIndex].drawText("",0,0);
        //talkMsg[talkIndex].texts.length = 0;
        color = tv.data.System.FontTalkColor;
        tv.system.replay.Add(messageText);
        tv.system.replay.Add(" ");
        this.showingText = new String(messageText);
        this.showingText = this.TextAnalysis(this.showingText);
        messageText = "";
    };

    this.TerminateMessage = function () {
        this.isEnd = true;
        drawX = 0;
        drawY = 0;
        this.messageShowing = false;
        this.showingText = "";
        drawWait = 0;
        waitPress = false;
        jumpTheMsg = false;
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
    };

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
    };

    this.TextToTemp = function (s, e, rex) {
        var tmp = this.showingText.substring(this.showingText.indexOf(s) + 1,
            this.showingText.indexOf(e));
        this.showingText = this.showingText.substring(tmp.length + s.length + e.length, this.showingText.length);
        var temp1 = tmp.replaceAll(rex, "$1");
        var temp2 = temp1.replaceAll(" ", "");
        return temp2;
    };

    this.TextToTemp2 = function (str, s, e, rex) {
        var tmp = str.substring(str.indexOf(s) + 1, str.indexOf(e));
        str = str.substring(tmp.length + s.length + e.length, str.length);
        var arr = new Array(tmp.replaceAll(rex, "$1"), str);
        return arr;
    };

    this.isShowing = function () {
        return this.messageShowing || this.showingText.length > 0;
    }


    this.dispose = function () {
        this._sp_back.dispose();
        this._sp_face.dispose();
        this._eventList = null;
    };

    this.saveArgs = function (arr) {
        arr.push("Argv|");
        arr.push(e.Code + "|");
        arr.push(e.Indent + "|");
        for (var i = 0; i < e.Argv.length; i++) {
            arr.push(e.Argv[i] + "|");
        }
        //arr.push(talkIndex+"|");
        //for(var i=0;i<talkIndex;i++){
        //    if(talkMsg[i]){
        //        if(talkMsg[i] instanceof OSprite){
        //            arr.push("os|");
        //            if(talkMsg[i].getBitmap()){
        //                arr.push(+"|");
        //            }else{
        //                arr.push("|");
        //            }
        //            arr.push(talkMsg[i].x+","+talkMsg[i].y+"|");
        //        }else{
        //            arr.push("ob|");
        //        }
        //    }
        //}

    };

    this.loadArgs = function (arr) {

        //if(arr[0] == "Argv"){
        //    arr.shift();
        //    var code = parseInt(arr.shift());
        //    //var  = arr.shift();
        //    var indent = parseInt(arr.shift());
        //    var argv = new Array(6);
        //    argv[0] = arr.shift();
        //    argv[1] = arr.shift();
        //    argv[2] = arr.shift();
        //    argv[3] = arr.shift();
        //    argv[4] = arr.shift();
        //    argv[5] = arr.shift();
        //    //arr.shift();
        //    var event = new DEvent1(code,indent,null,argv);
        //}
        //console.log(arr);
        ////drawX=0;
        ////drawY=0;
        ////var isMsg = parseInt(arr.shift()) != 0;
        ////if(isMsg){
        ////    var targs = new Array(parseInt(arr.shift()));
        ////    for(var i = 0 ; i < targs.length ; ++i){
        ////        targs[i] = arr.shift();
        ////    }
        ////    this.Talk(targs,false);
        ////}
        //console.log(talkMsg);
    }
}
var cLifelineitem = new CLifeLineItem();