LockTimer = false;
LockTimeOut = false;
var FolderSelectTitles = new Array();
var Objects = new Array();
var result = {};
var ObjType = null;
var settings = new Array();
var FirstTime = new Array();
var StaticInited = false;
var DeleteFolders = null;
var ReCountFolders = false;
var FolderReferer = false;
var ShortTemplate = false;
var SelType= '#';

settings['film'] = new Array();
settings['film']['handler'] = 'mustsee';
settings['film']['name'] = 'film';
settings['film']['id_name'] = 'id_film';
settings['film']['liid'] = 'film_';
settings['film']['id_names'] = 'id_films';
settings['film']['rus'] = 'Мои фильмы';

settings['stars'] = new Array();
settings['stars']['handler'] = 'stars';
settings['stars']['name'] = 'actor';
settings['stars']['liid'] = 'people_';
settings['stars']['id_name'] = 'id_actor';
settings['stars']['id_names'] = 'id_actors';
settings['stars']['rus'] = 'Мои звезды';

var noHTMLchange = false;
var HOST = '';

function MyMoviesInit(callback) {
    // если на странице объекты обоих типов - callback запустится 2 раза
    Objects = [];
    // несколько объектов на странице, например, лвл 78 "Мои фильмы"
    $('.MyKP_Folder_Select:not(.already_inited)').each(function(){
        MyMoviesInitOne($(this), callback);
    });

    // один объект на странице, например, лвл 1 или 4
    $('.MyKP_Folder_Select_Single').each(function(){
        var id = $(this).attr('id').replace('MyKP_Folder_', '');
        Objects[Objects.length] = id;
		if($(this).attr('type')){
			ObjType = $(this).attr('type'); // film | stars
		} else{
			ObjType = $(this).attr('data'); // film | stars
        }
        clearTimeout(LockTimeOut);
        var mode = $(this).attr('data-tmpl');
        LockTimeOut = setTimeout(function(){
            InitFoldersData( mode ? mode : 'single', callback);
        }, 200);
    });
}

function MyMoviesInitOne(obj, callback)
{
    obj.addClass('already_inited');

    if (obj.hasClass('recountfolders')) {
        ReCountFolders = true;
    }
    if (obj.hasClass('shortselect')) {
        ShortTemplate = true;
    }

    if (obj.hasClass('FolderReferer')) {
        FolderReferer = obj.attr('alt');
    }

    obj.attr({'alt': ''});

    var id = '';
    if (obj.attr('id')) {
        id = obj.attr('id').replace('MyKP_Folder_', '');
        SelType = '#';
    } else {
        id = obj.attr('objId');
        SelType = '.';
    }
	if(obj.attr('type')){
		ObjType = obj.attr('type'); // film | stars
	} else{
		ObjType = obj.attr('data'); // film | stars
	}

    Objects[Objects.length] = id;
    clearTimeout(LockTimeOut);
    LockTimeOut = setTimeout(function(){
        InitFoldersData('multiple', callback);
    }, 200);
}

$(function(){
    if (!StaticInited) {
        $(MyMoviesInit);
    }
});

function FavFolderClick(id)
{
    $('.button_' + id).addClass('loading');
    if (typeof(FirstTime[id_film]) == "undefined") {
        ClickFolders($('#select_'+id_film+' span.title'), true);
    }
    setTimeout(function(){
        $('dl.list dd[value="'+id+'"]').click();
    }, 500);
}

