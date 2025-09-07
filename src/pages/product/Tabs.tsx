import React, { useState } from "react";
import dynamic from "next/dynamic";
const Description = dynamic(() => import("@/components/product/details/description"));
const Reviews = dynamic(() => import("@/components/product/details/reviews"));

export const Tabs = ({ product }: { product: any }) => {
  const [activeTab, setActiveTab] = useState<"description" | "reviews">("description");
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
      <div className="product-details__info-content">
        {activeTab === "description" && (
          <Description description={product.description} show={true} />
        )}
        {activeTab === "reviews" && (
          <Reviews product={product} show={true} />
        )}
      </div>
    </>
  );
};