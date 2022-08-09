import request from '@/utils/requestOther'

export function getList(params){
    return  request({
        url: '/contracts',
        method: 'get',
        params
      })
}

//更新阿里妈妈申请列表
export function getUpdateUserList(id,params){
    return  request({
        url: '/contracts/'+id,
        method: 'put',
        params
      })
}

//获取会员账期列表
export function getUserAccountList(params){
    return  request({
        url: '/aliaccBill',
        method: 'get',
        params
      })
}

//获取会员账期列表
export function getUserRefundList(params){
    return  request({
        url: '/failureBill',
        method: 'get',
        params
      })
}

//会员转账明细列表
export function getUserTransferList(params){
    return  request({
        url: '/alipayBill',
        method: 'get',
        params
      })
}

//阿里妈妈账号列表
export function getAliMMuserList(params){
    return  request({
        url: '/taopids',
        method: 'get',
        params
      })
}

//阿里妈妈账号解冻type1 冻结 type2
export function getUserFrozenThawList(params){
    return  request({
        url: '/taopidUp',
        method: 'post',
        params
      })
}

