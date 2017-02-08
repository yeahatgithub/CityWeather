//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    temp_now: 0,
    today_weather: '',
    today_tips: '',
    city: ''
  },
  onLoad: function (options) {
    this.getCity();
    // this.loadWeatherInfo();  //不能得到城市名。估计是异步的原因。
  },

  //获取城市名
  getCity: function () {
    var page = this;
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        // console.log(latitude, longitude);

        page.location2City(latitude, longitude);
        // console.log(page.data.city);
      }
    })

  },

  //经纬度转城市
  location2City: function(latitude, longitude){
    var page = this;
    var apiRequest = "http://api.map.baidu.com/geocoder/v2/?location=" + latitude + ',' + longitude + "&output=json&ak=SgPNomXb1ZCO9peHVrRVrwzPn2GOKAoV";
    wx.request({
      url: apiRequest,
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        console.log(res.data)
        page.setData({
          city: res.data.result.addressComponent.city
        })
        page.loadWeatherInfo();
      },
      fail: function(){
        console.log("访问地图api失败。")
      }
    })
  },

  //获取城市的天气信息
  loadWeatherInfo: function(){
    var page = this;
    var city = this.data.city;
    // city.replace("市", "");
    var srvUrl = "http://api.map.baidu.com/telematics/v3/weather?location=" + city + "&output=json&ak=SgPNomXb1ZCO9peHVrRVrwzPn2GOKAoV";
    console.log(srvUrl);
    wx.request({
      url: srvUrl,
      success: function(res){
        console.log("城市天气信息", res.data);
        var temp_now = res.data.results[0].weather_data[0].temperature;
        var today_weather = res.data.results[0].weather_data[0].weather + "  " + res.data.results[0].weather_data[0].wind;
        var today_tips = res.data.results[0].index[0].title + ": " + res.data.results[0].index[0].des;
        page.setData({
            temp_now: temp_now,
            today_tips: today_tips,
            today_weather: today_weather
        })
      },
      fail: function(res){
        console.log("获取天气信息失败。", res.data);
      }
    })
  }

})
