import request from '@/utils/request'

// 获取品牌列表接口  传入当前页码与每页展示商品数  GET /admin/product/baseTrademark/{page}/{limit}
export const reqTradeMarkList = (page, limit) => {
  return request({ method: 'get', url: `/admin/product/baseTrademark/${page}/${limit}` })
}

// 添加品牌请求接口 POST /admin/product/baseTrademark/save  携带品牌名称及品牌logo 不需要传入id 服务器自动生成
export const reqAddTradeMark = (tradeMark) => {
  return request({ method: 'post', url: '/admin/product/baseTrademark/save', data: tradeMark })
}

// 修改品牌请求接口  PUT /admin/product/baseTrademark/update  携带 品牌id 品牌名称及品牌logo
// 前端修改数据切记携带id
export const reqUpdateTradeMark = (tradeMark) => {
  return request({ method: 'put', url: '/admin/product/baseTrademark/update', data: tradeMark })
}

// 删除品牌请求接口  DELETE /admin/product/baseTrademark/remove/{id} 携带id
export const reqDeleteTradeMark = (id) => {
  return request({ method: 'delete', url: `/admin/product/baseTrademark/remove/${id}` })
}
