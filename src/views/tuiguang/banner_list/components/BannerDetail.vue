<template>
  <div class="app-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" size="small" label-width="120px">
        <sticky className="sub-navbar draft">
          <router-link :to="'/tuiguang/banner_list'">
            <el-button type="primary" icon="el-icon-back" style="margin: 10px; margin-bottom: 0;">返回列表</el-button>
          </router-link>
          <el-button v-loading="loading" style="margin: 10px; float: right; margin-bottom: 0;" type="success" @click="submitForm">保存</el-button>
        </sticky>
        <el-form-item label="banner名称" prop="title">
          <el-input v-model="postForm.title"></el-input>
        </el-form-item>
        <el-form-item label="商品ID" prop="shopid">
          <el-input v-model="postForm.shopid"></el-input>
        </el-form-item>
        <el-form-item label="口令" prop="kl">
          <el-input v-model="postForm.kl"></el-input>
        </el-form-item>
        <el-form-item label="链接" prop="url">
          <el-input v-model="postForm.url"></el-input>
        </el-form-item>
        <el-form-item label="原价" prop="price">
          <el-input v-model="postForm.price"></el-input>
        </el-form-item>
        <el-form-item label="优惠券" prop="coupon">
          <el-input v-model="postForm.coupon"></el-input>
        </el-form-item>
        <el-form-item label="销量" prop="sale">
          <el-input v-model="postForm.sale"></el-input>
        </el-form-item>
        <el-form-item label="店铺名称" prop="nick">
          <el-input v-model="postForm.nick"></el-input>
        </el-form-item>
        <el-form-item label="类别" prop="type">
          <el-select  v-model="postForm.type" clearable placeholder="选择类别">
            <el-option v-for="item in typeOptions" :key="item.key" :label="item.name" :value="item.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="来源" prop="tag">
          <el-select v-model="postForm.tag" clearable placeholder="选择来源">
            <el-option v-for="item in tagOptions" :key="item.key" :label="item.name" :value="item.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品分类" prop="cid">
          <el-select v-model="postForm.cid" clearable placeholder="选择商品分类">
            <el-option v-for="item in cateOptions" :key="item.id" :label="'['+item.tag+'] '+item.title" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="操作选择" prop="choose">
          <el-select v-model="postForm.choose" clearable placeholder="选择来源">
            <el-option v-for="item in chooseOptions" :key="item.key" :label="item.name" :value="item.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="banner图" prop="img">
          <div style="margin-bottom: 10px;">
            <Upload v-model="postForm.img" />
          </div>
        </el-form-item>
        <el-form-item label="banner尺寸" prop="img_size">
          <el-select v-model="postForm.img_size" clearable placeholder="选择尺寸">
            <el-option v-for="item in imgsizeOptions" :key="item.key" :label="item.name" :value="item.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分享缩略图" prop="shareimg">
          <div style="margin-bottom: 10px;">
            <Upload v-model="postForm.shareimg" />
          </div>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input size="small" v-model="postForm.sort" placeholder="值越大越靠前"></el-input>
        </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Qs from 'qs'
import Tinymce from '@/components/Tinymce'
import Upload from '@/components/Upload/singleImage'
import Sticky from '@/components/Sticky' // 粘性header组件
import { validateURL } from '@/utils/validate'
import { fetchData, createData, updateData } from '@/api/banner'
import { getAllCates } from '@/api/goodstype'
//初始化表单
const defaultForm = {
  title: '', // 名称
  shopid: '', // 商品id
  img: '', // banner图
  cid: null, //商品分类
  kl: '', // 口令
  url: '', //链接
  type: 0,//类别
  price: null,//原价
  coupon: '',//优惠券
  sale: null,//销量
  nick: '',//店铺名称
  tag: 0,//来源
  choose: 0,//操作选择
  img_size: 0,//banner尺寸
  shareimg: '', // 分享缩略图
  id: undefined,
  sort: 0
}
//类别 1.banner 2.返利商城图片 3.首页大图 4.热销商品图片
const typeOptions = [
  { key: 0, name: '未定义' },
  { key: 1, name: 'banner' },
  { key: 2, name: '返利商城图片' },
  { key: 3, name: '首页大图' },
  { key: 4, name: '热销商品图片' },
  { key: 5, name: '精选商品图片' },
  { key: 6, name: '分享注册图片' },
  { key: 7, name: 'WEB首页图片banner' },
  { key: 8, name: 'WEB活动专区banner' },
]
//端口
const tagOptions = [
  { key: 0, name: '未定义' },
  { key: 1, name: 'Android' },
  { key: 2, name: 'Ios' },
  { key: 3, name: '公共' },
  { key: 4, name: 'Web' },
]
//操作选择
const chooseOptions = [
  { key: 0, name: '未定义' },
  { key: 1, name: '直接跳网页链接' },
  { key: 2, name: '拉起手淘，用淘口令打开' },
  { key: 3, name: '拉起手机京东' },
  { key: 4, name: '搜索关键字' },
  { key: 5, name: '店铺跳转' },
  { key: 6, name: '跳转淘宝商品详情' },
  { key: 7, name: '拉起京东h5（强制用户登录）' },
  { key: 8, name: '强制用户登录，打开H5页面' },
  { key: 9, name: '跳转拼多多商品详情' },
  { key: 10, name: '根据CID跳转' },
  { key: 11, name: '复制标题并拉起第三方应用' },
  { key: 12, name: '单商城推广' },
]                           
//尺寸
const imgsizeOptions = [
  { key: 0, name: '适用于App 2.0以下版本' },
  { key: 2, name: 'App 2.0或以上' },
]
export default {
  name: 'bannerDetail',
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
      typeOptions,
      tagOptions,
      chooseOptions,
      imgsizeOptions,
      cateOptions: [],
      rules: {
        title: [{ validator: validateRequire }],
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
      }).catch(err => {
        console.log(err)
      })
    },
    //获取分类
    getAllCates() {
      getAllCates().then(response => {
        this.cateOptions = response.data
      })
    },
    submitForm() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          if (this.isEdit) {
            updateData(Qs.stringify(this.postForm),this.postForm.id).then(() => {
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
            })
          }else{
            createData(Qs.stringify(this.postForm)).then(() => {
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            })
            this.$router.push('/tuiguang/banner_list')
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
</style>
