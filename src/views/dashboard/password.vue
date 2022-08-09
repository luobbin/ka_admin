<template>
  <div class="app-container">
    <el-form :rules="rules" ref="dataForm" :model="form" label-width="120px">
      <h2>密码修改</h2>
      <el-form-item label="原密码" prop="old_password">
        <el-col :span="8"><el-input v-model="form.old_password"></el-input></el-col>
      </el-form-item>
      <el-form-item label="新密码" prop="password">
        <el-col :span="8"><el-input v-model="form.password"></el-input></el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { passwordData} from '@/api/admin'
export default {
  data() {
    return {
      form: {
        old_password: '',
        password: '',
      },
      rules: {
        old_password: [{ required: true, message: '请输入原始密码', trigger: 'blur' }],
        password: [{ required: true, message: '请输入新密码', trigger: 'blur' }]
      },
    }
  },
  methods: {
    onSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {

          passwordData(this.form).then(res => {
            if(res.data.message){
              this.$notify({
                title: '成功',
                message: res.data.message,
                type: 'success',
                duration: 2000
              })
              this.$store.dispatch('LogOut').then(() => {
                location.reload() // 为了重新实例化vue-router对象 避免bug
              })
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

