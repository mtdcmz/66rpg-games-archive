/**
 * Created by 七夕小雨 on 2014/11/11.
 */
function DViewport(read){
    read.readInt32();
    this.x = read.readInt32();
    this.y = read.readInt32();
    this.width = read.readInt32();
    this.height = read.readInt32();
}