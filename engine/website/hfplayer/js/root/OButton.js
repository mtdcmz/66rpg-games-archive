/**
 * Created by 七夕小雨 on 2014/11/17.
 */
function OButton(image1,image2,name,view,ndraw2,area){
    this.image = new Array(2);
    this.back = null;
    this.draw1 = null;
    this.draw2 = null;
    this.name = "";
    this.mouseOn = false;
    this.index = 0;
    this.tag = null;
    this.isMoved = false;
    this.isNoUp = false;
    this.view=view;
    this.cTChioce =true;

    //有此属性代表可以进行穿透
    this.transparent=false;

    //是否生命线
    this.isLifeLine=false;
    //--0129 兼容高级ui中 初始没有图片的占位button
    if(image1.length <= 0){
        this.back = new OSprite(null,view);

        this.image[0] = null;
    }else{
        if(image1 instanceof  Image){
            this.image[0] = image1;
        }else{
            this.image[0] = new Image();
            try
            {
                var path = ("Graphics/Button/" + image1).toLowerCase().replace(/\\/g,'/');
                this.image[0].src = fileListFato(path,'image[0] in OButton from OButton.js');
            }
            catch(e){
                console.log("OButton image1 error "+image1);
            }
        }
        this.back = new OSprite(this.image[0],view);
        if(gGameDebug.bmpng){//0309 mpng测试
            if(area){
                gMpngBox.processMpngUrl(this.back,"Button",image1);
            }
        }
        
    }
    if(image2.length <= 0){
        this.image[1] = null;
    }else{
        if(image2 instanceof  Image){
            this.image[1] = image2;

        }else{
            this.image[1] = new Image();
            try
            {
                var path = ("Graphics/Button/" + image2).toLowerCase().replace(/\\/g,'/');
                this.image[1].src = fileListFato(path,'image[1] in in OButton from OButton.js');
            }
            catch(e)
            {
                console.log("OButton image2 error "+image2);
            }
        }
    }

    if(ndraw2){
        this.draw2 = new OSprite(null,view);
    }
    this.name  = name;
    if(this.name.length > 0){
        this.draw1 = new OSprite(null,view);
    }
    this.frontimg = null;//0121 按钮的前置图片
    this.respTranArea = area;//0127 根据像素值来判断是否选中

    this.drawTitle = function(str){
        var self = this;
        if(image1.complete){
            g.font = tv.data.System.FontSize + "px "+ fontName;
            var m = g.measureText(str);
            var w = m.width;
            this.back.getRect();
            this.draw1.drawText(str,(this.back.width - w) / 2,(this.back.height - tv.data.System.FontSize)/2);
        }else{
            if(image1){
                image1.onload = function () {
                    self.back.width = this.width;
                    self.back.height = this.height;
                    g.font = tv.data.System.FontSize + "px "+ fontName;
                    var m = g.measureText(str);
                    var w = m.width;
                    self.back.getRect();
                    self.draw1.drawText(str,(self.back.width - w) / 2,(self.back.height - tv.data.System.FontSize)/2);
                }
            }
        }

    };
    this.setZoom = function (z_x,z_y) {
        if(this.back instanceof OSprite){
            this.back.zoom_x = z_x;
            this.back.zoom_y = z_y;
        }
    }
    this.drawTitleEx = function(str,x,y){
        g.font = tv.data.System.FontSize + "px "+ fontName;
        var m = g.measureText(str);
        var w = m.width;
        this.back.getRect();
        this.draw1.drawText(str,x,(this.back.height - tv.data.System.FontSize)/2);
    };
    this.drawTitleEx2 = function (str,x,y,size,color) {
        this.draw1.drawLineTxt(str,x,y,color,size);
        //this.draw1.drawText(str,x,(this.back.height - tv.data.System.FontSize)/2);
    }
    if(this.draw1 != null){
        this.drawTitle(this.name);
    }

    this.SetFade = function(opacity ,fr){
        if(this.draw1 != null) this.draw1.FadeTo(opacity, fr);
        if(this.draw2 != null) this.draw2.FadeTo(opacity, fr);
        if(this.frontimg != null){this.frontimg.FadeTo(opacity, fr);}
        this.back.FadeTo(opacity, fr);
    }

    this.dispose = function(){
        if(this.draw1 != null){this.draw1.dispose();}
        if(this.draw2 != null){this.draw2.dispose();}
        if(this.frontimg != null){this.frontimg.dispose();}
        this.image[0] = null;
        this.image[1] = null;
        this.back.dispose();
    };

    this.isSelected = function(){
        return this.mouseOn;
    };

    this.isClick = function(a,callBack,button){
        var bClick;
        var self = this;
        function setClick(bool){
            bClick = bool;
            if(bClick){
                pTime=30;
                var path = "";
                var vol = 0;
                //0210 button的tag比较乱 先将back统一了 其它根据测试结果再看
                if(self.tag == "Back"){
                    path = ("Audio/SE/" + tv.data.System.SECancel.FileName.name).toLowerCase().replace(/\\/g,'/');
                    vol = tv.data.System.SECancel.Volume;
                }else{
                    path = ("Audio/SE/" + tv.data.System.SEClick.FileName.name).toLowerCase().replace(/\\/g,'/');
                    vol = tv.data.System.SEClick.Volume;
                }
                oadioPlusFlow(path);
                if(fileList[path] != null){
                    if(isIphone()){
                        oaudio.playSE(fileListFato(path,'oaudio in isClick from OButton.js') , vol );
                    }else{
                        oaudio.playSE(fileListFato(path,'oaudio in isClick from OButton.js') , vol );
                    }
                }else{
                    //console.log("OButton:isClick: Audio url is null");
                }
            }
            return bClick;
        }

        if(this.transparent){
            this.back.respTranArea(a, function (bool) {
                callBack&&callBack(setClick(bool),button);
            }) ;
        }else{
            bClick = this.back.isSelected() && onClick();

            setClick(bClick);
            return bClick;
        }
    };

    this.isClickMove = function(){
        //this.isMoved = true;
        //return (this.respTranArea ? this.back.respTranArea():this.back.isSelected()) && onClick();
    };

    this.isDown = function(a){
        //return (this.respTranArea ? this.back.respTranArea():this.back.isSelected()) && onTouchDown;
        //return this.transparent && this.back.respTranArea() && a;
    };

    this.cancelSelect = function(){
        if(!this.mouseOn){return;}
        this.mouseOn = false;
        var img = this.image[0];
        if(img != this.back.getBitmap()){
            this.back.setBitmap(img);
        }
    };

    this.setX = function(x){
        this.back.x = x;
        if(this.draw1 != null){this.draw1.x = x;}
        if(this.draw2 != null){this.draw2.x = x;}
    };
    this.SlideTo = function (eX,eY,frames) {
        if(this.back){
            this.back.SlideTo(eX,eY,frames);
        }
        if(this.draw1){
            this.draw1.SlideTo(eX,eY,frames);
        }
        if(this.draw2){
            this.draw2.SlideTo(eX,eY,frames);
        }
    }

    this.setY = function(y){
        this.back.y = y;
        if(this.draw1 != null){this.draw1.y = y;}
        if(this.draw2 != null){this.draw2.y = y;}
    };

    this.setZ = function(z){
        this.back.setZ(z);
        if(this.draw1 != null){this.draw1.setZ(z + 1);}
        if(this.draw2 != null){this.draw2.setZ(z + 2);}
    };

    this.setVisible = function(v){
        this.back.visible = v;
        if(this.draw1 != null){this.draw1.visible = v;}
        if(this.draw2 != null){this.draw2.visible = v;}
        if(this.frontimg != null){this.frontimg.visible = v;}
    };

    this.setOpactiy = function(o){
        this.back.opacity = o;
        if(this.draw1 != null){this.draw1.opacity = o;}
        if(this.draw2 != null){this.draw2.opacity = o;}
        if(this.frontimg != null){this.frontimg.opacity = o;}
    };

    this.width = function(){
        return this.back.width;
    };

    this.height = function(){
        return this.back.height;
    };
    this.getStretHeight = function () {
        return this.back.height;
    }

    this.getX = function () {
        return this.back.x;
    }

    this.getY = function () {
        return this.back.y;
    }
    this.setBorder = function(lineWidth,color){
        this.back.drawBorder(lineWidth,color);
    }
    this.clearBorder = function () {
        this.back.clearBorder();
    }
    this.update = function(){
        this.back.getRect();
        if(this.transparent){
            this.mouseOn = this.isMoved || this.back.respTranAreaMove();
        }else{
            this.mouseOn = (this.isMoved || (this.respTranArea ? this.back.respTranArea():this.back.isSelected()))&& onTouchDown;
        }
        if(!this.back.visible){return false;}
        var img = this.image[this.mouseOn ? 1 : 0];
        if(img != this.back.getBitmap() && img != null){ //0129
            this.back.setBitmap(img);

            if(img == this.image[1] && this.isMoved != true)
            {
                var path = ("Audio/SE/" + tv.data.System.SEMove.FileName.name).toLowerCase().replace(/\\/g,'/');
                if(fileList[path] != null){
                    if(isIphone()){
                        oaudio.playSE(fileListFato(path,'oaudio in update from OButton.js')  , tv.data.System.SEMove.Volume );
                    }else{
                        oaudio.playSE(fileListFato(path,'oaudio in update from OButton.js') , tv.data.System.SEMove.Volume );
                    }
                }else{
                    console.log("OButton:update: Audio url is null");
                }
                oadioPlusFlow(path);
            }
        }
        return this.mouseOn;
    }

    this.setFrontImg = function(_img,offx,offy){
        if(_img == null) return;

        if(_img instanceof Image){
            if(this.frontimg){
                this.frontimg.dispose();
            }
            if(view != null){
                this.frontimg = new OSprite(_img,view);
            }else{
                this.frontimg = new OSprite(_img,null);
            }
            this.frontimg.x = this.back.x + offx;
            this.frontimg.y = this.back.y + offy;
            //this.frontimg.z = this.back.z + 1;
            this.frontimg.setZ(this.back.z+1);
        }
    }
    this.setFrontImgPosition=function(offx,offy)
    {
        this.frontimg.x = this.back.x + offx;
        this.frontimg.y = this.back.y + offy;
    }

    this.setBitmap = function(_img1,_img2){
        if(_img1.length <= 0 || _img2.length <= 0){
            if(_img1.length <= 0 && _img2.length <= 0){
                console.log("OButton<<<setBitmap<<<img1 img2 is null");
                this.image[0] = null;
                this.image[1] = null;
                this.back.width = this.back.height = 1;
                this.setVisible(false);
            }else if(_img1.length <= 0){
                console.log("OButton<<<setBitmap<<<img1 is null");
                this.image[0] = new Image();
                var path = ("Graphics/Button/" + _img2).toLowerCase().replace(/\\/g,'/');
                this.image[0].src = fileListFato(path,'image[0] in setBitmap from OButton.js');

                this.image[1] = new Image();
                this.image[1].src = fileListFato(path,'image[1] in setBitmap from OButton.js');
                this.setVisible(true);
            } else if(_img2.length <= 0){
                console.log("OButton<<<setBitmap<<<img2 is null");
                this.image[0] = new Image();
                var path = ("Graphics/Button/" + _img1).toLowerCase().replace(/\\/g,'/');
                this.image[0].src = fileListFato(path,'image[0] in setBitmap from OButton.js');
                this.image[1] = new Image();
                this.image[1].src = fileListFato(path,'image[0] in setBitmap from OButton.js');
                this.setVisible(true);
            }
        }else{
            if(_img1 instanceof  Image){
                this.image[0] = _img1;
                this.image[1] = _img2;
            }else{
                this.image[0] = new Image();
                var path = ("Graphics/Button/" + _img1).toLowerCase().replace(/\\/g,'/');
                this.image[0].src = fileListFato(path,'image[0] in setBitmap from OButton.js');
                this.image[1] = new Image();
                this.image[1].src = fileListFato(path,'image[1] in setBitmap from OButton.js');

            }
            this.setVisible(true);
        }
        if(this.image[0]&&this.image[1]){
            if(this.back.image != this.image[0]){
                this.back.setBitmap(this.image[0]);
            }
        }

        this.isMoved = false;
    }
}