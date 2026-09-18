import crypto from "crypto"
import razorpayInstance from "../config/razorpay.js"
import { Order } from "../models/orderModel.js"
import { Cart } from "../models/cartModels.js"
import User from "../models/userModel.js"
import { Product } from "../models/productModel.js"

export const createOrder = async (req, res) => {
    try {
        const { products, amount, tax, shipping, currency } = req.body

        const options = {
            amount: Math.round(Number(amount) * 100),
            currency: currency || "INR",
            receipt: `receipt_${Date.now()}`
        }

        const razorpayOrder = await razorpayInstance.orders.create(options)

        const newOrder = new Order({
            user: req.user._id,
            products,
            amount,
            tax,
            shipping,
            currency,
            status: "Pending",
            razorpayOrderId: razorpayOrder.id
        })

        await newOrder.save()

        res.json({ success: true, order: razorpayOrder })
    } catch (error) {
        console.error("❌ Error in createOrder:", error)
        res.status(500).json({ success: false, message: error.message })
    }
}

export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentFailed } = req.body

        if (paymentFailed) {
            const order = await Order.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                { status: "Failed" },
                { returnDocument: "after" }     // ✅ updated
            )
            return res.status(400).json({ success: false, message: "Payment failed", order })
        }

        const sign = razorpay_order_id + "|" + razorpay_payment_id
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET)
            .update(sign.toString())
            .digest("hex")

        if (expectedSignature === razorpay_signature) {
            const order = await Order.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                {
                    status: "Paid",
                    razorpayPaymentId: razorpay_payment_id,
                    razorpaySignature: razorpay_signature
                },
                { returnDocument: "after" }     // ✅ updated
            )

            await Cart.findOneAndUpdate(
                { user: req.user._id },
                { $set: { items: [], totalPrice: 0 } }
            )

            return res.json({ success: true, message: "Payment Successful", order })
        } else {
            await Order.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                { status: "Failed" },
                { returnDocument: "after" }     // ✅ updated
            )
            return res.status(400).json({ success: false, message: "Invalid signature" })
        }
    } catch (error) {
        console.error("❌ Error in verifyPayment:", error)
        res.status(500).json({ success: false, message: error.message })
    }
}
export const getMyOrder = async (req, res) => {
    try {
        const userId = req.user._id;
        const orders = await Order.find({user:userId}).populate({path:"products.productId", select:"productName productPrice productImg"}).populate("user", "firstName lastName email")

        res.status(200).json({
            success: true,
            count:orders.length,
            orders,
        })
    } catch (error) {
        console.error("Error fetching user orders:", error)
        res.status(500).json({message: error.message})
    }
}
export const getUserOrders = async (req, res) => {
    try {
        const { userId } = req.params; 

        const orders = await Order.find({ user: userId })
            .populate({
                path: "products.productId",
                select: "productName productPrice productImg"
            }) 
            .populate("user", "firstName lastName email") 

        res.status(200).json({
            success: true,
            count: orders.length,
            orders
        })
    } catch (error) {
        console.log("Error fetching user order: ", error)
        res.status(500).json({ message: error.message })
    }
}
export const getAllOrdersAdmin = async (req, res) => {
    try {
        const orders = await Order.find()
            .sort({ createdAt: -1 })
            .populate("user", "name email") // populate user info
            .populate("products.productId", "productName productPrice")

        res.json({
            success: true,
            count: orders.length,
            orders
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch all orders",
            error: error.message
        })
    }
}
export const getSalesData = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({})
        const totalProducts = await Product.countDocuments({})
        const totalOrders = await Order.countDocuments({ status: "Paid" })

        const totalSaleAgg = await Order.aggregate([
            { $match: { status: "Paid" } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ])

        const totalSales = totalSaleAgg[0]?.total || 0

        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        const salesByDate = await Order.aggregate([
            { $match: { status: "Paid", createdAt: { $gte: thirtyDaysAgo } } },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                    },
                    amount: { $sum: "$amount" }
                }
            },
            { $sort: { _id: 1 } }
        ])

        console.log(salesByDate)

        const formattedSales = salesByDate.map((item) => ({
            date: item._id,
            amount: item.amount
        }))

        console.log(formattedSales)

        res.json({
            success: true,
            totalUsers,
            totalProducts,
            totalOrders,
            totalSales,
            sales: formattedSales
        })

    } catch (error) {
        console.error("Error fetching sales data:", error)
        res.status(500).json({ success: false, message: error.message })
    }
}