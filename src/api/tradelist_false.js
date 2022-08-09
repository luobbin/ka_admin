import request from '@/utils/requestOther'
//淘宝退款订单列表
export function getTradeFalseList(params) {
  return request({
    url: '/trade_false/show',
    method: 'get',
    params
  })
}

export function TradeFalseOne(params) {
  return request({
    url: '/trade_false/one',
    method: 'get',
    params 
  })
}

export function TradeFalseAll() {
  return request({
    url: '/trade_false/auto',
    method: 'get',
     
  })
}

export function TradeFalseUpload(params) {
  return request({
    url: '/trade_false/upload',
    method: 'post',
    header: {},
    params 
  })
}