/**
 * Created by heshang on 2016/9/9.
 *  画布信息
 * @para FloatStatus：悬浮控件
 * @para WeatherType：天气效果
 * @para Layers：图层信息
 * @para CuiIndex：高级ui索引
 */
function DCanvas(){
    this.FloatStatus = -1;//悬浮控件 Off:-1
    this.WeatherType = -1;//天气 off:-1
    this.Layers = new Array();//图层信息
    this.CuiIndex = -1;//高级UI  无：-1
    this.LayerRotateInfo = new Array();
}