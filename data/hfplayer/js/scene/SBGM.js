function SBGM(_isTittle){
	var IsTittle = false;
	var tempTitle;
	var backImage;
	var data;
	//var viewport;
	var oListView;
	var close;
	var buttons;
	var bmps;
	var maxRow,endPos;
	var msg;
	var showmsg = false;
	var msg_x = 0 ,msg_y = 0;
	var wait;
	var isExit = false;

	this.init = function(){
		if(IsTittle){
			var img = new Image();
			var path1 = ("Graphics/Background/" + tv.data.System.Title.titleImagle).toLowerCase().replace(/\\/g,'/');
			img.src = fileListFato(path1,'img in init from SBGM.js');
			tempTitle = new OSprite(img,null);
			tempTitle.setZ(5999);
		}else{
			tv.canvas.message[tv.canvas.msgIndex].msgBoxFadeOut();
		}

		data = tv.data.System.BGM;

		backImage = new OSprite(null,null); 
		if(!data.backimage.IsNil())
		{
			var img2 = new Image();
			var path2 = ("Graphics/UI/" + data.backimage).toLowerCase().replace(/\\/g,'/');
	    	img2.src = fileListFato(path2,'img2 in init from SBGM.js');
	    	backImage.setBitmap(img2);
		}
		backImage.setZ(6000);

		var t1 = tv.data.System.Buttons[data.closeButton.index];
		if(t1.image1.IsNil() || t1.image2.IsNil()) 
		{
			console.log("SBGM:img is null");
		}else{
			close = new OButton(t1.image1 + "" ,t1.image2 + "" , "" , null, false,false);
			close.setX(data.closeButton.x);
			close.setY(data.closeButton.y);
			close.setVisible(true);
			close.setZ(6004);
			close.tag = "Back";
		}

		var t2 = tv.data.System.Buttons[data.selectButton.index];
		bmps = new Array(2);
		buttons = new Array(data.bgmList.length);
		//viewport = new OViewport(data.viewport.x,data.viewport.y,data.viewport.width,data.viewport.height);
		//viewport.SetZ(6002);
		oListView = new OListView(data.viewport.x,data.viewport.y,data.viewport.width,data.viewport.height);
		oListView.setZ(6002);
		if(t2.image1.IsNil() || t2.image2.IsNil()){
			console.log("SBGM:img is null");
		}else{
			var path = ("Graphics/Button/" + t2.image1.name).toLowerCase().replace(/\\/g,'/');
			bmps[0] = new Image();
			bmps[0].src = fileListFato(path,'bmps[0] in init from SBGM.js');
			bmps[1]= new Image();
			bmps[1].src = fileListFato(path,'bmps[1] in init from SBGM.js');
			for(var i = 0 ; i < buttons.length; ++i){
				buttons[i] = this.setButton(i);
			}
		}

		

		maxRow = ((buttons.length + data.column - 1) / data.column);
		//endPos = (maxRow - 1) * data.spanRow + bmps[0].height - data.spanRow;
		endPos = maxRow * data.spanRow+20;
		var a = new OListViewItem(buttons,endPos);
		oListView.setItem(a);
		this.fadeScene(0,255,false);

		showmsg = data.showMsg;
		if(showmsg){
			msg = new OSprite(null,null);
			msg.setZ(6003);
			msg_x = data.mx;
			msg_y = data.my;
		}
	}

	this.setButton = function(index){
		var b1 = new OButton(bmps[0],bmps[1],"",oListView.viewPort,true,false);
		var x = (index % data.column) * data.spanCol;
		var y = parseInt(index / data.column) * data.spanRow;
		b1.setX(x);
		b1.setY(y);
		b1.setVisible(true);
		b1.index = index;
		
		//b.Sprite().Clear();
		if(tv.system.other.bgm_index.indexOf(index) >= 0){
			//b.Sprite().paint.setTextSize(TempVar.data.System.FontSize);
			b1.draw2.drawText(data.bgmList[index].name,data.nx, data.ny);
		}else{
			//b.Sprite().paint.setTextSize(TempVar.data.System.FontSize);
			b1.draw2.drawText(data.noName,data.nx, data.ny);
		}
		
		return b1;
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
			if(isExit && wait == 0){
				this.dispose();
			}
			wait -= 1;
			return;
		}

		if(oListView.isMove){
			return;
		}
		if(this.updateButton()){
			return;
		}
		//else if(this.updateMove()){
		//	return;
		//}
		
		//this.updateKey();
	}
	
	this.updateMove = function(){
		if(onTouchDown && onTouchMove ){ //&& viewport.isIn()
			console.log("SBGM updateMove");
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

	this.updateKey = function(){
		/*
		if(OInput.BackButton){
			CmdClose();
		}*/
	}

	this.updateButton = function(){
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
				if(showmsg && b1.isSelected()){
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
		if(tv.system.other.bgm_index.indexOf(index) > -1){
			msg.drawText(data.bgmList[index].message,msg_x,msg_y);
		}else{
			msg.clearText();
		}
	}

	this.cmdClose = function(){
		if(IsTittle){
			this.dispose();
		}else if(tv.CUIFromIndex != -1){
			this.fadeScene(255,0,true);
		}else{
			this.fadeScene(255,0,true);
		}
	}

	this.cmdClick = function(index){
		//console.log("click------------->cmdCLICK:",fileList[("Audio/BGM/" + data.bgmList[index].bgmPath)].url);
		if(tv.system.other.bgm_index.indexOf(index) < 0) return;
		try
		{
			if(data.bgmList[index]==null || data.bgmList[index].length==0)
			{
				console.log("data.bgmList("+index+") is null !") ;
				return ;
			}
			var pathAudio = ("Audio/BGM/" + data.bgmList[index].bgmPath).toLowerCase().replace(/\\/g,'/');
			if(isIphone()){
				oaudio.playBGM(fileListFato(pathAudio,'oaudio in cmdClick from SBGM.js'),80,pathAudio);
			}else{
				oaudio.playBGM(fileListFato(pathAudio,'oaudio in cmdClick from SBGM.js'),80,pathAudio);
			}
		}
		catch(e)
		{
			console.log("Play BGM error .the index is "+index);
		}
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

	gLoadAssets.curLoadScene = "SBGM";
	if(gLoadAssets.isNeedLoad()){
		
	}else{
		this.init();
	}
	
}