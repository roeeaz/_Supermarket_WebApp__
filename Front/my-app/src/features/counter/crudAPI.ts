import axios from 'axios'
import { Product } from '../../Models/Product';

export function getAll() {
    console.log("test API");
    return new Promise<{ data: any }>((resolve) =>
        axios.get("https://roee-supermarket-rol8.onrender.com/product/").then(res => resolve({ data: res.data }))
    );
}

export function add(product:Product) {
    console.log("add API");
    return new Promise<{ data: any }>((resolve) =>
        axios.post("https://roee-supermarket-rol8.onrender.com/product/",product).then(res => resolve({ data: res.data }))
    );
}

export function deleteProd(productId:number) {
    console.log("del API",productId);
    return new Promise<{ data: any }>((resolve) =>
        axios.delete(`https://roee-supermarket-rol8.onrender.com/product/${productId}`).then(res => resolve({ data: res.data }))
    );
}
