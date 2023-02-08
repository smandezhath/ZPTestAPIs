module.exports = (mongoose) => {
  var schema = mongoose.Schema(
    {
      title: String,
      description: String,
      detailedDescription: String,
      //image: [{ type: Blob }],
      category: String,
      addToCart: Boolean,
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

  const shoppingcart = mongoose.model("shoppingcart", schema);
  return shoppingcart;
};
