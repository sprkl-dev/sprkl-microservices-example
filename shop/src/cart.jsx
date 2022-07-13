import * as React from "react";
import {useContext, useMemo} from "react";
import {AppContext} from "./App";

export default function Cart() {
    const state = useContext(AppContext)
    const {products, cart, setCart, checkout} = state;

    const cartItems = useMemo(() => {
        const temp = cart.reduce((a, i) => {
            if (!a[i]) {
                const product = products.find(p => p.id === i)
                a[i] = {
                    ...product,
                    quantity: 0,
                }
            }
            a[i].quantity++
            return a
        }, {})
        return Object.values(temp) || []
    }, [cart])

    const cartTotal = useMemo(() => {
        return cartItems.reduce((a, i) => (a + i.quantity * i.price), 0)
    }, [cartItems])

    return (
        <div className="cart">
            <div className="cart__header">
                Cart
            </div>
            {
                cartTotal > 0
                    ? <>
                        <div className="cart__items">
                            {
                                cartItems.map((i) => (
                                    <div className="cart__item" key={i.id}>
                                        <div className="cart__item__title">Name: {i.name} x{i.quantity}</div>
                                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                            <div className="cart__item__total">Total: {i.quantity * i.price}$</div>
                                            <button onClick={() => {
                                                setCart(cart.filter(c => c !== i.id))
                                            }}>
                                                x
                                            </button>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        <div className="cart__total">
                            Total: {cartTotal}$
                        </div>
                        <div className="cart__checkout">
                            <button onClick={checkout}>
                                Checkout
                            </button>
                        </div>
                    </>
                    : <div className="cart__empty">
                        No Products
                    </div>
            }
        </div>
    )
}