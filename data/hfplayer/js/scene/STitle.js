function STitle(is_Run){

	var isRun,toTitle = false,logEnd = false;
	var data;
	var fadeFrames,waitFrames;
	var log,bg;
	var buttons;

	this.init = function(){
		tv.canvas.clear();

		data = tv.data.System.Title;
		oaudio.stopSE();
		oaudio.stopBGS();
		oaudio.stopVoice();
		if(data.showLog && data.logoImage.name.length> 0 && isRun){
			fadeFrames = 30;
			this.startLogo();
		}else{
			fadeFrames = 15;
			this.startNormal();
		}
    };

    this.startLogo = function(){
		log = new OSprite(null,null);
        var img = new Image();
		var path = ("Graphics/UI/" + data.logoImage).toLowerCase().replace(/\\/g,'/');
        var fd = fileList[("Graphics/UI/" + data.logoImage).toLowerCase().replace(/\\/g,'/')];
        if(fd != null){
	        img.src = fileListFato(path,'img in startLogo from STitle.js');
	        log.setBitmap(img);
			log.opacity = 0;
			log.x = 0; 
			log.y = 0;
			log.FadeTo(255, fadeFrames);
        }
    
		waitFrames = fadeFrames;

	}

	this.startNormal = function(){
		toTitle = false;

		bg = new OSprite(null,null);
		var img = new Image();
		var path = ("Graphics/Background/" + data.titleImagle).toLowerCase().replace(/\\/g,'/');
		var fd = fileList[("Graphics/Background/" + data.titleImagle).toLowerCase().replace(/\\/g,'/')];
        if(fd != null){
        	img.src = fileListFato(path,'img in startNormal from STitle.js');
			bg.setBitmap(img);
        }
		

		buttons = new Array(data.buttons.length);
		var types = new Array("NewGame" , "LoadGame" , "CG" , "BGM" , "Setting" , "Exit");

		for (var i = 0; i < buttons.length; ++i) {
			var b = tv.data.System.Buttons[data.buttons[i].index];
			if(b.image1.IsNil() || b.image2.IsNil()) continue;
			var button = new OButton(b.image1 + "",b.image2 + "","",null,false,false);//---
			button.setX(data.buttons[i].x);
			button.setY(data.buttons[i].y);
			button.setVisible(true);
			button.tag = types[i];
			buttons[i] = button;
		}
		
		if(!data.bgm.FileName.IsNil()){

			if(isRun){
				if(isIphone()){
					if(fileList[("Audio/BGM/" + data.bgm.FileName.name).toLowerCase().replace(/\\/g,'/')]){
						oaudio.playBGM(fileList[("Audio/BGM/" + data.bgm.FileName.name).toLowerCase().replace(/\\/g,'/')].url(),data.bgm.Volume,("Audio/BGM/" + data.bgm.FileName.name).toLowerCase());
					}
            	}else{
					if(fileList[("Audio/BGM/" + data.bgm.FileName.name).toLowerCase().replace(/\\/g,'/')]){
                		oaudio.playBGM(fileList[("Audio/BGM/" + data.bgm.FileName.name).toLowerCase().replace(/\\/g,'/')].url(),data.bgm.Volume,("Audio/BGM/" + data.bgm.FileName.name).toLowerCase());
					}
            	}
			}
		}else{
			oaudio.stopBGM();
		}
	}

    this.update = function(){
		if(waitFrames > 0){
			waitFrames -= 1;
			return;
		}

		if(toTitle && logEnd){
			this.startNormal();
		}else{
			this.fadeOutLogo();
		}
		if(buttons != null){
			for(var i = 0 ; i < buttons.length;++i){
				var b = buttons[i];
				if(b != null){
					b.update();
					if(b.isClick()) this.buttonClick(b);
				}
			}
		}
    };

    this.buttonClick = function(b){
		if(b.tag === "NewGame"){
			//SGame.PostURL(4002); 
			tv.system.vars = new DGameVariables();
			tv.inter.jumpStory(tv.data.System.StartStoryId);
			this.dispose();
			tv.scene = new SGame();
			//if(DRemberValue.srcPath == 1)
			//	GameMainScene.ShowAD();
			oaudio.bgmFade(2);
		}else if (b.tag === "LoadGame") {
			this.dispose();
			tv.scene = new SSavefile(true, false);
		}else if (b.tag === "CG") {
			this.dispose();
			tv.scene = new SCG(true);
		}else if (b.tag === "BGM") {
			this.dispose();
			tv.scene = new SBGM(true);
		}else if (b.tag === "Setting" ) {
			this.dispose();
			tv.scene = new SSystem(true);
		}else if (b.tag === "Exit") {
			//GameMainScene.ExitGame();
			if(mark == "isFlash"){
				return;
			}
			var Exiturl = "http://m.66rpg.com/game/mobileDown/"+gIndex;
			window.location.href= Exiturl;
		}
	}

	this.fadeOutLogo = function(){
		if(data.showLog && !logEnd && !toTitle && log != null){
			log.FadeTo(0, fadeFrames);
			waitFrames = fadeFrames;
			toTitle = true;
			logEnd = true;
		}
	}

	this.dispose = function() {
		if(log != null) log.dispose();
		if(bg != null) bg.dispose();
		if(buttons != null){
			for(var i = 0 ; i < buttons.length;++i){
				if(buttons[i] != null){
					buttons[i].dispose();
				}
			}
		}
	}

	//构造
	isRun = is_Run;
	this.init();

}