/*
 * 工具类代码 
 */

Array.prototype.find = function(v) {
    for (var i = 0; i < this.length; ++i)
    if (this[i] == v) return i;
    return - 1;
}
Array.prototype.remove = function(v) {
    for (var i = 0; i < this.length; ++i) {
        if (this[i] == v) {
            this.splice(i, 1);
            return true;
        }
    }
    return false;
}
String.prototype.trim = function() {
    return this.replace(/^\s+/, '').replace(/\s+$/, '');
}
String.prototype.gblen = function() {
    var len = 0;
    for (var i = 0; i < this.length; i++) {
        if (this.charCodeAt(i) > 127 || this.charCodeAt(i) == 94) {
            len += 2;
        } else {
            len++;
        }
    }
    return len;
}
Number.prototype.pad = function(min) {
    var s = this.toString();
    while (s.length < min) s = '0' + s;
    return s;
}
Number.prototype.hex = function(min) {
    var h = '0123456789ABCDEF';
    var n = this;
    var s = '';
    do {
        s = h.charAt(n & 15) + s;
        n = n >>> 4;
    } while ((-- min > 0 ) || (n > 0));
    return s;
}
var elem = {
    getOffset: function(e) {
        var r = {
            x: 0,
            y: 0
        };
        e = E(e);
        while (e.offsetParent) {
            r.x += e.offsetLeft;
            r.y += e.offsetTop;
            e = e.offsetParent;
        }
        return r;
    },
    addClass: function(e, name) {
        if ((e = E(e)) == null) return;
        var a = e.className.split(/\s+/);
        var k = 0;
        for (var i = 1; i < arguments.length; ++i) {
            if (a.find(arguments[i]) == -1) {
                a.push(arguments[i]);
                k = 1;
            }
        }
        if (k) e.className = a.join(' ');
    },
    removeClass: function(e, name) {
        if ((e = E(e)) == null) return;
        var a = e.className.split(/\s+/);
        var k = 0;
        for (var i = 1; i < arguments.length; ++i)
        k |= a.remove(arguments[i]);
        if (k) e.className = a.join(' ');
    },
    remove: function(e) {
        if ((e = E(e)) != null) e.parentNode.removeChild(e);
    },
    parentElem: function(e, tagName) {
        e = E(e);
        tagName = tagName.toUpperCase();
        while (e.parentNode) {
            e = e.parentNode;
            if (e.tagName == tagName) return e;
        }
        return null;
    },
    display: function() {
        var enable = arguments[arguments.length - 1];
        for (var i = 0; i < arguments.length - 1; ++i) {
            E(arguments[i]).style.display = enable ? '': 'none';
        }
    },
    isVisible: function(e) {
        e = E(e);
        while (e) {
            if ((e.style.visibility != 'visible') || (e.style.display == 'none')) return false;
            e = e.parentNode;
        }
        return true;
    },
    setInnerHTML: function(e, html) {
        e = E(e);
        if (e.innerHTML != html) e.innerHTML = html; // reduce flickering
    }
};
 
var ferror = {
    set: function(e, message, quiet) {
        if ((e = E(e)) == null) return;
        e._error_msg = message;
        e._error_org = e.title;
        e.title = message;
        elem.addClass(e, 'error');
        if (!quiet) this.show(e);
    },
    clear: function(e) {
        if ((e = E(e)) == null) return;
        e.title = e._error_org || '';
        elem.removeClass(e, 'error');
        e._error_msg = null;
        e._error_org = null;
    },
    clearAll: function(e) {
        for (var i = 0; i < e.length; ++i)
        this.clear(e[i]);
    },
    show: function(e) {
        if ((e = E(e)) == null) return;
        if (!e._error_msg) return;
        elem.addClass(e, 'error-focused');
        e.focus();
        alert(e._error_msg);
        elem.removeClass(e, 'error-focused');
    },
    ok: function(e) {
        if ((e = E(e)) == null) return 0;
        return ! e._error_msg;
    }
};

