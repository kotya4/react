import React, { useState, useRef, useEffect, Children, cloneElement, useCallback } from 'react'

import styles from './MushroomSearch.module.sass'

import axi from '../images/axi.png'



const Grabbable = ( { children, parent, x, y, spawn_leaf_at } ) => {

  const [ transition, transition__set ] = useState ( 0 )

  const [ is_grabbed, is_grabbed__set ] = useState ( false )
  const [ pos_x, pos_x__set ] = useState ( x )
  const [ pos_y, pos_y__set ] = useState ( y )

  const [ down_x_offset, down_x_offset__set ] = useState ( 0 )
  const [ down_y_offset, down_y_offset__set ] = useState ( 0 )

  const handle_move = useCallback ( onmove, [ down_x_offset, down_y_offset, is_grabbed ] )
  const handle_up   = useCallback ( onup, [] )
  const handle_down = useCallback ( ondown, [ parent ] )

  const speed = 15
  const interval_speed = 1000

  useEffect( () => {

    const { width, height } = parent.getBoundingClientRect ()

    const margin_x = width * 0.2

    let interval_id = null

    if ( ! is_grabbed ) {

      transition__set ( interval_speed / 1000 )

      interval_id = setInterval ( () => {

        pos_y__set ( v => {

          if ( v < height )
            return v + speed

          const new_pos_x = margin_x + Math.random () * ( width - margin_x * 2 )
          const new_pos_y = 0

          pos_x__set ( new_pos_x )

          spawn_leaf_at && spawn_leaf_at ( new_pos_x, new_pos_y )

          return new_pos_y

        } )

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

  }, [ parent, is_grabbed, handle_move, handle_up, spawn_leaf_at ] )

  const left = pos_x + 'px'
  const top = pos_y + 'px'

  return  ( <div  className={ styles.Grabbable }
                  onMouseDown={ handle_down }
                  onTouchStart={ handle_down }
                  style={ { left, top, transitionDuration: `${ transition }s` } }>

              { children }

            </div> )



  function onmove ( e ) {
    e.preventDefault ()

    if ( ! is_grabbed ) return

    const move_x = e.clientX || e.touches[ 0 ].clientX
    const move_y = e.clientY || e.touches[ 0 ].clientY

    pos_x__set ( move_x - down_x_offset )
    pos_y__set ( move_y - down_y_offset )

  }



  function onup ( e ) {
    e.preventDefault ()

    is_grabbed__set ( false )

  }


  function ondown ( e ) {
    e.preventDefault ()

    is_grabbed__set ( true )

    const down_x = e.clientX || e.touches[ 0 ].clientX
    const down_y = e.clientY || e.touches[ 0 ].clientY

    const { x, y } = e.target.getBoundingClientRect ()

    const { x:px, y:py } = parent.getBoundingClientRect ()

    down_x_offset__set ( down_x - x + px )
    down_y_offset__set ( down_y - y + py )

  }


}

















const GrabbableContainer = ( { children } ) => {

  const [ is_loaded, is_loaded__set ] = useState ( false )
  const [ bounding_rect, bounding_rect__set ] = useState ( { width : 0, height: 0 } )

  const ref = useRef ( null )


  useEffect( () => {

    if ( ref.current ) {

      is_loaded__set ( true )
      bounding_rect__set ( ref.current.getBoundingClientRect () )

    }

    return () => {


    }

  }, [] )

  const margin_left = bounding_rect.width * 0.2
  const margin_top = bounding_rect.height * 0.2

  return  ( <div  className={ styles.GrabbableContainer }
                  ref={ ref }>

              { is_loaded
                  ? Children.map ( children, ( e, i ) => cloneElement ( e,  { parent : ref.current
                                                                            , x : margin_left + Math.random () * ( bounding_rect.width - margin_left * 2 )
                                                                            , y : Math.random () * bounding_rect.height
                                                                            } ) )
                  : null
              }

            </div> )

}











const Emoji = ( { emoji, font_size, can_be_rotated, type } ) => {

  return  ( <div  className={ [ styles.Emoji, font_size ].join ( ' ' ) }
                  style={ { transform : `scaleX( ${ Math.sign ( Math.random () - 0.5 ) } ) rotate( ${ can_be_rotated ? Math.random () * 360 | 0 : 0 }deg )`
                          , zIndex : type === 'wheed' ? 1 : 0
                          } }>

              { emoji }

            </div> )

}











const MushroomSearch = () => {

  const emojis = [
    { name: 'fallen leaf',             emoji: '🍂', font_size: styles.EmojiBig,     can_be_rotated: true,  type: 'wheed'    },
    { name: 'leaf fluttering in wind', emoji: '🍃', font_size: styles.EmojiVeryBig, can_be_rotated: false, type: 'wheed'    },
    { name: 'Four Leaf Clover',        emoji: '🍀', font_size: styles.EmojiBig,     can_be_rotated: true,  type: 'wheed'    },
    { name: 'Herb',                    emoji: '🌿', font_size: styles.EmojiBig,     can_be_rotated: false, type: 'wheed'    },
    { name: 'Maple Leaf',              emoji: '🍁', font_size: styles.EmojiBig,     can_be_rotated: true,  type: 'wheed'    },
    { name: 'Shamrock',                emoji: '☘', font_size: styles.EmojiGiant,   can_be_rotated: false, type: 'wheed'    },
    { name: 'mushroom',                emoji: '🍄', font_size: styles.EmojiNormal,  can_be_rotated: false, type: 'mushroom' },
    { name: 'bug',                     emoji: '🐛', font_size: styles.EmojiNormal,  can_be_rotated: false, type: 'bug'      },
    { name: 'Ant',                     emoji: '🐜', font_size: styles.EmojiNormal,  can_be_rotated: false, type: 'bug'      },
    { name: 'Honeybee',                emoji: '🐝', font_size: styles.EmojiNormal,  can_be_rotated: false, type: 'bug'      },
    { name: 'Lady Beetle',             emoji: '🐞', font_size: styles.EmojiNormal,  can_be_rotated: false, type: 'bug'      },
  ]

  const bugs = emojis .filter ( ( { type } ) => type === 'bug' )
  const wheeds = emojis .filter ( ( { type } ) => type === 'wheed' )
  const mushrooms = emojis .filter ( ( { type } ) => type === 'mushroom' )

  const num = 10
  const stuff = [ ... Array ( num >> 1 ) .fill () .map ( () => bugs[ Math.random () * bugs.length | 0 ] )
                , ... Array ( num - ( num >> 1 ) ) .fill () .map ( () => mushrooms[ Math.random () * mushrooms.length | 0 ] )
                ]
  const cover = Array ( num ) .fill () .map ( () => wheeds[ Math.random () * wheeds.length | 0 ] )
  // const all = [ ... ]

  return  ( <div className={ styles.MushroomSearch }>
              <GrabbableContainer>

                <Grabbable>
                  <img alt="" src={ axi } />
                </Grabbable>

                {
                  stuff.map ( ( props, i ) => <Grabbable  key={ i }
                                                          spawn_leaf_at={ spawn_leaf_at }>
                                                <Emoji { ...props } />
                                              </Grabbable> )
                }

            </GrabbableContainer>
          </div> )


  function spawn_leaf_at ( x, y ) {

    console.log ( x, y )

  }

}



export default MushroomSearch
