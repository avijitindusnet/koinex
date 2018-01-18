//var css = "text-shadow: -1px -1px hsl(0,100%,50%), 1px 1px hsl(5.4, 100%, 50%), 3px 2px hsl(10.8, 100%, 50%), 5px 3px hsl(16.2, 100%, 50%), 7px 4px hsl(21.6, 100%, 50%), 9px 5px hsl(27, 100%, 50%), 11px 6px hsl(32.4, 100%, 50%), -1px 399px hsl(2154.6, 100%, 50%); font-size: 20px;";
//console.log("%cWelcome Adventurer! %s", css, 'All code runs happy');




;
(function(w, app) {

    var extId = app.chrome_extension_id || 'kgjgljdnnnnmehjiikoacbdhcpkghahp';

    var CHAT = {
        // Chat heart beat time 3 seconds
        HEART_BEAT_TIME: (600 * 1000),
        DATA_TIMEOUT: (10 * 1000),
        UA_REGISTRATION_TIMEOUT: (5 * 1000),
        SETTING_MODULE: 'Chats',
        SETTING_COOKIE_PREFIX: 'chat_',
        SETTING_DOMAIN: 'sipjs.onsip.com',
        CHROME_EXTENSION_ID: extId,
        DATA_CHANNEL: false,
        SIP_URI_SUFFIX: '350',
        RINGING_TIME_SECONDS: (60 * 1000),
        BUSY_MESSAGE: 'is currently busy.Please try after sometime.',
        NOT_RESPONDING_MESSAGE: 'is not responding.',
        USER_MEDIA_ERROR: 'getUserMedia is not implemented in this browser',
        GLOBAL_ROOM_NAME: 'Global Room',
        BROADCAST_CONTROL_DISPLAY_SECONDS: 3,
        BROADCAST_CHAT_LIMIT: 20,
        TEXT_CHAT_LIMIT: 15,
        LOG_ENABLED: true,
        INFO_ENABLED: true,
        WARNING_ENABLED: true,
        ERROR_ENABLED: true,
        MAX_CHAT_TEXT_COUNT: 2500,
        DESKTOP_NOTIFICATION: false,
        ACTIVE_CALL_STORAGE_KEYNAME: 'activeCall',
        ACTIVE_CHAT_STORAGE_KEYNAME: 'activeChats',
        ACTIVE_GROUP_STORAGE_KEYNAME: 'activeGroups',
        CHAT_TEXTAREA_PLACEHOLDER: 'Type your message. Press Enter to send',
        CHAT_TIME_DISPLAY: true,
        CHAT_DISPLAY_TIME_FORMAT: 12, // 12 OR 24 for displaying in 12 hours or 24 hours format repectively
        TEXT_CHAT_WAIT_MESSAGE: 'Please wait while the group is being initialized...',
        GROUP_CREATE_ERROR_MESSAGE: 'Failed to establish a connection.',
        GROUP_URI_PREFIX: window.location.host.toLowerCase(),
        HIDE_SURNAME_IN_GROUP_CHAT: true,
        CHAT_TEXT_MERGE_TIME_SECONDS: 60,
        TITLE_SHUFFLE_SPEED_MILISECONDS: 1500,
        HIGHLIGHT_PULSE_COUNTER: 10,
        HIGHLIGHT_PULSE_INTERVAL_MILISECONDS: 1000,
        READ_STATUS_UPDATE_COMMIT_LIMIT: 5,
        HIGHLIGHT_CLASS_NAME: 'highlight-chat-tab',
        UA_SUCCESS_MODE: 'connected', //connected OR registered
        ACTIVE_CHAT_TAB_CLASSNAME: 'active_tab',
        GROUP_NAME_MAX_USERS: 2,
        SHOW_ACTIVE_CHAT_ICON: true,
        SHOW_UNREAD_MESSAGES_COUNT: true,
        CHROME_EXTENSION_ACK: 'rtcmulticonnection-extension-loaded',
        CHROME_EXTENSION_ID: extId,
        REJECTED_MESSAGE: ''
    };

    var TEXT = {

    };

    var CUSTOM_KEY_TERMS_USED_IN_SIP = {
        ACKNOWLEDGEMENT: 'ACK',
        USERONLINE: 'USERONLINE',
        TEXTMESSAGE: 'TEXT'
    };

    var consoleLog = function() {
        if (CHAT.LOG_ENABLED === true || localStorage.getItem('LOG_ENABLED') === 'true') {
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

    w.CHAT = CHAT;
    w.SIP_KEYWORDS = CUSTOM_KEY_TERMS_USED_IN_SIP;
    w._log = consoleLog;
    w._info = consoleInfo;
    w._warn = consoleWarn;
    w._error = consoleError;
})(window, app);