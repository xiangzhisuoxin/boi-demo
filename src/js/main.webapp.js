// 引入style文件
import '../style/main.webapp.scss';
import Vue from 'vue';
import App from './app.vue';

new Vue({
    el: '#app',
    template: '<app></app>',
    components: {
        App
    }
});