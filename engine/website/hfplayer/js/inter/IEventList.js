/**
 * Created by 七夕小雨 on 2014/11/16.
 */

function IEventList(){
    this.im = new IEventMaker();
    this.MakerEvent = function(e,m){
        if(e == null) {return null;}
        switch (e.Code){
            case 100:
                return new this.im.IText(e,m);
            case 101:
                return new this.im.ITextDif(e,m);
            case 1010:
                return new this.im.ITextDifEX(e,m);
            case 1011:
                return new this.im.ITextDifEX2(e,m);
            case 102:
                return new this.im.ITextEnd(e,m);
            case 103:
                return new this.im.IAutoPlay(e,m);
            case 104:
                return new this.im.IQuickPlay(e,m);
            case 107:
                //return this.MakerEvent(this.GenerateCommentArgs(e),m);
                return new this.im.INotes(e,m);
            case 108:
                return new this.im.ITextChoice(e,m);
            case 109:
                return new this.im.IDisposeText(e,m);
            case 112:
                return new this.im.IDFloatButton(e,m);
            case 150: 
                return new this.im.IUpdateUI(e,m);
            case 151: 
                return new this.im.IBackGame(e,m);
            case 200:
                return new this.im.IIF(e,m);
            case 201:
                return new this.im.IIfEnd(e,m);
            case 202:
                return new this.im.ILoop(e,m);
            case 203:
                return new this.im.ILoopAboveStart(e,m);
            case 204:
                return new this.im.IButtonDif(e,m);
            case 205:
                return new this.im.IButtonDifEnd(e,m);
            case 206:
                return new this.im.IJumpStory(e,m);
            case 207:
                return new this.im.IVar(e,m);
            case 208:
                return new this.im.IBackTitle(e,m);
            case 209:
                return new this.im.ILoopBreak(e,m);
            case 210:
                return new this.im.IWait(e,m);
            case 211:
                return new this.im.IIfChoice(e,m);
            case 212:
                return new this.im.IButtonDifChoose(e,m);
            case 213:
                return new this.im.IVarEx(e,m);
            case 214:
                return new this.im.ICallMenu(e,m);
            case 215:
                return new this.im.IString(e,m);
            case 216:
                return new this.im.IAdvData(e,m);
            case 217:
                return new this.im.IIFEx(e,m);
            case 218://强制存读档
                return new this.im.IMustSaveRead(e,m);
            case 219:
                return new this.im.ILifeLine(e,m);
            case 251:
                return new this.im.ICallSubStory(e,m);
            case 3001:
                return new this.im.IStringEX(e,m);
            case 301:
                return new this.im.ICWeather(e,m);
            case 302:
                return new this.im.IShake(e,m);
            case 303:
                return new this.im.IFlash(e,m);
            case 307:
                return new this.im.IBGMAdd(e,m);
            case 308:
                return new this.im.ICGAdd(e,m);   
            case 400:
                return new this.im.IShowPic(e,m);
            case 401:
                return new this.im.IDisposePic(e,m);
            case 402:
                return new this.im.IMovePic(e,m);
            case 404:
                return new this.im.IRotatePic(e,m);
            case 405:
                return new this.im.preLoadPic(e,m);
            case 406:
                return new this.im.IShowPic(this.im.IShowFrameImg(e,m),m);
                //return new this.im.IShowFrameImg(e,m);
            case 501:
                return new this.im.IStartBGM(e,m);
            case 502:
                return new this.im.IStartSE(e,m);
            case 503:
                return new this.im.IStartVoice(e,m);
            case 504:
                return new this.im.IStartBGS(e,m);
            case 505:
                return new this.im.IFadeBGM(e,m);
            case 506:
                return new this.im.IStopSE(e,m);
            case 507:
                return new this.im.IStopVoice(e,m); 
            case 508:
                return new this.im.IFadeBGS(e,m);
            case 600:
                return new this.im.IStartVideo(e,m);
            case 601:
                return new this.im.operationVideo(e,m);
            default :
                return null;
        }
    }

    this.GenerateCommentArgs = function(e,m)
    {
        var comment = e.Argv[0] ;
        var index = comment.indexOf("@i~") ;
        var index1 = comment.indexOf("call_pay") ;
        if(index>-1){
            //try
            //{
            //    var inst = comment.substring(3);
            //    var args = inst.split("|") ;
            //    if(args.length<2) return null ;
            //    var argc = parseInt(args[1]);
            //    if(argc!=args.length-2) return null ;
            //    var code = parseInt(args[0]) ;
            //    if(code==107) return null ;
            //    var argv = new Array() ;
            //    for(var i=2;i<args.length;i++)
            //    {
            //        argv[i-2] = args[i] ;
            //    }
            //    return new DEvent1(code, e.Indent,argc,argv);
            //}
            //catch(ex)
            //{
            //}
        }else if(index1>-1){
            ////this.refresh();
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
            //    if(CGLogin==true) {
            //        $(".send_flowers_box").show();
            //        ReDirectSharetes();
            //    }else{
            //        showLoginModel();
            //    }
            //}
            //m.stop();
            //break;
        }else{
           return null;
        }

    }
}