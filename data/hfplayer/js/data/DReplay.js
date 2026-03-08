/**
 * Created by 七夕小雨 on 2014/11/11.
 */
function DReplay(read){
    read.readInt32();
    this.backimage = new DFileName(read);
    this.closeButton = new DButtonIndex(read);
    this.viewport = new DViewport(read);
}