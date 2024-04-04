import chat from "../Model/chat";
import chatRepository from "../Repository/chatRepository";

const saveChat = async (data: any) => {
  try {
    const newChat = new chat(data);
    newChat.save();
  } catch (error) {
    console.log(error, "error happened in chat service saving chat");
  }
};

const getChat = async (recipient1: string, recipient2: string) => {
  try {
    const chatData = await chatRepository.getChat(recipient1, recipient2);
    if (chatData && chatData.length)
      return { message: "success", data: chatData };
    else return { message: "failed", data: null };
  } catch (error) {
    console.log(error, "error happened in chat service getting chat");
    return { message: "failed", data: null };
  }
};

export default {
  saveChat,
  getChat,
};
