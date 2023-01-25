<template>
    <div>
        <el-form ref="form" label-width="80px">
            <el-form-item label="SPU名称">
                {{ spu.spuName }}
            </el-form-item>
            <el-form-item label="SKU名称">
                <el-input placeholder="SKU名称" v-model="skuInfo.skuName">
                </el-input>
            </el-form-item>
            <el-form-item label="价格(元)">
                <el-input placeholder="价格(元)" v-model="skuInfo.price">
                </el-input>
            </el-form-item>
            <el-form-item label="重量(千克)">
                <el-input placeholder="重量(千克)" v-model="skuInfo.weight">
                </el-input>
            </el-form-item>
            <el-form-item label="规格描述">
                <el-input type="textarea" placeholder="规格描述" :rows="4" v-model="skuInfo.skuDesc"></el-input>
            </el-form-item>
            <el-form-item label="平台属性" size="normal">
                <el-form ref="form" label-width="80px" :inline="true">
                    <el-form-item :label="attr.attrName" v-for="attr in attrInfoList" :key="attr.id"
                        style="margin:2px 0">
                        <el-select placeholder="请选择" v-model="attr.attrIdAndAttrValId">
                            <el-option :label="attrVal.valueName" :value="`${attr.id}:${attrVal.id}`"
                                v-for="attrVal in attr.attrValueList" :key="attrVal.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-form-item>
            <el-form-item label="销售属性" size="normal">
                <el-form ref="form" label-width="80px" :inline="false">
                    <el-form-item :label="sale.saleAttrName" v-for="sale in saleAttrList" :key="sale.id"
                        style="margin:2px 0">
                        <el-select placeholder="请选择" v-model="sale.saleIdAndSaleValId">
                            <el-option :label="saleVal.saleAttrValueName" :value="`${sale.id}:${saleVal.id}`"
                                v-for="saleVal in sale.spuSaleAttrValueList" :key="saleVal.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-form-item>
            <el-form-item label="图片列表" size="normal">
                <el-table border stripe :data="spuImageList" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="80" prop="">
                    </el-table-column>
                    <el-table-column prop="" label="图片">
                        <template slot-scope="{row,$index}">
                            <img :src="row.imgUrl" style="width: 100px;height: 100px;">
                        </template>
                    </el-table-column>
                    <el-table-column prop="imgName" label="名称">
                    </el-table-column>
                    <el-table-column prop="" label="操作">
                        <template slot-scope="{row,$index}">
                            <el-button type="primary" size="mini" v-if="row.isDefault == 0"
                                @click="changeDefault(row)">设置默认</el-button>
                            <el-button size="mini" v-else>默认</el-button>

                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
            <el-form-item label="">
                <el-button type="primary" @click="save">保存</el-button>
                <el-button @click="cancel">取消</el-button>
            </el-form-item>

        </el-form>

    </div>
</template>

<script>
export default {
    name: 'SkuForm',
    data() {
        return {
            // 存储图片信息
            spuImageList: [],
            // 销售属性信息
            saleAttrList: [],
            // 平台属性数据
            attrInfoList: [],
            skuInfo: {
                // 三级分类id
                category3Id: 0,
                spuId: 0,
                // 平台属性id
                tmId: 0,
                // 价格
                price: 0,
                // 默认图片
                skuDefaultImg: "",
                // 描述
                skuDesc: "",
                // sku名称
                skuName: "",
                spuId: 0,
                tmId: 0,
                // 重量
                weight: "",
                skuAttrValueList: [
                    // {
                    //     attrId: 0,
                    //     attrName: "",
                    //     id: 0,
                    //     skuId: 0,
                    //     valueId: 0,
                    //     valueName: ""
                    // }
                ],
                skuImageList: [
                    // {
                    //     id: 0,
                    //     imgName: "",
                    //     imgUrl: "",
                    //     isDefault: "",
                    //     skuId: 0,
                    //     spuImgId: 0
                    // }
                ],
                skuSaleAttrValueList: [
                    // {
                    //     id: 0,
                    //     saleAttrId: 0,
                    //     saleAttrName: "",
                    //     saleAttrValueId: 0,
                    //     saleAttrValueName: "",
                    //     skuId: 0,
                    //     spuId: 0
                    // }
                ],
            },
            // 存储spu
            spu: {}
        }
    },
    methods: {
        async getData(category1Id, category2Id, spu) {
            // 收集父组件传来的数据
            this.skuInfo.category3Id = spu.category3Id
            this.skuInfo.spuId = spu.id
            this.skuInfo.tmId = spu.tmId
            this.spu = spu
            // 获取图片数据
            const imagesResult = await this.$API.spu.reqSpuImage(spu.id)
            if (imagesResult.code === 200) {
                let list = imagesResult.data
                // 循环遍历将每个属性添加isDefault字段，用于判断是否为默认
                list.forEach(item => {
                    item.isDefault = 0
                })
                this.spuImageList = list
            }
            // 获取销售属性的数据
            const saleAttrResult = await this.$API.spu.reqSpuSaleAttrList(spu.id)
            if (saleAttrResult.code === 200) {
                this.saleAttrList = saleAttrResult.data
            }
            // 获取平台属性的数据
            const attrInfoResult = await this.$API.spu.reqCategoryData(category1Id, category2Id, spu.category3Id)
            if (attrInfoResult.code === 200) {
                this.attrInfoList = attrInfoResult.data
            }
        },
        // 多选框事件
        handleSelectionChange(val) {
            // 收集整理图片数据
            this.skuInfo.skuImageList = val.map(item => {
                return {
                    imgName: item.imgName,
                    imgUrl: item.imgUrl,
                    isDefault: item.isDefault,
                    spuImgId: item.id
                }
            })
        },
        // 设置默认图片按钮处理函数
        changeDefault(row) {
            // 排他 将所有图片设置非默认
            this.spuImageList.forEach(item => {
                item.isDefault = 0
            })
            // 将点击的图片设置默认
            row.isDefault = 1
            // 收集默认图片信息
            this.skuInfo.skuDefaultImg = row.imgUrl
        },
        // 取消按钮事件
        cancel() {
            this.$emit('changeScene', { scene: 0 })
            Object.assign(this._data, this.$options.data())
        },
        // 保存按钮事件
        async save() {
            // 整理数据
            const { saleAttrList, skuInfo, attrInfoList } = this
            // 整理获取属性id
            skuInfo.skuAttrValueList = attrInfoList.reduce((prev, item) => {
                if (item.attrIdAndAttrValId) {
                    const [attrId, valueId] = item.attrIdAndAttrValId.split(':')
                    prev.push({ attrId, valueId })
                }
                return prev
            }, [])
            // 整理获取属性值id
            skuInfo.skuSaleAttrValueList = saleAttrList.reduce((prev, item) => {
                if (item.saleIdAndSaleValId) {
                    const [saleAttrId, saleAttrValueId] = item.saleIdAndSaleValId.split(':')
                    prev.push({ saleAttrId, saleAttrValueId })
                }
                return prev
            }, [])
            const result = await this.$API.spu.reqAddSku(skuInfo)
            if (result.code === 200) {
                // 提示
                this.$message.success('保存成功')
                // 切换场景
                this.$emit('changeScene', { scene: 0 })
                // 清空数据
                Object.assign(this._data, this.$options.data())
            }
        }
    }
}
</script>

<style>

</style>