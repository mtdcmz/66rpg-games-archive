/**
 * Created by 七夕小雨 on 2014/11/11.
 */
function DCG(read){
    read.readInt32();
    this.backimage = new DFileName(read);
    this.column = read.readInt32();
    this.spanRow = read.readInt32();
    this.spanCol = read.readInt32();
    this.showMessage = read.readInt32() != 0;
    this.megX = read.readInt32();
    this.megY = read.readInt32();
    this.zoom = read.readInt32();
    this.cgx = read.readInt32();
    this.cgy = read.readInt32();
    this.nopic = new DFileName(read);
    var length = read.readInt32();
    this.cglist = new Array(length);
    for(var i = 0;i<length;i++){
        this.cglist[i] = new DCGItem(read);
    }
    this.viewport = new DViewport(read);
    this.backButton = new DButtonIndex(read);
    this.closeButton = new DButtonIndex(read);
}

function DCGItem(read){
    read.readInt32();
    this.name = read.readStringE();
    this.cgpath = new DFileName(read);
    this.message = read.readStringE();
}