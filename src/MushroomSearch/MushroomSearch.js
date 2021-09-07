import React, { useState, useRef, useEffect, Children, cloneElement, useCallback } from 'react'

import styles from './MushroomSearch.module.sass'





const Grabbable = ( { children, parent, x, y } ) => {

  const [ is_grabbed, is_grabbed__set ] = useState ( false )
  const [ grabbed_x, grabbed_x__set ] = useState ( x )
  const [ grabbed_y, grabbed_y__set ] = useState ( y )

  const [ down_x_offset, down_x_offset__set ] = useState ( 0 )
  const [ down_y_offset, down_y_offset__set ] = useState ( 0 )

  const left = grabbed_x + 'px'
  const top = grabbed_y + 'px'

  const handle_move = useCallback ( onmove, [ down_x_offset, down_y_offset, is_grabbed ] )
  const handle_up   = useCallback ( onup, [] )
  const handle_down = useCallback ( ondown, [ parent ] )

  useEffect( () => {

    if ( is_grabbed ) {

      parent.addEventListener ( 'mousemove', handle_move )
      parent.addEventListener ( 'mouseup', handle_up )
      parent.addEventListener ( 'mouseleave', handle_up )
      parent.addEventListener ( 'touchmove', handle_move )
      parent.addEventListener ( 'touchend', handle_up )
      parent.addEventListener ( 'touchcancel', handle_up )

    }

    return () => {

      parent.removeEventListener ( 'mousemove', handle_move )
      parent.removeEventListener ( 'mouseup', handle_up )
      parent.removeEventListener ( 'mouseleave', handle_up )
      parent.removeEventListener ( 'touchmove', handle_move )
      parent.removeEventListener ( 'touchend', handle_up )
      parent.removeEventListener ( 'touchcancel', handle_up )

    }

  }, [ parent, is_grabbed, handle_move, handle_up ] )


  return  ( <div  className={ styles.Grabbable }
                  onMouseDown={ handle_down }
                  onTouchStart={ handle_down }
                  style={ { left, top } }>

              { children }

            </div> )



  function onmove ( e ) {
    e.preventDefault ()

    if ( ! is_grabbed ) return

    const move_x = e.clientX || e.touches[ 0 ].clientX
    const move_y = e.clientY || e.touches[ 0 ].clientY

    grabbed_x__set ( move_x - down_x_offset )
    grabbed_y__set ( move_y - down_y_offset )

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


    // const iid = setInterval ( () => { console.log ( Math.random () * 10 | 0 ) }, 500 )

    return () => {

      // clearInterval ( iid )

    }

  }, [] )

  const margin_left = bounding_rect.width * 0.2
  const margin_top = bounding_rect.height * 0.2

  return  ( <div  className={ styles.GrabbableContainer }
                  ref={ ref }>

              { is_loaded
                  ? Children.map ( children, ( e, i ) => cloneElement ( e,  { parent : ref.current
                                                                            , x : margin_left + Math.random () * ( bounding_rect.width - margin_left * 2 )
                                                                            , y : margin_top + Math.random () * ( bounding_rect.height - margin_top * 2 )
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
                  fuck you
                </Grabbable>

                {
                  stuff.map ( ( props, i ) => <Grabbable key={ i }><Emoji { ...props } /></Grabbable> )
                }

            </GrabbableContainer>
          </div> )

}



export default MushroomSearch
