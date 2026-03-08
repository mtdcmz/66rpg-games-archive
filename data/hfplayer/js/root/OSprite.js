/**
 * Created by 七夕小雨 on 2014/11/10.
 */
function OSprite(image,viewport){

    //this.prototype = new ODrawBase();
    ODrawBase.call(this); //0114 jhy tes

    this.z = 0;
    this.image = image;
    this.visible = true;
    //淡入淡出
    this.tmpOpacity = 0;
    this.endOpactiy = 0;
    this.diffO = 0;
    this.fadeFrames = 0;
    //移动部分
    this.tmpX = 0;
    this.tmpY = 0;
    this.endX = 0;
    this.endY = 0;
    this.diffX = 0;
    this.diffY = 0;
    this.slideFrames = 0;
    //缩放部分
    this.tmpZoomX = 0;
    this.tmpZoomY = 0;
    this.endZoomX = 0;
    this.endZoomY = 0;
    this.diffZoomX = 0;
    this.diffZoomY = 0;
    this.scaleFrames = 0;
    this.objtype = "sprite";
    this.viewport = viewport;
    this.opacity = 255;
    //镜像
    this.mirror = false;
    this.mpngKey = "";//0309 mpng key值
    //旋转角度
    this.loadingRotate = false;
    this.loadingRotateAngle = 0;
    this.rotate = false;  //整数
    this.loopRotate = false;
    this.rotaOriginX = 0; //旋转的中心点x
    this.rotaOriginY = 0; //旋转的中心点Y
    this.rotateframes = 0;
    this.tmpRotate = 0;
    this.endRotate = 0;
    this.diffRotate = 0;
    this.fontSize = 0;
    //精灵的标识
    this.tag ="";

    //拉伸相关
    this.isStretImg = false;
    this.stretArr =[0,0,0,0];
    this.stretWidth = 0;
    this.stretHeight = 0;

    this.stretImgHeight = 0;
    this.stretImgWidth = 0;
    //0422 闪烁标志 h5兼容游戏闪烁效果的临时处理,并不是不太好的设计,只有cmain的一个闪烁精灵使用，其它sprite不要去改变这个标志
    this.bflashbright = false;

    this.e = new Array();

    this.string = "";
    this.sX = 0;
    this.sY = 0;

    if(tv && tv.data != null){
        this.color = tv.data.System.FontUiColor.getColor();
    }else{
        this.color = new OColor(255,255,255,255).getColor();
    }

    this.texts = new Array();
    //文字首行坐标
    this.firstX = 0;
    //文字横向间隔
    this.textX = 0;
    //缩略图
    this.isSaveIcon=false;
    this.iconTag;
    //预加载字体绘制
    this.loadText = false;

    //this.zoom_x=this.zoom_y;
    //低清的把精灵width，height改变成从数据里取出来的
    this.initImageWidthAndHeight = function()
    {
        if(this.image){
            if(infoList[this.image.src]!=null)
            {
                var obj = infoList[this.image.src] ;
                if(obj.w > 0 && obj.h>0)
                {
                    var obj = infoList[this.image.src] ;
                    this.image.width=obj.w;
                    this.image.height=obj.h;
                }
            }
        }
    }
    //获得这个精灵的宽度
    this.getWidth = function () {
        if(this.image){
            return this.image.width*this.zoom_x;
        }
    }
    //获得这个精灵的高度
    this.getHeight = function () {
        if(this.image){
            return this.image.height*this.zoom_y;
        }
    }
    //清晰度相关 31 低清，32高清，0或者不写 代表原画
    this.imageupdate = function(){
        if(this.image!=null){
            if(quality==31){
                this.initImageWidthAndHeight();
            }
            this.width = this.image.width;
            this.height = this.image.height;
            this.visible = true;
        }
    };
    this.stretImage = function (posArr,width,height) {
        var self = this;
        function setStret(){
            self.isStretImg = true;
            self.stretArr = posArr;
            self.stretWidth = width;
            self.stretHeight = height;
            var top,bottom,left,right;
            top = parseInt(posArr[0]);
            bottom = parseInt(posArr[1]);
            left = parseInt(posArr[2]);
            right = parseInt(posArr[3]);
            var imgHeight = top+parseInt(self.stretHeight)+bottom;
            var imgWidth = left+ parseInt(self.stretWidth) +right;
            if(self.stretImgHeight!=imgHeight){
                self.stretImgHeight = imgHeight;
            }
            if(self.stretImgWidth!=imgWidth){
                self.stretImgWidth = imgWidth
            }
        }
        if(!this.image.complete){
            this.image.onload = function () {
                setStret();
            };
        }else{
            setStret();
        }
    }
    //判断点击坐标位置是否透明
    this.respTranArea = function(a,callBack){
        var isClick =false;
        if(a){
            isClick =a;
        }else{
            isClick = onClick();
        }
        if(isClick){
            var x=0,
                y=0;
            if(this.viewport){
                x=parseInt(onTouchDX - this.x - this.viewport.x);
                y=parseInt(onTouchDY - this.y - this.viewport.y);
            }else{
                x=parseInt(onTouchDX - this.x);
                y=parseInt(onTouchDY - this.y);
                if((x<=0 || x > this.width * this.zoom_x) || (y<=0 || y > this.height * this.zoom_y)){
                    x=0;
                    y=0;
                }
            }
            if(x!=0 && y!=0 && x < this.width*this.zoom_x && y < this.height*this.zoom_y){
                //return interactivePNG._respTranArea(this.image,x*this.zoom_x,y*this.zoom_y,this.zoom_x,this.zoom_y);
                interactivePNG._respTranArea(this.image,x*this.zoom_x,y*this.zoom_y,this.zoom_x,this.zoom_y, function (bool) {
                    callBack(bool);
                });
            }else{
                callBack(false);
            }
            //return false;
        }
        else{
            callBack(false);
            //return false;
        }
    }
    //移动时候判断透明
    this.respTranAreaMove = function(){
        var x=0,
            y=0;
        if(onTouchDown){
            if(onTouchX>-1 && onTouchY>-1){
                if(this.viewport){
                    x=parseInt(onTouchX - this.x - this.viewport.x);
                    y=parseInt(onTouchY - this.y - this.viewport.y);
                }else{
                    x=parseInt(onTouchX - this.x);
                    y=parseInt(onTouchY - this.y);
                }
                if((x<=0 || x > (this.x+this.width)*this.zoom_x) || (y<=0 || y > (this.y+this.height))*this.zoom_y){
                    x=0;
                    y=0;
                }
            }
        }
        if(x!=0 && y!=0 && x < this.width*this.zoom_x && y < this.height*this.zoom_y){
            return interactivePNG._respTranArea(this.image,x,y,this.zoom_x,this.zoom_y);
        }else{
            return false;
        }
    }

    if(this.image != null){
        //this.image.onload = this.imageupdate();
        this.imageupdate();
        //this.initImageWidthAndHeight();
        //this.image.src = this.image.src ;
    }


    if(this.viewport != null){
        this.viewport.add(this);
        this.viewport.set_Z();
    }else{
        sb.add(this);
        sb.setZ();
    }

    this.dispose = function(){
        if(this.viewport != null){ //0120 jhy viewport内的sprite移除
            this.viewport.remove(this);
        }else{
            sb.remove(this);
        }
        this.texts.length = 0;
        this.image = null;
    };


    this.setZ = function(z){
        this.z = z;
        if(this.viewport == null){
            sb.setZ();
        }else{
            this.viewport.set_Z();
        }

    };
    this.drawBorder = function (lineWidth,color) {
        this.haveBorder = true;
        this.borderLineWidth = lineWidth;
        this.borderCorlor = color;
    }
    this.clearBorder = function () {
        this.haveBorder = false;
        this.borderLineWidth = 0;
    }
    this.getBitmap = function(){
        return this.image;
    };

    this.getRect = function(){
        if(this.width == 0 && this.image != null){
            this.width = this.image.width;
            this.height = this.image.height;
        }
        return {
            x : this.x,
            y : this.y,
            width : this.width * this.zoom_x,
            height : this.height * this.zoom_y
        };
    };
    
    this.getStretHeight = function () {
        if(this.isStretImg){
            return this.stretImgHeight;
        }else{
            return this.height;
        }

    }
    this.getStretWidth = function () {
        if(this.isStretImg) {
            return this.stretImgWidth;
        }else{
            return this.width;
        }
    }
    this.setBitmap = function(b){
        if(b == null){
            this.image = null;
            this.visible = false;
            this.removeRotate();
            return;
        }
        this.visible = false;
        this.image = b;
        //this.image.onload = this.imageupdate();
        this.imageupdate();
        //this.z+=1;
    };
    //清空旋转值
    this.removeRotate = function(){
        this.rotate = false;  //整数
        this.loopRotate = false;
        this.rotaOriginX = 0; //旋转的中心点x
        this.rotaOriginY = 0; //旋转的中心点Y
        this.rotateframes = 0;
        this.tmpRotate = 0;
        this.endRotate = 0;
        this.diffRotate = 0;
        this.loadingRotateAngle = 0;
        this.loadingRotate = false;
    };
    //橙光菜单的头像
    this.setHeadIcon= function (b,isIcon,r) {
        if(b == null){
            this.image = null;
            this.visible = false;
            return;
        }
        this.isICon=isIcon;
        this.circleR=r;
        this.visible = false;
        this.image = b;
        //this.image.onload = this.imageupdate();
        this.imageupdate();
    }
    this.setBitmapFont = function (index,x,y,w,h) {
        this.bitMapFlag = true;
        this.fontIndex = index;
        this.fontX = x;
        this.fontY = y;
        this.fontW = w;
        this.fontH = h;
    }
    this.drawBitmapFont = function (g) {
        if(this.bitMapFlag){
            g.drawImage(bitmapFont.bitMapArr["image"][this.fontIndex],this.fontX,this.fontY,this.fontW,this.fontH,0,0,this.fontW,this.fontH);
        }
    }
    this.rotateImage = function (g) {
        if(!this.image){
            return;
        }
        if(this.loadingRotate){
            if(this.loadingRotateAngle>=360){
                this.loadingRotateAngle =0;
            }
            //g.translate(50,50);
            g.translate(this.width/2, this.height/2);
            g.rotate(this.loadingRotateAngle);//旋转47度
            g.translate(-this.width/2, -this.height/2);
            return;
        }
        if(this.rotate){
            if(this.rotateframes>0){
                this.rotateframes--;
                this.tmpRotate += this.diffRotate;
                /*g.translate(this.rotaOriginX,this.rotaOriginY);
                g.rotate(this.tmpRotate*Math.PI/180);
                g.translate(-this.rotaOriginX,-this.rotaOriginY);*/
                if(this.mirror){
                    //存在镜像
                    g.translate(parseFloat(this.image.width) - parseFloat(this.rotaOriginX),this.rotaOriginY);
                    g.scale(1/this.zoom_x,1/this.zoom_y);
                    g.rotate(-this.tmpRotate*Math.PI/180);
                    g.scale(this.zoom_x,this.zoom_y);
                    g.translate(parseFloat(this.rotaOriginX)-parseFloat(this.image.width),-this.rotaOriginY);
                }else{
                    g.translate(this.rotaOriginX,this.rotaOriginY);
                    g.scale(1/this.zoom_x,1/this.zoom_y);
                    g.rotate(this.tmpRotate*Math.PI/180);
                    g.scale(this.zoom_x,this.zoom_y);
                    g.translate(-this.rotaOriginX,-this.rotaOriginY);
                }
            }else{
                if(this.mirror){
                    //存在镜像
                    g.translate(parseFloat(this.image.width) - parseFloat(this.rotaOriginX),this.rotaOriginY);
                    g.scale(1/this.zoom_x,1/this.zoom_y);
                    g.rotate(-this.endRotate*Math.PI/180);
                    g.scale(this.zoom_x,this.zoom_y);
                    g.translate(parseFloat(this.rotaOriginX)- parseFloat(this.image.width),-this.rotaOriginY);
                }else{
                    g.translate(this.rotaOriginX,this.rotaOriginY);
                    g.scale(1/this.zoom_x,1/this.zoom_y);
                    g.rotate(this.endRotate*Math.PI/180);
                    g.scale(this.zoom_x,this.zoom_y);
                    g.translate(-this.rotaOriginX,-this.rotaOriginY);
                }
            }
        }

    };

 this.drawRect = function (x,y,w,h,fillcolor,linewidth,linecolor) {
        this.isRect = true;
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.rectFillColor = fillcolor;
        this.rectLineWidth = linewidth;
        this.rectLineColor = linecolor;
    }

    this.update = function(g){
        this.UpdateFade();
        this.UpdateScale();
        this.UpdateSlide();
        if(this.visible == false) {
            return;
        }
        g.save();
        if(!this.mirror){
            if(this.viewport != null){
                g.translate(this.viewport.x + this.viewport.ox + this.x,this.viewport.y + this.viewport.oy + this.y);
            }else{
                g.translate(this.x, this.y);
            }
            g.scale(this.zoom_x,this.zoom_y);
        }else{
            if(this.viewport != null){
                //g.transform(-1 * this.zoom_x,0,0,this.zoom_y,this.viewport.x + this.viewport.ox + this.x + this.width,this.viewport.y + this.viewport.oy + this.y);
                g.transform(-1 * this.zoom_x,0,0,this.zoom_y,this.viewport.x + this.viewport.ox + this.x + this.getWidth(),this.viewport.y + this.viewport.oy + this.y);
            }else{
                //g.transform(-1 * this.zoom_x,0,0,this.zoom_y,this.x + this.width,this.y);
                g.transform(-1 * this.zoom_x,0,0,this.zoom_y,this.x + this.getWidth(),this.y);
            }
        }
        this.rotateImage(g);

        
        //透明图
        if(this.opacity > 255){
            this.opacity = 255;
        }else if(this.opacity <= 0){
            this.opacity = 0;
        }

        //方框
        if(this.isRect){
            g.strokeStyle = this.rectLineColor;
            g.lineWidth = this.rectLineWidth;
            //g.fillRect(this.x,this.y,this.width,this.height);
            g.fillStyle = this.rectFillColor;
            g.strokeRect(0,0,this.width,this.height);
            g.fillRect(0,0,this.width,this.height);
            //g.strokeStyle =this.rectFillColor;
            //g.fillRect(this.x,this.y,this.width,this.height);
            //g.strokeStyle = this.rectLineColor;
            //g.
        }

        if(this.haveBorder){
            var borderWidth = this.borderLineWidth;
            g.strokeStyle = this.borderCorlor;
            g.lineWidth = borderWidth;
            //g.fillRect(this.x,this.y,this.width,this.height);
            g.strokeRect(0-borderWidth/2,0-borderWidth/2,this.width+borderWidth,this.height+borderWidth);
            //g.stroke();
        }
        this.drawBitmapFont(g);

        //橙光菜单中的头像
        if(this.isICon){
            //g.save();
            //合闭画笔区域
            g.beginPath();
            //画一个圆
            g.arc(this.circleR,this.circleR,this.circleR,0,2*Math.PI);
            g.strokeStyle ="#d5d5d5";
            if(this.circleLineWidth || this.circleLineWidth==0){
                g.lineWidth = this.circleLineWidth
            }else{
                g.lineWidth=10;
            }
            g.stroke();
            g.closePath();
            g.clip();
            //g.drawImage(this.image,x-r,y-r,r*2,r*2);
            //g.drawImage(this.image,0-r,0-r,r*2,r*2);
        }
        //天气效果的雨
        if(this.isDrawRain){
            g.rotate(this.rotate);
            g.globalAlpha= this.opacity/255;
            g.fillStyle = "#ffffff";
            g.fillRect(0,0,1,this.lineHeight);
        }
        //天气效果的雪
        if(this.isDrawSnow){
            g.globalAlpha= this.opacity/255;
            g.fillStyle = "#ffffff";
            g.fillRect(0,0,2,this.lineHeight);
            g.rotate(45);
            g.fillRect(0,0,2,this.lineHeight);
            g.rotate(45);
            g.fillRect(0,0,2,this.lineHeight);
            g.rotate(45);
            g.fillRect(0,0,2,this.lineHeight);
            g.rotate(45);
            g.fillRect(0,0,2,this.lineHeight);
            g.rotate(45);
            g.fillRect(0,0,2,this.lineHeight);
        }

        if(this.image != null && this.opacity > 0){
            g.globalAlpha= this.opacity / 255;
            if(this.image.src!=null && this.image.src.length>0)
            {
                try
                {

                   // g.drawImage(this.image,0,0);
                   // 橙光菜单头像
                    if(this.isICon==true){
                        g.drawImage(this.image,0,0,this.circleR*2,this.circleR*2);
                    }else if(this.isSaveIcon==true) {//存档缩略图
                        g.drawImage(this.image,0,0,this.iconTag.w,this.iconTag.h);
                    }else if(this.isStretImg){
                        var top,bottom,left,right;
                        top = parseInt(this.stretArr[0]);
                        bottom = parseInt(this.stretArr[1]);
                        left = parseInt(this.stretArr[2]);
                        right = parseInt(this.stretArr[3]);
                        //开始坐标，宽度
                        var sWidth,sHeight;
                        sWidth = this.width - right - left;
                        sHeight = this.height - bottom - top;

                        //拉伸的中间部分
                        g.drawImage(this.image,left,top,sWidth,sHeight,left,top,this.stretWidth,this.stretHeight);
                        /*
                        * sx = 开始x
                        * sy = 开始y
                        * sw = 截取w
                        * sh = 截取h
                        * x = 显示坐标x
                        * y = 显示坐标y
                        * dw = 显示宽度w
                        * dh = 显示高度h
                        * */

                        //不变的四个角

                        //  //上 左 角
                        var sx,sy,sw,sh, x, y,dw,dh;
                        sx=sy=x=y=0;
                        sw=dw=left;
                        sh=dh=top;
                        g.drawImage(this.image,sx,sy,sw,sh,x,y,dw,dh);

                        //  //下 左 角
                        sx=0;
                        sy=this.height-bottom;
                        x=0;
                        y=this.stretHeight+top;
                        sw=dw=left;
                        sh=dh=bottom;
                        g.drawImage(this.image,sx,sy,sw,sh,x,y,dw,dh);

                        //  //上 右 角
                        sx=this.width-right;
                        sy=0;
                        x=left+this.stretWidth;
                        y=0;
                        sw=dw=right;
                        sh=dh=top;
                        g.drawImage(this.image,sx,sy,sw,sh,x,y,dw,dh);

                        //  //下 右 角
                        sx=this.width-right;
                        sy=this.height-bottom;
                        x=left+this.stretWidth;
                        y=this.stretHeight+top;
                        sw=dw=right;
                        sh=dh=bottom;
                        g.drawImage(this.image,sx,sy,sw,sh,x,y,dw,dh);
                        //拉伸的上、下部分
                        sx=left;
                        sy=0;
                        x=left;
                        y=0;
                        sw=this.width-left-right;
                        sh=top;
                        dw=this.stretWidth;
                        dh=top;
                        g.drawImage(this.image,sx,sy,sw,sh,x,y,dw,dh); // 上

                        sx=left;
                        sy=this.height-bottom;
                        x=left;
                        y=top+this.stretHeight;
                        sw=this.width-left-right;
                        sh=bottom;
                        dw=this.stretWidth;
                        dh=bottom;
                        g.drawImage(this.image,sx,sy,sw,sh,x,y,dw,dh); // 下

                        //拉伸的左、右部分
                        sx=0;
                        sy=top;
                        x=0;
                        y=top;
                        sw=left;
                        sh=this.height-top-bottom;
                        dw=left;
                        dh=this.stretHeight;
                        g.drawImage(this.image,sx,sy,sw,sh,x,y,dw,dh); // 左

                        sx=this.width-right;
                        sy=top;
                        x=left+this.stretWidth;
                        y=top;
                        sw=right;
                        sh=this.height-top-bottom;
                        dw=right;
                        dh=this.stretHeight;
                        g.drawImage(this.image,sx,sy,sw,sh,x,y,dw,dh); // 右
                    }else{
                        if(this.width>0&&this.height>0 )
                        {
                            g.drawImage(this.image,0,0,this.width,this.height);
                        }else
                        {
                            g.drawImage(this.image,0,0);
                        }
                    }
                 
                }
                catch(e)
                {
                }
            }
        }

        if(this.string&&this.string.length > 0){
            
            //0401- g已经经过矩阵变换,x,y暂时未使用
       /*     var x = 0;
            var y =0;
            if(viewport == null){
                x = this.x + this.sX;
                y = this.y + this.sY;
            }else{
                x = this.viewport.ox + this.viewport.x + this.x + this.sX;
                y = this.viewport.oy + this.viewport.y + this.y + this.sY;
            }*/
            if(tv.data != null){
                if(this.fontSize!=0){
                    g.font = this.fontSize + "px " +fontName;
                }else{
                    g.font = tv.data.System.FontSize + "px " +fontName;
                }
                if(this.loadText){
                    g.font = this.fontSize + "px " +fontName;
                    g.fillStyle = this.color;
                    g.fillText(this.string,this.sX,this.sY + 22);
                    return;
                }
                if(tv.data.System.FontStyle == 1) this.drawShadowText(g,this.string,new OColor(0, 0, 0).getColor(),this.sX , this.sY + tv.data.System.FontSize);
                if(tv.data.System.FontStyle == 2) this.drawShadowText(g,this.string,new OColor(125, 125, 125).getColor(),this.sX , this.sY + tv.data.System.FontSize);
                if(tv.data.System.FontStyle == 3) this.drawShadowText(g,this.string,new OColor(255, 255, 255).getColor(),this.sX , this.sY + tv.data.System.FontSize);
                if(tv.data.System.FontStyle == 4) this.drawStrokeText(g,this.string,new OColor(0, 0, 0).getColor(),this.sX , this.sY + tv.data.System.FontSize);
                if(tv.data.System.FontStyle == 5) this.drawStrokeText(g,this.string,new OColor(125, 125, 125).getColor(),this.sX , this.sY + tv.data.System.FontSize);
                if(tv.data.System.FontStyle == 6) this.drawStrokeText(g,this.string,new OColor(255, 255, 255).getColor(),this.sX , this.sY + tv.data.System.FontSize);
                g.fillStyle = this.color;
                g.fillText(this.string,this.sX,this.sY + tv.data.System.FontSize);
            }else{
                g.font = this.fontSize + "px " +fontName;
                g.fillStyle = this.color;
                g.fillText(this.string,this.sX,this.sY + 22);
            }
        }


        for(var i = 0;i<this.texts.length;i++){
            this.texts[i].draw(g);
        }

        //0422 闪烁测试
        if(gGameDebug.bflash){
            if(this.bflashbright){
                g.globalAlpha= this.opacity / 255;
                g.fillStyle = this.color;
                g.fillRect(0,0,gGameWidth,gGameHeight);//960,540
            }
        }
        g.restore();
    };

    this.drawShadowText = function(g,s,o,x,y){
        g.fillStyle = o;
        g.fillText(s,x + 1,y + 1);  
    }

    this.drawStrokeText = function(g,s,o,x,y){
        g.fillStyle = o;
        g.fillText(s,x + 1,y + 1);
        g.fillText(s,x + 1,y　);  
        g.fillText(s,x + 1,y - 1);  
        g.fillText(s,x ,y - 1);  
        g.fillText(s,x - 1,y - 1);  
        g.fillText(s,x - 1,y );  
        g.fillText(s,x - 1,y + 1); 
        g.fillText(s,x ,y + 1);   
    }


    this.StopTrans = function(){
        this.fadeFrames = 0;
        this.slideFrames = 0;
        this.scaleFrames = 0;
    };

    this.StopToGoal = function(){
        if(this.fadeFrames > 0){
            this.fadeFrames = 0;
            this.opacity = this.endOpactiy;
            this.visible = this.opacity > 0;
        }
        if(this.slideFrames > 0){
            this.slideFrames = 0;
            this.x = this.endX;
            this.y = this.endY;
        }
        if(this.scaleFrames > 0){
            this.zoom_x = this.endZoomX;
            this.zoom_y = this.endZoomY;
        }
    };
    this.Fade = function(bOpacity,eOpacity,frames){
        if(frames <= 0){
            this.opacity = eOpacity;
            this.visible = this.opacity > 0;
        }else{
            this.fadeFrames = frames;
            this.endOpactiy = eOpacity;
            this.diffO = (eOpacity - bOpacity) /  parseFloat(frames);
            //0305 jhy- 63481 gamepicture bOpcity已经被设为0后 cmain.fadeout eOpacity也为0 这张图片就应该不显示 不需要渐变
            //if(this.diffO == 0) {
            //    this.diffO = 1;
            //}
            this.tmpOpacity = bOpacity;
            this.opacity = bOpacity;
        }
    };

    this.FadeTo = function(eOpacity,frames){
        this.Fade(this.opacity,eOpacity,frames);
    };

    this.getY = function () {
        return this.y;
    }
    this.UpdateFade = function(){
        //如果是隐藏  不执行
        if(this.visible == false && this.endOpactiy==0) {
            //console.log(this);
            return;
        }
        if(this.fadeFrames <= 0) {
            return;
        }
        this.fadeFrames -= 1;
        if(this.fadeFrames <= 0){
            this.opacity = this.endOpactiy;
        }else{
            this.tmpOpacity += this.diffO;
            this.opacity = this.tmpOpacity;
        }
        this.visible = this.opacity > 0;
    };
    this.Slide = function(bX,bY,eX,eY,frames){
        //如果是隐藏  不执行
        if(this.visible == false && this.fadeFrames <= 0) {
            //console.log(this);
            return;
        }
        if(tv.canvas.message[tv.canvas.msgIndex].isSpeedRead()){
            this.x = eX;
            this.y = eY;
            return;
        }
        //if(tv.system.quickRun){
        //
        //}
        if(frames <= 0){
            this.x = eX;
            this.y = eY;
        }else{
            this.slideFrames = frames;
            this.endX = eX;
            this.endY = eY;
            this.diffX = ((this.endX - bX) /  parseFloat(frames));
            this.diffY = (this.endY - bY) /  parseFloat(frames);
            this.tmpX = bX;
            this.tmpY = bY;
            this.x = bX;
            this.y = bY;
        }
    };

    this.SlideTo = function(eX,eY,frames){
        this.Slide(this.x, this.y, eX, eY, frames);
    };

    this.UpdateSlide = function(){
        var msgSp;
        if(tv && tv.canvas){
            var msgSp = tv.canvas.message[tv.canvas.msgIndex];
        }
        //if(msgSp.isRoll){
        //    this.endY = this.endY-msgSp.MsgHeight*msgSp.lineHeight;
        //}
        if(this.slideFrames <= 0) return;
        this.slideFrames -= 1;
        if(this.slideFrames <= 0){
            if(this.tag == "bitmapFont"){
                if(msgSp.isRoll){
                    if(msgSp.bitMapFontArr.length>0){
                        for(var i =0;i<msgSp.bitMapFontArr.length;i++){
                            msgSp.bitMapFontArr[i].x = msgSp.bitMapFontArr[i].x+this.diffX;
                            msgSp.bitMapFontArr[i].y = msgSp.bitMapFontArr[i].y+this.diffY;
                        }
                    }
                }
            }else{
                this.x = this.endX;
                this.y = this.endY;
            }
        }else{
            if(this.tag == "bitmapFont"){
                if(msgSp.isRoll){
                    if(msgSp.bitMapFontArr.length>0){
                        for(var i =0;i<msgSp.bitMapFontArr.length;i++){
                            msgSp.bitMapFontArr[i].x = msgSp.bitMapFontArr[i].x+this.diffX;
                            msgSp.bitMapFontArr[i].y = msgSp.bitMapFontArr[i].y+this.diffY;
                        }
                    }
                }
            }else{
                this.tmpX += this.diffX;
                this.tmpY += this.diffY;
                this.x = this.tmpX;
                this.y = this.tmpY;
            }
        }
    };

    this.Scale = function(bzx,bzy,ezx,ezy,frames){
        //如果是隐藏  不执行
        if(this.visible == false) {
            //console.log(this);
            return;
        }
        if(tv.canvas.message[tv.canvas.msgIndex].isSpeedRead()){
            this.zoom_x = ezx;
            this.zoom_y = ezy;
            return;
        }
        if(frames <= 0){
            this.zoom_x = bzx;
            this.zoom_y = bzy;
        }else{
            this.scaleFrames = frames;
            this.endZoomX = ezx;
            this.endZoomY = ezy;
            this.diffZoomX = (this.endZoomX - bzx) / parseFloat(frames);
            this.diffZoomY = (this.endZoomY - bzy) /  parseFloat(frames);
            this.tmpZoomX = bzx;
            this.tmpZoomY = bzy;
            this.zoom_x = bzx;
            this.zoom_y = bzy;
        }
    };

    this.ScaleTo = function(ezx,ezy,frames){
        this.Scale(this.zoom_x, this.zoom_y, ezx, ezy, frames);
    };

    this.UpdateScale = function(){
        if(this.scaleFrames <= 0) return;
        this.scaleFrames -= 1;
        if(this.scaleFrames <= 0){
            this.zoom_x = this.endZoomX;
            this.zoom_y = this.endZoomY;
        }else{
            this.tmpZoomX += this.diffZoomX;
            this.tmpZoomY += this.diffZoomY;
            this.zoom_x = this.tmpZoomX;
            this.zoom_y = this.tmpZoomY;
        }
    };

    this.drawText = function(string,x,y,loadText){
        this.string = string;
        this.sX = x;
        this.sY = y;
        if(loadText){
            this.loadText = loadText;
        }
    }
    this.clearText = function(){
        this.string = "";
        this.texts.length = 0;
    }

   this.drawTextList = function(array,x,y,color){
        this.texts.length = 0;
        var height = tv.canvas.message[tv.canvas.msgIndex].lineHeight;
        for (var i = 0; i < array.length; ++i) {
            var t = new DTextA(array[i],x, y + i * height,color); // OColor(255,255,255)
            this.texts.push(t)
        }
   }
    this.drawUpdateLogList = function(array,x,y,color,size,lineHeight){
        this.texts.length = 0;
        //var height = tv.canvas.message.lineHeight;
        var height = lineHeight;
        for (var i = 0; i < array.length; ++i) {
            var t;
            if(this.firstX!=0 && i==0){
                t = new DTextUpdateLog(array[i],x+this.firstX, y + i * height,color,size); // OColor(255,255,255)
            }else{
                t = new DTextUpdateLog(array[i],x, y + i * height,color,size); // OColor(255,255,255)
            }

            this.texts.push(t)
        }
    }
    this.drawLineTxt = function(str,x,y,color,size){
        this.texts.length = 0;
        var t = new DTextUpdateLog(str,x, y ,color,size); // OColor(255,255,255)
        this.texts.push(t);
    }
    this.isSelected = function(){
       // return false ;
        this.getRect();//0115 img可能还没加载出来导致height,width为0 
        return this.isSelectedD(0,0);
    };

    this.isSelectedW = function(dx,dy){
        if(!this.visible && onTouchMove){return false;}
        if(this.image == null){return false;}
        var x = this.viewport == null ? this.y : this.viewport.y +this.viewport.oy + this.y;
        var y = this.viewport == null ? this.x : this.viewport.x +this.viewport.ox +  this.x;
        if(this.viewport != null && (onTouchX > (this.viewport.y + this.viewport.height) ||
            onTouchX < this.viewport.y || onTouchY > (this.viewport.x + this.viewport.width) ||
            onTouchY < this.viewport.x)){return false;}
        return onTouchX > this.y && onTouchX < this.y + this.height && onTouchY > this.x && onTouchY < this.x + this.width;
    };

    this.isSelectedD = function(dx,dy){
        if(!this.visible ){return false;}//&& onTouchMove 0423 这个标志有问题
        if(this.image == null){return false;}

        var x = this.viewport == null ? this.x : this.viewport.x +this.viewport.ox + this.x;
        var y = this.viewport == null ? this.y : this.viewport.y +this.viewport.oy +  this.y;
        if(this.viewport != null && (onTouchX > (this.viewport.x + this.viewport.width) ||
            onTouchX < this.viewport.x || onTouchY > (this.viewport.y + this.viewport.height) ||
            onTouchY < this.viewport.y)){return false;}

        //return onTouchX > this.x && onTouchX < this.x + this.width && onTouchY > this.y && onTouchY < this.y + this.height;
        return onTouchX > x && onTouchX < x + this.width && onTouchY > y && onTouchY < y + this.height;
    };

    this.isSelectedA = function(dx,dy){
        if(!this.visible && onTouchMove){return false;}
        if(this.image == null){return false;}
        var x = this.viewport == null ? this.x : this.viewport.x +this.viewport.ox + this.x;
        var y = this.viewport == null ? this.y : this.viewport.y +this.viewport.oy +  this.y;
        if(this.viewport != null && onTouchX > (this.viewport.x + this.viewport.width) ||
            onTouchX < this.viewport.x || onTouchY > (this.viewport.y + this.viewport.height) ||
            onTouchY < this.viewport.y){return false;}
        return onTouchX > this.x && onTouchX < this.x + this.width && onTouchY > this.y &&
            onTouchY < this.y + this.height;
    };

    //this.isSelectWithOpactiy = function(){ //根据像素透明度判断是否选中
    //    if(this.isSelected()){
    //        var x = this.viewport == null ? this.x : this.viewport.x +this.viewport.ox + this.x;
    //        var y = this.viewport == null ? this.y : this.viewport.y +this.viewport.oy +  this.y;
    //        var pixelX = parseInt(onTouchX - x);//鼠标点击点位于图片上的像素值
    //        var pixelY = parseInt(onTouchY - y);
    //        return gMpngBox.isSelectedMpng(pixelX,pixelY,this.mpngKey);
    //    }else{
    //        return false;
    //    }
    //}

    this.isSelectedText = function(tab){
        this.getRect();
        if(mark == "isFlash"&&tab =="ad"){
            //为广告而加
            var adonTouchX = 0;
            var adonTouchY = 0;
            if(gGameWidth == 800&&gGameHeight == 600){
                adonTouchX = onTouchX/zoom + 80;
                adonTouchY =onTouchY/zoom;
                if(adonTouchX>this.x+this.width*this.zoom_x ||
                    adonTouchX < this.x || adonTouchY >this.y+this.height*this.zoom_y ||
                    adonTouchY < this.y){return false;}

            }else if(gGameWidth == 1280&&gGameHeight == 720){
                adonTouchX = onTouchX/zoom;
                adonTouchY =onTouchY/zoom;
                if(adonTouchX>this.x+this.width*this.zoom_x ||
                    adonTouchX < this.x || adonTouchY >this.y+this.height*this.zoom_y ||
                    adonTouchY < this.y){return false;}

            }else{
                if(onTouchX >this.x+this.width*this.zoom_x ||
                    onTouchX < this.x || onTouchY >this.y+this.height*this.zoom_y ||
                    onTouchY < this.y){return false;}
            }
        }else{
            if(onTouchX >this.x+this.width*this.zoom_x ||
                onTouchX < this.x || onTouchY >this.y+this.height*this.zoom_y ||
                onTouchY < this.y){return false;}
        }
       return true;
    };
    this.isSelectedStretText = function(){
        this.getRect();
        //   console.log("this.x,this.y,width,height:",this.x,this.y,this.width,this.height);
        if(onTouchX >this.x+this.stretImgWidth*this.zoom_x ||
            onTouchX < this.x || onTouchY >this.y+this.stretImgHeight*this.zoom_y ||
            onTouchY < this.y){return false;}
        return true;
    };

    this.isClick = function(a){
        if(!this.visible){
            return false;
        }
        if(a!=null){
            var bClick = this.isSelectedText() && a;
            return bClick;
        }else{
            var bClick = this.isSelectedText() && onClick();
            return bClick;
        }

    };
}

