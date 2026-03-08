function SCG(_isTittle){
	var IsTittle = false,IsShow = false;
	var tempTitle;
	var backImage;
	var data;
	var close;
	var buttons;
	//var viewport;
	var oListView;
	var max,maxRow,endPos;
	var bmps;
	var cgBrowse;
	var wait;
	var isExit = false;
	var msg;
	var showmsg = false;
	var msg_x = 0 ,msg_y = 0;

	this.init = function(){
		if(IsTittle){
			var img = new Image();
			var path1 = ("Graphics/Background/" + tv.data.System.Title.titleImagle).toLowerCase().replace(/\\/g,'/');
			img.src = fileListFato(path1,'img in init from SCG.js');
			tempTitle = new OSprite(img,null);
			tempTitle.setZ(5999);
		}else{
			tv.canvas.message[tv.canvas.msgIndex].msgBoxFadeOut();
		}

		data = tv.data.System.CG;
		backImage = new OSprite(null,null);
		if(!data.backimage.IsNil()){
			var img2 = new Image();
			var path2 = ("Graphics/UI/" + data.backimage).toLowerCase().replace(/\\/g,'/');
			img2.src = fileListFato(path2,'img2 in init from SCG.js');
			backImage.setBitmap(img2);
		}
		backImage.setZ(6000);

		var t1 = tv.data.System.Buttons[data.closeButton.index];
		if(t1.image1.IsNil() || t1.image2.IsNil()) {
			console.log("SCG:img is null");
		}else{
			close = new OButton(t1.image1 + "",t1.image2 + "","",null,false,false);
			close.setZ(6004);
			close.setX(data.closeButton.x);
			close.setY(data.closeButton.y);
			close.tag = "Back";
			close.setVisible(true);
		}

		//viewport = new OViewport(data.viewport.x,data.viewport.y,data.viewport.width,data.viewport.height);
		//viewport.SetZ(6002);
		oListView = new OListView(data.viewport.x,data.viewport.y,data.viewport.width,data.viewport.height);
		oListView.setZ(6002);

		max = data.cglist.length;
		buttons = new Array(max);
		var t2 = tv.data.System.Buttons[data.backButton.index];
		bmps = new Array(2);
		//console.log(t2.image1.IsNil(), t2.image2.IsNil());
		if(t2.image1.IsNil() || t2.image2.IsNil()) {
			console.log("SCG:img is null");
			bmps[0] = new Image();
			bmps[1]= new Image();

			if(window.localStorage.getItem("SCGItem"+gIndex)){
				tv.system.other.loadData();
			}
			for(var i = 0 ; i < max ;++i){
				buttons[i] = this.setButton(i);
			}
		}else{
			bmps[0] = new Image();
			var pathButton1 = ("Graphics/Button/" + t2.image1.name).toLowerCase().replace(/\\/g,'/');
			bmps[0].src = fileListFato(pathButton1,'bmps[0] in init from SCG.js');
			bmps[1]= new Image();
			var pathButton2 = ("Graphics/Button/" + t2.image2.name).toLowerCase().replace(/\\/g,'/');
			bmps[1].src = fileListFato(pathButton2,'bmps[1] in init from SCG.js');

			if(window.localStorage.getItem("SCGItem"+gIndex)){
				tv.system.other.loadData();
			}
			for(var i = 0 ; i < max ;++i){
				buttons[i] = this.setButton(i);
			}
		}

		maxRow = parseInt((max + data.column - 1) / data.column);
		//endPos = (maxRow - 1) * data.spanRow + bmps[0].height - data.viewport.height;
		endPos = (maxRow - 1) * data.spanRow + bmps[0].height;
		var item = new OListViewItem(buttons,endPos);
		oListView.setItem(item);

		cgBrowse = new OSprite(null,null);
		cgBrowse.setZ(8002);
		cgBrowse.visible = false;
		IsShow = false;
		this.fadeScene(0,255,false);

		showmsg = data.showMessage;
		if(showmsg){
			msg = new OSprite(null,null);
			msg.setZ(6003);
			msg_x = data.megX;
			msg_y = data.megY;
		}
	}

	this.setButton = function(index){
		var b1 = new OButton(bmps[0],bmps[1],"",oListView.viewPort,true,false,false);
		var x = (index % data.column) * data.spanCol;
		var y = parseInt(index / data.column) * data.spanRow;
		b1.setX(x);
		b1.setY(y);
		b1.setVisible(true);
		b1.index = index;
		var img = null;
		if(tv.system.other.cg_index.indexOf(index) >= 0){
			img = new Image();
			var strPath = this.makerBrowseImagePath(data.cglist[index].cgpath + "").toLowerCase().replace(/\\/g,'/');
			if(strPath.lastIndexOf("/")!=-1){
				strPath = strPath.substring(strPath.lastIndexOf("/")+1,strPath.length);
			}
			//var path1 = ("Graphics/System/" + this.makerBrowseImagePath(data.cglist[index].cgpath + "")).toLowerCase().replace(/\\/g,'/');
			var path1 = ("Graphics/System/" + strPath).toLowerCase().replace(/\\/g,'/');
			img.src = fileListFato(path1,'img in setButton from SCG.js');
		}else if(data.nopic.name.length > 0){
			img = new Image();
			var strPath = ''+data.nopic.name.toLowerCase().replace(/\\/g,'/');
			if(strPath.lastIndexOf("/")!=-1){
				strPath = strPath.substring(strPath.lastIndexOf("/")+1,strPath.length);
			}
			var path2 = ("Graphics/System/" + strPath).toLowerCase().replace(/\\/g,'/');
			//var path2 = ("Graphics/System/" + data.nopic.name).toLowerCase().replace(/\\/g,'/');
			img.src = fileListFato(path2,'img in setButton from SCG.js');
		}
		if(img != null) {
			b1.setFrontImg(img,data.cgx,data.cgy);
		}
		return b1;
	}

	this.makerBrowseImagePath = function(path){
		if(path.length <= 0) return "";
		var t1 = path.lastIndexOf("."); 
		var hard = path.substring(0,t1);
		var endp = path.substring(t1);
		return hard + "_S" + endp;
	}

	this.fadeScene = function(start,to,_isExit){
		wait = 5;
		backImage.opacity = start;
		backImage.FadeTo(to,wait);
		if(close != null){
			close.setOpactiy(start);
			close.SetFade(to,wait);
		}
		for(var i = 0 ; i < buttons.length; ++i){
			if(buttons[i] == null) continue;
			buttons[i].setOpactiy(start);
			buttons[i].SetFade(to, wait);
		}
		isExit = _isExit;
	}

	this.update = function(){
		if(wait >= 0){
			wait -= 1;
			if(isExit && wait == 0){
				this.dispose();
			}
			return;
		}

		//button和move只响应一种

		//if(this.updateMove()){
		//	return;
		//}
		if(oListView.isMove){
			return;
		}
		if(this.updateButton()){
			return;
		}

		if(IsShow && onClick()){
			cgBrowse.visible = false;
			IsShow = false;
			return;
		}
		//this.updateKey();
	}

	this.updateMove = function(){
		if(IsShow) return false;
		if(onTouchDown && onTouchMove ){ //&& viewport.isIn()
			console.log("SCG updateMove");
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

	this.updateButton = function(){
		if(IsShow) return false;

		if(close != null){
			close.update();
			if(close.isClick() ){ 
				this.cmdClose();
				return true;
			}
		}
		
		for(var i = 0 ; i < buttons.length;++i){
			var b1 = buttons[i];
			if(b1 != null){
				b1.update();
				if(showmsg && b1.isSelected()) {
					this.showMsg(b1.index);
				}

				if(b1.isClick()){
					this.cmdClick(b1.index);
					return true;
				}
			}
		}
		return false;
	}

	this.showMsg = function(index){
		if(tv.system.other.cg_index.indexOf(index) > -1){
			msg.drawText(data.cglist[index].message,msg_x,msg_y);
		}else{
			msg.clearText();
		}
	}

	this.cmdClose = function(){
		if(IsTittle){
			this.dispose();
		}else{
			this.fadeScene(255,0,true);
		}
	}

	this.cmdClick = function(index){
		if(tv.system.other.cg_index.indexOf(index) <= -1 || data.cglist[index].cgpath.length <= 0) return;
		var img1 = new Image();
		var path = ("Graphics/Background/" + data.cglist[index].cgpath.name + "").toLowerCase().replace(/\\/g,'/');
		img1.src = fileListFato(path,'img in cmdClick from SCG.js');
		cgBrowse.setBitmap(img1);
		cgBrowse.visible = true;
		IsShow = true;
	}

	this.updateKey = function(){
		/*
		if(OInput.BackButton){
			if(IsShow){
				cgBrowse.visible = false;
				IsShow = false;
			}else{
				CmdClose();
			}
			
		}
		*/
	}

	this.dispose = function(){
		if(IsTittle){
			tempTitle.dispose();
			tv.scene = new STitle(false);
		}else if(tv.CUIFromIndex != -1){
			tv.scene = new SCUI(tv.CUIFromIndex);
		}else{
			if(ovideo._video){
				ovideo.videoShow();
			}
			tv.scene = new SGame();
		}
		//viewport.dispose();
		oListView.dispose();
		backImage.dispose();
		cgBrowse.dispose();
		if(close != null){
			close.dispose();
		}
		
		for(var i = 0 ; i < buttons.length;++i){
			if(buttons[i] != null){
				buttons[i].dispose();
			}
		}
		buttons = null;

		if(msg != null){
			msg.dispose();
		}
	}

	//构造
	IsTittle = _isTittle;
	gLoadAssets.curLoadScene = "SCG";
	if(gLoadAssets.isNeedLoad()){

	}else{
		this.init();
	}
}