<template>
  <div class="createPost-container" v-loading="loading" element-loading-text="处理中..">
    <el-form class="form-container" :model="postForm" size="small" :rules="rules" ref="postForm">
      <sticky className="sub-navbar draft">
        <router-link :to="'/community/share_sales'">
          <el-button type="text" icon="el-icon-back" style="margin: 10px; margin-bottom: 0;">返回列表</el-button>
        </router-link>
      </sticky>

      <div class="createPost-main-container">
        <el-form-item label="发布人昵称" prop="share_user_id">
          <span v-if="postForm.user!=null">{{postForm.user.name}}</span> <el-button type="primary" @click="outerVisible = true">选择发布人</el-button>
        </el-form-item>
        <el-form-item label="发布人头像">
          <img v-if="postForm.user!=null" :src="postForm.user.img" width="auto" height="80">
        </el-form-item>
        
        <el-form-item label="发布时间" prop="publish_time">
          <el-date-picker v-model="postForm.publish_time" type="datetime" placeholder="选择日期时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="内容描述" prop="content" class="tinymini">
          <br>
          <Tinymce :height=300 ref="editor" v-model="postForm.content" />
        </el-form-item>
        <el-form-item label="精选评论" prop="commits">
          <el-input type="textarea" v-model="postForm.commits" rows=8></el-input>
        </el-form-item>
        <el-form-item label="商品列表" prop="goods">
          <div class="list-goods">
            <ul>
              <li v-for="(row, index) in postForm.goods" class="goods-item">
                <el-col :span="2" style="padding-right: 5px; text-align: right; line-height: 70px; color:#606266"><b>商品{{index+1}}</b></el-col>
                <el-col :span="8" style="padding-left: 5px; padding-right: 5px; padding-top: 15px;"><div v-html='row.content' style="color: gray"></div></el-col>
                <el-col :span="8"><img style="float: left; margin-left: 5px;" v-for="img in row.imgs" :src="img" width="auto" height="80"></el-col>
                <el-col :span="6" style="padding-top: 20px;">
                  <el-button type="primary" size="small" @click="handleUpdate(row)">修改</el-button>
                  <el-button type="danger" size="small" @click="deleteData(row)">删除</el-button>
                </el-col>
                <div style="clear: both; width: 100%; height: 0"></div>
              </li>
            </ul>
          </div>
        </el-form-item>

        <div style="clear: both; width: 100%; margin-top: 1rem; margin-bottom: 1rem">
          <el-col :span="2"></el-col>
          <el-col :span="20">
            <el-button type="primary" @click="handleCreate">添加商品</el-button>
            <el-button style="margin-left: 2rem;" @click="submitForm">发布爆款</el-button>
          </el-col>
          <div style="width: 100%; height: 0.5rem; clear: both;"></div>
        </div>
      </div>
    </el-form>

    <el-dialog class="faburen" title="选择发布人" :visible.sync="outerVisible" width="60%">
      <el-dialog width="30%"  size="small" title="添加发布人" :visible.sync="innerVisible" append-to-body>
        <el-form :model="userForm">
          <el-form-item label="发布人昵称">
            <el-col :span="8"><el-input v-model="userForm.name"></el-input></el-col>
          </el-form-item>
          <el-form-item label="图片上传">
            <div style="margin-bottom: 20px;">
              <Upload v-model="userForm.img" />
            </div>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="createUser">确定</el-button>
        </div>
      </el-dialog>

      <div class="list-user">
        <ul>
          <li v-for="user in users" class="user-item">
            <i class="el-icon-circle-check" title="点击选择该发布人"></i>
            <img :src="user.img" @click="checkUser(user)" alt="点击选择该发布人">
            <h6>{{user.name}}</h6>
            <i class="el-icon-delete" @click="deleteUser(user)" title="删除该发布人"></i>
          </li>
        </ul>
        <div style="width: 100%; height: 0.5rem; clear: both;"></div>
      </div>
      
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleUser()">添加发布人</el-button>
      </div>
    </el-dialog>

    <el-dialog class="goods" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="60%">
      <el-form :model="goodsForm" ref="goodsForm" :rules="goodsRules" size="small">
        <el-form-item label="商品类别" prop="type">
          <el-select v-model="goodsForm.type" clearable placeholder="请选择商品类别">
            <el-option v-for="item in typeOptions" :key="item.key" :label="item.name" :value="item.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="跳转方式" prop="jump_type">
          <el-select v-model="goodsForm.jump_type" clearable placeholder="请选择跳转方式">
            <el-option v-for="item in jumpOptions" :key="item.key" :label="item.name" :value="item.key"></el-option>
          </el-select>
        </el-form-item>    
        <el-form-item label="商品ID" prop="data_id">
          <el-col :span="8"><el-input v-model="goodsForm.data_id" @blur="checkOpen()"></el-input></el-col>
          <span style="color: red; padding-left: 5px;">{{goodsTips}}</span>
        </el-form-item>
        <el-form-item label="商品图片" prop="imgs">
          <div style="margin-bottom: 20px;">
            <Mupload v-bind:imgs="goodsForm.imgs" @successCBK="imageSuccessCBK" />
            <span style="color: red">[固定尺寸：宽540px*高540px，格式JPG，PNG]</span>
          </div>
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
import Qs from 'qs'
import Tinymce from '@/components/Tinymini'
import Mupload from '@/components/Upload/mutiImage'
import Upload from '@/components/Upload/avatarImage'
import Sticky from '@/components/Sticky' // 粘性header组件
import { fetchData, createData, updateData, getUserList, createUser, deleteUser, fetchOpenData, sendJpush } from '@/api/share_sales'
import { parseTime, parseDate } from '@/utils'
//商品类型
const typeOptions = [
  { key: 1, name: '淘宝' },
  { key: 2, name: '京东' },
  { key: 3, name: '拼多多' },
]
//将对象转换成数组
const typeArray = typeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.name
  return acc
}, {})
//商品跳转方式
const jumpOptions = [
  { key: 0, name: '本地商品详情' },
  { key: 1, name: '淘宝商品详情' },
  { key: 2, name: '京东商品详情' },
  { key: 3, name: '拼多多商品详情' },
]
//将对象转换成数组
const jumpArray = jumpOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.name
  return acc
}, {})
//默认爆款主题表单
const defaultForm = {
  id: undefined,
  publish_time: null,
  commits: '', 
  content:'',// 内容
  share_user_id: null,
  user: {
    name:'',
    img:null
  },
  goods: [], // 商品列表
}
//默认商品
const defaultGoods = {
  id: undefined,
  data_id:'',
  share_sales_id:0,
  jump_type:1,
  type:1,
  content:'',
  open_data:null,
  imgs:[],
}
//默认用户
const defaultUser = {
  name:'',
  img:null
}

