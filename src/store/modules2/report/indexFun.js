import { getUserInfo, getHomeData } from "@/api/index";

// import { indexQuery } from "@/store/modules2/report/indexFun.js";
// indexQuery.fun(this, "", sendData);

const indexQuery = {
   management: function(that, type = "data", data) {
      // 营业概况
      if (!data.ShopId) {
         that.$message.error("请选择店铺");
         return;
      }
      let homeInfo = getHomeData();
      let sendData = {
            InterfaceCode: "9207001",
            CompanyId: homeInfo.shop.COMPANYID,
            ShopId: data.ShopId,
            BeginDate: data.BeginDate ? data.BeginDate : 1,
            EndDate: data.EndDate ? data.EndDate : 9999999999999
         },
         methodName = "getList";
      switch (type) {
         case "managementA":
            // 营业概况_充值
            sendData.InterfaceCode = "9207001A";
            sendData.PN = data.PN ? data.PN : 1;
            break;
         case "managementB":
            // 营业概况_赛事
            sendData.InterfaceCode = "9207001B";
            sendData.PN = data.PN ? data.PN : 1;
            break;
         case "managementC":
            // 营业概况_商品销售
            sendData.InterfaceCode = "9207001C";
            sendData.PN = data.PN ? data.PN : 1;
            break;
         case "managementD":
            // 营业概况_快速消费
            sendData.InterfaceCode = "9207001D";
            sendData.PN = data.PN ? data.PN : 1;
            break;
         case "managementE":
            // 营业概况_调整积分
            sendData.InterfaceCode = "9207001E";
            sendData.PN = data.PN ? data.PN : 1;
            break;
         case "managementF":
            // 营业概况_会员
            sendData.InterfaceCode = "9207001F";
            sendData.PN = data.PN ? data.PN : 1;
            break;
         default:
            methodName = "actionsData";
      }
      that.$store
         .dispatch(methodName, {
            type: type,
            sendData: sendData
         })
         .then(() => {});
   },
   balance: function(that, type = "data", data) {
      // 收支结余
      if (!data.ShopId) {
         that.$message.error("请选择店铺");
         return;
      }
      let homeInfo = getHomeData();
      let sendData = {
            InterfaceCode: "9207002",
            CompanyId: homeInfo.shop.COMPANYID,
            ShopId: data.ShopId,
            BeginDate: data.BeginDate ? data.BeginDate : 1,
            EndDate: data.EndDate ? data.EndDate : 9999999999999
         },
         methodName = "getList";
      switch (type) {
         case "balanceA":
            // 收支结余_商品销售明细
            sendData.InterfaceCode = "9207002A";
            sendData.PN = data.PN ? data.PN : 1;
            break;
         case "balanceB":
            // 收支结余_会员消费明细
            sendData.InterfaceCode = "9207002B";
            sendData.PN = data.PN ? data.PN : 1;
            break;
         case "balanceC":
            // 收支结余_充值明细
            sendData.InterfaceCode = "9207002C";
            sendData.PN = data.PN ? data.PN : 1;
            break;
         case "balanceD":
            // 收支结余_支出明细
            sendData.InterfaceCode = "9207002D";
            sendData.PN = data.PN ? data.PN : 1;
            break;
         case "balanceE":
            // 收支结余_还款明细
            sendData.InterfaceCode = "9207002E";
            sendData.PN = data.PN ? data.PN : 1;
            break;
         case "balanceF":
            // 收支结余_欠款明细
            sendData.InterfaceCode = "9207002F";
            sendData.PN = data.PN ? data.PN : 1;
            break;
         case "balanceG":
            // 收支结余_支付方式明细
            sendData.InterfaceCode = "9207002G";
            sendData.PN = data.PN ? data.PN : 1;
            break;
         default:
            methodName = "actionsData";
      }
      that.$store.dispatch(methodName, {
         type: type,
         sendData: sendData
      });
   },
   cashier: function(that, type = "data", data) {
      // 收银对账
      if (!data.ShopId) {
         that.$message.error("请选择店铺");
         return;
      }
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: "9207003",
         CompanyId: homeInfo.shop.COMPANYID,
         ShopId: data.ShopId,
         BeginDate: data.BeginDate ? data.BeginDate : 1,
         EndDate: data.EndDate ? data.EndDate : 9999999999999
      };
      that.$store.dispatch("actionsData", {
         type: type,
         sendData: sendData
      });
   },

   match: function(that, type = "data", data) {
      // 赛事盈利分析
      if (!data.ShopId) {
         that.$message.error("请选择店铺");
         return;
      }
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: "9207004",
         CompanyId: homeInfo.shop.COMPANYID,
         ShopId: data.ShopId,
         BeginDate: data.BeginDate ? data.BeginDate : 1,
         EndDate: data.EndDate ? data.EndDate : 9999999999999,
         MatchType: data.MatchType ? dataMatchType : "-1", // -1=全部,0=SNG,1=MTT,2=猎人赛,3=自由赛
         MatchName: data.MatchName ? data.MatchName : "",
         PN: data.PN ? data.PN : 1
      };
      that.$store.dispatch("getList", {
         type: type,
         sendData: sendData
      });
   },
   matchItem: function(that, type = "data", data) {
      // 赛事盈利分析
      if (!data.ShopId) {
         that.$message.error("请选择店铺");
         return;
      }
      if (!data.BillId) {
         that.$message.error("参数有误");
         return;
      }
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: "9207004A",
         CompanyId: homeInfo.shop.COMPANYID,
         ShopId: data.ShopId,
         BillId: data.BillId
      };
      that.$store.dispatch("actionsData", {
         type: type,
         sendData: sendData
      });
   },
   matchProList: function(that, type = "data", data) {
      // 比赛项目分析
      if (!data.ShopId) {
         that.$message.error("请选择店铺");
         return;
      }
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: "9207005",
         CompanyId: homeInfo.shop.COMPANYID,
         ShopId: data.ShopId,
         BeginDate: data.BeginDate ? data.BeginDate : 1,
         EndDate: data.EndDate ? data.EndDate : 9999999999999,
         OrderType: data.OrderType ? data.OrderType : 0, // 0=盈利,1=服务费,2=买入积分,3=总手数,4=参赛人数
         PN: data.PN ? data.PN : 1
      };
      that.$store.dispatch("getList", {
         type: type,
         sendData: sendData
      });
   },
   matchCheckIn: function(that, type = "data", data) {
      // 比赛登记统计
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: "9207037",
         CompanyId: homeInfo.shop.COMPANYID,
         Shops: data.ShopId ? data.ShopId : "", // 空=返回全部 多个=用逗号隔开
         BeginDate: data.BeginDate ? data.BeginDate : 1,
         EndDate: data.EndDate ? data.EndDate : 9999999999999,
         VipCode: data.VipCode ? data.VipCode : "", //会员卡号姓名、赛事名称、单号
         PN: data.PN ? data.PN : 1
      };
      that.$store.dispatch("getList", {
         type: type,
         sendData: sendData
      });
   },

   consume: function(that, type = "data", data) {
      if (!data.ShopId && type != "fast") {
         that.$message.error("请选择店铺");
         return;
      }
      let homeInfo = getHomeData();
      let sendData = {
            InterfaceCode: type == "hour" ? "9207006" : "9207007",
            CompanyId: homeInfo.shop.COMPANYID,
            BeginDate: data.BeginDate ? data.BeginDate : 1,
            EndDate: data.EndDate ? data.EndDate : 9999999999999
         },
         shopId = data.ShopId ? data.ShopId : "",
         methodName = "actionsData";
      switch (type) {
         case "hour":
            // 消费时段分析，按小时
            sendData.InterfaceCode = "9207006";
            sendData.ShopId = shopId;
            break;
         case "week":
            // 消费时段分析，按星期
            sendData.InterfaceCode = "9207007";
            sendData.ShopId = shopId;
            break;
         case "fast":
            // 快速消费统计
            sendData.InterfaceCode = "9207033";
            sendData = Object.assign(sendData, {
               Shops: shopId, // 空=返回全部 多个=用逗号隔开
               PayTypes: data.PayTypes ? data.PayTypes : "", // 支付方式, 空=返回全部 多个=用逗号隔开
               VipCode: data.VipCode ? data.VipCode : "",
               PN: data.PN ? data.PN : 1
            });
            methodName = "getList";
            break;
         default:
            console.log(type);
            sendData.InterfaceCode = "";
      }
      if (!sendData.InterfaceCode) {
         that.$message.error("接口有误");
         return;
      }
      that.$store.dispatch(methodName, {
         type: type,
         sendData: sendData
      });
   },
   sale: function(that, type = "data", data) {
      // 销售分析
      if (!data.ShopId) {
         that.$message.error("请选择店铺");
         return;
      }
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: "9207010",
         CompanyId: homeInfo.shop.COMPANYID,
         ShopId: data.ShopId,
         BeginDate: data.BeginDate ? data.BeginDate : 1,
         EndDate: data.EndDate ? data.EndDate : 9999999999999
      };
      that.$store.dispatch("actionsData", {
         type: type,
         sendData: sendData
      });
   },
   saleItem: function(that, type = "data", data) {
      // 销售分析明细
      if (!data.ShopId) {
         that.$message.error("请选择店铺");
         return;
      }
      if (!data.DateStr) {
         that.$message.error("参数有误");
         return;
      }
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: "9207010A",
         CompanyId: homeInfo.shop.COMPANYID,
         ShopId: data.ShopId,
         DateStr: data.DateStr,
         OrderType: data.OrderType ? data.OrderType : 0 // 0=按金额，1=按数量
      };
      that.$store.dispatch("getList", {
         type: type,
         sendData: sendData
      });
   },

   goods: function(that, type = "data", data) {
      // 商品分析
      if (!data.ShopId) {
         that.$message.error("请选择店铺");
         return;
      }
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: "9207011",
         CompanyId: homeInfo.shop.COMPANYID,
         ShopId: data.ShopId,
         BeginDate: data.BeginDate ? data.BeginDate : 1,
         EndDate: data.EndDate ? data.EndDate : 9999999999999,
         OrderType: data.OrderType ? data.OrderType : 0, // 0=金额，1=数量
         Filter: data.Filter ? data.Filter : "",
         GoodsMode: data.GoodsMode, // -1=全部，0=服务，1=商品
         PN: data.PN ? data.PN : 1
      };
      that.$store.dispatch("getList", {
         type: type,
         sendData: sendData
      });
   },
   goodsItem: function(that, type = "data", data) {
      // 商品分析详情
      if (!data.ShopId) {
         that.$message.error("请选择店铺");
         return;
      }
      if (!data.GoodsId) {
         that.$message.error("参数有误");
         return;
      }
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: "9207011A",
         CompanyId: homeInfo.shop.COMPANYID,
         Shops: data.ShopId, // 空=返回全部 多个=用逗号隔开
         BeginDate: data.BeginDate ? data.BeginDate : 1,
         EndDate: data.EndDate ? data.EndDate : 9999999999999,
         AppType: 0, // 客户端类型 0=pc端 1=app端
         Goodsid: data.GoodsId,
         PN: data.PN ? data.PN : 1
      };
      that.$store.dispatch("getList", {
         type: type,
         sendData: sendData
      });
   },
   shop: function(that, type = "data", data) {
      // 店铺分析 type = day / sum
      if (!data.ShopId) {
         that.$message.error("请选择店铺");
         return;
      }
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: type == "day" ? "9207012" : "9207012A",
         CompanyId: homeInfo.shop.COMPANYID,
         ShopListId: data.ShopId, // 16853,16854
         BeginDate: data.BeginDate ? data.BeginDate : 1,
         EndDate: data.EndDate ? data.EndDate : 9999999999999,
         PN: data.PN ? data.PN : 1
      };
      that.$store.dispatch("getList", {
         type: "shop",
         sendData: sendData
      });
   },
   member: function(that, type = "data", data) {
      // 会员概况
      if (!data.ShopId) {
         that.$message.error("请选择店铺");
         return;
      }
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: "9207013",
         CompanyId: homeInfo.shop.COMPANYID,
         ShopListId: data.ShopId, // 16853,16854
         BeginDate: data.BeginDate ? data.BeginDate : 1,
         EndDate: data.EndDate ? data.EndDate : 9999999999999,
         Type: data.Type ? data.Type : 0 // 1=新增会员,2=到店客次,3=到店客数,其他=会员总数
      };
      that.$store.dispatch("actionsData", {
         type: type,
         sendData: sendData
      });
   },
   memberRegChart: function(that, type = "data", data) {
      // 会员概况_注册分布
      if (!data.ShopId) {
         that.$message.error("请选择店铺");
         return;
      }
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: "9207014",
         CompanyId: homeInfo.shop.COMPANYID,
         ShopListId: data.ShopId, // 16853,16854
         BeginDate: data.BeginDate ? data.BeginDate : 1,
         EndDate: data.EndDate ? data.EndDate : 9999999999999
      };
      that.$store.dispatch("actionsData", {
         type: type,
         sendData: sendData
      });
   },
   memberRegister: function(that, type = "data", data) {
      // 会员注册统计 日报,月报
      if (!data.ShopId) {
         that.$message.error("请选择店铺");
         return;
      }
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: "9207015",
         CompanyId: homeInfo.shop.COMPANYID,
         ShopListId: data.ShopId, // 16853,16854
         Type: data.Type ? data.Type : 0, // 0=日报 1=月报
         PN: data.PN ? data.PN : 1
      };
      that.$store.dispatch("getList", {
         type: type,
         sendData: sendData
      });
   },
   memberRegisterItem: function(that, type = "data", data) {
      // 会员注册统计详情
      if (!data.ShopId) {
         that.$message.error("请选择店铺");
         return;
      }
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: "9207015A",
         CompanyId: homeInfo.shop.COMPANYID,
         ShopListId: data.ShopId, // 16853,16854
         BeginDate: data.BeginDate ? data.BeginDate : 1,
         EndDate: data.EndDate ? data.EndDate : 9999999999999,
         PN: data.PN ? data.PN : 1
      };
      that.$store.dispatch("getList", {
         type: type,
         sendData: sendData
      });
   },
   memberRecharge: function(that, type = "data", data) {
      // 会员充值统计
      if (!data.ShopId) {
         that.$message.error("请选择店铺");
         return;
      }
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: "9207031",
         CompanyId: homeInfo.shop.COMPANYID,
         Shops: data.ShopId, // 16853,16854
         BeginDate: data.BeginDate ? data.BeginDate : 1,
         EndDate: data.EndDate ? data.EndDate : 9999999999999,
         VipCode: data.VipCode ? data.VipCode : "",
         PayTypes: data.PayTypes ? data.PayTypes : "", // 支付方式, 空=返回全部 多个=用逗号隔开
         AppType: 0, // 客户端类型 0=pc端 1=app端
         PN: data.PN ? data.PN : 1
      };
      that.$store.dispatch("getList", {
         type: type,
         sendData: sendData
      });
   },
   memberAward: function(that, type = "data", data) {
      // 会员领奖统计
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: "9207036",
         CompanyId: homeInfo.shop.COMPANYID,
         Shops: data.ShopId ? data.ShopId : "", // 16853,16854
         BeginDate: data.BeginDate ? data.BeginDate : 1,
         EndDate: data.EndDate ? data.EndDate : 9999999999999,
         VipCode: data.VipCode ? data.VipCode : "",
         PayTypes: data.PayTypes ? data.PayTypes : "", // 支付方式, 空=返回全部 多个=用逗号隔开
         PN: data.PN ? data.PN : 1
      };
      that.$store.dispatch("getList", {
         type: type,
         sendData: sendData
      });
   },
   goodsSale: function(that, type = "data", data) {
      // 商品销售
      let homeInfo = getHomeData();
      let sendData = {
            InterfaceCode: "9207032",
            CompanyId: homeInfo.shop.COMPANYID,
            BeginDate: data.BeginDate ? data.BeginDate : 1,
            EndDate: data.EndDate ? data.EndDate : 9999999999999,
            PN: data.PN ? data.PN : 1
         },
         shopId = data.ShopId ? data.ShopId : "";
      switch (type) {
         case "goodsSaleA":
            // 商品销售_汇总分析(商品汇总)
            sendData.InterfaceCode = "9207032A";
            sendData.ShopId = shopId; // 单个店铺ID,为空表示全部
            sendData.OrderType = data.OrderType ? 1 : 0; // 0=金额，1=数量
            sendData.Filter = data.Filter ? data.Filter : "";
            break;
         case "goodsSaleB":
            // 商品销售_日期汇总
            sendData.InterfaceCode = "9207032B";
            sendData.ShopId = shopId; // 单个店铺ID,为空表示全部
            sendData.Filter = data.Filter ? data.Filter : "";
            break;
         case "goodsSaleC":
            // 商品销售_销售明细
            sendData.InterfaceCode = "9207032C";
            sendData = Object.assign(sendData, {
               Shops: shopId, // 空=返回全部 多个=用逗号隔开
               PayTypes: data.PayTypes ? data.PayTypes : "", // 支付方式, 空=返回全部 多个=用逗号隔开
               VipCode: data.VipCode ? data.VipCode : ""
            });
            break;
         default:
            // 销售单据
            sendData = Object.assign(sendData, {
               Shops: shopId, // 空=返回全部 多个=用逗号隔开
               PayTypes: data.PayTypes ? data.PayTypes : "", // 支付方式, 空=返回全部 多个=用逗号隔开
               VipCode: data.VipCode ? data.VipCode : "",
               AppType: 0 // 客户端类型 0=pc端 1=app端
            });
      }
      that.$store.dispatch("getList", {
         type: type,
         sendData: sendData
      });
   },
   integral: function(that, type = "data", data) {
      // 积分
      let homeInfo = getHomeData();
      let sendData = {
         InterfaceCode: "",
         CompanyId: homeInfo.shop.COMPANYID,
         Shops: data.ShopId ? data.ShopId : "", // 空=返回全部 多个=用逗号隔开
         BeginDate: data.BeginDate ? data.BeginDate : 1,
         EndDate: data.EndDate ? data.EndDate : 9999999999999,
         PN: data.PN ? data.PN : 1,
         VipCode: data.VipCode ? data.VipCode : ""
      };
      if (type == "adjust") {
         // 积分调整统计
         sendData.InterfaceCode = "9207035";
         sendData.PayTypes = data.PayTypes ? data.PayTypes : ""; // 支付方式, 空=返回全部 多个=用逗号隔开
         sendData.AppType = 0; // 客户端类型 0=pc端 1=app端
      }
      if (type == "award") {
         // 奖励积分统计
         sendData.InterfaceCode = "9207038";
      }

      if (!sendData.InterfaceCode) {
         that.$message.error("接口有误");
         return;
      }
      that.$store.dispatch("getList", {
         type: type,
         sendData: sendData
      });
   }
};

export { indexQuery };
