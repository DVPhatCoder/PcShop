import { Menu } from 'antd'
import React, { useState } from 'react'
import { LaptopOutlined, UserOutlined, } from '@ant-design/icons'; // Import thêm biểu tượng
import Sider from 'antd/es/layout/Sider';
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent';
import AdminProduct from '../../components/AdminProduct/AdminProduct';
import AdminUser from '../../components/AdminUser/AdminUser';

const AdminPage = () => {
    const [KeySelected, setKeySelected] = useState(' ')
    const renderPage = (key) => {
        switch (key) {
            case 'user':
                return (
                    <AdminUser />
                )
            case 'products':
                return (
                    <AdminProduct />
                )
            default:
                return <></>
        }

    }
    const items = [
        {
            key: 'user',
            icon: <UserOutlined />, // Biểu tượng User
            label: 'Người dùng',
        },
        {
            key: 'products',
            icon: <LaptopOutlined />, // Biểu tượng Laptop
            label: 'Sản phẩm',
        },
    ];
    const handleOnClick = ({ key }) => {
        setKeySelected(key)
    }
    return (
        <>
            <HeaderComponent isHiddenSearch isHiddenCart />
            <div style={{ display: 'flex' }}> {/* Sử dụng flexbox */}
                <Sider
                    width={256}
                    style={{
                        boxShadow: '1px 1px 2px #ccc',
                        background: 'white', // Có thể thay đổi màu nền
                    }}
                >
                    <Menu
                        mode="inline"
                        style={{
                            height: '100%',
                            borderRight: 0,
                        }}
                        onClick={handleOnClick}
                        items={items}
                    />
                </Sider>
                <div style={{ padding: '20px', flex: 1 }}> {/* Nội dung bên cạnh Sider */}
                    {renderPage(KeySelected)}
                </div>
            </div>
        </>


    );
};

export default AdminPage;
