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
        forPick: function () {
            this.updated = false;
            
            if (this.forPick >= 0) {
                this.$emit('input', this.filteredCities[this.forPick].name);
              }
            },
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
      handleClick(name) {
        this.$emit('input', this.value);
        this.clickEnter();
      },
      choose(i){
        this.$emit('input', this.filteredCities[i].name);
    },
      highlight: function(phrase) {
        return phrase.replaceAll(this.value, '<span class="highlight">' + this.value + '</span>')
      },
      goDown(){
        if(this.forPick < this.filteredCities.length -1){
            this.forPick +=1;
        }
        else if(this.forPick == this.filteredCities.length -1){
            this.forPick = -1;
        }
        },
      goUp(){
       if(this.forPick > -1){
           this.forPick -= 1;
       }
       else if(this.forPick == 0){
           this.forPick = this.filteredCities.length -1;
       }
      },
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
