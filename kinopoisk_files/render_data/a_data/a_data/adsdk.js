/// Yandex Ads SDK ///
function getUrlParam (name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	results = regex.exec(location.search);
	return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

//  CYandexHTML5BannerApi 
function CYandexHTML5BannerApi(){
	this.info_video_stats = new Array();

	this.getUrlParam = function (name) {
		name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		results = regex.exec(location.search);
		return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}

	this.getClickURLNum = function (number) { //1, 2, etc
		var name = "link" + number;
		return this.getUrlParam (name);
	}

	this.getVideoURLNum = function (number) { //1, 2, etc
		var name = "video" + number;
		return this.getUrlParam (name);
	}


	this.reportVideoStart = function(video_num){
		if (!video_num) video_num = 1;
		var link1 = this.getUrlParam('link1'); 
		var event_num = 50 + video_num;
		var event_url = link1 + "&send_gifpixel=1&as_event=" + event_num;
		this.info_video_stats[video_num] = new Image()
		this.info_video_stats[video_num].src = event_url;
	}

}

var yandexHTML5BannerApi = new CYandexHTML5BannerApi();
//  END CYandexHTML5BannerApi 


// Mobile CHomeExpandableMobileBannerAPI
function CHomeExpandableMobileBannerAPI(){
	var origin = null; 
	this.sendCommand = function (command) {
	        if (!this.origin) {
        	    return;
	        }
	        top.postMessage(JSON.stringify({
        	    command: command
        	}), this.origin);
	}
	this.init = function(){
		this.origin = yandexHTML5BannerApi.getUrlParam('origin');
	}
        this.close = function () {
	    this.init();
            this.sendCommand('close');
        }

	this.getUrlParam = function (name) {
		name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		results = regex.exec(location.search);
		return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}

	this.getClickURLNum = function (click_number) { //1, 2, etc
		var name = "link" + click_number;
		return this.getUrlParam (name);
	}

        this.click_and_close = function (click_number) {
	    this.init();	    
	    window.open(this.getClickURLNum(click_number),'_blank');
            this.sendCommand('close');
	    return;	    
        }

};

var homeExpandableMobileBannerAPI = new CHomeExpandableMobileBannerAPI(); 
// End CHomeExpandableMobileBannerAPI


// Desktop CHomeExpandableDesktopBannerAPI
function CHomeExpandableDesktopBannerAPI(){
	var origin = null; 
	this.sendCommand = function (command) {
	        if (!this.origin) {
        	    return;
	        }
	        top.postMessage(JSON.stringify({
        	    command: command
        	}), this.origin);
	}
	this.init = function(){
		this.origin = yandexHTML5BannerApi.getUrlParam('origin');
	}
        this.close = function () {
	    this.init();
            this.sendCommand('close');
        }

	this.getUrlParam = function (name) {
		name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		results = regex.exec(location.search);
		return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}

	this.getClickURLNum = function (click_number) { //1, 2, etc
		var name = "link" + click_number;
		return this.getUrlParam (name);
	}
	
	this.click_and_close = function (click_number) { //1, 2, etc
		this.init();
	    	window.open(this.getClickURLNum(click_number),'_blank');
            	this.sendCommand('close');
	    	return;	    
	}
};

var homeExpandableDesktopBannerAPI = new CHomeExpandableDesktopBannerAPI(); 
// End CHomeExpandableDesktopBannerAPI


//  CYandexInbannerVideoEventApi
function CYandexInbannerVideoEventApi(){
//	this.report(event_name, ) 	report("VideoStart");
	this.info_video_stats = new Array();

	this.reportVideoStart = function(video_num){
		if (!video_num) video_num = 1;
		var link1 = yandexHTML5BannerApi.getUrlParam('link1');
		var event_num = 50 + video_num;
		var event_url = link1 + "&send_gifpixel=1&as_event=" + event_num;
		this.info_video_stats[video_num] = new Image()
		this.info_video_stats[video_num].src = event_url;
	}
};

var yandexInbannerVideoEventApi  = new CYandexInbannerVideoEventApi(); 
// End CYandexInbannerVideoEventApi
