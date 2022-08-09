<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="角色名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <div class="editor-container">
        <dnd-list :list1="list1" :list2="list2" list1Title="已选择" list2Title="权限列表"></dnd-list>
      </div>
      <el-form-item>
        <el-button v-if="isEdit" type="primary" @click="onSubmit">编辑</el-button>
        <el-button v-else type="primary" @click="onSubmit">创建</el-button>
        <router-link :to="'/permissions/role'">
          <el-button>返回列表</el-button>
        </router-link>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Qs from 'qs'
import DndList from '@/components/DndList'
import { getPermissions, getAllPermissions, createData, updateData } from '@/api/role'

export default {
  components: { DndList },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        name: '',
        permissions: []
      },
      list1: [],
      list2: [],
      rules: {
        name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }]
      },
      loading: false
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.getPermissions(id)
      this.getAllPermissions()
    } else {
      this.getAllPermissions()
    }
    this.loading = false
  },
  methods: {
    //获取自身权限
    getPermissions(id) {
      this.loading = true
      getPermissions(id).then(response => {
        this.form.name = response.data.name
        this.form.id = response.data.id
        this.list1 = response.data.permissions
      }).catch(err => {
        console.log(err)
      })
    },
    //获取所有权限
    getAllPermissions() {
      this.loading = true
      getAllPermissions().then(response => {
        this.list2 = response.data.permissions
      })
    },
    onSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          for (const v of this.list1) {
            this.form.permissions.push(v.id)
          }
          this.form.guard_name = 'admin'
          if (this.isEdit) {//更新数据
            updateData(Qs.stringify(this.form),this.form.id).then(() => {
              this.loading = false
              this.form.permissions = []//重置权限
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
            })
          }else{//新增数据
            createData(Qs.stringify(this.form)).then(() => {
              this.$router.push({ path: '/permissions/role' })
            })
          }
        }
      })
    }
  }
}
</script>
