import {useContext, useEffect, useState} from "react";
import {AppContext} from "../App";
import { ReactComponent as Icon } from "../assets/icon.svg";

export default function Catalog() {
    const state = useContext(AppContext)
    const {products, cart, setCart} = state;

    return (
        <div className="catalog">
            <div className="products">
                {
                    products.map(i => (
                        <div className="products__item" key={i.id}>
                            <div className="products__item__image">
                                <Icon/>
                            </div>
                            <div className="products__item__name">{i.name}</div>
                            <div className="products__item__price">{i.price}$</div>
                            <button
                                className="products__item__price"
                                onClick={() => setCart([...cart, i.id])}
                            >
                                Add to cart
                            </button>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}