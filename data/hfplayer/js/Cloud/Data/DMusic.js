/**
 * Created by heshang on 2016/9/9.
 *  所有音乐的存储格式
 * @para BGM:背景音乐  BGMV:背景音量  BGMFade:bool标志，背景音乐是否淡出  BGMFadeTime:背景音乐淡出剩余时间  BGMFadeTimeMax:背景音乐淡出总时间
 * @para BGS:背景音效
 * @para SE:音效
 * @para Voice:语音
 */
function DMusic(){
    //音乐
    this.BGM = "";//背景音乐
    this.BGS = "";//背景音效
    this.SE = "";//音效
    this.Voice = "";//语音
    //音量
    this.BGMV = 0;//背景音乐音量
    this.BGSV = 0;//背景音效音量
    this.SEV = 0;//音效音量
    this.VoiceV = 0;//音效音量
    //淡入淡出
    this.BGMFade = false; //bool标志，背景音乐是否淡出
    this.BGMFadeTime = 0; //背景音乐淡出剩余时间
    this.BGMFadeTimeMax = 0; //背景音乐淡出总时间

    this.BGSFade = false; //bool标志，背景音效是否淡出
    this.BGSFadeTime = 0; //背景音效淡出剩余时间
    this.BGSFadeTimeMax = 0; //背景音效淡出剩余总时间

    this.VoiceFade = false; //bool标志，背景音效是否淡出
    this.VoiceFadeTime = 0; //背景音效淡出剩余时间
    this.VoiceFadeTimeMax = 0; //背景音效淡出剩余总时间
}