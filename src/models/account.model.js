module.exports = (mongoose) => {
  var schema = new mongoose.Schema(
    {
      name: String,
      username: String,
      password: String,
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const account = new mongoose.model("account", schema);
  return account;
};
