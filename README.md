# gulp-cleanup-dest

This module will delete all files that do not match those in current pipeline in `dest` directory.

## Options

* `dest: string`  - Path to destination directory.
* `ext?: string`  - Extension files are given in destination directory. If this is set **only** files matching this extension will be deleted in dest.

## Usage

```javascript
const cleanup = require('gulp-cleanup-dest');
gulp.task(function ts() {
    return gulp.src('src/**/*.ts')
        .pipe(cleanup({
            dest: 'app',
            ext: '.js'
        }))
        .pipe(tsc())
        .pipe(gulp.dest('app'));
});
```