function FetchData(data, mode, callback) {
	result = data;

    for (var obj_n in Objects) {
        var html = '';
        var obj_id = Objects[obj_n];

        if(obj_id == 0) {
            var f = $(SelType+'MyKP_Folder_'+obj_id).attr("data-selected").split(";");
            if(result && result.objFolders) {
                if(result.objFolders[obj_id])
                    result.objFolders[obj_id] = null;
                for(var i in f) {
                    if(!result.objFolders[obj_id])
                        result.objFolders[obj_id] = null;
                    if(f[i]){
                        if(!result.objFolders[obj_id]) {
                            result.objFolders[obj_id] = {};
                        }
                        result.objFolders[obj_id][f[i]] = f[i];
                    }
                }

            }

        }
        if (ShortTemplate && result.objFolders && result.objFolders[obj_id] && result.objFolders[obj_id] != {}) {
            $(SelType+'MyKP_Folder_'+obj_id).addClass('MyKP_Folder_Select_added');
        }

        if(StaticInited) {
            continue;
        }

        var name = $(SelType+'MyKP_Folder_'+obj_id).attr('name');
        if (!name) {
            name = 'Мои фильмы';
        }

        FolderSelectTitles[obj_id] = name;

        if (mode == 'single') {
            var ac = result.objFolders&&result.objFolders[obj_id] ? ' block_added' : '';

            html += '<div class="block_add'+ac+'">'+
               '<div class="status"></div>'+
               (ObjType == 'film' ? '<div class="info"><a href="#" onclick="help_my_movies(); return false"></a></div>' : '')+
               '<span class="header">Добавить в</span>';
        }

        // тут папки
        var fol_num = '';
        if (!ShortTemplate && result.objFolders&&result.objFolders[obj_id]) {
            var fol_num = 0;
            for (var a in result.objFolders[obj_id]) {
                fol_num++;
            }
        }

        if (mode == 'extended') {
            html += '<div class="block_add extended">';

            var first_folder = false;
            for (var folder_id in result.folders) {
                if (first_folder) break;
                if (ObjType == 'film' && result.folders[folder_id].id == 142498) continue;
                if (ObjType == 'stars' && result.folders[folder_id].id == 67338) continue;

                first_folder = result.folders[folder_id];
                var cl=' button_'+result.folders[folder_id].id;
                if(result.objFolders&&result.objFolders[obj_id]&&result.objFolders[obj_id][result.folders[folder_id].id]) cl+=' active';
            }
            //if(first_folder.name.length > 15)
            //    first_folder.name = first_folder.name.substr(0,15);
              html += '<div class="select" id="select_'+obj_id+'">'+
                '<span title="добавить в '+settings[ObjType]['rus'] +'" class="button '+cl+'"  onclick="FavFolderClick('+first_folder.id+')"><div class="icon" title="добавить в '+settings[ObjType]['rus'] +'"></div><b>'+first_folder.name+'</b></span><span class="js-user-film-list-toggler title '+cl+' no_text" onclick="ClickFolders(this)"><div class="icon"></div></span>'+
                '<div class="list_div"></div></div>';

        } else {
            html += '<div class="select" id="select_'+obj_id+'">'+
                '<span title="добавить в '+settings[ObjType]['rus'] +'" class="title" onclick="ClickFolders(this)">'+FolderSelectTitles[obj_id]+' <b>'+(fol_num > 0 ? "("+fol_num+")" : '')+'</b></span>'+
                '<div class="list_div"></div></div>';
        }



        if (mode == 'single') {
            html_f=new Array();
            for(var folder_id in result.folders)
            {
                if(result.objFolders&&result.objFolders[obj_id]&&result.objFolders[obj_id][result.folders[folder_id].id]) var cl='';
                else  var cl='class="noact_s"';

                if(ObjType=='stars')
                    html_f[html_f.length] = '<li '+cl+' id="ms_folder_'+result.folders[folder_id].id+'"><a href="/level/78/stars/list/type/'+result.folders[folder_id].id+'/people/'+obj_id+'/">'+result.folders[folder_id].name+'</a><s>,</s></li>';
                if(ObjType=='film')
                    html_f[html_f.length] = '<li '+cl+' id="ms_folder_'+result.folders[folder_id].id+'"><a href="/level/78/movies/list/type/'+result.folders[folder_id].id+'/film/'+obj_id+'/">'+result.folders[folder_id].name+'</a><s>,</s></li>';
            }
            var li=html_f.join(" ");

            html+='<ul class="folders" '+(li ? 'style="display:block"' : '')+'>'+li+'</ul>';
            if(result.all_view)    html+='<div class="all"><a href="'+result.all_view+'">все папки ('+result.count_folders+')</a></div>';
            html+='</div>';
        }

        if (mode == 'extended') {
            html_f=new Array();
            for(var folder_id in result.folders)
            {
                if(result.objFolders&&result.objFolders[obj_id]&&result.objFolders[obj_id][result.folders[folder_id].id]) var cl='';
                else  var cl='class="noact_s"';

                if(ObjType=='stars')
                    html_f[html_f.length] = '<li '+cl+' id="ms_folder_'+result.folders[folder_id].id+'"><a href="/level/78/stars/list/type/'+result.folders[folder_id].id+'/people/'+obj_id+'/">'+result.folders[folder_id].name+'</a><s>,</s></li>';
                if(ObjType=='film')
                    html_f[html_f.length] = '<li '+cl+' id="ms_folder_'+result.folders[folder_id].id+'"><a href="/level/78/movies/list/type/'+result.folders[folder_id].id+'/film/'+obj_id+'/">'+result.folders[folder_id].name+'</a><s>,</s></li>';

                // кнопка-вотчлист
                if (ObjType=='film' && result.folders[folder_id].id == 3575 && !cl) {
                    var new_title = $('.addFolder').hasClass('active') ? 'Буду смотреть' : 'Не буду смотреть';
                    $('.addFolder').addClass('active').attr({'title': new_title});
                }

            }
            var li=html_f.join(" ");

            html+='<ul class="folders">'+li+'</ul>';
            if(result.all_view)    html+='<div class="allFolders"><div class="dot"></div><div class="text"><a href="'+result.all_view+'">все папки</a> ('+result.count_folders+')</div><div class="info" onclick="help_my_movies(); return false"></div></div>';
        }

        if(ShortTemplate && obj_id!=0) html+="<div class='MyKP_Folder_Select_dot'></div>";
        if(!noHTMLchange) $(SelType+'MyKP_Folder_'+obj_id).html(html);

        if(typeof(jsTestAddEvent) == "function")
        jsTestAddEvent("folders_inited");
        //$(SelType+'MyKP_Folder_'+obj_id+' .select .title, .select dd:not(.list_div)').click();
    }
    if(mode != 'multiple'){
        RefreshComma();
    }
    if (typeof callback == 'function') {
        callback();
    }
}

