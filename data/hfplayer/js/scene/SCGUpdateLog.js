/**
 * Created by 66rpg on 2016/3/21.
 */
//var img2 = new Image();
//img2.src = "../public/hfplayer/img/cgMenu/moreLogAlert.png";

function SCGUpdateLog(data,imgArr){
    var backMask,backImg,btnClose;
    var wait;
    var isExit = false;
    var viewport;
    var sprites,spritesLine,spriteTime;
    var max,maxRow,endPos;
    var stringArr;
    var nextHeight=0;
    var size=21;
    var x, y,scale;
    if(isVertical){
        x=160;
        y=150;
        scale=.8;
    }else{
        x=0;y=0;scale=1;
    }

    this.init = function () {
        //遮罩
        backMask=new OSprite(null);
        backMask.setBitmap(imgArr["mask"]);
        backMask.setZ(10102);
        if(isVertical){
            backMask.zoom_x=gGameWidth/gGameHeight;
            backMask.zoom_y=gGameHeight/gGameWidth;
        }
        //背景
        backImg=new OSprite(null,null);
        backImg.setBitmap(imgArr["moreLogAlert"]);
        backImg.x=200-x;
        backImg.y=30+y;
        backImg.setZ(10103);
        backImg.zoom_x=backImg.zoom_y=.8*scale;
        //关闭按钮
        btnClose=new OButton(imgArr["menu_close"],imgArr["menu_close"],"",null,false,false);
        btnClose.setZ(10104);
        btnClose.setX(750*scale-x*scale);

        btnClose.setY(10+y);
        //btnClose.zoom_x=btnClose.zoom_y=.8;

        //listView
        if(isVertical){
            viewport=new OViewport((230-x)*scale,(165+y)*scale,530*scale,360*scale);
        }else{
            viewport=new OViewport((230-x)*scale,(125+y)*scale,500*scale,360*scale);
        }


        if(data==0||data==null){
            max=1;
            maxRow=1;
            endPos = 0;
            sprites = new Array(max);
            sprites[0]=new OSprite(null,viewport);
            sprites[0].setBitmap(imgArr["noContent"]);
        }else{
            max=data.length;
            maxRow=max+1;
            endPos = 0;
            stringArr=new Array(max);
            for(var j=0;j<max;j++){
                stringArr[j]=data[j].content;
            }
            sprites = new Array(max);

            spriteTime = new Array(max);

            if(max<=1){
                backImg.setBitmap(imgArr["singleLog"]);
                backImg.y=(130+y)*scale;
                btnClose.setY((110+y)*scale);
                if(isVertical){
                    viewport=new OViewport((230-x)*scale,(270+y)*scale,530*scale,170*scale);
                }else{
                    viewport=new OViewport((230-x)*scale,(230+y)*scale,500*scale,170*scale);
                }

            }else{
                spritesLine = new Array(max);
            }
            for(var i = 0 ; i < max ;++i){
                sprites[i] = this.setListTxt(i);
                if(spritesLine&&spritesLine.length>0){
                    spritesLine[i]=this.setListLine(i);
                }
                spriteTime[i]=this.setListTime(i,data[i].update_time);
            }
            endPos = endPos-100;
        }
    }
    this.setListTxt = function(i){
        var s1=new OSprite(null,viewport);
        var string=stringArr[i];
        var strArr=string.split('<br/>');
        for(var j=0;j<strArr.length;j++){
            var txtWidth=0;
            var str="";
            for(var k=0;k<strArr[j].length;k++){
                g.font = size + "px 微软雅黑";
                txtWidth+=g.measureText(strArr[j][k]).width;
                if(txtWidth>475*scale){
                    txtWidth=0;
                    str=strArr[j].substr(0,k);
                    strArr[j]=strArr[j].substr(k,strArr[j].length);
                    strArr.splice(j, 0, str);
                    k=0;
                }
            }
            //console.log(strArr[j].length,j,i);
        }
        if(strArr.length>0){
            strArr.push([""]);
            s1.drawUpdateLogList(strArr,20,nextHeight,"#444444",size);
        }else{
            strArr=new Array();
            strArr[0]=string;
            strArr.push([""]);
            s1.drawUpdateLogList(strArr,20,nextHeight,"#444444",size);
        }
        nextHeight+=(strArr.length+1)*30;
        endPos=nextHeight;
        return s1;
    }

    this.setListTime = function(i,time){
        var s1=new OSprite(null,viewport);
        var string=time;
        var strArr=new Array();
        strArr.push(string);
        s1.drawUpdateLogList(strArr,380*scale,nextHeight-60,"#CCCCCC",size);
        //s1.drawText(string,300,nextHeight-20);
        //s1.y=nextHeight-20;
        return s1;
    }
    this.setListLine = function(i){
        if(i!=-1){
            var s1=new OSprite(null,viewport);
            var string=stringArr[i];
            var strArr=string.split('<br/>');
            s1.setBitmap(imgArr["logLine"]);
            s1.y=nextHeight-20;
            return s1;
        }
    }

    this.update = function () {
        if(btnClose.isClick()){
            tv.scene=new SCGMenu(function () {});
            this.cmdClose();
        }

        if(this.updateMove()){
            return;
        }
    }

    this.updateMove = function(){
        if(onTouchDown && onTouchMove ){ //&& viewport.isIn()
            var pos = parseInt(viewport.oy - (onTouchDY - onTouchY));
            viewport.oy = pos;
            if(viewport.oy > 0 )
                viewport.oy = 0;
            if(viewport.oy <  (endPos * -1))
                viewport.oy = endPos * -1;
            onTouchDY = onTouchY;
            return true;
        }
        return false;
    }


    this.fadeScene= function (start,To,is_Exit) {
        wait = 5;

        backMask.opacity=start;
        backMask.FadeTo(To, wait);

        backImg.opacity=start;
        backImg.FadeTo(To, wait);

        btnClose.setOpactiy(start);
        btnClose.SetFade(To, wait);

        //  var sprites,spritesLine,spriteTime;
        if(sprites){
            for(var i=0;i<sprites.length;i++){
                if(sprites[i]){
                    sprites[i].opacity=start;
                    sprites[i].FadeTo(To, wait);
                }

                if(spritesLine&&spritesLine[i]){
                    spritesLine[i].opacity=start;
                    spritesLine[i].FadeTo(To, wait);
                }

                if(spriteTime&&spriteTime[i]){
                    spriteTime[i].opacity=start;
                    spriteTime[i].FadeTo(To, wait);
                }
            }
        }

        //for (var i = 0; i < buttons.length; i++) {
        //    if(buttons[i]!=null){
        //        buttons[i].setOpactiy(start);
        //        buttons[i].SetFade(To, wait);
        //    }
        //}
        isExit = is_Exit;
    }
    this.cmdClose = function () {
        this.fadeScene(255,0,true);
    }
    gLoadAssets.curLoadScene = "SCGUpdateLog";
    if(gLoadAssets.isNeedLoad()){

    }else{
        this.init();
    }
}