function CAWBrowser(){
	var min_ff_win_flash_version = "23.0.0.205";
	var max_chrome_version = "45.0";
	var min_yabro_version = "14.0"; //15.7.2357.2415 updated fixed
	this.compare_ver = function(a, b){
		if (a === b) return 0;
		var a_comps = a.split(".");
		var b_comps = b.split(".");
		var len = Math.min(a_comps.length, b_comps.length);
		for (var i = 0; i < len; i++) {
			if (parseInt(a_comps[i]) > parseInt(b_comps[i])) return 1;
			if (parseInt(a_comps[i]) < parseInt(b_comps[i])) return -1;
		}
		if (a_comps.length > b_comps.length) return 1;
		if (a_comps.length < b_comps.length) return -1;
		return 0;
	}

	this.haveFlashVersion = function(ver){
		return this.compare_ver(this.full_version, ver) >=0;
	}

	this.haveVersion = function(cur_ver, need_ver){
		return this.compare_ver(cur_ver, need_ver) >=0;
	}

	var haveFlash = new Array();
	var i;
	for (i=6; i<35; i++ ) haveFlash[i] = false;
	var ua = navigator.userAgent;

	this.ff   = (ua.toLowerCase().indexOf('firefox') > -1);
	this.yabro = (ua.indexOf('YaBrowser') > -1);
	this.chrome = this.yabro ? 0 : (ua.indexOf('Chrome') > -1);
	this.msie = (ua && ( parseFloat( navigator.appVersion )  >=4 ) && ( ua.indexOf("Opera") < 0 ) && ( ua.indexOf( "MSIE" ) >=0) );

	this.mac = (navigator.platform && (navigator.platform.indexOf('Mac')!=-1));
	this.win = (navigator.platform && ((navigator.platform.indexOf('Windows NT')!=-1) || navigator.platform.indexOf('Win32')!=-1 || navigator.platform.indexOf('Win64')!=-1));

	this.yabro_version = "0";
	if (this.yabro){
		var ver = ua.match(/YaBrowser\/([\d.]+)/);
		if (ver && ver[1]) this.yabro_version = ver[1];	
	}

	this.chrome_version = "0";
	if (this.chrome){
		var ver = ua.match(/Chrome\/([\d.]+)/);
		if (ver && ver[1]) this.chrome_version = ver[1];	
	}

	var flash_nonie = (navigator.mimeTypes && navigator.mimeTypes["application/x-shockwave-flash"]) ? navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin : 0;

	if( flash_nonie){
		for (i=6; i<35; i++ ){ 
			haveFlash[i] = flash_nonie;
			haveFlash[i] = (parseInt(haveFlash[i].description.substring(haveFlash[i].description.indexOf(".")-2))>=i);
		}
	}else if ( this.msie && !this.mac){
		for (i=6; i<35; i++ ) 
			try{ haveFlash[i]  = new ActiveXObject("ShockwaveFlash.ShockwaveFlash." + i); }catch(e){};
	}
	
	this.flash = 0;
	for (i=6; i<35; i++ ) if (haveFlash[i]) this.flash = i;

	this.full_version = "" + this.flash;
	if( this.flash && flash_nonie && typeof(flash_nonie.version) != "undefined") this.full_version = "" + flash_nonie.version;

	if( this.win && this.ff && !this.haveFlashVersion(min_ff_win_flash_version) ) this.flash = 0;
	if( this.yabro ) this.flash = 0;
	if( this.chrome && this.haveVersion( this.chrome_version, max_chrome_version)) this.flash = 0;

}

