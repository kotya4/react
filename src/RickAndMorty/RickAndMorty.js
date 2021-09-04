import React from 'react'
import './RickAndMorty.css'


import LoveHate from './LoveHate'



import ajax from '../common/ajax'


import noun_episode_3856385 from '../images/noun_episode_3856385.svg'
import noun_Map_4212639 from '../images/noun_Map_4212639.svg'
import noun_broken_1399559 from '../images/noun_broken_1399559.svg'







class Card extends React.Component {


  render () {

    if ( this.props.value ) {
      if ( this.props.type === 'character' ) return this.render_character ()
      if ( this.props.type === 'location' ) return this.render_location ()
      if ( this.props.type === 'episode' ) return this.render_episode ()
      return this.render_empty ()
    }

    return this.render_empty ()

  }




  render_character () {

    return  ( <div  className="card"
                    onClick={ () => this.props.extended_card_handler ( this.props.type, this.props.value ) }>
                <img alt="" src={ this.props.value.image } />
                <div>
                  <div className="normal"> { this.props.value.name } </div>
                  <div className="italic"> { this.props.value.type } </div>
                  <div className="bold"> { this.props.value.gender } </div>
                </div>
              </div> )

  }





  render_location () {

    return  ( <div  className="card"
                    onClick={ () => this.props.extended_card_handler ( this.props.type, this.props.value ) }>
                <img alt="" src={ noun_Map_4212639 } />
                <div>
                  <div className="normal"> { this.props.value.name } </div>
                  <div className="italic"> { this.props.value.type } </div>
                  <div className="bold"> { this.props.value.dimension } </div>
                </div>
              </div> )

  }






  render_episode () {

    return  ( <div  className="card"
                    onClick={ () => this.props.extended_card_handler ( this.props.type, this.props.value ) }>
                <img alt="" src={ noun_episode_3856385 } />
                <div>
                  <div className="normal"> { this.props.value.name } </div>
                  <div className="italic"> { this.props.value.episode } </div>
                  <div className="bold"> { this.props.value.air_date } </div>
                </div>
              </div> )

  }






  render_empty () {

    return  ( <div className="card">
                <img alt="" src={ noun_broken_1399559 } />
                <div />
              </div> )

  }





}















class Section extends React.Component {



  constructor ( props ) {

    super ( props )

    this.state = {

      cards : []

    }

    this.data = null
    this.data_url = this.props.url

  }




  componentDidMount () {
    // Suddenly calling asynchronous shish in constructor causes it execute twice  (°ㅂ°╬)
    // So must do my ajax-stuff here instead.

    this.fetch_cards ()

  }





  render () {

    return  ( <div  className="section"
                    onScroll={ async e => {

                      const { height } = e.target.getBoundingClientRect ()

                      if ( e.target.scrollHeight <= e.target.scrollTop + height ) {

                        this.fetch_cards ()

                      }

                    } }>

                { this.state.cards.map ( ( card, i ) => <Card key={ i }
                                                              value={ card }
                                                              type={ this.props.type }
                                                              extended_card_handler={ this.props.extended_card_handler } /> ) }

              </div> )

  }





  async fetch_cards ( num=5 ) {
    // Fetches given number of cards

    const cards = []

    for ( let i = 0 ; i < num ; ++i ) {

      cards.push ( await this._fetch_random_card () )

    }

    this.setState ( { cards : [ ...this.state.cards, ...cards ] } )

  }








  async _fetch_random_card ( force_fetch=false ) {
    // Helper funtion.
    // Circularly fetches values from this.data_url and returns random value from this.data.results

    if ( ! this.data || force_fetch ) {

      this.data = JSON.parse ( await ajax ( this.data_url ) )

      this.data_url = this.data.info.next || this.props.url

    }

    const card = this._carousel_fetch_random_card ()

    if ( card ) return card

    return this._fetch_random_card ( true )

  }






  _carousel_fetch_random_card () {
    // Helper function.
    // Returns random value from this.data.results and marks object as "_picked"
    // OR
    // Returns null if all values are picked

    const i0 = Math.random () * this.data.results.length | 0

    let card = null

    for ( let i1 = 0 ; i1 < this.data.results.length ; ++i1 ) {

      const i = ( i0 + i1 ) % this.data.results.length

      if ( ! ( '_picked' in this.data.results[ i ] ) ) {

        card = this.data.results[ i ]
        card._picked = true
        break

      }

    }

    return card

  }


}

















