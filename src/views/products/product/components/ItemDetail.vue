<template>
  <div class="app-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" size="small" label-width="130px">
      <sticky className="sub-navbar draft">
        <router-link :to="'/products/product-list'">
          <el-button type="primary" icon="el-icon-back" style="margin: 10px; margin-bottom: 0;">返回列表</el-button>
        </router-link>
        <el-button v-loading="loading" style="margin: 10px; float: right; margin-bottom: 0;" type="success" @click="submitForm">保存</el-button>
      </sticky>

      <el-form-item label="产品名称">
        <el-col :span="8"><el-input v-model="postForm.name"></el-input></el-col>
      </el-form-item>

      <el-form-item label="产品分类">
        <el-select  v-model="postForm.cate_id" clearable placeholder="请选择">
          <el-option v-for="item in productCateOptions" :key="item.id" :label="item.sub_name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="产品描述">
        <el-col :span="8"><el-input v-model="postForm.description"></el-input></el-col>
      </el-form-item>

      <el-form-item label="产品介绍">
          <el-input type="textarea" class="el-textarea__inner" :rows="3" autosize placeholder="请输入内容" v-model="postForm.info">
          </el-input>
      </el-form-item>


      <el-form-item label="产品首图">
        <el-col :span="6">
        <div style="margin-bottom: 10px;">
          <Upload v-model="postForm.index_img" />
        </div>
        </el-col>
      </el-form-item>

      <el-form-item label="产品轮播图">
        <div style="margin-bottom: 20px;">
          <Mupload v-bind:imgs="postForm.imgs" @successCBK="imageSuccessCBK" />
        </div>
      </el-form-item>

      <el-form-item label="产品特点" prop="features">
        <div class="list-add"> <el-button type="primary" @click="handleCreate">添加特点</el-button></div>
        <div class="list-items">
          <ul>
            <li v-for="(row, index) in postForm.features" class="detail-item" style="border-bottom: 1px solid #eee; padding-bottom: 5px;">
              <el-col :span="2" style="padding-right: 5px; text-align: right; line-height: 70px; color:#606266"><b>特征{{index+1}}:</b></el-col>
              <el-col :span="10" style="padding-left: 5px; padding-right: 5px; padding-top: 15px;">
                <b v-html='row.title' style="color: gray"></b>
                <br>
                <p v-html='row.content' style="color: gray;line-height: 18px;"></p>
              </el-col>
              <el-col :span="6">
                <img style="float: left; margin-left: 5px;" :src="row.img" width="auto" height="80">
              </el-col>
              <el-col :span="6" style="padding-top: 20px;">
                <el-button type="primary" size="small" @click="handleUpdate(row)">修改</el-button>
                <el-button type="danger" size="small" @click="deleteData(row)">删除</el-button>
              </el-col>
              <div style="clear: both; width: 100%; height: 0"></div>
            </li>
          </ul>
        </div>
      </el-form-item>

      <el-form-item label="产品规格">
        <div class="editor-container">
          <Tinymce :height=400 ref="editor" v-model="postForm.specification" />
        </div>
      </el-form-item>


      <el-form-item label="热门推荐">
        <el-radio-group v-model="postForm.if_hot">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="排序">
        <el-col :span="2"><el-input v-model="postForm.sort"></el-input></el-col>
      </el-form-item>

    </el-form>

    <el-dialog class="features" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="60%">
      <el-form :model="featuresForm" ref="featuresForm" :rules="featuresRules" size="small">
        <el-form-item label="标题" prop="title">
          <el-col :span="8"><el-input v-model="featuresForm.title"></el-input></el-col>
          <span style="color: red; padding-left: 5px;">必填</span>
        </el-form-item>
        <el-form-item label="描述" prop="content">
          <el-input type="textarea" :rows="3" autosize placeholder="请输入内容" v-model="featuresForm.content">
          </el-input>
        </el-form-item>
        <el-form-item label="图片" prop="img">
          <el-col :span="6">
            <Upload v-model="featuresForm.img" />
          </el-col>
          <span style="color: red"> [必填,固定尺寸：宽540px*高540px，格式JPG，PNG]</span>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">添加</el-button>
        <el-button v-else type="primary" @click="updateData">更新</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import Upload from '@/components/Upload/uploadImage'
