//index.js
/**
 * 首页
 */
//获取应用实例
var app = getApp();
// var mta = require('../../utils/mta_analysis.js');

Page({
  //初始化数据
  data: {
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    navData : {},
    swiperData : [],
    swiperStatus : false,
    goodsData : {},
    currentCatId : 0,
    showModal: false
  },
  //监听页面加载
  onLoad : function(options){
    this.loadNav();
    this.loadSwiper();
    this.loadGoods();
    // mta.Page.init();
  },
  onShow: function () {
    //检测是否授权
    var auth = wx.getStorageSync('auth');
    if (!auth) {
      this.userAuth();
      return
    }
  },
  // 加载导航菜单
  loadNav: function () {
    var _this = this;
    wx.request({
      url: app.globalData.config.Goodscate,
      data: {data:JSON.stringify({"parent_id":0})},
      method: 'POST',
      header: {
          'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        _this.setData({
          navData:res.data.data
        })
      },
      fail: function (res) {
      }
    })
  },
  //加载轮播图
  loadSwiper : function(){
    var _this = this;
    var swiperData = [];
    wx.request({
      url: app.globalData.config.Ad,
      success: function(res){
        var data = res.data.data; 
        _this.setData({
          swiperData:data
        })
      },
      fail: function(res) {
        // fail
      }
    })
  },
  //加载首页商品
  loadGoods : function(){
    var _this = this;
      wx.request({
        url: app.globalData.config.getGoods,
        data: {data:JSON.stringify({"is_goods":1})},
        method: 'POST',
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(res){
          _this.setData({
            goodsData:res.data.data,
            swiperStatus:false,
            currentCatId:0
          })
          // wx.hideLoading()
        },
        fail: function(res) {
          // fail
        }
      })
  },
  //加载分类下商品
  getCateGoods : function(e){
     var catid = e.currentTarget.dataset.catid;
     var _this = this;
      wx.request({
        url: app.globalData.config.getGoods,
        data: {data:JSON.stringify({"catid":catid})},
        method: 'POST',
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(res){
          _this.setData({
            goodsData:res.data.data,
            swiperStatus:true,
            currentCatId:catid
          })
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
  //分享
  onShareAppMessage : function(){
    return {
      title : '搭伴团购',
      path : '/pages/index/index'
    }
  },
  userAuth: function () {
    var _this = this
    var user = {};
    wx.login({
      success: (res) => { 
        _this.getUserInfo(res.code)
      }
    })
  },
  getUserInfo: function(code) {
    var _this = this;
    wx.getUserInfo({
      success: function (res) {
        wx.setStorageSync('auth','success');
        var $post = {
          code,
          encryptedData : res.encryptedData,
          iv : res.iv
        }
        wx.request({    
          url: app.globalData.config.regSmallUser,    
          data: {data:JSON.stringify($post)},
          method: 'POST',
          header: {
              'content-type': 'application/x-www-form-urlencoded'
          },
          success: function(res){ 
            wx.setStorageSync('openId',res.data); 
            _this.userLogin();
          }
        })
        // _this.setData({
        //   showModal: false
        // }) 
      },
      fail: function(){
        // _this.setData({
        //   showModal: true
        // })
        wx.openSetting()
      }  
    })    
  },
  confirm: function(){
    wx.openSetting({
      success: (res) => {
        if (res.authSetting["scope.userInfo"]) {//如果用户重新同意了授权登录
          // _this.setData({
          //   showModal: false
          // })
          // wx.setStorageSync('auth', 'success');
          // wx.getUserInfo({
          //   success: function (res) {
          //     var $post = {
          //       code: _this.code,
          //       encryptedData: res.encryptedData,
          //       iv: res.iv
          //     }
          //     wx.request({
          //       url: app.globalData.config.regSmallUser,
          //       data: { data: JSON.stringify($post) },
          //       method: 'POST',
          //       header: {
          //         'content-type': 'application/x-www-form-urlencoded'
          //       },
          //       success: function (res) {
          //         wx.setStorageSync('openId', res.data);
          //       }
          //     }) 
          //   }
          // })
        }
      }
    })
  },
  //用户登录
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
        if (res.data.data) {
          wx.setStorageSync('uid', res.data.data.id);
        }
      }
    })
  }  
})