function InitFoldersData(mode, callback)
{
	if(typeof(myMoviesData)!='undefined') {
		FetchData(myMoviesData, mode, callback);
	} else {
		if (Objects.length == 0) {
			return;
		}

        //handler_mustsee_ajax.php
        //handler_stars_ajax.php
		var req_url = HOST
			+ '/handler_'+settings[ObjType]['handler']+'_ajax.php' // mustsee | stars
			+ '?mode='+ (mode == "multiple" ? "multiple" : "single") // single | multiple
			+ '&rnd='+Math.round(Math.random()*100000000);

		var req = {};
		req[settings[ObjType]['id_names']]=Objects.join(',');
		$.post(req_url, req,function(res){
			FetchData(res, mode, callback)
		},"json");
	}
}


function RefreshComma(){
    setTimeout(function(){
        $('.block_add .folders li s').css({"display":"none"});
        setTimeout(function(){$('.block_add .folders li:not(.noact_s) s').show();
            setTimeout(function(){
                $('.block_add .folders li:not(.noact_s)').filter(':last').find('s').css({"display":"none"});
                if($('.block_add .folders li:not(.noact_s)').length) {
                    $('.block_add .folders').fadeIn();
                } else {
                    $('.block_add .folders').fadeOut();
                }
            },0);
        },0);
    },100);
}

function ClickFolders(event_obj, hide_init)
{
    if (typeof(hide_init) == 'undefined') {
        hide_init = false;
    }
    var selid = $(event_obj).parents('.select').attr('id');
    HideItemsOnDelete();

    if (selid && selid.indexOf('select_') > -1) {
        $('.list_div').css({"display":"none"});
        var id=selid.replace('select_', '');
        obj = $("#select_"+id+" .list_div");

        if (typeof(FirstTime[id])=="undefined") {
            InitFolders(id);
            InitFoldersMoves(id);
            FirstTime[id]=true;
        }

        if (hide_init) {
            return;
        }

        LockTimer=true;
        clearTimeout(LockTimeOut);
        LockTimeOut=setTimeout(function(){ LockTimer=false; },100);
        $(event_obj).parents('#select_'+id).find(".list_div").css({"display":"block"});
    }
}

