import dayjs from "dayjs";
const columnData = [
   {
      id: 1,
      label: "ttt",
      head: ["会员名", "手机号码", "项目", "有效期", "剩余次数"],
      bodyLabel: ["NAME", "MOBILENO", "GOODSNAME", "INVALIDDATE", "CALCCOUNT", "LASTTIME"]
   },
   {
      id: 2,
      label: "",
      head: [],
      bodyLabel: []
   },
   { id: 3, label: "", head: [], bodyLabel: [] },
   { id: 4, label: "", head: [], bodyLabel: [] },
   { id: 5, label: "", head: [], bodyLabel: [] },
   {
      id: 6,
      label: "",
      head: [],
      bodyLabel: []
   },
   {
      id: 7,
      label: "",
      head: [],
      bodyLabel: []
   },
   {
      id: 8,
      label: "",
      head: [],
      bodyLabel: []
   },
   {
      id: 9,
      label: "",
      head: [],
      bodyLabel: []
   },
   {
      id: 10,
      label: "",
      head: [],
      bodyLabel: []
   },
   {
      id: 11,
      label: "",
      head: [],
      bodyLabel: []
   },
   { id: 12, label: "", head: [], bodyLabel: [] },
   {
      id: 13,
      label: "",
      head: [],
      bodyLabel: []
   },
   {
      id: 14,
      label: "",
      head: [],
      bodyLabel: []
   },
   {
      id: 15,
      label: "",
      head: [],
      bodyLabel: []
   },
   {
      id: 16,
      label: "",
      head: [],
      bodyLabel: []
   },
   {
      id: 17,
      label: "",
      head: [],
      bodyLabel: []
   },
   {
      id: 18,

      label: "",
      head: [],
      bodyLabel: []
   },
   {
      id: 19,
      label: "",
      head: [],
      bodyLabel: []
   }
];
const exportTableFun = function(index, arr) {
   let sendData = Object.assign({}, columnData[index - 1]);
   let list = [...arr];
   if (!sendData.id) {
      return {};
   }

   return {
      head: sendData.head,
      val: sendData.bodyLabel,
      list: list,
      title: sendData.label + new Date().getTime()
   };
};
// 导出excel
const { export_json_to_excel } = require("@/vendor/Export2Excel");
const export2Excel = function(index, arr, callback) {
   let sendData = Object.assign({}, columnData[index - 1]);
   if (!sendData.id) {
      callback({ state: false });
   }
   require.ensure([], () => {
      let tHeader = [...sendData.head]; // 设置Excel的表格第一行的标题
      let filterVal = [...sendData.bodyLabel]; // 对象的属性
      let jsonData = [...arr]; // 数据
      let data = jsonData.map(v => filterVal.map(j => v[j]));
      let fileName = sendData.label + new Date().getTime(); // 文件名称
      export_json_to_excel(tHeader, data, fileName, "");
      callback({ state: true });
   });
};

export { exportTableFun, export2Excel };
