import { DatePicker, InputNumber, Select, Button } from 'antd/lib';
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
import { useNavigate, useParams } from 'react-router-dom';
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
        message: "Hãy nhập tên",
    }),
    gender: z.number({
        required_error: "Hãy chọn giới tính",
    }),
    address: z.string(),
    phone: z.string().startsWith("0"),
    email: z.string().email({}),
    username: z.string().min(4, {
        message: "",
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

    const [targetCustomer, setTargetCustomer] = useState();
    const [listAddress, setListAddress] = useState([])

    const path = useParams();


    const setAddProvinceP = (value, key) => {
        const province = vnData.find(target => { return target.name == value });
        if (!province) return;
        const t = province.districts;
        setListDistricts(t)
        setListAddress(prev => { return prev.map(target => { if (target.key == key) { return { ...target, province: value, district: t[0].name, commune: t[0].wards[0].name } } else { return target } }); })
    }

    const setAddDistrictP = (value, key) => {
        const t = listDistricts.find(target => { return target.name == value }).wards;
        setListWards(t)
        setListAddress(prev => { return prev.map(target => { if (target.key == key) { return { ...target, district: value, commune: t[0].name } } else { return target } }); })
    }

    const setAddCommuneP = (value, key) => {
        setListAddress(prev => { return prev.map(target => { if (target.key == key) { return { ...target, commune: value } } else { return target } }); })
    }



    useEffect(() => {
        axios.get(`${baseUrl}/customer/${path.id}`).then(res => {
            setTargetCustomer(res.data)
            setBirthday(dayjs(res.data.birthday))
            setListAddress(res.data.lstAddress.map((add, index) => {
                return {
                    ...add,
                    key: index,
                    receivername: add.receiverName,
                    phone: add.receiverPhone
                }
            }))
        })
    }, [path.id])

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

    const handleChangeReceiverPhone = (key, newValue) => {
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
                {row.original && <div className="capitalize">{row.index + 1}</div>}
            </>
            ),
        },
        {
            accessorKey: "receivername",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        className='flex items-center border-none'
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        tên người nhận
                        <CaretSortIcon className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="lowercase">
                {row.original && <Input value={row.original.receivername} onChange={e => handleChangeReceiverName(row.original.key, e.target.value)} />}
            </div>,
        },
        {
            accessorKey: "phone",
            header: () => <div className="text-center">số điện thoại</div>,
            cell: ({ row }) => {
                return <div className="text-center font-medium max-h-16">
                    {row.original && <Input value={row.original.phone} onChange={e => { handleChangeReceiverPhone(row.original.key, e.target.value) }} />}
                </div>
            },
        },
        {
            accessorKey: "province",
            header: () => <div className="text-center">Tỉnh/ Thành phố</div>,
            cell: ({ row }) => {
                return <div className='text-center'>
                    {row.original && <Select placeholder='Tỉnh/ Thành phố' value={row.original.province} onChange={value => { setAddProvinceP(value, row.original.key); }}>
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
                    {row.original && <Select placeholder='Tỉnh/ Thành phố' value={row.original.district} onChange={value => { setAddDistrictP(value, row.original.key); }}>
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
                    {row.original && <Select placeholder='Tỉnh/ Thành phố' value={row.original.commune} onChange={value => { setAddCommuneP(value, row.original.key); }}>
                        {
                            listWards.map(ward => {
                                return <option key={ward.code} value={ward.name}>{ward.name}</option>
                            })
                        }
                    </Select>
                    }
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
                                <Button type='primary' variant="ghost" className="h-8 w-8 p-0 flex justify-center items-center">
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
            mode: 'all',
            values: {
                codeCustomer: targetCustomer ? targetCustomer.codeCustomer : makeid(),
                fullName: targetCustomer ? targetCustomer.fullName : "",
                birthDay: targetCustomer ? targetCustomer.birthDay : birthDay,
                gender: targetCustomer ? targetCustomer.gender : "",
                address: targetCustomer ? targetCustomer.address : "",
                phone: targetCustomer ? targetCustomer.phone : "",
                email: targetCustomer ? targetCustomer.email : "",
                username: targetCustomer ? targetCustomer.username : "",
                password: targetCustomer ? targetCustomer.password : makeid(),
            }
        }
    )

    const handleSubmitForm = (values) => {
        const data = { ...values, birthDay: birthDay }
        axios.put(`${baseUrl}/customer/${path.id}`, data).then(res => {
            const promises = listAddress.map(add => {
                return axios.get(`${nextUrl}/address?receiverName=${add.receivername}&receiverPhone=${add.phone}&customer=${res.data.data.id}&detail=${add.detail}&commune=${add.commune}&district=${add.district}&province=${add.province}&defaultAddress=${false}`)
            })
            return Promise.all(promises)
                .then(() => {
                    toast.success('cập nhật khách hàng thành công');
                    setTimeout(() => {
                        navigate(`/user/customer/detail/${res.data.data.id}`)
                    }, 2000);
                });
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
            <div className='flex flex-col gap-3 w-full bg-white shadow-lg rounded-md p-5'>
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
                        {/* <FormField
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
                        /> */}

                        <Button type='primary' onClick={handleAddAddress}>Thêm địa chỉ mới</Button>

                        <div className="rounded-md border bg-white p-3">
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
                                    type='primary'
                                    variant="outline"
                                    size="sm"
                                    onClick={() => table.previousPage()}
                                    disabled={!table.getCanPreviousPage()}
                                >
                                    Previous
                                </Button>
                                <Button
                                    type='primary'
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
                            <Button type="primary" onClick={() => { handleSubmitForm(form.getValues()) }}>Cập nhật khách hàng</Button>
                        </div>
                    </form>
                </Form>
            </div>


        </div>
    )
} 