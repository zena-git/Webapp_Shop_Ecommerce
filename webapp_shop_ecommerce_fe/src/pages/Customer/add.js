import { DatePicker, InputNumber, Input, Select, Button, Checkbox, Modal, Radio, Dropdown } from 'antd/lib';
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
import { baseUrl, baseUrlV3, regex } from '../../lib/functional'
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
import Table from '../../components/ui/table';

const { TextArea } = Input;
dayjs.extend(customParseFormat);

const formSchema = z.object({
    codeCustomer: z.string().min(2, {
        message: "mã khách hàng tối thiểu 2 ký tự",
    }),
    fullName: z.string().min(2, {
        message: "tên tối thiểu 2 ký tự",
    }),
    gender: z.boolean(),
    address: z.string(),
    phone: z.string(),
    email: z.string().email({}),
    username: z.string().min(4, {
        message: "tên đăng nhập tối thiểu 4 ký tự",
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

    const [gender, setGender] = useState(false);
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

    const handleChangeReceiverName = (key, newValue) => {
        if (!key) return;
        setListAddress(prev => {
            return prev.map(address => {
                if (key && address.key == key) {
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

    const handleChangeReceiverDetail = (key, newValue) => {
        if (!key) return;
        try {
            setListAddress(prev => {
                return prev.map(address => {
                    if (key && address.key == key) {
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
            if (defaultAddress == key && q.length > 0) {
                setDefaultAddress(q[0].id || q[0].key);
            }
            setListAddress(q);
        } else if (id) {
            axios.delete(`${baseUrl}/address/${id}`)
            let x = listAddress.filter(target => id != target.id)
            if (defaultAddress == id && x.length > 0) {
                setDefaultAddress(x[0].id || x[0].key);
            }
            setListAddress(x);
        }
    }

    const columns = useMemo(() => [
        {
            accessorKey: "key",
            header: "Mặc định",
            cell: ({ row }) => (<div className='flex justify-center'>
                <Checkbox checked={defaultAddress == row.original.id || defaultAddress == row.original.key} onClick={() => { setDefaultAddress(row.original.id || row.original.key) }} />
            </div>
            ),
        },
        {
            accessorKey: "receiverName",
            header: ({ column }) => {
                return (
                    <div
                        className='flex items-center min-h-12 justify-center'
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Tên người nhận
                        <CaretSortIcon className="ml-2 h-4 w-4" />
                    </div>
                )
            },
            cell: ({ row }) => <div className="lowercase text-xl">
                {row.original && <p>{row.original.receiverName}</p>}
            </div>,
        },
        {
            accessorKey: "phone",
            header: () => <div className="text-center">Số điện thoại</div>,
            cell: ({ row }) => {
                return <div className="text-center font-medium max-h-16 text-xl">
                    {row.original && <p>{row.original.phone}</p>}
                </div>
            },
        },
        {
            accessorKey: "province",
            header: () => <div className="text-center">Tỉnh/ Thành phố</div>,
            cell: ({ row }) => {
                return <div className='text-center text-xl'>
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
                return <div className='text-center text-xl'>
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
                return <div className='text-center text-xl'>
                    {row.original && <p>{row.original.commune.name}</p>}
                </div>
            },
        },
        {
            accessorKey: "detail",
            header: () => <div className="text-center">Chi tiết</div>,
            cell: ({ row }) => {
                return <div className="text-center font-medium max-h-16 text-xl">
                    {row.original && <p>{row.original.detail}</p>}
                </div>
            },
        },
        {
            id: "update",
            header: () => <div className="text-center">Hành động</div>,
            cell: ({ row }) => {
                const items = [
                    {
                        key: '1',
                        label: (
                            <div className='flex gap-2 items-center' onClick={() => { setEditAddress(row.original); setIsModalOpen(true); setDetail(row.original.detail) }}>
                                <FaEdit />
                                Cập nhật
                            </div>
                        ),
                    },
                    {
                        key: '3',
                        label: (
                            <div className='flex gap-2 items-center' onClick={() => { Remove({ key: row.original.key }) }}>
                                <FaTrash />
                                Xóa
                            </div>
                        ),
                    },
                ];
                return (
                    <div className='flex justify-center'>
                        <Dropdown menu={{ items }} placement="bottomRight" arrow>
                            <Button type="primary">...</Button>
                        </Dropdown>
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
                gender: false,
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
            if (values.fullName.trim().length == 0) {
                toast.error('Nhập tên khách hàng');
            } else if (values.phone.trim().length == 0) {
                toast.error('Nhập số điện thoại');
            } else if (!regex.test(values.phone)) {
                toast.error('Số điện thoại chưa đúng định dạng');
            } else {
                const lstAddressData = listAddress.map(add => {
                    return {
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
                        id: add.id
                    }
                })
                const data = { ...values, birthday: birthDay.add(7, 'hour'), password: makeid(), gender: gender, lstAddress: lstAddressData }
                setPending(true);
                axios.post(`${baseUrlV3}/customer`, data).then(res => {
                    toast.success('thêm khách hàng thành công');
                    form.reset();
                    setListAddress([]);
                    setTimeout(() => {
                        setPending(false);
                        navigate('/user/customer');
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
            key: listAddress.length > 0 ? listAddress[listAddress.length - 1].key + 1 : 1,
            receiverName: "",
            phone: "",
            detail: "",
            province: { id: '269', name: 'Lào Cai' },
            district: { id: '2264', name: 'Huyện Si Ma Cai' },
            commune: { id: '90816', name: 'Thị Trấn Si Ma Cai' }
        }
        if (listAddress == 0) {
            setDefaultAddress(1);
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
                    <div className='text-2xl cursor-pointer flex items-center' onClick={() => { navigate('/user/customer') }}><IoArrowBackSharp /></div>
                    <p className='ml-3 text-2xl font-semibold'>Thông tin khách hàng</p>
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
                                            <Input className='w-full mt-2' {...field} />
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
                                            <FormLabel>Ngày sinh</FormLabel>
                                            <FormControl>
                                                <div>
                                                    <DatePicker className="" format={"DD-MM-YYYY"} maxDate={dayjs(new Date(), "DD-MM-YYYY")} value={birthDay} onChange={birthDay => setBirthday(birthDay)} />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div>
                                    <p className='mb-3 font-semibold'>Giới tính</p>
                                    <Radio.Group onChange={(e) => { setGender(e.target.value) }} value={gender}>
                                        <Radio value={false}>Nam</Radio>
                                        <Radio value={true}>Nữ</Radio>
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
                <p className='text-2xl font-semibold'>Danh sách địa chỉ</p>
                <div className='bg-slate-600 h-[2px]'></div>
                <div className='w-fit'>
                    <Button type="primary" onClick={() => { handleAddAddress(); }}>
                        Thêm địa chỉ mới
                    </Button>
                </div>
                <Modal title="Điền thông tin"
                    open={isModalOpen}
                    footer={[
                        <Button key="submit" type='primary' onClick={() => {
                            if (editAddress.receiverName.trim().length == 0) {
                                toast.error('Nhập tên người nhận');
                            } else if (!regex.test(editAddress.phone)) {
                                toast.error('Sai định dạng số điện thoại');
                            } else {
                                setIsModalOpen(false);
                                handleChangeReceiverDetail(editAddress.key, detail);
                                handleChangeReceiverName(editAddress.key, editAddress.receiverName);
                                handleChangeReceiverPhone(editAddress.key, editAddress.phone);
                            }
                        }}>
                            Ok
                        </Button>
                    ]}
                >
                    <Form {...modalForm}>
                        <form onSubmit={() => { }} className="space-y-8">
                            <FormField
                                control={modalForm.control}
                                name="receiverName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Họ và tên</FormLabel>
                                        <FormControl>
                                            <Input {...field} value={editAddress.receiverName} onChange={e => { setEditAddress({ ...editAddress, receiverName: e.target.value }) }} />
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
                                            <Input {...field} value={editAddress.phone} onChange={e => { setEditAddress({ ...editAddress, phone: e.target.value }) }} />
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
                                <TextArea placeholder="địa chỉ chi tiết" value={detail} onChange={e => { setDetail(e.target.value); }} />
                            </div>

                            <div className='flex items-center gap-3'>
                                <Checkbox checked={defaultAddress == editAddress.key} onClick={() => { setDefaultAddress(editAddress.key) }} />
                                <p>Đặt làm địa chỉ mặc định</p>
                            </div>
                        </form>
                    </Form>
                </Modal>
                {Table(table, flexRender, columns)}
            </div>

        </div>
    )
} 