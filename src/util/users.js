const users = []

export const addUser = ({ id, username, room }) =>{
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    if(!username || !room) {
        return{
            error:"Usernsme ana room are required!"
        }
    }
    const existingUsers = users.find((user) =>{
        return user.room === room && user.username === username
    })
    
    if(existingUsers){
        return{
            error:"Username is already in use!!"
        }
    }
    
    const user = { id, username, room }
    users.push(user)
    return {user}
}
export const removeUser = (id)=>{
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1){
        return users.splice(index, 1)[0]
    }
}
export const getUser = (id) => {
    return users.find((user)=>user.id === id)
}
export const getUserInRoom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter((user) => user.room === room)
}

addUser({
    id:20,
    username:"Rohit",
    room:"Dubai"
})
addUser({
    id:19,
    username:"Rafat",
    room:"Dubai"
})
addUser({
    id:19,
    username:"Rohit",
    room:"caneda"
})
const user = getUser(441)
console.log(users)

const userList = getUserInRoom("Dubai")
console.log(userList)


