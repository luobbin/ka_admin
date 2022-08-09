<style rel="stylesheet/scss" lang="scss" scoped>
.mian {
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: #FFF;
  z-index: 2;
  width: 100%;
  .head {
    padding-top: 10px;
    .fh {
      margin-left: 10px;
    }
    h2 {
      margin: 0 40%;
      display: inline;
      letter-spacing: 3px;
    }
  }
  .content {
    width: 80%;
    margin: 30px 3%;
    .el-input {
      margin-right: 10px;
    }
  }
  .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item{
        margin-bottom: 8px;
  }
}
</style>
<template>
<div class="mian">
  <div class="head">
    <router-link :to="'/user/user_list'"><el-button type="text" class="fh">返回列表</el-button></router-link>
    <h2>会员信息</h2>
  </div>
  <div class="content">
    <el-form ref="lookuserdata" :model="lookuserdata" label-width="160px" size="small">
      <el-form-item label="会员名：">
        <el-input style="width:240px" clearable v-model="lookuserdata.ddusername" :disabled="true" ></el-input>
      </el-form-item>
      <el-form-item label="登录密码：">
        <el-input type="password" style="width:240px;" clearable v-model="lookuserdata.ddpassword" :disabled="ispassword" minlength="6" maxlength="30"></el-input>
        <el-checkbox  @change="xiugaipwd" style="color:#999">点击激活修改密码</el-checkbox>
      </el-form-item>
      <el-form-item label="注册时间：">
        {{lookuserdata.regtime}}
      </el-form-item>
      <el-form-item label="真实姓名：">
        <el-input style="width:240px;" clearable v-model="lookuserdata.realname"></el-input>
      </el-form-item>
      <el-form-item label="支付宝：">
        <el-input style="width:240px;" clearable v-model="lookuserdata.alipay"></el-input>
      </el-form-item>
      <el-form-item label="邮箱：">
        <el-input style="width:240px;" clearable v-model="lookuserdata.email"></el-input>
      </el-form-item>
      <el-form-item label="银行：">
        <el-input style="width:240px;" clearable v-model="lookuserdata.bank_name"></el-input>
      </el-form-item>
      <el-form-item label="银行账号：">
        <el-input style="width:240px;" clearable v-model="lookuserdata.bank_code"></el-input>
      </el-form-item>
      <el-form-item label="推荐人ID：">
        <!-- <a :href="'/user/tuijianren/'+lookuserdata.id" class="link-type">{{lookuserdata.tjr}}</a> -->
        <router-link :to="'/user/tuijianren/'+lookuserdata.id">
          <a class="link-type">{{lookuserdata.tjr}}</a>
        </router-link>
        <span v-if="lookuserdata.tuijianren!=null" style="color:#999">会员：{{lookuserdata.tuijianren.ddusername}} （当出师后，推荐人id会为0，在“已结束”中记录）</span>
      </el-form-item>
      <el-form-item label="QQ：">
        <el-input style="width:240px;" clearable v-model="lookuserdata.qq"></el-input>
        <a target="_blank" :href="'http://wpa.qq.com/msgrd?v=3&uin=' + lookuserdata.qq +'&site=qq&menu=yes'" >
          <img style="height:16px" border="0" src="http://wpa.qq.com/pa?p=2:66666:46" alt="点击这里给我发消息" title="点击这里给我发消息">
        </a>
      </el-form-item>
      <el-form-item label="手机：">
        <el-input style="width:240px;" clearable v-model="lookuserdata.mobile" maxlength="11"></el-input>
        <el-radio-group v-model="lookuserdata.mobile_test">
          <el-radio :label="1">已验证</el-radio>
          <el-radio :label="0">未验证</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="淘宝跟踪状态：">
        <span style="font-size:15px;font-weight:700">{{lookuserdata.tbnick}}</span>
        <span style="color:#999;">（绑定淘宝帐号，淘宝订单跟踪状态会成为自动）</span>
        <span style="color:red;font-size:16px;font-weight:700;cursor:pointer;" @click=taobaodingdansj>绑定</span>
      </el-form-item>
      <el-form-item label="淘宝账号/订单号："  v-show="taobaodingdanshow">
        <el-input style="width:240px;" clearable v-model="lookuserdata.tbnick"></el-input><span style="color:#999">多个淘宝帐号用英文逗号分割</span>
      </el-form-item>
      <el-form-item label="淘宝订单后6位：">
        <el-input style="width:240px;" clearable v-model="lookuserdata.trade_uid"></el-input>淘宝订单后6位
      </el-form-item>
      <el-form-item label="购物次数：">
        <el-input style="width:240px;" clearable v-model="lookuserdata.level"></el-input><span style="color:#999">（一次成功的交易积1点等级）</span>
      </el-form-item>
      <el-form-item label="金额提现状态：">
        <el-radio-group v-model="lookuserdata.txstatus">
          <el-radio :label="0">未提现</el-radio>
          <el-radio :label="1">提现中</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="集分宝提现状态：">
        <el-radio-group v-model="lookuserdata.tbtxstatus">
          <el-radio :label="0">未提现</el-radio>
          <el-radio :label="1">提现中</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item></el-form-item>
      <el-form-item>
        <!-- 保存按钮 -->
        <el-button type="success"  style="font-size:16px;letter-spacing: 3px;" @click="saveUserdata">保存</el-button>
      </el-form-item>
      <el-form-item></el-form-item>

      <el-form-item label="注册IP：">{{lookuserdata.regip}}</el-form-item>
      <el-form-item label="登录IP：">{{lookuserdata.logip}}</el-form-item>
      <el-form-item label="登录次数：">{{lookuserdata.loginnum}}</el-form-item>
      <el-form-item label="上次登录时间：">{{lookuserdata.lastlogintime}}</el-form-item>
      <el-form-item label="上次提现时间：">{{lookuserdata.lasttixian|parseTime}}</el-form-item>
      <el-form-item label="财付通：">{{lookuserdata.tenpay}}</el-form-item>
      <el-form-item label="集分宝总额：">{{lookuserdata.jifenbao}}</el-form-item>
      <el-form-item label="金钱总额：">{{lookuserdata.money}}</el-form-item>
      <el-form-item label="积分总额：">{{lookuserdata.jifen}}</el-form-item>
      <el-form-item label="账号类型：">
        <el-select class="item-choose" v-model="lookuserdata.type" size="small" style="width:240px;" clearable>
          <el-option v-for="item in zhlx" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="红心：">{{lookuserdata.hart}}</el-form-item>
      <el-form-item label="推荐人(已结束)：">{{lookuserdata.tjr_over}}</el-form-item>
      <el-form-item label="已提现金额：">{{lookuserdata.yitixian}}</el-form-item>
      <el-form-item label="已提现集分宝：">{{lookuserdata.tbyitixian}}</el-form-item>
      <el-form-item label="已兑换集分宝：">{{lookuserdata.ytx}}</el-form-item>
      <el-form-item label="已兑换积分：">{{lookuserdata.hytx}}</el-form-item>
      <el-form-item label="UCenter ID：">{{lookuserdata.ucid}}</el-form-item>
      <el-form-item label="上次签到时间：">{{lookuserdata.signtime|parseTime}}</el-form-item>
      <el-form-item label="签到次数：">{{lookuserdata.signnum}}</el-form-item>
      <el-form-item label="兑换状态：">
        <el-radio-group v-model="lookuserdata.dhstate">
          <el-radio :label="0">未兑换</el-radio>
          <el-radio :label="1">已兑换</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="激活：">
        <el-radio-group v-model="lookuserdata.jihuo">
          <el-radio :label="0">未激活</el-radio>
          <el-radio :label="1">已激活</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="淘宝商品网址搜索：">
        <el-radio-group v-model="lookuserdata.search">
          <el-radio :label="0">不允许</el-radio>
          <el-radio :label="1">允许</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </div>
