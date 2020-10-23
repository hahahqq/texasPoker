<template>
  <div class="vue-dropdown default-theme">
    <div class="search-module clearfix" v-if="inputShow == true">
        <input class="search-text" v-model="searchText" @keyup="search_mb" placeholder="输入会员手机号/姓名/卡号">
        <span style='position:absolute; right: 20px; line-height: 80px; color:#aaa'>
            该客人还未办卡,  <el-button type="text" >新建会员</el-button>
        </span>
    </div>
    <div class="ssmemberul" v-if="inputShow == false" style="border: 1px solid #f2f2f2; padding: 10px 0">
      <div class="ssmemberul-cont" >
        <div class="ssmemberul-imgUrl">
        <img :src="memberdetails.IMAGEURL" onerror="this.src='static/images/merberpic.png'">
        </div>
        <div class="ssmemberul-massge">
          <div>
              <span class="ssmemberul-cont-name">{{memberdetails.NAME}}</span>
              <span class="ssmemberul-cont-ka">{{memberdetails.LEVELNAME}}</span>
          </div>
          <div class="ssmemberul-cont-text">
              <span style="width: 120px;float:left">卡号 : {{memberdetails.CODE}}</span>
              <span style="margin-left:20px;">手机号 : {{memberdetails.MOBILENO}}</span>
          </div>
          <div class="ssmemberul-cont-text">
              <span style="width: 120px; float:left"> 储值积分 : <i style="color:#f00">{{memberdetails.MONEY}}</i> </span>
              <span style="margin-left:20px;">竞技积分 : <i style="color:#f00"> {{memberdetails.INTEGRAL}}</i>  </span>
          </div>
        </div>

        <i class="el-icon-delete" @click="delClick"></i>

        <span class="rechargeMoney" style="position:absolute; right: 15px">充值 <i class="el-icon-arrow-right"></i></span>
      </div>
    </div>
    <ul class="list-module" v-if="datalist.length != 0">
        <li v-for="(item,index) in datalist" @click="appClick(item)" :key="index">
            <img :src="item.showgoodsimg" onerror="this.src='static/images/merberpic.png'">
            <div class="itmeright">
                <div class="item_dright-left">
                    <div class="name">{{item.NAME}}</div>
                    <div class="phone">{{item.MOBILENO}}</div>
                </div>
                <div class="item_dright-right" style="line-height:24px">
                    <div>储值积分：{{item.MONEY}}</div>
                    <div>竞技积分：{{item.INTEGRAL}}</div>
                </div>
            </div>
        </li>
    </ul>
  </div>
</template>
<script>
let _ = require("lodash");
import { VIPIMAGESIMG } from "@/util/define";
import { mapState, mapGetters } from "vuex";
export default {
  data() {
    return {
      loading: false,
      searchText: "",
      inputShow:true,
      datalist: [],
      pageData: {
        PN: 1,
        Filter: ""
      },
      memberdetails: this.details || {},
      showAddNew: false,
      isshowtatus: false,
      tableData: []
    };
  },
  props: ["details", "VipId","vipInfo"],
  computed: {
    ...mapGetters({
      getssmemberdListState: "ssmemberdListState"
    })
  },
  watch: {
    getssmemberdListState(data) {
      this.loading = false;
      if (data.success) {
        if (this.isshowtatus) {
          this.datalist = [...data.data.PageData.DataArr];
          for (let i = 0; i < this.datalist.length; i++) {
            if(this.datalist[i].IMAGEURL==undefined || this.datalist[i].IMAGEURL=='' ){
              this.datalist[i].showgoodsimg = VIPIMAGESIMG + this.datalist[i].ID + '.png';
            }else{
              this.datalist[i].showgoodsimg = this.datalist[i].IMAGEURL;
            }
          };
        } else {
          this.datalist = [];
        }

        this.tableData = [...data.data.PageData.DataArr];
      }
    },
    details(data) {
      console.log(data)
      if(data.ID==undefined){
        this.inputShow=true;
        this.memberdetails.ID=null
      }else{
        this.inputShow=false;
        this.memberdetails = this.details;
      }

      console.log(this.inputShow)

      this.$store.state.dropdown.ssmemberopenID='';
    }
  },
  methods: {
    delClick(){
      this.$emit("changeMemberIDnull",1)
      this.$store.dispatch("selectingMember", {});
      this.memberdetails={}
      this.inputShow=true;
    },
    search_mb() {
      this.isshowtatus = true;
      this.searchfun();
    },
    getNewData() {
      this.$store.dispatch("getSsmemberdList", this.pageData).then(() => {
        this.loading = true;
      });
    },
    searchfun: _.debounce(function() {
      this.searchfun2();
    }, 800),
    searchfun2() {
      if (!this.searchText) {
        return;
      }
      console.log(this.pageData.Filter)
      this.pageData.Filter = this.searchText;
      this.getNewData();
    },
    appClick(data) {
      this.inputShow=false;
      this.searchText = "";
      this.datalist = [];
      this.memberdetails = data;
      this.$emit("getmemberID", data);
      if(data.OPENID==undefined || data.OPENID=='' || data.OPENID=='0'){
        this.$store.state.dropdown.ssmemberopenID='';
      }else{
        this.$store.state.dropdown.ssmemberopenID=data.OPENID;
      }
    }
  }
};

