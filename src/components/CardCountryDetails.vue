<template>
  <q-card class="my-card" flat bordered >
    <q-img style="width: 500px; height: 300px;"
        :src="images.imagesCity[0].webformatURL"
    />

    <q-card-section class="flex column ">
      <header class="flex items-center justify-start">
        <q-avatar class="q-mr-sm">
        <img :src="images.imagesFlag[0].webformatURL">
        </q-avatar>
        <p class="text-h5 q-ma-none">{{country.name}}</p>
      </header>
        
      <section class="q-mt-md">
        <p>Continent: <q-badge color="blue">{{ country.continent.name }}</q-badge></p>
        <p>Capital: {{ country.capital }}</p>
        <p>Currency: {{ country.currency }}</p>
        
        <!-- LANGUAGES -->
        <p class="flex">Languages:  
          <ul class="flex q-pa-none q-ma-none">
            {{ country.languages.map(language => language.name).join(', ') }}
          </ul>
        </p>
        
        <!-- STATES  -->
        <section>States: 
          <ul 
          v-if="country.states && country.states.length > 0" 
          class="bg-blue-grey q-px-md q-pt-md q-ma-none rounded-borders"
          style="max-height: 150px; overflow-y: auto;"
          >
            <p v-for="state in country.states" 
            :key="state.code"
            >
                {{ state.name }}
            </p>
          </ul>
          <ul v-else class="bg-blue q-pa-md q-ma-none rounded-borders">
            <p class="q-ma-none">No se encontraron estados</p>
          </ul>
        </section>
      
      </section>
    </q-card-section>

  </q-card>
</template>

<script lang="ts">
import {Vue, Component,Prop} from 'vue-property-decorator'

import {CountryEspec, ImagesCountry} from '../types/types'

@Component
export default class CardCountryDetails extends Vue{

  @Prop({ type: Array, required: true }) public selectedCountry!: CountryEspec[];
  @Prop({type:Object, required:true}) public imagesSelectedCountry!:ImagesCountry

  country = this.selectedCountry[0]
  images=this.imagesSelectedCountry
}
</script>