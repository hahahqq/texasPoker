<template>
    <el-container>
        <el-header style="height:50px;">
            <headerPage></headerPage>
        </el-header>

        <el-container>
            <el-aside width="100px">
                <section style="min-width:100px;">
                    <memberMenu :activePath="activePath" :routesList="routesList" :width="100"></memberMenu>
                </section>
            </el-aside>

            <el-container>
                <div class="content-new-fex">
                    <div class="content-eighty" style="height: 80px; padding-top: 24px">
                        <div class="content-center">
                            <el-button size="small" type="primary" @click="handleEdit({}, '')">新增桌台</el-button>

                            <span style="float:right">所属店铺&nbsp;
                                <el-select v-model="shopId" clearable placeholder="请选择" @change="getNewData" size="small">
                                    <el-option
                                    v-for="item in shopList"
                                    :key="item.SHOPID"
                                    :label="item.SHOPNAME"
                                    :value="item.SHOPID">
                                    </el-option>
                                </el-select>
                            </span>
                        </div>
                    </div>

                    <div class="content-table4">
                        <div class="content-table-center">
                            <el-table :data='tableData' :height="clientHeight" size='small' style="width: 100%" header-row-class-name="bg-theme2 text-white">
                               <el-table-column type="index" label="序号" align='center' width="80"></el-table-column>
                                <el-table-column prop="NAME" label="桌台名称"></el-table-column>
                                <el-table-column prop="SHOPNAME" label="所属店铺"></el-table-column>
                                <el-table-column prop="DESCNO" label="排序" align="center"></el-table-column>
                                <el-table-column label="编辑">
                                    <template slot-scope="scope">
                                        <el-button size="small" type="text" @click="handleEdit(scope.row, scope.$index)">编辑</el-button>
                                        <el-button size="small" type="text" @click="handleDel(scope.row, scope.$index)">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>

                </div>
            </el-container>

            <el-dialog :title="isAdd ?'新增桌台':'编辑桌台'" :visible.sync="dialogVisible" width="450px">
                <div>
                    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px">
                        <el-form-item label="桌台名称" prop="Name">
                            <el-input v-model="ruleForm.Name" clearable placeholder="请输入桌台名称" size='small'></el-input>
                        </el-form-item>

                        <el-form-item label="所属店铺" prop="ShopId">
                            <el-select v-model="ruleForm.ShopId" placeholder="请选择所属店铺" size="small" style="width: 100%">
                                <el-option
                                v-for="item in shopList"
                                :key="item.SHOPID"
                                :label="item.SHOPNAME"
                                :value="item.SHOPID">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="排 序">
                            <el-input-number v-model="ruleForm.DescNo" controls-position="right" clearable placeholder="请输入排序序号" size="small"></el-input-number>
                        </el-form-item>

                        <el-form-item>
                            <el-button type="primary" @click="submitForm" :loading="loading">保 存</el-button>
                            <el-button @click="closeModal">取 消</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </el-dialog>
        </el-container>
  </el-container>
</template>
<script>

import { mapState, mapGetters } from "vuex";
import MIXINS_SETUP from "@/mixins/setup";
import { getUserInfo,setHomeData, getHomeData } from '@/api/index'

export default {
    mixins: [MIXINS_SETUP.SIDERBAR_MENU],
    data(){
        return{
            shopList:[],
            shopId: '',
            value1: '',
            tableData: [],
            dialogVisible: false,
            ruleForm:{
                Name: '',
                ShopId: getHomeData().shop.ID,
                DescNo: 100
            },
            rules:{
                Name: [{ required: true, message: '请输入桌台名称', trigger: 'blur' }],
                ShopId: [{ required: true, message: '请选择所属店铺', trigger: 'change' }]
            },
            loading: false,
            isAdd: false,
            clientHeight: document.body.clientHeight - 160
        }
    },
    computed: {
        ...mapGetters({
            getTableListState: "getTableListState",
            delTableState: 'delTableState',
            saveTableState: 'saveTableState'
        })
    },
    watch: {
        getTableListState(data){
            if(data.success){
                this.tableData = data.data.List
            }
        },
        delTableState(data){
            if(data.success){
                this.getNewData()
            }
        },
        saveTableState(data){
            this.loading = false
            if(data.success){
                this.closeModal()
                this.getNewData()
            }
        }
    },
    methods:{
        handleEdit(row, idx){
            this.dialogVisible = true
            if(idx == ''){
                this.isAdd = true
                if(this.shopList.length == 1){
                    this.ruleForm.ShopId = getHomeData().shop.ID
                }
            }else{
                this.isAdd = false
                this.ruleForm = {
                    Name: row.NAME,
                    DescNo: row.DESCNO,
                    ID: row.ID,
                    ShopId: row.SHOPID
                }
            }
        },
        handleDel(row, idx){
            this.$confirm("确认删除【"+ row.NAME +"】桌台?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                this.$store.dispatch("delTable", { ID : row.ID })
            }).catch(() => { })
        },
        closeModal(){
            this.dialogVisible = false
            this.$refs["ruleForm"].resetFields();
            this.ruleForm.ShopId = ''
        },
        getNewData(){
            this.$store.dispatch("getTableList", { ShopId: this.shopId  })
        },
        submitForm(){
            let haveSameName = this.tableData.filter(item => item.NAME == this.ruleForm.Name)
            if(haveSameName.length > 0){
                this.$message.warning('列表中【'+ this.ruleForm.Name +'】桌台名称已称在，不能重复')
                return
            }
            this.$refs.ruleForm.validate(valid => {
                if (valid) {
                    let sendData = {
                        ShopId: this.ruleForm.ShopId,
                        Name: this.ruleForm.Name,
                        DescNo: this.ruleForm.DescNo,
                        ID: this.isAdd ? '' : this.ruleForm.ID
                    }
                    this.$store.dispatch("saveTable", sendData).then(() =>{
                        this.loading = true
                    })
                }
            })
        }
    },
    mounted(){
        let userInfo = getUserInfo();
        this.shopList = userInfo.ShopList;
        this.shopId = getHomeData().shop.ID
        this.getNewData()
    },
    components: {
        headerPage: () => import("@/components/header")
    }
};
</script>
<style scoped>
.el-header{
  padding: 0 !important;
}
</style>
