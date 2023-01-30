<template>
  <div>
    <el-card>
      <!-- 三级联动菜单 -->
      <CategorySelect :show="!isShowTabel" @getCategoryId="getCategoryId" />
    </el-card>
    <el-card style="margin:20px 0">
      <div v-show="isShowTabel">
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin:20px 0"
          :disabled="!category3Id"
          @click="addAttr"
        >添加属性</el-button>
        <el-table border style="width: 100%" :data="categoryData">
          <el-table-column type="index" label="序号" width="80px" align="center" />
          <el-table-column prop="attrName" label="属性名称" width="150px" />
          <el-table-column label="属性值列表">
            <template slot-scope="{row,$index}">
              <el-tag
                v-for="item in row.attrValueList"
                :key="item.categoryId"
                type="success"
                style="margin:0 5px"
              >{{
                item.valueName
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作" width="150px">
            <template slot-scope="{row,$index}">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                style="margin:0 0 15px"
                @click="updateAttr(row)"
              />
              <!-- <el-popconfirm title="这是一段内容确定删除吗？">
                                <el-button type="danger" slot="reference" icon="el-icon-delete" size="mini"></el-button>
                            </el-popconfirm> -->
              <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="!isShowTabel">
        <!-- 添加属性|修改属性 -->
        <el-form v-model="attrInfo" :inline="true">
          <el-form-item label="属性名">
            <el-input v-model="attrInfo.attrName" placeholder="请输入属性名" />
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attrInfo.attrName"
          @click="addAttrValue"
        >添加属性值</el-button>
        <el-button @click="isShowTabel = true">取消</el-button>
        <el-table :data="attrInfo.attrValueList" border style="width: 100%;margin:20px 0">
          <el-table-column type="index" label="序号" width="80px" align="center" />
          <el-table-column prop="name" label="属性值名称">
            <template slot-scope="{row,$index}">
              <el-input
                v-if="row.flag"
                v-model="row.valueName"
                placeholder="请输入属性名"
                size="mini"
                autofocus="autofocus"
                :ref="$index"
                @blur="toLook(row, false)"
                @keyup.native.enter="toLook(row)"
              />
              <span v-else style="display: block;" @click="toEdit(row, $index)">{{
                row.valueName
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作">
            <template slot-scope="{row,$index}">
              <el-popconfirm :title="`确定删除${row.valueName}吗？`" @onConfirm="deleteAttrValue($index)">
                <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" />
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="saveAttrValueList">保存</el-button>
        <el-button @click="isShowTabel = true">取消</el-button>

      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Attr',
  data() {
    return {
      // 一级id
      category1Id: '',
      // 二级id
      category2Id: '',
      // 三级id
      category3Id: '',
      // 品牌数据存放
      categoryData: [],
      // 控制显示隐藏
      isShowTabel: true,
      flag: true,
      attrInfo: {
        attrName: '', // 属性名
        attrValueList: [// 属性值 多个 使用数组

        ],
        categoryId: 0, // 存储三级菜单的id
        categoryLevel: 3 // 标识，告诉服务器添加的是3级菜单属性
      }
    }
  },
  // 组件挂在获取品牌分类数据
  mounted() {
    this.getCategoryId
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
        // 当三级id传过来时发送请求
        this.getAttrList()
      }
    },
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this
      const result = await this.$API.attr.reqCategoryData(category1Id, category2Id, category3Id)
      if (result.code === 200) {
        this.categoryData = result.data
      }
    },
    addAttrValue() {
      const AttrValueListlength = this.attrInfo.attrValueList.length
      if (!this.isNull() && AttrValueListlength !== 0) return
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id, // 添加|修改数据时，带上id属性，添加没有id，为undefined
        valueName: '',
        flag: true
      })
    },
    // 添加按钮回调
    addAttr() {
      // 隐藏显示tabel
      this.isShowTabel = false
      // 清除数据并收集三级id
      this.attrInfo = {
        attrName: '', // 属性名
        attrValueList: [// 属性值 多个 使用数组

        ],
        categoryId: this.category3Id, // 存储三级菜单的id
        categoryLevel: 3 // 标识，告诉服务器添加的是3级菜单属性
      }
    },
    updateAttr(row) {
      // 隐藏显示tabel
      this.isShowTabel = false
      // 深拷贝赋值
      this.attrInfo = JSON.parse(JSON.stringify(row))
      this.attrInfo.attrValueList.forEach(item => {
        this.$set(item, 'flag', true)
      })
      /*

              attrName:"中国十大畅销书111"
              attrValueList: Array(3)
              categoryId: 1
              categoryLevel: 3
              id: (...)*/
    },
    // 控制输入框的显示与隐藏
    toLook(row) {
      // 判断添加的属性值是否重复
      const isRepat = this.attrInfo.attrValueList.some(item => {
        if (row !== item) {
          return row.valueName === item.valueName
        }
      })
      if (isRepat) return this.$message.error('不能输入相同属性值！')
      // 判断如果添加空属性或重复的属性值弹窗提醒
      if (row.valueName.trim() === '') return this.$message.error('请输入属性值！')
      row.flag = false
    },
    toEdit(row, index) {
      row.flag = true
      // input自动聚焦
      this.$nextTick(function() {
        this.$refs[index].focus()
      })
    },
    // 删除属性值
    deleteAttrValue(index) {
      this.attrInfo.attrValueList.splice(index, 1)
    },
    async saveAttrValueList() {
      // 判断是否有空的输入框
      if (!this.isNull()) return this.$message.error('存在空属性值！')
      // 判断添加的属性值是否重复
      const valueNames = this.attrInfo.attrValueList.map(item => item.valueName)
      if (new Set(valueNames).size !== valueNames.length) return
      // 将数据过滤，把服务器不需要的字段移除
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item => {
        delete item.flag
        return true
      })
      try {
        const result = await this.$API.attr.reqAddAttr(this.attrInfo)
        this.$message.success('保存成功！')
        // 重新渲染
        this.getAttrList()
        // 添加成功返回列表页面
        this.isShowTabel = true
      } catch (error) {
        this.$message.error('保存失败！')
      }
    },
    isNull() {
      return this.attrInfo.attrValueList.every(item => item.valueName)
    }
  }
}
</script>

<style>

</style>
