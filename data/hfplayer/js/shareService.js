///自定义分享

$(document).ready(function(){

    $('#div_share #weibo').click(function(){
        /*-----------新浪微博-----------
         * appkey:申请的应用appkey,显示分享来源(可选)
         * title: 分享的文字内容(可选，默认为所在页面的title)
         * ralateUid:关联用户的UID，分享微博会@该用户(可选)
         * Pic:分享时默认选择的图片，地址要填写绝对地址
         * count:是否显示分享数，1显示(可选)
         */
        var content = "#橙光在线#《" + window.document.title + "》可以在线玩咯<(￣︶￣)>不用下载就可以尽情玩耍的感觉酷酷哒[酷]大家一起来体验吧（分享自@橙光 ）在线地址：";

        openShareWindow("http://service.weibo.com/share/share.php?", {
            url:window.location.href,
            type:"3",
            count:"1",
            appkey:"2pcGaX", 
            title:content,
            pic:"",
            ralateUid:"",
            language:"zh_cn",
            rnd:new Date().valueOf()
        });
    });

    $('#div_share #qzone').click(function(){
        /* ---------QQ空间分享----------
         *showcount:是否显示分享总数,显示：'1'，不显示：'0' 
         *desc:默认分享理由(可选)
         *summary:分享摘要(可选)
         *title:分享标题(可选)
         *site:分享来源 如：腾讯网(可选)
         *pics:分享图片的路径(可选)
         */
        var content = "偶然间玩了【" + window.document.title + "】这款橙光作品，一下子就被吸引住了，简直不能更赞！好东西怎能独享，点击链接就能马上进行体验，赶快行动起来！";
        var tpic_url =  $('#title_img').attr('src');
        openShareWindow("http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?", {
            url:window.location.href,
            showcount:1,
            desc: content,
            summary:"橙光",
            title: window.document.title,
            site:"橙光",
            pics:tpic_url,
            style:"203",
            width:98,
            height:22
        });
    });


    $('#div_share #tcweibo').click(function(){
    /* ---------腾讯微博----------
     */
        var content = "手一滑点击了【" + window.document.title + "】万万没想到竟然被深深吸引住了，第一反应要分享给同样爱玩的你~o(*￣▽￣*)o~点击链接立刻起来嗨 在线地址：";
        var tpic_url =  $('#title_img').attr('src');
        openShareWindow("http://v.t.qq.com/share/share.php?", {
            title:content,
            url:window.location.href,
            appkey:"801cf76d3cfc44ada52ec13114e84a96",
            site:"橙光",
            assname:"橙光",
            pic:tpic_url
        });
    });

    $('#div_share #tcqq').click(function(){
        /* ---------qq----------
         */
        var content = "作为一个负责任的好友,【" + window.document.title + "】不分享给你怎么行，敢不敢跟我比看谁能先打出结局？戳此链接马上试玩~~";
        var tpic_url =  $('#title_img').attr('src');
        openShareWindow("http://connect.qq.com/widget/shareqq/index.html?", {
            url:window.location.href, /*获取URL，可加上来自分享到QQ标识，方便统计*/
            desc:content, /*分享理由(风格应模拟用户对话),支持多分享语随机展现（使用|分隔）*/
            title:window.document.title, /*分享标题(可选)*/
            summary:'橙光', /*分享摘要(可选)*/
            pics:tpic_url, /*分享图片(可选)*/
            flash: '', /*视频地址(可选)*/
            site:'橙光', /*分享来源(可选) 如：QQ分享*/
            style:'201',
            width:32,
            height:32
        });
    });

    $('#div_share #tieba').click(function(){
        /* ---------百度贴吧分享----------
         */

        var tpic_url =  $('#title_img').attr('src');
        openShareWindow("http://tieba.baidu.com/f/commit/share/openShareApi?", {
            title:"【" + window.document.title + "】各位请进",
            url:window.location.href,//0429 ipad分享url错误 其余帖子被删除 贴吧自身的问题   
            //to:"tieba",
            //type:"text",
            //relateUid:"",
            pic:tpic_url,
            //key:"",
            //sign:"on",
            desc:"橙光",
            //comment:"橙光游戏中心" //这个参数设置了也无效
        });
    });

    /*
    $('#div_share #douban').click(function(){
        ///---------豆瓣分享----------
        openShareWindow("http://www.douban.com/recommend/?", {
            title:window.location.href,
            url:window.location.href,
        });
    });
    */

    ///二维码
    $('#div_share #weixin').click(function(){
        var qrcodediv, qrcodediv_title, qrcodediv_body, qrcodediv_foot, qrimg;
        $('#qrdiv').remove();
        
        //qrdiv
        qrcodediv = document.createElement('div');
        qrcodediv.id = 'qrdiv';
        qrcodediv.style.width = '220px';//200
        qrcodediv.style.height = '290px';//260
        qrcodediv.style.border = '1px solid #dddddd';
        qrcodediv.style.backgroundColor = '#ffffff';
        qrcodediv.style.position = 'absolute';
        qrcodediv.style.top = ($(document).scrollTop() + $(window).height() / 2) + 'px';
        qrcodediv.style.left = '50%';
        qrcodediv.style.marginTop = '-140px';
        qrcodediv.style.marginLeft = '-120px';
        qrcodediv.style.padding = '10px';
        qrcodediv.style.zIndex= '10000000';

        //qrdiv的标题和关闭按钮
        qrcodediv_title = document.createElement('div');
        qrcodediv_title.innerHTML = '<span style=\'font-size:13px;font-weight:bold;\'>分享到微信朋友圈</span><a href=\'###\' style=\'position:absolute;right:0;font-size:20px;font-weight:bold; \' onclick=javascript:$(\'#qrdiv\').remove();>×</a>';                           
        qrcodediv.appendChild(qrcodediv_title);

        //换行
        qrcodediv_body = document.createElement('div');
        qrcodediv_body.innerHTML = '<span ><br/></span>';
        qrcodediv.appendChild(qrcodediv_body);
       
        //创建div
        document.body.appendChild(qrcodediv);
     
        //qrdiv的二维码部分
        //$('#qrdiv').qrcode(window.location.href); //0331 默认方式的二维码比较稳定 自定义二维码宽度任意值不稳定 比如150 150 还有和周围空白文字也有关系

        $("#qrdiv").qrcode({
        render: "table", //table方式
        width: 200, //宽度
        height:200, //高度
        text: window.location.href //任意内容
        });

       //qrdiv的底部
        qrcodediv_foot = document.createElement('div');
        qrcodediv_foot.innerHTML = '<span style=\'font-size:13px;font-weight:bold;\'><br/>打开微信，点击底部的“发现”，<br/>使用“扫一扫”即可将网页分享至朋友圈。</span>';
        qrcodediv.appendChild(qrcodediv_foot);

    });

    //0421 如果二维码打开，在分享页面点击继续游戏后，关闭二维码
     $('#div_share #continueGame').click(function(){
        var t = document.getElementById("qrdiv");
        if(t != null){
            t.remove();
        }
     });


});//$(document).ready(function()结束

