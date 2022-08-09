<template>
  <div class="app-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" size="small" label-width="130px">
        <sticky className="sub-navbar draft">
          <router-link :to="'/goods/goods_list'">
            <el-button type="primary" icon="el-icon-back" style="margin: 10px; margin-bottom: 0;">返回列表</el-button>
          </router-link>
          <el-button v-loading="loading" style="margin: 10px; float: right; margin-bottom: 0;" type="success" @click="submitForm">保存</el-button>
        </sticky>
        
        <el-form-item label="商品URL">
          <el-col :span="8"><el-input v-model="postForm.url"></el-input></el-col>
        </el-form-item>
        <el-form-item label="商品名称">
          <el-col :span="8"><el-input v-model="postForm.title"></el-input></el-col>
        </el-form-item>
        <el-form-item label="所属商城">
          <el-col :span="8"><el-input v-model="postForm.laiyuan"></el-input></el-col>
        </el-form-item>
        <el-form-item label="商品分类">
          <el-select  v-model="postForm.cid" clearable placeholder="请选择">
            <el-option v-for="item in goodstypeOptions" :key="item.id" :label="item.title" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="版块分类">
          <el-select  v-model="postForm.code" clearable placeholder="请选择">
            <el-option v-for="item in bankuaiOptions" :key="item.code" :label="item.title" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图片">
          <div style="margin-bottom: 10px;">
            <Upload v-model="postForm.img" />
          </div>
        </el-form-item>
        <el-form-item label="价格">
          <el-col :span="1" class="txt_r">现价：</el-col>
          <el-col :span="2"><el-input v-model="postForm.discount_price"></el-input></el-col>
          <el-col :span="1" class="txt_r">原价：</el-col>
          <el-col :span="2"><el-input v-model="postForm.price"></el-input></el-col>
          <el-col :span="2" class="txt_r">手机价：</el-col>
          <el-col :span="2"><el-input v-model="postForm.shouji_price"></el-input></el-col>
          <span class="tip"> 可空，有手机专享价格再加,目前只限淘宝</span>
        </el-form-item>
        <el-form-item label="属性">
          <el-col :span="14">
            <el-checkbox-group v-model="postForm.goods_attribute">
              <el-checkbox label="2">包邮</el-checkbox>
              <el-checkbox label="6">试用</el-checkbox>
              <el-checkbox label="3">专享</el-checkbox>
              <el-checkbox label="1">拍改</el-checkbox>
              <el-checkbox label="4">限购</el-checkbox>
              <el-checkbox label="5">货到付款</el-checkbox>
            </el-checkbox-group>
          </el-col>
          <el-col :span="2"><span class="tip">可多选</span></el-col>
        </el-form-item>
        <el-form-item label="推荐理由">
          <div class="editor-container">
            <Tinymce :height=400 ref="editor" v-model="postForm.content" />
          </div>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker v-model="postForm.starttime" type="datetime" placeholder="开始时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker v-model="postForm.endtime" type="datetime" placeholder="结束时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="总佣金比例">
          <el-col :span="2"><el-input v-model="postForm.fanli_bl"></el-input></el-col>
          <el-col :span="1">%</el-col> 
          <el-col :span="8">
            加高返利图标：
            <el-radio-group v-model="postForm.fanli_ico">
              <el-radio :label="0">不</el-radio>
              <el-radio :label="1">是</el-radio>
            </el-radio-group>
          </el-col>
          <span class="tip"> 如果是则显示高返图章</span>
        </el-form-item>
        <el-form-item label="专属推广地址">
          <el-col :span="8"><el-input v-model="postForm.tg_url"></el-input></el-col>
          <span class="tip"> 阿里妈妈获取的专属推广地址</span>
        </el-form-item>

        <el-alert title="优惠卷信息" type="info" :closable="false"></el-alert>
        <el-form-item label="领取地址">
          <el-col :span="8"><el-input v-model="postForm.lq_url"></el-input></el-col>
          <span class="tip"> 可空，填写手机领取地址</span>
        </el-form-item>
        <el-form-item label="优惠券">
          <el-col :span="1" class="txt_r">满：</el-col>
          <el-col :span="2"><el-input v-model="postForm.price_man"></el-input></el-col>
          <el-col :span="1" class="txt_r">立减：</el-col>
          <el-col :span="2"><el-input v-model="postForm.price_jian"></el-input></el-col>
        </el-form-item>
        <el-form-item label="优惠券剩余">
          <el-col :span="2"><el-input v-model="postForm.quan_surplus"></el-input></el-col>
        </el-form-item>
        <el-form-item label="优惠券总数">
          <el-col :span="2"><el-input v-model="postForm.quan_total"></el-input></el-col>
        </el-form-item>  
        <el-form-item label="开始时间">
          <el-date-picker v-model="postForm.quan_stime" type="datetime" placeholder="开始时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker v-model="postForm.quan_etime" type="datetime" placeholder="结束时间"></el-date-picker>
        </el-form-item>
        
        <el-alert title="其他设置" type="info" :closable="false"></el-alert>
        <el-form-item label="掌柜">
          <el-col :span="5"><el-input v-model="postForm.nick"></el-input></el-col>
        </el-form-item>
        <el-form-item label="销量">
          <el-col :span="3"><el-input v-model="postForm.sell"></el-input></el-col>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="postForm.oversell">
            <el-radio :label="0">销售中</el-radio>
            <el-radio :label="1">卖光了</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="顶">
          <el-col :span="2"><el-input v-model="postForm.ding"></el-input></el-col>
        </el-form-item> 
        <el-form-item label="踩">
          <el-col :span="2"><el-input v-model="postForm.cai"></el-input></el-col>
        </el-form-item> 
        <el-form-item label="评论人数">
          <el-col :span="2"><el-input v-model="postForm.pinglun"></el-input></el-col>
        </el-form-item>  
        <el-form-item label="审核人">
          <el-col :span="2"><el-input v-model="postForm.auditor"></el-input></el-col>
        </el-form-item> 
        <el-form-item label="会员名">
          <el-col :span="2"><el-input v-model="postForm.ddusername"></el-input></el-col>
        </el-form-item>   
        <el-form-item label="cpc推广">
          <el-radio-group v-model="postForm.yun_jump">
            <el-radio :label="0">关闭</el-radio>
            <el-radio :label="1">开启</el-radio>
          </el-radio-group>
          <span class="tip"> cpc推广相关以活动公告为准</span>
        </el-form-item>
        
    </el-form>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import Upload from '@/components/Upload/singleImage3'
