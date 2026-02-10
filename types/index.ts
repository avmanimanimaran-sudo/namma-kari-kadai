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
    id: string;
    user_id?: string;
    guest_phone?: string;
    guest_name?: string;
    status: OrderStatus;
    total_amount: number;
    payment_method: 'cash' | 'upi' | 'online';
    pickup_date: string;
    pickup_time_slot: string;
    created_at: string;
}
