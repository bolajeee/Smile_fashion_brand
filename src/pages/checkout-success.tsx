import Link from 'next/link';
import Layout from '../layouts/Main';

const CheckoutSuccessPage = () => {
    return (
        <Layout>
            <section className="checkout-success">
                <div className="container">
                    <div className="success-content">
                        <div className="success-icon">
                            <i className="icon-check" style={{ fontSize: '64px', color: '#4CAF50' }}></i>
                        </div>

                        <h1>Order Placed Successfully!</h1>
                        <p>Thank you for your purchase. Your order has been received and is being processed.</p>

                        <div className="success-details">
                            <h3>What happens next?</h3>
                            <ul>
                                <li>You'll receive an email confirmation with your order details</li>
                                <li>Our team will process your order within 24 hours</li>
                                <li>You'll receive tracking information once your order ships</li>
                                <li>You can view your order status in your account profile</li>
                            </ul>
                        </div>

                        <div className="success-actions">
                            <Link href="/account/profile" className="btn btn--rounded btn--yellow">
                                View My Orders
                            </Link>
                            <Link href="/products" className="btn btn--rounded btn--border">
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default CheckoutSuccessPage;
