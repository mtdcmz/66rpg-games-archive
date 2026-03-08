/**
 * Created by Administrator on 2016/8/9.
 */
function OListView(x,y,w,h){
    this.isMove = false;
    this.viewPort;
    this.itemY;
    this.focuIn = false;

    var isUpdate = false;
    var endPos = 0;
    var allItems;

    //listview超出滑动范围参数
    var desHeight = 0;
    var isStart = false;
    var isStartE = false;
    var speedInit = 30;//递减的常量
    var speed = speedInit;//

    //缓动listView 相关参数
    var frameI = 0;//计算按下抬起的帧速率
    //记录两个y值
    var ovy = 0,
        ovy1 = 0;
    //缓动开关
    var isSwide = false;
    //按下抬起距离
    var distance = 0;
    //缓动速度
    var swideSpeed = 0;


    this.init = function () {
        this.viewPort = new OViewport(x,y,w,h);
        this.itemY = 0;
        allItems = new Array();
        desHeight = parseInt(h/3);
    }
    /*设置单个项*/
    this.setItem = function (item) {
        allItems.push(item);
        item.itemY = this.itemY;
        for(var i = 0;i<item.item.length;i++){
            item.item[i].y+=this.itemY;
        }
        this.itemY+=item.height;
        endPos+=item.height;
        //控制是否滚动
        if(endPos - this.viewPort.height>0 && !isUpdate){
            isUpdate = true;
        }
    }
    this.setListHeight = function (height) {
        endPos = height;
        //isSwide = false;
        if(endPos - this.viewPort.height>0 && !isUpdate){
            isUpdate = true;
        }
    }
    this.setEndPos= function (oy) {
        this.viewPort.oy = -oy+this.viewPort.height;
    }
    this.setZ = function (z) {
        this.viewPort.SetZ(z)
    }
    /*设置所有的子项  单列*/
    this.setAllItem = function (allItem) {
        allItems = allItem;
        if(allItems){
            for(var i = 0;i<allItems.length;i++){
                if(allItems[i]){
                    endPos+=allItems[i].height;
                }
            }
        }
        //控制是否滚动
        if(endPos - this.viewPort.height>0 && !isUpdate){
            isUpdate = true;
        }
    }
    /*选中*/
    this.selected = function () {
        return onTouchDX>x && onTouchDX<x+w && onTouchDY>y && onTouchDY<y+h;
    }
    /*销毁*/
    this.dispose = function () {
        if(allItems){
            for(var i = 0;i<allItems.length;i++){
                if(allItems[i]){
                    allItems[i].dispose();
                }
            }
        }
        allItems.length = 0;
        if(this.viewPort){
            this.viewPort.dispose();
            this.viewPort = null;
        }
        sb.remove(this);
    }
    sb.add(this);

    this.updateMove = function () {
        if(isUpdate){
            if(onTouchDown && this.selected() && !this.focuIn){
                this.focuIn = true;
                ovy = parseInt(onTouchY);
                isSwide = false;
            }
            //获取到了焦点后滑动
            if(this.focuIn){
                var pos = parseInt(this.viewPort.oy - (onTouchDY - onTouchY));
                this.viewPort.oy = pos;
                if(this.viewPort.oy > desHeight ){
                    this.viewPort.oy = desHeight;
                }
                if(this.viewPort.oy <  ((endPos-this.viewPort.height+desHeight) * -1)){
                    this.viewPort.oy = (endPos-this.viewPort.height+desHeight) * -1;
                }

                if(this.viewPort.oy>0){
                    isStart = true;
                }else{
                    isStart = false;
                }
                if(this.viewPort.oy <  ((endPos-this.viewPort.height) * -1)){
                    isStartE = true;
                }else{
                    isStartE = false;
                }
                onTouchDY = onTouchY;
            }else{
                if(isStart){
                    speed = parseInt(this.viewPort.oy/desHeight*20);
                    if(this.viewPort.oy > 0 ){
                        if(speed < 2){
                            speed = 2;
                        }
                        this.viewPort.oy -= speed;
                    }else{
                        this.viewPort.oy = 0;
                        speed = speedInit;
                        isStart = false;
                    }
                }
                if(isStartE){
                    speed = parseInt(Math.abs(endPos-this.viewPort.height+this.viewPort.oy)/desHeight*20);
                    if(this.viewPort.oy <  ((endPos-this.viewPort.height) * -1)){
                        if(speed < 2){
                            speed = 2;
                        }
                        this.viewPort.oy += speed;
                        isStartE = true;
                    }else{
                        this.viewPort.oy = ((endPos-this.viewPort.height) * -1);
                        speed = speedInit;
                        isStartE = false;
                    }
                }
            }
            if(onTouchDown && this.focuIn){
                frameI++;
            }
            //释放焦点
            if(onTouchUp && this.focuIn){
                this.focuIn = false;
                //console.log(frameI);
                if(frameI <= 5){
                    ovy1 = parseInt(onTouchY);
                    distance = ovy - ovy1;
                    swideSpeed = Math.abs(distance);
                    isSwide = true;
                }
                frameI = 0;
            }
            if(isSwide && !this.focuIn){
                if(distance > 0){
                    this.viewPort.oy -= swideSpeed;
                }else if(distance < 0){
                    this.viewPort.oy += swideSpeed;
                }
                if(this.viewPort.oy>0){
                    isSwide = false;
                    this.viewPort.oy=0;
                    return;
                }
                if(this.viewPort.oy < ((endPos-this.viewPort.height) * -1)){
                    isSwide = false;
                    this.viewPort.oy = ((endPos-this.viewPort.height) * -1);
                    return;
                }
                if(swideSpeed>1){
                    swideSpeed /= 1.2;
                }else{
                    isSwide = false;
                }
            }

            if(onTouchMove || isSwide){
                this.isMove = true;
            }else{
                this.isMove = false;
            }
            //console.log(this.isMove);
            //if(onTouchMove || isSwide){
            //    //console.log(this.viewPort.oy);
            //    for(var i=0;i<allItems.length;i++){
            //        console.log(allItems[i]);
            //    }
            //}
        }
    }
    /*清空所有的item和viewPort的高度*/
    this.clearItem = function () {
        if(allItems){
            for(var i = 0;i<allItems.length;i++){
                if(allItems[i]){
                    allItems[i].dispose();
                }
            }
        }
        allItems.length = 0;
        endPos = 0;
    }
    this.update = function () {
        this.updateMove();
    }
    this.init();
}