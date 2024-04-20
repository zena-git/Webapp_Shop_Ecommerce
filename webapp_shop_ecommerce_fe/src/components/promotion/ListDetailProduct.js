import { Tag, Checkbox, Button } from 'antd/lib'
import { useState, useEffect, useMemo } from "react"
import {
    CaretSortIcon,
} from "@radix-ui/react-icons"
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { useAppSelector } from '../../redux/storage'
import { set, updateSelected, toggleChildren } from '../../redux/features/promotion-selected-item'
import { useDispatch } from "react-redux";
import Table from '../../components/ui/table'
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
            id: "select",
            header: ({ table }) => (
                <div className='flex justify-center'>
                    <Checkbox
                        checked={
                            table.getIsAllPageRowsSelected()
                        }
                        onChange={(value) => dispatch(set({
                            value: {
                                selected: data.map(product => {
                                    return {
                                        id: product.id, selected: !!value.target.checked, children: product.lstProductDetails.map(detail => {
                                            return { id: detail.id, selected: !!value.target.checked }
                                        })
                                    }
                                })
                            }
                        }))}
                        aria-label="Select all"
                    />
                </div>
            ),
            cell: ({ row }) => (
                <div className='flex justify-center'>
                    <Checkbox
                        disabled={!!selectedProduct.find(pro => pro.id == row.original.id)?.disable}
                        defaultChecked={(selectedProduct.find(value => value.id == row.original.id)?.selected || false)}
                        onChange={(value) => { dispatch(updateSelected({ id: row.original.id, selected: !!value.target.checked })) }}
                        aria-label="Select row"
                    />
                </div>
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
                    <div
                        className='flex items-center justify-center min-h-10'
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Tên sản phẩm
                        <CaretSortIcon className="ml-2 h-4 w-4" />
                    </div>
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
            cell: ({ row }) => <div className="lowercase text-center">{minMaxPrice(row.original.lstProductDetails)}</div>,
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
                <div className="rounded-md border">
                    <table className="min-w-full border border-collapse border-spacing-0">
                        <thead className='bg-purple-600 text-slate-100'>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id} className='border-b border-gray-300'>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <th key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </th>
                                        )
                                    })}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="bg-slate-50 divide-y divide-gray-200">
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <>
                                        <tr
                                            key={row.id}
                                            className={row.getIsSelected() ? "bg-blue-100" : ""}
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <td
                                                    key={cell.id}
                                                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                                >
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
                                                </td>
                                            ))
                                            }
                                        </tr>
                                        {open[row.original.id] && (
                                            <tr key={`${row.id}-details`}>
                                                <td colSpan={columns.length} className="py-4">
                                                    <ProductDetailTable
                                                        targetDataId={row.original.id}
                                                        selected={row.getIsSelected()}
                                                        belowData={row.original.lstProductDetails}
                                                    />
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={columns.length}
                                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
                                    >
                                        No results.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
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

    useEffect(() => {
        console.log(selectedProduct)
    }, [selectedProduct])

    const dispatch = useDispatch();

    const belowColumns = useMemo(() => [
        {
            id: "select",
            header: ({ table }) => (
                <div></div>
            ),
            cell: ({ row }) => (
                <Checkbox
                    defaultChecked={selectedProduct.find(slt => slt.id == targetDataId) && selectedProduct.find(slt => slt.id == targetDataId).children.find(child => { return child.id == row.original.id })?.selected}
                    onClick={(value) => { dispatch(toggleChildren({ id: row.getValue("id"), parentId: targetDataId, value: !!value.target.checked })) }}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "imageUrl",
            header: () => <div className="text-center">Ảnh</div>,
            cell: ({ row }) => {
                return <div className="text-center flex justify-center font-medium max-h-16">
                    {row.original.image_url ? <img className="w-16 aspect-square" src={row.original.imageUrl.split(" | ")[0]}></img> : "không có"}
                </div>
            },
        },
        {
            accessorKey: "size",
            header: ({ column }) => {
                return (
                    <div className='text-center min-h-8 flex items-center justify-center'>Kích cỡ</div>
                )
            },
            cell: ({ row }) => <div className="text-center">{row.original.size.name}</div>,
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

                return <div className="text-center font-medium">{numberToPrice(row.original.price)}</div>
            },
        },
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

    return (
        <>
            <div className="mr-4">
                <div className="rounded-md border">
                    {Table(belowTable, flexRender, belowColumns)}
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