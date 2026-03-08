function SSystem(_isTittle,m){
	var isTittle = false;
	var tempTitle;
	var backImage;
	var data;
	var buttons;
	var checks;
	var bars;

	this.init = function(){
		if(isTittle){
			var img = new Image();
			var path = ("Graphics/Background/" + tv.data.System.Title.titleImagle).toLowerCase().replace(/\\/g,'/');
			img.src = fileListFato(path,'img in init from SSystem.js');
			tempTitle = new OSprite(img,null);
			tempTitle.setZ(5999);
		}else{
			tv.canvas.message[tv.canvas.msgIndex].msgBoxFadeOut();
		}
		data = tv.data.System.Setting;
		backImage = new OSprite(null,null); 
		if(!data.backimage.IsNil())
		{
			var img2 = new Image();
			var path2 = ("Graphics/UI/" + data.backimage).toLowerCase().replace(/\\/g,'/');
	    	img2.src = fileListFato(path2,'img2 in init from SSystem.js');
	    	backImage.setBitmap(img2);
		}
		backImage.setZ(6000);

		buttons = new Array(); 
		this.setButton(data.closeButton, "Back");
		this.setButton(data.TitleButton, "cmdTitle");

		checks = new Array();
		if(data.SHowAuto){
			this.setCheck(data.AutoOn, "cmdAutoOn", tv.system.autoRun);
			this.setCheck(data.AutoOff, "cmdAutoOff", !tv.system.autoRun);
		}
		if(data.ShowFull){
			this.setCheck(data.fullButton, "cmdFull", true);
			this.setCheck(data.winButton,"cmdWin",false);
		}
		
		bars = new Array();
		if(data.ShowBGM){
			this.setBar(data.barNone + "", data.barMove + "", "cmdBGM", oaudio.bgmV, data.BgmX, data.BgmY);
		}

		if(data.ShowSE){
			this.setBar(data.barNone + "", data.barMove + "", "cmdSE", oaudio.seV, data.SeX, data.SeY);
		}

		if(data.ShowVoice){
			this.setBar(data.barNone + "", data.barMove + "", "cmdVoice", oaudio.voiceV, data.VoiceX, data.VoiceY);
		}

		this.setOtherCheck();
	}

	this.setButton = function(button,cmd){
		var t1 = tv.data.System.Buttons[button.index];
		if(t1.image1.IsNil() || t1.image2.IsNil()) 
			return;

		var b1 = new OButton(t1.image1 + "" ,t1.image2 + "" , "" , null, false,false);
		b1.setX(button.x);
		b1.setY(button.y);
		b1.setVisible(true);
		b1.setZ(6500);
		b1.tag = cmd;
		buttons.push(b1);
	}

	this.setCheck = function(check,cmd,selected){
		var t1 = tv.data.System.Buttons[check.index];
		if(t1.image1.IsNil() || t1.image2.IsNil()){
			console.log("<<<SSystem<<setCheck<<img is null");
			return;
		} 

		var c1 = new OCheck(t1.image1 + "", t1.image2 + "",selected);    
		c1.setX(check.x);
		c1.setY(check.y);
		c1.visible(true);
		c1.setZ(6500);
		c1.tag = cmd;
		checks.push(c1);
	}

	this.setBar = function(imageA,imageB,cmd,value,x,y){
		//if(imageA.length <= 0 || imageB.length <= 0) return;

		var bar1 = new OScrollbar(imageA,imageB,value,100,true);
		bar1.setX(x);
		bar1.setY(y);
		bar1.setVisible(true);
		bar1.setZ(65000);
		bar1.tag = cmd;
		bars.push(bar1);
	}

	this.setOtherCheck = function(){
		if(data.SHowAuto){
			if(checks.length >= 2){ //0416 系统设置里不一定有check选项
				checks[0].setOtherCheck(checks[1]);
				checks[1].setOtherCheck(checks[0]);
			}else{
				console.log("<<<SSystem<<<init<<check length < 2");
			}
			
		}
		if(data.ShowFull){
			if(checks.length >= 4){ 
				checks[2].setOtherCheck(checks[3]);
				checks[3].setOtherCheck(checks[2]);
			}else{
				console.log("<<<SSystem<<<init<<check length < 4");
			}
		}
	}

	this.cmdClose = function(){
		this.dispose();
		if(isTittle){
			tv.scene = new STitle(false);
		}else if(tv.CUIFromIndex != -1){
			tv.scene = new SCUI(tv.CUIFromIndex);
		}else{
			if(ovideo._video){
				ovideo.videoShow();
			}
			tv.scene = new SGame();
		}
	}

	this.cmdTitle = function(){
		this.dispose();
		if(!isTittle){
			tv.canvas.clear();
		}
		//console.log(tv.data.System.SkipTitle);

		/*如果是设置里面设置了跳过标题页面执行，目前不执行*/
		//tv.scene = tv.data.System.SkipTitle ? new SGame() : new STitle(true);//SStart : new STitle(false)
		//直接跳到标题界面
		//tv.scene = new STitle(true);
		/*if(m){
			m.endInter();
		}else{
			tv.scene = new STitle(true);
		}*/
		if(tv.data.System.SkipTitle){
			if(tv.data.System.StartStoryId){
				tv.inter.jumpStory(tv.data.System.StartStoryId);
				tv.scene = new SGame();
			}else{
				if(m){
					m.endInter();
				}else{
					tv.scene = new STitle(true);
				}
			}
		}else{
			if(m){
				m.endInter();
			}else{
				tv.scene = new STitle(true);
			}
		}
	}

	this.cmdAutoOn = function(){
		tv.system.autoRun = true;
	}

	this.cmdAutoOff = function(){
		tv.system.autoRun = false;
	}

	this.cmdBGM = function(){
		if(!data.ShowBGM) return;
		oaudio.setBgmVolumeGame(bars[0].value);
		oaudio.setBGSVolumeGame(bars[0].value);
	}

	this.cmdSe = function(){
		if(!data.ShowSE) return;
		oaudio.setSeVolumeGame(bars[1].value);
	}

	this.cmdVoice = function(){
		if(!data.ShowSE) return;
		oaudio.setVoiceVolumeGame(bars[2].value);
	}

	this.update = function(){
		if(this.updateButton()) return;
		this.updateCheck();
		this.updateBar();
		//this.updateKey();
	}

	this.updateKey = function(){
		/*
		if(OInput.BackButton){
			CmdClose();
		}
		*/
	}

	this.updateBar = function(){
		if(bars == null) return;
		for(var i = 0; i < bars.length ; ++i){
			if(bars[i] == null) continue;
			bars[i].update();
			if(onTouchDown && onTouchMove){
				bars[i].updateValue();
				if(bars[i].tag === "cmdBGM"){
					this.cmdBGM();
				}else if(bars[i].tag === "cmdSE"){
					this.cmdSe();
				}else if(bars[i].tag === "cmdVoice"){
					this.cmdVoice();
				}
			}
		}
	}

	this.updateCheck = function(){
		if(checks == null) return;
		
		for (var i = 0; i < checks.length; ++i) {
			if(checks[i] == null) continue;
			checks[i].update();
			if(checks[i].isClick() && onTouchDown){
				checks[i].clickBox();
				if(checks[i].tag === "cmdAutoOn"){
					this.cmdAutoOn();
				}else if(checks[i].tag === "cmdAutoOff"){
					this.cmdAutoOff();
				}
			}
		}
		
	}

	this.updateButton = function(){
		if(buttons == null) return false;
		for(var i = 0 ; i < buttons.length ; ++i){
			if(buttons[i] == null) continue;
			buttons[i].update();
			if(buttons[i].isClick()){
				if(buttons[i].tag === "Back"){
					this.cmdClose();
				}else if(buttons[i].tag === "cmdTitle"){
					this.cmdTitle();
				}
				return true;
			}
		}
		return false;
	}

	this.dispose = function() {
		if(isTittle){
			tempTitle.dispose();
		}else{
			tv.canvas.message[tv.canvas.msgIndex].msgboxFadeIn();
		}
		backImage.dispose();

		if(buttons != null){
			for(var i = 0 ; i < buttons.length;++i){
				if(buttons[i] != null){
					buttons[i].dispose();
				}
			}
		}
		buttons = null;

		if(checks != null)
		for (var i = 0; i < checks.length; ++i) {
			if(checks[i] != null){
				checks[i].dispose();
			}
		}
		checks = null;
		

		if(bars != null){
			for (var i = 0; i < bars.length; ++i) {
				if(bars[i] != null)
					bars[i].disPose();
			}
		}
		bars = null;
	}


	//构造
	isTittle = _isTittle;

	gLoadAssets.curLoadScene = "SSystem";
	if(gLoadAssets.isNeedLoad()){
		
	}else{
		this.init();
	}
}