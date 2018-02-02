;(function(W,D,$){
    'use strict';
    console.log('Default settings ',W.defaultSettings);
    var bp = chrome.extension.getBackgroundPage(),
        elems = {},
        settings,refreshTicker;

    var sendMessage = function(){
        let [mode,data={},cb=function(){}] = arguments;
        if(typeof data === 'function') cb = data;
        chrome.runtime.sendMessage({mode:mode.toUpperCase(),data:data}, cb);
    }

    var cacheSelectors = function(){
        return new Promise((resolve,reject)=>{
            let tempElems = document.querySelectorAll('[data-holder]');
            console.groupCollapsed('Elements');
            for(let i in tempElems){
                if(tempElems[i].dataset && tempElems[i].dataset.holder){
                    let tempdata = tempElems[i].dataset.holder.toLowerCase();
                    let camelCased = tempdata.replace(/_([a-z])/g, g => g[1].toUpperCase());
                    console.log('NEW - ',camelCased);
                    elems[camelCased] = $(tempElems[i]);
                }
            }
            console.groupEnd();
            if(elems) resolve();
            else reject();
        });
    }

    var displayLabels = function(){
        getSettings(response=>{
            settings = response;
            let coins = settings.COINS;
            elems.cmPrimary.html(coins[settings.COIN_IN_FOCUS]);
            elems.cmPrimaryStats.html(coins[settings.COIN_IN_FOCUS]);
            elems.cmSecondary.html(settings.TEXT_IN_TOGGLE);
            elems.cmHeadings.html(settings.HEADING_TEXT);
            elems.cmCurrencyUnit.html(settings.CURRENCY_SYMBOL);
            elems.cmRefreshTimerText.html(settings.REFRESH_TIMER_TEXT);
            elems.cmRefreshTimer.html(settings.UPDATE_FREQ);
            populateSettingsTab();
        });
    }

    var getSettings = function(cb){
        sendMessage('get_settings',cb);
    }

    var getRates = function () {
        _log('Data is getting refreshed');
        sendMessage('get_rates',displayPriceData);
    }

    var getTimeStamp = function(){
        return Date.now();
    }

    var tickRefreshTimer = function(time){
        clearInterval(refreshTicker);
        refreshTicker = setInterval(function(){
            elems.cmRefreshTimer.html(--time);
            (time <= 0) && clearInterval(refreshTicker);
        },1000);
    }

    var displayPriceData = function(priceData){
        let {response:data, time:time} = priceData;
        elems.cmPrice.html(data.prices[settings.COIN_IN_FOCUS]);
        $('.removable').remove();
        for(let i of settings.COINS_TO_DISPLAY){
            let temp = elems. cmOherCoins.clone();
            temp.addClass('removable');
            temp.find('span').html(data.prices[i]);
            temp.find('em').html(settings.COINS[i]);
            temp.show();
            elems.cmOtherCoinsParent.append(temp);
        }
        //Stats tab
        elems.cmStatsHighestBid.html(data.stats[settings.COIN_IN_FOCUS].highest_bid);
        elems.cmStatsLastTradedPrice.html(data.stats[settings.COIN_IN_FOCUS].last_traded_price);
        elems.cmStatsLowestAsk.html(data.stats[settings.COIN_IN_FOCUS].lowest_ask);
        elems.cmStatsMax_24hrs.html(data.stats[settings.COIN_IN_FOCUS].max_24hrs);
        elems.cmStatsMin_24hrs.html(data.stats[settings.COIN_IN_FOCUS].min_24hrs);
        elems.cmStatsVol_24hrs.html(data.stats[settings.COIN_IN_FOCUS].vol_24hrs);

        let refreshCounter = settings.UPDATE_FREQ - Math.round((getTimeStamp()-time)/1000); //have to debug this line when bg process is restarted
        elems.cmRefreshTimer.html(refreshCounter);
        tickRefreshTimer(refreshCounter);
    }


    var saveUserSettings = function(){
        //read settings first
        //send them to runner
        //save them in localstorage
        //refresh current settings
        var coinInFocus = elems.cmFocusedCoin.val();
        var updateFreq = elems.cmUpdateFrequency.val();
        var coinsToWatch = $('.watched-coins:checked').val();


        _log('save user Settings ',coinInFocus, updateFreq, coinsToWatch);
    }

    var populateSettingsTab = function(){
        _log('Populate settings tab ',settings);
        for(let i in settings.COINS){
            let temp = elems. cmFocusOption.clone();
            temp.html(settings.COINS[i]);
            temp.show();
            elems.cmFocusedCoin.append(temp);
        }
    }


    chrome.extension.onMessage.addListener((request, sender, respond)=>{
        let {mode:mode,data:data} = request;
        switch (mode) {
            case 'REFRESHED':
                getRates(displayPriceData);
                break;
            default:
                console.log('Handle default action FRONT ',mode);
                break;
        }
    });

    var uiFunc = function(){
        elems.cmHeadings[0].addEventListener('click',function(e){  //prices clicked
            e.stopImmediatePropagation();
            $('.pricing-wrapper').hide(2,function(){
                elems.cmPrices.show();
            });
        });
        elems.cmSecondary[0].addEventListener('click',function(e){ //stats clicked
            e.stopImmediatePropagation();
            $('.pricing-wrapper').hide(2,function(){
                elems.cmStats.show();
            });
        });
        elems.cmSettings[0].addEventListener('click',function(e){ //settings clicked
            e.stopImmediatePropagation();
            $('.pricing-wrapper').hide(2,function(){
                elems.cmSettingsTab.show();
            });
        });
        elems.cmSaveSettings[0].addEventListener('click',function(e){ //settings clicked
            e.stopImmediatePropagation();
            saveUserSettings();
        });
        elems.cmResetSettings[0].addEventListener('click',function(e){ //settings clicked
            e.stopImmediatePropagation();
            console.log('reset');
        });
    }

    var init = function(){
        new Promise((resolve,reject)=>{
            cacheSelectors().then(resolve);
        }).then(()=>{
            displayLabels();
            uiFunc();
        }).then(()=>{
            getRates(displayPriceData);
        });
    }

    var setBrowserIcon = function(){
        chrome.browserAction.setIcon({
          imageData : {
            "48": "Icons/iconfavorite48x.png",
            "64": "Icons/iconfavorite64x.png",
            "128": "Icons/iconfavorite128x.png"
          }
        });
    }

    W.addEventListener('load',init);
})(window,document,jQuery);