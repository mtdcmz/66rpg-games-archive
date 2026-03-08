/**
 * Created by Administrator on 2016/7/28.
 */
function BitmapFont(read){
    var self = this;
    this.fontBitmapData;
    this.blankSpaceW;
    this.count;
    this.bitMapFontSize;
    this.bitMapArr = {};
    this.bitMapDataArr = {};
    this.init = function (callBack) {
        this.fontBitmapData =new DBitmapFontData(function (read) {
            var _self = this;
            var timestampInit = 0;
            var timestampEnd = 0;
            var fontImageBox = [];
            if(_self.rows&&_self.cols&&_self.BitmapPicName){
                //一页有多少字
                var nowPageTotail = Math.ceil(_self.count/(_self.rows*_self.cols));
                timestampInit = new Date().getTime();
                for(var i =0;i<nowPageTotail;i++){
                    var path3str = 'font/'+_self.BitmapPicName+'$'+(i+1)+'.png';
                    if(fileList[path3str.toLowerCase()]){
                        //给个时间戳
                        var path3 = fileList[path3str.toLowerCase()].url();
                        var oImg =new Image();
                        oImg.crossOrigin = "";
                        oImg.src = path3;
                        oImg.name = i;
                        oImg.onload = function(){
                            fontImageBox[parseInt(this.name)] = this;
                            goLoad();
                        };
                    }
                }
            }
            function goLoad(){
                var k = 0;
                for(var i=0;i<fontImageBox.length;i++){
                    if(fontImageBox[i]){
                        k++;
                    }
                }
                if(k == nowPageTotail){
                    //timestampEnd = new Date().getTime();
                    goLoadNext();
                }
            }
            function goLoadNext(){
                self.bitMapArr["image"] = fontImageBox;
                for(var i=0;i<_self.count;i++){
                    if(read){
                        var Index = read.readInt32();
                        var Width = read.readInt32();
                        var Height = read.readInt32();
                        var Key =read.readUCS2String(1,true);
                        if(Key == " "){
                            self.blankSpaceW = Width;
                        }
                        if(Width <= 0){
                            Width =  _self.maxW;
                        }
                        // 当前的页数
                        var nowPage = Math.floor(Index/(_self.rows*_self.cols));
                        //这个字的坐标  x;
                        var x = Index%_self.cols*_self.maxW;
                        var y = (parseInt(Index/_self.cols)-_self.rows*nowPage)*_self.maxH;
                        //这个字的坐标  y;
                        //self.bitMapArr[encodeURI(Key)] = [nowPage,x,y,Width,Height];
                        var color = tv.data.System.FontTalkColor.getBitmapColor();
                        self.bitMapDataArr[encodeURI(Key)] = [nowPage,x,y,Width,Height];
                        //interactivePNG._drawBitmapColor(encodeURI(Key),self.bitMapArr["image"][nowPage],x,y,Width,Height,color, function (key,img) {
                        //    //console.log(img);
                        //    self.bitMapArr[key] = img;
                        //});
                    }
                }
                callBack();
            }
        });
    }
    this.findBitmapTxt = function (key,color) {
        try{
            var sp = new OSprite(null,null);
            //sp.z = 3100;
            sp.width = self.bitMapDataArr[encodeURI(key)][3];
            sp.height = self.bitMapDataArr[encodeURI(key)][4];
            g.font = tv.data.System.FontSize + "px 微软雅黑";
            var width = g.measureText(key).width;
            var x = 0;
            if(width< sp.width){
                x = (sp.width - width)/2;
            }else if(width > sp.width){
                sp.zoom_x = sp.width/width;
                //sp.zoom_x = .5;
            }
            sp.drawLineTxt(key,x,0,color, tv.data.System.FontSize);
            return sp;
        }catch(e){
            var sp = new OSprite(null,null);
            //sp.drawLineTxt(key,x,0,color, tv.data.System.FontSize);
            return sp;
        }
        //if(color){
        //    var image = self.bitMapArr[encodeURI(key)];
        //    var spTxt = new OSprite(null,null);
        //    spTxt.z = 3100;
        //    spTxt.width = image.width;
        //    spTxt.height = image.width;
        //    var data = self.bitMapDataArr[encodeURI(key)];
        //    interactivePNG._drawBitmapColor(encodeURI(key),self.bitMapArr["image"][data[0]],data[1],data[2],data[3],data[4],color, function (img) {
        //        spTxt.setBitmap(img);
        //    });
        //    return spTxt;
        //}else{
        //    var image = new Image();
        //    image.src = self.bitMapArr[encodeURI(key)];
        //    var spTxt = new OSprite(image,null);
        //    spTxt.width = self.bitMapDataArr[encodeURI(key)][3];
        //    spTxt.height = self.bitMapDataArr[encodeURI(key)][4];
        //    spTxt.z = 3100;
        //    return spTxt;
        //}
    }
}
var bitmapFont = new BitmapFont();