function InitFolders(obj_id)
{
    var list_adds=false,list_title_adds=false,arrow_adds=false;

    var fol_num=0;
    for (var a in result.objFolders[obj_id]) {fol_num++;}

    var total_fol_num=0;
    for (var a in result.folders) {total_fol_num++;}

    if(total_fol_num>15)
    {
        var list_adds="style='width: 177px; height: 302px; overflow-y: scroll; overflow-x: hidden; border-right:solid 1px #999;'";
        var list_title_adds="style='width: 171px; background-position: -216px -128px'";
    }

    html='<div class="list_title" '+list_title_adds+'>'+FolderSelectTitles[obj_id]+' <b>'+(fol_num>0?"("+fol_num+")":"")+'</b></div>';

    html+='<dl class="list" '+list_adds+'>';
    for (var folder_id in result.folders) {
        var cl = '';
        if (result.objFolders && result.objFolders[obj_id] && result.objFolders[obj_id][result.folders[folder_id].id]) {
            cl = 'slc';
        // "Примечания"
        } else if (
            ObjType == 'film' && result.folders[folder_id].id == 142498 ||
            ObjType == 'stars' && result.folders[folder_id].id == 67338
        ) {
            continue;
        }

        if (ObjType == 'stars') {
            html += ''+
                '<dd class="'+cl+' '+result.folders[folder_id].icon+(result.folders[folder_id].id == 745 ? ' fav' : '')+(result.folders[folder_id].id == 745 && result.folders[folder_id].icon == 'private-folder' ? ' favGray' : '')+'" value="'+result.folders[folder_id].id+'">'+
                    '<s></s> '+
                    result.folders[folder_id].name+
                    '<a class="arrow" '+arrow_adds+' href="/level/78/stars/list/type/'+result.folders[folder_id].id+'/people/'+obj_id+'/"></a>'+
                '</dd>';
        }

        if (ObjType == 'film') {
            html += ''+
                '<dd class="'+cl+' '+result.folders[folder_id].icon+(result.folders[folder_id].id == 6 ? ' fav' : '')+(result.folders[folder_id].id == 6 && result.folders[folder_id].icon == 'private-folder' ? ' favGray' : '')+'" value="'+result.folders[folder_id].id+'">'+
                    '<s></s> '+
                    result.folders[folder_id].name+
                    '<a class="arrow" '+arrow_adds+' href="/level/78/movies/list/type/'+result.folders[folder_id].id+'/film/'+obj_id+'/"></a>'+
                '</dd>';
        }
    }
    html+='</dl>';

    if(!noHTMLchange)
        $(SelType+'MyKP_Folder_'+obj_id+' .list_div').html(html);
}

