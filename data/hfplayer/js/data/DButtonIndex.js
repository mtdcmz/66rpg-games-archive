/**
 * Created by 七夕小雨 on 2014/11/11.
 */

function DButtonIndex(read){
    this.index = 0;
    this.x = 0;
    this.y = 0;
    if(read instanceof DataStream){
        read.readInt32();
        this.index= read.readInt32();
        this.x = read.readInt32();
        this.y = read.readInt32();
    }else{
        this.index = parseInt(read[0]);
        this.x = parseInt(read[1]);
        this.y = parseInt(read[2]);
    }

}