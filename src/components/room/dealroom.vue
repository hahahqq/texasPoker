<template>
  <div class="dealroom">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="名称">
        <el-input v-model="form.Name"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-switch v-model="form.Status"></el-switch>
      </el-form-item>
      <el-form-item label="排序">
        <!-- <el-input v-model.number="form.DescNo" type="number"></el-input> -->
        <el-input-number v-model="ruleForm.DescNo" controls-position="right" clearable placeholder="请输入排序序号" size="small"></el-input-number>
      </el-form-item>
      <el-form-item>
        <el-button @click="closeModal(false)">取 消</el-button>
        <el-button type="primary" @click="onSubmit" :loading="loading">保 存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
export default {
  props: {
    defaultData: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      form: {
        DistrictId:'',
        Name: "",
        Status: true,
        DescNo: ""
      },
      loading: false
    };
  },
  computed: {
    ...mapGetters({
      dataState: "roomState"
    })
  },
  watch: {
    dataState(data) {
     if (data.success && this.loading ) {
        this.closeModal(true);
      }
      this.loading = false;
    },
  },
  methods: {
    closeModal(value) {
      this.$emit("closeModal", value);
    },
    onSubmit() {
      this.$store.dispatch("saveRoomItem", this.form).then(() => {
        this.loading = true;
      });
    }
  },
  mounted() {
   this.form = Object.assign({},this.form,this.defaultData)
  }
};
</script>

