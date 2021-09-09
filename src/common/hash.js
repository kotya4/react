

const hash = {  magic ( seed ) {

                  return ( Math.sin ( seed * 123.456 ) + 1 ) / 2

                }
              , hash ( seed ) {

                  return ( this.adorable || this.magic ) ( seed )

                }
              }


export default hash
