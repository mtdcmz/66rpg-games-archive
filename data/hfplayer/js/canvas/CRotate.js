/**
 * Created by heshang on 2016/5/16.
 */
function CRotate(){
    this.event = null;
    this.origin = 0;
    this.sp;//当前的图片精灵
    this.totalFrams=0;
    this.totalAngle=0;
    this.init = function (e) {
        this.event = e;
        var preRotate = 0;
        this.sp = tv.canvas.GamePictrue[parseInt(this.event.Argv[0])];
        if(this.sp.rotate){
            preRotate = this.sp.tmpRotate;
        }else{
            this.sp.rotate = true;
        }
        //帧数
        if(parseInt(this.event.Argv[1]) ==1){
            this.sp.rotateframes = tv.system.vars.getVar(parseInt(this.event.Argv[2]))/2;
        }else{
            this.sp.rotateframes = parseInt(this.event.Argv[2]/2);
        }
        this.sp.totalFrams = this.sp.rotateframes;
        //角度
        if(parseInt(this.event.Argv[3]) ==1){
            this.sp.endRotate = tv.system.vars.getVar(parseInt(this.event.Argv[4]));
        }else{
            this.sp.endRotate = parseInt(this.event.Argv[4]);
        }
        //起始点
        this.sp.tmpRotate = preRotate;
        //每帧旋转角度
        this.sp.diffRotate = (this.sp.endRotate-this.sp.tmpRotate)/this.sp.rotateframes;
        //是否循环
        if(this.event.Argv[5]==1){
            this.loopRotate = true;
        }else{
            this.loopRotate = false;
        }
        //中心点
        this.sp.origin = parseInt(this.event.Argv[6]);
        if(this.sp.origin == 0){
            //中心点
            this.sp.rotaOriginX = parseFloat(this.sp.width/2);
            this.sp.rotaOriginY = parseFloat(this.sp.height/2);
        }else if(this.sp.origin == 1){
            //左上点
            this.sp.rotaOriginX = 0;
            this.sp.rotaOriginY = 0;

        }else if (this.sp.origin == 10){
            //自定义
            var rotaOrigin = this.event.Argv[7].split(",");
            this.sp.rotaOriginX = parseFloat(rotaOrigin[0]);
            this.sp.rotaOriginY = parseFloat(rotaOrigin[1]);
        }
    };

    this.saveData = function (arr) {
        if(tv.system.rwFile.isCloud){
            for(var i = 0; i<tv.canvas.GamePictrue.length;i++){
                if(tv.canvas.GamePictrue[i].rotate){
                    var sp = tv.canvas.GamePictrue[i];
                    var obj = new Object();
                    obj.haveRotate =1;
                    obj.totalFrams = sp.totalFrams*2;
                    obj.currentFrams = sp.rotateframes*2;
                    obj.RotateX = sp.rotaOriginX;
                    obj.RotateY = sp.rotaOriginY;
                    obj.type = sp.origin;
                    obj.totalAngle = sp.endRotate;
                    obj.currentAngle = parseInt(sp.tmpRotate*100);
                    arr.push(obj);
                }else{
                    var obj = new Object();
                    obj.haveRotate = 0;
                    arr.push(obj);
                }
            }
        }else{
            for(var i = 0; i<tv.canvas.GamePictrue.length;i++){
                if(tv.canvas.GamePictrue[i].rotate){
                    var sp = tv.canvas.GamePictrue[i];
                    var haveRotate =1;
                    arr.push(haveRotate+'|');
                    arr.push(sp.totalFrams+'|');
                    arr.push(sp.rotateframes+'|');
                    arr.push(sp.rotaOriginX+'|');
                    arr.push(sp.rotaOriginY+'|');
                    arr.push(sp.origin+'|');
                    arr.push(sp.endRotate+'|');
                    arr.push(sp.tmpRotate+'|');
                }else{
                    var haveRotate =0;
                    arr.push(haveRotate+'|');
                }
            }
        }
    };
    this.loadData = function(arr){
        if(tv.system.rwFile.isCloud){
            for(var i = 0; i<tv.canvas.GamePictrue.length;i++){
                var sp = tv.canvas.GamePictrue[i];
                if(arr){
                    var obj = arr.shift();
                    if(obj.haveRotate == 1){
                        sp.rotate = true;
                        sp.totalFrams = obj.totalFrams/2;
                        sp.rotateframes = obj.currentFrams/2;
                        sp.rotaOriginX = obj.RotateX;
                        sp.rotaOriginY = obj.RotateY;
                        sp.origin = obj.type;
                        sp.endRotate = obj.totalAngle;
                        sp.tmpRotate = obj.currentAngle/100;
                        sp.diffRotate = (sp.endRotate-sp.tmpRotate)/sp.rotateframes;
                    }else{
                        sp.rotate = false;
                    }
                }
            }
        }else{
            for(var i = 0; i<tv.canvas.GamePictrue.length;i++){
                var sp =tv.canvas.GamePictrue[i];
                if(arr.length>0){
                    var haveRotate =arr.shift();
                    if(parseInt(haveRotate)==1){
                        sp.rotate = true;
                        sp.totalFrams = parseFloat(arr.shift());
                        sp.rotateframes = parseFloat(arr.shift());
                        sp.rotaOriginX = parseFloat(arr.shift());
                        sp.rotaOriginY = parseFloat(arr.shift());
                        sp.origin = parseFloat(arr.shift());
                        sp.endRotate = parseFloat(arr.shift());
                        sp.tmpRotate = parseFloat(arr.shift());
                        sp.diffRotate = (sp.endRotate-sp.tmpRotate)/sp.rotateframes;
                    }else{
                        sp.rotate = false;
                    }
                }

            }
        }
    };
    this.update = function () {
    };
}
var crotate = new CRotate();