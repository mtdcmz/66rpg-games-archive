/**
 * Created by 七夕小雨 on 2014/11/11.
 */

function DStory(read){
    this.Name = read.readString(read.readInt32(),'UTF-8');
    this.ID = read.readInt32();
    var event_num = read.readInt32();
    this.events = new Array(event_num);
    for(var i = 0;i<event_num;i++){
        read.readInt32();
        this.events[i] = new DEvent(read);
    }
}