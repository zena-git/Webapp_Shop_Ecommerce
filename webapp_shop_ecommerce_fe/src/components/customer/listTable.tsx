import { Select, Input, Button, Modal } from 'antd/lib'
import { useState, useEffect, useMemo } from "react"
import {
    CaretSortIcon,
    DotsHorizontalIcon,
} from "@radix-ui/react-icons"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { CustomerResponse } from "~/lib/type"
import { useAppSelector } from '~/redux/storage'
import { useDispatch } from "react-redux";
import axios from 'axios'
import { baseUrl, baseUrlV3 } from '~/lib/functional'
import { Link, useNavigate } from 'react-router-dom'
import Table from '../../components/ui/table'
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa'
import { ToastContainer, toast } from 'react-toastify'
import ListDeleted from './listDeleted'
import { set } from '../../redux/features/voucher-deleted'

export default function ListTable() {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({});

    const [listCustomer, setListCustomer] = useState<CustomerResponse[]>([]);
    const [deletedData, setDeletedData] = useState<CustomerResponse[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const selectedCustomer = useAppSelector((state) => state.voucherDeletedReducer.value.selected)

    const fillData = () => {
        axios.get(`${baseUrl}/customer`).then(res => { setListCustomer(res.data) })
    }

    const fillDeletedData = () => {
        axios.get(`${baseUrlV3}/customer/deleted`).then(res => { setDeletedData(res.data) })
    }

    useEffect(() => {
        fillData();
        fillDeletedData();
    }, [])


    const columns: ColumnDef<CustomerResponse>[] = useMemo(() => [
        {
            id: "index",
            header: () => <div className="text-center">#</div>,
            cell: ({ row }) => {
                return <div className='flex justify-center'>{row.index + 1}</div>
            },
        },
        {
            accessorKey: "fullName",
            header: ({ column }) => {
                return (
                    <div
                        className='flex items-center min-h-10 justify-center'
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Họ và Tên
                        <CaretSortIcon className="ml-2 h-4 w-4" />
                    </div>
                )
            },
            cell: ({ row }) => <div className="lowercase">{row.getValue("fullName")}</div>,
        },
        {
            accessorKey: "phone",
            header: () => <div className="text-center">Số điện thoại</div>,
            cell: ({ row }) => {
                return <div className='flex justify-center'>{row.original.phone}</div>
            },
        },
        {
            accessorKey: "email",
            header: () => <div className="text-center">Email</div>,
            cell: ({ row }) => {
                return <div className='flex justify-center'>{row.original.email}</div>
            },
        },
        {
            accessorKey: "birthday",
            header: () => <div className="text-center">Ngày sinh</div>,
            cell: ({ row }) => {
                return <div className='flex justify-center'>{row.original.birthday ? row.original.birthday.toString().split("T")[0] : ''}</div>
            },
        },
        {
            id: "hành động",
            enableHiding: false,
            header: () => <div className="text-center">Hành động</div>,
            cell: ({ row }) => {
                return (
                    <div className="flex items-center gap-2 justify-center">
                        <Button type='primary' className='flex items-center' onClick={() => { navigate(`/user/customer/update/${row.original.id}`) }}><FaEdit /></Button>
                        <Button type='primary' className='flex items-center' onClick={() => { navigate(`/user/customer/detail/${row.original.id}`) }}><FaEye /></Button>
                        <Button type='primary' className='flex items-center' onClick={() => { setIsModalOpen(true) }}><FaTrash /></Button>
                        <Modal
                            title="Xác nhận"
                            open={isModalOpen}
                            onOk={() => {
                                setIsModalOpen(false)
                                axios.delete(`${baseUrl}/customer/${row.original.id}`).then(res => {
                                    fillData();
                                    fillDeletedData();
                                    toast.success('xóa thành công')
                                })
                            }}
                            onCancel={() => { setIsModalOpen(false) }}
                            okText="xác nhận"
                            cancelText="hủy"
                        >
                            Xác nhận xóa
                        </Modal>
                    </div>
                )
            },
        },
    ], [setIsModalOpen, isModalOpen]);

    const table = useReactTable({
        data: listCustomer,
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

    const Recover = () => {
        const handleOk = () => {
            const promises = selectedCustomer.map(slt => {
                return axios.put(`${baseUrlV3}/customer/recover?id=${slt.id}`)
            })
            Promise.all(promises).then(() => {
                fillData();
                fillDeletedData();
                setOpenModal(false);
            }).catch(() => {

            })

        };
        const handleCancel = () => {
            setOpenModal(false);
        };

        return (
            <>
                <Button onClick={() => setOpenModal(true)} variant="outline" className="bg-blue-500 text-white hover:bg-blue-400 hover:text-white">Khách hàng đã xóa</Button>
                <Modal title="Khôi phục lại" open={openModal} onOk={handleOk} onCancel={handleCancel} className='min-w-[60vw]'>
                    <ListDeleted data={deletedData} />
                </Modal>
            </>
        );
    }

    return (
        <>
            <div className="w-full rounded-md bg-white p-6 flex flex-col gap-3">
                <ToastContainer />
                <div className='flex justify-between items-center'>
                    <p className='text-xl font-bold'>Khách hàng</p>
                </div>
                <div className='bg-slate-600 h-[2px]'></div>
                <div className='bg-slate-50 rounded-md mb-3 p-3 shadow-md'>
                    <div className='grid grid-cols-2 gap-3 my-3'>
                        <div>
                            <p className='font-semibold mb-1'>Họ và tên</p>
                            <Input
                                placeholder="tìm kiếm theo tên"
                                value={(table.getColumn("fullName")?.getFilterValue() as string) ?? ""}
                                onChange={(event) =>
                                    table.getColumn("fullName")?.setFilterValue(event.target.value)
                                }
                                className="max-w-md"
                            />
                        </div>
                        <div>
                            <p className='font-semibold mb-1'>Email</p>
                            <Input
                                placeholder="tìm kiếm theo email"
                                value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
                                onChange={(event) =>
                                    table.getColumn("email")?.setFilterValue(event.target.value)
                                }
                                className="max-w-md"
                            />
                        </div>
                        <div>
                            <p className='font-semibold mb-1'>Số điện thoại</p>
                            <Input
                                placeholder="tìm kiếm theo số điện thoại"
                                value={(table.getColumn("phone")?.getFilterValue() as string) ?? ""}
                                onChange={(event) =>
                                    table.getColumn("phone")?.setFilterValue(event.target.value)
                                }
                                className="max-w-md"
                            />
                        </div>
                    </div>
                    <div className='flex gap-2 items-center'>
                        <Button onClick={() => { navigate('/user/customer/add') }} variant="outline" className="bg-blue-500 text-white hover:bg-blue-400 hover:text-white">Thêm khách hàng mới</Button>
                        {Recover()}
                    </div>
                </div>
                <div className="rounded-md border border-slate-900 bg-slate-50 p-3">
                    {Table(table, flexRender, columns)}
                </div>
                <div className="flex items-center justify-end space-x-2 py-4">
                    <div className="flex-1 text-muted-foreground">
                        {table.getFilteredSelectedRowModel().rows.length} of{" "}
                        {table.getFilteredRowModel().rows.length} row(s) selected.
                    </div>
                    <div className="space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}