<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <!-- TOGGLE BUTTON -->
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <!-- DARK MODE -->
        <q-toolbar-title>
          <DarkMode @dark-mode="handleDarkModeToggle"/>
        </q-toolbar-title>

        <!-- FILTER BY COUNTRIES -->
        <q-input :dark="!isDarkMode" dense standout v-model="text" input-class="text-right" class="q-ml-md"  @click="toggleContinentContainer" >
          <template v-slot:append>
            <q-icon v-if="text === ''" name="search" />
            <q-icon v-else name="clear" class="cursor-pointer" @click="text = ''" />
          </template>
        </q-input>

        <!-- FILTER BY CONTINENTS -->
        <div class="continent-container" 
          :class="{ 'q-dark-container': isDarkMode }" 
          v-show="showContinentContainer" >
          <q-btn
            v-for="continent in continents"
            :key="continent"
            @click="selectContinent(continent)"
            :color="isSelected(continent)? 'positive' : 'primary'"
          >
            {{ continent }}
          </q-btn>
        </div>

      </q-toolbar>
    </q-header>

    <!-- LIST OG LINKS ================================ -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          Essential Links
        </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
          @close-sidebar="handleCloseSidebar"
          @click="handleCloseSidebar"
        />
      </q-list>
    </q-drawer>

    <!-- PAGES ====================================== -->
    <q-page-container @click="handlePageContainerClick">
      <router-view :text="text" 
      :selected-continents="selectedContinents"/>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">

import { Vue, Component } from 'vue-property-decorator';
import EssentialLink from 'components/EssentialLink.vue';
import DarkMode from 'components/DarkMode.vue'

const linksData = [
  {
    title: 'Countries',
    caption: 'All countries in one place',
    icon: 'code',
    link:'/'
  },
  {
    title: 'Page 2',
    caption: 'this is the content of page 2',
    icon: 'code',
    link: 'page2'
  },
  {
    title: 'Page 3',
    caption: 'this is the content pf page 3',
    icon: 'code',
    link:'page3'
  }
];

@Component({
  components: { EssentialLink, DarkMode }
})
export default class MainLayout extends Vue {
  //drawer
  leftDrawerOpen = false
  essentialLinks = linksData
  //boton darkmode
  isDarkMode = false
  //input filter countries
  text =''
  //filter continents
  showContinentContainer = false
  selectedContinents: string[] =[]
  continents = ['Asia', 'Europe', 'Africa', 'North America', 'South America', 'Oceania']
   //cerrar sidebar
  handleCloseSidebar(){
    this.leftDrawerOpen = false;
  }
  //boton para darkmode
  handleDarkModeToggle(newDarkModeValue: boolean) {
    this.isDarkMode = newDarkModeValue;
  }

  //array de continentes
  selectContinent(continent: string) {
  const index = this.selectedContinents.indexOf(continent);

  if (index === -1) {
    this.selectedContinents.push(continent);
    } else {
    this.selectedContinents.splice(index, 1);
    }
  }
  //color dinamico
  isSelected(continent:string) {
    return this.selectedContinents.includes(continent);
  }
  //cerrar div de continentes
  toggleContinentContainer(){
      this.showContinentContainer = !this.showContinentContainer;
    }
  handlePageContainerClick(){
    if (this.showContinentContainer) {
      this.showContinentContainer = false
    }
  }

}

</script>


<style scoped>
.continent-container {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #fff;
  border: 1px solid #ccc;
  padding: 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center; 
  align-items: flex-end;
  gap: 10px 1.5rem ; 
  z-index: 100;

}
.q-dark-container{
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #121212;
  border: 1px solid #555;
  padding: 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center; 
  align-items: flex-end;
  gap: 10px 1.5rem ; 
  z-index: 100;

}
</style>