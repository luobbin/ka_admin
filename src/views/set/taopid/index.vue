<template>
  <div class="app-container" v-loading="listLoading" element-loading-text="Loading">
    <div class="filter-container" style="margin-bottom:10px;">
      <el-input style="width: 150px;" class="filter-item" placeholder="网站名称" v-model="keyword">
      </el-input>
     
      <el-button type="primary" class="filter-item" icon="el-icon-search" @click="handleFilter">筛选</el-button>
      <el-button class="filter-item" style="margin-left: 10px; margin-bottom:10px" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
      <!-- <el-button class="filter-item" type="primary" icon="el-icon-edit">添加</el-button> -->
      
    </div>

    <el-table ref="multipleTable" :data="list" @selection-change="handleSelectionChange" border fit highlight-current-row>
      <el-table-column type="selection" :selectable='checkboxT' width="35"></el-table-column>
      
      <el-table-column label="网站名称" align="center">
        <template slot-scope="scope">
          {{scope.row.title}}
        </template>
      </el-table-column>
    
      <el-table-column label="pid " width="450" align="center">
        <template slot-scope="scope">
          {{scope.row.pid}}
        </template>
      </el-table-column>

      <el-table-column label="申请域名 " width="250" align="center">
        <template slot-scope="scope">
          {{scope.row.url}}
        </template>
      </el-table-column>
     
      <el-table-column label="是否默认 " width="120" align="center">
        <template slot-scope="scope">
          {{scope.row.default}}
        </template>
      </el-table-column>


      
      <el-table-column prop="addtime" label="高佣授权" width="180" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{scope.row.addtime|parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="operate" label="操作" width="160" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-checkbox v-if="checkAll==0" :indeterminate="isIndeterminate" @change="toggleSelection(list)">全选</el-checkbox>
      <el-checkbox v-else-if="checkAll==1" :indeterminate="isIndeterminate" @change="toggleSelection(list)">反选</el-checkbox>
      <el-checkbox v-else  @change="toggleSelection()" :indeterminate="isIndeterminate">取消全选</el-checkbox>
      <el-button type="danger" size="mini" @click="handleDelete()">彻底删除</el-button>

      <el-pagination background @current-change="handleCurrentChange" :current-page="listQuery.page"
        :page-sizes="[listQuery.limit]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
	<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="90px" style='width: 400px; margin-left:50px;'>
        
        <el-form-item label="网站名称" prop="title">
          <el-input v-model="temp.title"></el-input>
        </el-form-item>
        <el-form-item label="pid" prop="pid">
          <el-input v-model="temp.pid"></el-input>
        </el-form-item>
        <el-form-item label="申请域名" prop="url">
          <el-input v-model="temp.url"></el-input>
        </el-form-item>
        <el-form-item label="是否默认" prop="default">
          <el-select class="filter-item" v-model="temp.default">
            <el-option v-for="item in typeOptions" :key="item.id" :label="item.title" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="key" prop="key">
          <el-input v-model="temp.key"></el-input>
        </el-form-item>
        <el-form-item label="secrect" prop="secrect">
          <el-input v-model="temp.secrect"></el-input>
        </el-form-item>
        
        <el-form-item label="淘宝账号" prop="nick">
          <el-input v-model="temp.nick"></el-input>
        </el-form-item>
        <el-form-item label="多多token" prop="nick">
          <el-input v-model="temp.token"></el-input>
        </el-form-item>
        <el-form-item label="三下token" prop="nick">
          <el-input v-model="temp.sanxia_token"></el-input>
        </el-form-item>
        <el-form-item label="友邻token" prop="nick">
          <el-input v-model="temp.youling_token"></el-input>
        </el-form-item>
        <el-form-item label="选择接口">
          <el-select class="filter-item" v-model="temp.auth">
            <el-option v-for="item in authOptions" :key="item.id" :label="item.title" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="授权">
          <el-select class="filter-item" v-model="power">
            <el-option label="多多授权" value="1"></el-option>
            <el-option label="三下授权" value="2"></el-option>
            <el-option label="友邻授权" value="3"></el-option>
          </el-select>
          <el-button type="primary" @click="getPower(temp.key)">去授权</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData()">添加</el-button>
        <el-button v-else type="primary" @click="update()">更新</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getList,createData,updateData,deleteData } from '@/api/taopid'
