// pages/record/index.js
import fromNow, { computeTime } from '../../utils/moment.js'
// import { degree } from '../../utils/config.js'
// import { adapterDegree } from '../../utils/config.js'
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    records: [],
    countsAll: 0,
    recordLatest: [],
    showTip1: false,
    showTip2: false,
    loadingTip: '数据读取中...',

    /**
     * 下拉列表
     */
    degrees: ["黑铁", "青铜", "白银", "黄金", "白金", "钻石", "水晶", "大师", "王者", "最强"],
    nowText: "请选择等级",

    /**
     * 好友数据
     */
    f_records: [

      { "name": "1", "counts": "1", "time": "0:01" },
      { "name": "2", "counts": "2", "time": "0:02" },
      { "name": "3", "counts": "3", "time": "0:03" },
      { "name": "4", "counts": "4", "time": "0:04" },
      { "name": "5", "counts": "5", "time": "0:05" },
      { "name": "6", "counts": "6", "time": "0:06" },
      { "name": "7", "counts": "7", "time": "0:07" },
      { "name": "8", "counts": "8", "time": "0:08" }
      
    ]
  },

  currentCanvasImg: null,
  currentList: null,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      canvasSize: app.globalData.deviceInfo.screenWidth - 20,
    })

    // 显示当前设定等级的canvas
    let currentDegree = app.globalData.shadeDegree
    this.renderRecords(currentDegree)
    this.renderLastRecords()

    /**
     * 下拉列表
     */
     var res = wx.getSystemInfoSync();
        this.setData({
            appHeight: res.windowHeight
        });

        console.log(this.data.appHeight)

  },

  parseShadeDegree(shadeDegree) {
    if (shadeDegree === 0) {
      return 0
    } else {
      // 取个位数字返回
      return shadeDegree % 10 !== 0 ? shadeDegree % 10 : 10
    }
  },

  renderRecords(degree) {
    // console.log('in')
    // records
    let range = app.adapterDegree(degree, 'range')

    wx.getStorage({
      key: 'records',
      success: res => {
        let list = []
        let countsAll = 0
        // console.log(res.data)
        res.data.map(item => {
          let shade = parseInt(item.shadeDegree * 100)
          let selected = (shade >= range[0] && shade <= range[1]) ? true : false
          list.push({
            degree: app.adapterDegree(item.shadeDegree),
            counts: item.counts,
            showTime: item.showTime,
            recordTime: fromNow(item.recordTime),
            selected: selected
          })
          countsAll += item.counts
        })
        this.setData({
          records: list,
          countsAll: countsAll,
          loadingTip: countsAll === 0 ? '请完成一局数独再来看看吧' : '读取成功，数据渲染中...'
        })
      },
      fail: () => {
        this.setData({
          loadingTip: '请完成一局数独再来看看吧'
        })
      }
    })
  },

  renderLastRecords() {
    // 最近50条记录
    wx.getStorage({
      key: 'recordLatest',
      success: res => {
        // console.log(res)
        let list = []
        res.data.map(item => {
          list.unshift({
            recordTime: fromNow(item.recordTime),
            showTime: item.showTime,
            shadeDegree: parseInt(item.shadeDegree * 100) + '%',
            degree: app.adapterDegree(item.shadeDegree)
          })
        })
        this.setData({
          recordLatest: list
        })
      },
    })
  },

  showTip(e) {
    let type = e.currentTarget.dataset.type
    if (type === 'tip1') {
      this.setData({
        showTip1: true
      })
    } else if (type === 'tip2') {
      this.setData({
        showTip2: true
      })
    }
  },

  drawItem(e) {
    this.currentCanvasImg = null
    this.currentList = null
    let idx = e.currentTarget.dataset.idx
    // degree值为0，1，2，3，4，5，6，7，8，9
    // 为0的时候避免判断为false, 1的时候为第二级，避免为1成为第一级
    let degree = idx === 0 ? 0.1 : idx * .11
    this.renderRecords(degree)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let title
    if (this.currentList) {
      let length = this.currentList.length
      let degree = app.adapterDegree(this.currentList[0].shadeDegree / 100)
      title = `共${this.data.countsAll}局，${length}局于${degree}`
    } else {
      title = `我在sudoLite共完成${this.data.countsAll}局数独`
    }
    return {
      title: title,
      path: '/pages/index/index',
      // imageUrl: this.currentCanvasImg,
    }
  },

  /** 
   * 下拉列表
  */
  mySelect(e) {
    //console.log(e)
    var name = e.currentTarget.dataset.name
    this.setData({
      nowText: name,
      select: false
    })
  },
  bindShowMsg() {
    this.setData({
      select: !this.data.select
    })
  }
})