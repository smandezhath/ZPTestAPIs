module.exports = (mongoose) => {
  var schema = new mongoose.Schema(
    {
      title: String,
      category: String,
      imagestr: String, //image as base 64
      content: [{ type: String }],
      signature: [{ type: String }],
      reviewed: Boolean,
      approved: Boolean,
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const blog = new mongoose.model("blog", schema);
  return blog;
};
