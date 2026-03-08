function DGameString(){

    this.data = new Array(9999);

    for(var i = 0 ; i < this.data.length ; ++i){
        this.data[i] = null;
    }

    this.getVar = function(id){
        if(this.data[id] == null){
            this.data[id] = "";
        }
        return this.data[id];
    };

    this.setVar = function(id,v){
        this.data[id] = v.toString();
    };

    this.saveData = function(arr){
        //只存有效数据 (1)数据长度 (2)数据结构 编号 数据 
        var efflen = 0;
        for (var i = 0; i < this.data.length; i++) {
            if(this.data[i] == null){
                continue;
            }

            arr.push(i + "|",this.data[i] + "|");
            efflen += 1;
        }

       arr.unshift(efflen + "|");

    };

    this.loadData = function(arr){
        var efflen = parseInt(arr.shift());
        //清除游戏数据
        for(var i = 0 ; i < this.data.length ; ++i){
            this.data[i] = null;
        }

        for(var i = 0 ; i < efflen ; ++i){
            var pos = parseInt(arr.shift());
            this.data[pos] = arr.shift();
        }
    };
    //
    this.saveDataStr = function(obj){
        //只存有效数据 (1)数据长度 (2)数据结构 编号 数据
        //var efflen = 0;
        for (var i = 0; i < this.data.length; i++) {
            if(this.data[i] == null){
                continue;
            }
            obj[i] = encodeURIComponent(this.data[i]);
        }
        return obj;
    }

    this.loadDataStr = function(obj){
        var stringArr = obj;
        var arr1 = new Array();
        for(var i in stringArr){
            var theString = decodeURIComponent(stringArr[i]);
            arr1.push(i);
            arr1.push(theString);
        }
        var efflen = parseInt(arr1.length/2);
        //清除游戏数据
        for(var i = 0 ; i < this.data.length ; ++i){
            this.data[i] = null;
        }
        for(var i = 0 ; i < efflen ; ++i){
            var pos = parseInt(arr1.shift());
            this.data[pos] = arr1.shift();
        }
    };
}