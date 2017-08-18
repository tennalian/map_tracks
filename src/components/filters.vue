<template>
  <div class="filters">
    <div class="date">
      <span>ID</span>
      <select name="user" v-model="id" class="form-control">
        <option
          v-for="user in users"
          :value="user">
            {{user}}
        </option>
      </select>
    </div>
    <div class="date">
      <span>C</span>
      <date-picker v-model="time_from" :config="dtConfig"></date-picker>
    </div>
    <div class="date">
      <span>По</span>
      <date-picker v-model="time_to" :config="dtConfig"></date-picker>
    </div>
    <div class="actions">
      <md-button
        class="md-raised"
        @click.prevent="clearData">
          Очистить
      </md-button>
      <md-button
        class="md-raised md-primary"
        @click.prevent="getData">
          Загрузить
      </md-button>
    </div>
  </div>
</template>

<script>
  const API = {
    track: 'http://gps1.beforydeath.ru:8080/track',
    users: 'http://gps.beforydeath.ru:8080/id'
  }
  export default {
    data () {
      return {
        time_from: "2017-08-15 00:00:00",
        time_to: "2017-08-31 23:59:59",
        id: null,
        users: [],
        dtConfig: {
          format: 'YYYY-MM-DD HH:mm:ss'
        }
      }
    },

    mounted() {
      this.getId();
    },

    methods: {
      getId() {
        const options = {
          method: 'GET',
          redirect: 'error',
          credentials: 'same-origin',
        };

        return fetch(API.users, options)
          .then((resp) => resp.json())
          .then(fetchData => {
            this.users = fetchData.data;
            this.id = _.first(this.users);
         })
         .catch(err => {
            this.users = ['31c91f38-70d0-4041-b2ea-d5beee0a13df'];
            this.id = _.first(this.users);
         })
      },

      getData() {
        const params = {
          id: this.id,
          time_from: moment(this.time_from).format('YYYY-MM-DD HH:mm:ss'),
          time_to: moment(this.time_to).format('YYYY-MM-DD HH:mm:ss'),
          filter: {
            segment: {
              min_points: 20,
              min_accuracy: 25
            },
            extra: {
              distance_from: null,
              distance_to: null,
              second_from: null,
              second_to: null,
              speed_from: null,
              speed_to: 33,
              acceleration_from: -2,
              acceleration_to: 2,
            }
          }
        };

          // "filter":{
          //   "segment":{
          //     "min_points":20,
          //     "min_accuracy":25
          //   },
          //   "extra":{
          //     "distance_from":null,
          //     "distance_to":null,
          //     "second_from":null,
          //     "second_to":null,
          //     "speed_from":null,
          //     "speed_to":33,
          //     "acceleration_from":-2,
          //     "acceleration_to":2
          //   }
          // }


        const options = {
          method: 'POST',
          redirect: 'error',
          credentials: 'same-origin',
          body: JSON.stringify(params)
        };

        return fetch(API.track, options)
         .then((resp) => resp.json())
         .then(fetchData => {
            console.log(fetchData)
            if (!_.isEmpty(fetchData.data)) {
              const points = _.chain(_.cloneDeep(fetchData.data.raw))
                .reject(_.matches({lat: 0, lon: 0}))
                .map(point => _.merge(point, {lng: point.lon}))
                .value();
              this.$root.map.drawPath(points);
            }
         })
         .catch(err => console.log(err))
      },

      clearData() {
        this.$root.map.removePath();
      }
    }
  }
</script>
