const { withDangerousMod, withPlugins } = require( '@expo/config-plugins' )
const fs = require( 'fs' )
const path = require( 'path' )

async function readFile( path ) {
  return fs.promises.readFile( path, 'utf8' )
}

async function saveFile( path, content ) {
  return fs.promises.writeFile( path, content, 'utf8' )
}

module.exports = ( config ) => withPlugins( config, [ ( config ) => {
  return withDangerousMod( config, [
    'ios',
    async ( config ) => {
      const file = path.join( config.modRequest.platformProjectRoot, 'Podfile' )
      /*
       * You need to remove the line before adding it.
       * If you don't do this and you run `expo prebuild` in a dirt project
       * your file will have the same line added twice
       */
      const NEW_LINE = `pod 'RSCrashReporter', :modular_headers => true`
      const contents = ( await readFile( file ) ).replace(
        NEW_LINE,
        ''
      )
      /*
       * Now re-adds the content
       */
      await saveFile( file, `${ contents } \n ${ NEW_LINE }` )
      return config
    }
  ] )
} ] )