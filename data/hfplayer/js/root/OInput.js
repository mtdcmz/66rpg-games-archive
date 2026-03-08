/**
 * Created by heshang on 2016/4/14.
 */
function OInput(image,viewport){
    ODrawBase.call(this);
    this.x = 0;
    this.y = 0;
    this.width = 50;
    this.height = 40;
    this.image = image;
    this.viewport = viewport;
    this.lineWidth = 0;
    this.focuIn = false;
    this.multiLine = false;
    this.input = null;
    this.texts = "";
    this.fontSize = 23;
    this.fontTop = 5;
    this.tips = "";
    this.fontX = 10;
    this.type = "";
    var canvas = document.getElementById("main_canvas");

    this.createInput = function () {
        if(!this.input){
            this.input = document.createElement("input");
            this.input.style.position = "absolute";
            this.input.type = "text";
            this.input.value = this.texts;
            document.body.appendChild(this.input);
            this.input.focus();
        }
    }
    this.setPos = function () {
        if(this.input && this.focuIn){
            var left =0 ,top = 0;
            this.input.style.zIndex = 99;
            //this.input.style.border = "0 none";
            this.input.style.outline = "none";
            if(isVertical){
                if(isPhone){
                    var inputWidth,inputHieght;
                    inputWidth = this.width/zoom;
                    inputHieght = this.height/zoom;
                    this.input.style.transition = "-webkit-transform";
                    this.input.style.transformOrigin = "left -"+inputWidth;
                    this.input.style.webkitTransform = "rotate(270deg)";
                    left =this.y*(this.zoom_y/zoom) - inputHieght-inputHieght/2-1+canvas.offsetLeft;
                    top =  this.x*(this.zoom_x/zoom) + inputWidth+6+canvas.offsetTop;
                }else{
                    this.input.style.transition = "";
                    this.input.style.webkitTransform = "";
                    left = this.x*(this.zoom_x/zoom)-1+(canvas.offsetLeft);
                    top = this.y*(this.zoom_y/zoom)-1+(canvas.offsetTop);
                }
                this.input.style.left = left + "px";
            }else{
                if(isPhone){
                    var inputWidth,inputHieght;
                    inputWidth = this.width/zoom;
                    inputHieght = this.height/zoom;
                    this.input.style.transition = "-webkit-transform";
                    this.input.style.transformOrigin = "left -"+inputHieght;
                    this.input.style.webkitTransform = "rotate(90deg)";
                    left =this.y*(this.zoom_y/zoom)-1-inputWidth/2+inputHieght/2+(canvas.offsetLeft);
                    top = this.x*(this.zoom_x/zoom)-1+ inputWidth/2-inputHieght/2-2+(canvas.offsetTop);
                    this.input.style.right = left + "px";
                    this.input.style.left="";
                }else{
                    this.input.style.transition = "";
                    this.input.style.webkitTransform = "";
                    left = this.x*(this.zoom_x/zoom)-1+(canvas.offsetLeft);
                    top = this.y*(this.zoom_y/zoom)-1+(canvas.offsetTop);
                    this.input.style.left = left + "px";
                    this.input.style.right="";
                }
            }
            this.input.style.width = this.width/zoom-1 + "px";
            this.input.style.height = this.height/zoom-1 + "px";
            this.input.style.top = top + "px";
        }
    }

    this.losefocus = function () {
        if(this.input){
            if(this.type == "number"){
                if(isInt(this.input.value)){
                    this.texts = this.input.value;
                }else{
                    this.texts = "";
                }
            }
            document.body.removeChild(this.input);
            this.input = null;
        }
    }
    this.drawText = function (g) {
        g.font = this.fontSize+"px 微软雅黑";
        g.fillStyle = "#333333";
        var width = 0;

        var str=this.texts;
        if(str == ""){
            str = this.tips;
            g.fillStyle = "#999b9f";
        }
        var k = str.length;
        for(var i =0;i<k;i++){
            width += g.measureText(str.substr(i,1)).width;
            if(width*zoom > this.width*zoom){
                k =i;
                break;
            }
        }
        g.fillText(str.substr(0,k),this.x+this.fontX,this.y + this.fontSize+this.fontTop);
    }
    this.drawImgBack = function (g) {

    }
    this.drawLineBack = function (g) {
        g.strokeStyle = '#b6b6b6';
        g.fillStyle = '#ffffff';
        g.lineWidth = this.lineWidth;
        //g.strokeRect(this.x,this.y,this.width,this.height);
        g.fillRect(this.x,this.y,this.width,this.height);
        //g.fillRect(this.x,this.y,this.width,this.height);
        //g.stroke();
    }
    this.selected = function () {
        return onTouchX > this.x && onTouchX< this.x + this.width * this.zoom_x
            && onTouchY > this.y && onTouchY<this.y + this.height * this.zoom_y;
    }
    this.isClick = function(){
        if(!this.focuIn){
            if(this.selected() && onClick()){
                this.createInput();
                this.focuIn = true;
                return true;
            }
        }else{
            if(!this.selected()){
                if(onClick()){
                    this.focuIn = false;
                    this.losefocus();
                    return false;
                }
            }
        }
    };

    this.dispose = function () {
        if(this.viewport != null){ //0120 jhy viewport内的sprite移除
            this.viewport.remove(this);
        }else{
            ib.remove(this);
        }
        this.texts = "";
        this.tips = "";
        this.image = null;
    }
    if(this.viewport != null){
        this.viewport.add(this);
        this.viewport.set_Z();
    }else{
        ib.add(this);
        ib.setZ();
    }

    this.update = function (g) {
        g.save();
        if(this.image){
            //this.drawImgBack(g);
        }else if(this.width!=0){
            this.drawLineBack(g);
        }
        if((this.texts!="" || this.tips!="")&& !this.focuIn){
            this.drawText(g);
        }
        g.restore();
        this.isClick();
        this.setPos();
    }
}
function isInt(str){
    var reg = /^(-|\+)?\d+$/ ;
    return reg.test(str);
}
