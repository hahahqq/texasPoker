<template>
	<div class="reportFilte">
		<div>
			<!-- date -->
			<el-button-group style="margin-top: -2px" v-if="!isNoDate">
				<el-button
					plain
					v-for="(label, i) in ['今天', '昨天', '本月', '上月', '其它', '全部']"
					:key="i"
					@click="chooseDate(i)"
					type="primary"
					size="small"
					:class="{ isActive: chooseDateIdx == i }"
				>
					{{ label }}
				</el-button>
			</el-button-group>
			<!-- 选择店铺 -->
			<el-dropdown @command="shopCheckfun" class="m-left-sm">
				<el-button type="primary" size="small" plain>
					<span v-text="shopCheckText ? shopCheckText : '请选择店铺'"></span>
					<i class="el-icon-arrow-down el-icon--right"></i>
				</el-button>
				<el-dropdown-menu slot="dropdown">
					<el-dropdown-item v-if="isAll" :command="-1">全部</el-dropdown-item>
					<el-dropdown-item v-for="(item, i) in shopList" :key="i" :command="i">
						{{ item.NAME }}
					</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>

			<el-button
				type="primary"
				size="small"
				class="m-left-sm"
				plain
				v-if="isExport"
				@click="exportState()"
			>
				<i class="el-icon-upload el-icon--right"></i>
				导出表格
			</el-button>

			<!-- 其它按钮 -->
			<slot name="button"></slot>
		</div>
		<div v-if="isShowDate" class="p-top-sm">
			<el-date-picker
				v-model="dateBE.BeginDate"
				align="left"
				type="date"
				value-format="timestamp"
				@change="chooseDate2"
				placeholder="选择开始日期"
			></el-date-picker>
			<span>至</span>
			<el-date-picker
				v-model="dateBE.EndDate"
				type="date"
				value-format="timestamp"
				@change="chooseDate2"
				placeholder="选择结束日期"
			></el-date-picker>
			<!-- <el-date-picker
				ref="dateBE"
				v-model="dateBE"
				@change="chooseDate2"
				type="daterange"
				value-format="timestamp"
				range-separator="至"
				start-placeholder="开始日期"
				end-placeholder="结束日期"
				style="width: 400px"
				class="inline-block"
			></el-date-picker> -->
		</div>
	</div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import { getHomeData } from "@/api/index";
import dayjs from "dayjs";
export default {
	props: {
		isAll: {
			// 是否选择全部店铺
			type: Boolean,
			default: false
		},
		isExport: {
			// 是否导出
			type: Boolean,
			default: false
		},
		isNoDate: {
			// 是否没日期
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			shopCheckText: "",
			shopCheckidx: "",
			ruleFrom: {
				ShopId: "",
				BeginDate: "1",
				EndDate: "9999999999999"
			},
			isShowDate: false,
			dateBE: {
				BeginDate: "",
				EndDate: ""
			},
			chooseDateIdx: 0
		};
	},
	computed: {
		...mapGetters({
			shopList: "shopList"
		})
	},
	methods: {
		exportState() {
			this.$emit("exportState", true);
		},
		getNewData() {
			this.$emit("getNewData", this.ruleFrom, this.chooseDateIdx);
		},
		shopCheckfun(index) {
			if (index == -1) {
				this.shopCheckidx = -1;
				this.shopCheckText = "全部店铺";
				let str = "";
				for (let i = 0; i < this.shopList.length; i++) {
					str += this.shopList[i].ID;
					if (i < this.shopList.length - 1) {
						str += ",";
					}
				}
				this.ruleFrom.ShopId = str;
				// this.ruleFrom.ShopId = '';
				this.$store.dispatch("selectingShop", {});
			} else {
				this.shopCheckidx = index;
				this.shopCheckText = this.shopList[index].NAME;
				this.ruleFrom.ShopId = this.shopList[index].ID;
				this.$store.dispatch("selectingShop", {
					ID: this.shopList[index].ID,
					NAME: this.shopList[index].NAME
				});
			}
			this.getNewData();
		},
		chooseDate(i) {
			this.chooseDateIdx = i;
			console.log(i);
			if (i < 4 || i == 5) {
				this.isShowDate = false;
			}
			switch (i) {
				case 0:
					this.ruleFrom.BeginDate = this.getTimeStamp();
					this.ruleFrom.EndDate = new Date().getTime();
					this.getNewData();
					break;
				case 1:
					this.ruleFrom.BeginDate = this.getTimeStamp(1);
					this.ruleFrom.EndDate = this.ruleFrom.BeginDate + 86400000 - 1;
					this.getNewData();
					break;
				case 2:
					let arr2 = this.getAroundMonth();
					this.ruleFrom.BeginDate = new Date(arr2[0]).getTime();
					this.ruleFrom.EndDate = this.getTimeStampstatuesOutput(arr2[1]) + 86400000 - 1;
					this.getNewData();
					break;
				case 3:
					var nowdays = new Date();
					var year = nowdays.getFullYear();
					var month = nowdays.getMonth();
					if (month == 0) {
						month = 12;
						year = year - 1;
					}
					if (month < 10) {
						month = "0" + month;
					}
					var firstDay = year + "-" + month + "-" + "01"; //上个月的第一天
					var myDate = new Date(year, month, 0); //上个月最后一天
					var lastDay = year + "-" + month + "-" + myDate.getDate(); //上个月的最后一天

					this.ruleFrom.BeginDate = dayjs(firstDay).valueOf();
					this.ruleFrom.EndDate = dayjs(lastDay).valueOf();
					this.getNewData();
					break;
				case 4:
					this.isShowDate = !this.isShowDate;
					break;
				default:
					// 5=全部
					this.ruleFrom.BeginDate = "1";
					this.ruleFrom.EndDate = "9999999999999";
					this.getNewData();
			}
		},
		chooseDate2(v) {
			// this.ruleFrom.BeginDate = v[0];
			// this.ruleFrom.EndDate = v[1];

			console.log(this.dateBE);
			if (this.dateBE.BeginDate && this.dateBE.EndDate) {
				this.getNewData();
			}
		},
		defaultData() {
			if (this.shopList.length == 0) {
				this.$store.dispatch("getShopList", {});
			}
			this.ruleFrom = {
				ShopId: getHomeData().shop.ID,
				BeginDate: this.getTimeStamp(),
				EndDate: new Date().getTime()
			};
			this.shopCheckText = getHomeData().shop.NAME;
		}
	},
	mounted() {
		this.defaultData();
	}
};
</script>
