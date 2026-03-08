/**
 * Created by 七夕小雨 on 2014/11/11.
 */

stories = new Object() ;

function DMain(read){
    this.Headr = new DHeader(read);
    this.System = new DSystem(read);
    if(isNew){
        //解析悬浮组件
        if(tv.DataVer >= 104){
            var uiNum = read.readInt32();
            this.DFloatButton = new Array(uiNum);
            for(var i = 0;i<uiNum;i++){
                this.DFloatButton[i] = new DFloatButtonData(read);
            }
        }

        this.getStory = function(id)
        {
            if(stories.hasOwnProperty(id))
            {
                return stories[id] ;
            }
            return null ;
        }
    }else{
        read.readInt32();
        this.projectName = read.readString(read.readInt32(),'UTF-8');
        var story_num = read.readInt32();
        this.stories = new Array(story_num);
        for(var i = 0;i<story_num;i++){
            read.readInt32();
            this.stories[i] = new DStory(read);
        }

       //解析悬浮组件
        if(tv.DataVer >= 104){
            var uiNum = read.readInt32();
            this.DFloatButton = new Array(uiNum);
            for(var i = 0;i<uiNum;i++){
                this.DFloatButton[i] = new DFloatButtonData(read);
            }
        }

        this.getStory = function(id){
            for(var i = 0;i<this.stories.length;i++){
                if(this.stories[i].ID == id){
                    return this.stories[i];
                }
            }
            return null;
        }
    }
    this.loadStory = function(id , callback)
    {
        //var url = "http://testcdn.66rpg.com/seg_gamebin/"+guid+"/Game"+id+".bin";
        //var url=fileList["data/game"+id+".bin"].url();
        var newVer = GetQueryString("newVer");
        if(newVer){
            url=M_WC_SERVER_URL+"web/"+ver+"/"+guid+"/game.bin"
        }else{
            var url=fileList["game"+id+".bin"].url();
            allFlow+=parseInt(fileList["game"+id+".bin"].fileSize);
            allFileNum+=1;
            submitAllFlow();
        }
        //console.log("loadStory-->game"+id+".bin"," url="+url);
        new ORead(url,function(read){
            read.readInt32();
            var d = new DStory(read);
            stories[id] = d ;
            if (callback!=null)
                callback() ;
        });
    }
}
