<template>
	<!-- 比赛项目分析 -->
	<section v-loading="loading">
		<div class="bg-white paddingTB-md m-bottom-sm">
			<div class="marginLR-md">
				<filtePage
					:isAll="true"
					:isExport="true"
					@getNewData="getNewData_fun"
					@exportState="exportState_fun"
				>
					<div slot="button" class="inline-block p-left-sm" style="width: 110px">
						<el-select
							size="small"
							v-model="formData.OrderType"
							placeholder="请选择"
							@change="changeFun"
							class="full-width"
						>
							<el-option
								v-for="(v, i) in [
									'盈利',
									'服务费',
									'买入积分',
									'总手数',
									'参赛人数'
								]"
								:key="i"
								:label="v"
								:value="i"
							></el-option>
						</el-select>
					</div>
				</filtePage>
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
					<el-table-column
						prop="MATCHNAME"
						label="赛事名称"
						width="130px"
					></el-table-column>
					<el-table-column
						prop="TYPENAME"
						label="比赛类型"
						width="100px"
					></el-table-column>
					<el-table-column prop="VIPCOUNT" label="会员数"></el-table-column>
					<el-table-column prop="REWARDMONEY" label="奖励金额"></el-table-column>
					<el-table-column prop="EXCHANGEMONEY" label="交易金额"></el-table-column>
					<el-table-column prop="NOTEXCHANGEMONEY" label="非交易金额"></el-table-column>
					<el-table-column prop="GAINMONEY" label="盈利"></el-table-column>
					<el-table-column prop="BUYMONEY" label="买入价格"></el-table-column>
					<el-table-column prop="BUYQTY" label="买入数量"></el-table-column>
					<el-table-column prop="BUYPRICE" label="买入金额"></el-table-column>
					<el-table-column prop="CHARGESMONEY" label="服务费"></el-table-column>
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
			formData: { ShopId: "", BeginDate: "", EndDate: "", PN: 1, OrderType: 0 },
			tableList: [],
			pagination: {
				TotalNumber: 0,
				PageNumber: 0,
				PageSize: 20,
				PN: 0
			},
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
		dataListState(data) {
			if (this.loading) {
				if (data.success) {
					console.log(111, data);
					this.pagination = Object.assign({}, data.paying);
					this.tableList = [...data.List];
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
			indexQuery.matchProList(this, "matchProList", this.formData);
			this.loading = true;
		},
		handlePageChange: function (currentPage) {
			if (this.formData.PN == currentPage || this.loading) {
				return;
			}
			this.formData.PN = parseInt(currentPage);
			this.getNewData();
		},
		changeFun(v) {
			console.log(v);
			this.getNewData();
		},
		defaultData() {}
	},

	mounted() {
		let homeInfo = getHomeData();
		this.formData = {
			ShopId: homeInfo.shop.ID,
			BeginDate: this.getTimeStamp(),
			EndDate: new Date().getTime(),
			PN: 1,
			OrderType: 0
		};
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
