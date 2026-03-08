/**
 * Created by heshang on 2016/7/8.
 */


/*
 * 送花* -------------------------*
 * */
function SCGSendFlower(menu){
    var imgPathHead=M_IMG_SERVER_URL+"hfplayer/img/";
    var imgArr = null;
    var self;
    var startX,startY;
    var buttons,sprites,inputs,tabs;
    var infoOvew;
    var zbase = 6100;

    var endPos = 0;
    var nextHeight = 0;
    var spDes;
    var back,selfInput,btnSelf,spFlower,spGameF;
    var spAni= new Array();
    var spTitle;

    var initOk = false;
    this.index = 0;

    this.sendFlowerNum = 0;

    this.init = function() {
        buttons = new Array();
        sprites = new Array();
        inputs = new Array();
        tabs = new Array();
        if(isVertical){
            startX = 30;
            startY = 335;
        }else{
            startX = 215;
            startY = 150;
        }
        self =this;
        var imgList = [
            {"name": "back", "src": imgPathHead + "cgMenu1/sendFlowr/back.png", type: 1},
            {"name": "send", "src": imgPathHead + "cgMenu1/sendFlowr/send.png", type: 1},
            {"name": "btn1", "src": imgPathHead + "cgMenu1/sendFlowr/btn1.png", type: 1},
            {"name": "btn10", "src": imgPathHead + "cgMenu1/sendFlowr/btn10.png", type: 1},
            {"name": "btnPay", "src": imgPathHead + "cgMenu1/sendFlowr/btnPay.png", type: 1},
            {"name": "btnSelf", "src": imgPathHead + "cgMenu1/sendFlowr/btnSelf.png", type: 1},
        ];
        if(isVertical){
            imgList.push({"name": "backV", "src": imgPathHead + "cgMenu1/sendFlowr/backV.png", type: 1});
            imgList.push({"name": "mask1", "src": imgPathHead + "mask1.png", type: 1});
            imgList.push( {"name": "btnSend", "src": imgPathHead + "cgMenu1/sendFlowr/btnSendV.png", type: 1});
        }else{
            imgList.push({"name": "back", "src": imgPathHead + "cgMenu1/sendFlowr/back.png", type: 1});
            imgList.push( {"name": "btnSend", "src": imgPathHead + "cgMenu1/sendFlowr/btnSend.png", type: 1});
            imgList.push({"name": "mask", "src": imgPathHead + "mask.png", type: 1});
        }
        serverAjax.get_userInfo(function (data) {
            sVLoadImg.loadImgData(imgList, function (arr) {
                imgArr = arr;
                self.createBack();
                self.createButton();
                initOk = true;
            });
        });
    }
    this.createBack = function () {
        var mask;
        if(isVertical){
            mask = new OSprite(imgArr["mask1"],null);
            back = new OSprite(imgArr["backV"],null);
            back.x = startX;
            back.y = startY;
        }else{
            mask = new OSprite(imgArr["mask"],null);
            back = new OSprite(imgArr["back"],null);
            back.x = startX;
            back.y = startY;
        }
        sprites.push(mask);
        back.setZ(zbase);
        sprites.push(back);
        var x =startX+46;
        infoOvew = new OViewport(x,startY+140,632+startX,492-175);
        spDes = new OSprite(null,infoOvew);
    }
    this.createButton  = function () {
        var btn1 = new OButton(imgArr["send"],imgArr["send"],"",null,null);
        btn1.back.drawLineTxt(" x1",54,14,"#333333",20);
        btn1.setX(startX+36);
        btn1.setY(startY+122);
        btn1.tag="btn1";
        btn1.setZ(zbase);
        btn1.setBorder(3,"#ffc261");
        tabs.push(btn1);
        buttons.push(btn1);
        if(flower_unlock<0){
            flower_unlock = 10;
        }
        var btn10 = new OButton(imgArr["send"],imgArr["send"],"",null,null);
        btn10.back.drawLineTxt(" x"+flower_unlock,54,14,"#333333",20);
        btn10.setX(startX+162);
        btn10.setY(startY+122);
        btn10.tag="btn10";
        btn10.setZ(zbase);
        tabs.push(btn10);
        buttons.push(btn10);
        btnSelf = new OButton(imgArr["btnSelf"],imgArr["btnSelf"],"",null,null);
        btnSelf.setX(startX+288);
        btnSelf.setY(startY+122);
        btnSelf.tag="btnSelf";
        btnSelf.setZ(zbase);
        tabs.push(btnSelf);
        buttons.push(btnSelf);
        if(isVertical){
            var btnPay = new OButton(imgArr["btnPay"],imgArr["btnPay"],"",null,null);
            btnPay.setX(startX+328);
            btnPay.setY(startY+23);
            btnPay.tag="btnPay";
            btnPay.setZ(zbase);
            buttons.push(btnPay);

            var btnSend = new OButton(imgArr["btnSend"],imgArr["btnSend"],"",null,null);
            btnSend.setX(startX+40);
            btnSend.setY(startY+220);
            btnSend.tag="btnSend";
            btnSend.setZ(zbase);
            buttons.push(btnSend);
        }else{
            var btnPay = new OButton(imgArr["btnPay"],imgArr["btnPay"],"",null,null);
            btnPay.setX(startX+434);
            btnPay.setY(startY+23);
            btnPay.tag="btnPay";
            btnPay.setZ(zbase);
            buttons.push(btnPay);
            var btnSend = new OButton(imgArr["btnSend"],imgArr["btnSend"],"",null,null);
            btnSend.setX(startX+434);
            btnSend.setY(startY+122);
            btnSend.tag="btnSend";
            btnSend.setZ(zbase);
            buttons.push(btnSend);
        }
        spFlower = new OSprite(null,null);
        spFlower.x = startX + 134;
        spFlower.y = startY + 26;
        var userFlower = serverAjax.userInfo.coin2.coin_count;
        if(userFlower<0){
            userFlower = 0;
        }
        spFlower.drawLineTxt(userFlower+"朵鲜花",0,0,"#ffb345",19);
        sprites.push(spFlower);
        spFlower.x = startX + 134;
        spFlower.y = startY + 26;
        spGameF = new OSprite(null,null);
        spGameF.x = startX + 36;
        spGameF.y = startY + 53;
        spGameF.drawLineTxt("已赠送"+serverAjax.userFlowerInfo.num+"朵",0,0,"#999b9f",19);
        sprites.push(spGameF);

        selfInput = new OInput(null,null);
        selfInput.width = 80;
        selfInput.height = 45;
        selfInput.x = startX+288;
        selfInput.y = startY+125;
        selfInput.lineWidth = 0;
        selfInput.fontSize = 20;
        selfInput.fontTop = 10;
        selfInput.tips = "自定义";
        selfInput.type = "number";
        inputs.push(selfInput);
        this.setTabsIndex(btn1);
    }
    this.setTabsIndex = function (b) {
        if(b){
            for(var i = 0;i<tabs.length;i++){
                if(tabs[i].tag == b.tag){
                    this.index = i;
                }else{
                    tabs[i].clearBorder();
                }
            }
            if(this.index>-1){
                tabs[this.index].setBorder(3,"#ffc261");
                if( tabs[this.index].tag == "btnSelf"){
                    selfInput.createInput();
                    selfInput.focuIn = true;
                }
            }

        }
    }

    this.buttonClick = function (b) {
        if(sLoading.loading){
            return;
        }
        if(b.tag == "btnPay"){
            showFrame(webUrl+"/home/pay?platForm=h5");
        }else if(b.tag == "btnSend") {
            if(this.index==0){
                this.sendFlowerNum = 1;
            }else if(this.index == 1){
                this.sendFlowerNum = flower_unlock;
            }else if(this.index == 2){
                if(selfInput.texts == ""){
                    return;
                }else{
                    this.sendFlowerNum = selfInput.texts;
                }
            }
            var self =this;
            sLoading.showMask();
            if(parseInt(this.sendFlowerNum)>parseInt(serverAjax.userInfo.coin2.coin_count)){
                sLoading.hideMask();
                self.updateControl(-2000);
                return;
            }
            serverAjax.send_flower(this.sendFlowerNum, function (data,num) {
                sLoading.hideMask();
                if(data.status == 1){
                    serverAjax.userInfo.coin2.coin_count -= parseInt(num);
                    serverAjax.userFlowerInfo.num += parseInt(num);
                    serverAjax.userFlowerInfo.sum += parseInt(num);
                    serverAjax.userFlowerInfo.fresh_flower_num += parseInt(num);
                    serverAjax.userInfo.coin1.coin_count+=(30*num);
                    flowerHua += parseInt(num);
                    self.updateControl(1);
                }else if(data.status == -2000){
                    //spTitle
                    self.updateControl(-2000);
                }else{

                }
            });
            //console.log(this.sendFlowerNum);
        }else{
            this.setTabsIndex(b);
        }
    }
    this.updateControl = function (status) {
        if(status == 1){
            var b = tabs[this.index];
            var sp = new OSprite();
            sp.drawLineTxt("+"+this.sendFlowerNum,0,0,"#ff0000",19);
            sp.x = b.getX()+b.width()-40;
            sp.y = b.getY();
            sp.setZ(zbase+100);
            sp.SlideTo(sp.x,sp.y-23,10);
            spAni.push(sp);
            if(serverAjax.userInfo.coin2.coin_count<0){
                serverAjax.userInfo.coin2.coin_count = 0;
            }
            spFlower.drawLineTxt(serverAjax.userInfo.coin2.coin_count+"朵鲜花",0,0,"#ffb345",19);
            spGameF.drawLineTxt("已赠送"+serverAjax.userFlowerInfo.num+"朵",0,0,"#999b9f",19);
        }else{
            if(spTitle){
                spTitle.dispose();
                spTitle = null;
            }
            spTitle = new OSprite(null,null);
            spTitle.drawLineTxt("",0,0,"#333333",19);
            spTitle.drawLineTxt("鲜花不足，先去充值咯~",0,0,"#ef5350",19);
            spTitle.x = startX+36;
            spTitle.y = startY+186;
            spTitle.setZ(zbase+100);
        }
    }
    this.update = function () {
        if(!initOk){
            return;
        }
        if(spAni.length>0){
            if(spAni[0].slideFrames<=0){
                spAni[0].dispose();
                spAni.shift();
            }
        }
        if(inputs != null){
            for(var i = 0 ; i < inputs.length;++i){
                var b = inputs[i];
                if(b!= null){
                    if(b.isClick()) {
                        if(spTitle){
                            spTitle.dispose();
                            spTitle = null;
                        }

                        this.setTabsIndex(btnSelf);
                    }
                }
            }
        }
        if(buttons != null){
            for(var i = 0 ; i < buttons.length;++i){
                var b = buttons[i];
                if(b!= null){
                    b.update();
                    if(b.isClick()) {
                        if(spTitle){
                            spTitle.dispose();
                            spTitle = null;
                        }

                        //tv.data.System.SEClick.Play();  //无play
                        this.buttonClick(b);
                        //return;
                    }
                }
            }
        }
        if(onClick()&&!back.isSelected()){
            if(spTitle){
                spTitle.dispose();
                spTitle = null;
            }
            //console.log("单击");
            this.dispose();//关闭    这个菜单
            //callBack("close");
        }
    }
    this.dispose = function () {
        infoOvew.dispose();
        for(var i = 0 ; i < spAni.length;++i){
            if(spAni[i] != null){
                spAni[i].dispose();
            }
        }
        if(spTitle){
            spTitle.dispose();
            spTitle = null;
        }
        menu.dispose();
        for(var i = 0 ; i < buttons.length;++i){
            if(buttons[i] != null){
                buttons[i].dispose();
            }
        }

        for(var i= 0;i<sprites.length;i++){
            if(sprites[i]!=null){
                sprites[i].dispose();
            }
        }
        for(var i= 0;i<inputs.length;i++){
            if(inputs[i]!=null){
                inputs[i].dispose();
            }
        }
        if(spDes){
            spDes.dispose();
        }
        imgArr = null;
        if(menu instanceof SCGMenu3){
            tv.scene = new SCGMenu3();
        }else if(menu instanceof SCUI){
            tv.scene = new SCUI(tv.CUIFromIndex);
        }else if(menu instanceof SSavefile){
            tv.scene = new SSavefile();
        }
    }
    this.init();
}