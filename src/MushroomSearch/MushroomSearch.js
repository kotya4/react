import React, { useState, useRef, useEffect, Children, cloneElement, useCallback } from 'react'

import styles from './MushroomSearch.module.sass'

// import axi from '../images/axi.png'

import hash from '../common/hash.js'















const Stuff = ( { emoji, font_size, can_be_rotated, type, fuck } ) => {

  const fontSize = font_size + 'em'
  const zIndex = type === 'leaf' ? 1 : 0
  const transform = `scaleX( ${ Math.sign ( hash.magic ( fuck ) - 0.5 ) } ) rotate( ${ can_be_rotated ? hash.magic ( fuck ) * 360 | 0 : 0 }deg )`

  return  ( <div  className={ styles.Emoji }
                  style={ { transform, zIndex, fontSize } }>
              {
                emoji
              }
            </div> )

}











const Grabbable = ( { children, parent, x, y, fuck=null, handle_treasure_dispawner=null } ) => {

  const { width } = parent.getBoundingClientRect ()
  const margin_x = width * 0.2

  const [ transition, transition__set ] = useState ( 0 ) // speed of transition, related to interval_delay

  const [ grabbed, grabbed__set ] = useState ( false )

  const [ pos_x, pos_x__set ] = useState ( hash.magic ( fuck ) * ( width - margin_x * 2 ) + margin_x )
  const [ pos_y, pos_y__set ] = useState ( 0 )

  const [ superfuck, superfuck__set ] = useState ( fuck )

  const [ down_x_offset, down_x_offset__set ] = useState ( 0 ) // when grabbed, offset between element origin and mouse position
  const [ down_y_offset, down_y_offset__set ] = useState ( 0 )

  const handle_move = useCallback ( onmove, [ down_x_offset, down_y_offset, grabbed ] )
  const handle_up   = useCallback ( onup, [] )
  const handle_down = useCallback ( ondown, [ parent ] )

  const speed = 55
  const interval_delay = 1000



  useEffect ( () => {

    if ( superfuck !== fuck ) {

      superfuck__set ( fuck )

      pos_x__set ( hash.magic ( fuck ) * ( width - margin_x * 2 ) + margin_x )
      pos_y__set ( 0 )

    }

  }, [ fuck, superfuck ] )


  useEffect ( () => {

    parent.addEventListener ( 'mousemove', handle_move )
    parent.addEventListener ( 'mouseup', handle_up )
    parent.addEventListener ( 'mouseleave', handle_up )
    parent.addEventListener ( 'touchmove', handle_move )
    parent.addEventListener ( 'touchend', handle_up )
    parent.addEventListener ( 'touchcancel', handle_up )

    return () => {

      parent.removeEventListener ( 'mousemove', handle_move )
      parent.removeEventListener ( 'mouseup', handle_up )
      parent.removeEventListener ( 'mouseleave', handle_up )
      parent.removeEventListener ( 'touchmove', handle_move )
      parent.removeEventListener ( 'touchend', handle_up )
      parent.removeEventListener ( 'touchcancel', handle_up )

    }

  }, [ parent, handle_move, handle_up ] )





  useEffect ( () => {

    if ( grabbed ) {

      transition__set ( 0 )

    } else {

      transition__set ( interval_delay / 1000 )

    }

  }, [ grabbed ] )





  useEffect ( () => {

    let interval_id = null

    if ( ! grabbed ) {

      interval_id = setInterval ( () => {

        let new_pos_y = 0
        pos_y__set ( v => new_pos_y = v + speed )

        const { height } = parent.getBoundingClientRect ()

        if ( new_pos_y > height / 1 ) {

          if ( handle_treasure_dispawner ) {

            handle_treasure_dispawner ()

          }

        }

      }, interval_delay )

    }

    return () => {

      clearInterval ( interval_id )

    }

  }, [ grabbed, parent, handle_treasure_dispawner ] )














  const left = pos_x + 'px'
  const top = pos_y + 'px'
  const transitionDuration = `${ transition }s`

  return  ( <div  className={ styles.Grabbable }
                  onMouseDown={ handle_down }
                  onTouchStart={ handle_down }
                  style={ { left, top, transitionDuration } }>
              {
                children
              }
              {
                superfuck
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

  console.log ( 'Treasure' )

  const { width } = parent.getBoundingClientRect ()

  const margin_x = width * 0.2

  // const [ x, x__set ] = useState ( hash.magic ( fuck ) * ( width - margin_x * 2 ) + margin_x )
  // const [ y, y__set ] = useState ( 0 )

  const [ fuck, you ] = useState ( 1 )

  const { mushes, leafs, bugs } = define_stuff ()


  const handle_treasure_dispawned = useCallback ( () => {

    you ( v => v + 1 )

  }, [] )


  const leaf_elements = Array ( fuck ) .fill () .map ( ( _, i ) =>
                                                  <Grabbable  key={ i }
                                                              parent={ parent }
                                                              fuck={ i + 1 }>
                                                    <Stuff { ... _choice ( leafs, i ) } />
                                                  </Grabbable> )

  const treasure_element =  <Grabbable  key={ fuck }
                                        parent={ parent }
                                        fuck={ fuck }
                                        handle_treasure_dispawned={ handle_treasure_dispawned }>
                              <Stuff { ... _choice ( _choice ( [ bugs, mushes ], fuck ), fuck ) } />
                            </Grabbable>

  return [ ...leaf_elements, treasure_element ]






  function define_stuff () {

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

    return { mushes, leafs, bugs }

  }




  function _choice ( a, seed=0 ) {

    return a[ a.length * hash.magic ( seed ) | 0 ]

  }


}










const TreasureContainer = ( { children } ) => {

  console.log ( 'TreasureContainer' )

  const ref = useRef ( null )

  const [ parent, parent__set ] = useState ( null )

  useEffect ( () => {

    if ( ref.current ) {

      parent__set ( ref.current )

    }

  }, [] )



  return  ( <div  className={ styles.TreasureContainer }
                  ref={ ref }>
              {
                parent
                  ? Children.map ( children, ( e, i ) => cloneElement ( e, { parent: parent } ) )
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
