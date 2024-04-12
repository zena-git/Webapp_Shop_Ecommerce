import classNames from 'classnames/bind';
import { Spin } from 'antd';
import { useState, useEffect, useContext } from "react";
import DataContext from "~/DataContext";
import { LoadingOutlined } from '@ant-design/icons';

import styles from './Content.module.scss';
const cx = classNames.bind(styles);

function Content({ children }) {
    const { loading, } = useContext(DataContext);

    return (<>
        <div className={cx('container')}>
            {children}
            <div>
                {loading && (
                    <div
                        style={{
                            position: 'fixed',
                            top: '0',
                            left: '0',
                            bottom: '0',
                            right: '0',
                            backgroundColor: 'rgba(146, 146, 146, 0.22)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 1,
                        }}
                    >
                        <LoadingOutlined className='text-6xl text-rose-500	'/>
                    </div>
                )}
            </div>
        </div>
    </>);
}

export default Content;