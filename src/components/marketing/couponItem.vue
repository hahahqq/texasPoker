<template>
	<div>
		<el-form
			:model="ruleForm"
			:rules="rules"
			ref="ruleForm"
			label-width="90px"
			label-position="right"
		>
			<el-row :gutter="10">
				<!-- <el-col :xs="24" :sm="24">
          <el-form-item label="背景图文件名">
            <el-input v-model="ruleForm.ImgName"></el-input>
          </el-form-item>
                </el-col>-->
				<el-col :xs="24" :sm="12">
					<el-form-item label="优惠金额">
						<el-input
							v-model.number="ruleForm.Money"
							type="number"
							min="0"
							placeholder="请输入优惠金额"
						></el-input>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="12">
					<el-form-item label="发行数量" class>
						<el-input
							v-model.number="ruleForm.Qty"
							type="number"
							min="0"
							placeholder="请输入发行数量"
						></el-input>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24">
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
						<!-- <el-date-picker
                            v-model="dateBE"
                            type="daterange"
                            value-format="timestamp"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            style="width:100%;"
                        ></el-date-picker> -->
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24">
					<el-form-item label="使用规则">
						<span>满</span>
						<el-input
							v-model.number="ruleForm.LimitMoney"
							type="number"
							min="0"
							class="text-center"
							style="width: 100px"
						></el-input>
						<span>元可使用</span>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24">
					<el-form-item label="使用说明">
						<!-- <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入内容"
              v-model="ruleForm.Remark"
                        ></el-input>-->
						<el-input v-model="ruleForm.Remark" placeholder="请输入使用内容"></el-input>
					</el-form-item>
				</el-col>

				<el-col :xs="24" :sm="24">
					<el-form-item label="联系方式" class>
						<el-input
							v-model.number="ruleForm.Tel"
							type="number"
							min="0"
							placeholder="请输入联系方式"
						></el-input>
					</el-form-item>
					<!-- <el-form-item label="地区">
        <el-cascader :options="areaOptions" v-model="selectedAreaOptions" show-all-levels expand-trigger="hover" class="full-width">
        </el-cascader>
                    </el-form-item>-->
				</el-col>
				<el-col :xs="24" :sm="24">
					<el-form-item label="地址" class>
						<el-input v-model="ruleForm.Address" placeholder="请输入地址"></el-input>
					</el-form-item>
				</el-col>
				<el-col :xs="24" :sm="24">
					<el-form-item label="店铺">
						<el-radio-group v-model="chooseShopState" @change="chooseShopFun">
							<el-radio :label="true">全部店铺</el-radio>
							<el-radio :label="false">部分店铺</el-radio>
						</el-radio-group>
						<div v-if="!chooseShopState">
							<el-checkbox-group v-model="chooseShopList" size="small">
								<el-checkbox
									border
									v-for="(item, i) in shopList"
									:key="i"
									:label="item.ID"
								>
									{{ item.NAME }}
								</el-checkbox>
							</el-checkbox-group>
						</div>
						<!-- <el-checkbox-group v-model="ShopList">
							<el-checkbox
								v-for="(item, i) in shopList"
								:key="i"
								:label="item.ID"
								border
							>
								{{ item.NAME }}
							</el-checkbox>
						</el-checkbox-group> -->
					</el-form-item>
				</el-col>

				<el-col :xs="24" :sm="24">
					<el-form-item>
						<el-button type="primary" @click="handleSubmit" :loading="loading">
							保 存
						</el-button>
						<el-button @click="closeModal">取 消</el-button>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
	</div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import { CityInfo } from "@/assets/js/area.js";
