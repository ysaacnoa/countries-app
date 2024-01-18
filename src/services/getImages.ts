import {PixabayImage ,ApiResponse} from '../types/types'

const prefix = 'https://pixabay.com/api/'
const API_KEY='40427821-eecd864e644bf269f228f8a85'
//endpoint :`${prefix}?key=${API_KEY}&q=${newName}+${imageType}&image_type=all`
const url = `${prefix}?key=${API_KEY}`

export const getImages = async ( newName: string ):
Promise<{imageCity: PixabayImage[]; imageFlag: PixabayImage[]}>=>{
  const urlCity = `${url}&q=${newName}+city&image_type=all`;
  const urlFlag = `${url}&q=${newName}+flag&image_type=all`;

  try {
    const responseCity = await fetch(urlCity);
    const dataCity = (await responseCity.json()) as ApiResponse;

    const responseFlag = await fetch(urlFlag);
    const dataFlag = (await responseFlag.json()) as ApiResponse;

    // objeto de ambas propiedades
    return {
      imageCity: dataCity.hits,
      imageFlag: dataFlag.hits,
    };

  } catch (error) {
    throw new Error('Error a llamar a la API')
  }
}