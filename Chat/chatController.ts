import { Request, Response } from "express";
import chatService from "./chatService";

const getChat = async (req: Request, res: Response) => {
  try {
    const recipient1 = req.query.recipient1;
    const recipient2 = req.query.recipient2;
    if (recipient1 !== undefined) {
      const response = await chatService.getChat(
        String(recipient1),
        String(recipient2)
      );
      if (response.status === 201)
        res.json({ status: 201, chatData: response.data });
      else res.json({ status: 400, chatData: null });
    }
  } catch (error) {
    res.json({ status: 500, chatData: null });
  }
};

export default {
  getChat,
};
