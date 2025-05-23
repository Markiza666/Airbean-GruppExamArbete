import { useState, useEffect } from 'react';
import styles from './Menu.module.scss';
import Header from '../../components/header/Header'; 
import { FaPlus } from 'react-icons/fa'; 
import { useStore } from '../../store/StoreUtils'; 
import Button from '../../components/button/Button';
import { getMenu } from '../../components/api/Api';

function Menu() {
    console.log("Menu component is rendering");
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); 

    const { addToCart } = useStore();

    const [cartItems, setCartItems] = useState([]); 

    const handleAddToCart = (item) => {
        addToCart(item); 

        const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
            setCartItems(cartItems.map(cartItem =>
                cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
            ));
        } else {
            setCartItems([...cartItems, { ...item, quantity: 1 }]);
        }
    };

    useEffect(() => {
        async function fetchMenu() {
            try {
                const menu = await getMenu();
                setMenuItems(menu);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        }
        fetchMenu();
    }, []); 
    console.log("getMenu called");

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className={styles.menuContainer}>
            <header>
                <Header />
            </header>
            <main>
                <h1>Meny</h1>
                <section className={styles.menuList}>
                    {menuItems?.length > 0 ? ( 
                        menuItems.map(item => (
                            <li key={item.id}>
                                <div className={styles.addButton}>
                                <Button onClick={() => handleAddToCart(item)}>
                                    <FaPlus />
                                </Button>
                                </div>
                                <h4 className={styles.coffeeName}>{item.title}</h4>
                                <h4 className={styles.coffeePrice}>{item.price} kr</h4>
                                <p>{item.desc}</p>
                            </li>
                        ))
                    ) : (
                        <p>Inga kaffealternativ tillgängliga ännu.</p>
                    )}
                </section>
            </main>
            <footer></footer>
        </div>
    );
}

export default Menu;