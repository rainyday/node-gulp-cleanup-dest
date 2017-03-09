import * as chai from 'chai';
import * as path from 'path';
import * as fs from 'fs';
import {File} from 'gulp-util';
import * as del from 'del';
import * as cleanup from '../index';

chai.should();

const dest = path.join(__dirname, 'dest');
const src = path.join(__dirname, 'src');

function touch(p: string) {
    fs.closeSync(fs.openSync(p, 'a'));
}

describe('cleanup()', function() {
    before(function() {
        try { fs.mkdirSync(dest); }
        catch (e) {
            if (e.code !== 'EEXIST') {
                throw e;
            }
        }
        touch(path.join(dest, 'test.js'));
        touch(path.join(dest, 'test2.js'));
        touch(path.join(dest, 'test.html'));
    });

    after(function() {
        return del(dest);
    });

    it('Should only delete files in source pipe.', function(done) {
        let stream = cleanup({
            dest,
            ext: '.js'
        });
        let file = new File({
            cwd: __dirname,
            base: src,
            path: path.join(__dirname, 'src/test.ts'),
            content: new Buffer('let x: number = 1'),
        });
        stream.once('flush', () => {
            try {
                fs.existsSync(path.join(dest, 'test.js')).should.be.true;
                fs.existsSync(path.join(dest, 'test.html')).should.be.true;
                fs.existsSync(path.join(dest, 'test2.js')).should.be.false;
                done();
            } catch (e) {
                done(e);
            }
        });
        stream.write(file);
        stream.resume();
        stream.end();
    });
});