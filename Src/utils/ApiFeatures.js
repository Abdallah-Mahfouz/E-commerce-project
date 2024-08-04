export class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  //================
  pagination() {
    const page = parseInt(this.queryString.page) || 1;
    const limit = parseInt(this.queryString.limit) || 10;
    const skip = (page - 1) * limit;
    this.query.find().skip(skip).limit(limit);
    this.page = page;
    return this;
  }

  //================
  filter() {
    let filter = ["page", "search", "sort", "select"];
    let filterQuery = { ...this.queryString }; //shallow copy =>deep copy
    filter.forEach((e) => delete filterQuery[e]);
    filterQuery = JSON.parse(
      JSON.stringify(filterQuery).replace(
        /\b(gt|gte|lt|lte|in|eq)\b/g,
        (match) => `$${match}`
      )
    );
    this.query = this.query.find(filterQuery);
    return this;
  }
  //================
  sort() {
    if (this.queryString.sort) {
      this.query.sort(this.queryString.sort.replaceAll(",", " "));
    }
    return this;
  }
  //================
  select() {
    if (this.queryString.select) {
      this.query = this.query.select(
        this.queryString.select.replaceAll(",", " ")
      );
    }
    return this;
  }
  //================
  search() {
    if (this.queryString.search) {
      this.query.find({
        $or: [
          { title: { $regex: req.query.search, $options: "i" } },
          { description: { $regex: req.query.search, $options: "i" } },
        ],
      });
    }
    return this;
  }
}
