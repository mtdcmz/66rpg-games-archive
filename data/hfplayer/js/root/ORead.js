/**
 * Created by 七夕小雨 on 2014/11/11.
 */
var errortimes = 0 ;
function ORead(filepath,rd){
//    console.log("ORead -> ORead()");
//    console.log("   filepath = ", filepath);
	var cRead = false;
	var xhr = new XMLHttpRequest();
	var read = null;
	xhr.open('get',filepath,true);
	//	cdn那边跨域配置了泛解析，如果设置此参数，会有冲突
	//xhr.withCredentials = true;
	xhr.responseType = "arraybuffer";
	try{
		xhr.overrideMimeType("text/plain; charset=x-user-defined");
	}catch(e){
		xhr.responseType = "arraybuffer";
	}

	var self = this ;
	xhr.onerror = function(e){
		console.log(e);
		self.reLoad();
	};
	xhr.onload = function(e){
		if(this.status == 200)
		{
			read = new DataStream(this.response);
            rd(read);
		}
		else
		{
			self.reLoad();
		}
	};
	this.reLoad = function()
	{
		errortimes++ ;
		if(errortimes <=5)
		{
			setTimeout(function(){
				console.log("资源载入失败,尝试重新加载，第"+errortimes+"次");
				new ORead(filepath,rd) ;
			},2500) ;
		}
		else
		{
			alert("资源加载失败!");
			errortimes = 0 ;
		}
	}
	xhr.send();
}

//0324 XHR2 tes

/*
 * AJAX GET
 * data:(k,v)对象
 */
function XHR2Get(filepath,data,restype,callback){
	var xhr = new XMLHttpRequest();
	var read = null;
	var url = "";

	url = (data == null ? filepath : filepath + "?" + formatParams(data));

	xhr.open('get',url,true);
	//xhr.withCredentials = true;
	if(restype == 'json' || restype == 'text'){
		xhr.responseType = restype;
	}else{
		console.log("ORead::XHR2Get::restype=" + restype);
	}
	
	xhr.onerror = function(e){
		alert(e);
	};
    xhr.onload = function(e){
    	if(this.status == 200){
			read = this.response;
            callback(read);
		}
    }
    xhr.send();
}

/*
 * AJAX POST
 * data:(k,v)对象
 */
function XHR2Post(filepath,restype,data,callback){
	var xhr = new XMLHttpRequest();
	var read = null;
	var sendData = formatParams(data);//？

	xhr.open('post',filepath,true);
	//xhr.withCredentials = true;
	if(restype == 'json' || restype == 'text'){
		xhr.responseType = restype;
	}else{
		console.log("ORead::XHR2Post::responseType is:" + restype);
	}
	
	xhr.onerror = function(e){
		alert(e);
	};
    xhr.onload = function(e){
    	if(this.status == 200){
			read = this.response;
            callback(read);
		}
    }
    xhr.send(sendData);
}

function XHR2GetSyn(filepath,data,restype){
	var xhr = new XMLHttpRequest();
	var read = null;
	url = (data == null ? filepath : filepath + "?" + formatParams(data));
	xhr.open('get',url,false);
	//xhr.withCredentials = true;
	if(restype == 'json' || restype == 'text'){
		xhr.responseType = restype;
	}else{
		console.log("ORead::XHR2Get::responseType is:" + restype);
	}
    xhr.send();
    return xhr.response;
}

/*
 * AJAX上传参数格式化
 * data:(k,v)对象
 */
function formatParams(data) {
    var arr = [];
    for (var name in data) {
        arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
    }
    arr.push(("v=" + Math.random()).replace(".",""));//防止从缓存取数据
    return arr.join("&");
}




