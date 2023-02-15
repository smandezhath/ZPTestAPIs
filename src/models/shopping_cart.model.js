const multer = require("multer");

module.exports = (mongoose) => {
  var schema = mongoose.Schema(
    {
      title: String,
      description: String,
      detailedDescription: String,
      imagestr: String, //image as base 64
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
