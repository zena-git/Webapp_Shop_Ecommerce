import { DatePicker, InputNumber, Select, Button, Checkbox } from 'antd/lib';
import { Input } from "../../components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { useEffect, useState, useMemo } from 'react';
import dayjs from 'dayjs';
import { makeid } from '~/lib/functional';
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group"
import { Label } from "~/components/ui/label"
// import { Button } from '~/components/ui/button';
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
import { baseUrl, nextUrl } from '../../lib/functional'
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

    const [defaultAddress, setDefaultAddress] = useState(0);

    const setAddProvinceP = (value, key) => {
        if (!key) return;
        setAddProvince(value);
        const province = vnData.find(target => { return target.name == value });
        if (!province) return;
        const t = province.districts;
        setListDistricts(t)
        try {
            setListAddress(prev => { return prev.map(target => { if (target.key == key) { return { ...target, province: value, district: t[0].name, commune: t[0].wards[0].name } } else { return target } }) })
        } catch (error) {

        }

    }

    const setAddDistrictP = (value, key) => {
        if (!key) return;
        setAddDistrict(value);
        const t = listDistricts.find(target => { return target.name == value }).wards;
        setListWards(t)
        try {
            setListAddress(prev => { return prev.map(target => { if (target.key == key) { return { ...target, district: value, commune: t[0].name } } else { return target } }); })
        } catch (error) {

        }

    }

    const setAddCommuneP = (value, key) => {
        if (!key) return;
        setAddWard(value);
        try {
            setListAddress(prev => { return prev.map(target => { if (target.key == key) { return { ...target, commune: value } } else { return target } }); })
        } catch (error) {

        }
    }

    const [listAddress, setListAddress] = useState([]);

    const navigate = useNavigate();

    const handleChangeReceiverName = (key, newValue) => {
        if (!key) return;
        try {
            setListAddress(prev => {
                return prev.map(address => {
                    if (address.key === key) {
                        return { ...address, receivername: newValue };
                    }
                    return address;
                });
            });
        } catch (e) {
            console.log(e)
        }
    };

    const handleChangeReceiverPhone = (key, newValue) => {
        if (!key) return;
        try {
            setListAddress(prev => {
                return prev.map(address => {
                    if (address.key === key) {
                        return { ...address, phone: newValue };
                    }
                    return address;
                });
            });
        } catch (error) {
            console.log(error)
        }
    }

    const columns = useMemo(() => [
        {
            accessorKey: "key",
            header: "#",
            cell: ({ row }) => (<>
                {row.original && <div className="capitalize">{row.original.key}</div>}
            </>
            ),
        },
        {
            accessorKey: "receivername",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        className='flex items-center'
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        tên người nhận
                        <CaretSortIcon className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="lowercase">
                {row.original && <Input value={row.original.receivername} onChange={e => { if (row.original) { handleChangeReceiverName(row.original.key, e.target.value) } }} />}
            </div>,
        },
        {
            accessorKey: "phone",
            header: () => <div className="text-center">số điện thoại</div>,
            cell: ({ row }) => {
                return <div className="text-center font-medium max-h-16">
                    {row.original && <Input value={row.original.phone} onChange={e => { if (row.original) { handleChangeReceiverPhone(row.original.key, e.target.value) } }} />}
                </div>
            },
        },
        {
            accessorKey: "province",
            header: () => <div className="text-center">Tỉnh/ Thành phố</div>,
            cell: ({ row }) => {
                return <div className='text-center'>
                    {row.original && <Select placeholder='Tỉnh/ Thành phố' value={row.original.province} onChange={value => { if (row.original) { setAddProvinceP(value, row.original.key); } }}>
                        {vnData.map((province) => {
                            return <option key={province.code} value={province.name}>{province.name}</option>
                        })}
                    </Select>}
                </div>
            },
        },
        {
            accessorKey: "district",
            header: () => <div className="text-center">Quận/ huyện</div>,
            cell: ({ row }) => {
                return <div className='text-center'>
                    {row.original && <Select placeholder='Tỉnh/ Thành phố' value={row.original.district} onChange={value => { if (row.original) { setAddDistrictP(value, row.original.key); } }}>
                        {
                            listDistricts.map(district => {
                                return <option key={district.code} value={district.name}>{district.name}</option>
                            })
                        }
                    </Select>}
                </div>
            },
        },
        {
            accessorKey: "commune",
            header: () => <div className="text-center">Xã/ phường</div>,
            cell: ({ row }) => {
                return <div className='text-center'>
                    {row.original && <Select placeholder='Tỉnh/ Thành phố' value={row.original.commune} onChange={value => { if (row.original) { setAddCommuneP(value, row.original.key); } }}>
                        {
                            listWards.map(ward => {
                                return <option key={ward.code} value={ward.name}>{ward.name}</option>
                            })
                        }
                    </Select>
                    }
                </div>
            },
        },
        // {
        //     accessorKey: "default",
        //     header: () => <div className="text-center">mặc định</div>,
        //     cell: ({ row }) => {
        //         return <div className='text-center'>
        //             <Checkbox checked={defaultAddress == row.original.key} onClick={() => { setDefaultAddress(row.original.key) }} />
        //         </div>
        //     },
        // },
        // {
        //     id: "hành động",
        //     enableHiding: false,
        //     header: () => <div className="text-center">hành động</div>,
        //     cell: ({ row }) => {
        //         return (
        //             <div className="flex justify-center">
        //                 <DropdownMenu>
        //                     <DropdownMenuTrigger asChild>
        //                         <Button type='primary' variant="ghost" className="h-8 w-8 p-0 flex justify-center items-center">
        //                             <DotsHorizontalIcon className="h-4 w-4" />
        //                         </Button>
        //                     </DropdownMenuTrigger>
        //                     <DropdownMenuContent align="end">
        //                         <DropdownMenuLabel>Hành động</DropdownMenuLabel>
        //                         <DropdownMenuSeparator />
        //                         <DropdownMenuItem onClick={() => { setListAddress(listAddress.map(target => { if (target.key != row.original.key) return target })) }}>Xóa</DropdownMenuItem>
        //                     </DropdownMenuContent>
        //                 </DropdownMenu>
        //             </div>
        //         )
        //     },
        // },
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
                phone: "",
                email: "",
                username: "",
                password: makeid(),
            },
            mode: 'all'
        }
    )

    const handleSubmitForm = (values) => {
        const data = { ...values, birthday: birthDay }
        axios.post(`${baseUrl}/customer`, data).then(res => {
            const promises = listAddress.map(add => {
                return axios.get(`${nextUrl}/address?receiverName=${add.receivername}&receiverPhone=${add.phone}&customer=${res.data.data.id}&detail=${add.detail}&commune=${add.commune}&district=${add.district}&province=${add.province}&defaultAddress=${false}`)
            })
            Promise.all(promises).then(() => {
                toast.success('thêm khách hàng thành công');
                setTimeout(() => {
                    navigate(`/user/customer/detail/${res.data.data.id}`)
                }, 2000)
            })
        })
    }

    const handleAddAddress = () => {
        setListAddress(prev => [...prev, {
            key: prev.length + 1,
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
        <div className='flex max-lg:flex-col gap-5 pb-8'>
            <div className='flex flex-col gap-3 w-2/5 max-lg:w-full bg-white p-5 shadow-lg rounded-lg'>
                <p className='ml-3 text-lg font-semibold'>Thêm mới khách hàng</p>
                <ToastContainer />
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
                                            <Input className='w-full h-10' {...field} />
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
                                                    <p>Ngày sinh</p>
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
                        <div className='flex gap-4'>
                            <Button type="primary" onClick={() => { handleSubmitForm(form.getValues()) }}>Tạo khách hàng</Button>
                        </div>
                    </form>
                </Form>
            </div>
            <div className="rounded-md border flex-grow bg-white shadow-lg p-6 flex flex-col gap-5">

                <div className='w-fit'><Button type='primary' onClick={handleAddAddress}>Thêm địa chỉ mới</Button></div>
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
    )
} 