import { catchAsync } from "../middlewares/catchAsyncError.js";
import ApartmentModel from "../models/apartment.model.js";
import ContractModel from "../models/contract.model.js";
import UserModel from "../models/user.model.js";

export const getOverviewStatistics = catchAsync(async (req, res) => {
  const [totalApartment, totalContract, totalUser] = await Promise.allSettled([
    ApartmentModel.countDocuments(),
    ContractModel.countDocuments(),
    UserModel.countDocuments(),
  ]);

  return res.status(200).json({
    message: "tìm kiếm hợp đồng thành công",
    data: {
      totalApartment:
        totalApartment.status === "fulfilled" ? totalApartment.value : 0,
      totalContract:
        totalContract.status === "fulfilled" ? totalContract.value : 0,
      totalUser: totalUser.status === "fulfilled" ? totalUser.value : 0,
    },
  });
});
