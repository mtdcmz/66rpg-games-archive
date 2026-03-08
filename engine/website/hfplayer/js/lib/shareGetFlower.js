/**
 * Created by heshang on 2015/11/27.
 */

var share_href ="";
//花的数量
var flowerHua = 0;
function getGIndex(){
    //获取gindex;
    var href=window.location.href;
    var isPara=href.split('?');
    if(isPara[1]){
        var num=href.split('/');
        var gid=num[num.length-1].split('?')[0];
    }else{
        var num=href.split('/');
        var gid=num[num.length-1];
    }
    return parseInt(gid);
}
share_href = AJAX_URL.GAME_SHARE_HREF+"/"+getGIndex() +'?stype=1';
function GetQueryString(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}

var shareGetFlower=(function () {
    var self;
    function shareGetFlower(){
        self = this;
        this.gIndex=getGIndex();
        this.shareAllAwardData = null;
    }
    shareGetFlower.prototype={
        //游戏有的花数
        shareGameHaveFlower:function(callBack){
            //this.url=conWebUrl+"ajax/game/game_flower_by_me.json?gindex="+this.gIndex;
            this.url=AJAX_URL.FLOWER_GAME_ALL_FLOWER+"?gindex="+this.gIndex;
            this.GetServiceData(this.url,"get", function (data) {
                callBack(data);
            });
        },
        //分享加鲜花
        shareGamePlusFlower: function (callBack) {
            //this.url=conWebUrl+"ajax/share/share_game.json?gindex="+this.gIndex;
            this.url=AJAX_URL.FLOWER_SHARE_PLUS_FLOWER+"?gindex="+this.gIndex;
            this.GetServiceData(this.url,"get", function (data) {
                callBack(data);
            });
        },
        //所有奖励配置信息
        shareAllAwardConf: function (callBack) {
            //this.url=conWebUrl+"ajax/share/all_share_award_conf.json";
            this.url=AJAX_URL.FLOWER_SHARE_ALL_INFO;
            if(self.shareAllAwardData){
                callBack(self.shareAllAwardData,true);
            }else{
                this.GetServiceData(this.url,"get", function (data) {
                    self.shareAllAwardData = data;
                    callBack(data);
                });
            }
            return;
        },
        //获得本次游戏配置信息
        shareAwardConf: function (callBack) {
            //this.url=conWebUrl+"ajax/share/share_award_conf.json?gindex="+this.gIndex;
            this.url=AJAX_URL.FLOWER_SHARE_NOW_FLOWER+"?gindex="+this.gIndex;
            this.GetServiceData(this.url,"get", function (data) {
                callBack(data);
            });
        },
        //请求服务器获得接口对应信息
        GetServiceData: function (url,type,callBack) {
            var self=this;
            $.ajax({
                url:url,
                type:"get",
                dataType:"jsonp",
                jsonp: 'jsonCallBack',
                success: function (data) {
                    callBack(data);
                },
                error: function (e) {
                    console.log(e);
                    callBack("fail")
                }
            });
        }
    }
    return shareGetFlower;
})();
var shareGetFlower=new shareGetFlower();
/*
* a:野花数量
* 安卓盒子调用后：
* */
//初始化登录----盒子在线玩。
function aBoxShareCallBack(a){
    var flowerSum = ''+a;
    var flowerArrSum=flowerSum.split("|");
    if(!a){
        flowerHua=0;
    }else{
        flowerHua=parseInt(flowerArrSum[0]);
    }
    if(flowerHua>0){
        allOpen=true;
    }
    try{
        if(flowerArrSum.length>1){
            serverAjax.userFlowerInfo={
                num:0,
                fresh_flower_num:0,
                wild_flower_num:0,
                tanhua_flower_num:0,
                sum:0
            };
            serverAjax.userFlowerInfo.num = parseInt(flowerArrSum[0]);
            serverAjax.userFlowerInfo.fresh_flower_num = parseInt(flowerArrSum[1]);
            serverAjax.userFlowerInfo.wild_flower_num = parseInt(flowerArrSum[2]);
            serverAjax.userFlowerInfo.tanhua_flower_num = parseInt(flowerArrSum[3]);
            serverAjax.userFlowerInfo.sum = parseFloat(flowerArrSum[4]);
        }
        //初始化二周目
        operationFrame.initCloudExData();
    }catch(e){
        alert("getFlower Error:"+e);
    }
}


/*
 * a:野花数量
 * 盒子中途登录：
 * */
