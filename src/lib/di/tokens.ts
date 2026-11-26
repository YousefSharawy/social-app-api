export const TOKENS = {
    AuthService : Symbol('AuthService'),
    AuthController : Symbol('AuthController'),
    AuthRepo : Symbol('AuthRepo'),

    UserService : Symbol('UserService'),
    UserController : Symbol('UserController'),
    UserRepo : Symbol('UserRepo'),

    PostService : Symbol('PostService'),
    PostController : Symbol('PostController'),
    PostRepo : Symbol('PostRepo'),

    CommentService : Symbol('CommentService'),
    CommentController : Symbol('CommentController'),
    CommentRepo : Symbol('CommentRepo'),


    CloudProvider: Symbol('CloudProvider'),
    CacheProvider: Symbol('CacheProvider'),
    MaijetProvider: Symbol('MailjetProvider'),
    FirebaseProvider: Symbol('FirebaseProvider'),
} 