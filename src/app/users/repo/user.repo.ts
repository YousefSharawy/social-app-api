import { Types } from "mongoose";
import { IUser, User } from "../model/user.model";
import { AbstractRepository } from "../../../lib/db/abstract.repository";

export class UserRepo extends AbstractRepository <IUser> {
  constructor(){
    super(User);
  }
   async findByEmail(email:string){
    return await User.findOne({email:email});
   }
}
export default new UserRepo();