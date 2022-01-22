import { Request, Response, NextFunction } from "express";

const validLoginFields = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body.username) {
    return res.status(400).json({
      message: "Username missing.",
    });
  }
  if (!req.body.password) {
    return res.status(400).json({
      message: "Password missing.",
    });
  }
  return next();
};

export default { validLoginFields };
