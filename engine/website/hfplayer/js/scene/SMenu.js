function SMenu(){
	var data;
	var backImage;
	var buttons;
	var wait;
	var isExit = false;

	this.init = function(){
		data = tv.data.System.GameMenu;
		backImage = new OSprite(null,null); 
		var img = new Image();
		var path = ("Graphics/UI/" + data.backImage).toLowerCase().replace(/\\/g,'/');
	    img.src = fileListFato(path,'img in init from SMenu.js');
	    backImage.setBitmap(img);
	    backImage.setZ(10100);

	    var types = new Array("Save","Load","Replay","Auto","System","Back");
	    buttons = new Array(types.length);
	    for(var i = 0 ; i < buttons.length;++i){
	    	var db = tv.data.System.Buttons[data.buttons[i].index];
	    	if(db.image1.IsNil() || db.image2.IsNil()) continue;
	    	buttons[i] = new OButton(db.image1,db.image2,"",null,false,false);
	    	buttons[i].setX(data.buttons[i].x);
	    	buttons[i].setY(data.buttons[i].y); 
	    	buttons[i].setZ(10101);
	    	buttons[i].setVisible(true);
	    	buttons[i].tag = types[i];
	    }

	    this.fadeScene(0,255,false);
	}
	
	this.fadeScene = function(start,To,is_Exit){
		wait = 5;
		for (var i = 0; i < buttons.length; i++) {
			if(buttons[i]!=null){
				buttons[i].setOpactiy(start);
				buttons[i].SetFade(To, wait);
			}
		}
		backImage.opacity = start;
		backImage.FadeTo(To, wait);
		isExit = is_Exit;
	}

	this.cmdClose = function(){
		this.fadeScene(255,0,true);
	}

	this.updateKey = function(){
		/*if(OInput.BackButton){ 
			cmdClose();
		}*/
	}

	this.updateButton = function(){
		if(buttons != null){
			for(var i = 0 ; i < buttons.length;++i){
				var b = buttons[i];
				if(b!= null){
					b.update();
					if(b.isClick()) {
						//tv.data.System.SEClick.Play();  //无play
						this.buttonClick(b);
						break;
					}
				}	
			}
		}
	}

	this.buttonClick = function(button){
		if(button.tag === "Save"){
			this.cmdClose();
			tv.scene = new SSavefile(false, true);
		}else if (button.tag === "Load") {
			this.cmdClose();
			tv.scene = new SSavefile(false, false);
		}else if (button.tag === "Replay") {
			this.cmdClose();
			tv.scene = new SReplay();
		}else if (button.tag === "Auto") {
			this.cmdClose();
			tv.system.autoRun = !tv.system.autoRun;
			tv.scene = new SGame();
		}else if (button.tag === "System") {
			this.cmdClose();
		 	tv.scene = new SSystem(false);
		}else if (button.tag ==="Back") {
			if(ovideo._video){
				ovideo.videoShow();
			}
			this.cmdClose();
		}
	}


	this.update = function(){
		if(wait > 0){
			wait -= 1;
			if(isExit && wait == 0){
				this.dispose();
			}
			return;
		}
		this.updateKey();
		this.updateButton();
	}

	this.dispose = function(){
		if(backImage != null) backImage.dispose();
		for(var i = 0 ; i < buttons.length;++i){
			if(buttons[i] != null){
				buttons[i].dispose();
			}
		}
		tv.scene = new SGame();
	}

	//构造
	gLoadAssets.curLoadScene = "SMenu";
	if(gLoadAssets.isNeedLoad()){
		
	}else{
		this.init();
	}
}