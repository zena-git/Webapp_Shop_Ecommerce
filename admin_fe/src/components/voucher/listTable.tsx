import { Tag, Checkbox, Select, Input, DatePicker } from 'antd/lib'
import { useState, useMemo, useEffect } from "react"
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
// import { Input } from "~/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "~/components/ui/table"
import { VoucherResponse } from "~/lib/type"
import axios from 'axios'
import { baseUrl } from '~/lib/functional'
import { Link, redirect, useNavigate } from 'react-router-dom'
const dayjs = require('dayjs');
const { RangePicker } = DatePicker;


export default function ListTable() {
    const [data, setData] = useState<VoucherResponse[]>([]);

    const navigate = useNavigate();

    const fillData = () => {
        axios.get(`${baseUrl}/voucher`).then(res => {
            setData(res.data);
        })
    }
    useEffect(() => {
        fillData()
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
            id: "id",
            accessorKey: "id",
            header: "#",
            cell: ({ row }) => (
                <div className="capitalize">{row.index + 1}</div>
            ),
        },
        {
            accessorKey: "name",
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
            cell: ({ row }) => <div className="lowercase">{row.getValue("name")}</div>,
        },
        {
            accessorKey: "status",
            header: () => <div className="text-center">trạng thái</div>,
            cell: ({ row }) => {
                return <div className='flex justify-center'>{<Tag color={"blue"}>
                    {row.original.status == "0" ? "Sắp diễn ra" : row.original.status == "1" ? "Đang diễn ra" : row.original.status == "2" ? "Đã kết thúc" : "Đã hủy"}
                </Tag>}</div>
            },
        },
        {
            id: "value",
            accessorKey: "value",
            header: () => <div className="text-center">giá trị giảm</div>,
            cell: ({ row }) => {
                return <div className="text-center font-medium max-h-16">
                    {row.original.discount_type == "0" ? numberToPrice(row.original.value) : `${row.original.value}%`}
                </div>
            },
        },
        {
            accessorKey: "startDate",
            header: () => <div className="text-center">ngày bắt đầu</div>,
            filterFn: customStartDateFilter,
            cell: ({ row }) => {
                return <div className='text-center'>
                    {row.original.startDate.toString().split("T")[0] + " - " + row.original.startDate.toString().split("T")[1]}
                </div>
            },
        },
        {
            accessorKey: "endDate",
            filterFn: customEndDateFilter,
            header: () => <div className="text-center">ngày kết thúc</div>,
            cell: ({ row }) => {
                return <div className='text-center'>
                    {row.original.endDate.toString().split("T")[0] + " - " + row.original.endDate.toString().split("T")[1]}
                </div>
            },
        },
        {
            id: "discount_type",
            accessorKey: "discount_type",
            header: () => <></>,
            filterFn: customDiscountTypeFilter,
            cell: ({ row }) => {
                return <></>
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
                                            navigate(0)
                                        })
                                    }
                                }}>Xóa</DropdownMenuItem>
                                <DropdownMenuItem><Link to={`/discount/voucher/update/${row.getValue('id')}`}>Cập nhật</Link></DropdownMenuItem>
                                <DropdownMenuItem><Link to={`/discount/voucher/detail/${row.getValue('id')}`}>Chi tiết</Link></DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )
            },
        },
    ], []);

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
            <div className="w-full">
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
                        <RangePicker onChange={value => {
                            table.getColumn("startDate").setFilterValue(value[0]);
                            table.getColumn("endDate").setFilterValue(value[1])
                        }} />
                    </div>
                </div>
                <div className="rounded-md border p-3 bg-white">

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto">
                                Cột <ChevronDownIcon className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) =>
                                                column.toggleVisibility(!!value)
                                            }
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    )
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
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

const numberToPrice = (value) => {
    const formattedAmount = Number.parseFloat(value.toString()).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    return formattedAmount;
}