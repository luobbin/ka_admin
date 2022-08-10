import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'
export const aaaddd =store.getters

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true, common:1 },
  { path: '/404', component: () => import('@/views/404'), hidden: true, common:1 },
  //首页
  {
    path: '/',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '后台首页', icon: 'dashboard', noCache: true }
      },
      {
        path: 'password',
        name: 'password',
        component: () => import('@/views/dashboard/password'),
        meta: { title: '修改密码', icon: 'edit', noCache: true },
        hidden: true
      }
    ],
    common:1
  },
  //首页设置
  {
    path: '/homeset',
    component: Layout,
    redirect: '/homeset/index',
    name: 'homeset',
    meta: { title: '首页设置', icon: 'nested'},
    children: [
      {
        path: 'heads',
        name: 'heads',
        component: () => import('@/views/homeset/heads'),
        meta: { title: '顶部视频', icon: 'nested', noCache: true }
      },
      {
        path: 'slider',
        name: 'slider',
        component: () => import('@/views/homeset/slider'),
        meta: { title: '项目案例banner', icon: 'nested', noCache: true }
      },
      {
        path: 'videos',
        name: 'videos',
        component: () => import('@/views/homeset/videos'),
        meta: { title: '视频展示', icon: 'nested', noCache: true }
      },
      {
        path: 'news',
        name: 'news',
        component: () => import('@/views/homeset/news'),
        meta: { title: '新闻动态', icon: 'nested', noCache: true }
      },
      {
        path: 'logos',
        name: 'logos',
        component: () => import('@/views/homeset/logos'),
        meta: { title: 'LOGO墙', icon: 'nested', noCache: true }
      },

    ],
    common:1
  },
  //商品管理
  {
    path: '/products',
    component: Layout,
    redirect: '/products/product-list',
    name: 'products',
    meta: { title: '产品品管理', icon: 'shoppingCard'},
    children: [
      {
        path: 'product-list',
        name: 'product-list',
        component: () => import('@/views/products/product/index'),
        meta: { title: '产品列表', icon: 'shoppingCard', noCache: true }
      },
      {
        path: 'product-create',
        name: 'product-create',
        component: () => import('@/views/products/product/create'),
        meta: { title: '添加商品', noCache: true },
        hidden: true
      },
      {
        path: 'product-edit/:id(\\d+)',
        name: 'product-edit',
        component: () => import('@/views/products/product/edit'),
        meta: { title: '编辑商品', noCache: true },
        hidden: true
      },
      {
        path: 'product-cate',
        name: 'product-cate',
        component: () => import('@/views/products/productCate/index'),
        meta: { title: '产品分类', icon: 'shoppingCard', noCache: true },
      },
      {
        path: 'product-cate-create',
        name: 'product-cate-create',
        component: () => import('@/views/products/productCate/create'),
        meta: { title: '添加分类', noCache: true },
        hidden: true
      },
      {
        path: 'product-cate-edit/:id(\\d+)',
        name: 'product-cate-edit',
        component: () => import('@/views/products/productCate/edit'),
        meta: { title: '编辑分类', noCache: true },
        hidden: true
      },
    ],
    common:1
  },
  //案例管理
  {
    path: '/cases',
    component: Layout,
    redirect: '/cases/case-list',
    name: 'Cases',
    meta: { title: '案例管理', icon: 'excel' },
    children: [
      {
        path: 'case-list',
        name: 'case-list',
        component: () => import('@/views/cases/case/index'),
        meta: { title: '案例列表', icon: 'table' }
      },
      {
        path: 'case-create',
        name: 'case-create',
        component: () => import('@/views/cases/case/create'),
        meta: { title: '添加案例', noCache: true },
        hidden: true
      },
      {
        path: 'case-edit/:id(\\d+)',
        name: 'case-edit',
        component: () => import('@/views/cases/case/edit'),
        meta: { title: '编辑案例', noCache: true },
        hidden: true
      },
      {
        path: 'case-cate',
        name: 'case-cate',
        component: () => import('@/views/cases/caseCate/index'),
        meta: { title: '案例分类', icon: 'tree' }
      }
    ],
    common:1
  },
  //文章管理
  {
    path: '/articles',
    component: Layout,
    redirect: '/articles/article-list',
    name: 'Articles',
    meta: { title: '新闻管理', icon: 'form' },
    children: [
      {
        path: 'article-list',
        name: 'article-list',
        component: () => import('@/views/articles/article/index'),
        meta: { title: '新闻列表', icon: 'table' }
      },
      {
        path: 'article-create',
        name: 'article-create',
        component: () => import('@/views/articles/article/create'),
        meta: { title: '添加新闻', noCache: true },
        hidden: true
      },
      {
        path: 'article-edit/:id(\\d+)',
        name: 'article-edit',
        component: () => import('@/views/articles/article/edit'),
        meta: { title: '编辑新闻', noCache: true },
        hidden: true
      },
      {
        path: 'article-cate',
        name: 'article-cate',
        component: () => import('@/views/articles/articleCate/index'),
        meta: { title: '新闻栏目', icon: '' }
      }
    ],
    common:1
  },
  // 招聘管理
  {
    path: '/jobs',
    component: Layout,
    redirect: '/jobs/job-list',
    name: 'Jobs',
    meta: { title: '招聘管理', icon: 'table' },
    children: [
      {
        path: 'job-list',
        name: 'job-list',
        component: () => import('@/views/jobs/job/index'),
        meta: { title: '招聘管理', icon: 'tree' }
      },
      {
        path: 'job-create',
        name: 'job-create',
        component: () => import('@/views/jobs/job/create'),
        meta: { title: '添加信息', noCache: true },
        hidden: true
      },
      {
        path: 'job-edit/:id(\\d+)',
        name: 'job-edit',
        component: () => import('@/views/jobs/job/edit'),
        meta: { title: '编辑信息', noCache: true },
        hidden: true
      }
    ],
    common:1
  },
  //其他设置
  {
    path: '/webset',
    component: Layout,
    redirect: '/webset/setting',
    name: 'Webset',
    meta: { title: '其他设置', icon: 'guide'},
    children: [
      {
        path: 'news-list',
        name: 'news-list',
        component: () => import('@/views/webset/index'),
        meta: { title: '专题管理', icon: 'guide', noCache: true }
      },
      {
        path: 'setting',
        name: 'setting',
        component: () => import('@/views/webset/setting'),
        meta: { title: '系统设置', icon: 'guide', noCache: true }
      },
      {
        path: 'news-create',
        name: 'news-create',
        component: () => import('@/views/webset/create'),
        meta: { title: '添加页面', noCache: true },
        hidden: true
      },
      {
        path: 'news-edit/:id(\\d+)',
        name: 'news-edit',
        component: () => import('@/views/webset/edit'),
        meta: { title: '编辑页面', noCache: true },
        hidden: true
      }
    ],
    common: 1
  },
  {
    path: '/form',
    component: Layout,
    redirect: '/form',
    name: 'form',
    meta: { title: '到底部别点了', icon: 'form' },
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/form/index'),
        meta: { title: '到底部别点了', icon: 'example' }
      }
    ],
    common:1
  },

  { path: '*', redirect: '/404', hidden: true, common:1 }
]

var aaaaaa=[]
constantRouterMap.map(function(val,index){
  if(val.common==0){
    let cateTemp = []
    let cateNum = 0
    val.children.map(function(cate,key){
      if(cate.hidden==undefined && store.getters.navs!=undefined){
        if(isInArray(store.getters.navs.split(","),cate.name)==true){
          cateTemp.push(cate)
          cateNum ++
        }
      }else{
        cateTemp.push(cate)
      }
    })
    val.children = cateTemp
    if(cateNum>0){
      aaaaaa.push(val)
    }
  }else{
      aaaaaa.push(val)
  }
})

//const aaaaaa = constantRouterMap

export default new Router({
  mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

/**
 * 使用循环的方式判断一个元素是否存在于一个数组中
 * @param {Object} arr 数组
 * @param {Object} value 元素值
 */
function isInArray(arr,value){
  for(var i = 0; i < arr.length; i++){
    if(value == arr[i]){
      return true
    }
  }
  return false
}
