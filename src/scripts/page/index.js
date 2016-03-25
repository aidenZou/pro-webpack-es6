import Vue from 'vue'
import App from '../../components/Index.vue'
import {name} from '../util/data'
import Fun from '../util/fun'

new Vue({
  el: 'body',
  components: {App},
  created: function() {
    console.log('index run...')
    Fun.fun(name)
  }
})
