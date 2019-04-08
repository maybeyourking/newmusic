const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const app = express();
// app.use(
// 	bodyParser.urlencoded({
// 		extended: false // 是否为深度解析。true 深度，false 非深度
// 	})
// ); // 接收的是urlencode格式，然后将得到的数据放到req.body
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.all('*', function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type');
	res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
	res.header('X-Powered-By', ' 3.2.1');
	// res.header('Content-Type', 'application/json;charset=utf-8');
	next();
});

app.get('/getrecommend',(req,res)=>{
    let url = 'http://ustbhuangyi.com/music/api/getDiscList?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=json&platform=yqq&hostUin=0&sin=0&ein=29&sortId=5&needNewCode=0&categoryId=10000000&rnd=0.3920376084015764'

    request( url ,function(err,responseText,body){
        if( !err && responseText.statusCode == 200 ){
            let data = JSON.parse(body)
            // console.log(data)
            res.json(data)
        }else{
            res.json({
                ok:-1,
                msg:'recommendlist请求错误'
            })
        }
    } )
})
app.get('/recommendDetailList',(req,res)=>{
    // console.log(req.query.disstid);
    let dissid = req.query.dissid;
    let url = `http://ustbhuangyi.com/music/api/getCdInfo?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&disstid=${dissid}&type=1&json=1&utf8=1&onlysong=0&platform=yqq&hostUin=0&needNewCode=0`;
    request( url ,function(err,responseText,body){
        if( !err && responseText.statusCode == 200 ){
            let data = JSON.parse(body)
            // console.log(data)
            res.json(data)
        }else{
            res.json({
                ok:-1,
                msg:'recommendDetailList请求错误'
            })
        }
    } )
})
app.post('/recommendDetailsongurl',(req,res)=>{
    // console.log(req.body.comm)
    let url = 'http://ustbhuangyi.com/music/api/getPurlUrl'
    let objParams = req.body;
    request({url:url,method:'POST',json:true,body:objParams},(error,responseText,data)=>{
        if (!error && responseText.statusCode == 200) {
			// console.log(data);
			res.json({
				data
			});
		}
    })
})
app.post('/singerDetailsongurl',(req,res)=>{
    // console.log(req.body.comm)
    let url = 'http://ustbhuangyi.com/music/api/getPurlUrl'
    let objParams = req.body;
    request({url:url,method:'POST',json:true,body:objParams},(error,responseText,data)=>{
        if (!error && responseText.statusCode == 200) {
			// console.log(data);
			res.json({
				data
			});
		}
    })
})
app.post('/rankDetailsongurl',(req,res)=>{
    // console.log(req.body.comm)
    let url = 'http://ustbhuangyi.com/music/api/getPurlUrl'
    let objParams = req.body;
    request({url:url,method:'POST',json:true,body:objParams},(error,responseText,data)=>{
        if (!error && responseText.statusCode == 200) {
			// console.log(data);
			res.json({
				data
			});
		}
    })
})
app.get('/getsearchlist',(req,res)=>{
    // console.log(req.query.val)
    let val = encodeURI(req.query.val);//接收中文参数记得用encodeURI()转码
    // console.log(val)
    let url = `http://ustbhuangyi.com/music/api/search?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=json&w=${val}&p=1&perpage=20&n=20&catZhida=1&zhidaqu=1&t=0&flag=1&ie=utf-8&sem=1&aggr=0&remoteplace=txt.mqq.all&uin=0&needNewCode=1&platform=h5`;
    request( url  ,function(err,responseText,body){
        // console.log(err,responseText,body)
        if( !err && responseText.statusCode == 200 ){
            let data = JSON.parse(body)
            // console.log(data)
            res.json(data)
        }else{
            res.json({
                ok:-1,
                msg:'searchlist请求错误'
            })
        }
    } )
})
app.post('/searchsongurl',(req,res)=>{
    let url = 'http://ustbhuangyi.com/music/api/getPurlUrl'
    let objParams = req.body;
    request({url:url,method:'POST',json:true,body:objParams},(error,responseText,data)=>{
        if (!error && responseText.statusCode == 200) {
			// console.log(data);
			res.json({
				data
			});
		}
    })
})
app.get('/getlyric',(req,res)=>{
    // console.log(req.query);
    let songmid = req.query.songmid;
    let pcachetime = req.query.pcachetime;
    let url = `http://ustbhuangyi.com/music/api/lyric?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=json&songmid=${songmid}&platform=yqq&hostUin=0&needNewCode=0&categoryId=10000000&pcachetime=${pcachetime}`;
    request( url  ,function(err,responseText,body){
        // console.log(err,responseText,body)
        if( !err && responseText.statusCode == 200 ){
            let data = JSON.parse(body)
            // console.log(data)
            res.json(data)
        }else{
            res.json({
                ok:-1,
                msg:'lyric请求错误'
            })
        }
    } )
})
app.listen( 8000,()=>{
    console.log('success')
} )