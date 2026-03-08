/**
 * Created by heshang on 2016/9/9.
 */
var cloudUserID = 100002;
function OperationCloud(){
    ICloud.call(this);

    //控制存读档操作队列
    var isStart = false;
    //控制二周目队列
    var isStartEx = false;
    var startExFraem = 0;
    var currentStatus,errorCode = ErrorCode.None;

    var isGetOpenCloudState = false;

    var headUrl = M_C_SERVER_URL+"cloud/v1/index/";

    this.isOpen = false;
    this.CloudStack = new Array();
    this.CloudExStack = new Array();

    function postAjax(url,data,suc,error){
        $.ajax({
            url:url,
            type:"post",
            data:data,
            success: function (data) {
                suc&&suc(data);
            },
            error: function (e) {
                error&&error(e);
            }
        });
    }

    this.startCloudStack = function (task) {
        var self = this;
        if(task){
            operationCloud.CloudStack.push(task);
        }
        if(!isStart){
            if(operationCloud.CloudStack.length>0){
                isStart = true;
                var stack = operationCloud.CloudStack[0];
                //递归调用等待操作的队列
                switch (stack.type){
                    case CloudTaskState.DOWNLOAD:
                        operationCloud.DownLoadSaveInfo(function (data,obj) {
                            isStart = false;
                            if(data == -1){
                                operationCloud.CloudStack.shift();
                                self.startCloudStack();
                                return;
                            }
                            obj.fun&&obj.fun(data);
                            operationCloud.CloudStack.shift();
                            self.startCloudStack();
                        },stack);
                        break;
                    case CloudTaskState.UPLOADMORE:
                        operationCloud.UpLoadSaveInfo(stack.data, function (data,obj) {
                            isStart = false;
                            if(data == -1){
                                operationCloud.CloudStack.shift();
                                self.startCloudStack();
                                return;
                            }
                            //sLoading.showAlert("同步完成！");
                            obj.fun&&obj.fun(data);
                            operationCloud.CloudStack.shift();
                            self.startCloudStack()
                        },stack);
                        break;
                    case CloudTaskState.UPLOADSINGLE:
                        operationCloud.UpLoadSaveInfo(stack.data, function (data,obj) {
                            isStart = false;
                            if(data == -1){
                                operationCloud.CloudStack.shift();
                                self.startCloudStack();
                                return;
                            }
                            obj.fun&&obj.fun(data);
                            operationCloud.CloudStack.shift();
                            self.startCloudStack();
                        },stack);
                        break;
                }
            }
        }
    };
    this.getLogin = function(){
        if(mark == "aBox"){ //安卓盒子
            if(typeof window.org_box == 'undefined'){

            }else{
                var a=window.org_box.GetLoginStatus();
                if(!a){
                    window.org_box.newMenuLogin(!isVertical);
                }
                return;
            }
        }else if(mark == "isFlash"){  //flash
            window.parent.asUserOperate.userLogin();
        }else{
            $(".ssologin")[0].click();
        }
    }

    this.getUid = function(){
        var uid;
        if(mark == "aBox") {
            if(typeof window.org_box == 'undefined'){

            }else{
                if(window.org_box.GetLoginStatus()){
                    uid = parseInt( window.org_box.GetUid() );
                }else{
                    uid = 0;
                }
            }
        }else{
            if(publicUses.getUserInfo()){
                uid = parseInt(publicUses.getUserInfo().uid);
                //记录用户最初的uid 未登录时curUser.uid为0一旦登录或者登录进游戏--(只记录一次)
                if(mark == "isFlash"&&uid>0&&curUser.uid==0){
                    curUser.uid = uid;
                    curUser.uname = publicUses.getUserInfo().uname;
                };
            }else{
                uid = 0;
            }
        }

        return uid;
    };

    this.getData = function () {
        var data = new Object();
        data.guid = guid;
        data.gindex = gIndex;
        data.uid = operationCloud.getUid();
        //data.uid = parseInt(publicUses.getUserInfo().uid);
        data.newClient_type = 7;
        var ts = parseInt(Date.now()/1000);
        var a = new Object();
        a["r"]=(md5(ts.toString()).substr(1,3));
        var jsonAuth = JSON.stringify(a);
        var base64Auth = base64.urlEncoder(jsonAuth);
        var enCodeAuth = encodeURIComponent(base64Auth);
        data.auth = enCodeAuth;
        data.newTs = ts;
        var sign =md5("client_type="+data.newClient_type+"&ts="+ts+"t_16b4a01f45313e88");
        data.newSign = sign;
        return data;
    }
    //上传存档信息
    this.UpLoadSaveInfo = function (content,callBack,obj) {
        var data = this.getData();
        data.content = JSON.stringify(content);
        currentStatus = CloudStatus.UpLoading;
        //return;
        var url = headUrl+"cloud_save?ts="+data.newTs+"&sign="+data.newSign+"&client_type="+data.newClient_type;
        postAjax(url,data,function(data){
            currentStatus = CloudStatus.None;
            callBack&&callBack(data,obj);
        },function(){
            currentStatus = CloudStatus.None;
            callBack&&callBack(-1,obj);
            errorInfo.currentErrorCode= ErrorCode.NetError;
            console.log(errorInfo.currentErrorCode);
        });
    }
    //下载存档信息
    this.DownLoadSaveInfo = function (callBack,obj) {
        currentStatus = CloudStatus.DownLoading;
        var data = this.getData();
        var url = headUrl+"cloud_load?ts="+data.newTs+"&sign="+data.newSign+"&client_type="+data.newClient_type;
        postAjax(url,data,function(data){
            //console.log(data);
            currentStatus = CloudStatus.None;
            callBack&&callBack(data,obj);
        }, function () {
            currentStatus = CloudStatus.None;
            callBack&&callBack(-1,obj);
            errorInfo.currentErrorCode= ErrorCode.NetError;
            console.log(errorInfo.currentErrorCode);
        });
    }

    //上传二周目信息
    this.UpLoadSaveExInfo = function (type,varsEx,callBack) {
        var data = this.getData();
        data.varsEx = varsEx;
        data.varsType = type;
        var url = headUrl+"cloud_save_ex?ts="+data.newTs+"&sign="+data.newSign+"&client_type="+data.newClient_type;
        postAjax(url,data,function(data){
            //console.log(data);
            callBack&&callBack(data);
        }, function () {
            callBack&&callBack(-1);
            errorInfo.currentErrorCode= ErrorCode.NetError;
        });
    }
    //下载二周目信息
    /**
     *1.首先判断登录状态
     *2.下载二周目到本地
     *3.判断是否是限免 限免提示是否用花替换
     * */
    this.DownLoadSaveExInfo = function (type,callBack) {
        var data = this.getData();
        data.varsType = type;
        var url = headUrl+"cloud_load_ex?ts="+data.newTs+"&sign="+data.newSign+"&client_type="+data.newClient_type;
        postAjax(url,data,function(data){
            //console.log(data);
            callBack&&callBack(data);
        }, function () {
            callBack&&callBack(-1);
            errorInfo.currentErrorCode= ErrorCode.NetError;
        });
    }

    
    this.startExStack = function (varsEx) {
        //varsEx +="&time="+parseInt(Date.now()/1000);
        if(varsEx){
            this.CloudExStack.push(varsEx);
        }
        startExFraem = 0;
    }
    
    /**
     * 获取云存档状态
     * */
    this.getOpenCloudState = function (callBack,obj) {
        if(!isGetOpenCloudState){
            isGetOpenCloudState = true;
            var data = this.getData();
            var url = headUrl+"cloud_flag?ts="+data.newTs+"&sign="+data.newSign+"&client_type="+data.newClient_type;
            postAjax(url,data,function(data){
                isGetOpenCloudState = false;
                if(parseInt(data.status) == 1 && data.data == true){
                    operationCloud.isOpen = true;
                    callBack&&callBack(true,data,obj);
                    return;
                }else{
                    operationCloud.isOpen = false;
                }
                callBack&&callBack(false,data,obj);
            },function () {
                isGetOpenCloudState = false;
                callBack&&callBack(false,-1,obj);
                //callBack&&callBack(-1);
            });
        }
    };
    /*统计云存档 读档次数*/
    this.setCloudCount = function(){
        var cloudData = this.getData();
        var data ={
            uid : cloudData.uid,
            num : 1,
            type : 2,
            client_type : cloudData.newClient_type,
            ts : cloudData.newTs,
            sign : cloudData.newSign,
            auth : cloudData.auth,
            guid : cloudData.guid
        };
        var url = headUrl+"cloud_count?ts="+data.ts+"&sign="+data.sign+"&client_type="+data.client_type;
        postAjax(url,data,function(data){
           // console.log('读档统计成功')
        }, function () {
            console.log('读档统计，错误');
        });
    };

    /// <summary>
    /// 释放资源
    /// </summary>
    this.Dispose = function () {

    }
    this.GetCurrentCloudStatus = function(){
        return currentStatus;
    }
    /// <summary>
    /// 该操作较危险，慎用
    /// </summary>
    /// <param name="status"></param>
    this._SetCurrentCloudStatus = function(status){
        currentStatus = status;
    }
    //这个update主要控制二周目的上传逻辑
    this.update = function () {
        startExFraem++;
        if(startExFraem > 120 || this.CloudExStack.length>20){
            if(this.CloudExStack.length>0){
                var varsEx = this.CloudExStack[this.CloudExStack.length-1];
                this.CloudExStack.length = 0;
                //上传二周目 normal:普通 limitfree：限免
                if(operationFrame.getIsFree()){
                    this.UpLoadSaveExInfo("limitfree",varsEx, function (data) {
                        //console.log(data);
                    });
                }else{
                    this.UpLoadSaveExInfo("normal",varsEx, function (data) {
                        //console.log(data);
                    });
                }
            }
            startExFraem = 0;
        }
    }
}
var operationCloud = new OperationCloud();

function CloudTaskState(){}
CloudTaskState.UPLOADSINGLE = "single";
CloudTaskState.UPLOADMORE = "more";
CloudTaskState.DOWNLOAD = "download";

function CloudTask(type,data,fun){
    this.type = type;
    this.data = data;
    this.fun = fun;
}