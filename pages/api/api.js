import Environment from "@/Environment";

export async function fetchRecentlyAdded(selectedLanguage) {
    const response = await fetch(`${Environment.baseURL}/api/HomeV2/reacentlyAdded`, {
        headers: {
            'langCode': selectedLanguage,
            webOrMob:2
        }
    }); 
    const data = await response.json()
    return data.data
}
export async function fetchBanner() {
    const response = await fetch(`${Environment.baseURL}/api/Home/homeBanners`);
    const data = await response.json()
    return data.data
}
export async function fetchVideo() {
    const response = await fetch(`${Environment.baseURL}/api/Home/getVideoUrl`);
    const data = await response.json()
    return data.data
}
export async function fetchBestSelling(selectedLanguage,page) {
    const response = await fetch(`${Environment.baseURL}/api/HomeV2/bestSellerWithPagination?pageNo=${page}`, {
        headers: {
            'langCode': selectedLanguage,
            webOrMob:2
        }
    });
    const data = await response.json()
    return data.data
}
export async function fetchAllSubCategory(selectedLanguage, mainCategoryCode) {
    const response = await fetch(`${Environment.baseURL}/api/ItemTypes/getAllSubCategory`, {
        headers: {
            'langCode': selectedLanguage,
            webOrMob:2
        }
    });
    const data = await response.json()
    const filteredData = data.data.filter(item => item.mainCategoryCode == mainCategoryCode);

    return filteredData
}
export async function fetchProductsBasedOnCategory(selectedLanguage, mainCategoryCode,page,subCategoryId) {
    const response = await fetch(`${Environment.baseURL}/api/ItemTypes/getItems?categoryId=${mainCategoryCode}&pageNo=${page}&subCategoryId=${subCategoryId}`, {
        headers: {
            'langCode': selectedLanguage,
            webOrMob:2
        }
    });
    const data = await response.json()

    return data
}
export async function fetchGovernorate(selectedLanguage) {
    const response = await fetch(`${Environment.baseURL}/api/Governorate/getGovernorate
    `, {
        headers: {
            'langCode': selectedLanguage,
            webOrMob:2
        }
    });
    const data = await response.json()

    return data.data
}
export async function fetchPromotion(selectedLanguage) {
    const response = await fetch(`${Environment.baseURL}/api/FlashSaleFront/getFlashSale
    `, {
        headers: {
            'langCode': selectedLanguage,
            webOrMob:2
        }
    });
    const data = await response.json()

    return data.data
}
export const passwordfirebase='wQELkXB/89wrB3&'
