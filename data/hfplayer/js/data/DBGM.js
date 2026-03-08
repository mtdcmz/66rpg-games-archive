/**
 * Created by 七夕小雨 on 2014/11/11.
 */
function DBGM(read){
    read.readInt32();
    this.backimage = new DFileName(read);
    this.column = read.readInt32();
    this.spanRow = read.readInt32();
    this.spanCol = read.readInt32();
    this.showPic = read.readInt32() != 0;
    this.showMsg = read.readInt32() != 0;
    this.px = read.readInt32();
    this.py = read.readInt32();
    this.mx = read.readInt32();
    this.my = read.readInt32();
    this.nx = read.readInt32();
    this.ny = read.readInt32();
    this.noName = read.readStringE();
    this.noPic = new DFileName(read);
    var length = read.readInt32();
    this.bgmList = new Array(length);
    for(var i = 0;i<length;i++){
        this.bgmList[i] = new DBGMItem(read);
    }
    this.viewport = new DViewport(read);
    this.selectButton = new DButtonIndex(read);
    this.closeButton = new DButtonIndex(read);
}

function DBGMItem(read){
    read.readInt32();
    this.name = read.readStringE();
    this.bgmPath = new DFileName(read);
    this.picPath = new DFileName(read);
    this.message = read.readStringE();
}