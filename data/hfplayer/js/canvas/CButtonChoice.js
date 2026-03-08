/**
 * Created by 七夕小雨 on 2014/11/17.
 */
function CButtonChoice(){
    this.index =  -1;
    this.usedList = new Array();
    this.waiting = false;
    //用来判断 点击选中的按钮
    var tempArr = new Array();

    this.isFinish = function(){
        return !this.waiting;
    };

    this.setupChoice = function(list){
        if(list == null || list.length <= 0){return;}
        for(var i = 0;i<list.length;i++){
            var data = tv.data.System.Buttons[list[i].index];
            if(data == null) {continue;}
            var image1 = new Image();
            var path = ("Graphics/Button/" + data.image1).toLowerCase().replace(/\\/g,'/');
            if(data.image1.name!=""){
                image1.src = fileListFato(path,'image1 in setupChoice from CButtonChoice.js');
            }
            var image2 = new Image();
            var path2 = ("Graphics/Button/" + data.image2).toLowerCase().replace(/\\/g,'/');
            if(data.image2.name!=""){
                image2.src = fileListFato(path2,'image2 in setupChoice from CButtonChoice.js');
            }
            var b = new OButton(image1,image2,"",null,false,false);
            b.transparent=true;
            b.index = i;
            b.setX(list[i].x);
            b.setY(list[i].y);
            b.setZ(3010 + i * 10);
            b.setVisible(true);
            this.usedList.push(b);
        }
        this.waiting = true;
    };

    this.dispose = function(){
        for(var i = 0;i<this.usedList.length;i++){
            this.usedList[i].dispose();
        }
        this.usedList.length = 0;
    };

    this.update = function(){
        var self = this;
        if(!this.waiting){return;}
        var a = onClick();
        function goNext(){
            if(tempArr.length>0){
                var k=0,z=0;
                for(var i=0;i<tempArr.length;i++){
                    if(tempArr[i].back.z > z){
                        z = tempArr[i].back.z;
                        k = i;
                    }
                }
                self.index = tempArr[k].index;
                self.closeChoice();
                tempArr.length = 0;
            }
            a=false;
        }
        for(var i = 0;i<this.usedList.length;i++){
            this.usedList[i].update();

            this.usedList[i].isClick(a, function (bool,button) {
                if(bool){
                    tempArr.push(button);
                }
                if(i == self.usedList.length-1){
                    goNext();
                }
            },this.usedList[i]);

            //if(this.usedList[i].isClick(a)){
            //if(this.usedList[i].isClick()){
            //    this.index = this.usedList[i].index;
            //    this.closeChoice();
            //    break;
            //    tempArr.push(this.usedList[i]);
            //}
        }

    }

    this.closeChoice = function(){
        this.waiting = false;
        this.dispose();
    }

}