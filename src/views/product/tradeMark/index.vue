<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" style="margin:10px 0" @click="addTradeMark(true)">添加</el-button>
    <!-- 表格部分 -->
    <el-table border style="width: 100%" :data="list">
      <el-table-column type="index" label="序号" width="80px" align="center" />
      <el-table-column prop="tmName" label="品牌名称" />
      <el-table-column label="品牌LOGO">
        <template slot-scope="{row,$index}">
          <img :src="row.logoUrl" style="width: 100px;height: 100px;">
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="{row,$index}">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="updateTradeMark(row)"
          >修改</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteTradeMark(row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器四个参数：当前页码，总商品数，连续页码，每页展示商品数 -->
    <!--
            current-page：当前页码
            page-sizes：通过此属性设置每页设置展示商品数量
            page-size：每页展示数量
            :total：商品总数量
            layout：实现页面布局
            page-count：按钮的数量（所有能看得见的按钮，如果设置为7，则连续页码为5，因为前面和后面的两个按钮也算）
         -->
    <el-pagination
      style="margin-top:20px;text-align: center;"
      :current-page="page"
      :page-sizes="[3, 5, 7]"
      :page-size="limit"
      layout="prev, pager, next, jumper,->, sizes,total"
      :total="total"
      :page-count="7"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!-- 对话框 -->
    <el-dialog title="添加品牌" :visible.sync="dialogFormVisible">
      <el-form ref="ruleForm" :model="tmForm" :rules="rules">
        <el-form-item label="品牌名称" :label-width="formLabelWidth" prop="tmName">
          <el-input v-model="tmForm.tmName" autocomplete="off" style="width:80%" />
        </el-form-item>
        <el-form-item label="品牌LOGO" :label-width="formLabelWidth" prop="logoUrl">
          <!-- action:设置图片上传的路径
                    :on-success="handleAvatarSuccess"：图片上传成功执行该函数
                    :before-upload="beforeAvatarUpload"：图片上传之前执行该函数
                 -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addTradeMark(false)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'TradeMark',
  data() {
    return {
      page: 1,
      limit: 3,
      list: [],
      total: 0,
      dialogTableVisible: false,
      dialogFormVisible: false,
      // 弹出框数据
      tmForm: {
        tmName: '',
        logoUrl: ''
      },
      formLabelWidth: '120px',
      rules: {
        // 品牌名称校验规则
        tmName: [
          { required: true, message: '请输入品牌名称！', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
        ],
        // 品牌logo校验规则
        logoUrl: [
          { required: true, message: '请上传品牌LOGO！' }
        ]
      }
    }
  },
  mounted() {
    this.getListData()
  },
  methods: {
    async getListData() {
      const { page, limit } = this
      const result = await this.$API.tradeMark.reqTradeMarkList(page, limit)
      if (result.code === 200) {
        this.page = result.data.current
        this.total = result.data.total
        this.list = result.data.records
      }
    },
    // 每页展示数量改变时触发
    handleSizeChange(limit) {
      // 接受一个参数  新的当前页展示数据数量
      this.limit = limit
      // 更新数据，重新发送请求
      this.getListData()
    },
    // 当前页码发生改变时触发
    handleCurrentChange(page) {
      // 接受一个参数，新的当前页码
      this.page = page
      // 更新数据，重新发送请求s
      this.getListData()
    },
    handleAvatarSuccess(res, file) {
      this.tmForm.logoUrl = res.data
      console.log(res, file)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 真正的修改和添加品牌都写在了确定按钮事件
    addTradeMark(flag) {
      this.dialogFormVisible = flag
      // 判断是否有id属性 如果没有就证明是添加  至于flag是为了区分点击的是添加还是确定按钮
      if (!flag && !this.tmForm.id) {
        this.$refs.ruleForm.validate(async(success) => {
          if (success) {
            const { tmName, logoUrl } = this.tmForm
            const result = await this.$API.tradeMark.reqAddTradeMark({ tmName: tmName, logoUrl: logoUrl })
            if (result.code === 200) {
              // 提示信息
              this.$message.success('添加品牌成功！')
              // 重新获取列表信息渲染页面
              this.getListData()
              // 清空数据
              this.tmForm.tmName = ''
              this.tmForm.logoUrl = ''
            }
          } else {
            // 校验不通过添加页面会自动关闭，这里手动重置表单
            this.dialogFormVisible = true
            return false
          }
        })
      } else if (!flag) {
        this.$refs.ruleForm.validate(async(success) => {
          if (success) {
            const result = await this.$API.tradeMark.reqUpdateTradeMark(this.tmForm)
            if (result.code === 200) {
              // 提示信息
              this.$message.success('修改品牌成功！')
              // 重新获取列表信息渲染页面
              this.getListData()
              // 清空数据
              this.tmForm.tmName = ''
              this.tmForm.logoUrl = ''
            }
          } else {
            this.dialogFormVisible = true
            return false
          }
        })
      }
    },
    // 修改品牌
    updateTradeMark(row) {
      this.dialogFormVisible = true
      this.tmForm = { ...row }
    },
    // 删除品牌事件
    deleteTradeMark(row) {
      this.$confirm(`此操作将永久删除${row.tmName}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const result = await this.$API.tradeMark.reqDeleteTradeMark(row.id)
        if (result.code === 200) {
          if (this.list.length == 1) { this.page = this.page - 1 }
          // 重新渲染 并且停留在当前页
          this.getListData(this.page)
          this.$message.success({
            type: 'success',
            message: '删除成功!'
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }

  }

}
</script>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}

.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>
