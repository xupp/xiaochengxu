/**
 * 商品详情页
 */
var app = getApp();
//解析html
var WxParse = require('../../asset/wxParse/wxParse.js');
// var mta = require('../../utils/mta_analysis.js');

Page({
  //初始化数据
  data: {
    animationData : {},
    show : true, //查看详情状态
    goodsInfo : {},
    groupInfo : {},
    endTime : false
    // imagewidth: 0,//缩放后的宽  
    // imageheight: 0,//缩放后的高  
  },
  //监听页面加载
  onLoad : function(options){
    // wx.showToast({
    //   title : '加载中',
    //   mask : true
    // })
    var goods_id = options.goods_id;
    this.loadGoodsDetail(goods_id);
    // mta.Page.init();
  },
  //加载商品详情
  loadGoodsDetail : function(goods_id){
    var _this = this;
      wx.request({
        url: app.globalData.config.OpenGroup,
        data: {data:JSON.stringify({"goods_id":goods_id})},
        method: 'POST',
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(res){
          var data = res.data.data
          // wx.hideToast();
          WxParse.wxParse('goods_brief', 'html', data.goodsinfo.goods_brief, _this, 5);
          if (data.groupInfo.length > 0){
            var timer = setInterval(function () {
              for (var i = 0; i < data.groupInfo.length; i++) {
                data.groupInfo[i].group_end_time = _this.timeFormat(data.groupInfo[i].group_off_time * 1000);
              }
              _this.setData({
                groupInfo: data.groupInfo
              })
            }, 1000)
            _this.timer = timer;
          }
          _this.setData({
            goodsInfo : data.goodsinfo
          })
          wx.setStorageSync('endTime', data.goodsinfo.time);
          wx.setStorageSync('goods_id', goods_id);
          wx.setStorageSync('mid', data.goodsinfo.mid);
        },
        fail: function(res) {
          // fail
        }
      })
  },

  //格式化时间
  timeFormat: function (timestamp) {
    var timestamp = timestamp;
    // setInterval(function(){
    var currentTime = (new Date()).getTime();
    var time = timestamp - currentTime;
    if (time <= 0) return false;
    var times = Math.floor(time / (1000 * 60 * 60)) + ':' + Math.floor(time / (1000 * 60) % 60) + ':' + Math.floor(time / 1000 % 60);
    return times;
    // },1000)

  },
  //跳转到商家页
  showTenant : function(e){
    var mid = e.currentTarget.dataset.mid;
    wx.navigateTo({
      url: '/pages/tenant/tenant?mid=' + mid
    })
  },
  //跳转到参团页
  offered: function (e) {
    var group_id = e.currentTarget.dataset.groupid;
    wx.navigateTo({
      url: '/pages/offered/offered?group_id=' + group_id
    })
  },
  //动态计算图片宽高
  // imageLoad: function (e) {  
  //   var imageSize = imageUtil.imageUtil(e)  
  //   this.setData({  
  //     imagewidth: imageSize.imageWidth,  
  //     imageheight: imageSize.imageHeight  
  //   })  
  // },  
  //显示隐藏详情
  hideDetail : function(e){
    var animation = wx.createAnimation({
        duration: 400,
        timingFunction: 'linear'
    })
    this.animation = animation;
    if(!this.data.show){
      animation.rotate(0).step();
    }else{
      animation.rotate(180).step();          
    }
    this.setData({
      animationData:animation.export(),
      show:!this.data.show
    })
  },
  //选择结团时间
  chooseEndTime : function(e){
    var endTime = e.currentTarget.dataset.value;
    this.setData({
      endTime:endTime
    });
    wx.setStorageSync('endTime', endTime);
  },
  //去开团
  pay: function (e) {
    if (this.data.goodsInfo.goods_num <= 0) {
      wx.showToast({
        title: '库存不足',
        image: '/asset/img/close.png',
        mask: true
      })
      return;
    }
    // if(!this.data.endTime){
    //   wx.showToast({
    //     title: '请选择截团时间',
    //     image: '/asset/img/close.png',
    //     mask : true
    //   })
    //   return;
    // }
    //跳转到订单结算页
    wx.navigateTo({
      url: '/pages/order/checkout/checkout'
    })
  },
  //返回首页
  backHome : function(e){
    app.backHome();
  }
})
