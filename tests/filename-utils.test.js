const assert = require( 'assert' );
const path = require( 'path' );

const { formatTimestamp, uniqueMarkdownPath } = require( '../filename-utils' );
const main = require( 'fs' ).readFileSync( require( 'path' ).join( __dirname, '..', 'main.js' ), 'utf8' );

assert.strictEqual( formatTimestamp( new Date( 2026, 5, 17, 15, 30, 45 )), '2026-06-17_15-30-45' );
assert.strictEqual( formatTimestamp( new Date( 2026, 5, 17, 15, 30, 45 )).includes( ':' ), false );
assert.strictEqual( main.includes( "require( './filename-utils' )" ), false );

function mockFs( existing ) {
    return {
        existsSync( file ) {
            return existing.has( file );
        }
    };
}

const fixedTimestamp = () => '2026-06-17_15-30-45';

{
    const fs = mockFs( new Set() );
    const file = uniqueMarkdownPath( path, fs, 'D:/vault/SimpRead', 'Same Title', fixedTimestamp );
    assert.strictEqual( file, path.resolve( 'D:/vault/SimpRead', 'Same Title.md' ));
}

{
    const existing = new Set([
        path.resolve( 'D:/vault/SimpRead', 'Same Title.md' )
    ]);
    const file = uniqueMarkdownPath( path, mockFs( existing ), 'D:/vault/SimpRead', 'Same Title', fixedTimestamp );
    assert.strictEqual( file, path.resolve( 'D:/vault/SimpRead', 'Same Title-2026-06-17_15-30-45.md' ));
}

{
    const existing = new Set([
        path.resolve( 'D:/vault/SimpRead', 'Same Title.md' ),
        path.resolve( 'D:/vault/SimpRead', 'Same Title-2026-06-17_15-30-45.md' )
    ]);
    const file = uniqueMarkdownPath( path, mockFs( existing ), 'D:/vault/SimpRead', 'Same Title', fixedTimestamp );
    assert.strictEqual( file, path.resolve( 'D:/vault/SimpRead', 'Same Title-2026-06-17_15-30-45-1.md' ));
}

{
    const existing = new Set([
        path.posix.resolve( '/Users/me/Vault/SimpRead', 'Same Title.md' )
    ]);
    const file = uniqueMarkdownPath( path.posix, mockFs( existing ), '/Users/me/Vault/SimpRead', 'Same Title', fixedTimestamp );
    assert.strictEqual( file, path.posix.resolve( '/Users/me/Vault/SimpRead', 'Same Title-2026-06-17_15-30-45.md' ));
}
