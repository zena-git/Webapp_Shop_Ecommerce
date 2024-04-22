import { DatePicker, InputNumber, Button, Select, Radio, Input, Switch } from 'antd/lib';
import { useEffect, useState, useCallback } from 'react';
import dayjs from 'dayjs';
import axios from 'axios';
import { baseUrl, baseUrlV3 } from '~/lib/functional';
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
import { ToastContainer, toast } from 'react-toastify';
import { useDropzone } from 'react-dropzone'
import { useParams, useNavigate } from 'react-router-dom'
import { IoArrowBackSharp } from "react-icons/io5";


const { TextArea } = Input
const formSchema = z.object({
    fullName: z.string().min(2, {
        message: "tên tối thiểu phải có 2 ký tự",
    }),
    gender: z.enum(['0', '1']),
    status: z.enum(['0', '1', '2']),
    commune: z.string(),
    district: z.string(),
    province: z.string(),
    detail: z.string(),
    birthday: z.any(),
    phone: z.string(),
    email: z.string({ required_error: 'email là bắt buộc' }).email({ message: 'phải là định dạng email' }),

})
const token = 'a98f6e38-f90a-11ee-8529-6a2e06bbae55'
export default function Add() {
    const path = useParams();
    const [pending, setPending] = useState(false);
    const [addProvince, setAddProvince] = useState();
    const [addDistrict, setAddDistrict] = useState();
    const [addWard, setAddWard] = useState();

    const [listProvince, setListProvince] = useState([]);
    const [listDistricts, setListDistricts] = useState([]);
    const [listWards, setListWards] = useState([]);
    const [gender, setGender] = useState('0');
    const [status, setStatus] = useState('0');

    const [originalThumbnail, setOriginalThumbnail] = useState(null);

    const [targetUser, setTargetUser] = useState();

    const [enableChecking, setEnableChecking] = useState(false);
    const [imageLink, setImageLink] = useState();
    const [imageUploading, setImageUploading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (path.id) {
            axios.get(`${baseUrl}/user/${path.id}`).then(res => {
                setTargetUser(res.data);
                console.log(res.data.status);
                setStatus(res.data.status);
                setGender(res.data.gender ? '0' : '1');
                setImageLink(res.data.imageUrl);
                axios.get(`https://online-gateway.ghn.vn/shiip/public-api/master-data/province`, {
                    headers: {
                        token: token
                    }
                }).then(resp => {
                    setListProvince(resp.data.data);
                    const foundProvince = resp.data.data.find(targetProvince => {
                        return targetProvince.NameExtension.includes(res.data.province)
                    })
                    setAddProvince(foundProvince);
                    axios.get(`https://online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${foundProvince.ProvinceID}`, {
                        headers: {
                            token: token
                        }
                    }).then(respo => {
                        setListDistricts(respo.data.data);
                        let listFilteredDistrict = respo.data.data.filter(dis => dis.DistrictID != 3451)
                        const foundDistrict = listFilteredDistrict.find(targetDistrict => {
                            return targetDistrict.NameExtension.includes(res.data.district)
                        })
                        setAddDistrict(foundDistrict);
                        axios.get(`https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${foundDistrict.DistrictID}`, {
                            headers: {
                                token: token
                            }
                        }).then(respon => {
                            setListWards(respon.data.data);
                            const foundWard = respon.data.data.find(targetWard => targetWard.NameExtension.includes(res.data.commune));
                            if (foundWard) {
                                setAddWard(foundWard.WardName);
                            }
                            setEnableChecking(true);
                        })
                    })
                })
            })
        }
    }, [path.id])

    useEffect(() => {
        if (addProvince && enableChecking) {
            axios.get(`https://online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${addProvince.ProvinceID}`, {
                headers: {
                    token: token
                }
            }).then(res => {
                let listFilteredDistrict = res.data.data.filter(dis => dis.DistrictID != 3451)
                if (!listFilteredDistrict[0].NameExtension.includes(listDistricts[0].DistrictName)) {
                    setListDistricts(listFilteredDistrict);
                    axios.get(`https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${listFilteredDistrict[0].DistrictID}`, {
                        headers: {
                            token: token
                        }
                    }).then(resp => {
                        setListWards(resp.data.data);
                        setAddWard(resp.data.data[0].WardName);
                    })
                }
            })
        }
    }, [addProvince, enableChecking])

    useEffect(() => {
        if (addDistrict && enableChecking) {
            axios.get(`https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${addDistrict.DistrictID}`, {
                headers: {
                    token: token
                }
            }).then(res => {
                if (!res.data.data[0].NameExtension.includes(listWards[0].WardName)) {
                    setListWards(res.data.data);
                    setAddWard(res.data.data[0].WardName)
                }
            })
        }
    }, [addDistrict, enableChecking])

    const form = useForm(
        {
            resolver: zodResolver(formSchema),
            defaultValues: {
                fullName: "",
                gender: "0",
                detail: "",
                birthday: dayjs(new Date()),
                status: "0",
                email: "",
                phone: ""
            },
            values: {
                phone: targetUser ? targetUser.phone : "",
                birthday: targetUser && targetUser.birthday ? dayjs(targetUser.birthday) : dayjs(new Date()),
                detail: targetUser ? targetUser.detail : "",
                email: targetUser ? targetUser.email : "",
                fullName: targetUser ? targetUser.fullName : "",
                status: targetUser ? targetUser.status : "0",
                gender: targetUser ? targetUser.gender ? '0' : '1' : "0"
            },
            mode: 'all'
        }
    )

    const onThumbnailDrop = useCallback((acceptedFiles) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const image = new Image();
            image.src = event.target.result;
            image.onload = () => {
                if (!imageUploading) {
                    const formData = new FormData();
                    formData.append("file", acceptedFiles[0]);
                    formData.append("cloud_name", "db9i1b2yf");
                    formData.append("upload_preset", "product");
                    setImageUploading(true);
                    axios.post(`https://api.cloudinary.com/v1_1/db9i1b2yf/image/upload`, formData).then(res => {
                        setImageLink(res.data.url);
                        toast.success('Ảnh đã tải lên');
                    }).catch(err => {
                        console.log(err)
                    });
                    setImageUploading(false);
                    setOriginalThumbnail({
                        file: acceptedFiles[0],
                        width: image.width,
                        height: image.height,
                    });
                }
            };
        };
        reader.readAsDataURL(acceptedFiles[0]);
    }, []);

    const {
        getRootProps: getThumbnailRootProps,
        getInputProps: getThumbnailInputProps,
        isDragActive: isThumbnailDragActive,
    } = useDropzone({
        onDrop: onThumbnailDrop,
        accept: {
            "image/*": [],
        },
        maxFiles: 1,
        multiple: false,
    });


    const handleSubmitForm = (values) => {
        if (!addProvince) {
            toast.error('chưa chọn Tỉnh/thành phố')
        } else if (!addDistrict) {
            toast.error('chưa chọn Quận/huyện')
        } else if (!addWard) {
            toast.error('chưa chọn Xã/phường')
        } else if (values.fullName.trim().length == 0) {
            toast.error('chưa điền tên')
        } else {
            if (!pending) {
                const body = {
                    id: targetUser.id,
                    birthday: values.birthday ? new Date(dayjs(values.birthday).toDate()) : null,
                    commune: addWard,
                    detail: values.detail,
                    district: addDistrict.DistrictName,
                    province: addProvince.ProvinceName,
                    imageUrl: imageLink,
                    email: values.email,
                    status: status,
                    fullName: values.fullName,
                    gender: gender == '0',
                    phone: values.phone
                }
                setPending(true);
                axios.put(`${baseUrl}/user/${path.id}`, body).then(res => {
                    toast.success('Cập nhật thành công');
                    setPending(false);
                }).catch(err => {
                    setPending(false);
                    toast.error(err.response.data.message);
                })
            }
        }
    }

    return (
        <div className="mb-9">
            <ToastContainer />
            <div className="flex">
                <Form {...form}>
                    <form onSubmit={e => { e.preventDefault() }} className="w-full flex max-lg:flex-col gap-5">
                        <div className="w-1/3 max-lg:w-full flex flex-col gap-3 bg-white shadow-lg rounded-md p-5">
                            <div className='flex gap-2 items-center'>
                                <div className='text-2xl cursor-pointer flex items-center' onClick={() => { navigate('/user/staff') }}><IoArrowBackSharp /></div>
                                <p className='text-2xl font-bold'>Thông tin nhân viên</p>
                            </div>
                            <div className='bg-slate-600 h-[2px]'></div>
                            <div className='w-full flex flex-col'>
                                <div
                                    {...getThumbnailRootProps()}
                                    className="w-1/2 aspect-square self-center rounded-full border border-dashed border-slate-600 mx-5 flex items-center text-center justify-center"
                                >
                                    <input
                                        {...getThumbnailInputProps()}
                                        disabled={imageUploading}
                                        className="w-full h-full"
                                    />
                                    {isThumbnailDragActive ? (
                                        <p className="text-red-500">Thả ảnh tại đây.</p>
                                    ) : (
                                        <div className="flex gap-1">
                                            {originalThumbnail ? (
                                                <img src={URL.createObjectURL(originalThumbnail.file)} alt='' className='w-full aspect-square rounded-full'></img>
                                            ) : (
                                                <>
                                                    <img src={targetUser ? targetUser.imageUrl : ""} alt='' className='w-full aspect-square rounded-full'></img>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>

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

                                <div className='my-3'>
                                    <p className='font-semibold mb-2'>Tình trạng làm việc</p>
                                    {targetUser
                                        &&
                                        <Switch checkedChildren="Đang làm việc" unCheckedChildren="Đã nghỉ việc" checked={status == 0} onChange={e => {setStatus(e ? 0 : 1)}} />
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="flex-grow flex flex-col gap-3 bg-white shadow-lg rounded-md p-5">
                            <p className='text-2xl font-bold'>Thông tin chi tiết</p>
                            <div className='bg-slate-600 h-[2px]'></div>
                            <div className='flex flex-col gap-3'>
                                <div className='grid grid-cols-2 gap-3 items-center'>
                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Số điện thoại</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="số điện thoại" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    {targetUser
                                        &&
                                        <FormField
                                            control={form.control}
                                            name="gender"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Giới tính</FormLabel>
                                                    <FormControl>
                                                        <div>
                                                            <Radio.Group name="radiogroup" defaultValue={"0"} onValueChange={(e) => { setGender(e.target.value) }}>
                                                                <Radio value={"0"}>Nam</Radio>
                                                                <Radio value={"1"}>Nữ</Radio>
                                                            </Radio.Group>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    }
                                </div>
                                <div className='grid grid-cols-2 gap-3 items-center'>
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="email" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="birthday"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Ngày sinh</FormLabel>
                                                <FormControl>
                                                    <div>
                                                        <DatePicker {...field} placeholder='ngày sinh' />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                </div>
                                <div className='grid grid-cols-3'>
                                    <FormField
                                        control={form.control}
                                        name="province"
                                        render={({ field }) =>
                                        (
                                            <FormItem>
                                                <FormLabel>Tỉnh/thành phố</FormLabel>
                                                <FormControl>
                                                    <div>
                                                        <Select className='min-w-[180px] w-full' placeholder='Tỉnh/Thành phố' defaultValue={targetUser?.province} value={addProvince?.ProvinceID} onChange={value => { setAddProvince(listProvince.find(target => target.ProvinceID == value)) }}>
                                                            {
                                                                listProvince.map((province, key) => {
                                                                    return <option key={key} value={province.ProvinceID}>
                                                                        {province.ProvinceName}
                                                                    </option>
                                                                })
                                                            }
                                                        </Select>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="district"
                                        render={({ field }) =>
                                        (
                                            <FormItem>
                                                <FormLabel className="pl-4">Quận/huyện</FormLabel>
                                                <FormControl>
                                                    <div className='w-full'>
                                                        <Select className='min-w-[180px] w-full pl-4' placeholder='Quận/huyện' defaultValue={targetUser?.district} value={addDistrict?.DistrictID} onChange={value => { setAddDistrict(listDistricts.find(target => target.DistrictID == value)) }}>
                                                            {
                                                                listDistricts.map((district, key) => {
                                                                    return <option key={key} value={district.DistrictID}>{district.DistrictName}</option>
                                                                })
                                                            }
                                                        </Select>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="commune"
                                        render={({ field }) =>
                                        (
                                            <FormItem>
                                                <FormLabel className="pl-4">Xã/thị trấn</FormLabel>
                                                <FormControl>
                                                    <div>
                                                        <Select className='min-w-[180px] w-full pl-4' defaultValue={targetUser?.commune} value={addWard} placeholder='Xã/thị trấn' onChange={value => { setAddWard(value) }}>
                                                            {
                                                                listWards.map((ward, key) => {
                                                                    return <option key={key} value={ward.WardName}>{ward.WardName}</option>
                                                                })
                                                            }
                                                        </Select>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="detail"
                                    render={({ field }) =>
                                    (
                                        <FormItem>
                                            <FormLabel>Địa chỉ chi tiết</FormLabel>
                                            <FormControl>
                                                <TextArea placeholder="địa chỉ chi tiết" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className='flex gap-4'>
                                    <Button type="primary" onClick={() => { handleSubmitForm(form.getValues()) }}>Cập nhật nhân viên</Button>
                                </div>
                            </div>
                        </div>
                    </form>
                </Form>
            </div>
        </div >
    )
}