/**
 * Попап с трейлером к фильму
 */
(function($){
    //var current_mess_type;
    var popupShare;

    function in_array(val, ar)
    {
        for (var k = 0; k < ar.length; k++) {
            if (ar[k] == val) {
                return true;
            }
        }

        return false;
    }

    function openMailFriend(item)
    {
        if (isGuest()) {
            $.app.notice($.app.notices.authRequired, {"action":"отправки писем"});
            return;
        }
        var html_code = '' +
            '<div class="popupShare" id="div_send_mail" ps_type="email" style="z-index:2000">' +
            '   <div class="send_alert">' +
            '      <form accept-charset="cp1251" action="">' +
            '         <a class="close" href="#" onclick="closeMailFriend(); return false"></a>' +
            '         <p>Послать ссылку на <b id="b_email">email</b> или через <b id="b_ps" class="link">персональное сообщение</b></p>' +
            '         <div class="fake_input mykp_m">' +
            '            <ul class="active_user_list"></ul>' +
            '            <img class="loader_in_fake" src="/images/loaders/f60_fff.gif" alt="" />' +
            '            <input id="ps_user_to" tabindex="1" type="text" value="e-mail друга" style="margin: 3px; width: 200px; border: none" />' +
            '            <input id="ps_user_to_id" type="hidden" value="" />' +
            '         </div>' +
            '         <div class="vbmenu_popup" id="pmrecips_menu" style="display: none; z-index: 50"></div>' +
            '         <input class="text disabled" id="user_from" type="text" value="от: '+getEmailFrom()+'" disabled="disabled" />' +
            '         <textarea cols="1" rows="1" id="mail_body">Привет!\n\nВидео к '+item.dtitle+' «'+item.rus+'» на КиноПоиске:\n'+item.this_url+'\n('+item.tname+')</textarea>' +
            '         <input class="send" type="button" value="отправить" />' +
            '         <input class="close" type="button" value="закрыть" onclick="closeMailFriend()"/>' +
            '         <span><i>*</i> КиноПоиск не сохраняет в базе данных e-mail адреса, вводимые в этом окне, и не собирается использовать их для каких-либо посторонних целей</span>' +
            '      </form>' +
            '   </div>' +
            '</div>';
        $('body').append(html_code);

        setTimeout(function(){
            popupShare = $('.popupShare');

            popupShare
                .find('.close').click(function(){
                    closeMailFriend();
                    return false;
                }).end()
                .find('#b_email').click(function(){
                    changeSendType('email');
                }).end()
                .find('#b_ps').click(function(){
                    changeSendType('ps');
                }).end()
                .find('#ps_user_to')
                    .click(function(){
                        if (this.value == 'e-mail друга' || this.value == 'никнейм друга на КиноПоиске') {
                            this.value = '';
                        }
                    })
                    .focus(function(){
                        if (this.value == 'e-mail друга' || this.value == 'никнейм друга на КиноПоиске') {
                            this.value = '';
                        }
                    })
                    .end()
                .find('.send').click(function(){
                    sendMailFriend();
                }).end()
                .find('.fake_input').click(function(){
                    $('#ps_user_to').focus();
                });

            current_mess_type = 'email';
        }, 250);
        return false;
    }

    function closeMailFriend()
    {
        if ($('.popupShare').attr('ps_type') == 'ps') {
            removePsUserTo();
        }
        $('.popupShare').remove();
    }

    function changeSendType(type)
    {
        if (current_mess_type == type) {
            return;
        }

        current_mess_type = type;

        popupShare.find('#b_email').toggleClass('link', current_mess_type == 'ps');
        popupShare.find('#b_ps').toggleClass('link', current_mess_type == 'email');

        switch (type) {
            case 'email':
                popupShare.attr('ps_type',type);
                popupShare.find('#ps_user_to').val('e-mail друга');
                popupShare.find('#user_from').val('от: '+getEmailFrom());

                popupShare.find('#ps_user_to_id').val('');
                removePsUserTo();

                if (typeof(reDrawUsers) == 'function') {
                    reDrawUsers();
                }
                break;

            case 'ps':
                popupShare.attr('ps_type',type);
                popupShare.find('#ps_user_to').val('никнейм друга на КиноПоиске');
                popupShare.find('#user_from').val('от: '+getLoginFrom());
                initPsUserTo();
                break;
        }
    }

    function sendMailFriend()
    {
        var user_to = current_mess_type == 'email' ? popupShare.find('#ps_user_to').val() : popupShare.find('#ps_user_to_id').val();
        var mail_body = popupShare.find('#mail_body').val();

        if (user_to == 'e-mail друга' || user_to == 'никнейм друга на КиноПоиске' || mail_body == '') {
            alert('Заполните все поля.');
            return false;
        }

        if (current_mess_type == 'email') {
            var mail_reg = /^[-._a-z0-9]+@[-._a-z0-9]+\.[a-z]{2,6}$/i;
            if (!mail_reg.test(user_to)) {
                return false;
            }
        }

        popupShare.find('.send').prop('disabled', true);

        var sendData = {
            user_to: user_to,
            mail_body: mail_body,
            mess_type: current_mess_type,
            level_from: 16,
            rnd: (new Date()).getTime()
        };

        $.post('/handler_send_news_to_friend.php', sendData, function(data){
            if (data == 'user not found') {
                alert('Пользователь '+user_to+' не обнаружен.');
            } else if (data == 'spam') {
                alert('Слишком много сообщений!');
            } else {
                if (current_mess_type == 'ps') {
                    alert('Сообщение отправлено.');
                } else {
                    alert('Письмо отправлено.');
                }
            }
            popupShare.find('.send').prop('disabled', false);
            closeMailFriend();
        });
    }

    function hideRightBanner()
    {
        $('#loadb_').find('div[id^="ad_ph_"]').css({'display': 'none'});
    }

    function showRightBanner()
    {
        $('#loadb_').find('div[id^="ad_ph_"]').css({'display': 'block'});
    }
})(jQuery);
