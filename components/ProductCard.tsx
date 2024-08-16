import React from "react";
import { Product } from "@/types";
import Link from "next/link";
import Image from "next/image";

type Props = {
  product: Product;
};

const ProductCard = ({ product }: Props) => {
  return (
    <Link
      href={`/products/${product._id}`}
      className="product-card p-2 hover:shadow-lg hover:scale-105 transition-shadow duration-300 ease-in-out"
    >
      <div className="product-card_img-container">
        <Image src={product.images?.[0]} alt={product.title} width={200} height={200} className="product-card_img" />
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="product-title">{product.title}</h3>

        <div className="flex justify-between">
          <p className="text-black opacity-50 text-lg capitalize">{product.category}</p>

          <p className="text-black text-lg font-semibold">
            <span>{product?.currency}</span>
            <span>{product?.currentPrice}</span>
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
