//mjs -> module javascript 
import { MongoClient, ObjectId } from 'mongodb';
const client = new MongoClient('mongodb+srv://youssifsharawy25_db_user:gsLlhiWBIxp76RCf@ngl-app-cluster.xgqcyrc.mongodb.net');
const db = client.db('social-app');
const users = db.collection('users');
export const handler = async (event) => {
    const key = event.Records[0].s3.object.key;
    const userId = key.split('/')[1];
    await users.updateOne({ _id: new ObjectId(userId) },
        {
            $set: { profilePicturePath: key }
        }
    )
}