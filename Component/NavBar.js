import React, { useState, useEffect, useContext } from "react";
import { LanguageContext } from "../LanguageContext";
import { useSession, signOut } from "next-auth/react";
import Environment from "@/Environment";
import Link from "next/link";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Offcanvas from "react-bootstrap/Offcanvas";
import { Col, Row } from "react-bootstrap";
import localFont from "next/font/local";
import axios from "axios";
import { useRouter } from "next/router";
import logo from "../assets/images/logo.png";
import Image from "next/image";
import login from "../assets/images/login.svg";
import cart from "../assets/images/cart.svg";
import search from "../assets/images/search.svg";

import styles from "../styles/navbar.module.css";
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
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Cart from "./Global/Cart";

const NavBar = () => {
  const router = useRouter();
  const { switchLanguage } = useContext(LanguageContext);
  const { translations, lang, dir, code } = useContext(LanguageContext);
  const [langu, setLang] = useState([]);
  const [category, setCategory] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
console.log(dir)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setDropdownOpen(prevState => !prevState);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const handleLanguageChange = (e) => {
    const newLanguage = e;
    router.push(router.asPath, router.asPath, { locale: newLanguage });
    switchLanguage(newLanguage);
  };
  console.log(category);
  useEffect(() => {
    axios
      .get(`${Environment.baseURL}/api/AppOption/getLanguage`, {
        headers: {
          "Content-Type": "application/json",
          webOrMob: 2,
        },
      })
      .then((response) => {
        setLang(response.data.data);
        console.log(response.data.data)
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .get(`${Environment.baseURL}/api/ItemTypes`, {
        headers: {
          "Content-Type": "application/json",
          langCode: code=='AR'?'1':'2',
          webOrMob: 2,
        },
      })
      .then((response) => {
        setCategory(response.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [code]);
  return (
    <>
      {["sm"].map((expand) => (
        <Navbar
          key={expand}
          expand={expand}
          className={`${styles.nav}`}
          dir={dir}
        >
          <Container fluid>
            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-${expand}`}
              aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
              placement="end"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                  Offcanvas
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <div
                  className={` d-flex align-items-center justify-content-start flex-grow-1 pe-5 ${zain.className}`}
                >
                  {langu.map((lan, index) => (
                    <>
                      {code == "AR" && lan.symble == "AR" ? (
                        <div
                          id={`language${index}`}
                          key={lan.code}
                          onClick={() => handleLanguageChange(`${lan.symble}`)}
                          className={` pt-2 lan`}
                        >
                          <span>عربي</span>
                        </div>
                      ) : code == "EN" && lan.symble == "EN" ? (
                        <div
                          id={`language${index}`}
                          key={lan.code}
                            onClick={() => handleLanguageChange(`${lan.symble}`)}
                          className={` pt-2  lan`}
                        >
                          <span>English</span>
                        </div>
                      ) : (
                        <div
                          id={`language${index}`}
                          key={code}
                              onClick={() => handleLanguageChange(`${lan.symble}`)}
                          className={` pt-2 ${
                            code == "AR"
                              ? zain.className
                              : PlaywriteDEGrund.className
                          }`}
                        >
                          <span className={`${styles.lang__name}`}>
                            {lan.name}
                          </span>
                        </div>
                      )}
                    </>
                  ))}
                </div>
                <div
                  className={` d-flex align-items-center justify-content-center flex-grow-1 pe-3 ${
                    code == "1" ? zain.className : PlaywriteDEGrund.className
                  }`}
                >
                  <ul className={`${styles.nav__list}`}>
                    <li className={`${styles.nav__item}`}>
                      <Link href="/" className={`${styles.nav__link}`}>
                       {translations.homee}
                      </Link>
                    </li>
                    <li className={`${styles.nav__item} ${styles.shop}`} aria-describedby={id} onClick={handleClick}>
                      <p className={`${styles.nav__link}`}>
                        {translations.shopee}
                      </p>
                      {
                        isDropdownOpen?
                        <Popover
                      dir={dir}
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
                      <div
                        className={`${styles.dropdowncontent} ${
                          code == "1"
                            ? zain.className
                            : PlaywriteDEGrund.className
                        }`}
                      >
                        <div className={`${styles.column__body}`}>
                          {category.map((cat) => (
                            <Link
                              href={`/${cat.typeId}?page=1&subCategoryId=`}
                              key={cat.typeId}
                              className={
                              `${styles.navlink__category}`
                              }
                            
                            >
                              {cat.typeName}
                            </Link>
                          ))}
                        </div>
                      </div>
                      </Popover>
                      :
                      ''
                      }
                      
                    </li>
                  </ul>

                  <Image
                    alt=""
                    src={logo}
                    quality={100}
                    width={100}
                    height={70}
                    sizes="100vw"
                    className={styles.logo}
                  />
                  <ul className={`${styles.nav__list}`}>
                    <li className={`${styles.nav__item}`}>
                      <Link href="/" className={`${styles.nav__link}`}>
                        {" "}
                        {translations.bestSell}
                      </Link>
                    </li>
                    <li className={`${styles.nav__item}`}>
                      <Link href="/shop" className={`${styles.nav__link}`}>
                        {translations.contact}
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className=" d-flex align-items-center justify-content-end flex-grow-1 pl-5">
                  <Image
                    alt=""
                    src={search}
                    width={30}
                    height={25}
                    className={`${styles.svg}`}
                  />
                  <Link prefetch={false} href={"/Login"}>
                    <Image
                      alt=""
                      src={login}
                      width={30}
                      height={25}
                      className={`${styles.svg}`}
                    />
                  </Link>
                <Cart/>
                </div>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
      ))}
    </>
  );
};

export default NavBar;
