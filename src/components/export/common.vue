<template>
	<div class="paddingLR-md">
		<div style="margin-top: -20px">
			<div class="paddingTB-xs font-20 text-theme4">确认导出</div>
			<div>
				<span>即将导出数据</span>
				<span v-if="loading">
					{{ pagination.TotalNumber }}条，共{{ pagination.PageNumber }}页
				</span>
			</div>
		</div>
		<div v-if="loading || percentage == 100" class="paddingTB-sm">
			<el-progress :percentage="percentage" :color="customColor"></el-progress>
		</div>
		<div>
			<span style="color: red">当前为测试，导出还在开发中</span>
		</div>
		<div class="text-right m-top-md">
			<!-- <el-button
				v-if="loading"
				type="primary"
				size="small"
				plain
				class="pull-left"
				@click="exportFun()"
			>
				中止并导出
			</el-button> -->
			<el-button v-if="loading" type="primary" size="small" plain class="m-left-sm" disabled>
				取消
			</el-button>
			<el-button
				v-else
				type="primary"
				size="small"
				plain
				class="m-left-sm"
				@click="closeModalFun"
			>
				取消
			</el-button>
			<el-button
				type="primary"
				size="small"
				class="m-left-sm"
				@click="handleSubmit"
				:loading="loading"
			>
				导出表格
			</el-button>
		</div>
	</div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import { export2Excel } from "@/store/modules2/export/exportFun.js";
export default {
	props: {
		dataType: {
			type: Object,
			default: {
				show: false,
				index: 0, // 接口编号
				data: {
					BeginDate: 1,
					EndDate: 9999999999999,
					ShopId: "",
					AppType: 0, // 0=pc端 1=app端
					PN: 1
				}
			}
		},
		isPage: {
			// 是否分页获取数据，再导出
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			pageData: { PN: 1 },
			pagination: {
				TotalNumber: 0,
				PageNumber: 0,
				PageSize: 20,
				PN: 1
			},
			loading: false,
			exportList: [],
			percentage: 0,
			customColor: "#409eff"
		};
	},
	computed: {
		...mapGetters({
			dataState: "commonExportState"
		})
	},
	watch: {
		dataType(data) {
			Object.assign(this.$data, this.$options.data());
			if (data.show) {
				this.defaultData();
			}
		},
		dataState(data) {
			if (this.loading) {
				if (data.success) {
					this.exportList = [...this.exportList, ...data.List];
					this.toSuccess(data.index, data.paying);
				} else {
					this.loading = false;
					this.$message.error(data.message);
				}
			}
		}
	},
	methods: {
		getNewData() {
         // 匹配对应的接口
         console.log(this.dataType.index, this.pageData)
         return
			this.$store
				.dispatch("getExportData", { index: this.dataType.index, data: this.pageData })
				.then(() => {
					this.loading = true;
				});
		},
		handleSubmit() {
			this.exportList = [];
			this.getNewData();
		},
		closeModalFun() {
			this.$emit("closeModal");
		},
		defaultData() {
			this.pageData = Object.assign({ PN: 1 }, this.dataType.data);
		},

		toSuccess(index, paying) {
			if (index <= 21 && paying && this.pageData.PN < paying.PageNumber) {
				//循环加载数据
				let ss = (this.pageData.PN / paying.PageNumber) * 100;
				this.percentage = Math.round(ss);
				this.pagination = Object.assign({}, paying);
				this.pageData.PN++;
				this.getNewData();
			} else {
				this.percentage = this.exportList.length > 0 ? 100 : 0;
				this.exportFun();
			}
		},
		exportFun() {
			if (this.exportList.length > 0) {
				let that = this;
				export2Excel(this.dataType.index, this.exportList, function (res) {
					if (res.state) {
						setTimeout(() => {
							that.$message({
								showClose: true,
								message: "导出成功",
								type: "success"
							});
							that.closeModalFun();
							that.loading = false;
						}, 600);
					} else {
						that.$message.error("数据有误");
						that.loading = false;
					}
				});
			} else {
				this.$message.error("没有导出的数据");
				this.loading = false;
			}
		},
		// 导出
		export2Excel(head, val, list, title) {
			let filterVal = [...val]; // 对象的属性
			let jsonData = [...list]; // 数据
			let data = jsonData.map((v) => filterVal.map((j) => v[j]));
			let fileName = title; // 文件名称
			let tHeader = [...head]; // 设置Excel的表格第一行的标题
			require.ensure([], () => {
				export_json_to_excel(tHeader, data, fileName, "");
			});
		}
	},
	mounted() {},
	created() {
		if (this.dataType.show) {
			this.defaultData();
		}
	}
};
</script>
