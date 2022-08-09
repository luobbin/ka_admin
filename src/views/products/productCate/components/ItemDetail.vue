<template>
  <div class="app-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" size="small" label-width="130px">
        <sticky className="sub-navbar draft">
          <router-link :to="'/products/product-cate'">
            <el-button type="primary" icon="el-icon-back" style="margin: 10px; margin-bottom: 0;">返回列表</el-button>
          </router-link>
          <el-button v-loading="loading" style="margin: 10px; float: right; margin-bottom: 0;" type="success" @click="submitForm">保存</el-button>
        </sticky>

        <el-form-item label="名称">
          <el-col :span="8"><el-input v-model="postForm.name"></el-input></el-col>
        </el-form-item>
        <el-form-item label="对应分类">
          <el-col :span="4">
            <el-select  v-model="postForm.cate_id" clearable placeholder="请选择">
              <el-option v-for="item in cateOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-col>
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
import { fetchData, createData, updateData, getAllCates } from '@/api/productcate'
//初始化表单
const defaultForm = {
  status: 1, //状态
  name: '', // 名称
  data_from: 0, //数据来源
  tuijian: 0, //首页推荐
  cate_id:0,
  id: undefined,
  sort: 0
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
            this.$router.push('/products/product-cate')
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
