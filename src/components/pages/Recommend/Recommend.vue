<template>
  <div>
    <div class="wrapper" ref="wrapper">
      <div class="content">
        <div class="banner">
          <Banner></Banner>  
        </div>
        <h4>热门歌单推荐</h4>
        <ul class='recomList'>
          <li  :key='index' v-for='(item,index) in list' @click="gotoRecommendDetail(item)">
            <div class='icon'>
              <img width='60' height='60' v-lazy='item.imgurl' alt="">
            </div>
            <div class='text'>
              <p class='name'>{{item.creator.name}}</p>
              <p class='diss'>{{item.dissname}}</p>
            </div>
          </li>
        </ul>
        <!-- 这里可以放一些其它的 DOM，但不会影响滚动 -->
      </div>
    </div>
    <transition name="rightmove">
      <router-view></router-view>
    </transition>
  </div>  
</template>

<script>
  import BScroll from 'better-scroll'
  import Banner from '../../common/banner/banner'
  import baseUrl from '@/api'
    export default {
      name: "Recommend",
      data(){
          return{
            list:[]
          }
        },
      components:{Banner},
      methods:{
        gotoRecommendDetail(data){
          // console.log("111",data)
          this.$router.push({name:'recommendDetail',params:data})
        }
      },
      created(){
          // console.log(baseUrl)
          let url = baseUrl + '/getrecommend'
          // console.log(url)
          //let url = '/hy/music/api/getDiscList?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=json&platform=yqq&hostUin=0&sin=0&ein=29&sortId=5&needNewCode=0&categoryId=10000000&rnd=0.3920376084015764'
          this.$axios.get(url)
            .then((response)=>{
              this.list = response.data.data.list;
              // console.log(response.data.data.list)
            })
            .catch((err)=>{
              console.log(err)
            })
      },
      mounted(){
        // console.log(this.$refs)
        let elobj=this.$refs.wrapper
        new BScroll(elobj,{click:true})
      }
    }
</script>

<style lang="less" scoped>
@import "~style/index.less";
.rightmove-enter{
    transform: translateX(100%);
    opacity:1;
}
.rightmove.leave{
    transform: translateX(0%);
    opacity: 0;
}
.rightmove-enter-active{
    transition:.2s ease-out;
}
.rightmove-leave-active{
    opacity:0;
    transition: opacity .5s;
}
  .wrapper{
    .banner{
      .w(375);
      .h(150);
      background:#fff
    }
    h4{
      color:@font-color-header;
      font-size: @font-size-ms;
      text-align: center;
      .h(65);
      .l_h(65);
      font-weight: normal;
    }
    position:fixed;
    .top(88);
    .left(0);
    .bottom(0);
    .right(0);
    color:#fff;
    overflow: hidden;
    .recomList {
      li {
        .padding(0, 20, 20, 20);
        display: flex;
        font-size: @font-size-m;
        .icon {
          .padding(0, 20, 0, 0);
        }
        .name {
          color: @font-color-item;
          // .bug(red);
          .padding(10, 0, 5, 0);
        }
        .diss {
          font-size: @font-size-s;
          color: @font-color-tab;
          // .bug(red);
        }
      }
    }
  }
</style>
