import { Tag, Button, Input } from 'antd/lib'
import { useState, useMemo } from "react"
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
import { VoucherDetailResponse } from "~/lib/type"
import Table from '../../components/ui/table'

export default function ListTable({ data }: { data: VoucherDetailResponse[] }) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})

    const columns: ColumnDef<VoucherDetailResponse>[] = useMemo(() => [
        {
            accessorKey: "id",
            header: "id",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("id")}</div>
            ),
        },
        {
            accessorKey: "name",
            header: ({ column }) => {
                return (
                    <div
                        className='flex items-center justify-center min-h-10'
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        tên khách hàng
                        <CaretSortIcon className="ml-2 h-4 w-4" />
                    </div>
                )
            },
            cell: ({ row }) => <div className="lowercase">{row.original.customer.fullName}</div>,
        },
        {
            accessorKey: "startDate",
            header: () => <div className="text-center">ngày sử dụng</div>,
            cell: ({ row }) => {
                return <div className='text-center'>
                    {row.original.usedDate ? row.original.usedDate.toString().split("T")[0] + " - " + row.original.usedDate.toString().split("T")[1] : "Chưa sử dụng"}
                </div>
            },
        },
        {
            accessorKey: "value",
            header: () => <div className="text-center">trạng thái hóa đơn</div>,
            cell: ({ row }) => {
                return <div className="text-center font-medium max-h-16">
                    {row.original.bill ? row.original.bill.status : "Chưa sử dụng"}
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
