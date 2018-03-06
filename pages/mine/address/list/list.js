/**
 * 用户地址列表
 */
var app = getApp();
// var mta = require('../../../../utils/mta_analysis.js');

Page({
  //初始化数据
  data : {
    addressList : {}
  },
  //监听页面加载
  onLoad : function(options){
    this.uid = wx.getStorageSync('uid');
    // mta.Page.init();
  },
  //监听页面显示
  onShow : function(){
    this.loadAddressList();
  },
  //加载用户地址列表
  loadAddressList : function(){
    var _this = this;
    wx.request({
      url: app.globalData.config.getAddress,
      data: {data:JSON.stringify({uid: this.uid,openid : null})},
      method: 'POST',
      header: {
          'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res){
        _this.setData({
          addressList:res.data.data
        })
         wx.setStorageSync('addressList', res.data.data)
      }
    })
  },
  //跳转到添加地址页
  addAddress: function (e) {
    var address_id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../add/add?address_id=' + address_id
    })
  },
  //设置默认地址
  setDefaultAddress : function(e){
    var detail = e.detail.value;
    wx.request({
      url: app.globalData.config.saveDefault,
      data: {data:JSON.stringify({uid: this.uid,openid : null,address_id : detail[0]})},
      method: 'POST',
      header: {
          'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res){
         wx.redirectTo({
           url: '/pages/mine/address/list/list'
         })
      },
      fail: function(res) {
        // fail
      }
    })
  },
  //删除地址
  delAddress : function(e){
    var address_id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确定删除地址吗！',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.config.delAddress,
            data: { data: JSON.stringify({ uid: this.uid,openid : null,address_id : address_id})},
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function(res){
              wx.redirectTo({
                url: '/pages/mine/address/list/list'
              })
            }
          })
        } 
      }
    })
  },
  backHome : function(e){
    app.backHome();
  }
})