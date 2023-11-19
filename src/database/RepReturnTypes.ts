export type ModelTemplateReturnType<T> = {
    dt: Date, "PRODUCT_VERSION": string, queryTime: number, sqlQuery: string, result: T
}

export type EmployeesReturnType = {
    employeeId: number,
    Name: string,
    Title: string | null,
    City: string | null,
    Country: string | null,
    Phone: string | null
}[];

export type EmployeeReturnType = {
    employeeId: number,
    Name: string,
    Title: string | null,
    "Title Of Courtesy": string | null,
    "Birth Date": string | null,
    "Hire Date": string | null,
    Address: string | null,
    City: string | null,
    "Postal Code": string | null,
    "Country": string | null,
    "Home Phone": string | null,
    Extension: number | null,
    Notes: string | null,
    "Reports To": string | null,
    reportsTo: string | null
};

export type CustomersReturnType = {
    customerId: string,
    Company: string | null
    Contact: string | null
    Title: string | null
    City: string | null
    Country: string | null
}[];

export type CustomerReturnType = {
    customerId: string | null,
    "Company Name": string | null,
    "Contact Name": string | null,
    "Contact Title": string | null,
    Address: string | null,
    City: string | null,
    "Postal Code": string | null,
    Region: string | null,
    Country: string | null,
    Phone: string | null,
    Fax: string | null
};

export type CustomersSearchReturnType = {
    customerId: string,
    companyName: string | null,
    contactName: string | null,
    contactTitle: string | null,
    phone: string | null
}[];

export type SuppliersReturnType = {
    supplierId: number,
    Company: string | null,
    Contact: string | null,
    Title: string | null,
    City: string | null,
    Country: string | null
}[];

export type SupplierReturnType = {
    supplierId: number,
    "Company Name": string | null,
    "Contact Name": string | null,
    "Contact Title": string | null,
    Address: string | null,
    City: string | null,
    Region: string | null,
    "Postal Code": string | null,
    Country: string | null,
    Phone: string | null,
    "Home Page": string | null
};

export type ProductsReturnType = {
    productId: number,
    Name: string | null,
    "Qt per unit": string | null,
    Price: string | null,
    Stock: number | null,
    Order: number | null
}[];

export type ProductReturnType = {
    productId: number,
    "Supplier": string | null,
    "Product Name": string | null,
    supplierId: number | null,
    "Quantity Per Unit": string | null,
    "Unit Price": string | null,
    "Units In Stock": number | null,
    "Units In Order": number | null,
    "Reorder Level": number | null,
    Discontinued: number | null
};

export type ProductsSearchReturnType = {
    productId: number,
    productName: string | null,
    quantityPerUnit: string | null,
    unitPrice: string | null,
    unitsInStock: number| null
}[];

export type OrdersReturnType = {
    Id: number,
    "Total Price": number,
    Products: number,
    Quantity: number,
    Shipped: string,
    "Ship Name": string,
    City: string,
    Country: string
}[];

export type OrderReturnType = {
    "Total Price": number,
    "Total Products": number,
    "Total Quantity": number,
    "Total Discount": number,
    "Customer Id": string,
    "Shipped Date": string,
    "Ship Via": string,
    "Freight": string,
    "Required Date": string,
    "Order Date": string,
    "Ship Name": string,
    "Ship City": string,
    "Ship Region": string,
    "Ship Postal Code": string,
    "Ship Country": string,
    ProductsInOrder: {
        productId: number,
        Product: string,
        Quantity: number,
        "Order Price": number,
        "Total Price": number,
        Discount: number
    }[]
} | {};
