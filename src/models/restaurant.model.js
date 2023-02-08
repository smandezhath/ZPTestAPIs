module.exports = (mongoose) => {
  var schema = mongoose.Schema(
    {
      title: String,
      description: String,
      //image: [{ type: Blob }],
      category: String,
      company: String,
      model: String,
      yom: String,
      mileage: Number,
      price: Number,
      review: Number,
      reviewCount: Number,
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
