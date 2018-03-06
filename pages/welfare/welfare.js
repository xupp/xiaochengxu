/**
 * 福利
 */
var app = getApp();
// var mta = require('../../utils/mta_analysis.js');
Page({
  data : {
    userInfo : {},
    pointGoods : {},
    showModal: false
  }, 
  onLoad : function(){
    this.loadPointGoods();
    // mta.Page.init();
  },
  onShow: function () {
    this.uid = wx.getStorageSync('uid');
    this.loadUserInfo();
  },
  //加载用户数据
  loadUserInfo : function(){
    var _this = this;
    wx.request({
        url: app.globalData.config.getUserInfo,
        data: {data:JSON.stringify({"uid":_this.uid,"openid":null})},
        method: 'POST',
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(res){
          _this.setData({
            userInfo:res.data.data
          }) 
        }
    })
  },
  //加载换购商品
  loadPointGoods : function(){
    var _this = this;
    wx.request({
      url: app.globalData.config.getPointGoods,
      success: function(res){
        _this.setData({
          pointGoods:res.data.data
        })
      }
    })
  },
  //跳转到换购页
  gotoPay : function(){
    wx.showToast({
      title: '暂时无法换购',
      image: '/asset/img/close.png'
    })
  }
})