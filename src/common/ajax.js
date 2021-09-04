

function ajax ( url ) {


  return new Promise ( ( res, rej ) => {

    const a = new XMLHttpRequest ()

    a.addEventListener ( 'load', () => res ( a.responseText ) )

    a.open ( 'GET', url )

    a.send ()

  } )


}


export default ajax
