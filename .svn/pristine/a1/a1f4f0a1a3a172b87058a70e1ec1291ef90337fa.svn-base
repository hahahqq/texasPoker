<template>
	<!-- 积分奖励 -->
	<section v-loading="loading">
		<div class="bg-white paddingTB-md m-bottom-sm">
			<div class="marginLR-md">
				<filtePage
					:isAll="true"
					:isExport="true"
					@getNewData="getNewData_fun"
					@exportState="exportState_fun"
				></filtePage>
				<div class="m-top-sm block">
					<el-input
						placeholder="请输入会员卡号/姓名"
						size="small"
						v-model="formData.VipCode"
						clearable
						style="width: 401px"
					>
						<template slot="append">
							<el-button size="small" type="primary" @click="getNewData">
								搜索
							</el-button>
						</template>
					</el-input>
				</div>
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
					<el-table-column prop="" label="日期" width="140px">
						<template slot-scope="scope">
							<span>{{ new Date(scope.row.BILLDATE) | formatTime }}</span>
						</template>
					</el-table-column>
					<el-table-column prop="MATCHNAME" label="比赛" width="130px"></el-table-column>
					<el-table-column prop="DESKNAME" label="桌台"></el-table-column>
					<el-table-column
						prop="TYPENAME"
						label="比赛类型"
						width="100px"
					></el-table-column>
					<el-table-column prop="SHOPNAME" label="店铺"></el-table-column>
					<el-table-column prop="VIPCODE" label="卡号" width="100px"></el-table-column>
					<el-table-column prop="VIPNAME" label="姓名"></el-table-column>
					<el-table-column
						prop="VIPMOBILENO"
						label="手机"
						width="110px"
					></el-table-column>
					<el-table-column prop="REWARDNAME" label="排名"></el-table-column>
					<el-table-column prop="MONEY" label="金额"></el-table-column>
					<el-table-column prop="CONTESTQTY" label="数量"></el-table-column>
					<el-table-column prop="INTEGRAL" label="积分"></el-table-column>
					<el-table-column prop="USERNAME" label="操作员"></el-table-column>
					<el-table-column prop="REMARK" label="备注" width="140px"></el-table-column>
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
			formData: { ShopId: "", BeginDate: "", EndDate: "", PN: 1, VipCode: "" },
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
		exportState_fun(data) {
			this.exportData = {
				show: true,
				data: {},
				index: 1
			};
		},
		getNewData_fun(data) {
			this.formData = Object.assign(this.formData, data);
			this.getNewData();
		},
		getNewData() {
			this.loading = true;
			indexQuery.integral(this, "award", this.formData);
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
			{
				PN: 1,
				VipCode: ""
			}
		);
		this.getNewData();
	},
	components: {
		filtePage: () => import("@/views/reports/filtePage.vue"),
		exportPage: () => import("@/components/export/common.vue")
	}
};
</script>