function openShareWindow(f, e) {
    var h = [], g;
    for (g in e) {
        h.push(g + "=" + encodeURIComponent(e[g] || ""));
    }
    h = f + h.join("&");
    window.open(h, "", "width=700, height=680, top=" + (screen.height/2 - 340) + ", left=" + (screen.width/2 - 350) + ", toolbar=no, menubar=no, scrollbars=no, location=yes, resizable=no, status=no");
    return !1;
}

///百度共享 (暂时未使用)
/*function baiduShare(){
    window._bd_share_config = {
        common : {
            bdText :'', 
            bdPic :'',
            bdMiniList:false,
            bdSize:32,
            onBeforeClick:function(cmd,config){
                
                //分享内容自定义
                switch(cmd){
                    case 'tsina':config.bdText = '1';break;//document.title
                    case 'qzone':config.bdText = '2';break;
                    case 'tqq':config.bdText = '3';break;
                    case 'weixin':config.bdText = '4';break;
                    case 'renren':config.bdText = '5';break;
                    default:config.bdText = '自定义分享内容';break;
                }
                return config;

                
            }
        },
        share : [
            {
            "tag" : "share_1",
            "bdSize" : 32
            },
            {
            "tag" : "share_2",
            "bdSize" : 16
            }
        ]
     }

    with(document)0[(getElementsByTagName('head')[0]||body).appendChild(createElement('script')).src='http://bdimg.share.baidu.com/static/api/js/share.js?cdnversion='+~(-new Date()/36e5)];
}*/

