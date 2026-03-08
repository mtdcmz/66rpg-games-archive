/**
 * Created by 七夕小雨 on 2014/11/11.
 */



function DHeader(read){
    this.ver = read.readInt32();

    this.GWidth = read.readInt32();
    this.GHeight = read.readInt32();
    this.MaxPicWidth = read.readInt32();
    this.MaxPicHeight = read.readInt32();
    this.guid = read.readString(read.readInt32(),'UTF-8');
    this.title = read.readString(read.readInt32(),'UTF-8');
    this.pver = read.readInt32();
    read.readInt32();
    read.readInt32();

    tv.DataVer = this.ver;
    
    gGameHeight = this.GHeight;
    gGameWidth = this.GWidth;

    //this.GHeight = 540 ;
    //this.GWidth = 960 ;
    //this.guid="5f4549c645416cd6fb2563740eaa1726";
    //this.MaxPicWidth = 1662;
    //this.MaxPicHeight = 1920;
    //this.pver = 60 ;
    //tv.DataVer = 103 ;
    //gGameHeight = this.GHeight;
    //gGameWidth = this.GWidth;
    
  
}