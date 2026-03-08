/**
 * Created by 七夕小雨 on 2014/11/16.
 */
function IMain(){
    this.event = null;
    this.story = new Array();
    this.pos = -1;
    this.isEnd = true;
    this.endLogic = null;
    this.indentStack = new Array();
    this.subStory = null;
    this.isCui = false;
    this.storyName = "";
    this.storyId = 0;

    //记录特殊事件读档的深度
    this.depth = 0;
    //记录所有读档的深度
    this.arrDepth = 0;

    //强制存读档的标识
    this.isMustSave = false;
    this.dispose = function(){
        if(this.story != null){
            for(var i = 0;i<this.story.length;i++){
                for(var j = 0;j<this.story[i].Argv.length;j++){
                    this.story[i].Argv[j] = null;
                }
                this.story[i] = null;
            }
            this.story = null;
        }
        if(this.subStory != null){
            this.subStory.dispose();
        }
    };

    this.jumpStory = function(id)
    {

        if(id instanceof Array){ //重载
            this.pos = -1;
            this.indentStack.length = 0;
            this.event = null;
            this.isEnd = false;
            this.story = id;
        }
        else
        {
            var self=this;
            var data=tv.data.getStory(id);
            if(data){
                self.callJump(id,data);
            }
            else
            {
                tv.data.loadStory(id, function(){
                    self.callJump(id,data) ;
                }) ;
            }
        }
    };

    this.jumpStoryCallBack = function(id,callBack,obj)
    {
        if(id instanceof Array){ //重载
            this.pos = -1;
            this.indentStack.length = 0;
            this.event = null;
            this.isEnd = false;
            this.story = id;
        }
        else
        {
            var self=this;
            var data=tv.data.getStory(id);
            if(data){
                self.callJump(id,data);
                    callBack(obj);
            }
            else
            {
                tv.data.loadStory(id, function(){
                    self.callJump(id,data) ;
                    callBack(obj);
                }) ;
            }
        }
    };

    this.callJump = function(id,data)
    {
        this.story = null;
        var data = tv.data.getStory(id);
        this.subStory = null;
        this.storyName = data.Name;
        this.storyId = data.ID;
        this.story = data.events;
        this.pos = -1;
        this.indentStack.length = 0;
        this.event = null;
        this.isEnd = false;
    }

    this.setStory = function(events){
        this.pos = -1;
        this.indentStack.length = 0;
        this.event = null;
        this.isEnd = false;
        this.story = events;
    }

    this.isFinish = function(){
        return this.isEnd;
    }

    this.endInter = function(){
        if(tv.scene instanceof SCUI){
            tv.scene.dispose();
        }
        tv.canvas.isShowTextStyle = 0;
        tv.canvas.clear();
        this.subStory = null;
        this.event = null;
        this.story = null;
        this.isEnd = true;
        this.pos = -1;
        if(tv.canvas.message.length>0){
            for(var i =0;i<tv.canvas.message.length;i++){
                tv.canvas.message[i].dispose();
            }
        }
        tv.canvas.message=new Array(3);
        for(var i=0;i<tv.canvas.message.length;i++){
            tv.canvas.message[i] = new CMessage();
            tv.canvas.message[i].setLevel(3000+(i*2));
            tv.canvas.message[i].msgBoxFadeOut();
        }

        //--0119 jhy 直接跳到title或game 不跳start
        //reGame = true;
        //tv.scene = new SStart();
        //0202 执行jumpStory会将isEnd设为false 兼容标题高级ui制作的Sgame场景 点击其它按钮后能正确返回game场景
        if(tv.data.System.SkipTitle){
            var data=tv.data.getStory(tv.data.System.StartStoryId);
            if(data){
                tv.inter.jumpStory(tv.data.System.StartStoryId);
                tv.scene = new SGame();

            }
            else
            {
                tv.data.loadStory(tv.data.System.StartStoryId, function(){
                    tv.inter.jumpStory(tv.data.System.StartStoryId);
                    tv.scene = new SGame();
                }) ;
            }
        }else{

            tv.scene = new STitle(true);
        }
    }

    this.update = function(){
        if(this.isEnd){
            if(!this.isCui){
                this.endInter();
            }
            return;
        }
        if(this.subStory != null && this.subStory.isFinish()){
            this.subStory = null;
        }
        if(this.subStory != null && !this.subStory.isFinish()){
            this.subStory.update();
            return;//0206 251子剧情跳转后 子剧情被吞噬原因
        }
        while(true){
            if(this.event == null){
                if(this.isEnd){
                    break;
                }
            }
            if(this.event == null || this.event.finish()){
                if(this.PosAdd()){
                    break;
                }
            }
            if(this.event != null && !this.event.finish()){
                this.event.update();
                break;
            }
        }
    };
    this.UpdateSCUI = function(isButtonEvent){
        if(this.isEnd){
            if(!this.isCui){
                this.endInter();
            }
            return;
        }
        if(this.subStory != null && this.subStory.isFinish()){
            this.subStory = null;
        }
        if(this.subStory != null && !this.subStory.isFinish()){
            this.subStory.update();
            return;//0206 251子剧情跳转后 子剧情被吞噬原因
        }
        var i=0;
        while(true){
            //i++;
            if(isButtonEvent){
                //
                if(tv.scene instanceof SReplay
                    ||tv.scene instanceof SSavefile
                    ||tv.scene instanceof SSystem
                    ||tv.scene instanceof SCG
                    ||tv.scene instanceof SBGM
                    ||this.isEnd){
                    return;
                }
                if(tv.scene.sendFlowerUI){
                    if(this.PosAdd()){
                        break;
                    }
                }

                if(this.event == null){
                    if(this.isEnd){
                        break;
                    }
                }
                if(this.event == null || this.event.finish()){
                    if(this.PosAdd()){
                        break;
                    }
                }
                if(this.event != null && !this.event.finish()){
                    this.event.update();
                    break;
                }
            }else{
                if(this.event == null){
                    if(this.isEnd){
                        break;
                    }
                }
                if(this.event == null || this.event.finish()){
                    if(this.PosAdd()){
                        break;
                    }
                }
                if(this.event != null && !this.event.finish()){
                    this.event.update();
                    break;
                }
            }
            ///*防止死循环*/
            //if(i>999){
            //    break;
            //}
        }
    };

    this.PosAdd = function(){
        if(tv.canvas.lifeLine && tv.canvas.lifeLine.loadingItem){
            return true;
        }
        this.pos += 1;
        if(this.pos >= this.story.length){
            this.isEnd = true;
            this.event = null;
            return false;
        }else if(this.MakerEvent(this.story[this.pos])){
            return true;
        }
        return false;
    };

    this.MakerEvent = function(e){
        this.event = new IEventList().MakerEvent(e,this);
        /* //-----0128 调试使用
         if(this.event != null && e.Code == 215){
         console.log(this.pos,this.event.e.Argv[0],this.event.e.Argv[1]);
         }
         */
        return this.event == null ? false : this.event.init();
    };

    this.jumpToIndex = function(index){
        this.event = null;
        this.pos = index - 1;
        if(this.pos >= this.story.length){
            this.isEnd = true;
            this.event = null;
        }
    }

    this.auxFetchBranchinfo = function(){
        var s = null;
        while(true){
            if(this.indentStack.length <= 0){s = null;break;}
            s = this.indentStack[this.indentStack.length - 1];
            this.indentStack.pop();
            if(s == null || s instanceof BranchInfo){
                break;
            }
        }
        this.endLogic = s;
        return s;
    }

    this.auxFetchLoopinfo = function(){
        var s = null;
        while(true){
            if(this.indentStack.length <= 0){s = null;break;}
            s = this.indentStack[this.indentStack.length - 1];
            this.indentStack.pop();
            if(s == null || s instanceof LoopInfo){
                break;
            }
        }
        this.endLogic = s;
        return s;
    }

    this.auxFetchIfinfo = function(){
        var s = null;
        while(true){
            if(this.indentStack.length <= 0){s = null;break;}
            s = this.indentStack[this.indentStack.length - 1];
            this.indentStack.pop();
            if(s == null || s instanceof IFInfo){
                break;
            }
        }
        this.endLogic = s;
        return s;
    }

    this.saveData = function(saveArr){
        if(tv.system.rwFile.isCloud){
            saveArr.Depth = allDepth;
            allDepth += 1;
            saveArr.StoryId = this.storyId;

            var tempIndentStack = new Array();
            for(var i = 0 ; i < this.indentStack.length ; ++i){
                tempIndentStack.push(this.indentStack[i]);
            }
            var tCode;
            if(this.pos>=0){
                tCode = this.story[this.pos].Code;
            }else{
                tCode = this.story[0].Code;
            }
            if(this.pos < this.story.length && (tCode == 100 || tCode == 101 || tCode == 1010||tCode == 1011 || tCode == 204||tCode == 214)){
                //var s2 = ((this.pos != 0) ? this.pos - 1 : 0) + "|";
                //saveArr.push(s2);
                saveArr.Pos = ((this.pos != 0) ? this.pos - 1 : 0);
                if(tempIndentStack.length > 0){
                    //tempIndentStack.pop(); //0430 ????存档潜在问题 少了一层 为何会弹
                }
            }else{
                //var s2 = this.pos + "|";
                //saveArr.push(s2);
                saveArr.Pos = this.pos;
            }

            if(this.subStory != null){
                saveArr.IsHaveSub = 1;
                //saveArr.push(s3);
                saveArr.SubStory = new DLogic();
                this.subStory.saveData(saveArr.SubStory);
            } else{
                saveArr.IsHaveSub = 0;
            }
            saveArr.IndentStack = new Object();
            saveArr.IndentStack["length"] = tempIndentStack.length;
            //var s4 = tempIndentStack.length + "|";
            //saveArr.push(s4);
            for(var i = 0 ; i < tempIndentStack.length; ++i){
                //saveArr.IndentStack[i] = "0";
                saveArr.IndentStack[i] = tempIndentStack[i].saveData();
                //tempIndentStack[i].saveData(saveArr.IndentStack[i]);
            }

        }else{
            var s1 = this.storyId + "|";
            saveArr.push(s1);

            var tempIndentStack = new Array();
            for(var i = 0 ; i < this.indentStack.length ; ++i){
                tempIndentStack.push(this.indentStack[i]);
            }
            var tCode;
            if(this.pos>=0){
                tCode = this.story[this.pos].Code;
            }else{
                tCode = this.story[0].Code;
            }
            //为强制存读档特别添加
            if(this.pos < this.story.length && (tCode == 100 || tCode == 101 || tCode == 1010||tCode == 1011 || tCode == 204||tCode == 214)){
                var s2;
                if(this.pos != 0){
                    if(this.story[this.pos - 1].Code ==218&&parseInt(this.story[this.pos - 1].Argv[0])== 0){
                        s2 = this.pos + "|";
                    }else{
                        s2 = this.pos - 1 + "|";
                    }
                }else{
                    s2 = 0 + "|";
                }
                saveArr.push(s2);
                if(tempIndentStack.length > 0){
                    //tempIndentStack.pop(); //0430 ????存档潜在问题 少了一层 为何会弹
                }
            }else{
                var s2;
                if(this.isMustSave){
                    //是强制存读档
                    s2 = (this.pos + 1) + "|";
                }else{
                    s2 = this.pos + "|";
                }
                saveArr.push(s2);
            }


            /*if(this.pos < this.story.length && (tCode == 100 || tCode == 101 || tCode == 1010 || tCode == 204)){
                var s2 = ((this.pos != 0) ? this.pos - 1 : 0) + "|";
                saveArr.push(s2);
                if(tempIndentStack.length > 0){
                    //tempIndentStack.pop(); //0430 ????存档潜在问题 少了一层 为何会弹
                }
            }else{
                var s2 = this.pos + "|";
                saveArr.push(s2);
            }*/

            if(this.subStory != null){
                var s3 = 1 + "|";
                saveArr.push(s3);
                this.subStory.saveData(saveArr);
            }else{
                var s3 = 0 + "|";
                saveArr.push(s3);
            }

            var s4 = tempIndentStack.length + "|";
            saveArr.push(s4);
            for(var i = 0 ; i < tempIndentStack.length; ++i){
                tempIndentStack[i].saveData(saveArr);
            }
        }
    }
  /*
    this.loadData = function(arr){

        var s1 = arr.shift();
        //console.log(s1);
        if(!s1){
            //console.log(s1);
            return;
        }
        var storyID=parseInt(s1);
        var self=this;
        this.jumpStoryCallBack(parseInt(s1), function () {
            load();
        });
        function load(){
            var s2 = arr.shift();
            var num = parseInt(s2);
            //如果在子剧情存档会执行两遍子剧情，所以判断如果当前读取的事件是呼叫子剧情的话则让他的事件ID+1；
            if(self.story[num]&&self.story[num].Code == 251){
                num = num+1;
            }
            self.jumpToIndex(num);
            var s3 = arr.shift();
            var isSub = parseInt(s3);
            if(isSub != 0){
                self.subStory = new IMain();
                self.subStory.loadData(arr);
            }

            self.indentStack.length = 0;
            var s4 = arr.shift();
            var length = parseInt(s4);
            for(var i = 0 ; i < length;++i){
                var s = arr.shift();
                var type = parseInt(s);
                if(type == 0){
                    var tifInfo = new IFInfo(0);
                    tifInfo.loadData(arr);
                    self.indentStack.push(tifInfo);
                }else if(type == 1){
                    var tloopInfo = new LoopInfo(0,0);
                    tloopInfo.loadData(arr);
                    self.indentStack.push(tloopInfo);
                }else if(type == 2){
                    var tBranchInfo = new BranchInfo(null,0);
                    tBranchInfo.loadData(arr);
                    self.indentStack.push(tBranchInfo);
                }
            }
        }


    }*/
    this.loadData = function(arr){
        for(var i = 0;i < arr.length;++i){
            if(parseInt(arr[i]) == 0 && (i+1)%3 == 0){
                this.arrDepth = (i-2)/3;
                break;
            }
        }
        var sDepth = this.depth * 3;
        var s1 = arr[sDepth+0];
        var storyID=parseInt(s1);
        var self=this;
        this.jumpStoryCallBack(parseInt(s1), function () {
            load();
        });
        function load(){
            var s2 = arr[sDepth+1];
            var num = parseInt(s2);
            if(self.story[num]&&self.story[num].Code == 251){//如果在子剧情存档会执行两遍子剧情，所以判断如果当前读取的事件是呼叫子剧情的话则让他的事件ID+1；
                num = num+1;
            }
            self.jumpToIndex(num);
            var s3 = arr[sDepth+2];
            var isSub = parseInt(s3);
            if(isSub != 0){
                self.subStory = new IMain();
                self.subStory.depth = self.depth+1;
                self.subStory.loadData(arr);
            }
            self.indentStack.length = 0;
            var s4 = self.arrDepth*3+3;
            if(self.arrDepth != 0){
                var sign =  s4;
                for(var i = 0;i < parseInt(self.arrDepth) - parseInt(self.depth);i++){
                    var sign1 = sign;
                    sign += 1;
                    for(var j = 0;j < parseInt(arr[sign1]);j++){
                        sign += 1;
                        if(parseInt(arr[sign-1]) == 0){
                            sign += 1;
                        }else if(parseInt(arr[sign-1]) == 1){
                            sign += 2;
                        }else if(parseInt(arr[sign-1]) == 2){
                            sign = sign + parseInt(arr[sign])+2;
                        }
                    }
                }
                s4 = sign;
            }
            var length = parseInt(arr[s4]);
            s4+=1;
            for(var i = 0 ; i < length;i++){
                var s = arr[s4];
                s4+=1;
                var type = parseInt(s);
                if(type == 0){//消耗1个值
                    var tifInfo = new IFInfo(0);

                    s4 = tifInfo.loadData(arr,s4);

                    //s4+=1;
                    self.indentStack.push(tifInfo);
                }else if(type == 1){//消耗2个值
                    var tloopInfo = new LoopInfo(0,0);
                    s4 = tloopInfo.loadData(arr,s4);
                    //s4+=2;
                    self.indentStack.push(tloopInfo);
                }else if(type == 2){//消耗好几个值
                    var tBranchInfo = new BranchInfo(null,0);
                    s4 = tBranchInfo.loadData(arr,s4);
                    //s4 = s4+parseInt(arr[s4])+1;
                    self.indentStack.push(tBranchInfo);
                }
            }
        }
    }
    
    this.loadCloudData = function (logic) {
        var self=this;
        var obj = new Object();
        obj.logic = logic;
        obj.IndentStack = logic.IndentStack;
        var storyID = parseInt(logic.StoryId);
        this.jumpStoryCallBack(storyID,function(obj){

            var pos = parseInt(obj.logic.Pos);
            if(self.story[pos]&&self.story[pos].Code == 251){//如果在子剧情存档会执行两遍子剧情，所以判断如果当前读取的事件是呼叫子剧情的话则让他的事件ID+1；
                pos = pos+1;
            }
            self.jumpToIndex(pos);
            var isHaveSub = parseInt(obj.logic.IsHaveSub);
            if(isHaveSub){
                self.subStory = new IMain();
                self.subStory.depth = self.depth+1;
                self.subStory.loadCloudData(obj.logic.SubStory);
            }
            //console.log(obj.IndentStack);
            for(var i = 0;i < obj.IndentStack.length;i++){
                var stack = obj.IndentStack[i];
                var type = stack.split('|');
                var typeID = parseInt(type[0]);
                switch (typeID){
                    case 0:
                        type.shift();
                        var tifInfo = new IFInfo(0);
                        tifInfo.loadData(type,0);
                        self.indentStack.push(tifInfo);
                        break;
                    case 1:
                        type.shift();
                        var tloopInfo = new LoopInfo(0,0);
                        tloopInfo.loadData(type,0);
                        self.indentStack.push(tloopInfo);
                        break;
                    case 2:
                        type.shift();
                        var tBranchInfo = new BranchInfo(null,0);
                        tBranchInfo.loadData(type,0);
                        self.indentStack.push(tBranchInfo);
                        break;
                }
            }
        },obj);
    }

}
function IFInfo(index){
    this.finishJumpIndex = index;

    this.saveData = function(saveArr){
        if(tv.system.rwFile.isCloud){
            var str = 0 + "|";
            str += this.finishJumpIndex + "|";
            return str;
        }else{
            var s1 =  0 + "|";
            saveArr.push(s1);

            var s2 = this.finishJumpIndex + "|";
            saveArr.push(s2);
        }
    }

    this.loadData = function(loadArr,record){
        var s2 = loadArr[record];
        record+=1;
        this.finishJumpIndex = parseInt(s2);
        return record;
    }
}

