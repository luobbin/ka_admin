<template>
  <div class="createPost-container">
    <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm">
      <sticky className="sub-navbar draft">
        <router-link :to="'/webset/news-list'">
          <el-button type="primary" icon="el-icon-back" style="margin: 10px; margin-bottom: 0;">返回列表</el-button>
        </router-link>
        <el-button v-loading="loading" style="margin: 10px; float: right; margin-bottom: 0;" type="success" @click="submitForm">发布</el-button>
      </sticky>

      <div class="createPost-main-container">

        <el-form-item label="名称" prop="name">
          <el-input v-model="postForm.name"></el-input>
        </el-form-item>
        <el-form-item label="别名" prop="name_attr">
          <el-input v-model="postForm.name_attr"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
        <div class="editor-container">
          <Tinymce :height=400 ref="editor" v-model="postForm.content" />
        </div>
        </el-form-item>
      </div>
    </el-form>

  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import Upload from '@/components/Upload/singleImage'
import Sticky from '@/components/Sticky' // 粘性header组件
import Mupload from '@/components/Upload/mutiImage'
import { fetchData, createData, updateData } from '@/api/webset'

const defaultForm = {
  name: '', // 题目
  name_attr: '', // 视频url
  content: '', // 摘要
  id: undefined,
}

export default {
  name: 'itemDetail',
  components: { Tinymce, Upload, Sticky,Mupload},
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
      cateOptions:[],
      rules: {
        name: [{ validator: validateRequire }],
        info: [{ validator: validateRequire }],
        index_img: [{ validator: validateRequire }],
      }
    }
  },
  computed: {
    contentShortLength() {
      return this.postForm.info==null?0:this.postForm.info.length
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
      fetchData(id).then(response => {
        this.postForm = response.data
      }).catch(err => {
        console.log(err)
      })
    },
    submitForm() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          if (this.isEdit) {
            updateData(this.postForm,this.postForm.id).then(() => {
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
            })
          }else{
            createData(this.postForm).then(() => {
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            })
          }
          this.$router.push('/webset/news-list')
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
