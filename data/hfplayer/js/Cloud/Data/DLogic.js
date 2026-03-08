/**
 * Created by heshang on 2016/9/9.
 * 逻辑数据
 * @para StoryId:剧情id
 * @para Pos:剧情id
 * @para IndentStackCount:剧情id
 * @para IFInfo:剧情id
 * @para LoopInfo:剧情id
 * @para BranchInfo:剧情id
 */
var allDepth = 0;
function DLogic(){
    this.Depth = allDepth;
    this.StoryId = 0;//当前剧情id
    this.Pos = 0;//当前剧情事件位置
    this.IsHaveSub = 0;//是否有子剧情
    this.SubStory = "";
    this.IndentStack = new Object();
    /*
     “length”:”10”,
     “0”:”0|10|”,//分歧finishIndex
     “1”:”0|5|”,//分歧
     “2”:”1|10|20|”,//loopIndex,breakIndex
     “3”:”2|”,//length,loop循环
     “4”:”0|”
     */
}