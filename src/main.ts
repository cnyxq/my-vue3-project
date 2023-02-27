import { createSSRApp } from 'vue';
import App from './App.vue';
import 'virtual:svg-icons-register';

// import SvgIcon from '@/components/SvgIcon/index';

export function createApp() {
  const app = createSSRApp(App);
  // app.component('SvgIcon', SvgIcon)
  return {
    app
  };
}
