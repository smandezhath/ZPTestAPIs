module.exports = (mongoose) => {
  var schema = mongoose.Schema(
    {
      componentId: String,
      componentName: String,
      userTypes: [{ type: String }],
      subscriptions: [{ type: String }],
      paymentTerms: [{ type: String }],
      states: [{ type: String }],
      pagename: String,
      demo: Boolean,
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Policy = mongoose.model("policy", schema);

  return Policy;
};
