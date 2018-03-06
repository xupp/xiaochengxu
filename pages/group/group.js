/**
 * 进行中的团购列表
 */
var app = getApp();
// var mta = require('../../utils/mta_analysis.js');
Page({
  //初始化数据
  data:{
    navData : {},
    goodsData : {},
    currentCatId : 0,
    active : 0,
    showModal: false
  },
  type : 2,
  //监听页面加载
  onLoad : function(options){
    // if (wx.showLoading) {
    //   wx.showLoading({
    //     title: '加载中...',
    //     mask: true
    //   })
    //   setTimeout(function () {
    //     wx.hideLoading()
    //   }, 1000)
    // }
    this.loadNav();
    // mta.Page.init();
  },
  //监听页面初次渲染完成
  onShow : function(){
    this.loadGroupList();
  },
  //监听页面隐藏
  onHide : function(){
    clearInterval(this.timer);
  },
  //监听页面卸载
  onUnload : function(){
    clearInterval(this.timer);
  },
  // 加载导航菜单
  loadNav : function(){
    var _this = this;
    wx.request({
      url: app.globalData.config.Goodscate,
      data: {data:JSON.stringify({"parent_id":0})},
      method: 'POST',
      header: {
          'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res){
        //  wx.hideLoading(); 
        _this.setData({
          navData:res.data.data
        })
      }
    })
  },
  //根据分类加载已开团数据
  loadGroupList : function(){
    var cat_id = 0;
    if(arguments.length > 0){
        cat_id = arguments[0].currentTarget.dataset.catid;
    }
    clearInterval(this.timer);
    var _this = this;
    wx.request({
      url: app.globalData.config.group,
      data: {data:JSON.stringify({"cat_id": cat_id, is_low: _this.type})},
      method: 'POST',
      header: {
          'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res){
          var data = res.data.data;
          var timer = setInterval(function(){
              for(var i=0;i<data.length;i++){
                data[i].group_end_time = _this.timeFormat(data[i].group_off_time * 1000);
              }
              _this.setData({
                goodsData:data,
                currentCatId:cat_id
              })
            },1000)
          _this.timer = timer;
        },
    })
  },
  //格式化时间
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
  //切换团购模式
  changeType : function(e){
    var type = e.currentTarget.dataset.type;
    if(type == 'group'){
        this.setData({active:0});
        this.type = 2;
        this.loadGroupList();
    }else{
        this.setData({active:1});
        this.type = 1;
        this.loadGroupList();
    }
  },
  //跳转到参团页
  offered : function(e){
    var group_id = e.currentTarget.dataset.groupid;
    wx.navigateTo({
      url: '/pages/offered/offered?group_id=' + group_id
    })
  }
})