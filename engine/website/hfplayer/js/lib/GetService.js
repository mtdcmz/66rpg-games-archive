/**
 * Created by heshang on 2015/10/29.
 */
var GetService=(function () {
    function GetService(){
        //接口
        this.url="";
        //用户ID
        this.userID="1";
        //游戏ID
        this.gameID="1";
        //平台
        this.gamePT=1;
    }
    GetService.prototype={
        //请求用户的档案列表
        GetUserArchivesList: function (data,callBack) {
            this.GetServiceData(this.url,data,"get",function(data){
                callBack(data);
            });
        },
        //存储用户的档案
        SetUserArchives: function (data,callBack) {
            this.url="http://tianwan.66rpg.com/api/savegame/v1/record/save_archived_file?paltform=";
            this.GetServiceData(this.url,data,"post","json",function(data){
                callBack(data);
            });
        },
        //存储用户的二周目信息
        SetUserPNum: function (data,callBack) {
            this.url="http://tianwan.66rpg.com/api/savegame/v1/record/save_var_ex?paltform=";
            this.GetServiceData(this.url,data,"post","json",function(data){
                callBack(data);
            })
        },
        //请求用户的二周目信息
        GetUserPNum: function (data,callBack) {
            this.url="http://tianwan.66rpg.com/api/savegame/v1/record/get_var_ex?paltform=";
            this.GetServiceData(this.url,data,"get","json", function (data) {
                callBack(data);
            });
        },
        //请求用户的存档信息
        GetUserArchives: function (data,callBack) {
            this.url="http://tianwan.66rpg.com/api/savegame/v1/record/get_archived_file?paltform=";
            this.GetServiceData(this.url,data,"get","json", function (data) {
                callBack(data);
            });
        },
        //得到用户与商品的信息
        GetUserGoods: function (data,callBack) {
            //请求服务器
            this.GetServiceData(this.url,data,"json" ,function (data) {
                callBack(data);
            });
        },
        //请求服务器获得接口对应信息
        GetServiceData: function (url,data,PGType,reType,callBack) {
            var self=this;
            if(PGType.toLowerCase()=="post"){
                var url=url+self.gamePT;
                data.user_id=this.userID;
                data.gindex=this.gameID;
                $.ajax({
                    url:url,
                    type:PGType,
                    data:data,
                    dataType:reType,
                    success: function (data) {
                        if(data.status== 1){
                            callBack(data);
                        }else{
                            if(data.status==-1){
                                console.log(data,"存入失败");
                            }
                            callBack("fail");
                        }
                    },
                    error: function (e) {
                        console.log(e);
                        callBack("fail");
                    }
                });
            }else{
                var url=url+self.gamePT;
                url=url+"&user_id="+self.userID+"&gindex="+self.gameID;
                console.log(url);
                $.ajax({
                    url:url,
                    type:PGType,
                    dataType:reType,
                    success: function (data) {
                        if(data.status== 1) {
                            callBack(data);
                        }else{
                            if(data.status==-1){
                                console.log(data,"获取成功，参数为空");
                            }
                            callBack("fail");
                        }
                    },
                    error: function (e) {
                        console.log(e);
                        callBack("fail");
                    }
                });
            }

        }
    }
    return GetService;
})();
var getService=new GetService();


/*
* 获取玩吧相关的用户信息
* */

//var getWanUserInfo=(function () {
//    function getWanUserInfo(openid,openkey,sig,pf){
//        this.url="http://openapi.tencentyun.com/v3/user/get_info";
//        this.openid=openid;
//        this.openkey=openkey;
//        this.sig=sig;
//        this.pf=pf;
//        this.format="text";
//        //this.userip=;
//        this.AppID="1104897550";
//        this.AppKey="yAseRtD8TOChvRpi";
//    }
//    getWanUserInfo.prototype={
//        getService: function () {
//            $.ajax({
//                url:url,
//                type:"get",
//                dataType:"json",
//                success: function (data) {
//                    if(data.status== 1) {
//                        callBack(data);
//                    }else{
//                        console.log(data);
//                        callBack("fail");
//                    }
//                },
//                error: function (e) {
//                    console.log(e);
//                    callBack("fail");
//                }
//            });
//        }
//    }
//    return getWanUserInfo;
//})();

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i");
    var r = window.location.search.substr(1).match(reg);
    if (r!=null) return (r[2]); return null;
}
