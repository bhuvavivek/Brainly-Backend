import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';

export const JWT_Password = "hvfvbrtfgb23"

export const userMiddleware = (req:Request,res:Response,next:NextFunction)=>{
  const header = req.headers['Authorization'];
  const decoded = jwt.verify(header as string , JWT_Password)

  if(decoded){
    //@ts-ignore
    req.userId = decoded.id
    next()
  }
}