<template>
  <div class="app-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" size="small" label-width="130px">
      <sticky className="sub-navbar draft">
        <el-button v-loading="loading" style="margin: 10px; float: right; margin-bottom: 0;" type="success" @click="submitForm">保存</el-button>
      </sticky>

      <h2>首页LOGO墙设置</h2>

      <div style="clear: both; height: 100px; line-height: 100px"></div>

      <el-form-item label="LOGO设置" prop="application">
        <div class="list-add"> <el-button type="primary" @click="handleCreate">添加LOGO</el-button></div>
        <div class="list-items">
          <ul>
            <li v-for="(row, index) in postForm.application" class="detail-item">
              <el-col :span="2" style="padding-right: 5px; text-align: right; line-height: 70px; color:#606266"><b>第{{index+1}}个:</b></el-col>
              <el-col :span="10" style="padding-left: 5px; padding-right: 5px; padding-top: 15px;">
                <b v-html='row.title' style="color: gray"></b>
                <a v-if="row.url !== ''" :href="row.url" target="_blank" style="color: blue;"> 链接 </a>
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

      <el-form-item label="首页展示">
        <el-radio-group v-model="postForm.if_show">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>

    </el-form>

    <el-dialog class="application" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="60%">
      <el-form :model="applicationForm" ref="applicationForm" :rules="applicationRules" size="small" label-width="90px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="名称" prop="title">
          <el-col :span="8"><el-input v-model="applicationForm.title"></el-input></el-col>
        </el-form-item>
        <el-form-item label="链接" prop="url">
          <el-col :span="8"><el-input v-model="applicationForm.url"></el-input></el-col>
        </el-form-item>
        <el-form-item label="图片" prop="img">
          <Upload v-model="applicationForm.img" />
          <br>
          <span style="color: red"> [必填,建议尺寸：宽561px*高247px，格式JPG，PNG]</span>
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
import Sticky from '@/components/Sticky' // 粘性header组件
import { fetchData, updateData } from '@/api/homeset'
//初始化表单
const defaultForm = {
  id:5,
  if_show:1,
  application: [],//特点
}
//默认特征
const defaultApplication = {
  id: undefined,
  title:'',
  img:'',
  url:'',
}

export default {
  name: 'logosDetail',
  components: { Tinymce, Sticky, Upload},
  data() {
    return {
      postForm: Object.assign({}, defaultForm),
      applicationForm: Object.assign({}, defaultApplication),
      loading: false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        application: [{ type: 'array', required: true, message: '数据必须在1-20个之间', min:1, max:20, trigger: 'change' }],
      },
      applicationRules: {
        img: [{ required: true, message: '请上传LOGO', trigger: 'change' }],
      }
    }
  },
  created() {
    this.fetchData(defaultForm.id)
  },
  methods: {
    fetchData(id) {
      fetchData(id).then(response => {
        console.log("this.postForm",response.data)
        this.postForm = response.data
        for (var i = this.postForm.application.length - 1; i >= 0; i--) {
          this.postForm.application[i] = JSON.parse(this.postForm.application[i])
        }
      }).catch(err => {
        console.log(err)
      })
    },
    submitForm() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          const postData = Object.assign({}, this.postForm)
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

          this.$router.push('/homeset/logos')
          this.loading = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleCreate() {
      this.applicationForm = Object.assign({}, defaultApplication)
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['applicationForm'].clearValidate()
      })
    },
    createData() {
      if(this.postForm.application.length>20){
        this.$message("最多只能上传20个")
        this.dialogFormVisible = false
      }
      this.$refs['applicationForm'].validate((valid) => {
        if (valid) {
          this.applicationForm.id = this.postForm.application.length+1
          this.postForm.application.push(this.applicationForm)
          this.dialogFormVisible = false
        }
      })
    },
    handleUpdate(row) {
      this.applicationForm = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['applicationForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['applicationForm'].validate((valid) => {
        if (valid) {
          for (const v of this.postForm.application) {
            if (v.id === this.applicationForm.id) {
              const ide = this.postForm.application.indexOf(v)
              this.postForm.application.splice(ide, 1, this.applicationForm)
              break
            }
          }
          this.dialogFormVisible = false
        }
      })
    },
    deleteData(row) {
      const index = this.postForm.application.indexOf(row)
      this.postForm.application.splice(index, 1)
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
