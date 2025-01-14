import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { FlashSaleService } from "./flashSale.service";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { IJwtPayload } from "../auth/auth.interface";

const createFlashSale = catchAsync(async (req: Request, res: Response) => {
  const result = await FlashSaleService.createFlashSale(
    req.body,
    req.user as IJwtPayload
  );

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Flash Sale created succesfully',
    data: result,
  });
});

export const FlashSaleController = {
  createFlashSale
}