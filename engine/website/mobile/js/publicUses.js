/**
 *Code
 *404 网络问题或接口异常
 *
 *1000 未登录
 *
 *2000 收藏成功
 *2001 已经收藏
 *2002 收藏失败
 *2003 自己不能收藏自己
 *2010 取消收藏成功
 *2011 已经取消收藏
 *2012 取消收藏失败
 *
 *3000 关注成功
 *3002 关注失败
 *3010 取消关注成功
 *3012 取消关注失败
 *3013 不能关注自己
 *
 *4000 点赞成功
 *4001 已经点赞
 *4002 点赞失败
 *4003 不能给自己点赞
 * */

var PublicUses = (function () {
    var url_Head;
    //var url_Head = "//www.test.66rpg.com/";
    var resData;
    var self;
    var err;
    var errFun;
    var mark;
    function PublicUses(){
        self = this;
        //返回信息
        resData = new Object();
        this.data = {};
        //作品gindex
        this.gindex =0;
        //作品作者id
        this.uid = 0;
        //捕获接口异常
        this.errorFun = null;
        //收藏状态初始值
        this.keepState = 0;
        //点赞的起始状态
        this.argeeState = 0;
        //关注的起始状态
        this.concernState = 0;
        //
        this.keepData = null;
        //
        this.argeeData = null;
        //
        this.concernData = null;

        //错误信息的抛出
        err = function (data) {
            resData.Code = 404;
            resData.data =null;
            self.errorFun && self.errorFun(resData);
        }
    }
    PublicUses.prototype = {
        /*
         * 实例{divId:"data",argeeFun:fun,keepFun:fun,concernFun:fun}
         * divId  存放用户信息的div的id
         * errFun ajax错误 统一返回404
         * */
        setConfig: function (data) {
        	if(data == null){
        		alert("未配置");
        		return;
        	}
            //是不是isFlash
            function GetQueryString(name) {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i");
                var r = window.location.search.substr(1).match(reg);
                if (r!=null) return (r[2]); return null;
            }
            mark = GetQueryString("mark");

            url_Head= webUrl;
            //console.log(url_Head,data);
            for(var i in data){
                this.data[i] = data[i];
            }
            var divId = this.data["divId"];
            var errFun = this.data["errFun"];
            this.errorFun = errFun;
            if(mark == "isFlash"){
                if(window.parent.$("#"+divId)){
                    this.divId = divId;
                }else{
                    alert("此id的div不存在");
                }
            }else{
                if($("#"+divId)){
                    this.divId = divId;
                }else{
                    alert("此id的div不存在");
                }
            }
        },
        //获取用户信息（只是登录时的首信息）
        getUserInfo: function () {
            //console.log($("#"+this.divId).data("user"));
            if(mark == "isFlash"){
                return window.parent.$("#"+this.divId).data("user");
            }else{
                return $("#"+this.divId).data("user");
            }
            //return $("#"+this.divId).data("user");
            //return ssoLogin.user;
        },

        //收藏 取消收藏的方法
        p_Keep: function (callBack) {
            if(this.getUserInfo()) {
                if(self.keepState == 0){
                    self.go_keep(function (data) {
                        //收藏成功
                        if(data.status == 1){
                            self.keepState = 1;
                            resData = self.getCodeData(2000,data);
                        }else if(data.status == 6){//已经收藏
                            self.keepState = 1;
                            resData = self.getCodeData(2001,data);
                        }else if(data.status == -2){//收藏失败
                            resData = self.getCodeData(2002,data);
                        }else if(data.status == -100){//不能收藏自己
                            resData = self.getCodeData(2003,data);
                        }else{//其他情况
                            resData = self.getCodeData(404);
                        }
                        callBack(resData);
                    });
                }else if(self.keepState == 1){
                    self.go_cancel_keep(function (data) {
                        //取消收藏成功
                        if(data.status == 1){
                            self.keepState = 0;
                            resData = self.getCodeData(2010,data);
                        }else if(data.status == -2){//收藏失败
                            resData = self.getCodeData(2012,data);
                        }else if(data.status == 0){//已经取消收藏
                            self.keepState = 0;
                            resData = self.getCodeData(2011,data);
                        }else{//其他情况
                            resData = self.getCodeData(404);
                        }
                        callBack(resData);
                    });
                }else{
                    resData = self.getCodeData(404);
                    callBack(resData);
                }
            }
            else{
                //收藏状态初始值
                this.keepState = 0;
                //点赞的起始状态
                this.argeeState = 0;
                //关注的起始状态
                this.concernState = 0;
                //回调未登录的信息
                resData = this.getCodeData(1000);
                callBack(resData);
            }
        },
        go_keep: function (callBack) {
            var url = url_Head+"/ajax/favorite/create.json";
            var data = new Object();
            data.gindex =self.gindex;
            data.platform = 4;
            var suc = function (data) {
                self.keepData = data;
                callBack(data);
            }
            this.getAjax(url,"get",data,suc,err,true);
        },
        go_cancel_keep: function (callBack) {
            var url = url_Head+"/ajax/favorite/destory.json";
            var data = new Object();
            data.gindex =self.gindex;
            data.platform = 4;
            var suc = function (data) {
                callBack(data);
            }
            this.getAjax(url,"get",data,suc,err,true);
        },
        //获取收藏状态
        p_ComKeep: function (gindex,callBack) {
            this.gindex = gindex;
            if(this.getUserInfo()){
                //登录后去获得收藏状态
                var url =url_Head+"/ajax/favorite/isfaved.json";
                //"status 1 收藏 ; 0 未收藏 ; -2  失败"
                var data = new Object();
                data.gindex =gindex;
                var suc = function (data) {
                    self.keepState = data.status;
                    callBack(data);
                }
                this.getAjax(url,"get",data,suc,err,true);
            }else{
                //收藏状态初始值
                this.keepState = 0;
                //点赞的起始状态
                this.argeeState = 0;
                //关注的起始状态
                this.concernState = 0;
                //回调未登录的信息
                resData = this.getCodeData(1000);
                callBack(resData);
            }
        },

        //关注 取消关注的方法
        p_Concern: function (callBack) {
            if(this.getUserInfo()) {
                if(self.concernState == 101){//未关注
                    self.go_concern(function(data){
                        if(data.status == 1){
                            self.concernState = 1;
                            resData = self.getCodeData(3000,data);
                        }else if(data.status == -100){
                            resData = self.getCodeData(3013,data);
                        }else{
                            resData = self.getCodeData(3002,data);
                        }
                        callBack(resData);
                    })
                }else if(self.concernState == 1){//已关注
                    self.go_cancel_concern(function(data){
                        if(data.status == 1){
                            self.concernState = 101;
                            resData = self.getCodeData(3010,data);
                        }else{
                            resData = self.getCodeData(3012,data);
                        }
                        callBack(resData);
                    })
                }else if(self.concernState == -2){
                    resData = self.getCodeData(3013,null);
                    callBack(resData);
                }else{
                    resData = self.getCodeData(3002,null);
                    callBack(resData);
                }
            }else{
                //回调未登录的信息
                resData = this.getCodeData(1000);

                //收藏状态初始值
                this.keepState = 0;
                //点赞的起始状态
                this.argeeState = 0;
                //关注的起始状态
                this.concernState = 0;
                callBack(resData);
            }
        },
        go_concern: function (callBack) {
            var url = url_Head+"/ajax/follow/create.json";
            var data = new Object();
            data.uid2 =self.uid;
            data.platform = 4;
            var suc = function (data) {
                callBack(data);
            }
            this.getAjax(url,"get",data,suc,err,true);
        },
        go_cancel_concern: function (callBack) {
            var url = url_Head+"/ajax/follow/delete.json";
            var data = new Object();
            data.uid2 =self.uid;
            data.platform = 4;
            var suc = function (data) {
                callBack(data);
            }
            this.getAjax(url,"get",data,suc,err,true);
        },
        //获取关注状态
        p_ComConcern: function (uid,callBack) {
            this.uid = uid;
            if(this.getUserInfo()){
                //登录后去获得收藏状态
                var url =url_Head+"/ajax/follow/status.json";
                //"status 1 收藏 ; 0 未收藏 ; -2  失败"
                var data = new Object();
                data.uid2 =uid;
                var suc = function (data) {
                    if(data.status ==1){
                        self.concernState = data.data.self_status;
                    }else if(data.status == -2){
                        self.concernState = -2;
                    }else{
                        self.concernState = 0;
                    }
                    callBack(data);
                }

                this.getAjax(url,"get",data,suc,err,true);
            }else{
                //收藏状态初始值
                this.keepState = 0;
                //点赞的起始状态
                this.argeeState = 0;
                //关注的起始状态
                this.concernState = 0;
                //回调未登录的信息
                resData = this.getCodeData(1000);
                callBack(resData);
            }
        },

        //获取点赞状态
        p_ComArgee: function (gindex,callBack) {
            var url = url_Head+"/ajax/game/score_by_me.json";
            var data = new Object();
            data.gindex = gindex;
            var suc = function (data) {
                self.argeeState = data.status;
                callBack(data);
            }
            this.getAjax(url,"get",data,suc,err,true);
        },
        //点赞
        p_Argee: function (callBack) {
            if(this.getUserInfo()) {
                if (self.argeeState == 0) {
                    self.go_argee(function (data) {
                        if (data.status == 1) {
                            self.argeeState = 1;
                            resData = self.getCodeData(4000, data);
                        } else if (data.status == 0) {
                            self.argeeState = 1;
                            resData = self.getCodeData(4001, data);
                        } else if (data.status == -100) {
                            resData = self.getCodeData(4003, data);
                        }else{
                            resData = self.getCodeData(4002, data);
                        }
                        callBack(resData);
                    });
                }else {
                    resData = self.getCodeData(4001);
                    callBack(resData);
                }
            }else{
                //回调未登录的信息
                resData = this.getCodeData(1000);
                callBack(resData);
            }
        },
        go_argee: function (callBack) {
            var url = url_Head+ "/ajax/game/score.json";
            var data = new Object();
            data.gindex = this.gindex;
            var suc = function (data) {
                callBack(data);
            }
            this.getAjax(url,"get",data,suc,err,true);
        },
        //获取点赞数
        p_GetArgeeNum: function (gindex,callBack) {
            var url = url_Head+ "/ajax/game/score_sum.json";
            if(!gindex){
                gindex = self.gindex;
            }
            var data = new Object();
            data.gindex = gindex;
            var suc = function (data) {
                callBack(data);
            }
            this.getAjax(url,"get",data,suc,err,true);
        },
        getCodeData: function (code,data) {
            resData.Code = code;
            resData.data = data;
            return resData;
        },
         //请求接口
        getAjax: function (url,type,data,suc,err,isJsonP) {
            if(isJsonP){
                $.ajax({url:url, type:"get", data:data, dataType:"jsonp", jsonp:"jsonCallBack",
                        success: function (data) {
                            suc&&suc(data);
                        }, error: function (data) {
                            err&&err(data);
                        }}
                );
            }else{
                $.ajax({url:url, type:type, data:data, dataType:"json",
                        success: function (data) {
                            suc&&suc(data);
                        },
                        error: function (data) {
                            err&&err(data);
                        }}
                );
            }
        }
    }
    return PublicUses;
})();
var publicUses = new PublicUses();