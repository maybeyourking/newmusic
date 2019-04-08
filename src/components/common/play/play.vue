<template>
    <div class="play" v-if="playList.length">
        <transition name="move">
            <div class="normalscreen" v-show="this.bigplayer">
                <div class="bg-filter">
                    <img :src="currentSong.albumimg">
                </div>
                <div class="top">
                    <div class="back iconfont icon-bofangqizhankai" @click='showback'></div>
                    <h1>{{currentSong.songname}}</h1>
                    <h2>{{currentSong.name}}</h2>
                </div>
                <div class="middle">
                    <div class="middle-left">
                        <div class="cd-wrapper">
                            <div class="cd" :class="this.autoplayFlag?'movezhuan':'movezhuan pausezhuan'">
                                <img :src="currentSong.albumimg">
                            </div>
                        </div>
                        <div class="playing-lyric-wrapper">
                            <div class="playing-lyric" v-html="lyricArr[nowLyricLine].txt">{{lyricArr[nowLyricLine].txt}}</div>
                        </div>
                    </div>
                </div>
                <div class="bottom">
                    <div class="dot-wrapper">
                        <span class="dot dot-active"></span>
                        <span class="dot"></span>
                    </div>
                    <div class="progress-wrapper">
                        <span class="progress-t">{{nowPlayTime}}</span>
                        <el-slider class="movebox" v-model="moveTag" @change="touchmovechang" style="flex:1"></el-slider>
                        <span class="progress-t">{{currentSong.endTime}}</span>
                    </div>
                    <div class="operators">
                        <div :class="modelclass" @click='changemodel()'></div>
                        <div class="operators-i iconfont icon-bofangqi_shouyeshangyishou_" @click="changeIndex('prev')"></div>
                        <div :class="autoplayFlag?'operators-i iconfont icon-zanting':'operators-i iconfont icon-bofang'" @click="playMusic"></div>
                        <div class="operators-i iconfont icon-bofangqi_shouyexiayishou_" @click="changeIndex('next')"></div>
                        <div class="operators-i iconfont icon-bofangqishoucang32" @click="likemusic()"></div>
                    </div>
                </div>
            </div>
        </transition>
        <div class="smallplay" v-show="!this.bigplayer" @click="showback">
            <div class="icon">
                <div class="imgwraper">
                    <div class="cd" :class="this.autoplayFlag?'movezhuan':'movezhuan pausezhuan'">
                        <img :src="currentSong.albumimg">
                    </div>
                </div>
            </div>
            <div class="text">
                <h2>{{currentSong.songname}}</h2>
                <p>{{currentSong.name}}</p>
            </div>
            <div class="control">
                <div :class="autoplayFlag?'operators-small iconfont icon-zanting':'operators-small iconfont icon-bofang'" @click.stop="playMusic"></div>
            </div>
            <div class="control" @click.stop="playersmallcontrol()">
                <i class="iconfont icon-bofangqi_shouyegequliebiao_"></i>
            </div>
        </div>
        <audio :src="currentSong.songUrl" style="position:fixed;top:100px;left:50px;z-index:200"
                @timeupdate="updateTime"
                ref="audio"

        ></audio>
    </div>
