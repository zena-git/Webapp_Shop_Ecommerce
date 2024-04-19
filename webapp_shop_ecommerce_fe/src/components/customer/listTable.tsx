import { Select, Input, Button } from 'antd/lib'
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
import { baseUrl } from '~/lib/functional'
import { Link, useNavigate } from 'react-router-dom'
import Table from '../../components/ui/table'
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa'


export default function ListTable() {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})
    const [listCustomer, setListCustomer] = useState<CustomerResponse[]>([]);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const selectedCustomer = useAppSelector((state) => state.voucherReducer.value.selected)

    useEffect(() => {
        axios.get(`${baseUrl}/customer`).then(res => { setListCustomer(res.data) })
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
            header: () => <div className="text-center">Sinh nhật</div>,
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
                        <Button type='primary' className='flex items-center' onClick={() => {navigate(`/user/customer/update/${row.original.id}`)}}><FaEdit /></Button>
                        <Button type='primary' className='flex items-center' onClick={() => {navigate(`/user/customer/detail/${row.original.id}`)}}><FaEye /></Button>
                        <Button type='primary' className='flex items-center' onClick={() => {navigate(`/user/customer/detail/${row.original.id}`)}}><FaTrash /></Button>
                    </div>
                )
            },
        },
    ], [dispatch, selectedCustomer]);

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

    return (
        <>
            <div className="w-full rounded-md bg-white p-6 flex flex-col gap-3">
                <div className='flex justify-between items-center'>
                    <p className='text-xl font-bold'>Khách hàng</p>
                </div>
                <div className='bg-slate-600 h-[2px]'></div>
                <div className='bg-slate-50 rounded-md mb-3 p-3 shadow-md'>
                    <div className='grid grid-cols-2 gap-3 my-3'>
                        <div>
                            <p className='text-sm font-semibold mb-1'>Họ và tên</p>
                            <Input
                                placeholder="tìm kiếm theo tên"
                                value={(table.getColumn("fullName")?.getFilterValue() as string) ?? ""}
                                onChange={(event) =>
                                    table.getColumn("fullName")?.setFilterValue(event.target.value)
                                }
                                className="max-w-sm"
                            />
                        </div>
                        <div>
                            <p className='text-sm font-semibold mb-1'>Email</p>
                            <Input
                                placeholder="tìm kiếm theo email"
                                value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
                                onChange={(event) =>
                                    table.getColumn("email")?.setFilterValue(event.target.value)
                                }
                                className="max-w-sm"
                            />
                        </div>
                        <div>
                            <p className='text-sm font-semibold mb-1'>Số điện thoại</p>
                            <Input
                                placeholder="tìm kiếm theo số điện thoại"
                                value={(table.getColumn("phone")?.getFilterValue() as string) ?? ""}
                                onChange={(event) =>
                                    table.getColumn("phone")?.setFilterValue(event.target.value)
                                }
                                className="max-w-sm"
                            />
                        </div>
                    </div>
                    <div>
                        <Button onClick={() => { navigate('/user/customer/add') }} variant="outline" className="bg-blue-500 text-white hover:bg-blue-400 hover:text-white">Thêm khách hàng mới</Button>
                    </div>
                </div>
                <div className="rounded-md border border-slate-900 bg-slate-50 p-3">
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
            </div>
        </>
    )
}