function DTextUpdateLog(string,x,y,color,size){
    this.text = string;
    this.x = x;
    this.y = y;
    this.color =color;
    this.draw = function(g){
        if(tv.data != null){
            g.font = size + "px 微软雅黑";
            g.fillStyle = this.color;
            g.fillText(this.text,this.x,this.y + size);
        }else{
            g.font = "15px " +fontName;
            g.fillStyle = this.color;
            g.fillText(this.text,this.x,this.y + 15);
        }
    }

    this.drawShadowText = function(g,s,o,x,y){
        g.fillStyle = o;
        g.fillText(s,x + 1,y + 1);
    };

    this.drawStrokeText = function(g,s,o,x,y){
        g.fillStyle = o;
        g.fillText(s,x + 1,y + 1);
        g.fillText(s,x + 1,y　);
        g.fillText(s,x + 1,y - 1);
        g.fillText(s,x ,y - 1);
        g.fillText(s,x - 1,y - 1);
        g.fillText(s,x - 1,y );
        g.fillText(s,x - 1,y + 1);
        g.fillText(s,x ,y + 1);
    }
}

function DTextA(string,x,y,color){
    this.text = string;
    this.x = x;
    this.y = y;
    this.color =color;

    this.draw = function(g){
        if(tv.data != null){
            if(tv.data.System.FontSize>34){
                tv.data.System.FontSize=34;
            }
            g.font = tv.data.System.FontSize + "px " +fontName;
            if(tv.data.System.FontStyle == 1) this.drawShadowText(g,this.text,new OColor(0, 0, 0).getColor(),this.x , this.y + tv.data.System.FontSize);
            if(tv.data.System.FontStyle == 2) this.drawShadowText(g,this.text,new OColor(125, 125, 125).getColor(),this.x , this.y + tv.data.System.FontSize);
            if(tv.data.System.FontStyle == 3) this.drawShadowText(g,this.text,new OColor(255, 255, 255).getColor(),this.x , this.y + tv.data.System.FontSize);
            if(tv.data.System.FontStyle == 4)
            {
                this.drawStrokeText(g,this.text,new OColor(0,0,0).getColor(),this.x , this.y + tv.data.System.FontSize);
            }

            if(tv.data.System.FontStyle == 5) this.drawStrokeText(g,this.text,new OColor(125, 125, 125).getColor(),this.x , this.y + tv.data.System.FontSize);
            if(tv.data.System.FontStyle == 6) this.drawStrokeText(g,this.text,new OColor(255, 255, 255).getColor(),this.x , this.y + tv.data.System.FontSize);
            g.fillStyle = this.color;
            g.fillText(this.text,this.x,this.y + tv.data.System.FontSize);
        }else{
            g.font = "15px " +fontName;
            g.fillStyle = this.color;
            g.fillText(this.text,this.x,this.y + 15);
        }
    }

    this.drawShadowText = function(g,s,o,x,y){
        g.fillStyle = o;
        g.fillText(s,x + 1,y + 1);  
    }

    this.drawStrokeText = function(g,s,o,x,y){
        g.fillStyle = o;
        g.fillText(s,x + 1,y + 1);
        g.fillText(s,x + 1,y　);  
        g.fillText(s,x + 1,y - 1);  
        g.fillText(s,x ,y - 1);  
        g.fillText(s,x - 1,y - 1);  
        g.fillText(s,x - 1,y );  
        g.fillText(s,x - 1,y + 1); 
        g.fillText(s,x ,y + 1);   
    }
    
}