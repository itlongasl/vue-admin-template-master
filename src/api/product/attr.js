import request from '@/utils/request'

// 三级分类
// 一级分类 --- GET /admin/product/getCategory1
export const reqCategory1List = () => {
  return request({ method: 'get', url: '/admin/product/getCategory1' })
}

// 二级分类 --- GET /admin/product/getCategory2/{category1Id}
export const reqCategory2List = (category1Id) => {
  return request({ method: 'get', url: `/admin/product/getCategory2/${category1Id}` })
}

// 三级分类 --- GET /admin/product/getCategory3/{category2Id}
export const reqCategory3List = (category2Id) => {
  return request({ method: 'get', url: `/admin/product/getCategory3/${category2Id}` })
}

// 三级分类数据 --- GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
export const reqCategoryData = (category1Id, category2Id, category3Id) => {
  return request({ method: 'get', url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}` })
}

// 添加属性请求接口 --- POST /admin/product/saveAttrInfo
export const reqAddAttr = (data) => {
  return request({ method: 'post', url: '/admin/product/saveAttrInfo', data })
}
