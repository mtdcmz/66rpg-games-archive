/**
 * Created by 七夕小雨 on 2014/11/11.
 */


function DMessageBox(read){
    read.readInt32();
    this.FaceStyle = read.readInt32();
    this.ChoiceButtonIndex = read.readInt32();
    this.Talk = new TalkWin(read);
    this.Name = new NameWin(read);

    this.faceInMessageBox = function(){
        return this.FaceStyle == 1;
    }
}

function TalkWin(read){
    read.readInt32();
    this.backX = read.readInt32();
    this.backY = read.readInt32();
    this.backimage = new DFileName(read);
    this.FaceBorderImage = new DFileName(read);
    this.FaceBorderX = read.readInt32();
    this.FaceBorderY = read.readInt32();
    this.textX = read.readInt32();
    read.readInt32();
    this.textY = read.readInt32();
    read.readInt32();
    var length = read.readInt32();
    this.buttons = new Array(length);
    for(var i = 0;i<length;i++){
        this.buttons[i] = new DButtonIndex(read);
    }
}

function NameWin(read){
    read.readInt32();
    this.backX = read.readInt32();
    this.backY = read.readInt32();
    this.backimage = new DFileName(read);
    this.isCenter = read.readInt32() != 0;
    this.textX = read.readInt32();
    this.textY = read.readInt32();
}