import Sticky from '@/components/Sticky' // 粘性header组件
import { validateURL } from '@/utils/validate'
import { getBankuais, getTypes, fetchData, createData, updateData } from '@/api/goodslist'
import { parseTime, parseDate } from '@/utils'
//初始化表单
const defaultForm = {
  url: null, //网址
  laiyuan: '', // 来源
  cid: 0, //分类
  code: '', // 版块分类
  title: '', //标题
  img: '', //主图
  discount_price: 0, //现价
  price: 0, //原价
  shouji_price: 0, //手机价
  goods_attribute:[],  //属性
  content: '', //推荐理由
  starttime: 0,//开始时间
  endtime: 0, //结束时间
  fanli_bl: 0, //佣金比例
  fanli_ico: 0, //加高返利
  tg_url: '', //专属推广地址
  lq_url: '', //优惠券领取地址
  price_man: 0, //优惠券满
  price_jian: 0, //优惠券减
  quan_surplus: 0, // 优惠券剩余
  quan_total: '',//优惠券总数
  quan_stime: 0, //优惠券开始时间
  quan_etime: 0, //优惠券结束时间
  id: undefined,
  sort: 0,
  nick: '',//掌柜
  sell: 0,//销量
  oversell: 0,//状态
  ding: 0,//顶
  cai: 0,//踩
  pinglun: 0,//评论人数
  auditor: '',//审核人
  ddusername: '',//会员名
  yun_jump: 0,//cpc推广
}


export default {
  name: 'itemDetail',
  components: { Tinymce, Upload, Sticky},
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + '为必传项',
          type: 'error'
        })
        callback(null)
      } else {
        callback()
      }
    }
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      bankuaiOptions:null,
      goodstypeOptions:null,
      cateOptions: [],
      rules: {
        title: [{ validator: validateRequire }],
        url: [{ validator: validateRequire }],
      }
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    } else {
      this.postForm = Object.assign({}, defaultForm)
    }
    this.getAllCates()
  },
  methods: {
    fetchData(id) {
      fetchData(id).then(response => {
        this.postForm = response.data
        this.postForm.starttime = this.postForm.starttime==0?0:parseTime(this.postForm.starttime)//转日期
        this.postForm.endtime = this.postForm.endtime==0?0:parseTime(this.postForm.endtime)//转日期
        this.postForm.quan_stime = this.postForm.quan_stime==0?0:parseTime(this.postForm.quan_stime)//转日期
        this.postForm.quan_etime = this.postForm.quan_etime==0?0:parseTime(this.postForm.quan_etime)//转日期
        this.postForm.ddusername = this.postForm.user == null?'':this.postForm.user.ddusername//获取报名人账号
      }).catch(err => {
        console.log(err)
      })
    },
    //获取分类
    getAllCates() {
      getBankuais().then(response => {
        this.bankuaiOptions = response.data.data
      })
      getTypes().then(response => {
        this.goodstypeOptions = response.data.data
        //this.listLoading = false
      })
    },
    submitForm() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          const postData = Object.assign({}, this.postForm)
          postData.starttime = postData.starttime==0?0:parseDate(postData.starttime)//转时间戳
          postData.endtime = postData.endtime==0?0:parseDate(postData.endtime)//转时间戳
          postData.quan_stime = postData.quan_stime==0?0:parseDate(postData.quan_stime)//转时间戳
          postData.quan_etime = postData.quan_etime==0?0:parseDate(postData.quan_etime)//转时间戳
          if (this.isEdit) {
            updateData(postData,postData.id).then(response => {
              if(response.data.code==0){
                this.$notify({
                  title: '成功',
                  message: response.data.message,
                  type: 'success',
                  duration: 2000
                })
              }else{
                this.$notify({
                  title: '失败',
                  message: response.data.error,
                  type: 'error',
                  duration: 2000
                })
              }
            })
          }else{
            createData(postData).then(response => {
              if(response.data.code==0){
                this.$notify({
                  title: '成功',
                  message: response.data.message,
                  type: 'success',
                  duration: 2000
                })
              }else{
                this.$notify({
                  title: '失败',
                  message: response.data.error,
                  type: 'error',
                  duration: 2000
                })
              }
            })
            this.$router.push('/goods/goodslist')
          }
          this.loading = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    
  }
}
</script>

<style  rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.createPost-container {
  position: relative;
  .createPost-main-container {
    padding: 40px 45px 20px 50px;
    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;
      .postInfo-container-item {
        float: left;
      }
    }
    .editor-container {
      min-height: 500px;
      margin: 0 0 30px;
      .editor-upload-btn-container {
        text-align: right;
        margin-right: 10px;
        .editor-upload-btn {
          display: inline-block;
        }
      }
    }
  }
  .word-counter {
    width: 40px;
    position: absolute;
    right: -10px;
    top: 0px;
  }
}
.tip{
  color:#ccc;
  font-size:10px;
  padding-left:5px;
}
.txt_r{text-align: right;}
</style>
