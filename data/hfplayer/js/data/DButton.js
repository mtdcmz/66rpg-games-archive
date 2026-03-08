/**
 * Created by 七夕小雨 on 2014/11/11.
 */

function DButton(read){
    read.readInt32();
    this.name = read.readStringE();
    this.image1 = new DFileName(read);
    this.image2 = new DFileName(read);
    this.x = read.readInt32();
    this.y = read.readInt32();
}
