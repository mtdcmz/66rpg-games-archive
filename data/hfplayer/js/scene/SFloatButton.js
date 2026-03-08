/*
 * create by heshang
 * 2015-11-19
 * */
function SFloatButton(){
    var self = this;
    var sprites;
    var FIndex,zBase;
    var buttonInter,onloadInter,loadingInter;
    var buttons;
    var data;
    // 存读档
    this.loadFbFlag;
    this.isFBOnOff = false;
    this.saveFbFlag = false;

    this.init= function () {
        zBase=5500;
        sprites = new Array();
        buttons = new Array();
        for(var i=0;i<tv.data.DFloatButton.length;i++){
            data=tv.data.DFloatButton[i];
            for(var j=0;j<data.DFloatItem.length;j++){
                this.loadControls(data.DFloatItem[j],i);
            }
        }
    }

    this.loadControls = function(c,i){
        var points;
        switch(c.type){
            case 0: //-图片
            {
                var sp = new OSprite(null,null);
                var str = c.isUserString ? tv.system.string.getVar(c.indexOfStr) : c.image;
                if(str.length <= 0){
                    console.log("FloatButtonUI:loadCntorols case 0 ：img is null");
                    var img = new Image();
                    sp.setBitmap(img);
                }else{
                    var path = "Graphics/Other/" + str;
                    path = path.replace("//", "/");
                    path = path.replace("\\\\", "/");
                    if(fileList[(path).toLowerCase().replace(/\\/g,'/')] != null){
                        var img = new Image();
                        var path2 = (path).toLowerCase().replace(/\\/g,'/');
                        img.src = fileListFato(path2,'img in loadControls from SFloatButton.js');
                        sp.setBitmap(img);
                    }else{
                        console.log("FloatButtonUI:loadControls case 3:img url is null");
                    }
                }
                sp.visible = true;
                points = this.getContrlPoint(c);
                sp.tagIndex=i;
                sp.x = points[0];
                sp.y = points[1];
                sp.e["tag"] = c;
                sp.e["text"] = path;
                sp.setZ(zBase+sprites.length);
                sprites.push(sp);
                break;
            }
            case 1://-字符串
            {
                var s = new OSprite(null,null);
                //var s = new OButton(null,null,"",null,false,false);//-# true
                var dx = 0,dy = 0;
                /* 设置图片字体大小 js这暂时没有精灵自身字体大小的设置功能*/
                var height = tv.data.System.FontSize * 1.8;//多行字符串的行距
                var color = c.color;
                var str=tv.system.string.getVar(c.stringIndex);
                var st=new Array();
                if(str!=""&&str){
                    var st = tv.canvas.message[tv.canvas.msgIndex].TextAnalysis();
                }
                while(true){
                    if(st.length <= 0) break;
                    var smin = st.substring(0,1);
                    st = st.substring(1,st.length);
                    var cm = smin.charCodeAt(0);
                    if(cm == 200){
                        dx = 0;
                        dy += height;
                    }else if(cm == 202){
                        var s1 = tv.canvas.message[tv.canvas.msgIndex].TextToTemp2(st ,"[","]","\\[([0-9| ]+,[0-9| ]+,[0-9| ]+)]");
                        st = s1[1];
                        color = new OColor(s1[0]);
                    }else{
                        g.font = tv.data.System.FontSize + "px "+ fontName;
                        var w = g.measureText(smin).width;
                        s.texts.push(new DTextA(smin,dx,dy ,color.getColor()));  //t# dy - (height / 2)
                        dx += w;
                    }
                }
                s.visible = true;
                points = this.getContrlPoint(c);
                s.x = points[0];
                s.y = points[1];
                s.setZ(zBase+1);
                s.e["tag"] = c;//# hash e可以换成{}
                s.e["text"] = tv.system.string.getVar(c.stringIndex);
                s.tagIndex=i;
                sprites.push(s);
                //var b = new OButton(s.back,s.back,"",null,false,false);//-# true
                break;
            }
            case 2://-变量
            {
                var sv = new OSprite(null,null);
                var dx = 0,dy = 0;
                //var sv = new OButton(null,null,"",null,false,false);//-# true
                var isPic = c.isUserIndex;
                if(isPic && c.image.length <= 0){
                    isPic = false;
                }
                //---###
                //int w = TempVar.gm.font.GetWidth(TempVar.system.vars.GetVar(c.index) + "");
                //var h = tv.data.System.FontSize;//
                sv.drawText(tv.system.vars.getVar(c.varIndex) + "",0,0);//t# ,-(h/2) + fontOffh
                sv.color = c.color.getColor();
                sv.visible = true;
                points = this.getContrlPoint(c);
                sv.x = points[0];
                sv.y = points[1];
                sv.setZ(zBase+1);
                sv.tagIndex=i;
                sv.e["tag"] = c;
                sv.e["text"] = tv.system.vars.getVar(c.varIndex);
                sprites.push(sv);
                //buttons.push(sv);
                break;
            }
        }//switch结束
    }

    this.getContrlPoint = function(c){
        var points = new Array(2);
        points[0] = c.isUserString ? tv.system.vars.getVar(c.x) : c.x;
        points[1] = c.isUserString ? tv.system.vars.getVar(c.y) : c.y;
        /*points[0] = points[0]+c.x+data.x;
        points[1] = points[1]+c.y+data.y;*/
        points[0] = points[0]+data.x;
        points[1] = points[1]+data.y;
        return points;
    }

    this.updateControl = function(){
        for(var i = 0 ; i < sprites.length;i++){
            var s = sprites[i];
            var c = s.e["tag"];
            if(c.type==0){//图片
                var str = c.isUserString ? tv.system.string.getVar(c.indexOfStr) : c.image;
                if(str.length <= 0){
                    s.setBitmap(null);
                    // console.log("SCUI: updateControl type == 3 :img is null");
                }else{
                    var path = "Graphics/Other/" + str;
                    path = path.replace("//", "/");
                    path = path.replace("\\\\", "/");
                    var sx2 = s.e["text"];
                    if(path != sx2){
                        var img = new Image();
                        if(fileList[(path).toLowerCase().replace(/\\/g,'/')] != null){
                            var path2 = (path).toLowerCase().replace(/\\/g,'/');
                            img.src = fileListFato(path2,'img in updateControl from SFloatButton.js');
                            var isVisible = false;//记录一下当前悬浮组件的状态，显示还是隐藏
                            if(s.visible){
                                isVisible = true;
                            }
                            s.setBitmap(img);
                            s.visible = true;
                        }else{
                            console.log("SCUI: updateControl type == 3: img url is null");
                        }
                        //s.visible = true; //0504 高级ui图片闪烁显示问题
                        s.e["text"] = path;
                        s.setZ(zBase+i);
                    }
                }
            }
            else if(c.type == 1){ //-字符串
                var sx1 = tv.system.string.getVar(c.stringIndex);
                var sx2 = s.e["text"];
                s.clearText();
                var dx = 0 ,dy = 0;
                //---###
                /*
                 int width = (int) (TempVar.gm.font.GetWidth(TempVar.system.string.GetString(c.index)) * TempVar.zoomScene);
                 int length = TempVar.system.string.GetString(c.index).split("|n").length;
                 int height = (int) (TempVar.gm.font.GetHeight("|") *TempVar.zoomScene);
                 s.SetBitmap(Bitmap.createBitmap(width + 5,height * length + 5,Bitmap.Config.ARGB_4444));
                 */
                var height = tv.data.System.FontSize * 1.8;//行距
                var color = c.color;
                var st = tv.canvas.message[tv.canvas.msgIndex].TextAnalysis(tv.system.string.getVar(c.stringIndex));
                while(true){
                    if(st.length <= 0) break;
                    var smin = st.substring(0,1);
                    st = st.substring(1,st.length);
                    var cm = smin.charCodeAt(0);
                    if(cm == 200){
                        dx = 0;
                        dy += height;
                    }else if(cm == 202){
                        var s1 = tv.canvas.message[tv.canvas.msgIndex].TextToTemp2(st ,"[","]","\\[([0-9| ]+,[0-9| ]+,[0-9| ]+)]");
                        st = s1[1];
                        color = new OColor(s1[0]);
                    }else{
                        g.font = tv.data.System.FontSize + "px "+ fontName;
                        var w = g.measureText(smin).width;
                        s.texts.push(new DTextA(smin,dx,dy ,color.getColor()));//t# dy- (height / 2)
                        dx += w;
                    }
                }
                s.e["text"] = tv.system.string.getVar(c.stringIndex);
                s.setZ(zBase+i);
                //s.width=dx;
                //s.height=dy+height;
            }
            else if(c.type == 2){ //-变量
                var sx1 = tv.system.vars.getVar(c.varIndex);
                var sx2 = s.e["text"];
                s.clearText();
                var dx = 0 ,dy = 0;
                //---###
                /*
                 int width = (int) (TempVar.gm.font.GetWidth(TempVar.system.string.GetString(c.index)) * TempVar.zoomScene);
                 int length = TempVar.system.string.GetString(c.index).split("|n").length;
                 int height = (int) (TempVar.gm.font.GetHeight("|") *TempVar.zoomScene);
                 s.SetBitmap(Bitmap.createBitmap(width + 5,height * length + 5,Bitmap.Config.ARGB_4444));
                 */
                var height = tv.data.System.FontSize * 1.8;//行距
                var color = c.color;
                var st = tv.canvas.message[tv.canvas.msgIndex].TextAnalysis(tv.system.vars.getVar(c.varIndex));
                while(true){
                    if(st.length <= 0) break;
                    var smin = st.substring(0,1);
                    st = st.substring(1,st.length);
                    var cm = smin.charCodeAt(0);
                    if(cm == 200){
                        dx = 0;
                        dy += height;
                    }else if(cm == 202){
                        var s1 = tv.canvas.message[tv.canvas.msgIndex].TextToTemp2(st ,"[","]","\\[([0-9| ]+,[0-9| ]+,[0-9| ]+)]");
                        st = s1[1];
                        color = new OColor(s1[0]);
                    }else{
                        g.font = tv.data.System.FontSize + "px "+ fontName;
                        var w = g.measureText(smin).width;
                        s.texts.push(new DTextA(smin,dx,dy ,color.getColor()));//t# dy- (height / 2)
                        dx += w;
                    }
                }
                s.e["text"] = tv.system.vars.getVar(c.varIndex);



                //s.width=dx;
                //s.height=dy+height;
            }
            //var points = this.getContrlPoint(c);
            //s.x = points[0];
            //s.y = points[1];
        }
    }

    this.updateButton = function(e){
        for(var i = 0 ; i < buttons.length;++i){
            var b = buttons[i];
            if(b != null){
                if(b instanceof  OButton)
                {
                    b.update();
                }
                if(b.isClick()){
                    this.cmdButton(b);
                    break;
                }
            }
        }
        //return false ;
    }
    this.updateSprite= function () {
        for(var i = 0 ; i < sprites.length;++i){
            var b = sprites[i];
            if(b != null){
                if(b.isClick()){
                    this.cmdButton(b);
                    break;
                }
            }
        }
    }

    this.update = function(){
        if(!this.isFBOnOff){
            return;
        }
        this.updateControl();
        //this.updateClose();
        this.updateSprite();
        this.updateButton();
        if(buttonInter != null){
            if(!buttonInter.isFinish()){
                buttonInter.update();
                return;
            }else{
                buttonInter = null;
            }
        }
        //if()
        //{
        //    return ;
        //}
        //else
        //{
        //
        //}
    }

    this.saveDate = function (arr) {
        arr.push(this.saveFbFlag+'|');
    };
    this.loadData = function(lFloatFlag){
        this.updateControl();
        if(lFloatFlag == "true"){
            self.setVisible(true);
        }
    };
    this.dispose = function(){
        for(var i = 0 ; i < sprites.length;++i){
            var s = sprites[i];
            if(s != null){
                s.dispose();
            }
        }
        sprites.length = 0;
    }

    this.cmdButton = function(c){
        buttonInter = new IMain();
        buttonInter.isCui = false;
        buttonInter.jumpStory(tv.data.DFloatButton[c.tagIndex].event);
        buttonInter.update();
    }
    this.setVisible=function(b){
        this.saveFbFlag = b;
        this.isFBOnOff =b;
        for(var i=0;i<sprites.length;i++){
            sprites[i].visible = b;
        }
        for(var i=0;i<buttons.length;i++){
            buttons[i].setVisible(b);
            //buttons[i].back.visible=b;
        }
    }
    //构造
    gLoadAssets.curLoadScene = "SFloat";
    if(gLoadAssets.isNeedLoad()){

    }else{
        this.init();
    }
}
