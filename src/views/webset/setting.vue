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
      <br>
      <span style="color: red"> [必填,建议尺寸：宽100px*高50px，格式png]</span>
    </el-form-item>
    <el-form-item label="水印开关">
      <el-select  v-model="postForm.watermark_switch" clearable placeholder="请选择">
        <el-option v-for="item in watermarkSwitchOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="水印图片" prop="water_mark">
      <el-col :span="6">
        <Upload v-model="postForm.water_mark" />
      </el-col>
      <br>
      <span style="color: red"> [必填,建议尺寸：宽100px*高50px，格式png]</span>
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
      <br>
      <span style="color: red"> [必填,建议尺寸：宽800px*高800px，格式jpg,png]</span>
    </el-form-item>
    <el-form-item label="库奥公众号二维码" prop="public_account_img">
      <el-col :span="6">
        <Upload v-model="postForm.public_account_img" />
      </el-col>
      <br>
      <span style="color: red"> [必填,建议尺寸：宽500px*高500px，格式jpg,png]</span>
    </el-form-item>
    <el-form-item label="BBL公众号二维码" prop="public_account_img">
      <el-col :span="6">
        <Upload v-model="postForm.public_account_bbl_img" />
      </el-col>
      <br>
      <span style="color: red"> [必填,建议尺寸：宽500px*高500px，格式jpg,png]</span>
    </el-form-item>
    <el-form-item label="右侧置顶按钮" prop="right_account_list">
      <el-input type="textarea" v-model="postForm.right_account_list"></el-input>
    </el-form-item>
    <el-form-item label="联系电话" prop="connect_phone">
      <el-input v-model="postForm.connect_phone"></el-input>
    </el-form-item>
