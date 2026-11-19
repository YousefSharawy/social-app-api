export interface ICacheProvider {
    set(key:string, value:string, ttl:number):Promise<string>; 
    get(key:string):Promise<string|null>;
    del(key:string):Promise<number>;
}