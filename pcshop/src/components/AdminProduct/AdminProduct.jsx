import React, { useEffect, useState } from 'react'
import { WrapperHeader } from './style'
import { Button, Form } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import TableComponent from '../TableComponent/TableComponent';
import InputComponent from '../InputComponent/InputComponent';
import { getBase64 } from '../../util';
import { WrapperUploadFile } from '../../pages/ProfilePage/style';
import * as ProductServices from '../../services/ProductServices'
import { useMutationHooks } from '../../hooks/useMutationHook'
import Loading from '../LoadingComponent/Loading';
import * as Message from '../../components/Message/Message'
import { useQuery } from '@tanstack/react-query';
import { DrawComponent } from '../DrawComponent/DrawComponent';
import { useSelector } from 'react-redux';
import { ModalComponent } from '../ModalComponent/ModalComponent';

const AdminProduct = () => {
    const user = useSelector((state) => state?.user)
    const [rowSelected, setRowSelected] = useState('')
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)
    const [isOpenDraw, setIsOpenDraw] = useState(false)
    const [isPendingUpdate, setIsPendingUpdate] = useState(false)
    const [stateProduct, setStateProduct] = useState({
        name: '',
        type: '',
        price: '',
        image: '',
        countInStock: '',
        rating: '',
        description: '',
    })
    const [stateProductDetail, setStateProductDetail] = useState({
        name: '',
        type: '',
        price: '',
        image: '',
        countInStock: '',
        rating: '',
        description: '',
    })
    const [form] = Form.useForm();
    const mutation = useMutationHooks(
        async (data) => {
            try {
                const {
                    name,
                    image,
                    type,
                    price,
                    rating,
                    description,
                    countInStock
                } = data;
                const res = await ProductServices.createProduct({
                    name,
                    image,
                    type,
                    price,
                    rating,
                    description,
                    countInStock
                });
                return res;
            } catch (error) {
                console.error("Lỗi khi tạo sản phẩm:", error.response?.data || error.message);
            }

        }
    );

    const mutationUpdate = useMutationHooks(
        async (data) => {
            try {
                const { id, token, ...rests } = data;
                const res = await ProductServices.updateProduct(id, { ...rests }, token);
                return res;
            } catch (error) {
                console.error("Lỗi khi update sản phẩm:", error.response?.data || error.message);
            }
        }

    );

    const mutationDeleted = useMutationHooks(
        async (data) => {
            try {
                const { id, token } = data;
                const res = await ProductServices.deleteProduct(id, token);
                return res;
            } catch (error) {
                console.error("Lỗi khi xóa sản phẩm:", error.response?.data || error.message);
            }
        }
    );
    const handleOnChange = (e) => {
        setStateProduct({
            ...stateProduct,
            [e.target.name]: e.target.value
        });
    };

    const handleOnChangeDetail = (e) => {
        setStateProductDetail({
            ...stateProductDetail,
            [e.target.name]: e.target.value
        });
    };

    const getAllProduct = async () => {
        const res = await ProductServices.getAllProduct()
        return res
    }

    const fetchGetDetailsProduct = async (rowSelected) => {
        const res = await ProductServices.getDetailsProduct(rowSelected);
        if (res?.data) {
            setStateProductDetail({
                name: res?.data?.name,
                type: res?.data?.type,
                price: res?.data?.price,
                countInStock: res?.data?.countInStock,
                description: res?.data?.description,
                rating: res?.data?.rating,
                image: res?.data?.image,
            })
        }
        setIsPendingUpdate(false)
    }

    useEffect(() => {
        form.setFieldsValue(stateProductDetail)
    }, [form, stateProductDetail])

    useEffect(() => {
        if (rowSelected) {
            fetchGetDetailsProduct(rowSelected)
        }
    }, [rowSelected])

    const handleDetailsProduct = () => {
        setIsOpenDraw(true)
    }

    const { data, isPending, isSuccess, isError } = mutation
    const { data: dataUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated, isPending: isPendingUpdated } = mutationUpdate
    const { data: dataDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted, isPending: isPendingDeleted } = mutationDeleted
    const queryProduct = useQuery({ queryKey: ['products'], queryFn: getAllProduct });
    const { data: products, isPending: isLoadingProducts } = queryProduct
    const renderAction = () => {
        return (
            <div style={{ fontSize: '25px', cursor: 'pointer' }}>
                <DeleteOutlined style={{ color: 'red' }} onClick={() => setIsModalOpenDelete(true)} />
                <EditOutlined style={{ padding: '0 10px', color: 'blue' }} onClick={handleDetailsProduct} />
            </div>
        )
    }
    const columns = [
        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Giá sản phẩm',
            dataIndex: 'price',
        },
        {
            title: 'Loại',
            dataIndex: 'type',
        },
        {
            title: 'Tồn kho',
            dataIndex: 'countInStock',
        },

        {
            title: 'Đánh giá',
            dataIndex: 'rating',
        },
        // {
        //     title: 'Mô tả',
        //     dataIndex: 'description',
        // },
        {
            title: 'Action',
            dataIndex: 'action',
            render: renderAction
        },
    ];
    const dataTable = products?.data?.length && products?.data?.map((product) => {
        return {
            ...product, key: product._id
        }
    })
    useEffect(() => {
        if (isSuccess) {
            Message.success('Tạo sản phẩm thành công!');
            handleCancel();
        } else if (isError) {
            Message.error('Có lỗi xảy ra khi tạo!');
        }
    }, [isSuccess, isError, data])

    useEffect(() => {
        if (isSuccessUpdated) {
            Message.success('Update sản phẩm thành công!');
            handleCloseDrawer();
        } else if (isErrorUpdated) {
            Message.error('Có lỗi xảy ra khi update!');
        }
    }, [isSuccessUpdated, isErrorUpdated, dataUpdated]);

    useEffect(() => {
        if (isSuccessDeleted) {
            Message.success('Xóa sản phẩm thành công!');
            handleCancelDelete();
        } else if (isErrorDeleted) {
            Message.error('Có lỗi xảy ra khi xóa!');
        }
    }, [isSuccessDeleted, isErrorDeleted, dataDeleted]);




    const handleCloseDrawer = () => {
        setIsOpenDraw(false);
        setStateProductDetail({
            name: '',
            type: '',
            price: '',
            image: '',
            countInStock: '',
            rating: '',
            description: '',
        })
        form.resetFields()
    };
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleCancel = () => {
        setIsModalOpen(false);
        setStateProduct({
            name: '',
            type: '',
            price: '',
            image: '',
            countInStock: '',
            rating: '',
            description: '',
        })
        form.resetFields()
    };
    const handleCancelDelete = () => {
        setIsModalOpenDelete(false)
    }
    const handleDeleteProduct = () => {
        mutationDeleted.mutate({ id: rowSelected, token: user?.access_token }, {
            onSettled: () => {
                queryProduct.refetch()
            }
        })
    }
    const onFinish = () => {
        mutation.mutate(stateProduct, {
            onSettled: () => {
                queryProduct.refetch()
            }
        })
    };

    const handleOnchangeAvatar = async ({ fileList }) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateProduct({
            ...stateProduct,
            image: file.preview
        });
    }

    const handleOnchangeAvatarDetail = async ({ fileList }) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateProductDetail({
            ...stateProductDetail,
            image: file.preview
        });
    }

    const onUpdateProduct = () => {
        mutationUpdate.mutate({
            id: rowSelected,
            token: user?.access_token,
            ...stateProductDetail
        }, {
            onSettled: () => {
                queryProduct.refetch()
            }
        });
    };
    return (
        <div>
            <div>
                <WrapperHeader>Quản lý sản phẩm</WrapperHeader>
                <div style={{ margin: '10px' }}>
                    <Button style={{ height: '150px', width: '150px', borderRadius: '6px', borderStyle: 'dashed' }} onClick={() => setIsModalOpen(true)}><PlusOutlined style={{ fontSize: '50px' }} /> </Button>
                </div>
                <div style={{ margin: '15px' }}>
                    <TableComponent columns={columns} isPending={isLoadingProducts} data={dataTable} onRow={(record, rowIndex) => {
                        return {
                            onClick: (event) => {
                                setRowSelected(record._id)
                            }, // click row
                        }
                    }} />
                </div>
                <ModalComponent title="Tạo sản phẩm" open={isModalOpen} onCancel={handleCancel} footer={null}>
                    <Loading isPending={isPending}>
                        <Form
                            name="basic"
                            labelCol={{
                                span: 6,
                            }}
                            wrapperCol={{
                                span: 18,
                            }}
                            style={{
                                maxWidth: 600,
                            }}
                            onFinish={onFinish}
                            autoComplete="off"
                            form={form}
                        >
                            <Form.Item
                                label="Tên Sản phẩm"
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập tên Sản phẩm!',
                                    },
                                ]}
                            >
                                <InputComponent value={stateProduct.name} onChange={handleOnChange} name="name" />
                            </Form.Item>

                            <Form.Item
                                label="Loại sản phẩm"
                                name="type"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập Loại sản phẩm!',
                                    },
                                ]}
                            >
                                <InputComponent value={stateProduct.type} onChange={handleOnChange} name="type" />
                            </Form.Item>
                            <Form.Item
                                label="Giá sản phẩm"
                                name="price"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập giá sản phẩm!',
                                    },
                                ]}
                            >
                                <InputComponent value={stateProduct.price} onChange={handleOnChange} name="price" />
                            </Form.Item>
                            <Form.Item
                                label="SP còn trong kho"
                                name="countInStock"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập sản phẩm còn trong kho!',
                                    },
                                ]}
                            >
                                <InputComponent value={stateProduct.countInStock} onChange={handleOnChange} name="countInStock" />
                            </Form.Item>
                            <Form.Item
                                label="Mô tả"
                                name="description"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập mô tả!',
                                    },
                                ]}
                            >
                                <InputComponent value={stateProduct.description} onChange={handleOnChange} name="description" />
                            </Form.Item>
                            <Form.Item
                                label="Đánh giá"
                                name="rating"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập đánh giá!',
                                    },
                                ]}
                            >
                                <InputComponent value={stateProduct.rating} onChange={handleOnChange} name="rating" />
                            </Form.Item>
                            <Form.Item
                                label="Ảnh sản phẩm"
                                name="image"
                                rules={[{ required: true, message: 'Vui lòng tải lên ảnh sản phẩm!' }]}>
                                <WrapperUploadFile onChange={handleOnchangeAvatar} maxCount={1}>
                                    <Button>Upload</Button>
                                    {stateProduct?.image && (
                                        <img src={stateProduct?.image} style={{
                                            height: '100px',
                                            width: '100px',
                                            objectFit: 'cover',
                                            margin: '0 10px',
                                        }} alt="avatar" />
                                    )}
                                </WrapperUploadFile>
                            </Form.Item>
                            <Form.Item
                                wrapperCol={{
                                    offset: 6,
                                    span: 16,
                                }}
                            >
                                <Button type="primary" htmlType="submit">
                                    Submit
                                </Button>
                            </Form.Item>
                        </Form>
                    </Loading>
                </ModalComponent>
                <DrawComponent title='Chi tiết sản phẩm' isOpen={isOpenDraw} onClose={() => setIsOpenDraw(false)} width="83%">
                    <Loading isPending={isPendingUpdate || isPendingUpdated}>
                        <Form
                            name="basic"
                            labelCol={{
                                span: 5,
                            }}
                            wrapperCol={{
                                span: 16,
                            }}
                            onFinish={onUpdateProduct}
                            autoComplete="off"
                            form={form}
                        >
                            <Form.Item
                                label="Tên Sản phẩm"
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập tên Sản phẩm!',
                                    },
                                ]}
                            >
                                <InputComponent value={stateProductDetail.name} onChange={handleOnChangeDetail} name="name" />
                            </Form.Item>

                            <Form.Item
                                label="Loại sản phẩm"
                                name="type"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập Loại sản phẩm!',
                                    },
                                ]}
                            >
                                <InputComponent value={stateProductDetail.type} onChange={handleOnChangeDetail} name="type" />
                            </Form.Item>
                            <Form.Item
                                label="Giá sản phẩm"
                                name="price"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập giá sản phẩm!',
                                    },
                                ]}
                            >
                                <InputComponent value={stateProductDetail.price} onChange={handleOnChangeDetail} name="price" />
                            </Form.Item>
                            <Form.Item
                                label="SP còn trong kho"
                                name="countInStock"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập sản phẩm còn trong kho!',
                                    },
                                ]}
                            >
                                <InputComponent value={stateProductDetail.countInStock} onChange={handleOnChangeDetail} name="countInStock" />
                            </Form.Item>
                            <Form.Item
                                label="Mô tả"
                                name="description"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập mô tả!',
                                    },
                                ]}
                            >
                                <InputComponent value={stateProductDetail.description} onChange={handleOnChangeDetail} name="description" />
                            </Form.Item>
                            <Form.Item
                                label="Đánh giá"
                                name="rating"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập đánh giá!',
                                    },
                                ]}
                            >
                                <InputComponent value={stateProductDetail.rating} onChange={handleOnChangeDetail} name="rating" />
                            </Form.Item>
                            <Form.Item
                                label="Ảnh sản phẩm"
                                name="image"
                                rules={[{ required: true, message: 'Vui lòng tải lên ảnh sản phẩm!' }]}>
                                <WrapperUploadFile onChange={handleOnchangeAvatarDetail} maxCount={1}>
                                    <Button>Upload</Button>
                                    {stateProductDetail?.image && (
                                        <img src={stateProductDetail?.image} style={{
                                            height: '100px',
                                            width: '100px',
                                            objectFit: 'cover',
                                            margin: '0 10px',
                                        }} alt="avatar" />
                                    )}
                                </WrapperUploadFile>
                            </Form.Item>
                            <Form.Item
                                wrapperCol={{
                                    offset: 5,
                                    span: 16,
                                }}
                            >
                                <Button type="primary" htmlType="submit">
                                    Apply
                                </Button>
                            </Form.Item>
                        </Form>
                    </Loading>
                </DrawComponent>
                <ModalComponent title="Xóa sản phẩm" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteProduct}>
                    <Loading isPending={isPendingDeleted}>
                        <div>Bạn có muốn xóa sản phẩm này không?</div>
                    </Loading>
                </ModalComponent>
            </div>
        </div>
    )
}

export default AdminProduct