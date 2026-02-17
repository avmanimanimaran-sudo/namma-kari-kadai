import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
    inStock: boolean;
    stockCount: number;
}

const productSchema = new Schema<IProduct>(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true, default: 0 },
        category: { type: String, required: true },
        image: { type: String, required: true },
        inStock: { type: Boolean, required: true, default: true },
        stockCount: { type: Number, required: true, default: 0 },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model<IProduct>('Product', productSchema);

export default Product;
