import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import unocss from 'unocss/vite';
import svgr from 'vite-plugin-svgr';
import presetUno from '@unocss/preset-uno';
import presetWebFonts from '@unocss/preset-web-fonts';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    unocss({
      presets: [
        presetUno(),
        presetWebFonts({
          provider: 'google',
          fonts: {
            mono: 'JetBrains Mono',
          },
        }),
      ],
      theme: {
        colors: {
          primary: '#FFD339',
          tertiary: '#F69B24',
          win: '#0ECB81',
          loss: '#E43E53',
          title: '#adabab',
        },
      },
      preflights: [
        {
          getCSS: ({ theme }) => `
          html, body {
            height: 100%;
            font-family: ${theme.fontFamily.mono};
          }
          
          * {
            box-sizing: border-box;
          }

          input, button {
            font-family: ${theme.fontFamily.mono};
          }
          
          body {
            background: #26262c;
          }
          
          .table-row-loading::after {
            content: '';
          }
          `,
        },
      ],
    }),
    svgr(),
  ],
});