import Mupload from '@/components/Upload/uploadMutiImage'
import Sticky from '@/components/Sticky' // 粘性header组件
import { getCates, fetchData, createData, updateData } from '@/api/product'
//初始化表单
const defaultForm = {
  cate_id: 1, //分类
  name: '', //标题
  index_img: '', //主图
  description: '', //描述
  info: '', //介绍
  if_hot: 0,//热门推荐
  id: undefined,
  sort: 0,
  specification: '',//规格
  imgs: [],//图册
  features: [],//特点
}
//默认特征
const defaultFeature = {
  id: undefined,
  title:'',
  content:'',
  img:'',
}

export default {
  name: 'itemDetail',
  components: { Tinymce, Upload, Sticky, Mupload},
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
      featuresForm: Object.assign({}, defaultFeature),
      loading: false,
      productCateOptions:null,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        name: [{ validator: validateRequire }],
        index_img: [{ validator: validateRequire }],
        features: [{ type: 'array', required: true, message: '数据必须在1-9个之间', min:1, max:9, trigger: 'change' }],
      },
      featuresRules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        img: [{ required: true, message: '请上传图片', trigger: 'change' }],
      }
    }
  },
  created() {
    this.getAllCates()
    //this.postForm = Object.assign({}, defaultForm)
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
        console.log("this.postForm",response.data)
        this.postForm = response.data
        for (var i = this.postForm.features.length - 1; i >= 0; i--) {
          this.postForm.features[i] = JSON.parse(this.postForm.features[i])
        }
      }).catch(err => {
        console.log(err)
      })
    },
    //获取分类
    getAllCates() {
      getCates().then(response => {
        this.productCateOptions = response.data
      })
    },
    submitForm() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          const postData = Object.assign({}, this.postForm)
          if (this.isEdit) {
            updateData(postData,postData.id).then(response => {
              if(response.data.code==200){
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
              if(response.data.code==200){
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
          }
          this.$router.push('/products/product-list')
          this.loading = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    //收集批量上传的图片
    imageSuccessCBK(arr) {
      this.postForm.imgs = arr
    },
    handleCreate() {
      this.featuresForm = Object.assign({}, defaultFeature)
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['featuresForm'].clearValidate()
      })
    },
    createData() {
      if(this.postForm.features.length>9){
        this.$message("最多只能上传9个")
        this.dialogFormVisible = false
      }
      this.$refs['featuresForm'].validate((valid) => {
        if (valid) {
          this.featuresForm.id = this.postForm.features.length+1
          this.postForm.features.push(this.featuresForm)
          this.dialogFormVisible = false
        }
      })
    },
    handleUpdate(row) {
      this.featuresForm = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['featuresForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['featuresForm'].validate((valid) => {
        if (valid) {
          for (const v of this.postForm.features) {
            if (v.id === this.featuresForm.id) {
              const ide = this.postForm.features.indexOf(v)
              this.postForm.features.splice(ide, 1, this.featuresForm)
              break
            }
          }
          this.dialogFormVisible = false
        }
      })
    },
    deleteData(row) {
      const index = this.postForm.features.indexOf(row)
      this.postForm.features.splice(index, 1)
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
.list-items{
  width: 100%;
  clear: both;
  padding: 0 10px;
  border-top: 1px solid #eee;
}
.list-items .detail-item{
  border-bottom: 1px solid #eee;
  width: 100%;
  padding-bottom: 5px;
  padding-top: 5px;
  clear: both;
}
.list-add{
  float: right;
  margin-top: -5px;
}
</style>
