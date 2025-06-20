const { defineConfig } = require("@vue/cli-service");
const path = require("path");

module.exports = defineConfig({
  transpileDependencies: true,
  
  // 기본 경로 설정
  publicPath: process.env.VUE_APP_BASE_URL || '/',
  
  // 빌드 설정
  outputDir: 'dist',
  
  // 애셋 경로
  assetsDir: 'assets',
  
  // 소스맵 생성 여부
  productionSourceMap: false,
  
  // 웹팩 설정
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@views': path.resolve(__dirname, 'src/views'),
        '@assets': path.resolve(__dirname, 'src/assets'),
        '@services': path.resolve(__dirname, 'src/services'),
        '@data': path.resolve(__dirname, 'src/data'),
        '@styles': path.resolve(__dirname, 'src/styles')
      }
    }
  },
  
  // 개발 서버 설정
  devServer: {
    port: 8090,
    open: true,
    proxy: {
      // 백엔드 API 프록시 설정 (CORS 우회용)
      '^/api': {
        target: process.env.VUE_APP_API_BASE_URL || 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        logLevel: 'debug',
        onProxyReq: (proxyReq, req, res) => {
          console.log('Proxying request:', req.method, req.url);
        },
        onProxyRes: (proxyRes, req, res) => {
          // CORS 헤더 추가
          proxyRes.headers['Access-Control-Allow-Origin'] = '*';
          proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
          proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With';
          proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
        }
      },
      // Ollama API 프록시 설정
      '^/api/ollama': {
        target: 'http://localhost:11434',
        changeOrigin: true,
        pathRewrite: {
          '^/api/ollama': '/api'
        }
      },
      // Elasticsearch API 프록시 설정
      '^/api/es': {
        target: 'http://localhost:9200',
        changeOrigin: true,
        pathRewrite: {
          '^/api/es': ''
        }
      }
    }
  },
  
  // CSS 관련 설정
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
          @import "@/styles/main.scss";
        `
      }
    }
  }
});