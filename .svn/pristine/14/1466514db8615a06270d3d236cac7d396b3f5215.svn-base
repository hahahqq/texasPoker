/**
 * 导入导出
 * */
const {
  export_json_to_excel
} = require("@/vendor/Export2Excel");
import XLSX from "xlsx";
import { mapState, mapGetters } from "vuex";
export default {
  TOEXCEL: {
    methods: {
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },
      export2Excel(head, val, list, title) {
        require.ensure([], () => {
          var tHeader = [...head];
          var filterVal = [...val];
          var dataList = [...list];
          var data = this.formatJson(filterVal, dataList);
          var fileName = title;
          var header = ['']
          // export_json_to_excel(tHeader, data, fileName, header);
          export_json_to_excel(tHeader, data, fileName,'');
        })
      }
    },
  },
  TODATA:{
    data() {
      return {
        outputs: [],
        outputsState: {},
        importLoading: false
      };
    },
    computed: {
      ...mapGetters({
      })
    },
    watch:{
      importState(data){
        console.log(data);
        this.importLoading = false;
        this.$message({
          showClose: true,
          message: data.message,
          type: data.success?'success':"error"
        });
      }
    },
    mounted() {
      // this.$refs.upload.addEventListener("change", e => {
      //   //绑定监听表格导入事件
      //   this.readExcel(e);
      // });
    },
    methods: {
      readExcel(e) {
        //表格导入
        var that = this;
        const files = e.target.files;
        this.importLoading = true;
        // console.log(files);
        if (files.length <= 0) {
          //如果没有文件名
          this.importLoading = false
          return false;
        } else if (!/\.(xls|xlsx)$/.test(files[0].name.toLowerCase())) {
          this.$message.error("上传格式不正确，请上传xls或者xlsx格式");
          this.importLoading = false;
          return false;
        }
        
        const fileReader = new FileReader();
        fileReader.onload = ev => {
          try {
            const data = ev.target.result;
            const workbook = XLSX.read(data, {
              type: "binary"
            });
            const wsname = workbook.SheetNames[0]; //取第一张表
            const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]); //生成json表格内容
            // console.log(ws);
            that.outputs = []; //清空接收数据
            that.outputs = [...ws];
            if(that.outputs.length>0){
              that.outputsState = {state:true}
            }else{
              that.outputsState = {state:false}
            }
            // for (var i = 0; i < ws.length; i++) {
            //   var sheetData = {
            //     address: ws[i].addr,
            //     value: ws[i].value
            //   };
            //   that.outputs.push(sheetData);
            // }
            that.$refs.upload.value = "";
          } catch (e) {
            return false;
          }
        };
        fileReader.readAsBinaryString(files[0]);
      }
    }
  }

}
