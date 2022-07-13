import {Outlet, Link} from "react-router-dom";
import * as React from "react";
import {createContext, useEffect, useMemo, useState} from "react";
import axios from "axios";
import Cart from "./cart";
import { useNavigate } from 'react-router-dom'


export const AppContext = createContext(undefined)

export default function App() {
    const [cart, setCart] = React.useState([]);
    const [orders, setOrders] = React.useState([]);
    const [products, setProducts] = useState([])
    const navigate = useNavigate();


    const checkout = () => {
        axios.post(`/api/orders`, {items: cart.map(i => (products.find(p => p.id === i)).name)})
            .then(resp => {
                fetchOrders().then(() => {
                    setCart([])
                    navigate(`/orders`)
                })
            })
    }

    const state = {
        cart,
        setCart,
        products,
        orders,
        setOrders,
        checkout,
    }

    const fetchProducts = () => {
        return axios.get(`/api/catalog`)
            .then(resp => {
                setProducts(resp.data)
            })
    }
    const fetchOrders = () => {
        return axios.get(`/api/orders`)
            .then(resp => {
                setOrders(resp.data)
            })
    }

    useEffect(() => {
        fetchProducts();
        fetchOrders();
    }, []);

    return (
        <div className="app">
            <h1>Demo Shop</h1>
            <nav
                style={{
                    borderBottom: "solid 1px",
                    paddingBottom: "1rem",
                }}
            >
                <Link to="">Catalog</Link> |{" "}
                <Link to="/orders">Orders</Link>
            </nav>
            <div className="content">
                <div className="content__main">
                    <AppContext.Provider value={state}>
                        <Outlet/>
                    </AppContext.Provider>
                </div>
                <div className="content__cart">
                    <AppContext.Provider value={state}>
                        <Cart/>
                    </AppContext.Provider>
                </div>
            </div>
        </div>
    );
}