<template>
  <div class="createPost-container" v-loading="loading" element-loading-text="处理中..">
    <el-form class="form-container"  :model="postForm" :rules="rules" ref="postForm" size="small">
      <sticky className="sub-navbar draft">
        <router-link :to="'/community/share_business'">
          <el-button type="text" icon="el-icon-back" style="margin: 10px; margin-bottom: 0;">返回列表</el-button>
        </router-link>
      </sticky>

      <div class="createPost-main-container">
        <el-form-item label="发布类型" prop="type">
          <el-select v-model="postForm.type" clearable placeholder="请选择发布类型">
            <el-option v-for="item in typeOptions" :key="item.key" :label="item.name" :value="item.key"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="postForm.type==1" label="视频标题" prop="content">
          <el-col :span="10"><el-input size="small" v-model="postForm.content" placeholder="请输入视频标题"></el-input></el-col>
        </el-form-item>
        <el-form-item v-else label="内容描述" prop="content" class="tinymini">
          <br>
          <Tinymce :height=300 ref="editor" v-model="postForm.content" />
        </el-form-item>

        <el-form-item v-if="postForm.type==1" label="视频上传" prop="link">
          <el-col :span="10"><el-input size="small" v-model="postForm.link" placeholder="请输入视频链接"></el-input></el-col>
        </el-form-item>

        <el-form-item v-if="postForm.type==1" label="封面图片" prop="imgs">
          <div style="margin-bottom: 20px;">
            <Upload v-model="postForm.img_first" />
            <span style="float: left; margin-top: -30px; margin-left: 170px; color: red">[固定尺寸：宽654px*高368px，格式JPG，PNG]</span>
          </div>
        </el-form-item>
        <el-form-item v-else label="图片上传" prop="imgs">
          <div style="margin-bottom: 20px;">
            <Mupload v-bind:imgs="postForm.imgs" @successCBK="imageSuccessCBK" />
            <span style="color: red">[竖图（建议尺寸）:宽750px*高1334px，格式JPG，PNG &nbsp 横图（建议尺寸）:宽750px*高562px，格式JPG，PNG]</span>
          </div>
        </el-form-item>


        <el-form-item label="发布时间" prop="publish_time">
          <el-date-picker v-model="postForm.publish_time" type="datetime" placeholder="选择日期时间"></el-date-picker>
        </el-form-item>
        <div style="clear: both; text-align: center;">
          <el-button style="margin: 10px;"  type="success" @click="submitForm">发布</el-button>
        </div>
      </div>
    </el-form>

  </div>
</template>

<script>
import Qs from 'qs'
import Tinymce from '@/components/Tinymini'
import Upload from '@/components/Upload/avatarImage'
import Mupload from '@/components/Upload/mutiImage'
import Sticky from '@/components/Sticky' // 粘性header组件
import { fetchData, createData, updateData } from '@/api/share_business'
import { parseTime, parseDate } from '@/utils'
const typeOptions = [
  { key: 1, name: '新手指引' },
  { key: 2, name: '精品课程' },
]
//将对象转换成数组
const typeArray = typeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.name
  return acc
}, {})
const defaultForm = {
  type: 1,
  content: '', // 内容
  imgs: [], // 缩略图
  img_first:null,//缩略图组
  link: '', // 链接
  id: undefined,
  img_type:0,
  publish_time: null
}

export default {
  name: 'itemDetail',
  components: { Tinymce, Upload, Mupload, Sticky},
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      typeOptions,
      temp: {},
      rules: {
        publish_time: [{ required: true, message: '请输入发布时间', trigger: 'blur' }],
        content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
        link: [{ required: true, message: '请输入视频链接', trigger: 'blur' }],
        type: [{ required: true, message: '请输入类型', trigger: 'change' }],
        imgs: [{ type: 'array', required: true, message: '上传的图片必须在1-9张之间', min:1, max:9, trigger: 'change' }],
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
  },
  methods: {
    fetchData(id) {
      this.loading = true
      fetchData(id).then(response => {
        this.postForm = response.data.data
        this.postForm.publish_time = parseTime(this.postForm.publish_time)
        this.postForm.imgs = JSON.parse(this.postForm.imgs)
        this.postForm.img_first = this.postForm.imgs[0]
        this.loading = false
      }).catch(err => {
        console.log(err)
      })
    },
    submitForm() {
      let tempData = this.resetData()
      this.$refs.postForm.validate(valid => {
        if (valid) {
          if (this.isEdit) {
            this.loading = true
            updateData(tempData,this.postForm.id).then(res => {
              if(res.data.code==200){
                this.$message({type: 'success',message:res.data.data})
              }else{
                this.$message({type: 'error',message:res.data.msg})
              }
              this.loading = false
            })
          }else{
            this.loading = true
            createData(tempData).then(res => {
              if(res.data.code==200){
                this.$message({type: 'success',message:res.data.data})
                this.$router.push('/community/share_business')
              }else{
                this.$message({type: 'error',message:res.data.msg})
              }
              this.loading = false
            })
          }
          
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    //重新初始化传输参数值
    resetData() {
      let temp = {
        publish_time:parseDate(this.postForm.publish_time),
        type:this.postForm.type,
        content:this.postForm.content,
      }
      if(this.postForm.type==1){//视频和封面
        temp.link = this.postForm.link
        temp.imgs = [this.postForm.img_first]
        this.postForm.imgs = temp.imgs
      }else{//多图处理
        temp.imgs = this.postForm.imgs
      }

      return temp
    },
    //收集批量上传的图片
    imageSuccessCBK(arr) {
      this.postForm.imgs = arr
    }
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
