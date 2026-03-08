/**
 * Created by 七夕小雨 on 2014/11/11.
 */
function DFileName(read){
    read.readInt32();
    this.From = read.readInt32();
    this.name = read.readStringE();
    this.toString = function(){
        return this.name;
    }
    this.IsNil = function(){
        return this.name.length <= 0;
    }
}