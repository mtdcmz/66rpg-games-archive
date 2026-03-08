/**
 * Created by Administrator on 2016/7/22.
 */
function drawItem(item,y,imgArr,infoOvew,itemArr){
    try{
        var self_this = this;
        var allHeight = y;
        self_this.y = allHeight;
        self_this.endY =0;
        var sprites = new Array();

        var startX,startY;
        if(isVertical){
            startX = 63;
            startY = 23;
        }else{
            startX = 135;
            startY = 18;
        }
        function drawNameLine(icon,name,item,grades,flower,oflower){
            var r = 27;
            //头像
            var spHead = new OSprite(null,infoOvew);
            spHead.circleLineWidth = 0;
            if(icon.complete){
                //icon = imgArr["noLogin"];
                spHead.setHeadIcon(icon,true,r);
            }else{
                icon.onload = function () {
                    spHead.setHeadIcon(this,true,r);
                }
                icon.error = function () {
                    spHead.setHeadIcon(imgArr["noLogin"],true,r);
                }
            }

            //sp.isICon = true;
            if(isVertical){
                spHead.y = allHeight+10;
                spHead.x = 5;
            }else{
                spHead.y = allHeight+35;
                spHead.x = 10;
            }
            sprites.push(spHead);
            var ay,ax;
            if(isVertical){
                var y = spHead.y;
                var x = 70;
                ay = 0;
                ax = 275;
            }else{
                var y = spHead.y-20;
                var x = 70;
                ay = 65;
                ax = 10;
            }

            if(item.author_follow_comment_type == 3){
                var sp = new OSprite(null,infoOvew);
                //sp.y = y;
                sp.drawRect(ax,y+ay,54,30,"#ffffff",3,"#ebecee");
                sp.drawLineTxt("助理",9,3,"#b0b1b4",18);
                sprites.push(sp);
            }else if(item.super_lv >= 1){
                var sp = new OSprite(null,infoOvew);
                //sp.y = y;
                sp.drawRect(ax,y+ay,54,30,"#ffffff",3,"#ebecee");
                sp.drawLineTxt("编辑",9,3,"#b0b1b4",18);
                sprites.push(sp);
            }else if(serverAjax.gameInfo&&serverAjax.gameInfo.game.author_uid == item.uid){
                var sp = new OSprite(null,infoOvew);
                //sp.y = y;
                sp.drawRect(ax,y+ay,54,30,"#ffffff",3,"#ebecee");
                sp.drawLineTxt("作者",9,3,"#b0b1b4",18);
                sprites.push(sp);
            }

            var spName = new OSprite(null,infoOvew);
            //名称
            if(!name){
                name="";
            }
            var str = getStrarr(name,18,120,spName);
            spName.drawLineTxt(str[0],0,0,"#9fa1a5",18);
            spName.x = x;
            spName.y = y;
            x += spName.width+10;
            sprites.push(spName);
            if(item.medal_lists && item.medal_lists.system){
                gameIcon["system"+item.uid].width = gameIcon["system"+item.uid].height = 27;
                var spAngle = new OSprite(gameIcon["system"+item.uid],infoOvew);
                spAngle.x = x;
                if(isVertical){
                    spAngle.y = y-5;
                }else{
                    spAngle.y = y-5;
                }
                //spAngle.zoom_x = spAngle.zoom_y = 27/imgArr["system"+item.uid];
                sprites.push(spAngle);
                x+=40;
            }
            if(item.medal_lists && item.medal_lists.game){
                gameIcon["game"+item.uid].width = gameIcon["game"+item.uid].height = 27;
                var spAngle1 = new OSprite(gameIcon["game"+item.uid],infoOvew);
                spAngle1.x = x;
                if(isVertical){
                    spAngle1.y = y-5;
                }else{
                    spAngle1.y = y-5;
                }
                //spAngle1.zoom_x = spAngle1.zoom_y = 27/imgArr["system"+item.uid];
                sprites.push(spAngle1);
                x+=40;
            }
            if(isVertical){
                x = 70;
                y += 40;
            }
            //等级
            var spLevel = new OSprite(null,infoOvew);
            if(!grades){
                grades="";
                var str = getStrarr(grades,18,100,spLevel);
            }else{
                var str = getStrarr("LV"+grades,18,100,spLevel);
            }
            spLevel.drawLineTxt(str[0],0,0,"#9fa1a5",18);
            spLevel.x = x;
            spLevel.y = y;
            x+=spLevel.width+10;
            sprites.push(spLevel);
            //spritesList.push(spLevel);
            if(flower>0){
                var spFlower = new OSprite(imgArr["flowerIcon"],infoOvew);
                spFlower.x = x;
                if(isVertical){
                    spFlower.y = y-10;
                }else{
                    spFlower.y = y-5;
                }
                sprites.push(spFlower);
                //spritesList.push(spFlower);
                //if(isVertical){
                spFlower.zoom_x = spFlower.zoom_y = .8;
                x+=spFlower.width;
                //}
                var spFlowerNum = new OSprite(null,infoOvew);
                var str = getStrarr(flower.toString(),18,100,spFlowerNum);
                spFlowerNum.drawLineTxt(str[0],0,0,"#9fa1a5",18);
                spFlowerNum.x = x;
                spFlowerNum.y = y;
                x+=spFlowerNum.width+5;
                sprites.push(spFlowerNum);
                //spritesList.push(spFlowerNum);
            }
            if(oflower>0){
                var spoFlower = new OSprite(imgArr["oflowerIcon"],infoOvew);
                spoFlower.x = x;
                if(isVertical){
                    spoFlower.y = y-10;
                }else{
                    spoFlower.y = y-5;
                }

                //if(isVertical){
                spoFlower.zoom_x = spoFlower.zoom_y = .8;
                //}
                x+=spoFlower.width;
                sprites.push(spoFlower);
                //spritesList.push(spoFlower);
                var spoFlowerNum = new OSprite(null,infoOvew);
                var str = getStrarr(oflower.toString(),18,100,spoFlowerNum);
                spoFlowerNum.drawLineTxt(str[0],0,0,"#9fa1a5",18);
                spoFlowerNum.x = x;
                spoFlowerNum.y = y;
                x+=spoFlowerNum.width+5;
                sprites.push(spoFlowerNum);
                //spritesList.push(spoFlowerNum);
            }
            return r*2;
        }
        function drawComment(comments,y){
            var x;
            if(isVertical){
                x = 0;
            }else{
                x = 65
            }
            var spComments = new OSprite(imgArr["msgComment"],infoOvew);
            spComments.y = allHeight+y;
            if(isVertical){
                spComments.x = x+5;
            }else{
                spComments.x = x;
            }
            //spritesList.push(spComments);
            sprites.push(spComments);
            var spCommentsTxt = new OSprite(null,infoOvew);
            var strArr = comments.split('<br>');
            var commentsArr = new Array();
            if(strArr.length>=1){
                for(var i = 0;i<strArr.length;i++){
                    commentsArr.push(strArr[i]);
                }
            }else{
                commentsArr.push(strArr[0])
            }
            sprites.push(spCommentsTxt);
            var showArr = new Array();
            for(var i=0;i<commentsArr.length;i++){
                //var str = getStrarr(comments,18,500,spCommentsTxt);
                if(isVertical){
                    var str = getStrarr(commentsArr[i],18,260,spCommentsTxt);
                }else{
                    var str = getStrarr(commentsArr[i],18,520,spCommentsTxt);
                }

                if(str.length>=1){
                    for(var j=0;j<str.length;j++){
                        showArr.push(str[j]);
                    }
                }else{
                    showArr.push(str[0]);
                }
            }
            spCommentsTxt.drawUpdateLogList(showArr,0,0,"#333333",18,25);
            if(isVertical){
                spCommentsTxt.x = x+20;
            }else{
                spCommentsTxt.x = x+30;
            }

            spCommentsTxt.y = spComments.y+20;
            if(isVertical){
                spComments.stretImage([20,2,25,2],290,showArr.length*25+15);
            }else{
                spComments.stretImage([30,2,15,2],550,showArr.length*25+15);
            }
            sprites.push(spCommentsTxt);
            return spComments.y+spComments.stretHeight;
        }
        function drawTimeLine(runtime,time,from,y){
            y+=20;
            if(isVertical){
                var x = 0;
            }else{
                var x = 70;
            }

            //运行时间
            var spRuntime = new OSprite(null,infoOvew);
            if(!runtime || runtime == ""){
                //runtime = "0分钟";
            }else{
                var str = getStrarr("在线时长："+runtime,18,200,spRuntime);
                //spRuntime.drawLineTxt("游戏时长："+str[0],0,0,"#9fa1a5",18);
                spRuntime.drawLineTxt(str[0],0,0,"#9fa1a5",18);
                spRuntime.x = x;
                spRuntime.y = y;
                x += spRuntime.width+15;
            }
            sprites.push(spRuntime);
            //spritesList.push(spRuntime);
            //日期
            var spTime = new OSprite(null,infoOvew);
            if(time&&time.length>=11){
                if(isVertical){
                    var str = getStrarr(time.substr(5,11),18,150,spTime);
                }else{
                    var str = getStrarr(time.substr(5,time.length),18,150,spTime);
                }
                spTime.drawLineTxt(str[0],0,0,"#9fa1a5",18);
            }
            if(isVertical){
                x = infoOvew.width - spTime.width-startX;
            }
            spTime.x = x;
            spTime.y = y;
            x += spTime.width+10;
            sprites.push(spTime);
            //spritesList.push(spTime);
            if(isVertical && runtime != ""){
                x = 0;
                y += 30;
            }else if(isVertical){
                x = 0;
            }

            if(from){
                //来自
                var spFrom = new OSprite(null,infoOvew);
                var str = getStrarr("来自："+from,18,200,spFrom);
                spFrom.drawLineTxt(str[0],0,0,"#9fa1a5",18);
                spFrom.x = x;
                spFrom.y = y;
                //spritesList.push(spFrom);
                //return spFrom.y+20;
            }
            sprites.push(spFrom);
            return y+20;
        }
        function drawItem1(item){
            //头像
            var img = new Image();
            img.src =itemArr.headList["h"+item.uid];
            //个人信息行
            var nameHeight = drawNameLine(img,item.username,item,Math.floor(item.user_level_dsp),item.give_flower,(item.give_wild_flower)/100);
            if(isVertical){
                nameHeight+=20;
            }
            var commentHeight = drawComment(item.comment,nameHeight);
            var systemHeight = drawTimeLine(item.runtime,item.add_time_string,item.device_type,commentHeight+20);
            //横线
            var spLine = new OSprite(null,infoOvew);
            spLine.y=systemHeight;
            //self.itemArr.length = 0;
            //spritesList.push(spLine);
            var size = 17;
            var lineHeight = 19;
            if(isVertical){
                spLine.drawUpdateLogList(["_________________________________________"],0,0,"#EBECEE",size,lineHeight);
            }else{
                spLine.drawUpdateLogList(["__________________________________________________________________________________"],0,0,"#EBECEE",size,lineHeight);
            }
            spLine.height = 20;
            sprites.push(spLine);
            self_this.endY = spLine.y+spLine.height;
        }

        this.dispose = function () {
            for(var i = 0;i<sprites.length;i++){
                if(sprites[i]){
                    sprites[i].dispose();
                }
            }
            sprites.length = 0;
        }
        drawItem1(item);
    }catch(e){

    }
}