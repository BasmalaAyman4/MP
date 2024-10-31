import React, { useState, useEffect, useContext, useRef } from "react";
import { Row, Col, Container } from "react-bootstrap";
import styles from "../../styles/productdeatils.module.css";
import { LanguageContext } from "../../LanguageContext";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useSession } from "next-auth/react";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/router";
import { useLanguageContext } from "../../LanguageContext";
import { useDispatch, useSelector } from "react-redux";
import { cartActions } from "../../Component/Redux/slices/cartslice";
import axios from "axios";
import {
  WhatsappShareButton,
  WhatsappIcon,
  FacebookMessengerShareButton,
  FacebookMessengerIcon,
  TwitterShareButton,
  TwitterIcon,
  TelegramShareButton,
  TelegramIcon,
  FacebookShareButton,
  FacebookIcon,
} from "next-share";
import ShareIcon from "@mui/icons-material/Share";
import Image from "next/image";
import Cookies from "js-cookie";
import VisibilityIcon from "@mui/icons-material/Visibility";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import noImg from '../../assets/images/Logoo.png'

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import localFont from "next/font/local";

import Environment from "@/Environment";
import { Opacity } from "@mui/icons-material";
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
const productDetails = ({prod,colorImage}) => {
  const router = useRouter();
  const { productId } = router.query;
  const { translations, lang, dir, code } = useContext(LanguageContext);
  const [successLogin, setSuccessLogin] = useState(false);
  const [successData, setSucessData] = useState({});
  const [loginPoup, setLoginPoup] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const { data: session, status } = useSession();
  const dispatch = useDispatch();
  const CartProduct = useSelector(state => state.cart.cartItems)
  const thumbnailRef = useRef(null);
  const handleClose = () => setLoginPoup(false);
  const [slideIndex, setSlideIndex] = useState(0);

  const plusSlides = (n) => {
    setSlideIndex((prevIndex) => {
      let newIndex = prevIndex + n;
      if (newIndex >= selectColor?.productPic.length) return 0;
      if (newIndex < 0) return selectColor?.productPic.length - 1;
      return newIndex;
    });
  };

  const currentSlide = (n) => {
    setSlideIndex(n);
    const thumbnail = thumbnailRef.current;
    if (thumbnail) {
      const selectedThumbnail = thumbnail.children[n];
      if (selectedThumbnail) {
        selectedThumbnail.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };
  const uniqueColors = {};

  if (Array.isArray(colorImage)) {
    for (const item of colorImage) {
      const colorKey = `${item.itemColor}-${item.colorHex}`;
      if (!uniqueColors[colorKey]) {
        uniqueColors[colorKey] = {
          itemColor: item.itemColor,
          colorName: item.colorName,
          colorHex: item.colorHex,
          sizes: [],
          productPic: item.productPic,
          productVedio: item.productVedio,
        };
      }
      uniqueColors[colorKey].sizes.push({
        size: item.sizeName,
        itemSize: item.itemSize,
        qty: item.quantity,
      });
    }

    for (const key in uniqueColors) {
      if (uniqueColors.hasOwnProperty(key)) {
        uniqueColors[key].sizes.sort((a, b) => a.itemSize - b.itemSize);
      }
    }
  }
  const result = Object.values(uniqueColors);
  const [selectColor, setSelectColor] = useState({});
  const [firstSize, setFirstSize] = useState({});
  const handleSizeSelection = (size) => {
    setFirstSize(size);
  };
  useEffect(() => {
    setSelectColor(result[0]);
    setFirstSize(result[0]?.sizes[0]);
  }, [prod]);

  const handleColorSelection = (color) => {
    setSelectColor(color);
    setFirstSize(color?.sizes[0]);
    setSlideIndex(0)
  };
  const [number, setNumber] = useState(1);

  const increaseNumber = () => {
    setNumber(number + 1);
  };

  const decreaseNumber = () => {
    if (number > 1) {
      setNumber(number - 1);
    }
  };
  
  const addToCart = (e) => {
    e.preventDefault();
    const barCode=`'${prod.itemCode}-${selectColor.itemColor}-${firstSize.itemSize}'`;
      dispatch(
        cartActions.addItem({
          itemCode: prod.itemCode,
          itemColor: selectColor.itemColor,
          itemSize: firstSize.itemSize,
          quantity: number,
          img: selectColor?.productPic[0],
          price: prod.dealPrice == 0 ? prod.price : prod.dealPrice,
          itemName: prod.itemName,
          colorName: selectColor.colorName,
          size:firstSize.size,
          qty:firstSize?.qty,
          barCode:barCode
        })
      );
    toast.success("Product Added to Cart");

   
  };
  const [isTruncated, setIsTruncated] = useState(true);

  const toggleTruncate = () => {
    setIsTruncated(!isTruncated);
  };
  const truncatedText = isTruncated
    ? prod.itemDesc?.slice(0, 100)
    : prod.itemDesc;
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);


  console.log(selectColor?.productPic)

  const handleWheel = (event) => {
    if (thumbnailRef.current && thumbnailRef.current.contains(event.target)) {
      event.preventDefault();
      thumbnailRef.current.scrollBy({
        top: event.deltaY,
        behavior: 'smooth',
      });
    }
  };

  React.useEffect(() => {
    const thumbnailContainer = thumbnailRef.current;
    if (thumbnailContainer) {
      thumbnailContainer.addEventListener('wheel', handleWheel);
    }

    return () => {
      if (thumbnailContainer) {
        thumbnailContainer.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);
  if (isLoading) return (
    <>
    <div className={`loader ${PlaywriteDEGrund.className}`}>
    <span>Mehrail PM</span>
    <span>Mehrail PM</span>
   
</div>
</>
  )
  return (
    <>
      <section className={`${styles.section} ${
          code == "AR" ? zain.className : PlaywriteDEGrund.className
        }`}>
        
          <Row dir={isClient ? dir : ""} >
            <Col dir={isClient ? dir : ""} xl={6}>
              {selectColor?.productPic?.length!=0 ? (
               <div className={`${styles.select__images}`}>
                <div className={`${styles.mySwiper2}`}>
                  {selectColor?.productPic?.map((src, index) => (
                    <div className={`${styles.mySlides} ${index === slideIndex ? styles.active : ''}`} key={index}>
                      <img src={src} style={{ width: '100%' }} alt={`Slide ${index + 1}`} />
                    </div>
                  ))}
{/*                   <a className="prev" onClick={() => plusSlides(-1)}>❮</a>
                  <a className="next" onClick={() => plusSlides(1)}>❯</a>  */}                 
                </div>
                <div className={`${styles.mySwiper}`} ref={thumbnailRef}>
                  {selectColor?.productPic?.map((src, index) => (
                    <div className={`${styles.column}`} key={index}>
                      <img
                        className={` ${styles.demo}${index === slideIndex ? styles.active : ''}`}
                        src={src}
                        style={{ width: '100%' }}
                        onClick={() => currentSlide(index)}
                        alt={`Thumbnail ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>
                
                </div> 
              ) : (
                <Image alt='' src={noImg}/>
              )}

            </Col>
            <Col xl={6} className={`${styles.row__details}`}>
              <h2>{prod.itemName}</h2>
              <div className={`${styles.isTruncated__body}`}>
                <p>{truncatedText}</p>
                {prod.itemDesc?.length > 100 && (
                  <button
                    onClick={toggleTruncate}
                    className={`${styles.isTruncated}`}
                  >
                    {isClient
                      ? isTruncated
                        ? translations.ReadMore
                        : translations.ReadLess
                      : ""}
                  </button>
                )}
              </div>
              <div className={`${styles.price__body}`}>
                {prod.dealPrice == 0 ? (
                  <p> EGP {prod.price}</p>
                ) : (
                  <div className={`${styles.update__price}`}>
                    <p>EGP {prod.dealPrice}</p>
                    <del className={`${styles.price__del}`}>
                      EGP {prod.price}
                    </del>
                  </div>
                )}
              </div>
              <p className={`${styles.choose__color__para}`}>{isClient ? `${translations.choosecolor}` : ""}</p>
              <div className={`${styles.choose__color}`}>
                {result.map((color) => (
                  <div
                    key={color.itemColor}
                    style={{
                      backgroundColor: `#${color.colorHex}`,
                      cursor: "pointer",
                      width: "30px",
                      height: "30px",
                    }}
                    className={
                      selectColor?.itemColor == color.itemColor
                        ? `${styles.selectcolorhex} boxshadow mb-2`
                        : `mb-2 boxshadow`
                    }
                    onClick={() => handleColorSelection(color)}
                  ></div>
                ))}
              </div>
              <p className={`${styles.choose__color__para}`}>{isClient ? `${translations.SizeAvailable} :` : ""}</p>
              <div className={`${styles.size__body}`}>
                {selectColor?.sizes?.map((siz) => (
                  <p
                    key={siz.itemSize}
                    className={
                      firstSize?.size == siz?.size
                        ? `${styles.selectsize}`
                        : `${styles.size}`
                    }
                    onClick={() => handleSizeSelection(siz)}
                  >
                    {siz.size}
                  </p>
                ))}
              </div>
              <hr className={`${styles.hr}`}/>
              <div className={`${styles.qty__body}`}>
              <p className={`${styles.choose__color__para}`}>الكمية : <span>{number}</span></p>
              <div className={`${styles.number__body}`}>
                  <button onClick={increaseNumber}>
                    <AddIcon />
                  </button>
                  <button onClick={decreaseNumber}>
                    <RemoveIcon />
                  </button>
                </div>
              </div>
              <hr className={`${styles.hr}`}/>
              <div className={`${styles.watch__btn}`}>
                {firstSize?.qty >= number ? (
                 
                                      <button className={`${styles.filter__btn}`} type="button" onClick={addToCart}> أضف الي السلة </button>

                ) : (
                  <p className={`${styles.not}`}>{isClient ? `${translations.ProductQuantityisnotAvailable}` : ''}</p>
                )}
                
              </div>
            </Col>
          </Row>
        
        <ToastContainer />
      </section>
    </>
  );
};

export default productDetails;

 export async function getStaticPaths(context) {
  const{query}=context
  const posts = await fetch(`${Environment.baseURL}/api/ItemTypes/GetItemsByType`, {
    headers: {

        webOrMob: 2
    }
});
const data = await posts.json();
const ProdID =data.data
const paths = ProdID.map(post=>{
  return{
    params:{
      productId:`${post.itemCode}`
    }
  }
})
  return {
    paths,
    fallback: true, // false or "blocking"
  }
}
 

export async function getStaticProps(context) {
  const { params ,locale} = context; 
  const posts = await fetch(`${Environment.baseURL}/api/HomeV2/getItemById?ItemId=${params.productId}`, {
      headers: {
          webOrMob: 2,
      'langCode': locale == 'AR' ? '1' : '2'
      }
  });
  const data = await posts.json();
  return { 
      props: { 
      prod:data.data ,
      colorImage: data.data.reacentlyAddedDetails,
      params
  } 
}
} 
