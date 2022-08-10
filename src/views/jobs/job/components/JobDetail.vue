<template>
  <div class="createPost-container">
    <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm">
      <sticky className="sub-navbar draft">
        <router-link :to="'/jobs/job-list'">
          <el-button type="primary" icon="el-icon-back" style="margin: 10px; margin-bottom: 0;">返回列表</el-button>
        </router-link>
        <el-button v-loading="loading" style="margin: 10px; float: right; margin-bottom: 0;" type="success" @click="submitForm">发布</el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-form-item label="岗位名称" prop="title">
          <el-col :span="16">
          <el-input v-model="postForm.title"></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="城市" prop="city">
          <el-col :span="8">
            <el-input v-model="postForm.city" placeholder="例如:深圳"></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="薪资待遇" prop="salary">
          <el-col :span="8">
            <el-input v-model="postForm.salary" placeholder="例如:面议"></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="学历要求" prop="demand">
          <el-col :span="8">
            <el-input v-model="postForm.demand" placeholder="例如:本科"></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="经验要求" prop="jingyan">
          <el-col :span="8">
            <el-input v-model="postForm.jingyan" placeholder="例如:3-5年/不限"></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="岗位分类" prop="cate_name">
          <el-col :span="8">
            <el-input v-model="postForm.cate_name" placeholder="例如:产品&服务类"></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="第三方招聘链接" prop="link_addr">
          <el-col :span="16">
            <el-input v-model="postForm.link_addr" placeholder="例如:http://jobs.zhaopin.com/CZ201651630J00125926104.htm"></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="招聘内容" prop="content">
          <div class="editor-container">
            <Tinymce :height=400 ref="editor" v-model="postForm.content" />
          </div>
        </el-form-item>

        <el-form-item label="急聘">
          <el-radio-group v-model="postForm.if_jp">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>

      </div>
    </el-form>

  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import Sticky from '@/components/Sticky' // 粘性header组件
import { fetchData, createData, updateData } from '@/api/job'
//['id','title','city','salary','demand','cate_name','content','created_at','updated_at','link_addr','jingyan','if_jp'];
const defaultForm = {
  id: undefined,
  title: '', // 岗位
  content: '', // 内容
  city: '', // 城市
  salary: '', // 薪资待遇
  demand: '', // 学历要求
  cate_name: '', // 岗位分类
  jingyan: '', // 经验要求
  link_addr: '', // 第三方招聘链接
  if_jp: 0  //是否急聘
}

export default {
  name: 'jobDetail',
  components: { Tinymce, Sticky},
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
          this.loading = false
          this.$router.push('/jobs/job-list')
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
