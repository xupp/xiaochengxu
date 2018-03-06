/**
 * 用户详情页
 */
var app = getApp();
// var mta = require('../../../utils/mta_analysis.js');

Page({
  data : {
    userInfo : {},
    showModal: false
  },
  onLoad: function(){
    // mta.Page.init();
  },
  onShow: function () {
    //检测是否登录
    var uid = wx.getStorageSync('uid');
    if (!uid) {
      this.userLogin();
      return
    }
    this.loadUserInfo();
  },
  //加载用户详情
  loadUserInfo : function(){
    var uid = wx.getStorageSync('uid');
    var _this = this;
    wx.request({    
        url: app.globalData.config.getUserInfo,    
        data: {data:JSON.stringify({"uid":uid,"openid":null})},
        method: 'POST',
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(res){ 
          _this.setData({
            userInfo:res.data.data
          })
        }    
    });  
  },
  //跳转到用户团购列表页
  mineGroup : function(e){
    wx.navigateTo({
      url: '/pages/mine/group/list/list'
    })
  },
  //跳转到用户订单列表页
  mineOrder : function(e){
    wx.navigateTo({
      url: '/pages/mine/order/list/list'
    })
  },
  //跳转到用户优惠券列表页
  mineCoupon  : function(e){
    wx.navigateTo({
      url: '/pages/mine/coupon/coupon'
    })
  },
  //跳转到用户地址列表页
  showAddress : function(e){
    wx.navigateTo({
      url: '/pages/mine/address/list/list'
    })
  },
  //跳转到购买流程
  showFlow : function(e){
    wx.navigateTo({
      url: '/pages/mine/flow/flow'
    })
  },
  //跳转到售后服务
  showService : function(e){
    wx.navigateTo({
      url: '/pages/mine/service/service'
    })
  },
  //用户登录
  userLogin: function () {
    var _this = this;
    var openId = wx.getStorageSync('openId');
    wx.request({
      url: app.globalData.config.getUid,
      data: { data: JSON.stringify({ 'openId': openId }) },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (!res.data.data) {
          wx.showModal({
            content: '请登录',
            confirmText: '确定',
            // showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/pages/mine/login/login'
                })
              } else if(res.cancel){
                wx.switchTab({
                  url: '/pages/index/index'
                })
              }
            }
          })
        } else {
          wx.setStorageSync('uid', res.data.data.id);
          _this.loadUserInfo();
        }
      }
    })
  }
})