
class ClientStorage {

  constructor ( namespace=null, password=null, parent=window ) {

    if ( ! namespace ) throw Error ( 'namespace cannot be null' )

    if ( ! password ) throw Error ( 'password cannot be null' )

    this.s = parent.localStorage
    const json = this.s.getItem ( namespace )
    this.o = json
                ? JSON.parse ( json )
                : {}

    if ( 'password' in this.o /* 'no password' !== this.get ( 'password', 'no password' ) */ ) {

      if ( password !== this.o.password ) throw Error ( 'namespace ' + namespace + ' has password ' + this.o.password + ', not ' + password )

    } else {

      this.set ( 'password', password )

      // this.set  ( 'password'
      //           , ( Math.random () + '' )
      //               .split ( '' )
      //               .map ( e => 'hidemysoul'
      //                               .split ( '' )
                                    // .reduce ( ( [ a, b ], c ) => a.find ( e => e === c )
                                    //                                 ? [ a, b + 1 ]
                                    //                                 : [ [ ...a, c ], b ], [ [], 0 ] )
      //                                  [ ~~e ] ) .join ( '' )
      //           )

      // console.log ( 'new password ' + this.get ( 'password' ) + ' created for space ' + namespace )


    }


    this.needupdate = false
    this.namespace = namespace
    this.periodic_id = null

  }

  get ( key, defaultvalue ) {

    return this.o[ key ] || defaultvalue

  }

  set ( key, value ) {

    this.o[ key ] = value
    this.needupdate = true
    return this

  }

  update () {

    if ( this.needupdate ) {
      this.needupdate = false
      this.s.setItem ( this.namespace, JSON.stringify ( this.o ) )
    }

  }

  periodic_update ( mlsec=1000 ) {

    this.periodic_id = setInterval ( () => {

      this.update ()

    } , mlsec )

  }

}

export default ClientStorage