class ModalExtendedCard extends React.Component {


/*
  static getDerivedStateFromProps ( props, state ) {
    // So there is my 6 hours of pain:
    // I pass "value" as property, if it is null -- I'll hide component,
    // otherwise showing it. Component has "close" button. It is pretty
    // straight forward to set value to null again to make component
    // hidden, u think. Yea but properties are immutable. States are not.
    // Also, calling this.setState is the rightest way to rerender the
    // component. So, property must become a state, and there was
    // a function called "componentWillReceiveProps" that does exactly
    // what I want. BUT IT IS DEPRECATED  ლ(¯ロ¯"ლ)
    // I cannot just convert property into state in constructor if u
    // wonder, constructor isn't executed on property change.
    // I also cannot just use this.setState because I am passing
    // value through sibling's child component so it must be property.
    // So the docs advises me to use ~this~ method,
    // there is a problem tho: it also executes on every state update.
    // I must somehow determine if state was changed by property update
    // or state update itself, and then -- deside to update the state
    // or not to, according to the passed property.
    // That's one of most disturbing thing I've ever seen in my short react
    // programming career. wtf react, umad bro?  (・_・;)
    // UPD: Actually, nevermind.
    // I will exploit property mutabilitiness by using prop. as
    // value container, so value itself will be still mutable.
    // I'll also use this.forceUpdate ( wich is not recommended by docs )  ᕕ( ᐛ )ᕗ

    if ( props.value !== state.value ) { // does not do what i want

      return { value : props.value }

    }

    return null

  }
*/

  constructor ( props ) {

    super ( props )

    this.state = {}

  }

/*
  static getDerivedStateFromProps ( props, state ) {

    // TODO: fetch episode, residents and characters on this.render_data

    console.log ( 'getDerivedStateFromProps' )

    console.log ( props.data )

    if ( 'data' in props && 'type' in props.data && 'value' in props.data && 'id' in props.data.value ) {

      const key = props.data.type + props.data.id

      if ( props.data.type === 'character' && ! ( key in state ) ) {



      }

    }

    return null

  }
*/

  render () {

    return  ( <div  className={ 'modal-extended-card modal-extended-card--' + ( this.props.data.value ? 'show' : 'hidden' ) }>

                { this.render_data ( this.props.data ) }

                <div  className="modal-extended-card__close"
                      onClick={ () => {

                        this.props.data.value = null

                        this.forceUpdate ()

                      } }>

                  [x]

                </div>

              </div> )

  }




  render_data ( { type, value } ) {

    if ( ! value ) return ''

    if ( type === 'character' ) return this.render_data_character ( value )
    if ( type === 'location' ) return this.render_data_location ( value )
    if ( type === 'episode' ) return this.render_data_episode ( value )

    return JSON.stringify ( value )

  }





  render_data_character ( { image, name, url, type, gender, species, created, status, origin, location, id, episode } ) {
    return  ( <div>
                <img alt="" src={ image } />
                <div>
                  <div className="modal-extended-card__data">
                    <span className="modal-extended-card__title">name</span>
                    &nbsp;&nbsp;&nbsp;
                    <span className="modal-extended-card__value">{ url ? ( <a href={ url }>{ name }</a> ) : name }</span>
                  </div>
                  <div className="modal-extended-card__data">
                    <span className="modal-extended-card__title">type</span>
                    &nbsp;&nbsp;&nbsp;
                    <span className="modal-extended-card__value">{ type }</span>
                  </div>
                  <div className="modal-extended-card__data">
                    <span className="modal-extended-card__title">gender</span>
                    &nbsp;&nbsp;&nbsp;
                    <span className="modal-extended-card__value">{ gender }</span>
                  </div>
                  <div className="modal-extended-card__data">
                    <span className="modal-extended-card__title">species</span>
                    &nbsp;&nbsp;&nbsp;
                    <span className="modal-extended-card__value">{ species }</span>
                  </div>
                  <div className="modal-extended-card__data">
                    <span className="modal-extended-card__title">created</span>
                    &nbsp;&nbsp;&nbsp;
                    <span className="modal-extended-card__value">{ created }</span>
                  </div>
                  <div className="modal-extended-card__data">
                    <span className="modal-extended-card__title">status</span>
                    &nbsp;&nbsp;&nbsp;
                    <span className="modal-extended-card__value">{ status }</span>
                  </div>
                  <div className="modal-extended-card__data">
                    <span className="modal-extended-card__title">origin</span>
                    &nbsp;&nbsp;&nbsp;
                    <span className="modal-extended-card__value">{ origin.url ? ( <a href={ origin.url }>{ origin.name }</a> ) : origin.name }</span>
                  </div>
                  <div className="modal-extended-card__data">
                    <span className="modal-extended-card__title">location</span>
                    &nbsp;&nbsp;&nbsp;
                    <span className="modal-extended-card__value">{ location.url ? ( <a href={ location.url }>{ location.name }</a> ) : location.name }</span>
                  </div>
                  <div className="modal-extended-card__data">
                    <span className="modal-extended-card__title">id</span>
                    &nbsp;&nbsp;&nbsp;
                    <span className="modal-extended-card__value">{ id }</span>
                  </div>
                </div>
              </div> )
  }





