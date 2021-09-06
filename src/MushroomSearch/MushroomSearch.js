import React, { useState, useRef, useEffect } from 'react'

import styles from './MushroomSearch.module.sass'





const Grabbable = ( { children, parent, x, y } ) => {

  const [ is_grabbed, is_grabbed__set ] = useState ( false )
  const [ grabbed_x, grabbed_x__set ] = useState ( x )
  const [ grabbed_y, grabbed_y__set ] = useState ( y )

  const [ down_x_offset, down_x_offset__set ] = useState ( 0 )
  const [ down_y_offset, down_y_offset__set ] = useState ( 0 )

  const left = grabbed_x + 'px'
  const top = grabbed_y + 'px'


  useEffect( () => {

    if ( is_grabbed ) {

      parent.addEventListener ( 'mousemove', onmove )
      parent.addEventListener ( 'mouseup', onup )

    }

    return () => {

      parent.removeEventListener ( 'mousemove', onmove )
      parent.removeEventListener ( 'mouseup', onup )

    }


    function onmove ( e ) {
      e.preventDefault ()

      if ( ! is_grabbed ) return

      const move_x = e.clientX
      const move_y = e.clientY

      grabbed_x__set ( move_x - down_x_offset )
      grabbed_y__set ( move_y - down_y_offset )

    }



    function onup ( e ) {
      e.preventDefault ()

      is_grabbed__set ( false )

    }




  }, [ parent, is_grabbed, down_x_offset, down_y_offset ] )


  return  ( <div  className={ styles.Grabbable }
                  onMouseDown={ondown}
                  style={ { left, top } }>

              { children }

            </div> )




  function ondown ( e ) {
    e.preventDefault ()

    is_grabbed__set ( true )

    const down_x = e.clientX
    const down_y = e.clientY

    const { x, y } = e.target.getBoundingClientRect ()

    const { x:px, y:py } = parent.getBoundingClientRect ()

    down_x_offset__set ( down_x - x + px )
    down_y_offset__set ( down_y - y + py )

  }

}





const GrabbableContainer = ( { children } ) => {

  const [ is_loaded, is_loaded__set ] = useState ( false )
  const [ bounding_rect, bounding_rect__set ] = useState ( null )

  const ref = useRef ( null )

  useEffect( () => {

    if ( ref.current ) {

      is_loaded__set ( true )
      bounding_rect__set ( ref.current.getBoundingClientRect () )

    }

  }, [] )


  return  ( <div  className={ styles.GrabbableContainer }
                  ref={ ref }>

              { is_loaded
                  ? children.map ( ( Element, idx ) => <Element key={ idx }
                                                                parent={ ref.current }
                                                                x={ parseInt ( Math.random () * bounding_rect.width, 10 ) }
                                                                y={ parseInt ( Math.random () * bounding_rect.height, 10 ) } /> )
                  : ''
              }

            </div> )

}






const MushroomSearch = () => {

  return  ( <div className={ styles.MushroomSearch }>
              <GrabbableContainer>

                { [ props =>  <Grabbable { ...props }>
                                <div className={ styles.Emoji }>🍄</div>
                              </Grabbable>

                  , props =>  <Grabbable { ...props }>
                                fuck you
                              </Grabbable>

                  , ... [ '🍄', '🍂', '🍃', '🍀', '🌿', '🍁', '☘️', '🐛', '🐜', '🐝', '🐞' ]
                          .map ( ( e, i ) =>
                            props =>  <Grabbable key={ i } { ...props }>
                                        <div className={ styles.Emoji }>{ e }</div>
                                      </Grabbable> )
                ] }

            </GrabbableContainer>

            <div className={ styles.Emoji }>🍄 mushroom</div>

            <div className={ styles.Emoji }>🍂 fallen leaf</div>
            <div className={ styles.Emoji }>🍃 leaf fluttering in wind</div>
            <div className={ styles.Emoji }>🍀 Four Leaf Clover</div>
            <div className={ styles.Emoji }>🌿 Herb</div>
            <div className={ styles.Emoji }>🍁 Maple Leaf</div>
            <div className={ styles.Emoji }>☘️ Shamrock</div>

            <div className={ styles.Emoji }>🐛 bug</div>
            <div className={ styles.Emoji }>🐜 Ant</div>
            <div className={ styles.Emoji }>🐝 Honeybee</div>
            <div className={ styles.Emoji }>🐞 Lady Beetle</div>

          </div> )

}



export default MushroomSearch
