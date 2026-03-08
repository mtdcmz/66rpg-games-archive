/**
 * Created by 七夕小雨 on 2014/11/22.
 */
function DGameSystem(){
    this.autoRun = false;
    this.quickRun = false;
    //this.BgmV  = 100;
    //this.SeV = 100;
    //this.VoiceV = 100;
    //this.BgsV = 100;
    //this.BgmP = "";
    //this.BgsP = "";
    this.vars = new DGameVariables();
    this.varsEx = new DGameVariables();
    this.string = new DGameString();

    //--DSaveFile
    this.replay = new saveReplay();
    this.other = new saveOther();
    this.rwFile = new saveFile();


}