import * as fs from 'fs';
import { join } from 'path';
import babel from '@babel/core';
import { transform } from '@babel/core';
import { forEachEmission as forEach } from 'async-arrays/async-arrays.mjs';

/**
 * A JSON object
 * @typedef { object } JSON
 */

export const transformDirectory = async (source, destination)=>{
    return new Promise((resolve, reject)=>{
        const writtenFiles = [];
        fs.readdir(source, (fileErr, results)=>{
            forEach(results, (file, index, done)=>{
                fs.readFile(join(source, file), (err, body)=>{
                    if(err) reject(err);
                    transform(body, {
                        plugins: [
                            ['@babel/plugin-transform-modules-commonjs'],
                            ['babel-plugin-transform-import-meta'],
                            ['search-and-replace', {
                                rules: [
                                    {
                                      search: /\.mjs/,
                                      replace: ".cjs"
                                    },
                                    {
                                      search: /\/src\//,
                                      replace: "/dist/"
                                    }
                                ]
                            }]
                        ]
                    }, function(transformErr, result){
                        const newFile = join(
                            destination, 
                            file.replace('.mjs', '.cjs')
                        );
                        fs.writeFile(newFile, result.code, ()=>{
                            writtenFiles.push(newFile);
                            done();
                        });
                    });
                });
            }, ()=>{
                resolve(writtenFiles);
            });
        });
    });
};