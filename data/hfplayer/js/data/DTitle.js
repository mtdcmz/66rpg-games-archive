/**
 * Created by 七夕小雨 on 2014/11/11.
 */

function DTitle(read){
    read.readInt32();
    this.showLog = read.readInt32() != 0;
    this.logoImage = new DFileName(read);
    this.titleImagle = new DFileName(read);
    this.drawTitle = read.readInt32() != 0;
    this.bgm = new DMusicItem(read);
    var length = read.readInt32();
    this.buttons = new Array(length);
    for(var i =0;i<length;i++){
        this.buttons[i] = new DButtonIndex(read);
    }
}