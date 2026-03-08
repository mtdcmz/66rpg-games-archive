/**
 * Created by heshang on 2016/2/23.
 */

var gameHaveFlower;
//充值相关内容
$(function (){
    // 充值数量计算
    //$('#pay_num_cz').blur(function() {
    //    var num;
    //    num = parseInt($(this).val());
    //    if(isNaN(num)) {
    //        num = 0;
    //    }
    //    $(this).val(num);
    //    return $('.real_pay_num').val(num * 100);
    //});

    // 购买鲜花数计算
    $('#buy_flower').change(function() {
        var num = parseInt($(this).val());
        if(isNaN(num)) {
            num = 0;
        }
        $(this).val(num);
    });

    // 彩虹币购买鲜花
    $('#pay_flower').submit(function(e) {
        var chb, num, price;
        e.preventDefault();
        chb = parseInt($(this).data('chb'));
        num = parseInt($(this).find('.num').val());
        price = num * 1;

        if(confirm("确定用 "+ num +" 彩虹币购买 "+ num +" 朵鲜花么?")){
            if (chb < price) {
                $('#pay_num').val(price - chb).change();
                return $('.formPay')[0].submit();
            } else {
                return $.ajax({
                    //url : conWebUrl + 'ajax/pay/flower.json',
                    url : AJAX_URL.FLOWER_CHB_BUY_FLOWER,
                    data : {num: num},
                    type : 'get',
                    dataType : 'jsonp',
                    jsonp: "jsonCallBack",
                    success : function(res) {
                        if (res && res.status > 0) {
                            alert("购买 " + num + " 朵鲜花成功");
                            //userInfo["xh"]=parseInt(userInfo["xh"])+parseInt(num);
                            serverAjax.userInfo.coin2.coin_count=parseInt(serverAjax.userInfo.coin2.coin_count)+parseInt(num);
                            //userInfo["chb"]=parseInt(userInfo["chb"])-parseInt(num);
                            serverAjax.userInfo.coin3.coin_count-=parseInt(num)*100;
                            tv.scene.cmdClose();
                            //tv.scene=new SCGMenu(function(data){
                            //    //给页面赋值
                            //});
                            changeVal();
                            if(tv.scene instanceof SCUI){
                                tv.scene.refresh();
                            }
                            //return location.reload();
                        } else {
                            return alert(res.msg);
                        }
                    }
                });
            }
        }
    });
    var href=window.location.href;
    var isPara=href.split('?');
    if(isPara[1]){
        var num=href.split('/');
        var gindex=num[num.length-1].split('?')[0];
    }else{
        var num=href.split('/');
        var gindex=num[num.length-1];
    }
    // 送花方法
    $("#sendFlower").click(function(){
        var num = $('#flower_num').val();
        //送花
        $.ajax( {
            //url: conWebUrl + 'ajax/contains/flower.json',
            url: AJAX_URL.FLOWER_SEND_FLOWER,
            data: {
                gindex: gindex,
                num:num
            },
            type:'get',
            dataType:'jsonp',
            jsonp: "jsonCallBack",
            success:function(res) {
                if (res.status > 0) {
                    alert("送"+num+"朵鲜花成功！");
                    allOpen = true;
                    gameFlower+=parseInt(num);
                    flowerHua+=parseInt(num);
                    if(parseInt(userInfo["xh"])>0){
                        //userInfo["xh"]=parseInt(userInfo["xh"])-parseInt(num);
                        serverAjax.userInfo.coin2.coin_count-=parseInt(num);
                    }else{
                        userInfo["xh"]=0;
                        //userInfo["chb"]=parseInt(userInfo["chb"])-parseInt(num);
                        serverAjax.userInfo.coin3.coin_count -= parseInt(num);
                    }
                    changeVal();
                    //userInfo["jf"]=parseInt(userInfo["jf"])+30;
                    serverAjax.userInfo.coin1.coin_count=parseInt(serverAjax.userInfo.coin1.coin_count)+(30*num);
                    if(tv.scene.isNeedSendFlower=="SCGMENU"){
                        tv.scene.cmdClose();
                        tv.scene=new SCGMenu(function(data){
                            //给页面赋值
                        });
                    }else if(tv.scene.isNeedSendFlower=="SCUI"){
                        //刷新SCUI
                        tv.scene.refresh();
                        //setTimeout(function(){
                        //    tv.scene.refresh();
                        //
                        //    $("#ownhave_chb").html("您当前拥有彩虹币数："+userInfo["chb"])/100;
                        //    $("#ownhave_xh").html("您当前拥有鲜花数："+userInfo["xh"]);
                        //    $("#pay_flower")[0].attributes["data-chb"].value=userInfo["chb"];
                        //    $("#isSendFlower").html('你当前可送 '+(parseInt(userInfo["xh"])+parseInt(userInfo["chb"]))+' 朵，每朵会为你和作者 +30 积分注意：如果您剩余的鲜花数不足的话会扣除您的彩虹币哦。')
                        //    $("#gameTitle").html('为'+$("title").html()+'送花');
                        //    $("#gameHaveFlower").html('该游戏拥有'+gameFlower+'朵鲜花，每次送出鲜花打赏本游戏，可以帮助作者提升游戏曝光率哦。');
                        //
                        //    $('.send_flowers_box').hide();
                        //},500);
                    }

                } else if (res.status == -2000) {
                    alert(res.msg);
                    $(".send_flowers_box").hide();
                    $(".recharge_box").show();
                } else if (res.status == -1000) {
                    alert(res.msg);
                    //$('.modal').modal('hide');
                    //$('.ssologin').trigger('click');
                } else {
                    alert(res.msg);
                }
            },
            error : function(data, status, e) {

                alert('服务器异常,橙光正在修复中~~');
            }
        });
    });
});
//盒子中+flash 打赏游戏
function aBoxSendFlowerCall(val){
    //userInfo["jf"]=parseInt(userInfo["jf"])+30;
    if(tv.scene.isNeedSendFlower=="SCGMENU"){
        tv.scene.cmdClose();
        flowerHua = parseInt(flowerHua) + parseInt(val);
        gameFlower = parseInt(gameFlower) + parseInt(val);
        serverAjax.userFlowerInfo.num = parseInt(serverAjax.userFlowerInfo.num)+parseInt(val);
        serverAjax.userFlowerInfo.sum = parseFloat(serverAjax.userFlowerInfo.sum)+parseInt(val);
        serverAjax.userFlowerInfo.fresh_flower_num = parseInt(serverAjax.userFlowerInfo.fresh_flower_num)+parseInt(val);
        tv.scene.dispose();
        tv.scene=new SCGMenu3(function(data){
            //给页面赋值
        });
    }else if(tv.scene.isNeedSendFlower=="SCUI"){
        if(mark == "aBox"){
            var a=window.org_box.GetLoginStatus();
            if(a){
                userInfo["id"] = window.org_box.GetUid();
            }
        }
        //赋值
        gameFlower = parseInt(gameFlower) + parseInt(val);
        flowerHua = parseInt(flowerHua) + parseInt(val);
        serverAjax.userFlowerInfo.num = parseInt(serverAjax.userFlowerInfo.num)+parseInt(val);
        serverAjax.userFlowerInfo.sum = parseFloat(serverAjax.userFlowerInfo.sum)+parseInt(val);
        serverAjax.userFlowerInfo.fresh_flower_num = parseInt(serverAjax.userFlowerInfo.fresh_flower_num)+parseInt(val);
        if(parseInt(userInfo["xh"])>0){
            userInfo["xh"]=parseInt(userInfo["xh"])-parseInt(val);
        }else{
            userInfo["xh"]=0;
            userInfo["chb"]=parseInt(userInfo["chb"])-parseInt(val);
        }
        //刷新SCUI
        setTimeout(function(){
            tv.scene.refresh();
        },500);
    }else if(tv && tv.scene && tv.scene.isNeedSendFlower == "SSaveFile"){
        flowerHua = parseInt(flowerHua) + parseInt(val);
        gameFlower = parseInt(gameFlower) + parseInt(val);
        serverAjax.userFlowerInfo.num = parseInt(serverAjax.userFlowerInfo.num)+parseInt(val);
        serverAjax.userFlowerInfo.sum = parseFloat(serverAjax.userFlowerInfo.sum)+parseInt(val);
        serverAjax.userFlowerInfo.fresh_flower_num = parseInt(serverAjax.userFlowerInfo.fresh_flower_num)+parseInt(val);
        tv.scene.dispose();
        tv.scene = new SSavefile();
    }else{
        flowerHua = parseInt(flowerHua) + parseInt(val);
        gameFlower = parseInt(gameFlower) + parseInt(val);
        serverAjax.userFlowerInfo.num = parseInt(serverAjax.userFlowerInfo.num)+parseInt(val);
        serverAjax.userFlowerInfo.sum = parseFloat(serverAjax.userFlowerInfo.sum)+parseInt(val);
        serverAjax.userFlowerInfo.fresh_flower_num = parseInt(serverAjax.userFlowerInfo.fresh_flower_num)+parseInt(val);
    }
}
function changeVal(){
    try{
        userInfo["dj"] = parseInt(serverAjax.userInfo.coin1.coin_total / 100);
        userInfo["chb"] = parseInt(serverAjax.userInfo.coin3.coin_count / 100);
        userInfo["jf"] = parseInt(serverAjax.userInfo.coin1.coin_count);
        userInfo["xh"] = parseInt(serverAjax.userInfo.coin2.coin_count);
        $("#ownhave_chb").html("您当前拥有彩虹币数："+userInfo["chb"])/100;
        $("#ownhave_xh").html("您当前拥有鲜花数："+userInfo["xh"]);
        $("#pay_flower")[0].attributes["data-chb"].value=userInfo["chb"];
        $("#isSendFlower").html('你当前可送 '+(parseInt(userInfo["xh"])+parseInt(userInfo["chb"]))+' 朵，每朵会为你和作者 +30 积分注意：如果您剩余的鲜花数不足的话会扣除您的彩虹币哦。')
        var Stitle = $("title").html();  //标题太长导致显示送花框太大，把下面的按钮挤到屏幕下面无法点击，所以加个限制
        if(Stitle.length >= 10){
            var Stitle = Stitle.substring(0,10) + "... ";
        }
        $("#gameTitle").html('为'+Stitle+'送花');
        $("#gameHaveFlower").html('该作品拥有'+gameFlower+'朵鲜花，每次送出鲜花打赏本作品，可以帮助作者提升作品曝光率哦。');
    }catch(e){
        userInfo["dj"] = 0;
        userInfo["chb"] = 0;
        userInfo["jf"] = 0;
        userInfo["xh"] = 0;
        $("#ownhave_chb").html("您当前拥有彩虹币数："+userInfo["chb"])/100;
        $("#ownhave_xh").html("您当前拥有鲜花数："+userInfo["xh"]);
        $("#pay_flower")[0].attributes["data-chb"].value=userInfo["chb"];
        $("#isSendFlower").html('你当前可送 '+(parseInt(userInfo["xh"])+parseInt(userInfo["chb"]))+' 朵，每朵会为你和作者 +30 积分注意：如果您剩余的鲜花数不足的话会扣除您的彩虹币哦。')
        var Stitle = $("title").html();  //标题太长导致显示送花框太大，把下面的按钮挤到屏幕下面无法点击，所以加个限制
        if(Stitle.length >= 10){
            var Stitle = Stitle.substring(0,10) + "... ";
        }
        $("#gameTitle").html('为'+Stitle+'送花');
        $("#gameHaveFlower").html('该作品拥有'+gameFlower+'朵鲜花，每次送出鲜花打赏本作品，可以帮助作者提升作品曝光率哦。');
    }

}