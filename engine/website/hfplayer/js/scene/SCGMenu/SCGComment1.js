/**
 * Created by heshang on 2016/7/8.
 */
/*
 * 游戏评论----------------
 * */
var allItemObj = new Object();
allItemObj.pageIndex = 0;
allItemObj.comments = new Array();
allItemObj.headList = new Array();

var allItemFineObj = new Object();
allItemFineObj.pageIndex = 0;
allItemFineObj.comments = new Array();
allItemFineObj.headList = new Array();

var gameIcon = new Object();
function SCGComment(){
    var imgPathHead=M_IMG_SERVER_URL+"hfplayer/img/";
    var imgArr = null;
    var self;
    var startX,startY;
    var buttons,sprites,btnSpArr,spArrBack,spScorll,spritesList;
    //精品评论按钮
    var btnSpUpdateLog;
    var infoOvew;
    var oListView;
    var zbase = 6004;

    var endPos = 0;
    var nextHeight = 0;
    var spDes;

    var scorllsY = 0;
    var scorlleY = 0;
    var initOk = false;
    this.pageIndex = 1;
    this.count = 10;
    this.allCount = 0;
    this.commentsCount = 0;
    this.fineCommentsCount = 0

    this.index = 0;
    this.updateLog=null;

    this.allItemArr = new Array();
    this.itemArr = new Array();

    this.headImgData = new Array();
    this.init = function() {
        this.headImgData.length = 0;
        buttons = new Array();
        sprites = new Array();
        spritesList = new Array();
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
            {"name": "scroll", "src": imgPathHead + "cgMenu1/Comment/scroll.png", type: 1},
            {"name": "angleIcon", "src": imgPathHead + "cgMenu1/Comment/angleIcon.png", type: 1},
            {"name": "flowerIcon", "src": imgPathHead + "cgMenu1/Comment/flowerIcon.png", type: 1},
            {"name": "oflowerIcon", "src": imgPathHead + "cgMenu1/Comment/oflowerIcon.png", type: 1},
            {"name": "noLogin", "src": imgPathHead + "cgMenu1/noLogin.png", type: 1},
        ];
        if(isVertical){
            imgList.push({"name": "back", "src": imgPathHead + "cgMenu1/Comment/backV.png", type: 1});
            imgList.push({"name": "msgComment", "src": imgPathHead + "cgMenu1/Comment/msgCommentV.png", type: 1});
            imgList.push({"name": "btnUp", "src": imgPathHead + "cgMenu1/moreDes/btnUpV.png", type: 1});
            imgList.push({"name": "btnDown", "src": imgPathHead + "cgMenu1/moreDes/btnDownV.png", type: 1});
        }else{
            imgList.push({"name": "back", "src": imgPathHead + "cgMenu1/Comment/back.png", type: 1});
            imgList.push({"name": "msgComment", "src": imgPathHead + "cgMenu1/Comment/msgComment.png", type: 1});
            imgList.push({"name": "btnUp", "src": imgPathHead + "cgMenu1/moreDes/btnUp.png", type: 1})
            imgList.push({"name": "btnDown", "src": imgPathHead + "cgMenu1/moreDes/btnDown.png", type: 1});
            imgList.push({"name": "titleBack", "src": imgPathHead + "cgMenu1/moreDes/titleBack.png", type: 1});
            imgList.push({"name": "btnUp", "src": imgPathHead + "cgMenu1/moreDes/btnUp.png", type: 1});
        }

        sVLoadImg.loadImgData(imgList,function (arr) {
            imgArr = arr;
            self.createBack();
            self.createButton();
            initOk = true;
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
        if(isVertical){
            var x =startX+25;
        }else{
            var x =startX+32;
        }

        if(isVertical){
            //infoOvew = new OViewport(x,startY+140,322+startX,696);
            oListView = new OListView(x,startY+140,322+startX,696);
        }else{
            //infoOvew = new OViewport(x,startY+140,655+startX,492-175);
            oListView = new OListView(x,startY+140,655+startX,492-175);
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
            //游戏评论按钮
            var btnSpDes = new OSprite(imgArr["btnUp"],null);
            btnSpDes.x = startX;
            btnSpDes.y = startY + 60;
            //btnSpDes.setZ(zbase+3);
            btnSpDes.tag = "Des";
            btnSpDes.drawLineTxt("作品评论",25,10,"#c2c5c9",spBtnSize);
            btnSpArr.push(btnSpDes);
            //精品评论按钮
            btnSpUpdateLog = new OSprite(imgArr["btnUp"],null);
            btnSpUpdateLog.x = startX +126;
            btnSpUpdateLog.y = startY + 60;
            btnSpUpdateLog.setZ(zbase+3);
            btnSpUpdateLog.visible = false;
            btnSpUpdateLog.drawLineTxt("精品评论",25,10,"#c2c5c9",spBtnSize);
            btnSpUpdateLog.tag = "UpdateLog";
            btnSpArr.push(btnSpUpdateLog);
        }else{
            //返回按钮
            var btnback = new OButton(imgArr["btnback"],imgArr["btnback"],"",null,null);
            btnback.setX(startX);
            btnback.setY(startY);
            btnback.tag = "Back";
            btnback.setZ(zbase+3);
            buttons.push(btnback);

            var spBtnSize = 21;
            //游戏评论按钮
            var btnSpDes = new OSprite(imgArr["btnUp"],null);
            btnSpDes.x = startX +36;
            btnSpDes.y = startY + 55;
            //btnSpDes.setZ(zbase+3);
            btnSpDes.tag = "Des";
            btnSpDes.drawLineTxt("作品评论",25,10,"#c2c5c9",spBtnSize);
            btnSpArr.push(btnSpDes);
            //精品评论按钮
            btnSpUpdateLog = new OSprite(imgArr["btnUp"],null);
            btnSpUpdateLog.x = startX +233;
            btnSpUpdateLog.y = startY + 55;
            btnSpUpdateLog.setZ(zbase+3);
            btnSpUpdateLog.visible = false;
            btnSpUpdateLog.drawLineTxt("精品评论",25,10,"#c2c5c9",spBtnSize);
            btnSpUpdateLog.tag = "UpdateLog";
            btnSpArr.push(btnSpUpdateLog);
        }
        //默认信息
        self.createGameInfo(0);
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
            str = "作品评论";
        }else if(this.index == 1){
            str = "精品评论";
        }
        spArrBack.x = btnSpArr[this.index].x;
        spArrBack.y = btnSpArr[this.index].y;
        if(isVertical){
            spArrBack.drawLineTxt(str,20,10,"#ffffff",spBtnSize);
        }else{
            spArrBack.drawLineTxt(str,25,10,"#ffffff",spBtnSize);
        }

        spArrBack.tag = "Over";
        sprites.push(spArrBack);
    }
    var itemHeight = 5;
    var drawItemCount = 0;
    var spTips;
    this.setScroll = function (height) {
        nextHeight = height;
        if(nextHeight < 0){
            if(spScorll){
                spScorll.dispose();
                spScorll = null;
            }
            endPos = 0;
        }else{
            if(spScorll){
                spScorll.dispose();
                spScorll = null;
            }
            spScorll = new OSprite(imgArr["scroll"],null);
            scorllsY = infoOvew.y - 25;
            scorlleY = infoOvew.y + infoOvew.height - spScorll.height;
            if(isVertical){
                spScorll.x = infoOvew.x + infoOvew.width - startX+12;
            }else{
                spScorll.x = infoOvew.x + infoOvew.width - startX+5;
            }
            spScorll.y = scorllsY;
            spScorll.setZ(zbase+100);
            endPos = height+60;
        }
    }
    var items = new Array();
    this.drawCommentsList = function (bool) {

        function startDraw(){
            var itemArr;
            if(self.index == 0){
                itemArr = allItemObj;
            }else{
                itemArr = allItemFineObj;
            }

            self.allCount = itemArr.allCount;
            if(allItemObj.fineCount){
                btnSpUpdateLog.visible = true;
            }
            var index=0;
            var height1 = 0;
            if(drawItemCount>0){
                index = drawItemCount;
            }
            if(bool=="down"){
                var length = index+1;
            }else{
                var length = index+5;
            }

            if(length>itemArr.comments.length){
                length = itemArr.comments.length;
            }
            for(var i = index;i<length;i++){
                var y=5;
                if(items.length>0){
                    y = items[items.length-1].endY;
                }
                var a = new drawItem(itemArr.comments[i],y+5,imgArr,infoOvew,itemArr);
                itemArr.comments[i].startY = a.y;
                itemArr.comments[i].endY = a.endY;
                items.push(a);
                height1 = parseInt(a.endY);
                drawItemCount++;
            }
            oListView.setListHeight(height1);
            height1 -=infoOvew.height;
            //console.log(height1);
            self.setScroll(height1);

            if(spScorll){
                spScorll.y = ((-infoOvew.oy)*((infoOvew.height-spScorll.height+25)/endPos))+scorllsY;
            }
        }
        //console.log(11111);
        if(self.allCount!=0 && self.allCount<=drawItemCount){
            if(spTips){
                spTips.dispose();
                spTips = null;
            }
            spTips = new OSprite(null,infoOvew);
            spTips.drawLineTxt("没有更多评论了哦~",0,0,"#3a3b3c",18);
            spTips.y = items[items.length-1].endY + 10;
            if(isVertical){
                spTips.x = 80;
            }else{
                spTips.x = 220;
            }
            return;
        }
        if(self.index == 0){
            if(drawItemCount>=allItemObj.comments.length){
                sLoading.showMask();
                serverAjax.get_game_comment(self.pageIndex,self.count, function (data) {
                    if(data.data.fineCount>0){
                        allItemObj.fineCount = data.data.fineCount;
                    }
                    var arrObj = new Array();
                    self.allCount = data.data.count;
                    allItemObj.allCount = self.allCount;
                    if(self.allCount<=0){
                        sLoading.hideMask();
                        var str = "暂无作品评论！";
                        var size = 18;
                        var lineHeight = size+7;
                        var strArr = getStrarr(str,size,infoOvew.width-startX,spDes);
                        spDes.drawUpdateLogList(strArr,0,0,"#999b9f",size,lineHeight);
                        spDes.setZ(zbase+100);
                        return;
                    }
                    var comments = data.data.comments;
                    if(comments.length>0){
                        self.pageIndex++;
                        allItemObj.pageIndex = self.pageIndex;
                        for(var i = 0;i<comments.length;i++){
                            allItemObj.comments.push(comments[i]);
                        }
                    }
                    for(var i = 0;i<comments.length;i++){
                        arrObj.push({"name":"h"+comments[i].uid,"src":"http://passport.66rpg.com/user/avatar?uid="+comments[i].uid,type:2});
                        if(comments[i].medal_lists && comments[i].medal_lists.system){
                            arrObj.push({"name":"system"+comments[i].uid,"src":comments[i].medal_lists.system.small_pic,type:2});
                        }
                        if(comments[i].medal_lists && comments[i].medal_lists.game){
                            arrObj.push({"name":"game"+comments[i].uid,"src":comments[i].medal_lists.game.small_pic,type:2});
                        }
                    }
                    sVLoadImg.loadImgData(arrObj, function (arr) {
                        for(var i  in arr){
                            gameIcon[i] = arr[i];
                        }
                        sLoading.hideMask();
                        for(var i in arr){
                            allItemObj.headList[i]=arr[i].src;
                        }
                        startDraw();
                    });
                });
            }else{
                startDraw();
            }
        }else if(self.index == 1) {
            if(drawItemCount>=allItemFineObj.comments.length){
                    sLoading.showMask();
                serverAjax.get_game_fine_comment(self.pageIndex,self.count, function (data) {
                    var arrObj = new Array();
                    self.allCount = data.data.count;
                    allItemFineObj.allCount = self.allCount;
                    if(self.allCount<=0){
                        sLoading.hideMask();
                        var str = "暂无作品评论！";
                        var size = 18;
                        var lineHeight = size+7;
                        var strArr = getStrarr(str,size,infoOvew.width-startX,spDes);
                        spDes.drawUpdateLogList(strArr,0,0,"#999b9f",size,lineHeight);
                        spDes.setZ(zbase+100);
                        return;
                    }
                    var comments = data.data.comments;
                    if(comments.length>0){
                        self.pageIndex++;
                        allItemFineObj.pageIndex = self.pageIndex;
                        for(var i = 0;i<comments.length;i++){
                            allItemFineObj.comments.push(comments[i]);
                        }
                    }
                    for(var i = 0;i<comments.length;i++){
                        arrObj.push({"name":"h"+comments[i].uid,"src":"http://passport.66rpg.com/user/avatar?uid="+comments[i].uid,type:2});
                        if(comments[i].medal_lists && comments[i].medal_lists.system){
                            arrObj.push({"name":"system"+comments[i].uid,"src":comments[i].medal_lists.system.small_pic,type:2});
                        }
                        if(comments[i].medal_lists && comments[i].medal_lists.game){
                            arrObj.push({"name":"game"+comments[i].uid,"src":comments[i].medal_lists.game.small_pic,type:2});
                        }
                    }
                    sVLoadImg.loadImgData(arrObj, function (arr) {
                        for(var i in arr){
                            gameIcon[i] = arr[i];
                        }
                        sLoading.hideMask();
                        for(var i in arr){
                            allItemFineObj.headList[i]=arr[i].src;
                        }
                        startDraw();
                    });
                });
            }else{
                startDraw();
            }
        }
    }
    this.createGameInfo = function (type) {
        var t = false;
        if(this.index != type){
            self.pageIndex = 1;
            itemHeight = 5;
            self.commentsDispose();
            this.index = type;
            t = true;
            this.setScroll(0);
            oListView.setListHeight(0);
        }
        this.updateSpBtn();
        infoOvew.oy = 0;
        if(spDes){
            spDes.dispose();
            spDes = new OSprite(null,infoOvew);
        }
        endPos = 0;
        nextHeight = 0;
        switch (type){
            case 0:
                self.drawCommentsList(t);
                break;
            case 1:
                self.drawCommentsList(t);
                break;
        }
    }
    var spUpdateArr = new Array();

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
        //if(oListView.)
        if(items.length>0){
            this.updateMove();
        }
        //if(this.updateMove()){
        //    return;
        //}
    }
    var upDisposeCount = 0;
    this.updateMove = function(){
        if(infoOvew&&self.allCount&&self.allCount!=0){
            var itemArr;
            if(this.index==0){
                itemArr = allItemObj;
            }else if(this.index == 1){
                itemArr = allItemFineObj;
            }
            //if(onTouchDown && onTouchMove ){ //&& viezwport.isIn()

                //var pos = parseInt(infoOvew.oy - (onTouchDY - onTouchY));
                //infoOvew.oy = pos;
                //if(infoOvew.oy > 0 )
                //    infoOvew.oy = 0;

                if(infoOvew.oy <  (endPos * -1)){
                    infoOvew.oy = endPos * -1;
                    this.drawCommentsList();
                }

                //if(onTouchDY - onTouchY>0){//销毁前面
                    //var sp=self.allItemArr[0][self.allItemArr[0].length-1];
                    if(infoOvew.oy+items[0].endY<= -300){
                        items[0].dispose();
                        items.shift();
                        upDisposeCount++;
                    }
                    //创建前面
                    if(infoOvew.oy+items[items.length-1].y <=1000){
                        if(drawItemCount<itemArr.comments.length){
                            this.drawCommentsList("down");
                        }
                    }
                //}
                //if(onTouchDY - onTouchY<0){//列表向上
                    //销毁后面
                    if(infoOvew.oy+items[items.length-1].y> 1000){
                        items[items.length-1].dispose();
                        items.pop();
                        drawItemCount -- ;
                    }
                    //创建前面
                    if(upDisposeCount>0){
                        if(infoOvew.oy+items[0].y > -300){
                            //self.drawItem(itemArr.comments[upDisposeCount-1],"up");
                            //upDisposeCount --;
                            var itemArr;
                            if(self.index == 0){
                                itemArr = allItemObj;
                            }else{
                                itemArr = allItemFineObj;
                            }
                            var a = new drawItem(itemArr.comments[upDisposeCount-1],itemArr.comments[upDisposeCount-1].startY,imgArr,infoOvew,itemArr);
                            items.splice(0,0,a);
                            upDisposeCount--;

                        }
                    }
                //}
                if(spScorll){
                    spScorll.y = ((-infoOvew.oy)*((infoOvew.height-spScorll.height+25)/endPos))+scorllsY;
                }

                if(spScorll && spScorll.y > scorlleY){
                    spScorll.y = scorlleY;
                }

                if(spScorll && spScorll.y < scorllsY){
                    spScorll.y = scorllsY;
                }
                //onTouchDY = onTouchY;
                //return true;
            //}
        }
        //return false;
    }

    this.commentsDispose = function(){
        upDisposeCount = 0;
        self.pageIndex = 1;
        drawItemCount = 0;
        if(spTips){
            spTips.dispose();
            spTips = null;
        }
        //if(items.length>0)
        for(var i=0;i<items.length;i++){
            if(items[i]){
                items[i].dispose();
            }
        }
        items.length = 0;
    }
    this.dispose = function () {
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
        this.commentsDispose();
        if(items.length>0){
            for(var i=0;i<items.length;i++){
                if(items[i]){
                    items[i].dispose();
                }
            }
            items.length = 0
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
        //infoOvew.dispose();
        oListView.dispose();
        imgArr = null;
        tv.scene = new SCGMenu3();
    }
    this.init();
}

