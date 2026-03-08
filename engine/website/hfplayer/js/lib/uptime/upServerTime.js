/**
 * Created by heshang on 2016/1/26.
 */
//上报时间戳
var pTime=30;//控制有效操作
var runTime=0;//控制运行时长
var upT=2;//上报时间间隔（分钟）
var systemTime=new Object();
//var ajaxUrl="http://c.66rpg.com/collect/v1/";
function upServerTime(uid,gIndex){
    //这个地方获取一次系统时间和本地时间戳
    $.ajax({
        url:AJAX_URL.GAME_SYSTEM_TIME,
        type:"get",
        dataType:"jsonp",
        jsonp:"jsonCallBack",
        success: function (data) {
            if(parseInt(data.status) == 1){
                systemTime.sysTimestramp=data.data.timestramp;//系统时间戳
                systemTime.nowTimestramp=Math.floor(new Date().getTime()/1000);
            }else{
                systemTime.sysTimestramp=0;
                systemTime.nowTimestramp=Math.floor(new Date().getTime()/1000);
            }
        },
        error: function (e) {
            systemTime.sysTimestramp=0;
            systemTime.nowTimestramp=Math.floor(new Date().getTime()/1000);
        }
    });
    //get的请求方法
    var getPara= function (url,callBack) {
        $.ajax({
            url:url,
            type:"get",
            dataType:"json",
            success: function (data) {
                if(data.status==1){
                    callBack(data);
                }else{
                    console.log(data);
                    callBack(-1);
                }
            },
            error: function () {
                callBack(-1);
            }
        })
    }
    //post的请求方法
    var postPara= function (url,data,callBack) {
        $.ajax({
            url:url,
            type:"post",
            data:data,
            dataType:"json",
            success: function (data) {
                if(data.status==1){
                    callBack(data);
                }else{
                    console.log(data);
                    callBack(-1);
                }
            },
            error: function () {
                callBack(-1);
            }
        })
    }

    //上报服务器的秒数
    var postT=upT*60;
   //获取公钥
    var key;
    var date=new Date().getDate();
    //ajaxUrl+"index/getkey"
    var url=AJAX_URL.UP_GAME_GET_KEY+"?uid="+uid+"&data="+date+"&check=";
    //获取公钥
    var hours=new Date().getHours();
    //首次获取公钥
    getPara(url,function(data){
        if(data!=-1){
            key=data.data;

            //看本地是否有缓存，有就上传一次
            var haveLocal=window.localStorage.getItem(uid+gIndex+"time");
            if(haveLocal!=null){
                upTimeT();
            }
        }
    });
    var failArr=new Array();
    //每过一小时获取一次key
    var getkeyt=setInterval(function () {
        pTime-=1;
        if(pTime<=0){
            pTime=0;
        }else{
            postT-=1;
            runTime+=1;
        }
        //控制上报时间
        if(postT<=0){
            upTimeT();
            postT=upT*60;
        }
        //每隔一小时获取一次key
        var h=new Date().getHours();
        if(h!=hours){
            hours=h;
            getPara(url,function(data){
                if(data!=-1){
                    key=data.data;
                }
            });
        }
    },1000);

    //上报运行时间
    function upTimeT(){
        //ajaxUrl+"index/runtime";
        var url=AJAX_URL.UP_GAME_RUN_TIME;
        failArr=new Array();
        var upStr=window.localStorage.getItem("runtime");
        var str="";
        var objArr=new Array();
        var objIndexArr=new Array();
        if(upStr){
            var objStr=upStr.split('|');
            for(var i=0;i<objStr.length;i++){
                if(objStr[i].length>1){
                    failArr.push(objStr[i]+"|");
                    objIndexArr.push(objStr[i].split('_')[0])
                    objArr.push(objStr[i].split('_')[1]);
                }
            }
        }
        var obj=new Object();
        var str='{"run":{';
        for(var i=0;i<objArr.length;i++){
            str+='"'+objIndexArr[i]+'"'+':'+objArr[i]+',';
        }
        str=str+'"'+gIndex+'"'+':'+runTime+'}}';
        obj.data=str;
        if(parseInt(uid)!=operationCloud.getUid()){
            uid = publicUses.getUserInfo().uid;
        }
        obj.uid=uid;
        obj.ts=Math.round(new Date().getTime()/1000);
        obj.check=md5(obj.data+uid+obj.ts+key);
        obj.platform=3;
        //如果有效操作的情况下，上报
        if(pTime>0){
            postPara(url,obj, function (data) {
                if(data!=-1){
                    //上报成功清空uid gindex对应数据
                    failArr.length=0;
                    failArr=new Array();
                    window.localStorage.removeItem("runtime");
                }else{
                    //上报失败，记录下来，下一次上报上去
                    var failTime=gIndex+"_"+runTime+"|";
                    failArr.push(failTime);
                    var str1="";
                    for(var i=0;i<failArr.length;i++){
                        str1+=failArr[i];
                    }
                    window.localStorage.setItem("runtime",str1);
                }
                runTime=0;
            });
        }
    }
    if(parseInt(uid) !== 0){
        //上报uv;
        var date=new Date();
        var dateYMD=date.getFullYear()+date.getMonth()+date.getDate();
        var uvPara=window.localStorage.getItem(uid+gIndex+dateYMD);
        if(uvPara==null){
            var data=new Object();
            data.gindex=gIndex;
            data.uid=uid;
            //ajaxUrl+"index/set_match_game_uv"
            postPara(AJAX_URL.UP_GAME_UV,data, function (data) {
                window.localStorage.setItem(uid+gIndex+dateYMD,data);
            });
        }
    }
    //上报pv
    var data=new Object();
    data.gindex=gIndex;
    data.platform=3;
    //ajaxUrl+"index/set_game_pv_post"
    postPara(AJAX_URL.UP_GAME_PV,data, function (data) {});
}
