import { useState, useContext,useEffect } from "react";
import cart from "../../assets/images/cart.svg";
import styles from "../../styles/navbar.module.css";
import Image from "next/image";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { useDispatch, useSelector } from "react-redux";
import localFont from "next/font/local";
import { LanguageContext } from "@/LanguageContext";
import { persistor } from "@/Component/Redux/store";
import Link from "next/link";
const zain = localFont({
  src: [
    {
      path: "../../public/Zain-Regular.ttf",
      weight: "600",
      style: "normal",
    },
  ],
});
const PlaywriteDEGrund = localFont({
  src: [
    {
      path: "../../public/PlaywriteDEGrund-Regular.ttf",
      weight: "600",
      style: "normal",
    },
  ],
});
const Cart = () => {
  const CartProduct = useSelector((state) => state.cart.cartItems);
  const { translations, lang, dir, code } = useContext(LanguageContext);
  const [isClient, setIsClient] = useState(false);

  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  useEffect(() => {
    setIsClient(true);
  }, []);
  console.log(CartProduct)
  const handleClearCart = async () => {
    try {
      await persistor.purge();
      // Optionally, you can also dispatch an action to reset the cart in your Redux store
    } catch (error) {
      console.error('Error clearing persisted state:', error);
    }
  };
  return (
    <>
      <div className={`${styles.cart__number}`} onClick={toggleDrawer(true)}>
        {
            isClient?
            <>
             <p className={`${styles.cart__para}`}>{CartProduct.length}</p>
        <Image
          alt=""
          src={cart}
          width={30}
          height={25}
          className={`${styles.svg}`}
          
        />

            </>
            :
            ''
        }
       
      </div>
    
      <Drawer open={open} onClose={toggleDrawer(false)} dir={dir} className={`${styles.carts__details}`}>
        <Box
          sx={{ width: 350 ,margin:'0px 15px'}}
          role="presentation"
          onClick={toggleDrawer(false)}
          className={`${
            code == "1" ? zain.className : PlaywriteDEGrund.className
          }`}
          
        >
          {isClient ? 
          <>
          <h2>عربة المشتريات</h2> 
         {/* <button onClick={handleClearCart}>
      Clear Cart
    </button> */} 
    {
      CartProduct.length==0?
      <p className={`${styles.noCart__para}`}>لا يوجد منتجات تمت اضافتها</p>
      :
      <List>
      {
          CartProduct.map(cartItem=>(
<ListItem >
       <div className={`${styles.cartItem__details}`}>
<Image alt='' src={cartItem.img} width={120} height={120}/>
<div dir={dir}>
<p>{cartItem.itemName}</p>
<p>{cartItem.price} EGP</p>
<p> المقاس : {cartItem.size} </p>
<p>اللون : {cartItem.colorName}</p>
</div>
       </div>
      </ListItem>
          ))
      }
      
    
    </List>
    }
       
          </>
          : ""}
        </Box>
        {
          isClient && CartProduct.length!=0?
          <div   className={` ${styles.end__carts} ${
            code == "1" ? zain.className : PlaywriteDEGrund.className
          }`}>
            <button>
          <Link href='/ViewCart'>أظهر سلة المشتريات</Link>
          </button>
          <button>
          <Link href='/checkout'>تكملة الدفع</Link>
          </button>
        </div>
        :
        ''
        }
       
      </Drawer>
     
    
    </>
  );
};

export default Cart;
