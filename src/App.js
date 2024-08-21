import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, ListGroup } from 'react-bootstrap';

const App = () => {
    const [orders, setOrders] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [orderSortKey, setOrderSortKey] = useState('created_at');
    const [customerSortKey, setCustomerSortKey] = useState('orders_count');

    useEffect(() => {
        // Fetch orders from backend
        axios.get('http://localhost:5000/api/shopify/orders')
            .then(response => setOrders(response.data.orders))
            .catch(error => console.error('Error fetching orders:', error));

        // Fetch customers from backend
        axios.get('http://localhost:5000/api/shopify/customers')
            .then(response => setCustomers(response.data.customers))
            .catch(error => console.error('Error fetching customers:', error));
    }, []);

    const sortOrders = (key) => {
        const sortedOrders = [...orders].sort((a, b) => {
            if (a[key] < b[key]) return -1;
            if (a[key] > b[key]) return 1;
            return 0;
        });
        setOrders(sortedOrders);
    };

    const sortCustomers = (key) => {
        const sortedCustomers = [...customers].sort((a, b) => {
            if (a[key] < b[key]) return -1;
            if (a[key] > b[key]) return 1;
            return 0;
        });
        setCustomers(sortedCustomers);
    };

    return (
        <Container className="mt-5">
            <h1 className="text-center mb-4">Shopify Orders and Customers</h1>

            <Row>
                <Col md={6}>
                    <Card>
                        <Card.Header className="d-flex justify-content-between align-items-center">
                            <h5>Orders</h5>
                            <div>
                                <Button variant="primary" onClick={() => sortOrders('created_at')}>Sort by Date</Button>
                                <Button variant="secondary" className="ms-2" onClick={() => sortOrders('total_price')}>Sort by Price</Button>
                            </div>
                        </Card.Header>
                        <ListGroup variant="flush">
                            {orders.map((order) => (
                                <ListGroup.Item key={order.shopifyId}>
                                    <strong>Order ID:</strong> {order.shopifyId}<br />
                                    <strong>Email:</strong> {order.email}<br />
                                    <strong>Total Price:</strong> ${order.total_price}<br />
                                    <strong>Created At:</strong> {new Date(order.created_at).toLocaleDateString()}<br />
                                    <strong>Fulfillment Status:</strong> {order.fulfillment_status || 'Unfulfilled'}<br />
                                    <strong>Cancellation Status:</strong> {order.cancellation_status || 'Not Cancelled'}
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
                                <Button variant="primary" onClick={() => sortCustomers('orders_count')}>Sort by Orders Count</Button>
                                <Button variant="secondary" className="ms-2" onClick={() => sortCustomers('total_spent')}>Sort by Total Spent</Button>
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
