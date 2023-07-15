"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transformDirectory = void 0;
var fs = _interopRequireWildcard(require("fs"));
var _path = require("path");
var _core = require("@babel/core");
var _asyncArrays = require("async-arrays/async-arrays.cjs");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/**
 * A JSON object
 * @typedef { object } JSON
 */

const transformDirectory = async (source, destination) => {
  return new Promise((resolve, reject) => {
    const writtenFiles = [];
    fs.readdir(source, (fileErr, results) => {
      (0, _asyncArrays.forEachEmission)(results, (file, index, done) => {
        fs.readFile((0, _path.join)(source, file), (err, body) => {
          if (err) reject(err);
          (0, _core.transform)(body, {
            plugins: [['@babel/plugin-transform-modules-commonjs'], ['babel-plugin-transform-import-meta'], ['search-and-replace', {
              rules: [{
                search: /\.mjs/,
                replace: '.cjs'
              }, {
                search: /\/src\//,
                replace: '/dist/'
              }]
            }]]
          }, function (transformErr, result) {
            const newFile = (0, _path.join)(destination, file.replace(".cjs", '.cjs'));
            fs.writeFile(newFile, result.code, () => {
              writtenFiles.push(newFile);
              done();
            });
          });
        });
      }, () => {
        resolve(writtenFiles);
      });
    });
  });
};
exports.transformDirectory = transformDirectory;