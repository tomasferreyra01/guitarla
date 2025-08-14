import { useState, useEffect } from "react"
import { db } from "../data/db"
import { useMemo } from 'react';

export const useCart = () => {

    const initialCart = () => {
    const localStorageCart = localStorage.getItem('cart')
    return localStorageCart ? JSON.parse(localStorageCart) : []
    }

    const [data] = useState(db)
    const [cart, setCart] = useState(initialCart) // Inicializamos el carrito con el valor de localStorage si existe, sino con un array vacío

    const MAX_ITEMS = 5 // Definimos una constante para el máximo de guitarras que se pueden agregar al carrito
    const MIN_ITEMS = 1 // Definimos una constante para el mínimo de guitarras que se pueden agregar al carrito
    
    useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
    }, [cart]) // Guardamos el carrito en localStorage cada vez que cambia
    
    function addToCart(item) {
        
        const itemExists = cart.findIndex(guitar => guitar.id === item.id) // Lo usamos para agregar más guitarras de la misma al carrito
        if (itemExists >= 0){ // Existe en el carrito
            if (cart[itemExists].quantily >= MAX_ITEMS) return
            const updatedCart = [...cart] //copia del state, no modifica
            updatedCart[itemExists].quantily++ //aumento la cantidad de guitarras
        } else { 
            item.quantily = 1
            setCart([...cart, item])
        }

    }

    function removeFromCart(id) {
        setCart(prevCart => prevCart.filter(guitar => guitar.id !== id)) // Filtra el carrito para eliminar la guitarra con el id especificado
    } 

    function decreaseQuantity(id) {
        const updatedCart = cart.map(item => {
        if (item.id === id && item.quantily > MIN_ITEMS) {
            return { 
                ...item,
                quantily: item.quantily - 1
            }
        }
        return item
        })
        setCart(updatedCart)
    }

    function increaseQuantity(id) {
        const updatedCart = cart.map(item => {
        if (item.id === id && item.quantily < MAX_ITEMS) {
            return { 
                ...item,
                quantily: item.quantily + 1
            }
        }
        return item
        })
        setCart(updatedCart)
    }

    function clearCart() {
        setCart([]) // Limpia el carrito
    }

    // State derivado
    const isEmpty = useMemo( () => cart.length === 0, [cart] ) 
    const cartTotal = useMemo(() => cart.reduce( (total, item) => total + (item.quantily * item.price), 0), [cart] )


  return {
    data,
    cart,
    addToCart,
    removeFromCart,
    decreaseQuantity,
    increaseQuantity,
    clearCart,
    isEmpty,
    cartTotal
  }

}