  render_data_location ( { name, url, type, dimension, created, id, residents } ) {
    return  ( <div>
                <div>
                  <div className="modal-extended-card__data">
                    <span className="modal-extended-card__title">name</span>
                    &nbsp;&nbsp;&nbsp;
                    <span className="modal-extended-card__value">{ url ? ( <a href={ url }>{ name }</a> ) : name }</span>
                  </div>
                  <div className="modal-extended-card__data">
                    <span className="modal-extended-card__title">type</span>
                    &nbsp;&nbsp;&nbsp;
                    <span className="modal-extended-card__value">{ type }</span>
                  </div>
                  <div className="modal-extended-card__data">
                    <span className="modal-extended-card__title">dimension</span>
                    &nbsp;&nbsp;&nbsp;
                    <span className="modal-extended-card__value">{ dimension }</span>
                  </div>
                  <div className="modal-extended-card__data">
                    <span className="modal-extended-card__title">created</span>
                    &nbsp;&nbsp;&nbsp;
                    <span className="modal-extended-card__value">{ created }</span>
                  </div>
                  <div className="modal-extended-card__data">
                    <span className="modal-extended-card__title">id</span>
                    &nbsp;&nbsp;&nbsp;
                    <span className="modal-extended-card__value">{ id }</span>
                  </div>
                </div>
              </div> )
  }





  render_data_episode ( { name, url, episode, air_date, created, id, characters } ) {
    return  ( <div>
                <div>
                  <div className="modal-extended-card__data">
                    <span className="modal-extended-card__title">name</span>
                    &nbsp;&nbsp;&nbsp;
                    <span className="modal-extended-card__value">{ url ? ( <a href={ url }>{ name }</a> ) : name }</span>
                  </div>
                  <div className="modal-extended-card__data">
                    <span className="modal-extended-card__title">episode</span>
                    &nbsp;&nbsp;&nbsp;
                    <span className="modal-extended-card__value">{ episode }</span>
                  </div>
                  <div className="modal-extended-card__data">
                    <span className="modal-extended-card__title">air_date</span>
                    &nbsp;&nbsp;&nbsp;
                    <span className="modal-extended-card__value">{ air_date }</span>
                  </div>
                  <div className="modal-extended-card__data">
                    <span className="modal-extended-card__title">created</span>
                    &nbsp;&nbsp;&nbsp;
                    <span className="modal-extended-card__value">{ created }</span>
                  </div>
                  <div className="modal-extended-card__data">
                    <span className="modal-extended-card__title">id</span>
                    &nbsp;&nbsp;&nbsp;
                    <span className="modal-extended-card__value">{ id }</span>
                  </div>
                </div>
              </div> )
  }








}
















class RickAndMorty extends React.Component {

  constructor ( props ) {

    super ( props )

    this.state = {

      extended_card : { type : null, value : null }

    }

    this.extended_card_handler = this.extended_card_handler.bind ( this )

  }


  render () {

    return  ( <div className="rick-and-morty">

                <div className="header">
                  <div>&nbsp;Rick and Morty <a href="https://rickandmortyapi.com/">API</a></div>
                  <div><a href="https://github.com/sluchaynayakotya/reactgovno/src/RickAndMorty">src</a>&nbsp;</div>
                </div>

                <div className="section-container">

                  <Section url="https://rickandmortyapi.com/api/character" type="character" extended_card_handler={ this.extended_card_handler } />
                  <Section url="https://rickandmortyapi.com/api/location" type="location" extended_card_handler={ this.extended_card_handler } />
                  <Section url="https://rickandmortyapi.com/api/episode" type="episode" extended_card_handler={ this.extended_card_handler } />

                </div>

                <div className="footer">
                  <a href="http://kotya.tk/">jeg</a>&nbsp;<LoveHate />&nbsp;<a href="https://reactjs.org/">react</a>&nbsp;
                </div>

                <ModalExtendedCard data={ this.state.extended_card } />

              </div> )

  }



  extended_card_handler ( type, value ) {
    // It's not possible to pass this.setState as property directly,
    // but passing method calling this.setState is suddenly okay  ┐(‘～` )┌
    // This method will be cascaded straight to the Card component.

    this.setState ( { extended_card : { type, value } } )

  }



}


export default RickAndMorty
