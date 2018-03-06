// pages/chew/chew.js
/**
 * 商家
 */
var app = getApp();
// var mta = require('../../utils/mta_analysis.js');

Page({
  data : {
    tenant : {},
    goodsData : {}
  },
  onLoad : function(options){
    // wx.showLoading({
    //   title : '加载中',
    //   mask : true
    // })
    this.loadGoods(options.mid);
    // mta.Page.init();
  },
  //加载商家下所有商品
  loadGoods : function(mid){
    var _this = this;
      wx.request({
        url: app.globalData.config.tenant,
        data: {data:JSON.stringify({"mid":mid})},
        method: 'POST',
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(res){
          _this.setData({
            goodsData:res.data.data.goodsInfo,
            tenant:res.data.data.tenant
          })
          // wx.hideLoading()
        },
        fail: function(res) {
          // fail
        }
      })
  },
  //商品详情页
  showGoods : function(e){
    var goods_id = e.currentTarget.id;
    wx.navigateTo({
      url: '../goods/goods?goods_id=' + goods_id
    })
  },
  backHome : function(e){
    app.backHome();
  }
})