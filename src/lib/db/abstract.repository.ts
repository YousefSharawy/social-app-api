import { Model, QueryFilter, QueryOptions, Types } from "mongoose";
//contract
export abstract class AbstractRepository<T> {
  constructor(private readonly model: Model<T>) {}
  async create(data: T) {
    return await this.model.create(data);
  }
  async update(
    filter: QueryFilter<T>,
    newData: Partial<T>,
    options: QueryOptions<T>,
  ) {
    return await this.model.findOneAndUpdate(filter, newData, options);
  }
  async delete(id: Types.ObjectId) {
    return await this.model.deleteOne({ _id: id });
  }

 async getOne(filter:QueryFilter<T>){
  return await this.model.findOne(filter);
 }
}
