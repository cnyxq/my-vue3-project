import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
import imagemin from 'unplugin-imagemin/vite';
import path from 'path';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import vueJsx from '@vitejs/plugin-vue-jsx';

const isProduction = process.env.NODE_ENV === 'production';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni(),
    vueJsx(),
    isProduction ? imagemin() : null,
    createSvgIconsPlugin({
      iconDirs: [path.join(__dirname, 'src/assets/icons')]
    })
  ],
  publicDir: 'assets',
  resolve: {
    alias: {
      '@components': path.join(__dirname, 'src/components'),
      '@images': path.join(__dirname, 'src/assets/images'),
      '@icons': path.join(__dirname, 'src/assets/icons')
    }
  }
});
