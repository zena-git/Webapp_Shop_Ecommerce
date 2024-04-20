import { Tag, Checkbox, Select, Input, DatePicker, Button, Modal } from 'antd/lib'
import { useState, useMemo, useEffect } from "react"
import {
    CaretSortIcon,
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
import { VoucherResponse } from "~/lib/type"
import axios from 'axios'
import { baseUrl, baseUrlV3 } from '~/lib/functional'
import { Link, useNavigate } from 'react-router-dom'
import Table from '../../components/ui/table'
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { useAppSelector } from '../../redux/storage';
import ListDeleted from '~/components/voucher/listDeleted'
import { ToastContainer, toast } from 'react-toastify'

const dayjs = require('dayjs');
const { RangePicker } = DatePicker;


export default function ListTable() {
    const [data, setData] = useState<VoucherResponse[]>([]);
    const [deletedData, setDeletedData] = useState([]);

    const [openModal, setOpenModal] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const navigate = useNavigate();

    const fillData = () => {
        axios.get(`${baseUrl}/voucher`).then(res => {
            setData(res.data);
        })
    }

    const fillDeletedData = () => {
        axios.get(`${baseUrlV3}/voucher/deleted`).then(res => {
            setDeletedData(res.data);
        })
    }
    useEffect(() => {
        fillData();
        fillDeletedData();
    }, [])

    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({});

    const customDiscountTypeFilter = (
        row,
        columnId,
        filterValue
    ) => {
        if (filterValue == null) {
            return true;
        }
        return row.original.discount_type == filterValue;
    };

    const customStartDateFilter = (
        row,
        columnId,
        filterValue
    ) => {
        if (filterValue == null) {
            return true;
        }
        return dayjs(row.original.startDate).toDate() > filterValue.toDate();
    };

    const customEndDateFilter = (
        row,
        columnId,
        filterValue
    ) => {
        if (filterValue == null) {
            return true;
        }
        return dayjs(row.original.endDate).toDate() < filterValue.toDate();
    };

    const columns: ColumnDef<VoucherResponse>[] = useMemo(() => [
        {
            accessorKey: "name",
            header: ({ column }) => {
                return (
                    <div className="text-center flex justify-center items-center" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                        Tên phiếu
                        <CaretSortIcon className="ml-2 h-4 w-4" />
                    </div>
                )
            },
            cell: ({ row }) => <div className="lowercase text-center">{row.getValue("name")}</div>,
        },
        {
            accessorKey: "code",
            header: ({ column }) => {
                return (
                    <div className="text-center flex justify-center items-center min-h-10" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                        Mã phiếu
                        <CaretSortIcon className="ml-2 h-4 w-4" />
                    </div>
                )
            },
            cell: ({ row }) => <div className="lowercase text-center">{row.original.code}</div>,
        },

        {
            id: "value",
            accessorKey: "value",
            header: () => <div className="text-center">Giá trị giảm</div>,
            cell: ({ row }) => {
                return <div className="text-center font-medium max-h-16">
                    {row.original.discountType == "0" ? numberToPrice(row.original.value) : `${row.original.value}%`}
                </div>
            },
        },
        {
            accessorKey: "orderMinValue",
            header: () => <div className="text-center">Đơn tối thiểu</div>,
            cell: ({ row }) => {
                return <div className="text-center font-medium max-h-16">
                    {numberToPrice(row.original.orderMinValue)}
                </div>
            },
        },
        {
            accessorKey: "maxDiscountValue",
            header: () => <div className="text-center">Giảm tối đa</div>,
            cell: ({ row }) => {
                return <div className="text-center font-medium max-h-16">
                    {numberToPrice(row.original.maxDiscountValue)}
                </div>
            },
        },
        {
            accessorKey: "startDate",
            header: () => <div className="text-center">Ngày bắt đầu</div>,
            filterFn: customStartDateFilter,
            cell: ({ row }) => {
                return <div className='text-center'>
                    {/* + " - " + row.original.startDate.toString().split("T")[1] */}
                    {row.original.startDate.toString().split("T")[0]}
                </div>
            },
        },
        {
            accessorKey: "endDate",
            filterFn: customEndDateFilter,
            header: () => <div className="text-center">Ngày kết thúc</div>,
            cell: ({ row }) => {
                return <div className='text-center'>
                    {/* + " - " + row.original.endDate.toString().split("T")[1] */}
                    {row.original.endDate.toString().split("T")[0]}
                </div>
            },
        },
        {
            accessorKey: "status",
            header: () => <div className="text-center">Trạng thái</div>,
            cell: ({ row }) => {
                return <div className='flex justify-center'>{<Tag color={"blue"}>
                    {row.original.status == "0" ? "Sắp diễn ra" : row.original.status == "1" ? "Đang diễn ra" : row.original.status == "2" ? "Đã kết thúc" : "Đã hủy"}
                </Tag>}</div>
            },
        },
        {
            id: "hành động",
            enableHiding: false,
            header: () => <div className="text-center">Hành động</div>,
            cell: ({ row }) => {
                return (
                    <div className="flex justify-center gap-2">
                        <Button type="primary" className="flex items-center" onClick={() => { navigate(`/discount/voucher/update/${row.original.id}`) }}><FaEdit /></Button>
                        <Button type="primary" className="flex items-center" onClick={() => { navigate(`/discount/voucher/detail/${row.original.id}`) }}><FaEye /></Button>
                        <Button type="primary" className="flex items-center" onClick={() => { setOpenModal(true) }}>
                            <FaTrash />
                        </Button>
                        <Modal
                            title="Xác nhận"
                            open={openModal}
                            onOk={() => {
                                setOpenModal(false)
                                axios.delete(`${baseUrl}/voucher/${row.original.id}`).then(res => {
                                    toast.success("Xóa thành công")
                                    fillData();
                                    fillDeletedData();
                                })
                            }}
                            onCancel={() => { setOpenModal(false) }}
                            okText="xác nhận"
                            cancelText="hủy"
                        >
                            Xác nhận xóa
                        </Modal>
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
    })

    const Recover = () => {
        const showModal = () => {
            setIsModalOpen(true);
        };
        const handleOk = () => {
            const promises = listVoucherDeleteSelected.map(slt => {
                return axios.put(`${baseUrlV3}/voucher/recover?id=${slt.id}`)
            })
            Promise.all(promises).then(() => {
                setIsModalOpen(false);
                fillData();
                fillDeletedData();
            })

        };
        const handleCancel = () => {
            setIsModalOpen(false);
        };

        const listVoucherDeleteSelected = useAppSelector(state => state.voucherDeletedReducer.value.selected)

        return (
            <>
                <Button variant="outline" type="primary" onClick={showModal}>
                    Phiếu giảm giá đã xóa
                </Button>
                <Modal className='min-w-[60vw]' title="Khôi phục lại" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                    {ListDeleted({ data: deletedData })}
                </Modal>
            </>
        );
    }

    return (
        <>
            <div className='flex gap-5 items-center'>
                <Button onClick={() => { navigate('/discount/voucher/add') }} variant="outline" className="bg-blue-500 py-1 text-white hover:bg-blue-300 hover:text-white">Thêm phiếu giảm giá</Button>
                {Recover()}
            </div>
            <ToastContainer />
            <div className='grid grid-cols-2 items-center my-3 bg-white rounded-md p-3 shadow-lg gap-5'>
                <div className='w-full flex flex-col'>
                    <p className='mb-1 font-semibold text-sm'>Trạng thái</p>

                    <Select
                        className='min-w-sm w-2/3'
                        defaultValue={0}
                        defaultActiveFirstOption
                        onChange={(value) => {
                            let filterValue = null;
                            if (value !== 0) {
                                filterValue = (value - 1).toString();
                            }
                            table.getColumn("status").setFilterValue(filterValue);
                        }}
                    >
                        <option value={0}>Tất cả</option>
                        <option value={1}>Sắp diễn ra</option>
                        <option value={2}>Đang diễn ra</option>
                        <option value={3}>Đã kết thúc</option>
                        <option value={4}>Đã hủy</option>
                    </Select>
                </div>
                <div className='w-full flex flex-col'>
                    <p className='mb-1 font-semibold text-sm'>Hình thức giảm</p>
                    <Select className='min-w-sm w-2/3' defaultValue={0} defaultActiveFirstOption onChange={(value) => {
                        let filterValue = null;
                        if (value != 0) {
                            filterValue = (value - 1).toString();
                        }
                        table.getColumn("discount_type").setFilterValue(filterValue);
                    }}>
                        <option value={0}>Tất cả</option>
                        <option value={1}>Giảm trực tiếp</option>
                        <option value={2}>Giảm phần trăm</option>
                    </Select>
                </div>
                <div>
                    <p className='mb-1 font-semibold text-sm'>Tìm kiếm</p>
                    <Input
                        placeholder="tên..."
                        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("name")?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
                </div>
                <div>
                    <p className='mb-1 font-semibold text-sm'>Khoảng ngày</p>
                    <RangePicker placeholder={["Ngày bắt đầu", "Ngày kết thúc"]} onChange={value => {
                        table.getColumn("startDate").setFilterValue(value[0]);
                        table.getColumn("endDate").setFilterValue(value[1])
                    }} />
                </div>
            </div>
            <div className="rounded-md border border-slate-800 shadow-md">
                {Table(table, flexRender, columns)}
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
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
        </>
    )
}

const numberToPrice = (value) => {
    const formattedAmount = Number.parseFloat(value.toString()).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    return formattedAmount;
}