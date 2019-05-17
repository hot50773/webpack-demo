const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// const HtmlWebpackPlugin = require('html-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin') // optimize css
const TerserPlugin = require('terser-webpack-plugin') // uglify

// TODO: url-loader, cssnano test
module.exports = {
  // 專案的載入點，執行時將會從index.js 開始執行
  entry: {
    main: ['./src/js/index.js', './src/stylesheets/main.scss']
  },
  // 專案打包後的輸出點，包含輸出檔案的檔案名稱與檔案路徑
  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  // 設定 babel-loader
  module: {
    // module屬性是告訴Webpack啟動時需要執行的模組
    // 其下的rules 屬性是一個物件陣列，每一個物件則代表需要載入Loader的訊息
    rules: [
      {
        // use表示需要使用哪一個Loader
        use: {
          loader: 'babel-loader',
          options: { presets: ['env'] }
        },
        // test是說明哪些檔案需要請babel轉譯，/\.js$/ 是正規表示式(Regular Expression)，表示所有.js結尾的檔案都需要使用babel-loader來編譯
        test: /\.js$/,
        // exclude則是說明有哪些例外情況，這邊放上node_modules 是應為這些node 組建檔案已經支援ES6 不需要babel-loader的幫忙，所以排除
        exclude: /node_modules/
      },
      {
        // css-loader 讓Webpack能夠解析css
        // style-loader 將解析後的css套入到html 的頁面(DOM)中
        // 這兩個Loader 有一個固定的優先順序，要先解析css後才能將解析完成的內容套入至HTML
        // use: ['style-loader', 'css-loader'],
        use: [
          { loader: MiniCssExtractPlugin.loader },
          { loader: 'css-loader' },
          {
            loader: 'postcss-loader',
            options: { plugins: [require('autoprefixer')()] }
          }
        ],
        test: /\.css$/
      },
      {
        use: [
          { loader: MiniCssExtractPlugin.loader },
          { loader: 'css-loader' },
          { loader: 'sass-loader' },
          {
            loader: 'postcss-loader',
            options: { plugins: [require('autoprefixer')()] }
          }
        ],
        test: /\.(scss|sass)$/
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      chunkFilename: 'css/[id].css'
    })
  ],
  optimization: {
    splitChunks: {
      // 設定成 all 時，Webpack就會在打包的過程中在 node_modules 內查看哪些套件最常被使用到
      // 並自動在 dist 資料夾匯出成一個切割套件後的 JS 檔
      // 筆者習慣多設定一個 name 讓輸出的檔名變成 vendor.js
      chunks: 'all',
      name: 'vendor'
    },
    minimizer: [
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          discardComments: { removeAll: true },
          // 避免 cssnano 重新计算 z-index
          safe: true,
          // cssnano 集成了autoprefixer的功能
          // 会使用到autoprefixer进行无关前缀的清理
          // 关闭autoprefixer選項
          // 使用postcss的autoprefixer功能
          autoprefixer: false
        },
        canPrint: true
      }),
      new TerserPlugin()
    ]
  }
}
