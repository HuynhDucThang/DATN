import { catchAsync } from "../middlewares/catchAsyncError.js";
import ApartmentModel from "../models/apartment.model.js";
import ContractModel from "../models/contract.model.js";
import UserModel from "../models/user.model.js";
import dayjs from "dayjs";

const getWeeklyCounts = (
  model,
  startOfCurrentWeek,
  endOfCurrentWeek,
  startOfPreviousWeek,
  endOfPreviousWeek
) => {
  return model.aggregate([
    {
      $facet: {
        currentWeek: [
          {
            $match: {
              createdAt: { $gte: startOfCurrentWeek, $lte: endOfCurrentWeek },
            },
          },
          {
            $count: "count",
          },
        ],
        previousWeek: [
          {
            $match: {
              createdAt: { $gte: startOfPreviousWeek, $lte: endOfPreviousWeek },
            },
          },
          {
            $count: "count",
          },
        ],
      },
    },
    {
      $project: {
        currentWeek: { $arrayElemAt: ["$currentWeek.count", 0] },
        previousWeek: { $arrayElemAt: ["$previousWeek.count", 0] },
      },
    },
  ]);
};

const getTotalCount = (model) => {
  return model.countDocuments();
};

const getData = async () => {
  const startOfCurrentWeek = dayjs().startOf("week").toDate();
  const endOfCurrentWeek = dayjs().endOf("week").toDate();
  const startOfPreviousWeek = dayjs()
    .subtract(1, "week")
    .startOf("week")
    .toDate();
  const endOfPreviousWeek = dayjs().subtract(1, "week").endOf("week").toDate();

  // Running total count and weekly counts in parallel for each collection
  const [
    userTotalCount,
    userWeeklyStats,
    contractTotalCount,
    contractWeeklyStats,
    apartmentTotalCount,
    apartmentWeeklyStats,
  ] = await Promise.all([
    getTotalCount(UserModel), // Get total records of User collection
    getWeeklyCounts(
      UserModel,
      startOfCurrentWeek,
      endOfCurrentWeek,
      startOfPreviousWeek,
      endOfPreviousWeek
    ), // Get weekly stats for User
    getTotalCount(ContractModel), // Get total records of Contract collection
    getWeeklyCounts(
      ContractModel,
      startOfCurrentWeek,
      endOfCurrentWeek,
      startOfPreviousWeek,
      endOfPreviousWeek
    ), // Get weekly stats for Contract
    getTotalCount(ApartmentModel), // Get total records of Apartment collection
    getWeeklyCounts(
      ApartmentModel,
      startOfCurrentWeek,
      endOfCurrentWeek,
      startOfPreviousWeek,
      endOfPreviousWeek
    ), // Get weekly stats for Apartment
  ]);

  // Function to calculate percentage change
  const calculateChange = (current = 0, previous = 0) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  return [
    {
      title: "Người dùng",
      value: userTotalCount, // Total records in User collection
      change: calculateChange(
        userWeeklyStats[0]?.currentWeek || 0,
        userWeeklyStats[0]?.previousWeek || 0
      ), // Weekly change percentage
    },
    {
      title: "Hợp đồng",
      value: contractTotalCount, // Total records in Contract collection
      change: calculateChange(
        contractWeeklyStats[0]?.currentWeek || 0,
        contractWeeklyStats[0]?.previousWeek || 0
      ), // Weekly change percentage
    },
    {
      title: "Căn hộ",
      value: apartmentTotalCount, // Total records in Apartment collection
      change: calculateChange(
        apartmentWeeklyStats[0]?.currentWeek || 0,
        apartmentWeeklyStats[0]?.previousWeek || 0
      ), // Weekly change percentage
    },
  ];
};

export const getOverviewStatistics = catchAsync(async (req, res) => {
  const data = await getData();

  return res.status(200).json({
    message: "tìm kiếm hợp đồng thành công",
    data,
  });
});

const getMonthlyCounts = (model, dateField, startDate) => {
  return model.aggregate([
    {
      $match: {
        [dateField]: { $gte: startDate }, // Filter records starting from the last 6 months
      },
    },
    {
      $group: {
        _id: {
          month: { $month: `$${dateField}` }, // Group by month
          year: { $year: `$${dateField}` }, // Group by year to differentiate between months in different years
        },
        count: { $sum: 1 }, // Count the number of documents in each group
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 }, // Sort by year and month ascending
    },
  ]);
};

const getDataForLastSixMonths = async () => {
  const startDate = dayjs().subtract(6, "months").startOf("month").toDate(); // Start date 6 months ago

  // Get monthly counts for User and Contract collections in parallel
  const [userMonthlyCounts, contractMonthlyCounts] = await Promise.all([
    getMonthlyCounts(UserModel, "createdAt", startDate), // For User collection
    getMonthlyCounts(ContractModel, "createdAt", startDate), // For Contract collection
  ]);
  
  // Create a map to organize the monthly data for easy merging
  const monthlyDataMap = {};

  // Process user monthly counts
  userMonthlyCounts.forEach(({ _id, count }) => {
    const { year, month } = _id;
    const monthName = dayjs(`${year}-${month}-01`).format("MMMM"); // Format month to get the name
    if (!monthlyDataMap[month]) {
      monthlyDataMap[month] = {
        name: `Tháng ${month}`,
        userCount: count,
        contractCount: 0,
      };
    } else {
      monthlyDataMap[month].userCount = count;
    }
  });

  // Process contract monthly counts
  contractMonthlyCounts.forEach(({ _id, count }) => {
    const { year, month } = _id;
    const monthName = dayjs(`${year}-${month}-01`).format("MMMM");
    if (!monthlyDataMap[month]) {
      monthlyDataMap[month] = {
        name: `Tháng ${month}`,
        contractCount: count,
        userCount: 0,
      };
    } else {
      monthlyDataMap[month].contractCount = count;
    }
  });

  // Convert the map to an array and return it
  const result = Object.values(monthlyDataMap);

  return result;
};

export const getChartStatistics = catchAsync(async (req, res) => {
  const data = await getDataForLastSixMonths();

  return res.status(200).json({
    message: "tìm kiếm hợp đồng thành công",
    data,
  });
});
