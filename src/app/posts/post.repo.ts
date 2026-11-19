import { AbstractRepository } from "../../lib/db/abstract.repository";
import { IPost,Post } from "./post.model";

class PostRepo extends AbstractRepository<IPost>{

    constructor(){
        super(Post);
    }
    
}
export default new PostRepo();