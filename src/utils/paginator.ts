import { Document, Query } from "mongoose";
import { PAGINATION_LIMIT } from "../constants";
import createHttpError from "http-errors";

class Paginator<T extends Document> {
  query: Query<T[], T>;
  queryString: QueryString;

  constructor(query: Query<T[], T>, queryString: QueryString) {
    this.query = query;
    this.queryString = queryString;
  }

  async paginate() {
    const page = Number(this.queryString.page || 1);
    const limit = Number(this.queryString.limit || PAGINATION_LIMIT);

    if (isNaN(page) || page < 1) {
      throw createHttpError.UnprocessableEntity("Page must be integer");
    }

    if (isNaN(page) || page < 1) {
      throw createHttpError.UnprocessableEntity("Limit must be integer");
    }

    const totalItems = await this.query.clone().countDocuments();

    const totalPages = Math.ceil(totalItems / limit);

    if (page > totalPages) {
      throw createHttpError.NotFound("Page doesn't exists");
    }

    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return { totalItems, totalPages, currentPage: page, itemsPerPage: limit };
  }
}

export default Paginator;
