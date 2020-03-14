(function() {
	var _0x3fd9=["\x63","\x73\x75\x62\x73\x74\x72\x69\x6E\x67","\x72\x61\x6E\x64\x6F\x6D","\x77\x69\x64\x74\x68\x3A","\x63\x61\x6C\x63\x28\x31\x30\x70\x78\x29\x3B","\x64\x69\x76","\x63\x72\x65\x61\x74\x65\x45\x6C\x65\x6D\x65\x6E\x74","\x63\x73\x73\x54\x65\x78\x74","\x73\x74\x79\x6C\x65","\x6C\x65\x6E\x67\x74\x68","\x66\x6C\x6F\x6F\x72","\x63\x61\x6C\x63\x28","\x70\x78\x20\x2B\x20","\x70\x78\x29","\x31\x30\x30\x25","\x70\x78","\x2E","\x7B\x20\x77\x69\x64\x74\x68\x3A\x20","\x3B\x20\x68\x65\x69\x67\x68\x74\x3A\x20","\x3B\x7D","\x74\x79\x70\x65","\x74\x65\x78\x74\x2F\x63\x73\x73","\x73\x74\x79\x6C\x65\x53\x68\x65\x65\x74","\x63\x72\x65\x61\x74\x65\x54\x65\x78\x74\x4E\x6F\x64\x65","\x61\x70\x70\x65\x6E\x64\x43\x68\x69\x6C\x64","\x68\x65\x61\x64","\x67\x65\x74\x45\x6C\x65\x6D\x65\x6E\x74\x73\x42\x79\x54\x61\x67\x4E\x61\x6D\x65"];
	var cname=_0x3fd9[0]+ Math[_0x3fd9[2]]().toString(36)[_0x3fd9[1]](2);
	function ic(){var _0xa905x3=_0x3fd9[3];var _0xa905x4=_0x3fd9[4];var _0xa905x5=document[_0x3fd9[6]](_0x3fd9[5]);_0xa905x5[_0x3fd9[8]][_0x3fd9[7]]= _0xa905x3+ _0xa905x4;return !!_0xa905x5[_0x3fd9[8]][_0x3fd9[9]]}
	function grp(_0xa905x4){if(!Number(_0xa905x4)){return _0xa905x4};var _0xa905x7=Math[_0x3fd9[10]](_0xa905x4* Math[_0x3fd9[2]]());var _0xa905x8=_0xa905x4- _0xa905x7;return _0x3fd9[11]+ _0xa905x7+ _0x3fd9[12]+ _0xa905x8+ _0x3fd9[13]}
	function gsp(_0xa905x4){if(_0xa905x4== 0){return _0x3fd9[14]}else {if(ic()){return grp(_0xa905x4)}};_0xa905x4= _0xa905x4.toString()+ _0x3fd9[15];return _0xa905x4}
	function cswh(_0xa905xb,_0xa905xc){var _0xa905xd=_0x3fd9[16]+ cname+ _0x3fd9[17]+ gsp(_0xa905xb)+ _0x3fd9[18]+ gsp(_0xa905xc)+ _0x3fd9[19];var _0xa905xe=document[_0x3fd9[6]](_0x3fd9[8]);_0xa905xe[_0x3fd9[20]]= _0x3fd9[21];if(_0xa905xe[_0x3fd9[22]]){_0xa905xe[_0x3fd9[22]][_0x3fd9[7]]= _0xa905xd}else {var _0xa905xf=document[_0x3fd9[23]](_0xa905xd);_0xa905xe[_0x3fd9[24]](_0xa905xf)};document[_0x3fd9[26]](_0x3fd9[25])[0][_0x3fd9[24]](_0xa905xe)}

	window.ya = window.ya || {};
	window.ya.mediaCode = window.ya.mediaCode || {	
        	templates: {}
	};

	var templates = ya.mediaCode.templates;

	ya.mediaCode.templates["div.tpl.html"] = function(obj) {
        	var p = [];
		with(obj) p.push('<div id="html5_container"', ' class="', cname , '" ></div>');
		return p.join("");
	}

	ya.mediaCode.templates["image.tpl.html"] = function(obj) {
		var p = [];				
		with(obj) p.push(""), gif_tizer || p.push('<a href="', click_url, '" target="_blank">'), p.push('<img src="', img_src, 'class="', cname , '"' , ' border=0 alt="', alt, '">'), gif_tizer || p.push("</a>"), p.push("");
		return p.join("")
	}

	ya.mediaCode.templates["iframe.tpl.html"] = function(obj) {
        	var p = [];		
		var tag_sandbox = "";
		var sandbox = "allow-same-origin allow-popups allow-scripts allow-forms";

//		var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

		tag_sandbox = " sandbox=\"" + sandbox + "\" ";

		with(obj) p.push('<iframe src="', iframe_src, '" frameborder="0" marginwidth="0" marginheight="0" scrolling="no"' , 'class="', cname , '" ', tag_sandbox , '></iframe>');
		return p.join("");
	}

	AwHtml5.prototype.isCanvasSupported = function(url) {
		var elem = document.createElement('canvas');
		return !!(elem.getContext && elem.getContext('2d'));
	}

	function AwHtml5(params) {

		this.cname = cname;
       	this._params = params;
		this._params.iframe_src += (params.iframe_src.split('?') [1] ? '' : '?');
		if ( this._params.iframe_src.toLowerCase().indexOf('awaps') > 0
			|| this._params.awaps_native
		){
			this._params.iframe_src += "&html5ad=1";					
		}

		this._params.iframe_src+= "&" + params.getargs;		
		cswh(params.width, params.height);
	}
	
	var reportedURLs = {};
	AwHtml5.prototype.reportURL = function(url) {
        	if (!url || reportedURLs[url]) return;
	        reportedURLs[url] = true;
        	var img = new Image();
	        img.src = url;
	}

	AwHtml5.prototype.mp4Enable = function() {
		var v = document.createElement('video');		
        	return (v.canPlayType && v.canPlayType('video/mp4').replace(/no/, ''));
	};

	AwHtml5.prototype.html5Enable = function() {
		if(this._params.getargs &&  this._params.getargs.indexOf("video1=") >=0){ // HTML5 have video
			if (!this.mp4Enable()) {
			this.reportURL(this._params.stats.noVideo);
			return false;
			}

		}
        	return this._params.html5_enable && this._params.iframe_src && this.isCanvasSupported();
	};

	AwHtml5.prototype.report = function() {
		this.reportURL(this._params.pixel_stat1);
		this.reportURL(this._params.pixel_stat2);
	};

	AwHtml5.prototype.showStub = function() {
		this.reportURL(this._params.stats.imageStat);
                var inner_html_stub  = '<img class="' + this.cname + '" style="background:#fff url(' + this._params.img_src  + ') no-repeat 50% 50%;" src="https://awaps.yandex.ru/2/35823/0.gif?cache=1"' 	 + ' border=0 alt=\"' + this._params.alt + '\" >';
		
		if (!this._params.gif_tizer){
			inner_html_stub  = '<a href="' + this._params.click_url  + '" target=_blank >' + inner_html_stub  + '</a>'; 
		}

        	document.getElementById('html5_container').innerHTML = inner_html_stub;
	};

	AwHtml5.prototype.showHtml5 = function() {
        	document.getElementById('html5_container').innerHTML = templates['iframe.tpl.html'](this._params);
	};

	AwHtml5.prototype.render = function () {
        	var params = this._params;
		document.write(templates['div.tpl.html'](params));

		if (this.html5Enable()) {
			this.showHtml5();
        	}else {
			this.showStub();
		}
		this.report();
    };

    window.ya.mediaCode.AwHtml5 = AwHtml5;
}());
