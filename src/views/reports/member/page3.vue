<template>
	<section v-loading="loading">
		<!-- 会员注册统计 -->
		<div class="bg-white paddingTB-md m-bottom-sm">
			<div class="marginLR-md">
				<el-button-group>
					<el-button
						type="primary"
						size="small"
						:plain="!isDay"
						@click="chooseStateFun(1)"
					>
						日报
					</el-button>
					<el-button
						type="primary"
						size="small"
						:plain="isDay"
						@click="chooseStateFun(2)"
					>
						月报
					</el-button>
				</el-button-group>

				<filtePage
					:isAll="true"
					:isExport="true"
					:isNoDate="true"
					@getNewData="getNewData_fun"
					@exportState="exportState_fun"
					class="inline-block pull-right"
					style="width: 270px"
				></filtePage>
			</div>
		</div>
		<div class="bg-white m-bottom-sm">
			<div class="marginLR-md">
				<component :is="componentName" :pageData="formData"></component>
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
export default {
	data() {
		return {
			loading: false,
			formData: { ShopId: "", BeginDate: "", EndDate: "", type: 1, show: false },
			componentName: "page1",
			isDay: true,
			exportData: { show: false }
		};
	},
	computed: {
		...mapGetters({})
	},
	watch: {},
	methods: {
		exportState_fun(data) {
			this.exportData = {
				show: true,
				data: {},
				index: 1
			};
		},
		getNewData_fun(data) {
			this.formData = Object.assign({ show: true }, this.formData, data);
		},
		getNewData() {},
		chooseStateFun(type) {
			this.isDay = type == 1 ? true : false;
			this.componentName = type == 1 ? "page1" : "page2";
			this.$nextTick(() => {
				this.formData = Object.assign({}, this.formData, { type: type, show: true });
			});
		},
		defaultData() {}
	},

	mounted() {
		let homeInfo = getHomeData();
		this.formData = Object.assign({}, this.formData, {
			ShopId: homeInfo.shop.ID,
			BeginDate: this.getTimeStamp(),
			EndDate: new Date().getTime(),
			show: true
		});
	},
	components: {
		filtePage: () => import("@/views/reports/filtePage.vue"),
		page1: () => import("@/views/reports/member/register/day.vue"),
		page2: () => import("@/views/reports/member/register/month.vue"),
		exportPage: () => import("@/components/export/common.vue")
	}
};
</script>
<style scoped>
</style>
