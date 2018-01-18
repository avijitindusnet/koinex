;(function(W,D,$){
    'use strict';
    var bp = chrome.extension.getBackgroundPage(),
        elems = {},
        settings;

    var sendMessage = function(){
        let [mode,data={},cb=function(){}] = arguments;
        if(typeof data === 'function') cb = data;
        chrome.runtime.sendMessage({mode:mode.toUpperCase(),data:data}, cb);
        //chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
        //    console.log('Rx ',response.farewell);
        //});
    }

    var cacheSelectors = function(){
        return new Promise((resolve,reject)=>{
            elems = {
                primaryBtn : $("[data-holder='CL_PRIMARY']"),  //"ul[data-holder='CL_PRIMARY']"
                headingText : $("[data-holder='CL_HEADINGS']"),
                seconderyButton : $("[data-holder='CL_SECONDARY']"),
                currencyUnit : $("[data-holder='CL_CURRENCY_UNIT']"),
                price : $("[data-holder='CL_PRICE']"),
                otherCoins : $("[data-holder='CL_OHER_COINS']"),
                otherCoinsParent : $("[data-holder='CL_OHER_COINS_PARENT']"),
                refreshTimerText : $("[data-holder='CL_REFRESH_TIMER_TEXT']"),
                refreshTimer : $("[data-holder='CL_REFRESH_TIMER']")
            }
            if(elems) resolve();
            else reject();
        });
    }

    var displayLabels = function(){
        getSettings(response=>{
            settings = response;
            bp.console.log('Debug ',settings.REFRESH_TIMER_TEXT, settings.UPDATE_FREQ, elems.refreshTimerText, elems.refreshTimer);
            let coins = settings.COINS;
            elems.primaryBtn.html(coins[settings.COIN_IN_FOCUS]); //working here
            elems.seconderyButton.html(settings.TEXT_IN_TOGGLE);
            elems.headingText.html(settings.HEADING_TEXT);
            elems.currencyUnit.html(settings.CURRENCY_SYMBOL);
            elems.refreshTimerText.html(settings.REFRESH_TIMER_TEXT);
            elems.refreshTimer.html(settings.UPDATE_FREQ);
        });
    }

    var getSettings = function(cb){
        sendMessage('get_settings',cb);
    }

    var getRates = function () {
        bp.console.log('Data is getting refreshed');
        sendMessage('get_rates',displayPriceData);
    }

    var displayPriceData = function(data){
        elems.price.html(data.prices[settings.COIN_IN_FOCUS]);
        $('.removable').remove();
        for(let i of settings.COINS_TO_DISPLAY){
            let temp = elems.otherCoins.clone();
            temp.addClass('removable');
            temp.find('span').html(data.prices[i]);
            temp.find('em').html(settings.COINS[i]);
            temp.show();
            elems.otherCoinsParent.append(temp);
        }
        bp.console.log('debug ',data);
        bp.console.log('settings ',settings);

    }

    chrome.extension.onMessage.addListener((request, sender, respond)=>{
        let {mode:mode,data:data} = request;
        switch (mode) {
            case 'REFRESHED':
                getRates(displayPriceData);
                break;
            default:
                console.log('Handle default action FRONT ');
                break;
        }
    });

    var uiFunc = function(){
        W.addEventListener('click',function(e){
            e.stopImmediatePropagation();
            bp.console.log('debug clicked');
        });
    }


    var init = function(){
        new Promise((resolve,reject)=>{
            cacheSelectors().then(resolve);
        }).then(()=>{
            displayLabels();
            //uiFunc();
        }).then(()=>{
            getRates(displayPriceData);
        });
    }

    W.addEventListener('load',init);
})(window,document,jQuery);