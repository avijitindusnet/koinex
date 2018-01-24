;(function(){
    'use strict';
    var priceStorageKeyName = 'priceData',
        pulse,
        execptionTimer,
        retryAfterTime = 300*1000,
        apiUri = 'https://koinex.in/api/ticker';

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
        LOG_ENABLED:true,
    	COINS :coins,
        COIN_IN_FOCUS : 'XRP',
        COINS_TO_DISPLAY : ['BTC','ETH','MIOTA','LTC','BCH'],
        TEXT_IN_TOGGLE : 'Stats',
        HEADING_TEXT : 'Price',
        CURRENCY_SYMBOL : '₹',
        REFRESH_TIMER_TEXT : 'Refreshing in..',
        UPDATE_FREQ : 30,  //in seconds (absolutely no less than 30 seconds)
        DESKTOP_NOTIFICATION : true,
        NOTIFICATION_TYPE : 'PERIODIC', // periodic or conditional(like when above or below specific rate)
        NOTIFICATION_FREQ : 300, // in seconds
        DISPLAY_MINMAXRATES : true
    };

    var _log = function() {
        if (defaultSettings.LOG_ENABLED === true || localStorage.getItem('LOG_ENABLED') === 'true') {
            var args = Array.prototype.slice.call(arguments);
            console.log.apply(console, args);
        }
    }

	var	b64encode = function(str) {
	    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
	        function toSolidBytes(match, p1) {
	            return String.fromCharCode('0x' + p1);
	    }));
	};
	var b64decode = function(str) {
	    return decodeURIComponent(atob(str).split('').map(function(c) {
	        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
	    }).join(''));
	}

    var sendMessage = function(){
        let [mode,data={},cb=function(){}] = arguments;
        if(typeof data === 'function') cb = data;
        chrome.runtime.sendMessage({mode:mode.toUpperCase(),data:data}, cb);
    }

    var checkBrowserStorage = function(type) {
        if (type === 'localStorage' || type === 'sessionStorage') {
            try {
                var storage = window[type],
                    x = 'storageTest';
                storage.setItem(x, x);
                storage.removeItem(x);
                return true;
            } catch (e) {
                throw new Error('Web storage is not supported.', e);
                return false;
            }
        } else throw 'Unable to check browser storage.';
    }

    var setStorageItem = function(key, value) {
        var webStorageType = 'localStorage';
        var key = key.trim(),
            value = b64encode(JSON.stringify(value)) || '';

        if (checkBrowserStorage(webStorageType)) localStorage.setItem(key, value);
        else throw new Error('Failed to store values');
    };

    var retrieveStorageItem = function(key) {
        if (key != '') {
            var value = localStorage.getItem(key);
            if (value) return JSON.parse(b64decode(value));
        }
        return {};
    };

    var removeStorageItem = function(key) {
        if (key != '') localStorage.removeItem(key);
    };

    var makeXHR = function(url='', method='GET'){
        return new Promise((resolve,reject) => {
            if(!url || !method) throw new Error('Ivalid url and or method!');
            let xhr = new XMLHttpRequest();
            xhr.open(method, url);
            xhr.onload = function () {
                _log('XHR Status ',this.status);
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

    var returnSettings = function(respond){
    	let keyName = 'settings';
    	let settings = retrieveStorageItem(keyName);
        removeStorageItem(keyName);
    	if(settings.COINS){
    		respond(defaultSettings);
    	}else{
    		setStorageItem(keyName,defaultSettings);
    		respond(defaultSettings);
    	}
    }

    var getTimeStamp = function(){
        return Date.now();
    }

    var startPriceFetching = function(){
        var fetchPrice = function(){
            makeXHR(apiUri).then(data =>{
                let response = JSON.parse(data); _log('Fired XHR ',response);
                if(response){
                    let timeStamp = getTimeStamp();
                    removeStorageItem(priceStorageKeyName);
                    setStorageItem(priceStorageKeyName,{response:response, time:timeStamp});
                    sendMessage('REFRESHED',console.log);  //check here
                }
            },response=>{
                clearInterval(pulse);
                _log('Failed to fetch price. It will automatically reattempt in 2 minutes');
                execptionTimer = setTimeot(function(){
                    startPriceFetching();
                },retryAfterTime);
            }).catch(e=>{
                _error('ERROR! ',e);
            });
        };

        let priceData = retrieveStorageItem(priceStorageKeyName),
            currentTime = getTimeStamp(),
            updateFrequency = defaultSettings.UPDATE_FREQ*1000,
            timeDiff = Math.floor((currentTime - priceData.time)/1000);

        (!priceData.time || timeDiff > updateFrequency) && fetchPrice();
        pulse = setInterval(fetchPrice,defaultSettings.UPDATE_FREQ*1000);
    }

    var getRates = function(respond){
        let rates = retrieveStorageItem(priceStorageKeyName);
        rates && respond(rates);
    }

	chrome.extension.onMessage.addListener((request, sender, respond)=>{
		let {mode:mode,data:data} = request;
    	switch (mode) {
    	    case 'GET_RATES':
    	        getRates(respond);
    	        break;
    	    case 'GET_SETTINGS':
    	        returnSettings(respond);
    	        break;
            case 'LOG':
                _log(data);
                break;
    	    default:
    	        _log('Handle default action ',mode);
    	        break;
    	}
	});

    startPriceFetching();

        //var notification = new Notification("Hi there!",{body: 'randomQuote',icon: 'images/48.png',});
        //chrome-extension://gpbceecojbahbhbafonjjfdcebcbglka/popup.html
        // Then show the notification.
        //notification.show();
})();

