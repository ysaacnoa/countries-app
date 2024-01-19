<template>
  <q-page v-if="loading"><h1>Cargando...</h1></q-page>
  <q-page v-else class="row items-center justify-evenly">

    <!-- PAGINATION =================================== -->
    <article class="pagination-controls q-ma-lg">
      <q-pagination
        v-if="selectedContinents.length === 0"
        v-model="currentPage"
        :max="maxPages"
        direction-links
        boundary-links
        @input="changePage"
      />
      <q-pagination
        v-else
        v-model="currentPageByContinents"
        :max="maxPagesByContinents"
        direction-links
        boundary-links
        @input="changePageByContinents"
      />
    </article>

    <!-- LIST OF COUNTRIES============================= -->
    <section class="q-pa-md row items-center justify-center q-gutter-xl">
      
      <template v-if="imagesLoaded && selectedContinents.length === 0 && searchText===''">
        <CardCountry
        v-for="country in countries"
        :key="country.code"
        :country="country"
        :images="country.images"
        @show-details="showCountryDetails"
        />
      </template>

      <template v-if="imagesLoaded && selectedContinents.length > 0">
        <CardCountry
          v-for="country in displayedCountriesByContinent"
          :key="country.code"
          :country="country"
          :images="country.images"
          @show-details="showCountryDetails"
        />
      </template>

      <template v-if="imagesLoaded && selectedContinents.length === 0">
        <CardCountry
          v-for="country in countriesBySearch"
          :key="country.code"
          :country="country"
          :images="country.images"
          @show-details="showCountryDetails"
        />
      </template>
    </section>


    <!-- MODAL COUNTRY ================================= -->
    <q-dialog v-model="fixed">
      <CardCountryDetails 
      :selected-country="selectedCountry"
      :images-selected-country="imagesSelectedCountry"
      />
    </q-dialog>

  </q-page>
</template>

<script lang="ts">

import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
//components
import CardCountry from 'components/CardCountry.vue';
import CardCountryDetails from 'src/components/CardCountryDetails.vue';
//client
import apolloProvider from 'src/services/apollo.js';
import {PAGINATION_COUNTRY,LIST_COUNTRIES_BY_CONTINENT,COUNTRIES_BY_SEARCH} from '../graphql/country.js'
import {getImages} from '../services/getImages'
//types
import {Country, CountryEspec, ImagesCountry} from '../types/types'

@Component({
  components: { CardCountry, CardCountryDetails}
})
export default class PageIndex extends Vue {  
  
  @Prop({type: String}) public searchText!:string
  @Prop({type: Array}) public selectedContinents!: string[]

  //variables===============================================
  //api graphql
  loading = true
  imagesLoaded = false
  countries : Country[] = []
  countriesByContinents: Country[] = []
  countriesBySearch: Country[] = []
  //countryDetails
  fixed = false
  selectedCountry:CountryEspec[]= []
  imagesSelectedCountry={}


  // Nuevo array con todas las letras del alfabeto
  alphabet = [
  '^A',
  '^B',
  '^C',
  '^[DEF]', 
  '^G',  
  '^[HI]',      
  '^[JK]',     
  '^[LN]',   
  '^M',    
  '^[OPQ]', 
  '^[RT]',   
  '^S',      
  '^[UVWXYZ]'
];
  // Variables para la paginación
  currentPage = 1;
  maxPages = this.alphabet.length;

  // Variables para la paginación por continente
  currentPageByContinents = 1
  maxPagesByContinents = 1;
  itemsPerPage = 15;
  displayedCountriesByContinent:Country[] = []
  //llamada a APIS ===========================================
  
  async created(){
    await this.callCountriesByLetter(this.alphabet[this.currentPage - 1]);
  }

  //paginacion
  async changePage(page: number) {
    if (page >= 1 && page <= this.alphabet.length) {
      this.currentPage = page;
      try {
        await this.callCountriesByLetter(this.alphabet[page - 1]);
      } catch (error) {
        console.error('Error al cambiar de página:', error);
      }
    }
  }