export default {
  name: 'itemDetail',
  components: { Tinymce, Mupload, Upload, Sticky},
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      postForm: Object.assign({}, defaultForm),
      goodsForm: Object.assign({}, defaultGoods),
      userForm: Object.assign({}, defaultUser),
      loading: false,
      typeOptions,
      jumpOptions,
      outerVisible: false,
      innerVisible: false,
      dialogFormVisible: false,
      dialogStatus: '',
      goodsTips: '',
      textMap: {
        update: '编辑商品',
        create: '创建商品'
      },
      users:[],
      rules: {
        publish_time: [{ required: true, message: '请输入发布时间', trigger: 'blur' }],
        commits: [{ required: true, message: '请输入评论', trigger: 'blur' }],
        content: [{ required: true, message: '请输入描述', trigger: 'blur' }],
        share_user_id: [{ required: true, message: '请选择发布人', trigger: 'blur' }],
        goods: [{ type: 'array', required: true, message: '上传的商品必须在1-9个之间', min:1, max:9, trigger: 'change' }],
      },
      goodsRules: {
        data_id: [{ required: true, message: '请输入商品ID', trigger: 'blur' }],
        type: [{ required: true, message: '请输入商品类型', trigger: 'change' }],
        jump_type: [{ required: true, message: '请输入跳转类型', trigger: 'change' }],
        imgs: [{ type: 'array', required: true, message: '上传的图片必须在1-3张之间', min:1, max:3, trigger: 'change' }],
      }
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    } else {
      this.postForm = Object.assign({}, defaultForm)
      this.postForm.goods = []
    }
    this.getUserList()
  },
  methods: {
    fetchData(id) {
      this.loading = true
      fetchData(id).then(response => {
        this.postForm = response.data.data
        this.postForm.publish_time = parseTime(this.postForm.publish_time)
        for (var i = this.postForm.goods.length - 1; i >= 0; i--) {
          this.postForm.goods[i].imgs = JSON.parse(this.postForm.goods[i].imgs)
          this.postForm.goods[i].open_data = JSON.parse(this.postForm.goods[i].open_data)
        }
        this.loading = false
//        console.log(this.postForm.imgs)
      }).catch(err => {
        console.log(err)
      })
    },
    getUserList() {//获取用户列表
      this.loading = true
      getUserList().then(res => {
        this.users = res.data.data
        this.loading = false
      })
    },
    handleUser() {
      this.userForm = Object.assign({}, defaultUser)
      this.innerVisible = true
    },
    createUser() {
      createUser(this.userForm).then(res => {
        if(res.data.code==200){
          this.users.unshift(res.data.data)
          this.innerVisible = false
        }else{
          this.$message({
            message: res.data.msg,
            type: 'warning'
          })
        }
      })    
    },
    deleteUser(row) {
      deleteUser(row.id).then(res => {
        if(res.data.code==200){
          this.$message({type: 'success',message:res.data.data})
          const index = this.users.indexOf(row)
          this.users.splice(index, 1)
        }else{
          this.$message({type: 'error',message:res.data.msg})
        }
      })
    },
    checkUser(row){
      this.postForm.share_user_id = row.id
      this.postForm.user = row
      this.outerVisible = false
    },
    submitForm() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          let tempData = this.resetData()
          // for (var i = this.postForm.goods.length - 1; i >= 0; i--) {
          //   this.postForm.goods[i].imgs = JSON.stringify(this.postForm.goods[i].imgs)
          //   this.postForm.goods[i].open_data = JSON.stringify(this.postForm.goods[i].open_data)
          // }
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
                sendJpush()
                this.$router.push('/community/share_sales')
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
      return {
        publish_time:parseDate(this.postForm.publish_time),
        commits:this.postForm.commits,
        content:this.postForm.content,
        share_user_id:this.postForm.share_user_id,
        goods:JSON.stringify(this.postForm.goods),
      }
    },
    checkOpen(){
      let checkDataId = this.checkDataId()
      if(checkDataId==1) return
      fetchOpenData(this.goodsForm.type,this.goodsForm.data_id).then(res => {
        if(res.data.code==200){
          this.goodsForm.content = res.data.data.title
          //this.goodsForm.imgs = [res.data.data.img]
          this.goodsForm.open_data = res.data.data//JSON.stringify(res.data.data)
          this.innerVisible = false
        }else{
          this.goodsTips = res.data.msg
        }
      })
      
    },
    handleCreate() {
      this.goodsForm = Object.assign({}, defaultGoods)
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['goodsForm'].clearValidate()
      })
    },
    createData() {
      if(this.postForm.goods.length>9){
        this.$message("最多只能上传9个商品")
        this.dialogFormVisible = false
      }
      let checkDataId = this.checkDataId()
      if(checkDataId==1) return
      this.$refs['goodsForm'].validate((valid) => {
        if (valid) {
            this.postForm.goods.push(this.goodsForm)
            this.dialogFormVisible = false
        }
      })
    },
    handleUpdate(row) {
      this.goodsForm = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['goodsForm'].clearValidate()
      })
    },
    updateData() {
      let checkDataId = this.checkDataId()
      if(checkDataId==1) return
      this.$refs['goodsForm'].validate((valid) => {
        if (valid) {
          for (const v of this.postForm.goods) {
            if (v.data_id === this.goodsForm.data_id) {
              const ide = this.postForm.goods.indexOf(v)
              this.postForm.goods.splice(ide, 1, this.goodsForm)
              break
            }
          }
          this.dialogFormVisible = false
        }
      })
    },
    deleteData(row) {
      const index = this.postForm.goods.indexOf(row)
      this.postForm.goods.splice(index, 1)
    },
    checkDataId(){
      if(this.goodsForm.data_id==''){
        this.goodsTips = "请输入商品ID"
        return 1
      }else{
        this.goodsTips = ""
        return 0
      }
    },
    //收集批量上传的图片
    imageSuccessCBK(arr) {
      this.goodsForm.imgs = arr
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
<style type="text/css">
.faburen .el-dialog__body{padding: 0}
.goods .el-dialog__body{padding: 0 15px;}
.list-user{
  background: #F2F2F2;
  width: 100%;
  clear: both;
  padding: 0 10px;
}
.list-user .user-item{
  width: 15%;
  margin-left: 0.83%;
  margin-right: 0.83%;
  margin-top: 0.5rem;
  background: #fff;
  float: left; 
}
.list-user .user-item img{
  width: 100%;
  height: 7.5rem;
  z-index: 1;
}
.list-user .user-item h6{
  padding: 0;
  margin:0;
  text-align: center; 
}
.list-user .user-item i{
  display: none;
  z-index: 2;
}
.list-user .user-item:hover i{
  display: inline;
}
.list-user .user-item i.el-icon-circle-check{
  color: green; position: absolute; margin-left: 12.5%; margin-bottom: -3rem; font-size: 18px;
}
.list-user .user-item i.el-icon-delete{
  color: red; float: right; margin-top: -1rem;
}
.list-goods{
  width: 100%;
  clear: both;
  padding: 0 10px;
  border-top: 1px solid #eee;
}
.list-goods .goods-item{
  border-bottom: 1px solid #eee;
  width: 100%;
  padding-bottom: 5px;
  padding-top: 5px;
  clear: both;
}
</style>
