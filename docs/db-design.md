#DB design

##USer
- id
- email
- name
- password
- phone number
- gender
- provider
- isDeleted

## Post
- id
- content
- userId
- createdAt
- updatedAt
- isDeleted
- commentsCounts
- allowsComments
- reactionsCount

##Comment/Reply
- id
- content
- userId
- createdAt
- updatedAt
- postId
- parentId
- isDeleted

##Reaction
- id
- userId
- redId [postId,commenId]
type Enum ['Like','Angry','Sad', '....']
- onModel ["Post","Comment"]  
- createdAt
- updatedAt