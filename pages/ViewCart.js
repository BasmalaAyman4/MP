import React, { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import localFont from "next/font/local";
import { LanguageContext } from "@/LanguageContext";
import Image from "next/image";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import styles from "../styles/navbar.module.css";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { cartActions } from "@/Component/Redux/slices/cartslice";
import { Container } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
const zain = localFont({
  src: [
    {
      path: "../public/Zain-Regular.ttf",
      weight: "600",
      style: "normal",
    },
  ],
});
const PlaywriteDEGrund = localFont({
  src: [
    {
      path: "../public/PlaywriteDEGrund-Regular.ttf",
      weight: "600",
      style: "normal",
    },
  ],
});
const ViewCart = () => {
  const CartProduct = useSelector((state) => state.cart.cartItems);
  const { translations, lang, dir, code } = useContext(LanguageContext);
  const [isClient, setIsClient] = useState(false);
  const dispatch = useDispatch()
  const deleteItm = (idCode,idColor,idSize) => {
    const barCode=`'${idCode}-${idColor}-${idSize}'`;

      dispatch(cartActions.deleteItem(barCode))
  }
  const handleIncrement = (rowId,fullqty,qty) => {
    console.log(qty,fullqty)
   if(qty >= fullqty){
    toast.error('لا يوجد كمية للاضافة')

   }else{
    dispatch(cartActions.plusItem(rowId))

   }
  };
  
  const handleDecrement = (rowId) => {
   
    dispatch(cartActions.reduceItem(rowId))
  };
  console.log(CartProduct)
  return (
    <>
      <section className={`${styles.viewCart__sec}`}>
        <Container>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align='center'>{translations.products}</TableCell>
                <TableCell align='center'> {translations.Description}</TableCell>
                <TableCell align='center'> {translations.price}</TableCell>
                <TableCell align='center'> {translations.qty}</TableCell>
                <TableCell align='center'> {translations.Total}</TableCell>
                <TableCell align='center'> {translations.Delete}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {CartProduct.map((cartItem) => (
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row" align='center'>
                    <Image alt="" src={cartItem.img} width={120} height={120} />
                  </TableCell >
                  <TableCell align='center'>
                    <p>{cartItem.itemName}</p>

                    <p> {translations.selectSize} : {cartItem.size} </p>
                    <p>{translations.selectColor} : {cartItem.colorName}</p>
                  </TableCell>
                  <TableCell align='center'>
                    <p>{cartItem.price} EGP</p>
                  </TableCell>
                  <TableCell align='center'>
                
                  <div className={`${styles.number__bodyy}`}>
          <button onClick={() => handleIncrement(cartItem.itemCode,cartItem.qty,cartItem.quantity)}>
            <AddIcon />
          </button>

<h5>{cartItem.quantity}</h5>

          
          <button onClick={() => handleDecrement(cartItem.itemCode)}>
            <RemoveIcon />
          </button>
        </div>
            
                  </TableCell>
                  <TableCell align='center'><p>{cartItem.totalPrice}</p></TableCell>
                  <TableCell align='center'>
                    <ClearIcon onClick={()=>deleteItm(cartItem.itemCode,cartItem.itemColor , cartItem.itemSize)}/>
                  </TableCell>
                </TableRow>
              ))}
             
            </TableBody>
          </Table>
        </TableContainer>
        </Container>
        <ToastContainer/>
      </section>
    </>
  );
};

export default ViewCart;
