import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    orderItems: [

    ],
    shippingAddress: {//dia chi giao hang

    },
    paymentMethod: '',
    itemsPrice: 0,
    shippingPrice: 0,
    taxPrice: 0,
    totalPrice: 0,
    user: '',
    isPaid: false,
    paidAt: '',
    isDelivered: false,
    deliveredAt: '',
}

export const orderSlide = createSlice({
    name: 'order',
    initialState,
    reducers: {
        addOrderProduct: (state, action) => {
            const { orderItem } = action.payload
            const itemOrder = state?.orderItems?.find((item) => item?.product === orderItem.product)
            if (itemOrder) {
                itemOrder.amount += orderItem?.amount
            } else {
                state?.orderItems.push(orderItem)
            }
        },
        removeOrderProduct: (state, action) => {
            const { idProduct } = action.payload
            const itemOrder = state?.orderItems?.find((item) => item?.product !== idProduct)
            itemOrder.orderItems = itemOrder
        },
    },
})

export const { addOrderProduct } = orderSlide.actions;

export default orderSlide.reducer;