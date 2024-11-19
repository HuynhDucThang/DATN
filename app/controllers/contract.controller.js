import ContractModel from "../models/contract.model.js";
import { catchAsync } from "../middlewares/catchAsyncError.js";
import Stripe from "stripe";
import ErrorHandler from "../utils/errorHandle.js";
import UserModel from "../models/user.model.js";
import {
  sendPaymentSuccessMail,
  sendVerificationEmail,
} from "../utils/semdMail.js";

const stripe = Stripe(
  "sk_test_51PxtsV06UBHk5x7w9SXBYtCaPt7jIPPhDb5N6Xta9dI8zI3dZBcfhjYC06K6nTwgtoUxVzHTpSrwxb3HAD4bCwJh00l3dt5gYs"
);

const endpointSecret =
  "whsec_8ff5c8ed5a12207ffbdf3ba48e649e323ce950cde52f946029d21060b551ed66";

export const createSessionContract = catchAsync(async (req, res, next) => {
  const apartmentId = req.params.apartmentId;
  const userId = req.userId.id;

  let contract = await ContractModel.findOne({
    apartment: apartmentId,
    payer: userId,
    status: "PENDING",
  });
  console.log("req.body : ", req.body);

  if (!contract) {
    contract = new ContractModel({
      apartment: apartmentId,
      payer: userId,
      status: "PENDING",
      ...req.body,
    });
    await contract.save();
  }

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "vnd",
          unit_amount: req.body.information.totalPrice,
          product_data: {
            name: "Thuê căn hộ qua AirBNB",
          },
        },
        quantity: 1,
      },
    ],
    // custom_text: {
    //   shipping_address: {
    //     message:
    //       "Please note that we can't guarantee 2-day delivery for PO boxes at this time.",
    //   },
    //   submit: {
    //     message: "We'll email you instructions on how to get started.",
    //   },
    //   after_submit: {
    //     message:
    //       "Learn more about **your purchase** on our [product page](https://www.stripe.com/).",
    //   },
    // },
    metadata: {
      userId,
      apartmentId,
      contractId: contract._id.toString(),
    },
    mode: "payment",
    success_url: `${process.env.FRONT_END_DOMAIN}/apartment/${apartmentId}`,
    cancel_url: `${process.env.FRONT_END_DOMAIN}`,
  });

  return res.status(200).json({
    message: "Tạo phiên thành công",
    data: session,
  });
});

// https://docs.stripe.com/billing/subscriptions/webhooks#:~:text=Stripe%20sends%20notifications%20to%20your%20app%20using%20webhooks.
// stripe listen --forward-to localhost:4000/webhook/webhook-stripe
export const createContract = catchAsync(async (req, res, next) => {
  let event = req.body;

  if (endpointSecret) {
    const signature = req.headers["stripe-signature"];

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        endpointSecret
      );
    } catch (err) {
      console.log(`Webhook signature verification failed.`, err.message);
      return next(
        new ErrorHandler("⚠️  Webhook signature verification failed.", 400)
      );
    }
  }

  if (["checkout.session.completed", "invoice.paid"].includes(event.type)) {
    const metadata = event.data.object.metadata;
    const userId = event.data.object.metadata.userId;

    const foundUser = await UserModel.findById(userId).lean();

    if (!foundUser) {
      return next(new ErrorHandler("Không tìm thấy người dùng", 404));
    }

    sendPaymentSuccessMail(foundUser.email, "Payment success");

    await ContractModel.findByIdAndUpdate(metadata.contractId, {
      $set: {
        status: "COMPLETED",
      },
    });
  }

  res.status(302);
});

export const getContracts = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 0;
  const limit = page ? parseInt(req.query.limit) || 6 : 0;
  const skip = page > 0 ? (page - 1) * limit : 0;
  const userId = req.query.userId;

  const condition = {};

  if (req.query.apartmentId) {
    condition["apartment"] = req.query.apartmentId;
  }

  if (userId) {
    condition["payer"] = userId;
  }

  let contractQuery = ContractModel.find(condition)
    .populate("payer")
    .populate("apartment");

  if (page) {
    contractQuery = contractQuery.skip(skip).limit(limit);
  }

  const [contract, total] = await Promise.all([
    contractQuery.lean(),
    ContractModel.countDocuments(),
  ]);

  return res.status(200).json({
    message: "Tìm kiếm hợp đồng thành công",
    data: contract,
    total,
  });
});

export const updateContract = catchAsync(async (req, res) => {
  const { contractId } = req.params;
  const updateData = req.body;

  try {
    const updatedContract = await ContractModel.findByIdAndUpdate(
      contractId,
      { $set: updateData },
      { new: true }
    );

    if (!updatedContract) {
      res.status(404).json({
        message: "Hợp đồng không tồn tại",
        data: null,
      });
    }

    res.status(200).json({
      message: "Cập nhật hợp đồng thành công",
      data: updatedContract,
    });
  } catch (error) {
    res.status(500).json({
      message: "Có lỗi xảy ra khi cập nhật hợp đồng",
      error: error.message,
    });
  }
});

export const deleteContract = catchAsync(async (req, res) => {
  const { contractId } = req.params;
  const updateData = req.body;

  try {
    const updatedContract = await ContractModel.findByIdAndDelete(
      contractId,
      { $set: updateData },
      { new: true }
    );

    if (!updatedContract) {
      res.status(404).json({
        message: "Hợp đồng không tồn tại",
        data: null,
      });
    }

    res.status(200).json({
      message: "xóa hợp đồng thành công",
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      message: "Có lỗi xảy ra khi xóa hợp đồng",
      error: error.message,
    });
  }
});