function xmlHttpObj() {
    var ob;
    try {
        ob = new XMLHttpRequest();
        if (ob) return ob;
    }
    catch(ex) {}
    try {
        ob = new ActiveXObject('Microsoft.XMLHTTP');
        if (ob) return ob;
    }
    catch(ex) {}
    return null;
}


var _useAjax = -1;
var _holdAjax = null;
function useAjax() {
    if (_useAjax == -1) _useAjax = ((_holdAjax = xmlHttpObj()) != null);
    return _useAjax;
}
function XmlHttp() {
    if ((!useAjax()) || ((this.xob = xmlHttpObj()) == null)) return null;
    return this;
}
XmlHttp.prototype = {
    addId: function(vars) {
        if (vars) vars += '&';
        else vars = '';
        vars += '_http_id=' + escapeCGI(nvram.http_id);
        return vars;
    },
    get: function(url, vars) {
        try {
            vars = this.addId(vars);
            url += '?' + vars;
            this.xob.onreadystatechange = THIS(this, this.onReadyStateChange);
            this.xob.open('GET', url, true);
            this.xob.send(null);
        }
        catch(ex) {
            this.onError(ex);
        }
    },
    post: function(url, vars) {
        try {
            vars = this.addId(vars);
            this.xob.onreadystatechange = THIS(this, this.onReadyStateChange);
            this.xob.open('POST', url, true);
            this.xob.send(vars);
        }
        catch(ex) {
            this.onError(ex);
        }
    },
    abort: function() {
        try {
            this.xob.onreadystatechange = function() {}
            this.xob.abort();
        }
        catch(ex) {}
    },
    onReadyStateChange: function() {
        try {
            if (typeof(E) == 'undefined') return; // oddly late? testing for
													// bug...
            if (this.xob.readyState == 4) {
                if (this.xob.status == 200) {
                    this.onCompleted(this.xob.responseText, this.xob.responseXML);
                }
                else {
                    this.onError('' + (this.xob.status || 'unknown'));
                }
            }
        }
        catch(ex) {
            this.onError(ex);
        }
    },
    onCompleted: function(text, xml) {},
    onError: function(ex) {}
}

function TomatoTimer(func, ms) {
    this.tid = null;
    this.onTimer = func;
    if (ms) this.start(ms);
    return this;
}

TomatoTimer.prototype = {
    start: function(ms) {
        this.stop();
        this.tid = setTimeout(THIS(this, this._onTimer), ms);
    },
    stop: function() {
        if (this.tid) {
            clearTimeout(this.tid);
            this.tid = null;
        }
    },
    isRunning: function() {
        return (this.tid != null);
    },
    _onTimer: function() {
        this.tid = null;
        this.onTimer();
    },
    onTimer: function() {}
}

function TomatoRefresh(actionURL, postData, refreshTime, cookieTag) {
    this.setup(actionURL, postData, refreshTime, cookieTag);
    this.timer = new TomatoTimer(THIS(this, this.start));
}

