<template>
	<div v-loading="loading">
		<div class="row-flex flex-between flex-items-center">
			<div class="inline-block"><slot name="button"></slot></div>
			<div class="inline-block">
				<el-input
					placeholder="请输入会员卡号/姓名"
					size="small"
					v-model="formData.Filter"
					clearable
					style="width: 401px"
				>
					<template slot="append">
						<el-button size="small" type="primary" @click="getNewData">搜索</el-button>
					</template>
				</el-input>
			</div>
		</div>
		<div class="m-top-md">
			<!-- table-->
			<el-table border :data="tableList" header-row-class-name="bg-F1F2F3" class="full-width">
				<!-- <el-table-column prop="" label="单号"></el-table-column> -->
				<el-table-column prop="DATENAME" label="日期" width="140px"></el-table-column>
				<el-table-column prop="SHOPNAME" label="店铺"></el-table-column>
				<el-table-column prop="BILLCOUNT" label="销售单数"></el-table-column>
				<el-table-column prop="QTY" label="销售数量"></el-table-column>
				<el-table-column prop="MONEY" label="销售金额"></el-table-column>
				<el-table-column prop="PLANMONEY" label="成本金额"></el-table-column>
				<el-table-column prop="GAINMONEY" label="毛利总额"></el-table-column>
			</el-table>
			<!-- 分页 -->
			<div v-if="tableList.length > 0" class="m-top-sm clearfix">
				<el-pagination
					@size-change="handlePageChange"
					@current-change="handlePageChange"
					:current-page.sync="pagination.PN"
					:page-size="pagination.PageSize"
					layout="total,prev, pager, next, jumper"
					:total="pagination.TotalNumber"
					class="text-right"
				></el-pagination>
			</div>
		</div>
	</div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { getHomeData } from "@/api/index";
import { indexQuery } from "@/store/modules2/report/indexFun.js";
const type = 4; // 日期汇总
export default {
	props: {
		pageData: {
			type: Object,
			default: {
				show: false
			}
		}
	},
	data() {
		return {
			loading: false,
			formData: { ShopId: "", BeginDate: "", EndDate: "", PN: 1, Filter: "" },
			tableList: [],
			pagination: {
				TotalNumber: 0,
				PageNumber: 0,
				PageSize: 20,
				PN: 0
			}
		};
	},
	computed: {
		...mapGetters({
			dataState: "actionsDataState",
			dataListState: "commonListState"
		})
	},
	watch: {
		pageData(data) {
			if (data.show && data.type == type) {
				this.defaultData();
			}
		},
		dataListState(data) {
			if (this.loading) {
				if (data.success) {
					this.pagination = Object.assign({}, data.paying);
					this.tableList = [...data.List];
					console.log(11, data);
				} else {
					this.$message.error(data.message);
				}
			}
			this.loading = false;
		}
	},
	methods: {
		getNewData() {
			this.loading = true;
			indexQuery.goodsSale(this, "goodsSaleB", this.formData);
		},
		handlePageChange: function (currentPage) {
			if (this.formData.PN == currentPage || this.loading) {
				return;
			}
			this.formData.PN = parseInt(currentPage);
			this.getNewData();
		},
		printFun(item) {
			console.log(item);
		},
		defaultData() {
			this.formData = Object.assign(this.formData, this.pageData, { Filter: "", PN: 1 });
			this.getNewData();
		}
	},
	mounted() {
		if (this.pageData.show && this.pageData.type == type) {
			this.defaultData();
		}
	}
};
</script>
