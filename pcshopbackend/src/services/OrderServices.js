const Order = require("../models/OrderProduct");
const Product = require("../models/ProductModel");
const User = require("../models/UserModel")

const createOrder = (newOrder) => {
    return new Promise(async (resolve, reject) => {
        const { orderItems, paymentMethod, itemsPrice, shippingPrice, totalPrice, fullName, address, city, phone, user, isPaid, paidAt, isDelivered, deliveredAt } = newOrder;
        try {
            // Kiểm tra số lượng và cập nhật kho hàng cho từng sản phẩm
            for (const order of orderItems) {
                const productData = await Product.findOneAndUpdate(
                    {
                        _id: order?.product,
                        countInStock: { $gte: order?.amount }, // Đảm bảo sản phẩm có đủ trong kho
                    },
                    {
                        $inc: {
                            countInStock: -order?.amount, // Giảm số lượng trong kho
                            selled: +order?.amount, // Tăng số lượng đã bán
                        },
                    },
                    { new: true } // Trả về dữ liệu sau cập nhật
                );

                if (!productData) {
                    return resolve({
                        status: 'thất bại',
                        message: `Sản phẩm với ID ${order?.product} không đủ số lượng.`,
                    });
                }
            }
            // Tạo một đơn hàng duy nhất cho tất cả sản phẩm
            const createdOrder = await Order.create({
                orderItems,
                shippingAddress: {
                    fullName,
                    address,
                    city,
                    phone,
                },
                paymentMethod,
                itemsPrice,
                shippingPrice,
                totalPrice,
                user,
                isPaid,
                paidAt,
                isDelivered,
                deliveredAt
            });

            resolve({
                status: 'thành công',
                message: 'Đặt hàng thành công!',
                data: createdOrder,
            });
        } catch (e) {
            reject(e); // Xử lý lỗi nếu có
        }
    });
};

const getAllOrderDetails = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await Order.find({
                user: id
            })
            if (order === null) {
                resolve({
                    status: 'Lỗi',
                    message: 'Không tìm thấy sản phẩm!',
                })
            }
            resolve({
                status: 'thành công',
                message: 'lấy data Order thành công ',
                data: order
            })
        } catch (e) {
            reject(e)
        }
    })
}
const getOrderDetails = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await Order.findById({
                _id: id
            })
            if (order === null) {
                resolve({
                    status: 'Lỗi',
                    message: 'Không tìm thấy sản phẩm!',
                })
            }
            resolve({
                status: 'thành công',
                message: 'lấy data Order thành công ',
                data: order
            })
        } catch (e) {
            reject(e)
        }
    })
}
const cancelOrderDetails = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkOrder = await Order.findByIdAndDelete(id)
            if (checkOrder === null) {
                resolve({
                    status: 'Lỗi',
                    message: 'Không tìm thấy sản phẩm!',
                })
            }
            resolve({
                status: 'thành công',
                message: 'Xóa Order thành công ',
            })
        } catch (e) {
            reject(e)
        }
    })
}
module.exports = {
    createOrder,
    getAllOrderDetails,
    getOrderDetails,
    cancelOrderDetails

};
