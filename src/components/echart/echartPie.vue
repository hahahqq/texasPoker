<template>
	<div>
		<div :id="idName" class="full-width" :style="{ minWidth: '300px', height: '300px' }"></div>
	</div>
</template>
<script>
import echarts from "echarts";
export default {
	props: {
		idName: { type: String, default: "myChart" },
		pieData: {
			type: Object,
			default: {
				show: false,
				data: {
					title: "饼状图demo",
					legend: ["直接访问", "邮件营销", "联盟广告", "视频广告", "搜索引擎"],
					series: [
						{ value: 235, name: "视频广告" },
						{ value: 274, name: "联盟广告" },
						{ value: 310, name: "邮件营销" },
						{ value: 335, name: "直接访问" },
						{ value: 400, name: "搜索引擎" }
					]
				}
			}
		},
		unit: {
			type: String,
			default: "元"
		}
	},
	watch: {
		typeData(data) {
			if (data.show) {
				setTimeout(() => {
					this.defaultData();
				}, 200);
			}
		}
	},
	methods: {
		defaultData() {
			let dd = this.typeData.data;
			this.drawLine(this.idName, this.unit, dd.title, dd.legend, dd.series);
		},
		drawLine(id, unit, title, legendArr, seriesArr) {
			// 基于准备好的dom，初始化echarts实例
			let myChart = echarts.init(document.getElementById(id));
			// 绘制图表
			myChart.setOption({
				title: {
					text: title
				},
				tooltip: {
					trigger: "item",
					formatter: "{a} <br/>{b}: {c} ({d}%)"
				},
				legend: {
					orient: "vertical",
					x: "70%",
					y: "15%",
					data: [...legendArr],
					left: "left",
					itemWidth: 10,
					itemHeight: 10,
					selectedMode: false, //禁止点击
					textStyle: {
						fontSize: 14,
						color: "#999"
					},
					formatter: function (name) {
						return name.length > 9 ? name.slice(0, 9) + "..." : name;
					}
				},
				grid: {
					left: "13%",
					right: "4%",
					bottom: "30",
					containLabel: false
				},
				toolbox: {
					feature: {
						saveAsImage: {}
					}
				},
				series: [
					{
						name: title,
						type: "pie",
						radius: "55%",
						itemStyle: {
							normal: {
								label: {
									show: true,
									formatter: function (params) {
										var name = params.name; //名字
										var percent = params.percent; //占比
										var value = params.value; //数量
										if (name.length > 8) {
											return (
												name.slice(0, 7) +
												"..." +
												"\n" +
												"(" +
												value +
												unit +
												")" +
												percent +
												"%"
											);
										} else {
											return (
												name +
												"\n" +
												"(" +
												value +
												unit +
												")" +
												percent +
												"%"
											);
										}
									}
								},
								labelLine: {
									show: true
								}
							},
							emphasis: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: "rgba(0, 0, 0, 0.5)"
							}
						},
						data: [...seriesArr]
					}
				]
			});
		}
	},
	mounted() {
		if (this.typeData.show) {
			setTimeout(() => {
				this.defaultData();
			}, 200);
		}
	}
};
</script>
