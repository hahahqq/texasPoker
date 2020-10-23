import { getUserInfo, getHomeData } from "@/api/index";

const columnData = [
   {
      id: 1,
      label: "ttt",
      value: {
         InterfaceCode: "210021401A",
         AppType: 0, // 0=pc端 1=app端

         Shops: "", //门店 空=返回全部 多个=用逗号隔开
         VipCode: "", // 会员卡号/姓名
         PayTypes: "", // 支付方式 空=返回全部 多个=用逗号隔开
         PN: 1,
         CompanyId: "",

         BeginDate: new Date("2020-08-08").getTime(),
         EndDate: new Date("2020-09-29").getTime()
      }
   },
   {
      id: 2,
      label: "",
      value: {}
   },
   {
      id: 3,
      label: "",
      value: {}
   },
   {
      id: 4,
      label: "",
      value: {}
   },
   {
      id: 5,
      label: "",
      value: {}
   },
   {
      id: 6,
      label: "",
      value: {}
   },
   {
      id: 7,
      label: "",
      value: {}
   },
   {
      id: 8,
      label: "",
      value: {}
   },
   {
      id: 9,
      label: "",
      value: {}
   },
   {
      id: 10,
      label: "",
      value: {}
   },
   {
      id: 11,
      label: "",
      value: {}
   },
   {
      id: 12,
      label: "",
      value: {}
   },
   {
      id: 13,
      label: "",
      value: {}
   },
   {
      id: 14,
      label: "",
      value: {}
   },
   {
      id: 15,
      label: "",
      value: {}
   },
   {
      id: 16,
      label: "",
      value: {}
   },
   {
      id: 17,
      label: "",
      value: {}
   },
   {
      id: 18,
      label: "",
      value: {}
   },
   {
      id: 19,
      label: "",
      value: {}
   }
];

const exportDataFun = function(index, data) {
   let sendData = Object.assign({}, columnData[index - 1].value, data);
   if (sendData.hasOwnProperty("CompanyId")) {
      let homeInfo = getHomeData();
      sendData.CompanyId = homeInfo.shop.COMPANYID;
   }
   if (sendData.hasOwnProperty("Shops")) {
      delete sendData.ShopId;
      sendData.Shops = data.ShopId;
   }
   return sendData;
};
// 处理接口参数
export { exportDataFun };
