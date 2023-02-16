module.exports = (mongoose) => {
  var schema = mongoose.Schema(
    {
      title: String,
      star_rating: Number,
      rating_count: Number,
      imagestr: String, //image as base 64
      description: String,
      Category: String,
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const movierating = mongoose.model("movierating", schema);
  return movierating;
};
