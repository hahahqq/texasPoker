<template>
	<!-- 定向优惠券 -->
	<el-container>
		<el-header style="height: 50px; padding: 0">
			<headerPage :pageList="buttonGroup"></headerPage>
		</el-header>
		<el-container>
			<el-aside width="100px">
				<section style="min-width: 100px">
					<memberMenu
						:activePath="activePath"
						:routesList="routesList"
						:width="100"
					></memberMenu>
				</section>
			</el-aside>
			<el-container>
				<el-main style="padding: 10px; background: #fff; margin: 10px">
					<div v-loading="loading">
						<el-form
							:model="ruleForm"
							status-icon
							:rules="rules"
							ref="ruleForm"
							label-width="100px"
							class="ruleForm"
							style="padding-top: 20px"
						>
							<el-form-item label="优惠券类型">
								<!-- <el-input
									v-model="ruleForm.Caption"
									placeholder="请输入活动主题"
									size="small"
								></el-input> -->
                        <el-tooltip
                           class="item"
                           effect="dark"
                           content="赛事券用于选手参加赛事报名时使用；商品券用于购买商品时使用"
                           placement="right"
                        >
                           <i class="el-icon-question font-14" style="color: #409eff"></i>
                        </el-tooltip>

                        <el-radio-group v-model="ruleForm.Type">
                           <el-radio size="small" :label="0">商品券</el-radio>
                           <el-radio size="small" :label="2">赛事券</el-radio>
                        </el-radio-group>

							</el-form-item>
							<el-form-item label="限制会员">
								<el-tooltip placement="right">
									<div slot="content">
										<div v-if="Object.keys(selmemberArr).length > 0">
											<span v-for="(item, i) in selmemberArr" :key="i">
												<i v-if="i > 0">，</i>
												{{ item.NAME }}
											</span>
										</div>
										<span v-else>请选择会员</span>
									</div>
									<el-button @click="isShowFirstPopup = true" size="small">
										<span
											v-text="
												Object.keys(selmemberArr).length > 0
													? '已选' +
													  Object.keys(selmemberArr).length +
													  '人'
													: '请选择'
											"
										></span>
									</el-button>
								</el-tooltip>
							</el-form-item>
							<el-form-item label="优惠金额" class>
								<el-input
									placeholder="请输入优惠金额"
									v-model.number="ruleForm.Money"
									size="small"
									type="number"
									min="0"
								></el-input>
							</el-form-item>
							<el-form-item label="数量" class>
								<el-input
									:disabled="true"
									:placeholder="Object.keys(selmemberArr).length"
									size="small"
									type="number"
									min="0"
								></el-input>
							</el-form-item>
							<el-form-item label="限定金额" class>
								<el-input
									placeholder="请输入限定金额"
									v-model.number="ruleForm.LimitMoney"
									size="small"
									type="number"
									min="0"
								></el-input>
							</el-form-item>
							<el-form-item label="是否定向">
								<el-switch v-model="ruleForm.IsLitmitVip" size="small"></el-switch>
							</el-form-item>
							<el-form-item label="联系方式" class>
								<el-input
									placeholder="请输入联系方式"
									v-model.number="ruleForm.Tel"
									size="small"
									type="number"
									min="0"
								></el-input>
							</el-form-item>
							<el-form-item label="是否发送短信">
								<el-switch v-model="ruleForm.IsSMS" size="small"></el-switch>
							</el-form-item>

							<el-form-item label="有效时间">
								<el-date-picker
									v-model="dateBE[0]"
									value-format="timestamp"
									align="right"
									type="date"
									size="small"
									placeholder="选择开始日期"
									style="width: 47%; margin-right: -4px"
								></el-date-picker>
								<span class="text-muted inline-block text-center" style="width: 6%">
									至
								</span>
								<el-date-picker
									v-model="dateBE[1]"
									value-format="timestamp"
									align="right"
									type="date"
									size="small"
									placeholder="选择结束日期"
									style="width: 47%; margin-left: -4px"
								></el-date-picker>
							</el-form-item>
							<el-form-item label="店铺" class="full-width">
								<el-checkbox-group v-model="ShopList" size="small">
									<el-checkbox
										v-for="(item, i) in shopList"
										:key="i"
										:label="item.ID"
										border
									>
										{{ item.NAME }}
									</el-checkbox>
								</el-checkbox-group>
							</el-form-item>
							<el-form-item label="地址" class="full-width">
								<el-input
									v-model="ruleForm.Address"
									placeholder="请输入地址"
									size="small"
								></el-input>
							</el-form-item>
							<el-form-item label="备注" class="full-width">
								<el-input
									type="textarea"
									:autosize="{ minRows: 2, maxRows: 4 }"
									placeholder="请输入内容"
									v-model="ruleForm.Remark"
									size="small"
								></el-input>
							</el-form-item>

							<el-form-item class="full-width">
								<el-button
									type="primary"
									size="small"
									@click="handleSubmit(1)"
									:loading="loading"
								>
									保 存
								</el-button>
								<el-button size="small" @click="handleSubmit(0)">重 设</el-button>
							</el-form-item>
						</el-form>
						<!-- memeberTable -->
						<el-dialog
							width="70%"
							title="选择会员"
							:visible.sync="isShowFirstPopup"
							append-to-body
							style="max-width: 100%"
						>
							<selMember
								@closeModal="isShowFirstPopup = false"
								:isArr="true"
							></selMember>
						</el-dialog>
					</div>
				</el-main>
			</el-container>
		</el-container>
	</el-container>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import MIXINS_MARKETING from "@/mixins/marketing.js";
