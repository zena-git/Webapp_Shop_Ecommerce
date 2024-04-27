import { Tag, Button, Input } from 'antd/lib'
import { useState, useEffect, useMemo } from "react"
import {
    CaretSortIcon,
    ChevronDownIcon,
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
import { PromotionDetailResponse } from "~/lib/type"
import Table from '../../components/ui/table'

export default function ListTable({ data, value }: { data: PromotionDetailResponse[], value: number }) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})

    const columns: ColumnDef<PromotionDetailResponse>[] = useMemo(() => [
        {
            accessorKey: "id",
            header: "#",
            cell: ({ row }) => (
                <div className="capitalize text-xl text-center">{row.index + 1}</div>
            ),
        },
        {
            accessorKey: "code",
            header: ({ column }) => {
                return (
                    <div
                        className='flex items-center justify-center min-h-10'
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Mã sản phẩm
                        <CaretSortIcon className="ml-2 h-4 w-4" />
                    </div>
                )
            },
            cell: ({ row }) => <div className="lowercase text-xl">{row.original.productDetails.code}</div>,
        },
        {
            accessorKey: "name",
            header: ({ column }) => {
                return (
                    <div
                        className='flex items-center justify-center min-h-10'
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Tên sản phẩm
                        <CaretSortIcon className="ml-2 h-4 w-4" />
                    </div>
                )
            },
            // @ts-ignore
            cell: ({ row }) => <div className="lowercase text-xl">{row.original.productDetails.product.name}</div>,
        },
        {
            id: "type",
            header: () => <div className="text-center">Giá bán gốc</div>,
            cell: ({ row }) => {
                return <div className='text-center text-xl'>
                    {numberToPrice(row.original.productDetails.price)}
                </div>
            },
        },
        {
            id: "type",
            header: () => <div className="text-center">Giá bán sau giảm</div>,
            cell: ({ row }) => {
                return <div className='text-center text-xl'>
                    {numberToPrice(row.original.productDetails.price - row.original.productDetails.price * value / 100)}
                </div>
            },
        },
        {
            id: "price",
            header: () => <div className="text-center">Phân loại</div>,
            cell: ({ row }) => {
                return <div className='text-center text-xl'>
                    {"[ " + row.original.productDetails.color.name + " - " + row.original.productDetails.size.name + " ]"}
                </div>
            },
        },
        {
            id: "quantity",
            header: () => <div className="text-center">Số lượng</div>,
            cell: ({ row }) => {
                return <div className='text-center text-xl'>
                    {row.original.productDetails.quantity}
                </div>
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
                <div className="rounded-md border mt-5">
                    {Table(table, flexRender, columns)}
                </div>
                <div className="flex items-center justify-end space-x-2 py-4">
                    <div className="flex-1 text-lg text-muted-foreground">
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
