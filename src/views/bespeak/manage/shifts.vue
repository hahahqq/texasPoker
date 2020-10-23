<template>
    <div v-loading="loading">
        <!-- 班次管理 -->
        <el-button type="primary" size="small" icon="el-icon-plus" plain @click="handleItem('add')">添加班次</el-button>
        <el-button type="primary" size='small' icon="el-icon-refresh" circle @click="$store.dispatch('getShiftsList')" class="pull-right"></el-button>
        <div class="m-top-sm">
            <el-table :data="dataList" border size='small' style="width: 100%" header-row-class-name="bg-theme text-white">
                <el-table-column prop="NAME" label="班次名称" width="180"></el-table-column>
                <el-table-column label="班次时间">
                    <template slot-scope="scope">
                        <div>
                            <span class="m-right-sm">{{scope.row.BEGINTIME}}-{{scope.row.ENDTIME}}</span>
                            <span>{{scope.row.RESTDATE}}</span>
                        </div> 
                    </template>
                </el-table-column>
                <!-- <el-table-column prop="COUNT" label="使用人数"></el-table-column> -->
                <el-table-column label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button @click="handleItem('edit',scope.row)" type="text" size="small">编辑</el-button>
                        <el-button @click="handleItem('del',scope.row)" type="text" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog
            :title="dealType=='add'?'新增班次':'编辑班次'"
            :visible.sync="showItem"
            width="600px"
            style="max-width:100%"
        >
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="班次名称">
                    <el-input v-model="form.Name" clearable></el-input>
                </el-form-item>
                <el-form-item label="班次时间">
                    <el-time-select
                        placeholder="起始时间"
                        v-model="form.BeginTime"
                        :picker-options="options"
                        style="width:120px"
                    ></el-time-select>
                    <el-time-select
                        placeholder="结束时间"
                        v-model="form.EndTime"
                        :picker-options="Object.assign({minTime: form.BeginTime},options)"
                        style="width:120px"
                    ></el-time-select>
                    <el-button type="primary" plain @click="dealRestList(1)">添加休息时段</el-button>
                </el-form-item>
                <el-form-item label="休息时间" v-for="(item,i) in restList" :key="i">
                    <el-time-select
                        placeholder="起始时间"
                        v-model="restList[i].BeginTime"
                        :picker-options="options"
                        style="width:120px"
                    ></el-time-select>
                    <el-time-select
                        placeholder="结束时间"
                        v-model="restList[i].EndTime"
                        :picker-options="Object.assign({minTime: restList[i].BeginTime},options)"
                        style="width:120px"
                    ></el-time-select>
                    <el-button type="primary" plain @click="dealRestList(2,i)">删除</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">保存</el-button>
                    <el-button @click="resetSubmit">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
export default {
    data() {
        return {
            loading: false,
            dealType: "",
            showItem: false,
            options: {
                start: "00:00",
                step: "00:15",
                end: "23:45"
            },
            form: {
                Name: "",
                BeginTime: "",
                EndTime: "",
                RestList: [] // {"BeginTime":"06:00","EndTime":"07:00"}]
            },
            restList: [{ BeginTime: "", EndTime: "" }]
        };
    },
    computed: {
        ...mapGetters({
            dataList: "shiftsList",
            dataListState: "shiftsListState",
            dataItem: "shiftsItem",
            dataState: "shiftsState"
        })
    },
    watch: {
        dataListState(data) {
            this.loading = false;
            if (data.success) {
                this.showItem = false;
            }
        },
        dataState(data) {
            if (data.success && data.type == "get") {
                let dd = Object.assign({}, this.dataItem.Obj),
                    ll = [...this.dataItem.List];
                let arr = [];
                ll.forEach(item => {
                    arr.push({
                        BeginTime: item.BEGINTIME,
                        EndTime: item.ENDTIME
                    })
                });
                this.form = {
                    Id: dd.ID,
                    Name: dd.NAME,
                    BeginTime: dd.BEGINTIME,
                    EndTime: dd.ENDTIME,
                    RestList: [...arr] // {"BeginTime":"06:00","EndTime":"07:00"}]
                };
                this.restList = [...arr];

                this.showItem = true;
                this.loading = false;
            }
            if (data.success && data.type == this.dealType) {
                this.$store.dispatch("getShiftsList");
            }
        }
    },
    methods: {
        handleItem(type, item) {
            this.dealType = type;
            if (type == "edit") {
                this.$store.dispatch("getShiftsItem", item).then(() => {
                    this.loading = true;
                });
            } 
            if (type == "add") {
                this.form = {
                    Name: "",
                    BeginTime: "",
                    EndTime: "",
                    RestList: []
                };
                this.restList = [{ BeginTime: "", EndTime: "" }];
                this.showItem = true;
            }
            if (type == "del") {
                this.$confirm("确认删除"+item.NAME+"？").then(_ => {
                    this.$store
                        .dispatch("dealShiftsItem", {
                            type: this.dealType,
                            data: { Id: item.ID }
                        })
                        .then(() => {
                            this.loading = true;
                        }).catch(_ => {

                        })
                });
            }
        },
        resetSubmit() {
            this.form = {
                Name: "",
                BeginTime: "",
                EndTime: "",
                RestList: []
            };
            this.restList = [{ BeginTime: "", EndTime: "" }];
            this.showItem = false;
            this.dealType = "";
        },
        onSubmit() {
            let sendData = Object.assign({}, this.form),
                oo = {};
            for (let i = 0; i < this.restList.length; i++) {
                oo[i] = this.restList[i];
            }
            sendData.RestList = oo;

            this.$store
                .dispatch("dealShiftsItem", {
                    type: this.dealType,
                    data: sendData
                })
                .then(() => {
                    this.loading = true;
                });
        },
        dealRestList(type, i) {
            // 添加删除 休息时段
            if (type == 1) {
                this.restList.push({ BeginTime: "", EndTime: "" });
            } else {
                this.restList.splice(i, 1);
                this.restList = [...this.restList];
            }
        }
    },
    mounted() {
        this.$store.dispatch("getShiftsList")
    },
    activated() {}
};
</script>
