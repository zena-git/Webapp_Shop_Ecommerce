import { Tag, Checkbox, Input, Button } from 'antd/lib'
import { useState, useMemo } from "react"
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
import { AdressResponse } from "~/lib/type"
import Table from '../../components/ui/table'

export default function ListTable({ data }: { data: AdressResponse[] }) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})

    const columns: ColumnDef<AdressResponse>[] = useMemo(() => [
        {
            accessorKey: "#",
            header: "#",
            cell: ({ row }) => (
                <div className="capitalize">{row.index + 1}</div>
            ),
        },
        {
            accessorKey: "defaultAddress",
            header: ({ column }) => {
                return (
                    <div className="text-center">Địa chỉ mặc định</div>
                )
            },
            cell: ({ row }) => <div className='flex justify-center'><Checkbox checked={row.original.defaultAddress} /></div>
        },
        {
            accessorKey: "receiverName",
            header: ({ column }) => {
                return (
                    <div
                        className='flex items-center justify-center min-h-10'
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Tên người nhận
                        <CaretSortIcon className="ml-2 h-4 w-4" />
                    </div>
                ) 
            },
            cell: ({ row }) => <div className="lowercase">{row.original.receiverName}</div>,
        },
        {
            accessorKey: "receiverPhone",
            header: () => <div className="text-center">Số điện thoại</div>,
            cell: ({ row }) => {
                return <div className="text-center font-medium max-h-16">
                    {row.original.receiverPhone}
                </div>
            },
        },
        {
            accessorKey: "commune",
            header: () => <div className="text-center">Xã/phường</div>,
            cell: ({ row }) => {
                return <div className='text-center'>
                    {row.original.commune}
                </div>
            },
        },
        {
            accessorKey: "province",
            header: () => <div className="text-center">Quận/huyện</div>,
            cell: ({ row }) => {
                return <div className="text-center font-medium max-h-16">
                    {row.original.province}
                </div>
            },
        },
        {
            accessorKey: "district",
            header: () => <div className="text-center">Tỉnh/thành phố</div>,
            cell: ({ row }) => {
                return <div className="text-center font-medium max-h-16">
                    {row.original.district}
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
                <div className="rounded-md border">
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
