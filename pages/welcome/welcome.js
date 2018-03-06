// pages/welcome/welcome.js
/**
 * 欢迎页
 */
Page({
  data:{
    animationData : {},
    animationImgData : {},
    welcomeStatus : ''
  },
  onLoad:function(options){
    var _this = this;
    var animationImg = wx.createAnimation({
        duration: 400,
        timingFunction: 'ease-in-out'
    })
    animationImg.opacity(1).translateY(-50).step();
    _this.setData({
      animationImgData : animationImg.export()
    })
    setTimeout(function(){
      // var animation = wx.createAnimation({
      //       duration: 400,
      //       timingFunction: 'ease-in-out'
      //   })
      // animation.opacity(0).step();
      // _this.setData({
      //   animationData : animation.export(),
      //   welcomeStatus : 'hide'
      // })
      wx.switchTab({
        url: '/pages/index/index'
      })
    },2000)
  }
})