//0422 弹窗提示
function popUpInfo(type){
    var qrcodediv, qrcodediv_title, qrcodediv_body, qrcodediv_foot, qrimg;

    //qrdiv
    qrcodediv = document.createElement('div');
    qrcodediv.style.width = '200px';
    qrcodediv.style.height = '260px';
    qrcodediv.style.border = '1px solid #dddddd';
    qrcodediv.style.backgroundColor = '#ffffff';
    qrcodediv.style.position = 'absolute';
    qrcodediv.style.top = ($(document).scrollTop() + $(window).height() / 2) + 'px';
    qrcodediv.style.left = '50%';
    qrcodediv.style.marginTop = '-140px';
    qrcodediv.style.marginLeft = '-120px';
    qrcodediv.style.padding = '10px';
    qrcodediv.style.zIndex= '10000000';
    
    if(type == "save"){
        $('#savediv').remove();
        qrcodediv.id = 'savediv';
        //qrdiv的标题和关闭按钮
        qrcodediv_title = document.createElement('div');
        qrcodediv_title.innerHTML = '<span style=\'font-size:13px;font-weight:bold;\'>试玩版作品暂时不支持存读档</span><a href=\'###\' style=\'position:absolute;right:0;font-size:20px;font-weight:bold; \' onclick=javascript:$(\'#savediv\').remove();>×</a>';
        qrcodediv.appendChild(qrcodediv_title);
        //换行
        qrcodediv_body = document.createElement('div');
        qrcodediv_body.innerHTML = '<span ><br/>试玩版作品暂时不支持存读档</span>';
        qrcodediv.appendChild(qrcodediv_body);
    }else if(type == "flower"){
        if(tv != null){
            qrcodediv.id = 'flowerdiv';
            //qrdiv的标题和关闭按钮
            qrcodediv_title = document.createElement('div');
            qrcodediv_title.innerHTML = '<span style=\'font-size:13px;font-weight:bold;\'>试玩版作品暂时不支持存读档</span><a href=\'###\' style=\'position:absolute;right:0;font-size:20px;font-weight:bold; \' onclick=javascript:$(\'#flowerdiv\').remove();>×</a>';
            qrcodediv.appendChild(qrcodediv_title);
            if(tv.isMobile){
                if(tv.isIos){
                    //换行
                    qrcodediv_body = document.createElement('div');
                    qrcodediv_body.innerHTML = '<span ><br/>试玩版作品暂时不支持鲜花剧情，请下载ios橙光</span>';
                    qrcodediv.appendChild(qrcodediv_body);
                }else if(tv.isAndroid){
                     //换行
                    qrcodediv_body = document.createElement('div');
                    qrcodediv_body.innerHTML = '<span ><br/>试玩版作品暂时不支持鲜花剧情，请下载andoird橙光</span>';
                    qrcodediv.appendChild(qrcodediv_body);
                }
            }else{
                //换行
                qrcodediv_body = document.createElement('div');
                qrcodediv_body.innerHTML = '<span ><br/>试玩版作品暂时不支持鲜花剧情，请回主站体验全部作品</span>';
                qrcodediv.appendChild(qrcodediv_body);
            }
        }
    }
    //创建div
    document.body.appendChild(qrcodediv);
}

//0422 弹窗提示
function popUpInfoTemp(){

    if(tv != null){
        if(tv.isMobile){
            if(tv.isIos){
               alert("ios");
            }else if(tv.isAndroidBox){
               alert("QAQ，好像橙娘还没有这个功能呢。喜欢这个作品的小伙伴可以点击试玩旁的下载按钮哦，画质更清晰，档位多到爆，不错过任何一个喜欢的主角！");
            }else if(tv.isAndroid){
               alert("版本测试中，橙娘暂时还不能提供此功能呢QAQ，喜欢我，可以搜索下载“橙光”应用，上万款作品等着你~~")
            }
        }else{
           alert("版本测试中，暂时无法提供存档功能，程序猿大大正在加班加点开发n(*≧▽≦*)n。安卓小伙伴可以下载我们的手机应用（http://www.66rpg.com/abox），iOS小伙伴可以看一下我们的推荐哦（http://www.66rpg.com/redirect/apple_recommand）。");
        }
    }
}


