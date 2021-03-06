;(function(W){
    'use strict';
    var priceStorageKeyName = 'priceData',
        pulse,
        execptionTimer,
        defaultSettings = W.defaultSettings;


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

    var showNotification = function(){
        var notification = new Notification("Hi there!",{body: 'randomQuote',icon: 'images/48.png',});
        // Then show the notification.
        //notification.show();
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
        _log('make xhr ',url,method);
        return new Promise((resolve,reject) => {
            if(!url || !method) throw new Error('Ivalid url and or method!');
            let xhr = new XMLHttpRequest();
            xhr.open(method, url);
            xhr.onload = function () {
                _log('XHR Status ',this.status); //showNotification();
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
        clearInterval(execptionTimer);
        var fetchPrice = function(){
            makeXHR(defaultSettings.API_URI).then(data =>{
                let response = JSON.parse(data); _log('Fired XHR ',response);
                if(response){
                    let timeStamp = getTimeStamp();
                    removeStorageItem(priceStorageKeyName);
                    setStorageItem(priceStorageKeyName,{response:response, time:timeStamp});
                    sendMessage('REFRESHED',console.log);  //check here
                }
            },response=>{
                clearInterval(pulse);
                _log('Failed to fetch price. It will automatically reattempt.');
                execptionTimer = setTimeout(function(){
                    startPriceFetching();
                }, defaultSettings.RETRY_AFTER);
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
})(window);

