const http = require('http');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const createPostsAPI = require('./createPostsAPI');
const getAllPostAPI = require('./Routes/getAllPostAPI');

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
    getAllPostAPI(req, res, headers);
  } else if (req.url === '/posts' && req.method === 'POST') {
    // 新增貼文 API
    createPostsAPI(req, res)
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
