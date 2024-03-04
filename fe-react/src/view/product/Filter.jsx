
import { HomeOutlined, UserOutlined } from '@ant-design/icons';
import React from 'react';
import { Breadcrumb } from 'antd';
function Filter() {
    return (
        <>

            <div>
                <div style={{
                    padding: "0 15px"
                }}>
                    <Breadcrumb
                        items={[
                            {
                                href: '',
                                title: <HomeOutlined />,
                            },
                            {
                                href: '',
                                title: (
                                    <>
                                        <UserOutlined />
                                        <span>Application List</span>
                                    </>
                                ),
                            },
                            {
                                title: 'Application',
                            },
                        ]}
                    /></div>
            </div>
        </>
    );
}

export default Filter;
