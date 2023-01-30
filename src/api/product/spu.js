import request from '@/utils/request'

// 获取Spu列表数据  GET /admin/product/{page}/{limit}
export const reqSpuList = (page, limit, category3Id) => {
  return request({ method: 'get', url: `/admin/product/${page}/${limit}`, params: { category3Id }})
}

// 通过id获取spu信息  GET /admin/product/getSpuById/{spuId}
export const reqSpuById = (spuId) => {
  return request({ method: 'get', url: `/admin/product/getSpuById/${spuId}` })
}

// 获取品牌信息  /admin/product/baseTrademark/getTrademarkList
export const reqTradeMarkList = () => {
  return request({ method: 'get', url: '/admin/product/baseTrademark/getTrademarkList' })
}

// 获取spu图片  /admin/product/spuImageList/{spuId}
export const reqSpuImage = (spuId) => {
  return request({ method: 'get', url: `/admin/product/spuImageList/${spuId}` })
}

// 获取平台全部销售属性  /admin/product/baseSaleAttrList
export const reqAttrList = () => {
  return request({ method: 'get', url: '/admin/product/baseSaleAttrList' })
}

// 添加|修改spu请求接口  /admin/product/saveSpuInfo  /admin/product/updateSpuInfo
export const reqSaveOrUpdateSpu = (spuInfo) => {
  // 如果有id说明是修改spu
  if (spuInfo.id) {
    return request({ method: 'post', url: '/admin/product/updateSpuInfo', data: spuInfo })
  } else {
    // 否则就是添加spu
    return request({ method: 'post', url: '/admin/product/saveSpuInfo', data: spuInfo })
  }
}

// 删除spu请求接口  /admin/product/deleteSpu/{spuId}
export const reqDeleteSpu = (spuId) => {
  return request({ method: 'delete', url: `/admin/product/deleteSpu/${spuId}` })
}

// 获取销售属性  /admin/product/spuSaleAttrList/{spuId}
export const reqSpuSaleAttrList = (spuId) => {
  return request({ method: 'get', url: `/admin/product/spuSaleAttrList/${spuId}` })
}

// 三级分类数据 --- GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
export const reqCategoryData = (category1Id, category2Id, category3Id) => {
  return request({ method: 'get', url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}` })
}

// 保存sku请求接口 /admin/product/saveSkuInfo
export const reqAddSku = (data) => {
  return request({ method: 'post', url: '/admin/product/saveSkuInfo', data })
}

// 获取sku列表  /admin/product/findBySpuId/{spuId}
export const reqSkuList = (spuId) => {
  return request({ method: 'get', url: `/admin/product/findBySpuId/${spuId}` })
}
