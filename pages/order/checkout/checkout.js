/**
 * 订单结算
 */
var app = getApp();
// var mta = require('../../../utils/mta_analysis.js');
Page({
  data : {
    goodsInfo : {},
    userAddress : {},
    num : 1,
    isLow : false,
    goodsAmount : 0,
    hasCoupon : false,
    coupon_id : '',
    coupon: ''
  },
  onLoad : function(options){
    this.group_id = options.group_id;
    this.offered = options.offered;
    wx.setStorageSync('coupon', {});
    wx.setStorageSync('editAddress', false);
    wx.setStorageSync('preCoupon', {})
    // mta.Page.init();
  },
  onShow : function(){
    var goods_id = wx.getStorageSync('goods_id');
    if(!goods_id){
      wx.switchTab({
        url: '/pages/index/index'
      })
      return 
    }
    var uid = wx.getStorageSync('uid');
    if (!uid) {
      this.userLogin();
      return
    }
    this.uid = uid;
    this.getOrder();
    this.getCoupon();
  },
  //选择地址
  changeAddress: function(){
    wx.setStorageSync('editAddress', true);
    wx.navigateTo({
      url: '/pages/mine/address/list/list'
    })
  },
  //去支付
  pay : function(e){
    if (this.data.userAddress && this.data.userAddress.address_id == undefined) {
      wx.setStorageSync('editAddress', true);
      wx.navigateTo({
        url: '/pages/mine/address/add/add'
      })
      return ;
    }
    var goods_amount = this.data.goodsAmount;
    var order_amount = goods_amount*this.data.num;
    this.order_amount = order_amount;

    var order = {
          uid: this.uid,
          openid : null,
          address: this.data.userAddress.province + this.data.userAddress.address,
          consignee: this.data.userAddress.consignee,
          tel: this.data.userAddress.tel,
          goods_amount: goods_amount,
          group_id: this.group_id,
          group_num: this.data.num,
          coupon_id: this.data.coupon_id,
          coupon: this.data.coupon,
          order_amount: order_amount,
          pay_type: '微信小程序',
          goods_id: this.data.goodsInfo.goods_id,
          group_off_time : wx.getStorageSync('endTime')
        }

    var _this = this;
    wx.request({
      url: app.globalData.config.addOrder,
      data: {data:JSON.stringify(order)},
      method: 'POST',
      header: {
          'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res){
        if(res.data.data.status == -5){
          wx.showToast({
            title : res.data.data.msg,
            image: '/asset/img/close.png'
          })
          return ;
        }
        wx.removeStorageSync('goods_id')
        var order_sn = res.data.data.order_sn;

        wx.setStorage( {
          key : 'orderInfo',
          data : {
            goods_name: _this.data.goodsInfo.goods_name,
              address : order.address,
              consignee : order.consignee,
              tel : order.tel,
              order_sn : order_sn,
              order_amount : order.order_amount,
              group_id: _this.group_id
          },
          success : function(res){
            wx.navigateTo({
              url: '/pages/order/pay/pay'
            })
          }
        })
      },
      fail: function(res) {
        // fail
      }
    })    
  },
  //修改购买数量
  optionNum : function(e){
    var goods_low_num = this.data.goodsInfo.goods_low_num,
        goods_low_price = this.data.goodsInfo.goods_low_price,
        goods_now_price = this.offered ? this.data.goodsInfo.goods_low_price: this.data.goodsInfo.goods_now_price,
        goods_num = this.data.goodsInfo.goods_num,
        group_person = this.data.goodsInfo.group_person,
        type = e.currentTarget.dataset.type,
        goods_price = parseFloat(goods_now_price);
        if(this.data.coupon_id && this.data.coupon){
          goods_low_price = this.accSub(goods_low_price, this.data.coupon);
          goods_now_price = this.accSub(goods_now_price, this.data.coupon);
        }
        if(type == 'plus'){
          this.data.num++;
        }else{
          this.data.num > 1 ? this.data.num-- : this.data.num == 1;
        }
        if(goods_low_num > 0){
          if((group_person*1.0 + this.data.num) > goods_low_num){
              goods_price = parseFloat(goods_low_price);
          }else{
              goods_price = parseFloat(goods_now_price); 
          }
        }
        this.setData({
          goodsAmount:goods_price,
          num:this.data.num
        })
  },
  //加载购买的商品详情
  getOrder : function(){
    // wx.showToast({
    //   title : '加载中',
    //   mask : true
    // })
    var goods_id = wx.getStorageSync('goods_id'),
        group_off_time = wx.getStorageSync('endTime');
        
    var $data = {
      uid : this.uid,
      openid : null,
      goods_id : goods_id
    }
    if(this.group_id !== undefined){
      $data.group_id = this.group_id;
    }else{
      $data.group_off_time = group_off_time;
    }
    var _this = this;
      wx.request({
        url:app.globalData.config.getOrder,
        data: {data:JSON.stringify($data)},
        method: 'POST',
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(res){
          if(res.data.status > 0){
            var coupon = wx.getStorageSync('coupon');
            var preCoupon = wx.getStorageSync('preCoupon');
            var editAddress = wx.getStorageSync('editAddress');
            if (!coupon.coupon_id && !coupon.coupon_money && !editAddress && !selectCoupon) {
              if(_this.offered){
                _this.setData({
                  goodsAmount: parseFloat(res.data.data.goods_info.goods_low_price)
                })
              }else{
                _this.setData({
                  goodsAmount: parseFloat(res.data.data.goods_info.goods_now_price)
                })
              }
            }
            if (coupon.coupon_id && coupon.coupon_money){
              if (preCoupon.coupon_id && preCoupon.coupon_money){
                _this.data.goodsAmount = _this.accAdd(_this.data.goodsAmount, preCoupon.coupon_money)
              }
              var goods_amount = _this.accSub(_this.data.goodsAmount, coupon.coupon_money);
              _this.setData({
                coupon_id: coupon.coupon_id,
                coupon: coupon.coupon_money,
                goodsAmount: goods_amount
              })
            }
            _this.setData({
              goodsInfo: res.data.data.goods_info,
              userAddress: res.data.data.user_address
            })
          }else{
            wx.showToast({
              title: res.data.msg,
              image: '/asset/img/close.png'
            })
          } 
        },
        fail: function(res) {
          // fail
        }
      })
  },
  // 两个浮点数求和
  accAdd: function (num1, num2) {
    var r1, r2, m;
    try {
      r1 = num1.toString().split('.')[1].length;
    } catch (e) {
      r1 = 0;
    }
    try {
      r2 = num2.toString().split(".")[1].length;
    } catch (e) {
      r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    // return (num1*m+num2*m)/m;
    return Math.round(num1 * m + num2 * m) / m;
  },
  // 两个浮点数相减
  accSub: function (num1, num2) {
    var r1, r2, m;
    try {
      r1 = num1.toString().split('.')[1].length;
    } catch (e) {
      r1 = 0;
    }
    try {
      r2 = num2.toString().split(".")[1].length;
    } catch (e) {
      r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    var n = (r1 >= r2) ? r1 : r2;
    return (Math.round(num1 * m - num2 * m) / m).toFixed(n);
  },
  //加载优惠券
  getCoupon : function(){
    var _this = this;
    wx.request({
      url: app.globalData.config.getCoupon,
      data: {data:JSON.stringify({"uid":_this.uid,"openid":null})},
      method: 'POST',
      header: {
          'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res){
        //wx.hideToast();
        var couponList = res.data.data;
        if(couponList.length > 0) {
          _this.setData({
            hasCoupon:true
          });
          _this.couponList = couponList;
        }
      },
      fail: function(res) {
        // fail
      }
    })
  },
  //选择优惠券
  selectCoupon: function () {
    wx.setStorageSync('selectCoupon', true);
    wx.navigateTo({
      url: '/pages/mine/coupon/coupon?isOrder=1&order_amount=' + this.order_amount
    })
  },
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
                  url: '/pages/mine/login/login',
                })
              } else if (res.cancel) {
                wx.navigateBack()
              }
            }
          })
        } else {
          wx.setStorageSync('uid', res.data.data.id);
          _this.uid = res.data.data.id;
          _this.getOrder();
          _this.getCoupon();
        }
      }
    })
  },
  backHome: function (e) {
    app.backHome();
  }
})