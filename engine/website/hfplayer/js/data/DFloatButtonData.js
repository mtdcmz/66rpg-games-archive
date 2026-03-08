/**
 * Created by heshang on 2015/11/9.
 */

function DFloatButtonData(read){
    //read.readInt32();
    var length = 0;
    length = read.readInt32();
    this.event=new Array(length);
    for(var i = 0;i<length;i++){
        read.readInt32();
        this.event[i] = new DEvent(read);
    }
    this.x=read.readInt32();
    this.y=read.readInt32();
    this.name=read.readStringE();
    length=read.readInt32();
    this.DFloatItem=new Array(length);
    for(var i=0;i<length;i++){
        this.DFloatItem[i]=new DFloatButtonElementData(read);
    }
}
function DFloatButtonElementData(read){
    this.type=read.readInt32();
    this.x=read.readInt32();
    this.y=read.readInt32();
    this.image = read.readStringE();
    this.isUserString=read.readInt32()!=0;
    this.indexOfStr=read.readInt32();
    this.stringIndex=read.readInt32();
    this.varIndex=read.readInt32();
    this.color = new OColor(read.readStringE());
}