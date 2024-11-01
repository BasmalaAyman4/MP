import React, { useContext, useState,useEffect } from 'react'
import { fetchBestSelling, fetchDeals } from './api/api';
import { LanguageContext } from '@/LanguageContext';
import localFont from "next/font/local";
import styles from '../styles/BestSeller.module.css'
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Card from '@/Component/Global/Card';
import { useRouter } from 'next/router';
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
const DealOfDay = ({productsOfDeal,currentPage}) => {
    const router = useRouter();

    const [isLoading, setLoading] = useState(true);
    const { translations, lang, dir, code } = useContext(LanguageContext);
    const [productsOfDeals, setProductsOfDeal] = useState(
        productsOfDeal?.item
      );
      const [productsOfDealLastPage, setProductsOfDealLastPage] = useState(
        productsOfDeal?.lastPageNo
      );
      const [selectPage, setSelectPage] = useState(currentPage);
      const productsPerPage = 20;
      const startProduct = (currentPage - 1) * productsPerPage + 1;
      const endProduct = Math.min(currentPage * productsPerPage, productsOfDeal?.data?.totalProductCount);
      const handleChange = (event, value) => {
        setSelectPage(value);
        router.push(
          `/DealOfDay?page=${value}`
        );
      };
      useEffect(() => {
        if ( currentPage )
            setProductsOfDeal(productsOfDeal?.item);
        setProductsOfDealLastPage(productsOfDeal?.lastPageNo)
        setLoading(false); 
      }, [ currentPage]);
    
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
        {
            isLoading?
            <div className={`loader ${PlaywriteDEGrund.className}`}>
            <span>Mehrail PM</span>
            <span>Mehrail PM</span>
           
        </div>
            :
            <>
            <div className={`${styles.category__cards}`}>
            {productsOfDeals?.map((prod) => (
              <Card prod={prod} />
            ))}
          </div>
           <div className="d-flex justify-content-center align-items-center mt-2 pagii">
           <Stack spacing={2}>
             <Pagination
               count={productsOfDealLastPage}
               page={selectPage}
               onChange={handleChange}
               variant="outlined"
               shape="rounded"
               color="primary"
             />
           </Stack>
         </div>
         </>
        }
      </section>
    </>
  )
}

export default DealOfDay
export async function getServerSideProps(context) {
    const { req, query,locale } = context;
    const selectedLanguage = locale == 'AR' ? '1' : '2';
    const page = query.page ? parseInt(query.page, 10) : 1;
    const productsOfDeal = await fetchDeals(
      selectedLanguage,
      page,
    );
    const propsToInspect = {
        productsOfDeal,
      currentPage: page,
      queryy: query,
    };
    console.log("Props:", propsToInspect);
  
    return {
      props: propsToInspect,
    };
  }