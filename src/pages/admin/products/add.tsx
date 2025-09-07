import { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Layout from '@/layouts/Main';
import { withAdminProtection } from '@/components/auth/withAdminProtection';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.string()
    .min(1, 'Price is required')
    .regex(/^\d+(\.\d{0,2})?$/, 'Price must be a valid number with up to 2 decimal places')
    .transform((val) => parseFloat(val))
    .refine((val) => val > 0, 'Price must be positive'),
  images: z.string().optional(),
  countInStock: z.coerce.number().int().nonnegative('Stock must be 0 or more'),
});

type FormValues = z.infer<typeof schema>;

const AddProductPage = () => {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const onSubmit = async (values: FormValues) => {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: values.name,
        description: values.description,
        price: values.price,
        images: [uploadedUrl || values.images].filter(Boolean),
        stock: values.countInStock,
      }),
    });
    if (res.ok) {
      router.push('/admin/products');
    }
  };

  return (
    <Layout>
      <div className="container">
        <div className="admin-form">
          <h1 className="admin-form__title">Add New Product</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label>Name</label>
              <input type="text" {...register('name')} />
              {errors.name && <small className="error-message">{errors.name.message}</small>}
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea {...register('description')} />
              {errors.description && <small className="error-message">{errors.description.message}</small>}
            </div>
            <div className="form-group">
              <label>Price</label>
              <input type="number" step="0.01" {...register('price')} />
              {errors.price && <small className="error-message">{errors.price.message}</small>}
            </div>
            <div className="form-group">
              <label>Thumbnail Image</label>
              <input type="text" placeholder="https://..." {...register('images')} />
              {errors.images && <small className="error-message">{errors.images.message}</small>}
              <div className="image-upload">
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const formData = new FormData();
                    formData.append('file', file);
                    setUploading(true);
                    try {
                      const res = await fetch('/api/upload', { method: 'POST', body: formData });
                      const data = await res.json();
                      if (res.ok) {
                        setUploadedUrl(data.url);
                      } else {
                        alert(data.message || 'Upload failed');
                      }
                    } catch (err) {
                      alert('Upload error');
                    } finally {
                      setUploading(false);
                    }
                  }}
                />
                {uploading && <small>Uploading...</small>}
                {uploadedUrl && (
                  <div className="image-preview">
                    <img src={uploadedUrl} alt="uploaded" />
                    <small>{uploadedUrl}</small>
                  </div>
                )}
              </div>
            </div>
            <div className="form-group">
              <label>Count in Stock</label>
              <input type="number" {...register('countInStock')} />
              {errors.countInStock && <small className="error-message">{errors.countInStock.message}</small>}
            </div>
            <div className="form-actions">
              <button type="button" className="btn btn--rounded btn--border" onClick={() => router.push('/admin/products')}>
                Cancel
              </button>
              <button type="submit" className="btn btn--rounded btn--yellow" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default withAdminProtection(AddProductPage);
