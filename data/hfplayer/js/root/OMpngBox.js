function OMpngBox(){
	var mpngHashList = {};

	this.isSelectedMpng = function(pixelX,pixelY,key){
		if(mpngHashList[key] == null){
			console.log("OMpngBox:isSelectedMpng:no key<<" + key);
			return false;
		}else{
			//解析mpng
			var mpng = mpngHashList[key];
			var r = pixelX , c = pixelY; 
			if(mpng.bLonger){
				r = pixelY;
				c = pixelX;
			}
			// 找出坐标点所在行（组）和列
			var pointEmpty = true;// 初始化，默认像素点为空（透明）
			var turnNum = mpng.listTurnNum[r];
			switch(turnNum){
				case 0 :{// 所在行（组）无反转点
					if(mpng.listTurnPosRow[r][0] == 0){ // 所在行（组）像素点都透明
						pointEmpty = true;
						break;
					}else{// 所在行（组）像素点全不透明
						pointEmpty = false;
						break;
					}
				}
				default:{
					for(var i = 0; i < turnNum; i++) {
                        var turnPos = mpng.listTurnPosRow[r][i];
                        var turnPosAbs = Math.abs(mpng.listTurnPosRow[r][i]);    // 取绝对值来判断反转点位置[0,1999]
                        if(i == 0 || c >= turnPosAbs)    // 如果在某个反转点之后，则记录当前反转点之后的反转信息
                            pointEmpty = this.turnPos2Bool(c, turnPos);
                        else    // 一旦判断到位于某个反转点之前，则不再继续，带着上一个反转点信息跳出
                            break;
                    }
                    break;
                }
            }//switch结束
            return !pointEmpty;
		}//else结束
	}

	this.turnPos2Bool = function(pos, turn){
		if(turn >= 0) {    // 0->1
            if(pos < Math.abs(turn)){
            	 return true;
            }else{
            	return false;
            } 
        }else{    // 1->0
            if(pos < Math.abs(turn)){
            	return false;
            }else{
            	return true;
            } 
		}
	}

	this.processMpngUrl = function(sp,src,filename){
		var reUrl = "";
		var headUrl = "Graphics/System/";
		var name = filename.split('.');
		src = src.toLowerCase();
		switch(src){
			case "button":{
				if(fileList[(headUrl + name[0] + '_1.mpng').toLowerCase().replace(/\\/g,'/')] != null){
					reUrl = fileList[(headUrl + name[0] + '_1.mpng').toLowerCase().replace(/\\/g,'/')].url();
					sp.mpngKey = (reUrl.substring(reUrl.lastIndexOf("/") + 1)).toLowerCase(); //用md5作为key
				}else{
					console.log("OMpngBox:processMpngUrl:key is null:" + headUrl + name[0] + '_1.mpng');
				}
				break;
			}
		}

		if(reUrl.length > 0){
			this.downMpng(reUrl);
		}
	}

	//download
	this.downMpng = function(url){
        var rd = new ORead(url,function(read){
         if(read.readCString(6) == "ORGDAT"){
             var mpng = new DMpngImage(read);
             addMpng(url,mpng);
          }
      });
    }

    addMpng = function(urlmap,dMpng){
     	var key = urlmap.substring(urlmap.lastIndexOf("/") + 1); //用md5作为key
		if(mpngHashList[key.toLowerCase()] == null){
			mpngHashList[key.toLowerCase()] = dMpng;
		}else{
			
		}
	}
    

}

          



