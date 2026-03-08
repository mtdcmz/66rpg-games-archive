/**
 * Created by 七夕小雨 on 2014/11/7.
 */

function OViewport(x,y,width,height){
    ODrawBase.call(this);
    var self = this;
    this.x = x;
    this.y = y;
    this.ox = 0;
    this.oy = 0;
    this.width = width;
    this.height = height;

    this.list = new Array();

    this.tmpOX = 0;
    this.tmpOY = 0;
    this.endOX = 0;
    this.endOY = 0;
    this.diffOX = 0;
    this.diffOY = 0;
    this.OFrames = -1;
    this.scrollY = false;

    this.scuiFlagBar = false;

    this.objtype = "viewport";

    sb.add(this);

    this.remove = function(o){
        var index = this.list.indexOf(o);
        if (index > -1) {
            this.list.splice(index, 1);
        }
    };

    this.dispose = function(){
        sb.remove(this);
    };

    this.SetZ = function(z){
        this.z = z;
        sb.setZ();
        return this;
    };

    this.add = function(s){
        this.list.push(s);
        this.set_Z();
    }

    this.getSize = function(){
        var length = 0;
        for(var i = 0;i<this.list;i++){
            if(this.list[i].bitmap != null){
                length += 1;
            }
        }
        return length;
    };

    this.set_Z = function(){
        var temps = null;
        for(var i = 0;i<this.list.length - 1;i++){
            for(var j = 0;j<this.list.length - 1 - i;j++){
                if(this.list[j].z > this.list[j+1].z){
                    temps = this.list[j];
                    this.list[j] = this.list[j+1];
                    this.list[j+1] = temps;
                }
            }
        }
    };
    this.slideY = function(){
        if(this.scrollY){
            if(this.OFrames>0){
                this.OFrames--;
                this.tmpOY=this.tmpOY+this.diffOY;
                this.oy=this.tmpOY;
            }else if(this.OFrames == 0){
                this.oy = this.endOY;
                this.scrollY = false;
            }
        }
    };
    this.update = function(g){
        g.save();
        g.beginPath();
        g.lineTo(this.x,this.y);
        g.lineTo(this.x + this.width,this.y);
        g.lineTo(this.x+this.width,this.y+this.height);
        g.lineTo(this.x,this.y+this.height);
        g.closePath();
        g.clip();
        for(var i = 0;i<this.list.length;i++){
            this.list[i].update(g);
        }
        g.restore();
        this.slideY();
    }

    this.isIn = function(){
        var x = parseInt(this.x * tv.zoomScene);
        var y = parseInt(this.y * tv.zoomScene);
        var right = x + parseInt(width * tv.zoomScene);
        var bottow = y + parseInt(height * tv.zoomScene);
        return onTouchX >= x && onTouchX <= right && onTouchY >= y && onTouchY <= bottow;
    }
}