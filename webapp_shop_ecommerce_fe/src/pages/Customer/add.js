import { DatePicker, InputNumber, Select } from 'antd/lib';
import { Input } from "../../components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { useEffect, useState, useMemo } from 'react';
import dayjs from 'dayjs';
import { makeid } from '~/lib/functional';
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group"
import { Label } from "~/components/ui/label"
import { Button } from '~/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "~/components/ui/form"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseUrl } from '../../lib/functional'
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

import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "~/components/ui/table"
// import { Select } from '../../components/ui/select'

import { vnData } from '../../lib/extra'

dayjs.extend(customParseFormat);

const formSchema = z.object({
    codeCustomer: z.string().min(2, {
        message: "code must be at least 2 characters.",
    }),
    fullName: z.string().min(2, {
        message: "name must be at least 2 characters.",
    }),
    gender: z.number({
        required_error: "You need to select a target type.",
    }),
    address: z.string({
        required_error: "You need to select a discount type.",
    }),
    phone: z.string(),
    email: z.string().email({}),
    username: z.string().min(4, {
        message: "max dis must be at least 4 characters.",
    }),
    password: z.string()
})

export default function AddCustomer() {

    const [sorting, setSorting] = useState([])
    const [columnFilters, setColumnFilters] = useState([])
    const [columnVisibility, setColumnVisibility] = useState({})
    const [rowSelection, setRowSelection] = useState({})

    const [birthDay, setBirthday] = useState(dayjs(new Date()));
    const [listDistricts, setListDistricts] = useState([]);
    const [listWards, setListWards] = useState([]);

    const [addProvince, setAddProvince] = useState("Thành phố Hà Nội");
    const [addDistrict, setAddDistrict] = useState("Quận Ba Đình");
    const [addWard, setAddWard] = useState("Phường Phúc Xá");

    const setAddProvinceP = (value, key) => {
        setAddProvince(value);
        const province = vnData.find(target => { return target.name == value });
        if (!province) return;
        const t = province.districts;
        setListDistricts(t)
        setListAddress(prev => { return prev.map(target => { if (target.key == key) return { ...target, province: value, district: t[0].name, commune: t[0].wards[0].name } }); })
    }

    const setAddDistrictP = (value, key) => {
        setAddDistrict(value);
        const t = listDistricts.find(target => { return target.name == value }).wards;
        setListWards(t)
        setListAddress(prev => { return prev.map(target => { if (target.key == key) return { ...target, district: value, commune: t[0].name } }); })
    }

    const setAddCommuneP = (value, key) => {
        setAddWard(value);
        setListAddress(prev => { return prev.map(target => { if (target.key == key) return { ...target, commune: value } }); })
    }

    const [listAddress, setListAddress] = useState([])

    const navigate = useNavigate();

    const handleChangeReceiverName = (key, newValue) => {
        setListAddress(prev => {
            return prev.map(address => {
                if (address.key === key) {
                    return { ...address, receivername: newValue };
                }
                return address;
            });
        });
    };

    const columns = useMemo(() => [
        {
            accessorKey: "key",
            header: "#",
            cell: ({ row }) => (
                <div className="capitalize">{row.original.key}</div>
            ),
        },
        {
            accessorKey: "receivername",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        tên người nhận
                        <CaretSortIcon className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="lowercase">
                <Input value={row.original.receivername} onChange={e => handleChangeReceiverName(row.original.key, e.target.value)} />
            </div>,
        },
        {
            accessorKey: "phone",
            header: () => <div className="text-center"></div>,
            cell: ({ row }) => {
                return <div className="text-center font-medium max-h-16">
                    <Input value={row.original.phone} onChange={e => { setListAddress(prev => { return prev.map(target => { if (target.key == row.original.key) return { ...target, phone: e.target.value } }); }) }} />
                </div>
            },
        },
        {
            accessorKey: "province",
            header: () => <div className="text-center">Tỉnh/ Thành phố</div>,
            cell: ({ row }) => {
                return <div className='text-center'>
                    <Select placeholder='Tỉnh/ Thành phố' value={row.original.province} onChange={value => { setAddProvinceP(value, row.original.key); }}>
                        {vnData.map((province) => {
                            return <option key={province.code} value={province.name}>{province.name}</option>
                        })}
                    </Select>
                </div>
            },
        },
        {
            accessorKey: "district",
            header: () => <div className="text-center">Quận/ huyện</div>,
            cell: ({ row }) => {
                return <div className='text-center'>
                    <Select placeholder='Tỉnh/ Thành phố' value={row.original.district} onChange={value => { setAddDistrictP(value, row.original.key); }}>
                        {
                            listDistricts.map(district => {
                                return <option key={district.code} value={district.name}>{district.name}</option>
                            })
                        }
                    </Select>
                </div>
            },
        },
        {
            accessorKey: "commune",
            header: () => <div className="text-center">Xã/ phường</div>,
            cell: ({ row }) => {
                return <div className='text-center'>
                    <Select placeholder='Tỉnh/ Thành phố' value={row.original.commune} onChange={value => { setAddCommuneP(value, row.original.key); }}>
                        {
                            listWards.map(ward => {
                                return <option key={ward.code} value={ward.name}>{ward.name}</option>
                            })
                        }
                    </Select>
                </div>
            },
        }, {
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
                                <DropdownMenuItem onClick={() => { setListAddress(listAddress.map(target => { if (target.key != row.original.key) return target })) }}>Xóa</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )
            },
        },
    ], [listDistricts, listWards]);



    const table = useReactTable({
        data: listAddress,
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


    const form = useForm(
        {
            resolver: zodResolver(formSchema),
            defaultValues: {
                codeCustomer: makeid(),
                fullName: "",
                birthDay: birthDay,
                gender: "",
                address: "",
                phone: 0,
                email: 0,
                username: "",
                password: makeid(),
            },
            mode: 'all'
        }
    )

    const handleSubmitForm = (values) => {
        const data = { ...values, birthDay: birthDay }
        axios.post(`${baseUrl}/customer`, data).then(res => {
            listAddress.map(add => {
                axios.post(`${baseUrl}/address`, { ...add, customer: res.data.data.id, defaultAddress: false })
            })
            toast.success('thêm khách hàng thành công');
            setTimeout(() => {
                navigate(`/user/customer/detail/${res.data.data.id}`)
            }, 2000)
        })
    }

    const handleAddAddress = () => {

        setListAddress(prev => [...prev, {
            key: listAddress.length + 1,
            receivername: "",
            phone: "",
            province: "Thành phố Hà Nội",
            district: "Quận Ba Đình",
            commune: "Phường Phúc Xá"
        }])
    }

    useEffect(() => {
        console.log(listAddress)
    }, [listAddress])

    return (
        <div className='flex xl:flex-col'>
            <ToastContainer />
            <div className='flex flex-col gap-3 w-full'>
                <Form {...form}>
                    <form onSubmit={e => { e.preventDefault() }} className="space-y-8">
                        <div className='grid grid-cols-2 max-lg:grid-cols-1 p-3 gap-x-6'>
                            <FormField
                                control={form.control}
                                name="fullName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Họ và tên</FormLabel>
                                        <FormControl>
                                            <Input placeholder="name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) =>
                                (
                                    <FormItem>
                                        <FormLabel>Số điện thoại</FormLabel>
                                        <FormControl>
                                            <InputNumber className='w-full h-10' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className='grid grid-cols-2 max-lg:grid-cols-1 p-3 gap-x-6 items-center'>
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) =>
                                (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input className='w-full' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className='flex gap-5 items-center'>
                                <FormField
                                    control={form.control}
                                    name="birthday"
                                    render={({ field }) =>
                                    (
                                        <FormItem>
                                            <FormLabel></FormLabel>
                                            <FormControl>
                                                <>
                                                    <p>Sinh nhật</p>
                                                    <DatePicker format={"DD-MM-YYYY"} maxDate={dayjs(new Date(), "DD-MM-YYYY")} value={birthDay} onChange={birthDay => setBirthday(birthDay)} />
                                                </>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="gender"
                                    render={({ field }) =>
                                    (
                                        <FormItem>
                                            <FormLabel>Giới tính</FormLabel>
                                            <FormControl defaultValue='1'>
                                                <RadioGroup className="flex gap-3 items-center">
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="0" id="option-one" />
                                                        <Label htmlFor="option-one">Nam</Label>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="1" id="option-two" />
                                                        <Label htmlFor="option-two">Nữ</Label>
                                                    </div>
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) =>
                            (
                                <FormItem>
                                    <FormLabel>Địa chỉ chi tiết</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="địa chỉ chi tiết" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button onClick={handleAddAddress}>Thêm địa chỉ mới</Button>

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

                        <div className='flex gap-4'>
                            <Button type="submit" onClick={() => { handleSubmitForm(form.getValues()) }}>Tạo khách hàng</Button>
                        </div>
                    </form>
                </Form>
            </div>


        </div>
    )
} 