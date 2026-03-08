/**
 * Created by 七夕小雨 on 2014/11/11.
 */

function DSaveData(read){
    read.readInt32();
    this.showMapName = read.readInt32() != 0;
    this.showDate = read.readInt32() != 0;
    this.backimage = new DFileName(read);
    this.max = read.readInt32();
    this.column = read.readInt32();
    this.spanRow = read.readInt32();
    this.spanCol = read.readInt32();
    this.showMinPic = read.readInt32()!=0;
    this.nameX = read.readInt32();
    this.nameY = read.readInt32();
    this.dateX = read.readInt32();
    this.dateY = read.readInt32();
    this.picX = read.readInt32();
    this.picY = read.readInt32();
    this.zoom = read.readInt32();
this.viewport = new DViewport(read);
this.backButton = new DButtonIndex(read);
this.closeButton = new DButtonIndex(read);
}