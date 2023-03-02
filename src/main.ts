import { createSSRApp } from 'vue';
import App from './App.vue';
import 'virtual:svg-icons-register';
import * as Pinia from 'pinia';
// import { Get, Post } from '@/utils/http';

// import SvgIcon from '@/components/SvgIcon/index';

export function createApp() {
  const app = createSSRApp(App);
  // app.component('SvgIcon', SvgIcon)
  app.use(Pinia.createPinia());

  // app.config.globalProperties.Get = Get;
  // app.config.globalProperties.Post = Post;

  return {
    app,
    Pinia
  };
}
