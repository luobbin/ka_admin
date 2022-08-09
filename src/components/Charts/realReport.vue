<template>
  <div v-loading="listLoading" :class="className" :id="id" :style="{height:height,width:width}"></div>
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'
import { getList } from '@/api/realreport'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '200px'
    },
    height: {
      type: String,
      default: '200px'
    }
  },
  data() {
    return {
      chart: null,
      listLoading: true,
      realReportData:{
        "today": {
            "user_sum": 1,
            "tixian_sum": 1,
            "tradenum_ok": 1,
            "mall_tradenum": 1,
            "mall_order_no": 1,
            "mall_no_user": 1,
            "pdd_order_no": 1,
            "tao_goods_sum": 1,
            "taobao_zsy": 1,
            "taobao_tradenum": 1,
            "tradenum_unclaim": 1,
            "mall_goods_sum": 1,
            "mall_zsy": 1,
            "mall_order_ok": 1,
            "pdd_goods_sum": 1,
            "pdd_zsy": null,
            "pdd_tradenum": 0,
            "pdd_order_ok": 1
        },
        "week": {
            "user_sum": 2,
            "tixian_sum": 2,
            "tradenum_ok": 2,
            "mall_tradenum": 2,
            "mall_order_no": 2,
            "mall_no_user": 2,
            "pdd_order_no": 2,
            "tao_goods_sum": 2,
            "taobao_zsy": 2,
            "taobao_tradenum": 2,
            "tradenum_unclaim": 2,
            "mall_goods_sum": 2,
            "mall_zsy": 2,
            "mall_order_ok": 2,
            "pdd_goods_sum": 2,
            "pdd_zsy": 2,
            "pdd_tradenum": 2,
            "pdd_order_ok": 2
        },
        "month": {
            "user_sum": 10,
            "tixian_sum": 10,
            "tradenum_ok": 10,
            "mall_tradenum": 10,
            "mall_order_no": 10,
            "mall_no_user": 10,
            "pdd_order_no": 10,
            "tao_goods_sum": 10,
            "taobao_zsy": 10,
            "taobao_tradenum": 10,
            "tradenum_unclaim": 10,
            "mall_goods_sum": 10,
            "mall_zsy": 10,
            "mall_order_ok": 10,
            "pdd_goods_sum": 10,
            "pdd_zsy": 10,
            "pdd_tradenum": 10,
            "pdd_order_ok": 10
        },
        "all": {
            "user_sum": 50,//会员数
            "tixian_sum": 50,//已支出
            "tradenum_ok": 50,//淘宝已确认订单
            "mall_tradenum": 50,//商城总交易量
            "mall_order_no": 50,//商城未核对订单
            "mall_no_user": 50,//商城未认领订单
            "pdd_order_no": 50,//拼多多无效订单
            "tao_goods_sum": 50,//淘宝总交易额
            "taobao_zsy": 50,//淘宝总收益
            "taobao_tradenum": 50,//淘宝总交易量
            "tradenum_unclaim": 50,//淘宝未认领订单
            "mall_goods_sum": 50,//商城总交易额
            "mall_zsy": 50,//商城总收益
            "mall_order_ok": 50,//商城有效订单
            "pdd_goods_sum": 50,//拼多多总交易额
            "pdd_zsy": 50,//拼多多总收益
            "pdd_tradenum": 50,//拼多多总交易量
            "pdd_order_ok": 50//拼多多有效订单
        },
        "latest_time": "0000-00-00 00:00:00"
      }
    }
  },
  mounted() {
    this.getList()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    //获取列表
    getList() {
      this.listLoading = true
      getList().then(response => {
        this.initChart(response.data)
        this.listLoading = false
      })
    },
    initChart(res) {
      if(res.latest_time)
        this.realReportData = res
      this.chart = echarts.init(document.getElementById(this.id))
      const xData = (function() {
        const data = [
          '网站收益',//taobao_zsy+mall_zsy+pdd_zsy
          '预计净收益',//taobao_zsy+mall_zsy+pdd_zsy-tixian_sum
          '已支出',//tixian_sum
          '会员数',//user_sum
          '淘宝总交易额',//tao_goods_sum
          '淘宝总收益',//taobao_zsy
          '淘宝总交易量',//taobao_tradenum
          '淘宝已确认订单',//tradenum_ok
          '淘宝未认领订单',//tradenum_unclaim
          '商城总交易额',//mall_goods_sum
          '商城总收益',//mall_zsy
          '商城总交易量',//mall_tradenum
          '商城有效订单',//mall_order_ok
          '商城未核对订单',//mall_order_no
          '商城未认领订单',//mall_no_user
          '拼多多总交易额',//pdd_goods_sum
          '拼多多总收益',//pdd_zsy
          '拼多多总交易量',//pdd_tradenum
          '拼多多有效订单',//pdd_order_ok
          '拼多多无效订单',//pdd_order_no
        ]
        return data
      }())
      this.chart.setOption({
        backgroundColor: '#344b58',
        title: {
          text: '更新时间：'+res.latest_time,
          x: '20',
          top: '20',
          textStyle: {
            color: '#fff',
            fontSize: '22'
          },
          subtextStyle: {
            color: '#90979c',
            fontSize: '16'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            textStyle: {
              color: '#fff'
            }
          }
        },
        grid: {
          borderWidth: 0,
          top: 110,
          bottom: 95,
          textStyle: {
            color: '#fff'
          }
        },
        legend: {
          x: '5%',
          top: '10%',
          textStyle: {
            color: '#90979c'
          },
          data: ['今日数据', '近7日数据', '近1月数据', '总数据']
        },
        calculable: true,
        xAxis: [{
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#90979c'
            }
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitArea: {
            show: false
          },
          axisLabel: {
            interval: 0

          },
          data: xData
        }],
        yAxis: [{
          type: 'value',
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#90979c'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            interval: 0
          },
          splitArea: {
            show: false
          }
        }],
        dataZoom: [{
          show: true,
          height: 30,
          xAxisIndex: [
            0
          ],
          bottom: 30,
          start: 10,
          end: 80,
          handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
          handleSize: '110%',
          handleStyle: {
            color: '#d3dee5'

          },
          textStyle: {
            color: '#fff' },
          borderColor: '#90979c'

        }, {
          type: 'inside',
          show: true,
          height: 15,
          start: 1,
          end: 35
        }],
        series: [{
          name: '今日数据',
          type: 'bar',
          stack: 'total',
          barMaxWidth: 35,
          barGap: '10%',
          itemStyle: {
            normal: {
              color: 'rgba(255,144,128,1)',
              label: {
                show: true,
                textStyle: {
                  color: '#fff'
                },
                position: 'insideTop',
                formatter(p) {
                  return p.value > 0 ? p.value : ''
                }
              }
            }
          },
          data: [
            this.realReportData.today.taobao_zsy+this.realReportData.today.mall_zsy+this.realReportData.today.pdd_zsy,
            this.realReportData.today.taobao_zsy+this.realReportData.today.mall_zsy+this.realReportData.today.pdd_zsy-this.realReportData.today.tixian_sum,
            this.realReportData.today.tixian_sum,
            this.realReportData.today.user_sum,
            this.realReportData.today.tao_goods_sum,
            this.realReportData.today.taobao_zsy,
            this.realReportData.today.taobao_tradenum,
            this.realReportData.today.tradenum_ok,
            this.realReportData.today.tradenum_unclaim,
            this.realReportData.today.mall_goods_sum,
            this.realReportData.today.mall_zsy,
            this.realReportData.today.mall_tradenum,
            this.realReportData.today.mall_order_ok,
            this.realReportData.today.mall_order_no,
            this.realReportData.today.mall_no_user,
            this.realReportData.today.pdd_goods_sum,
            this.realReportData.today.pdd_zsy,
            this.realReportData.today.pdd_tradenum,
            this.realReportData.today.pdd_order_ok,
            this.realReportData.today.pdd_order_no
          ]
        },
        {
          name: '近7日数据',
          type: 'bar',
          stack: 'total',
          itemStyle: {
            normal: {
              color: 'rgba(0,191,183,1)',
              barBorderRadius: 0,
              label: {
                show: true,
                position: 'top',
                formatter(p) {
                  return p.value > 0 ? p.value : ''
                }
              }
            }
          },
          data: [
            this.realReportData.week.taobao_zsy+this.realReportData.week.mall_zsy+this.realReportData.week.pdd_zsy,
            this.realReportData.week.taobao_zsy+this.realReportData.week.mall_zsy+this.realReportData.week.pdd_zsy-this.realReportData.week.tixian_sum,
            this.realReportData.week.tixian_sum,
            this.realReportData.week.user_sum,
            this.realReportData.week.tao_goods_sum,
            this.realReportData.week.taobao_zsy,
            this.realReportData.week.taobao_tradenum,
            this.realReportData.week.tradenum_ok,
            this.realReportData.week.tradenum_unclaim,
            this.realReportData.week.mall_goods_sum,
            this.realReportData.week.mall_zsy,
            this.realReportData.week.mall_tradenum,
            this.realReportData.week.mall_order_ok,
            this.realReportData.week.mall_order_no,
            this.realReportData.week.mall_no_user,
            this.realReportData.week.pdd_goods_sum,
            this.realReportData.week.pdd_zsy,
            this.realReportData.week.pdd_tradenum,
            this.realReportData.week.pdd_order_ok,
            this.realReportData.week.pdd_order_no
          ]
        },
        {
          name: '近1月数据',
          type: 'bar',
          stack: 'total',
          itemStyle: {
            normal: {
              color: 'rgba(0,191,123,1)',
              barBorderRadius: 0,
              label: {
                show: true,
                position: 'top',
                formatter(p) {
                  return p.value > 0 ? p.value : ''
                }
              }
            }
          },
          data: [
            this.realReportData.month.taobao_zsy+this.realReportData.month.mall_zsy+this.realReportData.month.pdd_zsy,
            this.realReportData.month.taobao_zsy+this.realReportData.month.mall_zsy+this.realReportData.month.pdd_zsy-this.realReportData.month.tixian_sum,
            this.realReportData.month.tixian_sum,
            this.realReportData.month.user_sum,
            this.realReportData.month.tao_goods_sum,
            this.realReportData.month.taobao_zsy,
            this.realReportData.month.taobao_tradenum,
            this.realReportData.month.tradenum_ok,
            this.realReportData.month.tradenum_unclaim,
            this.realReportData.month.mall_goods_sum,
            this.realReportData.month.mall_zsy,
            this.realReportData.month.mall_tradenum,
            this.realReportData.month.mall_order_ok,
            this.realReportData.month.mall_order_no,
            this.realReportData.month.mall_no_user,
            this.realReportData.month.pdd_goods_sum,
            this.realReportData.month.pdd_zsy,
            this.realReportData.month.pdd_tradenum,
            this.realReportData.month.pdd_order_ok,
            this.realReportData.month.pdd_order_no
          ]
        }, 
        {
          name: '总数据',
          type: 'line',
          stack: 'total',
          symbolSize: 10,
          symbol: 'circle',
          itemStyle: {
            normal: {
              color: 'rgba(252,230,48,1)',
              barBorderRadius: 0,
              label: {
                show: true,
                position: 'top',
                formatter(p) {
                  return p.value > 0 ? p.value : ''
                }
              }
            }
          },
          data: [
            this.realReportData.all.taobao_zsy+this.realReportData.all.mall_zsy+this.realReportData.all.pdd_zsy,
            this.realReportData.all.taobao_zsy+this.realReportData.all.mall_zsy+this.realReportData.all.pdd_zsy-this.realReportData.all.tixian_sum,
            this.realReportData.all.tixian_sum,
            this.realReportData.all.user_sum,
            this.realReportData.all.tao_goods_sum,
            this.realReportData.all.taobao_zsy,
            this.realReportData.all.taobao_tradenum,
            this.realReportData.all.tradenum_ok,
            this.realReportData.all.tradenum_unclaim,
            this.realReportData.all.mall_goods_sum,
            this.realReportData.all.mall_zsy,
            this.realReportData.all.mall_tradenum,
            this.realReportData.all.mall_order_ok,
            this.realReportData.all.mall_order_no,
            this.realReportData.all.mall_no_user,
            this.realReportData.all.pdd_goods_sum,
            this.realReportData.all.pdd_zsy,
            this.realReportData.all.pdd_tradenum,
            this.realReportData.all.pdd_order_ok,
            this.realReportData.all.pdd_order_no
          ]
        }
        ]
      })
    }
  }
}
</script>
