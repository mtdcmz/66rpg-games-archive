/**
 * Created by heshang on 2016/9/9.
 */
/**
 * 错误管理器：单例类
 * */
var ErrorManager = (function () {
    var instance;
    var currentErrorInfo;
    function ErrorManager(){
        if(!currentErrorInfo){
            currentErrorInfo = new ErrorInfo();
        }
    }
    ErrorManager.prototype = {
        GetCurrentErrorInfo: function () {
            return currentErrorInfo;
        },
        SetCurrentErrorCode: function (code,error) {
            if(!error){
                error = "";
            }
            currentErrorInfo.currentErrorCode = code;
            currentErrorInfo.currentErrorMessage = error;
        }
    }
    return {
        GetInstance: function () {
            if(!instance){
                instance = new ErrorManager();
            }
            return instance;
        }
    }
})();
ErrorManager = ErrorManager.GetInstance();
