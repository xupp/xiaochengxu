
var app = getApp()
Page({
  data : {
    phone : ''
  },
  savePhone : function(e){
    this.setData({phone:e.detail.value})
  },
  getCode : function(){
    var _this = this;
    wx.request({
      url: app.globalData.config.checkPwd,
      data: { data: JSON.stringify({ "phone": _this.data.phone})},
      method: 'POST',
      header: {
          'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res){
        if(res.data.status == 1){
          wx.request({
            url: app.globalData.config.send,
            data: { data: JSON.stringify({ "phone": _this.data.phone})},
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function(res){
              console.log(res)
            }
          })
        }
      }
    })
  },
  formSubmit: function(e) {
    var formData = e.detail.value;
    if(!formData.phone || !formData.code){
      wx.showToast({
        title: '请正确填写信息'
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
      success: function(res){console.log(res)
        if(res.data.status == 1){
          wx.setStorageSync('uid', res.data.data);
          wx.navigateBack()
        }else if(res.data.status == 0){
          wx.showToast({
            title : res.data.msg
          })
        }
      }
    })
  }
})