<template>
    <div class="Rankdetail">
        <div class="back" @click='back'>
            <i class="iconfont icon-fanhui"></i>
        </div>
        <h1 class="title">{{dataparams.topTitle}}</h1>
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
        <div class="wrapper" id="rankdetailwrapper"  >
            <div class="content" @touchmove="touchscroll" ref="list" >
                <div class="songlist" >
                    <ul>
                        <li v-for="(item,index) in song"
                            :key='index'
                            @click.stop='playmusic(index)'
                        >
                            <div class="rank">{{index+1}}</div>
                            <div class="content">
                                <h2>{{item.songname}}</h2>
                                <p>{{item.name}}·{{item.albumname}}</p>
                            </div>
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
    name:'rankdetail',
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
            // console.log(this.dataparams)
            //https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&topid=26&needNewCode=1&uin=0&tpl=3&page=detail&type=top&platform=h5&jsonpCallback=jp12
            //https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&topid=4&needNewCode=1&uin=0&tpl=3&page=detail&type=top&platform=h5&jsonpCallback=jp11
            this.$jsonp('https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg',
                {g_tk:'1928093487',inCharset:'utf-8',outCharset:'utf-8',notice:'0',format:'jsonp',topid:this.dataparams.id,needNewCode:'1',uin:'0',tpl:'3',page:'detail',type:'top',platform:'h5',callbackQuery:'jsonpCallback'})
                .then(json=>{
                    // console.log(json)
                    this.normalsongList(json.songlist)//初始化歌单列表信息
                    this.normalPostParams(json.songlist)//初始化歌曲路径信息
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
                    albumname:item.data.albumname,
                    name:item.data.singer[0].name,
                    songname:item.data.songname,
                    mid:item.data.singer[0].mid,
                    songmid:item.data.songmid,
                    albummid:item.data.albummid,
                    interval:item.data.interval
                })
            })
            // console.log(arr)
            this.song = arr
        },
        normalPostParams(data){
            // console.log(data)
            let arr = data.map(item=>{
                return item.data.songmid
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
            let url = baseUrl + '/rankDetailsongurl';
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
        this.bgImage = this.$route.params.picUrl
        if( !this.$route.params.id ){//若在当前页面刷新页面，没有参数接收，自动返回上级页面
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

        this.scroll = new BScroll('#rankdetailwrapper',{
                probeType:3,
                click:true
            })
        this.scroll.on('scroll',this.touchscroll)
    }
}
</script>
<style lang="less" scoped>
@import '~style/index.less';
.Rankdetail{
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
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        .rank{
                            text-align: center;
                            font-size: 18px;
                            color:@font-color-header;
                            .w(25);

                        }
                        .content{
                            flex:1;
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
}
</style>

