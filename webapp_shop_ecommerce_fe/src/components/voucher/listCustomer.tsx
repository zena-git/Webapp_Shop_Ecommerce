import { Checkbox, Button, Modal } from 'antd/lib'
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
import { set, updateSelected } from '~/redux/features/voucher-selected-item'
import { useDispatch } from "react-redux";
import Table from '../../components/ui/table'

export default function ListTable({ listCustomer }: { listCustomer: CustomerResponse[] }) {

    const dispatch = useDispatch();

    const selectedCustomer = useAppSelector((state) => state.voucherReducer.value.selected)

    const columns: ColumnDef<CustomerResponse>[] = useMemo(() => [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={selectedCustomer.length > 0 &&
                        listCustomer.every(({ id }) => {
                            const match = selectedCustomer.find(item => item.id == id);
                            return match && match.selected;
                        })
                    }
                    onChange={(e) => {
                        listCustomer.map(slt => {
                            dispatch(updateSelected({ id: slt.id, selected: !!e.target.checked }))
                        })
                    }
                    }
                />
            ),
            cell: ({ row }) => (
                <div className='flex justify-center items-center'>
                    <Checkbox
                        disabled={selectedCustomer.find(value => value.id === row.original.id)?.disable || false}
                        checked={(selectedCustomer.find(value => value.id === row.original.id)?.selected || false)}
                        onChange={(value) => { dispatch(updateSelected({ id: row.original.id, selected: !!value.target.checked })) }}
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
                    <div className="text-center min-h-10 flex justify-center items-center">Họ và tên</div>
                )
            },
            cell: ({ row }) => <div className="lowercase">{row.getValue("fullName")}</div>,
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
            header: () => <div className="text-center">Ngày sinh</div>,
            cell: ({ row }) => {
                return <div className='flex justify-center'>{row.original.birthday ? row.original.birthday.toString().split("T")[0] : ''}</div>
            },
        },
    ], [dispatch, selectedCustomer, listCustomer]);

    const table = useReactTable({
        data: listCustomer,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    })

    return (
        <>
            <div className="w-full rounded-lg">
                <div className="rounded-md border border-slate-900 bg-white ">
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
            </div>
        </>
    )
}