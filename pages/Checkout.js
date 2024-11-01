import { useState, useContext, useEffect, useReducer ,useRef} from "react";
import localFont from "next/font/local";
import { LanguageContext } from "@/LanguageContext";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { Col, Container, Row } from "react-bootstrap";
import styles from "../styles/checkout.module.css";
import Form from "react-bootstrap/Form";
import { useSession } from "next-auth/react";
import axios from "axios";
import Environment from "@/Environment";
import Image from "next/image";
import credit from "../assets/images/credit-card.png";
import cash from "../assets/images/payment-method.png";
import CheckIcon from '@mui/icons-material/Check';
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
import { paySchema } from "../Component/Global/schema";
import { useFormik } from "formik";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  Radio,
  RadioGroup,
  Typography,
  TextField as Input,
} from "@mui/material";
import { formatCardNumber, formatExpiryDate } from "../Component/Global/formatting";
import { CalendarToday, CreditCard } from "@mui/icons-material";

const Checkout = () => {
  const { data: session, status } = useSession();
  const [selectedOption, setSelectedOption] = useState();
  const [selectedGovernmentObj, setselectedGovernmentObj] = useState();
  const [detailsCart, setDetails] = useState([]);
  const [payment, setPayment] = useState('cash');

  const [Govern, setGovern] = useState([]);
  const { translations, code, dir } = useContext(LanguageContext);

  const CartProduct = useSelector((state) => state.cart.cartItems);
  console.log(CartProduct);
  const initialState = {
    address: session?.data?.address,
    fName: session?.data?.firstName,
    lName: session?.data?.lastName,
    email: session?.data?.email,
    city: "",
    home: "",
    phone: session?.data?.mobile,
  };
  function formReducer(state, action) {
    switch (action.type) {
      case "UPDATE_FIELD":
        return {
          ...state,
          [action.field]: action.value,
        };
      case "RESET_FORM":
        return initialState;
      default:
        return state;
    }
  }
  const [formData, dispatch] = useReducer(formReducer, initialState);
  function handleChange(e) {
    const { name, value } = e.target;
    dispatch({
      type: "UPDATE_FIELD",
      field: name,
      value: value,
    });
  }
  useEffect(() => {
    axios
      .get(`${Environment.baseURL}/api/Governorate/getGovernorate`, {
        headers: {
          langCode: code,
          webOrMob: 2,
        },
      })
      .then((response) => {
        setGovern(response.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
    setDetails(
      CartProduct.map((item) => ({
        itemCode: item.itemCode,
        quantity: item.quantity,
        price: item.price,
        itemColor: item.itemColor,
        itemSize: item.itemSize,
      }))
    );
  }, [CartProduct]);
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);

    const selectedGovernmentObj = Govern.find(
      (govern) => govern.code == event.target.value
    );

    const internalSalesManFees = selectedGovernmentObj.internalSalesManFees;
    setselectedGovernmentObj(internalSalesManFees);
  };
  const PaymentForm = () => {
   
  }
  const formik = useFormik({
    initialValues: {
      name: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    },
    validationSchema: paySchema,
    onSubmit: async (values) => {
      // Implement payment logic here

      const [month, year] = values.expiryDate.split(' / ');
      
    },
  });
  return (
    <>
      <section
        className={`${
          code == "AR" ? zain.className : PlaywriteDEGrund.className
        } ${styles.sec}`}
      >
        <Row dir={dir} className={`${styles.row__check}`}>
          <Col className={`${styles.delivery__details}`}>
            <div className={`${styles.delivery__body}`}>
              <p>{translations.delivery}</p>
              <Link href="/Login">{translations.logino}؟</Link>
            </div>
            <div className={`${styles.delivery__form}`}>
              <Form.Control
                type="text"
                placeholder={`${translations.Emailaddress}`}
                className={`${styles.input}`}
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              <Row className="mt-3">
                <Col>
                  <Form.Control
                    type="text"
                    placeholder={`${translations.firstName}`}
                    className={`${styles.input}`}
                    name="fName"
                    value={formData.fName}
                    onChange={handleChange}
                  />
                </Col>
                <Col>
                  <Form.Control
                    type="text"
                    placeholder={`${translations.lastName}`}
                    className={`${styles.input}`}
                    name="lName"
                    value={formData.lName}
                    onChange={handleChange}
                  />
                </Col>
              </Row>
              <Form.Control
                type="text"
                placeholder={`${translations.address}`}
                className={`${styles.input} mt-3 `}
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
              <Row className="align-items-center">
                <Col sm="7" xl="4" className="mt-3">
                  <Form.Select
                    aria-label="Default select example"
                    className={`${styles.input}`}
                    onChange={handleOptionChange}
                  >
                    <option> {translations.Chooseagovernorate} </option>
                    {Govern.map((govern) => (
                      <option key={govern.code} value={govern.code}>
                        {govern.name}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col className="mt-3">
                  <Form.Control
                    type="text"
                    placeholder={`${translations.city}`}
                    className={`${styles.input} mt-3 mb-3`}
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </Col>

                <Col className="mt-3">
                  <Form.Control
                    type="text"
                    placeholder={`${translations.apartmentnumber}`}
                    className={`${styles.input} mt-3 mb-3`}
                    name="home"
                    value={formData.home}
                    onChange={handleChange}
                  />
                </Col>
              </Row>
            </div>
            <div className={`${styles.payment__body}`}>
              <p>{translations.PaymentMethod}</p>
              <div >
                <div className={`${styles.method} ${payment=='cash'?styles.cash:''}`} onClick={()=>setPayment('cash')}>
                  <Image alt="" src={cash} width={60} height={60} />
                  <span>{translations.PayWithCash}</span>
                  {
                    payment=='cash'?
                  <div className={`${styles.check}`}>
                  
                    <CheckIcon/>
                   
                  </div>
                   :
                   ''
                 }
                </div>
                <div className={`${styles.method} ${payment=='credit'?styles.credit:''}`} onClick={()=>setPayment('credit')}>
                  <Image alt="" src={credit} width={60} height={60} />
                  <span>{translations.PayWithCreditCard}</span>
                  {
                    payment=='credit'?
                  <div className={`${styles.check}`}>
                  
                    <CheckIcon/>
                   
                  </div>
                   :
                   ''
                 }
                </div>
                <div className={`${styles.hello} ${styles.ani}  ${code == "AR" ? zain.className : PlaywriteDEGrund.className
        }`}>
                {
                  payment=='credit'?
                  
                  <Box
          sx={{
            maxWidth: "32rem",
            borderRadius: "20px",
            marginBottom:'20px'
          }}
        >
          {/* <SharedLayout> */}
          <Box>
            <Box>
              <form onSubmit={formik.handleSubmit} className={`${styles.card__form}`}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12}>
                    <Box sx={{ pb: 2 }}>
                      <InputLabel sx={{ py: 0.5, color: "#49454F" }} className={`${code == "AR" ? zain.className : PlaywriteDEGrund.className
        }`}>
                      {translations.Nameofcardholder}
                      </InputLabel>
                      <Input
                        fullWidth
                        id="name"
                        name="name"
                        value={formik.values.name}
                        onChange={(e) => {
                          formik.handleChange(e);
                        }}
                        error={formik.touched.name && Boolean(formik.errors.name)}
                        helperText={formik.touched.name && formik.errors.name}
                        placeholder="ahmed "
                        className={`${code == "AR" ? zain.className : PlaywriteDEGrund.className
                        }`}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Box sx={{ pb: 2 }}>
                      <InputLabel sx={{ py: 0.5, color: "#49454F" }} className={`${code == "AR" ? zain.className : PlaywriteDEGrund.className
        }`}>
                      {translations.Cardnumber}
                      </InputLabel>
                      <Input
                        fullWidth
                        id="cardNumber"
                        name="cardNumber"
                        value={formatCardNumber(formik.values.cardNumber)}
                        onChange={(e) => {
                          e.target.value = formatCardNumber(e.target.value);
                          formik.handleChange(e);
                        }}
                        error={
                          formik.touched.cardNumber &&
                          Boolean(formik.errors.cardNumber)
                        }
                        helperText={
                          formik.touched.cardNumber && formik.errors.cardNumber
                        }
                        sx={{
                          "& .MuiInputBase-root": {
                            paddingLeft: "8px",
                          },
                        }}
                        inputProps={{ maxLength: 19 }}
                        placeholder="1234 1234 1234 1234"
                        // placeholder="e.g John Doe"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <IconButton edge={`${code == "AR" ? 'start': 'end'}`} sx={{ p: 0 }}>
                                <CreditCard className="main-color" />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        className={`${code == "AR" ? zain.className : PlaywriteDEGrund.className
                        }`}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InputLabel sx={{ py: 0.5, color: "#49454F" }} className={`${code == "AR" ? zain.className : PlaywriteDEGrund.className
        }`}>
                    {translations.expirationdate}
                    </InputLabel>
                    <Input
                      variant="outlined"
                      fullWidth
                      id="expiryDate"
                      name="expiryDate"
                      value={formik.values.expiryDate}
                      onChange={(e) => {
                        e.target.value = formatExpiryDate(e.target.value);
                        formik.handleChange(e);
                      }}
                      error={
                        formik.touched.expiryDate &&
                        Boolean(formik.errors.expiryDate)
                      }
                      helperText={
                        formik.touched.expiryDate && formik.errors.expiryDate
                      }
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <CalendarToday
                              sx={{ color: "#ABABAB", width: "1rem" }}
                            />
                          </InputAdornment>
                        ),
                      }}
                      placeholder={`${translations.monthyear}`}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InputLabel sx={{ py: 0.5, color: "#49454F" }} className={`${code == "AR" ? zain.className : PlaywriteDEGrund.className
        }`}>
                    {translations.cvv}
                    </InputLabel>
                    <Input
                      variant="outlined"
                      fullWidth
                      id="cvv"
                      name="cvv"
                      value={formik.values.cvv}
                      onChange={formik.handleChange}
                      error={formik.touched.cvv && Boolean(formik.errors.cvv)}
                      helperText={formik.touched.cvv && formik.errors.cvv}
                      inputProps={{ maxLength: 4 }}
                      placeholder="123"
                    />
                  </Grid>
                </Grid>
                <Button
                  variant="contained"
                  type="submit"
                  sx={{
                    width: "100%",
                    mt: 4,
                    py: 1.3,
                    fontWeight: "500",
                    background: "#000",
                  }}
                  className={`${code == "AR" ? zain.className : PlaywriteDEGrund.className
                  }`}
                >
                 {translations.payNow}
                </Button>
              </form>
            </Box>
          </Box>
          {/* </SharedLayout> */}
        </Box>
                  
                  :
                  <Button
                  variant="contained"
                  type="submit"
                  sx={{
                    width: "100%",
                    mt: 4,
                    py: 1.3,
                    fontWeight: "500",
                    background: "#000",
                  }}
                  className="normal-text"
                >
                 {translations.payNow}
                </Button>
                }
               
              
               </div>
              </div>
            </div>
          </Col>

          <Col className={`${styles.carts__details}`}>
            <div className={`${styles.carts__sticky}`}>
              {CartProduct.map((item) => (
                <>
                  <div className={`${styles.item__details}`}>
                    <div className={`${styles.item__body}`}>
                      <div className={`${styles.item__img}`}>
                        <Image alt="" src={item.img} width={100} height={100} />
                        <p className={`${styles.item__qty}`}>{item.quantity}</p>
                      </div>
                      <div>
                        <p>{item.itemName}</p>
                        <p> {translations.selectSize} : {item.size} </p>
                        <p>{translations.selectColor} : {item.colorName}</p>
                      </div>
                    </div>
                    <div className={`${styles.item__price}`}>
                      <p>{item.price} EGP</p>
                    </div>
                  </div>
                </>
              ))}
            </div>
          </Col>
        </Row>
      </section>
    </>
  );
};

export default Checkout;
