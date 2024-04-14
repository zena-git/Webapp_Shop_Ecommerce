import { Tag, Select, Checkbox } from 'antd/lib'
import { useState, useEffect, useMemo } from "react"
import {
    CaretSortIcon,
    ChevronDownIcon,
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

import { Button } from "~/components/ui/button"
// import { Checkbox } from "~/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { Input } from "~/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "~/components/ui/table"
import { CustomerResponse } from "~/lib/type"
import { useAppSelector } from '~/redux/storage'
import { set, updateSelected } from '~/redux/features/voucher-selected-item'
import { useDispatch } from "react-redux";
import axios from 'axios'
import { baseUrl } from '~/lib/functional'
import { Link } from 'react-router-dom'

export default function ListTable() {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})
    const [quickFilterCustomerType, setQuickFilterCustomerType] = useState<number>(0);
    const [listCustomer, setListCustomer] = useState<CustomerResponse[]>([]);

    const dispatch = useDispatch();

    const selectedCustomer = useAppSelector((state) => state.voucherReducer.value.selected)

    useEffect(() => {
        axios.get(`${baseUrl}/customer`).then(res => { setListCustomer(res.data) })
    }, [])

    useEffect(() => {
        if (quickFilterCustomerType != 0) {
            axios.get(`/api/customer/filter?type=${quickFilterCustomerType}`).then(res => {
                setListCustomer(res.data)
            })
        } else {
            axios.get(`${baseUrl}/customer`).then(res => { setListCustomer(res.data) })
        }
    }, [quickFilterCustomerType])


    const columns: ColumnDef<CustomerResponse>[] = useMemo(() => [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    defaultChecked={selectedCustomer.length > 0 && selectedCustomer.every(cus => cus.selected)}
                    onChange={(value) => dispatch(set({
                        value: {
                            selected: listCustomer.map(cus => {
                                return { id: cus.id, selected: !!value.target.checked }
                            })
                        }
                    }))}
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={(selectedCustomer.find(value => value.id === row.getValue("id"))?.selected || false)}
                    onChange={(value) => { row.toggleSelected(!!value.target.checked); dispatch(updateSelected({ id: row.getValue("id"), selected: !!value.target.checked })) }}
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "fullName",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        tên
                        <CaretSortIcon className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="lowercase">{row.getValue("fullName")}</div>,
        },
        {
            accessorKey: "email",
            header: () => <div className="text-center">email</div>,
            cell: ({ row }) => {
                return <div className='flex justify-center'>{row.original.email}</div>
            },
        },
        {
            accessorKey: "phone",
            header: () => <div className="text-center">Số điện thoại</div>,
            cell: ({ row }) => {
                return <div className='flex justify-center'>{row.original.phone}</div>
            },
        },
        {
            accessorKey: "birthday",
            header: () => <div className="text-center">sinh nhật</div>,
            cell: ({ row }) => {
                return <div className='flex justify-center'>{row.original.birthday ? row.original.birthday.toString().split("T")[0] : ''}</div>
            },
        },
        {
            id: "hành động",
            enableHiding: false,
            header: () => <div className="text-center">hành động</div>,
            cell: ({ row }) => {
                return (
                    <div className="flex justify-center">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <DotsHorizontalIcon className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => {
                                    // eslint-disable-next-line no-restricted-globals
                                    let t = confirm('xác nhận xóa');
                                    if (t) {
                                        axios.delete(`${baseUrl}/voucher/${row.getValue("id")}`).then(res => {
                                            alert("xóa thành công");

                                        })
                                    }
                                }}>Xóa</DropdownMenuItem>
                                <DropdownMenuItem><Link to={`/user/customer/update/${row.original.id}`}>Cập nhật</Link></DropdownMenuItem>
                                <DropdownMenuItem><Link to={`/user/customer/detail/${row.original.id}`}>Chi tiết</Link></DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
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
            <div className="w-full flex flex-col gap-5">
                <div className=' p-6 bg-white rounded-md shadow-lg'>
                    <div className='flex justify-between items-center'>
                        <p className='text-xl font-bold'>Khách hàng</p>
                        <div>
                            <Link to={'/user/customer/add'} className='bg-blue-500 text-white font-semibold px-3 py-2 rounded-lg my-3'>Thêm khách hàng mới</Link>
                        </div>
                    </div>
                    <div className='grid grid-cols-2 gap-3 my-3'>
                        <div>
                            <p className='text-sm font-semibold mb-1'>Tùy chọn tìm kiếm nhanh</p>
                            <div className='grid grid-cols-3 gap-3'>
                                <Select
                                    style={{ width: '100%' }}
                                    defaultActiveFirstOption={true}
                                    value={quickFilterCustomerType}
                                    onChange={e => setQuickFilterCustomerType(e)}
                                    options={[
                                        { value: 0, label: 'không' },
                                        { value: '1', label: 'Khách hàng mới trong tháng' },
                                        { value: '2', label: 'Khách hàng có đơn hàng trong tháng' },
                                        { value: '3', label: 'test2' },
                                    ]}
                                />
                            </div>
                        </div>
                        <div>
                            <p className='text-sm font-semibold mb-1'>Tên</p>
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
                </div>
                <div className="rounded-md border border-slate-900 bg-white p-3 ">
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
                                    <>
                                        <TableRow data-state={row.getIsSelected() && "selected"}>
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id}>
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </>
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