TomatoRefresh.prototype = {
    running: 0,
    setup: function(actionURL, postData, refreshTime, cookieTag) {
        var e, v;
        this.actionURL = actionURL;
        this.postData = postData;
        this.refreshTime = refreshTime * 1000;
        this.cookieTag = cookieTag;
    },
    start: function() {
        var e;
        if ((e = E('refresh-time')) != null) {
            if (this.cookieTag) cookie.set(this.cookieTag, e.value);
            this.refreshTime = e.value * 1000;
        }
        e = undefined;
        this.updateUI('start');
        this.running = 1;
        if ((this.http = new XmlHttp()) == null) {
            reloadPage();
            return;
        }
        this.http.parent = this;
        this.http.onCompleted = function(text, xml) {
            var p = this.parent;
            if (p.cookieTag) cookie.unset(p.cookieTag + '-error');
            if (!p.running) {
                p.stop();
                return;
            }
            p.refresh(text);
            if ((p.refreshTime > 0) && (!p.once)) {
                p.updateUI('wait');
                p.timer.start(Math.round(p.refreshTime));
            }
            else {
                p.stop();
            }
            p.errors = 0;
        }
        this.http.onError = function(ex) {
            var p = this.parent;
            if ((!p) || (!p.running)) return;
            p.timer.stop();
            if (++p.errors <= 3) {
                p.updateUI('wait');
                p.timer.start(3000);
                return;
            }
            if (p.cookieTag) {
                var e = cookie.get(p.cookieTag + '-error') * 1;
                if (isNaN(e)) e = 0;
                else++e;
                cookie.unset(p.cookieTag);
                cookie.set(p.cookieTag + '-error', e, 1);
                if (e >= 3) {
                    alert('XMLHTTP: ' + ex);
                    return;
                }
            }
            setTimeout(reloadPage, 2000);
        }
        this.errors = 0;
        this.http.post(this.actionURL, this.postData);
    },
    stop: function() {
        if (this.cookieTag) cookie.set(this.cookieTag, -(this.refreshTime / 1000));
        this.running = 0;
        this.updateUI('stop');
        this.timer.stop();
        this.http = null;
        this.once = undefined;
    },
    toggle: function(delay) {
        if (this.running) this.stop();
        else this.start(delay);
    },
    updateUI: function(mode) {
        var e, b;
        if (typeof(E) == 'undefined') return; // for a bizzare bug...
        b = (mode != 'stop') && (this.refreshTime > 0);
        if ((e = E('refresh-button')) != null) {
            e.value = b ? '停止': '刷新';
            e.disabled = ((mode == 'start') && (!b));
        }
        if ((e = E('refresh-time')) != null) e.disabled = b;
        if ((e = E('refresh-spinner')) != null) e.style.visibility = b ? 'visible': 'hidden';
    },
    initPage: function(delay, def) {
        var e, v;
        e = E('refresh-time');
        if (((this.cookieTag) && (e != null)) && ((v = cookie.get(this.cookieTag)) != null) && (!isNaN(v *= 1))) {
            e.value = Math.abs(v);
            if (v > 0) v = (v * 1000) + (delay || 0);
        }
        else if (def) {
            v = def;
            if (e) e.value = def;
        }
        else v = 0;
        if (delay < 0) {
            v = -delay;
            this.once = 1;
        }
        if (v > 0) {
            this.running = 1;
            this.refreshTime = v;
            this.timer.start(v);
            this.updateUI('wait');
        }
    }
}

function genStdRefresh(spin, min, exec) {
    W('<div style="text-align:right">');
    if (spin) W('<img src="spin.gif" id="refresh-spinner"> ');
    genStdTimeList('refresh-time', '自动刷新', min);
    W('<input type="button" value="刷新" onclick="' + (exec ? exec: 'refreshClick()') + '" id="refresh-button"></div>');
}
function _tabCreate(tabs) {
    var buf = [];
    buf.push('<ul id="tabs">');
    for (var i = 0; i < arguments.length; ++i)
    buf.push('<li><a href="javascript:tabSelect(\'' + arguments[i][0] + '\')" id="' + arguments[i][0] + '">' + arguments[i][1] + '</a>');
    buf.push('</ul><div id="tabs-bottom"></div>');
    return buf.join('');
}
function tabCreate(tabs) {
    document.write(_tabCreate.apply(this, arguments));
}
function tabHigh(id) {
    var a = E('tabs').getElementsByTagName('A');
    for (var i = 0; i < a.length; ++i) {
        if (id != a[i].id) elem.removeClass(a[i], 'active');
    }
    elem.addClass(id, 'active');
}
var cookie = {
    set: function(key, value, days) {
        document.cookie = 'tomato_' + key + '=' + value + '; expires=' + (new Date(new Date().getTime() + ((days ? days: 14) * 86400000))).toUTCString() + '; path=/';
    },
    get: function(key) {
        var r = ('; ' + document.cookie + ';').match('; tomato_' + key + '=(.*?);');
        return r ? r[1] : null;
    },
    unset: function(key) {
        document.cookie = 'tomato_' + key + '=; expires=' + (new Date(1)).toUTCString() + '; path=/';
    }
};

