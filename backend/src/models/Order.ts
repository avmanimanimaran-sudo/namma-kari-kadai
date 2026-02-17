import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
    user: mongoose.Schema.Types.ObjectId;
    orderItems: {
        name: string;
        qty: number;
        image: string;
        price: number;
        cutType: string;
        unit: string;
        product: mongoose.Schema.Types.ObjectId;
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
    paidAt?: Date;
    isDelivered: boolean;
    deliveredAt?: Date;
    status: 'Placed' | 'Confirmed' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
}

const orderSchema = new Schema<IOrder>(
    {
        user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
        orderItems: [
            {
                name: { type: String, required: true },
                qty: { type: Number, required: true },
                image: { type: String, required: true },
                price: { type: Number, required: true },
                cutType: { type: String },
                unit: { type: String },
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: 'Product',
                },
            },
        ],
        shippingAddress: {
            address: { type: String },
            city: { type: String },
            postalCode: { type: String },
            country: { type: String },
        },
        pickupDetails: {
            name: { type: String },
            phone: { type: String },
            date: { type: String },
            time: { type: String },
        },
        paymentMethod: { type: String, required: true },
        paymentResult: {
            id: { type: String },
            status: { type: String },
            update_time: { type: String },
            email_address: { type: String },
        },
        itemsPrice: { type: Number, required: true, default: 0.0 },
        taxPrice: { type: Number, required: true, default: 0.0 },
        shippingPrice: { type: Number, required: true, default: 0.0 },
        totalPrice: { type: Number, required: true, default: 0.0 },
        isPaid: { type: Boolean, required: true, default: false },
        paidAt: { type: Date },
        isDelivered: { type: Boolean, required: true, default: false },
        deliveredAt: { type: Date },
        status: {
            type: String,
            required: true,
            default: 'Placed',
            enum: ['Placed', 'Confirmed', 'Out for Delivery', 'Delivered', 'Cancelled'],
        },
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model<IOrder>('Order', orderSchema);

export default Order;
