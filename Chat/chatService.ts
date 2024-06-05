import chat from "../Model/chat";
import chatRepository from "../Chat/chatRepository";

const saveChat = async (data: any) => {
  try {
    const newChat = new chat(data);
    newChat.save();
    return
  } catch (error) {
    return
  }
};

const getChat = async (recipient1: string, recipient2: string) => {
  try {
    const chatData = await chatRepository.getChat(recipient1, recipient2);
    if (chatData && chatData.length)
      return { status : 201, data: chatData };
    else return { status : 400, data: null };
  } catch (error) {
    console.log(error, "error happened in chat service getting chat");
    return { status : 500, data: null };
  }
};

export default {
  saveChat,
  getChat,
};
