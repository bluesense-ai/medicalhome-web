export interface Payment {
    id: string,
    amount: string,
    package_details: string,
    payment_method: string,
    payment_type: string,
    payment_status: string,
    payment_date: string,
    buyer_email: string,
    buyer_id: string,
    buyer_name: string,
    buyer_address: string,
    payment_details: string,
    invoice_number: string
}
 
  
  export type SortKey = keyof Omit<Payment, 'id' | 'picture'>;
  export type SortDirection = 'asc' | 'desc';