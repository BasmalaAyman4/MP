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
    
       {/* <Navbar
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
        </Navbar>*/}
      <div className={`${styles.lang__respons} `} >
        {langu.map((lan, index) => (
          <>
            {code == "AR" && lan.symble == "AR" ? (
              <div
                id={`language${index}`}
                key={lan.code}
                onClick={() => handleLanguageChange(`${lan.symble}`)}
                className={`lan`}
              >
                <span>عربي</span>
              </div>
            ) : code == "EN" && lan.symble == "EN" ? (
              <div
                id={`language${index}`}
                key={lan.code}
                onClick={() => handleLanguageChange(`${lan.symble}`)}
                className={`lan`}
              >
                <span>English</span>
              </div>
            ) : (
              <div
                id={`language${index}`}
                key={code}
                onClick={() => handleLanguageChange(`${lan.symble}`)}
                className={`${code == "AR"
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
      <Navbar className={`${styles.nav}`} dir={dir}>

        <Navbar.Brand
          href="/"
          className={` ${PlaywriteDEGrund.className} ${styles.logo__title}`}
        >
          Mehrail PM{" "}

        </Navbar.Brand>
        <Navbar.Offcanvas placement="end">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title className={` ${PlaywriteDEGrund.className}`}>
              Mehrail PM
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            {
              isClient ?
                <div className={` pe-3 ${zain.className} ${styles.first__row}`}>

                  {langu.map((lan, index) => (
                    <>
                      {code == "AR" && lan.symble == "AR" ? (
                        <div
                          id={`language${index}`}
                          key={lan.code}
                          onClick={() => handleLanguageChange(`${lan.symble}`)}
                          className={`lan`}
                        >
                          <span>عربي</span>
                        </div>
                      ) : code == "EN" && lan.symble == "EN" ? (
                        <div
                          id={`language${index}`}
                          key={lan.code}
                          onClick={() => handleLanguageChange(`${lan.symble}`)}
                          className={`lan`}
                        >
                          <span>English</span>
                        </div>
                      ) : (
                        <div
                          id={`language${index}`}
                          key={code}
                          onClick={() => handleLanguageChange(`${lan.symble}`)}
                          className={`${code == "AR"
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
                :
                <div className={` pe-3 ${zain.className} ${styles.first__row}`}>

                  {langu.map((lan, index) => (
                    <>
                      {code == "AR" && lan.symble == "AR" ? (
                        <div
                          id={`language${index}`}
                          key={lan.code}
                          onClick={() => handleLanguageChange(`${lan.symble}`)}
                          className={`lan`}
                        >
                          <span>عربي</span>
                        </div>
                      ) : code == "EN" && lan.symble == "EN" ? (
                        <div
                          id={`language${index}`}
                          key={lan.code}
                          onClick={() => handleLanguageChange(`${lan.symble}`)}
                          className={`lan`}
                        >
                          <span>English</span>
                        </div>
                      ) : (
                        <div
                          id={`language${index}`}
                          key={code}
                          onClick={() => handleLanguageChange(`${lan.symble}`)}
                          className={`${code == "AR"
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
            }

            <div
              className={` pe-3 ${styles.second__row} ${code == "AR" ? zain.className : PlaywriteDEGrund.className
                }`}
            >
              {isClient ? (
                <ul className={`${styles.nav__list}`}>
                  <li className={`${styles.nav__item}`}>
                    <Link href="/" className={`${styles.nav__link}`}>
                      {translations.homee}
                    </Link>
                  </li>
                  <li
                    className={`${styles.nav__item} ${styles.shop}`}
                    aria-describedby={id}
                    onClick={handleClick}
                  >
                    <p className={`${styles.nav__link}`}>
                      {translations.shopee}
                    </p>
                    {isDropdownOpen ? (
                      <Popover
                        dir={dir}
                        id={id}
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "left",
                        }}
                      >
                        <div
                          className={`${styles.dropdowncontent} ${code == "AR"
                              ? zain.className
                              : PlaywriteDEGrund.className
                            }`}
                        >
                          <div className={`${styles.column__body}`}>
                            {category.map((cat) => (
                              <Link
                                href={`/${cat.typeId}?page=1&subCategoryId=`}
                                key={cat.typeId}
                                className={`${styles.navlink__category}`}
                              >
                                {cat.typeName}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </Popover>
                    ) : (
                      ""
                    )}
                  </li>
                </ul>
              ) : (
                ""
              )}

              <Link href="/">
                <Image
                  alt=""
                  src={logo}
                  quality={100}
                  width={100}
                  height={70}
                  sizes="100vw"
                  className={styles.logo}
                />
              </Link>
              {isClient ? (
                <ul className={`${styles.nav__list}`}>
                  <li className={`${styles.nav__item}`}>
                    <Link
                      href="/BestSelling?page=1"
                      className={`${styles.nav__link}`}
                    >
                      {" "}
                      {translations.bestSell}
                    </Link>
                  </li>
                  <li className={`${styles.nav__item}`}>
                    <Link
                      href="/DealOfDay?page=1"
                      className={`${styles.nav__link}`}
                    >
                      {translations.contact}
                    </Link>
                  </li>
                </ul>
              ) : (
                ""
              )}
            </div>

            <div className=" d-flex align-items-center justify-content-end flex-grow-1 pl-5">
              <div className={`${styles.search__body}`}>
                <Image
                  alt=""
                  src={search}
                  width={30}
                  height={25}
                  className={`${styles.svg}`}
                  onClick={toggleMenu}
                />
                {isOpen && (
                  <div
                    className={`${styles.InputContainer} ${isOpen ? styles.open : styles.closed
                      }`}
                    dir={dir}
                  >
                    <input
                      placeholder={`${translations.search}`}
                      id="input"
                      className={styles.input}
                      name="text"
                      type="text"
                      value={serachValue}
                      onChange={(e) => setserachValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                    />
                    <Link href={`/Search?search=${serachValue}`}>
                      <label
                        className={styles.labelforsearch}
                        htmlFor="input"
                      >
                        <svg
                          className={styles.searchIcon}
                          viewBox="0 0 512 512"
                        >
                          <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"></path>
                        </svg>
                      </label>
                    </Link>
                  </div>
                )}
              </div>
              {session?.data2?.token ? (
                <Image
                  alt=""
                  src={logoutimg}
                  width={30}
                  height={30}
                  className={`${styles.svg} mt-1`}
                  onClick={handleSignOut}
                />
              ) : (
                <Link prefetch={false} href={"/Login"}>
                  <Image
                    alt=""
                    src={login}
                    width={30}
                    height={25}
                    className={`${styles.svg}`}
                  />
                </Link>
              )}

              <Cart />
            </div>

          </Offcanvas.Body>
        </Navbar.Offcanvas>

      </Navbar>
      {isClient ? (
        <footer className={`${styles.footer} sticky__foot ${code == "AR" ? zain.className : PlaywriteDEGrund.className
          }`} dir={dir}>
          <Row className={`${styles.footer__row}`}>
            <Col>
              <Link href='/'>
                <Image alt="" src={homeimg} width={30} height={30} />
                <p>{translations.homee}</p>
              </Link>
            </Col>
            <Col onClick={() => setShowResponsive(!showResponsive)}>
              <Image alt="" src={shopimg} width={30} height={30} />
              <p> {translations.shopee}</p>
            </Col>
            <Offcanvas dir={dir} show={showResponsive} onHide={handleCloseResponsive} placement='end' name='end'>
              <Offcanvas.Header closeButton>
                <Offcanvas.Title>{translations.shopee}</Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <div className={`${styles.column__body__responsive}`}>
                  {category.map((cat) => (
                    <Link
                      href={`/${cat.typeId}?page=1&subCategoryId=`}
                      key={cat.typeId}
                      className={`${styles.navlink__category}`}
                      onClick={() => setShowResponsive(false)}
                    >
                      {cat.typeName}
                    </Link>
                  ))}
                </div>
              </Offcanvas.Body>
            </Offcanvas>
            <Col>
              <Link href='/BestSelling?page=1'>
                <Image alt="" src={bestimg} width={30} height={30} />
                <p>{translations.bestSell}</p>
              </Link>
            </Col>
            <Col>
              <Link href='/DealOfDay?page=1'>
                <Image alt="" src={dealimg} width={30} height={30} />
                <p>{translations.contact}</p>
              </Link>
            </Col>
          </Row>
        </footer>
      ) : (
        " "
      )}
      
    </>
  );
};

export default NavBar;
