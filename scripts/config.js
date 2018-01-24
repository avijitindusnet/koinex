//chrome-extension://gpbceecojbahbhbafonjjfdcebcbglka/popup.html

;(function(w) {
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
        API_URI : 'https://koinex.in/api/ticker',
        RETRY_AFTER : 20*1000,
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
    var consoleLog = function() {
        if (defaultSettings.LOG_ENABLED === true || localStorage.getItem('LOG_ENABLED') === 'true') {
            var args = Array.prototype.slice.call(arguments);
            console.log.apply(console, args);
        }
    }
    var consoleInfo = function() {
        if (defaultSettings.INFO_ENABLED === true || localStorage.getItem('INFO_ENABLED') === 'true') {
            var args = Array.prototype.slice.call(arguments);
            console.info.apply(console, args);
        }
    }
    var consoleWarn = function() {
        if (defaultSettings.WARNING_ENABLED === true || localStorage.getItem('WARNING_ENABLED') === 'true') {
            var args = Array.prototype.slice.call(arguments);
            console.warn.apply(console, args);
        }
    }
    var consoleError = function() {
        if (defaultSettings.ERROR_ENABLED === true || localStorage.getItem('ERROR_ENABLED') === 'true') {
            var args = Array.prototype.slice.call(arguments);
            console.error.apply(console, args);
        }
    }
    w.defaultSettings = defaultSettings;
    w._log = consoleLog;
    w._info = consoleInfo;
    w._warn = consoleWarn;
    w._error = consoleError;
})(window);