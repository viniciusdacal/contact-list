var XHR = (function () {

    var module = {};

    module._init = function () {
      return new XMLHttpRequest();
    };
    module._onready = function (xmlhttp, callback) {
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.status === 200 && xmlhttp.readyState === 4) {
                callback(xmlhttp.responseText);
            }
        };
    }

    module.get = function (url, callback) {
        var xmlhttp = module._init();
        xmlhttp.open('GET', url, true);
        module._onready(xmlhttp, callback);
        xmlhttp.send();
    };

    module.post = function (url, data, callback) {
        var xmlhttp = module._init();
        xmlhttp.open('POST', url);
        xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xmlhttp.send(data);
        module._onready(xmlhttp, callback);
    };

    return {
        get: module.get,
        post: module.post
    };

}());