 // Cambia la página por continente
  changePageByContinents(page: number) {
    if (page >= 1 && page <= this.maxPagesByContinents) {
      this.currentPageByContinents = page;
      const start = (page - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      // Actualiza los países a mostrar según la página actual
      this.displayedCountriesByContinent = this.countriesByContinents.slice(start, end);
      }
    }

  //LLAMADA DE PAISES INCIAL
  async callCountriesByLetter(letters:string){
    const client = apolloProvider.defaultClient
    // Define la expresión regular que deseas usar (por ejemplo, "^A" para países que empiezan con A)
    const startsWithRegex = letters;
    try {
      const response = await client.query<{countries:Country[]}>({
        query: PAGINATION_COUNTRY.query,
        variables: { startsWith: startsWithRegex }
      })
      this.countries = response.data.countries
      this.loading = false;

      // Llamada a getImages para cada país
      this.countries= await this.getImagesForCountries(this.countries);
      console.log('Todos los resultados:', this.countries);
    } catch (error) {
      console.error('Error al obtener Paises', error);
      this.loading = false       
    }
  }


  //LLAMADA POR CONTINENTES
  async callCountriesByContinents(continentNames: string[]) {
    const client = apolloProvider.defaultClient;
    // Asegúrate de establecer searchText a nulo antes de la llamada
    try {
      const response = await client.query<{ countries: Country[] }>({
        query: LIST_COUNTRIES_BY_CONTINENT.query,
        variables: { continentCodes: continentNames },
      });

      this.countriesByContinents = response.data.countries;
      this.loading = false;
      
      // Llamada a getImages para cada país
      this.countriesByContinents = await this.getImagesForCountries( this.countriesByContinents);
      this.maxPagesByContinents = Math.ceil(this.countriesByContinents.length / this.itemsPerPage);


      this.imagesLoaded = true;
    } catch (error) {
      console.error('Error al obtener países', error);
      
      this.loading = false;
    }
  }
  //LLAMADA DE PAISES POR BUSQUEDA
  async callCountriesBySearch(searchText:string){
      const client = apolloProvider.defaultClient
      // Define la expresión regular que deseas usar (por ejemplo, "^A" para países que empiezan con A)
      const text = searchText;
      try {
        const response = await client.query<{countries:Country[]}>({
          query: COUNTRIES_BY_SEARCH.query,
          variables: { prefix: text }
        })
        this.countriesBySearch = response.data.countries
        this.loading = false;

        // Llamada a getImages para cada país
        this.countriesBySearch= await this.getImagesForCountries(this.countriesBySearch);
        console.log('Todos los resultados:', this.countriesBySearch);
      } catch (error) {
        console.error('Error al obtener Paises', error);
        this.loading = false       
      }
    }
  //OBTENCION DE IMAGENES
  async getImagesForCountries(countriesToProcess: Country[]){
      // Crea un array de promesas para todas las llamadas a getImages
      const getImagePromises = countriesToProcess.map(async (country) => {
        try {
          const result = await getImages(country.name);

          // Asigna las imágenes al país actual
          (country as CountryEspec).images = {
            imagesCity: result.imageCity || [],
            imagesFlag: result.imageFlag || []
          };

          return country;
        } catch (error) {
          console.error(`Error al llamar a la API de Pixabay para ${country.name}:`, error);
          return null;
        }
      });

      // Esperar a que todas las promesas se resuelvan
      const countriesWithImages = await Promise.all(getImagePromises);
      this.imagesLoaded = true;
      // Filtra los resultados nulos (errores) y actualiza el array countries
      return countriesWithImages.filter((country) => country !== null) as (Country)[];

    }

  //emit de los cards para countryDetails
  showCountryDetails(details: CountryEspec[],images: ImagesCountry) {
    this.imagesSelectedCountry=images
    this.selectedCountry = details
    this.fixed = true
  }
 /*  //filtrado por texto 
  get filteredByCountries() {
    const filter = this.text.toLocaleLowerCase();
    let filteredCountries = this.countries;

    // Filtrar por nombre
    filteredCountries = filteredCountries.filter(country => {
      const countryName = country.name.toLocaleLowerCase();
      return countryName.includes(filter);
    });

    // Filtrar por todos los continentes seleccionados
    if (this.selectedContinents.length > 0) {
      filteredCountries = filteredCountries.filter(country => this.selectedContinents.includes(country.continent.name));
    }

    return filteredCountries;
  } */
  @Watch('selectedContinents')
  async onSelectedContinentsChange(newVal: string[]) {
    if (newVal.length > 0) {
      try {
        // Llama a la función asyncrona pasando selectedContinents como parámetro
        await this.callCountriesByContinents(newVal)
      } catch (error) {
        console.error('Error al llamar a callCountriesByContinents:', error)
        // Puedes agregar lógica adicional para manejar el error si es necesario
      }
    }
  }
  // Watcher para la prop searchText
  @Watch('searchText')
  async onSearchTextChange(newVal: string) {
    console.log(`Valor actual de searchText: ${newVal}`);
    // Agregar la condición para asegurarse de que searchText no esté vacío
    if (newVal.trim() !== '') {
      // Llamar a la función para realizar la consulta GraphQL
      await this.callCountriesBySearch(newVal)
    } else {
      // Realizar alguna acción adicional si el searchText está vacío, por ejemplo, limpiar los resultados
      this.countriesBySearch = []
    }
  }
  //COMPUTADAS ==============================================

/*   //mostrar en base al filtrado
  get displayedCountries() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredByCountries.slice(start, end);
  } */
};

</script>
