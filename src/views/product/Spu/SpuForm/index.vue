<template>
  <div><el-form label-width="80px">
    <el-form-item label="SPU名称">
      <el-input v-model="spu.spuName" placeholder="SPU名称" />
    </el-form-item>
    <el-form-item label="品牌">
      <el-select v-model="spu.tmId" placeholder="请选择品牌">
        <el-option
          v-for="item in tradeMrakList"
          :key="item.id"
          :label="item.tmName"
          :value="item.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input v-model="spu.description" type="textarea" placeholder="SPU描述" :rows="4" />
    </el-form-item>
    <el-form-item label="SPU图片">
      <el-upload
        action="/dev-api/admin/product/fileUpload"
        list-type="picture-card"
        :on-success="handlerSuccess"
        :file-list="spuImageList"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
      >
        <i class="el-icon-plus" />
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-select v-model="attrIdAndAttrName" :placeholder="`还有${unSelectSaleAttr.length}未选择`">
        <el-option
          v-for="unSelec in unSelectSaleAttr"
          :key="unSelec.id"
          :label="unSelec.name"
          :value="`${unSelec.id}:${unSelec.name}`"
        />
      </el-select>
      <el-button
        type="primary"
        icon="el-icon-plus"
        style="margin-left:5px"
        :disabled="!attrIdAndAttrName"
        @click="addSaleAttr"
      >添加销售属性</el-button>
      <el-table border style="width:100%;margin:10px 0" :data="spu.spuSaleAttrList">
        <el-table-column type="index" label="序号" width="80px" align="center" />
        <el-table-column prop="saleAttrName" label="属性名称" width="150px" />
        <el-table-column label="属性值列表">
          <template slot-scope="{row,$index}">
            <el-tag
              v-for="(tag, index) in row.spuSaleAttrValueList"
              :key="tag.id"
              closable
              :disable-transitions="false"
              @close="handleClose(row, index)"
            >
              {{ tag.saleAttrValueName }}
            </el-tag>
            <el-input
              v-if="row.inputVisible"
              ref="saveTagInput"
              v-model="row.inputValue"
              class="input-new-tag"
              size="small"
              @keyup.enter.native="$event.target.blur"
              @blur="handleInputConfirm(row)"
            />
            <el-button v-else class="button-new-tag" size="small" @click="showInput(row)">添加</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150px">
          <template slot-scope="{row,$index}">
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="spu.spuSaleAttrList.splice($index, 1)"
            />
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
  </div>
</template>

