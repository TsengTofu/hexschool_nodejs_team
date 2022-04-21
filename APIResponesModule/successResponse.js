const successResponse = (res, headers, data) => {
  res.writeHead(200, headers);
  res.write(JSON.stringify(
    {
      status: 'success',
      message: '已成功取得全部貼文資料',
      data,
    },
  ));
  res.end();
};

module.exports = successResponse;
