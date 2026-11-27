export interface CreatePostDTO {
  content: string;
  allowComments?: boolean;
}

export interface UpdatePostDTO {
  content?: string;
  allowComments?: boolean;
}