function LoopInfo(index,back){
    this.loopindex = index;
    this.breakindex = back;

    this.saveData = function(saveArr){
        if(tv.system.rwFile.isCloud){
            var str = 1 + "|";
            str += this.loopindex + "|";
            str +=  this.breakindex + "|";
            return  str;
        }else {
            var s1 = 1 + "|";
            saveArr.push(s1);
            var s2 = this.loopindex + "|";
            saveArr.push(s2);
            var s3 = this.breakindex + "|";
            saveArr.push(s3);
        }
    }

    this.loadData = function(loadArr,record){
        var s2 = loadArr[record];
        record +=1;
        this.loopindex = parseInt(s2);

        var s3 = loadArr[record];
        record +=1;
        this.breakindex = parseInt(s3);
        return record;
    }
}

function BranchInfo(cindexs,findex){
    this.finishIndex = findex;
    this.choiceIndex = cindexs;
    var recordFig;

    this.jump = function(index){
        return this.choiceIndex[index];
    }

    this.saveData = function(saveArr){
        if(tv.system.rwFile.isCloud){
            var str = 2 + "|";
            str += this.choiceIndex.length + "|";
            for(var i = 0 ; i < this.choiceIndex.length ; ++i){
                str+=this.choiceIndex[i] + "|";
            }
            str += this.finishIndex + "|";
            return str;
        }else{
            var s1 = 2 + "|";
            saveArr.push(s1);
            var s2 = this.choiceIndex.length + "|";
            saveArr.push(s2);
            for(var i = 0 ; i < this.choiceIndex.length ; ++i){
                var s3 = this.choiceIndex[i] + "|";
                saveArr.push(s3);
            }
            var s4 = this.finishIndex + "|";
            saveArr.push(s4);
        }
    }

    this.loadData = function(loadArr,record){
        recordFig = record;
        var s1 = loadArr[recordFig];
        recordFig+=1;
        var len = parseInt(s1);
        this.choiceIndex = new Array(len);
        for(var i = 0 ; i < len ; ++i){
            var ts = loadArr[recordFig];
            recordFig+=1;
            var index = parseInt(ts);
            this.choiceIndex[i] = index;
        }
        var s2 = loadArr[recordFig];
        recordFig +=1;
        var fini = parseInt(s2);
        this.finishIndex = fini;
        return recordFig;
    }
}

