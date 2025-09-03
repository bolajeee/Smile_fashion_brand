import { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Layout from '../layouts/Main';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.coerce.number().positive('Price must be positive'),
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
      router.push('/products');
    }
  };

  return (
    <Layout>
      <div className="container">
        <h1>Add Product</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>Name</label>
            <input type="text" {...register('name')} />
            {errors.name && <small style={{ color: 'red' }}>{errors.name.message}</small>}
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea {...register('description')} />
            {errors.description && <small style={{ color: 'red' }}>{errors.description.message}</small>}
          </div>
          <div className="form-group">
            <label>Price</label>
            <input type="number" step="0.01" {...register('price')} />
            {errors.price && <small style={{ color: 'red' }}>{errors.price.message}</small>}
          </div>
          <div className="form-group">
            <label>Images</label>
            <input type="text" placeholder="https://..." {...register('images')} />
            {errors.images && <small style={{ color: 'red' }}>{errors.images.message}</small>}
            <div style={{ marginTop: 8 }}>
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
                <div style={{ marginTop: 8 }}>
                  <img src={uploadedUrl} alt="uploaded" style={{ width: 80, height: 80, objectFit: 'cover' }} />
                  <small style={{ display: 'block' }}>{uploadedUrl}</small>
                </div>
              )}
            </div>
          </div>
          <div className="form-group">
            <label>Count in Stock</label>
            <input type="number" {...register('countInStock')} />
            {errors.countInStock && <small style={{ color: 'red' }}>{errors.countInStock.message}</small>}
          </div>
          <button type="submit" className="btn btn--rounded" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Add Product'}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default AddProductPage;
