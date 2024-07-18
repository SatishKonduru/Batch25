export interface userModel{
    name: string,
    email: string,
    password: string,
    phone : string,
    apartment ?: string,
    street ? : string,
    city?: string,
    state?: string,
    zip ?: string,
    role ?: string,
    country? : string,
    image ?: string ,
    orders? : [string],
    wishlist? : [string]
}

export interface productModel {
    name: string,
    description ?: string,
    richDescription ?: string,
    image ?: string,
    images ? : [string],
    price ?: number,
    category ?: string,
    countInStock : number,
    rating ? : number,
    isFeatured?: boolean,
    style ?: string,
    color ? : string,
    season ? : string,
    brand ? : string,
    dateCreated ? : Date
}

export interface categoryModel {
    id: string,
    name: string,
    icon ?: string
}