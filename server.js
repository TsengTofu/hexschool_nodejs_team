const http = require('http');
const url = require('url');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const PostModel = require('./Models/post');

dotenv.config();
// 資料庫位置
const dbUrl = process.env.DB_URL.replace('<password>', process.env.USER_PASSWORD).replace('<databasename>', process.env.DB_NAME);

// 連接資料庫
mongoose.connect(dbUrl).then((response) => {
  console.log('有連接到資料庫囉！');
}).catch((error) => {
  // console.log(error, 'error');
});

const headers = {
  'Access-Control-Allow-Headers':
  'Content-Type, Authorization, Content-Length, X-Requested-With',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
  'Content-Type': 'application/json',
};

const requestListener = async (req, res) => {
  // 判斷路由後，需要對 MongoDB 執行的操作
  if (req.url.startsWith('/posts') && req.method === 'GET') {
    // 取得全部貼文 API
    console.log('GET 取得全部貼文資料 API');
    const queryObject = url.parse(req.url, true).query;
    // console.log(queryObject, 'queryObject');
    const { sort, nameKeyword, contentKeyword } = queryObject;
    // 1. 驗證 sort 是否只有 asc or desc
    // 2. 驗證 keyword 是否有奇怪符號
    // desc 大到小 asc 小到大
    // Room.find({}).sort({date: 'desc'});
    const temp = await PostModel.find({
      content_message: { $regex: `${contentKeyword}` },
      user_name: { $regex: `${nameKeyword}` },
    }).sort({ created_at: sort });
    console.log(temp, 'temp');
    // const result = await PostModel.find();
    // console.log(result, 'result');
    res.writeHead(200, headers);
    res.write(JSON.stringify(
      {
        status: 'success',
        data: '已成功 Call GET 取得全部貼文資料 API',
      },
    ));
    res.end();
  } else if (req.url === '/posts' && req.method === 'POST') {
    // 新增貼文 API
    console.log('POST 新增一筆貼文資料 API');
    res.writeHead(200, headers);
    res.write(JSON.stringify(
      {
        status: 'success',
        data: '已成功 Call POST 新增一筆貼文資料 API',
      },
    ));
    res.end();
  } else if (req.method === 'OPTIONS') {
    res.writeHead(200, headers);
    res.end();
  } else {
    res.writeHead(404, headers);
    res.write(JSON.stringify({ status: 'fail', data: '無此網站路由' }));
    res.end();
  }
};

const server = http.createServer(requestListener);
server.listen(process.env.PORT || 3005);
