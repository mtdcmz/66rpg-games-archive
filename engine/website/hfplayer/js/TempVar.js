/**
 * Created by 七夕小雨 on 2014/11/7.
 */
function TempVar(){
    //this.sb = null;
    this.data = null;
    this.DataVer = 0;
    this.scene = null;
    this.inter = null;
    this.canvas = null;
    this.system = new DGameSystem();
    //this.g = null;

    this.FontZoom = 1.2; //系统字体大小设置
    this.CUIFromIndex = -1;

    this.zoomSceneF = 1.0;//游戏场景的缩放率（反比）
    this.zoomScene = 1.0;//游戏场景的缩放率
    
    this.isMobile = (mark == 'ios' || mark == 'aBox' || isIphone() || isPhone || (browserRedirect() == false)) ? true : false;//移动端判断
    this.isIos = this.isMobile && (mark == 'ios' || isIphone());
    this.isAndroid = this.isMobile && (!this.isIos);
    this.isAndroidBox = (mark == 'aBox');
    this.isSafrai = isSafrai();

    //0421 暂时放弃了此方案 后续清除掉相关
    this.tempCooperation = "";///后续根据合作方标志不同 游戏有不同处理
    if(this.isMobile){ //临时使用移动端标志处理tempCooperation
         this.tempCooperation = "org";
    }
    
    this.photomenuPosXOff = 20;//手机菜单图标合作方需要向右偏移的像素
    this.safraiSaveIndex = guid;//0427 safrai唯一存档编号
    
}