<!--    <el-form-item label="联系微信二维码" prop="wechat_connect_img">-->
<!--      <el-col :span="6">-->
<!--        <Upload v-model="postForm.wechat_connect_img" />-->
<!--      </el-col>-->
<!--      <br>-->
<!--      <span style="color: red"> [必填,建议尺寸：宽500px*高500px，格式jpg,png]</span>-->
<!--    </el-form-item>-->
    <el-form-item label="产品目录申请图集" title="建议尺寸：宽1920px*高650px，格式jpg,png">
      <div style="margin-bottom: 20px;">
        <Mupload v-bind:imgs="postForm.catalog_apply_imgs" @successCBK="imageSuccessCBK" />
        <br>
        <span style="color: red"> [必填,建议尺寸：宽604px*高823px，格式jpg,png]</span>
      </div>
    </el-form-item>
    <el-form-item label="头部菜单配置" prop="web_header_menu_setting">
      <el-input type="textarea" v-model="postForm.web_header_menu_setting"></el-input>
    </el-form-item>
    <el-form-item label="底部菜单配置" prop="footer_menu_setting">
      <el-input type="textarea" v-model="postForm.footer_menu_setting"></el-input>
    </el-form-item>

    <el-form-item label="联系时间" prop="connect_time">
      <el-input v-model="postForm.connect_time"></el-input>
    </el-form-item>
    <el-form-item label="联系地址" prop="connect_address">
      <el-input type="textarea" v-model="postForm.connect_address"></el-input>
    </el-form-item>
    <el-form-item label="公司招聘PC版背景图" prop="jobs_background_pc_img">
      <el-col :span="12">
        <Upload v-model="postForm.jobs_background_pc_img" />
      </el-col>
      <br>
      <span style="color: red"> [必填,建议尺寸：宽1920px*高650px，格式jpg,png]</span>
    </el-form-item>
    <el-form-item label="公司招聘手机版背景图" prop="jobs_background_mob_img">
      <el-col :span="6">
        <Upload v-model="postForm.jobs_background_mob_img" />
      </el-col>
      <br>
      <span style="color: red"> [必填,建议尺寸：宽800px*高800px，格式jpg,png]</span>
    </el-form-item>
    <el-form-item label="公司招聘背景图介绍" prop="jobs_background_info">
      <el-input type="textarea" v-model="postForm.jobs_background_info"></el-input>
    </el-form-item>
    <el-form-item label="公司招聘底部介绍" prop="jobs_bottom_info">
      <el-input type="textarea" v-model="postForm.jobs_bottom_info"></el-input>
    </el-form-item>

    <el-form-item label="产品中心PC版背景图" prop="pcenter_background_pc_img">
      <el-col :span="12">
        <Upload v-model="postForm.pcenter_background_pc_img" />
      </el-col>
      <br>
      <span style="color: red"> [必填,建议尺寸：宽1920px*高650px，格式jpg,png]</span>
    </el-form-item>
    <el-form-item label="产品中心手机版背景图" prop="pcenter_background_mob_img">
      <el-col :span="6">
        <Upload v-model="postForm.pcenter_background_mob_img" />
      </el-col>
      <br>
      <span style="color: red"> [必填,建议尺寸：宽800px*高800px，格式jpg,png]</span>
    </el-form-item>
    <el-form-item label="产品中心背景图介绍" prop="pcenter_background_info">
      <el-input type="textarea" v-model="postForm.pcenter_background_info"></el-input>
    </el-form-item>
    <el-form-item label="产品详情PC版背景图" title="建议尺寸：宽1920px*高650px" prop="product_background_pc_img">
      <el-col :span="12">
        <Upload v-model="postForm.product_background_pc_img" />
      </el-col>
      <br>
      <span style="color: red"> [必填,建议尺寸：宽1920px*高650px，格式jpg,png]</span>
    </el-form-item>
    <el-form-item label="产品详情手机版背景图" title="建议尺寸：宽800px*高800px" prop="product_background_mob_img">
      <el-col :span="6">
        <Upload v-model="postForm.product_background_mob_img" />
      </el-col>
      <br>
      <span style="color: red"> [必填,建议尺寸：宽800px*高800px，格式jpg,png]</span>
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
  //wechat_connect_img: '',
  catalog_apply_imgs: [],
  web_header_menu_setting: '',
  mob_header_menu_setting: '',
  footer_menu_setting: '',
  connect_phone_img: '',
  loading_img: '',
  connect_time: '',
  connect_address: '',
  jobs_background_pc_img: '',
  jobs_background_mob_img: '',
  jobs_background_info: '',
  product_background_pc_img: '',
  product_background_mob_img: '',
  jobs_bottom_info: '',//公司招聘底部介绍
  pcenter_background_pc_img: '',//产品中心PC版背景图
  pcenter_background_mob_img: '',//产品中心手机版背景图
  pcenter_background_info: '',//产品中心背景图介绍
  watermark_switch: 1,//水印开关
  public_account_bbl_img: '',
  water_mark: '',
}

//列表样式
const watermarkSwitchOptions = [
  { id: '1', name: '开启' },
  { id: '0', name: '关闭' },
]

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
      watermarkSwitchOptions,
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
        loading_img: [{ validator: validateRequire }],
        jobs_background_pc_img: [{ validator: validateRequire }],
        jobs_background_mob_img: [{ validator: validateRequire }],
        jobs_background_info: [{ validator: validateRequire }],
        product_background_pc_img: [{ validator: validateRequire }],
        product_background_mob_img: [{ validator: validateRequire }],
        jobs_bottom_info: [{ validator: validateRequire }],
        pcenter_background_pc_img: [{ validator: validateRequire }],
        pcenter_background_mob_img: [{ validator: validateRequire }],
        pcenter_background_info: [{ validator: validateRequire }],
        watermark_switch: [{ validator: validateRequire }],
        public_account_bbl_img: [{ validator: validateRequire }],
        water_mark: [{ validator: validateRequire }],
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
        console.log("列表数据",this.postForm);
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
