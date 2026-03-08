/**
 * Created by Administrator on 2016/9/9.
 */
//云存档的错误码
function ErrorCode(){}
ErrorCode.None = 0;//无错 默认状态
ErrorCode.NetError = 1;//网络异常
ErrorCode.ParseError = 2;//解析错误
ErrorCode.DeParseError = 3;//打包错误

function ErrorInfo(){
    this.currentErrorCode = 0;
    this.currentErrorMessage = "";
}
var errorInfo = new ErrorInfo();