</template>
<script>
import {mapState,mapMutations,mapGetters} from 'vuex'
import {Base64} from 'js-base64'
import Lyric from 'lyric-parser'
import { Toast } from 'mint-ui'
import baseUrl from '@/api'
export default {
    name:'play',
    data(){
        return {
            nowPlayTime:"0:00",
            moveTag:0,
            nowLyricLine:0,//当前歌词行数
            lyricArr:[{txt:''}],
            autoplayFlag:true,
            playmodel:'列表',
            modelclass:"operators-i iconfont icon-bofangqi_shouyeliebiaoxunhuan_"
        }
    },
    computed:{
        ...mapGetters(['currentSong']),
        ...mapState({
            playList:state=>state.play.playList,
            bigplayer:state=>state.play.bigplayer,
            // playIndex:state=>state.play.playIndex
        })
    },
    methods:{
        ...mapMutations(['showbigplayer','changeIndex']),
        showback(){
            this.showbigplayer()
        },
        likemusic(){
            Toast('该功能暂未开放')
        },
        playersmallcontrol(){
            Toast('该功能暂未开放')
        },
        changemodel(){
            switch (this.playmodel) {
                case '列表':
                    this.playmodel = '单曲'
                    this.modelclass = "operators-i iconfont icon-bofangqi_shouyedanquxunhuan_"
                    Toast('当前为单曲循环模式')
                    break;
                case '单曲':
                    this.playmodel = '随机'
                    this.modelclass = "operators-i iconfont icon-bofangqi_shouyesuijibofang"
                    Toast('当前为列表随机模式')
                    break;
                case '随机':
                    this.playmodel = '列表'
                    this.modelclass = "operators-i iconfont icon-bofangqi_shouyeliebiaoxunhuan_"
                    Toast('当前为列表顺序模式')
                    break;
                default:
                    break;
            }
        },
        updateTime(e){
            // console.log(e.srcElement.currentTime,this.currentSong.interval)
            let time = parseInt(e.srcElement.currentTime)
            let middle = 0
            if(time>60){
                middle = parseInt(time/60)
                time = parseInt(time%60)
            }
            if(time<10){
                time = "0"+time
            }
            this.nowPlayTime= ""+middle+":"+time

            let moveTag = e.srcElement.currentTime/this.currentSong.interval*100
            if(moveTag >= 100){
                moveTag = 100
                this.autoplayFlag = false
            }
            // console.log(moveTag)
            this.moveTag = moveTag
            // console.log(e.srcElement.currentTime,this.currentSong.interval)
            if(e.srcElement.currentTime >= this.currentSong.interval ){//若歌曲播放完毕
                switch (this.playmodel) {//判断播放模式
                    case '单曲': this.loopmodle()
                        
                        break;
                    case '列表': 
                            this.changeIndex('next')
                        break;
                    case '随机':
                            this.changeIndex('auto')
                        break;
                    default:
                         if(this.$refs.audio){
                             this.$refs.audio.stop()
                         }
                        break;
                }
            }
        },
        loopmodle(){//循环模式
            let audio = this.$refs.audio
            audio.currentTime = 0
            audio.play()
            if( this.lyricObj ){
                this.lyricObj.seek(0)
            }
            this.autoplayFlag = true
        },
        playMusic(){
            // console.log(this.$refs)
            let audio = this.$refs.audio;
            if(audio.paused){
                audio.play();
                // console.log(this.lyricObj)
                if(this.nowLyricLine == (this.lyricObj.lines.length-1)){//若当前歌曲播放完毕，重新开歌词播放
                    this.lyricObj.play()
                    this.autoplayFlag = !this.autoplayFlag
                }else{   
                    this.lyricObj.togglePlay();//togglePlay方法为歌词暂停/播放切换方法
                    this.autoplayFlag = !this.autoplayFlag
                }  
            }else{
                audio.pause();
                this.lyricObj.togglePlay();
                this.autoplayFlag = !this.autoplayFlag
            }
        },
        touchmovechang(val){//val为滑块组件默认接受的参数 百分比
            // console.log(val)
            let audio = this.$refs.audio
            let time = this.currentSong.interval * (val/100)//滑块抬起后的时间
            
            audio.currentTime = time//设置当前播放时间
            
            this.lyricObj.seek(this.$refs.audio.currentTime*1000)//设置当前播放歌词
        }
    },
    watch:{
        currentSong(newSong,oldSong){
             this.autoplayFlag = true;//每切换一首歌专辑旋转
            if(this.lyricObj){//停止上首歌歌词的播放
                this.lyricObj.stop()
            }
            // console.log('触发watch',newSong,oldSong)
            let timeFlag = Date.now()
            // console.log(timeFlag)
            let url = baseUrl + '/getlyric?songmid='+ newSong.songmid + '&pcachetime=' + timeFlag;
            //let url = `/hy/music/api/lyric?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=json&songmid=${newSong.songmid}&platform=yqq&hostUin=0&needNewCode=0&categoryId=10000000&pcachetime=${timeFlag}`
            this.$axios.get(url)
                .then(data=>{
                    // console.log(data.data.lyric)
                    let lyricText = Base64.decode(data.data.lyric)
                    // console.log(lyricText)
                    this.lyricObj = new Lyric(lyricText,data=>{
                        // console.log('歌词播放',data)
                        this.nowLyricLine = data.lineNum
                    })
                    this.lyricArr = this.lyricObj.lines
                    // console.log(this.lyricObj)
                    
                    // this.playMusic()
                    this.$refs.audio.play()//获取歌词后调用音乐播放
                    // console.log( this.$refs)
                    if(this.$refs.audio.error == null){//若音乐可以播放，调用歌词播放
                        this.lyricObj.play()
                        
                    }else{//若歌曲播放失败
                        this.lyricArr=[{txt:'解析歌曲出错'}]
                        this.autoplayFlag=false
                    }
                   
                    
                })
                .catch(err=>{
                    console.log(err)
                })
            
            
            
        }
    },
    updated(){
        // console.log(this.currentSong)
        // console.log(this.$refs.audio.currentTime)
    }
}
</script>


