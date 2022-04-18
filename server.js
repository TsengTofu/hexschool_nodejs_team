const http = require('http');
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

const requestListener = (req, res) => {
  let body = '';
  req.on('data', chunk => {
    body += chunk;
  });
  // 判斷路由後，需要對 MongoDB 執行的操作
  if (req.url === '/posts' && req.method === 'GET') {
    // 取得全部貼文 API
    console.log('GET 取得全部貼文資料 API');
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
    req.on('end', async () => {
      try {
        const data = JSON.parse(body)
        if(data.message && data.message.trim()) {
          await PostModel.create({
            user_name: '測試人員',
            user_image: 'https://www.niusnews.com/upload/imgs/default/16JulP/0722BB/7.png',
            content_message: data.message,
            content_image: data.image
          });
          console.log('POST 新增一筆貼文資料 API');
          res.writeHead(200, headers);
          res.write(JSON.stringify(
            {
              status: 'success',
              data: '已成功 Call POST 新增一筆貼文資料 API',
            },
          ));
          res.end();
        } else {
          res.writeHead(400, headers);
          res.write(JSON.stringify({ status: 'false', data: '貼文內容不可為空' }));
          res.end();
        }
      } catch (err) {
        res.writeHead(400, headers);
        res.write(JSON.stringify({ status: 'false', data: '發生未知錯誤' }));
        res.end();
      }
    });
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
