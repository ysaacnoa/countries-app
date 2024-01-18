<template>
  <q-page v-if="loading"><h1>Cargando...</h1></q-page>
  <q-page v-else class="row items-center justify-evenly">

    <!-- PAGINATION =================================== -->
    <article class="pagination-controls q-ma-lg">
      <q-pagination
        v-model="currentPage"
        :max="maxPages"
        direction-links
        boundary-links
        @input="changePage"
      />
    </article>

    <!-- LIST OF COUNTRIES============================= -->
    <section class="q-pa-md row items-center justify-center q-gutter-xl">
      <CardCountry
      v-for="country in displayedCountries"
      :key="country.code"
      :country="country"
      :images="country.images"
      @show-details="showCountryDetails"
      />
    </section>

    <!-- PAGINATION =================================== -->
    <article class="pagination-controls q-ma-lg">
      <q-pagination
        v-model="currentPage"
        :max="maxPages"
        direction-links
        boundary-links
        @input="changePage"
      />
    </article>

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

import { Vue, Component, Prop } from 'vue-property-decorator';
//components
import CardCountry from 'components/CardCountry.vue';
import CardCountryDetails from 'src/components/CardCountryDetails.vue';
//client
import apolloProvider from 'src/services/apollo.js';
import {COUNTRY_NAME} from '../graphql/country.js'
import {getImages} from '../services/getImages'
//types
import {Country, CountryEspec, ImagesCountry} from '../types/types'

@Component({
  components: { CardCountry, CardCountryDetails}
})
export default class PageIndex extends Vue {  
  
  @Prop({type: String}) public text!:string
  @Prop({type: Array}) public selectedContinents!: string[]

  //variables===============================================
  //api graphql
  countries : Country[] = []
  loading = true
  //countryDetails
  fixed = false
  selectedCountry:CountryEspec[]= []
  imagesSelectedCountry={}
  // Variables para la paginación
  currentPage = 1
  itemsPerPage = 20

  //llamada a APIS ===========================================
  async created(){
    const client = apolloProvider.defaultClient

    try {
      const response = await client.query<{countries:Country[]}>(COUNTRY_NAME)
      this.countries = response.data.countries
      this.loading = false;
    } catch (error) {
      console.error('Error al obtener Paises', error);
      this.loading = false       
    }
    // Crea un array de promesas para todas las llamadas a getImages
    const getImagePromises = this.countries.map(async (country) => {
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

    // Filtra los resultados nulos (errores) y actualiza el array countries
    this.countries = countriesWithImages.filter((country) => country !== null) as (Country)[];
    console.log('Todos los resultados:', this.countries);
  }
  //METODOS ====================================================
  //emit de los cards para countryDetails
  showCountryDetails(details: CountryEspec[],images: ImagesCountry) {
    this.imagesSelectedCountry=images
    this.selectedCountry = details
    this.fixed = true
  }
  //paginacion
  changePage(page:number) {
    this.currentPage = page;
  }
  //filtrado por texto 
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
  }
  //COMPUTADAS ==============================================
 get maxPages() {
    return Math.ceil(this.filteredByCountries.length / this.itemsPerPage);
  }
  //mostrar en base al filtrado
  get displayedCountries() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredByCountries.slice(start, end);
  }
};

</script>
