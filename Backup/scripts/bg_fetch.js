;(function(){
    'use strict';

    var makeXHR = function(url='', method='GET'){
        return new Promise(function (resolve, reject) {
            if(!url || !method) throw new Error('Ivalid url and or method!');
            let xhr = new XMLHttpRequest();
            xhr.open(method, url);
            xhr.onload = function () {
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
        makeXHR(url).then(function(data){
            let response = JSON.parse(data);
            response && cb({status:true, response:response});
        },function(response){
            response && cb({status:false, response:response});
        }).catch(function(e){
            console.error('ERROR! ',e);
        });
    }

    chrome.extension.onRequest.addListener(function(request, sender, cb){
        let action = request.action || null;
        console.log('Action ',action);
        switch (action) {
            case 'fetch_rates':
                fetch_rates(request.url, cb);
                break;
            case 'TSAVECARDCANCEL':

                break;
            default:
                console.log('Handle default action');
                break;
        }
    });

})();

