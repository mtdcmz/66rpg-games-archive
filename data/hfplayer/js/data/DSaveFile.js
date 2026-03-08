/**
 * Created by heshang on 2015/10/29.
 */

function saveFile(){
	var self = this;
	//用来控制切换云存档档界面显示
	this.isCloud = false;
	//控制云存档的状态
	this.cloudState = CloudStatus.None;
    //控制每个档位的状态
	this.buttonState = new Array();
    //保存从云上读取下来的信息
	this.cloudAllData = null;
    //保存每个档位的限免标志
	this.buttonFreeLimit = new Array();


	/*
	 * 存档外部函数调用接口
	 */
	this.saveData = function(index,bIscloud){
		if(this.isCloud){
			this.cloudSaveData(index);
			return true;
		}
		//return;
		//内存数据
		var saveArray = new Array();

		//<0 存储日期
		var tTime = new Date(); //获取当前时间　

		var getHours = tTime.getHours();
		var getMinutes = tTime.getMinutes();
		var getSeconds = tTime.getSeconds();
		if(parseInt(getHours) <= 9) getHours = '0' + getHours;
		if(parseInt(getMinutes) <= 9) getMinutes = '0' + getMinutes;
		if(parseInt(getSeconds) <= 9) getSeconds = '0' + getSeconds;


		tTime = tTime.getFullYear() + '/' + (parseInt(tTime.getMonth())+1) +'/'+tTime.getDate()+' '+getHours+':'+getMinutes+':'+getSeconds;
		var s0 = "time=" + tTime + "@";
		saveArray.push(s0);

		//<1 storyname
		var s1 = "storyname=" + tv.inter.storyName +"@";
		saveArray.push(s1);

		//<2 imain
		var tImainArr = new Array();
		tv.inter.saveData(tImainArr);
		var tImain = "";
		for(var i = 0 ; i < tImainArr.length; ++i){
			tImain += tImainArr[i];
		}
		var s2 = "imain=" + tImain + "@";
		saveArray.push(s2);

		//<3 vars
		var tvarsArr = new Array();
		tv.system.vars.saveData(tvarsArr);
		var tvars = "";
		for(var i = 0 ; i < tvarsArr.length ; ++i){
			tvars += tvarsArr[i];
		}
		var s3 = "vars=" + tvars + "@";
		saveArray.push(s3);

		//<4 string 本地存储旧字符串
		/*var tstringArr = new Array();
		tv.system.string.saveData(tstringArr);
		var tstring = "";
		for(var i = 0 ; i < tstringArr.length ; ++i){
			tstring += tstringArr[i];
		}
		var s4 = "string=" + tstring + "@";
		saveArray.push(s4);*/

		//<4 string 本地存储，新的
		var tstringObj = new Object();
		var strDate = tv.system.string.saveDataStr(tstringObj);
		var tstring = "";
		for(var name in strDate){
			tstring += name+'|';
			tstring += strDate[name]+'|';
		}
		var s4 = "stringCode=" + tstring + "@";
		saveArray.push(s4);

		//<5 canvas
		var tcanvasArr = new Array();
		tv.canvas.saveData(tcanvasArr);
		var tcanvas = "";
		for(var i = 0 ; i < tcanvasArr.length ; ++i){
			tcanvas += tcanvasArr[i];
		}
		var s5;
		if(tv.canvas.isShowTextStyle == 0){
			s5 = "canvas=" + encodeURIComponent(tcanvas) + "@";
			saveArray.push(s5);
		}else{
			s5 = "lifeline=" +encodeURIComponent(tcanvas)+ "@";
			saveArray.push(s5);
		}
		//<6 replay
		var treplayArr = new Array();
		tv.system.replay.saveData(treplayArr);
		var treply = "";
		for(var i = 0 ; i < treplayArr.length ; ++i){
			treply += treplayArr[i];
		}
		var s6 = "replay=" + encodeURIComponent(treply) + "@";
		saveArray.push(s6);

		//<7 cuifrongindex
		var s7 = "cuiindex=" + tv.CUIFromIndex + "@";
		saveArray.push(s7);

		var s8 = "saveIcon="+img_src+"@";
		saveArray.push(s8);

		//悬浮组件
		if(tv.canvas.sFloatButton){
			var s9 = "sFloatBut=" +tv.canvas.sFloatButton.saveFbFlag +"@";
		}else{
			var s9 = "sFloatBut=" +false +"@";
		}
		saveArray.push(s9);

		//限免
		if(operationFrame.getIsFree()){
			var s10 ="limit="+1+"@";
			saveArray.push(s10);
		}else{
			var s10 ="limit="+0+"@";
			saveArray.push(s10);
		}

		//视频
		var videoMarStr = "";
		var videoMarObj = {};
		ovideo.saveData(videoMarObj);
		for(var name in videoMarObj){
			videoMarStr+=videoMarObj[name]+'|';
		}		
		var s11 = "videoMgr="+videoMarStr+"@";
		saveArray.push(s11);


		var storageValue = "";
		for(var i = 0 ; i < saveArray.length ; ++i){
			storageValue += saveArray[i];
		}
		var bsaveOk = false;

		//local or cloud
		if(this.isCloud){
			return this.cloudSaveData(index,storageValue);
		}else{
			bsaveOk = this.localSaveData(index,storageValue);
		}
		//console.log(storageValue);
		storageValue="";
		//清除数据
		saveArray.length = 0;
		return bsaveOk;
	}
	/*
	 * 读档外部函数调用接口
	 */
	this.loadData = function(index,bIscloud){
		if(tv.system.rwFile.isCloud){
			//var dataString = window.localStorage.getItem("cloud|"+parseInt(publicUses.getUserInfo().uid)+"|"+guid+"|"+index);
			var dataString = operationFrame.getLocalCloudData(index);
			var data = JSON.parse(dataString);
			if(data){
				return this.cloudLoadData(index,data);
			}else{
				return false;
			}
			return true;
		}
		//var data;
		//0324 p.s:云读档是异步 调试结束后再整合这个函数
		try{
			//只创建新的，不覆盖，只读新的
			var data =oldMoveNewData(index);
			//var data=myData["index"+index];
		}catch(e){
			console.log("Dsavefile<<<loadData<<<安卓webview无法使用localStorage");
			return false;
		}

		if(data == null){
			return false;
		}else{
			var strs = data.split("@");
			//0,1
			//2 imain

			//判断普通档位是否是限免档
			/*if(strs[10]){
				var s10 = strs[10].split('=');
				if(s10[0] == "limit"){
					if(serverAjax&&serverAjax.userFlowerInfo){
						var sendFlower = parseInt(serverAjax.userFlowerInfo.fresh_flower_num)+parseInt(serverAjax.userFlowerInfo.wild_flower_num/100);
						var tanhua = parseInt(serverAjax.userFlowerInfo.tanhua_flower_num);
					}else{
						var sendFlower = 0;
						var tanhua = 0;
					}
					var limit = parseInt(s10[1]);
					if(limit == 1){
						if(operationFrame.getIsFree()){
							//限免
						}else{
							var oldLocalData = window.localStorage.getItem("cloud|"+operationCloud.getUid()+"|"+guid);
							if(oldLocalData){
								var LimitEx = oldLocalData.split("&")[0].split("=")[1];
								tv.system.varsEx.ExReset = LimitEx;
								tv.system.varsEx.saveExData();
							}else{
								var blqOldLocalData = window.localStorage.getItem("cloud|"+operationCloud.getUid()+"|"+guid+"|blq");
								if(blqOldLocalData){
									var LimitEx = blqOldLocalData.split("&")[0].split("=")[1];
									tv.system.varsEx.ExReset = LimitEx;
									tv.system.varsEx.saveExData();
								}

							}
						}
					}

					/!*if(tanhua == 0 && limit ==1 && sendFlower < parseInt(flower_unlock)){
						//function(){
						//	//alert("兑换界面");
						//	var scene = tv.scene;
						//	tv.scene = new SCGSendFlower(scene);
						//	return;
						//}
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
									if(operationCloud.getUid()!=0){
										var scene = tv.scene;
										tv.scene = new SCGSendFlower(scene);
										return;
									}else{
										if(!self.checkLogin()){
											return;
										}
									}

									},"Name":"送花", "Color":"#ff8a54","image1":arr["img2"],"image2":arr["img2"],x:160,y:arr["alertBack"].height-8-arr["img1"].height
								},
								{"callBack":function(){},"Name":"", "Color":"#ff8a54", "image1":arr["close"],"image2":arr["close"],x:260,y:6},
							];
							var num = parseInt(flower_unlock)-sendFlower;
							sLoading.showAlertMoreBtn(arr["alertBack"],"游戏限免已结束，限免存档需要补送"+num+"朵鲜花才能继续使用",obj);
						});
						return false;
					}*!/
				}else{
					//
					console.log("能够读二周目了")
				}
			}*/

			//var sendFlower = parseInt(serverAjax.userFlowerInfo.fresh_flower_num);


			var s2 = strs[2].split("=");
			if(s2[0] == "imain"){
				var timainArr = s2[1].split("|");
				tv.inter.isLoad=true;
				tv.inter.loadData(timainArr);
			}

			//3 vars
			var s3 = strs[3].split("=");
			if(s3[0] == "vars"){
				var tvarsArr = s3[1].split("|");
				tv.system.vars.loadData(tvarsArr);
			}


			//4 string
			var s4 = strs[4].split("=");
			var tstringArr = s4[1].split("|");
			if(s4[0] == "string"){//旧字符串
				tv.system.string.loadData(tstringArr);
			}else if(s4[0] == "stringCode"){ //新字符串
				var strObj = {};
				var index = 0;
				for(var i=0;i<parseInt(tstringArr.length)/2;i++){
					strObj[tstringArr[index]]=tstringArr[index+1];
					index+=2;
				}
				tv.system.string.loadDataStr(strObj);
			}

			//5 canvas
			var s5 = strs[5].split("=");
			if(s5[0] == "canvas"){
				var tcanvasArr = decodeURIComponent(s5[1]).split("|");
				tv.canvas.loadData(tcanvasArr);
			}else if(s5[0] == "lifeline"){
				var tcanvasArr = decodeURIComponent(s5[1]).split("|");
				tv.canvas.loadLifeData(tcanvasArr);
			}
			//6 replay
			var s6 = strs[6].split("=");
			if(s6[0] == "replay"){
				var treplayArr = decodeURIComponent(s6[1]).split("|");
				tv.system.replay.loadData(treplayArr);
			}

			//7 cuifrongindex
			var s7 = strs[7].split("=");
			if(s7[0] == "cuiindex"){
				var tscui = s7[1];
				tv.CUIFromIndex = parseInt(tscui);
			}

			//9 悬浮组件
			var s9 = strs[9].split("=");
			if(s9[0]=='sFloatBut'){
				if(tv.canvas.sFloatButton){
					tv.canvas.sFloatButton.loadData(s9[1]);
				}
			}
			//10 视频存读档
			if(strs[11]){
				var s11 = strs[11].split("=");
				if(s11[0]=="videoMgr"){
					ovideo.loadData(s11[1]);
				}
			}else{
				var s11 = strs[10].split("=");
				if(s11[0]=="videoMgr"){
					ovideo.loadData(s11[1]);
				}
			}


			////3 varsEx
			//var s8 = strs[8].split("=");
			//if(s8[0] == "varsEx"){
			//	var tvarsExArr = s8[1].split("|");
			//	tv.system.varsEx.loadData(tvarsExArr);
			//}
			return true;
		}
	}

	/*
	 * 本地存读档场景每个存档的文字信息数据:日期,名称
	 */
	this.loadHeadData = function(index){
		//try{
			if(tv.system.rwFile.isCloud){
				//var dataString = window.localStorage.getItem("cloud|"+parseInt(publicUses.getUserInfo().uid)+"|"+guid+"|"+index);
				var dataString = operationFrame.getLocalCloudData(index);
				var data = JSON.parse(dataString);
				//console.log(data);
				return this.loadHeadCloudData(data);
			}else{
				//如果这个用户从来没有同步过
				var data =oldMoveNewData(index);
/*
				var data = window.localStorage.getItem("orgsave"+ guid + index+operationCloud.getUid());
*/
				return this.loadHeadLocalData(data);
			}
		//}catch(e){
		//	console.log("Dsavefile<<<loadHeadData<<<安卓webview无法使用localStorage");
		//	return null;
		//}
	}
	this.loadHeadLocalData = function (data) {
		if(data == null){
			return null;
		}else{
			//console.log(index);
			//console.log(data);
			var targs = new Array();
			var strs = data.split("@");

			//0 time
			var s0 = strs[0].split("=");
			if(s0[0] == "time"){
				//2017/2/8 20:0
				if(s0[1]){
					//var LenTimer = s0[1].split(" ");  //2017/2/8
					var TimerArr = s0[1].split(":");
					if(TimerArr.length<=2){
						if(TimerArr[1].length==1){
							TimerArr[1] = "0"+TimerArr[1];
						}
						s0[1] = TimerArr[0]+':'+ TimerArr[1]+":"+"00";
					}
				}
				targs[0] = s0[1];
			}

			//1 stroyname
			var s1 = strs[1].split("=");
			if(s1[0] == "storyname"){
				targs[1] = s1[1];
			}
			var s8=strs[8].split("=");
			if(s8[0] == "saveIcon"){
				targs[2] = s8[1];
			}
			if(strs[10]){
				var s10 = strs[10].split('=');
				if(s10[0] == "limit")
				targs[3] = parseInt(s10[1])
			}
			return targs;
		}
	}
	this.loadHeadCloudData = function (data) {
		if(data == null){
			return null;
		}
		//data = JSON.parse(data);
		var targs = new Array();
		var tTime = new Date(parseInt(data.Header.SaveTime)); //获取当前时间　

		var getHours = tTime.getHours();
		var getMinutes = tTime.getMinutes();
		var getSeconds = tTime.getSeconds();
		if(parseInt(getHours) <= 9) getHours = '0' + getHours;
		if(parseInt(getMinutes) <= 9) getMinutes = '0' + getMinutes;
		if(parseInt(getSeconds) <= 9) getSeconds = '0' + getSeconds;

		tTime = tTime.getFullYear() + '/' + (parseInt(tTime.getMonth())+1) +'/'+tTime.getDate()+' '+getHours+':'+getMinutes+":"+getSeconds;

		targs.push(tTime);

		targs.push(data.Header.StoryName);

		targs.push(data.Thumbnail.base64);

		targs.push(parseInt(data.Header.SaveTime));

		targs.push(parseInt(data.Header.IsFreeLimit));

		return targs;
	}
	this.checkLogin = function () {
		sLoading.showMask();
		if(publicUses.getUserInfo().uid==0 && !serverAjax.userInfo){
			sLoading.hideMask();
			$(".ssologin")[0].click();
			return false;
		}else{
			sLoading.hideMask();
		}
		return true;
	}
	/*
	 * 本地存档:使用H5 WebStorage存储
	 */
	this.localSaveData = function(index,data){
		var bsaveOk = true;
		try {
			//只新建，不覆盖，不删除
			if(!operationCloud.getUid()){
				//没登录情况 存老数据
				var oldData=window.localStorage.getItem("orgsave"+guid+ index);
				if(oldData!=""){
					window.localStorage.removeItem("orgsave"+guid+ index);
				}
				window.localStorage.setItem("orgsave"+guid+ index, data);//sessionStorage临时  localStorage永久保存
			}else{
				//登录情况，有“|uid”
				var uidData = window.localStorage.getItem("orgsave"+guid+ index+'|'+operationCloud.getUid());
				if(uidData){
					window.localStorage.removeItem("orgsave"+guid+ index+'|'+operationCloud.getUid());
				}
				window.localStorage.setItem("orgsave"+guid+ index+'|'+operationCloud.getUid(), data);//sessionStorage临时  localStorage永久保存
			}


/*
			var uidData = window.localStorage.getItem("orgsave"+guid+ index+'|'+operationCloud.getUid());
			if(uidData){
				window.localStorage.removeItem("orgsave"+guid+ index+'|'+operationCloud.getUid());
			}
			window.localStorage.setItem("orgsave"+guid+ index+'|'+operationCloud.getUid(), data);//sessionStorage临时  localStorage永久保存
*/

			/*var oldData=window.localStorage.getItem("orgsave"+guid+ index);
			if(oldData!=""){
				var oldData=window.localStorage.removeItem("orgsave"+guid+ index);
			}
			//window.localStorage.setItem("orgsave"+guid+ index, data)
			window.localStorage.setItem("orgsave"+guid+ index+operationCloud.getUid(), data);*///sessionStorage临时  localStorage永久保存
		} catch(e) {
			bsaveOk = false;
			if(gIsApple && mark != "ios"){
				alert("您当前浏览器可能是无痕浏览模式，暂无法保存");
			}else{
				console.log("Dsavefile<<<localSaveData<<<window.localsave异常 ios可能是无痕模式 android webview无法使用");
			}
		}
		return bsaveOk;
	}
	///*
	// * 云存档
	// */
	this.cloudSaveData = function(index){
		operationFrame.DeParseFrameInfo(index);
	}
    //
	///*
	// * 云读档
	// */
	this.cloudLoadData = function(index,freameInfo){
		operationCloud.setCloudCount();
		return operationFrame.ParseFrameInfo(index,freameInfo);
	}

}
function oldMoveNewData(index){
	var data;
	if(!operationCloud.getUid()){
		//没登陆上  ---匿名
		var anonyLocalData = window.localStorage.getItem("orgsave"+ guid + index);
		if(anonyLocalData){
			data = anonyLocalData;
		}
	}else{
		//登陆上了 ----一个档位都没有---需要迁过来----有档位不需要迁移档位
		if(isMoveDaveFile){
			//这个用户已经有新的存档了，不需要将匿名档位通过来
			var uidLocalData = window.localStorage.getItem("orgsave"+ guid + index+'|'+operationCloud.getUid());
			if(uidLocalData){
				data = uidLocalData;
			}
		}else{
			//一个档位都没有---需要迁过来
			var anonyLocalData = window.localStorage.getItem("orgsave"+ guid + index);
			if(anonyLocalData){
				window.localStorage.setItem("orgsave"+guid+ index+'|blq', anonyLocalData);
				window.localStorage.removeItem("orgsave"+guid+ index);
				window.localStorage.setItem("orgsave"+guid+ index +'|'+operationCloud.getUid(), anonyLocalData);
				data = anonyLocalData;
			}
		}
	}
	return data;
}

