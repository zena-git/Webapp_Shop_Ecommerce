import { DatePicker, InputNumber, Input, Select, Button, Checkbox, Modal, Radio } from 'antd/lib';
import { useEffect, useState, useMemo } from 'react';
import dayjs from 'dayjs';
import { makeid } from '~/lib/functional';
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
import { IoArrowBackSharp } from "react-icons/io5";
import { FaEdit, FaTrash } from 'react-icons/fa'

const { TextArea } = Input;
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
const modalFormSchema = z.object({
    receiverName: z.string(),
    phone: z.string(),
    detail: z.string()
})
const token = 'a98f6e38-f90a-11ee-8529-6a2e06bbae55'
export default function AddCustomer() {
    const [pending, setPending] = useState(false);
    const [sorting, setSorting] = useState([])
    const [columnFilters, setColumnFilters] = useState([])
    const [columnVisibility, setColumnVisibility] = useState({})
    const [rowSelection, setRowSelection] = useState({})

    const [birthDay, setBirthday] = useState(dayjs(new Date()));
    const [listProvince, setListProvince] = useState([]);
    const [listDistricts, setListDistricts] = useState([]);
    const [listWards, setListWards] = useState([]);

    const [defaultAddress, setDefaultAddress] = useState(1);

    const [gender, setGender] = useState('0');
    const [detail, setDetail] = useState("");

    useEffect(() => {
        axios.get(`https://online-gateway.ghn.vn/shiip/public-api/master-data/province`, {
            headers: {
                token: token
            }
        }).then(res => {
            setListProvince(res.data.data);
        })
    }, [])

    const setAddProvinceP = (value, key, id) => {
        if (!key && !id) return;
        axios.get(`https://online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${value}`, {
            headers: {
                token: token
            }
        }).then(res => {
            let listFilteredDistrict = res.data.data.filter(dis => dis.DistrictID != 3451)
            setListDistricts(listFilteredDistrict);
            axios.get(`https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${listFilteredDistrict[0].DistrictID}`, {
                headers: {
                    token: token
                }
            }).then(resp => {
                setListWards(resp.data.data);
                setListAddress(prev => {
                    return prev.map(target => {
                        if ((key && target.key == key) || (id && target.id == id)) {
                            let prov = listProvince.find(province => province.ProvinceID == value);
                            setEditAddress({
                                ...editAddress, province: { id: prov.ProvinceID, name: prov.ProvinceName },
                                district: { id: listFilteredDistrict[0].DistrictID, name: listFilteredDistrict[0].DistrictName },
                                commune: { id: resp.data.data[0].WardCode, name: resp.data.data[0].WardName }
                            })
                            return {
                                ...target,
                                province: { id: prov.ProvinceID, name: prov.ProvinceName },
                                district: { id: listFilteredDistrict[0].DistrictID, name: listFilteredDistrict[0].DistrictName },
                                commune: { id: resp.data.data[0].WardCode, name: resp.data.data[0].WardName }
                            }
                        } else {
                            return target
                        }
                    })
                })
            })

        })
    }

    const setAddDistrictP = (value, key, id) => {
        if (!key && !id) return;
        axios.get(`https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${value}`, {
            headers: {
                token: token
            }
        }).then(res => {
            setListWards(res.data.data);
            setListAddress(prev => {
                return prev.map(target => {
                    if ((key && target.key == key) || (id && target.id == id)) {
                        let dist = listDistricts.find(district => district.DistrictID == value)
                        setEditAddress({
                            ...editAddress,
                            district: { id: dist.DistrictID, name: dist.DistrictName },
                            commune: { id: res.data.data[0].WardCode, name: res.data.data[0].WardName }
                        })
                        return {
                            ...target,
                            district: { id: dist.DistrictID, name: dist.DistrictName },
                            commune: { id: res.data.data[0].WardCode, name: res.data.data[0].WardName }
                        }
                    }
                    else {
                        return target
                    }
                });
            })
        })
    }

    const setAddCommuneP = (value, key, id) => {
        if (!key && !id) return;
        try {
            setListAddress(prev => {
                let ward = listWards.find(target => target.WardCode == value);
                return prev.map(target => {
                    if ((key && target.key == key) || (id && target.id == id)) {
                        return { ...target, commune: { id: ward.WardCode, name: ward.WardName } }
                    } else {
                        return target
                    }
                });
            })
        } catch (error) {

        }
    }

    const [listAddress, setListAddress] = useState([]);

    const navigate = useNavigate();

    const handleChangeReceiverName = (key, newValue, id) => {
        if (!key && !id) return;
        setEditAddress({ ...editAddress, receiverName: newValue })
        setListAddress(prev => {
            return prev.map(address => {
                if ((key && address.key == key) || (id && address.id == id)) {
                    return { ...address, receiverName: newValue };
                }
                return address;
            });
        });
    };

    const handleChangeReceiverPhone = (key, newValue, id) => {
        if (!key && !id) return;
        try {
            setEditAddress({ ...editAddress, phone: newValue })
            setListAddress(prev => {
                return prev.map(address => {
                    if ((key && address.key == key) || (id && address.id == id)) {
                        return { ...address, phone: newValue };
                    }
                    return address;
                });
            });
        } catch (error) {
            console.log(error)
        }
    }

    const handleChangeReceiverDetail = (key, newValue, id) => {
        if (!key && !id) return;
        try {
            setListAddress(prev => {
                return prev.map(address => {
                    if ((key && address.key == key) || (id && address.id == id)) {
                        return { ...address, detail: newValue };
                    }
                    return address;
                });
            });
        } catch (error) {
            console.log(error)
        }
    }

    const Remove = ({ key, id }) => {
        if (key) {
            let q = listAddress.filter(target => key != target.key)
            setListAddress(q);
        } else if (id) {
            axios.delete(`${baseUrl}/address/${id}`)
            let x = listAddress.filter(target => id != target.id)
            setListAddress(x);
        }
    }

    const columns = useMemo(() => [
        {
            accessorKey: "key",
            header: "Mặc định",
            cell: ({ row }) => (<>
                {/* {row.original && <div className="capitalize">{row.original.key}</div>} */}
                <Checkbox checked={defaultAddress == row.original.id || defaultAddress == row.original.key} onClick={() => { setDefaultAddress(row.original.id || row.original.key) }} />
            </>
            ),
        },
        {
            accessorKey: "receiverName",
            header: ({ column }) => {
                return (
                    <div
                        className='flex items-center min-h-10 justify-center'
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Tên người nhận
                        <CaretSortIcon className="ml-2 h-4 w-4" />
                    </div>
                )
            },
            cell: ({ row }) => <div className="lowercase">
                {row.original && <p>{row.original.receiverName}</p>}
            </div>,
        },
        {
            accessorKey: "phone",
            header: () => <div className="text-center">số điện thoại</div>,
            cell: ({ row }) => {
                return <div className="text-center font-medium max-h-16">
                    {row.original && <p>{row.original.phone}</p>}
                </div>
            },
        },
        {
            accessorKey: "province",
            header: () => <div className="text-center">Tỉnh/ Thành phố</div>,
            cell: ({ row }) => {
                return <div className='text-center'>
                    {
                        row.original &&
                        <p>{row.original.province.name}</p>
                    }
                </div>
            },
        },
        {
            accessorKey: "district",
            header: () => <div className="text-center">Quận/ huyện</div>,
            cell: ({ row }) => {
                return <div className='text-center'>
                    {
                        row.original && <p>{row.original.district.name}</p>
                    }
                </div>
            },
        },
        {
            accessorKey: "commune",
            header: () => <div className="text-center">Xã/ phường</div>,
            cell: ({ row }) => {
                return <div className='text-center'>
                    {row.original && <p>{row.original.commune.name}</p>}
                </div>
            },
        },
        {
            accessorKey: "detail",
            header: () => <div className="text-center">Chi tiết</div>,
            cell: ({ row }) => {
                return <div className="text-center font-medium max-h-16">
                    {row.original && <p>{row.original.detail}</p>}
                </div>
            },
        },
        {
            id: "update",
            header: () => <div className="text-center">Hành động</div>,
            cell: ({ row }) => {
                return (
                    <div className='flex gap-2'>
                        <Button type='primary' className='flex items-center' onClick={() => { setEditAddress(row.original); setIsModalOpen(true) }}>
                            <FaEdit />
                        </Button>
                        <Button type='primary' className='flex items-center' onClick={() => {
                            if (row.original.key) {
                                Remove({ key: row.original.key })
                            } else {
                                Remove({ id: row.original.id })
                            }
                        }}>
                            <FaTrash />
                        </Button>
                    </div>
                )
            },
        },
    ], [listDistricts, listWards, defaultAddress, listProvince, Remove]);



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

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSubmitForm = (values) => {
        if (!pending) {
            if (listAddress.length == 0) {
                toast.error('Hãy thêm ít nhất 1 địa chỉ');
            } else {
                const data = { ...values, birthday: birthDay, gender: gender == '1', }
                setPending(true);
                axios.post(`${baseUrl}/customer`, data).then(res => {
                    const promises = listAddress.map(add => {
                        const body = {
                            receiverName: add.receiverName,
                            receiverPhone: add.phone,
                            commune: add.commune.name,
                            district: add.district.name,
                            province: add.province.name,
                            communeID: add.commune.id,
                            districtID: add.district.id,
                            provinceID: add.province.id,
                            defaultAddress: defaultAddress == add.key,
                            detail: add.detail,
                            customer: res.data.data.id,
                            id: add.id
                        }
                        return axios.post(`${baseUrl}/address`, body)
                    })
                    Promise.all(promises).then(() => {
                        toast.success('thêm khách hàng thành công');
                        form.reset();
                        setPending(false);
                        setListAddress([]);
                    })
                }).catch(err => {
                    setPending(false);
                    toast.error(err.response.data.message)
                })
            }
        }
    }



    const [editAddress, setEditAddress] = useState({});

    const modalForm = useForm(
        {
            resolver: zodResolver(modalFormSchema),
            mode: 'all',
            values: {
                receiverName: editAddress?.receiverName || '',
                phone: editAddress?.phone || "",
                province: { id: '269', name: 'Lào Cai' },
                district: { id: '2264', name: 'Huyện Si Ma Cai' },
                commune: { id: '90816', name: 'Thị Trấn Si Ma Cai' },
                detail: editAddress?.detail || ""
            }
        }
    )

    const handleAddAddress = () => {
        let newObject = {
            key: listAddress.length + 1,
            receiverName: "",
            phone: "",
            detail: "",
            province: { id: '269', name: 'Lào Cai' },
            district: { id: '2264', name: 'Huyện Si Ma Cai' },
            commune: { id: '90816', name: 'Thị Trấn Si Ma Cai' }
        }
        setDetail("");
        modalForm.reset();
        setEditAddress(newObject);
        setListAddress(prev => [...prev, newObject])
        setIsModalOpen(true);
    }

    return (
        <div className='flex flex-col gap-5 pb-8'>
            <div className='flex flex-col gap-3 w-full max-lg:w-full bg-white p-5 shadow-lg rounded-lg'>
                <div className='flex gap-2 items-center'>
                    <div className='text-lg cursor-pointer flex items-center' onClick={() => { navigate('/user/customer') }}><IoArrowBackSharp /></div>
                    <p className='ml-3 text-lg font-semibold'>Thông tin khách hàng</p>
                </div>
                <div className='bg-slate-600 h-[2px]'></div>
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
                                            <Input className='w-full' {...field} />
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
                                                    <p className='m-0 font-semibold'>Ngày sinh</p>
                                                    <DatePicker format={"DD-MM-YYYY"} maxDate={dayjs(new Date(), "DD-MM-YYYY")} value={birthDay} onChange={birthDay => setBirthday(birthDay)} />
                                                </>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div>
                                    <p className='mb-3 font-semibold'>Giới tính</p>
                                    <Radio.Group onChange={(e) => { setGender(e.target.value) }} value={gender}>
                                        <Radio value={'0'}>Nam</Radio>
                                        <Radio value={'1'}>Nữ</Radio>
                                    </Radio.Group>
                                </div>
                            </div>
                        </div>
                        <div className='flex gap-4'>
                            <Button type="primary" onClick={() => { handleSubmitForm(form.getValues()) }}>Tạo khách hàng</Button>
                        </div>
                    </form>
                </Form>
            </div>
            <div className="rounded-md border w-full bg-white shadow-lg p-6 flex flex-col gap-3">
                <p className='text-lg font-semibold'>Danh sách địa chỉ</p>
                <div className='bg-slate-600 h-[2px]'></div>
                <div className='w-fit'>
                    <Button type="primary" onClick={() => { handleAddAddress(); }}>
                        Thêm địa chỉ mới
                    </Button>
                </div>
                <Modal title="Điền thông tin" open={isModalOpen} onOk={() => { setIsModalOpen(false) }} onCancel={() => { setIsModalOpen(false) }}>
                    <Form {...modalForm}>
                        <form onSubmit={() => { }} className="space-y-8">
                            <FormField
                                control={modalForm.control}
                                name="receiverName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Họ và tên</FormLabel>
                                        <FormControl>
                                            <Input {...field} value={editAddress.receiverName} onChange={e => { handleChangeReceiverName(editAddress.key, e.target.value, editAddress.id); }} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={modalForm.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Số điện thoại</FormLabel>
                                        <FormControl>
                                            <Input {...field} value={editAddress.phone} onChange={e => { handleChangeReceiverPhone(editAddress.key, e.target.value, editAddress.id); }} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className='grid grid-cols-2 gap-3'>
                                <p>Tỉnh thành phố</p>
                                <FormField
                                    control={modalForm.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Select className='min-w-[180px]' placeholder='Tỉnh/ Thành phố' {...field} value={editAddress.province.name} onChange={value => { setAddProvinceP(value, editAddress.key, editAddress.id); }}>
                                                    {
                                                        listProvince.map((province, key) => {
                                                            return <option key={key} value={province.ProvinceID.toString()}>{province.ProvinceName}</option>
                                                        })
                                                    }
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <p>Quận huyện</p>
                                <FormField
                                    control={modalForm.control}
                                    name="district"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel></FormLabel>
                                            <FormControl>
                                                <Select className='min-w-[180px]' placeholder='Quận/ huyện' {...field} value={editAddress.district.name} onChange={value => { setAddDistrictP(value, editAddress.key, editAddress.id); }}>
                                                    {
                                                        listDistricts.map((district, key) => {
                                                            return <option key={key} value={district.DistrictID.toString()}>{district.DistrictName}</option>
                                                        })
                                                    }
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <p>Xã phường</p>
                                <FormField
                                    control={modalForm.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Select {...field} className='min-w-[180px]' placeholder='Xã/ phường' value={editAddress.commune.name} onChange={value => { setAddCommuneP(value, editAddress.key, editAddress.id); }}>
                                                    {
                                                        listWards.map((ward, key) => {
                                                            return <option key={key} value={ward.WardCode.toString()}>{ward.WardName}</option>
                                                        })
                                                    }
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div>
                                <p>Địa chỉ chi tiết</p>
                                <TextArea placeholder="địa chỉ chi tiết" defaultValue={editAddress.detail} value={detail} onChange={e => { setDetail(e.target.value); handleChangeReceiverDetail(editAddress.key, e.target.value, editAddress.id) }} />
                            </div>

                            <div className='flex items-center gap-3'>
                                <Checkbox checked={defaultAddress == editAddress.id || defaultAddress == editAddress.key} onClick={() => { setDefaultAddress(editAddress.id || editAddress.key) }} />
                                <p>Đặt làm địa chỉ mặc định</p>
                            </div>
                        </form>
                    </Form>
                </Modal>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className='bg-purple-500 py-2'>
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
                    <tbody className="bg-white divide-y divide-gray-200">
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
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

        </div>
    )
} 