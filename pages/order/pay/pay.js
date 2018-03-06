// pages/order/pay/pay.js
/**
 * 订单支付
 */
var app = getApp();
// var mta = require('../../../utils/mta_analysis.js');

Page({
  data:{
    order_amount : 0,
    orderInfo : {}
  },
  onLoad:function(options){
    var _this = this;  
    wx.getStorage({
      key: 'orderInfo',
      success: function(res){
        _this.setData({
          orderInfo:res.data
        })
      }
    })
    // mta.Page.init();
  },
  //发起支付
  pay : function(){
    var _this = this;
    wx.login({
        success: function (res) {
          if(res.code){
            wx.request({
              // url: 'https://daban2017.leanapp.cn/pay.php',
              url: 'https://h5.partnertrip.cn/app/wxpay/public/pay.php',
              data: {
                code : res.code,
                goods_name: _this.data.orderInfo.goods_name,
                order_sn: _this.data.orderInfo.order_sn,
                order_amount: _this.data.orderInfo.order_amount
              },
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: function(response){
                // 发起支付
                if (response.data){
                  wx.requestPayment({
                    timeStamp: response.data.timeStamp,
                    nonceStr: response.data.nonceStr,
                    package: response.data.package,
                    signType: 'MD5',
                    paySign: response.data.paySign,
                    success: function (res) {
                      // wx.showToast({
                      //     title: '支付成功'
                      // });
                      var url = url = '/pages/order/done/done?order_sn=' + _this.data.orderInfo.order_sn;
                      if (_this.data.orderInfo.group_id != undefined) {
                        url = '/pages/order/done/done?order_sn=' + _this.data.orderInfo.order_sn + '&pinsucess=1';
                      }
                      wx.navigateTo({
                        url: url
                      })
                    },
                    fail: function (res) {
                      wx.showToast({
                        title: '订单支付失败',
                        image: '/asset/img/close.png',
                        success: function () {
                          wx.switchTab({
                            url: '/pages/index/index'
                          })
                        }
                      })
                    }
                  })
                }else{
                  wx.showToast({
                    title: '该订单已支付',
                    image: '/asset/img/close.png',
                    success: function () {
                      wx.switchTab({
                        url: '/pages/index/index'
                      })
                    }
                  })
                }
              }
            })
          }else{
            console.log('登录失败')
          }
        }
      })
  },
  backHome : function(e){
    app.backHome();
  }
})