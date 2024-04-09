import { Tag, Checkbox } from 'antd/lib'
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

    const handleToggleOpen = (id) => {
        setOpen((prevOpen) => ({
            ...prevOpen,
            [id]: !prevOpen[id] // Nếu đã mở thì đóng, và ngược lại
        }));
    };

    const columns = useMemo(() => [
        {
            id: "#",
            header: () => <div className="text-center">#</div>,
            cell: ({ row }) => {
                return (<div className='flex justify-center'>{row.index + 1}</div>)
            },
        },
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected()
                    }
                    onChange={(value) => dispatch(set({
                        value: {
                            selected: data.map(product => {
                                return {
                                    id: product.id, selected: !!value.target.checked, children: product.ProductDetail.map(detail => {
                                        return { id: detail.id, selected: !!value.target.checked }
                                    })
                                }
                            })
                        }
                    }))}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    disabled={!!selectedProduct.find(pro => pro.id == row.original.id).disable}
                    defaultChecked={(selectedProduct.find(value => value.id == row.original.id)?.selected || false)}
                    onChange={(value) => { dispatch(updateSelected({ id: row.original.id, selected: !!value.target.checked })) }}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "image",
            header: () => <div className="text-center">Ảnh</div>,
            cell: ({ row }) => {
                return (<div className='flex justify-center'>
                    {row.original.image_url ? <img src={row.original.image_url.split(" | ")[0]} alt='' className='w-16 aspect-square'></img> : "Không có"}
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
            accessorKey: "giá",
            header: ({ column }) => {
                return (
                    <div className='flex justify-center'>Giá</div>
                )
            },
            cell: ({ row }) => <div className="lowercase text-center">{minMaxPrice(row.original.ProductDetail)}</div>,
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
    ], [data, dispatch, open, selectedProduct]);

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
                                            onChange={(value) =>
                                                column.toggleVisibility(!!value.target.value)
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
                                            {open[row.original.id] && <TableCell colSpan={columns.length}>
                                                <ProductDetailTable targetDataId={row.original.id} selected={row.getIsSelected()} belowData={row.original.ProductDetail}></ProductDetailTable>
                                                {/* {ProductDetailTable({belowData: row.original.ProductDetail,selected:row.getIsSelected() , targetDataId:row.original.id })} */}
                                            </TableCell>}
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

    const selectedProduct = useAppSelector((state) => state.promotionReducer.value.selected);
    const dateRange = useAppSelector(state => state.promotionDateReducer.value.date);

    const dispatch = useDispatch();

    const belowColumns = useMemo(() => [
        {
            id: "select",
            header: ({ table }) => (
                <div></div>
            ),
            cell: ({ row }) => (
                <Checkbox
                    disabled={!!selectedProduct.find(pro => pro.id == targetDataId).children.find(child => child.id == row.original.id).disable}
                    defaultChecked={selectedProduct.find(slt => slt.id == targetDataId) && selectedProduct.find(slt => slt.id == targetDataId).children.find(child => { return child.id == row.original.id })?.selected}
                    onClick={(value) => { dispatch(toggleChildren({ id: row.getValue("id"), parentId: targetDataId, value: !!value.target.checked })) }}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "id",
            header: "#",
            cell: ({ row }) => (
                <div className="capitalize">{row.index + 1}</div>
            ),
        },
        {
            accessorKey: "image_url",
            header: () => <div className="text-center">ảnh</div>,
            cell: ({ row }) => {
                return <div className="text-center flex justify-center font-medium max-h-16">
                    {row.original.image_url ? <img className="w-16 aspect-square" src={row.original.image_url.split(" | ")[0]}></img> : "không có"}
                </div>
            },
        },
        {
            accessorKey: "Size",
            header: ({ column }) => {
                return (
                    <div className='text-center'>Kích cỡ</div>
                )
            },
            cell: ({ row }) => <div className="text-center">{row.original.Size.name}</div>,
        },
        {
            accessorKey: "Color",
            header: () => <div className="text-center">màu sắc</div>,
            cell: ({ row }) => {

                return <div className={`text-center font-medium rounded-md px-1 py-1 text-slate-200`} style={{ backgroundColor: row.original.Color.name }}>{row.original.Color.name}</div>
            },
        },
        {
            accessorKey: "price",
            header: () => <div className="text-center">Giá</div>,
            cell: ({ row }) => {

                return <div className="text-center font-medium">{numberToPrice(row.original.price)}</div>
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
    ], [dispatch, selectedProduct, targetDataId]);

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
        const keysArray = Object.keys(belowRowSelection).map(Number);
        if (keysArray.length > 0) {
            keysArray.map(key => {
                dispatch(toggleChildren({ id: belowTable.getRow(key.toString()).original.id, parentId: targetDataId, value: true }))
            })
        }
    }, [belowRowSelection, belowTable, dispatch, targetDataId])

    useEffect(() => {
        belowTable.toggleAllRowsSelected(selected);
    }, [belowTable, selected])


    useEffect(() => {
        // selectedProduct.
        console.log(belowData)
    }, [belowData, dateRange])

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

function minMaxPrice(ProductDetail) {
    if (!ProductDetail || ProductDetail.length === 0) {
        return [null, null];
    }

    let minPrice = ProductDetail[0].price;
    let maxPrice = ProductDetail[0].price;
    ProductDetail.forEach(productDetail => {
        const price = productDetail.price;
        if (price < minPrice) {
            minPrice = price;
        }
        if (price > maxPrice) {
            maxPrice = price;
        }
    });

    return `${numberToPrice(minPrice)} - ${numberToPrice(maxPrice)}`;
}

const numberToPrice = (value) => {
    const formattedAmount = Number.parseFloat(value.toString()).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    return formattedAmount;
}