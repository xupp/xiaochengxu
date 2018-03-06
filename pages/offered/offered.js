/**
 * 参团
 */
var app = getApp();
// var mta = require('../../utils/mta_analysis.js');

Page({
  data : {
    groupInfo : {},
    animationData : {}
  },
  deg : 0,
  group_id : 0,
  onLoad : function(options){
    this.group_id = options.group_id;
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
    this.loadGroupInfo();
  },
  //加载要参团的团购详情
  loadGroupInfo : function(){
    if(wx.showLoading){
      wx.showLoading({
        title : '加载中...',
        mask : true
      })
      setTimeout(function(){
        wx.hideLoading()
      },1500)
    }
    var animation = wx.createAnimation();
    var _this = this;
    wx.request({
      url: app.globalData.config.goinGroup,
      data: { data: JSON.stringify({ "group_id": _this.group_id})},
      method: 'POST',
      header: {
          'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res){
        _this.offered_goods_id = res.data.data.goodsinfo.goods_id;
        var data  = res.data.data;
        var timer = setInterval(function(){
        var time = _this.timeFormat(data.goodsinfo.group_off_time * 1000);
          data.goodsinfo.group_end_time = time;
          data.goodsinfo.has_person = data.goodsinfo.group_low_person - data.goodsinfo.group_already_person;
          if (data.goodsinfo.group_low_person - data.goodsinfo.group_already_person <= 1){
            data.goodsinfo.goods_now_price = data.goodsinfo.goods_low_price
          }
          if(!time){
            _this.setData({
              groupInfo:data
            })
            return ;
          }
          _this.deg += 6;
          animation.rotate(_this.deg).step();
          _this.setData({
            groupInfo:data,
            animationData:animation.export()
          })
        },1000)  
        _this.timer = timer;
      }
    })
  },
  //去参团
  pay : function(){
    var goods_id = this.offered_goods_id;
    var _this = this;
    wx.request({
      url: app.globalData.config.checkOrder,
      data: { data: JSON.stringify({ "uid": _this.uid, "openid": null, "group_id": _this.group_id,"goods_id":goods_id})},
      method: 'POST',
      header: {
          'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res){
        if(res.data.status == -3){
          wx.showToast({
            title : res.data.msg,
            image: '/asset/img/close.png'
          })
          return ;
        }
        wx.setStorageSync('goods_id',goods_id);
        wx.navigateTo({
          url: `/pages/order/checkout/checkout?group_id=${_this.group_id}&offered=1`
        })
      }
    })
  },
  //跳转到商家页
  showTenant : function(e){
    var mid = e.currentTarget.dataset.mid;
    wx.navigateTo({
      url: '/pages/tenant/tenant?mid=' + mid
    })
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
  backHome : function(e){
    app.backHome();
  }
})