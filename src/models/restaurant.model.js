module.exports = (mongoose) => {
  var schema = mongoose.Schema(
    {
      title: String,
      starrating: String,
      ratingcount: String,
      imagestr: String, //image as base 64
      description: String,
      category: String,
      place: String,
      district: String,
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const restaurant = mongoose.model("restaurant", schema);
  return restaurant;
};
