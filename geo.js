// 获取经纬度
// ========

var toast = require("./toast");
var alert = toast;
var noop = require("./noop");
var IsDebug = window.IsDebug;
var extend = $.extend.bind($);
var geolocation = window.navigator.geolocation;

// 经纬度数据
var Data = null;

// 配置
var CONFIG = {
  timeout: IsDebug ? 1000 : 5000
};


function Geo(params) {
  this.params = params;
  this.cb = params.cb || noop;

}


extend(Geo.prototype, {
  init: function() {

    var cb = this.cb;

    if (Data) {
      return cb(Data);
    }

    if (!geolocation) {

      Data = {
        latitude: 0,
        longitude: 0
      };

      cb(Data);

    } else {
      geolocation.getCurrentPosition(this.onSuccess.bind(this), this.onError.bind(this), CONFIG);
    }

  },

  onSuccess: function(position) {

    Data = {
      latitude: position.coords.latitude || 0,
      longitude: position.coords.longitude || 0
    };


    this.cb(Data);


  },

  onError: function(error) {

    Data = {
      latitude: 0,
      longitude: 0
    };

    var ret = Data;
    var callback = this.cb;

    switch (error.code) {
      case error.TIMEOUT:
        if (IsDebug) {
          alert("连接超时，请重试");
        }
        callback(ret);
        break;
      case error.PERMISSION_DENIED:
        if (IsDebug) {
          alert("您拒绝了使用位置共享服务");
        }
        callback(ret);
        break;
      case error.POSITION_UNAVAILABLE:
        if (IsDebug) {
          alert("非常抱歉，我们暂时无法通过浏览器获取您的位置信息");
        }
        callback(ret);
        break;
    }

  }
})



module.exports = function(fn) {
  (new Geo({
    cb: fn
  })).init();
};
