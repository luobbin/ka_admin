<template>
  <div class="createPost-container">
    <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm">
      <sticky className="sub-navbar draft">
        <router-link :to="'/articles/article-list'">
          <el-button type="primary" icon="el-icon-back" style="margin: 10px; margin-bottom: 0;">返回列表</el-button>
        </router-link>
        <el-button v-loading="loading" style="margin: 10px; float: right; margin-bottom: 0;" type="success" @click="submitForm">发布</el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-form-item label="分类" prop="cid">
          <el-select v-model="postForm.cate_id" clearable placeholder="选择分类">
            <el-option v-for="item in cateOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="标题" prop="title">
          <el-col :span="16">
          <el-input v-model="postForm.title"></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="缩略图" prop="img">
          <el-col :span="8">
            <Upload v-model="postForm.index_img" />
          </el-col>
        </el-form-item>


        <el-form-item style="margin-bottom: 40px;" label-width="45px" label="摘要" prop="info">
          <el-input type="textarea" class="article-textarea" :rows="1" autosize placeholder="请输入内容" v-model="postForm.info">
          </el-input>
          <span class="word-counter" v-show="contentShortLength">{{contentShortLength}}字</span>
        </el-form-item>

        <div class="editor-container">
          <Tinymce :height=400 ref="editor" v-model="postForm.content" />
        </div>

        <el-form-item label="首页展示">
          <el-radio-group v-model="postForm.if_index">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="排序" prop="sort">
          <el-input size="small" v-model="postForm.sort" placeholder="值越大越靠前"></el-input>
        </el-form-item>

      </div>
    </el-form>

  </div>
</template>

<script>
import Qs from 'qs'
import Tinymce from '@/components/Tinymce'
import Upload from '@/components/Upload/uploadImage'
import Sticky from '@/components/Sticky' // 粘性header组件
import { validateURL } from '@/utils/validate'
import { fetchData, getTypes, createData, updateData } from '@/api/article'

const defaultForm = {
  cate_id: 0,
  title: '', // 文章题目
  content: '', // 文章内容
  index_img: '', // 文章缩略图
  source: '', // 文章来源
  info: '', // 文章摘要
  id: undefined,
  if_index: 0,
  sort: 0
}

export default {
  name: 'articleDetail',
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
      cateOptions:[],
      rules: {
        title: [{ validator: validateRequire }],
        content: [{ validator: validateRequire }],
      }
    }
  },
  computed: {
    contentShortLength() {
      return this.postForm.desc==null?0:this.postForm.desc.length
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    } else {
      this.postForm = Object.assign({}, defaultForm)
    }
    this.getTypes()
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
    getTypes() {
      getTypes().then(response => {
        this.cateOptions = response.data.data
        this.cateOptions.push({id:0,name:"请选择"})
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
          this.loading = false
          this.$router.push('/articles/article-list')
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
