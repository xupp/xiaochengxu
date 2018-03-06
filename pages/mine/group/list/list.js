/**
 * 用户团购列表
 */
var app = getApp();
// var mta = require('../../../../utils/mta_analysis.js');

Page({
  data : {
    groupList : {}
  },
  onLoad : function(options){
    this.uid = wx.getStorageSync('uid');
    // mta.Page.init();
  },
  onHide : function(){
    clearInterval(this.timer);
  },
  onUnload : function(){
    clearInterval(this.timer);
  },
  onShow : function(){
    this.loadGroupList();
  },
  //加载团购列表
  loadGroupList : function(){
    var post = {
      uid : this.uid,
      openid : null
    }
    var _this = this;
    wx.request({
      url: app.globalData.config.myGroup,
      data: {data:JSON.stringify(post)},
      method: 'POST',
      header: {
          'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res){
        var data = res.data.data;
        var timer = setInterval(function(){
          for(var i=0;i<data.length;i++){
            data[i].group_end_time = _this.timeFormat(data[i].group_off_time * 1000);
          }
          _this.setData({
            groupList:data
          })
        },1000)
        _this.timer = timer;
      },
      fail: function(res) {
        // fail
      }
    })
  },
  //设置定时器
  setTimer: function (_this,data){
    var timer = setInterval(function(){
      for(var i=0;i<data.length;i++){
        data[i].group_end_time = _this.timeFormat(data[i].group_off_time * 1000);
      }
      _this.setData({groupList:data})
    },1000)
    _this.timer = timer;
  },
  timeFormat : function(timestamp){
    var timestamp = timestamp;
    // setInterval(function(){
      var currentTime = (new Date()).getTime();
      var time = timestamp - currentTime;
      if(time <= 0) return false;
      var times = Math.floor(time / (1000 * 60 * 60))+':'+Math.floor(time / (1000 * 60) % 60)+':'+Math.floor(time / 1000  % 60);
      return times;
    // },1000)

  },
  //跳转到订单详情也
  orderDetail : function(e){
    var order_id = e.currentTarget.dataset.orderid;
    wx.navigateTo({
      url: '/pages/mine/order/info/info?order_id=' + order_id
    })
  }, 
  //跳转到团购详情页
  groupDetail : function(e){
    var group_id = e.currentTarget.dataset.groupid;
    wx.navigateTo({
      url: '/pages/mine/group/info/info?group_id=' + group_id
    })
  }, 
  backHome : function(e){
    app.backHome();
  }
})