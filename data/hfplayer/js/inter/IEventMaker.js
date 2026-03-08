/**
 * Created by 七夕小雨 on 2014/11/16.
 */

var lastTime=0;//控制鲜花请求的时间
var huaNum=-1;

function IEventMaker(){
    /**
     * 100 显示文章
     */
    this.IText = function(e,m){
        pTime=30;
        this.init = function(){
            if(tv.canvas.isShowTextStyle ==0){
                var Argv= e.Argv[16];
                if(Argv){
                    var msgArr=Argv.split('|')[3];//
                    if(msgArr){
                        var msg=msgArr.split(',');
                        if(parseInt(msg[0])==1){
                            switch (parseInt(msg[1])){
                                case 0:
                                    tv.canvas.msgIndex=1;
                                    tv.canvas.message[tv.canvas.msgIndex].msgboxFadeIn();
                                    break;
                                case 1:
                                    tv.canvas.msgIndex=2;
                                    tv.canvas.message[tv.canvas.msgIndex].msgboxFadeIn();
                                    break;
                                default:
                                    tv.canvas.msgIndex=0;
                                    break;
                            }
                        }
                    }
                }else{
                    tv.canvas.msgIndex=0;

                }
            }
            if(tv.canvas.isShowTextStyle == 0){
                tv.canvas.message[tv.canvas.msgIndex].Talk(e.Argv,false);
            }else{
                tv.canvas.lifeLine.Talk(e.Argv,false);
            }

            return false;
        };

        this.update = function(){

        };

        this.finish = function(){
            if(e.Argv[2] == ""){
                return true;
            }
            if(tv.canvas.isShowTextStyle == 0){
                if(tv.canvas.message[tv.canvas.msgIndex].isEnd){
                    tv.canvas.message[tv.canvas.msgIndex].isEnd = false;
                    return true;
                }
            }else{
                if(tv.canvas.lifeLine.isEnd){
                    tv.canvas.lifeLine.isEnd = false;
                    return true;
                }
            }

            //if(onTouchLong) return true;
            if(tv.canvas.isShowTextStyle == 0) {
                if(tv.canvas.message[tv.canvas.msgIndex].messageTextisNull()){
                    if(onTouchDown){
                        return true;
                    }
                }
                return !tv.canvas.message[tv.canvas.msgIndex].isShowing();
            }else{
                if(tv.canvas.lifeLine.messageTextisNull()){
                    if(onTouchDown){
                        return true;
                    }
                }
                return !tv.canvas.lifeLine.isShowing();
            }
        }
    };
    /**
     * 101 文本分歧
     */
    this.ITextDif = function(e,m){
        this.event = e;
        this.main = m;
        this.init = function(){
            var jumList = new Array();
            var endJump = 0;
            for(var i = this.main.pos;i<this.main.story.length;i++){
                var ev = this.main.story[i];
                if(ev.Code == 108 && ev.Indent == this.main.story[this.main.pos].Indent + 1){
                    jumList.push(i+1);
                    continue;
                }
                if(ev.Code == 102 && ev.Indent == this.main.story[this.main.pos].Indent){
                    endJump = i + 1;
                    break;
                }
            }
            this.main.indentStack.push(new BranchInfo(jumList,endJump));
                tv.canvas.TextChoice.setupChoice(this.event.Argv);
            return false;
        };

        this.finish = function(){
            if(!tv.canvas.TextChoice.isFinish()){return false;}
            this.main.jumpToIndex(this.main.indentStack[this.main.indentStack.length - 1].jump(
                tv.canvas.TextChoice.index
            ));
            return true;
        };

        this.update = function(){}
    };

    /**
     * 1010 文本分歧EX
     */
    this.ITextDifEX = function(e,m){

        this.event = e;
        this.main = m;
        var choiceTimeMax,choiceTime;
        var TimeIndex = -1;

        this.init = function(){

            var jumList = new Array();
            var endJump = 0;
            var advancedMode = this.event.Argv[0].indexOf("ORGTEXT|") > -1;
            var ChoiceArraySize = advancedMode ? parseInt(this.event.Argv[0].split("|")[1]) : this.event.Argv.length; //split("\\|")
            for(var i = this.main.pos ; i < this.main.story.length;++i){
                var ev = this.main.story[i];
                if(ev.Code == 108 && ev.Indent == this.main.story[this.main.pos].Indent + 1){
                    jumList.push(i + 1);
                    continue;
                }
                if(ev.Code == 102 && ev.Indent == this.main.story[this.main.pos].Indent ){
                    endJump = i + 1;
                    break;
                }
            }

            var JumpIndex = new Array(jumList.length);
            for(var i =0 ; i < jumList.length ; ++i){
                JumpIndex[i] = jumList[i];
            }
            TimeIndex = JumpIndex.length - 1;
            this.main.indentStack.push(new BranchInfo(JumpIndex,endJump));

            if(advancedMode){
                var choiceArray = {}; //用对象模拟hash
                for(var i = 0 ; i < ChoiceArraySize ;++i){
                    if(this.event.Argv[9 + i * 2].length <=0) continue;
                    if(this.event.Argv[9 + i * 2].indexOf("ORGTIMEOVER|") > -1) break; 
                    if(choiceIf(this.event.Argv[10 + i * 2]))
                        choiceArray[i] = this.event.Argv[9 + i * 2];
                }
                var isCenter = (this.event.Argv[1] === "1");
                choiceTimeMax = choiceTime = parseInt(this.event.Argv[4]) * FPS;
                if(choiceTimeMax == 0) choiceTimeMax = choiceTime = -200;
                tv.canvas.TextChoice.setuptChoiceEX(choiceArray,
                    isCenter ? -2001 : parseInt(this.event.Argv[2]), 
                    isCenter ? -2001 : parseInt(this.event.Argv[3]));
                if((this.event.Argv[5].length> 0 || this.event.Argv[6].length > 0) && choiceTimeMax > 0){
                    tv.canvas.TextChoice.setupTimeBar(this.event.Argv[5], this.event.Argv[6], choiceTime, choiceTimeMax,
                            parseInt(this.event.Argv[7]), parseInt(this.event.Argv[8]));
                }
            }else{
                tv.canvas.TextChoice.setupChoice(this.event.Argv);
            }
            return false;
        }

        this.update = function(){
            if(choiceTime > 0)choiceTime -= 1;
            tv.canvas.TextChoice.updateTimeBar( choiceTimeMax, choiceTime);
        }

        this.finish = function(){
            if(choiceTime == 0){
                tv.canvas.TextChoice.closeChoice();
                tv.canvas.TextChoice.closeTimeBar();
                this.main.jumpToIndex((this.main.indentStack[this.main.indentStack.length - 1])
                    .jump(TimeIndex));
                return true;
            }
            if(!tv.canvas.TextChoice.isFinish()) return false;
            tv.canvas.TextChoice.closeTimeBar();
            if(tv.canvas.TextChoice.index < 0) return true;
            this.main.jumpToIndex((this.main.indentStack[this.main.indentStack.length - 1])
                .jump(tv.canvas.TextChoice.index));

            return true;
        }

        var cmpRet = false , IsRect = false,haveElse = false;
        var idOrValue = -1,otherVar = -1,op = -1,type = 0,id = -1,picId = -1,endType = -1;
        var rect = null;

        //--3.3 choiceif(varsEx) dataToVar(非else) 还未测试
        function choiceIf(ifArray){
            if(ifArray == null || ifArray.length <= 0) return true;
            //console.log("ifArray");
            //alert(ifArray);
            dataToVar(ifArray);
            cmpRet = false;
            var valueA = -1,valueB = -1;
            if(type <= 1){ //常规的变量判定
                valueA = type == 0 ? tv.system.vars.getVar(id) : tv.system.varsEx.getVar(id);
                if(otherVar == 0){
                    valueB = parseInt(idOrValue);
                }else if(otherVar == 1){
                    valueB = tv.system.vars.getVar(idOrValue);
                }else if(otherVar == 2){
                    valueB = tv.system.varsEx.getVar(idOrValue);
                }
                switch(op){
                case 0:
                    cmpRet = valueA == valueB;
                    break;
                case 1:
                    cmpRet = valueA >= valueB;
                    break;
                case 2:
                    cmpRet = valueA <= valueB;
                    break;
                case 3:
                    cmpRet = valueA > valueB;
                    break;
                case 4:
                    cmpRet = valueA < valueB;
                    break;
                case 5:
                    cmpRet = valueA != valueB;
                    break;
                default:
                    cmpRet = false;
                    break;
                }
            }else if(type == 2){ //鼠标判定
                
                if(IsRect){
                    cmpRet = onTouchX > rect.x && onTouchX < rect.x + rect.width && 
                            onTouchY > rect.y && onTouchY < rect.y + rect.height 
                            && ( endType == 0 ? onTouchMove : onClick);
                }else{
                    if(tv.canvas.GamePictrue[picId].getBitmap() != null){ 
                        var r = tv.canvas.GamePictrue[picId].getRect();  
                        cmpRet = onTouchX > r.left && onTouchX < r.x + r.width && 
                                onTouchY > r.top && onTouchY < r.y + r.height 
                                && ( endType == 0 ? onTouchMove : onClick);
                    }
                }
                
            }else if(type == 3){
                var self=this;
                this.isFun= function () {
                    if(otherVar == 0){
                        valueB = idOrValue;
                    }else if(otherVar == 1){
                        valueB = tv.system.vars.getVar(idOrValue);
                    }else if(otherVar == 2){
                        valueB = tv.system.varsEx.getVar(idOrValue);
                    }
                    switch (op){
                        case 0 :
                            cmpRet = valueA == valueB;
                            break;
                        case 1:
                            cmpRet = valueA >= valueB;
                            break;
                        case 2:
                            cmpRet = valueA <= valueB;
                            break;
                        case 3:
                            cmpRet = valueA > valueB;
                            break;
                        case 4:
                            cmpRet = valueA < valueB;
                            break;
                        case 5:
                            cmpRet = valueA != valueB;
                            break;
                        default :
                            cmpRet = false;
                            break;
                    }
                }
                if(mark!="aBox"){
                    valueA=flowerHua;
                    self.isFun();
                    return cmpRet;
                }else{
                    valueA=flowerHua;
                    self.isFun();
                    return cmpRet;
                }
            }
            return cmpRet;
        }

        function dataToVar(ifArrayIn){
            var ifArray = ifArrayIn.split(",");
            type = 0;
            if(ifArray[0].toLowerCase().indexOf("ex") > -1){
                type = 1;
                //EX|EX|9,5,0,0,0,二周目数值：[010:新手指引] ≠ 0
                id = parseInt(ifArray[0].split("|")[1]); //--split("\\|")
                op = parseInt(ifArray[1]);
                otherVar = parseInt(ifArray[2]);
                idOrValue = parseInt(ifArray[3]);
                haveElse = parseInt(ifArray[4]) != 0 ;
            }else if(ifArray[0].indexOf("MO") > -1){
                type = 2;
                IsRect = ifArray[1] === "0" ;
                if(IsRect){
                    var tempvar = ifArray[2].split(",");
                    rect = {
                        x : parseInt(tempvar[0]) * tv.zoomScene,
                        y : parseInt(tempvar[1]) * tv.zoomScene,
                        width : parseInt(tempvar[2]) * tv.zoomScene,
                        height : parseInt(tempvar[3]) * tv.zoomScene
                    }
                }else{
                    picId = parseInt(ifArray[2]);
                }
                endType = parseInt(ifArray[3]);
                haveElse = parseInt(ifArray[4]) != 0 ;
            }else if(ifArray[0].indexOf("FL") > -1){
                type = 3;
                op = parseInt(ifArray[1]);
                otherVar = parseInt(ifArray[2]);
                idOrValue = parseInt(ifArray[3]);
                haveElse = parseInt(ifArray[4]) != 0;
             /**add by ysxx   平台判断*↓↓↓↓↓↓↓↓↓*2014-8-20*****/
            }else if(ifArray[0].indexOf("PT") > -1){
                type = 5;
                idOrValue = parseInt(ifArray[3]);
                haveElse = parseInt(ifArray[4]) != 0;
            /**add by heshang   平台判断*↑↑↑↑↑↑↑↑↑*2015-10-30*****/
            }else if(ifArray[0].indexOf("PA") > -1){
                type = 5;
            }else{
                id = parseInt(ifArray[0]);
                op = parseInt(ifArray[1]);
                otherVar = parseInt(ifArray[2]);
                idOrValue = parseInt(ifArray[3]);
                haveElse = parseInt(ifArray[4]) != 0;
            }
        }
    }


    /**
     * 高级条件分歧 1011
     * @param e
     * @param m
     * @constructor
     */
    this.ITextDifEX2 = function(e,m){

        this.event = e;
        this.main = m;
        var choiceTimeMax,choiceTime;
        var TimeIndex = -1;

        this.init = function(){

            var jumList = new Array();
            var endJump = 0;
            var ChoiceArraySize = this.event.Argv[0] ;
            for(var i = this.main.pos ; i < this.main.story.length;++i){
                var ev = this.main.story[i];
                if(ev.Code == 108 && ev.Indent == this.main.story[this.main.pos].Indent + 1){
                    jumList.push(i + 1);
                    continue;
                }
                if(ev.Code == 102 && ev.Indent == this.main.story[this.main.pos].Indent ){
                    endJump = i + 1;
                    break;
                }
            }

            var JumpIndex = new Array(jumList.length);
            for(var i =0 ; i < jumList.length ; ++i){
                JumpIndex[i] = jumList[i];
            }
            TimeIndex = JumpIndex.length - 1;
            this.main.indentStack.push(new BranchInfo(JumpIndex,endJump));


            var choiceArray = {}; //用对象模拟hash
            var argsArray = {} ;
            var isDiyeve = (this.event.Argv[14]=="1");//是否开启每项自定义
            for(var i = 0 ; i < ChoiceArraySize ;++i){
                if(this.event.Argv[15 + i * 3].length <=0) continue;
                if(this.event.Argv[15 + i * 3].indexOf("ORGTIMEOVER|") > -1) break;
                if(choiceIf(this.event.Argv[16 + i * 3])) {
                    choiceArray[i] = this.event.Argv[15 + i * 3];
                    if(isDiyeve)
                    {
                        argsArray[i] = this.event.Argv[17+i*3];
                    }
                }
            }
            var isCenter = (this.event.Argv[1] === "1");
            choiceTimeMax = choiceTime = parseInt(this.event.Argv[4]) * FPS;

            var isOpenBimg = (this.event.Argv[9]=="1");//是否开启背景图片

            if(choiceTimeMax == 0) choiceTimeMax = choiceTime = -200;
            tv.canvas.TextChoice.setuptChoiceEX2(choiceArray,
                isCenter ? -2001 : parseInt(this.event.Argv[2]),
                isCenter ? -2001 : parseInt(this.event.Argv[3]),
                isOpenBimg ? this.event.Argv[10]:"",parseInt(this.event.Argv[11]),parseInt(this.event.Argv[12]),
                isDiyeve?argsArray:null
               );
            if((this.event.Argv[5].length> 0 || this.event.Argv[6].length > 0) && choiceTimeMax > 0){
                tv.canvas.TextChoice.setupTimeBar(this.event.Argv[5], this.event.Argv[6], choiceTime, choiceTimeMax,
                    parseInt(this.event.Argv[7]), parseInt(this.event.Argv[8]));
            }
            return false;
        }

        this.update = function(){
            if(choiceTime > 0)choiceTime -= 1;
            tv.canvas.TextChoice.updateTimeBar( choiceTimeMax, choiceTime);
        }

        this.finish = function(){
            if(e.Argv[2] == ""){
                return true;
            }
            if(tv.canvas.message[tv.canvas.msgIndex].isEnd){
                tv.canvas.message[tv.canvas.msgIndex].isEnd = false;
                return true;
            }
            if(choiceTime == 0){
                tv.canvas.TextChoice.closeChoice();
                tv.canvas.TextChoice.closeTimeBar();
                this.main.jumpToIndex((this.main.indentStack[this.main.indentStack.length - 1])
                    .jump(TimeIndex));
                return true;
            }
            if(!tv.canvas.TextChoice.isFinish()) return false;
            tv.canvas.TextChoice.closeTimeBar();
            if(tv.canvas.TextChoice.index < 0) return true;
            this.main.jumpToIndex((this.main.indentStack[this.main.indentStack.length - 1])
                .jump(tv.canvas.TextChoice.index));
            return true;
        }

        var cmpRet = false , IsRect = false,haveElse = false;
        var idOrValue = -1,otherVar = -1,op = -1,type = 0,id = -1,picId = -1,endType = -1;
        var rect = null;

        //--3.3 choiceif(varsEx) dataToVar(非else) 还未测试
        function choiceIf(ifArray){
            if(ifArray == null || ifArray.length <= 0) return true;
            //console.log("ifArray");
            //alert(ifArray);
            dataToVar(ifArray);
            cmpRet = false;
            var valueA = -1,valueB = -1;
            if(type <= 1){ //常规的变量判定
                valueA = type == 0 ? tv.system.vars.getVar(id) : tv.system.varsEx.getVar(id);
                if(otherVar == 0){
                    valueB = idOrValue;
                }else if(otherVar == 1){
                    valueB = tv.system.vars.getVar(idOrValue);
                }else if(otherVar == 2){
                    valueB = tv.system.varsEx.getVar(idOrValue);
                }
                switch(op){
                    case 0:
                        cmpRet = valueA == valueB;
                        break;
                    case 1:
                        cmpRet = valueA >= valueB;
                        break;
                    case 2:
                        cmpRet = valueA <= valueB;
                        break;
                    case 3:
                        cmpRet = valueA > valueB;
                        break;
                    case 4:
                        cmpRet = valueA < valueB;
                        break;
                    case 5:
                        cmpRet = valueA != valueB;
                        break;
                    default:
                        cmpRet = false;
                        break;
                }
            }else if(type == 2){ //鼠标判定

                if(IsRect){
                    cmpRet = onTouchX > rect.x && onTouchX < rect.x + rect.width &&
                        onTouchY > rect.y && onTouchY < rect.y + rect.height
                        && ( endType == 0 ? onTouchMove : onClick);
                }else{
                    if(tv.canvas.GamePictrue[picId].getBitmap() != null){
                        var r = tv.canvas.GamePictrue[picId].getRect();
                        cmpRet = onTouchX > r.left && onTouchX < r.x + r.width &&
                            onTouchY > r.top && onTouchY < r.y + r.height
                            && ( endType == 0 ? onTouchMove : onClick);
                    }
                }

            }else if(type == 3){
                return true;
            }

            return cmpRet
        }

        function dataToVar(ifArrayIn){
            var ifArray = ifArrayIn.split(",");

            //console.log("ifArray------------>"+ifArray);

            type = 0;
            if(ifArray[0].toLowerCase().indexOf("ex") > -1){
                type = 1;
                id = parseInt(ifArray[0].split("|")[1]); //--split("\\|")
                op = parseInt(ifArray[1]);
                otherVar = parseInt(ifArray[2]);
                idOrValue = parseInt(ifArray[3]);
                haveElse = parseInt(ifArray[4]) != 0 ;
            }else if(ifArray[0].indexOf("MO") > -1){
                type = 2;
                IsRect = ifArray[1] === "0" ;
                if(IsRect){
                    var tempvar = ifArray[2].split(",");
                    rect = {
                        x : parseInt(tempvar[0]) * tv.zoomScene,
                        y : parseInt(tempvar[1]) * tv.zoomScene,
                        width : parseInt(tempvar[2]) * tv.zoomScene,
                        height : parseInt(tempvar[3]) * tv.zoomScene
                    }
                }else{
                    picId = parseInt(ifArray[2]);
                }
                endType = parseInt(ifArray[3]);
                haveElse = parseInt(ifArray[4]) != 0 ;
            }else if(ifArray[0].indexOf("FL") > -1){
                type = 3;
                op = parseInt(ifArray[1]);
                otherVar = parseInt(ifArray[2]);
                idOrValue = parseInt(ifArray[3]);
                haveElse = parseInt(ifArray[4]) != 0;
                /**add by ysxx   平台判断*↓↓↓↓↓↓↓↓↓*2014-8-20*****/
            }else if(ifArray[0].indexOf("PT") > -1){
                type = 4;
                idOrValue = parseInt(ifArray[3]);
                haveElse = parseInt(ifArray[4]) != 0;
                /**add by heshang   平台判断*↑↑↑↑↑↑↑↑↑*2015-10-30*****/
            }else if(ifArray[0].indexOf("PA") > -1){
                type = 5;
            }
            else if(ifArray.length > 6){
                if(ifArray[6].indexOf("TA")){
                    type = 6;//任务
                }
            }
            else{
                id = parseInt(ifArray[0]);
                op = parseInt(ifArray[1]);
                otherVar = parseInt(ifArray[2]);
                idOrValue = parseInt(ifArray[3]);
                haveElse = parseInt(ifArray[4]) != 0;
            }

        }

    }




    /**
     * 102 文本分歧结束
     */
    this.ITextEnd = function(e,m){
        this.event = e;
        this.main = m;

        this.init = function(){
            this.main.auxFetchBranchinfo();
            return false;
        };

        this.finish = function(){
            return true;
        }
    };

    /**
     * 103 文本自动播放
     */
    this.IAutoPlay = function(e,m){
        this.event = e;
        this.main = m;

        this.init = function(){
            tv.system.autoRun = (e.Argv[0] === "1");
            return false;
        };

        this.finish = function(){
            return true;
        }
    };

    /**
     * 104 - 文本快进
     */
    this.IQuickPlay = function(e,m){
        this.event = e;
        this.main = m;
        
        this.init = function(){
            tv.system.quickRun = (e.Argv[0] === "1"); 
            return false;
        };

        this.finish = function(){
            return true;
        }
    }
    
    /**
     * 107 注释
     */
    this.INotes = function(e,m){
        var isCallPayFlg = false;
        this.init = function(){
            var text = e.Argv[0];
            //如果是需要分享的情况
            if(isWeiXin() && text.indexOf("[SHARE]") > -1){
                /*
                var ts = text.split("\\n");
                var share_text = ts[1].substring(ts[1].indexOf(":") + 1,ts[1].indexOf("]"));
                var share_pic =  ts[2].substring(ts[2].indexOf(":") + 1,ts[2].indexOf("]"));
                var button1 =    ts[3].substring(ts[3].indexOf(":") + 1,ts[3].indexOf("]"));
                var button2 =    ts[4].substring(ts[4].indexOf(":") + 1,ts[4].indexOf("]"));
                var title =      ts[5].substring(ts[5].indexOf(":") + 1,ts[5].indexOf("]"));
                //获得页面空间
                document.getElementById("div_share").style.display = "inherit";
                document.getElementById("share_text").innerHTML = share_text;
                document.title = title;
                var path = ("Graphics/" + share_pic).toLowerCase();
                if(fileList[path] != null){
                    document.getElementById("share_pic").src = fileList[path].url();
                }
                document.getElementById("button_text1").innerHTML = button1;
                document.getElementById("button_text2").innerHTML = button2;
                */

            }else if(text.indexOf("@i~") > -1){
                try
                {
                    var inst = text.substring(3);
                    var args = inst.split("|") ;
                    if(args.length<2) return null ;
                    var argc = parseInt(args[1]);
                    if(argc!=args.length-2) return null ;
                    var code = parseInt(args[0]) ;
                    if(code==107) return null ;
                    var argv = new Array() ;
                    for(var i=2;i<args.length;i++)
                    {
                        argv[i-2] = args[i] ;
                    }
                    var devent = new DEvent1(code, e.Indent,argc,argv);
                    m.MakerEvent(devent);
                }
                catch(ex)
                {
                }
            }else if(text.indexOf("call_pay")> -1 ){
                //this.refresh();

                //function showLoginModel(){
                //    $(".ssologin")[0].click();
                //}
                //if(mark == "aBox"){
                //    if(typeof window.org_box == 'undefined'){
                //
                //    }else{
                //        window.org_box.SendFlower(document.title,gIndex);
                //    }
                //}else{//web 调用登录
                //    sLoading.showMask();
                //    if(publicUses.getUserInfo().uid==0 && !serverAjax.userInfo){
                //        sLoading.hideMask();
                //        $(".ssologin")[0].click();
                //    }else{
                //        sLoading.hideMask();
                //        var a = tv.scene;
                //        m.isEnd=true;
                //        tv.scene = new SCGSendFlower(a);
                //        return;
                //    }
                //}
                //m.isEnd=true;
                //return;
                ////调到call_pay后防止往下运行  刷新ui
                //tv.scene.refresh();
                function showLoginModel(){
                    $(".ssologin")[0].click();
                }
                if(mark == "aBox"){
                    if(typeof window.org_box == 'undefined'){

                    }else{
                        window.org_box.SendFlower(document.title,gIndex);
                    }
                }else if(mark == "isFlash"){
                    m.isEnd=true;
                    isCallPayFlg = true;
                    if(publicUses.getUserInfo() && publicUses.getUserInfo().uid != 0) {
                        sLoading.showMask();
                        serverAjax.get_userInfo(function () {
                            sLoading.hideMask();
                            window.parent.asUserOperate.sendFlowerWindow();
                            //调到call_pay后防止往下运行  刷新ui
                            tv.scene.refresh();
                        })
                    }else{
                        window.parent.asUserOperate.userLogin();
                        //调到call_pay后防止往下运行  刷新ui
                        tv.scene.refresh();
                    }
                }else{//web 调用登录
                    m.isEnd=true;
                    isCallPayFlg = true;
                    if(publicUses.getUserInfo() && publicUses.getUserInfo().uid != 0) {
                        sLoading.showMask();
                        serverAjax.get_userInfo(function () {
                            sLoading.hideMask();
                            changeVal();
                            $(".send_flowers_box").show();
                            ReDirectSharetes();
                            //调到call_pay后防止往下运行  刷新ui
                            tv.scene.refresh();
                        });
                    }else{
                        showLoginModel();
                        //调到call_pay后防止往下运行  刷新ui
                        tv.scene.refresh();
                    }
                }
            }
            if(isCallPayFlg){
                return true;
            }else{
                return false;
            }
        };

        this.finish = function(){
            return true;
        }
    }
    /**
     * 108 文本分歧内容
     */
    this.ITextChoice = function(e,m){
        this.init = function(){
            try
            {
                m.jumpToIndex(m.auxFetchBranchinfo().finishIndex);
            }
            catch(e){console.log("ITextChoice error!");}

            return false;
        };

        this.finish = function(){
            return true;
        };
    };
    /**
     * 109 消失对话框
     */
    this.IDisposeText = function(e,m){

        this.init = function(){
            for(var i=0;i<tv.canvas.message.length;i++){
                tv.canvas.message[i].msgBoxFadeOut();
            }

            tv.canvas.msgIndex=0;
            return false;
        };

        this.finish = function(){
            return true;
        };
    };
    /**


/**
     * 112 悬浮组件开关
     */
    this.IDFloatButton = function(e,m){
        this.init=function(){
            var value= parseInt(e.Argv[0]);
            if(value==0){//关闭
                tv.canvas.sFloatButton.setVisible(false);
            }else if(value==1){//开启
                tv.canvas.sFloatButton.setVisible(true);
            }
            return true;
        }

        this.finish = function(){
            return true;
        };
    }
     /* 事件 - 150 - 刷新UI     */
    this.IUpdateUI = function(e,m){
 
        this.init = function(){
            try{
                if(tv.scene instanceof SCUI){
                    tv.scene.updateControl();
                    return false;
                }else{
                    //console.log("IEventMaker:150");
                    return true;
                }
            }catch(err){
                console.log(err.message);
                return true;
            }
        };

        this.finish = function(){
            return true;
        };
    }

    /**
     * 事件 - 151 - 返回游戏界面
     */
    this.IBackGame = function(e,m){

        this.init = function() {
            tv.scene.dispose();
            if(ovideo._video){
                ovideo.videoShow();
            }
            tv.scene = new SGame();
            return false;
        }
        
        this.finish = function(){
            return true;
        };
    }
    

    /**
     * 200 - 条件分歧
     */
    this.IIF = function(e,m){
        var cmpRet = false;
        var isRect = false;
        var haveElse = false;
        var idOrValue = -1;
        var otherVar = -1;
        var op = -1;
        var type = 0;
        var id = -1;
        var picId = -1;
        var endType = -1;
        var rect;
        var bPayWait = false;
        var isClick=false;
        this.init = function(){
            var jumList = new Array();
            var endJump = 0;
            for(var i = m.pos;i<m.story.length;i++){
                var ev = m.story[i];
                if(ev.Code == 211 && ev.Indent == m.story[m.pos].Indent){
                    jumList.push(i+1);
                    continue;
                }
                if(ev.Code == 201 && ev.Indent == m.story[m.pos].Indent){
                    endJump = i + 1;
                    break;
                }
            }
            this.DataToVar();
            var valueA = -1;
            var valueB = -1;
            if(type <= 1){
                valueA = type == 0 ? tv.system.vars.getVar(id) : tv.system.varsEx.getVar(id);
                if(otherVar == 0){
                    valueB = idOrValue;
                }else if(otherVar == 1){
                    valueB = tv.system.vars.getVar(idOrValue);
                }else if(otherVar == 2){
                    valueB = tv.system.varsEx.getVar(idOrValue);
                }
                switch (op){
                    case 0 :
                        cmpRet = valueA == valueB;
                        break;
                    case 1:
                        cmpRet = valueA >= valueB;
                        break;
                    case 2:
                        cmpRet = valueA <= valueB;
                        break;
                    case 3:
                        cmpRet = valueA > valueB;
                        break;
                    case 4:
                        cmpRet = valueA < valueB;
                        break;
                    case 5:
                        cmpRet = valueA != valueB;
                        break;
                    default :
                        cmpRet = false;
                        break;
                }
            }else if(type == 2){
                if(isRect){
                    cmpRet = onTouchX > rect.x && onTouchX <= rect.x + rect.width &&
                        onTouchY > rect.y && onTouchY <= rect.y + rect.height && (endType == 0 ?
                        onTouchMove : onTouchDown);
                }else{
                    for(var j= m.storyId;j< m.story.length;j++){
                        if(parseInt(m.story[j].Code) == 200 && m.story[j].Argv[0].indexOf("MO") > -1){
                            if(parseInt(m.story[j].Argv[3]) == 1){
                                isClick =true;
                                break;
                            }
                        }
                        if(m.story[j].Code == 201){
                            break;
                        }
                    }
                    if(isClick){
                        if(tv.canvas.GamePictrue[picId].getBitmap() != null){
                            var r = tv.canvas.GamePictrue[picId].getRect();
                            cmpRet = onTouchX > r.x && onTouchX <= r.x + r.width &&
                                onTouchY > r.y && onTouchY <= r.y + r.height && (endType == 0 ?
                                    onTouchMove : onTouchDown);
                            //var r = tv.canvas.GamePictrue[picId].getRect();
                            //console.log(tv.canvas.GamePictrue[picId].respTranAreaMove());
                            //if(endType==0){
                            //    cmpRet = tv.canvas.GamePictrue[picId].respTranAreaMove();
                            //}else{
                            //    cmpRet = tv.canvas.GamePictrue[picId].respTranArea();
                            //}
                            //cmpRet = tv.canvas.GamePictrue[picId].respTranAreaMove() && (endType == 0 ?
                            //        onTouchMove : onTouchDown);
                        }
                    }else{
                        if(tv.canvas.GamePictrue[picId].getBitmap() != null){
                            var r = tv.canvas.GamePictrue[picId].getRect();
                            cmpRet = onTouchX > r.x && onTouchX <= r.x + r.width &&
                                onTouchY > r.y && onTouchY <= r.y + r.height && (endType == 0 ?
                                    onTouchMove : onTouchDown);
                            //var r = tv.canvas.GamePictrue[picId].getRect();
                            //console.log(tv.canvas.GamePictrue[picId].respTranAreaMove());
                            //if(endType==0){
                            //    cmpRet = tv.canvas.GamePictrue[picId].respTranAreaMove();
                            //}else{
                            //    cmpRet = tv.canvas.GamePictrue[picId].respTranArea();
                            //}
                            //cmpRet = tv.canvas.GamePictrue[picId].respTranAreaMove() && (endType == 0 ?
                            //        onTouchMove : onTouchDown);
                        }
                    }


                }
                //}else if(type==3){
                //    cmpRet=false;
                //}
                if(cmpRet){
                    clickThrough = true;
                    onTouchClick = false;
                }
            }else if(type == 3){ //鲜花判断
                /*三秒请求一次鲜花数量*/
                var self=this;
                this.isFun= function () {

                    if(otherVar == 0){
                        valueB = idOrValue;
                    }else if(otherVar == 1){
                        valueB = tv.system.vars.getVar(idOrValue);
                    }else if(otherVar == 2){
                        valueB = tv.system.varsEx.getVar(idOrValue);
                    }
                    switch (op){
                        case 0 :
                            cmpRet = valueA == valueB;
                            break;
                        case 1:
                            cmpRet = valueA >= valueB;
                            break;
                        case 2:
                            cmpRet = valueA <= valueB;
                            break;
                        case 3:
                            cmpRet = valueA > valueB;
                            break;
                        case 4:
                            cmpRet = valueA < valueB;
                            break;
                        case 5:
                            cmpRet = valueA != valueB;
                            break;
                        default :
                            cmpRet = false;
                            break;
                    }
                    if(cmpRet){
                        m.indentStack.push(new IFInfo(endJump));
                    }else {
                        if (haveElse) {
                            m.indentStack.push(new IFInfo(endJump));
                            m.jumpToIndex(jumList[0]);
                        } else {
                            m.jumpToIndex(endJump);
                        }
                    }
                }
                if(mark!="aBox"){
                    valueA=flowerHua;
                    self.isFun();
                }else{
                    //huaNum=flowerHua;
                    //alert("flowerHua"+flowerHua);
                    valueA=flowerHua;
                    self.isFun();
                }
                //}
            }else if(type == 4){
                cmpRet = idOrValue == 5;
            }else if (type == 5){//支付
                bPayWait = true;
                cmpRet=true;
                tv.system.varsEx.setVar(id,-1);
                ////模拟支付请求 1s后请求成功
                //setTimeout(function () {
                //    tv.system.varsEx.saveExData(function (str) {
                //        if(str==0){
                //            alert("数据保存失败，请存档后继续，以免数据丢失！")
                //        }else{
                //            tv.system.varsEx.setVar(id,1);
                //            alert("购买成功，确定后继续游戏！");
                //        }
                //    });
                //},500);
            }else if(type == 6){//任务
                function isFun() {
                    if(cmpRet){
                        m.indentStack.push(new IFInfo(endJump));
                    }else{
                        if(haveElse){
                            m.indentStack.push(new IFInfo(endJump));
                            m.jumpToIndex(jumList[0]);
                        }else{
                            m.jumpToIndex(endJump);
                        }
                    }
                    return false;
                }
                //用到时发送一个ajax请求 确认任务是否完成
                $.ajax({
                    url:AJAX_URL.GAME_TASK_CONTENT+"?gindex="+gIndex+"&task_id="+id,
                    type:"get",
                    dataType:"jsonp",
                    jsonp:"jsonCallBack",
                    success: function (data) {
                        if(data.status==1){
                            var task_info = data.data.task_info;
                            if(task_info.is_over){//已完成
                                cmpRet=true;
                            }else{//进行中||过期
                                cmpRet=false;
                            }
                            isFun();
                        }else{
                            cmpRet=false;
                            isFun();
                        }
                    },
                    error: function () {
                        cmpRet=false;
                        isFun();
                    }
                });
            }
            if(type!=3 && type!=6){
                if(cmpRet){
                    m.indentStack.push(new IFInfo(endJump));
                }else{
                    if(haveElse){
                        m.indentStack.push(new IFInfo(endJump));
                        m.jumpToIndex(jumList[0]);
                    }else{
                        m.jumpToIndex(endJump);
                    }
                }
                return false;
            }
        };
        this.finish = function(){
            /*如果要接支付进行异步操作是  先return false 之后完成之后return true*/
            return true;
        };
        //
        //this.finish = function(){
        //        return true;
        //};
        this.update=function(){}

        /*
         * e.Argv[0]  PA 和二周目索引
         * e.Argv[1]  是否恢复购买
         *e.Argv[2] 商品名称（id）
         * */
        this.DataToVar = function(){
            if(e.Argv[0].indexOf("EX") > -1){
                type = 1;
                id = parseInt(e.Argv[0].split("|")[1]);
                op = parseInt(e.Argv[1]);
                otherVar = parseInt(e.Argv[2]);
                idOrValue = parseInt(e.Argv[3]);
                haveElse = parseInt(e.Argv[4]) != 0;
            }else if(e.Argv[0].indexOf("MO") > -1){
                type = 2;
                isRect = e.Argv[1] == "0";
                if(isRect){
                    var tempvar = e.Argv[2].split(",");
                    rect = {
                        x : parseInt(tempvar[0]),
                        y : parseInt(tempvar[1]),
                        width : parseInt(tempvar[2]),
                        height : parseInt(tempvar[3])
                    }
                }else{
                    picId = parseInt(e.Argv[2]);
                }
                endType = parseInt(e.Argv[3]);
                haveElse = parseInt(e.Argv[4]) != 0;
            }else if(e.Argv[0].indexOf("FL") > -1){
                type = 3;
                op = parseInt(e.Argv[1]);
                otherVar = parseInt(e.Argv[2]);
                idOrValue = parseInt(e.Argv[3]);
                haveElse = parseInt(e.Argv[4]) != 0;
            }else if(e.Argv[0].indexOf("PT") > -1){
                type = 4;
                idOrValue = parseInt(e.Argv[3]);
                haveElse = parseInt(e.Argv[4]) != 0;
            }else if(e.Argv[0].indexOf("PA")>-1){
                type = 5;
                //二周目索引
                id = parseInt(e.Argv[0].split('|')[1]);
                //在这里标识商品id;
                op = parseInt(e.Argv[2]);
            }else if(e.Argv.length > 6){
                if(e.Argv[6].indexOf("TA")){
                    type = 6;//任务
                    haveElse = parseInt(e.Argv[4]) != 0;//有无else
                    id=parseInt(e.Argv[6].split('|')[1]);//任务id
                }
            }else {
                id = parseInt(e.Argv[0]);
                op = parseInt(e.Argv[1]);
                otherVar = parseInt(e.Argv[2]);
                idOrValue = parseInt(e.Argv[3]);
                haveElse = parseInt(e.Argv[4]) != 0;
            }
        }
    };

    /**
     * 217 - 高级条件分歧.
     * 之前的条件分歧逻辑重写。rusheng
     */
    this.IIFEx = function(e,m)
    {
        var taskArr,asArr,cmpRet = false;
        var isFinish = false;
        var endJump = 0;
        var jumList;
        this.init = function()
        {
            taskArr=new Array();

            asArr = new Array();

            jumList = new Array();
            for(var i = m.pos;i<m.story.length;i++)
            {
                var ev = m.story[i];
                if(ev.Code == 211 && ev.Indent == m.story[m.pos].Indent){
                    jumList.push(i+1);
                    continue;
                }
                if(ev.Code == 201 && ev.Indent == m.story[m.pos].Indent)
                {
                    endJump = i + 1;
                    break;
                }
            }
            var num = parseInt(e.Argv[3]);//数量
            var isOr = parseInt(e.Argv[0])==0 ;//
            var i =0 ;
            while(num>0)
            {
                var args = e.Argv[4+i].split("&") ;
                var e1= new DEvent1("","","", args);
                if(isOr)//或
                {
                    //console.log("或------>");
                    if(checkIIF(e1,taskArr,asArr))
                    {
                        cmpRet = true ;break ;
                    }
                }
                else//与
                {
                    //console.log("与------>");
                    if( !checkIIF(e1,taskArr,asArr))
                    {
                        cmpRet = false ;break ;
                    }
                    cmpRet = true ;
                }
                i++ ;
                num-- ;
            }
            if(asArr.length>0){
                if(operationCloud.getUid() == 0){
                    if(!isOr){
                        cmpRet=false;
                    }
                    asArr.length = 0;
                }else{
                    $.ajax({
                        url:AJAX_URL.GAME_AS_CONTENT+"?gindex="+gIndex+"&uid="+operationCloud.getUid(),
                        type:"get",
                        dataType:"jsonp",
                        jsonp:"jsonCallBack",
                        success: function (data) {
                            asArr.length = 0;
                            if(data.status==1){
                                var task_info = data.status;
                                if(parseInt(task_info)==1){//已完成
                                    if(isOr){
                                        cmpRet=true;
                                    }
                                }else{//进行中||过期
                                    if(!isOr){
                                        cmpRet=false;
                                    }
                                }
                            }else{
                                if(!isOr){
                                    cmpRet=false;
                                }
                            }
                        },
                        error: function () {
                            asArr.length = 0;
                            if(!isOr){
                                cmpRet=false;
                            }
                        }
                    });
                }

            }
            if(taskArr.length<=0){
                //return false;
            }else{
                var j = 0;
                /*
                * 递归判断任务完成进度
                * */
                function get_task_info(){
                    //用到时发送一个ajax请求 确认任务是否完成
                    if(j<taskArr.length){
                        $.ajax({
                            url:AJAX_URL.GAME_TASK_CONTENT+"?gindex="+gIndex+"&task_id="+taskArr[j],
                            type:"get",
                            dataType:"jsonp",
                            jsonp:"jsonCallBack",
                            success: function (data) {
                                if(data.status==1){
                                    var task_info = data.data.task_info;
                                    if(task_info.is_over){//已完成
                                        if(isOr){
                                            cmpRet=true;
                                        }
                                    }else{//进行中||过期
                                        if(!isOr){
                                            cmpRet=false;
                                        }
                                    }
                                    j++;
                                    get_task_info();
                                }else{
                                    if(!isOr){
                                        cmpRet=false;
                                    }
                                    j++;
                                    get_task_info();
                                }
                            },
                            error: function () {
                                if(!isOr){
                                    cmpRet=false;
                                }
                                j++;
                                get_task_info();
                            }
                        });
                    }else{
                        return false;
                    }

                };

                get_task_info();
            }
	    //isFlash
            if(taskArr.length <= 0 && asArr.length <= 0){
                isFinish = true;
            }
            if(isFinish){
                var haveElse = parseInt(e.Argv[1])=="1" ;
                if(cmpRet)
                {
                    m.indentStack.push(new IFInfo(endJump));
                }
                else
                {
                    if(haveElse){
                        m.indentStack.push(new IFInfo(endJump));
                        m.jumpToIndex(jumList[0]);
                    }else{
                        m.jumpToIndex(endJump);
                    }
                }
            }
        }
        this.finish = function()
        {

            return isFinish;
        };
        this.update=function(){};

    };

    /**
     * 201 - 条件分歧结束
     */
    this.IIfEnd = function(e,m){

        this.init = function(){
            m.auxFetchIfinfo();
            return false;
        };

        this.finish = function(){
            return true;
        }
    };
    /**
     * 202 - 循环
     */
    this.ILoop = function(e,m){
        this.init = function(){
            for(var i = m.pos;i<m.story.length;i++){
                var ev = m.story[i];
                if(ev.Code == 203 && ev.Indent == m.story[m.pos].Indent){
                    m.indentStack.push(new LoopInfo(m.pos + 1,i+1));
                    break;
                }
            }
            return false;
        };

        this.finish = function(){
            return true;
        };
    };
    /**
     * 203 - 以上反复
     */
    this.ILoopAboveStart = function(e,m){

        this.init = function(){
            if(m.indentStack.length != 0){
                m.jumpToIndex(m.indentStack[m.indentStack.length - 1].loopindex);
            }
            return false;
        };
        this.finish = function(){
            return true;
        }
    };
    /**
     * 204 - 图片选项
     */
    this.IButtonDif = function(e,m){
        this.init = function(){
            var jumList = new Array();
            var endJump = 0;
            for(var i = m.pos;i<m.story.length;i++){
                var ev = m.story[i];
                if(ev.Code == 212 && ev.Indent == m.story[m.pos].Indent + 1){
                    jumList.push(i+1);
                    continue;
                }
                if(ev.Code == 205 && ev.Indent == m.story[m.pos].Indent){
                    endJump = i + 1;
                    break;
                }
            }

            m.indentStack.push(new BranchInfo(jumList,endJump));

            var buttons = new Array(e.Argv.length);
            for(var i = 0;i<buttons.length;i++){

                var s = e.Argv[i].split(",");
                buttons[i] = new DButtonIndex(s);
            }
            tv.canvas.ButtonChoice.setupChoice(buttons);
            return false;
        };
        this.finish = function(){
            if(!tv.canvas.ButtonChoice.isFinish()) {return false;}
            m.jumpToIndex(m.indentStack[m.indentStack.length - 1].jump(tv.canvas.ButtonChoice.index));
        };

        this.update = function(){}
    };
 
    /**
     * 205 - 图片选项结束
     */
    this.IButtonDifEnd = function(e,m){
        this.init = function(){
            m.auxFetchBranchinfo();
            return false;
        };

        this.finish = function(){
            return true;
        }
    };
    /**
     * 206 - 跳转剧情
     */
    this.IJumpStory = function(e,m){
        this.event = e;
        this.main = m;
        this.init = function(){
            //tv.inter.jumpStory(parseInt(this.event.Argv[0]));
            this.main.jumpStory(parseInt(this.event.Argv[0]));
            if(this.event.Argv[1] === '1'){
                tv.canvas.fadeOut();
            }
            return true;
        };
        this.finish = function()
        {
            var data=tv.data.getStory(this.event.Argv[0]) ;
            if(data)
            {
                return true ;
            }
            return false;
        }
        this.update=function(){
        }
    };
    /**
     * 事件 - 207 - 数值操作
     */
    this.IVar = function(e,m){
        var userindex;
        var id;
        var type;
        var randA;
        var randB;
        var idOrValue;
        var op;
        //任务点数类型
        var task_id,point_type;
        var isFinish=false;

        this.init = function(){
            this.DataToVar();
            var valueA = 0;
            var valueB = 0;
            if(userindex){
                valueA = tv.system.vars.getVar(tv.system.vars.getVar(id) - 1);
            }else{
                valueA = tv.system.vars.getVar(id);
            }
            if(type == 0){
                valueB = idOrValue;
            }else if(type == 1){
                valueB = tv.system.vars.getVar(idOrValue);
            }else if(type == 2){
                var d = randB - randA;
                valueB = randA + parseInt(Math.random() * d);
            }else if(type == 3){
                valueB = tv.system.varsEx.getVar(idOrValue);
            }else if(type == 4){
                valueB = tv.system.vars.getVar(tv.system.vars.getVar(idOrValue) - 1);
            }else if(type == 5){//服务器时间
                var tm=Math.floor(new Date().getTime()/1000);
                var sysDate=getDate((parseInt(systemTime.sysTimestramp)+(tm-parseInt(systemTime.nowTimestramp)))*1000);
                switch (idOrValue)
                {
                    case 0 :
                        valueB = parseInt(sysDate.getFullYear()) ;break ;
                    case 1 :
                        valueB = parseInt(sysDate.getMonth()+1) ;break ;
                    case 2 :
                        valueB = parseInt(sysDate.getDate()) ;break ;
                    case 3 :
                        if( sysDate.getDay() ==0)
                        {
                            valueB = "7" ;
                        }
                        else
                        {
                            valueB = parseInt(sysDate.getDay()) ;
                        }
                        break ;
                    case 4 :
                        valueB = parseInt(sysDate.getHours()) ;break ;
                    case 5 :
                        valueB = parseInt(sysDate.getMinutes()) ;break ;
                    case 6 :
                        valueB = parseInt(sysDate.getSeconds()) ;break ;
                    case 7 :
                    {
                        //valueB = systemTime.sysTimestramp ;break ;
                        valueB = parseInt(sysDate.getTime()/1000) ;break ;
                    }
                }
            }else if(type == 9){
                function isFun(){
                    switch (op){
                        case 0:
                            valueA = valueB;
                            break;
                        case 1:
                            valueA += valueB;
                            break;
                        case 2:
                            valueA -= valueB;
                            break;
                        case 3:
                            valueA *= valueB;
                            break;
                        case 4:
                            valueA = parseInt(valueA / valueB);
                            break;
                        case 5:
                            valueA = parseInt(valueA % valueB);
                            break;
                    }
                    if(userindex){
                        tv.system.vars.setVar(tv.system.vars.getVar(id) - 1,valueA)
                    }else{
                        tv.system.vars.setVar(id,valueA);
                    }
                    isFinish=true;
                    return false;
                }
                $.ajax({
                    url:AJAX_URL.GAME_TASK_CONTENT+"?gindex="+gIndex+"&task_id="+task_id,
                    type:"get",
                    dataType:"jsonp",
                    jsonp:"jsonCallBack",
                    success: function (data) {
                        if(data.status==1){
                            var task_info = data.data.task_info;
                            if(parseInt(point_type) == 0){//当前点数
                                valueB = parseInt(task_info.point_over);
                            }else if(parseInt(point_type) == 1){//总点数
                                valueB = parseInt(task_info.point_max);
                            }
                            isFun();
                        }else{
                            isFun();
                        }
                    },
                    error: function () {
                        isFun();
                    }
                });
            }else if (type==10){
                switch (idOrValue)
                {
                    case 0 :
                        valueB = new Date().getFullYear() ;break ;
                    case 1 :
                        valueB = new Date().getMonth()+1 ;break ;
                    case 2 :
                        valueB = new Date().getDate() ;break ;
                    case 3 :
                        if( new Date().getDay() ==0)
                        {
                            valueB = "7" ;
                        }
                        else
                        {
                            valueB = new Date().getDay() ;
                        }
                        break ;
                    case 4 :
                        valueB = new Date().getHours() ;break ;
                    case 5 :
                        valueB = new Date().getMinutes() ;break ;
                    case 6 :
                        valueB = new Date().getSeconds() ;break ;
                    case 7 :
                    {
                        valueB = parseInt(Date.now()/1000) ;break ;
                    }
                }
            }
            if(type!=9){
                switch (op){
                    case 0:
                        valueA = valueB;
                        break;
                    case 1:
                        valueA += valueB;
                        break;
                    case 2:
                        valueA -= valueB;
                        break;
                    case 3:
                        valueA *= valueB;
                        break;
                    case 4:
                        valueA = parseInt(valueA / valueB);
                        break;
                    case 5:
                        valueA = parseInt(valueA % valueB);
                        break;
                }
                if(userindex){
                    tv.system.vars.setVar(tv.system.vars.getVar(id) - 1,valueA)
                }else{
                    tv.system.vars.setVar(id,valueA);
                }
                return false;
            }
        };

        this.finish = function(){
            if(type!=9){
                return true;
            }else{
                return isFinish;
            }
        };
        this.update = function () {}
        this.DataToVar = function(){
            id = parseInt(e.Argv[0]);
            op = parseInt(e.Argv[1]);
            type = parseInt(e.Argv[2]);
            if(type == 2){
                randA = parseInt(e.Argv[3].split("|")[0]);
                randB = parseInt(e.Argv[3].split("|")[1]);
            }else if(type == 9){
                task_id= parseInt(e.Argv[3].split("|")[0]);
                point_type=parseInt(e.Argv[3].split("|")[1]);
            }else{
                idOrValue = parseInt(e.Argv[3]);
            }
            userindex = e.Argv.length >= 6 ? e.Argv[5] == "1" : false;
        }
    };
    /**
     * 208 返回标题画面
     */
     this.IBackTitle = function(e,m){
        this.init = function(){
            m.endInter();
            return false;
        }

        this.finish = function(){
            return true;
        }
     }
    /**
     * 209 - 跳出循环
     */
    this.ILoopBreak = function(e,m){
        this.init = function(){
            var loopInfo = null;
            for(var i = 0;i<parseInt(e.Argv[0]);i++){
                loopInfo = m.auxFetchLoopinfo();
            }
            if(loopInfo){
                m.jumpToIndex(loopInfo.breakindex);
            }
            return false;
        };

        this.finish = function(){
            return true;
        };
    };

    /**
     * 210 - 等待
     */
    this.IWait = function(e,m){
        this.event = e;
        this.main = m;
        var time = 0;
        this.init = function(){
            time = parseInt(this.event.Argv[0]);
            if(time >= 30){ //制作工具里默认的等待帧>30后对话框消失
                if(!tv.canvas.message[tv.canvas.msgIndex].isRoll){
                    tv.canvas.message[tv.canvas.msgIndex].msgBoxFadeOut();
                }
            }
            time = time / 2; //0417 帧率调整后做等价处理   * FPS / 60;
            time = parseInt(time);
            if(time <= 0){
                time = 1;
            }
            return false;
        };

        this.update = function(){
            time -= 1;
        };

        this.finish = function(){
            if(onTouchLong && time > 1){
                time = 1;
            }
            return time <= 0;
        }
    };
    /**
     * 211 - 除此之外的场合
     */
    this.IIfChoice = function(e,m){
        this.init = function(){
            m.jumpToIndex(m.auxFetchIfinfo().finishJumpIndex);
            return false;
        };

        this.finish = function(){
            return true;
        };
    };
    /**
     * 212 - 图片选项内容
     */
    this.IButtonDifChoose = function(e,m){
        this.init = function(){
            m.jumpToIndex(m.auxFetchBranchinfo().finishIndex);
        };

        this.finish = function(){
            return true;
        }
    }


    /*
     * heshang
     *213 二周目
     * */
    this.IVarEx = function(e,m){
        var userindex;
        var id;
        var type;
        var randA;
        var randB;
        var idOrValue;
        var op;
        //任务点数类型
        var task_id,point_type;
        var isFinish=false;
        this.init = function(){
            this.DataToVar();
            var valueA = 0;
            var valueB = 0;
            if(userindex){
                valueA = tv.system.varsEx.getVar(tv.system.varsEx.getVar(id) - 1);
            }else{
                valueA = tv.system.varsEx.getVar(id);
            }
            if(type == 0){
                valueB = idOrValue;
            }else if(type == 1){
                valueB = tv.system.vars.getVar(idOrValue);
            }else if(type == 2){
                var d = randB - randA;
                valueB = randA + Math.random() * d;
            }else if(type == 3){
                valueB = tv.system.varsEx.getVar(idOrValue);
            }else if(type == 4){
                valueB = tv.system.vars.getVar(tv.system.vars.getVar(idOrValue) - 1)
            }else if(type == 5){
                var tm=Math.floor(new Date().getTime()/1000);
                var sysDate=getDate((parseInt(systemTime.sysTimestramp)+(tm-parseInt(systemTime.nowTimestramp)))*1000);
                switch (idOrValue)
                {
                    case 0 :
                        valueB = sysDate.getFullYear() ;break ;
                    case 1 :
                        valueB = sysDate.getMonth()+1 ;break ;
                    case 2 :
                        valueB = sysDate.getDate() ;break ;
                    case 3 :
                        if( sysDate.getDay() ==0)
                        {
                            valueB = "7" ;
                        }
                        else
                        {
                            valueB = sysDate.getDay() ;
                        }
                        break ;
                    case 4 :
                        valueB = sysDate.getHours() ;break ;
                    case 5 :
                        valueB = sysDate.getMinutes() ;break ;
                    case 6 :
                        valueB = sysDate.getSeconds() ;break ;
                    case 7 :
                    {
                        //valueB = systemTime.sysTimestramp ;break ;
                        valueB = parseInt(sysDate.getTime()/1000) ;break ;
                    }
                }
            }else if(type == 9){

                function isFun(){
                    switch (op){
                        case 0:
                            valueA = valueB;
                            break;
                        case 1:
                            valueA += valueB;
                            break;
                        case 2:
                            valueA -= valueB;
                            break;
                        case 3:
                            valueA *= valueB;
                            break;
                        case 4:
                            valueA = parseInt(valueA / valueB);
                            break;
                        case 5:
                            valueA = parseInt(valueA % valueB);
                            break;
                    }
                    if(userindex){
                        tv.system.varsEx.setVar(tv.system.varsEx.getVar(id) - 1,valueA);
                        tv.system.varsEx.saveExData();
                    }else{
                        tv.system.varsEx.setVar(id,valueA);
                        tv.system.varsEx.saveExData();
                    }
                    isFinish=true;
                    return false;
                }
                $.ajax({
                    url:AJAX_URL.GAME_TASK_CONTENT+"?gindex="+gIndex+"&task_id="+task_id,
                    type:"get",
                    dataType:"jsonp",
                    jsonp:"jsonCallBack",
                    success: function (data) {
                        if(data.status==1){
                            var task_info = data.data.task_info;
                            if(parseInt(point_type) == 0){//当前点数
                                valueB = parseInt(task_info.point_over);
                            }else if(parseInt(point_type) == 1){//总点数
                                valueB = parseInt(task_info.point_max);
                            }
                            isFun();
                        }else{
                            isFun();
                        }
                    },
                    error: function () {
                        isFun();
                    }
                });
            }else if (type== 10){
                switch (idOrValue)
                {
                    case 0 :
                        valueB = new Date().getFullYear() ;break ;
                    case 1 :
                        valueB = new Date().getMonth()+1 ;break ;
                    case 2 :
                        valueB = new Date().getDate() ;break ;
                    case 3 :
                        if( new Date().getDay() ==0)
                        {
                            valueB = "7" ;
                        }
                        else
                        {
                            valueB = new Date().getDay() ;
                        }
                        break ;
                    case 4 :
                        valueB = new Date().getHours() ;break ;
                    case 5 :
                        valueB = new Date().getMinutes() ;break ;
                    case 6 :
                        valueB = new Date().getSeconds() ;break ;
                    case 7 :
                        valueB = parseInt(Date.now()/1000) ;break ;
                }
            }
            switch (op){
                case 0:
                    valueA = valueB;
                    break;
                case 1:
                    valueA += valueB;
                    break;
                case 2:
                    valueA -= valueB;
                    break;
                case 3:
                    valueA *= valueB;
                    break;
                case 4:
                    valueA /= valueB;
                    break;
                case 5:
                    valueA %= valueB;
                    break;
            }
            if(userindex){
                tv.system.varsEx.setVar(tv.system.varsEx.getVar(id) - 1,valueA);
                tv.system.varsEx.saveExData();
            }else{
                tv.system.varsEx.setVar(id,valueA);
                tv.system.varsEx.saveExData();
            }
            return false;
        };

        this.finish = function(){
            if(type!=9){
                return true;
            }else{
                return isFinish;
            }
        };

        this.DataToVar = function(){
            id = parseInt(e.Argv[0]);
            op = parseInt(e.Argv[1]);
            type = parseInt(e.Argv[2]);
            if(type == 2){
                randA = parseInt(e.Argv[3].split("|")[0]);
                randB = parseInt(e.Argv[3].split("|")[1]);
            }else if(type == 9){
                task_id= parseInt(e.Argv[3].split("|")[0]);
                point_type=parseInt(e.Argv[3].split("|")[1]);
            }else{
                idOrValue = parseInt(e.Argv[3]);
            }
            userindex = e.Argv.length >= 6 ? e.Argv[5] == "1" : false;
        }
    };
    /*
     * heshang
     *
     * */


     /**
     * 214 - 呼叫菜单
     */
    this.ICallMenu = function(e,m){
        var isSuiFinish = false;
        this.init = function(){
            var index = parseInt(e.Argv[0]);
            switch(index){
             case 10001: //游戏菜单
                if(tv.scene instanceof SCUI) tv.scene.dispose();
                tv.scene = new SMenu();
                break;
            case 10002: //剧情回放
                if(tv.scene instanceof SCUI) tv.scene.dispose();
                tv.scene = new SReplay();
                break;
            case 10003: //CG鉴赏
                if(tv.scene instanceof SCUI) tv.scene.dispose();
                tv.scene = new SCG(false);
                break;
            case 10004: //BGM鉴赏
                if(tv.scene instanceof SCUI) tv.scene.dispose();
                tv.scene = new SBGM(false);
                break;
            case 10005: //存档
                if(tv.scene instanceof SCUI) tv.scene.dispose();
                tv.scene = new SSavefile(false, true);
                break;
            case 10006: //读档
                if(tv.scene instanceof SCUI) tv.scene.dispose();
                tv.scene = new SSavefile(false, false);
                break;
            case 10007: //游戏设置
                if(tv.scene instanceof SCUI)
                    tv.scene.dispose();
                tv.scene = new SSystem(false,m);
                break;
            case 10008: //离开游戏
                if(tv.scene instanceof SCUI) tv.scene.dispose();
                //GameMainScene.ExitGame();
                break;
            case 10009: //自动游戏
                if(tv.scene instanceof SCUI) tv.scene.dispose();
                tv.system.autoRun = !tv.system.autoRun;
                tv.scene = new SGame();
                break;
            default:   //自制菜单
                //    tv.scene.dispose();
                //    tv.scene = new SCUI(index);
                //    console.log("aaaa");
                //break;
                var data = tv.data.System.Cuis[index];
                if(data.loadEvent.length<=0&&data.afterEvent.length<=0&&data.controls.length<=0){
                    isSuiFinish = true;
                    break;
                }else{
                    if(tv.scene instanceof SCUI) {
                        tv.scene.dispose();
                        tv.scene.Build(index);
                    }else{
                        tv.scene = new SCUI(index);
                        break;
                    }
                }

            }

            return false;
        };

        //0729 防止解释器呼叫菜单时偷跑
        this.update = function(){

        }

        this.finish = function(){
            if(tv.scene instanceof SGame||isSuiFinish){
                return true; //0729 防止解释器呼叫菜单时偷跑 true
            }else{
               return false;
            }
        };
    }
    /**
     * 事件 - 215 - 字符串
     */
    this.IString = function(e,m){
        this.e = e;
        this.m = m;

        this.init = function(){
            tv.system.string.setVar(parseInt(this.e.Argv[0]),
                    //add by ysxx -↓↓↓↓↓-2014/6/4--- 投票添加  --增加event.code判断事件类型是资源引入的类型还是文本显示类型----
                    tv.canvas.message[tv.canvas.msgIndex].madeString(this.e.Argv[1], 0,this.e.Code));
                    //add by ysxx -↑↑↑↑↑-2014/6/4---------------------------------------------
            return false;
        }

        this.finish = function(){
            return true;
        };
    }

    /**
     * 事件 - 216 - 高级数值操作
     * 0：数值索引（二周目为: EX|数值索引） 5
     * 1：操作符id(=,+=,-=,*=,/=,%=)   0
     * 2：操作数为常量(0)、其他数值(1)、随机数(2)、二周目变量(3)、索引变量(4)、时间变量(5)、 鲜花数(6)、最大值(7)、最小值(8)  0
     * 3：值或最大、小值 [n|固定数,v(数值)|1(索引位置),x(二周目数值)|1,s|索引数值]   55
     * 4：显示信息
     * 5：数值(0)或索引(1)
     *【6：操作index(=,+,-,*,/,%) （若为-1后面忽略  7同2   8同3】
     *
     * 0,1,2,2|1000,[001:与橙娘的好感度] += （ 随机数[2~1000] + Max{10,二周目数值[001:通关次数],数值[001:与橙娘的好感度],0} ）,0,0,7,n|10,x|0,v|0,n|0
     */
    this.IAdvData = function(e,m){
        var userindex;
        var id;
        var type;
        var randA;
        var randB;
        var idOrValue;
        var op;
        var isEx;
        //任务点数类型
        var task_id,point_type;
        var isFinish=false;

        this.init = function(){
            var valueA = 0;
            var valueB = 0;
            this.getLocalValueB = function () {
                if(type == 0){
                    valueB = idOrValue;
                }else if(type == 1){
                    valueB = tv.system.vars.getVar(idOrValue);
                }else if(type == 2){
                    var d = randB - randA;
                    valueB = randA + parseInt(Math.random() * d);
                }else if(type == 3){
                    valueB = tv.system.varsEx.getVar(idOrValue);
                }else if(type == 4){
                    valueB = tv.system.vars.getVar(tv.system.vars.getVar(idOrValue) - 1)
                }else if(type == 5){//服务器时间
                    var tm=Math.floor(new Date().getTime()/1000);
                    var sysDate=getDate((parseInt(systemTime.sysTimestramp)+(tm-parseInt(systemTime.nowTimestramp)))*1000);
                    switch (idOrValue)
                    {
                        case 0 :
                            valueB = parseInt(sysDate.getFullYear()) ;break ;
                        case 1 :
                            valueB = parseInt(sysDate.getMonth())+1 ;break ;
                        case 2 :
                            valueB = parseInt(sysDate.getDate()) ;break ;
                        case 3 :
                            if( parseInt(sysDate.getDay()) ==0)
                            {
                                valueB = "7" ;
                            }
                            else
                            {
                                valueB = parseInt(sysDate.getDay()) ;
                            }
                            break ;
                        case 4 :
                            valueB = parseInt(sysDate.getHours()) ;break ;
                        case 5 :
                            valueB = parseInt(sysDate.getMinutes()) ;break ;
                        case 6 :
                            valueB = parseInt(sysDate.getSeconds()) ;break ;
                        case 7 :
                        {
                            //valueB = systemTime.sysTimestramp ;break ;
                            valueB = parseInt(sysDate.getTime()/1000) ;break ;
                        }
                    }
                }else if(type == 6) {//鲜花数
                    valueB = flowerHua;
                }else if(type == 7) {//最大值
                    var maxStr=e.Argv[3];
                    var maxArr=this.getMaxMinNumArr(maxStr);
                    for(var i=0;i<maxArr.length;i++){
                        if(valueB<parseInt(maxArr[i])){
                            valueB=parseInt(maxArr[i]);
                        }
                    }
                }else if(type == 8) {//最小值
                    var maxStr=e.Argv[3];
                    var minArr=this.getMaxMinNumArr(maxStr);
                    valueB = parseInt(minArr[0]);
                    for(var i=0;i<minArr.length;i++){
                        if(valueB>parseInt(minArr[i])){
                            valueB=parseInt(minArr[i]);
                        }
                    }
                }else if (type==10){
                    switch (idOrValue)
                    {
                        case 0 :
                            valueB = new Date().getFullYear() ;break ;
                        case 1 :
                            valueB = new Date().getMonth()+1 ;break ;
                        case 2 :
                            valueB = new Date().getDate() ;break ;
                        case 3 :
                            if( new Date().getDay() ==0)
                            {
                                valueB = "7" ;
                            }
                            else
                            {
                                valueB = new Date().getDay() ;
                            }
                            break ;
                        case 4 :
                            valueB = new Date().getHours() ;break ;
                        case 5 :
                            valueB = new Date().getMinutes() ;break ;
                        case 6 :
                            valueB = new Date().getSeconds() ;break ;
                        case 7 :
                        {
                            valueB = parseInt(Date.now()/1000) ;break ;
                        }
                    }
                }
                return valueB;
            }
            this.getValueA = function (valueB) {
                switch (op){
                    case 0:
                        valueA = valueB;
                        break;
                    case 1:
                        valueA += valueB;
                        break;
                    case 2:
                        valueA -= valueB;
                        break;
                    case 3:
                        valueA *= valueB;
                        break;
                    case 4:
                        valueA = parseInt(valueA / valueB);
                        break;
                    case 5:
                        valueA = parseInt(valueA % valueB);
                        break;
                }
                return valueA;
            }
            this.getServerValueB = function(callBack){
                function isFun(){
                    switch (op){
                        case 0:
                            valueA = valueB;
                            break;
                        case 1:
                            valueA += valueB;
                            break;
                        case 2:
                            valueA -= valueB;
                            break;
                        case 3:
                            valueA *= valueB;
                            break;
                        case 4:
                            valueA = parseInt(valueA / valueB);
                            break;
                        case 5:
                            valueA = parseInt(valueA % valueB);
                            break;
                    }
                    if(userindex){
                        tv.system.vars.setVar(tv.system.vars.getVar(id) - 1,valueA)
                    }else{
                        tv.system.vars.setVar(id,valueA);
                    }
                    callBack();
                    return false;
                }
                $.ajax({
                    url:AJAX_URL.GAME_TASK_CONTENT+"?gindex="+gIndex+"&task_id="+task_id,
                    type:"get",
                    dataType:"jsonp",
                    jsonp:"jsonCallBack",
                    success: function (data) {
                        if(data.status==1){
                            var task_info = data.data.task_info;
                            if(parseInt(point_type) == 0){//当前点数
                                valueB = parseInt(task_info.point_over);
                            }else if(parseInt(point_type) == 1){//总点数
                                valueB = parseInt(task_info.point_max);
                            }
                            isFun();
                        }else{
                            isFun();
                        }
                    },
                    error: function () {
                        isFun();
                    }
                });
            }
            if(type == 9){//异步
                this.getServerValueB(function(){
                    isFinish=true;
                    if(e.Argv[6]&& e.Argv[6]>-1){
                        isFinish=false;
                        this.DataToVarAgain();
                        this.getServerValueB(function(){
                            isFinish=true;
                        });
                    }
                })
            }else
            {
                if(e.Argv[6]>-1) {
                    this.DataToVar();
                    valueA = this.getLocalValueB();
                    this.DataToVarAgain();
                    var valueB1 = this.getLocalValueB();
                    valueB = this.getValueA(valueB1);
                    this.DataToVar();
                }else{
                    this.DataToVar();
                    valueB = this.getLocalValueB();
                }
                if(userindex){
                    valueA = tv.system.vars.getVar(tv.system.vars.getVar(id) - 1);
                }else{
                    valueA = tv.system.vars.getVar(id);
                }
                valueA = this.getValueA(valueB);
                //console.log(a,b,c,"高级数值", e.Argv);
                if(userindex){
                    if(isEx){
                        tv.system.varsEx.setVar(tv.system.vars.getVar(id) - 1,valueA)
                    }else{
                        tv.system.vars.setVar(tv.system.vars.getVar(id) - 1,valueA)
                    }
                }else{
                    if(isEx){
                        tv.system.varsEx.setVar(id,valueA);
                    }else{
                        tv.system.vars.setVar(id,valueA);
                    }
                }
                isFinish = true;
            }

        };
        this.getMaxMinNumArr = function (str) {
            var strArr=str.split('n|');
            var str1="";
            for(var i=0;i<strArr.length;i++){
                str1+=strArr[i];
            }
            var strArr1 = str1.split(',');
            return strArr1;
        }
        this.finish = function(){
            if(type!=9){
                return true;
            }else{
                return isFinish;
            }
        };
        this.update = function () {}
        this.DataToVar = function(){
            if(e.Argv[0].indexOf("EX")>-1){
                isEx = true;
                id = parseInt(e.Argv[0].split('|')[1]);
            }else{
                isEx = false;
                id = parseInt(e.Argv[0]);
            }
            op = parseInt(e.Argv[1]);
            type = parseInt(e.Argv[2]);
            if(type == 2){
                randA = parseInt(e.Argv[3].split("|")[0]);
                randB = parseInt(e.Argv[3].split("|")[1]);
            }else if(type == 9){
                task_id= parseInt(e.Argv[3].split("|")[0]);
                point_type=parseInt(e.Argv[3].split("|")[1]);
            }else{
                idOrValue = parseInt(e.Argv[3]);
            }
            userindex = e.Argv.length >= 6 ? e.Argv[5] == "1" : false;
        }


        this.DataToVarAgain = function(){
            //id = parseInt(e.Argv[0]);
            if(e.Argv[0].indexOf("EX")>-1){
                isEx = true;
                id = parseInt(e.Argv[0].split('|')[1]);
            }else{
                isEx = false;
                id = parseInt(e.Argv[0]);
            }
            op = parseInt(e.Argv[6]);
            op += 1;
            type = parseInt(e.Argv[7]);
            if(type == 2){
                randA = parseInt(e.Argv[8].split("|")[0]);
                randB = parseInt(e.Argv[8].split("|")[1]);
            }else if(type == 9){
                task_id= parseInt(e.Argv[8].split("|")[0]);
                point_type=parseInt(e.Argv[8].split("|")[1]);
            }else{
                idOrValue = parseInt(e.Argv[8]);
            }
            userindex = e.Argv.length >= 6 ? e.Argv[5] == "1" : false;
            //userindex = e.Argv.length >= 6 ? e.Argv[5] == "1" : false;
        }
    }


    /*
    * 218
    * 强制存读档
    * */
    this.IMustSaveRead = function (e,m) {
        this.init= function () {
            if(e.Argv[0]=="0"){
                m.isMustSave = true;
                tv.system.rwFile.saveData(parseInt(e.Argv[1]-1),false);
            }else if(e.Argv[0]=="1"){
                tv.system.rwFile.loadData(parseInt(e.Argv[1]-1),false);
                if(e.Argv[2]=="1"){
                    localStorage.removeItem("orgsave"+ guid + parseInt(e.Argv[1]-1));
                }
            }
        }
        this.finish= function () {
            isMustSave = false;
            return true;
        };
    };

    /*
     * 219
     * 生命线效果
     * */
    this.ILifeLine = function(e,m){
        this.init = function () {
            if(parseInt(e.Argv[0]) == 0){
                if( tv.canvas.lifeLine){
                    tv.canvas.lifeLine.dispose();
                }
                tv.canvas.isShowTextStyle = 0;
                if( tv.canvas.message[this.msgIndex]){
                    tv.canvas.message[this.msgIndex].visible(true);
                }
            }else{
                tv.canvas.isShowTextStyle = 1;
                for(var i= 0;i<tv.canvas.message.length;i++ ){
                    tv.canvas.message[i].visible(false);
                }
                if( tv.canvas.lifeLine){
                    tv.canvas.lifeLine.dispose();
                }
                tv.canvas.lifeLine = new CLifeLine(e,m);
            }
        }
        this.finish = function () {
            return true;
        }
    }
    /**
     * 事件 - 3001 - 字符串索引
     */
    this.IStringEX = function(e,m){

       this.init = function() {
            var index = tv.system.vars.getVar(parseInt(e.Argv[0]) - 1) - 1;
            //add by ysxx -↓↓↓↓↓-2014/6/4--- 投票添加  --增加event.code判断事件类型是资源引入的类型还是文本显示类型---
            var end = tv.canvas.message[tv.canvas.msgIndex].madeString(e.Argv[1], 0,e.Code);
            //add by ysxx -↑↑↑↑↑-2014/6/4---------------------------------------------
            //Log.d("字符串索引", index + "");
           // Log.d("字符串索引", end);
            tv.system.string.setVar(index , end);
            return false;
        }
        this.finish = function(){
            return true;
        };
        
    }

    /**
     * 251 呼叫子剧情
     */
    this.ICallSubStory = function(e,m){
        this.event = e;
        this.main = m;
        var self = this;
        var isFinsh = false;
        this.init = function(){
            //m.subStory = new IMain();
            //m.subStory.jumpStory(parseInt(e.Argv[0])) ;
            if(isNew){
                tv.data.loadStory(parseInt(e.Argv[0]), function () {
                    isFinsh = true;
                    self.main.subStory = new IMain();
                    self.main.subStory.jumpStory(parseInt(e.Argv[0]));
                });
            }else{
                isFinsh = true;
                self.main.subStory = new IMain();
                self.main.subStory.jumpStory(parseInt(e.Argv[0])) ;
            }
            return true;
        };

        this.finish = function(){
            //var data=tv.data.getStory(this.event.Argv[0]) ;
            return isFinsh;
        };
        this.update = function(){}
    }
    /*
    * 天气
    * */
    this.ICWeather = function(e,m){
        this.init = function () {
            var type = parseInt(e.Argv[0]);
            tv.canvas.startWeather(type);
        };
        this.finish = function () {
            return true;
        }
    }

    /**
     * 302 震动
     */
    this.IShake =function(e,m){

        this.init = function(){
            if(gGameDebug.bshake){
                var prower = parseInt(e.Argv[0]);
                var speed = parseInt(e.Argv[1]);
                var time = parseInt(e.Argv[3]) / 2;
                tv.canvas.startShack(prower, speed, (e.Argv[2] == "1") ? -1 : time); 
            }
            return false;
        };

        this.finish = function(){
            return true;
        };
    }

    /**
     * 303 闪烁
     */
    this.IFlash =function(e,m){

        this.init = function(){
            if(gGameDebug.bflash){
                tv.canvas.startFlash(new OColor(e.Argv[0]), parseInt(e.Argv[1]) / 2);
            }
            return false;
        };

        this.finish = function(){
            return true;
        };
    }

    /**
     * 307 插入至 BGM
     */
    this.IBGMAdd = function(e,m){
        this.event = e;
        this.main = m;

        this.init = function(){
            tv.system.other.addBGM(parseInt(this.event.Argv[0]));
            tv.system.other.saveData();
            return false;
        }

        this.finish = function(){
            return true;
        }
        
    }
    
    /**
     * 308 插入至CG鉴赏
     */
    this.ICGAdd = function(e,m){
        this.event = e;
        this.main = m;

        this.init = function(){
            tv.system.other.addCG(parseInt(this.event.Argv[0]));
            tv.system.other.saveData();
            return false;
        } 
        this.finish = function(){
            return true;
        }
    }

     /**
      * 400 显示图片
      */
    this.IShowPic = function(e,m){
        this.event = e;
        this.main = m;
        var isFinish = false;
        this.init = function(){
            if(!e){
                isFinish = true;
                return;
            }
            var sp = tv.canvas.GamePictrue[parseInt(this.event.Argv[0])];
            if(sp.getBitmap() != null){
                sp.setBitmap(null);
            }
            var userString = false;
            if(this.event.Argv.length > 11){
                userString = this.event.Argv[11] == "1";
            }else{
                userString = false;
            }
            var path="";
            if(userString){
                path = ("Graphics/Other/" + tv.canvas.message[tv.canvas.msgIndex].madeString(
                        tv.system.string.getVar(parseInt(this.event.Argv[12])), 0,this.event.Code)).toLowerCase();
                var path2 = path.toLowerCase().replace(/\\/g,'/');
                path = path2;
            }else{
                path = ("Graphics/" + this.event.Argv[1]).toLowerCase().replace(/\\/g,'/');
            }
            var self = this;
            //if(sVLoadImg.preImgArr.length>0){
            if(sVLoadImg.preImgArr[path]){
                var image = sVLoadImg.preImgArr[path];
                sp.setBitmap(image);
                sp.e["path"] = path;
                if(self.event.Argv[2] == "1"){
                    sp.x = tv.system.vars.getVar(parseInt(self.event.Argv[3]));
                    sp.y = tv.system.vars.getVar(parseInt(self.event.Argv[4]));
                }else{
                    sp.x = parseInt(self.event.Argv[3]);
                    sp.y = parseInt(self.event.Argv[4]);
                }
                sp.StopTrans();
                sp.zoom_x = parseFloat(self.event.Argv[5]) / 100;
                sp.zoom_y = parseFloat(self.event.Argv[6]) / 100;
                sp.opacity = parseFloat(self.event.Argv[7]);//0304 parseFloat(this.event.Argv[7])/255
                sp.mirror = (self.event.Argv[8] == "1");
                isFinish = true;
                delete(sVLoadImg.preImgArr[path]);
                //sVLoadImg.preImgArr[path] = null;
                return;
            }
            //}
            getImage(path, function (img) {
                var image;
                if(img){
                    image =img;
                }else{
                    image = new Image();
                    image.src = "";
                }
                sp.setBitmap(image);
                sp.e["path"] = path;
                if(self.event.Argv[2] == "1"){
                    sp.x = tv.system.vars.getVar(parseInt(self.event.Argv[3]));
                    sp.y = tv.system.vars.getVar(parseInt(self.event.Argv[4]));
                }else{
                    sp.x = parseInt(self.event.Argv[3]);
                    sp.y = parseInt(self.event.Argv[4]);
                }
                sp.StopTrans();
                sp.zoom_x = parseFloat(self.event.Argv[5]) / 100;
                sp.zoom_y = parseFloat(self.event.Argv[6]) / 100;
                sp.opacity = parseFloat(self.event.Argv[7]);//0304 parseFloat(this.event.Argv[7])/255
                sp.mirror = (self.event.Argv[8] == "1");
                isFinish = true;
            });
            return false;
        };

        this.finish = function(){
            return isFinish;
        }
        this.update = function () {
            
        }
    }
    /**
     * 401 - 消除图片
     */
    this.IDisposePic = function(e,m){
        this.init = function(){
            var sp = tv.canvas.GamePictrue[parseInt(e.Argv[0])];
            if(sp.getBitmap() != null){
                sp.setBitmap(null);
            }
            if(sp.e["path"] != null){ //0313 原始 sp.e[0] != null
                sp.e["path"] = null;
                sp.e.length = 0;
            }
            return false;
        }

        this.finish = function(){
            return true;
        }
    }
    /**
     * 402 - 移动图片
     */
    this.IMovePic = function(e,m){
        this.event = e;
        this.main = m;
        this.init = function(){
            var sp = tv.canvas.GamePictrue[parseInt(this.event.Argv[0])];
            var endx = 0;
            var endy = 0;
            var frames = parseInt(this.event.Argv[9]);
            frames = frames/2; //0417 除2 是擎效率不好造成消隐比较慢的补救措施
            frames = parseInt(frames);
            if(frames <=0){
                frames = 1;
            }
            if(this.event.Argv[2] == "1"){
                endx = tv.system.vars.getVar(parseInt(this.event.Argv[3]));
                endy = tv.system.vars.getVar(parseInt(this.event.Argv[4]));
            }else{
                endx = parseInt(this.event.Argv[3]);
                endy = parseInt(this.event.Argv[4]);
            }
            sp.StopTrans();
            sp.mirror = (this.event.Argv[8] == "1");
            if(frames > 0){
                sp.FadeTo(parseFloat(this.event.Argv[7]),frames);//0304  sp.FadeTo(parseFloat(this.event.Argv[7]) / 255,frames);
                sp.SlideTo(endx,endy,frames);
                sp.ScaleTo( parseFloat(this.event.Argv[5]) / 100,parseFloat(this.event.Argv[6]) / 100,frames);
            }else{
                sp.opacity = parseFloat(this.event.Argv[7]);//0304 sp.opacity = parseFloat(this.event.Argv[7]) / 255
                sp.x = endx;
                sp.y = endy;
                sp.zoom_x = parseFloat(this.event.Argv[5]) / 100;
                sp.zoom_y = parseFloat(this.event.Argv[6]) / 100;
            }
            return false;

        };

        this.finish =function(){
            return true;
        }
    };
    /**
     * 404 - 图片旋转
     */
    this.IRotatePic=function(e,m){
    //0:图片id,1:帧数，2:角度，3:是否循环（0||1）,4:围绕点旋转（0：左上点，1：中心点，10：自定义），5:x,y(4为10的情况使用)
        this.event = e;
        this.main = m;
        this.loopRotate = false;   //循环
        this.init=function(){
            crotate.init(this.event);
            return false;
        };
        this.finish=function(){
            return true;

        };
        this.update=function(){

        };

    };

    /**
     * 405 - 预加载图片
     */
    this.preLoadPic = function(e,m){
        this.event = e;
        this.main = m;
        var srcStr;
        var lastStr;
        var isFinish;
        var prePathArr = new Array();
        this.init = function(){
            isFinish = false;
            var prePathSrc = this.event.Argv[0].split('|');
            for(var i =0;i<prePathSrc.length;i++){
                prePathArr[i] = {};
                srcStr = prePathSrc[i].lastIndexOf('\\')+1;
                lastStr = prePathSrc[i].lastIndexOf('.');
                prePathArr[i]['name'] = prePathSrc[i];
                prePathArr[i]['name'] = prePathArr[i]['name'].toLowerCase().replace(/\\/g,'/');
                prePathArr[i]['name'] = prePathArr[i]['name'].replace(/\/\//g,'/');
                prePathArr[i]['src']= prePathSrc[i];
            }
            sVLoadImg.loadImgData(prePathArr,function(){
                isFinish = !sVLoadImg.isLoad;
            },true);
        };
        this.finish =function(){
            return isFinish;
        }

        this.update = function(){

        }
    };
    /**
     * 406 - 显示动态图片
     */
    //方便调用自己的方法
    //var self=this;
    this.IShowFrameImg = function(e,m){
        this.event = e;
        this.main = m;
        //this.init = function()
        //{
            //console.log("----dy img :",this.event.Argv[1]);
            //console.log("----dy img :",this.event.Argv);
            var frameImgSrc=this.event.Argv[13];
            if(frameImgSrc){
                if(frameImgSrc.indexOf(".jpg") > -1 || frameImgSrc.indexOf(".png") > -1 ){
                    var event=this.event;
                    event.Argv[1]=frameImgSrc;
                    event.Code = 400;
                    return event;
                }else{
                    return null;
                }
            }else{
                return null;
            }
            //return false;
        //};

        //this.finish =function(){
        //    return true;
        //}
    };

    /**
     * 501 - 播放背景音乐
     */
    this.IStartBGM = function(e,m){
        this.init = function(){
            var volume = e.Argv[1];
            if(volume == ""){
                volume == "80";
            }
            if(e.Argv[0] == ""){
                oaudio.bgmFade(1);
                return false;
            }
            if(fileList[("Audio/" + e.Argv[0]).toLowerCase().replace(/\\/g,'/')])
            {
                var path = ("Audio/" + e.Argv[0]).toLowerCase().replace(/\\/g,'/');
                if(isIphone()){
                    oaudio.playBGM(fileListFato(path,'oaudio in IStartBGM from IEventMaker.js'),parseInt(volume),path);
                }else{
                    oaudio.playBGM(fileListFato(path,'oaudio in IStartBGM from IEventMaker.js'),parseInt(volume),path);
                }
                oadioPlusFlow(("Audio/" + e.Argv[0]).toLowerCase());
            }
            return false;
        };

        this.finish = function(){
            return true;
        };
    };
    /**
     * 502 - 播放音效
     */
    this.IStartSE = function(e,m){
        this.init = function(){
            var volume = e.Argv[1];
            if(volume == ""){
                volume == "80";
            }
            if(e.Argv[0] == ""){
                oaudio.stopSE();
                return false;
            }
            if(fileList[("Audio/" + e.Argv[0]).toLowerCase().replace(/\\/g,'/')])
            {
                var path = ("Audio/" + e.Argv[0]).toLowerCase().replace(/\\/g,'/');
                if(isIphone()){
                    oaudio.playSE(fileListFato(path,'oaudio in IStartSE from IEventMaker.js') ,parseInt(volume));
                }else{
                    oaudio.playSE(fileListFato(path,'oaudio in IStartSE from IEventMaker.js'),parseInt(volume));
                }
                oadioPlusFlow(("Audio/" + e.Argv[0]).toLowerCase());
            }
            else
            {
                console.log("dont found the Audio url -->: Audio/" + e.Argv[0]);
            }
            return false;
        };

        this.finish = function(){
            return true;
        };
    };
    /**
     * 503 - 播放语音
     */
    this.IStartVoice = function(e,m){
        this.init = function(){
            var volume = e.Argv[1];
            if(volume == ""){
                volume == "80";
            }
            if(e.Argv[0] == ""){
                oaudio.stopVoice(1);
                return false;
            }
            if(isIphone()){
                oaudio.playVoice(fileList[("Audio/" + e.Argv[0]).toLowerCase().replace(/\\/g,'/')].url(),parseInt(volume));
            }else{
                oaudio.playVoice(fileList[("Audio/" + e.Argv[0]).toLowerCase().replace(/\\/g,'/')].url(),parseInt(volume));
            }
            oadioPlusFlow(("Audio/" + e.Argv[0]).toLowerCase().replace(/\\/g,'/'));
            return false;
        };

        this.finish = function(){
            return true;
        };
    };
    /**
     * 504 - 播放背景音效
     */
    this.IStartBGS = function(e,m){


        this.init = function(){
            var volume = e.Argv[1];
            if(volume == ""){
                volume == "80";
            }
            if(e.Argv[0] == ""){
                oaudio.bgsFade(1);
                return false;
            }
            if(isIphone()){
                //oaudio.palyBGS(fileList[("Audio/" + e.Argv[0]).toLowerCase()].url() ,parseInt(volume));
                oaudio.palyBGS(fileList[("Audio/" + e.Argv[0]).toLowerCase().replace(/\\/g,'/')].url(),parseInt(volume));
            }else{
                oaudio.palyBGS(fileList[("Audio/" + e.Argv[0]).toLowerCase().replace(/\\/g,'/')].url(),parseInt(volume));
            }
            oadioPlusFlow(("Audio/" + e.Argv[0]).toLowerCase().replace(/\\/g,'/'));
            return false;
        };

        this.finish = function(){
            return true;
        };
    };
    /**
     * 505 - 淡出背景音乐
     */
    this.IFadeBGM = function(e,m){
        this.init = function(){
            oaudio.bgmFade(parseInt(e.Argv[0]));
            return false;
        };
        
        this.finish = function(){
            return true;
        };
    };
    /**
     * 506 - 停止音效
     */
    this.IStopSE = function(e,m){
        this.init = function(){
            oaudio.stopSE();
            return true;
        };
        
        this.finish = function(){
            return true;
        };
    };
    /**
     * 507 - 停止语音
     */
    this.IStopVoice = function(e,m){
        this.init = function(){
            oaudio.stopVoice();
            return false;
        };

        this.finish = function(){
            return true;
        };
    };
    /**
     * 508 - 淡出背景音效
     */
    this.IFadeBGS = function(e,m){
        this.init = function(){
            oaudio.bgsFade(parseInt(e.Argv[0]));
            return false;
        };

        this.finish = function(){
            return true;
        }
    }
    /**
     * 600 - 视频播放
     */
    this.IStartVideo = function(e,m){
        this.event = e;
        this.main = m;
        this.init = function(){
            if(!ovideo.isClear){
                ovideo.clear();
            }
            ovideo.VedioManager.play(this.event.Argv);
        };

        this.finish = function(){
            return ovideo.isFinish;
        };
        this.update = function () {

        };
    };
    /**
     * 601 - 操作视频
     */
    this.operationVideo = function(e,m){
        this.event = e;
        this.main = m;
        this.init = function(){
            ovideo.VedioManager.controller(this.event.Argv);
        };


        this.finish = function(){
            return ovideo.isFinish;
        };
        this.update = function () {
        };
    };
}

function getTimeValue(id)
{
    switch (id)
    {
        case 0 :
            return new Date().getFullYear() ;break ;
        case 1 :
            return new Date().getMonth()+1 ;break ;
        case 2 :
            return new Date().getDate() ;break ;
        case 3 :
            if( new Date().getDay() ==0)
            {
                return 7 ;
            }
            else
            {
               return new Date().getDay() ;
            }
            break ;
        case 4 :
            return new Date().getHours() ;break ;
        case 5 :
            return new Date().getMinutes() ;break ;
        case 6 :
            return new Date().getSeconds() ;break ;
        case 7 :
        {
            return parseInt(Date.now()/1000) ;break ;
        }
    }
}

function getSysTimeValue(id)
{
    var tm=Math.floor(new Date().getTime()/1000);
    var sysDate=getDate((parseInt(systemTime.sysTimestramp)+(tm-parseInt(systemTime.nowTimestramp)))*1000);
    switch (id)
    {
        case 0 :
            return sysDate.getFullYear() ;break ;
        case 1 :
            return sysDate.getMonth()+1 ;break ;
        case 2 :
            return sysDate.getDate() ;break ;
        case 3 :
            if( sysDate.getDay() ==0)
            {
                return 7 ;
            }
            else
            {
                return sysDate.getDay() ;
            }
            break ;
        case 4 :
            return sysDate.getHours() ;break ;
        case 5 :
            return sysDate.getMinutes() ;break ;
        case 6 :
            return sysDate.getSeconds() ;break ;
        case 7 :
        {
            return systemTime.sysTimestramp ;break ;
        }
    }
}
function getDate(tm){
    var date=new Date(tm);
    return date;
}

function getImage(src,callBack){
    var image;
    var path;
    if(typeof(src) =="string"){
        path = src;
        image = new Image();
        image.name = path;
        image.src = fileListFato(path,'image in getImage from IEventMaker.js');
    }else{
        image=src;
    }
    if(image.complete){
        callBack(image);
    }else{
        image.name = path;
        sVLoadImg.loadImgData(image, function(img) {
            callBack(img);
        })
    }
}