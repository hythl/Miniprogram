// miniprogram/pages/profile/profile.js
Page({
  data: {
    avatarUrl: 'https://6465-development-9g1vacijb62390af-1303839279.tcb.qcloud.la/system/user-unlogin.png?sign=3d5e2ae4c3fb68a8279a257d15d8ed2d&t=1601826027',
    nickName: '',
    userInfo: {},
    logged: false,
    learnedHours: 'xx',
    learnedMinutes: 'xx',
    loading: false,
    newTextContent: '',
    files: []
  },

  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                nickName: res.userInfo.nickName,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
  },

  onGetUserInfo: function(e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        nickName: e.detail.userInfo.nickName,
        userInfo: e.detail.userInfo
      })
    }
  },

  uploadContent: function(e) {
    if (this.data.loading) {
      return
    }
    
    const newTextContent = this.data.newTextContent
    if (!newTextContent) {
      return
    }

    this.setData({loading: true})
    const db = wx.cloud.database()
    db.collection('diary').add({
      data: {
        content: newTextContent,
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        wx.showToast({
          title: '新增记录成功',
        })
        this.setData({
          newTextContent: ''
        })
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      },
      complete: () => {
        this.setData({loading: false})
      }
    })
  },

  onInputNewContent(e) {
    this.setData({
      newTextContent: e.detail.value
    })
  },

  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
            // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
            that.setData({
                files: that.data.files.concat(res.tempFilePaths)
            });
        }
    })
  },

  previewImage: function(e){
    wx.previewImage({
        current: e.currentTarget.id, // 当前显示图片的http链接
        urls: this.data.files // 需要预览的图片http链接列表
    })
},
})