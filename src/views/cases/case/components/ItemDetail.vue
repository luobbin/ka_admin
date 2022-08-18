<template>
  <div class="createPost-container">
    <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm">
      <sticky className="sub-navbar draft">
        <router-link :to="'/cases/case-list'">
          <el-button type="primary" icon="el-icon-back" style="margin: 10px; margin-bottom: 0;">返回列表</el-button>
        </router-link>
        <el-button v-loading="loading" style="margin: 10px; float: right; margin-bottom: 0;" type="success" @click="submitForm">发布</el-button>
      </sticky>

      <div class="createPost-main-container">

        <el-form-item label="案例名称" prop="name">
          <el-input v-model="postForm.name"></el-input>
        </el-form-item>

        <el-form-item label="分类" prop="cid">
          <el-select v-model="postForm.cate_id" clearable placeholder="选择分类">
            <el-option v-for="item in cateOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="首图" prop="index_img">
          <el-col :span="6">
            <Upload v-model="postForm.index_img" />
          </el-col>
        </el-form-item>

        <el-form-item label="案例特点" prop="imgs">
          <div class="list-add"> <el-button type="primary" @click="handleCreate">添加特点</el-button></div>
          <div class="list-items">
            <ul>
              <li v-for="(row, index) in postForm.imgs" class="detail-item" style="border-bottom: 1px solid #eee; padding-bottom: 5px;">
                <el-col :span="2" style="padding-right: 5px; text-align: right; line-height: 70px; color:#606266"><b>特点{{index+1}}:</b></el-col>
                <el-col :span="10" style="padding-left: 5px; padding-right: 5px; padding-top: 15px;">
                  <b v-html='row.title' style="color: gray"></b>
                  <br>
                  <p v-html='row.info' style="color: gray;line-height: 18px;"></p>
                </el-col>
                <el-col :span="6">
                  <img style="float: left; margin-left: 5px; margin-top: 5px;" :src="row.img" width="auto" height="80">
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

        <el-form-item style="margin-bottom: 40px;" label-width="45px" label="简介" prop="info">
          <el-col :span="10">
          <el-input type="textarea" class="article-textarea" :rows="5" autosize placeholder="请输入内容" v-model="postForm.info">
          </el-input>
          <span class="word-counter" v-show="contentShortLength">{{contentShortLength}}字</span>
          </el-col>
        </el-form-item>


        <el-form-item label="视频封面" prop="video_img">
          <el-col :span="6">
            <Upload v-model="postForm.video_img" />
          </el-col>
          <br>
          <span style="color: red"> [必填,建议尺寸：宽1920px*高1000px，格式jpg,png]</span>
        </el-form-item>

        <el-form-item label="视频" prop="video_url">
          <el-col :span="8">
            <FileUpload v-model="postForm.video_url" />
          </el-col>
          <br>
          <span> [建议尺寸：宽1920px*高1000px，格式mp4]</span>
        </el-form-item>

        <el-form-item label="首页展示">
          <el-radio-group v-model="postForm.if_index">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="工程地点" prop="location">
          <el-input size="small" v-model="postForm.location" placeholder="例如：广东,深圳"></el-input>
        </el-form-item>

        <el-form-item label="关联产品ID" prop="product_ids">
          <el-input size="small" v-model="postForm.product_ids" placeholder="例如：1,3"></el-input>
        </el-form-item>

        <el-form-item label="排序" prop="sort">
          <el-input size="small" v-model="postForm.sort" placeholder="值越大越靠前"></el-input>
        </el-form-item>

      </div>
    </el-form>

    <el-dialog class="imgs" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="60%">
      <el-form :model="imgsForm" ref="imgsForm" :rules="imgsRules" size="small">
        <el-form-item label="标题" prop="title">
          <el-col :span="8"><el-input v-model="imgsForm.title"></el-input></el-col>
        </el-form-item>
        <el-form-item label="描述" prop="info">
          <el-input type="textarea" :rows="3" autosize placeholder="请输入内容" v-model="imgsForm.info">
          </el-input>
        </el-form-item>
        <el-form-item label="图片" prop="img">
          <el-col :span="8">
            <Upload v-model="imgsForm.img" /><br>
            <span style="color: red"> [必填,建议尺寸：宽1200px*高800px，格式jpg,png]</span>
          </el-col>

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
import FileUpload from '@/components/Upload/uploadFile'
import Sticky from '@/components/Sticky' // 粘性header组件
import { fetchData, getTypes, createData, updateData } from '@/api/case'

const defaultForm = {
  cate_id: 0,
  name: '', // 题目
  video_url: '', // 视频url
  video_img: '', // 视频url
  index_img: '', // 缩略图
  location: '', // 地点
  info: '', // 摘要
  product_ids: '', // 产品ID集合
  id: undefined,
  imgs: [],
  if_index: 0,
  sort: 0
}

//默认特征
const defaultImgs = {
  id: undefined,
  title:'',
  info:'',
  img:'',
}

export default {
  name: 'itemDetail',
  components: { Tinymce, Upload, FileUpload, Sticky},
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
      imgsForm: Object.assign({}, defaultImgs),
      loading: false,
      cateOptions:[],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        name: [{ validator: validateRequire }],
        info: [{ validator: validateRequire }],
        index_img: [{ validator: validateRequire }],
        imgs: [{ type: 'array', required: true, message: '数据必须在1-9个之间', min:1, max:9, trigger: 'change' }],
      },
      imgsRules: {
        info: [{ required: true, message: '请输入内容', trigger: 'blur' }],
        img: [{ required: true, message: '请上传图片', trigger: 'change' }],
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
          this.$router.push('/cases/case-list')
          this.loading = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleCreate() {
      this.imgsForm = Object.assign({}, defaultImgs)
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['imgsForm'].clearValidate()
      })
    },
    createData() {
      console.log("创建数据",this.imgsForm)
      console.log("创建数据个数",this.postForm.imgs.length)
      if(this.postForm.imgs.length>9){
        this.$message("最多只能上传9个")
        this.dialogFormVisible = false
      }
      this.$refs['imgsForm'].validate((valid) => {
        if (valid) {
          this.imgsForm.id = this.postForm.imgs.length+1
          this.postForm.imgs.push(this.imgsForm)
          this.dialogFormVisible = false
        }
      })
    },
    handleUpdate(row) {
      this.imgsForm = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['imgsForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['imgsForm'].validate((valid) => {
        if (valid) {
          for (const v of this.postForm.imgs) {
            if (v.id === this.imgsForm.id) {
              const ide = this.postForm.imgs.indexOf(v)
              this.postForm.imgs.splice(ide, 1, this.imgsForm)
              break
            }
          }
          this.dialogFormVisible = false
        }
      })
    },
    deleteData(row) {
      const index = this.postForm.imgs.indexOf(row)
      this.postForm.imgs.splice(index, 1)
    },
  }
}
</script>

<style  rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.data-item{background-color: #00b7ee}
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
