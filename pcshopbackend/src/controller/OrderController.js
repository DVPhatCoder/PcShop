const OrderServices = require('../services/OrderServices')
const createOrder = async (req, res) => {
    try {
        const { paymentMethod, itemsPrice, shippingPrice, totalPrice, fullName, address, city, phone } = req.body
        if (!paymentMethod || !itemsPrice || !shippingPrice || !totalPrice || !fullName || !address || !city || !phone) {
            return res.status(400).json({
                status: 'Lỗi',
                message: 'Không được để trống các trường bắt buộc!',
            })
        }
        const response = await OrderServices.createOrder(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}
const getOrderDetails = async (req, res) => {
    try {
        const userID = req.params.id
        if (!userID) {
            return res.status(200).json({
                status: 'Lỗi',
                message: 'người dùng không tồn tại',
            })
        }
        const response = await OrderServices.getOrderDetails(userID)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}
module.exports = {
    createOrder,
    getOrderDetails
} 
