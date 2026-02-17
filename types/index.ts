export type UserRole = 'customer' | 'admin';

export interface User {
    id: string;
    phone: string;
    full_name?: string;
    role: UserRole;
    loyalty_points: number;
    created_at: string;
}

export type ItemType = 'broiler' | 'country';

export interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: 'broiler' | 'country' | string;
    image: string;
    inStock: boolean;
    stockCount: number;
}

export interface Rate {
    id: string;
    item_type: ItemType;
    price_per_kg: number;
    is_active: boolean;
    updated_at: string;
}

export interface Stock {
    id: string;
    item_type: ItemType;
    quantity_kg: number;
    daily_limit_kg: number;
    updated_at: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'ready' | 'completed' | 'cancelled';

export interface Order {
    _id: string;
    user: any; // Populated user object or ID
    orderItems: {
        name: string;
        qty: number;
        image: string;
        price: number;
        cutType: string;
        unit: string;
        product: string;
    }[];
    shippingAddress?: {
        address: string;
        city: string;
        postalCode: string;
        country: string;
    };
    pickupDetails?: {
        name: string;
        phone: string;
        date: string;
        time: string;
    };
    paymentMethod: string;
    paymentResult?: {
        id: string;
        status: string;
        update_time: string;
        email_address: string;
    };
    itemsPrice: number;
    taxPrice: number;
    shippingPrice: number;
    totalPrice: number;
    isPaid: boolean;
    paidAt?: string;
    isDelivered: boolean;
    deliveredAt?: string;
    status: 'Placed' | 'Confirmed' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
    createdAt: string;
    updatedAt: string;
}