function aBoxMidFlowerCallBack(a){
    sLoading.showMask();
    aBoxShareCallBack(a);
    //分情况初始化二周目
    var saveFileNum = tv.data.System.SaveData.max;
    if(saveFileNum>0&&operationCloud.getUid()){
        for(var i = 0;i<parseInt(saveFileNum);i++){
            var a=window.localStorage.getItem("orgsave"+ guid + i+'|'+operationCloud.getUid());
            if(a){
                //这个用户已经有新的存档了，不需要将匿名档位通过来
                isMoveDaveFile = true;
            }
        }
        for(var i = 0;i<parseInt(saveFileNum);i++){
            oldMoveNewData(i);
        }
    }
    sLoading.hideMask();
    //登陆后初始化档位
    if(tv && tv.scene && tv.scene.isNeedSendFlower == "SCGMENU"){
        tv.scene.cmdClose();
        tv.scene=new SCGMenu3(function(data){
        });
    }else if(tv && tv.scene && tv.scene.isNeedSendFlower == "SCUI"){
        //getWebUserInfo(function () {
        tv.system.varsEx.loadExData();
        tv.scene.refresh();
        //});
    }else if(tv && tv.scene && tv.scene.isNeedSendFlower == "SSaveFile"){
        tv.scene.dispose();
        tv.scene = new SSavefile();
    }
}

function getCookie(name)
{
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}


