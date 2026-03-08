function DMpngImage(read){
	this.rowNum = read.readInt32();
	this.colNum = read.readInt32();
	this.bLonger = (read.readInt8() == 1); //bool待转
	this.listTurnNum = new Array();
	this.listTurnPosRow = new Array();

	for(var i = 0 ; i < this.rowNum ; ++i){
		var iTurnNum = read.readInt32();
		this.listTurnNum.push(iTurnNum);
		var listTurnPosCol = new Array();
		if(iTurnNum == 0){ //无反转点
			listTurnPosCol.push(read.readInt32());
		}else{
			for(var j = 0 ; j < iTurnNum; ++j){
				listTurnPosCol.push(read.readInt32());
			}
		}
		listTurnPosRow.push(listTurnPosCol);
	}
}

