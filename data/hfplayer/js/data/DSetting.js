/**
 * Created by 七夕小雨 on 2014/11/11.
 */

function DSetting(read){
    read.readInt32();
    this.backimage = new DFileName(read);
    this.barNone = new DFileName(read);
    this.barMove = new DFileName(read);
    this.BgmX = read.readInt32();
    this.BgmY = read.readInt32();
    this.SeX = read.readInt32();
    this.SeY = read.readInt32();
    this.VoiceX = read.readInt32();
    this.VoiceY = read.readInt32();
    this.ShowFull = read.readInt32() != 0;
    this.SHowAuto = read.readInt32() != 0;
    this.ShowBGM = read.readInt32() != 0;
    this.ShowSE = read.readInt32() != 0;
    this.ShowVoice = read.readInt32() != 0;
    this.ShowTitle = read.readInt32() != 0;
    this.closeButton = new DButtonIndex(read);
    this.fullButton = new DButtonIndex(read);
    this.winButton = new DButtonIndex(read);
    this.AutoOn = new DButtonIndex(read);
    this.AutoOff = new DButtonIndex(read);
    this.TitleButton = new DButtonIndex(read);
}