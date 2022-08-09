<template>
  <div class="upload-container">
    <el-upload class="avatar-uploader el-upload"
      :action="uploadUrl+'/single_upload'"
      list-type="picture-card"
      :data="dataObj"
      :file-list="fileList"
      :show-file-list="true"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      :before-upload="beforeUpload"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="zoomVisible">
      <img class="zoom" width="100%" :src="zoomImageUrl">
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'mutiImageUpload',
  props: {
    imgs:{
      type: Array,
      default: function () {
        return []
      }
    }
  },
  computed: {
    fileList() {
      let tempList = []
      if(this.imgs.length>0){
        for (let i = 0, len = this.imgs.length; i < len; i++) {
          tempList[i] = {url:this.imgs[i]}
        }
      }
      return tempList
    }
  },
  data() {
    return {
      uploadUrl: process.env.BASE_API,
      zoomVisible: false,
      zoomImageUrl: '',
      dataObj: { token: '', key: '', url:'' }
    }
  },
  methods: {
    handlePictureCardPreview(file) {
      this.zoomImageUrl = file.url
      this.zoomVisible = true
    },
    handleSuccess(response, file) {
      console.log("上传文件后返回结果",response);
      const uid = file.uid
      const objKeyArr = Object.keys(this.fileList)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.fileList[objKeyArr[i]].uid === uid) {
          this.fileList[objKeyArr[i]].url = response.url
          this.fileList[objKeyArr[i]].hasSuccess = true
          const arr = Object.keys(this.fileList).map(v => this.fileList[v].url)
          this.$emit('successCBK', arr)
          this.zoomVisible = false
          return
        }
      }

    },
    handleRemove(file) {
      const uid = file.uid
      const objKeyArr = Object.keys(this.fileList)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.fileList[objKeyArr[i]].uid === uid) {
          delete this.fileList[objKeyArr[i]]
          const arr = Object.keys(this.fileList).map(v => this.fileList[v].url)
          this.$emit('successCBK', arr)
          return
        }
      }
    },
    beforeUpload(file) {
      const _self = this
      const _URL = window.URL || window.webkitURL
      const fileName = this.fileList.length
      this.fileList[fileName] = {}
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.src = _URL.createObjectURL(file)
        img.onload = function() {
          _self.fileList[fileName] = { hasSuccess: false, uid: file.uid, width: this.width, height: this.height }
        }
        resolve(true)
      })
    }
  }
}
</script>

<style>
  .upload-container{
    width: 100%; clear: both;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    position: relative;
    width: 157px;
    height: 157px;
    float: left;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .upload-container .el-upload .el-upload-dragger{
    width: auto; height: auto;
  }
  .el-upload-list{float: left;}
  .avatar {
    min-width: 500px;
    min-height: 500px;
  }
</style>
