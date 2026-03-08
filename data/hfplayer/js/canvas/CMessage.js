/**
 * Created by 七夕小雨 on 2014/11/23.
 */
function CMessage(){
    this.bitMapFontArr = new Array();
    this.nameBitMapArr = new Array();

    if(tv.data.System.FontSize>34){
        tv.data.System.FontSize=34;
    }

    var self=this;
    //对话框初始化部分
    var data = tv.data.System.MessageBox;
    var imaget = new Image();
    if(fileList[("Graphics/UI/" + data.Talk.backimage).toLowerCase().replace(/\\/g,'/')]){
        var path = ("Graphics/UI/" + data.Talk.backimage).toLowerCase().replace(/\\/g,'/');
        imaget.src = fileListFato(path,'imaget in CMessage from CMessage.js');
    }
    var talkWin = new OSprite(imaget,null);
    talkWin.x = data.Talk.backX;
    talkWin.y = tv.data.Headr.GHeight - (data.Talk.backY + TalkWin.Height);
    talkWin.visible = true;
    var talkMsg = new OSprite(null,null);
    //this.lineHeight = tv.fontBitmapData.maxH;
    this.lineHeight = bitmapFont.fontBitmapData.maxH;
    var lineSpace = this.lineHeight*1.5; //16 * 2.3
    var imagen = new Image();
    if(fileList[("Graphics/UI/" + data.Name.backimage).toLowerCase().replace(/\\/g,'/')]){
        var pathGen = ("Graphics/UI/" + data.Name.backimage).toLowerCase().replace(/\\/g,'/')
        imagen.src = fileListFato(pathGen,'imagen in CMessage from CMessage.js');
    }
    var nameWin = new OSprite(imagen,null);
    nameWin.x = talkWin.x + data.Name.backX;
    nameWin.y = talkWin.y + data.Name.backY;
    nameWin.visible = true;



    var faceBorder = null;
    //高级中用到的背景
    var imageBack=new Image();
    //判断是否点击隐藏
    var isClickHide=false;
    //判断橙光菜单是否关闭
    this.isCGClose=false;
    //判断菜单是否关闭
    this.isCMClose=false;

    if(data.faceInMessageBox()){
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

    }
    var face = new OSprite(null,null);
    face.visible = false;
    var showingText = "";
    var messageText = "";

    var color = tv.data.System.FontTalkColor;
    //临时变量系列
    var isFace = false;//是否有头像
    var tempBackV = false;
    var tempNameV = false;
    var tempFaceV = false;
    var tempFaceBV = false;
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
    //线上为3 
    //var SHOWTEXTNUBER = 3;
    var SHOWTEXTNUBER = 0;
    //如果是flash就放开
    if(mark == "isFlash"){
        SHOWTEXTNUBER = 0;
    }

    //强调对话人的旧的数值
    var oldPicArr;
    var isResave=false;

    //滚动字幕
    this.isRoll=false;

    //0325 移动端
    //var isMobile = tv.isMobile;
    var isMobile = true;



    //menu
    var buttons = new Array(data.Talk.buttons.length);
    var types = new Array("Save" , "Load" , "Menu" , "Replay" , "Auto");
    for (var i = 0; i < buttons.length; ++i) {
        var b = tv.data.System.Buttons[data.Talk.buttons[i].index];
        if(b.image1.IsNil() || b.image2.IsNil()) continue;
        var button = new OButton(b.image1 + "",b.image2 + "","",null,false,false);
        button.setX(talkWin.x + data.Talk.buttons[i].x);
        button.setY(talkWin.y + data.Talk.buttons[i].y);
        button.setVisible(!isMobile);//0415 true
        button.tag = types[i];
        buttons[i] = button;
    }

    this.getisRoll = function(){
        return isMobile;
    }

    this.cloneObject =function(obj){
        var o = obj.constructor === Array ? [] : {};
        for(var i in obj){
            if(obj.hasOwnProperty(i)){
                o[i] = typeof obj[i] === "object" ? cloneObject(obj[i]) : obj[i];
            }
        }
        return o;
    };

    this.visible = function(f){
        talkWin.visible = f;
        nameWin.visible = f;
        face.visible = f;
        talkMsg.visible = f;
        this.setFontVisible(f);
        if(faceBorder != null){
            faceBorder.visible = f;
        }
        for(var i = 0;i<buttons.length;i++){
            if(buttons[i] != null){
                buttons[i].setVisible(isMobile ? false : f);// 0415 f
            }
        }

    }

    this.msgboxFadeIn = function(){
        talkWin.visible = tempBackV;
        talkMsg.visible = tempBackV;
        this.setFontVisible(tempBackV);
        nameWin.visible = tempNameV;
        face.visible = tempFaceV;
        if(faceBorder != null){
            faceBorder.visible = tempFaceBV;
        }
        for(var i = 0;i<buttons.length;i++){
            if(buttons[i] != null){
                buttons[i].setVisible(isMobile ? false : tempButtonV);//tempButtonV 0415
            }

        }
        ////pmenu.visible = isMobile ? tempButtonV : false;
    }
    this.setFontVisible = function(bool){
        if(this.nameBitMapArr.length>0){
            for(var i =0;i<this.nameBitMapArr.length;i++){
                if(this.nameBitMapArr[i]){
                    this.nameBitMapArr[i].visible = bool;
                }
            }
        }
        if(this.bitMapFontArr.length>0){
            for(var i=0;i<this.bitMapFontArr.length;i++){
                this.bitMapFontArr[i].visible = bool;
            }
        }
    }
    this.clearFontDispose = function(){
        if(this.bitMapFontArr.length>0){
            for(var i=0;i<this.bitMapFontArr.length;i++){
                this.bitMapFontArr[i].dispose();
            }
            this.bitMapFontArr.length = 0;
        }
        if(this.nameBitMapArr.length>0){
            for(var i =0;i<this.nameBitMapArr.length;i++){
                if(this.nameBitMapArr[i]){
                    this.nameBitMapArr[i].dispose();
                }
            }
            this.nameBitMapArr.length=0;
        }
    }
    this.msgBoxFadeOut = function(){
        tempBackV = talkWin.visible;
        tempNameV = nameWin.visible;
        tempFaceV = face.visible;
        if(faceBorder != null){
            tempFaceBV = faceBorder.visible;
        }
        tempButtonV = tempBackV;
        talkWin.visible = false;
        talkMsg.visible = false;
        this.setFontVisible(false);
        nameWin.visible = false;
        face.visible = false;
        if(faceBorder != null){
            faceBorder.visible = false;
        }
        for(var i = 0;i<buttons.length;i++){
            if(buttons[i] != null){
                buttons[i].setVisible(false);
            }
        }
    }

    this.msgScreenRoll= function (str,Args) {
        var AAar=Args.split('|');
        //0：开关、1：帧数、2：起始相对位置类型X,Y(0左(上) 1中 2右(下))、3：终止相对位置类型X,Y(同前)、4：起始位置X,Y、5：终点位置X,Y
        var txt_switch=AAar[0];
        if(txt_switch==1){
            var txt_fps=AAar[1];
            var txt_start_type=AAar[2];
            var txt_end_type=AAar[3];
            var txt_start_pos=AAar[4];
            var txt_end_pos=AAar[5];
            //类型
            var txt_start_type_x=AAar[2].split(',')[0];
            var txt_start_type_y=AAar[2].split(',')[1];
            var txt_end_type_x=AAar[3].split(',')[0];
            var txt_end_type_y=AAar[3].split(',')[1];
            //坐标
            var txt_start_pos_x=AAar[4].split(',')[0];
            var txt_start_pos_y=AAar[4].split(',')[1];
            var txt_end_pos_x=AAar[5].split(',')[0];
            var txt_end_pos_y=AAar[5].split(',')[1];
            var sx,sy,ex,ey;
            switch (parseInt(txt_start_type_x)){
                //0左 1中 2右  default自定义
                case 0:
                    sx=0;
                    break;
                case 1:
                    sx=gGameWidth/2;
                    break;
                case 2:
                    sx=gGameWidth;
                    break;
                default :
                    sx=txt_start_pos_x;
                    break;
            }
            switch (parseInt(txt_start_type_y)){
                //0上 1中 2下  default自定义
                case 0:
                    sy=0;
                    break;
                case 1:
                    sy =gGameHeight/2;
                    break;
                case 2:
                    sy=gGameHeight;
                    break;
                default :
                    sy=txt_start_pos_y;
                    break;
            }
            switch (parseInt(txt_end_type_x)){
                //0左 1中 2右  default自定义
                case 0:
                    ex=0;
                    break;
                case 1:
                    ex=gGameWidth/2;
                    break;
                case 2:
                    ex=gGameWidth;
                    break;
                default :
                    ex=txt_end_pos_x;
                    break;
            }
            switch (parseInt(txt_end_type_y)){
                //0上 1中 2下  default自定义
                case 0:
                    ey=0;
                    break;
                case 1:
                    ey=gGameHeight/2;
                    break;
                case 2:
                    ey=gGameHeight;
                    break;
                default :
                    ey=txt_end_pos_y;
                    break;
            }
            //sx=sx- data.Talk.textX;
            //sy=sy- data.Talk.textY;

            g.font = tv.data.System.FontSize + "px " +fontName;
            var strArr=str.split('\\n');
            var width=0;
            var height=0;
            /*if(strArr.length>0){
             for(var i=0;i<strArr.length;i++){
             if(g.measureText(strArr[i]).width>width){
             width=g.measureText(strArr[i]).width;
             }
             }
             height=strArr.length*lineSpace;
             }else{
             width=g.measureText(str).width;
             height=lineSpace;
             }
             */
            if(strArr.length>0){
                var strContLArr = new Array();
                for(var i=0;i<strArr.length;i++){
                    var strCount = this.TextAnalysisNull(strArr[i]);
                    width=parseInt(bitmapFont.fontBitmapData.maxW)*strCount.length;
                    strContLArr.push(width);
                }
                function sortNumber(a, b){
                    return b - a
                }
                strContLArr.sort(sortNumber);
                width=strContLArr[0];
                height=strArr.length*lineSpace;
            }else{
                width= bitmapFont.fontBitmapData.maxW;
                height=lineSpace;
            }
            if(sx<=0||parseInt(txt_start_type_x)==3){
                sx=sx - data.Talk.textX;
            }else if(parseInt(txt_start_type_x)==1){
                sx=sx -data.Talk.textX-width/2;
            }else{
                sx=sx -data.Talk.textX-width;
            }
            //sx=sx- data.Talk.textX;
            /*if(parseInt(txt_start_type_y) == 1){
                sy=sy- data.Talk.textY-height/2;
            }else{
                sy=sy- data.Talk.textY;
            }*/
            if(sy<=0||parseInt(txt_start_type_y)==3){
                sy=sy - data.Talk.textY;
            }else if(parseInt(txt_start_type_y)==1){
                sy=sy -data.Talk.textY-height/2;
            }else{
                sy=sy -data.Talk.textY-height;
            }

            if(ex<=0||parseInt(txt_end_type_x)==3){
                ex=ex - data.Talk.textX;
            }else if(parseInt(txt_end_type_x)==1){
                ex=ex -data.Talk.textX-width/2;
            }else{
                ex=ex -data.Talk.textX-width;
            }
            if(ey<=0||parseInt(txt_end_type_y)==3){
                ey=ey - data.Talk.textY;
            }else if(parseInt(txt_end_type_y)==1){
                ey=ey -data.Talk.textY-height/2;
            }else{
                ey=ey -data.Talk.textY-height;
            }
            //if(ex<=0||parseInt(txt_end_type_x)==3){
            //    ex=ex - data.Talk.textX;
            //}else if(parseInt(txt_end_type_x)==1){
            //    ex=ex -data.Talk.textX-width/2;
            //}else{
            //    ex=ex -data.Talk.textX-width;
            //}
            //0上  1中 2下  3 自定义
            //ey=ey - data.Talk.textY;
            /*if(ey<=0||parseInt(txt_end_type_y)==3){
                ey=ey - data.Talk.textY;
            }else{
                ey=ey - data.Talk.textY-height;
            }*/
            //if(parseInt(txt_end_type_y) == 0){
            //    ey= 0 -
            //
            //}
            //if(parseInt(txt_end_type_y) == 1){
            //    ey=ey - data.Talk.textY-height/2;
            //}else{
            //    ey=ey - data.Talk.textY;
            //}

            //位置初始化
            talkMsg.x=sx;
            talkMsg.y=sy;
            talkMsg.tag ="bitmapFont";
            //移动
            talkMsg.SlideTo(ex,ey,txt_fps/2);
        }else{
            //停止移动
            talkMsg.StopTrans();
        }
    }

    this.megboxClear = function(){
        drawX = drawY =0;
        nameWin.drawText("",0,0);
        talkMsg.texts.length = 0;//0115 sprite是复用并为重置 重新开始游戏会显示talkmsg上次保存的内容 直至第一次刷新被替换掉
        this.clearFontDispose();
        waitPress = false;//0115 重新开始游戏后waitPress标志未被清除 第一句无法正常显示
        showingText = "";
        messageText = "";
    }

    this.isShowing = function(){
        return messageShowing || showingText.length > 0;
    }

    this.isShow = function(){
        return talkWin.visible || messageText.length > 0;
    }

    this.messageTextisNull = function(){
        return !talkMsg.visible && !nameWin.visible;
    }

    this.getHeight = function(){
        return talkWin.height;
    }

    this.setMessagePosition = function(pos){
        talkWin.x = data.Talk.backX;
        talkWin.getRect();
        nameWin.getRect();
        if(faceBorder != null){
            faceBorder.getRect();
        }
        switch (pos){
            case 0 :
                talkWin.y = data.Talk.backY;
                break;
            case 1:
                talkWin.y = (tv.data.Headr.GHeight - talkWin.height) / 2;
                break;
            case 2:
                talkWin.y = tv.data.Headr.GHeight - (data.Talk.backY + talkWin.height);
                break;
        }
        talkMsg.x = talkWin.x;
        talkMsg.y = talkWin.y;
        nameWin.x = parseInt(talkWin.x) + parseInt(data.Name.backX);
        nameWin.y = parseInt(talkWin.y) + parseInt(data.Name.backY);
        for(var i =0;i<buttons.length;i++){
            var button = buttons[i];
            if(button == null) continue;
            button.setX(talkWin.x + data.Talk.buttons[i].x);
            button.setY(talkWin.y + data.Talk.buttons[i].y);
        }
        if(faceBorder != null){
            faceBorder.y = talkWin.y + data.Talk.FaceBorderY;
        }
    }

    this.setHightMessagePosition = function(pos,x,y){
        talkWin.x = x;
        talkWin.y = y;
        talkWin.getRect();
        nameWin.getRect();
        if(faceBorder != null){
            faceBorder.getRect();
        }
        talkMsg.x = talkWin.x;
        talkMsg.y = talkWin.y;
        nameWin.x = parseInt(talkWin.x) + parseInt(data.Name.backX);
        nameWin.y = parseInt(talkWin.y) + parseInt(data.Name.backY);
        for(var i =0;i<buttons.length;i++){
            var button = buttons[i];
            if(button == null) continue;
            button.setX(talkWin.x + data.Talk.buttons[i].x);
            button.setY(talkWin.y + data.Talk.buttons[i].y);
        }

        if(faceBorder != null){
            faceBorder.y = talkWin.y + data.Talk.FaceBorderY;
        }
    }

    this.Talk = function(args,showUpdate){
        //tv.scene=new SCGMenu2(function () {
        //});
        //this.isEnd = false;
        this.clearNameBitmapFont();
        Args = this.cloneObject(args);
        fastShowText = showUpdate;
        talkWin.visible = args[7] == "1";
        talkMsg.visible = args[2].length > 0;
        nameWin.visible = args[0].length > 0;
        drawSpeed = parseInt(args[6]);

        if(mark == "isFlash"){
            //fast---centre---low
            if(fontSpeedWeb == "fast"){
                //超快字速  6：语速(0"极快", 1"很快", 2"一般", 3"较慢", 4"极慢")
                drawSpeed = 0;
            }else if(fontSpeedWeb == "center"){
                //较快字速-----已经是0 就不必快了
                if(drawSpeed){
                    drawSpeed = drawSpeed-1;
                }
            }
        }

        for(var i = 0;i<buttons.length;i++){
            if(buttons[i] != null){
                buttons[i].setVisible(isMobile ? false : talkWin.visible);// talkWin.visible
            }
        }
        //对话框
        if(Args[16]){
            var msgArr=Args[16].split('|');
            //背景图更换开关，背景图 | 是否自定义XY，X，Y | 强调说话人开关，图层编号，类型 | 双重对话，上或下，点后是否消失
            //目前支持临时更换背景图，更改xy坐标
            //["0,0", "1,0,290", "0,无,0", "0,0,0"]
            var back=msgArr[0].split(','); //背景图更换开关，背景图
            var setLocal=msgArr[1].split(','); //是否自定义XY，X，Y
            var talkPerson=msgArr[2].split(','); //强调说话人开关，图层编号，类型
            var talkMore=msgArr[3].split(','); //双重对话，上或下，点后是否消失

            //强调对话人
            if(talkPerson){
                if(parseInt(talkPerson[0])==1) {
                    isResave=true;
                    oldPicArr=new Array();
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
                        pic.Scale(pic.zoom_x,pic.zoom_y,1.15,1.15,5);
                        pic.Slide(pic.x,pic.y,x,y,5);
                    }
                }else{
                    oldPicArr=null;
                }
            }else{
                oldPicArr=null;
            }

            //isClickHide控制点后消失 双重对话  上或下，点后是否消失
            if(talkMore){
                if(parseInt(talkMore[2])==1){
                    isClickHide=true;
                }else{
                    isClickHide=false;
                }
            }
            //更改背景图片
            if(back[0]==1){
                var pathBack = ("Graphics/UI/" + back[1]).toLowerCase().replace(/\\/g,'/');
                imageBack.src=fileListFato(pathBack,'imageBack in Talk from CMessage.js');
                talkWin.image=imageBack;
                talkWin.image.onload=function(){
                    talkWin.height=imageBack.height;
                    talkWin.width=imageBack.width;
                }
            }else{//默认
                talkWin.image=imaget;
                talkWin.height=imaget.height;
                talkWin.width=imaget.width;

            }
            if(setLocal[0]==1){
                this.setHightMessagePosition(parseInt(args[5]),setLocal[1],setLocal[2]);
            }else{
                if(tv.canvas.msgIndex==1){//上的默认位置
                    this.setHightMessagePosition(parseInt(args[5]),data.Talk.backX,data.Talk.backY);
                }else{
                    this.setMessagePosition(parseInt(args[5]));
                }
            }
        }else{
            talkWin.image=imaget;
            talkWin.height=imaget.height;
            talkWin.width=imaget.width;
            talkWin.visible = args[7] == "1";

            this.setMessagePosition(parseInt(args[5]));
        }
        if(nameWin.visible){
            nameWin.drawText("",0,0);
            var showstr = this.madeString(args[0], 0, 100);//0130 字符串里面的变量替换掉
            tv.system.replay.Add(showstr);//args[0]
            var fontColor = new OColor(args[1]).getColor();

            if(args[1]){
                fontColor = new OColor(args[1]).getColor();
            }else{
                fontColor = color.getColor();
            }
            if(data.Name.isCenter){
                var showstrBit;
                var difW = 0;
                var showstrNum =showstr.length;
                var maxW = bitmapFont.fontBitmapData.maxW*showstrNum;
                var maxH = bitmapFont.fontBitmapData.maxH;
                var x = (nameWin.width - maxW)/2;
                var y = (nameWin.height - maxH)/ 2; //0108 jhy +5 测试值
                var nameW = 0;
                for(var i=0;i<showstrNum;i++){
                    showstrBit = showstr.substring(0,1);
                    showstr=showstr.substring(1);
                    nameWin.color = fontColor;
                    var nameBitMap = bitmapFont.findBitmapTxt(showstrBit,nameWin.color);
                    nameBitMap.setZ(3100);
                    nameBitMap.x= nameWin.x+difW;
                    nameBitMap.y= nameWin.y+y;
                    nameW += nameBitMap.width;
                    this.nameBitMapArr.push(nameBitMap);
                    w = nameBitMap.width;
                    difW+=w;
                }
                if(this.nameBitMapArr.length>0){
                    var dix = (nameWin.width - nameW)/2;
                    for(var i = 0;i<this.nameBitMapArr.length;i++){
                        this.nameBitMapArr[i].x+=dix;
                    }
                }
            }else{
                nameWin.color = new OColor(args[1]).getColor();
                var showstrBit;
                var difW = 0;
                if(Args[16]){
                    var x=parseInt(talkWin.x)+parseInt(data.Name.backX)+data.Name.textX;
                    var y=parseInt(talkWin.y)+parseInt(data.Name.backY)+data.Name.textY;
                    var showstrNum =showstr.length;
                    for(var i=0;i<showstrNum;i++){
                        showstrBit = showstr.substring(0,1);
                        showstr=showstr.substring(1);
                        var nameBitMap = bitmapFont.findBitmapTxt(showstrBit,nameWin.color);
                        nameBitMap.setZ(3100);
                        nameBitMap.x = x+difW;
                        nameBitMap.y = y;
                        this.nameBitMapArr.push(nameBitMap);
                        var w = nameBitMap.width;
                        difW+=w;
                    }
                }else{
                    var showstrNum =showstr.length;
                    for(var i=0;i<showstrNum;i++){
                        showstrBit = showstr.substring(0,1);
                        showstr=showstr.substring(1);
                        var nameBitMap =bitmapFont.findBitmapTxt(showstrBit, nameWin.color);
                        nameBitMap.setZ(3100);
                        nameBitMap.x = nameWin.x+data.Name.textX+difW;
                        nameBitMap.y = data.Name.textY+nameWin.y;
                        this.nameBitMapArr.push(nameBitMap);
                        var w = nameBitMap.width;
                        difW+=w;
                    }
                }

            }
        }
        //this.setfacePos(args);
        //滚动字幕
        if(Args[17]&&parseInt(Args[17])!=0){
            //解析移动
            this.isRoll=true;
            self.msgScreenRoll(Args[2],Args[17]);
        }else{
            //停止移动
            this.isRoll=false;
            talkMsg.StopTrans();
        }
        messageText = args[2];
        this.setfacePos(args);
        messageShowing = true;
        this.updateMessage(fastShowText);

    };
    this.setfacePos = function (args){
        faceOfsX = 0;
        face.visible = talkMsg.visible && args[3].length > 0;
        if(faceBorder != null){
            faceBorder.visible = face.visible;
        }
        if(face.visible){
            isFace = true;
            face.setBitmap(null);
            var image = new Image();
            var path = ("Graphics/Face/" + args[3]).toLowerCase();
            image.src = fileListFato(path,'image in setfacePos from CMessage.js');

            var self = this;
            getImage(image, function (img) {
                if(img == null){
                    return;
                }
                image =img;
                face.setBitmap(image);
                if(args[4] == "0"){
                    switch (data.FaceStyle){
                        case 0:
                            faceOfsX = face.width;
                            face.x = talkWin.x;
                            face.y = talkWin.y + talkWin.height - face.height;
                            break;
                        case 1:
                            faceBorder.x = talkWin.x + data.Talk.FaceBorderX;
                            face.x = faceBorder.x;
                            face.y = faceBorder.y + faceBorder.height - face.height;
                            faceOfsX = 0;
                            break;
                        case 2:
                            faceOfsX = 0;
                            face.x = talkWin.x;
                            face.y = talkWin.y - face.height;
                            break;
                    }
                }else {
                    faceOfsX = 0;
                    switch (data.FaceStyle){
                        case 0:
                            face.x = talkWin.x + talkWin.width - face.width;
                            face.y = talkWin.y + talkWin.height - face.height;
                            break;
                        case 1:
                            faceBorder.x = talkWin.x + talkWin.width;
                            face.x = faceBorder.x-face.width;
                            face.y = faceBorder.y + faceBorder.height - face.height;
                            break;
                        case 2:
                            face.x = talkWin.x + talkWin.width - face.width;
                            face.y = talkWin.y - face.height;
                            break;
                    }
                }
                isFace = false;
            });
        }
    }
    this.setLevel = function(z){
        talkWin.setZ(z);
        talkMsg.setZ(z + 1);
        nameWin.setZ(z + 20);
        face.setZ(z + 10);
        if(faceBorder != null){
            faceBorder.setZ(z+11);
        }
        for(var i = 0;i<buttons.length;i++){
            if(buttons[i] != null){
                buttons[i].setZ(z + 20 + i);
            }
        }
    };

    this.dispose = function(){
        face.dispose();
        if(faceBorder != null){
            faceBorder.dispose();
        }
        talkWin.dispose();
        talkMsg.dispose();
        nameWin.dispose();
        tv.canvas.msgIndex=0;
        this.msgBoxFadeOut();
        if(buttons != null){
            for(var i = 0 ; i < buttons.length;++i){
                if(buttons[i] != null){
                    buttons[i].dispose();
                }
            }
        }
    };
    this.showFastTip = function () {
        if(tv.scene instanceof SGame ){
            if(downTime>FPS * 0.3){
                if(fastImg != null){
                    fastImg.opacity=255;
                    var src =img_base_path + "speedfast/fast"+fastTime+".png";
                    var image;
                    if(!otherImgArr[src]){
                        image=new Image();
                        image.src=src;
                    }else{
                        image = otherImgArr[src];
                    }
                    fastImg.z = 3500;
                    fastImg.setBitmap(image);
                    fastImg.x=onTouchX-image.width/2;
                    fastImg.y=onTouchY-image.height/2-20;
                    fastTime+=1;
                    if(fastTime>8){
                        fastTime = 8;
                    }
                }
            }
        }
    }
    this.update = function(){
        if(!isFace){
            this.updateMessage(fastShowText);
        }
        this.showFastTip();
    }

    this.TerminateMessage = function(){
        if(isClickHide){
            tv.canvas.msgIndex=0;
            this.msgBoxFadeOut();
        }
        if(isResave){
            isResave=false;
            for (var i = 3; i < 22; i++) {
                if (tv.canvas.GamePictrue[i]) {
                    var pic=tv.canvas.GamePictrue[i];
                    pic.zoom_x=oldPicArr[i].zoom_x;
                    pic.zoom_y=oldPicArr[i].zoom_y;
                    pic.x=oldPicArr[i].x;
                    pic.y=oldPicArr[i].y;
                    pic.opacity=oldPicArr[i].opacity;
                }
            }
        }
        messageText = "";
        messageShowing = false;
        showingText = "";
        drawWait = 0;
        waitPress = false;
    };

    this.isSpeedRead = function(){
        return onTouchLong || tv.system.quickRun;
    };

    this.isNextMessage = function(){
        return onClick();
    };

    this.isAutoNext = function(){
        return tv.system.autoRun;
    };

    /*临时*/
    //消除 文本 位图字体
    this.clearTextBitmapFont = function () {
        if(this.bitMapFontArr.length>0){
            for(var i=0;i<this.bitMapFontArr.length;i++){
                this.bitMapFontArr[i].dispose();
            }
            this.bitMapFontArr.length = 0;
        }
    };
    //消除 名字 位图字体
    this.clearNameBitmapFont = function(){
        if(this.nameBitMapArr.length>0){
            for(var i =0;i<this.nameBitMapArr.length;i++){
                if(this.nameBitMapArr[i]){
                    this.nameBitMapArr[i].dispose();
                }
            }
            this.nameBitMapArr.length=0;
        }
    }

    this.updateMenu = function(){
        if(!isMobile){
            isMobile=true;
        }
        ///分享按钮响应
//        if(pshare.isSelected() && onClick()){
//            //0330 android盒子调用android apk分享
//            if(mark == "aBox"){
//                if(typeof window.org_box == 'undefined'){
//
//                }else{
//                    window.org_box.ShareGame();
//                }
//            }else{//web 调用页面分享
//                //pshare.visible=false;
//                androidFlower();
//            }
//        }
//        ///菜单功能响应
//        if(isMobile){
//            //if(pmenu.isSelected() && onClick()){
//            if(pmenu.isSelected() && onClick()){
//                if(pmenu.respTranArea()){
//                    pmenu.setBitmap(t_img_1);
//                    this.isCMClose=true;
//                    //正常手机菜单
//                    if(tv.data.System.MenuIndex == 0 && (tv.data.System.Cuis == null || tv.data.System.Cuis.length <= 0)){
//                        tv.scene = new SMenu();
//                    }else{
//                        if(tv.data.System.MenuIndex == 10001){
//                            tv.scene = new SMenu();
//                        }else{
//                            tv.scene = new SCUI(tv.data.System.MenuIndex);
//                        }
//                    }
//                }
//
//                //0419 临时菜单相关
///*                if(tv.tempCooperation == "org"){//0417 合作方对菜单有临时需求
//                    tv.scene = new STempPhotoMenu();
//                }else{
//                    if(tv.data.System.MenuIndex == 0 && (tv.data.System.Cuis == null || tv.data.System.Cuis.length <= 0)){
//                        tv.scene = new SMenu();
//                      }else{
//                        if(tv.data.System.MenuIndex == 10001){
//                            tv.scene = new SMenu();
//                        }else{
//                            tv.scene = new SCUI(tv.data.System.MenuIndex);
//                        }
//                    }
//                }*/
//            }
//        }else{
//            for(var i = 0;i<buttons.length;i++){
//                var b = buttons[i];
//                if(b != null){
//                    b.update();
//                    if(b.isClick()) {
//                        this.buttonClick(b);
//                    }
//                }
//            }
//        }
//
//
//
//        if(cmenu.isSelected() && onClick()){
//            cmenu.setBitmap(t_img3_1);
//            //cmenu.opacity=.2;
//            this.isCGClose=true;
//            tv.scene=new SCGMenu(function (data) {
//                if(data=="close"){
//                }
//            });
//        }

    }

    this.buttonClick = function(b){
        if(b.tag === "Save"){
            tv.scene = new SSavefile(false, true);
        }else if (b.tag === "Load") {
            tv.scene = new SSavefile(false, false);
        }else if (b.tag === "Menu") {
            if(tv.data.System.MenuIndex == 0 && (tv.data.System.Cuis == null || tv.data.System.Cuis.length <= 0)){
                tv.scene = new SMenu();
            }else{
                if(tv.data.System.MenuIndex == 10001){
                    tv.scene = new SMenu();
                }else{
                    tv.scene = new SCUI(tv.data.System.MenuIndex);
                }
            }
        }else if (b.tag === "Replay" ) {
            tv.scene = new SReplay();
        }else if (b.tag === "Auto") {
            tv.system.autoRun = !tv.system.autoRun;
        }
    }

    this.updateMessage = function(f){
        //this.updateMenu();
        //if(messageText == ""){
        //    messageText=" ";
        //    //messageShowing = false;
        //    //return;
        //}
        if(pause && !f && !this.isSpeedRead()){
            if(this.isNextMessage()){
                pause = false;
                if(showingText.length <=0){
                    waitPress = true;
                }else{
                    waitPress = false;
                }
            }
            return;
        }

        if(waitPress){
            if(autoWaitCount > 0){
                autoWaitCount -= 1;
            }
            //自动进行
            if(this.isAutoNext() && autoWaitCount <= 0 && showingText.length <= 0){
                this.TerminateMessage();
                drawX = 0;
                drawY = 0;
                waitPress = false;
            }
            //快进
            if(this.isSpeedRead()||this.isNextMessage()){
                if(showingText.length <= 0){
                    this.TerminateMessage();
                }
                drawX = 0;
                drawY = 0;
                waitPress = false;
            }
            return;

        }
        var textNotSkip = true;//false
        //var directShow = true;
        //超级速度
        if(fontSpeedWeb == "fast"&&mark == "isFlash"){
            textNotSkip = false;
        }else{
            textNotSkip = true;
        }
        if(this.isSpeedRead()){
            textNotSkip = false; //true
            //directShow = false;
            drawSpeed = 0;
            drawWait = 0;
        }
        if(this.isRoll){
            textNotSkip=false;
        }
        if(showingText.length > 0){
            //textNotSkip = directShow || this.isSpeedRead();
            if(this.isNextMessage()){
                textNotSkip = false;
                drawSpeed = 0;
                drawWait = 0;
            }
            if(drawWait > 0 && !this.isSpeedRead()){
                drawWait -= 1;
                return;
            }
            var looptime = SHOWTEXTNUBER;

            var blastTextIsSpace = false;//0212 兼容作者用space来对齐的临时方法 如果检测连续两个空格，则认为它是在用空格来对齐

            while(true){
                if(showingText.length <= 0){
                    break;
                }
                var smin = showingText.substr(0,1);
                showingText = showingText.substring(1,showingText.length);
                var c = smin.charCodeAt(0);

                if(c == 200){
                    drawX = 0;
                    drawY += lineSpace;
                }else if(c == 201){
                    //drawWait += parseInt(this.TextToTemp("[","]",/\[([0-9]+)]/g));
                    var waitNum = parseInt(this.TextToTemp("[","]",/\[([0-9]+)]/g));
                    if(mark == "isFlash"){
                        drawWait += waitNum;
                    }else{
                        drawWait += Math.ceil(waitNum/2);
                    }
                }else if(c == 202){
                    color = new OColor(this.TextToTemp("[","]",/\[([0-9]+,[0-9]+,[0-9]+)]/g));
                }else if(c == 203){
                    drawSpeed = parseInt(this.TextToTemp("[","]",/\[([0-9]+)]/g));
                }else if(c == 204){
                    if(mark == "isFlash"){
                        drawWait += 10;
                    }else{
                        drawWait += Math.ceil(10/2);
                    }
                }else if(c == 205){
                    if(mark == "isFlash"){
                        drawWait += 5;
                    }else{
                        drawWait += Math.ceil(5/2);
                    }
                }else if(c == 206){
                    this.TerminateMessage();
                    break;
                }else if(c == 207){
                    if(textNotSkip){
                        pause = true;
                        break;
                    }
                }else if(c == 208){
                    var index = parseInt(this.TextToTemp("[","]",/\[([0-9]+)]/g));
                    showingText = tv.system.vars.getVar(index - 1) + showingText;
                }else if(c == 209){
                    var index = parseInt(this.TextToTemp("[","]",/\[([0-9]+)]/g));
                    showingText = tv.system.varsEx.getVar(index - 1) + showingText;
                }else if(c == 210){
                    var index = parseInt(this.TextToTemp("[","]",/\[([0-9]+)]/g));
                    // add by ysxx -↓↓↓↓↓-2014/6/4--- 投票添加
                    // --增加code判断事件类型是资源引入的类型还是文本显示类型----
                    showingText = this.madeString(tv.system.string.getVar(index - 1), 0, 210) + showingText;
                    // add by ysxx
                    // -↑↑↑↑↑-2014/6/4---------------------------------------------
                }else{
                    if(c == 32){
                        if(bitmapFont.blankSpaceW){
                            drawX += bitmapFont.blankSpaceW;
                        }else{
                            drawX+=6;
                        }
                    }else{
                        var fontSprite = bitmapFont.findBitmapTxt(smin,color.getColor());

                        fontSprite.setZ(3100);
                        //}
                        fontSprite.x = parseInt(talkMsg.x)+parseInt(data.Talk.textX) + parseInt(faceOfsX)+parseInt(drawX);
                        fontSprite.y = parseInt(talkMsg.y)+parseInt(data.Talk.textY) + parseInt(drawY);
                        //fontSprite.setZ(100);
                        var w = fontSprite.width;
                        this.bitMapFontArr.push(fontSprite);
                        //talkMsg.texts.push(new DTextA(smin,data.Talk.textX + faceOfsX + drawX, data.Talk.textY + drawY,color.getColor()));
                        drawX += w;
                    }

                    if(SHOWTEXTNUBER > 0){
                        drawWait = 0;
                    }else{
                        drawWait += drawSpeed;
                    }

                }
                if(showingText.length <= 0){
                    showingText = "";
                    waitPress = true;
                    if(this.isAutoNext()){
                        autoWaitCount = 60;
                    }
                    if(mark == "isFlash"&&fontSpeedWeb == "fast"){
                        drawWait = 0;
                    }
                }
                if(textNotSkip){
                    if(looptime > 0){
                        looptime -= 1;
                        if(looptime <= 0){
                            break;
                        }
                    }else{
                        break;
                    }

                }
            }//while结束
        }
        if(messageText.length > 0){
            messageShowing = true;
            this.refresh();
        }

    };

    this.refresh = function(){
        //drawX = 0;
        //drawY = 0;
        drawWait = 0;
        waitPress = false;
        showingText = "";
        talkMsg.drawText("",0,0);
        talkMsg.texts.length = 0;
        //this.clearFontDispose();
        this.clearTextBitmapFont();
        color = tv.data.System.FontTalkColor;
        showingText = new String(messageText);
        showingText = this.TextAnalysis(showingText);
        var replayStr=this.madeString(showingText, 0, 210);
        replayStr =this.TextAnalyRemove(replayStr);
        tv.system.replay.Add(replayStr);
        tv.system.replay.Add(" ");
        messageText = "";
    };

    /// <summary>
    /// 正则替换
    /// </summary>
    /// <param name="str">需要进行的替换的字符串</param>
    /// <returns>替换过后的字符串</returns>
    this.TextAnalysis = function(str){
        var s = new String(str);
        s = s.replaceAll(/\|[Nn]/g,String.fromCharCode(200));//0507
        s = s.replaceAll(/\\[Nn]/g,String.fromCharCode(200));
        s = s.replaceAll(/\\[Ww]\[([0-9]+)]/g,String.fromCharCode(201) + "[$1]");
        s = s.replaceAll(/\\[Cc]\[([0-9]+,[0-9]+,[0-9]+)]/g,String.fromCharCode(202) + "[$1]");
        s = s.replaceAll(/\\[Ss]\[([0-9]+)]/g,String.fromCharCode(203) + "[$1]");
        s = s.replaceAll(/\\\|/g,String.fromCharCode(204));
        s = s.replaceAll(/\\\./g,String.fromCharCode(205));
        s = s.replaceAll(/\\\>/g,String.fromCharCode(206));
        s = s.replaceAll(/\\\=/g,String.fromCharCode(207));
        s = s.replaceAll(/\\[Vv]\[([0-9]+)]/g,String.fromCharCode(208) + "[$1]");
        s = s.replaceAll(/\\[Xx]\[([0-9]+)]/g,String.fromCharCode(209) + "[$1]");
        s = s.replaceAll(/\\[Tt]\[([0-9]+)]/g,String.fromCharCode(210) + "[$1]");
        return s;
    };

    this.TextAnalysisNull = function(str) {
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
    this.TextAnalyRemove = function(str){
        var s = new String(str);
        s = s.replaceAll(/\|[Nn]/g,"");//0507
        s = s.replaceAll(/\\[Nn]/g,"");
        s = s.replaceAll(/\\[Ww]\[([0-9]+)]/g,"");
        s = s.replaceAll(/\\[Cc]\[([0-9]+,[0-9]+,[0-9]+)]/g,"");
        s = s.replaceAll(/\\[Ss]\[([0-9]+)]/g,"");
        s = s.replaceAll(/\\\|/g,"");
        s = s.replaceAll(/\\\./g,"");
        s = s.replaceAll(/\\\>/g,"");
        s = s.replaceAll(/\\\=/g,"");
        s = s.replaceAll(/\\[Vv]\[([0-9]+)]/g,"");
        s = s.replaceAll(/\\[Xx]\[([0-9]+)]/g,"");
        s = s.replaceAll(/\\[Tt]\[([0-9]+)]/g,"");
        return s;
    };

    // add by ysxx -↓↓↓↓↓-2014/6/4--- 投票添加 --增加code判断事件类型是资源引入的类型还是文本显示类型----
    this.madeString = function(str,index,code){
        index += 1;
        if(index >= 20){
            return "";
        }
        str = this.TextAnalysis(str);
        var end = "";
        while(true){
            if(str.length <= 0){
                break;
            }
            var smin = str.substring(0,1);
            str = str.substring(1,str.length);
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

    this.TextToTemp = function(s,e,rex){
        var tmp = showingText.substring(showingText.indexOf(s) + 1,
            showingText.indexOf(e));
        showingText = showingText.substring(tmp.length + s.length + e.length,showingText.length);
        var temp1 = tmp.replaceAll(rex,"$1");
        var temp2 = temp1.replaceAll(" ","");
        return temp2;
    }

    this.TextToTemp2 = function(str,s,e,rex){
        var tmp = str.substring(str.indexOf(s) + 1 , str.indexOf(e));
        str = str.substring(tmp.length + s.length + e.length ,str.length);
        var arr = new Array(tmp.replaceAll(rex, "$1"), str);
        return arr;
    }

    this.saveArgs = function(arr){
        if(Args == null){
            arr.push(0 + "|");
        }else{
            arr.push(1 + "|");
            arr.push(Args.length + "|");
            for (var i = 0; i < Args.length; ++i) {
                if(i == 16||i==17){
                    if(Args[i].indexOf('|') !== -1){
                        Args[i] = Args[i].replace(/\|/g,'?')
                    }
                }
                arr.push(Args[i] + "|");
            }
        }
    }

    this.loadArgs = function(arr){
        drawX=0;
        drawY=0;
        var isMsg = parseInt(arr.shift()) != 0;

        if(isMsg){
            var targs = new Array(parseInt(arr.shift()));
            for(var i = 0 ; i < targs.length ; ++i){
                targs[i] = arr.shift();
                if(i == 16||i==17){
                    if(targs[i].indexOf('?') !== -1){
                        targs[i] = targs[i].replace(/\?/g,'|')
                    }
                }
            }
        }
    }
}
function androidFlower(){
    shareGetFlower.shareAllAwardConf(function(data,bool){
        if(bool){
            return;
        }
        var data=data.data.share_num;
        if(data){
            if(data[1].wild_flower_count){
                var PDiv=$(".box2 .clearfix").eq(0);
                var PDiv1=$(".box2 .clearfix").eq(0);
                var num = data[1].wild_flower_count/100;
                if(num!=0){
                    var div=

                        '<div><img class="icon" src="http://c1.cgyouxi.com/website/orange/img/common/f3.png"><span class="btnAFlower1">'+num+'</span>朵花</div>';
                    PDiv.append(div);
                }else{
                    if(data[1].integral_count==0){
                        PDiv.remove();
                    }
                }
            }

            if(data[2].wild_flower_count){
                var PDiv=$(".box2 .clearfix").eq(1);
                var num = data[2].wild_flower_count/100;
                if(num!=0) {
                    var div=

                        '<div><img class="icon" src="http://c1.cgyouxi.com/website/orange/img/common/f3.png"><span class="btnAFlower1">'+num+'</span>朵花</div>';
                    PDiv.append(div);
                }else{
                    if(data[2].integral_count==0){
                        PDiv.remove();
                    }
                }
            }

            if(data[3].wild_flower_count){
                var PDiv=$(".box2 .clearfix").eq(2);
                var num = data[3].wild_flower_count/100;
                if(num!=0) {
                    var div=

                        '<div><img class="icon" src="http://c1.cgyouxi.com/website/orange/img/common/f3.png"><span class="btnAFlower1">'+num+'</span>朵花</div>';
                    PDiv.append(div);
                }else{
                    if(data[3].integral_count==0){
                        PDiv.remove();
                    }
                }
            }
            //
            //if(data[2].wild_flower_count)
            //    $(".btnAFlower2").html(data[2].wild_flower_count/100);
            //if(data[3].wild_flower_count)
            //    $(".btnAFlower3").html(data[3].wild_flower_count/100);
            if(data[1].integral_count){
                var PDiv=$(".box2 .clearfix").eq(0);
                var num = data[1].integral_count;
                if(num!=0) {
                    var div ='<div>' +
                        '<img class="icon" src="http://pic.cgyouxi.com/orange/common/list/icon_color_leaf.png"><span class="btnANum1">'+num+'</span>积分' +
                        '</div>';
                    PDiv.append(div);
                }
            }
            //var div=$('<div><img class="icon" src="http://pic.cgyouxi.com/orange/common/list/icon_color_leaf.png" />积分<span class="btnANum1">0</span>分</div>');
            //$(".btnANum1").html(data[1].integral_count);
            if(data[2].integral_count){
                var PDiv=$(".box2 .clearfix").eq(1);
                var num = data[2].integral_count;
                if(num!=0) {
                    var div = '<div>' +
                        '<img class="icon" src="http://pic.cgyouxi.com/orange/common/list/icon_color_leaf.png"><span class="btnANum1">'+num+'</span>积分' +
                        '</div>';
                    PDiv.append(div);
                }
            }

            if(data[3].integral_count){
                var PDiv=$(".box2 .clearfix").eq(2);
                var num = data[3].integral_count;
                if(num!=0) {
                    var div = '<div>' +
                        '<img class="icon" src="http://pic.cgyouxi.com/orange/common/list/icon_color_leaf.png"><span class="btnANum1">'+num+'</span>积分' +
                        '</div>';
                    PDiv.append(div);
                }
            }

            //if(data[2].integral_count)
            //    $(".btnANum2").html(data[2].integral_count);
            //if(data[3].integral_count)
            //    $(".btnANum3").html(data[3].integral_count);
        }
    });
    shareGetFlower.shareAwardConf(function (data) {
        if(data.status!=-2){
            var getmax=data.data.share_max.getmax;
            var maxFlower=data.data.share_max.maxFlower;
            if(maxFlower&&maxFlower!="null"){
                maxFlower=parseInt(maxFlower);
            }
            var data=data.data.integral_flower_info;
            if(data){
                if(data.share_num){
                    var shareLen=$(".sharenum").length;
                    for(var i=0;i<shareLen;i++){
                        if(i+1==parseInt(data.share_num)){
                            //$(".sharenum").eq(i).addClass("active");
                            $(".share-modal-sp .tr").eq(i).addClass("tr_act");
                            $(".sharenum").eq(i).addClass("sharenum_act");
                            $(".arrow_icon").eq(i).addClass('arrow_icon_act');
                        }else{
                            //$(".sharenum").eq(i).removeClass("active");
                            $(".share-modal-sp .tr").eq(i).removeClass("tr_act");
                            $(".sharenum").eq(i).removeClass("sharenum_act");
                            $(".arrow_icon").eq(i).removeClass('arrow_icon_act');
                        }
                    }
                }else{
                    for(var i=0;i<3;i++) {
                        //$(".sharenum").eq(i).removeClass("active");
                        $(".share-modal-sp .tr").eq(i).removeClass("tr_act");
                        $(".sharenum").eq(i).removeClass("sharenum_act");
                        $(".arrow_icon").eq(i).removeClass('arrow_icon_act');
                    }
                    $(".btnBFlower").html(0);
                    $(".btnBNum").html(0);
                    $("#shareCon").html("谢谢分享！");
                }
                
                if(maxFlower!=null&&getmax!=null){
                    if(maxFlower-getmax<=1.5&&maxFlower-getmax!=0){
                        $("#shareCon").html("<div>本作品最多可通过分享获得"+maxFlower+"朵花</div>" +
                            "<div>您当前已获得"+getmax+"朵花</div>")
                    }else if(maxFlower-getmax==0||maxFlower-getmax<0){
                        $("#shareCon").html("<div>分享本作品送花已达上限</div>" +
                            "<div>去分享其他橙光作品试试看~</div>");
                        for(var i=0;i<3;i++) {
                            //$(".sharenum").eq(i).removeClass("active");
                            $(".share-modal-sp .tr").eq(i).removeClass("tr_act");
                            $(".sharenum").eq(i).removeClass("sharenum_act");
                            $(".arrow_icon").eq(i).removeClass('arrow_icon_act');
                        }
                    }else{
                        var str="";
                        if(data.wild_flower_count){
                            $(".btnBFlower").html(data.wild_flower_count/100);
                            str+='<div>为本作品送<img class="icon" src="http://c1.cgyouxi.com/website/orange/img/common/f3.png" /><span class="btnBFlower">'+data.wild_flower_count/100+'</span>朵花</div>'
                        }
                        if(data.integral_count){
                            $(".btnBNum").html(data.integral_count);
                            str+='<div>您获得<img class="icon" src="http://pic.cgyouxi.com/orange/common/list/icon_color_leaf.png" />积分<span class="btnBNum">'+data.integral_count+'</span>分</div>';
                        }
                        if(!data.wild_flower_count&&!data.integral_count){
                            str="谢谢分享";
                            for(var i=0;i<3;i++) {
                                //$(".sharenum").eq(i).removeClass("active");
                                $(".share-modal-sp .tr").eq(i).removeClass("tr_act");
                                $(".sharenum").eq(i).removeClass("sharenum_act");
                                $(".arrow_icon").eq(i).removeClass('arrow_icon_act');
                            }
                        }
                        $("#shareCon").html(str);
                    }
                }else if(!data.share_num){
                    $(".btnBFlower").html(0);
                    $(".btnBNum").html(0);
                    $("#shareCon").html("谢谢分享！");
                    for(var i=0;i<3;i++) {
                        //$(".sharenum").eq(i).removeClass("active");
                        $(".share-modal-sp .tr").eq(i).removeClass("tr_act");
                        $(".sharenum").eq(i).removeClass("sharenum_act");
                        $(".arrow_icon").eq(i).removeClass('arrow_icon_act');
                    }
                }

            }else{
                for(var i=0;i<3;i++) {
                    //$(".sharenum").eq(i).removeClass("active");
                    $(".share-modal-sp .tr").eq(i).removeClass("tr_act");
                    $(".sharenum").eq(i).removeClass("sharenum_act");
                    $(".arrow_icon").eq(i).removeClass('arrow_icon_act');
                }
                $(".btnBFlower").html(0);
                $(".btnBNum").html(0);
                $("#shareCon").html("谢谢分享！");
            }

        }else{
            $("#shareCon").html("您还没有登录哦，登录后分享获得奖励吧！");
            for(var i=0;i<3;i++) {
                $(".share-modal-sp .tr").eq(i).removeClass("tr_act");
                $(".sharenum").eq(i).removeClass("sharenum_act");
                $(".arrow_icon").eq(i).removeClass('arrow_icon_act');
            }
        }
        $(".share-modal-sp").show(50);
        $(".share-mask").show();
        ReDirectSharetes();
        //$(".share-modal-box").css("top",($(".share-modal").height()-$(".share-modal-box").height())/2);
        //$(".share-modal-colse").on("click",function(){
        //    $(".share-modal").hide();
        //});
    });
}