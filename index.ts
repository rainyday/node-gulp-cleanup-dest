import * as through from 'through2';
import * as setupDebug from 'debug';
import * as del from 'del';
import * as path from 'path';
import {PluginError} from 'gulp-util';

const debug = setupDebug('gulp-cleanup');

function cleanup(options: CleanupOptions) {

    let files: string[] = [];

    if (typeof options.dest === 'undefined') {
        throw new PluginError('Missing `dest` property in options');
    }
    if (options.ext && !options.ext.match(/\.\w+/i)) {
        throw new PluginError('`ext` option should be in the form of ".ext"');
    }

    return through.obj(function(file, enc, cb) {
        let filePath: string;
        if (file.isDirectory()) { cb(null, file); }
        if (options.ext) {
            filePath = path.join(options.dest, file.relative.replace(/\.\w+$/i, options.ext));
        } else {
            filePath = path.join(options.dest, file.relative);
        }
        if (process.platform === 'win32') {
            filePath = filePath.replace(/\\/g, '/');
        }
        files.push(filePath);
        cb(null, file);
    }, function(cb) {
        debug(files);
        let delPath: string;
        if (options.ext) {
            delPath = path.join(options.dest, '**', `*${options.ext}`);
        } else {
            delPath = path.join(options.dest, '**');
        }
        del(delPath, {
            ignore: files
        }).then(() => cb());
    });
}

interface CleanupOptions {
    dest: string;
    ext?: string;
}

export = cleanup;