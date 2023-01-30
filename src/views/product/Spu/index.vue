<template>
  <div>
    <el-card>
      <!-- 三级联动菜单 -->
      <CategorySelect :show="scene!=0" @getCategoryId="getCategoryId" />
    </el-card>
    <el-card style="margin:20px 0">
      <!-- 底下三部分切换 -->
      <!-- 第一部分 展示spu列表 -->
      <div v-show="scene == 0">
        <!-- 添加spu按钮 -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin:20px 0"
          :disabled="!category3Id"
          @click="addSpu"
        >添加Spu属性</el-button>
        <!-- 表格部分 -->
        <el-table border style="width: 100%" :data="spuList">
          <el-table-column type="index" label="序号" width="80px" align="center" />
          <el-table-column prop="spuName" label="spu名称" />
          <el-table-column prop="description" label="spu描述" />
          <el-table-column label="操作">
            <template slot-scope="{row,$index}">
              <hint-button
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加sku"
                @click="addSku(row)"
              />
              <hint-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改spu"
                @click="updateSpu(row)"
              />
              <hint-button
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看当前spu全部sku列表"
                @click="showSkuList(row)"
              />
              <hint-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                title="删除spu"
                @click="deleteSpu(row)"
              />
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页部分 -->
        <el-pagination
          style="text-align:center"
          :current-page="page"
          :page-sizes="[3, 5, 7]"
          :page-size="limit"
          layout="prev, pager, next, jumper,->, sizes,total"
          :total="total"
          :page-count="7"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <SpuForm v-show="scene == 1" ref="spu" @changeScene="changeScene" />
      <SkuForm v-show="scene == 2" ref="sku" @changeScene="changeScene" />
      <!-- 展示sku列表 -->
      <el-dialog :title="`${spu.spuName}的sku列表`" :visible.sync="dialogTableVisible">
        <el-table v-loading="loading" :data="skuList">
          <el-table-column property="skuName" label="名称" />
          <el-table-column property="price" label="价格" />
          <el-table-column property="weight" label="重量" />
          <el-table-column label="默认图片">
            <template slot-scope="{row,$index}">
              <img :src="row.skuDefaultImg" style="width:100px;height:100px">
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import SkuForm from './SkuForm/index.vue'
import SpuForm from './SpuForm/index.vue'
export default {
  name: 'Spu',
  components: { SkuForm, SpuForm },
  data() {
    return {
      category1Id: '', // 一级id
      category2Id: '', // 二级id
      category3Id: '', // 三级id
      show: false, // 控制三级联动菜单的状态
      page: 1, // 当前页码
      limit: 3, // 每页展示数据
      total: 0, // 总商品数
      spuList: [], // //存放spu列表数据
      scene: 0, // 控制显示隐藏
      dialogTableVisible: false, // 控制sku列表展示弹出框
      skuList: [], // sku列表数据
      spu: {}, // 用于展示
      loading: true
    }
  },
  methods: {
    // 自定义事件 三级分类品牌数据的请求
    async getCategoryId({ categoryId, level }) {
      if (level === 1) {
        // 当一级id传过来存储到data
        this.category1Id = categoryId
        // 并将二级三级的id清空 防止上次残留id
        this.category2Id = ''
        this.category3Id = ''
      } else if (level === 2) {
        // 当二级id传过来存储到data
        this.category2Id = categoryId
        // 并将三级的id清空 防止上次残留id
        this.category3Id = ''
      } else {
        // 当三级id传过来存储到data
        this.category3Id = categoryId
        // 获取spu列表的方法
        this.getSpuList()
      }
    },
    // spu列表数据请求
    async getSpuList() {
      const { page, limit, category3Id } = this
      const result = await this.$API.spu.reqSpuList(page, limit, category3Id)
      try {
        const { data } = result
        this.spuList = data.records
        this.page = data.current
        this.total = data.total
      } catch (error) {
        this.$message(error)
      }
    },
    // 每页展示数量改变时触发
    handleSizeChange(limit) {
      this.limit = limit
      this.getSpuList()
    },
    // 当前页码发生改变时触发
    handleCurrentChange(page) {
      this.page = page
      this.getSpuList()
    },
    // 添加spu按钮处理函数
    addSpu() {
      this.scene = 1
      // 发送请求
      this.$refs.spu.addSpuData(this.category3Id)
    },
    // 修改spu按钮处理函数
    updateSpu(row) {
      this.scene = 1
      // 通过ref获取到子组件实例 调用子组件的initSpuData方法请求数据
      this.$refs.spu.initSpuData(row)
    },
    // 取消按钮自定义事件
    changeScene({ scene, flag }) {
      this.scene = scene
      // flag:区分是修改还是添加
      if (flag == '修改') {
        this.getSpuList(this.page)
      } else {
        this.getSpuList()
      }
    },
    // 删除spu按钮事件
    async deleteSpu(row) {
      const result = await this.$API.spu.reqDeleteSpu(row.id)
      if (result.code === 200) {
        if (this.spuList.length == 0 && page > 1) {
          console.log(this.page, '1')
          this.page = this.page - 1
          // 删除成功重新渲染页面并停在当前页面
          console.log(this.page, '2')
          this.getSpuList()
        } else {
          this.getSpuList()
        }
      }
    },
    // 添加sku按钮事件
    addSku(row) {
      this.scene = 2
      // 调用子组件的方法请求默认显示参数
      this.$refs.sku.getData(this.category1Id, this.category2Id, row)
    },
    // 展示sku列表
    async showSkuList(row) {
      // 清除残留数据
      this.skuList = []
      // 显示loading
      this.loading = true
      // 弹出框
      this.dialogTableVisible = true
      // 请求sku列表数据
      const result = await this.$API.spu.reqSkuList(row.id)
      if (result.code === 200) {
        this.skuList = result.data
        // 隐藏loading
        this.loading = false
      }
      this.spu = row
      this.dialogTableVisible = true
    }
  }
}
</script>

<style>
body {
    margin: 0;
}
</style>
