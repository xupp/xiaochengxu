// pages/mine/login/login.js
/**
 * 登录
 */
var app = getApp();
// var mta = require('../../../utils/mta_analysis.js');
Page({
  data : {
    phone : '',
    is_send: false
  },
  onLoad: function(){
    wx.login({
      success: (res) => {
        wx.setStorage({
          key: 'code',
          data: res.code
        })
      }
    })
    // mta.Page.init();
  },
  savePhone : function(e){
    this.setData({
      phone:e.detail.value
    })
  },
  getCode : function(){
    if (this.data.phone == '' || !/^1[34578]\d{9}$/.test(this.data.phone)) {
      wx.showToast({
        title: '请检查手机号',
        image: '/asset/img/close.png'
      })
      return
    }
    var _this = this;
    wx.request({
      url: app.globalData.config.checkPwd,
      data: {data:JSON.stringify({"phone":_this.data.phone})},
      method: 'POST',
      header: {
          'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res){
        if(res.data.status == 1){
          wx.request({
            url: app.globalData.config.send,
            data: {data:JSON.stringify({"phone":_this.data.phone})},
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function(res){
              _this.setData({
                is_send: true
              })
            }
          })
        }else{
          wx.showToast({
            title: res.data.msg,
            image: '/asset/img/close.png'
          })
        }
      }
    })
  },
  formSubmit: function(e) {
    var formData = e.detail.value;
    if(formData.phone == '' || formData.code == '' || !/^1[34578]\d{9}$/.test(formData.phone)){
      wx.showToast({
        title: '请正确填写信息',
        image: '/asset/img/close.png'
      })
      return
    }
    var openId = wx.getStorageSync('openId');
    wx.request({
      url: app.globalData.config.samllBind,
      data: { data: JSON.stringify({ "openid": openId,"phone":formData.phone,"code":formData.code,"pwd":''})},
      method: 'POST',
      header: {
          'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res){
        if(res.data.status == 1){
          wx.setStorageSync('uid', res.data.data);
          wx.navigateBack()
        }else if(res.data.status == 0){
          wx.showToast({
            title : res.data.msg,
            image: '/asset/img/close.png'
          })
        }
      }
    })
  },
  //获取用户手机号
  getPhoneNumber: function (e) {//{errMsg: "getPhoneNumber:fail user deny"}
    if (e.detail.errMsg == "getPhoneNumber:ok"){
      var code = wx.getStorage({
        key: 'code',
        success: function (res) {
          var $post = {
            code: res.data,
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv
          }
          wx.request({
            url: app.globalData.config.loginGetUserInfo,
            data: { data: JSON.stringify($post) },
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              if (!res.data) {
                wx.showToast({
                  title: '您没有绑定手机号'
                })
                return
              }
              var phone = res.data;
              var openId = wx.getStorageSync('openId');
              wx.request({
                url: app.globalData.config.samllBind,
                data: { data: JSON.stringify({ "openid": openId, "phone": phone, "pwd": '' }) },
                method: 'POST',
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                success: function (res) {
                  if (res.data.status == 1) {
                    wx.setStorageSync('uid', res.data.data);
                    wx.navigateBack()
                  } else if (res.data.status == 0) {
                    wx.showToast({
                      title: res.data.msg,
                      image: '/asset/img/close.png'
                    })
                  }
                }
              })
            }
          })
        }
      })
    }
  } 
})