var app=getApp();
Page({
    data: {
        classify:['针织布','梭织布','坯布'],
        classifyCurrent:0,
        tabTxt: ['面料编号', '规格', '色别', '仓库', '货架'],//tab文案
        fabric_current:0,//面料编号
        spec_current: 0,//规格
        color_current: 0,//色别
        warehouse_current: 0,//仓库
        shelf_current: 0,//货架
        tab: [true, true, true,true, true],
        fabric: [{ name: "棉麻棉麻棉麻棉麻", id: 1 }, { name: "毛绒毛绒毛绒毛绒毛绒", id: 2 }],
        spec: [{ name: "100*200", id: 1 }, { name: "200*300", id: 2 }],
        color: [{ name: "red", id: 1 }, { name: "黑色", id: 2 }],
        warehouse: [{ name: "仓库1", id: 1 }, { name: "仓库2", id: 2 }],
        shelf: [{ name: "货架1", id: 1 }, { name: "货架2", id: 2 }],
        hidden: true,
        noData: "hide",
        display: "hide",
        page: 1,
        list: [],
        scrollHeight: 0,
        winWidth: 0
        
    },
    onShow: function () {
      var that = this;
      this.getList(that);
    },
    onLoad: function (option) {
      var that = this,
        classify = option.type,
        classifyCurrent = classify==3?2:0;
        console.log(option)
      wx.getSystemInfo({
        success: function (res) {
          that.setData({
            scrollHeight: res.windowHeight,
            winWidth: res.windowWidth,
            classifyCurrent: classifyCurrent
          });
        }
      });
    },
    onReady: function() {
        var that=this;
        that.getFabric();//面料编号选项
        that.getwarehouse();//仓库
    },
    classifySel:function(e){
      this.setData({
        classifyCurrent: e.currentTarget.dataset.idx,
        fabric_current: 0,//面料编号
        spec_current: 0,//规格
        color_current: 0,//色别
        warehouse_current: 0,//仓库
        shelf_current: 0,//货架
        fabric: [],
        spec: [],
        color: [],
        warehouse: [],
        shelf: [],
        tabTxt: ['面料编号', '规格', '色别', '仓库', '货架'],//tab文案
        page:1,
        list:[]
      })
      this.getFabric();//面料编号选项
      this.getwarehouse();//仓库
      this.getList();//获取列表
    },
    // 选项卡
    filterTab:function(e){
        var data=[true,true,true,true,true],index=e.currentTarget.dataset.index;
        data[index]=!this.data.tab[index];
        this.setData({
            tab:data
        })
    },
    // 获取面料编号选项
    getFabric: function () {
      var that = this;
      var url = app.globalData.servsers + "dy/inventory/selectFabric";//接口地址
      var token=wx.getStorageSync("token");
      var classify = Number(this.data.classifyCurrent)+1;
      wx.request({
        url: url,
        data: {
          "type": classify
        },
        header: {
          'content-type': 'application/json',
          "token": token
        },
        success: function (res) {
          var data = res.data;
          if (res.data.code == 0) {
            var list = res.data.list;
            for(var i=0,l=list.length;i<l;i++){
              var fabricInfo = JSON.parse(list[i].fabricInfo) ;
              if (classify==3){
                list[i].fabricNum = fabricInfo.clothNum
                list[i].fabricName = fabricInfo.clothName

              }else{
                list[i].fabricNum = fabricInfo.fabricNum
                list[i].fabricName = fabricInfo.fabricName
              }
             
            }
            that.setData({
              fabric:list
            })
          } else {
            app.exceptionHandle(data, "../login/login")
          }
        }
      })
    },
    // 获取规格列表
    getSpec: function (id) {
      var that = this;
      var url = app.globalData.servsers + "dy/inventory/selectSpec";//接口地址
      var token = wx.getStorageSync("token");
      var classify = Number(this.data.classifyCurrent) + 1;
      wx.request({
        url: url,
        data: {
          "fabricId": id,//面料编号id
          "type": classify
        },
        header: {
          'content-type': 'application/json',
          "token": token
        },
        success: function (res) {
          var data = res.data;
          if (res.data.code == 0) {
            var tabTxt = that.data.tabTxt;
            tabTxt[1]="规格";
            that.setData({
              tabTxt:tabTxt,
              spec_current:0,
              spec: res.data.list
            })
          } else {
            app.exceptionHandle(data, "../login/login")
          }
        }
      })
    },
    // 获取色别列表
    getColor: function (id) {
      var that = this;
      var url = app.globalData.servsers + "dy/inventory/selectColor";//接口地址
      var token = wx.getStorageSync("token");
      var classify = Number(this.data.classifyCurrent) + 1;
      wx.request({
        url: url,
        data: {
          "fabricId": id,//面料编号id
          "type": classify
          // "spec": spec
        },
        header: {
          'content-type': 'application/json',
          "token": token
        },
        success: function (res) {
          var data = res.data;
          if (res.data.code == 0) {
            var tabTxt = that.data.tabTxt;
            tabTxt[2] = "色别";
            that.setData({
              tabTxt: tabTxt,
              color_current: 0,
              color: res.data.list
            })
          } else {
            app.exceptionHandle(data, "../login/login")
          }
        }
      })
    },
    // 获取仓库列表
    getwarehouse: function (id) {
      var that = this;
      var url = app.globalData.servsers + "dy/inventory/selectStorehost";//接口地址
      var token = wx.getStorageSync("token");
      var currentTab = that.data.classifyCurrent;
      if (currentTab == 2) { var classify = "2,3" } else { var classify = "1,3" }
      // console.log(token)
      if(id==undefined)id=""
      wx.request({
        url: url,
        data: {
          "type": classify,
          "fabricId":id
        },
        header: {
          'content-type': 'application/json',
          "token": token
        },
        success: function (res) {
          var data = res.data;
          if (res.data.code == 0) {
            var tabTxt = that.data.tabTxt;
            tabTxt[3] = "仓库";
            that.setData({
              tabTxt: tabTxt,
              warehouse_current: 0,
              warehouse: res.data.list
            })
          } else {
            app.exceptionHandle(data, "../login/login")
          }

        }
      })
    },
    // 获取仓库位置（货架）
    getPlace: function (id) {
      var that = this;
      var url = app.globalData.servsers + "dy/inventory/selectShelves";//接口地址
      var token = wx.getStorageSync("token");
      wx.request({
        url: url,
        data: {
          "storehostId": id
        },
        header: {
          'content-type': 'application/json',
          "token": token
        },
        success: function (res) {
          var data=res.data;
          if (res.data.code == 0) {
            var tabTxt = that.data.tabTxt;
            tabTxt[4] = "货架";
            that.setData({
              tabTxt: tabTxt,
              shelf_current: 0,
              shelf: res.data.list
            })
          } else {
            app.exceptionHandle(data, "../login/login")
          }
        }
      })
    },
    //筛选项点击操作
    filter:function(e){
        var that=this,
            id=e.currentTarget.dataset.id,
            txt=e.currentTarget.dataset.txt,
            index = e.currentTarget.dataset.index,
            tabTxt=this.data.tabTxt;
            switch (index){
            case '0':
                tabTxt[0]=txt;
                that.setData({
                    page:1, 
                    list:[],
                    tab: [true, true, true, true, true],
                    tabTxt:tabTxt,
                    fabric_current:id
                });
                that.getSpec(id)
                that.getColor(id)
                that.getwarehouse(id)//仓库
            break;
            case '1':
                tabTxt[1]=txt;
                that.setData({
                    page:1,
                    list:[],
                    tab: [true, true, true, true, true],
                    tabTxt:tabTxt,
                    spec_current:id
                });
                
            break;
            case '2':
                tabTxt[2]=txt;
                that.setData({
                    page:1,
                    list:[],
                    tab: [true, true, true, true, true],
                    tabTxt:tabTxt,
                    color_current:id
                });
            break;
            case '3':
              tabTxt[3] = txt;
              that.setData({
                page: 1,
                list: [],
                tab: [true, true, true, true, true],
                tabTxt: tabTxt,
                warehouse_current:id
              });
              that.getPlace(id)
              break;
            case '4':
              tabTxt[4] = txt;
              that.setData({
                page: 1,
                list: [],
                tab: [true, true, true, true, true],
                tabTxt: tabTxt,
                shelf_current: id
              });
              break;
        }
        //数据筛选
        that.getList();
    },
    onPullDownRefresh: function () {
      console.log("下拉");
      var that = this;
      that.setData({
        page: 1,
        list: [],
        scrollTop: 0
      });
      that.getList(that)
    },
    onReachBottom: function () {
      console.log("上拉");
      var that = this;
      that.getList(that);
    },
    // 获取数据
    getList: function () {
      var that=this;
      var url = app.globalData.servsers + "dy/inventory/list";
      var token = wx.getStorageSync("token");//获取token值
      var page = that.data.page;
      var classify = Number(that.data.classifyCurrent) + 1;//类型
      var fabricId = that.data.fabric_current == 0 ? "" : that.data.fabric_current;//面料编号
      var spec = that.data.tabTxt[1] == "规格" ? "" : that.data.tabTxt[1];//规格
      var color = that.data.tabTxt[2] == "色别" ? "" : that.data.tabTxt[2];//色别
      var storehostId = that.data.warehouse_current == 0 ? "" : that.data.warehouse_current;//仓库id
      var shelvesId = that.data.shelf_current == 0 ? "" : that.data.shelf_current;//货架id
      console.log(fabricId)
      that.setData({
        hidden: false
      });
      wx.request({
        url: url,
        data: {
          "page": page,
          "limit": 10,
          "type": classify,
          "fabricId": fabricId,
          "spec": spec,
          "color": color,
          "storehostId": storehostId,
          "shelvesId": shelvesId,
        },
        header: {
          'content-type': 'application/json', // 默认值
          "token": token
        },
        success: function (res) {
          var data = res.data;
          console.log(data)
          if (data.code == 0) {
            that.dataProcessing(data, page)//数据处理
            wx.stopPullDownRefresh();
          } else {
            app.exceptionHandle(data, "../login/login")
          }

        }
      });
    },
    // 数据处理
    dataProcessing: function (data, page) {
      var that = this,
        l = that.data.list,
        noData = that.data.noData,
        dataList = data.page.list;
      if (page == 1 && dataList.length < 1) { noData = "show" } else { noData = "hide" }
      if (dataList.length < 1) {
        that.setData({
          display: "show"
        });
      } else {
        that.setData({
          display: "hide"
        });
      }
      console.log(dataList)
      for (var i = 0; i < dataList.length; i++) {
        dataList[i].fabricInfo = JSON.parse(dataList[i].fabricInfo);//面料信息
        var fabricName = dataList[i].fabricInfo.fabricName;
        if (fabricName==undefined){
          dataList[i].fabricInfo.fabricName = dataList[i].fabricInfo.clothName;
          dataList[i].fabricInfo.fabricNum = dataList[i].fabricInfo.clothNum;
          dataList[i].spec = dataList[i].fabricInfo.clothSpec;
        }
        console.log(dataList[i].fabricInfo.fabricName)
        
        // 多柜处理
        var shelves = dataList[i].inventoryStorehosts,
            shelvesLength=shelves.length;
        if (shelvesLength > 1) {
           dataList[i]["isMulti"] = 1;
           var num=0,bolt=0,lockNum=0,lockBolt=0;
           for (var j = 0; j < shelvesLength;j++){
             num += shelves[j].num;
             bolt += shelves[j].bolt;
             lockNum += shelves[j].lockNum;
             lockBolt += shelves[j].lockBolt;
           }
           dataList[i]["num"] = num;
           dataList[i]["bolt"] = bolt;
           dataList[i]["lockNum"] = lockNum;
           dataList[i]["lockBlot"] = lockBolt;
           // 匹数数量处理
           dataList[i].realNum = (num - lockNum).toFixed(2)
           
        } else { dataList[i]["isMulti"] = 0}
        // end 多柜处理
        l.push(dataList[i])
      }

      that.setData({
        list: l
      });
      page++;
      that.setData({
        page: page,
        hidden: true,
        noData: noData
      });
    },
    kindToggle: function (e) {
      var id = e.currentTarget.id, list = this.data.list;
      for (var i = 0, len = list.length; i < len; ++i) {
        if (list[i].id == id) {
          list[i].open = !list[i].open
        } else {
          list[i].open = false
        }
      }
      this.setData({
        list: list
      });
    }
});