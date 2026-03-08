/**
 * Created by 七夕小雨 on 2014/11/7.
 */

function OSpriteBox(){
    var listArray = new Array();

    this.dispose = function(){
        for(var i = 0;i<listArray.length;i++){
            listArray[i].dispose();
        }
        listArray.length = 0;
    };

    this.add = function(sp){
        listArray.push(sp);
    };

    this.setZ = function(){
        var temps = null;
        for(var i = 0;i<listArray.length - 1;i++){
            for(var j = 0;j<listArray.length - 1 - i;j++){
                if(listArray[j].z > listArray[j+1].z){
                    temps = listArray[j];
                    listArray[j] = listArray[j+1];
                    listArray[j+1] = temps;
                }
            }
        }
    };

    this.remove = function(o){
        var index = listArray.indexOf(o);
        if (index > -1) {
            listArray.splice(index, 1);
        }
    };

    this.update = function(g){
        for(var i = 0;i<listArray.length;i++){
            if(listArray[i].objtype == "viewport" || listArray[i].viewport == null){
                listArray[i].update(g);
            }
        }
    }
}