Vue.component('v-autocompleter',{
    templete:'<img src="googleser.svg" class="search-icon"> <input @focus="focused" ref="first" v-model="googleSearch" list="listaMiast" type="text" class="search_input" @keyup.down="goDown()" @keyup.up="goUp()" @keyup.enter="clickEnter" /> <img src="googlekey.png" class="keyboard-icon"> <img src="googlemic.png" class="vs-icon"> <div class="cities"> <li v-for="(city,index) in filteredCities" @click="handleClick(city.name)" :class="{HighBack: index == forPick}"> <img class="glass" src="googleser.svg"> <div class="podpowiedzi" v-html="highlight(city.name)"></div> </li>',
    data: function(){
        return {
            googleSearch: '',
            googleSearch_temp:'',
            isActive: 0,
            cities: window.cities,
            focused: true,
            forPick: -1,
            updated: true,
        }
    },
    watch: {
        forPick: function () {
            this.updated = false;
            this.googleSearch = this.filteredCities[this.forPick].name
            },
        googleSearch: function(){
            if(this.googleSearch.length == 0){
                this.filteredCities='';
            }
            else{
                this.createFilteredList(this.updated);
                this.updated=true;
                if(this.forPick == -1){
                    this.googleSearch_temp = this.googleSearch;
                    this.createFilteredList(true);
                }
            }
        }
        },
    methods: {
      handleClick: function (name) {
        this.googleSearch = name;
        this.isActive();
      },
      highlight: function(phrase) {
        return phrase.replaceAll(this.googleSearch, '<span class="highlight">' + this.googleSearch + '</span>')
      },
      createFilteredList(bool){
          if(bool){
              let result = this.cities.filter(city => city.name.includes(this.googleSearch));
              if(result.length>10){
                  this.filteredCities = result.slice(1,11);
              }
              else{
                  this.filteredCities = result;
              }
              this.forPick = -1;
          }
      },
      switchPage(){
          if(this.isActive==0){
              this.isActive =1;
          }
          else{
              this.googleSearch = '';
              this.isActive = 0;
          }

      },
      handleClick(name){
          this.googleSearch = name;
          this.switchPage();
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
      clickEnter(){
          if(this.forPick != -1){
              this.googleSearch = this.filteredCities[this.forPick].name
              this.forPick = -1;
              this.focused = false;
              this.switchPage();
          }
          else{
              this.switchPage
          }
      }
    },


})
