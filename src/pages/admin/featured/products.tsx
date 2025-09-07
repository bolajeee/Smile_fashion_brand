import { useState, useEffect } from 'react';
import Layout from '@/layouts/Main';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { withAdminProtection } from '@/components/auth/withAdminProtection';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  stock: number;
  featured: boolean;
  featuredOrder: number | null;
}

const FeaturedProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
        setFeaturedProducts(
          data.filter((p: Product) => p.featured)
            .sort((a: Product, b: Product) => {
              // Null featuredOrder values should go to the end
              if (a.featuredOrder === null && b.featuredOrder === null) return 0;
              if (a.featuredOrder === null) return 1;
              if (b.featuredOrder === null) return -1;
              return a.featuredOrder - b.featuredOrder;
            })
        );
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFeatured = async (productId: string, featured: boolean) => {
    try {
      setIsUpdating(true);
      const response = await fetch(`/api/products/featured/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          featured,
          featuredOrder: featured ? featuredProducts.length : null 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error updating featured status');
      }

      await fetchProducts();
    } catch (error) {
      console.error('Error updating featured status:', error);
      alert(error instanceof Error ? error.message : 'Error updating featured status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(featuredProducts);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update optimistically
    setFeaturedProducts(items);
    const previousProducts = [...featuredProducts];

    try {
      setIsUpdating(true);
      const response = await fetch('/api/products/featured/reorder', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderedIds: items.map((item, index) => ({
            id: item.id,
            order: index,
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error saving the new order');
      }
    } catch (error) {
      console.error('Error saving featured products order:', error);
      // Revert to the previous order on error
      setFeaturedProducts(previousProducts);
      alert(error instanceof Error ? error.message : 'Error saving the new order');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container">
          <div>Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="admin-featured-products">
        <div className="container">
          <div className="admin-header">
            <h1>Featured Products Management</h1>
          </div>

          <div className="featured-products-section">
            <h2>Featured Products</h2>
            <p>Drag and drop to reorder featured products</p>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="featured-products">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="featured-products-list"
                  >
                    {featuredProducts.map((product, index) => (
                      <Draggable
                        key={product.id}
                        draggableId={product.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="featured-product-item"
                          >
                            <div className="product-info">
                              {product.images[0] && (
                                <img
                                  src={product.images[0]}
                                  alt={product.name}
                                  width={50}
                                  height={50}
                                />
                              )}
                              <span>{product.name}</span>
                            </div>
                            <button
                              onClick={() => toggleFeatured(product.id, false)}
                              className="btn btn--danger"
                              disabled={isUpdating}
                            >
                              {isUpdating ? 'Updating...' : 'Remove from Featured'}
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>

          <div className="all-products-section">
            <h2>Available Products</h2>
            <div className="products-grid">
              {products
                .filter((product) => !product.featured)
                .map((product) => (
                  <div key={product.id} className="product-card">
                    {product.images[0] && (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="product-image"
                      />
                    )}
                    <div className="product-details">
                      <h3>{product.name}</h3>
                      <p>${product.price}</p>
                      <button
                        onClick={() => toggleFeatured(product.id, true)}
                        className="btn btn--primary"
                        disabled={isUpdating}
                      >
                        {isUpdating ? 'Updating...' : 'Add to Featured'}
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default withAdminProtection(FeaturedProductsPage);
