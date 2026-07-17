export interface CustomerData {
  fullName: string;
  email: string;
  cpf: string;
  phone: string;
}

export interface ShippingAddress {
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface CheckoutData {
  customer: CustomerData;
  shipping: ShippingAddress;
}

export interface OrderSummary {
  productName: string;
  capacity: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  installments: string;
  paymentMethod: string;
  estimatedDelivery: string;
}
