function formatTimestamp( date ) {
    const pad = value => ( value < 10 ? '0' : '' ) + value;
    return '' + date.getFullYear() +
        '-' + pad( date.getMonth() + 1 ) +
        '-' + pad( date.getDate() ) +
        '_' + pad( date.getHours() ) +
        '-' + pad( date.getMinutes() ) +
        '-' + pad( date.getSeconds() );
}

function defaultTimestamp() {
    return formatTimestamp( new Date() );
}

function uniqueMarkdownPath( pathUtil, fsUtil, folderPath, title, timestampProvider ) {
    const createTimestamp = timestampProvider || defaultTimestamp,
          baseFile        = pathUtil.resolve( folderPath, title + '.md' );

    if ( !fsUtil.existsSync( baseFile )) return baseFile;

    const timestamp = createTimestamp();
    let idx         = 0,
        file;
    do {
        const suffix = idx == 0 ? timestamp : timestamp + '-' + idx;
        file         = pathUtil.resolve( folderPath, title + '-' + suffix + '.md' );
        idx++;
    } while ( fsUtil.existsSync( file ));
    return file;
}

module.exports = {
    defaultTimestamp,
    formatTimestamp,
    uniqueMarkdownPath
};
