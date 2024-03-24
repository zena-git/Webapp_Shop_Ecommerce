import React, { useEffect, useState, useMemo } from 'react';
import { LoadingOutlined, SmileOutlined, SolutionOutlined, UserOutlined } from '@ant-design/icons';
import { Steps, Button } from 'antd';
import { useParams } from 'react-router-dom'
import { IoMdArrowBack } from "react-icons/io";
import axios from 'axios';
import { baseUrl } from '../../lib/functional'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "~/components/ui/table"
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
const App = () => {
    const path = useParams();

    const [targetOrder, setTargetOrder] = useState();
    const [lstHistoryBill, setLstHistoryBill] = useState([])
    const [lstBillDetails, setBillDetails] = useState([])

    useEffect(() => {
        if (path.id) {
            axios.get(`${baseUrl}/bill/${path.id}`).then(res => {
                setTargetOrder(res.data)
            })
            axios.get(`${baseUrl}/historyBill/bill/${path.id}`).then(res => {
                setLstHistoryBill(res.data)
            })
            axios.get(`${baseUrl}/billDetails/bill/${path.id}`).then(res => {
                setBillDetails(res.data)
            })
        }
    }, [path.id])

    const handleNext = () => {

    }


    return (
        <div className='flex flex-col gap-3'>
            <div className='flex justify-between'>
                <div className='flex items-center gap-2'>
                    <div className='text-xl font-bold'><IoMdArrowBack /></div>
                    <p className='text-lg font-bold'>Mã đơn hàng</p>
                    <p className='text-lg'>{targetOrder && targetOrder.codeBill}</p>
                </div>
                <div className='flex gap-2'>
                    <button onClick={handleNext} className='px-2 py-1 bg-purple-500 text-sm font-semibold text-slate-100 border border-slate-700 rounded-sm'>Chủ động xác nhận</button>
                    <button className='px-2 py-1 bg-green-500 text-sm font-semibold text-slate-100 border border-slate-700 rounded-sm'>Chấp nhận</button>
                    <button className='px-2 py-1 bg-red-500 text-sm font-semibold text-slate-100 border border-slate-700 rounded-sm'>Từ chối</button>
                </div>
            </div>
            <div className='px-3 pb-2 pt-5 rounded-md bg-white'>
                <Steps
                    items={
                        [...lstHistoryBill.map(history => {
                            return {
                                title: history.lastModifiedDate | history.createdDate,
                                status: 'finish',
                                icon: <UserOutlined />,
                                description: history.description
                            }
                        }), {
                            icon: <UserOutlined />,
                            status: 'wait',
                            title: 'Đang chờ',
                            description: ''
                        }]

                    }
                />
            </div>
            <CustomerBlock targetOrder={targetOrder} />
            <div className='bg-white p-3 rounded-md'>
                <RenderTable lstBillDetail={lstBillDetails} />
            </div>
        </div>
    )
}


const CustomerBlock = ({ targetOrder }) => {
    if (targetOrder) {
        if (targetOrder.customer) {
            return (
                <div className='flex w-full bg-white px-3 py-5 rounded-md'>
                    <div className='w-1/2'>
                        <p>Thông tin khách hàng</p>
                        <div className='flex gap-3 items-center'>
                            <img className='w-16 aspect-square rounded-full' alt='' src={targetOrder.customer.imageUrl} />
                            <div className='flex flex-col gap-2'>
                                <p>{targetOrder.customer.fullName}</p>
                                <p>{targetOrder.customer.phone}</p>
                            </div>
                        </div>
                    </div>
                    <div className='flex-grow'>
                        <p>Thông tin đơn hàng</p>
                        <div>
                            <p>Tổng tiền: {targetOrder.totalMoney}</p>
                            <p>Hình thức: {targetOrder.billType}</p>
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <div className='w-full bg-white px-3 py-2'>
                    <div className='flex-grow'>
                        <p className='text-lg font-bold mb-3'>Thông tin đơn hàng</p>
                        <div>
                            <p className='text-slate-800 font-semibold text-base'>Tổng tiền: {targetOrder.totalMoney}</p>
                            <p className='text-slate-800 font-semibold text-base'>Hình thức: {targetOrder.billType}</p>
                        </div>
                    </div>
                </div>
            )
        }
    }
}


const RenderTable = ({ lstBillDetail }) => {
    const [sorting, setSorting] = useState([])
    const [columnFilters, setColumnFilters] = useState([])
    const [columnVisibility, setColumnVisibility] = useState({})
    const [rowSelection, setRowSelection] = useState({})

    const columns = useMemo(() => [
        {
            accessorKey: "id",
            header: "id",
            cell: ({ row }) => (
                <div className="capitalize">{row.original.id}</div>
            ),
        },
        {
            accessorKey: "productDetails",
            header: ({ column }) => <div className="text-center">tên sản phẩm</div>,
            cell: ({ row }) => <div className="lowercase">{row.original.productDetails.product.name}</div>,
        },
        {
            accessorKey: "productDetails",
            header: () => <div className="text-center">phân loại</div>,
            cell: ({ row }) => {
                return <div className='text-center'>
                    {"[ " + row.original.productDetails.color.name + " - " + row.original.productDetails.size.name + " ]"}
                </div>
            },
        },
        {
            accessorKey: "quantity",
            header: () => <div className="text-center">số lượng</div>,
            cell: ({ row }) => {
                return <div className="text-center font-medium max-h-16">
                    {row.original.quantity}
                </div>
            },
        },
        {
            accessorKey: "unitPrice",
            header: () => <div className="text-center">giá mua</div>,
            cell: ({ row }) => {
                return <div className="text-center font-medium max-h-16">
                    {row.original.unitPrice}
                </div>
            },
        },
    ], []);

    const table = useReactTable({
        data: lstBillDetail,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })


    return (
        <Table>
            <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                            return (
                                <TableHead key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </TableHead>
                            )
                        })}
                    </TableRow>
                ))}
            </TableHeader>
            <TableBody>
                {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                        <TableRow
                            key={row.id}
                            data-state={row.getIsSelected() && "selected"}
                        >
                            {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id}>
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell
                            colSpan={columns.length}
                            className="h-24 text-center"
                        >
                            No results.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    )
}

export default App;