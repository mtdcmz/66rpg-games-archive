/**
 * Created by heshang on 2016/9/9.
 */
/**
 * 用来标识云存档的状态
 * */
function CloudStatus(){}
CloudStatus.None = 0;//空状态
CloudStatus.UpLoading = 1;//正在上传状态
CloudStatus.DownLoading = 2;//下载中状态
CloudStatus.Parseing = 3;//解析中状态
CloudStatus.Deparseing = 4;//打包中状态