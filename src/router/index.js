import Vue from 'vue'
import Router from 'vue-router'

import Recomment from '@/components/pages/Recommend/Recommend'
import Rank from '@/components/pages/Rank/Rank'
import Search from '@/components/pages/Search/Search'
import Singer from '@/components/pages/Singer/Singer'
import Home from '@/components/pages/Home/home'
import Detail from '@/components/pages/Detail/detail'
import NotFound from '@/components/pages/NotFound/notfound'
import SingerDetail from '@/components/pages/singerDetail/singerDetail'
import RecommendDetail from '@/components/pages/RecommendDetail/RecommendDetail'
import RankDetail from '@/components/pages/RankDetail/RankDetail'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path:'/home',
      name:'home',
      component:Home,
      children:[{path:"recommend",name:'recommend',component:Recomment,
                 children:[{path:'recommendDetail',name:'recommendDetail',component:RecommendDetail}]},
                {path:"rank",name:'rank',component:Rank,
                 children:[{path:'rankDetail',name:'rankDetail',component:RankDetail}]
              },
                {path:"search",name:'search',component:Search},
                {path:"singer",name:'singer',component:Singer,
                 children:[{path:'singerDetail',name:'singerDetail',component:SingerDetail}]
              }]
    },
    {
      path:'/detail',
      name:'detail',
      component:Detail
    },
    {
      path: '/',
      redirect: '/home/recommend'
    },
    {
      path:'**',
      name:'notfound',
      component:NotFound
    }
  ]
})

