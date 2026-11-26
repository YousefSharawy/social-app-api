import { injectable } from "tsyringe";
import { AbstractRepository } from "../../../lib/db/abstract.repository";
import { IPost,Post } from "../model/post.model";
@injectable()
export class PostRepo extends AbstractRepository<IPost>{
    constructor(){
        super(Post);
    }
}