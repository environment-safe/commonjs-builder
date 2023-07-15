#!/usr/bin/env node
import { transformDirectory } from '../src/index.mjs'
import { join } from 'path';
const source = process.argv[2] || './src';
const destination = process.argv[3] || './dist';
if(source === 'init'){
    
}else{
    transformDirectory(
        join(process.cwd(), source), 
        join(process.cwd(), destination)
    );
}