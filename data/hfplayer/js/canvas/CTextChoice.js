/**
 * Created by 七夕小雨 on 2014/11/17.
 */
function CTextChoice(){
    this.index =  -1;
    this.usedList = new Array();
    this.waiting = false;
    this.data = tv.data.System.Buttons[tv.data.System.MessageBox.ChoiceButtonIndex];
    this.image1 = new Image();
    if(fileList[("Graphics/Button/" + this.data.image1).toLowerCase().replace(/\\/g,'/')]){
        var path = ("Graphics/Button/" + this.data.image1).toLowerCase().replace(/\\/g,'/');
        this.image1.src = fileListFato(path,'image1 in CTextChoice from CTextChoice.js');
    }
    this.image2 = new Image();
    if(fileList[("Graphics/Button/" + this.data.image2).toLowerCase().replace(/\\/g,'/')]){
        var path2 = ("Graphics/Button/" + this.data.image2).toLowerCase().replace(/\\/g,'/');
        this.image2.src = fileListFato(path2,'image2 in CTextChoice from CTextChoice.js');
    }
    this.choiceSpace = 10;
    this.bg=null ;
    var timeBar = null;
    var tempArr=new Array();

    //临时变量系列
    var messageText = "";
    var messageShowing = false;
    var drawSpeed = 0;
    var showingText;
    var faceOfsX = 0;
    var drawWait = 0;
    var waitPress = false;
    var pause = false;
    var autoWaitCount = 0;
    var SHOWTEXTNUBER = 3;
    var drawX = 0;
    var drawY = 0;
    /**---------------**/
    var zBase = 3200;



    var fastShowText = false;


    this.isFinish = function(){
        return !this.waiting;
    };
    this.disposeChoice = function () {
        this.usedList.length = 0;
    }
    this.setupChoice = function(list){
        this.disposeChoice();
        var viewPort = null;
        //if(tv.canvas.isShowTextStyle == 1) {
        //    viewPort = tv.canvas.lifeLine.viewPort;
        //}
        tempArr.length = 0;
        if(list == null || list.length <= 0){return;}
        var totalH = this.image1.height * list.length + (list.length - 1) * this.choiceSpace;
        if(tv.canvas.message[tv.canvas.msgIndex].isShow()){
            var height = tv.data.Headr.GHeight - tv.canvas.message[tv.canvas.msgIndex].getHeight();
        }else{
            var height = tv.data.Headr.GHeight;
        }
        var offsetY = (height - totalH) / 2;
        var index = 0;
        //临时增加
        for(var i = 0;i<list.length;i++){
            showingText = new String(list[i]);
            var showText= this.updateMessage(showingText);
            var s = new OButton(this.image1,this.image2,showText,viewPort,false,false);
            //按钮的显示框
            s.cTChioce =true;
            s.index = i;
            s.setX((tv.data.Headr.GWidth - this.image1.width) / 2);
            s.setY(offsetY + i * (this.image1.height + this.choiceSpace));
            s.setZ(zBase + 10 + i);
            s.setVisible(true);
            this.usedList.push(s);
            tempArr.push(s);
        }
        if(tv.canvas.isShowTextStyle == 1) {
            if(tv.canvas.lifeLine.interUser != 1) {
                tv.canvas.lifeLine.setAllChoice(tempArr);
            }
        }
        this.waiting = true;
    };

    this.setuptChoiceEX = function(objHash,x,y) {
        this.disposeChoice();
        var viewPort = null;
        //if(tv.canvas.isShowTextStyle == 1) {
        //    viewPort = tv.canvas.lifeLine.viewPort;
        //}
        if(objHash == null) return;
        var hashsize = 0;
        for(var it in objHash){
            hashsize += 1;
        }
        if(hashsize == 0) return;

        var totalH = parseInt(this.image1.height * hashsize + (hashsize - 1) * this.choiceSpace);
        var height = tv.canvas.message[tv.canvas.msgIndex].isShow() ? gGameHeight - parseInt(tv.canvas.message[tv.canvas.msgIndex].getHeight() * tv.zoomSceneF) : gGameHeight;
        var offsetY = (height - totalH) / 2;
        var index = 0;
        var tempArr=new Array();
        for(var it in objHash){
            var k = parseInt(it);
            var v = objHash[it];
            showingText = new String(v);
            var showText= this.updateMessage(showingText);
            var s = new OButton(this.image1, this.image2 , showText , viewPort , false,false);
            s.index = k;
            s.setX( x == -2001 ? (gGameWidth - this.image1.width) / 2 : x);
            s.setY((y == -2001 ? offsetY : y) + index * (this.image1.height + this.choiceSpace));
            s.setZ(zBase + 10 * k+1);
            s.setVisible(true);
            this.usedList.push(s);
            tempArr.push(s);
            index += 1;
        }
        if(tv.canvas.isShowTextStyle == 1) {
            if(tv.canvas.lifeLine.interUser != 1) {
                tv.canvas.lifeLine.setAllChoice(tempArr);
            }
        }
        this.waiting = true;
    }

    this.setuptChoiceEX2 = function(objHash,x,y,bgimgname,imgx,imgy,args) {
         this.disposeChoice();
        var viewPort = null;
        //if(tv.canvas.isShowTextStyle == 1) {
        //    viewPort = tv.canvas.lifeLine.viewPort;
        //}
        if(objHash == null) return;
        var hashsize = 0;
        for(var it in objHash){
            hashsize += 1;
        }
        if(hashsize == 0) return;

        if(bgimgname.length>0)
        {
            var imgbg = new Image() ;
            var pathBg = ("Graphics/UI/" + bgimgname).toLowerCase().replace(/\\/g,'/');
            var path = fileListFato(pathBg,'imgbg in setuptChoiceEX2 from CTextChoice.js');
            var bgimgNameFlg = true;

            if (faceImageArr.length > 0 && path) {
                for (var i = 0; i < faceImageArr.length; i++) {
                    if (faceImageArr[i].src == path) {
                        imgbg = faceImageArr[i];
                        this.bg = new OSprite(imgbg,null);
                        this.bg.setZ(zBase);
                        this.bg.setXY(imgx,imgy);
                        bgimgNameFlg = false;
                        break;
                    }
                }
                if(bgimgNameFlg){
                    imgbg.src = path;
                    this.bg = new OSprite(imgbg,null);
                    this.bg.setZ(zBase);
                    this.bg.setXY(imgx,imgy);
                }
            }else{
                imgbg.src = path;
                this.bg = new OSprite(imgbg,null);
                this.bg.setZ(zBase);
                this.bg.setXY(imgx,imgy);
            }

/*
            this.bg = new OSprite(imgbg,null);
            this.bg.setZ(zBase);
            this.bg.setXY(imgx,imgy);
*/
        }

        var totalH = parseInt(this.image1.height * hashsize + (hashsize - 1) * this.choiceSpace);
        /*var height = tv.canvas.message[tv.canvas.msgIndex].isShow() ? gGameHeight - parseInt(tv.canvas.message[tv.canvas.msgIndex].getHeight() * tv.zoomSceneF) : gGameHeight;*/
        var height;
        var LoadMsgShow;
        if(tv.canvas.message[tv.canvas.msgIndex].isShow()){
            height = gGameHeight - parseInt(tv.canvas.message[tv.canvas.msgIndex].getHeight() * tv.zoomSceneF)
        }else{
            //找事件
            for(var i = (tv.inter.pos-1);i>=0;i--){
                if(tv.inter.story[i].Code == 109){
                    LoadMsgShow = false;
                    break;
                }else if(tv.inter.story[i].Code == 100&&tv.canvas.isShowTextStyle ==0){
                    LoadMsgShow = true;
                    break;
                }
            }
            if(LoadMsgShow){
                if(parseInt(tv.canvas.message[tv.canvas.msgIndex].getHeight())>0){
                    height = gGameHeight - parseInt(tv.canvas.message[tv.canvas.msgIndex].getHeight() * tv.zoomSceneF);
                } else {
                    var data = tv.data.System.MessageBox;
                    var imaget = new Image();
                    if(fileList[("Graphics/UI/" + data.Talk.backimage).toLowerCase().replace(/\\/g,'/')]){
                        var path = ("Graphics/UI/" + data.Talk.backimage).toLowerCase().replace(/\\/g,'/');
                        imaget.src = fileListFato(path,'imaget in CMessage from CMessage.js');
                    }
                    height = gGameHeight -parseInt(imaget.height) * tv.zoomSceneF;
                }
            }else{
                height = gGameHeight;
            }
        }
        var offsetY = (height - totalH) / 2;
        var index = 0;

        var tempArr=new Array();
        if(args==null)
        {
            for(var it in objHash){
                var k = parseInt(it);
                var v = objHash[it];
                showingText = new String(v);
                var showText= this.updateMessage(showingText);
                var s = new OButton(this.image1, this.image2 , showText , viewPort , false,false);
                s.index = k;
                s.setX( x == -2001 ? (gGameWidth - this.image1.width) / 2 : x);
                s.setY((y == -2001 ? offsetY : y) + index * (this.image1.height + this.choiceSpace));
                s.setZ(zBase + 10 * k+1);
                s.setVisible(true);
                this.usedList.push(s);
                tempArr.push(s);
                index += 1;
            }
        }
        else
        {
            var self = this;
            // 3 同
            for(var it in objHash){
                var k = parseInt(it);
                var v = objHash[it];
                var arg = args[it] ;
                var temps = arg.split(",");
                var bimgIndex = temps[0];
                var d = tv.data.System.Buttons[bimgIndex];
                var img1 = new Image() ;
                var img2 = new Image();
                var path1 = ("Graphics/Button/"+d.image1).toLowerCase().replace(/\\/g,'/');
                var path2 = ("Graphics/Button/"+d.image2).toLowerCase().replace(/\\/g,'/');
                img1.src= fileListFato(path1,'img1 in setuptChoiceEX2 from CTextChoice.js');
                img2.src =fileListFato(path2,'img2 in setuptChoiceEX2 from CTextChoice.js');
                //if(!img1.complete){
                //    var oImage = new goExButton(path1, img2 , v , viewPort,temps,k,index);
                //}else{
                    //goExButton(img1, img2 , v , viewPort,temps,k,index);
                //console.log('objHash-111',v);
                showingText = new String(v);
                var showText= this.updateMessage(showingText);
                var s = new OButton(img1, img2 , showText , viewPort , false,false);
                    s.index = k;
                    s.setX(parseInt(temps[1]));
                    s.setY(parseInt(temps[2]));
                    s.setZ(zBase + 10 * (k)+1);

                    var isCenter = (temps[3]=="1") ;
                    if(!isCenter)
                    {
                        s.drawTitleEx(v,temps[4],temps[5]+ index * (self.image1.height + self.choiceSpace) );
                        //s.drawTitleEx(v,temps[4],temps[5]+ index * (self.image1.height + self.choiceSpace) );
                        console.log("x,y---------------->"+temps[4],temps[5],k,v);
                    }
                    s.setVisible(true);
                    self.usedList.push(s);
                    tempArr.push(s);
                    index += 1;
                //}
                function goExButton(path1, img2 , v , viewPort,temps,k,index){
                    var self = this;
                    this.path1 = path1;
                    this.img2 = img2;
                    this.v = v;
                    this.viewPort = viewPort;
                    this.temps = temps;
                    this.k = k;
                    this.index = index;
                    var getImageL = new getImage(path1, function (img) {
                        var image;
                        if(img){
                            image =img;
                        }else{
                            image = new Image();
                            image.src = "";
                        }
                        var s = new OButton(image, img2 , v , viewPort , false,false);
                        s.index = k;
                        s.setX(parseInt(temps[1]));
                        s.setY(parseInt(temps[2]));
                        s.setZ(zBase + 10 * (k)+1);
                        var isCenter = (temps[3]=="1") ;
                        if(!isCenter)
                        {
                            s.drawTitleEx(v,temps[4],temps[5]+ index * (self.image1.height + self.choiceSpace) );
                        }
                        s.setVisible(true);
                        self.usedList.push(s);
                        tempArr.push(s);
                        index += 1;
                    });
                }
            }
        }
        if(tv.canvas.isShowTextStyle == 1) {
            if(tv.canvas.lifeLine.interUser != 1){
                tv.canvas.lifeLine.setAllChoice(tempArr);
            }
        }
        this.waiting = true;
    }

    this.setupTimeBar = function(img1,img2,timeNow,Max,x,y){
        timeBar = new OScrollbar(img1, img2, timeNow, Max,false);
        timeBar.setX(x);
        timeBar.setY(y);
    }
    this.updateTimeBar = function(timeMax,timeNow){
        if(timeBar == null) return;
        timeBar.setValue(timeNow, timeMax);
        timeBar.moveBar();
    }


    this.updateMessage = function(){
        showingText = this.TextAnalysis(showingText);
        var messageText="";
        while(true){
            if(showingText.length <= 0){
                break;
            }
            var smin = showingText.substr(0,1);
            showingText = showingText.substring(1,showingText.length);
            var c = smin.charCodeAt(0);
            if(c == 208){
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
                messageText+=smin;
            }
        }//while结束
        return messageText;
    };

    this.TextAnalysis = function(str){
        var s = new String(str);
        //s = s.replaceAll(/\|[Nn]/g,String.fromCharCode(200));//0507
        //s = s.replaceAll(/\\[Nn]/g,String.fromCharCode(200));
        //s = s.replaceAll(/\\[Ww]\[([0-9]+)]/g,String.fromCharCode(201) + "[$1]");
        //s = s.replaceAll(/\\[Cc]\[([0-9]+,[0-9]+,[0-9]+)]/g,String.fromCharCode(202) + "[$1]");
        //s = s.replaceAll(/\\[Ss]\[([0-9]+)]/g,String.fromCharCode(203) + "[$1]");
        //s = s.replaceAll(/\\\|/g,String.fromCharCode(204));
        //s = s.replaceAll(/\\\./g,String.fromCharCode(205));
        //s = s.replaceAll(/\\\>/g,String.fromCharCode(206));
        //s = s.replaceAll(/\\\=/g,String.fromCharCode(207));
        s = s.replaceAll(/\/[Vv]\[([0-9]+)]/g,String.fromCharCode(208) + "[$1]");
        s = s.replaceAll(/\/[Xx]\[([0-9]+)]/g,String.fromCharCode(209) + "[$1]");
        s = s.replaceAll(/\/[Tt]\[([0-9]+)]/g,String.fromCharCode(210) + "[$1]");
        return s;
    };

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
                var s = this.TextToTemp2(str, "[", "]", "\\[([0-9| ]+[，,][0-9| ]+[，,][0-9| ]+)]");
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
    /*
    * heshang
    * str  需要替换的字符串
    * str1 替换后的字符串
    * */
    this.replaceString= function () {

    }




    this.closeTimeBar = function(){
        if(timeBar == null) return;
        timeBar.setVisible(false);
        if(tv.canvas.isShowTextStyle == 1) {
            if(tv.canvas.lifeLine.interUser != 1) {
                if(this.bg!=null){
                    tv.canvas.lifeLine.setBG(this.bg);
                }
            }
        }
    }
    //

    this.dispose = function(){
        if(timeBar){
            timeBar.disPose();
        }
        for(var i = 0;i<this.usedList.length;i++){
            this.usedList[i].dispose();
        }
        this.usedList.length = 0;
        if(this.bg!=null)
        {
            this.bg.dispose();
        }
    };
    this.update = function(){
        if(!this.waiting){return;}
        if(tv.canvas.isShowTextStyle&&tv.canvas.lifeLine.oListView){
            if(tv.canvas.lifeLine.oListView.isMove){return;}
        }
        for(var i = 0;i<this.usedList.length;i++){
            this.usedList[i].update();
            if(this.usedList[i].isClick()){
                this.index = this.usedList[i].index;
                    //if(!this.usedList[i].isLifeLine){
                    this.closeChoice();
                //}else{
                //    this.waiting = false;
                //}
                break;
            }
        }
    };

    this.closeChoice = function(){
        if(tv.canvas.isShowTextStyle == 1) {
            if(tv.canvas.lifeLine.interUser != 1) {
                if(this.bg!=null){
                    tv.canvas.lifeLine.setBG(this.bg);
                }
            }else{
                this.dispose();
            }
            this.waiting = false;
        }else{
            this.waiting = false;
            this.dispose();
        }

    }
}