
https://rickandmortyapi.com

TODOs:

* episode, residents and characters on ModalExtendedCard.render_data must be properly fetched

* css is fucked up

* bad file managing: why some subcomponents separated from supercomponent but others are not?







DONE TODOs:

* модалка не закрывается на телефоне, выделяется текст

* модалка слишком большая на телефоне, она должна ограничивать свою широту широтой экрана












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
// So the docs advises me to use getDerivedStateFromProps method,
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
