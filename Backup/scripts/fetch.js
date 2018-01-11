

function display_stories(feed_data) {
  var xml_doc = $.parseXML(feed_data);
  $xml = $(xml_doc);
  $('#popup').html('<img src="images/logo.png" id="logo" /><br clear="all" />');
  $('#logo')[0].addEventListener('click', function() {
    open_item('http://lifehacker.com/')
    window.close() } )

  var items = $xml.find("item");
  items.each(function(index, element) {
    var post = parse_post(element);
    var item = '';
    var class2 = '';
    if (index >= localStorage['unread_count']) {
      // // console.log('visited');
      item += '<div class="post read">';
    }
    else {
      item += '<div class="post">'
    }
    item += '<span class="tag">' + post.tag + '</span>\
          <a href="' + post.url + '">\
            <div id="' + post.id + '" class="item">\
              <img src="' + post.img + '" width="107" height="60" />\
              <h4>' + post.title + '</h4>\
              <span class="description">' + post.description + '...</span>\
            </div>\
          </a>';
    item += '</div>';
    $('#popup').append(item);
    // TODO why isn't jQuery's .on defined?
    var $item = $('div[id="' + post.id + '"]')
    console.log('$item', $item)
    $item[0].addEventListener('click', function() {
      open_item(post.url) } )
  });
}

/*function getRates() {
    var reqParams = {
            'action' : 'fetch_rates',
            'url' : 'https://koinex.in/api/ticker'
    };

    chrome.extension.sendRequest(reqParams,function(response) {
        bp.console.log('Response ',response);
        //display_stories(response);
    });
}*/

/*$(document).ready(function() {
    bp.console.log('Ready');
    getRates();
});*/




;(function(W,D,$){
    'use strict';
    var bp = chrome.extension.getBackgroundPage();

    var getRates = function () {
        let reqParams = {
            'action' : 'fetch_rates',
            'url' : 'https://koinex.in/api/ticker'
        };

        chrome.extension.sendRequest(reqParams,function(response) {
            bp.console.log('S Response ',response);
            //display_stories(response);
        });
    }

    var displayData = function(){

    }

    var init = function(){
        bp.console.log('Ready');
        getRates();
    }

    W.addEventListener('load',init);
})(window,document,jQuery);