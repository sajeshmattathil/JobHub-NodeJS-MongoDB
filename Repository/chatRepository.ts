import chat from "../Model/chat";

const getChat = async (recipient1 : string,recipient2 : string ) => {
    try {
        return await chat.find({recipient1 : recipient1,recipient2 : recipient2})
    } catch (error) {
        console.log(error,'error happened  in chat repo in downloading chat'); 
    }
}

export default {
    getChat 
}