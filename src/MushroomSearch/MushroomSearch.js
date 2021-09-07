import React, { useState, useRef, useEffect, Children, cloneElement, useCallback } from 'react'

import styles from './MushroomSearch.module.sass'

// import axi from '../images/axi.png'

















const Stuff = ( { emoji, font_size, can_be_rotated, type } ) => {

  const fontSize = font_size + 'em'
  const zIndex = type === 'leaf' ? 1 : 0
  const transform = `scaleX( ${ Math.sign ( Math.random () - 0.5 ) } ) rotate( ${ can_be_rotated ? Math.random () * 360 | 0 : 0 }deg )`

  return  ( <div  className={ styles.Emoji }
                  style={ { transform, zIndex, fontSize } }>
              {
                emoji
              }
            </div> )

}









const Grabbable = ( { children, parent, x, y, dispawnable=false, handle_pos=null } ) => {

  const [ transition, transition__set ] = useState ( 0 ) // speed of transition, related to interval_speed

  const [ dispawned, _ ] = useState ( false )

  const [ grabbed, grabbed__set ] = useState ( false )

  const [ pos_x, pos_x__set ] = useState ( x )
  const [ pos_y, pos_y__set ] = useState ( y )

  const [ down_x_offset, down_x_offset__set ] = useState ( 0 ) // when grabbed, offset between element origin and mouse position
  const [ down_y_offset, down_y_offset__set ] = useState ( 0 )

  const handle_move = useCallback ( onmove, [ down_x_offset, down_y_offset, grabbed ] )
  const handle_up   = useCallback ( onup, [] )
  const handle_down = useCallback ( ondown, [ parent ] )

  const speed = 55
  const interval_speed = 1000

  useEffect( () => {

    if ( ! parent ) return

    const { height } = parent.getBoundingClientRect ()

    let interval_id = null

    if ( pos_y > height / 2 ) { // если pos_y больше height / 2 тогда вызывается Treasure->handle_pos

      handle_pos && handle_pos ()

    } else if ( ! grabbed && ! dispawned ) {

      transition__set ( interval_speed / 1000 )

      interval_id = setInterval ( () => {

        pos_y__set ( v => v + speed )

      }, interval_speed )

    } else {

      transition__set ( 0 )

      parent.addEventListener ( 'mousemove', handle_move )
      parent.addEventListener ( 'mouseup', handle_up )
      parent.addEventListener ( 'mouseleave', handle_up )
      parent.addEventListener ( 'touchmove', handle_move )
      parent.addEventListener ( 'touchend', handle_up )
      parent.addEventListener ( 'touchcancel', handle_up )

    }

    return () => {

      clearInterval ( interval_id )

      parent.removeEventListener ( 'mousemove', handle_move )
      parent.removeEventListener ( 'mouseup', handle_up )
      parent.removeEventListener ( 'mouseleave', handle_up )
      parent.removeEventListener ( 'touchmove', handle_move )
      parent.removeEventListener ( 'touchend', handle_up )
      parent.removeEventListener ( 'touchcancel', handle_up )

    }

  }, [ parent, grabbed, dispawned, handle_move, handle_up ] )

  const left = pos_x + 'px'
  const top = pos_y + 'px'

  return  ( <div  className={ styles.Grabbable }
                  onMouseDown={ handle_down }
                  onTouchStart={ handle_down }
                  style={ { left, top, transitionDuration: `${ transition }s` } }>
              {
                children
              }
            </div> )




  function onmove ( e ) {
    e.preventDefault ()

    if ( ! grabbed ) return

    const move_x = e.clientX || e.touches[ 0 ].clientX
    const move_y = e.clientY || e.touches[ 0 ].clientY

    pos_x__set ( move_x - down_x_offset )
    pos_y__set ( move_y - down_y_offset )

  }



  function onup ( e ) {
    e.preventDefault ()

    grabbed__set ( false )

  }


  function ondown ( e ) {
    e.preventDefault ()

    grabbed__set ( true )

    const down_x = e.clientX || e.touches[ 0 ].clientX
    const down_y = e.clientY || e.touches[ 0 ].clientY

    const { x, y } = e.target.getBoundingClientRect ()

    const { x: px, y: py } = parent.getBoundingClientRect ()

    down_x_offset__set ( down_x - x + px )
    down_y_offset__set ( down_y - y + py )

  }


}






