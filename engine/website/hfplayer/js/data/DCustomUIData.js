/**
 * Created by 七夕小雨 on 2014/11/11.
 */

function DCustomUIData(read){
    read.readInt32();
    var length = 0;
    length = read.readInt32();
    this.loadEvent = new Array(length);
    for(var i = 0;i<length;i++){
        read.readInt32();
        this.loadEvent[i] = new DEvent(read);
    }
    length = read.readInt32();
    this.afterEvent = new Array(length);
    for(var i = 0;i<length;i++){
        read.readInt32();
        this.afterEvent[i] = new DEvent(read);
    }
    length = read.readInt32();
    this.controls = new Array(length);
    for(var i = 0;i<length;i++){
        this.controls[i] = new DCustomUIItem(read);
    }
    this.showEffect = read.readInt32();
    this.isMouseExit = read.readInt32() != 0;
    this.isKeyExit = read.readInt32() != 0;
}

function DCustomUIItem(read){
    read.readInt32();
    var length = read.readInt32();
    this.event = new Array(length);
    for(var i = 0;i<length;i++)
    {
        read.readInt32();
        this.event[i] = new DEvent(read);
    }
    this.type = read.readInt32();
    this.isUserString = read.readInt32() != 0;
    this.image1 = read.readStringE();
    this.image2 = read.readStringE();
    this.stringIndex = read.readInt32();
    this.isUserVar = read.readInt32() != 0;
    this.x = read.readInt32();
    this.y = read.readInt32();
    this.isUserIndex = read.readInt32() !=0;
    this.index = read.readInt32();
    this.maxIndex = read.readInt32();
    this.color = new OColor(read.readStringE());
}