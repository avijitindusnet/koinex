//var css = "text-shadow: -1px -1px hsl(0,100%,50%), 1px 1px hsl(5.4, 100%, 50%), 3px 2px hsl(10.8, 100%, 50%), 5px 3px hsl(16.2, 100%, 50%), 7px 4px hsl(21.6, 100%, 50%), 9px 5px hsl(27, 100%, 50%), 11px 6px hsl(32.4, 100%, 50%), -1px 399px hsl(2154.6, 100%, 50%); font-size: 20px;";
//console.log("%cWelcome Adventurer! %s", css, 'All code runs happy');




;(function(w, app) {

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

    var consoleLog = function() {
        if (defaultSettings.LOG_ENABLED === true || localStorage.getItem('LOG_ENABLED') === 'true') {
            var args = Array.prototype.slice.call(arguments);
            console.log.apply(console, args);
        }
    }

    var consoleInfo = function() {
        if (CHAT.INFO_ENABLED === true || localStorage.getItem('INFO_ENABLED') === 'true') {
            var args = Array.prototype.slice.call(arguments);
            console.info.apply(console, args);
        }
    }

    var consoleWarn = function() {
        if (CHAT.WARNING_ENABLED === true || localStorage.getItem('WARNING_ENABLED') === 'true') {
            var args = Array.prototype.slice.call(arguments);
            console.warn.apply(console, args);
        }
    }

    var consoleError = function() {
        if (CHAT.ERROR_ENABLED === true || localStorage.getItem('ERROR_ENABLED') === 'true') {
            var args = Array.prototype.slice.call(arguments);
            console.error.apply(console, args);
        }
    }

    w.defaultSettings = defaultSettings;
    w._log = consoleLog;
    w._info = consoleInfo;
    w._warn = consoleWarn;
    w._error = consoleError;
})(window, app);