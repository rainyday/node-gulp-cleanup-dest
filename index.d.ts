/// <reference types="node" />
declare function cleanup(options: cleanup.Options): NodeJS.ReadWriteStream;
declare namespace cleanup {
    interface Options {
        dest: string;
        ext?: string;
    }
}
export = cleanup;
