import { Tag } from 'antd/lib'
import { useState, useEffect, useMemo } from "react"
import {
    CaretSortIcon,
    ChevronDownIcon,
    DotsHorizontalIcon,
} from "@radix-ui/react-icons"
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"

import { Button } from "~/components/ui/button"
import { Checkbox } from "~/components/ui/checkbox"
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
import axios from "axios"
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { useAppSelector } from '../../redux/storage'
import { set, updateSelected, toggleChildren } from '../../redux/features/promotion-selected-item'
import { useDispatch } from "react-redux";

export default function ListTable({ data }) {
    const [sorting, setSorting] = useState([])
    const [columnFilters, setColumnFilters] = useState([])
    const [columnVisibility, setColumnVisibility] = useState({})
    const [rowSelection, setRowSelection] = useState({})

    const [open, setOpen] = useState({});
    const dispatch = useDispatch();

    const selectedProduct = useAppSelector((state) => state.promotionReducer.value.selected)

    useEffect(() => {
        let temp = []
        data.forEach(product => {
            temp.push(
                {
                    id: product.id,
                    selected: false,
                    children: product.lstProductDetails.map(proDetail => {
                        return {
                            id: proDetail.id,
                            selected: false
                        }
                    })
                }
            )
        });
        dispatch(set({ value: { selected: temp } }))
    }, [data, dispatch])

    const handleToggleOpen = (id) => {
        setOpen((prevOpen) => ({
            ...prevOpen,
            [id]: !prevOpen[id] // Nếu đã mở thì đóng, và ngược lại
        }));
    };

    const columns = useMemo(() => [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected() || (selectedProduct.find(value => {
                        return value.id == row.original.id
                    })?.selected)}
                    onCheckedChange={(value) => { row.toggleSelected(!!value); dispatch(updateSelected({ id: row.original.id, selected: !!value })) }}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "status",
            header: () => <div className="text-center">Ảnh</div>,
            cell: ({ row }) => {
                return (<div className='flex justify-center'>
                    <img src={row.original.imageUrl} alt='' className='w-14 h-20'></img>
                </div>)
            },
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
            id: "accordion",
            header: () => <div className="text-center">Chi tiết</div>,
            cell: ({ row }) => (
                <div className='flex justify-center text-xl' onClick={() => handleToggleOpen(row.original.id)}>{!!open[row.original.id] ? <FaAngleUp /> : <FaAngleDown />}</div>
            ),
            enableSorting: false,
            enableHiding: false,
        },
    ], [dispatch, open, selectedProduct]);

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
                <div className="flex items-center py-4">
                    <Input
                        placeholder="Filter name..."
                        value={(table.getColumn("name")?.getFilterValue()) ?? ""}
                        onChange={(event) =>
                            table.getColumn("name")?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto">
                                Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
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
                </div>
                <div className="rounded-md border">
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
                                        <TableRow data-state={row.getIsSelected() && "selected"}>
                                            {open[row.original.id] && <TableCell colSpan={columns.length}><ProductDetailTable targetDataId={row.original.id} selected={row.getIsSelected()} belowData={row.original.lstProductDetails
                                            }></ProductDetailTable></TableCell>}
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



const ProductDetailTable = ({ belowData, selected, targetDataId }) => {
    const [belowSorting, setBelowSorting] = useState([])
    const [belowColumnFilters, setBelowColumnFilters] = useState([])
    const [belowColumnVisibility, setBelowColumnVisibility] = useState({})
    const [belowRowSelection, setBelowRowSelection] = useState({})

    const selectedProduct = useAppSelector((state) => state.promotionReducer.value.selected)

    const dispatch = useDispatch();

    const belowColumns = useMemo(() => [
        {
            id: "select",
            header: ({ table }) => (
                <div></div>
            ),
            cell: ({ row }) => (
                <Checkbox
                    // eslint-disable-next-line no-unused-expressions
                    checked={row.getIsSelected() || !!selectedProduct.find(slt => { slt.id == targetDataId })?.children.find(child => child.id == row.original.id)?.selected}
                    onCheckedChange={(value) => { row.toggleSelected(!!value); dispatch(toggleChildren({ id: row.getValue("id"), parentId: targetDataId, value: !!value })) }}
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
                <div className="capitalize">{row.getValue("id")}</div>
            ),
        },
        {
            accessorKey: "imageUrl",
            header: () => <div className="text-center">img</div>,
            cell: ({ row }) => {
                return <div className="text-center flex justify-center font-medium max-h-16">
                    <img className="w-14 h-20" src={row.getValue("imageUrl")} />
                </div>
            },
        },
        {
            accessorKey: "size",
            header: ({ column }) => {
                return (
                    <div className='text-center'>Kích cỡ</div>
                )
            },
            cell: ({ row }) => <div className="text-center lowercase">{row.getValue("size").name}</div>,
        },
        {
            accessorKey: "color",
            header: () => <div className="text-center">màu sắc</div>,
            cell: ({ row }) => {

                return <div className={`text-center font-medium rounded-md px-1 py-1 text-slate-200`} style={{ backgroundColor: row.original.color.name }}>{row.original.color.name}</div>
            },
        },
        {
            accessorKey: "price",
            header: () => <div className="text-center">Giá</div>,
            cell: ({ row }) => {

                return <div className="text-center font-medium">{row.original.price}</div>
            },
        },
        {
            accessorKey: "status",
            header: () => <div className="text-center">status</div>,
            cell: ({ row }) => {
                return <div className="text-center flex justify-center font-medium max-h-16">
                    <Tag color='cyan'>{row.original.status == 0 ? "Đang bán" : "Đã ngừng"}</Tag>
                </div>
            },
        }
    ], []);

    const belowTable = useReactTable({
        data: belowData,
        columns: belowColumns,
        onSortingChange: setBelowSorting,
        onColumnFiltersChange: setBelowColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setBelowColumnVisibility,
        onRowSelectionChange: setBelowRowSelection,
        state: {
            sorting: belowSorting,
            columnFilters: belowColumnFilters,
            columnVisibility: belowColumnVisibility,
            rowSelection: belowRowSelection,
        },
    })

    useEffect(() => {
        belowTable.toggleAllRowsSelected(selected);
    }, [belowTable, selected])

    return (
        <>
            <div className="mr-4">
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            {belowTable.getHeaderGroups().map((headerGroup) => (
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
                            {belowTable.getRowModel().rows?.length ? (
                                belowTable.getRowModel().rows.map((row) => (
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
                                        colSpan={belowColumns.length}
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
                        {belowTable.getFilteredSelectedRowModel().rows.length} of{" "}
                        {belowTable.getFilteredRowModel().rows.length} row(s) selected.
                    </div>
                    <div className="space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => belowTable.previousPage()}
                            disabled={!belowTable.getCanPreviousPage()}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => belowTable.nextPage()}
                            disabled={!belowTable.getCanNextPage()}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}