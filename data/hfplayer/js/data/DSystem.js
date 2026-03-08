/**
 * Created by 七夕小雨 on 2014/11/11.
 */

function DSystem(read){
    read.readInt32();
    this.FontName = read.readStringE();
    this.FontSize = read.readInt32();
    if(isPhone || isIphone() ){//0211 移动端字体较大，pc端较小，原始字体大小h5一行全是字可能顶出屏幕空间
        this.FontSize *= 0.85;  
    }else{
        this.FontSize *= 0.8;  
    }
    this.FontSize = parseInt(this.FontSize);
    this.FontTalkColor = new OColor(read.readStringE());
    this.FontUiColor = new OColor(read.readStringE());
    if(tv.DataVer >= 101){
        this.FontStyle = read.readInt32();
    }
    this.SkipTitle = read.readInt32() != 0;
    this.StartStoryId = read.readInt32();
    read.readInt32();
    this.IconName = new DFileName(read);
    this.ShowAD = read.readInt32() != 0;
    this.AuthorWords = read.readStringE();
    this.AuthorWordsTiming = read.readInt32();
    this.AutoRun = read.readInt32() != 0;
    this.ShowSystemMenu = read.readInt32() != 0;
    this.SEClick = new DMusicItem(read);
    this.SEMove = new DMusicItem(read);
    this.SECancel = new DMusicItem(read);
    this.SEError = new DMusicItem(read);
    this.Title = new DTitle(read); //标题画面
    this.GameMenu = new DGameMenu(read);//菜单
    this.CG = new DCG(read)//CG
    this.BGM = new DBGM(read)//BGM
    this.SaveData = new DSaveData(read);//SAVE
    this.MessageBox = new DMessageBox(read);//对话框
    this.Replay = new DReplay(read);//回放
    this.Setting = new DSetting(read);//设置
    var blength = read.readInt32();
    this.Buttons = new Array(blength);
    for(var i = 0;i<blength;i++){
        this.Buttons[i] = new DButton(read);
    }
    this.UIInitSave = read.readInt32() != 0;
    //--
    this.Cuis = null;
    this.MenuIndex = 0;
    //--
    if(tv.DataVer >= 103){
        var uiNum = read.readInt32();
        this.Cuis = new Array(uiNum);
        for(var i = 0;i<uiNum;i++){
            this.Cuis[i] = new DCustomUIData(read);
        }
        this.MenuIndex = read.readInt32();
        //console.log("---menuIndex:"+this.MenuIndex) ;
    }
}