/**
 * 用户团购详情
 */
var app = getApp();
// var mta = require('../../../../utils/mta_analysis.js');

Page({
  //初始化数据
  data : {
    groupInfo : {},
    animationData : {}
  },
  deg : 0,
  //监听页面加载
  onLoad : function(options){
    wx.setStorageSync('info_group_id', options.group_id);
    // mta.Page.init();
  },
  //监听页面隐藏
  onHide : function(){
    clearInterval(this.timer);
  },
  //监听页面卸载
  onUnload : function(){
    clearInterval(this.timer);
  },
  //监听页面显示
  onShow : function(){
    if(wx.showLoading){
      wx.showLoading({
        title : '加载中...',
        mask : true
      })
      setTimeout(function(){
        wx.hideLoading()
      },1000)
    }
    this.loadGroupInfo(wx.getStorageSync('info_group_id'))
  },
  //加载团购详情
  loadGroupInfo : function(group_id){
    var _this = this;
    var animation = wx.createAnimation();
      wx.request({
        url: app.globalData.config.goinGroup,
        data: {data:JSON.stringify({"group_id":group_id})},
        method: 'POST',
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(res){
          var data = res.data.data;
          var timer = setInterval(function(){
            var time = _this.timeFormat(data.goodsinfo.group_off_time * 1000);
            data.goodsinfo.group_end_time = time;
            data.goodsinfo.has_person = data.goodsinfo.group_low_person - data.goodsinfo.group_already_person;
            if(!time){
              _this.setData({
                groupInfo:data
              })
              return ;
            }
            _this.deg += 6;
            animation.rotate(_this.deg).step();
            _this.setData({
              groupInfo:data,
              animationData:animation.export()
            })
          },1000)  
          _this.timer = timer;
        }
      })
  },
  timeFormat : function(timestamp){
    var timestamp = timestamp;
    // setInterval(function(){
      var currentTime = (new Date()).getTime();
      var time = timestamp - currentTime;
      if(time <= 0) return false;
      var times = Math.floor(time / (1000 * 60 * 60))+':'+Math.floor(time / (1000 * 60) % 60)+':'+Math.floor(time / 1000  % 60);
      return times;
    // },1000)
  },
  backHome : function(e){
    app.backHome();
  }
})