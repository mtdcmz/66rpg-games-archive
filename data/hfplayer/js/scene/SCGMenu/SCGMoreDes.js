/**
 * Created by heshang on 2016/7/8.
 */


/*
 * 查看更多* -------------------------*
 * */
function SCGMoreDes(){
    var imgPathHead=M_IMG_SERVER_URL+"hfplayer/img/";
    var imgArr = null;
    var self;
    var startX,startY;
    var buttons,sprites,btnSpArr,spArrBack,spScorll;
    var infoOvew;
    var oListView;
    var zbase = 6004;

    var endPos = 0;
    var nextHeight = 0;
    var spDes;

    var scorllsY = 0;
    var scorlleY = 0;
    var initOk = false;
    this.index = 0;
    this.updateLog=null;
    this.init = function() {
        buttons = new Array();
        sprites = new Array();
        btnSpArr = new Array();
        if(isVertical){
            startX = 63;
            startY = 23;
        }else{
            startX = 135;
            startY = 18;
        }
        //800 600 游戏添加
        if(gGameWidth == 800&&gGameHeight == 600){
            startX = -10;
        }
        self =this;
        var imgList = [
            {"name": "btnback", "src": imgPathHead + "cgMenu1/moreDes/btnback.png", type: 1},
            {"name": "btnUp", "src": imgPathHead + "cgMenu1/moreDes/btnUp.png", type: 1},
            {"name": "scroll", "src": imgPathHead + "cgMenu1/moreDes/scroll.png", type: 1},
        ];
        if(isVertical){
            imgList.push({"name": "back", "src": imgPathHead + "cgMenu1/moreDes/backV.png", type: 1});
            imgList.push({"name": "btnUp", "src": imgPathHead + "cgMenu1/moreDes/btnUpV.png", type: 1});
            imgList.push({"name": "btnDown", "src": imgPathHead + "cgMenu1/moreDes/btnDownV.png", type: 1});
        }else{
            imgList.push({"name": "back", "src": imgPathHead + "cgMenu1/moreDes/back.png", type: 1});
            imgList.push({"name": "btnDown", "src": imgPathHead + "cgMenu1/moreDes/btnDown.png", type: 1});
            imgList.push({"name": "titleBack", "src": imgPathHead + "cgMenu1/moreDes/titleBack.png", type: 1});
            imgList.push({"name": "btnUp", "src": imgPathHead + "cgMenu1/moreDes/btnUp.png", type: 1});
        }
        sLoading.showMask();
        serverAjax.update_log(function(data){
            self.updateLog = data;
            serverAjax.get_game_link(function (data) {
                self.linkData = data;
                sLoading.hideMask();
                sVLoadImg.loadImgData(imgList, function (arr) {
                    imgArr = arr;
                    self.createBack();
                    self.createButton();
                    initOk = true;
                });
            });

        });

    }
    this.createBack = function () {
        var spTitle = new OSprite(null,null);
        var strArray = getStrarr(gameTitle,22,220,spTitle);
        if(strArray.length>1){
            spTitle.drawUpdateLogList([strArray[0]+"…"],0,0,"#fdfdfd",20,29);
        }else{
            spTitle.drawUpdateLogList([strArray[0]],0,0,"#fdfdfd",20,29);
        }
        //spTitle.drawUpdateLogList([strArray[0]],5,0,"#fdfdfd",20,29);
        spTitle.y = startY+20;
        spTitle.setZ(zbase);
        sprites.push(spTitle);
        if(!isVertical){
            var titleBack = new OSprite(imgArr["titleBack"],null);
            titleBack.x = startX;
            titleBack.y = startY;
            titleBack.setZ(zbase);
            sprites.push(titleBack);
        }

        var back = new OSprite(imgArr["back"],null);
        back.x = startX;
        back.y = startY;
        back.setZ(zbase);
        sprites.push(back);
        var x =startX+32;
        if(isVertical){
            oListView = new OListView(x,startY+140,322+startX,696);
            //infoOvew = new OViewport(x,startY+140,322+startX,696);
        }else{
            oListView = new OListView(x,startY+140,655+startX,492-175);
            //infoOvew = new OViewport(x,startY+140,655+startX,492-175);
        }
        infoOvew = oListView.viewPort;

        spDes = new OSprite(null,infoOvew);
        if(strArray.length > 1){
            spTitle.x = startX+10+(back.width-10)/2 -(spTitle.width-10)/2 ;
        }else{
            //    g.font = 20+"px 微软雅黑";
            //    spTitle.x = (startX+infoOvew.width)/2-parseInt(g.measureText(strArray[0]).width)/2+15;
            spTitle.x = startX+(back.width-10)/2 -spTitle.width/2 ;
        }

    }
    this.createButton  = function () {
        if(isVertical){
            //返回按钮
            var btnback = new OButton(imgArr["btnback"],imgArr["btnback"],"",null,null);
            btnback.setX(startX);
            btnback.setY(startY);
            btnback.tag = "Back";
            btnback.setZ(zbase+3);
            buttons.push(btnback);

            var spBtnSize = 21;
            //游戏简介按钮
            var btnSpDes = new OSprite(imgArr["btnUp"],null);
            btnSpDes.x = startX;
            btnSpDes.y = startY + 56;
            //btnSpDes.setZ(zbase+3);
            btnSpDes.tag = "Des";
            btnSpDes.drawLineTxt("作品简介",25,10,"#c2c5c9",spBtnSize);
            btnSpArr.push(btnSpDes);
            if(serverAjax.updateLogData&&serverAjax.updateLogData.count>0){
                //更新日志按钮
                var btnSpUpdateLog = new OSprite(imgArr["btnUp"],null);
                btnSpUpdateLog.x = startX +126;
                btnSpUpdateLog.y = startY + 56;
                btnSpUpdateLog.setZ(zbase+3);
                btnSpUpdateLog.drawLineTxt("更新日志",25,10,"#c2c5c9",spBtnSize);
                btnSpUpdateLog.tag = "UpdateLog";
                btnSpArr.push(btnSpUpdateLog);
            }
            if(serverAjax.linkOverData && serverAjax.linkOverData.ending_info!=""){
                //结局信息按钮
                var btnSpOver = new OSprite(imgArr["btnUp"],null);
                btnSpOver.x = startX +248;
                btnSpOver.y = startY + 56;
                btnSpOver.setZ(zbase+3);
                btnSpOver.drawLineTxt("结局信息",25,10,"#c2c5c9",spBtnSize);
                btnSpOver.tag = "Over";
                btnSpArr.push(btnSpOver);
            }
            self.createGameInfo(0);
        }else{
            //返回按钮
            var btnback = new OButton(imgArr["btnback"],imgArr["btnback"],"",null,null);
            btnback.setX(startX);
            btnback.setY(startY);
            btnback.tag = "Back";
            btnback.setZ(zbase+3);
            buttons.push(btnback);

            var spBtnSize = 21;
            //游戏简介按钮
            var btnSpDes = new OSprite(imgArr["btnUp"],null);
            btnSpDes.x = startX +100;
            btnSpDes.y = startY + 55;
            //btnSpDes.setZ(zbase+3);
            btnSpDes.tag = "Des";
            btnSpDes.drawLineTxt("作品简介",25,10,"#c2c5c9",spBtnSize);
            btnSpArr.push(btnSpDes);
            if(serverAjax.updateLogData&&serverAjax.updateLogData.count>0) {
                //更新日志按钮
                var btnSpUpdateLog = new OSprite(imgArr["btnUp"], null);
                btnSpUpdateLog.x = startX + 296;
                btnSpUpdateLog.y = startY + 55;
                btnSpUpdateLog.setZ(zbase + 3);
                btnSpUpdateLog.drawLineTxt("更新日志", 25, 10, "#c2c5c9", spBtnSize);
                btnSpUpdateLog.tag = "UpdateLog";
                btnSpArr.push(btnSpUpdateLog);
            }
            if(serverAjax.updateLogData&&serverAjax.updateLogData.count>0&&serverAjax.linkOverData && serverAjax.linkOverData.ending_info!="") {
                //结局信息按钮
                var btnSpOver = new OSprite(imgArr["btnUp"], null);
                btnSpOver.x = startX + 490;
                btnSpOver.y = startY + 55;
                btnSpOver.setZ(zbase + 3);
                btnSpOver.drawLineTxt("结局信息", 25, 10, "#c2c5c9", spBtnSize);
                btnSpOver.tag = "Over";
                btnSpArr.push(btnSpOver);
            }else if(serverAjax.linkOverData && serverAjax.linkOverData.ending_info!=""){
                //结局信息按钮
                var btnSpOver = new OSprite(imgArr["btnUp"], null);
                btnSpOver.x = startX + 296;
                btnSpOver.y = startY + 55;
                btnSpOver.setZ(zbase + 3);
                btnSpOver.drawLineTxt("结局信息", 25, 10, "#c2c5c9", spBtnSize);
                btnSpOver.tag = "Over";
                btnSpArr.push(btnSpOver);
            }
            self.createGameInfo(0);
        }
    }
    this.updateSpBtn = function () {
        var spBtnSize = 22;
        if(spArrBack){
            spArrBack.dispose();
            spArrBack = null;
        }
        spArrBack = new OSprite(imgArr["btnDown"],null);
        spArrBack.setZ(zbase+4);
        var str ="";
        if(this.index == 0){
            str = "作品简介";
        }else if(this.index == 1){
            str = "更新日志";
        }else if(this.index == 2){
            str = "结局信息";
        }
        var index = this.index;
        if(!btnSpArr[index]){
            index-=1;
        }
        spArrBack.x = btnSpArr[index].x;
        spArrBack.y = btnSpArr[index].y;
        if(isVertical){
            spArrBack.drawLineTxt(str,20,10,"#ffffff",spBtnSize);
        }else{
            spArrBack.drawLineTxt(str,25,10,"#ffffff",spBtnSize);
        }

        spArrBack.tag = "Over";
        sprites.push(spArrBack);
    }
    this.createGameInfo = function (type) {
        this.index = type;
        this.updateSpBtn();
        infoOvew.oy = 0;
        if(spDes){
            spDes.dispose();
            spDes = new OSprite(null,infoOvew);
        }
        if(spUpdateArr.length>0){
            for(var i=0;i<spUpdateArr.length;i++){
                if(spUpdateArr[i]){
                    spUpdateArr[i].dispose();
                }
            }
            spUpdateArr.length = 0
        }
        var strArr;
        var size,str,lineHeight;
        endPos = 0;
        nextHeight = 0;
        switch (type){
            case 0:
                if(serverAjax.gameInfo&&serverAjax.gameInfo.game.description){
                    str = serverAjax.gameInfo.game.description;
                }else{
                    str = "暂无作品简介！";
                }
                size = 18;
                lineHeight = size+7;
                strArr = getStrarr(str,size,infoOvew.width-startX,spDes);
                spDes.drawUpdateLogList(strArr,0,0,"#999b9f",size,lineHeight);
                spDes.setZ(zbase+100);
                break;
            case 1:
                size = 18;
                lineHeight = size+7;
                if(this.updateLog.count<=0){
                    size = 20;
                    strArr = getStrarr("此作品暂时没有更新日志，给作者送花鼓励作者更新哦~",size,infoOvew.width-startX,spDes);
                    spDes.drawUpdateLogList(strArr,0,0,"#999b9f",size,lineHeight);
                    spDes.setZ(zbase+100);
                }else{
                    //console.log(this.updateLog);
                    if(this.updateLog.count>0){
                        this.updateList();
                    }else{
                        size = 20;
                        strArr = getStrarr("此作品暂时没有更新日志，给作者送花鼓励作者更新哦~",size,infoOvew.width-startX,spDes);
                        spDes.drawUpdateLogList(strArr,0,0,"#999b9f",size,lineHeight);
                        spDes.setZ(zbase+100);
                    }
                }
                break;
            case 2:
                size = 18;
                lineHeight = size+7;
                if(self.linkData.ending_info&&self.linkData.ending_info!=""&&self.linkData.ending_info.length>0){
                    str = self.linkData.ending_info;
                }else{
                    str="暂时没有结局信息哦~";
                }
                strArr = getStrarr(str,size,infoOvew.width-startX,spDes);
                spDes.drawUpdateLogList(strArr,0,0,"#999b9f",size,lineHeight);
                spDes.setZ(zbase+100);
                break;
        }
        if(type!=1){
            nextHeight+=(strArr.length)*lineHeight+30;
        }else{
            nextHeight = 0;
            if(spUpdateArr.length>0){
                nextHeight = spUpdateArr[spUpdateArr.length-1].y+30;
            }
        }
        if(nextHeight < infoOvew.height){
            if(spScorll){
                spScorll.dispose();
                spScorll = null;
            }
            endPos = infoOvew.height;
        }else{
            if(spScorll){
                spScorll.dispose();
                spScorll = null;
            }
            spScorll = new OSprite(imgArr["scroll"],null);
            scorllsY = infoOvew.y - 25;
            scorlleY = infoOvew.y + infoOvew.height - spScorll.height;
            if(isVertical){
                spScorll.x = infoOvew.x + infoOvew.width - startX+5;
            }else{
                spScorll.x = infoOvew.x + infoOvew.width - startX+5;
            }
            spScorll.y = scorllsY;
            //spScorll.y = scorlleY;
            spScorll.setZ(zbase+100);
            //endPos=nextHeight - infoOvew.height;
            endPos=nextHeight;
        }
        oListView.clearItem();
        var item = new OListViewItem(spDes,endPos);
        oListView.setItem(item);
        //oListView.dispose();
        //var opView = new OListView(100,100,740,340);
        //for(var i = 0;i<50;i++){
        //    var spArr = new Array();
        //    var sp = new OSprite(null,opView.viewPort);
        //    sp.drawLineTxt(""+i+i+i+i+i+i+i+i+i+i+i+i+i+i+i+"",0,0,"#ffffff",25);
        //    sp.height = 25;
        //    spArr.push(sp);
        //    var sp1 = new OSprite(null,opView.viewPort);
        //    sp1.drawLineTxt(""+i+i+i+i+i+i+i+i+i+i+i+i+i+i+i+"0",0,0,"#ffffff",25);
        //    sp1.height = 25;
        //    sp1.y = 25;
        //    spArr.push(sp1);
        //    var a = new OListViewItem(spArr,80);
        //    opView.setItem(a);
        //}
    }
    var spUpdateArr = new Array();
    this.updateList = function(){
        var dataAll = this.updateLog.records;
        var size = 18;
        var lineHeight = size+7;
        for(var i=0;i<dataAll.length;i++){
            var data = dataAll[i];
            var sp = new OSprite(null,infoOvew);
            var strArr = getStrarr(data.content,19,infoOvew.width-startX,sp);
            if(spUpdateArr.length>0){
                sp.y= spUpdateArr[spUpdateArr.length-1].y+spUpdateArr[spUpdateArr.length-1].height+10;
            }
            sp.drawUpdateLogList(strArr,0,0,"#999b9f",size,lineHeight);
            sp.height = (strArr.length)*lineHeight;

            var spTime = new OSprite(null,infoOvew);
            spTime.y=sp.y+sp.height+10;
            spTime.firstX = infoOvew.width-startX - 150;
            spTime.drawUpdateLogList([data.update_time],0,0,"#999b9f",size,lineHeight);
            spTime.height = lineHeight;

            var spLine = new OSprite(null,infoOvew);
            spLine.y=spTime.y+spTime.height-15;
            if(isVertical){
                spLine.drawUpdateLogList(["_______________________________________"],0,0,"#999b9f",size,lineHeight);
            }else{
                spLine.drawUpdateLogList(["_____________________________________________________________________________"],0,0,"#999b9f",size,lineHeight);
            }

            spLine.height = lineHeight;

            spUpdateArr.push(sp);
            spUpdateArr.push(spTime);
            spUpdateArr.push(spLine);
        }
    }

    this.buttonClick = function (b) {
        if(b.tag == "Back"){
            this.dispose();
        }else if(b.tag == "Des"){
            if(this.index!=0){
                this.createGameInfo(0);
            }
        }
        else if(b.tag == "UpdateLog"){
            if(this.index!=1){
                this.createGameInfo(1);
            }
        }
        else if(b.tag == "Over"){
            if(this.index!=2){
                this.createGameInfo(2);
            }
        }
    }
    this.update = function () {
        if(!initOk){
            return;
        }
        if(buttons.length > 0){
            for(var i = 0 ; i < buttons.length;++i){
                var b = buttons[i];
                if(b!= null){
                    b.update();
                    if(b.isClick()) {
                        //tv.data.System.SEClick.Play();  //无play
                        this.buttonClick(b);
                        return;
                    }
                }
            }
        }
        if(btnSpArr.length > 0){
            for(var i = 0 ; i < btnSpArr.length;++i){
                var b = btnSpArr[i];
                if(b!= null){
                    if(b.isClick()) {
                        //tv.data.System.SEClick.Play();  //无play
                        this.buttonClick(b);
                        //return;
                    }
                }
            }
        }
        if(spScorll){
            spScorll.y = ((-infoOvew.oy)*((infoOvew.height-spScorll.height+25)/endPos))+scorllsY+15;
        }

        if(spScorll && spScorll.y > scorlleY){
            spScorll.y = scorlleY;
        }

        if(spScorll && spScorll.y < scorllsY){
            spScorll.y = scorllsY;
        }
        //if(this.updateMove()){
        //    return;
        //}
    }
    this.updateMove = function(){
        if(infoOvew){
            if(onTouchDown && onTouchMove ){ //&& viewport.isIn()
                var pos = parseInt(infoOvew.oy - (onTouchDY - onTouchY));
                infoOvew.oy = pos;
                if(infoOvew.oy > 0 )
                    infoOvew.oy = 0;

                if(infoOvew.oy <  (endPos * -1))
                    infoOvew.oy = endPos * -1;

                if(spScorll){
                    spScorll.y = ((-infoOvew.oy)*((infoOvew.height-spScorll.height+25)/endPos))+scorllsY;
                }

                if(spScorll && spScorll.y > scorlleY){
                    spScorll.y = scorlleY;
                }

                if(spScorll && spScorll.y < scorllsY){
                    spScorll.y = scorllsY;
                }
                onTouchDY = onTouchY;
                return true;
            }
        }
        return false;
    }
    this.dispose = function () {
        //infoOvew.dispose();
        oListView.dispose();
        if(buttons.length>0){
            for(var i = 0 ; i < buttons.length;++i){
                if(buttons[i] != null){
                    buttons[i].dispose();
                }
            }
            buttons.length = 0;
        }
        if(btnSpArr.length > 0) {
            for (var i = 0; i < btnSpArr.length; ++i) {
                if(btnSpArr[i]){
                    btnSpArr[i].dispose();
                }
            }
            btnSpArr.length = 0;
        }
        if(sprites.length>0){
            for(var i= 0;i<sprites.length;i++){
                if(sprites[i]!=null){
                    sprites[i].dispose();
                }
            }
            sprites.length = 0;
        }

        if(spUpdateArr.length>0){
            for(var i=0;i<spUpdateArr.length;i++){
                if(spUpdateArr[i]){
                    spUpdateArr[i].dispose();
                }
            }
            spUpdateArr.length = 0
        }
        if(spDes){
            spDes.dispose();
        }
        if(spScorll){
            spScorll.dispose();
            spScorll = null;
        }
        imgArr = null;
        tv.scene = new SCGMenu3();
    }
    this.init();
}