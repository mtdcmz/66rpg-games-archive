function OScrollbar(image1,image2,_value,_max,IsUI){
	var image;
	var back = null;
	var toptemp = null;
	this.value = null;
	var tempValue , max;
	this.tag = null;
	var topviewport = null;

	//构造
	var tempPath = IsUI ? "Graphics/UI/" : "Graphics/Other/" ;

	this.init = function(){
		try{
			image = new Image();

			
			if(image1.length <= 0){
				back = new OSprite(null,null);
			}else{
				if(image1 instanceof  Image){
					image[0] = image1;
				}else{
					image[0] = new Image();
					console.log("(tempPath + image1).toLowerCase():",(tempPath + image1).toLowerCase());

					image1 = image1.replace("\/","");
					var path1 = (tempPath + image1).toLowerCase().replace(/\\/g,'/');

					image[0].src = fileListFato(path1,'image[0] in OScrollbar.js');
				}
				back = new OSprite(image[0],null);
			}

			if(image2.length <= 0){
				toptemp = new OSprite(null,null);
				console.log("OScrollbar:image2 is null");
			}else{

				if(image2 instanceof  Image){
					image[1] = image2;
				}else{
					image[1] = new Image();
					image2 = image2.replace("\/","");
					var path2 = (tempPath + image2).toLowerCase().replace(/\\/g,'/');
					image[1].src = fileListFato(path2,'image[0] in OScrollbar.js');
				}
				topviewport = new OViewport(0,0,image[1].width,image[1].height);
				toptemp = new OSprite(image[1],topviewport);
			}

			this.value = _value;
			max = _max;
			tempValue = -1;
		}catch(e){
			console.log(e);
		}
	}


	this.setX = function(x){
		back.x = x ;
		//top.x = x;
		if(topviewport != null){
			topviewport.x = x;
		}
	}

	this.setY = function(y){
		back.y = y;
		//top.y = y;		if(topviewport != null){
		topviewport.y = y;
	}

	this.setZ = function(z){
		back.setZ(z);
		if(topviewport != null){
			topviewport.SetZ(z + 1);
		}
		toptemp.setZ(z + 1);
	}

	this.setVisible = function(v){
		back.visible = v;
		toptemp.visible = v;
	}

	this.width = function(){
		return back.width;
	}

	this.height = function(){
		return back.height;
	}

	this.setOpactiy = function(o){
		back.opacity = o;
		toptemp.opacity = o;
	}

	this.disPose = function(){
		back.dispose();
		toptemp.dispose();
		topviewport.dispose();
		image[0] = null;
		image[1] = null;

	}

	this.update = function(){
		if(!back.visible) return;
		this.moveBar();
	}

	this.moveBar = function(){
		if(tempValue != this.value){
			toptemp.getRect();
			//0115 img可能还没加载出来导致width为0 若此时设置了tempValue
			//导致下次update不再设置topviewport.width即清缓存后的第一次加载看到的现象topviewport无值



			if(toptemp.width > 0)
			{
				tempValue = this.value;
			}
			if(topviewport != null){
				topviewport.width = Math.floor(toptemp.width * (this.value * 1.0) / (max * 1.0));
				topviewport.height = toptemp.height;
			}
		}
	}

	this.updateValue = function(){
		back.getRect();//0115 img可能还没加载出来导致height,width为0
		if(onTouchY > (back.y * tv.zoomScene) && onTouchY <= ((back.y + back.height) * tv.zoomScene) &&
			onTouchX >= (back.x * tv.zoomScene) && onTouchX <= ((back.x + back.width) * tv.zoomScene)){
			this.value = parseInt((onTouchX - (back.x * tv.zoomScene)) * max / back.width);
		}
	}

	this.setValue = function(val,m){
		this.value = val;
		max = m;
	}

	this.init();

	this.setZ(0);
	this.moveBar();
}