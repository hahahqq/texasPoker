<template>
  <el-row class="container">
    <!-- <headerPage :collapsed="collapsed" @collapse="collapse_fun"></headerPage> -->
    <el-col :span="24" class="main">
      <aside id="leftSidebar" class="innerbox bg-theme text-white">
        <!--导航菜单-->
        <div class="login-img">
          <img :src="sysLogo" class="inline-block full-width" />
        </div>
        <ul class="block" style="text-align: center">
          <template v-for="(item, index) in routesList">
            <li :key="index" v-if="!item.hidden">
              <a
                v-if="item.leaf && item.children.length > 0"
                @click="toFollowLink(item.children[0])"
                class="block paddingLR-md pointer"
                :class="{ isActive: activePath == item.children[0].path }"
              >
                <i :class="item.iconCls" style="font-size: 13px"></i>
                <span>{{ item.children[0].name }}</span>
              </a>
            </li>
          </template>
        </ul>
      </aside>
      <section
        id="content"
        class="content-container"
        :class="
          activePath.indexOf('report') > -1 || activePath.indexOf('setup') > -1
            ? 'report_setup'
            : 'bg-white'
        "
      >
        <div class="grid-content bg-purple-light full-height">
          <el-col :span="24" class="content-wrapper full-height">
            <transition name="fade" mode="out-in">
              <router-view
                :scroll-top="scrollTop"
                style="min-height: 100%; position: relative"
              ></router-view>
            </transition>
          </el-col>
        </div>
      </section>
    </el-col>
    <el-col :span="24" class="footer">
      <a id="goTop" @click="goTop" v-show="toTop">
        <i class="el-icon-arrow-up"></i>
      </a>
    </el-col>
  </el-row>
</template>
<script type="text/ecmascript-6">
import { getUserInfo } from "@/api/index";
import { ROOT_STATE } from "@/util/define";
export default {
  data() {
    return {
      sysLogo: "static/images/sysLogo.png",
      collapsed: false,
      scrollTop: 0,
      toTop: false,
      routesList: {},
      activePath: ""
    };
  },
  watch: {
    $route(to, from) {
      this.activePath = to.meta.parent ? "/" + to.meta.parent : to.path;
    }
  },
  methods: {
    //折叠导航栏
    collapse_fun: function () {
      this.collapsed = !this.collapsed;
    },
    goTop() {
      let scrollDiv = document.getElementById("content");
      scrollDiv.scrollTop = 0;
    },
    toFollowLink(item) {
      this.$store.dispatch("selectingMember", {});
      let agentPermission = getUserInfo().List;
      let arr = agentPermission.filter((element) => element.MODULECODE == item.modulecode);
      if (arr.length > 0 && !this.isPurViewFun(arr[0].MODULECODE)) {
        this.$message.warning("您还没有获得相关权限!");
      } else {
        this.activePath = item.path;
        this.$router.push({ path: item.path });
      }
    }
  },
  components: {
    headerPage: () => import("@/components/header")
  },
  created() {
    this.routesList = Object.assign({}, this.$router.options.routes);
    this.activePath = this.$route.path;
    document.querySelector("#dong").style.display = "none";
  },
  mounted() {
    var _this = this;
    var scrollDiv = document.getElementById("content");
    scrollDiv.addEventListener(
      "scroll",
      function () {
        _this.scrollTop = scrollDiv.scrollTop;
        if (scrollDiv.scrollTop > window.innerHeight / 2) {
          _this.toTop = true;
        } else {
          _this.toTop = false;
        }
      },
      true
    );
  }
};
</script>

<style scoped lang="scss">
.container {
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 100%;
  .main {
    display: flex;
    position: absolute;
    top: 0px;
    bottom: 0px;
    overflow: hidden;
    aside {
      flex: 0 0 90px;
      width: 90px;
      overflow-x: hidden;
      overflow-y: auto;
      ul {
        li {
          height: 50;
          line-height: 50px;
          position: relative;
          a.isActive {
            background-color: #2589ff;
            color:#fff;
            :hover{
               background-color: #2589ff;
               color:#fff
            }
          }
        }
        :hover {
          background-color: #f5f7fa;
          color:#606266
        }
      }
    }
    .content-container {
      flex: 1;
      background-color: #f4f5fa;
      .breadcrumb-container {
        .title {
          width: 140px;
          float: left;
          color: #475669;
        }
        .breadcrumb-inner {
          float: right;
        }
      }
      .content-wrapper {
        background-color: transparent;
        box-sizing: border-box;
      }
    }
  }
  .footer {
    #goTop {
      position: absolute;
      right: 0;
      bottom: 2%;
      padding: 16px;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 99999;
      color: #fff;
      font-size: 24px;
    }
  }
}
.innerbox::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 4px;
}
.innerbox::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
  background: rgba(0, 0, 0, 0.1);
}
.innerbox::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
  border-radius: 0;
  background-color: rgba(0, 0, 0, 0.05);
}
.childClass:hover {
  background-color: rgba(0, 0, 0, 0.1);
  color: #fb789a;
}
.childClass a.isActive {
  background-color: rgba(0, 0, 0, 0.1);
  color: #fb789a;
}
.login-img {
  height: 80px;
  width: 90px;
  position: relative;
  // background: #fff;
}
.login-img img {
  position: absolute;
  height: 40px;
  width: 40px;
  margin-top: 15px;
  left: 22px;
  // border-radius: 100%;
}
</style>
