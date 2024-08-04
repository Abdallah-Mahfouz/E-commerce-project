export const deleteFromDB = async (model, id) => {
  if (req?.data) {
    const {model,id} = req.data;
    await model.deleteOne({ _id: id });
  }
};
