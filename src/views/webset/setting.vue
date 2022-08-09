<template>
<div class="deliverbox">
  <p class="deliver">系统设置</p>
  <el-form :model="postForm" :rules="rules" ref="postForm" label-width="120px">

    <el-form-item label="网站名称" prop="web_name">
      <el-input v-model="postForm.web_name"></el-input>
    </el-form-item>
    <el-form-item label="网站LOGO" prop="logo">
      <el-col :span="6">
        <Upload v-model="postForm.logo" />
      </el-col>
    </el-form-item>
    <el-form-item label="版权信息" prop="web_copyright">
      <el-input v-model="postForm.web_copyright"></el-input>
    </el-form-item>
    <el-form-item label="分享代码" prop="share_code">
      <div class="editor-container">
        <Tinymce :height=100 ref="editor" v-model="postForm.share_code" />
      </div>
    </el-form-item>
    <el-form-item label="默认图片" prop="default_img">
      <el-col :span="6">
        <Upload v-model="postForm.default_img" />
      </el-col>
    </el-form-item>
    <el-form-item label="公众号二维码" prop="public_account_img">
      <el-col :span="6">
        <Upload v-model="postForm.public_account_img" />
      </el-col>
    </el-form-item>
    <el-form-item label="右侧置顶按钮" prop="right_account_list">
      <el-input type="textarea" v-model="postForm.right_account_list"></el-input>
    </el-form-item>
    <el-form-item label="联系电话" prop="connect_phone">
      <el-input v-model="postForm.connect_phone"></el-input>
    </el-form-item>
    <el-form-item label="联系微信二维码" prop="wechat_connect_img">
      <el-col :span="6">
        <Upload v-model="postForm.wechat_connect_img" />
      </el-col>
    </el-form-item>
    <el-form-item label="产品目录申请图集">
      <div style="margin-bottom: 20px;">
        <Mupload v-bind:imgs="postForm.catalog_apply_imgs" @successCBK="imageSuccessCBK" />
      </div>
    </el-form-item>
    <el-form-item label="头部菜单配置" prop="web_header_menu_setting">
      <el-input type="textarea" v-model="postForm.web_header_menu_setting"></el-input>
    </el-form-item>
    <el-form-item label="底部菜单配置" prop="footer_menu_setting">
      <el-input type="textarea" v-model="postForm.footer_menu_setting"></el-input>
    </el-form-item>
    <el-form-item label="加载中图片" prop="loading_img">
      <el-col :span="6">
        <Upload v-model="postForm.loading_img" />
      </el-col>
    </el-form-item>

    <el-form-item label="联系时间" prop="connect_time">
      <el-input v-model="postForm.connect_time"></el-input>
    </el-form-item>
    <el-form-item label="联系地址" prop="connect_address">
      <el-input v-model="postForm.connect_address"></el-input>
    </el-form-item>
    <el-form-item label="案例中心PC版背景图" prop="cases_background_pc_img">
      <el-col :span="8">
        <Upload v-model="postForm.cases_background_pc_img" />
      </el-col>
    </el-form-item>
    <el-form-item label="案例中心手机版背景图" prop="cases_background_mob_img">
      <el-col :span="6">
        <Upload v-model="postForm.cases_background_mob_img" />
      </el-col>
    </el-form-item>
    <el-form-item label="案例中心背景图介绍" prop="cases_background_info">
      <el-input type="textarea" v-model="postForm.cases_background_info"></el-input>
    </el-form-item>
    <el-form-item label="案例详情PC版背景图" prop="case_background_pc_img">
      <el-col :span="8">
        <Upload v-model="postForm.case_background_pc_img" />
      </el-col>
    </el-form-item>
    <el-form-item label="案例详情手机版背景图" prop="case_background_mob_img">
      <el-col :span="6">
        <Upload v-model="postForm.case_background_mob_img" />
      </el-col>
    </el-form-item>
    <el-form-item label="案例详情背景图介绍" prop="case_background_info">
      <el-input type="textarea" v-model="postForm.case_background_info"></el-input>
    </el-form-item>
    <el-form-item label="产品详情PC版背景图" prop="product_background_pc_img">
      <el-col :span="8">
        <Upload v-model="postForm.product_background_pc_img" />
      </el-col>
    </el-form-item>
    <el-form-item label="产品详情手机版背景图" prop="product_background_mob_img">
      <el-col :span="6">
        <Upload v-model="postForm.product_background_mob_img" />
      </el-col>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit" style="letter-spacing:2px">立即发布</el-button>
      <el-button style="letter-spacing:2px">取消</el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import Upload from '@/components/Upload/uploadImage'
import Sticky from '@/components/Sticky' // 粘性header组件
import Mupload from '@/components/Upload/uploadMutiImage'
import { getList,createData } from '@/api/webset'
const defaultForm = {
  logo: '',
  web_name: '',
  web_copyright: '',
  share_code: '',
  default_img: '',
  public_account_img: '',
  right_account_list: '',
  connect_phone: '',
  wechat_connect_img: '',
  catalog_apply_imgs: '',
  web_header_menu_setting: '',
  mob_header_menu_setting: '',
  footer_menu_setting: '',
  connect_phone_img: '',
  loading_img: '',
  connect_time: '',
  connect_address: '',
}
export default {
  name: 'webset',
  components: { Tinymce, Upload, Sticky,Mupload},
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
      listQuery: {
        page: 1,
        limit: 100,
        searchJoin: 'and',
        search: 'location:common;',
        searchFields: 'location:=;',
        orderBy: 'id',
        sortedBy: 'asc',
        filter: ''
      },
      postForm: Object.assign({}, defaultForm),
      loading: false,
      rules: {
        web_name: [{ validator: validateRequire }],
        logo: [{ validator: validateRequire }],
        web_copyright: [{ validator: validateRequire }],
        share_code: [{ validator: validateRequire }],
        default_img: [{ validator: validateRequire }],
        public_account_img: [{ validator: validateRequire }],
        right_account_list: [{ validator: validateRequire }],
        connect_phone: [{ validator: validateRequire }],
        wechat_connect_img: [{ validator: validateRequire }],
        catalog_apply_imgs: [{ validator: validateRequire }],
        web_header_menu_setting: [{ validator: validateRequire }],
        mob_header_menu_setting: [{ validator: validateRequire }],
        footer_menu_setting: [{ validator: validateRequire }],
        connect_phone_img: [{ validator: validateRequire }],
        loading_img: [{ validator: validateRequire }]
      }
    }
  },
  //添加后重载列表
  created() {
    this.getConfs()
  },
  methods: {
    //获取列表
    getConfs() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        this.postForm = response.data.data
        this.listLoading = false
      })
    },
    onSubmit() {
      createData(this.postForm).then(() => {
        this.$notify({
          title: '成功',
          message: '操作成功',
          type: 'success',
          duration: 3000
        })
        this.$router.push({path: '/webset/setting'})
      })
      console.log(this.form);
    },
    imageSuccessCBK(arr) {
      this.postForm.catalog_apply_imgs = arr
      console.log("图片集合",this.postForm.catalog_apply_imgs)
    },
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.deliverbox {
  margin: 0 10%;
  width: 65%;
  height: 100%;
  margin-top: 30px;
  .deliver {
    color: #FD5913;
    font-weight: 600;
    font-size: 24px;
    padding: 10px 10px 15px 0;
    border-bottom: 1px solid #0795CB;
  }
  .el-form {
    width: 100%;
    padding-top: 10px;
  }
}
</style>
