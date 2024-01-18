export interface ImagesCountry{
  imagesCity: PixabayImage[],
  imagesFlag: PixabayImage[]
}

interface Continent{
  code: string,
  name:string
}
export interface Country{
  code: string,
  name: string,
  continent: Continent,
  images?: ImagesCountry
}

interface Languages{
  code: string,
  name: string
}

interface States{
  code:string,
  name:string
}

export interface CountryEspec extends Country{
  capital: string,
  currency: string,
  languages: Languages[],
  states: States[],
}

//API PIXABAY
export interface PixabayImage {
  id: number;
  pageURL: string;
  type: string;
  tags: string;
  previewURL: string;
  previewWidth: number;
  previewHeight: number;
  webformatURL: string;
  webformatWidth: number;
  webformatHeight: number;
  largeImageURL: string;
  fullHDURL: string;
  imageURL: string;
  imageWidth: number;
  imageHeight: number;
  imageSize: number;
  views: number;
  downloads: number;
  likes: number;
  comments: number;
  user_id: number;
  user: string;
  userImageURL: string;
}

export interface ApiResponse {
  total: number;
  totalHits: number;
  hits: PixabayImage[];
}