<template>
    <div class="promotion-top">
        <el-form ref="form" :model="form" label-width="130px">
            <el-form-item label="会员等级晋升方式" class="member">
                <el-radio v-model="radio" label="0" @change="selctCheckbox">按累计积分晋升</el-radio>
                <el-radio v-model="radio" label="1" @change="selctCheckbox">按当前积分晋升</el-radio>
                <el-switch class="switch-on" v-model="form.delivery" @change="changeSwitch"></el-switch>
            </el-form-item>
        </el-form>
        <div class="prolog"></div>
        <el-row>
          <el-col :span="4" class="promotion-list" v-for="item in dataList" :key="item.id">
              <div class="list-name">
                  <div class="list-name-title">{{item.NAME}}</div>
                  <div class="imgUrl">
                      <img src="static/images/picon1.png"/>
                  </div>
                  <div class="integral">
                      <div>需要积分</div>
                      <div>{{item.LEVELINTEGRAL}}</div>
                  </div>
                  <div class="list-type">
                      <div class='list-type-cont'>
                          服务{{ item.SERVICEDISCOUNT == 1 ? '无折扣' : item.SERVICEDISCOUNT * 10 +' 折'}},
                          商品{{ item.DISCOUNT == 1 ? '无折扣' : item.DISCOUNT * 10 +' 折'}}
                      </div>
                  </div>
              </div>
          </el-col>
        </el-row>
        <div class="promotion-button"><el-button type="primary" size="small" style="width:80px;" @click="dialogVisible=true">编辑</el-button></div>
        <el-dialog
        :visible.sync="dialogVisible"
        width="40%"
        center
        title="编辑会员等级晋升"
        >
        <div class="eitDialog">
            <el-row style="margin-bottom:8px;" v-for="items in dataList" :key="items.id">
            <el-col :span="24" class="eitintegral">
                <div style="width:200px;">{{items.NAME}}</div>
                <div style="width:40px;">需要</div>
                <el-input size="small" style="width:150px;"
                v-model.trim="items.LEVELINTEGRAL">
                </el-input>
                <div style="width:80px;margin-left:5px;">积分晋升</div>
            </el-col>
            </el-row>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="preserveConts" :loading="isLoading">保存</el-button>
        </span>
        </el-dialog>
    </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
export default {
    data () {
        return {
            dialogVisible:false,
            isLoading:false,
            radio: '',
            form: {
            resource:'',
            delivery:false,
            },
            listType:[{id:'001',name:'按累计积分晋升'},{id:'002',name:'按累计充值晋升'}],
            promotionList:[ ],
            integralList:[]
            
        }
    },
    computed: {
        ...mapGetters({
            dataList: "memberPromotionList",
            memberPromotionCofig:"memberPromotionCofig",
            eitmemberPromotionList:"eitmemberPromotionList"
        })
    },
    watch: {
      //数据返回渲染到页面同步
      memberPromotionCofig(data){
         if(data.VIPLEVELUPTYPE==0){
             this.radio="0";
         }else if(data.VIPLEVELUPTYPE==1){
             this.radio="1";
         }
         if(data.ISAUTOVIPLEVELUP==1){
             this.form.delivery=true;
         } else if(data.ISAUTOVIPLEVELUP==0){
             this.form.delivery=false;
         }
      },

      eitmemberPromotionList(data) {
      if (this.isLoading) {
        this.$message({
          message: data.message,
          type: data.success ? "success" : "error"
        });
         this.isLoading=false;
         this.dialogVisible=false;
      }
      }
    },
    methods:{
        //选择晋升方式
        selctCheckbox(index){
            this.memberPromotionCofig.VIPLEVELUPTYPE=index;
        },
        //是否打开会员按积分值变动自动升级
        changeSwitch(e){
            if(e==true){
            this.$confirm('启用后，会员等级将按积分值变动自动升级', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }).then(() => {
                    this.$message({
                        type: 'success',
                        message: '启用成功!'
                    });
                    }).catch(() => {
                         this.form.delivery = false    
                    });
                this.memberPromotionCofig.ISAUTOVIPLEVELUP=1;

            }else if(e==false){
                this.memberPromotionCofig.ISAUTOVIPLEVELUP=0;
            }

        },
        //等级积分编辑的方法
        preserveConts() {
            let integralList=[];
            this.dataList.forEach(item => {
                let obj = {
                    LevelId:item.ID,
                    LevelIntegral:item.LEVELINTEGRAL
                }
                integralList.push(obj);
            });

            let haveEmptyNum = integralList.filter(item => item.LevelIntegral === '')
            if(haveEmptyNum.length > 0){
                this.$message.warning('会员积分不能为空 ！')
                return
            }

            let setDate = Object.assign({},integralList)
            this.$store
                .dispatch("eitMemberPromotionList", {
                    IsAutoLevelUp: this.memberPromotionCofig.ISAUTOVIPLEVELUP,
                    AutoLevelType: this.memberPromotionCofig.VIPLEVELUPTYPE,
                    LevelUpIntegral: setDate
                })
                .then(() => {
                    this.isLoading = true;
                })
        }
    },
    beforeCreate() {
        this.$store.dispatch("getMemberPromotionList",{});
    }
    
}
</script> 
<style scoped>
.promotion-top >>>.el-form-item{
    margin-bottom: 5px !important;
}
.promotion-top >>>.el-dialog__header{
    border-bottom: solid 1px #CECECE !important;
}
.member{
    position: relative;
}
.switch-on{
    position: absolute;
    right: 10px;
    top: 10px;
}
.prolog{
    height: 10px;
    width: 100%;
    background: #F7F7F7;
}
.promotion-list{
    text-align: center;
    margin-top: 20px;
    margin-left: 20px;
    margin-bottom: 20px;

}
.list-name{
    height: 200px;
    width: 170px;
    padding: 0 10px;
    background: #FFF;
    box-shadow:0 0 8px #DCD9D9;
}
.list-name-title{
    height: 40px;
    line-height: 40px;
    font-weight: bold;
}
.integral{
    height: 50px;
    margin-top: 10px;
    color: #757474;
}
.list-type{
    width: 96%;
    margin-left: 2%;
    margin-right: 2%;
    color: #C2C3C4;
    border-top: solid 1px #D3D1D1;
}
.list-type-cont{
    margin-top: 5px;
    text-align: left;
    margin-left: 4px;
}
.imgUrl{
    margin-top: 10px;
}
.promotion-button{
    margin-left: 20px;
    margin-top: 20px;
}
.eitDialog{
    width: 100%;
    margin: auto 0;
    text-align: center;
}
.eitintegral{
    display: flex;
    align-items: center;
    /* border-bottom: solid 1px #CECECE; */
}
</style>


