import { Tag, Checkbox } from 'antd/lib'
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
import { useAppSelector } from '../../redux/storage';
import { Modal } from 'antd';
import { Button } from "~/components/ui/button"
import { Label } from "~/components/ui/label"
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group"
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
import { VoucherResponse, User } from "~/lib/type"
import axios from 'axios'
import { baseUrl, nextUrl } from '~/lib/functional'
import { Link, redirect, useNavigate } from 'react-router-dom'
import ListDeleted from '../../components/user/listDeleted'
export default function ListTable() {
    const [data, setData] = useState<User[]>([]);

    const navigate = useNavigate();

    const fillData = () => {
        axios.get(`${nextUrl}/user`).then(res => {
            setData(res.data);
        })
    }
    useEffect(() => {
        fillData()
    }, [])

    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({});

    const [filterType, setFilterType] = useState('0');

    const customFilterType = (
        row,
        columnId,
        filterValue
    ) => {
        if (filterValue == '0') {
            return true;
        } else if (filterValue == '1') {
            return !row.original.delete_flag
        } else if (filterValue == '2') {
            return row.original.delete_flag
        }
    }

    const columns: ColumnDef<User>[] = useMemo(() => [
        {
            id: "#",
            header: () => <div className="text-center">#</div>,
            cell: ({ row }) => {
                return <div className='text-center'>
                    {row.index + 1}
                </div>
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
                        Tên
                        <CaretSortIcon className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="">{row.original.full_name}</div>,
        },
        {
            accessorKey: "email",
            header: () => <div className="text-center">Email</div>,
            cell: ({ row }) => {
                return <div className='text-center'>
                    {row.original.email}
                </div>
            },
        },
        {
            accessorKey: "birthday",
            header: () => <div className="text-center">Ngày sinh</div>,
            cell: ({ row }) => {
                return <div className='text-center'>
                    {row.original.birthday && row.original.birthday.toString().split("T")[0]}
                </div>
            },
        },
        {
            accessorKey: "phone",
            header: () => <div className="text-center">Số điện thoại</div>,
            cell: ({ row }) => {
                return <div className="text-center font-medium max-h-16">
                    {row.original.phone}
                </div>
            },
        },
        {
            accessorKey: "delete_flag",
            header: () => <div className="text-center">Trạng thái</div>,
            filterFn: customFilterType,
            cell: ({ row }) => {
                return <div className="text-center font-medium max-h-16">
                    <Tag color={row.original.delete_flag ? 'red' : 'blue'}>{row.original.delete_flag ? 'đã nghỉ' : 'đang làm việc'}</Tag>
                </div>
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
                                        axios.post(`${nextUrl}/user/delete`, {
                                            id: row.original.id
                                        }).then(res => {
                                            navigate(0);
                                            fillData();
                                        })
                                    }
                                }}>Xóa</DropdownMenuItem>
                                <DropdownMenuItem><Link to={`/user/staff/update/${row.original.id}`}>Cập nhật</Link></DropdownMenuItem>
                                <DropdownMenuItem><Link to={`/user/staff/detail/${row.original.id}`}>Chi tiết</Link></DropdownMenuItem>
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
            <div className="w-full rounded-md">
                <div className='bg-white rounded-md mb-3 p-6 shadow-md'>
                    <div className='flex justify-between'>
                        <p className='text-xl font-bold mb-3'>Nhân viên</p>
                        <div className='flex gap-5'>
                            <Button onClick={() => { navigate('/user/staff/add') }} variant="outline" className="bg-blue-500 text-white">Thêm nhân viên</Button>
                            <Recover />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 my-3">
                        <div>
                            <p className='text-sm font-semibold mb-1'>Tên</p>
                            <Input
                                placeholder="tìm kiếm theo tên"
                                value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                                onChange={(event) =>
                                    table.getColumn("name")?.setFilterValue(event.target.value)
                                }
                                className="max-w-sm"
                            />
                        </div>
                        <div>
                            <p className='text-sm font-semibold mb-1'>Email</p>
                            <Input
                                placeholder="tìm kiếm theo email"
                                value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
                                onChange={(event) =>
                                    table.getColumn("email")?.setFilterValue(event.target.value)
                                }
                                className="max-w-sm"
                            />
                        </div>
                        <div>
                            <p className='text-sm font-semibold mb-1'>Số điện thoại</p>
                            <Input
                                placeholder="tìm kiếm theo số điện thoại"
                                value={(table.getColumn("phone")?.getFilterValue() as string) ?? ""}
                                onChange={(event) =>
                                    table.getColumn("phone")?.setFilterValue(event.target.value)
                                }
                                className="max-w-sm"
                            />
                        </div>
                        <div>
                            <p className='text-sm font-semibold mb-1'>Trạng thái</p>
                            <RadioGroup defaultValue="0" value={(table.getColumn("delete_flag")?.getFilterValue() as string) ?? "0"} onValueChange={value => { table.getColumn("delete_flag")?.setFilterValue(value) }}>
                                <div className='flex gap-2 items-center'>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="0" id="0" />
                                        <Label htmlFor="0">Tất cả</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="1" id="1" />
                                        <Label htmlFor="1">Đang làm việc</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="2" id="2" />
                                        <Label htmlFor="2">Đã nghỉ</Label>
                                    </div>
                                </div>
                            </RadioGroup>
                        </div>
                    </div>
                </div>
                <div className="rounded-md border p-3 bg-white shadow-md">
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
            </div>
        </>
    )
}

const Recover = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate()
    const showModal = () => {
        setIsModalOpen(true);
    };

    const listUserDeletedSelect = useAppSelector(state => state.voucherDeletedReducer.value.selected)

    const handleOk = () => {
        const promises = listUserDeletedSelect.map(slt => {
            return axios.get(`${baseUrl}/user/recover?id=${slt.id}`)
        })
        Promise.all(promises).then(() => {
            navigate(0);
            setIsModalOpen(false);
        })

    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };



    return (
        <>
            <button onClick={showModal} style={{ backgroundColor: "red" }} className="bg-opacity-55 px-3 text-white font-semibold rounded-md">Khôi phục nhân viên</button>
            <Modal title="Khôi phục lại" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} className='w-fit min-w-[80%]'>
                <ListDeleted />
            </Modal>
        </>
    );
}

