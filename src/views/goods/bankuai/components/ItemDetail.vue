<template>
  <div class="app-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" size="small" label-width="130px">
        <sticky className="sub-navbar draft">
          <router-link :to="'/goods/bankuai'">
            <el-button type="primary" icon="el-icon-back" style="margin: 10px; margin-bottom: 0;">返回列表</el-button>
          </router-link>
          <el-button v-loading="loading" style="margin: 10px; float: right; margin-bottom: 0;" type="success" @click="submitForm">保存</el-button>
        </sticky>
        <el-form-item label="状态">
          <el-radio-group v-model="postForm.status">
            <el-radio :label="0">关闭</el-radio>
            <el-radio :label="1">开启</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="板块名称">
          <el-col :span="8"><el-input v-model="postForm.title"></el-input></el-col>
        </el-form-item>
        <el-form-item label="板块标识码">
          <el-col :span="8">
            <el-input v-if="postForm.code == ''" v-model="postForm.code"></el-input>
            <el-input v-else v-model="postForm.code" readonly></el-input>
          </el-col>
          <span class="tip">设置后不可修改</span>
        </el-form-item>
        <el-form-item label="版块Banner">
          <div style="margin-bottom: 10px;">
            <Upload v-model="postForm.banner_img" />
          </div>
        </el-form-item>
        <el-form-item label="全局置顶商品">
          <el-radio-group v-model="postForm.quanju">
            <el-radio :label="0">不调用</el-radio>
            <el-radio :label="1">调用</el-radio>
          </el-radio-group>
          <span class="tip">是否调用全局置顶商品</span>
        </el-form-item>
        <el-form-item label="WAP首页调用">
          <el-radio-group v-model="postForm.mobile_status">
            <el-radio :label="0">关闭</el-radio>
            <el-radio :label="1">开启</el-radio>
          </el-radio-group>
          <span class="tip">无线只支持淘宝商品，板块里的其他类型商品会自动过滤</span>
        </el-form-item>
        <el-form-item label="列表样式">
          <el-select  v-model="postForm.bankuai_tpl" clearable placeholder="请选择">
            <el-option v-for="item in bktplOptions" :key="item.key" :label="item.name" :value="item.key"></el-option>
          </el-select>
          <span class="tip">商品显示的列表形式，具体可参考模板说明内解释</span>
        </el-form-item>
        <el-form-item label="数据来源">
          <el-radio-group v-model="postForm.data_from">
            <el-radio :label="0">采集</el-radio>
            <el-radio :label="1">淘宝API</el-radio>
          </el-radio-group>
          <span class="tip"> 淘宝api只能展示淘宝类商品</span>
        </el-form-item>
        <div v-if="postForm.data_from==0">
          <el-form-item label="预告">
            <el-radio-group v-model="postForm.yugao">
              <el-radio :label="0">不开启</el-radio>
              <el-radio :label="1">开启</el-radio>
            </el-radio-group>
            <span class="tip"> 是否开启预告链接</span>
          </el-form-item>
          <el-form-item label="活动开始">
            <el-col :span="1">每日：</el-col>
            <el-col :span="2"><el-input v-model="postForm.huodong_time"></el-input></el-col>点 <span class="tip"> 例如：15点开始，必须使用24小时制。</span>
          </el-form-item>
          <el-form-item label="商家报名">
            <el-radio-group v-model="postForm.baoming">
              <el-radio :label="0">不参与</el-radio>
              <el-radio :label="1">参与</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="默认开始时间">
            <el-radio-group v-model="postForm.time_type">
              <el-radio :label="0">直接开始</el-radio>
              <el-radio :label="1">固定时间</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="postForm.time_type == 0" label="直接开始时间">
            <el-col :span="2"><el-input v-model="postForm.zj_stime"></el-input></el-col>小时后 <span class="tip">  0为马上开始，如“10”即添加后10小时后显示</span>
          </el-form-item>
          <el-form-item v-if="postForm.time_type == 1" label="固定开始时间">
            <el-col :span="4">
              <el-radio-group v-model="postForm.gd_stime">
                <el-radio :label="0">今天</el-radio>
                <el-radio :label="1">明天</el-radio>
              </el-radio-group>
            </el-col>
            <el-col :span="2"><el-input v-model="postForm.gd_minute"></el-input></el-col> <span class="tip">  注意时间格式：“7:00”，设置分无效，最小到小时</span>
          </el-form-item>
          <el-form-item label="默认结束时间">
            <el-col :span="2"><el-input v-model="postForm.etime"></el-input></el-col>天后<span class="tip">  以天为单位</span>
          </el-form-item>
        </div>
        <div v-if="postForm.data_from==1">
          <el-form-item label="对应分类">
            <el-col :span="4">
              <el-select  v-model="postForm.dan_api.cat" clearable placeholder="请选择">
                <el-option v-for="item in cateOptions" :key="item.id" :label="item.title" :value="item.id"></el-option>
              </el-select>
            </el-col>
            <el-col :span="2">
              <el-input v-model="postForm.dan_api.q" placeholder="关键词"></el-input>
            </el-col>
            <span class="tip">  分类和关键词至少设置一项</span>
          </el-form-item>
          <el-form-item label="数据排序">
            <el-radio-group v-model="postForm.api_sort">
              <el-radio label="total_sales_des">销量高到低</el-radio>
              <el-radio label="tk_rate_des">佣金比率高到低</el-radio>
              <el-radio label="tk_total_sales_des">推广量高到低</el-radio>
              <el-radio label="tk_total_commi_des">支出佣金高到低</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <el-form-item label="首页推荐">
          <el-radio-group v-model="postForm.tuijian">
            <el-radio :label="0">不推荐</el-radio>
            <el-radio :label="1">推荐</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-col :span="4"><el-input v-model="postForm.sort" placeholder="值越大越靠前"></el-input></el-col>
        </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import Upload from '@/components/Upload/singleImage3'
