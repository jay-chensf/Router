//获取选中的radio组件的value值
function get_radio_value(obj){
	for( var i=0;i<obj.length;i++ ){
		if(obj[i].checked){
			return obj[i].value;
		}
	}
	return "";
}


function autoLink(url,callback,timeout){
	var time = 5000;
	var timecounter = 0;
	var interval = window.setInterval(function() {
		var img = new Image();
		img.onload = function() {
			window.clearInterval(interval);
			//top.location.href = 'http://'+hostip+'/';
			if(callback.success){
				callback.success();
			}
		};
		img.onerror = function(e){
			timecounter+=5000;
			if(timecounter/1000>timeout){
				//退出
				if(callback.timeout){
					window.clearInterval(interval);
					callback.timeout();
					return;
				}
			}
			if(callback.error){
				callback.error();
			}
		};
		img.src = url + '?' + Math.random();
	}, time);
}

/**
MAC 地址格式化
标准格式 xx:xx:xx:xx:xx:xx
*/
function mac_format(mac){
	mac=mac.replace(/-/g,":");
	mac=mac.toUpperCase();
	return mac;
}

/**
数组去重复
用法:
alert([1, 1, 2, 3, 4, 5, 4, 3, 4, 4, 5, 5, 6, 7].del()); 
*/
Array.prototype.del = function() { 
	var a = {}, c = [], l = this.length; 
		for (var i = 0; i < l; i++) { 
		var b = this[i]; 
		var d = (typeof b) + b; 
		if (a[d] === undefined) { 
			c.push(b); 
			a[d] = 1; 
		} 
	} 
	return c; 
} 

/*
 * 倒计时
 * nMax - 秒数
 * nInterval - 间隔多少秒
 * */
function Counter(nMax,nInterval)
{
	this.maxTime=nMax;
	this.interval=nInterval;
	this.objId="timer";
	this.obj=null;
	this.num=this.maxTime;
	this.timer=null;
	this.start=function()
	{ 
		this.obj=document.getElementById(this.objId);
		if(this.num>0) setTimeout(this.run,this.interval*1000);
	};
		this.run=function()
	{
	if(myCounter.num>0) 
	{
		myCounter.num--;
		myCounter.obj.innerHTML=myCounter.num;
		myCounter.timer=setTimeout(myCounter.run,myCounter.interval*1000);
	}
	else clearTimeout(myCounter.timer);
	};
	this.show=function()
	{
		document.write("<span id="+this.objId+">"+this.num+"</span>");
		this.obj=document.getElementById(this.objId);
		//alert(this.obj.innerHTML);
	}
}

/*
 * 检查是否有中文字符 (过于 a)
 * nMax - 秒数
 * nInterval - 间隔多少秒
 */
function HaveChineseStr(input){
	var have = false;
	var one;
	input =  input.toString()
	for(i=0;i<input.length;i++){
		one = input.substr(i,1);
		//ascii 码
		if (one.charCodeAt(0)>127){
			have = true;
		}
	}
	return have;
}

function HTMLEncode ( input ) 
{ 
	var converter = document.createElement("DIV"); 
	converter.innerText = input; 
	var output = converter.innerHTML; 
	converter = null; 
	return output; 
}

function ipv6_hex2mask(sixmask){
	var maskval = 0;
	//var sixmask = "FFFF:FFFF:FFFF:FFFF:0:0:0:0";
	var masks = sixmask.split(":");
	if(masks.length==1){
		return sixmask;
	}
	for ( var i=0; i<masks.length; i++){
		var str = masks[i];
		for(var j=0;j<str.length;j++){
			var mask6num = (eval("0x"+str.charAt(j))).toString(2);
			for(var k=0;k<mask6num.length;k++){
				if(mask6num.charAt(k)=='1'){
					maskval++;
				}
			}
		}
	}
	return maskval;
}

function get_recommend_dns(){
	var v = new Array();
	v[0] = "114.114.114.114";
	v[1] = "114.114.115.115";
	return v;
}

function UrlDecode(zipStr){  
    var uzipStr="";  
    for(var i=0;i<zipStr.length;i++){  
        var chr = zipStr.charAt(i);  
        if(chr == "+"){  
            uzipStr+=" ";  
        }else if(chr=="%"){  
            var asc = zipStr.substring(i+1,i+3);  
            if(parseInt("0x"+asc)>0x7f){  
                uzipStr+=decodeURI("%"+asc.toString()+zipStr.substring(i+3,i+9).toString());  
                i+=8;  
            }else{  
                uzipStr+=AsciiToString(parseInt("0x"+asc));  
                i+=2;  
            }  
        }else{  
            uzipStr+= chr;  
        }  
    }  
  
    return uzipStr;  
}

function StringToAscii(str){  
    return str.charCodeAt(0).toString(16);  
}

function AsciiToString(asccode){  
    return String.fromCharCode(asccode);  
}