Vue.component('v-autocompleter', {
    template: `
    <div class="vue-autocompleter">
    <input
      ref="first"
      :value="value"
      type="text"
      class="search_input"
      @input="$emit('input', $event.target.value)"
      @keyup.down="goDown"
      @keyup.up="goUp"
      @keyup.enter="clickEnter" />
      <div class="cities">
        <li v-for="(city, index) in filteredCities" v-on:click="handleClick(city.name)" :class="{HighBack: index == forPick}">
          <div class="podpowiedzi" v-on:click="choose(index)" v-html="highlight(city.name)"></div>
        </li>
      </div>
    </div>`,
    /**
     * value - wartość przekazywanej frazy
     * options - lista stworzona ze zmiennej cities
     */
    props: ['value', 'options'],
    data: function(){
        return {
            selected_city: '',
            googleSearch_temp: '',
            updated: true,
            isActive: 0,
            cities: window.cities,
            forPick: -1,
            filteredCities: []
        }
    },
    watch: {
        /**
         * funkcja, która obserwuje przemieszczanie się po liście
         * mimo, że zmieniamy imputa to lista się nie zmienia
         */
        forPick: function () {
            this.updated = false;
            
            if (this.forPick >= 0) {
                this.$emit('input', this.filteredCities[this.forPick].name);
              }
            },
            /**
             * jeśli coś zostanie wpisane do search-boxa to funkcja dostosowywuje wyniki listy
             * obsługuje również przejście po liście i zmienia imput w search-boxie
             */
        value: function(){
            if(this.value.length == 0){
                this.filteredCities = [];
              } else{
                this.updated=true;
        
                if(this.forPick == -1){
                  this.googleSearch_temp = this.value; 
                  this.CreateCities();     
                }
              }
            }
        },
    methods: {
        /**
         * funkcja ogarnicza naszą listę miast do 10, każde miasto zawiera w sobie wpisaną frazę 
         */
      CreateCities(){
          let result = this.cities.filter(city => city.name.includes(this.value));
          if(result.length > 10){
            this.filteredCities = result.slice(1, 11);
          }
          else{
            this.filteredCities = result;
          }
        this.forPick = -1;
    },
    /**
     * funckja po kliknięciu nazwy wystawia event
     * @param {nazwa miasta} name 
     */
      handleClick(name) {
        this.$emit('input', this.value);
        this.clickEnter();
      },
      /**
       * Funckja wystawia event po wybraniu miasta o i indeksie z listy
       * @param {indeks z listy} i 
       */
      choose(i){
        this.$emit('input', this.filteredCities[i].name);
    },
    /**
     * funkcja odpowiada za wyboldowanie części nazwy miasta, która nie została wpisana do search-boxa
     * a znajduje się w nazwie miasta
     * @param {wpisana fraza} phrase 
     * @returns 
     */
      highlight: function(phrase) {
        return phrase.replaceAll(this.value, '<span class="highlight">' + this.value + '</span>')
      },
      /**
       * obsługuje przechodzenie w dół po liście za pomocą strzalek z klawiatury
       */
      goDown(){
        if(this.forPick < this.filteredCities.length -1){
            this.forPick +=1;
        }
        else if(this.forPick == this.filteredCities.length -1){
            this.forPick = -1;
        }
        },
        /**
         * obsługuje przechodzenie w górę po liście za pomocą strzałek z klawiatury
         */
      goUp(){
       if(this.forPick > -1){
           this.forPick -= 1;
       }
       else if(this.forPick == 0){
           this.forPick = this.filteredCities.length -1;
       }
      },
      /**
       * Funkcja obsługuje naciśnięcie enter, które skutuje wystawieniem eventu po wybraniu miasta z listy
       * @param {event} event 
       */
      clickEnter: function(event){
        if(event) {
            this.CreateCities();
            this.forPick = -1;
          }
          this.$emit('enter', this.value);
          this.isActive = 1;
      }
    },


})
