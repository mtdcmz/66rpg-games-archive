/**
 * Created by 七夕小雨 on 2014/11/7.
 */

function ODrawBase(){
    this.x = 0;
    this.y = 0;
    this.width = 1;
    this.height = 1;

    this.zoom_x = 1.0;
    this.zoom_y = 1.0;
    this.visible = true;
    this.tag = null;
    this.bitmap = null;
    this.tempOpacity = 255;
    this.g = null;
    this.viewport = null;
    this.objtype = "";

    this.TextHeight = 0;


    this.setXY = function(x,y){
        this.x = x;
        this.y = y;
        return this;
    };

    this.clear = function(){
    };
}