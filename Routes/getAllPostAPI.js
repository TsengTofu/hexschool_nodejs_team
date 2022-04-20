const url = require('url');
const PostModel = require('../Models/post');

const sortConstantConfig = ['asc', 'desc'];

const getAllPostAPI = async (req, res, headers) => {
  const queryObject = url.parse(req.url, true).query;
  const { sort, nameKeyword, contentKeyword } = queryObject;
  const isQueryEmpty = queryObject
  && Object.keys(queryObject).length === 0;
  if (!isQueryEmpty) {
    if (!sortConstantConfig.includes(sort)) return;
    const sortData = await PostModel.find({
      content_message: { $regex: `${contentKeyword}` },
      user_name: { $regex: `${nameKeyword}` },
    }).sort({ created_at: sort });
    res.writeHead(200, headers);
    res.write(JSON.stringify(
      {
        status: 'success',
        message: '已成功取得全部貼文資料',
        data: sortData,
      },
    ));
    res.end();
  } else {
    const allData = await PostModel.find();
    res.writeHead(200, headers);
    res.write(JSON.stringify(
      {
        status: 'success',
        message: '已成功取得全部貼文資料',
        data: allData,
      },
    ));
    res.end();
  }
};
module.exports = getAllPostAPI;
