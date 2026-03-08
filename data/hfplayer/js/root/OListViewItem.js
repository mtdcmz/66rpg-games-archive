/**
 * Created by Administrator on 2016/8/9.
 */
function OListViewItem(item,height){
    //这个item是一个 精灵或者按钮的数组
    this.item = item;
    this.height = height;
    this.dispose = function () {
        for(var i = 0;i<this.item.length;i++){
            if(this.item[i]){
                this.item[i].dispose();
            }
        }
        this.item.length = 0;
        this.height = null;
    }
}