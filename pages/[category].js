import React, { useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { fetchAllSubCategory, fetchProductsBasedOnCategory } from "./api/api";
import { parse } from "cookie";
import { Col, Container, Row } from "react-bootstrap";
import styles from "../styles/category.module.css";
import Image from "next/image";
import { LanguageContext } from "../LanguageContext";
import Card from "@/Component/Global/Card";
import axios from "axios";

import { ToastContainer } from "react-toastify";
import noItem from "../assets/images/Logoo.png";
import Environment from "@/Environment";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import noimgg from "../assets/images/Logoo.png";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import ViewCompactIcon from "@mui/icons-material/ViewCompact";
import ViewListIcon from "@mui/icons-material/ViewList";
import Popover from "@mui/material/Popover";
import localFont from "next/font/local";
import Checkbox from "@mui/material/Checkbox";
import Slider from "@mui/material/Slider";
import ListCard from "@/Component/Global/ListCard";
import { Box, Typography } from "@mui/material";
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
const CategoryPage = ({
  productsOfCategory,
  lastPage,
  currentPage,
  queryy,
}) => {
  const router = useRouter();
  const { category } = router.query;
  const [isLoading, setLoading] = useState(true);
  const { translations, lang, dir, code } = useContext(LanguageContext);
  const [productsOfCategories, setProductsOfCategories] = useState(
    productsOfCategory.data.item
  );
  const [productsOfCategoriesLastPage, setProductsOfCategoriesLastPage] = useState(
    productsOfCategory.data.lastPageNo
  );
  const [selectPage, setSelectPage] = useState(currentPage);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [advancedsubCategory, setAdvancedSubCategory] = useState([]);
  const [advancedColor, setAdvancedColor] = useState([]);
  const [advancedSize, setAdvancedSize] = useState([]);
  const [advancedMinPrice, setAdvancedMinPrice] = useState();
  const [advancedMaxPrice, setAdvancedMaxPrice] = useState();
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedFilterSubCategory, setFilterSubCategory] = useState([]);
  const [prodName, setProdName] = useState("");
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [price, setPrice] = useState(5000);
  const [selectedOption, setSelectedOption] = useState(null);
  const[LoadingAdvancedProd,setLoadingAdvancedProd]=useState(false)
  const[gridOrList,setGridOrList]=useState('grid')
  const productsPerPage = 20;
  const startProduct = (currentPage - 1) * productsPerPage + 1;
  const endProduct = Math.min(currentPage * productsPerPage, productsOfCategory.data.totalProductCount);
  const handleClick = () => {
    if (isDropdownOpen) {
      setDropdownOpen(false);
    } else {
      setDropdownOpen(true);
    }
  };
  useEffect(() => {
    axios
      .get(
        `${
          Environment.baseURL
        }/api/AdvancedSearch/getBasicData?categoryId=${category}&subCategoryId=${
          selectedSubCategory ? selectedSubCategory : ""
        }`,
        {
          headers: {
            "Content-Type": "application/json",
            webOrMob: 2,
            langCode: code == 'AR' ? '1' : '2'
          },
        }
      )
      .then((response) => {
        if (response.status == 200) {
          const advance = response.data.data.find(
            (item) => item.id == category
          );
          setProdName(advance.name);
          setAdvancedSubCategory(advance?.subCategories);
          setAdvancedColor(advance?.colors);
          setAdvancedSize(advance?.sizes);
          setAdvancedMinPrice(advance?.priceRange?.minPrice);
          setAdvancedMaxPrice(advance?.priceRange?.maxPrice);
          setSelectPage(currentPage)
        }
        setProductsOfCategories(productsOfCategory.data.item);
        setProductsOfCategoriesLastPage(productsOfCategory.data.lastPageNo)
      })
      .catch((err) => {
        console.log(err);
      });
  }, [selectedSubCategory, category, currentPage, productsOfCategory]);

  const handleColorSelect = (colorId) => {
    if (selectedColors.includes(colorId)) {
      setSelectedColors(selectedColors.filter((id) => id !== colorId));
    } else {
      setSelectedColors([...selectedColors, colorId]);
    }
  };
  const handleSubCategoriesSelect = (SubCatId) => {
    if (selectedFilterSubCategory.includes(SubCatId)) {
      setFilterSubCategory(
        selectedFilterSubCategory.filter((id) => id !== SubCatId)
      );
    } else {
      setFilterSubCategory([...selectedFilterSubCategory, SubCatId]);
    }
  };
  const handleSizeSelect = (sizeId) => {
    if (selectedSizes.includes(sizeId)) {
      setSelectedSizes(selectedSizes.filter((id) => id !== sizeId));
    } else {
      setSelectedSizes([...selectedSizes, sizeId]);
    }
  };
  const handleChange = (event, value) => {
    setSelectPage(value);
    router.push(
      `/${category}?page=${value}&subCategoryId=${selectedSubCategory}`
    );
  };
  useEffect(() => {
    if (category || currentPage || selectedSubCategory)
      setProductsOfCategories(productsOfCategory.data.item);
    setProductsOfCategoriesLastPage(productsOfCategory.data.lastPageNo)
    console.log(productsOfCategory.data.item);
    setLoading(false); 
  }, [category, currentPage, selectedSubCategory]);

 

  const handleSliderChange = (event, newValue) => {
    setPrice(newValue);
  };

  const handleChangePricing = (event) => {
    if (event.target.value == "high") {
      setSelectedOption(true);
    } else {
      setSelectedOption(false);
    }
  };
  const clearFilter = () => {
    setSelectedSizes([]);
    setFilterSubCategory([]);
    setSelectedColors([]);
    setPrice(advancedMaxPrice);
    setSelectedOption(null)
     setProductsOfCategories(
      productsOfCategory.data.item
    );
    setProductsOfCategoriesLastPage(
      productsOfCategory.data.lastPageNo
    );
    setDropdownOpen(false)

  };
  const fetchFilteredProducts = ()=>{
    setLoadingAdvancedProd(true);
    setLoading(true)
    setDropdownOpen(false)
    axios
    .post(
      `${Environment.baseURL}/api/AdvancedSearch/getKokySearch`,
      {
        categoryId: category,
        subCategoryIds: selectedFilterSubCategory ? selectedFilterSubCategory : null,
        colorIds: selectedColors ? selectedColors : null,
        sizeIds: selectedSizes ? selectedSizes : null,
        maxPrice: price ? parseInt(price) : null,
        sortByPrice:selectedOption
      },
      {
        headers: {
          langCode: code == 'AR' ? '1' : '2',
          webOrMob: 2,
        },
      }
    )
    .then((response) => {
      if (response.data.success) {
        setLoadingAdvancedProd(false);
        setProductsOfCategories(response.data.data);
        setProductsOfCategoriesLastPage(response.data.lastPageNo)
        setLoading(false);
      }
    })
    .catch((err) => {
      console.log(err);
      setLoadingAdvancedProd(false);
      setLoading(false);
    });
  }
  console.log(selectedFilterSubCategory,selectedSizes)
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
      <section
        className={`${styles.category} ${
          code == "AR" ? zain.className : PlaywriteDEGrund.className
        }`}
        dir={dir}
      >
        <div className={`${styles.category__top}`}>
          <h2>المنتجات</h2>
          <p>{prodName}</p>
        </div>
        <div>
          <div className={`${styles.category__center}`}>
            <div className={`${styles.filter__body}`} onClick={handleClick}>
              <FilterAltIcon />
              <span>{translations.FilterProducts}</span>
              <hr />
            </div>

            <div className={`${styles.view__body}`}>
              <h6>
                {translations.Showing} {startProduct} - {endProduct} {translations.of} {productsOfCategory.data.totalProductCount}{" "}
                {translations.products}
              </h6>
              <div className="d-flex">
                <div onClick={()=>setGridOrList('grid')}>
                <ViewCompactIcon />
                </div>
                  <div onClick={()=>setGridOrList('list')}>
                <ViewListIcon  />
                </div>
              </div>
            </div>
          </div>
          {isDropdownOpen && (
            <div className={`${styles.popDown}`} dir={dir}>
              <div
                className={`${styles.dropdowncontent} ${
                  code == "1" ? zain.className : PlaywriteDEGrund.className
                }`}
              >
                <Row>
                  <Col>
                    <h5>التصنيف الفرعي</h5>
                    {advancedsubCategory?.map((subCat) => (
                      <div className="checkbox-wrapper" key={subCat.id}>
                        <input
                          type="checkbox"
                          checked={selectedFilterSubCategory.includes(
                            subCat.id
                          )}
                          onChange={() => handleSubCategoriesSelect(subCat.id)}
                          id={subCat.name}
                          className="check"
                        />
                        <label htmlFor={subCat.name} className="label">
                          <svg width="45" height="45" viewBox="0 0 95 95">
                            <rect
                              x="30"
                              y="20"
                              width="50"
                              height="50"
                              stroke="black"
                              fill="none"
                            ></rect>
                            <g transform="translate(0,-952.36222)">
                              <path
                                d="m 56,963 c -102,122 6,9 7,9 17,-5 -66,69 -38,52 122,-77 -7,14 18,4 29,-11 45,-43 23,-4"
                                stroke="black"
                                stroke-width="3"
                                fill="none"
                                className="path1"
                              ></path>
                            </g>
                          </svg>
                          <span className={`${styles.advcolor}`}>
                            {subCat.name}
                          </span>
                        </label>
                      </div>
                    ))}
                  </Col>
                  <Col>
                    <h5> الالوان</h5>
                    {advancedColor?.map((colorr) => (
                      <div className="checkbox-wrapper" key={colorr.id}>
                        <input
                          type="checkbox"
                          checked={selectedColors.includes(colorr.id)}
                          onChange={() => handleColorSelect(colorr.id)}
                          id={colorr.name}
                          className="check"
                        />
                        <label htmlFor={colorr.name} className="label">
                          <svg width="45" height="45" viewBox="0 0 95 95">
                            <rect
                              x="30"
                              y="20"
                              width="50"
                              height="50"
                              stroke="black"
                              fill="none"
                            ></rect>
                            <g transform="translate(0,-952.36222)">
                              <path
                                d="m 56,963 c -102,122 6,9 7,9 17,-5 -66,69 -38,52 122,-77 -7,14 18,4 29,-11 45,-43 23,-4"
                                stroke="black"
                                stroke-width="3"
                                fill="none"
                                className="path1"
                              ></path>
                            </g>
                          </svg>
                          <span className={`${styles.advcolor}`}>
                            {colorr.name}
                          </span>
                        </label>
                      </div>
                    ))}
                  </Col>
                  <Col>
                    <h5> المقاسات</h5>
                    {advancedSize?.map((size) => (
                      <div className="checkbox-wrapper" key={size.id}>
                        <input
                          type="checkbox"
                          checked={selectedSizes.includes(size.id)}
                          onChange={() => handleSizeSelect(size.id)}
                          id={size.name}
                          className="check"
                        />
                        <label htmlFor={size.name} className="label">
                          <svg width="45" height="45" viewBox="0 0 95 95">
                            <rect
                              x="30"
                              y="20"
                              width="50"
                              height="50"
                              stroke="black"
                              fill="none"
                            ></rect>
                            <g transform="translate(0,-952.36222)">
                              <path
                                d="m 56,963 c -102,122 6,9 7,9 17,-5 -66,69 -38,52 122,-77 -7,14 18,4 29,-11 45,-43 23,-4"
                                stroke="black"
                                stroke-width="3"
                                fill="none"
                                className="path1"
                              ></path>
                            </g>
                          </svg>
                          <span className={`${styles.advcolor}`}>
                            {size.name}
                          </span>
                        </label>
                      </div>
                    ))}
                  </Col>
                  <Col>
                    <h5>السعر</h5>
                    <Box>
                    <Slider
                      orientation="vertical"
                      value={price}
                      onChange={handleSliderChange}
                      aria-labelledby="input-slider"
                      valueLabelDisplay="on"
                      defaultValue={advancedMaxPrice}
                      min={advancedMinPrice}
                      max={advancedMaxPrice}
                    />
                     <Box sx={{ display: 'flex', justifyContent: 'space-between',flexDirection:'column' }}>
        <Typography
          variant="body2"
         
          sx={{ cursor: 'pointer' }}
        >
          {advancedMinPrice} EGP
        </Typography>
        
      </Box>
      </Box>
                  </Col>
                  <Col>
                    <h5> ترتيب بواسطة السعر</h5>
                    <div className="checkbox-wrapper">
                      <input
                        type="radio"
                        checked={selectedOption == true}
                        onChange={handleChangePricing}
                        name="pricing"
                        value="high"
                        id="high"
                        className="check"
                      />
                      <label htmlFor="high" className="label">
                        <svg width="45" height="45" viewBox="0 0 95 95">
                          <rect
                            x="30"
                            y="20"
                            width="50"
                            height="50"
                            stroke="black"
                            fill="none"
                          ></rect>
                          <g transform="translate(0,-952.36222)">
                            <path
                              d="m 56,963 c -102,122 6,9 7,9 17,-5 -66,69 -38,52 122,-77 -7,14 18,4 29,-11 45,-43 23,-4"
                              stroke="black"
                              stroke-width="3"
                              fill="none"
                              className="path1"
                            ></path>
                          </g>
                        </svg>
                        <span className={`${styles.advcolor}`}>
                          من الاعلي سعر الي الاقل
                        </span>
                      </label>
                    </div>

                    <div className="checkbox-wrapper">
                      <input
                        type="radio"
                        checked={selectedOption == false}
                        onChange={handleChangePricing}
                        name="pricing"
                        value="low"
                        id="low"
                        className="check"
                      />
                      <label htmlFor="low" className="label">
                        <svg width="45" height="45" viewBox="0 0 95 95">
                          <rect
                            x="30"
                            y="20"
                            width="50"
                            height="50"
                            stroke="black"
                            fill="none"
                          ></rect>
                          <g transform="translate(0,-952.36222)">
                            <path
                              d="m 56,963 c -102,122 6,9 7,9 17,-5 -66,69 -38,52 122,-77 -7,14 18,4 29,-11 45,-43 23,-4"
                              stroke="black"
                              stroke-width="3"
                              fill="none"
                              className="path1"
                            ></path>
                          </g>
                        </svg>
                        <span className={`${styles.advcolor}`}>
                          من الأقل سعر الي الأعلي
                        </span>
                      </label>
                    </div>
                    <div className={`${styles.filter__body__btn}`}>
                    <div>
                    <button className={`${styles.filter__btn}`} onClick={fetchFilteredProducts}>تصفية المنتجات </button>
                    </div>
                    <div>
                    <button  className={`${styles.filter__btn}`} onClick={clearFilter}>  الغاء التصفية </button>
</div>
</div>
                  </Col>
                </Row>
              </div>
            </div>
          )}
          {
            gridOrList=='grid'?

            isLoading || LoadingAdvancedProd?
            <div className={`${styles.loader} ${PlaywriteDEGrund.className}`}>
            <span>Mehrail PM</span>
            <span>Mehrail PM</span>
           
        </div>
            :
            <>
            <div className={`${styles.category__cards}`}>
            {productsOfCategories?.map((prod) => (
              <Card prod={prod} />
            ))}
          </div>
          <div className="d-flex justify-content-center align-items-center mt-2 pagii">
            <Stack spacing={2}>
              <Pagination
                count={productsOfCategoriesLastPage}
                page={selectPage}
                onChange={handleChange}
                variant="outlined"
                shape="rounded"
                color="primary"
              />
            </Stack>
          </div>
          </>
          :
          ''
          }
         {
            gridOrList=='list'?

            isLoading || LoadingAdvancedProd?
            <div className={`${styles.loader} ${PlaywriteDEGrund.className}`}>
            <span>Mehrail PM</span>
            <span>Mehrail PM</span>
           
        </div>
            :
            <>
            <div className={`${styles.cards__list}`}>
            {productsOfCategories?.map((prod) => (
              <ListCard prod={prod} />
            ))}
          </div>
          <div className="d-flex justify-content-center align-items-center mt-2 pagii">
            <Stack spacing={2}>
              <Pagination
                count={productsOfCategoriesLastPage}
                page={selectPage}
                onChange={handleChange}
                variant="outlined"
                shape="rounded"
                color="primary"
              />
            </Stack>
          </div>
          </>
          :
          ''
          }
        </div>
      </section>
    </>
  );
};

export default CategoryPage;

export async function getServerSideProps(context) {
  const { req, query,locale } = context;
  const cookies = parse(req.headers.cookie || "");
  const selectedLanguage = locale == 'AR' ? '1' : '2';
  const mainCategoryCode = query.category;
  const subCategoryId = query.subCategoryId;
  const page = query.page ? parseInt(query.page, 10) : 1;
  const productsOfCategory = await fetchProductsBasedOnCategory(
    selectedLanguage,
    mainCategoryCode,
    page,
    subCategoryId
  );
  const propsToInspect = {
    productsOfCategory,
    currentPage: page,
    queryy: query,
  };
  console.log("Props:", propsToInspect);

  return {
    props: propsToInspect,
  };
}
