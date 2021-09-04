import React from 'react'
import './LoveHate.css'







class LoveHate extends React.Component {

  constructor ( props ) {

    super ( props )

    this.state = {

      lovehate : 0

    }

    this.iid = null

  }


  componentDidMount () {

    this.iid = setInterval ( () => this.setState ( { lovehate : this.state.lovehate + 1 & 1 } ), 500 )

  }


  componentWillUnmount () {

    clearInterval ( this.iid )

  }


  render () {

    return  ( <span className="lovehate">

                { this.state.lovehate ? '♥' : '💔' }

              </span> )

  }

}


export default LoveHate
