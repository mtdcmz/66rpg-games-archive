/**
 * Created by 七夕小雨 on 2014/11/22.
 */
function DGameVariables(){
    this.data = new Array();
    this.ExReset = "";

    for(var i = 0 ; i < this.data.length ; ++i){
        this.data[i] = null;
    }

    this.getVar = function(id){
        if(this.data[id] == null){
            this.data[id] = 0;
        }
        return this.data[id];
    };

    this.setVar = function(id,v){
        this.data[id] = parseInt(v);
    };

    this.saveData = function(arr){
        //只存有效数据 (1)数据长度 (2)数据结构 编号 数据 
        var efflen = 0;
        for (var i = 0; i < this.data.length; i++) {
            if(this.data[i] == null){
                continue;
            }
            //console.log("data-----------.["+i+"]",this.data[i]) ;
            arr.push(i + "|",this.data[i] + "|");
            efflen += 1;
        }
        arr.unshift(efflen + "|");
    }
    this.loadData = function(arr){
        var efflen = parseInt(arr.shift());
        //清除游戏数据
        for(var i = 0 ; i < this.data.length ; ++i){
            this.data[i] = null;
        }

        for(var i = 0 ; i < efflen ; ++i){
            var pos = parseInt(arr.shift());
            this.data[pos] = parseInt(arr.shift());
        }

    }

    this.saveExData = function (callBack) {
        var tvarsEx = "";
        if(this.ExReset){
            tvarsEx = this.ExReset;
            this.ExReset="";
        }else{
            var tvarsExArr = new Array();
            tv.system.varsEx.saveData(tvarsExArr);
            for(var i = 0 ; i < tvarsExArr.length ; ++i){
                tvarsEx += tvarsExArr[i];
            }
        }
        if(operationCloud.getUid()!=0){
            if(operationFrame.getIsFree()){
                var str = "#limit=1";
                var s8 = "varsEx=" + tvarsEx + "#time="+parseInt(Date.now()/1000)+str+"#new=true#platform=H5";
                CloudLimitExData = s8;
            }else{
                var str = "#limit=0";
                var s8 = "varsEx=" + tvarsEx + "#time="+parseInt(Date.now()/1000)+str+"#new=true#platform=H5";
                operationFrame.setNewLocalExData(s8);
            }
            operationCloud.startExStack(s8);
        }else{
            var str = "#limit=0";
            var s8 = "varsEx=" + tvarsEx+"#time="+parseInt(Date.now()/1000)+str+"#new=true#platform=H5";
            window.localStorage.setItem(guid+"varsEx"+operationCloud.getUid(), s8);
        }
    };
    this.loadExData= function (callBack,varsEx) {
        var data=new Object();
        var str;

        if(operationCloud.getUid()!=0){
            //登陆了
            if(operationFrame.getIsFree()){
                //限免
                if(CloudLimitExData)str = CloudLimitExData;
            }else{
                //非限免
                str = operationFrame.getNewLocalExData();
            }
            if(!str){
                //没值----看看本地有没有匿名二周目
                var newLocalEx = window.localStorage.getItem(guid+"varsEx"+"0");
                if(newLocalEx){
                    str = newLocalEx;
                    var tvarsExArr = newLocalEx.split("#");
                    this.ExReset = tvarsExArr[0].split("=")[1];
                    this.saveExData();
                    window.localStorage.removeItem(guid+"varsEx"+"0");
                }else{
                    var localAll = window.localStorage.getItem(guid+"varsEx");
                    if(localAll){
                        window.localStorage.setItem(guid+"varsEx|blq",localAll);
                        window.localStorage.removeItem(guid+"varsEx");
                        var strVer = localAll.split("=");
                        if(strVer.length<=2){
                            //console.log('最原始的二周目没有经过处理的');
                            var strVer = strVer[1];
                            if(strVer.length>3){
                                this.ExReset = strVer;
                                this.saveExData();
                            }
                        }
                    }
                }
                str = operationFrame.getNewLocalExData();
            }
        }else{
            //没有登陆
            //console.log("没有登陆");
            var newLocalEx = window.localStorage.getItem(guid+"varsEx"+"0");

            if(newLocalEx){
                str = newLocalEx;
            }else{
                var localAll = window.localStorage.getItem(guid+"varsEx");
                if(localAll){
                    window.localStorage.setItem(guid+"varsEx|blq",localAll);
                    window.localStorage.removeItem(guid+"varsEx");
                    var strVer = localAll.split("=");
                    if(strVer.length<=2){
                        //console.log('最原始的二周目没有经过处理的');
                        var strVer = strVer[1];
                        if(strVer.length>3){
                            this.ExReset = strVer;
                            this.saveExData();
                        }
                        str = window.localStorage.getItem(guid+"varsEx"+"0");
                    }
                }
            }
        }
        if(str){
            str=str.split("#");
            if(str.length>=4){
                var s8 = str[0].split("=");
                if(s8[0] == "varsEx"){
                    var tvarsExArr = s8[1].split("|");
                    tv.system.varsEx.loadData(tvarsExArr);
                }
            }

        }
    };
}