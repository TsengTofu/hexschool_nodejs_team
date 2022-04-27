const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    user_name: String,
    user_image: String,
    content_message: String,
    content_image: String,
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  },
);

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
