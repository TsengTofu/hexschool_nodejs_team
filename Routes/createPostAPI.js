const PostModel = require('../Models/post');

const headers = {
  'Access-Control-Allow-Headers':
  'Content-Type, Authorization, Content-Length, X-Requested-With',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
  'Content-Type': 'application/json',
};
const postPostsAPI = (req, res) => {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });
  req.on('end', async () => {
    try {
      const data = JSON.parse(body);
      if (data.contentMessage && data.contentMessage.trim()) {
        const newData = await PostModel.create({
          user_name: '測試人員',
          user_image: 'https://www.niusnews.com/upload/imgs/default/16JulP/0722BB/7.png',
          content_message: data.contentMessage,
          content_image: data.contentImage ? data.contentImage.trim() : null,
        });
        res.writeHead(200, headers);
        res.write(JSON.stringify(
          {
            status: 'success',
            data: newData,
            message: '已成功 Call POST 新增一筆貼文資料 API',
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
};
module.exports = postPostsAPI;
