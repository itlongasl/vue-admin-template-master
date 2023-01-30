<template>
  <div>
    <el-card>
      <el-table :data="skuList" border style="width: 100%">
        <el-table-column type="index" label="序号" width="80px" align="center" />
        <el-table-column prop="skuName" label="名称" />
        <el-table-column prop="skuDesc" label="描述" />
        <el-table-column label="默认图片" width="160px" align="center">
          <template slot-scope="{row,$index}">
            <img :src="row.skuDefaultImg" style="width:100px;height:100px">
          </template>
        </el-table-column>
        <el-table-column prop="weight" label="重量(KG)" />
        <el-table-column prop="price" label="价格(元)" width="80px" />
        <el-table-column label="操作" align="center">
          <template slot-scope="{row,$index}">
            <el-button
              v-if="row.isSale === 0"
              type="success"
              icon="el-icon-top"
              size="mini"
              @click="sale(row)"
            />
            <el-button
              v-else
              type="info"
              icon="el-icon-bottom"
              size="mini"
              @click="cancel(row)"
            />
            <el-button type="primary" icon="el-icon-edit" size="mini" />
            <el-button type="info" icon="el-icon-info" size="mini" @click="getSkuInfo(row)" />
            <el-button type="danger" icon="el-icon-delete" size="mini" />
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        style="text-align:center;margin:10px 0"
        :current-page="1"
        :page-sizes="[3, 5, 7]"
        :page-size="limit"
        layout="prev, pager, next, jumper,->, sizes,total"
        :total="total"
        :page-count="7"
        @size-change="handleSizeChange"
        @current-change="getSkuList"
      />

      <!-- Drawer 抽屉 -->
      <el-drawer title="我是标题" :visible.sync="drawer" size="50%" :with-header="false">
        <el-row>
          <el-col :span="5">名称</el-col>
          <el-col :span="16">{{ skuInfo.skuName }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="5">描述</el-col>
          <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="5">价格</el-col>
          <el-col :span="16">{{ skuInfo.price }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="5">平台属性</el-col>
          <el-col :span="16">
            <el-tag
              v-for="attr in skuInfo.skuAttrValueList"
              :key="attr.id"
              type="success"
              style="margin:5px"
            >{{
              attr.attrId
            }}-{{ attr.valueId }}</el-tag>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">商品图片</el-col>
          <el-col :span="16">
            <el-carousel :interval="2000" arrow="hover">
              <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
                <img :src="item.imgUrl" style="width:100%;height:100%">
              </el-carousel-item>
            </el-carousel>
          </el-col>
        </el-row>
      </el-drawer>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Sku',
  data() {
    return {
      // 当前页码
      page: 1,
      // 每页展示数量
      limit: 3,
      // 总商品数量
      total: 0,
      // sku数据列表
      skuList: [],
      // 控制抽屉的弹出
      drawer: false,
      // sku详情
      skuInfo: {}
    }
  },
  mounted() {
    this.getSkuList()
  },
  methods: {
    async getSkuList(pages = 1) {
      this.page = pages
      const { page, limit } = this
      // 获取sku列表数据
      const result = await this.$API.sku.reqSkuList(page, limit)
      try {
        const { data } = result
        // 存储sku列表数据
        this.skuList = data.records
        this.page = data.current
        this.total = data.total
      } catch (error) {
        this.$message(error)
      }
    },

    handleSizeChange(limit) {
      this.limit = limit
      this.getSkuList()
    },
    // sku上架
    async sale(row) {
      const result = await this.$API.sku.reqOnSale(row.id)
      try {
        row.isSale = 1
        // this.getSkuList()
        this.$message.success('上架成功')
      } catch (error) {
        this.$message(error)
      }
    },
    // sku下架
    async cancel(row) {
      const result = await this.$API.sku.reqCancelSale(row.id)
      try {
        row.isSale = 0
        // this.getSkuList()
        this.$message.info('下架成功')
      } catch (error) {
        this.$message(error)
      }
    },
    async getSkuInfo(row) {
      // 控制抽屉的弹出
      this.drawer = true
      const result = await this.$API.sku.reqSkuDetail(row.id)
      try {
        this.skuInfo = result.data
      } catch (error) {
        this.$message.danger('数据请求失败')
      }
    }

  }
}
</script>

<style scoped>
.el-row:first-child {
    margin-top: 50px;
}

.el-row .el-col-5 {
    font-size: 18px;
    font-weight: 700;
    text-align: right;
}

.el-col {
    margin: 20px 10px;
}
</style>
