// miniprogram/pages/tools.js
const db = wx.cloud.database();
const timerecord = db.collection('timerecord');
const addPreceedingZero = (t) => {
  return ('0' + Math.floor(t)).slice(-2);
}

Page({
  data: {
    isTiming: false,
    msg: 'Hello, this is your timer. Click button to start.',
    current: 0,
    hours: '00',
    minutes: '00',
    seconds: '00',
    exception:false,
  },

  timerButton: function() {
    const {
      isTiming,
      seconds,
      exceptions,
    } = this.data;

    if (isTiming) {
      this.endTimer()
    } else {
      this.startTimer()
    }
    
    
  },

  //开始计时
  startTimer: function() {
    const start = +new Date();
    const timer = this.data.timer;
    const hours = parseInt(this.data.hourss);
    const exception = this.data.exception;
    //循环计数和更新页面数据
    const t = setInterval(() => {
      const current = +new Date() - start;
      const hour = 60 * 60 * 1000;
      const minute = 60 * 1000;
      
      this.setData({      
        current: current,
        hours: addPreceedingZero(current / 1000 / 60 / 60),
        minutes: addPreceedingZero(current / 1000 / 60),
        seconds: addPreceedingZero(current / 1000 % 60),
      })
      if(this.data.hours>=24){// catch the exception that timer runs for more than 24 hours
        this.setData({
          exception:true,
        })
        console.log(this.data.exception)
        this.endTimer();
      }
    }, 1000);
    this.setData({
      isTiming: true,
      msg: "Timer started",
      start: start,
      timer: t,
    });
    
},

  //结束计时
  endTimer: function() {
    const {
      hours,
      seconds,
      minutes,
      timer,
      exception,//catches exception(eg: run more than 24 hours)
    } = this.data;

    if(!exception){
      wx.showModal({// a window to decide whether store or ignore this studing record after clicking end button
        title:'记录',
        content:'是否保存你的学习记录',
        success(res){
          if(res.confirm){
            timerecord.add({
              data:{
                hours:hours,
                minutes:minutes,
                seconds:seconds,
              }
            })
          }
        }
      })
    }
    
    if (timer) {
      clearInterval(timer);
    }

    this.setData({ 
      isTiming: false,
      msg: "Timer ended",
      current: 0,
      hours: '00',
      minutes: '00',
      seconds: '00',
      exception:false,
    })
   
  },

  //将本地计时数据传到云数据库
  recordTime: function() {// listed but not used in code until 10.12.2020
    timerecord.add({
      data:{
        hour:this.data.hour,
        minute:this.data.minute,
        seconds:this.data.seconds

      }
    }).then(res=>{
      console.log(res)
    })
  },
})