function InitFoldersMoves(object_id)
{
    $(SelType+'MyKP_Folder_'+object_id+' .list dd').mouseover(function(){
        $(SelType+'MyKP_Folder_'+object_id+' .list dd.act_slc').removeClass('act_slc').addClass('slc');
        if($(this).hasClass('slc')){
            $(this).addClass('act_slc');
            $(this).removeClass('slc')
        }
        else
            $(this).addClass('act');
    });

    $(SelType+'MyKP_Folder_'+object_id+' .list dd').mouseout(function(){
        if($(this).hasClass('act_slc')){
            $(this).addClass('slc');
            $(this).removeClass('act');
            $(this).removeClass('act_slc');
            }
        else
            $(this).removeClass('act');
    });

    if(object_id > 0){
        $(SelType+'MyKP_Folder_'+object_id+' .select dd').click(function(){
            LockTimer = true;
            clearTimeout(LockTimeOut);
            LockTimeOut = setTimeout(function(){
                LockTimer = false;
            }, 500);
            $('.list_title').append("<span class='list_title_loading'></span>");
            var value = $(this).attr('value');
            var obj = this;
            var obj_group =  $(SelType+'MyKP_Folder_'+object_id+' .select dd[value="'+value+'"]');
            obj_id = object_id;

            if (value == 6 && $('#star_fav_film').css('display') == 'none') {
                $('#btn_fav_film, #star_fav_film').toggle();
            }

            if ($(obj).hasClass('act_slc') || $(obj).hasClass('slc')) {
                // "Примечания"
                if (ObjType == 'film' && value == 142498 && !confirm('При удалении фильма из этой папки на его странице будет удалено примечание.')) {
                    return;
                }
                if (ObjType == 'stars' && value == 67338 && !confirm('При удалении человека из этой папки на его странице будет удалено примечание.')) {
                    return;
                }

                // удаление
                $.getJSON(HOST+'/handler_'+settings[ObjType]['handler']+'_ajax.php?mode=del_'+settings[ObjType]['name']+'&'+settings[ObjType]['id_name']+'='+obj_id+(ReCountFolders?"&recount=1":"")+'&rnd='+Math.round(Math.random()*100000000)+'&from_folder='+value,function(res){
                    $('.button_' + value).removeClass('loading');
                    $('.list_title_loading').remove();
                    // кнопка-сердечко "Любимый фильм"
                    if (value == 6) {
                        $('#btn_fav_film, #star_fav_film').toggle();

                        var new_title = $('#btn_fav_film').hasClass('el_1_act') ? 'Добавить в любимые фильмы' : 'Удалить из любимых фильмов';
                        $('#btn_fav_film').toggleClass('el_1_act').attr({'title': new_title});

                        $('li.el_1 .link').removeClass('link').addClass('linkOff');

                        // уменьшаем число лайков на 1
                        var likes = $('li.el_1 .num').text();
                        likes = likes ? parseInt(likes) - 1 : 0;
                        $('li.el_1 .num').text(likes ? likes : '');
                    }

                    // кнопка-вотчлист
                    if (value == 3575) {
                        var new_title = $('.addFolder').hasClass('active') ? 'Буду смотреть' : 'Не буду смотреть';
                        $('.addFolder').removeClass('active').attr({'title': new_title});
                    }

                    obj_group.removeClass('act_slc');
                    obj_group.removeClass('slc');
                    $('#ms_folder_'+value).addClass('noact_s');
                    if (FolderReferer && value == FolderReferer) {
                        DeleteFolders='#'+settings[ObjType]['liid']+obj_id;
                    }

                    var l=$(obj).parents('.select').find('.slc,.act_slc').length;
                    var a='';
                    if(l>0) a=' <b>('+l+')</b>';
                    else
                        if(ShortTemplate) $(SelType+'MyKP_Folder_'+obj_id).removeClass('MyKP_Folder_Select_added');

                    obj_group.parents('.select').find('.title:not(.no_text)').html(FolderSelectTitles[obj_id]+a);
                    obj_group.parents('.select').find('.list_title').html(FolderSelectTitles[obj_id]+a);

                    if(res.count_folders&&res.all_view)
                        $(".block_add .all").html('<a href="'+res.all_view+'">все папки ('+res.count_folders+')</a>');
                    else $(".block_add .all").html('');

                    if(res.count_folders&&res.all_view)
                        $(".allFolders .text").html('<a href="'+res.all_view+'">все папки</a> ('+res.count_folders+')');
                    else $(".allFolders .text").html('');

                    $('.button_' + value).removeClass('active');
                    if(res.recount)
                        $('li#folder_'+value+' b').html(res.recount);

                    // "Примечания"
                    if (ObjType == 'film' && value == 142498 ||
                        ObjType == 'stars' && value == 67338
                    ) {
                        $(obj).remove();
                        $('#ta_'+(ObjType == 'stars' ? 'actor' : ObjType)+'_notice textarea').val('');
                        $('#txt_'+(ObjType == 'stars' ? 'actor' : ObjType)+'_notice').hide();
                        $('#btn_film_notice').removeClass('el_3_act');
                    }

                    RefreshComma();
                }).fail(function (xhr, status, error) {
                    return $.app.onHandlerXhrFail(xhr, status, error, function () {
                        $('#btn_fav_film').show();
                        $('#star_fav_film').hide();
                        $('.button_' + value).removeClass('loading');
                    });
                });
            } else {
                // добавление
                //handler_mustsee_ajax.php
                $.app.authorityAction('FOLDER');

                $.getJSON(HOST+'/handler_'+settings[ObjType]['handler']+'_ajax.php?mode=add_'+settings[ObjType]['name']+'&'+settings[ObjType]['id_name']+'='+obj_id+(ReCountFolders?"&recount=1":"")+'&rnd='+Math.round(Math.random()*100000000)+'&to_folder='+value,function(res){
                    $('.button_' + value).removeClass('loading');
                    $('.list_title_loading').remove();
                    if (value == 6) {
                        $('#btn_fav_film, #star_fav_film').toggle();
                    }
                    if (res && res.result=='ok') {
                        // кнопка-сердечко "Любимый фильм"
                        if (value == 6) {
                            var new_title = $('#btn_fav_film').hasClass('el_1_act') ? 'Добавить в любимые фильмы' : 'Удалить из любимых фильмов';
                            $('#btn_fav_film').toggleClass('el_1_act').attr({'title': new_title});

                            // перенесено в класс profile и не нуждается в отдельном вызове #6064: api: iphone - при занесении в любимые удалять из папок с автоочисткой
                            // если он любимый, то точно был просмотрен
                            if (!$('#btn_null_vote').hasClass('el_2_act')) {
                              //  $('#btn_null_vote').click();
                              $('#btn_null_vote')
                                .toggleClass('el_2_act')
                                .attr('title', $('#btn_null_vote').hasClass('el_2_act') ? 'Убрать отметку о просмотре' : 'Пометить фильм как просмотренный');
                            }

                            // теперь точно доступна ссылка на МоиЛюбимые фильмы
                            $('li.el_1 .linkOff').removeClass('linkOff').addClass('link');

                            // увеличиваем число лайков на 1
                            var likes = $('li.el_1 .num').text();
                            likes = likes ? parseInt(likes) + 1 : 1;
                            $('li.el_1 .num').text(likes);
                        }

                        // кнопка-вотчлист
                        if (value == 3575) {
                            var new_title = $('.addFolder').hasClass('active') ? 'Буду смотреть' : 'Не буду смотреть';
                            $('.addFolder').addClass('active').attr({'title': new_title});
                            if(typeof(getObjTitle) == 'function' && getObjTitle()) {
                                var objTitle = getObjTitle(true);
                                objTitle = objTitle[0].toUpperCase() + objTitle.substr(1);
                                window.notice(objTitle + " добавлен в папку &laquo;<a href='/level/78/movies/list/type/3575/'>Буду смотреть</a>&raquo;.");
                            }
                        }

                        obj_group.addClass('act_slc');
                        $('#ms_folder_'+value).parents('.block_add').addClass('block_added');
                        if(ShortTemplate) $(SelType+'MyKP_Folder_'+obj_id).addClass('MyKP_Folder_Select_added');

                        $('#ms_folder_'+value).removeClass('noact_s');

                        var l=$(obj).parents('.select').find('.slc,.act_slc').length;
                        var a='';
                        if(l>0) {a=' <b>('+l+')</b>';}
                        obj_group.parents('.select').find('.title:not(.no_text)').html(FolderSelectTitles[obj_id]+a);
                        obj_group.parents('.select').find('.list_title').html(FolderSelectTitles[obj_id]+a);

                        if(res.count_folders&&res.all_view)
                            $(".block_add .all").html('<a href="'+res.all_view+'">все папки ('+res.count_folders+')</a>');
                        else $(".block_add .all").html('');


                        if(res.count_folders&&res.all_view)
                            $(".allFolders .text").html('<a href="'+res.all_view+'">все папки</a> ('+res.count_folders+')');
                        else $(".allFolders .text").html('');

                        $('.button_' + value).addClass('active');
                        if(res.recount)
                            $('li#folder_'+value+' b').html(res.recount);
                        RefreshComma();
                    } else {
                        if (res && res.result == 'impossible') {
                            alert("Вы добавляете фильм в папку, в которой не могут находиться оцененные или просмотренные фильмы.<br /> Свойства папки можно изменить в разделе <a href='/level/78/movies/list/type/"+value+"/' class='all'>Мой КиноПоиск</a>.");
                        } else if (res && res.result == 'FILM_CANT_SET_LIKED') {
                            alert('Фильм ещё не вышел в прокат.');
                        } else if (res && res.result == 'FOLDER_NOT_FOUND') {
                            alert('Папка не существует. Сначала создайте её в разделе <a href="/level/78/movies/" class="all">Мой КиноПоиск</a>.');
                        } else {
                            $.app.notice($.app.notices.authRequired, {'action':"использования сервиса &laquo;"+settings[ObjType]['rus']+"&raquo;"});
                        }
                    }
                }).fail(function (xhr, status, error) {
                    return $.app.onHandlerXhrFail(xhr, status, error, function () {
                        $('#btn_fav_film').show();
                        $('#star_fav_film').hide();
                        $('.button_' + value).removeClass('loading');
                    });
                });
            }
        });
    } else {
        // простой выбор папки, без фильма
        $(SelType+'MyKP_Folder_'+object_id+' .select dd').click(function(){
            MyMoviesClickFolder(this, SelType, object_id);
            if(KP.navigator && KP.navigator.update) {
                KP.navigator.update()
            }
        });
    }


    $(SelType+'MyKP_Folder_'+object_id+' .select .list_title').click(function(){
        var selid=$(this).parents('.select').attr('id');
        if(selid&&selid.indexOf('select_')>-1) {
            var id=selid.replace('select_','');
            $("#select_"+id+" .list_div").hide("fast").css({"display":"none"});
            HideItemsOnDelete();
            clearTimeout(LockTimeOut);
        }
    });

    $(SelType+'MyKP_Folder_'+object_id+' .select dd a').click(function(){
        top.location=this.href;
        return false;
    });

    $('body').click(function(){
        if(!LockTimer){
            $(".list_div").hide('fast').css({"display":"none"});
            HideItemsOnDelete();
        }
    });
}

