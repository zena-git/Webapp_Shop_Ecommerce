import { Tag, Button, Input, Radio, Modal, Dropdown, Switch } from 'antd/lib'
import { useState, useMemo, useEffect } from "react"
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
import { useAppSelector } from '../../redux/storage';
import { User } from "~/lib/type"
import { baseUrlV3, baseUrl } from '~/lib/functional'
import { useNavigate } from 'react-router-dom'
import ListDeleted from '../../components/user/listDeleted'
import { useDispatch } from 'react-redux';
import Table from '../../components/ui/table'
import { toast, ToastContainer } from 'react-toastify'
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { set } from '../../redux/features/voucher-deleted'
import { ExclamationCircleFilled } from '@ant-design/icons';
import AxiosIns from '~/lib/auth'

const { confirm } = Modal;

export default function ListTable() {

    const [openModal, setOpenModal] = useState(false);

    const [data, setData] = useState<User[]>([]);
    const [deletedData, setDeletedData] = useState<User[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const fillData = () => {
        AxiosIns.get(`v3/user`).then(res => {
            setData(res.data.filter(d => d.deleted == false));
        })
    }
    useEffect(() => {
        fillData();
        fillDeltedData();
    }, [])

    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({});

    const customFilterType = (
        row,
        columnId,
        filterValue
    ) => {
        if (filterValue == '0') {
            return true;
        } else if (filterValue == '1') {
            return row.original.status == 0
        } else if (filterValue == '2') {
            return row.original.status == 1
        }
    }

    const showDeleteConfirm = (id) => {
        confirm({
            title: 'Bạn có muốn xóa không',
            icon: <ExclamationCircleFilled />,
            content: '',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                AxiosIns.delete(`v3/user/delete/${id}`).then(res => {
                    fillData();
                    fillDeltedData();
                    toast.success('xóa thành công')
                })
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    const columns: ColumnDef<User>[] = useMemo(() => [
        {
            id: "#",
            header: () => <div className="text-center">#</div>,
            cell: ({ row }) => {
                return <div className='text-center text-xl'>
                    {row.index + 1}
                </div>
            },
        },
        {
            accessorKey: "fullName",
            header: ({ column }) => {
                return (
                    <div
                        className='flex items-center justify-center min-h-10'
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Họ và Tên
                        <CaretSortIcon className="ml-2 h-4 w-4" />
                    </div>
                )
            },
            cell: ({ row }) => <div className=" text-xl">{row.original.fullName}</div>,
        },
        {
            accessorKey: "phone",
            header: () => <div className="text-center">Số điện thoại</div>,
            cell: ({ row }) => {
                return <div className="text-center font-medium max-h-16 text-xl">
                    {row.original.phone}
                </div>
            },
        },
        {
            accessorKey: "email",
            header: () => <div className="text-center">Email</div>,
            cell: ({ row }) => {
                return <div className='text-center text-xl'>
                    {row.original.email}
                </div>
            },
        },
        {
            accessorKey: "birthday",
            header: () => <div className="text-center">Ngày sinh</div>,
            cell: ({ row }) => {
                return <div className='text-center text-xl'>
                    {row.original.birthday && row.original.birthday.toString().split("T")[0]}
                </div>
            },
        },
        {
            accessorKey: "status",
            header: () => <div className="text-center">Trạng thái</div>,
            filterFn: customFilterType,
            cell: ({ row }) => {
                let pending = false;
                return <div className="text-center font-medium max-h-16">
                    <Switch checkedChildren="Đang làm việc" disabled={pending} unCheckedChildren="Đã nghỉ việc" defaultChecked={row.original.status == 0} onChange={e => {
                        if (!pending) {
                            pending = true;
                            AxiosIns.put(`v1/user/${row.original.id}/status`, { ...row.original, status: e ? 0 : 1 }).then(res => {
                                toast.success('Cập nhật thành công');
                                pending = false;
                                fillData();
                            }).catch(err => {
                                pending = false;
                                toast.error(err.response.data.message);
                            })
                        }
                    }} />
                </div>
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
                            <div className='flex gap-2 items-center' onClick={() => { navigate(`/user/staff/update/${row.original.id}`) }}>
                                <FaEdit />
                                Cập nhật
                            </div>
                        ),
                    },
                    {
                        key: '2',
                        label: (
                            <div className='flex gap-2 items-center' onClick={() => { navigate(`/user/staff/detail/${row.original.id}`) }}>
                                <FaEye />
                                Chi tiết
                            </div>
                        ),
                    },
                    // {
                    //     key: '3',
                    //     label: (
                    //         <div className='flex gap-2 items-center' onClick={() => { showDeleteConfirm(row.original.id) }}>
                    //             <FaTrash />
                    //             Xóa
                    //         </div>
                    //     ),
                    // },
                ];
                return (
                    <div className="flex justify-center gap-2">
                        <Dropdown menu={{ items }} placement="bottomRight" arrow>
                            <Button type="primary">...</Button>
                        </Dropdown>
                    </div>
                )
            },
        },
    ], [openModal, setOpenModal]);

    const table = useReactTable({
        data,
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
    });
    const listUserDeletedSelect = useAppSelector(state => state.voucherDeletedReducer.value.selected);

    const fillDeltedData = () => {
        AxiosIns.get(`v3/user/deleted`).then(res => {
            setDeletedData(res.data);
        })
    }

    const Recover = () => {
        const handleOk = () => {
            const promises = listUserDeletedSelect.map(slt => {
                return AxiosIns.post(`v3/user/recover?id=${slt.id}`)
            })
            Promise.all(promises).then(() => {
                fillData();
                fillDeltedData();
                setIsModalOpen(false);
            }).catch(() => {

            })

        };
        const handleCancel = () => {
            setIsModalOpen(false);
        };

        return (
            <>
                <Button danger onClick={() => setIsModalOpen(true)} variant="outline" className="flex items-center"><FaTrash /></Button>
                <Modal title="Khôi phục lại" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} className='min-w-[60vw]'>
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
                    <p className='text-2xl font-bold'>Nhân viên</p>
                </div>
                <div className='bg-slate-600 h-[2px]'></div>
                <div className='bg-white rounded-md mb-3 p-3 shadow-md'>

                    <div className="grid grid-cols-2 gap-3 my-3">
                        <div className='my-2'>
                            <p className='text-xl font-semibold mb-2'>Họ và tên</p>
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
                            <p className='text-xl font-semibold mb-2'>Email</p>
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
                            <p className='text-xl font-semibold mb-2'>Số điện thoại</p>
                            <Input
                                placeholder="tìm kiếm theo số điện thoại"
                                value={(table.getColumn("phone")?.getFilterValue() as string) ?? ""}
                                onChange={(event) =>
                                    table.getColumn("phone")?.setFilterValue(event.target.value)
                                }
                                className="w-2/3"
                            />
                        </div>
                        <div className='my-2'>
                            <p className='text-xl font-semibold mb-2'>Trạng thái</p>
                            <Radio.Group name="radiogroup" defaultValue={"0"} value={(table.getColumn("status")?.getFilterValue() as string) ?? "0"} onChange={e => { table.getColumn("status")?.setFilterValue(e.target.value) }}>
                                <Radio value={"0"}>Tất cả</Radio>
                                <Radio value={"1"}>Đang làm việc</Radio>
                                <Radio value={"2"}>Đã nghỉ việc</Radio>
                            </Radio.Group>
                        </div>
                    </div>
                    <div className='flex gap-5 items-center justify-between pr-2 my-4'>
                        <Button type="primary" onClick={() => { navigate('/user/staff/add') }} variant="outline">Thêm nhân viên</Button>
                        {/* {Recover()} */}
                    </div>
                </div>
                <div className="rounded-md border p-3 bg-white shadow-md flex flex-col gap-2">
                    <p className='text-2xl font-bold'>Danh sách nhân viên</p>
                    <div className='h-[2px] bg-slate-600'></div>
                    {Table(table, flexRender, columns)}
                </div>
                <div className="flex items-center justify-end space-x-2 py-4">
                    <div className="flex-1 text-xl text-muted-foreground">
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

