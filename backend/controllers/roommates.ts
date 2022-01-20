import { Request, Response } from "express";
import { Roommate } from "../../shared/src/roommate";

const getRoommates = async (req: Request, res: Response) => {
  return res.status(200).json({
    message: "Success! Roommates retrieved.",
  });
};

const createRoommate = async (req: Request, res: Response) => {
  try {
    const roommate: Roommate = req.body as Roommate;
    return res.status(200).json({
      message: "Success! Roommate created.",
      roommate,
    });
  } catch (err) {
    return res.status(400).json({
      message: "Invalid roommate in request body.",
      err,
    });
  }
};

const updateRoommate = async (req: Request, res: Response) => {
  try {
    const roommate: Roommate = req.body as Roommate;
    return res.status(200).json({
      message: "Success! Roommate updated.",
      roommate,
    });
  } catch (err) {
    return res.status(400).json({
      message: "Invalid roommate in request body.",
      err,
    });
  }
};

export default { getRoommates, createRoommate, updateRoommate };
