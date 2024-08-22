import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, ListGroup, Spinner, Alert } from 'react-bootstrap';

const App = () => {
    const [orders, setOrders] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ordersResponse, customersResponse] = await Promise.all([
                    axios.get('http://localhost:5000/api/shopify/orders'),
                    axios.get('http://localhost:5000/api/shopify/customers'),
                ]);

                setOrders(ordersResponse.data.orders);
                setCustomers(customersResponse.data.customers);
            } catch (err) {
                setError('Error fetching data from the server');
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);
console.log(orders)
    const sortData = useCallback((data, key) => {
        return [...data].sort((a, b) => {
            if (a[key] < b[key]) return -1;
            if (a[key] > b[key]) return 1;
            return 0;
        });
    }, []);

    const handleOrderSort = (key) => {
        setOrders(sortData(orders, key));
    };

    const handleCustomerSort = (key) => {
        setCustomers(sortData(customers, key));
    };

    if (loading) {
        return (
            <Container className="mt-5 text-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container className="mt-5">
            <h1 className="text-center mb-4">Shopify Orders and Customers</h1>

            <Row>
                <Col md={6}>
                    <Card>
                        <Card.Header className="d-flex justify-content-between align-items-center">
                            <h5>Orders</h5>
                            <div>
                                <Button variant="primary" onClick={() => handleOrderSort('created_at')}>Sort by Date</Button>
                                <Button variant="secondary" className="ms-2" onClick={() => handleOrderSort('total_price')}>Sort by Price</Button>
                            </div>
                        </Card.Header>
                        <ListGroup variant="flush">
                            {orders.map((order) => (
                                <ListGroup.Item key={order.shopifyId}>
                                    {/* <strong>Order ID:</strong> {order.shopifyId}<br />
                                    <strong>Email:</strong> {order.email}<br /> */}
                                    <strong>Total Price:</strong> ${order.total_price}<br />
                                    <strong>Created At:</strong> {new Date(order.created_at).toLocaleDateString()}<br />
                                    <strong>Fulfillment Status:</strong> {order.fulfillment_status || 'Unfulfilled'}<br />
                                    <strong>Cancellation Status:</strong> {order.cancelled_at?"Cancelled" :'Not Cancelled'}<br />
                                    {/* Show additional status like 'Order Creation' if needed */}
                                    <strong>Status:</strong> {order.cancellation_status === 'Cancelled' ? 'Cancelled' : order.fulfillment_status ? 'Fulfilled' : 'Pending'}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Card>
                </Col>

                <Col md={6}>
                    <Card>
                        <Card.Header className="d-flex justify-content-between align-items-center">
                            <h5>Customers</h5>
                            <div>
                                <Button variant="primary" onClick={() => handleCustomerSort('orders_count')}>Sort by Orders Count</Button>
                                <Button variant="secondary" className="ms-2" onClick={() => handleCustomerSort('total_spent')}>Sort by Total Spent</Button>
                            </div>
                        </Card.Header>
                        <ListGroup variant="flush">
                            {customers.map((customer) => (
                                <ListGroup.Item key={customer.shopifyId}>
                                    <strong>Customer ID:</strong> {customer.shopifyId}<br />
                                    <strong>Name:</strong> {customer.first_name} {customer.last_name}<br />
                                    <strong>Email:</strong> {customer.email}<br />
                                    <strong>Orders Count:</strong> {customer.orders_count}<br />
                                    <strong>Total Spent:</strong> ${customer.total_spent}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default App;
