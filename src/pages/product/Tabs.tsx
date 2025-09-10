import React, { useState } from "react";
import dynamic from "next/dynamic";
const Description = dynamic(() => import("@/components/product/details/description"));
const Reviews = dynamic(() => import("@/components/product/details/reviews"));

interface Product {
  id: string;
  description: string;
  reviews: Array<{
    id: string;
    rating: number;
    review: string;
    user: {
      name: string;
      image?: string;
    };
    createdAt: string;
    photos?: string[];
    helpful?: number;
    verified?: boolean;
  }>;
}

interface TabsProps {
  product: Product;
}

const Tabs = ({ product }: TabsProps) => {
  const [activeTab, setActiveTab] = useState<"description" | "reviews">("description");
  if (!product) return null;
  return (
    <>
      <div className="product-details__info-btns">
        <button
          type="button"
          className={`btn btn--rounded ${activeTab === "description" ? "btn--active" : ""}`}
          onClick={() => setActiveTab("description")}
          aria-pressed={activeTab === "description"}
        >
          Product Details
        </button>
        <button
          type="button"
          className={`btn btn--rounded ${activeTab === "reviews" ? "btn--active" : ""}`}
          onClick={() => setActiveTab("reviews")}
          aria-pressed={activeTab === "reviews"}
        >
          Customer Reviews
        </button>
      </div>
        {activeTab === "description" && product.description && (
          <Description description={product.description} show={true} />
        )}
        {activeTab === "reviews" && Array.isArray(product.reviews) && (
          <Reviews reviews={product.reviews} show={true} />
        )}
    </>
  );
};

export default Tabs;