import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import styles from "../styles/searchPage.module.css";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import localFont from "next/font/local";
import { LanguageContext } from "@/LanguageContext";
import Card from "@/Component/Global/Card";
import Environment from "@/Environment";
import axios from "axios";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

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

const Search = () => {
  const router = useRouter();
  const { search } = router.query;
  const { translations, lang, dir, code } = useContext(LanguageContext);
  const [productsOfCategoriesLastPage, setProductsOfCategoriesLastPage] = useState();
  const [productsOfSearch, setProductsOfSearch] = useState([]);
  const [selectPage, setSelectPage] = useState(1);
  const [sortOrder, setSortOrder] = useState(""); // State for sort order
  const [loading, setLoading] = useState(true); // State for sort order

  const handleChangePage = (event, value) => {
    setSelectPage(value);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  useEffect(() => {
    axios
      .get(`${Environment.baseURL}/api/ItemTypes/getItems?searchText=${search}&pageNo=${selectPage}&pageSize=20`, {
        headers: {
          "Content-Type": "application/json",
          webOrMob: 2,
        },
      })
      .then((response) => {
        const items = response.data.data.item;

        // Sort items based on the selected sort order
        if (sortOrder === "high-to-low") {
          items.sort((a, b) => b.price - a.price); // Assuming each product has a price property
        } else if (sortOrder === "low-to-high") {
          items.sort((a, b) => a.price - b.price);
        }

        setProductsOfSearch(items);
        setProductsOfCategoriesLastPage(response.data.data.lastPageNo);
        setLoading(false)
      })
      .catch((err) => {
        console.log(err);
      });
  }, [code, selectPage, sortOrder,search]);
  useEffect(() => {
   if(productsOfSearch.length==0){
    setLoading(true)
   }
  }, [productsOfSearch]);
  if (loading) return (
    <>
    <div className={`loader ${PlaywriteDEGrund.className}`}>
    <span>Mehrail PM</span>
    <span>Mehrail PM</span>
   
</div>
</>
  )
  return (
    <section
      className={`${styles.search__sec} ${
        code === "AR" ? zain.className : PlaywriteDEGrund.className
      }`}
      dir={dir}
    >
      <Container>
        <div className={`${styles.search__top}`}>
          <p> {translations.Thereare} {productsOfSearch.length} {translations.productsonthispage}.</p>
          <div className={`${styles.search__sort}`}>
            <span>{translations.Sortbyprice}:</span>
            <FormControl variant="standard" sx={{ m: 1, minWidth: 170 }}>
              <Select
                labelId="sort-select-label"
                id="sort-select"
                value={sortOrder}
                onChange={handleSortChange}
                className={`${styles.input}`}
              >

                <MenuItem value="low-to-high" className={`${styles.input}`}>
                  {translations.Fromhighestpricetolowest}
                </MenuItem>
                <MenuItem value="high-to-low" className={`${styles.input}`}>
                  {translations.Fromlowestpricetohighest}
                </MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
      </Container>
      
      <div className={`${styles.cards__search}`}>
        {
          productsOfSearch.map(prod => (
            <Card key={prod.id} prod={prod} /> // Added key prop for each Card
          ))
        }
      </div>

      <Container>
        <div className="d-flex justify-content-center align-items-center mt-2 pagii">
          <Stack spacing={2}>
            <Pagination
              count={productsOfCategoriesLastPage}
              page={selectPage}
              onChange={handleChangePage}
              variant="outlined"
              shape="rounded"
              color="primary"
            />
          </Stack>
        </div>
      </Container>
    </section>
  );
};

export default Search;