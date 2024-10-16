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
import { CustomerResponse, User } from "~/lib/type"
import { set } from '../../redux/features/voucher-deleted'
import { useDispatch } from 'react-redux'
import Table from '../../components/ui/table'


export default function ListTable({ data }: { data: CustomerResponse[] }) {
    const dispatch = useDispatch()

    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})

    const columns: ColumnDef<CustomerResponse>[] = useMemo(() => [
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
                <div className='flex justify-center items-center'>
                    <Checkbox
                        checked={row.getIsSelected()}
                        onChange={(value) => row.toggleSelected(!!value.target.checked)}
                        aria-label="Select row"
                    />
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "fullName",
            header: ({ column }) => {
                return (
                    <div onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className='flex items-center min-h-10 justify-center'>
                        Họ và Tên
                        <CaretSortIcon className="ml-2 h-4 w-4" />
                    </div>
                )
            },
            cell: ({ row }) => <div className="lowercase text-xl">{row.original.fullName}</div>,
        },
        {
            accessorKey: "phone",
            header: () => <div className="text-center">Số điện thoại</div>,
            cell: ({ row }) => {
                return <div className='text-center text-xl'>
                    {row.original.phone}
                </div>
            },
        },
        {
            accessorKey: "email",
            header: () => <div className="text-center">Email</div>,
            cell: ({ row }) => {
                return <div className='text-center text-xl'>
                    {row.original.email}
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

    useEffect(() => {
        table.resetRowSelection();
    }, [data, table])

    useEffect(() => {
        const keysArray = Object.keys(rowSelection).map(Number);
        if (keysArray.length > 0) {
            let t = keysArray.map(key => { return { id: table.getRow(key.toString()).original.id, selected: true } });
            dispatch(set({ value: { selected: t } }))
        }
    }, [dispatch, rowSelection, table])

    return (
        <>
            <div className="w-full">
                <div className="rounded-md border p-3 bg-white">
                    {Table(table, flexRender, columns)}
                </div>
            </div>
        </>
    )
}
