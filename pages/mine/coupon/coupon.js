// pages/coupon/coupon.js
/**
 * 优惠券列表
 */
var app = getApp();
// var mta = require('../../../utils/mta_analysis.js');
Page({
  //初始化数据
  data:{
    couponList : {},
    coupon_id: 0
  },
  isOrder : false,
  //监听页面加载
  onLoad:function(options){
    if(options.isOrder !== undefined){
      this.isOrder = true;
      this.order_amount = options.order_amount;
    } 
    this.uid = wx.getStorageSync('uid');
    this.getCoupon();
    // mta.Page.init();
  },
  //加载优惠券
  getCoupon : function(){
    var _this = this;
    if (this.isOrder) {
      var storeCoupon = wx.getStorageSync('coupon');
      _this.setData({
        coupon_id: storeCoupon.coupon_id
      })
      wx.setStorageSync('preCoupon', storeCoupon)
    }
    wx.request({
      url: app.globalData.config.getCoupon,
      data: {data:JSON.stringify({"uid":_this.uid,"openid":null})},
      method: 'POST',
      header: {
          'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res){
        //wx.hideToast();
        _this.setData({
          couponList:res.data.data
        })
      },
      fail: function(res) {
        // fail
      }
    })
  },
  //选择使用优惠券
  selectedCoupon : function(e){
    var coupon_id = e.currentTarget.dataset.couponid;
    if(this.isOrder){
      var coupon = [];
      var couponList = this.data.couponList;
      for(var i=0;i<couponList.length;i++){
        if(couponList[i]['coupon_id'] == coupon_id){
          coupon = couponList[i];
          break;
        }
      }
      if(coupon){
        var storeCoupon = wx.getStorageSync('coupon');
        if (coupon.coupon_id == storeCoupon.coupon_id){
          wx.showToast({
            title: '此券已选择',
            image: '/asset/img/close.png'
          })
          return
        }
        if(coupon.status == 3){
          wx.showToast({
            title: '此券已使用',
            image: '/asset/img/close.png'
          })
          return
        }
        if (coupon.min_order_amount > this.order_amount){
          wx.showToast({
            title: '订单金额过少',
            image: '/asset/img/close.png'
          })
          return
        } else if(coupon.type == 3 && coupon.min_order_amount > this.order_amount){
          wx.showToast({
            title: '最低消费 ' + coupon.min_order_amount + '元 才能使用',
            image: '/asset/img/close.png'
          })
          return
        }else if(coupon.type == 2){
          var goods_id = wx.getStorageSync('goods_id');
          if(goods_id != coupon.gid){
            wx.showToast({
              title: '不能使用此券',
              image: '/asset/img/close.png'
            })
            return
          }
        }else if(coupon.type == 4){
          var mid = wx.getStorageSync('mid');
          if (mid != coupon.mid) {
            wx.showToast({
              title: '不能使用此券',
              image: '/asset/img/close.png'
            })
            return
          } else if (mid == coupon.mid && coupon.min_order_amount > this.order_amount){
            wx.showToast({
              title: '不能使用此券',
              image: '/asset/img/close.png'
            })
            return
          }
        }
        wx.setStorageSync('coupon', {
          coupon_id:coupon_id,
          coupon_money:coupon.type_money
        });
      }
      wx.navigateBack();
    }
  },
  backHome : function(e){
    app.backHome();
  }
})