import { parseTime, parseDate } from '@/utils'

import Clipboard from 'clipboard'

export default {
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      power: "1",
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 15,
        searchJoin: 'and',
        search: '',
        searchFields: '',
        filter: ''
      },
      typeOptions:[{
        id:1,title:'是'
      },{id:0,title:'否'
      }],
        authOptions:[{
            id:1,title:'使用多多接口'
        },{id:2,title:'使用三下接口'
        },{id:3,title:'使用友邻接口'
        }],
      keyword: null,//搜索字段对应关键词
      multipleSelection: [],
      checkAll: 0,
      isIndeterminate: false,
       //初始化行值
      temp: {
        id: undefined,
        title: '',
        url:'',
        default:'',
        key:'',
        secrect:'',
        nick:'',
        pid:0,
       
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        title: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      },
    }

  },
  //添加后重载列表
  created() {
    this.getList()
  },
  methods: {
    //获取列表
    getList() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        this.list = response.data.data
        this.total = response.data.total
        this.listLoading = false
      })
    },
    
    //去授权
    getPower(key){
        let iframe = document.createElement("iframe");
        document.body.appendChild(iframe)
        var Win = iframe.contentWindow
      if(this.power==1)  {
          Win.open("https://oauth.taobao.com/authorize?response_type=token&client_id=21165987&view=web")
      }
      if(this.power==2)  {
          Win.open("https://oauth.taobao.com/authorize?response_type=code&view=web&redirect_uri=http%3A%2F%2Fai.vertq.com%2FoatuthTb.ashx&state=XFZ178_"+key+'&client_id=23408532')
        }
      if(this.power==3) {
          Win.open("https://oauth.taobao.com/authorize?response_type=token&client_id=24456128&view=web")
      }
    },
    //搜索
    handleFilter() {
      if (this.keyword) {
      //遵循查询规则
        this.listQuery.search += 'title:'+ this.keyword +';'
        this.listQuery.searchFields += 'title:like' + ';'
      }
      this.listQuery.page = 1
      this.getList()
    },
    //更换页面
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    //全选、反选、取消全选
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        });
      } else {
        this.$refs.multipleTable.clearSelection()  
      }
    },
    //获取选中对象
    handleSelectionChange(val) {
      this.multipleSelection = val;
      if(this.multipleSelection.length == this.list.length){
        this.checkAll = 2
        this.isIndeterminate = true
      }else if (this.multipleSelection.length > 0) {
        this.checkAll = 1
        this.isIndeterminate = true
      }else{
        this.checkAll = 0
        this.isIndeterminate = false
      }
    },
    //初始化禁用选项
    checkboxT(row,index){
      
        return 1;
     
    },
    //批量删除
    handleDelete () {
      if(this.multipleSelection.length<=0){
        this.$notify({
          title: '警告',
          message: '请选择要删除的条目',
          type: 'warning'
        });
        return false
      }
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        let ids = ''
        for (const v of this.multipleSelection) {
          
            ids += v.id + ','
          
        }
        
        this.listLoading = true
        deleteData(ids).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          //重载数据
          this.getList()
          this.listLoading = false
        })
        
      }).catch(() => {
        //取消后的操作
      })
    },
    //回显数据
    resetTemp(arr){
        if(arr){
         
          this.temp = arr;

        }
    },
  //添加数据
     handleCreate() {
      this.temp = {

      }
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData(){
       this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createData(this.temp).then(() => {
            
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          this.getList()
          })
        }
      })
    },
  //编辑数据
    handleUpdate(row){
        this.resetTemp(row);
        this.dialogStatus = 'update';
        this.dialogFormVisible = true;
        this.$nextTick(() =>{
          this.$refs['dataForm'].clearValidate()
        })
    },
  update() {
    this.$refs['dataForm'].validate((valid)=> {
      if(valid) {
        
        updateData(this.temp).then(() =>{
          for(const v of this.list) {
            if(v.id === this.temp.id) {
              const index = this.list.indexOf(v)
              this.list.splice(index,1,this.temp)
              break
            }
          }

          this.dialogFormVisible = false
          this.$notify({
            title: '成功',
            message: '更新成功',
            type: 'success',
            duration: 2000
          })
        })

      }
    })
  },
  }
}
</script>
<style scoped>
.pagination-container{
  margin-top: 10px;
}
.el-pagination{
  float: right;
}

</style>