import Sticky from '@/components/Sticky' // 粘性header组件
import { validateURL } from '@/utils/validate'
import { fetchData, createData, updateData, getTaoCates } from '@/api/bankuai'
//初始化表单
const defaultForm = {
  status: 1, //状态
  title: '', // 名称
  code: '', //标识
  banner_img: '', // banner图
  bankuai_tpl: '', //列表样式
  quanju: 0, //全局置顶
  mobile_status: 0, //wap首页调用
  fenlei: 0, //分类显示
  data_from: 0, //数据来源
  yugao: 0, //预告
  huodong_time: 10,//活动时间
  time_type: 0, //默认开始时间
  zj_stime: 0, //直接开始时间
  gd_stime: 0, //固定开始时间
  gd_minute: '', //固定开始时分
  etime: 0, //默认结束时间
  baoming: 0, //商家报名
  tuijian: 0, //首页推荐
  dan_api:{
    cat: null,// 对应分类
    q: '',//对应关键词
  },
  //dan_api[cat]: 0, // 对应分类
  //dan_api[q]: '',//对应关键词
  api_sort: 'total_sales_des', //数据排序
  id: undefined,
  sort: 0,
  web_cid: [],
  yun_cid: []
}

//列表样式
const bktplOptions = [
  { key: '250', name: '250' },
  { key: '350', name: '350' },
  { key: 'chaofan', name: 'chaofan' },
  { key: 'quan', name: 'quan' },
  { key: 'tejia', name: 'tejia' },
  { key: 'zhi', name: 'zhi' },
  { key: 'baokuan', name: 'baokuan' },
]

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
      bktplOptions,
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
      getTaoCates().then(response => {
        this.cateOptions = response.data
      })
    },
    submitForm() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          if (this.isEdit) {
            updateData(this.postForm,this.postForm.id).then(response => {
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
            createData(this.postForm).then(response => {
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
            this.$router.push('/goods/bankuai')
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
</style>
