/// <reference types="node" />
import * as stream from 'stream';
declare function cleanup(options: cleanup.Options): stream.Transform;
declare namespace cleanup {
    interface Options {
        dest: string;
        ext?: string;
    }
}
export = cleanup;
