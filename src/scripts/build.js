'use strict';

const fs = require('fs').promises;
const fsEx = require('fs-extra');
const CleanCSS = require('clean-css');
const ejs = require('ejs');
const minify = require('html-minifier').minify;
const terser = require('terser');

const publicPath = `${__dirname}/../public`;
const cssPath = `${__dirname}/../public/css`;
const ejsPath = `${__dirname}/../views`;
const jsPath = `${__dirname}/../public/js`;
const imgPath = `${__dirname}/../public/img`;
const fontsPath = `${__dirname}/../public/fonts`;
const distPath = `${__dirname}/../../dist`;
const distCssPath = `${__dirname}/../../dist/css`;
const distHtmlPath = `${__dirname}/../../dist`;
const distJsPath = `${__dirname}/../../dist/js`;
const distImgPath = `${__dirname}/../../dist/img`;
const distFontsPath = `${__dirname}/../../dist/fonts`;

class Build {

  constructor() {
    this.timestamp = new Date().getTime();
  }

  async execute() {
    console.info('Starting build...');
    await fs.rm(distPath, { recursive: true, force: true });
    await fs.mkdir(distCssPath, { recursive: true });
    await fs.mkdir(distJsPath, { recursive: true });
    await fs.mkdir(`${distJsPath}/lib`, { recursive: true });
    await this._minifyCss();
    const ejsOutput = await this._compileEjs();
    await this._minifyHtml(ejsOutput);
    await this._minifyJs();
    await this._copyJsLibs();
    await this._copyFonts();
    await this._copyImgs();
  }

  async _minifyCss() {
    const cssFile = await fs.readFile(`${cssPath}/index.css`);
    const output = new CleanCSS().minify(cssFile);
    const fileName = `${distCssPath}/index${this.timestamp}.css`;
    await fs.writeFile(fileName, output.styles);
  }

  async _compileEjs() {
    const data = {
      cssIndex: `index${this.timestamp}.css`,
      jsIndex: `main${this.timestamp}.js`,
      title: 'Dentista em Ouro Preto MG',
      GA: true
    };

    const ejsIndex = `${ejsPath}/index.ejs`;
    return ejs.renderFile(ejsIndex, data);
  }

  async _minifyHtml(htmlData) {
    const options = {
      removeComments: true,
      collapseWhitespace: true
    };

    const fileName = `${distHtmlPath}/index.html`
    const minifiedData = minify(htmlData, options);
    await fs.writeFile(fileName, minifiedData);
  }

  async _minifyJs() {
    const options = { sourceMap: true };
    const jsFile = await fs.readFile(`${jsPath}/main.js`);
    const output = await terser.minify(jsFile.toString(), options);
    const fileName = `${distJsPath}/main${this.timestamp}.js`;
    await fs.writeFile(fileName, output.code);
  }

  async _copyJsLibs() {
    return fsEx.copy(
      `${jsPath}/lib`,
      `${distJsPath}/lib`
    );
  }

  async _copyFonts() {
    return fsEx.copy(fontsPath, distFontsPath);
  }

  async _copyImgs() {
    await fs.copyFile(`${publicPath}/favicon.ico`, `${distPath}/favicon.ico`);
    return fsEx.copy(imgPath, distImgPath);
  }
};

new Build().execute().then(() => {
  console.info('Build finished!');
});