// window.ya.mediaCode.AwFlashCode
(function() {
	window.ya = window.ya || {};
	window.ya.mediaCode = window.ya.mediaCode || {	
        	templates: {}
	};


	function AwFlashCode(params) {
        	this._params = params;
	}
	

	AwFlashCode.prototype.render = function () {
        	var params = this._params;

        	var aw_br = new CAWBrowser();
		var browser_flash_version = aw_br.flash;

		var flash_version = 14; // min default from legal
		if (typeof(params.ad_flash_version) != "undefined" ){
			flash_version = params.ad_flash_version;
		}

		var flash = (browser_flash_version >= flash_version);

	        var aw_swf_src = params.swf_src;
        	var aw_gif_src = params.gif_src;
	        var aw_gif_click = params.gif_click;
        	var aw_swf_click = params.swf_click;

		// awaps awserver native
		if(typeof(params.awaps_native) != "undefined" && params.awaps_native){
			if (aw_swf_src) aw_swf_src = aw_swf_src + '&flash=' + browser_flash_version;		
			if (aw_gif_src) aw_gif_src = aw_gif_src + '&flash=' + browser_flash_version;
			if ( typeof( aw_url_params ) != "undefined") {
				//aw_swf_click from flash vars
				aw_gif_click += "&url_params2=" + aw_url_params; 
			}	
		}
 
	        var flashvars = params.flashvars;
 
        	var alt = params.alt;
	        var aw_w = params.width
        	var aw_h = params.height 
 
	        var aw_pixel_stat1 = params.pixel_stat1;
        	var aw_pixel_stat2 = params.pixel_stat2;
 
	        var gif_tizer = params.gif_tizer;
 
        	var seed = Math.round(Math.random()*65535);
 
	        var aw_code;
 
        	if (aw_pixel_stat1){
	            var im = new Image();
        	    var pix_url = new String(aw_pixel_stat1);
	            pix_url = pix_url.replace("%aw" + "_random%", seed);
        	    im.src = pix_url;
	        }
 
        	if (aw_pixel_stat2){ 
	            var im = new Image();
        	    var pix_url = new String(aw_pixel_stat2);
	            pix_url = pix_url.replace("%aw" + "_random%", seed);
        	    im.src = pix_url;  
	        }
 

        	if (aw_w && aw_h == '0') aw_h = "100%";
	        if (aw_h && aw_w == '0') aw_w = "100%";

		if ( flash && aw_swf_src ){ 

	            if(aw_swf_click){
        	        if (aw_swf_src.indexOf('?') >=0 ){
                	    aw_swf_src += "&link1=" + escape(aw_swf_click);
	                }else{
        	            aw_swf_src += "?link1=" + escape(aw_swf_click);
                	}
	            }
 
        	    aw_code = '<object classid=clsid:D27CDB6E-AE6D-11cf-96B8-444553540000 codebase=http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0 width=' + aw_w + ' height=' + aw_h + ' >'   
	                + '<param name="allowScriptAccess" value="never" ><param name=movie value="'+ aw_swf_src +'" ><param name=menu value=false><param name=quality value=high><param name=wmode value=opaque>' 
        	        + '<param name="flashvars" value="'+ flashvars + '" >'
                	+ '<EM' + 'BED src="' + aw_swf_src + '"  flashvars="' + flashvars + '" quality=high '
	                + ' allowScriptAccess=never wmode=opaque menu=false swLiveConnect=FALSE WIDTH='+ aw_w +' HEIGHT=' + aw_h 
        	        + ' TYPE="application/x-shockwave-flash" PLUGINSPAGE="http://www.macromedia.com/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash">'
	                + '</EMBED>'
        	        + ' </object>';        
	        }else{ 
 
        	    aw_code = '<img style="background:#fff url(' + aw_gif_src + ') no-repeat 50% 50%;" src="https://awaps.yandex.ru/2/35823/0.gif?cache=1" width="' + aw_w + '" height="' + aw_h + '" border=0 alt=\"' + alt + '\" >';
 
	            if (!gif_tizer) aw_code = '<a href="' + aw_gif_click  + '" target=_blank >' + aw_code + '</a>'; 
	        }

		document.write( aw_code );	
	}
    window.ya.mediaCode.AwFlashCode = AwFlashCode;
}());