</script>
<style lang="scss" scoped>
.vue-dropdown.default-theme {
  position: relative;
  &._self-show {
    display: block !important;
  }

  .search-module {
    position: relative;

    .search-text {
      width: 100%;
      height: 80px;
      padding-right: 2em;
      padding-left: 20px;
      background:rgba(255,255,255,1);
      border-radius:2px;
      border: 1px solid #f2f2f2;
      border-radius: 6px;
    //   border: none !important;
      font-size: 12px;
      color: rgb(204, 192, 200);

      &:focus {
        border-color: #2198f2;
      }
    }

    .search-icon {
      position: absolute;
      top: 24%;
      right: 0.5em;
      color: #aaa;
    }
  }

  .list-module {
    max-height: 260px;
    overflow-y: auto;
    background: #fff;
    border: 1px solid #ddd;
    width: 100%;
    z-index: 999;
    border-top: 0;

    li {
      padding: 10px;
      overflow: hidden;
      // border-bottom: 1px solid #ccc;
      position: relative;

      img {
        width: 40px;
        height: 40px;
        float: left;
        margin-right: 6px;
      }
      .itmeright {
        align-items: center;
        display: flex;
        width: 90%;
        position: absolute;
        left: 0;
        box-sizing: border-box;
        padding-left: 50px;
        padding-right: 6px;
      }

      &._self-hide {
        display: none;
      }
      margin-top: 0.5em;
      padding: 0.5em;
      &:hover {
        cursor: pointer;
        color: #fff;
        background: #00a0e9;
      }
    }
  }
}

.ssmemberul {
    width: 100%;
    background: #fff;
    border-radius:  6px;
}
.ssmemberul-cont{
    width: 100%;
    padding-left: 15px;
    display: flex;
    align-items: center;
}
.ssmemberul-imgUrl img{
    height: 40px;
    width: 40px;
    border-radius: 100%;
}
.ssmemberul-massge{
    margin-left: 10px;
    font-size: 12px;
}
.el-icon-delete{
    margin-left: 20px;
    font-size: 16px;
}
.rechargeMoney{
    position: absolute; right: 15px
}
.el-icon-delete:hover, .rechargeMoney:hover{
    color:#409eff; cursor: pointer;
}

.ssmemberul-cont-name{
    font-size:14px;
    font-family:Microsoft YaHei;
    font-weight:400;
    color:rgba(51,51,51,1);
}
.ssmemberul-cont-ka{
    margin-left: 30px;
    font-size:8px !important;
    font-family:Microsoft YaHei;
    font-weight:400;
    color:rgba(255,255,255,1);
    background:rgba(37,137,255,1);
    border-radius:2px;
    padding: 2px 4px;

}
.ssmemberul-cont-text{
    font-size:12px;
    font-family:HelveticaCyr Upright;
    font-weight:400;
    color:rgba(153,153,153,1);
    margin-top: 5px;
}
.ssmemberul-cont-phone{
    font-size:12px;
    font-family:Microsoft YaHei;
    font-weight:300;
    color:rgba(153,153,153,1);
}
.item_dright-left .name{
    font-size: 14px;
    text-overflow:ellipsis;
    white-space: nowrap;
    width: 50%;
    overflow: hidden;
    display: inline-block;
    font-weight: bold;
}
.item_dright-left .phone{
    color: #fff;
    font-size: 12px;
}
.item_dright-right{
    width: 30%;
    text-align: left;
    color: #fff;
    font-size: 12px;
}
.item_dright-left{
    width: 40%;
    margin-left: 10px;
}
input::-webkit-input-placeholder{
    color: #C0C4CC;
    font-size: 14px;
    // padding-left: 20px;
}
::-webkit-scrollbar {width: 3px;}
::-webkit-scrollbar-track{background-color:#E3E3E5;}
::-webkit-scrollbar-thumb{background-color:#979799;}



</style>
