<template>
	<!-- 收银对账 -->
	<section v-loading="loading">
		<div class="bg-white paddingTB-md m-bottom-sm">
			<div class="marginLR-md">
				<filtePage
					:isAll="true"
					:isExport="true"
					@getNewData="getNewData_fun"
					@exportState="exportState_fun"
				></filtePage>
			</div>
		</div>
		<div class="bg-white paddingTB-md">
			<div class="marginLR-md">
				<!-- table-->
				<el-table
					border
					:data="tableList"
					header-row-class-name="bg-F1F2F3"
					class="full-width"
				>
					<el-table-column prop="USERNAME" label="" width="180"></el-table-column>
					<el-table-column prop="MONEY" label="金额"></el-table-column>
					<el-table-column prop="BILLCOUNT" label="笔数"></el-table-column>
					<el-table-column label="更多" width="80">
						<template slot-scope="props">
							<el-button
								type="text"
								@click="getNewList(5, props.row)"
								class="no-padding"
							>
								详情
							</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>
		<!-- 数据导出 -->
		<el-dialog
			append-to-body
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			:show-close="false"
			title="数据导出"
			:visible.sync="exportData.show"
			width="400px"
		>
			<exportPage
				:dataType="exportData"
				:isPage="true"
				@closeModal="exportData.show = false"
			></exportPage>
		</el-dialog>
	</section>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import { getHomeData } from "@/api/index";
import { indexQuery } from "@/store/modules2/report/indexFun.js";
export default {
	data() {
		return {
			loading: false,
			formData: { ShopId: "", BeginDate: "", EndDate: "", PN: 1 },
			tableList: [],
			exportData: { show: false }
		};
	},
	computed: {
		...mapGetters({
			dataState: "actionsDataState",
			dataListState: "commonListState"
		})
	},
	watch: {
		dataState(data) {
			if (this.loading) {
				if (data.success) {
					console.log(11, data.data);
					this.tableList = data.data.UserMoneyList;
					// TotalMoney
				} else {
					this.$message.error(data.message);
				}
			}
			this.loading = false;
		}
	},
	methods: {
		exportState_fun(data) {
			this.exportData = {
				show: true,
				data: {},
				index: 1
			};
		},
		getNewData_fun(data) {
			this.formData = Object.assign({}, data);
			this.getNewData();
		},
		getNewData() {
			indexQuery.cashier(this, "cashier", this.formData);
			this.loading = true;
		},
		getNewList(index, item) {},
		defaultData() {}
	},

	mounted() {
		let homeInfo = getHomeData();
		this.formData = Object.assign(
			this.formData,
			{
				ShopId: homeInfo.shop.ID,
				BeginDate: this.getTimeStamp(),
				EndDate: new Date().getTime()
			},
			{ PN: 1 }
		);
		this.getNewData();
	},
	components: {
		filtePage: () => import("@/views/reports/filtePage.vue"),
		exportPage: () => import("@/components/export/common.vue")
	}
};
</script>
<style scoped>
</style>
