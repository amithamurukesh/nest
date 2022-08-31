import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './product.model';
const fs=require('fs');

@Injectable()

export class ProductsService {
  
  private products: Product[] = this.loadNewData();
insertProduct(title: string, desc: string): string {
  this.products=this.loadNewData(); 
  const prodId = Math.random().toString();
    const newProduct = new Product(prodId, title, desc);
    this.products.push(newProduct);
    fs.writeFileSync('src/products/data.json',JSON.stringify(this.products));
    return prodId;
  }

  getProducts() {
    this.products=this.loadNewData();
    return [...this.products];
  }
  getSingleProduct(productId: string) {
    this.products=this.loadNewData();
    const product = this.findProduct(productId)[0];
    return { ...product };
  }

  updateProduct(productId: string, title: string, desc: string) {
    this.products=this.loadNewData();
    const [product, index] = this.findProduct(productId);
    const updatedProduct = { ...product };
    if (title) {
      updatedProduct.title = title;
    }
    if (desc) {
      updatedProduct.description = desc;
    }
    fs.writeFileSync('src/products/data.json',JSON.stringify(this.products));
  }

  private findProduct(id: string): [Product, number] {
    const productIndex = this.products.findIndex((prod) => prod.id === id);
    const product = this.products[productIndex];
    if (!product) {
      throw new NotFoundException('Could not find product.');
    }
    return [product, productIndex];
  }
  private loadNewData(){
    const getdata = fs.readFileSync("src/products/data.json");
    // console.log(getdata);
    const dataBuffer = getdata.toString();
    // console.log(dataBuffer);
    try {
        return JSON.parse(dataBuffer || '')
    } catch (error) {
        return [];
    }
}
}