</div>
</template>
<script>
import { fetchData,updateData } from '@/api/userlist'
import { parseTime, parseDate } from '@/utils'
const defaultForm = {
  id: undefined, lasttixian: 0, tjr:0, bank_name:'',
  ddpassword: '', alipay:'', tjr_over:0, bank_code:'',
  ddusername: '', email:'', mobile:'', trade_uid:'',
  realname: '', money:0, mobile_test:0, tbnick:'',
  regtime: 0, jifenbao:0, qq:'', signnum:0,
  regip: '', jifen:0, yitixian:0, type:0,
  logip: '', txstatus:0, ytx:0, jihuo:0,
  loginnum: 0,  dhstate:0, search:0,
  lastlogintime: 0, level:0, jihuo:0,
}

export default {
  name: 'LookUser',
  // 提供reload方法
  provide: function () {
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      LookUserShow: 'true',//显示当前的组件可视状态
      lookuserdata:Object.assign({}, defaultForm),
      ispassword:true,//用户密码修改的状态
      ddpassword:'',//用户密码
      istjrid:true,//推荐人id修改状态
      taobaodingdanshow:false,//淘宝订单/账号 隐藏
      userdata:null,//保存用户数据发的字段
      zhlx: [
        {value: 0,label: '普通会员'}, 
        {value: 1,label: '黄金会员'}, 
        {value: 2,label: '白金会员'}, 
        {value: 3,label: '钻石会员'}
      ],//注意后台传递数据类型（为number）
      isRouterAlive:true,//路由 状态
      isyitixian:true,//已经提现金额状态
      isyitixianjfb:true,//已经提现集分宝状态
      isucid:true,//UCid状态
    }
  },
  created() {
    const id = this.$route.params && this.$route.params.id
    this.fetchData(id)
  },
  methods: {
    fetchData(id) {
      fetchData(id).then(response => {
        this.lookuserdata = response.data
        this.lookuserdata.ddpassword = undefined
      }).catch(err => {
        console.log(err)
      })
    },
    xiugaipwd() {
      //修改密码，点击就切换为另一种状态
      this.ispassword = !this.ispassword;
    },
    taobaodingdansj(){
      //淘宝订单事件  绑定（点击切换淘宝订单号显示）
      this.taobaodingdanshow = !this.taobaodingdanshow
    },
    saveUserdata(){
      //更改用户数据
      this.resetUserdata()
      //console.log(this.userdata)
      //发送请求更新用户
      updateData(this.userdata, this.lookuserdata.id).then(res => {
        //console.log(res.data);
        this.$message({
          type: 'success',
          message: res.data.message
        });
        this.reload()
      })
    },
    resetUserdata(){
      this.userdata = {
        "type": this.lookuserdata.type,
        "level": this.lookuserdata.level,
        "txstatus": this.lookuserdata.txstatus,
        "tbtxstatus": this.lookuserdata.tbtxstatus,
        "dhstate": this.lookuserdata.dhstate,
        "jihuo": this.lookuserdata.jihuo,
        "search": this.lookuserdata.search,
      }
      //if(this.lookuserdata.mobile.length==11){
        this.userdata.mobile = this.lookuserdata.mobile
      //}
      //if(this.lookuserdata.email!=''){
        this.userdata.email = this.lookuserdata.email
      //}
      //if(this.lookuserdata.realname!=''){
        this.userdata.realname = this.lookuserdata.realname
      //}
      //if(this.lookuserdata.alipay!=''){
        this.userdata.alipay = this.lookuserdata.alipay
      //}
      //if(this.lookuserdata.qq!=''){
        this.userdata.qq = this.lookuserdata.qq
      //}
      //if(this.lookuserdata.bank_name!=''){
        this.userdata.bank_name = this.lookuserdata.bank_name
      //}
      //if(this.lookuserdata.bank_code!=''){
        this.userdata.bank_code = this.lookuserdata.bank_code
      //}
      //if(this.lookuserdata.tbnick!=''){
        this.userdata.tbnick = this.lookuserdata.tbnick
      //}
      if(this.ispassword == false && this.lookuserdata.ddpassword.length > 0){
        this.userdata.ddpassword = this.lookuserdata.ddpassword
      }
    },
    reload(){
      this.isRouterAlive = false
      this.$nextTick({
        function(){
          this.isRouterAlive = true
        }
      })
    }
  }
}
</script>
