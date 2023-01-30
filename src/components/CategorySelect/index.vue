<template>
  <div>
    <!-- inline:行内表单，表单不会独占一行，能将多个表单放在一行 -->
    <el-form :inline="true" :model="cForm" class="demo-form-inline">
      <el-form-item label="一级分类">
        <el-select v-model="cForm.category1Id" placeholder="请选择" :disabled="show" @change="getCategort2List">
          <!-- v-model将子标签的value的值与category1Id绑定 -->
          <el-option v-for="cate1 in category1List" :key="cate1.id" :label="cate1.name" :value="cate1.id">{{
            cate1.name
          }}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select v-model="cForm.category2Id" placeholder="请选择" :disabled="show" @change="getCategort3List">
          <el-option v-for="cate2 in category2List" :key="cate2.id" :label="cate2.name" :value="cate2.id">{{
            cate2.name
          }}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select v-model="cForm.category3Id" placeholder="请选择" :disabled="show" @change="handler">
          <el-option v-for="cate3 in category3List" :key="cate3.id" :label="cate3.name" :value="cate3.id">{{
            cate3.name
          }}</el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'CategorySelect',
  props: ['show'],
  data() {
    return {
      // 一级菜单数据
      category1List: [],
      category2List: [],
      category3List: [],
      // 收集三级菜单id
      cForm: {
        category1Id: '',
        category2Id: '',
        category3Id: ''
      }
    }
  },
  mounted() {
    // 页面挂在获取一级分类数据
    this.getCategoryList()
  },
  methods: {
    // 一级分类数据请求函数
    async getCategoryList() {
      const result = await this.$API.attr.reqCategory1List()
      if (result.code === 200) {
        this.category1List = result.data
      }
    },
    // 一级分类change事件，发生改变请求二级分类数据
    async getCategort2List() {
      // 请求之前先清除数据
      this.category2List = []
      this.category3List = []
      this.cForm.category2Id = ''
      this.cForm.category3Id = ''
      const { category1Id } = this.cForm
      const result = await this.$API.attr.reqCategory2List(category1Id)
      if (result.code === 200) {
        this.category2List = result.data
        this.$emit('getCategoryId', { categoryId: category1Id, level: 1 })
      }
    },
    // 二级分类change事件，发生改变请求三级分类数据
    async getCategort3List() {
      // 请求之前先清除数据
      this.category3List = []
      this.cForm.category3Id = ''
      const { category2Id } = this.cForm
      const result = await this.$API.attr.reqCategory3List(category2Id)
      if (result.code === 200) {
        this.category3List = result.data
        this.$emit('getCategoryId', { categoryId: category2Id, level: 2 })
      }
    },
    // 三级分类change事件，发生改变将所有id传入父组件
    handler() {
      const { category3Id } = this.cForm
      this.$emit('getCategoryId', { categoryId: category3Id, level: 3 })
    }
  }

}
</script>

<style>

</style>
