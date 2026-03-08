/**
 * Created by 七夕小雨 on 2014/11/23.
 */

function OAudio(bgm,bgs,se,voice){
    this.bgm = bgm;
    this.bgs = bgs;
    this.se = se;
    this.voice = voice;

    //音量0-100
    this.seV = 100;
    this.bgmV = 100;
    if(ismod == "true"){
        this.bgmV = 20;
    }
    this.bgsV = 100;
    this.voiceV = 100;

    this.BGMFade = false;
    this.BGSFade = false;
    this.BGMFadeTime = 0;
    this.BGMFadeTimeMax = 0;
    this.BGSFadeTime = 0;
    this.BGSFadeTimeMax = 0;
    var PBGM = "";
    var PBGS = "";
    var BGMPath="";

    //var bgmPlaying = false;

    //0303 jhy- bgmPlaying暂时未使用
    //if(isPhone || isIphone()){
    //    this.bgm.addEventListener('play',function(){bgmPlaying = true;},false);
    //}

    this.playSE = function(src,volume){
        try{
            if(mark == "ios"){
                var t = new musichTask(1,1,volume,src);
                musicPlay.push(t);
                return;
            }else if(mark == "aBox"){
                if(typeof window.org_box == 'undefined'){

                }else{
                    window.org_box.ControlAudio(1,1,volume,src);
                    return;
                }
            }
            if(!isIphone()&&!isSafrai()){
                src = src.replace(".mp3","");
            }
            if(this.se.src == src){
                return;
            }else{
                this.se.pause();
                this.se.src = "";
            }
            this.se.src = src;
            this.se.volume = volume / 100;
            this.se.load();
            this.se.play();
        }catch(e) {
        }
    };

    this.stopSE = function(){
        if(mark == "ios"){
            var t = new musichTask(0,1,0,"null");
            musicPlay.push(t);
            return;
        }else if(mark == "aBox"){
            if(typeof window.org_box == 'undefined'){

            }else{
                window.org_box.ControlAudio(0,1,0,"null");
                return;
            }
        }
        this.se.pause();
        this.se.load();
    };

    this.playVoice = function(src,volume){
        if(mark == "ios"){
            var t = new musichTask(1,2,volume* (this.bgmV/100),src);
            musicPlay.push(t)
            return;
        }else if(mark == "aBox"){
            if(typeof window.org_box == 'undefined'){

            }else{
                 window.org_box.ControlAudio(1,2,volume* (this.bgmV/100),src);
                 return;
            }
        }

        this.voice.src = src;
        this.voice.volume = volume / 100* (this.voiceV/100);
        this.voice.load();
        this.voice.play();
    };

    this.stopVoice = function(){
        if(mark == "ios"){
            var t = new musichTask(0,2,0,"null");
            musicPlay.push(t);
            return;
        }else if(mark == "aBox"){
            if(typeof window.org_box == 'undefined'){

            }else{
                window.org_box.ControlAudio(0,2,0,"null");
                return;
            }
        }

        this.voice.pause();
        //this.voice.load(); //0107 jhy-
    };

    this.palyBGS = function(src,volume){
        if(this.BGSFade){
            this.stopBGS();
        }
        if(mark == "ios"){
            PBGS = src;
            var t = new musichTask(1,3,volume* (this.bgmV/100),src);
            musicPlay.push(t);
            return;
        }else if(mark == "aBox"){
            if(typeof window.org_box == 'undefined'){

            }else{
                PBGS = src;
                window.org_box.ControlAudio(1,3,volume* (this.bgmV/100),src);
                return;
            }
        }

        if(PBGS == src && this.bgs.paused == false){return;}
        if(!isIphone()&&!isSafrai()){
            src = src.replace(".mp3","");
        }
        if(src){
            PBGS = src;
            this.bgs.src = src;
            this.bgs.volume = volume / 100 * (this.bgsV/100);
            this.bgs.loop = true;
            this.bgs.load();
            this.bgs.play();
        }

    }

    this.stopBGS = function(){
        this.bgs.pause();
        //this.bgs.load();
        this.BGSFade = false;
        PBGS = "";
    };

    this.bgsFade = function(time){
        if(mark == "ios"){
            PBGS = "";
            var t = new musichTask(0,3,time,"null");
            musicPlay.push(t);
            return;
        }else if(mark == "aBox"){
            if(typeof window.org_box == 'undefined'){

            }else{
                PBGS = "";
                window.org_box.ControlAudio(0,3,time,"null");
                return;
            }
        }

        this.BGSFadeTime = this.BGSFadeTimeMax = time * 60;
        this.BGSFade = true;
        //当渐变时间为0 时立马停止
        if(this.BGSFadeTime <= 0){
            this.stopBGS();
        }
    }

    this.fadeBGS = function(){
        if(!this.BGSFade) {return;}
        this.BGSFadeTime -= 1;
        var fd = this.BGSFadeTime / this.BGSFadeTimeMax;
        var fv = this.bgs.volume * fd;
        PBGS = "";
        if(this.BGSFadeTime <= 0){
            this.BGSFadeTime = 0;
            this.BGSFade = false;
            this.stopBGS();
            return;
        }
        this.bgs.volume = fv;
    }

    this.playBGM = function(src,volume,path){
        if(this.BGMFade){
            this.stopBGM();
        }
        if(mark == "ios"){
            PBGM = src;
            BGMPath = path;
            var t = new musichTask(1,0,volume* (this.bgmV/100),src);
            musicPlay.push(t);
            return;
        }else if(mark == "aBox"){
            if(typeof window.org_box == 'undefined'){

            }else{
                PBGM = src;
                BGMPath = path;
                window.org_box.ControlAudio(1,0,volume* (this.bgmV/100),src);
                return;
            }
        }

        if(PBGM == src && this.bgm.paused == false){return;}
        this.stopBGM();
        if(!isIphone()&&!isSafrai()){
           src = src.replace(".mp3","");
        }
        //console.log("play bgm the src is222222222222 "+src);
        if(src){
            PBGM = src;
            BGMPath = path;
            this.bgm.src = src;
            this.bgm.volume = volume / 100 * (this.bgmV/100);
            this.bgm.loop = true;
            this.bgm.load();
            this.bgm.play();
        }

    }

    //ios非盒子版 特殊处理音乐
    this.touchBGM = function(){
        //console.log("touchBGM-------------->", PBGM);
        if(PBGM.length <= 0 || this.bgm.paused == false){
            return;
        }
        //console.log(this.bgm,"this.touchBGM");
        //alert(this.bgm);
        this.bgm.src = PBGM ;
        this.bgm.load();
        this.bgm.play();
    }

    this.touchBGS = function(){
        if(PBGS.length <= 0 || this.bgs.paused == false){
            return;
        }
        this.bgm.src = PBGS ;
        this.bgs.load();
        this.bgs.play();
    }


    this.stopBGM = function(){
        this.bgm.pause();
        //this.bgm.load();//0108 jhy-
        this.BGMFade = false;
        PBGM = "";
        BGMPath = "";
    };

    this.bgmFade = function(time){
        if(mark == "ios"){
            PBGM = "";
            BGMPath = "";
            var t = new musichTask(0,0,time,"null");
            musicPlay.push(t)
            return;
        }else if(mark == "aBox"){
            if(typeof window.org_box == 'undefined'){

            }else{
                PBGM = "";
                BGMPath = "";
                window.org_box.ControlAudio(0,0,time*100,"null");
                return;
            }
        }

        PBGM = "";//0210 fade前后src相同的音乐 fade后再playbgm 因src相同无法播放 随后因fade而产生的stop造成之前的音乐停止
        BGMPath = "";
        this.BGMFadeTime = this.BGMFadeTimeMax = time * 60;
        this.BGMFade = true;
    }

    this.fadeBGM = function(){
        if(!this.BGMFade) {return;}
        this.BGMFadeTime -= 1;
        var fd = this.BGMFadeTime / this.BGMFadeTimeMax;
        var fv = this.bgm.volume * fd;
        if(this.BGMFadeTime <= 0){
            this.BGMFadeTime = 0;
            this.BGMFade = false;
            this.stopBGM();
            return;
        }
        this.bgm.volume = fv;
    }

    this.update = function(){
        this.fadeBGM();
        this.fadeBGS();
    }

    this.setBgmVolumeGame = function(v){
        this.bgmV = v;
        if(mark == "aBox"){
            window.org_box.ControlAudio(1,0,v,PBGM);
        }else{
            this.bgm.volume = v / 100;
        }
    }

    this.setBGSVolumeGame = function(v){
        this.bgsV = v;
        this.bgs.volume = v / 100;
    }

    this.setSeVolumeGame = function(v){
        this.seV = v;
        this.se.volume = v / 100;
    }

    this.setVoiceVolumeGame = function(v){
        this.voiceV = v;
        this.voice.volume = v / 100;
    }

    this.saveData = function(arr){
        if(tv.system.rwFile.isCloud){
            arr.BGM = BGMPath.toLowerCase().replace(/\\/g,'/');
            arr.BGMV = this.bgmV;
            arr.BGS = PBGS;
            arr.BGSV = this.bgsV;
        }else{
            arr.push(BGMPath.toLowerCase().replace(/\\/g,'/') + "|");
            arr.push(this.bgmV + "|");
            arr.push(PBGS + "|");
            arr.push(this.bgsV + "|");
        }
    }

    this.loadData = function(arr){
        if(tv.system.rwFile.isCloud) {
            var tbgmPath = arr.BGM;
            var tbgmsrc = fileListFato(arr.BGM,'oaudio in loadData from oaudio.js');
            var tbgmVol = parseInt(arr.BGMV);
            var tbgsPath = arr.BGS;
            var tbgsVol = parseInt(arr.BGSV);
        }else{
            var tbgmPath = arr.shift();
            var tbgmsrc = fileListFato(tbgmPath,'oaudio in loadData from oaudio.js');
            var tbgmVol = parseInt(arr.shift());
            var tbgsPath = arr.shift();
            var tbgsVol = parseInt(arr.shift());
        }
        this.playBGM(tbgmsrc, tbgmVol,tbgmPath);
        this.palyBGS(tbgsPath, tbgsVol);
    }
}