/*分享得一些操作接口*/
var gname="";
var img_src="";
$(function(){
    var boxheight=$(".share-modal-box").height;
    var scHeight=document.body.clientHeight;
    $(".share-modal-box").css("top",(scHeight-boxheight)/2);
//    var url=conWebUrl+"ajax/game/get_game_info.json?gindex="+getGIndex()+"!470x270";

//    var url=AJAX_URL.GAME_GET_GAME_INFO+"?gindex="+getGIndex()+"!470x270";
//    $.ajax({
//        url:url,
//        type:"get",
//        dataType:"jsonp",
//        jsonp: 'jsonCallBack',
//        success: function (data) {
//            if(data.status==1){
//                var data=data.data.game;
//                gname=data.gname;
//                img_src=data.real_thumb+"!470x270";
//                var img = new Image();
//                img.src = img_src;
//                img.onload = function () {
//                }
//            }
//        },
//        error: function (e) {
//            console.log(e,"fail");
//        }
//    });

    var config = {
        url:share_href,// 分享的网页链接
        title:gname,// 标题
        desc:'',// 描述
        img:img_src,// 图片
        img_title:gname,// 图片标题
        from:'' // 来源
    };
    var shareApp=new nativeShare("share-modal",config);
    window.shareModal = function(action){
        var share_modal = $('.share-modal'),
            share_modal_box = share_modal.find('.share-modal-box');
        if(action == 'show'){
            if(share_modal.hasClass('showed')){
                return false;
            }
            share_modal.addClass('showed');
            share_modal.css({
                'display' : 'block'
            });
            share_modal_box.css({
                'margin-top' : '0',
                'margin-left' : '0',
                'margin-top' : share_modal_box.outerHeight() / -2,
                'margin-left' : share_modal_box.outerWidth() / -2
            });
        }else if(action  == 'hide'){
            share_modal.removeClass('showed');
            share_modal.css('display', 'none');
        }
        share_modal.find('.share-modal-colse').click(function(){
            window.shareModal('hide');
        });
    };
    $('.js-share').click(function(){
        window.shareModal('show');
    });

    $('.share-modal-itemlist > li').click(function(){

        shareGetFlower.shareAwardConf(function (data) {
            if(data.status!=-2){
                var data=data.data.integral_flower_info;
                if(data.share_num && data.share_num<=3){
                    shareGetFlower.shareGamePlusFlower(function (data) {
                        if(data.status==1){
                            shareGetFlower.shareGameHaveFlower(function (data) {
                                if(data.data){
                                    var data=data.data;
                                    if(parseFloat(data.sum)>0) {
                                        userflowerNumber=data.sum;
                                        flowerHua=data.num;
                                        if(isOpen){
                                            allOpen=true;
                                        }
                                    }
                                }
                            });
                        }
                    });
                }
            }
        });
        //登录后分享加奖励
        var shareUrl = share_href;
        var s_uid = operationCloud.getUid().toString();

        if ($.isEmptyObject(userInfo) === false &&  s_uid ) {
            shareUrl += '&starget=' + getGIndex() + '&sflag=' + base64.urlEncoder(s_uid);
            gname = serverAjax.gameInfo.game.gname;
        }
        config = {
                    url:shareUrl,// 分享的网页链接
                    title:'曲折的作品剧情太过瘾，橙光作品【' + gname + '】等你好久啦！戳链接马上试玩~',// 标题
                    desc:'曲折的作品剧情太过瘾，橙光作品【' + gname + '】等你好久啦！戳链接马上试玩~',// 描述
                    img:img_src,// 图片
                    img_title:'曲折的作品剧情太过瘾，橙光作品【' + gname + '】等你好久啦！戳链接马上试玩~',// 图片标题
                    from:'' // 来源
        };
            shareApp=new nativeShare("share-modal",config);
        switch($(this).data('share')){
            case 'weibo' :
                if (isqqBrowser || isucBrowser) {
                    shareApp.share("sinaWeibo");
                } else {
                    openShareWindow('http://service.weibo.com/share/share.php?', {
                        appkey : '2pcGaX',
                        url :shareUrl,
                        title : '曲折的作品剧情太过瘾，橙光作品【' + gname + '】等你好久啦！戳链接马上试玩~',
                        pic : img_src
                    });
                }
                break;
            case 'qzone' :
                openShareWindow('http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?', {
                    url: shareUrl,
                    title: '曲折的作品剧情太过瘾，橙光作品【' + gname + '】等你好久啦！戳链接马上试玩~',
                    summary: '曲折的作品剧情太过瘾，橙光作品【' + gname + '】等你好久啦！戳链接马上试玩~',
                    pics: img_src
                });
                break;
            case 'wechat' :
            //shareUrl = encodeURIComponent(shareUrl);

                if (isqqBrowser || isucBrowser) {
                    //this.html();
                    shareApp.share("weixin");
                } else {
                    var share_modal = $('.share-modal'),
                        share_modal_box = share_modal.find('.share-modal-box');
                    share_modal_box.hide();
                    shareUrl = encodeURIComponent(shareUrl);
                    $('.share-modal').append('<div class="share-wechat-qrcode" style="border-radius:8px;box-shadow: 0 0 6px 0 rgba(0,0,0,0.4);height:24rem;width:20rem;position:absolute;left:50%;top:50%;margin-left:-10rem;margin-top:-12rem;background:#FFF;"><div class="share-wechat-qrcode-close" style="position: absolute; right: -0.8rem; top: -0.8rem; height: 2rem; width: 2rem; border: 1px solid #FFF; border-radius: 1rem; box-shadow: 0 0 4px 0 rgba(0,0,0,0.6); background: url(http://c1.cgyouxi.com/website/orange/img/common/share/close.png) no-repeat center center #FFF; background-size: 100%;"></div><img src="http://s.jiathis.com/qrcode.php?url=' + shareUrl + '" style="width:92%;display:block;margin:auto;margin-top:0.8rem;" /><div style="height:2rem;padding:0 4%;"><span style="vertical-align:middle;">截屏后用微信识别，分享到朋友圈</span></div></div>');
                    //$('.share-modal').append('<div class="share-wechat-qrcode" style="z-index: 11;;box-shadow: 0 0 6px 0 rgba(0,0,0,0.4);height:19rem;width:16rem;position:absolute;left:50%;top:55%;margin-left:-8rem;margin-top:-10rem;background:#FFF;">' +
                    //    '<div class="share-wechat-qrcode-close" style="position: absolute; right: -0.8rem; top: -0.8rem; height: 2rem; width: 2rem; border: 1px solid #FFF; border-radius: 1rem; box-shadow: 0 0 4px 0 rgba(0,0,0,0.6); background: url(http://c1.cgyouxi.com/website/orange/img/common/share/close.png) no-repeat center center; background-size: 100%;"></div>' +
                    //    '<img src="http://s.jiathis.com/qrcode.php?url=' + share_href + '" style="width:92%;display:block;margin:auto;margin-top:0.8rem;z-index:1;" />' +
                    //    '<div style="height:2rem;padding:0 4%;"><span style="vertical-align:middle;">截屏后用微信识别，分享到朋友圈</span></div></div>');
                    ReDirectSharetes();
                }
                break;
            case "qq":
           // shareUrl = encodeURIComponent(shareUrl);
                if (isqqBrowser || isucBrowser) {
                    //this.html();
                    shareApp.share("QQ");
                }else{
                    openShareWindow('http://connect.qq.com/widget/shareqq/index.html?', {
                        url: shareUrl,
                        title: '曲折的作品剧情太过瘾，橙光作品【' + gname + '】等你好久啦！戳链接马上试玩~',
                        summary: '曲折的作品剧情太过瘾，橙光作品【' + gname + '】等你好久啦！戳链接马上试玩~',
                        pics: img_src
                    });
                }
                break;
        }
    });
    $('.share-modal').delegate('.share-wechat-qrcode-close', 'click', function(){
        $('.share-wechat-qrcode').remove();
        $('.share-modal > .share-modal-box').show();
        $(".share-mask").hide();
        window.shareModal('hide');
    });
    function openShareWindow(f, e) {
        var h = [], g;
        for (g in e) {
            h.push(g + "=" + encodeURIComponent(e[g] || ""));
        }
        h = f + h.join("&");
        //window.location.href = h;
        window.open(h,"_blank"); 
    }
});