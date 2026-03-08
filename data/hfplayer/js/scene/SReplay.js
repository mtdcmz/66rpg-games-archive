function SReplay(){

	var data;
	var backimage;
	var closebutton = null;
	var text;
	var str;
	var textheight;
	var maxnum;
	var maxline;
	var startline;
	var wait;
	var isExit = false;
	var view;
	var opView;

	this.init = function(){
		tv.canvas.message[tv.canvas.msgIndex].msgBoxFadeOut();
		data = tv.data.System.Replay;
		backimage = new OSprite(null,null); 
		if(!data.backimage.IsNil()){
			var img = new Image();
			var path = ("Graphics/UI/" + data.backimage).toLowerCase().replace(/\\/g,'/');
	    	img.src = fileListFato(path,'img in init from SReplay.js');
	    	backimage.setBitmap(img);
		}else{
			//backimage.setBitmap(Bitmap.createBitmap(10,10,Bitmap.Config.ALPHA_8)); 
		}
		backimage.setZ(6000); 
		var db = tv.data.System.Buttons[data.closeButton.index];
		if(db.image1.IsNil() || db.image2.IsNil()) {
			console.log("SReplay:img is null");
		}else{
			closebutton = new OButton(db.image1 + "",db.image2 + "","",null,false,false);
			closebutton.setZ(6003);
			closebutton.setX(data.closeButton.x);
			closebutton.setY(data.closeButton.y);
			closebutton.setVisible(true);
			closebutton.tag = "Back";
		}

		//view = new OViewport(data.viewport.x,data.viewport.y,data.viewport.width,data.viewport.height);
		//view.SetZ(6002);
		//text = new OSprite(null,view);
		//text.setBitmap(Bitmap.createBitmap(data.viewport.width,data.viewport.height,Bitmap.Config.ARGB_4444) );//--
		//text.paint.setColor(tv.data.System.FontUiColor.getColor());
		//text.x = 0;//0
		//text.y = 0;//0
		//str = this.makeText();
		textheight = tv.canvas.message[tv.canvas.msgIndex].lineHeight;
		//maxnum = parseInt(data.viewport.height * 1.0 / textheight);
		//maxline = Math.max(str.length - maxnum, 0);
		//startline = maxline;
		//回放文本数组
		str = this.makeText();
		//listView
		opView = new OListView(data.viewport.x,data.viewport.y,data.viewport.width,data.viewport.height);
		//for(var i = 0;i<1;i++){
			var spArr = new Array();
			var sp = new OSprite(null,opView.viewPort);
			opView.setZ(6002);
			//sp.drawLineTxt(str, 0, 0,tv.data.System.FontUiColor.getColor(),tv.data.System.FontSize);
			sp.drawTextList(str, 0, 0,tv.data.System.FontUiColor.getColor());
			spArr.push(sp);
			var a = new OListViewItem(spArr,str.length*tv.canvas.message[tv.canvas.msgIndex].lineHeight);
			opView.setItem(a);
			opView.setEndPos(str.length * tv.canvas.message[tv.canvas.msgIndex].lineHeight);
		//}

		//this.updateText();
		//console.log(str);
		this.fadeScene(0,255,false);
	}
	

	this.makeText = function(){  
		var s = tv.system.replay.replay;
		if(s.length <= 0) return new Array();
		var rs = new Array();
		for(var i = 0 ; i < s.length ; ++i){
			var n_s = new String(s[i].replaceAll("\\\\[Nn]", ""));
			var font_count = 0;
			font_count = parseInt(parseInt((data.viewport.width / (tv.data.System.FontSize * tv.FontZoom)) * 1.2)); //1.5 太大超出范围了
			for(var j = 0 ; j < n_s.length ; ++j){
				if(j % font_count == 0){
					n_s = n_s.insert("\\n",j);
				}
			}
			var ts = n_s.split("\\n");
			n_s = null;
			for(var j = 0 ; j < ts.length;++j){
				if(ts[j].length == 0 && j > 0 && ts[j - 1].length == 0){ 
					continue;
				}
				rs.push(ts[j]);
			}
		}
		return rs;
	}

	this.updateText = function(){
		var s = new Array();
		var tonum = startline + maxnum;
		if(tonum > str.length - 1) tonum = str.length - 1;
		for (var i = startline; i <= tonum; ++i) {
				s.push(str[i]);
		}
		//text.clear();
		//text.drawTextList(s, 0, 0,tv.data.System.FontUiColor);


		text.drawTextList(s, 0, 0,tv.data.System.FontUiColor.getColor());
	}

	this.fadeScene = function(start,To,is_Exit){
		wait = 5;
		backimage.opacity = start;
		backimage.FadeTo(To,wait);
		//text.opacity = start;
		//text.Fade(start,To,wait);
		if(closebutton != null){
			closebutton.setOpactiy(start);
			closebutton.SetFade(To,wait);
		}
		isExit = is_Exit;
	}

	this.update = function(){
		if(wait > 0){
			wait -= 1;
			if(isExit && wait == 0){
				this.dispose();
			}
			return;
		}
		//if(this.updateKey()) return;
		if(this.updateMove()) return;
		this.updateButton();
	}

	this.updateKey = function(){
		/*
		if(OInput.BackButton){
			backScene();
			return true;
		}
		return false;
		*/
	}

	this.backScene = function(){
		this.fadeScene(255,0,true);
	}

	this.updateButton = function(){
		if(closebutton != null)
		{
			closebutton.update();
			if(closebutton.isClick()){
				this.backScene();
			}
		}
	}
	
	this.updateMove = function(){
		//if( onTouchDown && onTouchMove && view.isIn()){  // text.isSelectedNoImage()
		//	var moveLine = parseInt((onTouchDY - onTouchY)/10);
		//	startline += moveLine;
		//	if(startline >= maxline) startline = maxline;
		//	if(startline <= 0) startline = 0;
		//	//this.updateText();
		//	onTouchDY = onTouchY;
		//	return true;
		//}
		//return false;
	}

	this.dispose = function() {
		tv.canvas.message[tv.canvas.msgIndex].msgboxFadeIn();
		backimage.dispose();
		if(closebutton != null){
			closebutton.dispose();
		}
		opView.dispose();
		//view.dispose();
		//text.dispose();
		if(tv.CUIFromIndex != -1){
			tv.scene = new SCUI(tv.CUIFromIndex);
		}else{
			if(ovideo._video){
				ovideo.videoShow();
			}
			tv.scene = new SGame();
		}
	}

	//构造
	gLoadAssets.curLoadScene = "SReplay";
	if(gLoadAssets.isNeedLoad()){//0420 对replay场景预加载需求 移动端可能先出文字再出图片
		
	}else{
		this.init();
	}
}