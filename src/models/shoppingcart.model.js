const multer = require("multer");

module.exports = (mongoose) => {
  var schema = mongoose.Schema(
    {
      title: String,
      price: Number,
      starrating: Number,
      ratingcount: Number,
      imagestr: String, //image as base 64
      description: String,
      category: String,
      itemcount: Number,
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