<style lang="less" scoped>
@import '~style/index.less';
.movezhuan{//旋转类
    animation:zhuan 30s linear infinite;
};
.pausezhuan{//旋转同时暂停动画
    animation-play-state: paused;
};
@keyframes zhuan{//旋转动画
    from{transform: rotate(0deg)};
    to{transform: rotate(360deg)}
};
.move-enter{
    transform: translateY(100%);
    opacity:1;
}
.move.leave{
    transform: translateY(0%);
    opacity: 0;
}
.move-enter-active{
    transition:.2s ease-out;
}
.move-leave-active{
    opacity:0;
    transition: opacity .5s;
}

.normalscreen{
    .w(375);
    position:fixed;
    .top(0);
    .bottom(0);
    background:@bg-color;
    z-index: 150;
    .bg-filter{
        .w(375);
        position:fixed;
        .top(0);
        .bottom(0);
        z-index: -1;
        filter: blur(20px);
        opacity: 0.6;
        img{
            width:100%;
            height: 100%;
        }
    }
    .top{
        .back{
            position: absolute;
            top:0;
            .left(6);
            z-index: 50;
            color:@font-color-header;
            font-size:36px;
        }
        h1{
            width: 70%;
            .l_h(40);
            margin:0 auto;
            text-align: center;
            color:#fff;
            font-size:18px;
            font-weight: 400;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;

        }
        h2{
            .l_h(20);
            text-align: center;
            font-size:@font-size-ms;
            font-weight: 400;
            color:#fff;
        }
    }
    .middle{
        position:fixed;
        width: 100%;
        .top(80);
        .bottom(170);
        .middle-left{
            width: 100%;
            height: 0;
            padding-top:80%;
            .cd-wrapper{
                position: absolute;
                left:10%;
                top:0;
                width: 80%;
                .cd{
                    width: 100%;
                    height:100%;
                    border-radius:50%;
                    img{
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                        box-sizing: border-box;
                        border:10px solid rgba(255,255,255,0.1)
                    }
                }
            }
            .playing-lyric-wrapper{
                width: 80%;
                margin:0.8rem auto 0;
                .playing-lyric{
                    .h(20);
                    .l_h(20);
                    font-size: @font-size-ms;
                    color:@font-color-tab;
                    text-align: center;
                }
            }
        }
    }
    .bottom{
        width:100%;
        position:absolute;
        .bottom(15);
        .dot-wrapper{
            text-align: center;
            font-size: 0;
            .dot{
                display:inline-block;
                vertical-align: middle;
                margin:0 4px;
                .w(8);
                .h(8);
                border-radius: 50%;
                background:@font-color-tab;
            }
            .dot-active{
                .w(20);
                border-radius: 5px;
                background:rgba(255,255,255,0.8)
            }
        }
        .progress-wrapper{
            width: 80%;
            .h(30);
            margin:0 auto;
            .padding(10,0,10,0);
            display: flex;
            justify-content: center;
            align-items: center;
           .progress-t{
               font-size: @font-size-s;
               .l_h(30);
               color:#fff;
               .w(30);
               text-align: center
           }
           .movebox{
               .margin(0,10,0,10)
           }
        }
        .operators{
            display: flex;
            align-items: center;
            justify-content: center;
            -webkit-tap-highlight-color: transparent;
            .operators-i{
                flex:1;
                text-align: center;
                font-size: 40px;
                color:@font-color-header;
            }
        }
    }
}
.smallplay{
    position:fixed;
    left: 0;
    bottom:0;
    z-index:180;
    .h(60);
    .w(375);
    background:@bg-color-title;
    display:flex;
    justify-content: center;
    align-items: center;
    .icon{
        .imgwraper{
            width: 40px;
            height:40px;
            .margin(0,10,0,20);
            .cd{
                img{
                    width: 100%;
                    height:100%;
                    border-radius: 50%;
                }
            }
        }
    }
    .text{
        flex:1;
        h2{
            font-size: @font-size-ms;
            color: #fff;
            margin-bottom:2px;
        };
        p{
            font-size: @font-size-s;
            color:@font-color-ranklist;
        }
    }
    .control{
        .operators-small{
            font-size: 34px;
            color:@font-color-header;
            margin-right: 5px;
        }
        i{
            font-size: 46px;
            color:@font-color-header;
        }
    }
}
</style>

<style lang="less">
@import '~style/index.less';
 .el-progress-bar__outer{
    background: rgba(0,0,0,0.3);
    .h(4) !important;
}
</style>