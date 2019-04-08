<template>
    <div class="wrapper">
      <mt-search
        cancel-text=""
        placeholder="搜索"
        v-model="searchval"
        @keyup.enter.native="getsonglist(searchval)"
      >
      </mt-search>
      <div class="searchwrapper" id="searchwrapper">
        <div class="content">
            <ul
                v-infinite-scroll="loadMore"
                infinite-scroll-disabled="loading"
                infinite-scroll-distance="10"
                v-if="searchval.length"
                class="searchul">
                <li v-for="(item,index) in song" :key='index' @click="playmusic(index)" class="searchli">{{ item.songname }}-{{item.name}}</li>
            </ul>
        </div>
      </div>
    </div>
</template>

<script>
import BScroll from 'better-scroll';
import { Search,InfiniteScroll } from 'mint-ui';
import {mapMutations} from 'vuex'
import baseUrl from '@/api'
    export default {
        name: "Search",
        directives:{InfiniteScroll},
        data(){
            return {
                searchval:'',
                song:[],
                loadingpage:1
            }
        },
        methods:{
            ...mapMutations(['addsonglist','showbigplayer','changeIndex']),
            playmusic(index){
                // console.log("index")
                this.showbigplayer(index)
                this.addsonglist(this.song)
            
            // console.log(this.$store.state)
            },
            loadMore() {
                let page = this.loadingpage + 1;
                this.loading = true;
                // setTimeout(() => {
                //     let last = this.song[this.song.length - 1];
                //     for (let i = 1; i <= 10; i++) {
                //     this.song.push(last + i);
                //     }
                //     this.loading = false;
                // }, 2500);

            },
            getsonglist(searchval){
                // console.log(searchval)
                this.initsongdata(searchval)
                //document.activeElement.blur();
            },
            initsongdata(val){
            // console.log(this.dataparams)
            //http://ustbhuangyi.com/music/api/search?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=json&w=%E6%92%92&p=2&perpage=20&n=20&catZhida=1&zhidaqu=1&t=0&flag=1&ie=utf-8&sem=1&aggr=0&remoteplace=txt.mqq.all&uin=0&needNewCode=1&platform=h5
            //http://ustbhuangyi.com/music/api/search?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=json&w=%E6%92%92&p=1&perpage=20&n=20&catZhida=1&zhidaqu=1&t=0&flag=1&ie=utf-8&sem=1&aggr=0&remoteplace=txt.mqq.all&uin=0&needNewCode=1&platform=h5
            let url = baseUrl + '/getsearchlist?val=' + val;
            //`/hy/music/api/search?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=json&w=${val}&p=1&perpage=20&n=20&catZhida=1&zhidaqu=1&t=0&flag=1&ie=utf-8&sem=1&aggr=0&remoteplace=txt.mqq.all&uin=0&needNewCode=1&platform=h5`
            this.$axios.get(url)
                .then(json=>{
                    // console.log(json.data.data.song.list)
                    this.normalsongList(json.data.data.song.list)//初始化歌单列表信息
                    this.normalPostParams(json.data.data.song.list)//初始化歌曲路径信息
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
                this.song = arr;
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
                let url = baseUrl + '/searchsongurl';
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
        mounted(){
            this.scroll = new BScroll('#searchwrapper',{
                probeType:3,
                click:true
            })
        }
    }
</script>

<style lang='less' scope>
@import '~style/index.less';

.wrapper{
    .w(375);
    position:fixed;
    .top(88);
    .left(0);
    .right(0);
    .bottom(0);
    .searchul{
        .padding(0,20,0,20);
        display:flex;
        flex-direction: column;
        overflow-y: scroll;
        .searchli{
            list-style: none;
            .padding(0,0,20,0);
            color:@font-color-ranklist;
            font-size: @font-size-s;
        }
    }
    .mint-search{
        height:auto;
        .mint-searchbar{
            background: @bg-color;
            .mint-searchbar-inner{
                background:@bg-color-title;
                input{
                    background:@bg-color-title;
                    color: #fff;
                }
                .mintui-search{
                    color: @bg-color;
                }
            }
        }
        .mint-search-list{
            height: 0;
        }
    }
    .searchwrapper{
        position:absolute;
        width: 100%;
        .top(60);
        .bottom(0);
        overflow: hidden;
    }
}
</style>