<script>
export default {
  name: 'SpuForm',
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      a: 0,
      // 存储spu信息
      spu: {
        // 三级id
        category3Id: 0,
        // spu描述
        description: '',
        // 平台id
        tmId: '',
        // spu名称
        spuName: '',
        spuImageList: [
          // {
          //     id: 0,
          //     imgName: "",
          //     imgUrl: "",
          //     spuId: 0
          // }
        ],
        spuSaleAttrList: [
          // {
          //     baseSaleAttrId: 0,
          //     id: 0,
          //     saleAttrName: "",
          //     spuId: 0,
          //     spuSaleAttrValueList: [
          //         {
          //             baseSaleAttrId: 0,
          //             id: 0,
          //             isChecked: "",
          //             saleAttrName: "",
          //             saleAttrValueName: "",
          //             spuId: 0
          //         }
          //     ]
          // }
        ]
      },
      // 存储品牌信息
      tradeMrakList: [],
      // 存储spu图片
      spuImageList: [],
      // 平台销售属性列表
      saleAttrList: [],
      inputVisible: false,
      attrIdAndAttrName: ''// 收集未选中属性的id与名字
    }
  },
  computed: {
    unSelectSaleAttr() {
      const result = this.saleAttrList.filter(item => {
        return this.spu.spuSaleAttrList.every(item1 => {
          return item.name !== item1.saleAttrName
        })
      })
      return result
    }
  },
  methods: {
    // 照片墙删除回调
    handleRemove(file, fileList) {
      // file:被删除图片的数据
      // fileList:删除后剩余图片数据
      // 收集未删除照片的数据
      this.spuImageList = fileList
    },
    // 照片墙图片预览的回调
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 照片上传时间
    handlerSuccess(response, file, fileList) {
      this.spuImageList = fileList
    },
    async initSpuData(spu) {
      //  通过id获取spu相关信息
      const spuResult = await this.$API.spu.reqSpuById(spu.id)
      if (spuResult.code === 200) {
        this.spu = spuResult.data
      }
      // 获取品牌信息
      const tradeMrakResult = await this.$API.spu.reqTradeMarkList()
      if (tradeMrakResult.code === 200) {
        this.tradeMrakList = tradeMrakResult.data
      }
      // 获取spu图片
      const spuImageResult = await this.$API.spu.reqSpuImage(spu.id)
      if (spuImageResult.code === 200) {
        const newImageList = spuImageResult.data
        newImageList.forEach(item => {
          item.name = item.imgName
          item.url = item.imgUrl
        })
        this.spuImageList = newImageList
      }
      // 获取平台全部销售属性
      const attrListResult = await this.$API.spu.reqAttrList()
      if (attrListResult.code === 200) {
        this.saleAttrList = attrListResult.data
      }
    },
    handleClose(row, index) {
      row.spuSaleAttrValueList.splice(index, 1)
    },
    // 添加属性值事件
    showInput(row) {
      // 添加响应式数据inputVisible控制input框的切换
      this.$set(row, 'inputVisible', 'true')
      // 添加响应式数据inputValue收集用户输入的数据
      this.$set(row, 'inputValue', '')
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // input添加属性值失去焦点事件
    handleInputConfirm(row) {
      // 判断属性值是否为空
      if (row.inputValue.trim() == '') return this.$message('属性值不能为空！')
      // 判断属性值是否重复
      const result = row.spuSaleAttrValueList.every(item => item.saleAttrValueName != row.inputValue)
      if (!result) return this.$message('属性值不能重复！')
      // 将input隐藏，显示添加按钮
      row.inputVisible = false
      // 将属性id，输入的属性值，属性名称解构出来
      const { baseSaleAttrId, inputValue, saleAttrName } = row
      const newSaleAttrList = { baseSaleAttrId, saleAttrValueName: inputValue, saleAttrName }
      // 添加到属性值数组
      row.spuSaleAttrValueList.push(newSaleAttrList)
    },
    addSaleAttr() {
      // attrIdAndAttrName内存储的是id:name的形式
      // 通过split分割数据解构出来
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndAttrName.split(':')
      // 整理数据
      const newSaleAttrList = { baseSaleAttrId, saleAttrName, spuSaleAttrValueList: [] }
      // 追加到spuSaleAttrList数组里
      this.spu.spuSaleAttrList.push(newSaleAttrList)
      this.attrIdAndAttrName = ''
    },
    // 保存按钮回调
    async addOrUpdateSpu() {
      // 整理图片参数
      this.spu.spuImageList = this.spuImageList.map(item => {
        return {
          imgName: item.name,
          imgUrl: item.response.data || item.url
        }
      })
      // 发请求
      const result = await this.$API.spu.reqSaveOrUpdateSpu(this.spu)
      // 成功判断
      if (result.code === 200) {
        // 提示
        this.$message.success('保存成功')
        // 通知父组件关闭添加修改窗口
        this.$emit('changeScene', { scene: 0, flag: this.spu.id ? '修改' : '添加' })
      }
    },
    // 添加事件函数
    async addSpuData(category3Id) {
      // 清空对应数据
      // Object.assign:es6方法，可以用来清除数据
      // 组件实例this._data：可以操作data中的响应式数据
      // this.$options可以获取配置对象，配置对象中的data函数执行返回空的响应式数据
      // 再使用Object.assign合并，就达到清空数据的目的
      Object.assign(this._data, this.$options.data())
      // 此时还没收集三级id，通过父组件触发此方法时将三级id传过来
      this.spu.category3Id = category3Id
      // 获取平台全部销售属性
      const attrListResult = await this.$API.spu.reqAttrList()
      if (attrListResult.code === 200) {
        this.saleAttrList = attrListResult.data
      }
      // 获取品牌信息
      const tradeMrakResult = await this.$API.spu.reqTradeMarkList()
      if (tradeMrakResult.code === 200) {
        this.tradeMrakList = tradeMrakResult.data
      }
    },
    // 取消按钮事件
    cancel() {
      this.$emit('changeScene', { scene: 0 })
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

.el-tag+.el-tag {
    margin-left: 10px;
}

.button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}

.input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
}
</style>