function saveReplay(){

	//构造
	this.replay = new Array();

	this.Add = function(msg){
		if(this.replay.length > 50){
			//删除数组头
			this.replay.splice(0,1);
		}
		this.replay.push(tv.canvas.message[tv.canvas.msgIndex].TextAnalysisNull(msg));//
	}

	this.saveData = function(arr){
		if(tv.system.rwFile.isCloud){
			arr.length = this.replay.length;
			for(var i = 0;i<this.replay.length;i++){
				arr[i] = this.replay[i];
			}
		}else{
			var s1 = this.replay.length + "|";
			arr.push(s1);
			for(var i = 0; i < this.replay.length ; ++i){
				var s = this.replay[i] + "|";
				arr.push(s);
			}
		}
	}

	this.loadData = function(arr){
		if(tv.system.rwFile.isCloud){
			this.replay.length = 0;
			var length = arr["length"];
			for(var i = 0;i<length;i++){
				var ts = arr[i];
				this.replay.push(ts);
			}
		}else{
			this.replay.length = 0;
			var s1 = arr.shift();
			var len = parseInt(s1);
			for (var i = 0; i < len; i++) {
				var ts = arr.shift();
				this.replay.push(ts);
			}
		}

	}

}

function saveOther(){
	//构造
	this.cg_index = new Array();
	this.bgm_index = new Array();

	this.addBGM = function(bgm){
		if(this.bgm_index.indexOf(bgm) < 0 ){
			this.bgm_index.push(bgm);
		}
	}

	this.addCG = function(cg){
		this.loadData();		
		if(this.cg_index.indexOf(cg) < 0 ){
			this.cg_index.push(cg);
		}
	};

	this.saveData = function(){		
		var SCGItem = "";
		for(var i=0;i<this.cg_index.length;i++){
			SCGItem+=this.cg_index[i]+'|';
		}
		window.localStorage.setItem("SCGItem"+gIndex,SCGItem);
		/*	String data_filename = TempVar.GamePath + "huge.oge";
		 List<Byte> list = new ArrayList<Byte>();
		 OWRFile.writeInt(bgm_index.size(), list);
		 for (int i = 0; i < bgm_index.size(); i++) {
		 OWRFile.writeInt(bgm_index.get(i), list);
		 }
		 OWRFile.writeInt(cg_index.size(), list);
		 for (int i = 0; i < cg_index.size(); i++) {
		 OWRFile.writeInt(cg_index.get(i), list);
		 }
		 TempVar.system.varsEx.SaveData(list);
		 OWRFile.writeFile(data_filename, list);*/
	}

	this.loadData = function(){
		var SCGItem = window.localStorage.getItem("SCGItem"+gIndex);
		if(SCGItem){
			var SCGItemArr = SCGItem.substring(0,SCGItem.length-1).split("|");
			for(var  i=0;i<SCGItemArr.length;i++){
				SCGItemArr[i]= parseInt(SCGItemArr[i],10);
			}
			this.cg_index = SCGItemArr;
		}
		/*
		 String data_filename = TempVar.GamePath + "huge.oge";
		 if(!new File(data_filename).exists()) return;
		 OWRFile read = new OWRFile(data_filename);
		 bgm_index.clear();
		 cg_index.clear();
		 int bgmMax = read.read_int32();
		 for (int i = 0; i < bgmMax; i++) {
		 bgm_index.add(read.read_int32());
		 }
		 int cgMax = read.read_int32();
		 for (int i = 0; i < cgMax; i++) {
		 cg_index.add(read.read_int32());
		 }
		 TempVar.system.varsEx.LoadData(read);
		 */
	}
}

