<template>
  <el-container>
    <el-header style="height: 50px">
      <headerPage></headerPage>
    </el-header>
    <el-container>
      <el-aside width="100px">
        <section style="min-width: 100px">
          <memberMenu :activePath="activePath" :routesList="routesList" :width="100"></memberMenu>
        </section>
      </el-aside>
      <el-container>
        <el-main :style="`height:${ height}px; margin: 10px; background:#fff`">
          <div class="myShop">
            <el-row>
              <div class="myShop-bacse">
                <div class="dmt"></div>
                <div><span class="h5">商家信息</span></div>
                <div style="margin-left: 15px">
                  <el-button type="text" @click="showEdit = true">修改</el-button>
                </div>
              </div>
              <div class="myShop-bacse-cont m-top-sm">
                <ul>
                  <li>
                    <div class="myShop-logo">
                      <div>商家logo :</div>
                      <img :src="sysLogo" class="inline-block full-width" />
                    </div>
                  </li>
                  <li class="myShop-logo">
                    商家名称 :&nbsp;
                    <span>{{ dataInfo.name == "undefined" ? "" : dataInfo.name }}</span>
                  </li>
                  <li class="myShop-logo">
                    联系人 :&nbsp;
                    <span>{{ dataInfo.linker == "undefined" ? "" : dataInfo.linker }}</span>
                  </li>
                  <li class="myShop-logo">
                    联系电话 :&nbsp;
                    <span>{{ dataInfo.phoneno == "undefined" ? "" : dataInfo.phoneno }}</span>
                  </li>
                  <li class="myShop-logo">
                    联系地址 :&nbsp;
                    <span>{{ dataInfo.address == "undefined" ? "" : dataInfo.address }}</span>
                  </li>
                </ul>
              </div>
            </el-row>
            <el-row>
              <div class="myShop-bacse">
                <div class="dmt"></div>
                <div><span class="h5">店铺信息</span></div>
                <div style="margin-left: 15px">
                  <el-button type="text" @click="editShopfun">修改</el-button>
                </div>
              </div>
              <div class="myShop-bacse-cont">
                <ul>
                  <li class="myShop-logo">
                    店铺名称 :&nbsp;
                    <span>{{ getMyShop.NAME }}</span>
                  </li>
                  <li class="myShop-logo">
                    有效时间 :&nbsp;
                    <span v-if="getMyShop.INVALIDDATE != undefined">
                      {{ new Date(getMyShop.INVALIDDATE) | time }}
                    </span>
                  </li>
                  <li class="myShop-logo">
                    联系人 :&nbsp;
                    <span>{{ getMyShop.MANAGER }}</span>
                  </li>
                  <li class="myShop-logo">
                    联系电话 :&nbsp;
                    <span>{{ getMyShop.PHONENO }}</span>
                  </li>
                  <li class="myShop-logo">
                    店铺地址 :&nbsp;
                    <span>{{ getMyShop.ADDRESS }}</span>
                  </li>
                  <li class="myShop-logo">
                    注册时间 :&nbsp;
                    <span v-if="getMyShop.WRITETIME != undefined">
                      {{ new Date(getMyShop.WRITETIME) | time }}
                    </span>
                  </li>
                </ul>
              </div>
            </el-row>

            <el-dialog
              width="500px"
              title="修改商家信息"
              :visible.sync="showEdit"
              append-to-body
              style="max-width: 100%"
            >
              <editPage
                @closeModal="showEdit = false"
                @resetList="
                  showEdit = false;
                  resetInfo_fun();
                "
                :propsData="{ state: showEdit }"
              ></editPage>
            </el-dialog>

            <el-dialog width="700px" title="修改店铺信息" :visible.sync="showEdit2" append-to-body>
              <editShopPage
                @closeModal="showEdit2 = false"
                @resetList="
                  showEdit2 = false;
                  resetShop_fun();
                "
                :propsData="{ state: showEdit2 }"
              ></editShopPage>
            </el-dialog>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import { getHomeData } from "@/api/index";
import MIXINS_SETUP from "@/mixins/setup";
import { ROOT_STATE } from "@/util/define";
export default {
  mixins: [MIXINS_SETUP.SIDERBAR_MENU],
  data() {
    return {
      sysLogo: "static/images/sysLogo.png",
      showEdit: false,
      showEdit2: false,
      activeNames: "",
      shopItem: {},
      height: window.innerHeight - 72
    };
  },
  computed: {
    ...mapGetters({
      dataInfo: "myinfo",
      getMyShop: "getMyShop"
    })
  },
  watch: {
    getMyShop(data) {
      console.log(data);
    }
  },
  methods: {
    handleChange(val) {
      console.log(val);
    },
    editShopfun() {
      this.$store.dispatch("selectingShop", this.shopItem).then(() => {
        this.showEdit2 = true;
      });
    },
    resetInfo_fun() {
      this.$store.dispatch("getMyInfo");
    },
    resetShop_fun() {
      this.$store.dispatch("clearShopAll").then(() => {
        this.$store.dispatch("getShopList", {});
      });
    }
  },
  mounted() {
    this.shopItem = Object.assign({}, getHomeData().shop);
  },
  beforeCreate() {
    this.$store.dispatch("getMyInfo");
    this.$store.dispatch("getShopInfo", {}).then(() => {});
  },
  components: {
    editPage: () => import("@/components/setup/editMyinfo"),
    editShopPage: () => import("@/components/setup/editShop"),
    headerPage: () => import("@/components/header")
  }
};
</script>
<style scoped>
.t-name {
  display: inline-block;
  width: 124px;
  padding: 4px 0px;
}
.t-label {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 3px;
}
.el-header {
  padding: 0 !important;
}
.member-main-top {
  width: 99%;
  margin-left: 0.5%;
  margin-right: 0.5%;
  height: 100px;
  background: #fff;
}
.member-main-table {
  margin-top: 8px;
  width: 99%;
  margin-left: 0.5%;
  margin-right: 0.5%;
  height: 600px;
  background: #fff;
}
.myShop {
  width: 100%;
  background: #fff;
  overflow-y: auto !important;
}
.myShop-bacse {
  display: flex;
  align-items: center;
  height: 40px;
  width: 96%;
  margin-top: 20px;
  margin-left: 30px;
  background: #f7f8fa;
}
.myShop-bacse .dmt {
  margin-left: 15px;
  margin-right: 10px;
  height: 16px;
  width: 6px;
  background: #3399ff;
}
.myShop-bacse-cont {
  /* margin-top: 62px; */
  margin-left: 80px;
}
.myShop-logo {
  display: flex;
  align-items: center;
  height: 45px;
  /* width: 200px; */
}
.myShop-logo img {
  width: 45px;
  height: 45px;
  margin-left: 20px;
}
</style>
