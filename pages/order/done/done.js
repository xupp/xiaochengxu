// pages/order/done/done.js
/**
 * 订单完成
 */
var app = getApp();
// var mta = require('../../../utils/mta_analysis.js');

Page({
  data:{
    groupInfo : {},
    pinsucess : false
  },
  onLoad:function(options){ 
    this.uid = wx.getStorageSync('uid');
    this.order_sn = options.order_sn;console.log(options)
    if(options.pinsucess !== undefined){
      this.setData({
        pinsucess:true
      })
    }
    // mta.Page.init();
  },
  onHide : function(){
    clearInterval(this.timer);
  },
  onUnload : function(){
    clearInterval(this.timer);
  },
  onShow : function(){
    this.openGroupSuccess()
  },
  openGroupSuccess : function(){
    if(wx.showLoading){
      wx.showLoading({
        title : '加载中...',
        mask : true
      })
      setTimeout(function(){
        wx.hideLoading()
      },1500)
    }
    var _this = this;
    var groupUrl = '';
    if(_this.data.pinsucess){
      groupUrl = app.globalData.config.goinGroupSuccess;
    }else{
      groupUrl = app.globalData.config.OpenGroupSuccess;
    }
    wx.request({
      url: groupUrl,
      data: { data: JSON.stringify({ "uid": _this.uid, "openid": null, "order_sn": _this.order_sn})},
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res){
        // wx.hideToast();
        var data = res.data.data;
        var timer = setInterval(function(){
          var time = _this.timeFormat(data.group.group_off_time * 1000);
          data.group.group_end_time = time;
          if(!time){
            _this.setData({
              groupInfo:data
            })
            return ;
          }
          _this.setData({
            groupInfo:data
          })
        },1000)  
        this.timer = timer;
      },
      fail: function(res) {
        // fail
      }
    })
  },
  timeFormat : function(timestamp){;
    var timestamp = timestamp;
    // setInterval(function(){
      var currentTime = (new Date()).getTime();
      var time = timestamp - currentTime;
      if(time <= 0) return false;
      var times = Math.floor(time / (1000 * 60 * 60))+':'+Math.floor(time / (1000 * 60) % 60)+':'+Math.floor(time / 1000  % 60);
    return times;
    // },1000)

  },
  backHome : function(e){
    app.backHome();
  }
})