import { Checkbox, Button } from 'antd/lib'
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
import { PromotionResponse } from "~/lib/type"
import { set } from '../../redux/features/promotion-deleted'
import { useDispatch } from 'react-redux'
import Table from '../../components/ui/table'
export default function ListTable({data}: {data: PromotionResponse[]}) {

    const dispatch = useDispatch()

    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})

    useEffect(() => {
        const keysArray = Object.keys(rowSelection).map(Number);
        if (keysArray.length > 0) {
            dispatch(set({ value: { selected: keysArray.map(key => { return { id: table.getRow(key.toString()).original.id, selected: true } }) } }))
        }
    }, [rowSelection])

    const columns: ColumnDef<PromotionResponse>[] = useMemo(() => [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected()
                    }
                    onChange={(value) => table.toggleAllPageRowsSelected(!!value.target.checked)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onChange={(value) => row.toggleSelected(!!value.target.checked)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "id",
            header: "id",
            cell: ({ row }) => (
                <div className="capitalize text-xl text-center">{row.getValue("id")}</div>
            ),
        },
        {
            accessorKey: "name",
            header: ({ column }) => {
                return (
                    <div onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className='flex items-center justify-center min-h-10'>
                        <p>Tên chương trình</p>
                        <CaretSortIcon className="ml-2 h-4 w-4" />
                    </div>
                )
            },
            cell: ({ row }) => <div className="lowercase text-xl">{row.getValue("name")}</div>,
        },
        {
            accessorKey: "startDate",
            header: () => <div className="text-center">Ngày bắt đầu</div>,
            cell: ({ row }) => {
                return <div className='text-center text-xl'>
                    {row.original.startDate.toString().split("T")[0] + " - " + row.original.startDate.toString().split("T")[1]}
                </div>
            },
        },
        {
            accessorKey: "endDate",
            header: () => <div className="text-center">Ngày kết thúc</div>,
            cell: ({ row }) => {
                return <div className='text-center text-xl'>
                    {row.original.endDate.toString().split("T")[0] + " - " + row.original.endDate.toString().split("T")[1]}
                </div>
            },
        },
        {
            accessorKey: "value",
            header: () => <div className="text-center">Giá trị giảm</div>,
            cell: ({ row }) => {
                return <div className="text-center font-medium max-h-16 text-xl">
                    {row.original.value + "%"}
                </div>
            },
        }
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
                <div className="rounded-md border p-3 bg-white">
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
