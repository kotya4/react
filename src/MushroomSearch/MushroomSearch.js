import React, { useState, Children, cloneElement, useRef } from 'react'

import styles from './MushroomSearch.module.sass'





const Grabbable = ( { ondown_with_id, children, x, y, id } ) => {

  const left = x + 'px'
  const top = y + 'px'

  return  ( <div  className={ styles.Grabbable }
                  onMouseDown={ ondown }
                  style={ { left, top } }>

              { children }

            </div> )



  function ondown ( e ) {

    return ondown_with_id ( id, e )

  }

}




// ✳



const GrabbableContainer = ( { children } ) => {

  const [ down_x_offset, down_x_offset__set ] = useState ( 0 )
  const [ down_y_offset, down_y_offset__set ] = useState ( 0 )

  const [ grabbed_x, grabbed_x__set ] = useState ( 0 )
  const [ grabbed_y, grabbed_y__set ] = useState ( 0 )
  const [ grabbed_id, grabbed_id__set ] = useState ( null )

  const ref = useRef ( null )

  const elements = Children.map ( children, ( e, id ) => cloneElement ( e, { id, ondown_with_id } ) )

  return  ( <div  className={ styles.GrabbableContainer }
                  ref={ ref }
                  onMouseMove={ onmove }
                  onMouseUp={ onup }>

              {
                grabbed_id != null
                  ? [ ... elements.filter ( ( _, id ) => id !== grabbed_id )
                    , cloneElement ( elements[ grabbed_id ], {
                        x : grabbed_x,
                        y : grabbed_y,
                      } )
                    ]
                  : elements
              }

            </div> )



  function onmove ( e ) {
    e.preventDefault ()

    if ( grabbed_id == null ) return

    const move_x = e.clientX
    const move_y = e.clientY

    grabbed_x__set ( move_x - down_x_offset )
    grabbed_y__set ( move_y - down_y_offset )

  }



  function onup ( e ) {
    e.preventDefault ()

    grabbed_id__set ( null )

  }



  function ondown_with_id ( id, e ) {
    // Same as ondown but with element index passed as "id"

    e.preventDefault ()

    grabbed_id__set ( id )

    const down_x = e.clientX
    const down_y = e.clientY

    const { x, y } = e.target.getBoundingClientRect ()

    const { x:px, y:py } = ref.current.getBoundingClientRect ()

    down_x_offset__set ( down_x - x + px )
    down_y_offset__set ( down_y - y + py )

    grabbed_x__set ( x - px )
    grabbed_y__set ( y - py )

  }

}








const MushroomSearch = () => {

  return  ( <div className={ styles.MushroomSearch }>

              <GrabbableContainer>

                <Grabbable>
                  <div className={ styles.Emoji }>🍄</div>
                </Grabbable>

                <Grabbable>
                  fuck you
                </Grabbable>

                {
                  [ '🍄', '🍂', '🍃', '🍀', '🌿', '🍁', '☘️', '🐛', '🐜', '🐝', '🐞' ]
                    .map ( ( e, i ) => ( <Grabbable key={ i }><div className={ styles.Emoji }>{ e }</div></Grabbable> ) )
                }

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
