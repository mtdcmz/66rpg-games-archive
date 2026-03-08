var myData;//云存档用来转存
function SSavefile(fTitle,isSave){
	var self = this;
	var FTitle = false,IsSave = false;
	var CUIIndex;
	var back,tempTitle;
	var data;
	var closeButton = null;
	var buttons;
	var viewport;
	var oListView;
	var wait;
	var isExit;
	var endPos;
	var isLoad = false;
	var onLoad = false;
	var imageVer = "20170515001";

	var loadingSP = null;

	var stateSP;
	//0427 ios存档相关
	var isIosSave = false;
	var isSafrai = false;

	var btnLocalsp,btnCloudsp;

	var freeSp = null;
	if(gGameDebug.bIosSave){
		isIosSave = tv.isIos;
		isSafrai = tv.isSafrai;
	}

	this.isNeedSendFlower = "SSaveFile";

	var fristSave=true;//第一次存储
	var saveNum=new Array();//没有分享得请况下有存档的存档位
	this.warningSp = null;

	this.init = function(){
		onLoad = false;
		//if(isIosS ave){
        //
		//}else{

		//判断是否限免---限免只能存储云---默认到云图标
		if(isSave){
			if(operationFrame.getIsFree()){
				//如果限免期间只显示云端
				tv.system.rwFile.isCloud = true;
			}
		}
		fristSave = true;
		saveNum = new Array();
		tv.canvas.menuIsShow(false);
		CUIIndex = tv.CUIFromIndex;
		data = tv.data.System.SaveData;
		if(FTitle){
			tempTitle = new OSprite(null,null);
			var img = new Image();
			var path = ("Graphics/Background/" + tv.data.System.Title.titleImagle).toLowerCase().replace(/\\/g,'/');
			img.src = fileListFato(path,'img in init from SSavefile.js');
			tempTitle.setBitmap(img);
			tempTitle.setZ(5999);
		}
		back = new OSprite(null,null);
		if(!data.backimage.IsNil())
		{
			var img2 = new Image();
			var path2 = ("Graphics/UI/" + data.backimage).toLowerCase().replace(/\\/g,'/');
			img2.src = fileListFato(path2,'img2 in init from SSavefile.js');
			back.setBitmap(img2);
		}
		back.setZ(6000);
		var b = tv.data.System.Buttons[data.closeButton.index];
		if(b.image1.IsNil() || b.image2.IsNil()) {
			console.log("SSavefile:img is null");
		}else{
			closeButton = new OButton(b.image1 + "",b.image2 + "","",null,false,false);
			closeButton.setZ(6003);
			closeButton.setX(data.closeButton.x);
			closeButton.setY(data.closeButton.y);
			closeButton.setVisible(true);
			closeButton.tag = "Back";
			closeButton.index = -1;
		}

		buttons = new Array(data.max > 12 ? 12 : data.max);
		if(operationCloud.getUid()!=0){
			if(!tv.system.rwFile.isCloud){
				//如果本地
				for(var i =0;i<buttons.length;i++){
					var a=window.localStorage.getItem("orgsave"+ guid + i+'|'+operationCloud.getUid());
					if(a){
						//这个用户已经有新的存档了，不需要将匿名档位通过来
						isMoveDaveFile = true;
					}
				}
			}
		}
		//stateSP = new Array();
		freeSp = new Array();
		//viewport = new OViewport(data.viewport.x, data.viewport.y, data.viewport.width, data.viewport.height);
		//viewport.SetZ(6002);
		oListView = new OListView(data.viewport.x, data.viewport.y, data.viewport.width, data.viewport.height);
		oListView.setZ(6002);
		var db = tv.data.System.Buttons[data.backButton.index];
		if(db.image1.IsNil() || db.image2.IsNil()) {
			console.log("SSavefile:img is null");
		}else{
			var self = this;
			var img3 = new Image();
			var path3 = ("Graphics/Button/" + db.image1).toLowerCase().replace(/\\/g,'/');
			img3.src = fileListFato(path3,'img3 in init from SSavefile.js');
			var img4 = new Image();
			var path4 = ("Graphics/Button/" + db.image2).toLowerCase().replace(/\\/g,'/');
			img4.src = fileListFato(path4,'img4 in init from SSavefile.js');
			function startSetButton(){
				for (var i = 0; i < buttons.length; i++) {
					buttons[i] = self.setButton(i , img3 , img4);
					tv.system.rwFile.buttonState[i] = SBTNSTATE.NONE;
				}
				//同步按钮
				if(tv.system.rwFile.isCloud){
					//切换存档按钮
					//sameButton = new OButton(imgArr["same"],imgArr["same1"],"",null,true,false);
					//sameButton.setX(148);
					//sameButton.setY(15);
					//sameButton.setZ(6120);
					btnCloudsp = new OSprite(imgArr["cChange1"],null);
					btnLocalsp = new OSprite(imgArr["lChange"],null);
				}else{
					btnCloudsp = new OSprite(imgArr["cChange"],null);
					btnLocalsp = new OSprite(imgArr["lChange1"],null);
				}
				if(mark == "isFlash"){
					btnLocalsp.x = gGameWidth - 60;
					btnLocalsp.y = 28;
					btnCloudsp.x = gGameWidth - 60;
					btnCloudsp.y = 98;
				}else{
					btnLocalsp.x = gGameWidth - 72;
					btnLocalsp.y = 22;
					btnCloudsp.x = gGameWidth - 72;
					btnCloudsp.y = 120;
					btnCloudsp.zoom_x=btnCloudsp.zoom_y=.6;
					btnLocalsp.zoom_x=btnLocalsp.zoom_y=.6;
				}
				btnCloudsp.setZ(6004);
				btnLocalsp.setZ(6004);
				var a = new OListViewItem(buttons,Math.ceil(buttons.length * 1.0 / data.column * 1.0) * data.spanRow);
				oListView.setItem(a);
				if(tv.system.rwFile.isCloud && !tv.system.rwFile.cloudAllData) {
					//setTimeout(function () {

					var cloudTask = new CloudTask(CloudTaskState.DOWNLOAD,null,function (data) {
						//console.log(JSON.parse(data.data)["1"]);
						if(data.data == ""){
							tv.system.rwFile.cloudAllData = new Object();
							return;
						}
						tv.system.rwFile.cloudAllData = JSON.parse(data.data);
						self.setSBTNState();
						self.makeUploadData();
					});
					operationCloud.startCloudStack(cloudTask);

					//operationCloud.DownLoadSaveInfo(function (data) {
					//	//console.log(JSON.parse(data.data)["1"]);
					//	if(data.data == ""){
					//		tv.system.rwFile.cloudAllData = new Object();
					//		return;
					//	}
					//	tv.system.rwFile.cloudAllData = JSON.parse(data.data);
					//	self.setSBTNState();
					//});
					//self.setSBTNState();
					//}, 2000);
				}else if(tv.system.rwFile.isCloud && tv.system.rwFile.cloudAllData){
					self.setSBTNState();
					self.makeUploadData();
				}
			}
			if(!img3.complete){
				getImage(img3, function (img) {
					img3 = img;
					startSetButton();
					self.fadeScene(0,255,false);
					onLoad=true;
				});
				warnIng();
				return;
			}else{
				startSetButton();
			}
		}
		this.fadeScene(0,255,false);
		onLoad=true;
		//登录用户，第一次进入游戏提示用户
		warnIng();
	};
	function warnIng(){
		if(operationCloud.getUid()!=0){
			var warning = window.localStorage.getItem("orguid"+operationCloud.getUid());
			if(!warning){
				sLoading.showBlack(7000);
				if(isVertical){//竖版
					self.warningSp = new OSprite(imgArr["warningsb"],null);
					self.warningSp.x=0;
					self.warningSp.y=0;
					self.warningSp.setZ(7003);
					self.warningSp.zoom_x = 1;
					self.warningSp.zoom_y = 1;

				}else{
					self.warningSp = new OSprite(imgArr["warningzb"],null);
					self.warningSp.x=0;
					self.warningSp.y=0;
					self.warningSp.setZ(7003);
					self.warningSp.zoom_x = 1;
					self.warningSp.zoom_y = 1;
				}
				if(btnCloudsp&&btnLocalsp){
					btnCloudsp.setZ(7004);
					btnLocalsp.setZ(7004);
				}
				window.localStorage.setItem("orguid"+operationCloud.getUid(),operationCloud.getUid());
			}
		}
	}


	this.setButton = function(index,_bmp1,_bmp2){
		var b1 = new OButton(_bmp1 , _bmp2 , "" , oListView.viewPort, true,false);

		var x = (index % data.column) * data.spanCol;
		var y = parseInt(index / data.column) * data.spanRow;
		b1.setX(x);
		b1.setY(y);
		b1.setZ(6003);
		b1.setVisible(true);
		b1.tag = "Click";
		b1.index = index;
				//0316 存读档:日期 名称 图片显示
		var targ = tv.system.rwFile.loadHeadData(index);
		//b1.cloudState = SBTNSTATE.LOADING;
		if(targ == null && tv.system.rwFile.isCloud){
			//b1.cloudState = SBTNSTATE.NONE;
			b1.SaveTime = 0;
		}
		this.drawButtonInfo(b1,targ,index);
		this.drawButtonMark(b1,targ,index,data);
		return b1;
	}
	this.drawButtonMark = function (b1,targ,index,data) {
		if(tv.system.rwFile.isCloud){
			//限免期间
			if(targ && targ[4] && !operationFrame.getNotIsFree()){
				tv.system.rwFile.buttonFreeLimit[index] = targ[4];
				if(freeSp[index]){
					freeSp[index].dispose();
				}
				freeSp[index] = new OSprite(imgArr["mark"],oListView.viewPort);
				//freeSp[index].x = b1.getX();
				//freeSp[index].y = b1.getY();
				freeSp[index].x = b1.getX()+data.picX;
				freeSp[index].y = b1.getY()+data.picY;
				freeSp[index].setZ(b1.back.z+100)
			}else if(targ && targ[4]==1 && operationFrame.getNotIsFree()){
				if(freeSp[index]){
					freeSp[index].dispose();
				}
				//限免的档位----花大于鲜花锁
				/*operationCloud.DownLoadSaveExInfo("limitfree",function(data){
					if(parseInt(data.status)==1){
						var frameInfo = operationFrame.getLocalCloudData(index);
						if(frameInfo){
							frameInfo = JSON.parse(frameInfo);
							frameInfo.Header.IsFreeLimit = 0;
							operationFrame.setLocalCloudData(index,frameInfo);
						}
						if(data.data){
							operationFrame.setLocalLimtExData(data.data);
							tv.system.varsEx.loadExData(function (data) {console.log(data)});
							//将限免期间的数据上传到云上
							tv.system.varsEx.saveExData();
						}else{console.log("=============数data.data.split(据空");}
					}
				});*/
			}else{
				if(freeSp[index]){
					freeSp[index].dispose();
				}
			}
		}else{
			//不限免期间并且送的花大于鲜花锁
			//tanhua == 0 && sendFlower >= parseInt(flower_unlock)
			/*if(targ && targ[3] && !operationFrame.getNotIsFree()){
				if(freeSp[index]){
					freeSp[index].dispose();
				}
				freeSp[index] = new OSprite(imgArr["mark"],oListView.viewPort);
				//freeSp[index].x = b1.getX();
				//freeSp[index].y = b1.getY();
				freeSp[index].x = b1.getX()+data.picX;
				freeSp[index].y = b1.getY()+data.picY;
				freeSp[index].setZ(b1.back.z+100);
			}*/
		}
	};
	this.setButtonZ = function (z) {
		for (var i = 0; i < buttons.length; i++) {
			if(buttons[i]){
				buttons[i].setZ(z);
			}

		}
	};
	//绘制按钮的信息
	this.drawButtonInfo = function (b1,targ,index) {
		if(targ != null){
			if(data.showDate){
				b1.draw2.drawText(targ[0],data.dateX, data.dateY);
			}
			if(data.showMapName){
				if((0 <= data.nameY)&&(data.nameY<= b1.height())){
					if(b1.draw2.texts.length>0){
						b1.draw2.texts.shift();
					}
					var sptext2 = new DTextA(targ[1],data.nameX, data.nameY,b1.draw2.color);
					b1.draw2.texts.push(sptext2);
				}
			}
			var self = this;

			if(targ[3]){
				b1.SaveTime = parseInt(targ[3]);
				//this.setSBTNState(b1,index)
			}
			////缩略图相关待处理
			if(data.showMinPic){
				var img=new Image();
				img.src=targ[2];
				img.onload= function () {
					b1.setFrontImg(img,0,0);
					b1.frontimg.isSaveIcon=true;
					var data1=new Object();
					var gameCanvas = document.getElementById("main_canvas");
					if(isPhone){
						data1.w=gameCanvas.height*data.zoom/100;
						data1.h=gameCanvas.width*data.zoom/100;
					}else{
						data1.w=gameCanvas.width*data.zoom/100;
						data1.h=gameCanvas.height*data.zoom/100;
					}
					b1.frontimg.iconTag=data1;
					b1.setFrontImgPosition(data.picX,data.picY);
					self.drawButtonMark(b1,targ,index,data);
				}
			}
		}
	}

	//设置按钮的状态
	this.setSBTNState = function(fTitle,isSave){
		for(var i = 0;i<buttons.length;i++){
			if(buttons[i] && buttons[i].SaveTime!=0){//按钮存在  并且  按钮的saveTime不是0
				if(tv.system.rwFile.cloudAllData[i+1]){//判断云存档是否存在 并且判断两个大小
					tv.system.rwFile.cloudAllData[i+1]= tv.system.rwFile.cloudAllData[i+1];
					var SaveTime = parseInt(tv.system.rwFile.cloudAllData[parseInt(i)+1].Header.SaveTime);//云存档的时间戳
					if(buttons[i].SaveTime > SaveTime){
						tv.system.rwFile.buttonState[i] = SBTNSTATE.NEW;
					}else if(buttons[i].SaveTime<SaveTime){
						tv.system.rwFile.buttonState[i] = SBTNSTATE.OLD;
					}else if(buttons[i].SaveTime == SaveTime){
						tv.system.rwFile.buttonState[i] = SBTNSTATE.OK;
					}
				}else{//本地有但是云上没有
					tv.system.rwFile.buttonState[i] = SBTNSTATE.NEWSAVE;
				}
			}else if(buttons[i] && buttons[i].SaveTime == 0){//本地没有   但是云有
				if(tv.system.rwFile.cloudAllData[i+1]){
					tv.system.rwFile.buttonState[i] = SBTNSTATE.OLDSAVE;
				}else{
					tv.system.rwFile.buttonState[i] = SBTNSTATE.NONE;
				}
			}else{
				tv.system.rwFile.buttonState[i] = SBTNSTATE.NONE;
			}
		}

		if(tv.system.rwFile.isCloud && tv.scene instanceof SSavefile){
			this.updateBtnState();
		}
	}

    //根据状态值做相应的处理
	this.updateBtnState = function () {
		for(var i = 0;i<buttons.length;i++){
			if(buttons[i] && tv.system.rwFile.buttonState[i]){
				//if(!stateSP[i] || (stateSP[i].cloudState != tv.system.rwFile.buttonState[i] )){
				//	if(!stateSP[i]){
				//		stateSP[i] = new OSprite(null,oListView.viewPort);
				//	}
					switch (tv.system.rwFile.buttonState[i]){
						case SBTNSTATE.NEW:
							//stateSP[i].setBitmap(imgArr["fail"]);
							break;
						case SBTNSTATE.OLD:
							//stateSP[i].setBitmap(imgArr["fail"]);
							operationFrame.setLocalCloudData(i,tv.system.rwFile.cloudAllData[i+1]);
							//window.localStorage.setItem("cloud|"+parseInt(publicUses.getUserInfo().uid)+"|"+guid+"|"+i,JSON.stringify(tv.system.rwFile.cloudAllData[i+1]));
							var targ = tv.system.rwFile.loadHeadData(i);
							//b1.cloudState = SBTNSTATE.LOADING;
							if(targ != null && tv.system.rwFile.isCloud){
								//b1.cloudState = SBTNSTATE.NONE;
								buttons[i].SaveTime = 0;
							}
							this.drawButtonInfo(buttons[i],targ,i);
							tv.system.rwFile.buttonState[i] = SBTNSTATE.OK;
							//stateSP[i].setBitmap(imgArr["OK"]);
							break;
						case SBTNSTATE.OK:
							//stateSP[i].setBitmap(imgArr["OK"]);
							break;
						case SBTNSTATE.LOADING:
							//stateSP[i].setBitmap(imgArr["fail"]);
							break;
						case SBTNSTATE.NONE:
							//if(stateSP[i]){
							//	stateSP[i].dispose();
							//}
							break;
						case SBTNSTATE.NEWSAVE:
							//stateSP[i].setBitmap(imgArr["fail"]);
							break;
						case SBTNSTATE.OLDSAVE:
							//stateSP[i].setBitmap(imgArr["fail"]);
							operationFrame.setLocalCloudData(i,tv.system.rwFile.cloudAllData[i+1]);
							//window.localStorage.setItem("cloud|"+parseInt(publicUses.getUserInfo().uid)+"|"+guid+"|"+i,JSON.stringify(tv.system.rwFile.cloudAllData[i+1]));
							var targ = tv.system.rwFile.loadHeadData(i);
							//b1.cloudState = SBTNSTATE.LOADING;
							if(targ != null && tv.system.rwFile.isCloud){
								//b1.cloudState = SBTNSTATE.NONE;
								buttons[i].SaveTime = 0;
							}
							this.drawButtonInfo(buttons[i],targ,i);
							tv.system.rwFile.buttonState[i] = SBTNSTATE.OK;
							//stateSP[i].setBitmap(imgArr["OK"]);
							break;
					}
				//}

				//if(stateSP[i]){
				//	stateSP[i].cloudState = tv.system.rwFile.buttonState[i];
				//	stateSP[i].x = buttons[i].getX()+buttons[i].width()-stateSP[i].width;
				//	stateSP[i].y = buttons[i].getY();
				//	stateSP[i].setZ(buttons[i].back.z+100);
				//}
			}

			//if(stateSP[i] && stateSP[i].cloudState == SBTNSTATE.LOADING){
			//	stateSP[i].rotate +=.05;
			//}else if(stateSP[i]){
			//	stateSP[i].rotate = 0;
			//}
		}
	}

	this.fadeScene = function(start,To,_isExit){
		wait = 5;
		for (var i = 0; i < buttons.length; i++) {
			if(buttons[i] != null){
				buttons[i].setOpactiy(start);
				buttons[i].SetFade(To, wait);
			}
		}
		if(closeButton != null){
			closeButton.setOpactiy(start);
			closeButton.SetFade(To, wait);
		}
		back.opacity = start;
		back.FadeTo(To, wait);
		isExit = _isExit;
	}

	var pointFrame = 0;
	var pointStr="";

	//如果有按钮是loading状态  旋转按钮
	this.updateLoading = function () {
		var isRotate = false;
		for(var i = 0;i<tv.system.rwFile.buttonState.length;i++){
			if(operationCloud.GetCurrentCloudStatus() == CloudStatus.UpLoading || operationCloud.GetCurrentCloudStatus() == CloudStatus.DownLoading){
				isRotate = true;
				break;
			}
		}
		if(isRotate){
			if(!loadingSP){
			    loadingSP = new OSprite(imgArr["loading"],null);
				loadingSP.x = 148;
				loadingSP.y = 15;
				//sameButton.setVisible(false);
			}else{
				pointFrame++;
				if(pointFrame%10 == 0){
					loadingSP.drawLineTxt(pointStr,74,3,"#ffffff",26);
					pointStr+=".";
					if(pointStr.length>3){
						pointStr = "";
					}
				}
				if(pointFrame>30){
					pointFrame = 0;
				}
			}
		}else{
			if(loadingSP){
				loadingSP.dispose();
				//sameButton.setVisible(true);
				this.setSBTNState();
				loadingSP = null;
			}
		}
	}

	this.update = function() {
		if(onLoad){
			if(onTouchClick&&sLoading.blackFlg){
				this.warningSp.dispose();
				sLoading.hideBlack();
				sLoading.blackFlg=false;
				if(btnCloudsp&&btnLocalsp){
					btnCloudsp.setZ(6004);
					btnLocalsp.setZ(6004);
				}
			}
			if(sLoading.blackFlg){
				return;
			}

			//if(tv.system.rwFile.isCloud){
			//	this.updateLoading();
			//}
			if(wait > 0){
				wait -= 1;
				if(isExit && wait == 0){
					this.dispose(true);
				}
				return;
			}

			if(oListView.isMove){
				return;
			}
			if(this.updateButton()){
				return;
			}
		}
	}

	this.makeUploadData = function () {
		console.log("自动同步数据");
		var obj = new Object();
		var isUp = false;
		var self = this;
		for(var i = 0;i<tv.system.rwFile.buttonState.length;i++){
			switch (tv.system.rwFile.buttonState[i]){
				case SBTNSTATE.NEW:
					//obj[i+1] = JSON.parse(window.localStorage.getItem("cloud|"+parseInt(publicUses.getUserInfo().uid)+"|"+guid+"|"+i));
					obj[i+1] = JSON.parse(operationFrame.getLocalCloudData(i));
					isUp = true;
					break;
				case SBTNSTATE.NEWSAVE:
					obj[i+1] = JSON.parse(operationFrame.getLocalCloudData(i));
					isUp = true;
					break;
			}
		}
		if(isUp){
			//this.updateLoading();
			var cloudTask = new CloudTask(CloudTaskState.UPLOADMORE,obj,function(data){
				if(data&&data.status==1){
					for(var i in obj){
						tv.system.rwFile.cloudAllData[i] = obj[i];
					}
					console.log("上传成功---返回值",data);
				}else{
					console.log("上传失败---返回值",data);
				}
				self.setSBTNState();
			});
			operationCloud.startCloudStack(cloudTask);
		}else{
			//sLoading.showAlert("同步完成！");
			console.log("不进行上传，没有要上传的数据;");
		}
	}
	this.updateButton = function(){
		if(btnCloudsp && btnLocalsp){
			try{
				var cloud = tv.system.rwFile.isCloud;
				if(tv.system.rwFile.isCloud){//云界面点击本地按钮
					if(btnLocalsp.isClick()){
						tv.system.rwFile.isCloud = false;
						if(isSave){
							if(operationFrame.getIsFree()){
								var imgList = [
									{"name":"xmyAlert","src":M_IMG_SERVER_URL+"hfplayer/img/Cloud/xmyalert.png?v="+imageVer,type:1},
									{"name":"img1","src":M_IMG_SERVER_URL+"hfplayer/img/Cloud/xmy_btn.png?v="+imageVer,type:1},
									{"name":"close","src":M_IMG_SERVER_URL+"hfplayer/img/Cloud/AlertClose.png?v="+imageVer,type:1},
									{"name":"img2","src":M_IMG_SERVER_URL+"hfplayer/img/Cloud/AlertRight.png?v="+imageVer,type:1}
								];
								sVLoadImg.loadImgData(imgList,function(arr){
									var obj = [
										{"callBack":function(){},"Name":"              知道了", "Color":"#333333", "Size":16,"image1":arr["img1"],"image2":arr["img1"],x:0,y:arr["xmyAlert"].height-0-arr["img1"].height},
										{"callBack":function(){},"Name":"", "Color":"#ff8a54","image1":arr["close"],"image2":arr["close"],x:240,y:6}
									];
									sLoading.showAlertMoreBtn(arr["xmyAlert"],"",obj);
								});
								tv.system.rwFile.isCloud = true;
							}
						}

					}
				}else{//本地界面点击云按钮
					if(btnCloudsp.isClick()){
						tv.system.rwFile.isCloud = true;
					}
				}
				if(cloud!=tv.system.rwFile.isCloud){
					if(operationCloud.getUid() == 0){
						alert("未登录不能使用云存档!");
						//$(".ssologin")[0].click();
						operationCloud.getLogin();
						tv.system.rwFile.isCloud = false;
					}else{
						if(operationCloud.isOpen == false){
							var obj = new Object();
							obj.fTitle = fTitle;
							obj.isSave = isSave;
							var self = this;
							operationCloud.getOpenCloudState(function(isOpen,data,obj){
								if(isOpen){
									tv.system.rwFile.isCloud = true;
								}else{
									tv.system.rwFile.isCloud = false;
									if(isSave){
										if(operationFrame.getIsFree()){
											//如果限免期间
											tv.system.rwFile.isCloud = true;

										}
										if(tv.system.rwFile.isCloud){
											return;
										}
									}
									//sLoading.showAlert("充值任意金额，即可享用云存档特权");
									var imgList = [
										{"name":"alertBack","src":M_IMG_SERVER_URL+"hfplayer/img/Cloud/MoreAlertBack.png?v="+imageVer,type:1},
										{"name":"img1","src":M_IMG_SERVER_URL+"hfplayer/img/Cloud/AlertLeft.png?v="+imageVer,type:1},
										{"name":"close","src":M_IMG_SERVER_URL+"hfplayer/img/Cloud/AlertClose.png?v="+imageVer,type:1},
										{"name":"img2","src":M_IMG_SERVER_URL+"hfplayer/img/Cloud/AlertRight.png?v="+imageVer,type:1}
									];
									sVLoadImg.loadImgData(imgList,function(arr){
										var obj = [
											{"callBack":function(){},"Name":"取消", "Color":"#333333","image1":arr["img1"],"image2":arr["img1"],x:10,y:arr["alertBack"].height-8-arr["img1"].height},
											{"callBack":function(){
												if(mark == "aBox"){
													if(typeof window.org_box == 'undefined'){

													}else{
														if(ismod == "true"){
															window.org_box.newMenuSendFlower(!isVertical,parseInt(gIndex),modId);
														}else{
															window.org_box.newMenuSendFlower(!isVertical,parseInt(gIndex));
														}
													}
													return;
												}
												if(mark == "isFlash"){
													window.parent.asUserOperate.sendFlowerWindow();
													return;
												}
												var scene = tv.scene;
												scene.dispose();
												//tv.scene.setButtonZ(6003);
												tv.scene = new SCGSendFlower(scene);
												return;
											},"Name":"充值", "Color":"#ff8a54","image1":arr["img2"],"image2":arr["img2"],x:160,y:arr["alertBack"].height-8-arr["img1"].height
											},
											{"callBack":function(){},"Name":"", "Color":"#ff8a54", "image1":arr["close"],"image2":arr["close"],x:260,y:6},
										];
										sLoading.showAlertMoreBtn(arr["alertBack"],"充值任意金额，即可享用云存档特权",obj);
									});
									//alert("未首冲不能使用云存档哦~");
									return;
								}
								self.dispose();
								tv.scene = new SSavefile(obj.fTitle,obj.isSave);
							},obj);
							return;
						}
					}
					tv.scene.dispose();
					tv.scene = new SSavefile(fTitle,isSave);
					return;
				}
			}catch(e){
				alert("SSavefile btnCloudsp is Error"+e);
			}
		}
		if(closeButton != null){
			closeButton.update();
			if(closeButton.isClick() ){
				this.cmdBack();
				//return true;
			}
		}



		//if(cloudButton != null){
		//	cloudButton.update();
		//	if(cloudButton.isClick()){
		//		try{
		//			if(tv.system.rwFile.isCloud){
		//				tv.system.rwFile.isCloud = false;
		//			}else{
		//				tv.system.rwFile.isCloud = true;
		//			}
        //
		//		}catch(e){
		//			alert("SSavefile cloudButton is Error"+e);
		//			return;
		//		}
		//	}
		//}

		//if(sameButton != null){
		//	sameButton.update();
		//	if(sameButton.isClick()){
		//		this.makeUploadData();
		//	}
		//}
		for(var i = 0 ; i < buttons.length;++i){
			var b1 = buttons[i];
			if(b1 != null){
				b1.update();
				if(b1.isClick()&&b1.tag == "Click"){
					if(mark == "isFlash"){
						//curUser.uid
						if(curUser.uid>0&&operationCloud.getUid()!= curUser.uid){
							alert("您当前的作品进度是 "+curUser.uname+" 的。");
							return;
						}
					}
					//如果使用野花开启全部存档
					if(isOpen){
						//如果开启全部存档
						if(allOpen){
							if(gGameDebug.blocalsave){
								this.cmdClick(b1.index,false);
								return true;
							}
						}else{//如果不开启全部存档
							if(gGameDebug.blocalsave){
								this.cmdClick(b1.index,false);
								return true;
							}
						}
					}else{//不使用野花开启全部存档
						if(allOpen){//如果开启全部存档
							if(gGameDebug.blocalsave){
								this.cmdClick(b1.index,false);
								return true;
							}
						}else{//如果不开启全部存档
							if(gGameDebug.blocalsave){
								this.cmdClick(b1.index,false);
								return true;
							}
						}
					}
					//0421 h5版本暂时不开放存读档 弹窗提示
					if(gGameDebug.bpopUpInfo){
						//popUpInfo("save");//0422 存档弹窗提示
						popUpInfoTemp();//0428 临时使用
					}
				}
			}
		}
		//return false;
	}

	this.updateMove = function(){
		if(onTouchDown && onTouchMove && viewport.isIn()){
			var pos = parseInt(viewport.oy - (onTouchDY - onTouchY));
			viewport.oy = pos;
			if(viewport.oy > 0 )
				viewport.oy = 0;
			if(viewport.oy <  (endPos * -1))
				viewport.oy = endPos * -1;
			onTouchDY = onTouchY;
			return true;
		}
		return false;
	}

	this.cmdBack = function(){
		if(FTitle){
			this.dispose(true);
		}else{
			this.fadeScene(255,0,true);
		}
	}
	this.cmdClick = function(index,bIsCloud){
		//如果是ios存档策略
		if(isIosSave){
			//实际只执行了一次
			if(IsSave){
				//console.log(tv.system.rwFile.saveData(tv.safraiSaveIndex,false));
				if(tv.system.rwFile.isCloud){
					this.cmdSave(index,bIsCloud);
					return;
				}else{
					try{
						this.cmdSave(index,bIsCloud);
						return;
					}catch(e){
						alert("safrai处于无痕浏览模式，无法为您保存");
					}
				}
				tv.scene = new SGame();
				//tv.scene = new SGame();
			}else{
				this.cmdLoad(index,bIsCloud);
			}
		}else{
			if(IsSave){
				this.cmdSave(index,bIsCloud);
			}else{
				this.cmdLoad(index,bIsCloud);
			}
		}
	}

	this.cmdLoad = function(index,bIsCloud){
		if(tv.system.rwFile.isCloud){
			this.makeUploadData();
		}
		if(tv.system.rwFile.loadData(index,bIsCloud)){
			isLoad = true;
			this.fadeScene(255,0,true);
		}
	}

	this.cmdSave = function(index,bIsCloud){
		if(!allOpen){
			//是否是ios策略
			if(fristSave){
				for(var j=0;j<buttons.length;j++){
					if(tv.system.rwFile.isCloud){
						var data= operationFrame.getLocalCloudData(j);
					}else{
						var data = null;
						if(!operationCloud.getUid()){
							//没登陆
							data= window.localStorage.getItem("orgsave"+ guid + j);
						}else{
							//登陆
							data= window.localStorage.getItem("orgsave"+ guid + j+'|'+operationCloud.getUid());
						}
					}
					//if(tv.system.rwFile.loadData(j,bIsCloud)){
					if(data){
						fristSave=false;
						saveNum.push(j);
					}
				}
			}
			if(fristSave){
				/*存档策略*/
				for(var i=0;i<buttons.length;i++){
					if(i!=index){
						if(tv.system.rwFile.isCloud){
							var data= operationFrame.getLocalCloudData(i);
						}else{
							var data = null;
							if(!operationCloud.getUid()){
								//没登陆
								data= window.localStorage.getItem("orgsave"+ guid + i);
							}else{
								//登陆
								data= window.localStorage.getItem("orgsave"+ guid + i+'|'+operationCloud.getUid());
							}
						}
						//if(tv.system.rwFile.loadData(i,bIsCloud)){
						if(data){
							//if(!tv.system.rwFile.isCloud){
							alert("您现在只有一个存档位哦！\n*送花后可开启所有存档位\n*分享可得鲜花");
							return;
							//}
						}
					}
				}
			}else{
				if(saveNum.length>1){
					var isSave=false;
					for(var j=0;j<saveNum.length;j++){
						if(index==saveNum[j]){
							console.log(index);
							isSave=true;
							break;
						}
					}
					if(!isSave){
						//if(!tv.system.rwFile.isCloud){
						alert("您现在只有一个存档位哦！\n*送花后可开启所有存档位\n*分享可得鲜花");
						return;
						//}
					}
				}else{
					/*存档策略*/
					for(var i=0;i<buttons.length;i++){
						if(i!=index){
							if(tv.system.rwFile.isCloud){
								var data= operationFrame.getLocalCloudData(i);
							}else{
								var data = null;
								if(!operationCloud.getUid()){
									//没登陆
									data= window.localStorage.getItem("orgsave"+ guid + i);
								}else{
									//登陆
									data= window.localStorage.getItem("orgsave"+ guid + i+'|'+operationCloud.getUid());
								}
							}
							//if(tv.system.rwFile.loadData(i,bIsCloud)){
							if(data){
								//if(!tv.system.rwFile.isCloud){
								alert("您现在只有一个存档位哦！\n*送花后可开启所有存档位\n*分享可得鲜花");
								return;
								//}
							}
						}
					}
				}
			}
		}
		tv.system.rwFile.saveData(index,bIsCloud);
			//if(TempVar.saveBitmap != null) OBitmap.saveBmp("save_pic" + index + ".jpg0", TempVar.saveBitmap, CompressFormat.JPEG);
		this.updateButtonDraw(index);
		this.cmdBack();
	}

	this.updateButtonDraw = function(index){
		var tbutton = null;
		for(var i = 0 ; i < buttons.length ; ++i){
			if(buttons[i].index == index){
				tbutton = buttons[i];
				break;
			}
		}
		if(tbutton != null){
			var targ = tv.system.rwFile.loadHeadData(index);
			if(targ != null){
				if(data.showDate){
					tbutton.draw2.drawText(targ[0],data.dateX, data.dateY);
				}

				if(data.showMapName){
					var sptext2 = new DTextA(targ[1],data.nameX, data.nameY);
					tbutton.draw2.texts.push(sptext2);
				}
				////缩略图相关待处理
			}
		}
	}

	this.dispose = function(isLoad1) {
		if(FTitle) {
			if(tempTitle){
				tempTitle.dispose();
			}
			if(isLoad1){
				tv.scene = isLoad ? new SGame() : new STitle(false);
			}
		}else if(CUIIndex != -1){
			tv.scene = new SCUI(CUIIndex);
		}else{
			if(ovideo._video){
				ovideo.videoShow();
			}
			tv.scene = new SGame();
		}
		oListView.dispose();
		back.dispose();
		for(var i=0;i<freeSp.length;i++){
			if(freeSp[i]){
				freeSp[i].dispose();
				freeSp[i] = null;
			}
		}
		if(closeButton != null){
			closeButton.dispose();
		}
		if(loadingSP){
			loadingSP.dispose();
			loadingSP = null;
		}
		//if(sameButton != null){
		//	sameButton.dispose();
		//}
		if(buttons != null){
			for(var i = 0 ; i < buttons.length;++i){
				if(buttons[i] != null){
					buttons[i].dispose();
				}
			}
		}
		if(btnCloudsp){
			btnCloudsp.dispose();
		}
		if(btnLocalsp){
			btnLocalsp.dispose();
		}
		tv.canvas.menuIsShow(true);
	}

	//构造
	FTitle = fTitle;
	IsSave = isSave;
	var imgArr;
	var self = this;
	var imgPathHead=M_IMG_SERVER_URL+"hfplayer/img/Cloud/";
	var imgList=[
		{"name":"fail","src":imgPathHead+"fail.png?v="+imageVer,type:1},
		{"name":"loading","src":imgPathHead+"loading.png?v="+imageVer,type:1},
		{"name":"OK","src":imgPathHead+"OK.png?v="+imageVer,type:1},
		{"name":"mark","src":imgPathHead+"mark.png?v="+imageVer,type:1},
		{"name":"same","src":imgPathHead+"same.png?v="+imageVer,type:1},
		{"name":"same1","src":imgPathHead+"same1.png?v="+imageVer,type:1},
		{"name":"warningzb","src":imgPathHead+"warningzb.png?v="+imageVer,type:1},
		{"name":"warningsb","src":imgPathHead+"warningsb.png?v="+imageVer,type:1}
	];
	if(mark == "isFlash"){
		imgList.push({"name":"cChange","src":imgPathHead+"cChange_web.png?v="+imageVer,type:1});
		imgList.push({"name":"cChange1","src":imgPathHead+"cChange1_web.png?v="+imageVer,type:1});
		imgList.push({"name":"lChange","src":imgPathHead+"lChange_web.png?v="+imageVer,type:1});
		imgList.push({"name":"lChange1","src":imgPathHead+"lChange1_web.png?v="+imageVer,type:1});
	}else{
		imgList.push({"name":"cChange","src":imgPathHead+"cChange.png?v="+imageVer,type:1});
		imgList.push({"name":"cChange1","src":imgPathHead+"cChange1.png?v="+imageVer,type:1});
		imgList.push({"name":"lChange","src":imgPathHead+"lChange.png?v="+imageVer,type:1});
		imgList.push({"name":"lChange1","src":imgPathHead+"lChange1.png?v="+imageVer,type:1});
	}
	sVLoadImg.loadImgData(imgList,function(arr){
		imgArr = arr;
		//self.init();
		gLoadAssets.curLoadScene = "SSavefile";
		if(gLoadAssets.isNeedLoad()){

		}else{
			self.init();
		}
	})

}

function SBTNSTATE(){}
SBTNSTATE.NONE = "None";//无数据状态
SBTNSTATE.OLD = "Old";//比云存档旧的状态
SBTNSTATE.NEW = "New";//比云存档新的状态
//SBTNSTATE.LOADING = "Loading";//同步中状态
SBTNSTATE.OK = "Ok";//本地存档与云存档一致状态
SBTNSTATE.NEWSAVE = "NewSave";//云上不存在 本地存在
SBTNSTATE.OLDSAVE = "OldSave";//本地不存在 云上在