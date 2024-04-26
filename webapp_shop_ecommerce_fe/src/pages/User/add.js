import { DatePicker, InputNumber, Button, Upload, Select, Modal, Input, Radio } from 'antd/lib';
import { useEffect, useState, useCallback } from 'react';
import dayjs from 'dayjs';
import axios from 'axios';
import { baseUrl } from '~/lib/functional';
import { useNavigate } from 'react-router-dom';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "~/components/ui/form"
import { IoArrowBackSharp } from "react-icons/io5";
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { ToastContainer, toast } from 'react-toastify';
import { useDropzone } from 'react-dropzone'
import { QrReader } from "react-qr-reader";
import { regex } from '../../lib/functional';

const { TextArea } = Input

const formSchema = z.object({
    fullName: z.string().min(2, {
        message: "tên tối thiểu phải có 2 ký tự",
    }),
    gender: z.enum('0', '1'),
    commune: z.string(),
    district: z.string(),
    province: z.string(),
    phone: z.string(),
    detail: z.string(),
    birthday: z.any(),
    email: z.string({ required_error: 'email là bắt buộc' }).email({ message: 'phải là định dạng email' }),

})
const token = 'a98f6e38-f90a-11ee-8529-6a2e06bbae55'
export default function Add() {

    const navigate = useNavigate();
    const [pending, setPending] = useState(false);
    const [addProvince, setAddProvince] = useState();
    const [addDistrict, setAddDistrict] = useState();
    const [addWard, setAddWard] = useState();

    const [listProvince, setListProvince] = useState([]);
    const [listDistricts, setListDistricts] = useState([]);
    const [listWards, setListWards] = useState([]);

    const [imageLink, setImageLink] = useState();
    const [imageUploading, setImageUploading] = useState(false);
    const [gender, setGender] = useState(false);

    const [originalThumbnail, setOriginalThumbnail] = useState(null);


    useEffect(() => {
        axios.get(`https://online-gateway.ghn.vn/shiip/public-api/master-data/province`, {
            headers: {
                token: token
            }
        }).then(res => {
            setListProvince(res.data.data);
        })
    }, [])

    useEffect(() => {
        if (addProvince) {
            axios.get(`https://online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${addProvince.ProvinceID}`, {
                headers: {
                    token: token
                }
            }).then(res => {
                let listFilteredDistrict = res.data.data.filter(dis => dis.DistrictID != 3451);
                setAddDistrict(listFilteredDistrict[0])
                setListDistricts(listFilteredDistrict);
                axios.get(`https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${listFilteredDistrict[0].DistrictID}`, {
                    headers: {
                        token: token
                    }
                }).then(resp => {
                    setListWards(resp.data.data);
                    setAddWard(resp.data.data[0].WardName);
                })
            })
        }
    }, [addProvince])

    useEffect(() => {
        if (addDistrict) {
            axios.get(`https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${addDistrict.DistrictID}`, {
                headers: {
                    token: token
                }
            }).then(res => {
                setListWards(res.data.data);
                setAddWard(res.data.data[0].WardName)
            })
        }
    }, [addDistrict])

    const form = useForm(
        {
            resolver: zodResolver(formSchema),
            defaultValues: {
                fullName: "",
                gender: "0",
                detail: "",
                phone: "",
                birthday: dayjs(new Date()),
                email: "",
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
        } else if (!regex.test(values.phone)) {
            toast.error('sai định dạng số điện thoại')
        } else {
            if (!pending) {
                if (originalThumbnail) {
                    setPending(true);
                    const body = {
                        birthday: values.birthday ? new Date(dayjs(values.birthday).toDate()).toISOString() : null,
                        commune: addWard,
                        detail: values.detail,
                        district: addDistrict.DistrictName,
                        province: addProvince.ProvinceName,
                        email: values.email,
                        status: 0,
                        fullName: values.fullName,
                        gender: gender,
                        phone: values.phone,
                        imageUrl: imageLink
                    }

                    axios.post(`${baseUrl}/user`, body).then(() => {
                        toast.success("Thêm mới thành công");
                        setPending(false);
                        form.reset();
                        setOriginalThumbnail(null);
                        setTimeout(() => {
                            navigate('/user/staff')
                        }, 2000)
                    }).catch(err => {
                        setPending(false);
                        toast.error(err.response.data.message)
                    })
                } else {
                    const body = {
                        birthday: values.birthday ? new Date(dayjs(values.birthday).toDate()).toISOString() : null,
                        commune: addWard,
                        detail: values.detail,
                        district: addDistrict.DistrictName,
                        province: addProvince.ProvinceName,
                        email: values.email,
                        status: 0,
                        fullName: values.fullName,
                        gender: gender,
                        phone: values.phone,
                    }
                    setPending(true);
                    axios.post(`${baseUrl}/user`, body).then(() => {
                        toast.success("Thêm mới thành công")
                        form.reset();
                        setPending(false);
                        setAddDistrict(null);
                        setAddWard(null);
                        setOriginalThumbnail(null);
                        setTimeout(() => {
                            navigate('/user/staff')
                        }, 2000)
                    }).catch(err => {
                        setPending(false);
                        toast.error(err.response.data.message)
                    })
                }
            }
        }
    }

    const [webScan, setWebScan] = useState();


    const camError = (error) => {
        if (error) {
            console.info(error);
        }
    };

    function ScanResult(result) {
        if (result) {
            if (result.text) {
                setWebScan(result);
                const resultText = result.text;
                const id = resultText.split("||")[0]
                const name = resultText.split("||")[1].split("|")[0]
                const birthday = dayjs(resultText.split("||")[1].split("|")[1], 'DDMMYYYY')
                const gender = resultText.split("||")[1].split("|")[2] == "Nam" ? false : true;
                const province = resultText.split("||")[1].split("|")[3].split(", ")[3]
                const district = resultText.split("||")[1].split("|")[3].split(", ")[2]
                const commune = resultText.split("||")[1].split("|")[3].split(", ")[1]
                const detail = resultText.split("||")[1].split("|")[3].split(", ")[0]
                form.setValue("birthday", birthday)
                form.setValue("detail", detail)
                form.setValue("fullName", name)
                form.setValue("gender", gender)
                setAddDistrict(district);
                setAddProvince(province);
                setAddWard(commune);
            }
        }
    }

    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="mb-9">
            <ToastContainer />
            <div className="">
                <Form {...form}>
                    <form onSubmit={e => { e.preventDefault() }} className="w-full flex gap-5 max-lg:flex-col">
                        <div className="w-1/3 max-lg:w-full flex flex-col gap-6 bg-white shadow-lg rounded-md p-5">
                            <div className='flex gap-2 items-center'>
                                <div className='text-2xl cursor-pointer flex items-center' onClick={() => { navigate('/user/staff') }}><IoArrowBackSharp /></div>
                                <p className='text-2xl font-bold'>Thông tin nhân viên</p>
                            </div>
                            <div className='bg-slate-700 h-[2px] mt-1'></div>
                            <div className='w-full flex flex-col gap-5'>
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
                                                    <p>chọn ảnh</p>
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
                                                <Input placeholder="Họ và tên" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <div className="flex-grow flex flex-col gap-2 bg-white shadow-lg rounded-md p-5">
                            <div className='flex justify-between items-center'>
                                <p className='text-2xl font-bold'>Thông tin chi tiết</p>
                                <Button type="primary" onClick={() => setIsModalOpen(true)}>
                                    Quét mã QR
                                </Button>
                                <Modal title="Quét mã QR" open={isModalOpen} onOk={() => { setIsModalOpen(false) }} onCancel={() => { }}>
                                    <QrReader
                                        delay={600}
                                        facingMode="user"
                                        onError={camError}
                                        chooseDeviceId={"2"}
                                        onResult={ScanResult}
                                        style={{ width: "100%" }}
                                        legacyMode={false}
                                    />
                                    <p>{webScan && webScan.text}</p>
                                </Modal>
                            </div>
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
                                    <FormField
                                        control={form.control}
                                        name="gender"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Giới tính</FormLabel>
                                                <FormControl>
                                                    <div>
                                                        <Radio.Group name="radiogroup" value={gender} onChange={(e) => { setGender(e.target.value) }}>
                                                            <Radio value={false}>Nam</Radio>
                                                            <Radio value={true}>Nữ</Radio>
                                                        </Radio.Group>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
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
                                                <FormLabel className="">Ngày sinh</FormLabel>
                                                <FormControl>
                                                    <div className='mt-2'>
                                                        <DatePicker {...field} className='' placeholder='ngày sinh' needConfirm />
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
                                                        <Select className='min-w-[180px] w-full' placeholder='Tỉnh/Thành phố' value={addProvince?.ProvinceID} onChange={value => { setAddProvince(listProvince.find(target => target.ProvinceID == value)) }}>
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
                                                        <Select className='min-w-[180px] w-full pl-4' placeholder='Quận/huyện' value={addDistrict?.DistrictID} onChange={value => { setAddDistrict(listDistricts.find(target => target.DistrictID == value)) }}>
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
                                                        <Select className='min-w-[180px] w-full pl-4' placeholder='Xã/thị trấn' value={addWard} onChange={value => { setAddWard(value) }}>
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
                                    <Button type="primary" onClick={() => { handleSubmitForm(form.getValues()) }}>Tạo nhân viên</Button>
                                </div>
                            </div>
                        </div>
                    </form>
                </Form>
            </div>
        </div >
    )
}