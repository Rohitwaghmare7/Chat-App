export const generateMessage = (username,text) => {
    return{
        username,
        text,
        createdAt: new Date().getTime()
    }
}
export const generateLocationMessage = (username,url) => {
    return{
        username,
        url,
        createdAt: new Date().getTime()
    }
}