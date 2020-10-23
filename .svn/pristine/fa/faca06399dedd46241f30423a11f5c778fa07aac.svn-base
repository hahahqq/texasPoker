<template>
	<div>
		<div class="text-center bg-white padding-sm" :style="{ 'min-height': height + 'px' }">
			<el-row :gutter="20">
				<el-col
					v-for="(item, i) in pageList"
					:key="i"
					:xs="24"
					:sm="24"
					:md="i == 4 ? 24 : 12"
				>
					<div class="padding-sm border marginTB-sm">
						<div class="m-bottom-md m-top-xs">{{ item.label }}</div>
						<div class="row-flex">
							<div v-for="(subitem, j) in item.value" :key="j" style="width: 33.33%">
								<div @click="toRouter(subitem.url)" class="inline-block pointer">
									<div>
										<img
											:src="imgPath + (i + 1) + '-' + (j + 1) + '.png'"
											:onerror="$store.state.defaultImg"
											alt=""
											style="width: 60px; height: 60px"
										/>
									</div>
									<div class="paddingTB-xs">{{ subitem.title }}</div>
								</div>
							</div>
						</div>
					</div>
				</el-col>
			</el-row>
		</div>
	</div>
</template>
<script>
export default {
	data() {
		return {
			height: window.innerHeight - 70,
			pageList: [],
			imgPath: "static/images/report/"
		};
	},
	methods: {
		toRouter(url) {
			this.$router.push({
				path: url
			});
		},
		defaultData() {
			let rr = this.$router.options.routes;
			let reportObj = rr.filter((item) => item.name === "reports");
			let routesList = [...reportObj[0].children[1].children];

			let newArr = [];
			routesList.forEach((element) => {
				let dd = {
						label: element.name,
						value: []
					},
					gg = element.meta.buttonGroup;
				if (gg) {
					gg.forEach((item, i) => {
						dd.value.push(
							Object.assign(
								{
									title: item.label,
									url: "/report/" + element.path + "?idx=" + i
								},
								item
							)
						);
					});
					newArr.push(dd);
				}
			});
			this.pageList = [...newArr];
		}
	},
	mounted() {
		this.defaultData();
	}
};
</script>
