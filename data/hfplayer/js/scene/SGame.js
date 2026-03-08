/**
 * Created by 七夕小雨 on 2014/11/16.
 */

function SGame(){
    this.init = function(){
        tv.CUIFromIndex = -1;
        if(!fastImg){
            fastImg=new OSprite();
            fastImg.z = 3500;
            //fastImg.z=10100;
        }
    }
    this.update = function(){
        if(gLoadAssets.isNeedLoad()){
            return;
        }else{
            tv.inter.update();
            tv.canvas.update();
        }
    }

    //保留，事件里应该有释放场景的调用
    this.dispose = function(){

    }

    //构造
    this.init();
}