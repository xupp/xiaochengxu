//app.js


import config from './api/config.js'
// var mta = require('utils/mta_analysis.js')

App({
  onLaunch: function() {
    // mta.App.init({
    //   "appID": "500581924"
    // });
  },
  globalData: {
    config,
    userInfo: null
  },
  backHome : function(){
    wx.switchTab({
      url: '/pages/index/index'
    })
  }
})