const Treasure = ( { parent } ) => {

  const stuff = [
    { name: 'fallen leaf',             emoji: '🍂', font_size: 3.0, can_be_rotated: true,  type: 'leaf'     },
    { name: 'leaf fluttering in wind', emoji: '🍃', font_size: 3.5, can_be_rotated: false, type: 'leaf'     },
    { name: 'Four Leaf Clover',        emoji: '🍀', font_size: 3.0, can_be_rotated: true,  type: 'leaf'     },
    { name: 'Herb',                    emoji: '🌿', font_size: 3.0, can_be_rotated: false, type: 'leaf'     },
    { name: 'Maple Leaf',              emoji: '🍁', font_size: 3.0, can_be_rotated: true,  type: 'leaf'     },
    { name: 'Shamrock',                emoji: '☘', font_size: 5.0, can_be_rotated: false, type: 'leaf'     },
    { name: 'mushroom',                emoji: '🍄', font_size: 1.5, can_be_rotated: false, type: 'mushroom' },
    { name: 'bug',                     emoji: '🐛', font_size: 1.5, can_be_rotated: false, type: 'bug'      },
    { name: 'Ant',                     emoji: '🐜', font_size: 1.5, can_be_rotated: false, type: 'bug'      },
    { name: 'Honeybee',                emoji: '🐝', font_size: 1.5, can_be_rotated: false, type: 'bug'      },
    { name: 'Lady Beetle',             emoji: '🐞', font_size: 1.5, can_be_rotated: false, type: 'bug'      },
  ]

  const mushes = stuff.filter ( ( { type } ) => type === 'mushroom' )
  const leafs = stuff.filter ( ( { type } ) => type === 'leaf' )
  const bugs = stuff.filter ( ( { type } ) => type === 'bug' )

  const { width } = parent.getBoundingClientRect ()

  // const [ [ x, y ], pos__set ] = useState ( [ Math.random () * width, Math.random () * height ] )
  const [ [ x, y ], pos__set ] = useState ( [ Math.random () * width, 0 ] )

  const margin_x = width * 0.2

  const handle_pos = () => {

    pos__set ( [ margin_x + Math.random () * ( width - margin_x * 2 ), 0 ] )

  }

  // console.log ( 'Treasure', x, y )

  return  [ [ <Stuff { ... _choice ( leafs ) } />, { x, y } ]
          , [ <Stuff { ... _choice ( _choice ( [ bugs, mushes ] ) ) } />, { x, y, handle_pos } ]
          ].map ( ( [ stuff, props ], i ) => <Grabbable key={ i } parent={ parent } { ...props }>{ stuff }</Grabbable> )

  function _choice ( a ) {

    return a[ a.length * Math.random () | 0 ]

  }


}








const TreasureContainer = ( { children } ) => {

  const [ ref_loaded, ref_loaded__set ] = useState ( false )

  const ref = useRef ( null )

  useEffect( () => {

    if ( ref.current ) {

      ref_loaded__set ( true )

    }

  }, [] )

  console.log ( 'TreasureContainer' )

  return  ( <div  className={ styles.TreasureContainer }
                  ref={ ref }>
              {
                ref_loaded
                  ? Children.map ( children, ( e, i ) => cloneElement ( e, { parent: ref.current } ) )
                  : null
              }
            </div> )

}








const MushroomSearch = () => {

  return  ( <div className={ styles.MushroomSearch }>
              <TreasureContainer>
                {
                  Array ( 1 ) .fill () .map ( ( _, i ) => <Treasure key={ i } /> )
                }
              </TreasureContainer>
            </div> )

}



export default MushroomSearch
