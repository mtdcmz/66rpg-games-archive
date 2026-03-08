/**
 * Created by 七夕小雨 on 2014/11/11.
 */

function OColor(r,g,b,a){
    this.R = 0;
    this.G = 0;
    this.B = 0;
    this.A = 255;
    if(g == null){
        a = r.split(',');
        if(a.length == 3){
            this.R = parseInt(a[0]);
            this.G = parseInt(a[1]);
            this.B = parseInt(a[2]);
            this.A = 255;
        }else if(a.length == 4){
            this.R = parseInt(a[0]);
            this.G = parseInt(a[1]);
            this.B = parseInt(a[2]);
            this.A = parseInt(a[3]);
        }
    }else if(a == null){
        this.R = r;
        this.G = g;
        this.B = b;
        this.A = 255;
    }else{
        this.R = r;
        this.G = g;
        this.B = b;
        this.A = a;
    }

    this.getColor = function(){
        return "rgba("+this.R + ","+this.G + "," + this.B + "," + this.A +")";
    };
    this.getBitmapColor =function(){
        return [this.R,this.G,this.B];
    }
}