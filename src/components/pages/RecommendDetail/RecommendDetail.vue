<template>
    <div class="recommenddetail">
        <div class="back" @click='back'>
            <i class="iconfont icon-fanhui"></i>
        </div>
        <h1 class="title">{{dataparams.dissname}}</h1>
        <div class="bg-img" :style="bgStyle" ref="bgImage">
            <div class="play-wrapper">
               <div class="play"  ref="playBtn" @click="suijiplay()" v-show="song.length">  <!-- v-show="songs.length" -->
                    <i class="icon-play"></i>
                    <span class="text">随机播放全部</span>
                </div>
            </div>
            <div class="filter" ref="filter"></div>
        </div>
        <div class="bg-layer" ref="layer"></div>
        <div class="wrapper" id="recommenddetailwrapper"  >
            <div class="content" @touchmove="touchscroll" ref="list" >
                <div class="songlist" >
                    <ul>
                        <li v-for="(item,index) in song"
                            :key='index'
                            @click.stop='playmusic(index)'
                        >
                            <h2>{{item.songname}}</h2>
                            <p>{{item.name}}·{{item.albumname}}</p>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import BScroll from 'better-scroll'
import {mapMutations} from 'vuex'
import baseUrl from '@/api'
export default {
    name:'recommenddetail',
    data(){
        return{
            scrollY:0,
            bgImage:'',
            RESERVED_HEIGHT:50,//顶部最小高度，可自行设置
            song:[]
        }
    },
    computed:{
        bgStyle() {
            return `background-image:url(${this.bgImage})`
        },
        dataparams(){
            return this.$route.params
        }
    },
    methods:{
        ...mapMutations(['addsonglist','showbigplayer','changeIndex']),
        playmusic(index){
            this.showbigplayer(index)
            this.addsonglist(this.song)
            
            // console.log(this.$store.state)
        },
        suijiplay(){
            this.showbigplayer()
            this.addsonglist(this.song)
            this.changeIndex('auto')
        },
        touchscroll(pos) {
            // console.log(pos)
            this.scrollY = pos.y
        },
        back(){
            this.$router.back()
        },
        initsingerdata(){
            // console.log(baseUrl)
            // console.log(this.dataparams)
            //http://ustbhuangyi.com/music/api/getCdInfo?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&disstid=4221060433&type=1&json=1&utf8=1&onlysong=0&platform=yqq&hostUin=0&needNewCode=0
            //http://ustbhuangyi.com/music/api/getCdInfo?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&disstid=6907009950&type=1&json=1&utf8=1&onlysong=0&platform=yqq&hostUin=0&needNewCode=0
            let url = baseUrl + '/recommendDetailList?dissid='+ this.dataparams.dissid
            //`/hy/music/api/getCdInfo?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&disstid=${this.dataparams.dissid}&type=1&json=1&utf8=1&onlysong=0&platform=yqq&hostUin=0&needNewCode=0`
            this.$axios.get(url)
                .then(json=>{
                    // console.log(json)
                    this.normalsongList(json.data.cdlist[0].songlist)
                    this.normalPostParams(json.data.cdlist[0].songlist)
                })
                .catch(err=>{
                    console.log(err)
                })
               
        },
        normalsongList(data){
            // console.log(data)
            let arr =[]
            data.forEach(item=>{
                arr.push({
                    albumname:item.albumname,
                    name:item.singer[0].name,
                    songname:item.songname,
                    mid:item.singer[0].mid,
                    songmid:item.songmid,
                    albummid:item.albummid,
                    interval:item.interval
                })
            })
            // console.log(arr)
            this.song = arr
        },
        normalPostParams(data){
            // console.log(data)
            let arr = data.map(item=>{
                return item.songmid
            })
            // console.log(arr)
            let brr = []
            arr.forEach(item=>{
                brr.push(0)
            })
            // console.log(brr)
            let objParams = {
                comm:{
                    format:"json",
                    g_tk:5381,
                    inCharset:"utf-8",
                    needNewCode:1,
                    notice:0,
                    outCharset:"utf-8",
                    platform:"h5",
                    uin:0
                },
                url_mid:{
                    method:"CgiGetVkey",
                    module:"vkey.GetVkeyServer",
                    param:{
                        guid:Date.now().toString(),
                        loginflag:0,
                        platform:"23",
                        songmid:arr,
                        songtype:brr,
                        uin:"0"

                    }
                }
            }
            // console.log(objParams)
            let url = baseUrl + '/recommendDetailsongurl';
            //'/hy/music/api/getPurlUrl'
            this.$axios.post(url,objParams)
                .then(data=>{
                    // console.log(data,this.song)
                    this.song.forEach((item,index)=>{
                        // console.log(item)
                        item.purl = data.data.data.url_mid.data.midurlinfo[index].purl
                    })
                })
                .catch(err=>{
                    console.log(err)
                })
        }
        
    },
    watch: {
    scrollY(newY) {
        // console.log(this.$refs)
      let translateY = Math.max(this.minTranslateY, newY)
      let zIndex = 0
      let scale = 1
      let blur = 0
      this.$refs.layer.style.transform = `translate3d(0,${translateY}px,0)`
      const percent = Math.abs(newY / this.imageHeight)

      if (newY > 0) {
        scale = 1 + percent
        zIndex = 10
      } else {
        blur = Math.min(20 * percent, 20)
      }

      this.$refs.filter.style.backdrop = `blur(${blur}px)`

      if (newY < this.minTranslateY) {
        zIndex = 10
        this.$refs.playBtn.style.display = 'none'
        this.$refs.bgImage.style.paddingTop = 0
        this.$refs.bgImage.style.height = `${this.RESERVED_HEIGHT}px`
      } else {
        this.$refs.playBtn.style.display = ''
        this.$refs.bgImage.style.paddingTop = '70%'
        this.$refs.bgImage.style.height = 0
      }
      this.$refs.bgImage.style.zIndex = zIndex
      this.$refs.bgImage.style.transform = `scale(${scale})`
      }
    },
    created(){
        // console.log(this.$route)
        this.bgImage = this.$route.params.imgurl
        if( !this.$route.params.dissid ){//若在当前页面刷新页面，没有参数接收，自动返回上级页面
            this.$router.go(-1)
        }
        this.initsingerdata()
    },
    mounted(){
        this.imageHeight = this.$refs.bgImage.clientHeight
        this.minTranslateY = -this.imageHeight + this.RESERVED_HEIGHT
        // console.log(this.imageHeight,this.minTranslateY,this.$refs.list)
        this.$refs.list.style.top = `${this.imageHeight}px`

        // console.log(this.$route,this.$refs)

        this.scroll = new BScroll('#recommenddetailwrapper',{
                probeType:3,
                click:true
            })
        this.scroll.on('scroll',this.touchscroll)
    }
}
</script>
<style lang="less" scoped>
@import '~style/index.less';
.recommenddetail{
    .w(375);
    position:fixed;
    .top(0);
    .left(0);
    .right(0);
    .bottom(0);
    z-index: 100;
    background:@bg-color;
    .back{
        position: absolute;
        .top(0);
        .left(6);
        z-index: 50;
        font-size: 16px;
        color: #fff;
        i{
            font-size: 24px;
            color:@font-color-header;
            display: block;
            .padding(5,5,5,5);
        }
    }
    .title{
        position:absolute;
        .top(0);
        left: 10%;
        z-index: 40;
        width: 80%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        text-align: center;
        .l_h(40);
        font-size: 18px;
        color:#fff;
        font-weight: 400;
    }
    .bg-img{
        .h(0);
        position: relative;
        width: 100%;
        padding-top:70%;
        transform-origin: top;
        background-size:cover;
        transform: scale(1);
        .play-wrapper{
            position:absolute;
            .bottom(20);
            z-index: 50;
            width: 100%;
            .play{
                box-sizing: border-box;
                .w(135);
                .padding(7,0,7,0);
                font-size: 0;
                margin: 0 auto;
                text-align: center;
                border:1px solid @font-color-header;
                border-radius: 100px;
                .text{
                    font-size: @font-size-s;
                    color:@font-color-header;
                }
            }
        }
        .filter{
            position: absolute;
            left: 0;
            top:0;
            width:100%;
            height: 100%;
            background:rgba(7,17,27,0.4)
        }
    }
    .bg-layer{
        position: relative;
        height: 100%;
        background:@bg-color;
    }
    .wrapper{
        position: absolute;
        width: 100%;
        .top(263);
        .bottom(0);
        // .bug(red);
        .content{
            .padding(20,30,30,20)
        }
        .content{
            .songlist{
                ul{
                    li{
                        list-style: none;
                        .h(64);
                        h2{
                            color: #fff;
                            font-weight: 400;
                            font-size: @font-size-ms;
                        }
                        p{
                            font-size: @font-size-ms;
                            color:@font-color-ranklist;
                            .margin(4,0,0,0)
                        }
                    }
                }
            }
        }
    }
}
</style>