function MyMoviesClickFolder(obj, SelType, object_id, no_hover) {
    LockTimer = true;
    clearTimeout(LockTimeOut);
    LockTimeOut = setTimeout(function(){
        LockTimer = false;
    }, 500);

    var value = $(obj).attr('value');
    var obj_group =  $(SelType+'MyKP_Folder_'+object_id+' .select dd[value="'+value+'"]');
    obj_id = object_id;

    if ($(obj).hasClass('act_slc') || $(obj).hasClass('slc')) {
        // удаление
        $('.button_' + value).removeClass('loading');
        $('.list_title_loading').remove();
        obj_group.removeClass('act_slc');
        obj_group.removeClass('slc');


        var l=$(obj).parents('.select').find('.slc,.act_slc').length;

        var a='';
        if(l>0) a=' <b>('+l+')</b>';
        else
            if(ShortTemplate) $(SelType+'MyKP_Folder_'+obj_id).removeClass('MyKP_Folder_Select_added');

        obj_group.parents('.select').find('.title:not(.no_text)').html(FolderSelectTitles[obj_id]+a);
        obj_group.parents('.select').find('.list_title').html(FolderSelectTitles[obj_id]+a);

    } else {
        // добавление
        $('.button_' + value).removeClass('loading');
        if (no_hover) {
            obj_group.addClass('slc');
        } else {
            obj_group.addClass('act_slc');
        }
        $('.list_title_loading').remove();

        $(SelType+'MyKP_Folder_'+obj_id).addClass('MyKP_Folder_Select_added');

        var l=$(obj).parents('.select').find('.slc,.act_slc').length;
        var a='';
        if(l>0) {a=' <b>('+l+')</b>';}
        obj_group.parents('.select').find('.title:not(.no_text)').html(FolderSelectTitles[obj_id]+a);
        obj_group.parents('.select').find('.list_title').html(FolderSelectTitles[obj_id]+a);
    }

    var selectedF = "";
    $(SelType+'MyKP_Folder_'+object_id+'').attr("data-selected", selectedF);
    $(SelType+'MyKP_Folder_'+object_id+'').find('.slc,.act_slc').each(function(){
        selectedF+=$(this).attr("value") + ";";
        $(SelType+'MyKP_Folder_'+object_id+'').attr("data-selected", selectedF);
    });

    if($(obj).parents('.select').find('.slc,.act_slc').length)
        $('#exclude_folders_check').prop('checked',true);
    else
        $('#exclude_folders_check').prop('checked',false);

    // $(SelType+'MyKP_Folder_'+obj_id).data("selected");
}

