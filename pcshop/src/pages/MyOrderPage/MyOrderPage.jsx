import Loading from '../../components/LoadingComponent/Loading';
import * as OrderServices from '../../services/OrderServices'
import React, { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query';
import { WrapperContainer, WrapperItemOrder, WrapperListOrder, WrapperStatus, WrapperHeaderItem, WrapperFooterItem, WrapperStyleHeaderDilivery } from './style';
import { convertPrice } from '../../util'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutationHooks } from '../../hooks/useMutationHook';
import * as Message from '../../components/Message/Message'
const MyOrderPage = () => {
    const location = useLocation()
    const { state } = location
    const navigate = useNavigate()

    const fetchMyOrder = async () => {
        const res = await OrderServices.getAllOrderUserDetails(state?.id, state?.token)
        return res.data
    }
    const queryOrder = useQuery({
        queryKey: ['orders'], // Khóa duy nhất cho query
        queryFn: fetchMyOrder, // Hàm fetch dữ liệu
        enabled: !!state?.id && !!state?.token // Chỉ thực hiện query nếu id và access_token hợp lệ
    });

    const handleDetailsOrder = (id) => {
        navigate(`/details-order/${id}`, {
            state: {
                token: state?.token,
            }
        });
    }
    const { isPending, data } = queryOrder
    console.log('data', data)
    const mutation = useMutationHooks(
        (data) => {
            const { id, token } = data
            const res = OrderServices.cancelOrder(id, token)
            return res
        }
    )

    const handleCancelOrder = (id) => {
        mutation.mutate({ id, token: state?.token }, {
            onSuccess: () => {
                queryOrder.refetch(); // Refetch lại dữ liệu sau khi xóa thành công
            },
        });
    };


    const { isPending: isLoadingCancel, isSuccess: isSuccessCanel, isError: isErrorCancel, data: dataCancel } = mutation
    useEffect(() => {
        if (isSuccessCanel && dataCancel?.status === 'thành công') {
            Message.success('Đơn hàng đã được hủy thành công!');
        } else if (isErrorCancel) {
            Message.error('Hủy đơn hàng thất bại. Vui lòng thử lại!');
        }
    }, [isSuccessCanel, isErrorCancel, dataCancel]);
    return (
        <Loading isPending={isPending || isLoadingCancel}>
            <WrapperContainer >
                <div style={{ height: '100%', width: '1270px', margin: '0 auto', }}>
                    <h4>Đơn hàng của tôi</h4>
                    <WrapperListOrder>
                        {data?.map((order) => {
                            console.log('order', order)
                            return (
                                <WrapperItemOrder key={order?._id} style={{ alignItems: 'normal', }}>
                                    <WrapperStatus style={{ fontWeight: 400 }}>
                                        <span style={{ fontSize: '14px', fontWeight: 'bold', }}>Trạng thái</span>
                                        <WrapperStyleHeaderDilivery><span style={{ color: '#242424', marginBottom: '4px', fontSize: '13px', fontWeight: 'bold', padding: '9px 16px', alignItems: 'center', display: 'flex', }}>Giao hàng:</span>{`${order?.isDelivered ? 'Đã giao hàng' : 'Chưa giao hàng'}`}</WrapperStyleHeaderDilivery>
                                        <WrapperStyleHeaderDilivery><span style={{ color: '#242424', marginBottom: '4px', fontSize: '13px', fontWeight: 'bold', padding: '9px 16px', alignItems: 'center', display: 'flex', }}>Thanh toán:</span>{`${order?.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}`}</WrapperStyleHeaderDilivery>
                                    </WrapperStatus>
                                    {order?.orderItems?.map((item) => (
                                        <WrapperHeaderItem style={{ alignItems: 'center' }} key={item?._id}>
                                            <img
                                                src={item?.image}
                                                alt={item?.name}
                                                style={{
                                                    width: '70px',
                                                    height: '70px',
                                                    objectFit: 'cover',
                                                    padding: '2px',
                                                    border: '1px solid rgb(238,238,238)'
                                                }}
                                            />
                                            <div style={{ width: '260px', overflow: 'hidden', textOverFlow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: '10px' }}>
                                                {item?.name}
                                            </div>
                                            <div style={{ width: '260px', overflow: 'hidden', textOverFlow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: '10px' }}><span>Số lượng:</span>
                                                {item?.amount}
                                            </div>
                                            <span style={{ fontSize: '13px', color: '#242424', marginLeft: 'auto' }}>{convertPrice(item?.price)}</span>
                                        </WrapperHeaderItem>
                                    ))}
                                    <WrapperFooterItem style={{ flexDirection: 'column', alignItems: 'flex-end', justifyItems: 'center' }}>
                                        <div>
                                            <span style={{ color: 'red', fontSize: '13px', fontWeight: '700' }}>
                                                Tổng Tiền:
                                            </span>
                                            <span style={{ fontSize: '13px', color: 'rgb(56,56,61)', fontWeight: '700' }}>
                                                {convertPrice(order?.totalPrice)}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <ButtonComponent
                                                onClick={() => handleCancelOrder(order?._id)}
                                                size={40}
                                                styleButton={{
                                                    height: '36px',
                                                    border: '1px solid rgb(11,116,229)',
                                                    borderRadius: '5px',
                                                    opacity: isLoadingCancel ? 0.6 : 1, // Hiệu ứng mờ khi đang tải
                                                }}
                                                textButton={isLoadingCancel ? 'Đang hủy...' : 'Hủy đơn hàng'}
                                                styleTextButton={{ color: 'rgb(11,116,229)', fontSize: '14px' }}
                                                disabled={isLoadingCancel} // Vô hiệu hóa khi đang xử lý
                                            />


                                            <ButtonComponent
                                                onClick={() => handleDetailsOrder(order?._id)} // Thêm sự kiện onClick
                                                size={40}
                                                styleButton={{
                                                    height: '36px',
                                                    border: '1px solid rgb(11,116,229)',
                                                    borderRadius: '5px',
                                                }}
                                                textButton={'Xem chi tiết'}
                                                styleTextButton={{ color: 'rgb(11,116,229)', fontSize: '14px' }} // Đúng format fontSize
                                            />
                                        </div>

                                    </WrapperFooterItem>
                                </WrapperItemOrder>
                            )
                        })
                        }
                    </WrapperListOrder>
                </div>
            </WrapperContainer>
        </Loading >
    )
}
export default MyOrderPage