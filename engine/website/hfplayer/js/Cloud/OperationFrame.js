/**
 * Created by heshang on 2016/9/9.
 */
/// <summary>
/// 当前帧操作
/// </summary>
function OperationFrame(){
    IFrameSave.call(this);
    /// <summary>
    ///  反序列化帧信息  int：存档索引   string：存档内容 （json）
    /// </summary>
    this.ParseFrameInfo = function(index,frameInfo){
        try{
            //FreameInfo = null;
            tv.system.rwFile.buttonFreeLimit[index] = frameInfo.Header.IsFreeLimit;
            if(serverAjax&&serverAjax.userFlowerInfo){
                var sendFlower = parseInt(serverAjax.userFlowerInfo.fresh_flower_num)+parseInt(serverAjax.userFlowerInfo.wild_flower_num/100);
                var tanhua = parseInt(serverAjax.userFlowerInfo.tanhua_flower_num);
            }else{
                var sendFlower = 0;
                var tanhua = 0;
            }
            //var sendFlower = parseInt(serverAjax.userFlowerInfo.fresh_flower_num);
            if(tanhua==0 && frameInfo.Header.IsFreeLimit ==1 && sendFlower < parseInt(flower_unlock)){
                var num = parseInt(flower_unlock)-sendFlower;
                //还差一个兑换流程
                var imgList = [
                    {"name":"alertBack","src":M_IMG_SERVER_URL+"hfplayer/img/Cloud/MoreAlertBack.png",type:1},
                    {"name":"img1","src":M_IMG_SERVER_URL+"hfplayer/img/Cloud/AlertLeft.png",type:1},
                    {"name":"close","src":M_IMG_SERVER_URL+"hfplayer/img/Cloud/AlertClose.png",type:1},
                    {"name":"img2","src":M_IMG_SERVER_URL+"hfplayer/img/Cloud/AlertRight.png",type:1}
                ];
                sVLoadImg.loadImgData(imgList,function(arr){
                    var obj = [
                        {"callBack":function(){},"Name":"取消", "Color":"#333333","image1":arr["img1"],"image2":arr["img1"],x:10,y:arr["alertBack"].height-8-arr["img1"].height},
                        {"callBack":function(){
                            if(mark == "aBox"){
                                if(typeof window.org_box == 'undefined'){
                                    sLoading.hideMask();
                                }else{
                                    if(ismod == "true"){
                                        window.org_box.newMenuSendFlower(!isVertical,parseInt(gIndex),modId);
                                    }else{
                                        window.org_box.newMenuSendFlower(!isVertical,parseInt(gIndex));
                                    }
                                }
                                return;
                            }else{
                                var scene = tv.scene;
                                tv.scene = new SCGSendFlower(scene);
                            }
                            return;
                        },"Name":"送花", "Color":"#ff8a54","image1":arr["img2"],"image2":arr["img2"],x:160,y:arr["alertBack"].height-8-arr["img1"].height
                        },
                        {"callBack":function(){},"Name":"", "Color":"#ff8a54", "image1":arr["close"],"image2":arr["close"],x:260,y:6},
                    ];
                    var num = parseInt(flower_unlock)-sendFlower;
                    sLoading.showAlertMoreBtn(arr["alertBack"],"作品限免已结束，限免存档需要补送"+num+"朵鲜花才能继续使用",obj);
                });
                return false;
            }else if(tanhua==0 && frameInfo.Header.IsFreeLimit ==1&&sendFlower >= parseInt(flower_unlock)){
                //非限免期间，鲜花够，点击限免档
                operationCloud.DownLoadSaveExInfo("limitfree",function(data){
                    if(parseInt(data.status)==1&&data.data&&data.data.split("#").length>=4){
                        var frameInfo = operationFrame.getLocalCloudData(index);
                        if(frameInfo){
                            frameInfo = JSON.parse(frameInfo);
                            frameInfo.Header.IsFreeLimit = 0;
                            operationFrame.setLocalCloudData(index,frameInfo);
                        }
                        if(data.data){
                            var limitData = data.data.split("#");
                            var varEx = limitData[0]+"#"+limitData[1]+"#limit=0#new=true#platform=H5";
                            operationFrame.setNewLocalExData(varEx);
                            operationCloud.UpLoadSaveExInfo("normal",varEx);
                            tv.system.varsEx.loadExData(function (data) {console.log(data)});
                            //将限免期间的数据上传到云上
                        }else{console.log("=============data.data.split(数据空");}
                    }
                });
                //把本地限免都换成正常档
                var button = [];
                var saveFileNum = tv.data.System.SaveData.max;
                if(parseInt(saveFileNum)>0&&operationCloud.getUid()){
                    for(var i = 0;i<parseInt(saveFileNum);i++){
                        button[i] = operationFrame.getLocalCloudData(i);
                        if(button[i]){
                            var theData = JSON.parse(button[i]);
                            if(theData.Header.IsFreeLimit == 1){
                                theData.Header.IsFreeLimit = 0;
                                theData.Header.SaveTime = theData.Header.SaveTime+1000;
                                tv.system.rwFile.buttonState[i] = SBTNSTATE.NEW;
                                operationFrame.setLocalCloudData(i,theData);
                            }
                        }
                    }
                    if(tv && tv.scene && tv.scene.isNeedSendFlower == "SSaveFile"){
                        tv.scene.makeUploadData();
                    }
                }
            }else{
                //读第一个云存档时，下载二周目
                if(isFirstDownVarEx){
                    isFirstDownVarEx = false;
                    if(operationFrame.getIsFree()){
                        //限免期间
                        operationCloud.DownLoadSaveExInfo("limitfree",function(data){
                            if(parseInt(data.status)==1&&data.data&&data.data.split("#").length>=4){
                                if(data.data){
                                    var limitData = data.data.split("#");
                                    var varEx = limitData[0]+"#time="+parseInt(Date.now()/1000)+"#limit=1#new=true#platform=H5";
                                    CloudLimitExData=varEx;
                                    if(varEx){
                                        var s8 = limitData[0].split("=");
                                        if(s8[0] == "varsEx"){
                                            var tvarsExArr = s8[1].split("|");
                                            tv.system.varsEx.loadData(tvarsExArr);
                                        }
                                    }
                                    //将限免期间的数据上传到云上
                                }else{console.log("=============limitfree.data");}
                            }
                        });
                    }else{
                        //正常期间
                        operationCloud.DownLoadSaveExInfo("normal",function(data){
                            if(parseInt(data.status)==1&&data.data&&data.data.split("#").length>=4){
                                if(data.data){
                                    var limitData = data.data.split("#");
                                    var varEx = limitData[0]+"#time="+parseInt(Date.now()/1000)+"#limit=0#new=true#platform=H5";
                                    operationFrame.setNewLocalExData(varEx);
                                    if(varEx){
                                        var s8 = limitData[0].split("=");
                                        if(s8[0] == "varsEx"){
                                            var tvarsExArr = s8[1].split("|");
                                            tv.system.varsEx.loadData(tvarsExArr);
                                        }
                                    }
                                    //将限免期间的数据上传到云上
                                }else{console.log("=============normal.data");}
                            }
                        });
                    }

                }
            }
            /**
             *----------Load---Logic-------
             * */
            tv.inter.loadCloudData(frameInfo.Logic);

            /**
             *----------Load---Vars,String-------
             * */
            var systemDefine = frameInfo.SystemDefine;
            var vars = systemDefine.Vars.split("|");
            tv.system.vars.loadData(vars);
            var varString = systemDefine.String.split("|");
            tv.system.string.loadData(varString);

            /**
             *----------Load---Canvas-------
             * */
            tv.canvas.loadCloudData(frameInfo.Canvas);

            /**
             *----------Load---Music-------
             * */
            tv.canvas.loadMusic(frameInfo.Music);

            /**
             *----------Load---ReplayMessage-------
             * */
            tv.system.replay.loadData(frameInfo.RePlay);
            return true;
        }catch(e){
            alert("ParseFrameInfo Error"+e);
            return false;
        }
    }

    /*
    * 限免期间并且送的花少于鲜花锁
    * */
    this.getIsFree = function () {
        if(serverAjax && serverAjax.userFlowerInfo){
            var tanhua = parseInt(serverAjax.userFlowerInfo.tanhua_flower_num);
            var sendFlower = parseInt(serverAjax.userFlowerInfo.fresh_flower_num)+parseInt(serverAjax.userFlowerInfo.wild_flower_num/100);
        }else{
            var tanhua = 0;
            var sendFlower = 0;
        }

        if(tanhua > 0 && sendFlower < parseInt(flower_unlock)){
            return true;
        }
        return false;
    }
    /*
     * 不限免期间并且送的花大于鲜花锁
     * */
    this.getNotIsFree = function () {
        if(serverAjax && serverAjax.userFlowerInfo) {
            var tanhua = parseInt(serverAjax.userFlowerInfo.tanhua_flower_num);
            var sendFlower = parseInt(serverAjax.userFlowerInfo.fresh_flower_num)+parseInt(serverAjax.userFlowerInfo.wild_flower_num/100);
        }else{
            var tanhua = 0;
            var sendFlower = 0;
        }
        if(tanhua == 0 && sendFlower >= parseInt(flower_unlock)){
            return true;
        }else{
            return false;
        }
    }
    /// <summary>
    ///  序列化帧信息   云存档
    /// </summary>
    this.DeParseFrameInfo = function(index){
        try{
            console.log("进入云存档打包>>>>>>",index);
            allDepth = 0;
            tv.system.rwFile.cloudState = CloudStatus.Deparseing;
            //版本号
            var version = "1.0.0.0913";

            var FreameInfo = new FrameInfo();
            /**m
             *
             *-------------Header-----Start-------------------------
             * */
                //序列化头信息
            FreameInfo.Header.Platform = "H5";
            FreameInfo.Header.Version = version;
            FreameInfo.Header.Name = gameTitle;
            FreameInfo.Header.StoryName = tv.inter.storyName;
            FreameInfo.Header.SaveTime = Date.now();

            //判断是否是限免时间或者限免档
            var isFreeTime = this.getIsFree();
            if(serverAjax&&serverAjax.userFlowerInfo&&serverAjax.userFlowerInfo.num){
                var sendFlower = parseInt(serverAjax.userFlowerInfo.num);
            }else{
                var sendFlower = 0;
            }

            if(!sendFlower){
                sendFlower = 0;
            }
            if(!isFreeTime){//非限免期间存档 覆盖掉限免档 消除掉限免标志
                //tv.system.rwFile.buttonFreeLimit[index] == 0;
            }else{//限免期间的判断  如果是以前是限免档或者存的是限免档 标志改为1
                if(tv.system.rwFile.buttonFreeLimit[index] == 1 || isFreeTime){
                    tv.system.rwFile.buttonFreeLimit[index] =1;
                    FreameInfo.Header.IsFreeLimit = tv.system.rwFile.buttonFreeLimit[index];
                }else{
                    FreameInfo.Header.IsFreeLimit = 0;
                }
            }

            /**
             *-------------Header-------END-----------------------
             * */

            /**
             *--------------Logic--------Start-----------------
             * */
                //序列化逻辑
            tv.inter.saveData(FreameInfo.Logic);
            /**
             *--------------Logic--------END-----------------
             * */

            /**
             *--------------SyatemDefine--------Start-----------------
             * */
            //序列化变量
            var varsArr = new Array();
            tv.system.vars.saveData(varsArr);
            var tvars = "";
            for(var i = 0 ; i < varsArr.length ; ++i){
                tvars += varsArr[i];
            }
            FreameInfo.SystemDefine.Vars = tvars;
            //序列化字符串
            var tstringArr = new Array();
            tv.system.string.saveData(tstringArr);
            var tstring = "";
            for(var i = 0 ; i < tstringArr.length ; ++i){
                tstring += tstringArr[i];
            }
            FreameInfo.SystemDefine.String = tstring;
            /**
             *--------------SyatemDefine--------END-----------------
             * */

            /**
             *--------------Canvas--------Start-----------------
             * */
            //序列化悬浮控件
            if(tv.canvas.sFloatButton && tv.canvas.sFloatButton.isFBOnOff){
                FreameInfo.Canvas.FloatStatus = 1;
            }else{
                FreameInfo.Canvas.FloatStatus = -1;
            }
            //序列化天气
            if(tv.canvas.weather){
                FreameInfo.Canvas.WeatherType = tv.canvas.weather.saveData();
            }else{
                FreameInfo.Canvas.WeatherType = 0;
            }
            //序列化图层
            var imgArr = new Array();
            tv.canvas.savePic(imgArr);
            var imgString = "";
            for(var i = 0 ; i < imgArr.length ; ++i){
                imgString += imgArr[i];
            }
            FreameInfo.Canvas.Layers = imgString;
            //序列化高级ui
            FreameInfo.Canvas.CuiIndex = tv.CUIFromIndex;
            //旋转
            var rotateArr = new Array();
            crotate.saveData(rotateArr);
            FreameInfo.Canvas.LayerRotateInfo = rotateArr;


            /**
             *--------------Canvas--------END-----------------
             * */


            /**
             *--------------Music--------Start-----------------
             * */
            tv.canvas.saveMusic(FreameInfo.Music);
            /**
             *--------------Music--------END-----------------
             * */


            /**
             *--------------Replay--------Start-----------------
             * */
            tv.system.replay.saveData(FreameInfo.RePlay);
            /**
             *--------------Replay--------END-----------------
             * */

            /**
             *--------------Thumbnail--------Start-----------------
             * */
            FreameInfo.Thumbnail.base64 = img_src;
            /**
             *--------------Thumbnail--------END-----------------
             * */
            console.log("云存档打包成功>>>>>>");
            //将数据存到本地
            //window.localStorage.setItem("cloud|"+operationCloud.getUid()+"|"+guid+"|"+index,JSON.stringify(FreameInfo));
            this.setLocalCloudData(index,FreameInfo);
            //存到本地后进入上传状态
            var cloudData = new Object();
            cloudData[index+1] = FreameInfo;
            //tv.system.rwFile.buttonState[index] = SBTNSTATE.LOADING;
            var cloudTask = new CloudTask(CloudTaskState.UPLOADSINGLE,cloudData, function (data) {
                tv.system.rwFile.cloudAllData[index+1] = FreameInfo;
                tv.system.rwFile.buttonState[index] = SBTNSTATE.OK;
            });
            operationCloud.startCloudStack(cloudTask);

            //存云档的时候上传二周目；
            var localNewExData = "";
            var localNewEx = "";
            if(operationFrame.getIsFree()){
                localNewExData = CloudLimitExData;
            }else{
                localNewExData = operationFrame.getNewLocalExData();
            }
            if(localNewExData){
                localNewEx = localNewExData.split('#')[0].split('=')[1];
                tv.system.varsEx.ExReset = localNewEx;
                tv.system.varsEx.saveExData();
            }
        }catch(e) {
            alert("DeParseFrameInfo Error" + e);
        }
    }
    //存储本地云数据
    this.setLocalCloudData = function (index,FreameInfo) {
        window.localStorage.setItem("cloud|"+operationCloud.getUid()+"|"+guid+"|"+index,JSON.stringify(FreameInfo));
    }
    //获取本地云数据
    this.getLocalCloudData = function (index) {
        return window.localStorage.getItem("cloud|"+operationCloud.getUid()+"|"+guid+"|"+index);
    }
    //存储本地二周目
    this.setLocalExData = function(varsEx){
        window.localStorage.setItem("cloud|"+operationCloud.getUid()+"|"+guid, varsEx);
    }
    //获取本地二周目
    this.getLocalExData = function(){
        return window.localStorage.getItem("cloud|"+operationCloud.getUid()+"|"+guid);
    }
    //存储本地二周目
    this.setNewLocalExData = function(varsEx){
        window.localStorage.setItem("cloud|"+operationCloud.getUid()+"|"+guid+"|limit0", varsEx);
    }
    this.getNewLocalExData = function(){
        return window.localStorage.getItem("cloud|"+operationCloud.getUid()+"|"+guid+'|limit0');
    }
    // 将字符串解析成二周目
    this.ParseFrameExInfo = function (varsEx) {
        var data = new Array();
        return data;
    }

    //将二周目数组生成字符串
    this.DeParseFrameExInfo = function (data) {
        var str ="";
        return str;
    }
    
    this.initCloudExData = function () {
        try{
            //获取一下存档状态；
            if(operationCloud.getUid()!=0){
                //登录上
                var CloudLimitData = "";
                var CloudLimitTime = 0;

                var CloudNormalData = "";
                var CloudNormalTime = 0;

                var newLocalData = "";
                var newLocalTime = 0;

                var oldLocalData = "";
                var oldLocalTime = 0;

                var NewExTime;
                newLocalData = operationFrame.getNewLocalExData();
                if(newLocalData){
                    newLocalTime = parseInt(newLocalData.split('#')[1].split('=')[1]);
                }else{
                    oldLocalData = operationFrame.getLocalExData();
                    if(oldLocalData){
                        oldLocalTime = parseInt(oldLocalData.split("&")[1].split('=')[1]);
                    }
                }
                if(operationFrame.getIsFree()){
                    //直接打开云
                    operationCloud.isOpen = true;
                    //如果有新的，不用旧的。本地都是未限免的。
                    function updataEx(){
                        NewExTime = Math.max(newLocalTime,oldLocalTime,CloudLimitTime,CloudNormalTime);
                        if(NewExTime !=0){
                            if(NewExTime != CloudLimitTime){
                                if(NewExTime == newLocalTime){
                                    CloudLimitExData=newLocalData;
                                    operationCloud.UpLoadSaveExInfo("limitfree", newLocalData);
                                }else if(NewExTime == oldLocalTime){//以前的
                                    window.localStorage.setItem("cloud|"+operationCloud.getUid()+"|"+guid+"|blq",oldLocalData);
                                    window.localStorage.removeItem("cloud|"+operationCloud.getUid()+"|"+guid);
                                    var LimitEx = oldLocalData.split("&")[0].split("=")[1];
                                    var LimitData = "varsEx="+LimitEx+'#time='+parseInt(Date.now()/1000)+"#limit=1#new=true#platform=H5";
                                    CloudLimitExData=LimitData;
                                    operationCloud.UpLoadSaveExInfo("limitfree", LimitData);
                                }else if(NewExTime == CloudNormalTime){
                                    CloudLimitExData=CloudNormalData;
                                    operationCloud.UpLoadSaveExInfo("limitfree", CloudNormalData);
                                }
                            }else{
                                CloudLimitExData = CloudLimitData;
                            }
                        }
                    }
                    //获取云存档后比较本地与云上大小  云上大 替换，云上小  上传
                    operationCloud.DownLoadSaveExInfo("limitfree",function(data){
                        if(parseInt(data.status)==1&&data.data&&data.data.split("#").length>=4){
                            CloudLimitData = data.data;
                            CloudLimitTime = parseInt(data.data.split('#')[1].split('=')[1]);
                        }
                        operationCloud.DownLoadSaveExInfo("normal",function(data2){
                            if(parseInt(data2.status)==1&&data2.data&&data2.data.split("#").length>=4){
                                CloudNormalData = data2.data;
                                CloudNormalTime = parseInt(data2.data.split('#')[1].split('=')[1]);
                            }
                            updataEx();
                            tv.system.varsEx.loadExData(function (data) {console.log(data)});
                        })
                    });
                }else{
                    operationCloud.getOpenCloudState(function (bool,data) {});
                    NewExTime = Math.max(newLocalTime,oldLocalTime);
                    if(NewExTime != 0){
                       if(NewExTime == oldLocalTime){//以前的
                            window.localStorage.setItem("cloud|"+operationCloud.getUid()+"|"+guid+"|blq",oldLocalData);
                            window.localStorage.removeItem("cloud|"+operationCloud.getUid()+"|"+guid);
                            var LimitEx = oldLocalData.split("&")[0].split("=")[1];
                            var LimitData = "varsEx="+LimitEx+'#time='+parseInt(Date.now()/1000)+"#limit=0#new=true#platform=H5";
                            operationFrame.setNewLocalExData(LimitData);
                        }
                    }
                    tv.system.varsEx.loadExData(function (data) {console.log(data)});
                }
            }else{
                // 没有登录上
                operationCloud.isOpen = false;
                tv.system.varsEx.loadExData(function (data) {console.log(data)});
            }
        }catch(e){
            alert("initCloudExData Error"+e);
        }
    }
}
var operationFrame = new OperationFrame();