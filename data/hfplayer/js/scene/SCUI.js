function SCUI(_index){
	var FIndex,zBase;
	var data;
	var bOnLoad = false;
	var onloadInter,loadingInter,buttonInter;
	var sprites;
	var buttons;
	var bars;

    var wait;
    var isExit = false;
    var nextIsCallPay = false;
	//用来判断 点击选中的按钮
	var tempArr = new Array();
	this.isNeedSendFlower="SCUI";
	//var fontOffh = 8;//0127 文字位子偏移测试值
	this.Build = function (index) {
        FIndex = index;
        bOnLoad=false;
        isExit=false;
        tv.CUIFromIndex = FIndex;
        this.init();
    };
	this.init = function(){
		data = tv.data.System.Cuis[FIndex];
		bOnLoad = true;
		zBase = 6500;
		onloadInter = new IMain();
		onloadInter.jumpStory(data.loadEvent);
		onloadInter.isCui = true;
		loadingInter = new IMain();
		loadingInter.jumpStory(data.afterEvent);
		loadingInter.isCui = true;
		sprites = new Array();
		buttons = new Array();
		bars = new Array();
		//while(true){
		//	if(!onloadInter.isFinish()){
		//		//onloadInter.update();
		//		onloadInter.UpdateSCUI(false);
		//		//onloadInter.isEnd=true;
		//	}else{
		//		break;
		//	}
		//}
	}
	this.loadControls = function(c){
		var points;
		switch(c.type){
		case 0: //-按钮
			{
				var index = c.isUserIndex ? tv.system.vars.getVar(c.index) - 1: c.index;
				var b;
				try{
					if(index == -1){
						index = tv.data.System.Buttons.length - 1;
					}
					if(index >= tv.data.System.Buttons.length){
						var image = new Image();
						b = new OButton("","","",null,false,false);
					}else{
						var db = tv.data.System.Buttons[index];
						b = new OButton(db.image1 + "",db.image2 + "","",null,false,false);//-# true
						b.name=db.image1.name;
					}
					points = this.getContrlPoint(c);
					b.setX(points[0]);
					b.setY(points[1]);
					b.transparent = true;
					//console.log(db);
					b.index = index;
					b.tag = c;
					b.setVisible(true);
					b.setZ(zBase);
					buttons.push(b);
				}catch(err){
					console.log(err.message);
				}
				break;
			}
		case 1://-字符串
			{
				var s = new OSprite(null,null);
				var dx = 0,dy = 0;
				//---###
				/* 设置图片字体大小 js这暂时没有精灵自身字体大小的设置功能
				int width = TempVar.gm.font.GetWidth(TempVar.system.string.GetString(c.index));
				int length = TempVar.system.string.GetString(c.index).split("|n").length;
				int height = TempVar.data.System.FontSize ;
				s.SetBitmap(Bitmap.createBitmap(width + 5,height * length + 5,Bitmap.Config.ARGB_4444));
				*/
				var height = tv.data.System.FontSize * 1.8;//多行字符串的行距
				var color = c.color;
				var st = tv.canvas.message[tv.canvas.msgIndex].TextAnalysis(tv.system.string.getVar(c.index));
				while(true){
					if(st.length <= 0) break;
					var smin = st.substring(0,1);
					st = st.substring(1,st.length);
					var cm = smin.charCodeAt(0);
					if(cm == 200){
						dx = 0;
						dy += height;
					}else if(cm == 202){
						var s1 = tv.canvas.message[tv.canvas.msgIndex].TextToTemp2(st ,"[","]","\\[([0-9| ]+,[0-9| ]+,[0-9| ]+)]");
						st = s1[1];
						color = new OColor(s1[0]);
					}else{
						g.font = tv.data.System.FontSize + "px "+ fontName;
						var w = g.measureText(smin).width;
						s.texts.push(new DTextA(smin,dx,dy ,color.getColor()));  //t# dy - (height / 2)
						dx += w;
					}
				}
				s.visible = true;
				points = this.getContrlPoint(c); 
				s.x = points[0];
				s.y = points[1];
				s.e["tag"] = c;//# hash e可以换成{}
				s.e["text"] = tv.system.string.getVar(c.index);
				s.setZ(zBase);
				sprites.push(s);
				break;
			}
		case 2://-变量
			{
				var sv = new OSprite(null,null);
				var isPic = c.isUserIndex;
				if(isPic && c.image1.length <= 0){
					isPic = false;
				}
				//---###
				//int w = TempVar.gm.font.GetWidth(TempVar.system.vars.GetVar(c.index) + "");
				//var h = tv.data.System.FontSize;//
				sv.drawText(tv.system.vars.getVar(c.index) + "",0,0);//t# ,-(h/2) + fontOffh
				sv.color = c.color.getColor();
				sv.visible = true;
				points = this.getContrlPoint(c);
				sv.x = points[0];
				sv.y = points[1];
				sv.e["tag"] = c;
				sv.e["text"] = tv.system.vars.getVar(c.index);
				sv.setZ(zBase);
				sprites.push(sv);
				break;
			}
		case 3://-图片
			{
				var sp = new OSprite(null,null);
				var str = c.isUserString ? tv.system.string.getVar(c.stringIndex) : c.image1;
				if(str.length <= 0){
					console.log("SCUI:loadControls case 3 ：img is null");
					var image = new Image();
					sp.setBitmap(image);
				}else{
					var path = "Graphics/Other/" + str;
					//console.log(path);
					path = path.replace(/\\/g, "/");
					path = path.replace(/\/\//g, "/");
					if(fileList[(path).toLowerCase().replace(/\\/g,'/')] != null){
						var img = new Image();
						var path2 = (path).toLowerCase().replace(/\\/g,'/');
						img.src = fileListFato(path2,'img in loadControls from SCUI.js');
						sp.setBitmap(img);
					}else{
						console.log("SCUI:loadControls case 3:img url is null");
					}
				}
				sp.visible = true;
				points = this.getContrlPoint(c);
				sp.x = points[0];
				sp.y = points[1];
				sp.e["tag"] = c;
				sp.e["text"] = path;
				sp.setZ(zBase);
				sprites.push(sp);
				break;
			}
		case 4://-滚动条
			{
				var bar = new OScrollbar(c.image1, c.image2, tv.system.vars.getVar(c.index), tv.system.vars.getVar(c.maxIndex),false);
				points = this.getContrlPoint(c);
				bar.setX(points[0]);
				bar.setY(points[1]);
				bar.setVisible(true);
				bar.setZ(zBase);
				bar.tag = c;
				bars.push(bar);
				break;
			}
		}//switch结束
	}

	this.getContrlPoint = function(c){
		var points = new Array(2);
		points[0] = c.isUserVar ? tv.system.vars.getVar(c.x) : c.x;
		points[1] = c.isUserVar ? tv.system.vars.getVar(c.y) : c.y;
		return points;
	}

	this.updateControl = function(){
		//-button
		for(var i = 0 ; i < buttons.length;++i){
			var b = buttons[i];
			if(b != null){
				var c = b.tag;
				var index = c.isUserIndex ? tv.system.vars.getVar(c.index) - 1 : c.index;
				try{
					if(index == -1){
						index = tv.data.System.Buttons.length - 1;
					}
					if(index != b.index){
						if(index>=tv.data.System.Buttons.length){
							//var image = new Image();
							b.setBitmap("","");
							//b.visible = false;
						}else{
							var db = tv.data.System.Buttons[index];
							b.setBitmap(db.image1 + "",db.image2 + "");
						}
						b.index = index;
						//b.setVisible(true);
					}
					var points = this.getContrlPoint(c);
					b.setX(points[0]);
					b.setY(points[1]);
				}catch(err){
					console.log(err.message);
				}

			}
		}
		//-sprite
		for(var i = 0 ; i < sprites.length;++i){
			var s = sprites[i];
			var c= s.e["tag"];
			if(c.type == 1){ //-字符串
				var sx1 = tv.system.string.getVar(c.index);
				var sx2 = s.e["text"];
				if(sx1 != sx2){
					s.clearText();
					var dx = 0 ,dy = 0;
					//---###
					/*
					int width = (int) (TempVar.gm.font.GetWidth(TempVar.system.string.GetString(c.index)) * TempVar.zoomScene);
					int length = TempVar.system.string.GetString(c.index).split("|n").length;
					int height = (int) (TempVar.gm.font.GetHeight("|") *TempVar.zoomScene);
					s.SetBitmap(Bitmap.createBitmap(width + 5,height * length + 5,Bitmap.Config.ARGB_4444));
					*/
					var height = tv.data.System.FontSize * 1.8;//行距
					var color = c.color;
					var st = tv.canvas.message[tv.canvas.msgIndex].TextAnalysis(tv.system.string.getVar(c.index));
					while(true){
						if(st.length <= 0) break;
						var smin = st.substring(0,1);
						st = st.substring(1,st.length);
						var cm = smin.charCodeAt(0);
						if(cm == 200){
							dx = 0;
							dy += height;
						}else if(cm == 202){
							var s1 = tv.canvas.message[tv.canvas.msgIndex].TextToTemp2(st ,"[","]","\\[([0-9| ]+,[0-9| ]+,[0-9| ]+)]");
							st = s1[1];
							color = new OColor(s1[0]);
						}else{
							g.font = tv.data.System.FontSize + "px "+ fontName;
							var w = g.measureText(smin).width;
							s.texts.push(new DTextA(smin,dx,dy ,color.getColor()));//t# dy- (height / 2)
							dx += w;
						}
					}
					s.e["text"] = tv.system.string.getVar(c.index);
				}
			}else if(c.type == 2){ //-变量
				var int1 = tv.system.vars.getVar(c.index);
				var int2 = s.e["text"];
				if(int1 != int2){
					//---###
					var isPic = c.isUserIndex;
					if(isPic && c.image1.length <= 0){
						isPic = false;
					}
					//var h = tv.data.System.FontSize;
					s.drawText(tv.system.vars.getVar(c.index) + "",0,0);//t# -(h/2) + fontOffh
					s.color = c.color.getColor();
					s.e["text"] = tv.system.vars.getVar(c.index);
				}
			}else if(c.type == 3){ //-图片
				var str = c.isUserString ? tv.system.string.getVar(c.stringIndex) : c.image1;
				if(str.length <= 0){
					console.log("SCUI: updateControl type == 3 :img is null");
				}else{
					var path = "Graphics/Other/" + str;
					path = path.replace(/\\/g, "/");
					path = path.replace(/\/\//g, "/");
					var sx2 = s.e["text"];
					if(path != sx2){
						var img = new Image();
						if(fileList[(path).toLowerCase().replace(/\\/g,'/')] != null){
							var pathScui1 = (path).toLowerCase().replace(/\\/g,'/');
							img.src = fileListFato(pathScui1,'img in updateControl from SCUI.js');
							s.setBitmap(img);
						}else{
							console.log("SCUI: updateControl type == 3: img url is null");
						}
						//s.visible = true; //0504 高级ui图片闪烁显示问题
						s.e["text"] = path;
					}
				}
			}
			var points = this.getContrlPoint(c);
			s.x = points[0];
			s.y = points[1];
		}

		//-oscrollbar
		for(var i = 0 ; i < bars.length ; ++i){
			var b = bars[i];
			if(b != null){
				var c = b.tag;
				var points = this.getContrlPoint(c);
				b.setValue(tv.system.vars.getVar(c.index),tv.system.vars.getVar(c.maxIndex));
				b.moveBar();
				b.setX(points[0]);
				b.setY(points[1]);
			}
		}
	}

	this.scuiInit = function () {
		if(bOnLoad){
			var imgArr = new Array();
			for(var i = 0 ; i < data.controls.length;++i){
				var c = data.controls[i];
				if(c.type == 3){
					var path, path2;
					var str = c.isUserString ? tv.system.string.getVar(c.stringIndex) : c.image1;
					if(str.length > 0){
						path = "Graphics/Other/" + str;
						path = path.replace(/\\/g, "/");
						path = path.replace(/\/\//g, "/");
						if(fileList[(path).toLowerCase().replace(/\\/g,'/')] != null){
							path2 = (path).toLowerCase().replace(/\\/g,'/');
							imgArr.push({name:path,src:path2});
						}
					}
				}
			}
			sVLoadImg.loadImgData(imgArr, function (arr) {
				for(var i = 0  ; i < data.controls.length;++i){
					self.loadControls(data.controls[i]);
					zBase += 10; //不要+1 避免和进度条的层级重叠
				}
				bOnLoad = false;
			});
		}
	}

	this.update = function(){
		//当onloadInter事件执行完毕后 去实例化界面
		if(onloadInter && !onloadInter.isFinish()){
			//onloadInter.update();
			onloadInter.UpdateSCUI(false);
			return;
			//onloadInter.isEnd=true;
		}else{
			this.scuiInit();
		}
        if(!bOnLoad){
            this.updateControl();
            //this.updateClose()
            if(buttonInter != null){
                if(!buttonInter.isFinish()){
                    buttonInter.UpdateSCUI(true);
                    return;
                }else{
					this.sendFlowerUI = null;
                    buttonInter = null;
					nextIsCallPay = false;
                }
            }
            //0209 updateControl更新了button的值，需要刷新才可见。放在loadingInter.update()之前，不能被一直阻塞。
            this.updateButton();
            this.updateBar();


            if(loadingInter&&!loadingInter.isFinish()){
                loadingInter.UpdateSCUI(false);
            }
            if(wait > 0){
                //console.log('aaaa');
                wait -= 1;
                if(isExit && wait == 0){
                    this.dispose();
                }
            }
        }
	}

	this.updateBar = function(){
		for(var i = 0 ; i < bars.length ; ++i){
			var b = bars[i];
			if(b != null){
				var c = b.tag;
				b.setValue(tv.system.vars.getVar(c.index),tv.system.vars.getVar(c.maxIndex));
				b.moveBar();
			}
		}
	}


	var self = this;
    this.fadeScene= function (start,To,is_Exit) {
        wait = 5;
        for (var i = 0; i < buttons.length; i++) {
            if(buttons[i]!=null){
                buttons[i].setOpactiy(start);
                buttons[i].SetFade(To, wait);
            }
        }
        for(var i= 0;i<sprites.length;i++){
            if(sprites[i]!=null){
                sprites[i].opacity = start;
                sprites[i].FadeTo(To, wait);
            }
        }
        isExit = is_Exit;
    }
    this.cmdClose= function () {
         this.fadeScene(255,0,true);
    }
	this.refresh = function () {
		//nextIsCallPay=true;
		var ffindex=FIndex;
		nextIsCallPay=false;
		//alert("aa");
		tv.scene.dispose();
		//isExit=true;
		tv.scene = new SCUI(ffindex);
		//tv.scene.Build(ffindex);
		//tv.scene=new SCUI(ffindex);
	}
	this.cmdButton = function(b){
        var c= b.tag;
        nextIsCallPay=false;
		for(var i=0;i< c.event.length;i++){
            if(c.event[i].Code == 107){
               var  isNext=c.event[i].Argv[0].indexOf("call_pay");
                if(isNext>-1){
                    nextIsCallPay=true;
                    break;
                }
            }
            //if(c.event[i].Code==208  && c.index == b.index){
            //    tv.scene.cmdClose();
            //    tv.inter.endInter();
            //}
        }
        if(!nextIsCallPay){
            this.sendFlowerUI=null;
        }else{
			//console.log("有callPay");
            this.sendFlowerUI=true;
        }
        buttonInter = new IMain();
        buttonInter.isCui = true;
        buttonInter.jumpStory(c.event);
	}
	

	this.dispose = function(){
		for(var i = 0 ; i < buttons.length;++i){
			var b = buttons[i];
			if(b != null){
				b.dispose();
			}
		}

		for(var i = 0 ; i < sprites.length;++i){
			var s = sprites[i];
			if(s != null){
				s.dispose();
			}
		}

		for(var i = 0 ; i < bars.length ; ++i){
			var b = bars[i];
			if(b != null){
				b.disPose();
			}
		}
		if(buttons){
			buttons.length = 0;
		}
		if(sprites){
			sprites.length = 0;
		}
		if(bars){
			bars.length = 0;
		}
		if(!nextIsCallPay){   //按钮事件中不包含callpay
			//if(buttonInter != null){
			//    alert("aaaaa");
			//    buttonInter.IsEnd = true;
			//    buttonInter=null;
			//}
			//if(this.sendFlowerUI){
			//    this.sendFlowerUI=null;
			//}
			if(buttonInter){
				buttonInter.isEnd = true;
				buttonInter=null;
				if(this.sendFlowerUI){
					this.sendFlowerUI=null;
				}
			}
		}
		//loadingInter=null;
		//onloadInter=null;
		//data=null;
	}

	/*
	public void updateClose(){
		if(OInput.BackButton && data.isKeyExit){
			dispose();
			TempVar.scene = new SGame();
		}
	}
	*/

	this.updateButton = function(){
		var self = this;
		var a= onClick();
		//for(var i = 0; i < sprites.length;i++){
		//	var s = sprites[i];
		//	if(s){
		//		s.respTranArea(a, function (bool) {
		//			if(bool){
		//				//tempSpArr.push(s);
		//				console.log(s);
		//			}
		//		});
		//	}
		//}

		function goNext(){
			if(tempArr.length>0){
				var k=0,z= 0;
				for(var i=0;i<tempArr.length;i++){
					if(tempArr[i].back.z > z){
						z = tempArr[i].back.z;
						k = i;
					}
				}
				self.cmdButton(tempArr[k]);
				tempArr.length = 0;
			}
		}
		for(var i = 0 ; i < buttons.length;++i){
			var b = buttons[i];
			if(b != null){
				b.update();
				b.isClick(a,function (bool,button) {
					if(bool){
						tempArr.push(button);
					}
					if(i == buttons.length-1){
						goNext();
					}
				},b);
				//if(b.isClick(a)){
				//	//if(!clickArr){
				//	//	clickArr =new Array();
				//	//}
				//	this.cmdButton(b);
				//	//a = false;
				//	break;
				//	//clickArr.push(b);
				//}
			}
		}

		return;
	}

	//构造
	FIndex = _index;
	tv.CUIFromIndex = FIndex;
	gLoadAssets.curLoadScene = "SCUI";
	if(gLoadAssets.isNeedLoad()){
		//0305 e.g:小优化 63481 214事件 高级ui切高级ui时 由于第一个高级ui的sprites已经被释放 
		//     再加载新的一张高级ui时 被切到加载场景 此时可能导致没有sprites的z大于talkMsg的z 
		//     造成talkMsg在加载时显示 优化方式为加载场景自己添加张z值较大的图即可
	}else{
		this.init();
	}
}