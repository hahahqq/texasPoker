import { getUserInfo } from "@/api/index";
const getparametersetup = function(parameterstatus) {
   let userInfo = getUserInfo();
   let CompanyConfig = userInfo.CompanyConfig;
   if (parameterstatus == 2) {
      return CompanyConfig.ISNEEDSALER;
   }
};

const isPurViewFun = function(v) {
   let userInfo = getUserInfo();
   if (userInfo.CODE2 == "boss") {
      return true;
   }
   let data = userInfo.List.find(item => item.MODULECODE == v);
   return data && data.ISPURVIEW == 1 ? true : false;
};

export { getparametersetup, isPurViewFun };
