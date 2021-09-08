

const hash = {

  magic ( seed ) {

    return ( Math.sin ( seed * 123.456 ) + 1 ) / 2

  }

}


export default hash
