/**
 * Created by heshang on 2016/4/11.
 */
var InteractivePNG=(function () {
    function InteractivePNG(image,x,y){
        this._image=null;
        this._canvas=null;
        this._context=null;
        this._width=null;
        this._height=null;
        this.isScale=false;
        this.ImageDataBitMap = new Array();
    }
    InteractivePNG.prototype = {
        //创建一个canvas且只能创建一个
        _createCanvas:function(){
            var s=this;
            if (!s._canvas) {
                s._canvas = document.createElement("canvas");
                s._context = s._canvas.getContext("2d");
                //s._canvas.style.position = "absolute";
                //s._canvas.style.left = 0+"px";
                //s._canvas.style.top = 0+"px";
                //s._canvas.style.zIndex = 12;
                //s._canvas.style.backgroundColor = "red";
                //document.body.appendChild(s._canvas);
            }
            s._canvas.width = s._width;
            s._canvas.height = s._height;
        },
        //清除canvas
        _canvasClear: function () {
            var s = this;
            s._createCanvas();
            s._context.clearRect(0, 0, s._width, s._height);
        },
        //将图片画到画布上
        _drawImage: function () {
            var s=this;
            s._canvasClear();
            s._context.drawImage(s._image,0,0, s._width, s._height);
        },
        //得到要取出的点(周围5像素)
        _getPointData: function (data,x,y) {
            var s=this,i;
            i = s._width * 4 * y + x * 4;
            var d=data;

            //var l=i-20;
            //var r=i+20;
            //var dd=new Array();
            //if(l>0){
            //   for(var j=0;j<5;j++){
            //       for(var k=0;k<4;k++){
            //           //console.log(j*4+k);
            //           //console.log(d[j*4+k]);
            //           console.log(d[j*4+k]);
            //           dd[k]= d[j*4+k];
            //           //console.log(dd[k]);
            //       }
            //   }
            //}
            //console.log(dd);
            return [d[i], d[i + 1], d[i + 2], d[i + 3]];
        },
        //返回这个点是否有像素
        _respTranArea: function (image,x,y,sx,sy,callBack) {
            if(!image){
                return false;
            }
            var img = new Image();
            img.crossOrigin = "";
            img.src = image.src;
            var s=this;
            img.onload = function(){
                s._image=this;
                if(!sx&&sx!=0)sx=1;
                if(!sy&&sy!=0)sy=1;
                s._sx=sx;
                s._sy=sy;
                s._width=image.width*sx;
                s._height=image.height*sy;
                s._drawImage();
                s.data= s._context.getImageData(0,0, s._width, s._height);
                var pointData = s._getPointData(s.data.data,x,y);
                s._canvasClear();
                if(pointData[3] > 0){
                    callBack&&callBack(true);
                    //return true;
                }else{
                    callBack&&callBack(false);
                    //return false;
                }
            }
            img.onerror = function () {
                callBack&&callBack(false);
            }
            return;
            //getImage(img, function (img) {
            //    image = img;
            //    if(image.crossOrigin){
            //        var pointData;
            //        if(image != s._image){
            //            s._image=image;
            //            if(!sx&&sx!=0)sx=1;
            //            if(!sy&&sy!=0)sy=1;
            //            s._sx=sx;
            //            s._sy=sy;
            //            s._width=image.width*sx;
            //            s._height=image.height*sy;
            //            s._drawImage();
            //            s.data= s._context.getImageData(0,0, s._width, s._height);
            //        }else{//有的时候图片获取到的数组全部为0；
            //            s._drawImage();
            //            s.data= s._context.getImageData(0,0, s._width, s._height);
            //        }
            //        pointData = s._getPointData(s.data.data,x,y);
            //        s._canvasClear();
            //        if(pointData[3] > 0){
            //            callBack&&callBack(true);
            //            //return true;
            //        }else{
            //            callBack&&callBack(false);
            //            //return false;
            //        }
            //    }else{
            //        callBack&&callBack(true);
            //        //return true;
            //    }
            //});
            return;
        },
        //截取图片到画布上
        _drawCutImage: function () {
            var s=this;
            s._canvasClear();
            s._context.drawImage(s._image,s.fX,s.fY,s._width,s._height,0,0,s._width,s._height);
            s.fontImageData = s._context.getImageData(0,0,s._width,s._height);
        },
        //获取完整的实时旋转的Data；
        _getBitmapData:function(data,fontwidth,fontHeight){
            var s = this;
            if(isVertical){
                //竖屏游戏
                if(roated && isPhone){
                    s._context.rotate(90);
                    s._width = fontHeight;
                    s._height = fontwidth;
                    //s._rotated = true;
                    s.bitFontImageData1 = s._context.createImageData(fontHeight,fontwidth);
                    s.ImageDataBitMap = rotateArray(data.data,270,fontwidth,fontHeight,s.bitFontImageData1);
                    s._canvasClear();
                    //s._context.putImageData(s.bitFontImageData1,0,0);
                    return s.ImageDataBitMap;
                }else{
                    s._width = fontwidth;
                    s._height = fontHeight;
                    s._canvasClear();
                    //s._context.putImageData(s.bitFontImageData1,0,0);
                    return data;
                }
            }else{
                //横屏游戏
                if(roated && isPhone){
                    s._context.rotate(90);
                    s._width = fontHeight;
                    s._height = fontwidth;
                    //s._rotated = true;
                    s.bitFontImageData1 = s._context.createImageData(fontHeight,fontwidth);
                    s.ImageDataBitMap = rotateArray(data.data,90,fontwidth,fontHeight,s.bitFontImageData1);
                    s._canvasClear();
                    //s._context.putImageData(s.bitFontImageData1,0,0);
                    return s.ImageDataBitMap;
                }else{
                    s._width = fontwidth;
                    s._height = fontHeight;
                    s._canvasClear();
                    //s._context.putImageData(s.bitFontImageData1,0,0);
                    return data;
                }
            }
        },
        //引入图片并上色
        _drawBitmapColor:function(key,image,fX,fY,sW,sY,colorArr,callBack){
            var s = this;
            s._image = image;
            s._width = sW;
            s._height = sY;
            s.fX = fX;
            s.fY = fY;
            s._drawCutImage();
            s.fontImageData = s._context.getImageData(0,0,sW,sY);
            s.bitFontImageData = s._context.createImageData(sW,sY);
            //s.bitFontImageData1 = s._context.createImageData(s._canvas.width,s._canvas.height);

            if(tv.data.System.FontStyle == 1){
                //rgba(0,0,0,1) //黑色阴影
                s._toShadow(0,0,0,255,colorArr);

            }else if(tv.data.System.FontStyle == 2){
                //rgba(125,125,125,1) 灰色阴影
                s._toShadow(125,125,125,255,colorArr);

            }else if(tv.data.System.FontStyle == 3){
                //rgba(255,255,255,1) 白色阴影
                s._toShadow(255,255,255,255,colorArr);

            }else if(tv.data.System.FontStyle == 4){
                //黑色描边 rgba(0,0,0,1)
                s._toStroke(0,0,0,255,colorArr);
            }else if(tv.data.System.FontStyle == 5){
                //rgba(125,125,125,1) 灰色描边
                s._toStroke(125,125,125,255,colorArr);
            }else if(tv.data.System.FontStyle == 6){
                //rgba(255,255,255,1) 白色描边
                s._toStroke(255,255,255,255,colorArr);
            }else{
                //没有效果
                for(var i=0;i<s.fontImageData.data.length;i+=4) {
                    if (s.fontImageData.data[i + 3]) {
                        s.bitFontImageData.data[i] = colorArr[0];
                        s.bitFontImageData.data[i + 1] = colorArr[1];
                        s.bitFontImageData.data[i + 2] = colorArr[2];
                        s.bitFontImageData.data[i + 3] = s.fontImageData.data[i + 3];
                    }
                }
            }
            s._canvasClear();

            //console.log(s.bitFontImageData);
            s._putCanvasImgData(key,s.bitFontImageData, function (key,src) {
                callBack(key,src);
            });
            return;
            //return s.bitFontImageData;
            //s._context.putImageData(fontImageData,0,0);
            //var bitMapImage = s._bitMapToBeImg();
        },
        _putCanvasImgData: function (key,data,callBack) {
            var s = this;
            s._context.putImageData(data,0,0);
            s._bitMapToBeImg(key,function (key,src) {
                callBack(key,src);
            });
            return;
        },
        /*rotateCanvas: function () {
            var s = this;
            if(s._context){
                if(roated && isPhone){
                    s._context.rotate(90);
                    var w = s._width;
                    s._canvas.width = s._height;
                    s._canvas.height = w;
                    //s._rotated = true;
                    s.bitFontImageData1 = s._context.createImageData(s._canvas.width,s._canvas.height);

                    s.ImageDataBitMap = rotateArray(s.bitFontImageData.data,90,s._width,s._height);
                    //console.log('Z转了',s._canvas.width,s.ImageDataBitMap)
                    for(var i =0;i<s.bitFontImageData1.data.length;i+=4){
                        s.bitFontImageData1.data[i] = s.ImageDataBitMap[i];
                        s.bitFontImageData1.data[i+1]=s.ImageDataBitMap[i+1];
                        s.bitFontImageData1.data[i+2]=s.ImageDataBitMap[i+2];
                        s.bitFontImageData1.data[i+3]=s.ImageDataBitMap[i+3];
                    }
                    s._canvasClear();
                    s._context.putImageData(s.bitFontImageData1,0,0);
                    return s.bitFontImageData1;
                }else{
                    s._canvas.width = s._width;
                    s._canvas.height = s._height;
                    //s._rotated = false;
                    s.bitFontImageData1 = s._context.createImageData(s._canvas.width,s._canvas.height);
                    s.ImageDataBitMap = rotateArray(s.bitFontImageData.data,0,s._width,s._height);
                    for(var i =0;i<s.bitFontImageData1.data.length;i+=4){
                        s.bitFontImageData1.data[i] = s.ImageDataBitMap[i];
                        s.bitFontImageData1.data[i+1]=s.ImageDataBitMap[i+1];
                        s.bitFontImageData1.data[i+2]=s.ImageDataBitMap[i+2];
                        s.bitFontImageData1.data[i+3]=s.ImageDataBitMap[i+3];
                    }
                    s._canvasClear();
                    s._context.putImageData(s.bitFontImageData1,0,0);
                    return s.bitFontImageData1;
                }
            }
        },*/
        //转换成图片
        _bitMapToBeImg:function(key,callBack){
            var s=this;
            //s.image = new Image();
            //s.image.name = key;
            var src = s._canvas.toDataURL("image/png");
            callBack(key,src);
            //if(s.image.complete){
            //    callBack(s.image);
            //    return;
            //}
            //s.image.onload = function () {
            //    callBack(this);
            //}
            return;
        },
        //描边
        _toStroke:function(r,g,b,a,colorArr){
            var s = this;
            for(var i=0;i<s.fontImageData.data.length;i+=4){
                //当前这个上色 s.fontImageData s.bitFontImageData
                if(s.fontImageData.data[i+3]){

                    s.bitFontImageData.data[i] = colorArr[0];
                    s.bitFontImageData.data[i+1] = colorArr[1];
                    s.bitFontImageData.data[i+2] = colorArr[2];
                    s.bitFontImageData.data[i+3] = s.fontImageData.data[i+3]>160?s.fontImageData.data[i+3]:160;
                }
                //前一个点是透明的 给前面点上色
                if((s.fontImageData.data[i+3]!=0)&&(s.fontImageData.data[i-1]==0)){
                    //前面一个点  是透明的
                    s.bitFontImageData.data[i-4] = r;
                    s.bitFontImageData.data[i-3] = g;
                    s.bitFontImageData.data[i-2] = b;
                    s.bitFontImageData.data[i-1] = a;
                }
                // 右边是透明的给右边上色
                if((s.fontImageData.data[i+3]!=0)&&(s.fontImageData.data[i+7]==0)){
                    //前面一个点  是透明的
                    s.bitFontImageData.data[i+4] = r;
                    s.bitFontImageData.data[i+5] = g;
                    s.bitFontImageData.data[i+6] = b;
                    s.bitFontImageData.data[i+7] = a;
                }

                var potData = parseInt(i/4);
                var potY = parseInt(potData/s._width);
                var potX = parseInt(potData%s._width);

                //上一个点是透明的 给上面上色
                var potDataTop =potX+((potY-1)*s._width);
                var iTop =potDataTop*4;
                if((s.fontImageData.data[i+3]!=0)&&(s.fontImageData.data[iTop+3]==0)){
                    s.bitFontImageData.data[iTop] = r;
                    s.bitFontImageData.data[iTop+1] = g;
                    s.bitFontImageData.data[iTop+2] = b;
                    s.bitFontImageData.data[iTop+3] = a;
                }
                //console.log(i,potData,potX,potY,iTop);
                //下一个点是透明的 给下面上色
                var potDataBottom =potX+((potY+1)*s._width);
                var iBottom =potDataBottom*4;
                if((s.fontImageData.data[i+3]!=0)&&(s.fontImageData.data[iBottom+3]==0)){
                    s.bitFontImageData.data[iBottom] = r;
                    s.bitFontImageData.data[iBottom+1] = g;
                    s.bitFontImageData.data[iBottom+2] = b;
                    s.bitFontImageData.data[iBottom+3] = a;
                }
            }
        },
        _toShadow:function(r,g,b,a,colorArr){
            var s =this;
            for(var i=0;i<s.fontImageData.data.length;i+=4){
                //当前这个上色 s.fontImageData s.bitFontImageData
                if(s.fontImageData.data[i+3]){
                    s.bitFontImageData.data[i] = colorArr[0];
                    s.bitFontImageData.data[i+1] = colorArr[1];
                    s.bitFontImageData.data[i+2] = colorArr[2];
                    s.bitFontImageData.data[i+3] = s.fontImageData.data[i+3]>100?s.fontImageData.data[i+3]:100;
                }
                //右下点像素位置，取点上色

                var potData = parseInt(i/4);
                var potY = parseInt(potData/s._width);
                var potX = parseInt(potData%s._width);

                //右下点像素位置，取点上色
                var potRb =(potX+1)+((potY+1)*s._width);
                var iRb =potRb*4;
                if((s.fontImageData.data[i+3]!=0)&&(s.fontImageData.data[iRb+3]==0)){
                    s.bitFontImageData.data[iRb] = r;
                    s.bitFontImageData.data[iRb+1] = g;
                    s.bitFontImageData.data[iRb+2] = b;
                    s.bitFontImageData.data[iRb+3] = a;
                }
            }
        }
    }
    return InteractivePNG;
})();
//声明一个全局属性
var interactivePNG = new InteractivePNG();

