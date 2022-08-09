import request from '@/utils/requestOther'

//获取会员账期列表
export function getUserAccountList(params){
    return  request({
        url: '/aliaccBill',
        method: 'get',
        params
      })
}

//更新账期列表
export function getUpdateList(id,params){
    return  request({
        url: '/aliaccBill/'+id,
        method: 'put',
        params
      })
}

//更新账期列表
export function getdownload(){
    return  request({
        url: '/aliaccBill/1',
        method: 'put',
        data:{
            type:3
        }
      })
}

//手动审核明细
export function getShTransferList(id,params){
    return  request({
        url: '/alipayBill/'+id,
        method: 'put',
        params
      })
}
