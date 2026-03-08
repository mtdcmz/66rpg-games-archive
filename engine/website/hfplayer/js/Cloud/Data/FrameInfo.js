/**
 * Created by heshang on 2016/9/9.
 * @para Header:头信息
 * @para logic:逻辑信息
 * @para canvas:画布信息
 * @para music:音乐信息
 * @para thumbnail:缩略图
 */
function FrameInfo(){
    this.Header = new DGameHeader();
    this.Logic = new DLogic();
    this.Canvas = new DCanvas();
    this.Music = new DMusic();
    this.SystemDefine = new DSystemDefine();
    this.RePlay = new Object();
    this.Thumbnail = new DThumbnail();
}