function DelMyFolderItem(type, obj_id, id_folder, force)
{
    // "Примечания"
    if (!force) {
        if (type == 'film' && id_folder == 142498 && !confirm('При удалении фильма из этой папки на его странице будет удалено примечание.')) {
            return;
        }
        if (type == 'stars' && id_folder == 67338 && !confirm('При удалении человека из этой папки на его странице будет удалено примечание.')) {
            return;
        }
    }

    var url = HOST +
        '/handler_'+settings[type]['handler']+'_ajax.php?'+
        'mode=del_'+settings[type]['name']+'&'+
        settings[type]['id_name']+'='+obj_id+'&recount=1&'+
        'rnd='+Math.round(Math.random()*100000000)+'&'+
        'from_folder='+id_folder;

    $.getJSON(url, function(res){
        if (res.recount) {
            $('li#folder_'+id_folder+' b').html(res.recount);
        }

        $('#'+settings[type]['liid']+obj_id).animate({'opacity': 0}, 400, function(){
            $(this).hide(0, function(){
                if (!$('#itemList').find('li:visible').length) {
                    window.location.reload();
                    return;
                }
                InitFlap();
            });
        });
    }).fail(function (xhr, status, error) {
        return $.app.onHandlerXhrFail(xhr, status, error);
    });
}

function HideItemsOnDelete()
{
    if (DeleteFolders) {
        $(DeleteFolders).fadeOut();
        DeleteFolders = null;
    }

    InitFlap();
}
