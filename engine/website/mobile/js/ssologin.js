   	/**
     *  SSO弹框登录
     * @param {*} param_name
     */
var ssoLogin = (function (my, window) {

	var _conf = {
		minSsoModal: 'sso_login_modal',           // 登录sso最外层的div
		minSsoIframe: 'js-cross-login-iframe',    // min登录的iframe
		minIframeSrc: '',  						  // iframe的src路径,如果没有的话会走默认值
		loginClass: 'ssologin',                   // 登录的class
		logoutClass: 'logout',                    // 退出登录的class
		loginCall: [],                            // 登录后要进行的回调   [{obj:obj,callback:'',args:''}]
		logoutCall: [],                           // 退出登录后要进行的回调   [{obj:obj,callback:'',args:''}]
		notLoginCall: [],                         
		ajaxLoginCall: [],                        // AJAX登录后进行的回调(自动登录)
		dataId: 'data',                           // 设置$('#data').data();的
		dataKey: '',                              // 要存入$('#data');的KEY值
		openNotic: true,                          // 是否开启通知请求 game/debug?不 需要显示
		whetherMinLogin: true,					  // true : 为跳转登录框 ,false：弹框登录
		noticeShowEle: '',						  // 消息数目显示在其他元素上
		logoutSkip: '',                           // 退出登录要跳转的页面
		isAjax: false,
		isGamePage: false,						  // 是否是作品页
		isWebApp: false						      // true:是内嵌app、false:是生存在浏览器上
	},

	_private = {
		quickLogin: function () {
			if (window.org_box) {
				window.org_box.Login();
			} else {
				window.location.href = "/sso/mobileLogin?curUrl=" + loginUrl;
			}
		},

		miniLogin: function () {
			if (window.org_box) {
				window.org_box.Login();
			} else {
				//	sso快速登录

				var obj = $('#' + _conf.minSsoIframe), attr = obj.data('src');
				if (_conf.minIframeSrc != '') {
					attr = "/sso/minilogin?curUrl=" + _conf.minIframeSrc;
				}
				obj.attr('src', attr);
				$('#' + _conf.minSsoModal).show();
				obj.show();
			}
		},

		checkLogin: function () {
			var obj = $('#' + _conf.minSsoIframe), attr = obj.data('src');
			if (_conf.minIframeSrc != '') {
				attr = _conf.minIframeSrc;
			};
			$('#' + _conf.minSsoIframe).attr('src', attr);
		},

		quickLogout: function () {
			//  sso快速退出登录
			try {
	   			$.ajax({
					url: '/sso/logout.json',
					type : 'POST',
					dataType: 'json',
					data: {ac:'post'},//设置参数格式，防止iphone6 uc浏览器 请求方式变为get
					success: function (res) {
						alert(res.msg);
						if (res.status < 0) {
							return;
						}
						if (_conf.logoutSkip != '') {
							window.location.href = _conf.logoutSkip;
						}
						//  清楚 js缓存变量
						if (_conf.dataKey != '') {
							_private.data(_conf.dataKey, {
								uid: 0,
								uname: ''
							});
						}
						my.user = { uid: 0, uname: '' };
						$('.has_login').hide();
						$('.un_login').show();
	
						// 鲜花章节未解锁
						$('.has_unlock').hide();
						$('.not_unlock').show();
						// 用户送的花为0
						$('.flower_sum').text(0);
						$('.wild_flower_num').text(0);
	
						// 如果是作品页面的话，要给礼物榜让地方
						//if (_conf.isGamePage) {
						//	$('.right_overlay').css('top','800px').show();
						//	$('.left_overlay').css('top','800px').show();
						//} else {
						//	$('.left_overlay').css('top','0').show();
						//	$('.right_overlay').css('top','0').show();
						//}
						//  回调函数
						return _private.checkCallBack(_conf.logoutCall);
					},
					 error: function (jqXHR, textStatus, errorThrown) {
	
				            console.log(jqXHR.responseText);

	                }
				});
			
			}catch (e) {
			 	 alert(e.message);
			}
			
		},

		data: function (k, v) {
			//  处理登录后的数据
			var k = k || '', v = v || '';
			if (k == '') return '';
			if (typeof v != 'undefined' && v != '') {
				$('#' + _conf.dataId).data(k, v);
			}
			return $('#' + _conf.dataId).data(k);
		},

		checkCallBack: function (callArgs) {
			//  专门处理登录后的回调函数
			for (callKey in callArgs) {
				var obj = callArgs[callKey].obj || {},
					args = callArgs[callKey].args || [],
					callback = callArgs[callKey].callback;
				(callback && typeof callback == 'function') && callback.apply(obj, args);
			}
		}
	};
	// 初始化用户
	my.user = { uid: 0, uname: '' };
	// 初始化配置
	my.setConf = function (conf) {
		var conf = conf || {};
		for (confKey in conf) {
			if (!_conf.hasOwnProperty(confKey)) {
				continue;
			}
			_conf[confKey] = conf[confKey];
		}
	};
	// sso登录成功了
	my.onSsoLogin = function (userinfo) {
		var _that = this, userinfo = userinfo || {};
		//	是内嵌app就不走
		if (_conf.isWebApp) {
			return true;
		}

		// 设置userinfo
		_that.user = userinfo;
		//  设置用户信息
		_that.setLoginInfo(userinfo);
		//    获取通知信息
		if (_conf.openNotic) {
			_that.notice();
		}
		//  回调函数
		_private.checkCallBack(_conf.loginCall);
		//处理html
		//$('#' + _conf.minSsoModal).modal('hide');
		$('#' + _conf.minSsoModal).hide();
		$('#username').html(userinfo.username);
		$('#login_btn').hide();
		return _that;
	};
	// sso检查
	my.onSsoCheck = function (userinfo) {
		var _that = this, userinfo = userinfo || {};
		//	是内嵌app就不走
		if (_conf.isWebApp) {
			return true;
		}

		if (!$.isEmptyObject(userinfo)) {
			//  设置userinfo
			_that.user = userinfo;
			//  设置用户信息
			_that.setLoginInfo(userinfo);
			//    获取通知信息
			if (_conf.openNotic) {
				_that.notice();
			}
			//  回调函数
			_private.checkCallBack(_conf.loginCall);
			//处理html
			$('#username').html(userinfo.username);
			$('#login_btn').hide();
		} else {
			_private.checkCallBack(_conf.logoutCall);
		}
		return _that;
	};
	// 设置登录信息
	my.setLoginInfo = function (userinfo) {
		var _that = this;
		//  game页面,会在每次刷新页面进行下面的处理
		try{
			var cancel_flag = $.cookie('down_app_tag') ? true : false;
		}catch(e){
			console.log(e);
		}
		
		if (_conf.dataKey != '') {
			_that.user = _private.data(_conf.dataKey, userinfo);
		}
		if (!_that.user || _that.user.uid == 0) {

			// 如果是作品页面的话，要给礼物榜让地方	
			if (_conf.isGamePage) {
				$('.right_overlay').css('top', '800px').show();
				$('.left_overlay').css('top', '800px').show();
			} else {
				$('.left_overlay').css('top', '0').show();
				$('.right_overlay').css('top', '0').show();
			}
			$('.un_login').show();
			
			return $('.has_login').hide();
			
		} else {
			var username = (typeof _that.user.username != 'undefined') ? _that.user.username : _that.user.uname;
			$('.un_login').hide();
			$('.has_login').show();

			$('.avatar-small').attr('src', passUrl+"/user/avatar?size=small&uid=" + _that.user.uid);
			$('.avatar-middle').attr('src', passUrl+"/user/avatar?uid=" + _that.user.uid);

			$('.username').html(username);
			$('.has_login').find('.username').html(username);
			//    设置签约作者标记
			if (parseInt(_that.user.author_level, 10) >= 2) {
				$('.has_login').find('.icon_sign_author').show();
			} else {
				$('.has_login').find('.icon_sign_author').hide();
			}
			//	设置会员标记
			if (parseInt(_that.user.vip_level, 10) > 0) {
				$('#left_overlay').css('top', -1000).hide();
				$('#right_overlay').css('top', -1000).hide();
				$('.has_login').find('.icon_silver_vip').show();
				$('.has_login').find('.icon_silver_vip_gray').hide();

			} else {
				$('.has_login').find('.icon_silver_vip').hide();
				$('.has_login').find('.icon_silver_vip_gray').show();
			}
			if (_that.user.medal_name != undefined && _that.user.medal_name != '') {
				$('.icon_medal_parcent').show();
				$('.icon_medal').show()
				.attr('src', _that.user.medal_show_pic)
				.attr('title', _that.user.medal_name)
				.attr('alt', _that.user.medal_name);
			} else {
				$('.icon_medal_icon').hide();
			}

			//if(_conf&&_conf.loginCall){
			//	_private.checkCallBack(_conf.loginCall);
			//}

			// 如果是作品页面的话,增加回调	
			if (_conf.isGamePage && _conf && _conf.loginCall) {
				_private.checkCallBack(_conf.loginCall);
			}

		}
		return _that;
	};
	// 模拟ajax请求登录
	my.ajaxAsync = function () {
		var _that = this;
		$.ajax({
			url: webUrl + '/ajax/user/getMobileUserInfo.json?&stamp;' + new Date().toString(),
			type: 'get',
			dataType: 'jsonp',
			jsonp: 'jsonCallBack',
			data: {},
			success: function (data) {
				var baseData = data.data, status = data.status;
				//	登录失败
				if (parseInt(baseData.userInfos.uid) <= 0) {
					//	设置登录url
					//$('.un_login > a').attr('href',baseData.loginUrl);
					//	开启iframe
					$('#sso_cross_check_login_modal').attr('src', '/sso/minicheck');
				} else {

					_that.setLoginInfo(baseData.userInfos);
					if (_conf.openNotic) {
						ssoLogin.notice();
					}
				}
				
				// 执行自动登录之后的回调函数
				_private.checkCallBack(_conf.ajaxLoginCall);
				
			}, error: function (data, status, e) {

			}
		});
	};

	my.getAndroidUserInfo = function (uid, uname) {
		var _this = this;
		$.ajax({
			url: webUrl + '/ajax/user/getMobileUserInfo.json?uid=' + uid + '&username=' + uname, //user相关信息从cookie获取
			type: 'get',
			dataType: 'jsonp',
			jsonp: 'jsonCallBack',
			data: {},
			success: function (data) {
				var baseData = data.data, status = data.status;
				if ($.isEmptyObject(baseData.userInfos)) {
					alert("获取登录信息失败");
				} else {
					_conf.dataKey = 'temp_h5_in_android_user';
					baseData.userInfos.token = window.org_box.GetLoginToken();
					_this.setLoginInfo(baseData.userInfos);
					if (_conf.openNotic) {
						ssoLogin.notice();
					}
					_private.checkCallBack(_conf.loginCall);
				}
				// 执行自动登录之后的回调函数
				_private.checkCallBack(_conf.ajaxLoginCall);
			}, error: function (data, status, e) { }
		});
	};
	//  sso通知
	my.notice = function () {
		var _that = this              //    登录后去请求一下是否有通知
		$.ajax({
			type: 'get',
			url: webUrl + '/ajax/notice/new_info.json?&stamp;' + new Date().toString(),
			dataType: 'jsonp',
			jsonp: 'jsonCallBack',
			data: {},
			success: function (ret) {
				var at_count, notice_count, rss_count;
				//	如果没有登录
				if (ret.status <= 0) {
					return false;
				}
				//	频道订阅不会影响小红点,如果At、notice的数量有值得话，不要让频道订阅不显示0
				/*rss_count = parseInt(ret.data.rss_game_new,10);
				if (rss_count > 0) {
					$('.icon_notice_box').find('.rss_game_new').html(rss_count);
				}*/

				if (ret.status > 0 && ret.data.count > 0) {
					$('.icon_notice_box em').show();

					//	要显示的数量
					notice_count = parseInt(ret.data.notice_count, 10);
					at_count = parseInt(ret.data.at_count, 10);

					//	下面是展示在个人中心选项卡上
					if (_conf.noticeShowEle != '') {

						//	notice数量
						if (typeof notice_count != undefined && notice_count > 0) {
							$(_conf.noticeShowEle).find('.notice_count').html('(' + notice_count + ')');
						}
						//	at的数量
						if (typeof at_count != undefined && at_count > 0) {
							$(_conf.noticeShowEle).find('.at_count').html('(' + at_count + ')');
						}

						//如果有消息记录或者@我的评论
						if ((typeof notice_count != undefined && notice_count > 0) || (typeof at_count != undefined && at_count > 0)) {
							var total_count = at_count + notice_count;
							$(_conf.noticeShowEle).find('.notice-at-count').html('(' + total_count + ')');

						}

						//如果没有新消息并且没有@我的评论                	  
						if (!(typeof notice_count != undefined && notice_count > 0) && !(typeof at_count != undefined && at_count > 0)) {
							$(_conf.noticeShowEle).find('.notice-at-count').html('');
						}

					}

					//	下面是展示在登陆信息旁边
					$('.icon_notice_box').find('.notice_count').html(notice_count);
					return $('.icon_notice_box').find('.at_count').html(at_count);
				}
			}
		});
		return _that;
	};
	//特殊日期网站变黑白
	my.transformHome=function(){
		$.ajax({
			type: 'get',
			url: webUrl+'/ajax/index/get_home_gray',
			dataType: "jsonp",
            jsonp: 'jsonCallBack',
			success: function (res) {
				if(res.status === 1) {
					if(res.data.gray ==1){
						// $("html").css('filter',"progid:DXImageTransform.Microsoft.BasicImage(grayscale=1)");
						// $("html").css('-webkit-filter',"grayscale(1)");
						$("html").addClass("black");
					}else {
						// $("html").css('filter',"progid:DXImageTransform.Microsoft.BasicImage(grayscale=0)");
						// $("html").css('-webkit-filter',"grayscale(0)");
						$("html").removeClass("black");
					}
				}else {
					$("body").css('filter',"progid:DXImageTransform.Microsoft.BasicImage(grayscale=0)");
						$("html").css('-webkit-filter',"grayscale(0)");
				}
			},
			error: function (data) {
				$("html").css('filter',"progid:DXImageTransform.Microsoft.BasicImage(grayscale=0)");
				$("html").css('-webkit-filter',"grayscale(0)");
			}
		});
	};
	

	// 绑定SSO快捷登录
	$(function () {
		//引入公共弹窗  显示弹窗方法errorBoxShow('参数1弹窗title','参数二提示内容','参数三按钮内容，不填就隐藏');
		if(typeof(cdnUrl) == 'undefined' || typeof(staticUrl) == 'undefined'){
			cdnUrl="//c2.cgyouxi.com";
			staticUrl ="//c2.cgyouxi.com";
		}
		if(location.href.indexOf('/h5/') < 0){
			var _url=location.href.indexOf('passport.66rpg.com')>0?staticUrl:cdnUrl;
			var scripterr=_url+"/website/orange/js/tipBox/errorBox.js?v=20251224";
			$('head').append('<script src="'+scripterr+'"></script>');
			//判断网站是否黑白
			ssoLogin.transformHome();	
		}
			
		
		// 判断登录的方式
		if (_conf.whetherMinLogin) {
			$('.' + _conf.loginClass).on('click', _private.quickLogin);
		} else {
			$('.' + _conf.loginClass).on('click', _private.miniLogin);
			//  个人信息下拉框
			//$('.username_box').mouseover(function(){
			//   $('.bubble_icon').show();
			//   $('.user_menu').show();
			//});
			//$('.username_box').mouseout(function(){
			//   $('.bubble_icon').hide(); 
			//   $('.user_menu').hide();
			//});
		}

		$('.' + _conf.logoutClass).on('click', _private.quickLogout);
		// 对会员标志添加url
		$('.icon_silver_vip_gray').click(function () {
			if (my.user.vip_level < 1) {
				window.open(ajaxUrl+'/home/silver_vip', '_blank');
			}
		});

		// 获取通知信息
		if (_conf.openNotic && !$.isEmptyObject($('#data').data('user'))) {
			ssoLogin.notice();
		}

		if (window.org_box) {
			// 如果在盒子内，并且盒子已经登录，Ajax获取用户信息
			if (window.org_box.GetLoginStatus()) {
				ssoLogin.getAndroidUserInfo(window.org_box.GetUid(), window.org_box.GetUname());
			}
		} else {
			// 是否开启ajax
			if (_conf.isAjax === true) {
				ssoLogin.ajaxAsync();
			}
		}

	});

	return my;
}({}, window));



/*
window.org_box.GetLoginToken();   //返回token
window.org_box.GetUid();          //返回uid
window.org_box.GetUname();        //返回用户名
window.org_box.Login();           //调用盒子登录
window.org_box.GetLoginStatus();  //获取盒子登录状态（true:盒子登录,false:盒子没有登录）
window.org_box.SendFlower('一夜成名','48432');  //调用盒子送花     参数1:作品名   参数2:gindex
*/