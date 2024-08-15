const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development', // Puedes cambiar esto a 'production' para la versión final
    entry: './script.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
            {
                test: /\.css$/, // Para procesar archivos CSS
                use: ['style-loader', 'css-loader'], // Usa los loaders style-loader y css-loader
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html', // Tu archivo HTML de entrada
        }),
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        port: 3000,
        open: true, // Esto abrirá automáticamente el navegador
    },
};
