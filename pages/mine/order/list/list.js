/**
 * 用户订单列表
 */
var app = getApp();
// var mta = require('../../../../utils/mta_analysis.js');

Page({
  data : {
    orderList : {},
    active : 0
  },
  onLoad : function(options){
    this.uid = wx.getStorageSync('uid');
    this.loadOrderList();
    // mta.Page.init();
  },
  //加载订单列表
  loadOrderList : function(){
    var post = {
      uid : this.uid,
      openid : null
    }
    if(arguments.length>0){
      post.pay_status = arguments[0];
    }
    var _this = this;
    wx.request({
      url: app.globalData.config.orderList,
      data: {data:JSON.stringify(post)},
      method: 'POST',
      header: {
          'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res){
        _this.setData({
          orderList:res.data.data
        })
      },
      fail: function(res) {
        // fail
      }
    })
  },
  //取消订单
  cancelOrder : function(e){
    var _this = this;
    var order_sn = e.currentTarget.dataset.ordersn;
    wx.showModal({
      title: '确认取消订单吗！',
      success: function(res) {
        if (res.confirm) {
            wx.request({
              url: app.globalData.config.calOrder,
              data: { data: JSON.stringify({ "uid": _this.uid,"openid":null,"order_sn":order_sn})},
              method: 'POST',
              header: {
                  'content-type': 'application/x-www-form-urlencoded'
              },
              success: function(res){
                wx.showToast({
                  title : '已取消',
                  icon : 'success'
                })
                var orderList = _this.data.orderList;
                for(var i=0;i<orderList.length;i++){
                    if(orderList[i]['order_sn'] == order_sn){
                      orderList.splice(i,1);
                    }
                }
                _this.setData({
                  orderList:orderList
                })
              }
            })
        } 
      }
    })
  },
  //去支付
  pay : function(e){
    var order_id = e.currentTarget.dataset.id;
    var orderList = this.data.orderList;
    for(var i=0;i<orderList.length;i++){
      if(orderList[i]['order_id'] == order_id){
        wx.setStorage({
          key: 'orderInfo',
          data: {
              goods_name:orderList[i].goods_name,
              address : orderList[i].address,
              consignee : orderList[i].consignee,
              tel : orderList[i].tel,
              order_sn : orderList[i].order_sn,
              order_amount : orderList[i].order_amount
          },
          success: function(res){
            wx.navigateTo({
              url: '/pages/order/pay/pay'
            })
          }
        })
      }
    }
  },
  //查看订单详情
  showDetail : function(e){
    var order_id = e.currentTarget.dataset.orderid;
    wx.navigateTo({
      url: '/pages/mine/order/info/info?order_id=' + order_id
    })
  }, 
  //切换订单模式
  changeType : function(e){
    var type = e.currentTarget.dataset.type;
    if(type == 'all'){
        this.setData({active:0});
        this.loadOrderList();
    }else if(type == 'nopay'){
        this.setData({active:1});
        this.loadOrderList(1);
    }else{
        this.setData({active:2});
        this.loadOrderList(2);
    }
  },
  backHome : function(e){
    app.backHome();
  }
})