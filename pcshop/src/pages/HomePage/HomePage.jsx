import React, { useEffect, useRef, useState } from 'react'
import TypeProduct from '../../components/TypeProduct/TypeProduct'
import { WrapperButtonMore, WrapperProducts, WrapperTypeProduct } from './style'
import SliderComponent from '../../components/SliderComponent/SliderComponent'
import slider1 from '../../assets/images/slider1.jpg'
import slider2 from '../../assets/images/slider2.jpg'
import slider3 from '../../assets/images/slider3.png'
import CardComponent from '../../components/CardComponent/CardComponent'
import * as ProductServices from '../../services/ProductServices'
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux'
import Loading from '../../components/LoadingComponent/Loading'
import { useDebounce } from '../../hooks/useDebounce'


const HomePage = () => {
    const [limit, setLimit] = useState(12)
    const searchProduct = useSelector((state) => state?.product?.search)
    const searchDebounce = useDebounce(searchProduct, 500)
    const arr = ['Lenovo', 'Hp', 'Lap Top']
    const fetchProductAll = async (context) => {
        console.log('context', context)
        const limit = context?.queryKey && context?.queryKey[1]
        const search = context?.queryKey && context?.queryKey[2]
        const res = await ProductServices.getAllProduct(search, limit)
        return res
    }

    const { data: products, isLoading, isPreviousData, } = useQuery({
        queryKey: ['products', limit, searchDebounce],   // Sử dụng mảng cho khóa query
        queryFn: fetchProductAll, // Hàm để fetch dữ liệu
        retry: 3,
        retryDelay: 1000,
        keepPreviousData: true
    });

    return (
        <Loading isPending={isLoading}>
            <div style={{ width: '1270px', margin: '0 auto' }}>
                <WrapperTypeProduct>
                    {arr.map((item) => {
                        return (
                            <TypeProduct name={item} key={item} />
                        )
                    })}
                </WrapperTypeProduct >
            </div>
            <div className='body' style={{ width: '100%', backgroundColor: '#efefef' }}>
                <div id="container" style={{ margin: '0 auto', height: '1000px', width: '1270px' }} >
                    <SliderComponent arrImages={[slider1, slider2, slider3]} />
                    <WrapperProducts>
                        {products?.data?.map((products) => {
                            return (
                                <CardComponent
                                    key={products._id}
                                    countInStock={products.countInStock}
                                    description={products.description}
                                    image={products.image}
                                    name={products.name}
                                    price={products.price}
                                    rating={products.rating}
                                    type={products.type}
                                    discount={products.Number}
                                    selled={products.Number}
                                />
                            )
                        })}
                    </WrapperProducts>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                        <WrapperButtonMore
                            textButton={isPreviousData ? 'Tải thêm' : "Xem Thêm"} type="outline"
                            styleButton={{
                                border: '1px solid rgb(11, 116, 229)', borderRadius: '4px',
                                color: `${products?.total === products?.data?.length ? '#ccc' : 'rgb(11, 116, 229)'}`, with: '240px', height: '38px',
                            }}
                            disabled={products?.total === products?.data?.length || products?.totalPage === 1}
                            styleTextButton={{ fontWeight: 600, color: products?.total === products?.data?.length && '#fff' }}
                            onClick={() => setLimit((prev) => prev + 6)}
                        />
                    </div>
                </div>
            </div>

        </Loading>
    )
}

export default HomePage