export default {
	props: {
		dealType: {
			type: Object,
			default: function () {
				return {
					type: "add",
					state: false
				};
			}
		}
	},
	data() {
		var checkTel = (rule, value, callback) => {
			if (!value) {
				return callback(new Error("手机号码不能为空"));
			}
			setTimeout(() => {
				if (!Number.isInteger(value)) {
					callback(new Error("请输入数字值"));
				} else {
					var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
					if (!myreg.test(value)) {
						callback(new Error("请输入正确的手机号码"));
					} else {
						callback();
					}
				}
			}, 800);
		};
		return {
			ruleForm: {
				ImgName: "",
				Money: "",
				Qty: "",
				Remark: "",
				BeginDate: "",
				EndDate: "",
				Tel: null,
				Address: "",
				LimitMoney: ""
			},
			rules: {
				Caption: [
					{
						required: true,
						message: "请输入活动主题",
						trigger: "blur"
					}
				],
				Tel: [
					{
						required: true,
						validator: checkTel,
						trigger: "blur"
					}
				]
			},
			dateBE: [],
			ShopList: [], //为空=适用全部，多个店铺用逗号分隔(15925,15926),默认为空 . add
			areaOptions: CityInfo,
			selectedAreaOptions: [],
			loading: false,
			showGoodsTable: false,
			chooseShopState: true,
			chooseShopList: []
		};
	},
	computed: {
		...mapGetters({
			dataItem: "marketingItem",
			shopList: "shopList",
			dealState: "dealMarketingState"
		})
	},
	watch: {
		dealType(data) {
			this.defaultData();
		},
		dealState(data) {
			this.loading = false;
			this.$message({
				message: data.message,
				type: data.success ? "success" : "error"
			});
			if (data.success) {
				let obj = this.$route.params.type;
				this.$store.dispatch("getMarketingList", {
					obj: obj,
					data: { IsValid: "-1", PN: 1 }
				});
			}
			this.$refs.ruleForm.resetFields();
			this.$emit("closeModal");
		}
	},
	methods: {
		closeModal(type) {
			Object.assign(this.$data, this.$options.data());
			if (this.$refs.ruleForm) this.$refs.ruleForm.resetFields();
			if (type == "resetList") {
				this.$emit("resetList");
			} else {
				this.$emit("closeModal");
			}
		},
		handleSubmit() {
			// let address = this.getAreaLabel() + sendData.Address;
			//  let sendData = Object.assign({}, sendData, {
			//   Address: address
			// });
			let sendData = Object.assign({}, this.ruleForm);
			if (this.dateBE.length > 0) {
				sendData.BeginDate = this.dateBE[0];
				sendData.EndDate = this.dateBE[1];
			}
			if (this.chooseShopState) {
				let arr1 = [];
				this.shopList.forEach((element) => {
					arr1.push(element.ID);
				});
				this.chooseShopList = [...arr1];
			}
			if (this.chooseShopList.length == 0) {
				this.$message.warning("请选择店铺");
				return;
			}
			sendData.ShopList = this.chooseShopList.join(",");
			// 只有新增，没有编辑
			// console.log(this.dealType.type, this.ShopList);
			// if (this.dealType.type == "add" && this.ShopList.length > 0) {
			// 	sendData.ShopList = this.ShopList.join(",");
			// } else {
			// 	delete sendData.ShopList;
			// }

			this.$refs.ruleForm.validate((valid) => {
				if (valid) {
					this.$store
						.dispatch("dealcouponAction", {
							type: this.dealType.type,
							data: sendData
						})
						.then(() => {
							this.loading = true;
						});
				} else {
					this.loading = false;
				}
			});
		},
		getAreaLabel() {
			let seled = [...this.selectedAreaOptions];
			let areaStr = "";
			if (seled.length == 0) return areaStr;
			for (let i = 0; i < this.areaOptions.length; i++) {
				if (this.areaOptions[i].value == seled[0]) {
					areaStr += this.areaOptions[i].label + " ";
					for (let j = 0; j < this.areaOptions[i].children.length; j++) {
						if (this.areaOptions[i].children[j].value == seled[1]) {
							areaStr += this.areaOptions[i].children[j].label + " ";
							let karr = [...this.areaOptions[i].children[j].children];
							for (let k = 0; k < karr.length; k++) {
								if (karr[k].value == seled[2]) {
									areaStr += karr[k].label + " ";
									break;
								}
							}
							break;
						}
					}
					break;
				}
			}
			return areaStr;
		},
		setAddress(address) {
			let seled = address.split(" ");
			let areaStr = [];
			let defauleArr = [...this.areaOptions];
			for (let i = 0; i < defauleArr.length; i++) {
				if (defauleArr[i].label == seled[0]) {
					areaStr.push(defauleArr[i].value);
					for (let j = 0; j < defauleArr[i].children.length; j++) {
						if (defauleArr[i].children[j].label == seled[1]) {
							areaStr.push(defauleArr[i].children[j].value);
							let karr = [...defauleArr[i].children[j].children];
							for (let k = 0; k < karr.length; k++) {
								if (karr[k].label == seled[2]) {
									areaStr.push(karr[k].value);
									break;
								}
							}
							break;
						}
					}
					break;
				}
			}
			this.selectedAreaOptions = [...areaStr];
			this.ruleForm.Address = seled[3];
		},
		chooseShopFun(v) {
			if (!v) {
				this.chooseShopList = [];
			}
		},
		defaultData() {
			Object.assign(this.$data, this.$options.data());
			if (this.$refs.ruleForm) this.$refs.ruleForm.resetFields();
			if (this.shopList.length == 0) {
				this.$store.dispatch("getShopList", {});
			}
			if (this.dealType.type == "add") {
				this.dateBE = [new Date().getTime(), new Date(this.getCustomDay(7)).getTime()];
			}
		}
	},
	mounted() {
		this.defaultData();
	}
};
</script>
<style scoped>
.half {
	width: 50%;
	margin-right: 0px;
	float: left;
}
</style>
