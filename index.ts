import * as through from 'through2';
import * as setupDebug from 'debug';
import * as del from 'del';
import * as path from 'path';
import {PluginError, log} from 'gulp-util';


const debug = setupDebug('gulp-cleanup');

function cleanup(options: cleanup.Options): NodeJS.ReadWriteStream {
    let files: string[] = [];

    if (!options.dest) {
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
        files.push(filePath);
        cb(null, file);
    }, function(cb) {
        let delPath: string;
        if (options.ext) {
            delPath = path.join(options.dest, '**', `*${options.ext}`);
        } else {
            delPath = path.join(options.dest, '**');
        }
        debug(delPath, files);
        del(delPath, {
            ignore: files
        }).then(() => cb()).catch((e: Error) => log(e.message));
    });
}

namespace cleanup {
    export interface Options {
        dest: string;
        ext?: string;
    }
}

export = cleanup;