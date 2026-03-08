/**
 * Created by Administrator on 2016/6/23.
 */
var ServerAjax = (function () {
    var self;
    function ServerAjax(){
        self = this;
        this.gameInfo = null;           // 游戏信息
        this.userInfo = null;            // 用户信息
        this.userFlowerInfo = null;      // 用户送花信息
        this.updateLogData = null;       // 日志信息
        this.linkOverData = null;        // 友情链接与结局信息
        this.gameCommentData = null;      // 游戏评论
        this.gameFineCommentData = null;  // 精品评论
    }
    ServerAjax.prototype = {
        init: function (callBack) {
            var uid;
            try{
                if(mark == "aBox"){
                    if(typeof window.org_box == 'undefined'){} else {
                        uid=window.org_box.GetUid();
                        upServerTime(uid,gIndex);
                    }
                } else {
                    uid = publicUses.getUserInfo().uid;
                    curUserId = uid;
                    upServerTime(uid,gIndex);
                }
            } catch(e){
                uid = 0;
                curUserId = 0;
            }

            if(!img_src || img_src.length<=0){
                img_src = 'https://6rlol.pages.dev/engine/website/hfplayer/img/default_thumb.jpg';
            }

            self.get_flower(function (data) {
                callBack && callBack();
            });
        },
        // 获取广告 flash 请求广告
        get_ad_list:function(callBack){
            var url = AJAX_URL.Game_AD;
            self.getAjax(url,"get",null, function (data) {
                if(parseInt(data.ret) == 1){
                    callBack&&callBack(data);
                }
            }, function (data) {
                callBack&&callBack(-1);
            },false);
        },
        // 获取游戏鲜花
        get_flower: function(callBack){
            var url = AJAX_URL.FLOWER_GAME_ALL_FLOWER + "?gindex=" + gIndex;
            self.getAjax(url,"get",null, function (data) {
                if(data.status == 1){
                    self.userFlowerInfo = data.data;
                    flowerHua = Math.floor(self.userFlowerInfo.num);
                    callBack && callBack(data);
                } else {
                    callBack && callBack(data);
                }
            }, function (data) {
                callBack && callBack(-1);
            }, true);
        },
        get_gameInfo: function (callBack) {
            if (self.gameInfo) {
                callBack && callBack({status:1, data:self.gameInfo});
                return;
            }
            var hardcodedData = {
                "status": 1,
                "data": {
                    "game": {
                        "gindex": 1,
                        "guid": "none",
                        "version": 1,
                        "gname": "PLAY MORE ON 6RLOL.PAGES.DEV",
                        "title": "PLAY MORE ON 6RLOL.PAGES.DEV",
                        "author_uid": 0,
                        "author_uname": "MTDCMZ",
                        "description": "PLAY MORE ON 6RLOL.PAGES.DEV",
                        "real_thumb": "https://6rlol.pages.dev/engine/website/hfplayer/img/default_thumb.jpg",
                        "is_free": 1,
                        "is_finish": 1
                    },
                    "user": {
                        "uid": 0,
                        "is_fav": 0,
                        "is_concern": 0,
                        "is_agree": 0
                    },
                    "comment_count": 0,
                    "flower_count": 0
                }
            };
            self.gameInfo = hardcodedData.data;
            if (!img_src || img_src.length <= 0) {
                img_src = self.gameInfo.game.real_thumb || '';
            }
            callBack && callBack({status:1, data:self.gameInfo});
        },
        get_userInfo:function (callBack,bool){
            var url=AJAX_URL.USER_CJH_INFO;
            var suc = function (res) {
                if(res.status == 1){
                    self.userInfo = res.data;
                }
                callBack&&callBack(res);
            }
            var err = function (data) {
                resData.Code = 20001;//接口不通的错误码
                resData.data =data;
                callBack&&callBack(resData);
            }
            if(bool || !this.userInfo ){
                this.getAjax(url,"get",null,suc,err,true);
            }else{
                callBack&&callBack(this.userInfo);
            }
        },
        send_flower: function (num,callBack) {
            var url = AJAX_URL.FLOWER_SEND_FLOWER;
            var data={
                gindex: gIndex,
                num:num
            };
            var suc = function (data) {
                callBack&&callBack(data,num);
            }
            var err = function () {
                callBack&&callBack(-1);
            }
            this.getAjax(url,"get",data,suc,err,true);
        },
        send_count: function (gindex,guid,gameTitle) {
            var url = "http://cgv2.66rpg.com/api/oweb_log.php?op=5001&gindex="+gindex+"&guid="+guid+"&name="+encodeURI(gameTitle)+"&token=";
            this.getAjax(url,"get",null,null,null,true);
        },
        update_log: function (callBack) {
            var url = AJAX_URL.GAME_UPDATE_LOG+"?gindex="+gIndex+"&game_flg=1&clean=1";
            if(this.updateLogData != null){
                callBack(this.updateLogData);
            }else{
                this.getAjax(url,"get",null, function (data) {
                    if(data.status == 1){
                        self.updateLogData = data.data;
                        callBack(data.data);
                    }else{
                        callBack(-1);
                    }
                },function(){
                    callBack(-1)
                },true);
            }
        },
        get_game_link: function (callBack) {
            var url = AJAX_URL.GAME_LINK_OVER+"?gindex="+gIndex+"&clean=1";
            if(this.linkOverData != null){
                callBack(this.linkOverData);
            }else{
                this.getAjax(url,"get",null, function (data) {
                    if(data.status == 1){
                        self.linkOverData = data.data;
                        callBack(data.data);
                    }else{
                        callBack(-1);
                    }
                },function(){
                    callBack(-1)
                },true);
            }
        },
        get_game_comment: function (index,count,callBack) {
            var url = AJAX_URL.GAME_COMMENT;
            var data = new Object();
            data.gindex = gIndex;
            data.page = index;
            data.limit = count;
            data.call_source = "game";
            data.fine = 1;
            data.desc = 1;
            this.getAjax(url,"get",data, function (data) {
                self.gameCommentData = data;
                callBack(data);
            },function(){
                callBack(-1)
            },true);
        },
        get_game_fine_comment: function (index,count,callBack) {
            var url = AJAX_URL.GAME_FINE_COMMEN;
            var data = new Object();
            data.gindex = gIndex;
            data.page = index;
            data.limit = count;
            data.call_source = "game";
            data.fine = 1;
            data.desc = 1;
            this.getAjax(url,"get",data, function (data) {
                self.gameCommentData = data;
                callBack(data);
            },function(){
                callBack(-1)
            },true);
        },
        // 获取map.bin
        getMapBin:function(suc,err,_url){
            if(!_url){
                var url = AJAX_URL.GET_MAP_BIN;
                var data = new Object();
                data.action = "create_bin";
                data.guid = guid;
                data.version = ver;
                if(quality == 0){
                    data.quality = 32;
                }else{
                    data.quality = quality;
                }
                self.getAjax(url,"get",data,suc,err)
            }else {
                self.getAjax(_url,"get",null,suc,err)
            }

        },
        // 请求接口
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
    return ServerAjax;
})();
var serverAjax = new ServerAjax();