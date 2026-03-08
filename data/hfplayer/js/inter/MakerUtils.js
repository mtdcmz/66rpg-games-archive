/**
 * Created by h5 on 2015/12/31.
 */

/**
 * 两个操作数比较
 * @param va
 * @param vb
 * @param op
 * @returns {boolean}
 */
function compareVar(va,vb,op)
{
    switch (op)
    {
        case 0 :
            return va == vb;
        case 1:
            return va >= vb;
        case 2:
            return va <= vb;
        case 3:
            return va > vb;
        case 4:
            return va < vb;
        case 5:
            return va != vb;
        default :
            return false;
    }
}

function getValueB(otherVar ,idOrValue)
{
    //console.log("getValueB:------->",otherVar,idOrValue);
    if(otherVar == 0)
    {
        return idOrValue;
    }
    else if(otherVar == 1)
    {
        return tv.system.vars.getVar(idOrValue);
    }
    else if(otherVar == 2)
    {
        return tv.system.varsEx.getVar(idOrValue);
    }
    else
    {
        return idOrValue ;
    }
}

function maxValue(arg)
{
    var strs = arg.split(",");
    var cValue = -1000000000 ;
    for(var i=0;i<strs.length;i++)
    {
        var item = strs[i] ;
        var value = item.split("|")[1] ;
        if(value>cValue)
        {
            cValue = value ;
        }
    }
    return parseInt(cValue);
}

function minValue(arg)
{
    var strs = arg.split(",");
    var cValue = 10000000000 ;
    for(var i=0;i<strs.length;i++)
    {
        var item = strs[i] ;
        var value = item.split("|")[1] ;
        if(value<cValue)
        {
            cValue = value ;
        }
    }
    return parseInt(cValue);
}

function checkIIF(e,arr,asarr)
{
    var cmpRet = false;
    var isRect = false;
    var idOrValue = -1;
    var otherVar = -1;
    var op = -1;
    var type = 0;
    var id = -1;
    var picId = -1;
    var endType = -1;
    var rect;
    var haveElse;
    //二周目
    if(e.Argv[0].indexOf("EX") > -1)
    {
        type = 1;
        id = parseInt(e.Argv[0].split("|")[1]);
        op = parseInt(e.Argv[1]);
        otherVar = parseInt(e.Argv[2]);
        if(otherVar==3)
        {
            idOrValue =maxValue(e.Argv[3]) ;
        }
        else if (otherVar==4)
        {
            idOrValue =minValue(e.Argv[3]) ;
        }
        else
        {
            idOrValue = parseInt(e.Argv[3]);
        }
    }
    else if(e.Argv[0].indexOf("MO") > -1)
    {
        type = 2;
        isRect = e.Argv[1] == "0";
        if(isRect){
            var tempvar = e.Argv[2].split(",");
            rect = {
                x : parseInt(tempvar[0]),
                y : parseInt(tempvar[1]),
                width : parseInt(tempvar[2]),
                height : parseInt(tempvar[3])
            }
        }else{
            picId = parseInt(e.Argv[2]);
        }
        endType = parseInt(e.Argv[3]);
    }
    //鲜花
    else if(e.Argv[0].indexOf("FL") > -1)
    {
        type = 3;
        op = parseInt(e.Argv[1]);
        otherVar = parseInt(e.Argv[2]);
        if(otherVar==3)
        {
            idOrValue =maxValue(e.Argv[3]) ;
        }
        else if (otherVar==4)
        {
            idOrValue =minValue(e.Argv[3]) ;
        }
        else
        {
            idOrValue = parseInt(e.Argv[3]);
        }
    }
    else if(e.Argv[0].indexOf("PT") > -1){
        type = 4;
        idOrValue = parseInt(e.Argv[3]);
    }
    else if(e.Argv[0].indexOf("PA")>-1)
    {
        type = 5;
        //二周目索引
        id = parseInt(e.Argv[0].split('|')[1]);
        //在这里标识商品id;
        op = parseInt(e.Argv[2]);
    }else if(e.Argv.length > 6){
        if(e.Argv[6].indexOf("TA")>-1){
            type = 6;
            haveElse = parseInt(e.Argv[4]) != 0;//有无else
            id=parseInt(e.Argv[6].split('|')[1]);//任务id
        }else if(e.Argv[6].indexOf("AS")>-1){
            type = 7;
        }
    }
    else
    {
        //数值
        id = parseInt(e.Argv[0]);
        op = parseInt(e.Argv[1]);
        otherVar = parseInt(e.Argv[2]);
        if(otherVar==3)
        {
            idOrValue =maxValue(e.Argv[3]) ;
        }
        else if (otherVar==4)
        {
            idOrValue =minValue(e.Argv[3]) ;
        }
        else
        {
            idOrValue = parseInt(e.Argv[3]);
        }
    }
    var valueA = -1;
    var valueB = -1;

    //比较数值或者二周目数值
    if(type <= 1)
    {
        valueA = type == 0 ? tv.system.vars.getVar(id) : tv.system.varsEx.getVar(id);
        valueB = getValueB(otherVar,idOrValue);
        cmpRet = compareVar(valueA,valueB,op);
    }
    else if(type == 2)
    {
        if(isRect){
            cmpRet = onTouchX > rect.x && onTouchX <= rect.x + rect.width &&
                onTouchY > rect.y && onTouchY <= rect.y + rect.height && (endType == 0 ?
                    onTouchMove : onTouchDown);
        }else{
            if(tv.canvas.GamePictrue[picId].getBitmap() != null){
                var r = tv.canvas.GamePictrue[picId].getRect();
                cmpRet = onTouchX > r.x && onTouchX <= r.x + r.width &&
                    onTouchY > r.y && onTouchY <= r.y + r.height && (endType == 0 ?
                        onTouchMove : onTouchDown);
            }
        }
        if(cmpRet){
            clickThrough = true;
            onTouchClick = false;
        }
    }
    else if(type == 3)
    { //鲜花判断
        if(flowerHua==-1){
            valueA=0;
        }
        valueA = flowerHua;//userflowerNumber,初始化时候需要获取，之后需要更新替换
        valueB =getValueB(otherVar,idOrValue);
        cmpRet = compareVar(valueA,valueB,op);
    }
    else if(type == 4)
    {
        cmpRet = idOrValue == 3;
    }else if(type == 6){
        arr.push(id);
        ////用到时发送一个ajax请求 确认任务是否完成
        //$.ajax({
        //    url:AJAX_URL.GAME_TASK_CONTENT+"?gindex="+gIndex+"&task_id="+id,
        //    type:"get",
        //    dataType:"jsonp",
        //    jsonp:"jsonCallBack",
        //    success: function (data) {
        //        if(data.status==1){
        //            var task_info = data.data.task_info;
        //            if(task_info.is_over){//已完成
        //                cmpRet=true;
        //                console.log("已完成");
        //            }else{//进行中||过期
        //                cmpRet=false;
        //            }
        //        }else{
        //            cmpRet=false;
        //        }
        //    },
        //    error: function () {
        //        cmpRet=false;
        //    }
        //});
    }else if(type == 7){
        asarr.push(true);
    }

    if(type!=6 || type != 7){
        return cmpRet;
    }
}