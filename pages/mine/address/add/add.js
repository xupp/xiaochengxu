/**
 * 添加、修改地址
 */
var app = getApp();
var city = require("../../../../utils/city.js");
var QQMapWX = require('../../../../utils/qqmap-wx-jssdk.min.js');
// var mta = require('../../../../utils/mta_analysis.js');
var qqmapsdk;
Page({
  //初始化数据
  data:{
    addressInfo : {}
  },
  address_id : '',
  //监听页面加载
  onLoad: function (options) {
    qqmapsdk = new QQMapWX({
			key: 'HPNBZ-B426V-CZQPP-UN4R6-QYOF2-MYFU3'
		});
   var _this = this;
   var address_id = options.address_id;
   if(address_id != 'undefined'){
      this.loadAddressInfo(address_id);
      this.address_id = address_id;
      _this.province = this.data.addressInfo.province;
      _this.city = this.data.addressInfo.city;
      _this.district = this.data.addressInfo.district;
   }   
   city.init(_this);
  //  mta.Page.init();
  },
  //加载地址详情
  loadAddressInfo : function(address_id){
    var addressList = wx.getStorageSync('addressList');
    for(var i=0;i<addressList.length;i++){
      if(addressList[i]['address_id'] == address_id){
        this.setData({
          addressInfo:addressList[i]
        })
      }
    }
  },
  //保存地址
  formSubmit : function(e){
    var consignee = e.detail.value.consignee,
      tel = e.detail.value.tel,
      province = this.data.city.selectedProvince,
      city = this.data.city.selectedCity,
      district = this.data.city.selectedDistrict,
      address = e.detail.value.address;
    if(consignee == '' || tel == '' || province == '' || address == ''){
      wx.showToast({
        title: '请填写相关信息',
        image: '/asset/img/close.png',
        duration : 1000,
        mask : true
      })
      return;
    }	
    if(!/1[3-8]\d{9}/.test(tel)){
      wx.showToast({
        title: '手机号不正确',
        image: '/asset/img/close.png',
        duration : 1000,
        mask : true
      })
      return;
    }
    var uid = wx.getStorageSync('uid');
    wx.request({
      url: app.globalData.config.saveAddress,
      data: { data: JSON.stringify({ uid: uid, openid: null, consignee: consignee, tel: tel, province: province, city: city, district: district, address: address, address_id: this.address_id})},
      method: 'POST',
      header: {
          'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res){
        wx.navigateBack({delta:1});
        wx.setStorageSync('addressList','');
      },
      fail: function(res) {
        // fail
      }
    })
  },
  fetchPOI: function () {
    	var _this = this;
    	// 调用接口
    	qqmapsdk.reverseGeocoder({
    		poi_options: 'policy=1',
    		get_poi: 1,
		    success: function(res) {

				// _this.setData({
				// 	areaSelectedStr: res.result.address
				// });
		    },
		    fail: function(res) {
		//         console.log(res);
		    },
		    complete: function(res) {
		//         console.log(res);
		    }
    	});
    },
  backHome : function(e){
    app.backHome();
  }
})