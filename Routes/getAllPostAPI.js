const url = require('url');
const PostModel = require('../Models/post');
const successResponse = require('../APIResponesModule/successResponse');

const sortConstantConfig = ['asc', 'desc'];

const getAllPostAPI = async (req, res, headers) => {
  const queryObject = url.parse(req.url, true).query;
  const { sort, nameKeyword, contentKeyword } = queryObject;
  const isQueryEmpty = queryObject
  && Object.keys(queryObject).length === 0;
  if (!isQueryEmpty) {
    if (sortConstantConfig.includes(sort)) {
      const sortData = await PostModel.find({
        content_message: { $regex: `${contentKeyword}` },
        user_name: { $regex: `${nameKeyword}` },
      }).sort({ created_at: sort });
      successResponse(res, headers, sortData);
    } else {
      const pureData = await PostModel.find({
        content_message: { $regex: `${contentKeyword}` },
        user_name: { $regex: `${nameKeyword}` },
      });
      successResponse(res, headers, pureData);
    }
  } else {
    const allData = await PostModel.find();
    successResponse(res, headers, allData);
  }
};
module.exports = getAllPostAPI;
