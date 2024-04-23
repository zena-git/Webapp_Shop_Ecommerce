import { Tag, Checkbox, DatePicker, Select, Button, Input, Modal, Dropdown } from 'antd/lib'
import { useState, useEffect, useMemo } from "react"
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
import { PromotionResponse } from "~/lib/type"
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { baseUrl, baseUrlV3 } from '~/lib/functional';
import Table from '../../components/ui/table'
import { toast, ToastContainer } from 'react-toastify'
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import ListDeleted from '~/components/promotion/listDeleted'
import { useAppSelector } from '../../redux/storage';
import { ExclamationCircleFilled } from '@ant-design/icons';

const { confirm } = Modal;
const dayjs = require('dayjs');
const { RangePicker } = DatePicker;
export default function ListTable() {

    const [openModal, setOpenModal] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [data, setData] = useState([]);
    const [deletedData, setDeletedData] = useState([]);

    const navigate = useNavigate();

    const fillData = () => {
        axios.get(`${baseUrl}/promotion`).then(res => {
            setData(res.data);
        })
    }
    const fillDeletedData = () => {
        axios.get(`${baseUrlV3}/promotion/deleted`).then(res => {
            setDeletedData(res.data);
        })
    }
    useEffect(() => {
        fillData();
        fillDeletedData();
    }, [])


    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({});

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

    const showDeleteConfirm = (id) => {
        confirm({
            title: 'Bạn có muốn xóa không',
            icon: <ExclamationCircleFilled />,
            content: '',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                axios.delete(`${baseUrl}/promotion/${id}`).then(res => {
                    toast.success('xóa thành công');
                    fillData();
                    fillDeletedData();
                })
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    const columns: ColumnDef<PromotionResponse>[] = useMemo(() => [
        {
            accessorKey: "id",
            header: "#",
            cell: ({ row }) => (
                <div className="capitalize text-xl text-center">{row.index + 1}</div>
            ),
        },
        {
            accessorKey: "code",
            header: () => <div className="text-center">Mã chương trình</div>,
            cell: ({ row }) => {
                return <div className="text-center font-medium max-h-16 text-xl">
                    {row.original.code}
                </div>
            },
        },
        {
            accessorKey: "name",
            header: ({ column }) => {
                return (
                    <div
                        className='flex items-center justify-center min-h-10'
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Tên chương trình
                        <CaretSortIcon className="ml-2 h-4 w-4" />
                    </div>
                )
            },
            cell: ({ row }) => <div className="lowercase text-xl">{row.getValue("name")}</div>,
        },
        {
            accessorKey: "value",
            header: () => <div className="text-center">Giá trị giảm</div>,
            cell: ({ row }) => {
                return <div className="text-center font-medium max-h-16 text-xl">
                    {row.getValue("value") + "%"}
                </div>
            },
        },
        {
            accessorKey: "startDate",
            header: () => <div className="text-center">Ngày bắt đầu</div>,
            filterFn: customStartDateFilter,
            cell: ({ row }) => {
                return <div className='text-center text-xl'>
                    {row.original.startDate.toString().split("T")[1] + " : " + row.original.startDate.toString().split("T")[0]}
                </div>
            },
        },
        {
            accessorKey: "endDate",
            filterFn: customEndDateFilter,
            header: () => <div className="text-center">Ngày kết thúc</div>,
            cell: ({ row }) => {
                return <div className='text-center text-xl'>
                    {row.original.endDate.toString().split("T")[1] + " : " + row.original.endDate.toString().split("T")[0]}
                </div>
            },
        },
        {
            accessorKey: "status",
            header: () => <div className="text-center">Trạng thái</div>,
            cell: ({ row }) => {
                return <div className='flex justify-center'>{row.original.status == 0 ? <Tag className='' color='blue'>Sắp diễn ra</Tag> : row.original.status == 1 ? <Tag className='text-lg' color='blue'>Đang diễn ra</Tag> : row.original.status == 2 ? <Tag className='text-lg' color='yellow'>Đã kết thúc</Tag> : <Tag className='text-lg' color='red'>Đã hủy</Tag>}</div>
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
                            <div className='flex gap-2 items-center' onClick={() => { navigate(`/discount/promotion/update/${row.getValue('id')}`) }}>
                                <FaEdit />
                                Cập nhật
                            </div>
                        ),
                    },
                    {
                        key: '2',
                        label: (
                            <div className='flex gap-2 items-center' onClick={() => { navigate(`/discount/promotion/detail/${row.getValue('id')}`) }}>
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
                    <div className="flex justify-center gap-2 items-center">
                        <Dropdown menu={{ items }} placement="bottomRight" arrow>
                            <Button type="primary">...</Button>
                        </Dropdown>
                    </div>
                )
            },
        },
    ], [openModal, setOpenModal, fillData, fillDeletedData]);


    const Recover = () => {

        const showModal = () => {
            setIsModalOpen(true);
        };

        const handleOk = () => {
            const promises = listPromotionDeleteSelected.map(slt => {
                return axios.put(`${baseUrlV3}/promotion/recover?id=${slt.id}`)
            })
            Promise.all(promises).then(() => {
                setIsModalOpen(false);
                fillData();
                fillDeletedData()
            })

        };
        const handleCancel = () => {
            setIsModalOpen(false);
        };

        const listPromotionDeleteSelected = useAppSelector(state => state.promotionDeletedReducer.value.selected)

        return (
            <>
                <Button danger onClick={showModal}>
                    <FaTrash />
                </Button>
                <Modal className='min-w-[60vw]' title="Khôi phục lại" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                    {ListDeleted({ data: deletedData })}
                </Modal>
            </>
        );
    }

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

    return (
        <>
            <ToastContainer />
            <div className='bg-slate-50 rounded-md p-3 shadow-lg'>
                <div className='grid grid-cols-3 items-center my-3  gap-5 border'>
                    <div className='flex flex-col w-full'>
                        <p className='mb-1 font-semibold text-xl'>Trạng thái</p>
                        <div className='min-w-[240px]'>
                            <Select
                                style={{ width: '240px' }}
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
                    </div>
                    <div>
                        <p className='mb-1 font-semibold text-xl'>Tìm kiếm</p>
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
                        <p className='mb-1 font-semibold text-xl'>Khoảng ngày</p>
                        <RangePicker placeholder={["Ngày bắt đầu", "Ngày kết thúc"]} onChange={value => {
                            if (value && value[0] && value[1]) {
                                table.getColumn("startDate").setFilterValue(value[0]);
                                table.getColumn("endDate").setFilterValue(value[1])
                            } else {
                                table.getColumn("startDate").setFilterValue(null);
                                table.getColumn("endDate").setFilterValue(null)
                            }
                        }} />
                    </div>

                </div>

                <div className='flex gap-5 items-center justify-between'>
                    <Button type="primary" variant="ountline" onClick={() => { navigate('/discount/promotion/add') }} className=''>
                        Thêm sự kiện giảm giá mới
                    </Button>
                    {Recover()}
                </div>
            </div>
            <div className="rounded-md border bg-slate-50 p-3 shadow-lg flex flex-col gap-3">
                <p>Danh sách sự kiện giảm giá</p>
                <div className='h-[2px] bg-slate-600'></div>
                {Table(table, flexRender, columns)}
            </div>
        </>
    )
}

const numberToPrice = (value) => {
    const formattedAmount = Number.parseFloat(value.toString()).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    return formattedAmount;
}