function checkEvent(evt) {
    if (typeof(evt) == 'undefined') {
        evt = event;
        evt.target = evt.srcElement;
        evt.relatedTarget = evt.toElement;
    }
    return evt;
}
function W(s) {
    document.write(s);
}
function E(e) {
    return (typeof(e) == 'string') ? document.getElementById(e) : e;
}
function PR(e) {
    return elem.parentElem(e, 'TR');
}
function THIS(obj, func) {
    return function() {
        return func.apply(obj, arguments);
    }
}
function UT(v) {
    return (typeof(v) == 'undefined') ? '': '' + v;
}
function escapeHTML(s) {
    function esc(c) {
        return '&#' + c.charCodeAt(0) + ';';
    }
    return s.replace(/[&"'<>\r\n]/g, esc);
}
function escapeCGI(s) {
    return escape(s).replace(/\+/g, '%2B'); // escape() doesn't handle +
}
function escapeD(s) {
    function esc(c) {
        return '%' + c.charCodeAt(0).hex(2);
    }
    return s.replace(/[<>|%]/g, esc);
}
function ellipsis(s, max) {
    return (s.length <= max) ? s: s.substr(0, max - 3) + '...';
}
function MIN(a, b) {
    return a < b ? a: b;
}
function MAX(a, b) {
    return a > b ? a: b;
}
function fixInt(n, min, max, def) {
    if (n === null) return def;
    n *= 1;
    if (isNaN(n)) return def;
    if (n < min) return min;
    if (n > max) return max;
    return n;
}
function comma(n) {
    n = '' + n;
    var p = n;
    while ((n = n.replace(/(\d+)(\d{3})/g, '$1,$2')) != p) p = n;
    return n;
}
function doScaleSize(n, sm) {
    if (isNaN(n *= 1)) return '-';
    if (n <= 9999) return '' + n;
    var s = -1;
    do {
        n /= 1024; ++s;
    } while (( n > 9999 ) && (s < 2));
    return comma(n.toFixed(2)) + (sm ? '<small> ': ' ') + (['KB', 'MB', 'GB'])[s] + (sm ? '</small>': '');
}
function scaleSize(n) {
    return doScaleSize(n, 1);
}
function timeString(mins) {
    var h = Math.floor(mins / 60);
    if ((new Date(2000, 0, 1, 23, 0, 0, 0)).toLocaleString().indexOf('23') != -1) return h + ':' + (mins % 60).pad(2);
    return ((h == 0) ? 12 : ((h > 12) ? h - 12 : h)) + ':' + (mins % 60).pad(2) + ((h >= 12) ? ' PM': ' AM');
}
function features(s) {
    var features = ['ses', 'brau', 'aoss', 'wham', 'hpamp', '!nve', '11n', '1000et', '2g5g'];
    var i;
    for (i = features.length - 1; i >= 0; --i) {
        if (features[i] == s) return (parseInt(nvram.t_features) & (1 << i)) != 0;
    }
    return 0;
}

function reloadPage() {
    document.location.reload(1);
}


/*
 * 带宽绘图代码
 * */
var tabs = [];
var rx_max, rx_avg;
var tx_max, tx_avg;
var xx_max = 0;
var ifname;
var htmReady = 0;
var svgReady = 0;
var updating = 0;
var scaleMode = 0;
var scaleLast = -1;
var drawMode = 0;
var drawLast = -1;
var drawColor = 0;
var avgMode = 0;
var avgLast = -1;
var colorX = 0;
var colors = 
	    [ 
	    [ 'Green &amp; Blue', '#118811', '#6495ed' ],
		[ 'Blue &amp; Orange', '#003EBA', '#FF9000' ],
		[ 'Blue &amp; Red', '#003EDD', '#CC4040' ], 
		[ 'Blue', '#22f', '#225' ],
		[ 'Gray', '#000', '#999' ], 
		[ 'Red &amp; Black', '#d00', '#000' ] 
	    ];
function xpsb(byt) {
	//return (byt / 125).toFixed(2) + ' <small>kbit/s</small><br>('
	//		+ (byt / 1024).toFixed(2) + ' <small>KB/s</small>)';
	var val = byt / 125;
	var name = "kbps";
	if(val>1024){
		val /= 1024;
		name = "mbps";
	}
	return (val).toFixed(2) + ' <small>'+name+'</small>';
}
function showCTab() {
	showTab('speed-tab-' + ifname);
}
function showSelectedOption(prefix, prev, now) {
	var e;
	elem.removeClass(prefix + prev, 'selected'); // safe if prev doesn't
													// exist
	if ((e = E(prefix + now)) != null) {
		elem.addClass(e, 'selected');
		e.blur();
	}
}
function showDraw() {
	if (drawLast == drawMode)
		return;
	showSelectedOption('draw', drawLast, drawMode);
	drawLast = drawMode;
}
function switchDraw(n) {
	if ((!svgReady) || (updating))
		return;
	drawMode = n;
	showDraw();
	showCTab();
	cookie.set(cprefix + 'draw', drawMode);
}
function showColor() {
	E('drawcolor').innerHTML = colors[drawColor][0] + ' &raquo;';
	E('rx-name').style.borderBottom = '2px dashed '
			+ colors[drawColor][1 + colorX];
	E('tx-name').style.borderBottom = '2px dashed '
			+ colors[drawColor][1 + (colorX ^ 1)];
}
function switchColor(rev) {
	if ((!svgReady) || (updating))
		return;
	if (rev)
		colorX ^= 1;
	else
		drawColor = (drawColor + 1) % colors.length;
	showColor();
	showCTab();
	cookie.set(cprefix + 'color', drawColor + ',' + colorX);
}
function showScale() {
	if (scaleMode == scaleLast)
		return;
	showSelectedOption('scale', scaleLast, scaleMode);
	scaleLast = scaleMode;
}
function switchScale(n) {
	scaleMode = n;
	showScale();
	showTab('speed-tab-' + ifname);
	cookie.set(cprefix + 'scale', scaleMode);
}
function showAvg() {
	if (avgMode == avgLast)
		return;
	showSelectedOption('avg', avgLast, avgMode);
	avgLast = avgMode;
}
function switchAvg(n) {
	if ((!svgReady) || (updating))
		return;
	avgMode = n;
	showAvg();
	showCTab();
	cookie.set(cprefix + 'avg', avgMode);
}
function tabSelect(name) {
	if (!updating)
		showTab(name);
}
function showTab(name) {
	var h;
	var max;
	var i;
	var rx, tx;
	var e;
	ifname = name.replace('speed-tab-', '');
	cookie.set(cprefix + 'tab', ifname, 14);
	tabHigh(name);
	h = speed_history[ifname];
	if (!h)
		return;
	E('rx-current').innerHTML = xpsb(h.rx[h.rx.length - 1] / updateDiv);
	E('rx-avg').innerHTML = xpsb(h.rx_avg);
	E('rx-max').innerHTML = xpsb(h.rx_max);
	E('tx-current').innerHTML = xpsb(h.tx[h.tx.length - 1] / updateDiv);
	E('tx-avg').innerHTML = xpsb(h.tx_avg);
	E('tx-max').innerHTML = xpsb(h.tx_max);
	E('rx-total').innerHTML = scaleSize(h.rx_total);
	E('tx-total').innerHTML = scaleSize(h.tx_total);
	if (svgReady) {
		max = scaleMode ? MAX(h.rx_max, h.tx_max) : xx_max
		if (max > 12500)
			max = Math.round((max + 12499) / 12500) * 12500;
		else
			max += 100;
		updateSVG(h.rx, h.tx, max, drawMode, colors[drawColor][1 + colorX],
				colors[drawColor][1 + (colorX ^ 1)], updateInt, updateMaxL,
				updateDiv, avgMode, clock);
	}
}
function loadData() {
	var old;
	var t, e;
	var name;
	var i;
	var changed;
	xx_max = 0;
	old = tabs;
	tabs = [];
	clock = new Date();
	if (!speed_history) {
		speed_history = [];
	} else {
		for ( var i in speed_history) {
			var h = speed_history[i];
			if ((typeof (h.rx) == 'undefined')
					|| (typeof (h.tx) == 'undefined')) {
				delete speed_history[i];
				continue;
			}
			if (updateReTotal) {
				h.rx_total = h.rx_max = 0;
				h.tx_total = h.tx_max = 0;
				for (j = (h.rx.length - updateMaxL); j < h.rx.length; ++j) {
					t = h.rx[j];
					if (t > h.rx_max)
						h.rx_max = t;
					h.rx_total += t;
					t = h.tx[j];
					if (t > h.tx_max)
						h.tx_max = t;
					h.tx_total += t;
				}
				h.rx_avg = h.rx_total / updateMaxL;
				h.tx_avg = h.tx_total / updateMaxL;
			}
			if (updateDiv > 1) {
				h.rx_max /= updateDiv;
				h.tx_max /= updateDiv;
				h.rx_avg /= updateDiv;
				h.tx_avg /= updateDiv;
			}
			if (h.rx_max > xx_max)
				xx_max = h.rx_max;
			if (h.tx_max > xx_max)
				xx_max = h.tx_max;
			t = i;
			if (i == nvram.wl_ifname) {
				t = '<span title="'+i+'">无线</span>';
			}else if(i == nvram.tun_ifname){
				t = '<span title="'+i+'">VPN</span>';
			} else if (i == nvram.lan_ifname) {
				t = '<span title="'+i+'">局域网 </span>';
			} else if ((nvram.wan_proto == 'pptp')
					|| (nvram.wan_proto == 'pppoe')
					|| (nvram.wan_proto == 'l2tp')
					|| (nvram.wan2_proto == 'pptp')
					|| (nvram.wan2_proto == 'pppoe')
					|| (nvram.wan2_proto == 'l2tp')) {
					t = '<span title="'+i+'">拨号</span>';
			} else if(nvram.wan_proto=='dhcp' || nvram.wan_proto=='static'){ 
					t = '<span title="'+i+'">WAN口</span>';
			} else if (nvram.wan_proto != 'disabled') {
				if (nvram.wan_ifname == i){
					t = '<span title="'+i+'">WAN</span>';
				}
			}
			tabs.push([ 'speed-tab-' + i, t ]);
		}
		tabs = tabs.sort(function(a, b) {
			if (a[1] < b[1])
				return -1;
			if (a[1] > b[1])
				return 1;
			return 0;
		});
	}
	if (tabs.length == old.length) {
		for (i = tabs.length - 1; i >= 0; --i)
			if (tabs[i][0] != old[i][0])
				break;
		changed = i > 0;
	} else
		changed = 1;
	if (changed) {
		E('tab-area').innerHTML = _tabCreate.apply(this, tabs);
	}
	if (((name = cookie.get(cprefix + 'tab')) != null)
			&& ((speed_history[name] != undefined))) {
		showTab('speed-tab-' + name);
		return;
	}
	if (tabs.length)
		showTab(tabs[0][0]);
}
function initData() {
	if (htmReady) {
		loadData();
		if (svgReady) {
			E('graph').style.visibility = 'visible';
			E('bwm-controls').style.visibility = 'visible';
		}
	}
}
function initCommon(defAvg, defDrawMode, defDrawColor) {
	drawMode = fixInt(cookie.get(cprefix + 'draw'), 0, 1, defDrawMode);
	showDraw();
	var c = nvram.rstats_colors.split(',');
	while (c.length >= 3) {
		c[0] = escapeHTML(c[0]);
		colors.push(c.splice(0, 3));
	}
	c = (cookie.get(cprefix + 'color') || '').split(',');
	if (c.length == 2) {
		drawColor = fixInt(c[0], 0, colors.length - 1, defDrawColor);
		colorX = fixInt(c[1], 0, 1, 0);
	} else {
		drawColor = defDrawColor;
	}
	showColor();
	scaleMode = fixInt(cookie.get(cprefix + 'scale'), 0, 1, 0);
	showScale();
	avgMode = fixInt(cookie.get(cprefix + 'avg'), 1, 10, defAvg);
	showAvg();
	// if just switched
	if ((nvram.wan_proto == 'disabled') || (nvram.wan_proto == 'wet')) {
		nvram.wan_ifname = '';
	}
	htmReady = 1;
	initData();
	E('refresh-spinner').style.visibility = 'hidden';
}