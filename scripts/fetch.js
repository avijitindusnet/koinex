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
                otherCoinsParent : $("[data-holder='CL_OHER_COINS_PARENT']")
            }
            if(elems) resolve();
            else reject();
        });
    }

    var displayLabels = function(){
        getSettings(response=>{
            settings = response;
            let coins = settings.COINS;
            elems.primaryBtn.html(coins[settings.COIN_IN_FOCUS]); //working here
            elems.seconderyButton.html(settings.TEXT_IN_TOGGLE);
            elems.headingText.html(settings.HEADING_TEXT);
            elems.currencyUnit.html(settings.CURRENCY_SYMBOL);
        });
    }

    var getSettings = function(cb){
        sendMessage('get_settings',cb);
    }

    var getRates = function () {
        sendMessage('get_rates',displayPriceData);
    }

    var displayPriceData = function(data){
        elems.price.html(data.prices[settings.COIN_IN_FOCUS]);
        for(let i of settings.COINS_TO_DISPLAY){
            let temp = elems.otherCoins.clone();
            bp.console.log('eye ',i,temp);
            temp.find('span').html(data.prices[i]);
            temp.find('em').html(settings.COINS[i]);
            temp.show();
            elems.otherCoinsParent.append(temp);
        }
        bp.console.log('debug ',data);
        bp.console.log('settings ',settings);

    }

    var uiFunc = function(){
        W.addEventListener('click',function(e){
            e.stopImmediatePropagation();
            bp.console.log('debug clicked');
        });
    }


    var init = function(){
        bp.console.log('Ready');
        //cacheSelectors().then(function(){
        //    displayLabels();
        //
        //    //getRates();
        //});
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