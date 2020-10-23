
import { SYSTEM_INFO } from "@/util/define.js";
let prefix = SYSTEM_INFO.PREFIX;


// userInfo
export const getUserInfo = function () {
  let userInfo = sessionStorage.getItem("user" + prefix + "Info") || "{}";
  userInfo = JSON.parse(userInfo);
  return userInfo;
}
export const setUserInfo = function (data) {
  let userInfo = sessionStorage.getItem("user" + prefix + "Info") || "{}";
  userInfo = JSON.parse(userInfo);
  userInfo = Object.assign(userInfo, data);
  sessionStorage.setItem("user" + prefix + "Info", JSON.stringify(userInfo));
}
// homeData
export const getHomeData = function () {
  let homeData = sessionStorage.getItem("home" + prefix + "Data") || "{}";
  homeData = JSON.parse(homeData);
  return homeData;
}
export const setHomeData = function (data) {
  let homeData = sessionStorage.getItem("home" + prefix + "Data") || "{}";
  homeData = JSON.parse(homeData);
  homeData = Object.assign(homeData, data);
  sessionStorage.setItem("home" + prefix + "Data", JSON.stringify(homeData));
}

// print
export const getPrintData = function () {
  let dd = localStorage.getItem(prefix + "print") || "{}";
  return JSON.parse(dd);
}
export const setPrintData = function (data) {
  let dd = localStorage.getItem(prefix + "print") || "{}";
  dd = Object.assign({}, JSON.parse(dd), data);
  localStorage.setItem(prefix + "print", JSON.stringify(dd));
}

// others
export const getOthersData = function () {
  let dd = localStorage.getItem(prefix + "others") || "{}";
  return JSON.parse(dd);
}
export const setOthersData = function (data) {
  let dd = localStorage.getItem(prefix + "others") || "{}";
  dd = Object.assign({}, JSON.parse(dd), data);
  localStorage.setItem(prefix + "others", JSON.stringify(dd));
}

export const clearStorage = function (type) {
  switch (type) {
    case 1: sessionStorage.removeItem("user" + prefix + "Info"); break;
    case 2: sessionStorage.removeItem("home" + prefix + "Data"); break;
    case 3: sessionStorage.removeItem(prefix + "print"); break;
    case 4: sessionStorage.removeItem(prefix + "others"); break;
    case 5: sessionStorage.clear(); // localStorage.clear();
    break;
    default:
      sessionStorage.removeItem("user" + prefix + "Info");
      sessionStorage.removeItem("home" + prefix + "Data");
      sessionStorage.removeItem(prefix + "print");
      sessionStorage.removeItem(prefix + "others");
  }
}


// 去重
export const unique = function (arr, id) {
  let result = [];
  let hash = {};
  for (let i = 0; i < arr.length; i++) {
    let elem = arr[i][id]
    if (!hash[elem]) {
      result.push(arr[i]);
      hash[elem] = true;
    }
  }
  return result;
}

export const getAroundMonth = function (dateStr, isTime = true) {
  /**
   * 月初 月末
   * 时间戳
   */
  let DStyle = '-';
  let date = dateStr ? new Date(dateStr) : new Date();
  let y = date.getFullYear();
  let m = date.getMonth() + 1;
  let firstDate = new Date(y, m, 1);
  let endDay = (new Date(firstDate.getTime() - 1000 * 60 * 60 * 24)).getDate()
  m = m < 10 ? '0' + m : m;
  let firstStr = y + DStyle + m + DStyle + '01';
  let endStr = y + DStyle + m + DStyle + endDay;
  if (isTime) {
    firstStr = new Date(firstStr).getTime()
    endStr = new Date(endStr).getTime()
  }
  return [firstStr, endStr];
}
