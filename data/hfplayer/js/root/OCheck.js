function OCheck(imageA,imageB,_selected){
	var Area = false;
	var checks;
	var sprBack;
	this.mouseOn = false;
	this.selected = false;
	var tempSelect = false;
	var tempMouseOn = false;
	this.tag = null;

	//构造
	Area = true;
	var image = new Image();
	image[0] = new Image();
	var path1 = ("Graphics/Button/" + imageA).toLowerCase().replace(/\\/g,'/');
    image[0].src = fileListFato(path1,'image[0] in OCheck.js');
    image[1] = new Image();
	var path2 = ("Graphics/Button/" + imageB).toLowerCase().replace(/\\/g,'/');
    image[1].src = fileListFato(path2,'image[1] in OCheck.js');
    sprBack = new OSprite(null,null);
    sprBack.setBitmap(_selected ? image[0] : image[1]);
    this.mouseOn = false;
    this.selected = _selected;
    tempSelect = false;
    tempMouseOn = false;

    this.setOtherCheck = function(_checks){
    	checks = _checks;
    }

    this.dispose = function(){
    	sprBack.dispose();
    	image[0] = null;
    	image[1] = null;
    	image.length = 0;
    	image = null;
    }

    this.setSelected = function(s){
    	this.selected = s;
    }

    this.clickBox = function(){
    	checks.setSelected(false);
    	this.selected = true;
    }

    this.isClick = function(){
    	return this.mouseOn;
    }

    this.setX = function(x){
    	sprBack.x  = x;
    }

    this.setY = function(y){
    	sprBack.y = y;
    }

    this.setZ = function(z){
    	sprBack.setZ(z);
    }

    this.getWidth = function(){
    	sprBack.getRect();
    	return sprBack.width;
    }

    this.getHeight = function(){
    	sprBack.getRect();
    	return sprBack.height;
    }

    this.visible = function(v){
    	sprBack.visible = v;
    }

    this.opacity = function(o){
    	sprBack.opacity = o;
    }

    this.update = function(){
    	this.mouseOn = sprBack.isSelected();//(Area ? sprBack.IsSelectWithOpactiy() : sprBack.isSelected());//sprBack.IsSelectWithOpactiy()?
    	if(!sprBack.visible) return;
    	this.updateMoveOn();
    }

    this.updateMoveOn = function(){
    	if(tempSelect != this.selected || tempMouseOn != this.mouseOn){
			if(this.selected){
				sprBack.setBitmap(image[0]);
				tempMouseOn = this.mouseOn;
				tempSelect = this.selected;
			}else{
				var btm = this.mouseOn ? image[0] : image[1];
				if(btm != sprBack.getBitmap()){
					sprBack.setBitmap(btm);
				}
				tempMouseOn = this.mouseOn;
				tempSelect = this.selected;
			}
		}
	}
    



}