import Card from '@/Component/Global/Card';
import React from 'react'
import styles from '../../styles/Home.module.css'
import Environment from '@/Environment';

export default function Products({ data }) {
    return (
        <>
            <section className={`${styles.newArrival} `}>
                
                   
                    <div className={`${styles.cards}`}>
                        {
                            data?.map(prod => (
                                <Card prod={prod} />

                            ))
                        }
                    </div>
               

            </section>
        </>
    )
}


export async function getStaticProps(context) {
const{locale}=context
    const posts = await fetch(`${Environment.baseURL}/api/ItemTypes/GetItemsByType`, {
        headers: {
            webOrMob: 2,
            'langCode': locale == 'AR' ? '1' : '2'
        }
    });
    const data = await posts.json();
    return { 
        props: { 
        data:data.data 
    } 
}
  }