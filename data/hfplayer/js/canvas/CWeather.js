/**
 * Created by heshang on 2016/5/16.
 */
function CWeather(type){
    var spArr;
    var speed = 30;
    this.init = function () {
        switch (type){
            case 1://¹Î·ç
                speed=30;
                this.windInit();
                break;
            case 2://ÏÂÓê
                speed=40;
                this.rainInit();
                break;
            case 3://ÏÂÑ©
                speed=8;
                this.snowInit();
                break;
        }
    };
    this.rainInit = function () {
        spArr = new Array(30);
        for(var i=0;i<spArr.length;i++){
            spArr[i] = new OSprite();
            spArr[i].isDrawRain = true;
            spArr[i].lineHeight=50;
            spArr[i].setZ(6000);
            spArr[i].x=Math.floor(Math.random()*gGameWidth+1);
            spArr[i].y=Math.floor(Math.random()*gGameHeight+1);
            spArr[i].isDrawRain =true;
            spArr[i].rainSpeed = Math.floor(Math.random()*(speed-5)+speed);
            spArr[i].opacity = 160;
        }
    }
    this.windInit = function () {
        spArr = new Array(30);
        for(var i=0;i<spArr.length;i++){
            spArr[i] = new OSprite();
            spArr[i].isDrawRain = true;
            spArr[i].lineHeight=100;
            spArr[i].setZ(6000);
            spArr[i].rotate = 22.5;
            spArr[i].rainSpeed = Math.floor(Math.random()*(speed-5)+speed);
            spArr[i].x=Math.floor(Math.random()*(gGameWidth+gGameWidth/2)+1 );
            spArr[i].y=Math.floor(Math.random()*gGameHeight+1);
            spArr[i].isDrawInit =true;
            spArr[i].opacity = 160;
        }
    }
    this.snowInit = function () {
        spArr = new Array(30);
        for(var i=0;i<spArr.length;i++){
            spArr[i] = new OSprite();
            spArr[i].isDrawSnow = true;
            spArr[i].lineHeight=Math.floor(Math.random()*(2)+4 );;
            spArr[i].setZ(6000);
            spArr[i].x=Math.floor(Math.random()*gGameWidth+1);
            spArr[i].y=Math.floor(Math.random()*gGameHeight+1);
            spArr[i].isDrawRain =true;
            spArr[i].rainSpeed = Math.floor(Math.random()*(speed-5)+speed);
            spArr[i].opacity = 160;
        }
    }
    this.saveData = function () {
        return type;
    }
    this.update = function () {
            if(spArr){
                for(var i=0;i<spArr.length;i++){
                    if(spArr[i]){
                        spArr[i].y+=spArr[i].rainSpeed;
                        if(type == 2){
                        }else if(type == 3){
                            if(i % 4 == 0){
                                spArr[i].x-=3;
                            }else{
                                spArr[i].x+=1;
                            }
                        }else if(type == 1){
                            spArr[i].x-=spArr[i].rainSpeed/2;
                        }
                        if(type!=1) {
                            if(spArr[i].y>gGameHeight){
                                spArr[i].x=Math.floor(Math.random()*gGameWidth+1);
                                spArr[i].y = -10;
                            }
                        }else {
                            if (spArr[i].y > gGameHeight) {
                                //spArr[i].x = Math.floor(Math.random() * gGameWidth + 1);
                                spArr[i].x=Math.floor(Math.random()*(gGameWidth+gGameWidth/2)+1 );
                                spArr[i].y = -10;
                            }
                        }
                    }
                }
            }
    };
    this.dispose = function () {
        for(var i=0;i<spArr.length;i++){
            if(spArr[i]){
                spArr[i].isDrawRain = false;
                spArr[i].dispose();
                spArr[i] = null;
            }
        }
        spArr=null;
    }
    this.init();
}