/*
function IFInfo(index){
    this.finishJumpIndex = index;

    this.saveData = function(saveArr){
        var s1 =  0 + "|";
        saveArr.push(s1);

        var s2 = this.finishJumpIndex + "|";
        saveArr.push(s2);
    }

    this.loadData = function(loadArr){
        var s2 = loadArr.shift();
        this.finishJumpIndex = parseInt(s2);
    }
}

function LoopInfo(index,back){
    this.loopindex = index;
    this.breakindex = back;

    this.saveData = function(saveArr){
        var s1 =  1 + "|";
        saveArr.push(s1);
        var s2 = this.loopindex + "|";
        saveArr.push(s2);
        var s3 = this.breakindex + "|";
        saveArr.push(s3);
    }

    this.loadData = function(loadArr){
        var s2 = loadArr.shift();
        this.loopindex = parseInt(s2);

        var s3 = loadArr.shift();
        this.breakindex = parseInt(s3);
    }
}

function BranchInfo(cindexs,findex){
    this.finishIndex = findex;
    this.choiceIndex = cindexs;

    this.jump = function(index){
        return this.choiceIndex[index];
    }

    this.saveData = function(saveArr){
        var s1 = 2 + "|";
        saveArr.push(s1);
        var s2 = this.choiceIndex.length + "|";
        saveArr.push(s2);
        for(var i = 0 ; i < this.choiceIndex.length ; ++i){
            var s3 = this.choiceIndex[i] + "|";
            saveArr.push(s3);
        }
        var s4 = this.finishIndex + "|";
        saveArr.push(s4);
    }

    this.loadData = function(loadArr){
        var s1 = loadArr.shift();
        var len = parseInt(s1);
        this.choiceIndex = new Array(len);
        for(var i = 0 ; i < len ; ++i){
            var ts = loadArr.shift();
            var index = parseInt(ts);
            this.choiceIndex[i] = index;
        }
        var s2 = loadArr.shift();
        var fini = parseInt(s2);
        this.finishIndex = fini;
    }

}*/
