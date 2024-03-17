export interface BillResponse {
    id: number,
    codeBill: string,
    status: string,
    bookingDate: Date,
    paymentDate: Date,
    DeliveryDate: Date,
    completionDate: Date,
    receiverName: string,
    receiverPhone: string,
    receiverAddress: string,
    CustomerResponse: CustomerResponse,
}

export type CustomerResponse = {
    id: number,
    codeCustomer: string,
    fullName: string,
    birthday: Date,
    gender: boolean,
    address: string,
    phone: string,
    email: string,
    username: string,
    password: string,
}


export interface BillRequest {
    id: number,
    codeBill: string,
    status: string,
    bookingDate: Date,
    paymentDate: Date,
    DeliveryDate: Date,
    completionDate: Date,
    receiverName: string,
    receiverPhone: string,
    receiverAddress: string,
    customer: number;
}

export type ProductResponse = {
    id: number,
    imageUrl: string,
    name: string,
    category: CategoryResponse,
    description: string,
    brand: BrandResponse,
    createdBy: string,
    createdDate: Date,
    material: MaterialResponse,
    style: StyleResponse,
    lstProductDetails: ProductDetailResponse[]
}

export type ColorResponse = {
    id: number,
    name: string
}

export type SizeResponse = {
    id: number,
    name: string
}

export type CategoryResponse = {
    id: number,
    name: string
}

export type StyleResponse = {
    id: number,
    name: string
}

export type MaterialResponse = {
    id: number,
    name: string
}

export type BrandResponse = {
    id: number,
    name: string
}

export type CartDetailResponse = {
    id: number,
    cart: number,
    quantity: number,
    productDetails: ProductDetailResponse,
}

export type ProductDetailResponse = {
    id: number,
    code: string,
    imageUrl: string,
    price: number,
    quantity: number,
    barcode: string,
    status: number,
    product: number,
    color: ColorResponse,
    size: SizeResponse
}

export type VoucherResponse = {
    id: number,
    code: string,
    name: string,
    value: number,
    target_type: number,
    discount_type: number,
    description: string,
    order_min_value: number,
    max_discount_value: number,
    usage_limit: number,
    startDate: Date,
    endDate: Date,
    last_modified_date: Date,
    last_modified_by: string,
    status: string,
    lstVoucherDetails: VoucherDetailResponse[]
}

export type VoucherDetailResponse = {
    id: number,
    customer: CustomerResponse,
    voucher: VoucherResponse,
    bill: BillResponse,
    status: number,
    usedDate: Date
}


export interface StaffResponse {
    id: number,
    code: string,
    full_name: string,
    birthday: Date,
    gender: number,
    address: string,
    email: string,
    phone: string,
    imageUrl: string
}

export type PromotionResponse = {
    id: number,
    code: number | string,
    name: string,
    value: number,
    description: string,
    startDate: Date,
    endDate: Date,
    status: number,
    lstPromotionDetails: PromotionDetailResponse[]
}

export type PromotionDetailResponse = {
    id: number,
    promotion: {
        id: number,
        promotion: number,
        productDetail: number,
    },
    productDetails: ProductDetailResponse
}



type Child = {
    id: number;
    selected: boolean;
};

export type Selected = {
    id: number;
    selected: boolean;
    children: Child[];
};

export type SelectedCustomer = {
    id: number;
    selected: boolean;
};


export type SelectedProductDetail = {
    detail_id: number,
    buy_quantity: number,
    name: string,
    image: string,
    type: string,
    price: number,
    quantity: number
}