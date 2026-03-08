/**
 * Created by 七夕小雨 on 2014/11/11.
 */


function DMusicItem(read){
    read.readInt32();
    this.FileName = new DFileName(read);
    this.Volume = read.readInt32();
}