import React, { useState } from 'react'

import styles from './MushroomSearch.sass'



const MushroomSearch = props => {

  return  ( <div className={ styles.MushroomSearch }>

              <div className={ styles.Emoji }>🍄 Mushroom</div>

              <div>🍂 fallen leaf</div>
              <div>🍃 leaf fluttering in wind</div>
              <div>🍀 Four Leaf Clover</div>
              <div>🌿 Herb</div>
              <div>🍁 Maple Leaf</div>
              <div>☘️ Shamrock</div>

              <div>🐛 bug</div>
              <div>🐜 Ant</div>
              <div>🐝 Honeybee</div>
              <div>🐞 Lady Beetle</div>


            </div> )

}



export default MushroomSearch
