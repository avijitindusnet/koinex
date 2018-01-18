;(function(){
    'use strict';
    var coins = {
            BCH   : 'Bitcoin Cash (BCH)',
            BTC   : 'Bitcoin (BTC)',
            ETH   : 'Ethereum (ETH)',
            GNT   : 'Golem (GNT)',
            LTC   : 'Litecoin (LTC)',
          MIOTA   : 'IOTA (MIOTA)',
            OMG   : 'OmiseGO (OMG)',
            XRP   : 'Ripple (XRP)'
    };

    var defaultSettings = {
        COIN_IN_FOCUS : 'XRP',
        UPDATE_FREQ : 60,  //in seconds
        DESKTOP_NOTIFICATION : true,
        NOTIFICATION_TYPE : 'PERIODIC', // periodic or conditional(like when above or below specific rate)
        NOTIFICATION_FREQ : 300, // in seconds
        DISPLAY_MINMAXRATES : true
    };

    var setStorageItem = function(key, value) {
        _warn('Set Storage Item ', key);
        var webStorageType = 'localStorage';
        var key = key.trim(),
            value = $.Base64.encode(JSON.stringify(value)) || '';

        if (checkBrowserStorage(webStorageType)) localStorage.setItem(key, value);
        else _error('Failed to store values');
    },

    var retrieveStorageItem = function(key) {
        if (key != '') {
            var value = localStorage.getItem(key);
            if (value) return JSON.parse($.Base64.decode(value));
        }
        return {};
    }

    var removeStorageItem = function(key) {
        _warn('Remove Storage Item ', key);
        if (key != '') localStorage.removeItem(key);
    }

    var makeXHR = function(url='', method='GET'){
        return new Promise((resolve,reject) => {
            if(!url || !method) throw new Error('Ivalid url and or method!');
            let xhr = new XMLHttpRequest();
            xhr.open(method, url);
            xhr.onload = function () {
                console.log('XHR Status ',this.status);
                if (this.status >= 200 && this.status < 300) resolve(xhr.response);
                else reject({status: this.status,statusText: xhr.statusText});
            };
            xhr.onerror = function () {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            };
            xhr.send();
        });
    }

    var fetch_rates = function(url, cb){
        makeXHR(url).then(data =>{
            let response = JSON.parse(data);
            response && cb({status:true, data:response});
        },response=>{
            response && cb({status:false, data:response});
        }).catch(e=>{
            console.error('ERROR! ',e);
        });
    }

    var returnSettings = function(cb){
        //first time check in local storage
        //if not in local storage add there default settings
        //from next time load from localstorage

    }

    chrome.extension.onRequest.addListener((request, sender, cb)=>{
        let action = request.action || null;
        console.log('Action ',action);
        switch (action) {
            case 'fetch_rates':
                fetch_rates(request.url, cb);
                break;
            case 'get_settings':
                returnSettings();
                break;
            default:
                console.log('Handle default action');
                break;
        }
    });
        sessionStorage.setItem('TEST ','TEST DATA');
        console.log('BG LS ', sessionStorage);

        //var notification = new Notification("Hi there!",{body: 'randomQuote',icon: 'images/48.png',});

        // Then show the notification.
        //notification.show();
})();

