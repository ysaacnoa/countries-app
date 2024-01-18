<template>
  <q-card>
    <q-img style="width: 350px; height: 250px;"
    :src="images.imagesCity[0].webformatURL"
    />

    <q-card-section class="flex items-center q-pa-sm">
      <q-avatar class="q-mr-sm">
        <img 
        :src="images.imagesFlag[0].webformatURL">
      </q-avatar>
      <div>
        <p class="text-h6 q-ma-none">{{country.name}}</p>
      </div>
    </q-card-section>

    <q-card-actions class="q-pa-sm " align="right">
      <q-btn flat color="white" class="bg-primary" label="Details" @click="showDetails"/>
    </q-card-actions>
  </q-card>
</template>

<script lang="ts">

import { Vue, Component, Prop } from  'vue-property-decorator'
//types
import {Country} from '../types/types'
//API
import apolloProvider from 'src/services/apollo';
import { GET_COUNTRY_BY_NAME } from '../graphql/country'
import { CountryEspec, ImagesCountry} from '../types/types'

@Component
export default class CardCountry extends Vue{
  @Prop({type:Object, required:true}) public country!:Country
  @Prop({type:Object, required:true}) public images!:ImagesCountry
  async showDetails(){

    const client = apolloProvider.defaultClient

    try {
      const response :{ data: { countries: CountryEspec } }= await client.query({
        query: GET_COUNTRY_BY_NAME.query,
        variables: { name: this.country.name }
      });
      //mandamos el valor al index
      this.$emit('show-details', response.data.countries, this.images);
      console.log(response.data.countries);
      
    } catch (error) {
      console.error('No se pudo obtener detalles del país: ', error);
    }
    
  }

}
</script>