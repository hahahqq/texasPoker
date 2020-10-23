<template>
	<div>
		<!-- 赛事盈利分析 -->
		<div>
			{{ pageInfo }}
			<span>{{ pageInfo.ENDTIME | formatTime }}</span>

			"TYPENAME": "猎人赛", "SHOPID": "16853", "NOTEXCHANGEMONEY": -559, "EXCHANGEMONEY":
			1090, "BILLID": "20191213S000001", "REWARDMONEY": 531, "TOTALQTY": 11, "PLAYTIME":
			1576221595237, "CHARGESMONEY": 59, "TOTALBUYMONEY": 590, "ENDTIME": 1576303567000,
			"MANUALNO": "8899", "GAINMONEY": -441, "VIPCOUNT": 7, "DESKNAME": "SNG1号桌",
			"BUYPRICE": 53.64, "SHOPNAME": "总店"
		</div>
		<div>
			<el-table
				border
				:data="tableList"
				v-loading="loading"
				:height="tHeight"
				header-row-class-name="bg-F1F2F3"
			>
				<el-table-column>
					<template slot-scope="scope">
						<img
							:src="scope.row.IMAGEURL"
							style="width: 70px"
							class="pull-left"
							alt="图片"
						/>
						<div>{{ scope.row.VIPNAME }}</div>
						<div>{{ scope.row.VIPCODE }}</div>
						<div>{{ scope.row.VIPMOBILENO }}</div>
					</template>
				</el-table-column>
				<el-table-column prop="REWARDNAME" label="排名"></el-table-column>
				<el-table-column prop="BUYQTY" label="买入数量"></el-table-column>
				<el-table-column prop="BUYMONEY" label="买入金额"></el-table-column>
				<el-table-column prop="EXCHANGEMONEY" label="交易金额"></el-table-column>

				<!-- <el-table-column label="操作" align="right">
					<template slot-scope="scope">
						<el-button-group>
							<el-button
								size="small"
								type="text"
								@click="handleDel(scope.$index, scope.row)"
								icon="el-icon-delete"
							>
								删除
							</el-button>
						</el-button-group>
						<div class="hide">{{ scope.row }}</div>
					</template>
				</el-table-column> -->
			</el-table>
		</div>
	</div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import { indexQuery } from "@/store/modules2/report/indexFun.js";
export default {
	props: {
		typeData: {
			type: Object,
			default: function () {
				return {
					show: false,
					data: {
						ShopId: "",
						BillId: null
					}
				};
			}
		}
	},
	data() {
		return {
			loading: false,
			formData: { ShopId: "", BillId: null },
			pageInfo: {},
			tableList: []
		};
	},
	computed: {
		...mapGetters({
			dataState: "actionsDataState",
			dataListState: "commonListState"
		})
	},
	watch: {
		typeData(data) {
			if (data.show) {
				this.defaultData();
			}
		},
		dataState(data) {
			if (this.loading) {
				if (data.success) {
					this.pageInfo = data.data.BillInfo;
					this.tableList = data.data.BuyList;
					console.log(111, data);
				} else {
					this.$message.error(data.message);
				}
			}
			this.loading = false;
		}
	},
	methods: {
		closeModal(v) {
			this.$emit("closeModal", v);
		},
		getNewData() {
			indexQuery.matchItem(this, "matchItem", this.formData);
			this.loading = true;
		},

		defaultData() {
			this.formData = Object.assign({}, this.typeData.data);
			this.getNewData();
		}
	},
	mounted() {
		if (this.typeData.show) {
			this.defaultData();
		}
	}
};
</script>
