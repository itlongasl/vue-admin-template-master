import request from '@/utils/request'

// 获取sku列表数据  /admin/product/list/{page}/{limit}
export const reqSkuList = (page, limit) => {
    return request({ method: 'get', url: `/admin/product/list/${page}/${limit}` })
}

// 修改sku上架状态 /admin/product/onSale/{skuId}
export const reqOnSale = (skuId) => {
    return request({ method: 'get', url: `/admin/product/onSale/${skuId}` })
}

// 修改sku下架状态 /admin/product/cancelSale/{skuId}
export const reqCancelSale = (skuId) => {
    return request({ method: 'get', url: `/admin/product/cancelSale/${skuId}` })
}

// sku详情接口  /admin/product/getSkuById/{skuId}
export const reqSkuDetail = (skuId) => {
    return request({ method: 'get', url: `/admin/product/getSkuById/${skuId}` })
}