import { Tag, Checkbox, Select, Input, DatePicker, Button, Modal, Dropdown } from 'antd/lib'
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
import { ExclamationCircleFilled } from '@ant-design/icons';

const { confirm } = Modal;
const dayjs = require('dayjs');
const { RangePicker } = DatePicker;


export default function ListTable() {
    const [data, setData] = useState<VoucherResponse[]>([]);

    const [openModal, setOpenModal] = useState(false);

    const navigate = useNavigate();

    const fillData = () => {
        axios.get(`${baseUrl}/voucher`).then(res => {
            setData(res.data);
        })
    }

    useEffect(() => {
        fillData();
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
        return row.original.discountType == filterValue;
    };

    const customStartDateFilter = (
        row,
        columnId,
        filterValue
    ) => {
        if (filterValue == null) {
            return true;
        }
        return dayjs(row.original.startDate).toDate() >= filterValue.toDate();
    };

    const customEndDateFilter = (
        row,
        columnId,
        filterValue
    ) => {
        if (filterValue == null) {
            return true;
        }
        return dayjs(row.original.endDate).toDate() <= filterValue.toDate();
    };

    const showDeleteConfirm = (id) => {
        confirm({
            title: '',
            icon: <ExclamationCircleFilled />,
            content: 'Bạn có muốn hủy không',
            okText: 'Có',
            okType: 'danger',
            cancelText: 'Không',
            onOk() {
                axios.put(`${baseUrlV3}/voucher/disable/${id}`).then(res => {
                    toast.success('Đã hủy');
                    fillData();
                }).catch(err => {
                    console.log(err);
                })
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    const columns: ColumnDef<VoucherResponse>[] = useMemo(() => [
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
            cell: ({ row }) => <div className="lowercase text-center text-xl">{row.original.code}</div>,
        },
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
            cell: ({ row }) => <div className="lowercase text-center text-xl">{row.getValue("name")}</div>,
        },
        {
            id: "value",
            accessorKey: "value",
            header: () => <div className="text-center">Giá trị giảm</div>,
            filterFn: customDiscountTypeFilter,
            cell: ({ row }) => {
                return <div className="text-center font-medium max-h-16 text-xl">
                    {row.original.discountType == "0" ? numberToPrice(row.original.value) : `${row.original.value}%`}
                </div>
            },
        },
        {
            accessorKey: "orderMinValue",
            header: () => <div className="text-center">Đơn tối thiểu</div>,
            cell: ({ row }) => {
                return <div className="text-center font-medium max-h-16 text-xl">
                    {numberToPrice(row.original.orderMinValue)}
                </div>
            },
        },
        {
            accessorKey: "maxDiscountValue",
            header: () => <div className="text-center">Giảm tối đa</div>,
            cell: ({ row }) => {
                return <div className="text-center font-medium max-h-16 text-xl">
                    {numberToPrice(row.original.maxDiscountValue)}
                </div>
            },
        },
        {
            accessorKey: "startDate",
            header: () => <div className="text-center">Ngày bắt đầu</div>,
            filterFn: customStartDateFilter,
            cell: ({ row }) => {
                return <div className='text-center text-xl'>
                    <p>{row.original.startDate.toString().split("T")[0]}</p>
                    <p>{row.original.startDate.toString().split("T")[1]}</p>
                </div>
            },
        },
        {
            accessorKey: "endDate",
            filterFn: customEndDateFilter,
            header: () => <div className="text-center">Ngày kết thúc</div>,
            cell: ({ row }) => {
                return <div className='text-center text-xl'>
                    <p>{row.original.endDate.toString().split("T")[0]}</p>
                    <p>{row.original.endDate.toString().split("T")[1]}</p>
                </div>
            },
        },
        {
            accessorKey: "status",
            header: () => <div className="text-center">Trạng thái</div>,
            cell: ({ row }) => {
                return <div className='flex justify-center'>{<Tag color={row.original.status == "0" ? "blue" : row.original.status == "1" ? "green" : row.original.status == "2" ? "gold" : "red"}>
                    {row.original.status == "0" ? "Sắp diễn ra" : row.original.status == "1" ? "Đang diễn ra" : row.original.status == "2" ? "Đã kết thúc" : "Đã hủy"}
                </Tag>}</div>
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
                            <>
                                {
                                    row.original.status == '0' &&
                                    <div className='flex gap-2 items-center' onClick={() => { navigate(`/discount/voucher/update/${row.original.id}`) }}>
                                        <FaEdit />
                                        Cập nhật
                                    </div>
                                }
                            </>
                        ),
                    },
                    {
                        key: '2',
                        label: (
                            <div className='flex gap-2 items-center' onClick={() => { navigate(`/discount/voucher/detail/${row.original.id}`) }}>
                                <FaEye />
                                Chi tiết
                            </div>
                        ),
                    },
                    {
                        key: '3',
                        label: (
                            <>
                                {row.original.status == "0" || row.original.status == "1" ? <div className='flex gap-2 items-center' onClick={() => { showDeleteConfirm(row.original.id) }}>
                                    <FaTrash />
                                    Hủy
                                </div> : <></>}
                            </>
                        ),
                    },
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
    })

    // const Recover = () => {
    //     const showModal = () => {
    //         setIsModalOpen(true);
    //     };
    //     const handleOk = () => {
    //         const promises = listVoucherDeleteSelected.map(slt => {
    //             return axios.put(`${baseUrlV3}/voucher/recover?id=${slt.id}`)
    //         })
    //         Promise.all(promises).then(() => {
    //             setIsModalOpen(false);
    //             fillData();
    //             fillDeletedData();
    //         })

    //     };
    //     const handleCancel = () => {
    //         setIsModalOpen(false);
    //     };

    //     const listVoucherDeleteSelected = useAppSelector(state => state.voucherDeletedReducer.value.selected)

    //     return (
    //         <>
    //             <Button variant="outline" danger onClick={showModal} className="flex items-center">
    //                 <FaTrash />
    //             </Button>
    //             <Modal className='min-w-[60vw]' title="Khôi phục lại" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
    //                 {ListDeleted({ data: deletedData })}
    //             </Modal>
    //         </>
    //     );
    // }

    return (
        <>
            <ToastContainer />
            <div className='p-3 rounded-md shadow-lg bg-white'>
                <div className='grid grid-cols-2 items-center my-3'>
                    <div className='w-full flex flex-col my-2'>
                        <p className='mb-3 font-semibold text-xl'>Trạng thái</p>
                        <Select
                            className='w-2/3'
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
                            <option value={5}>Đã hủy</option>
                        </Select>
                    </div>
                    <div className='w-full flex flex-col my-2'>
                        <p className='mb-3 font-semibold text-xl'>Hình thức giảm</p>
                        <Select className='w-2/3' defaultValue={0} defaultActiveFirstOption onChange={(value) => {
                            let filterValue = null;
                            if (value != 0) {
                                filterValue = (value - 1).toString();
                            }
                            table.getColumn("value").setFilterValue(filterValue);
                        }}>
                            <option value={0}>Tất cả</option>
                            <option value={1}>Giảm trực tiếp</option>
                            <option value={2}>Giảm phần trăm</option>
                        </Select>
                    </div>
                    <div className='my-2'>
                        <p className='mb-3 font-semibold text-xl'>Tìm kiếm</p>
                        <Input
                            placeholder="tên..."
                            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                            onChange={(event) =>
                                table.getColumn("name")?.setFilterValue(event.target.value)
                            }
                            className="w-2/3"
                        />
                    </div>
                    <div>
                        <p className='mb-3 font-semibold text-xl'>Khoảng ngày</p>
                        <RangePicker placeholder={["Ngày bắt đầu", "Ngày kết thúc"]} className='w-2/3' onChange={value => {
                            table.getColumn("startDate").setFilterValue(value ? value[0].hour(0).minute(0).second(0) : null);
                            table.getColumn("endDate").setFilterValue(value ? value[1].hour(23).minute(59).second(59) : null)
                        }} />
                    </div>
                </div>
                <div className='flex gap-5 items-center my-4 justify-between pr-2'>
                    <Button onClick={() => { navigate('/discount/voucher/add') }} variant="outline" type="primary">Thêm voucher</Button>
                    {/* {Recover()} */}
                </div>
            </div>
            <div className="rounded-md border border-slate-800 shadow-md flex flex-col gap-3 mt-4 bg-white p-3">
                <h4>Danh sách voucher</h4>
                <div className='h-[2px] bg-slate-600'></div>
                {Table(table, flexRender, columns)}
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
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