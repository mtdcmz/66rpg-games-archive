/**
 * Created by 七夕小雨 on 2014/11/11.
 */

function DGameMenu(read){
    read.readInt32();
    this.backImage = new DFileName(read);
    var length = read.readInt32();
    this.buttons = new Array(length);
    for(var i = 0;i<length ;i++){
        this.buttons[i] = new DButtonIndex(read);
    }
}
