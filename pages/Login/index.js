import { useState, useEffect, useContext, useReducer } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import styles from "../../styles/login.module.css";
import { Col, Container, Row } from "react-bootstrap";
import Image from "next/image";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { LanguageContext } from "@/LanguageContext";
import OtpInput from "react-otp-input";
import Environment from "@/Environment";
import React from "react";
import localFont from 'next/font/local'
const zain = localFont({
  src: [
    {
      path: '../../public/Zain-Regular.ttf',
      weight: '600',
      style: 'normal',
    }
  ],
})
const PlaywriteDEGrund = localFont({
  src: [
    {
      path: '../../public/PlaywriteDEGrund-Regular.ttf',
      weight: '600',
      style: 'normal',
    }
  ],
})
const index = () => {
  const { translations, lang, dir, code } = useContext(LanguageContext);
  const [mobile, setMobile] = useState("");
  const[session,setSession]=useState()
  const [sessionLogin, setSessionLogin] = useState(true);
  const [sessionOtp, setSessionOto] = useState(false);
  const [sessionCompleteOtp, setSessionCompleteOtp] = useState(false);
  const [sessonOtpCode, setSessionOtpCode] = useState("");
  const [completeData, setCompleteData] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  const initialState = {
    fName: "",
    lName: "",
    pass: "",
    address: "",
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
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
   /*  signIn("credentials", {
      mobile: mobile,
      redirect: false,
      callbackUrl: "/",
    });  */
    setLoginLoading(true)
     axios
    .post(
      `${Environment.baseURL}/api/Auth/logInWithOTP?mobile=${mobile}`,
      {
      },
      {
        headers: {
          langCode:code,
          webOrMob:2

        },
      }
    )
    .then((response) => {
    if(!response.data.success){
      toast.error(response.data.errorMessage)
    }
     else if(response.data.success){
      setLoginLoading(false)
      setSession(response.data)
     }

    })
    .catch((err) => {
      console.log(err);
    }); 
  };
  useEffect(() => {
    if (session?.data.verify == true && session.data.firstTime == false) {
      setSessionLogin(false);
      setSessionOto(true);
    } else if (
      session?.data.verify == false ||
      session?.data.firstTime == true
    ) {
      setSessionLogin(false);
      setSessionCompleteOtp(true);
    }
  }, [session]);
  useEffect(() => {
    if (session?.success == false && session != undefined) {
      toast.error(session?.errorMessage);
    }
  }, [session?.success]);

  function handlerVerify(e) {
    e.preventDefault();
    if (session.data.userOTP == sessonOtpCode) {
      signIn("credentials", {
        mobile: session.data.mobile,
        verify:session.data.verify,
        token:session.data.token,
        addressl:session.data.address,
        iduser:session.data.id,
        firstn:session.data.firstName,
        lastn:session.data.lastName,
        redirect: false,
        callbackUrl: "/",
      });
      router.push("/");
    }
  }

  function handlerVerifyComplete(e) {
    e.preventDefault();
    if (session.data.userOTP == sessonOtpCode) {
      setSessionLogin(false);
      setSessionCompleteOtp(false);
      setCompleteData(true);
    }
  }
  const handleSubmitComplete = (e) => {
    e.preventDefault();
    signIn("credentials", {
      id: session.data.id,
      firstName:formData.fName,
      lastName: formData.lName,
      password: formData.pass,
      address: formData.address,
      redirect: false,
      callbackUrl: "/",
    }); 
    router.push('/')

  };

  
  return (
    <>
      <section className={`${styles.section} ${code=='1'?zain.className:PlaywriteDEGrund.className}`} dir={dir}>
        <Container>
          <Row>
            <Col className={`${styles.login__body}`}>
              <div>
                <h3 className={`${styles.login__title}`}>تسجيل دخول</h3>
                {sessionLogin ? (
                  <Form onSubmit={handleSubmit}>
                    <Form.Group
                      className="mb-4"
                      controlId="exampleForm.ControlInput1"
                    >
                      <Form.Label className={`${styles.label}`}>
                        رقم الهاتف
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder=""
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        className={`${styles.input}`}
                      />
                    </Form.Group>
                    {
                      loginLoading?
                      <button className={`${styles.log__btndisable} mt-2`} type="submit" disabled>
                      تسجيل دخول
                    </button>
                      :
<button className={`${styles.log__btn} mt-2`} type="submit">
                      تسجيل دخول
                    </button>
                    }
                    
                  </Form>
                ) : (
                  ""
                )}
                {sessionOtp ? (
                  <>
                    <div className={`${styles.forgetpass} ${styles.otp} `}>
                      <div className={` ${styles.forgetpass__body} mb-5 `}>
                        <OtpInput
                          value={sessonOtpCode}
                          onChange={setSessionOtpCode}
                          numInputs={6}
                          renderSeparator={""}
                          renderInput={(props) => <input {...props} />}
                        />
                      </div>
                      <button
                        className={styles.log__btn}
                        type="submit"
                        onClick={handlerVerify}
                      >
                        تابع التقدم
                      </button>
                    </div>
                  </>
                ) : (
                  ""
                )}
                {sessionCompleteOtp ? (
                  <>
                    <div className={`${styles.forgetpass} ${styles.otp} `}>
                      <div className={` ${styles.forgetpass__body} mb-5 `}>
                        <OtpInput
                          value={sessonOtpCode}
                          onChange={setSessionOtpCode}
                          numInputs={6}
                          renderSeparator={""}
                          renderInput={(props) => <input {...props} />}
                        />
                      </div>
                      <button
                        className={styles.log__btn}
                        type="submit"
                        onClick={handlerVerifyComplete}
                      >
                        تابع التقدم
                      </button>
                    </div>
                  </>
                ) : (
                  ""
                )}
                {completeData ? (
                  <>
                    <Form onSubmit={handleSubmitComplete}>
                    <Form.Group
                        className="mb-4"
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Label className={`${styles.label}`}>
                          الاسم الاول
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder=""
                          className={`${styles.input}`}
                          name="fName"
                          value={formData.fName}
                          onChange={handleChange}
                        />
                      </Form.Group>
                      <Form.Group
                        className="mb-4"
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Label className={`${styles.label}`}>
                          الاسم الاخير
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder=""
                          className={`${styles.input}`}
                          name="lName"
                          value={formData.lName}
                          onChange={handleChange}
                        />
                      </Form.Group>
                      <Form.Group
                        className="mb-4"
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Label className={`${styles.label}`}>
                          كلمة المرور
                        </Form.Label>
                        <Form.Control
                          type="password"
                          placeholder=""
                          className={`${styles.input}`}
                          name="pass"
                          value={formData.pass}
                          onChange={handleChange}
                        />
                      </Form.Group>
                      <Form.Group
                        className="mb-4"
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Label className={`${styles.label}`}>
                          العنوان
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder=""
                          className={`${styles.input}`}
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                        />
                      </Form.Group>
                      <button className={`${styles.log__btn} mt-2`} type="submit">
                      اضغط لاستكمال بياناتك
                    </button>
                    </Form>
                  </>
                ) : (
                  ""
                )}
              </div>
            </Col>
          </Row>
        </Container>
        <ToastContainer />
      </section>
    </>
  );
};

export default index;