import MIXINS from "@/mixins/index";
export default {
	mixins: [MIXINS.IS_SHOW_POPUP, MIXINS_MARKETING.MARKETING_MENU],
	data() {
		return {
			ruleForm: {
				Caption: "",
				ImgName: "",
				ShopList: "",
				Money: 0,
				Qty: 0,
				Remark: "",
				BeginDate: "",
				EndDate: "",
				Tel: null,
				Address: "",
				LimitMoney: 0,
				IsLitmitVip: true,
				LitmitVipList: "",
            IsSMS: true,
            Type: 0
			},
			rules: {},
			ShopList: [], //为空=适用全部，多个店铺用逗号分隔(15925,15926),默认为空 . add
			dateBE: [],
			loading: false,
			buttonGroup: [
				{ label: "拓客工具", value: "/marketing/bespeakList" },
				{ label: "定向优惠券", value: "" }
			]
		};
	},
	computed: {
		...mapGetters({
			dataState: "dealMarketingState",
			shopList: "shopList",
			selmemberArr: "selmemberArr"
		})
	},
	watch: {
		dataState(data) {
			if (data.success) {
				this.$message({
					type: "success",
					message: data.message
				});
				this.$store.dispatch("clearMarketingData", 0);
			} else {
				this.$message({
					type: "error",
					message: data.message
				});
			}
			this.loading = false;
		}
	},
	mounted() {
		this.defaultData();
	},
	methods: {
		handleSubmit(type) {
			if (!this.ruleForm.Caption) {
				this.$message({
					type: "error",
					message: "请填写活动主题"
				});
				return;
			}
			if (type == 1) {
				let marr = [];
				this.ruleForm.BeginDate = this.dateBE[0];
				this.ruleForm.EndDate = this.dateBE[1];
				let sendData = Object.assign({}, this.ruleForm, {
					IsLitmitVip: this.ruleForm.IsLitmitVip ? "true" : "false",
					IsSMS: this.ruleForm.IsSMS ? "Ture" : "False"
				});
				for (let i = 0; i < this.selmemberArr.length; i++) {
					marr.push({
						VipID: this.selmemberArr[i].ID,
						MobileNo: this.selmemberArr[i].MOBILENO,
						MobileName: this.selmemberArr[i].NAME
					});
				}
				sendData.LitmitVipList = JSON.stringify(marr);
				if (this.ShopList.length > 0) {
					sendData.ShopList = this.ShopList.join(",");
				}
				sendData.Qty = Object.keys(this.selmemberArr).length;

				this.$store
					.dispatch("addMCoyponAction", {
						type: "add",
						data: sendData
					})
					.then(() => {
						this.loading = true;
					});
			} else {
				Object.assign(this.$data, this.$options.data());
				this.$store.dispatch("selectingMember", {
					isArr: true,
					data: []
				});
			}
		},
		defaultData() {
			if (this.shopList.length == 0) {
				this.$store.dispatch("getShopList", {});
			}
		}
	},
	components: {
		selMember: () => import("@/components/selected/selmember"),
		headerPage: () => import("@/components/header/headBC")
	}
};
</script>
<style scoped>
.ruleForm {
	max-width: 900px;
}

.ruleForm .el-form-item {
	width: 49%;
	display: inline-block;
}

.ruleForm .el-form-item.full-width {
	width: 100%;
}
</style>
