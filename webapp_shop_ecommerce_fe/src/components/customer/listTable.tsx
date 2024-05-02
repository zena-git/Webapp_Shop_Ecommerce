import { Select, Input, Button, Modal, Dropdown } from 'antd/lib'
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
import AxiosIns from '~/lib/auth'
import { baseUrl, baseUrlV3 } from '~/lib/functional'
import { Link, useNavigate } from 'react-router-dom'
import Table from '../../components/ui/table'
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa'
import { ToastContainer, toast } from 'react-toastify'
import ListDeleted from './listDeleted'
import { set } from '../../redux/features/voucher-deleted'
import { ExclamationCircleFilled } from '@ant-design/icons';

const { confirm } = Modal;
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
        AxiosIns.get(`v3/customer`).then(res => { setListCustomer(res.data) })
    }

    const fillDeletedData = () => {
        AxiosIns.get(`v3/customer/deleted`).then(res => { setDeletedData(res.data) })
    }

    useEffect(() => {
        fillData();
        fillDeletedData();
    }, []);


    const showDeleteConfirm = (id) => {
        confirm({
            title: 'Bạn có muốn xóa không',
            icon: <ExclamationCircleFilled />,
            content: 'Xóa nhân viên này',
            okText: 'Có',
            okType: 'danger',
            cancelText: 'Không',
            onOk() {
                AxiosIns.delete(`v1/customer/${id}`).then(res => {
                    fillData();
                    fillDeletedData();
                    toast.success('xóa thành công')
                })
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };


    const columns: ColumnDef<CustomerResponse>[] = useMemo(() => [
        {
            id: "index",
            header: () => <div className="text-center">#</div>,
            cell: ({ row }) => {
                return <div className='flex justify-center text-xl'>{row.index + 1}</div>
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
            cell: ({ row }) => <div className="lowercase text-xl">{row.original.fullName}</div>,
        },
        {
            accessorKey: "phone",
            header: () => <div className="text-center">Số điện thoại</div>,
            cell: ({ row }) => {
                return <div className='flex justify-center text-xl'>{row.original.phone}</div>
            },
        },
        {
            accessorKey: "email",
            header: () => <div className="text-center">Email</div>,
            cell: ({ row }) => {
                return <div className='flex justify-center text-xl'>{row.original.email}</div>
            },
        },
        {
            accessorKey: "birthday",
            header: () => <div className="text-center">Ngày sinh</div>,
            cell: ({ row }) => {
                return <div className='flex justify-center text-xl'>{row.original.birthday ? row.original.birthday.toString().split("T")[0] : ''}</div>
            },
        },
        {
            id: "hành động",
            enableHiding: false,
            header: () => <div className="text-center">Hành động</div>,
            cell: ({ row }) => {
                const items = [
                    {
                        key: '1',
                        label: (
                            <div className='flex gap-2 items-center' onClick={() => { navigate(`/user/customer/update/${row.original.id}`) }}>
                                <FaEdit />
                                Cập nhật
                            </div>
                        ),
                    },
                    {
                        key: '2',
                        label: (
                            <div className='flex gap-2 items-center' onClick={() => { navigate(`/user/customer/detail/${row.original.id}`) }}>
                                <FaEye />
                                Chi tiết
                            </div>
                        ),
                    },
                    {
                        key: '3',
                        label: (
                            <div className='flex gap-2 items-center' onClick={() => { showDeleteConfirm(row.original.id) }}>
                                <FaTrash />
                                Xóa
                            </div>
                        ),
                    },
                ];
                return (
                    <div className="flex items-center gap-2 justify-center">
                        <Dropdown menu={{ items }} placement="bottomRight" arrow>
                            <Button type="primary">...</Button>
                        </Dropdown>
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
                return AxiosIns.put(`v3/customer/recover?id=${slt.id}`)
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
                <Button onClick={() => setOpenModal(true)} variant="outline" danger className="flex items-center ml-2"><FaTrash /></Button>
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
                    <p className='text-2xl font-bold'>Khách hàng</p>
                </div>
                <div className='bg-slate-600 h-[2px]'></div>
                <div className='rounded-md mb-3 p-3 shadow-md'>
                    <div className='grid grid-cols-2 gap-3 my-3'>
                        <div className='my-2'>
                            <p className='font-semibold mb-2'>Họ và tên</p>
                            <Input
                                placeholder="tìm kiếm theo tên"
                                value={(table.getColumn("fullName")?.getFilterValue() as string) ?? ""}
                                onChange={(event) =>
                                    table.getColumn("fullName")?.setFilterValue(event.target.value)
                                }
                                className="w-2/3"
                            />
                        </div>
                        <div className='my-2'>
                            <p className='font-semibold mb-2'>Email</p>
                            <Input
                                placeholder="tìm kiếm theo email"
                                value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
                                onChange={(event) =>
                                    table.getColumn("email")?.setFilterValue(event.target.value)
                                }
                                className="w-2/3"
                            />
                        </div>
                        <div className='my-2'>
                            <p className='font-semibold mb-2'>Số điện thoại</p>
                            <Input
                                placeholder="tìm kiếm theo số điện thoại"
                                value={(table.getColumn("phone")?.getFilterValue() as string) ?? ""}
                                onChange={(event) =>
                                    table.getColumn("phone")?.setFilterValue(event.target.value)
                                }
                                className="w-2/3"
                            />
                        </div>
                    </div>
                    <div className='flex gap-2 items-center justify-between py-4'>
                        <Button type="primary" onClick={() => { navigate('/user/customer/add') }} variant="outline">Thêm khách hàng mới</Button>
                        {Recover()}
                    </div>
                </div>
                <div className="rounded-md border border-slate-900 bg-slate-50 flex flex-col gap-4 mt-2 p-3">
                    <h4>Danh sách khách hàng</h4>
                    <div className='bg-slate-600 h-[2px]'></div>
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