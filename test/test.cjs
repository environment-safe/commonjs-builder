const { chai } = require('@environment-safe/chai');
const { transformDirectory } = require('../dist/index.cjs');
const should = chai.should();

describe('module', ()=>{
    describe('performs a simple test suite', ()=>{
        it('loads', async ()=>{
            should.exist(transformDirectory);
        });
    });
});