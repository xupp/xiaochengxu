/**
 * 用户订单详情
 */
var app = getApp();
// var mta = require('../../../../utils/mta_analysis.js');

Page({
  data : {
    orderInfo : {}
  },
  onLoad : function(options){
    this.uid = wx.getStorageSync('uid');
    this.loadOrderDetail(options.order_id);
    // mta.Page.init();
  },
  //加载订单详情
  loadOrderDetail : function(order_id){
    var _this = this;
      wx.request({
        url: app.globalData.config.orderInfo,
        data: {data:JSON.stringify({"uid":_this.uid,"openid":null,"order_id":order_id})},
        method: 'POST',
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(res){console.log(res)
          _this.setData({
            orderInfo:res.data.data
          });
        }
      })
  },
  backHome : function(e){
    app.backHome();
  }
})