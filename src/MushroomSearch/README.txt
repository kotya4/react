

Граф этапа разработки:
  () -> (1)
    (1) -> делаешь что-то -> (2)
      (2) -> синтакическая ошибка -> исправляешь ошибку -> (1)
      (2) -> логическая ошибка -> исправляешь ошибку -> (1)
      (2) -> внезапно все работает правильно
                -> удивляешься
                -> стараешься больше не трогать компонент




TODOs:

  * упавшие за край экрана листья продолжают падать бесконечно ( по хорошему их нужно диспавнить )

  * last touched subcomponent of GrabbableContainer not on top

  * maybe useReducer is preferable over useState in GrabbableContainer

TIPs:

  * hash ish a magic infinite float-manifold aka grupoid [+,sin,1]

  * to use ModuleCSS you need to name ur css-file as [smh].module.[css|scss|sass|...]

  * https://medium.com/jsdownunder/webpack-build-performance-pitfall-of-using-sass-with-css-modules-ba32f89efdcb

  * do not call parent handler ( h ) inside state-setter ( sets ) if ( h ) calls parent state-setter ( setv ) u morron, as :
      fun c { v, h }
        [ s, sets ] = useState 0
        useEffect _ =>
          sets s =>
            h 1               <- not ok because setv connected with s is inside sets
            ret s + 1
        , []
        ret v
      fun p
        [ v, setv ] = useState 0
        ret c v h
        fun h v
          setv v

  * u cannot do this lol
      fun c
        [ s, sets ] = useState 0
        useEffect _ =>
          iid = setInterval _ =>
            if s > 10               <- this value will not update on calling sets
              clearInterval iid
            sets s + 1
          ret _ =>
            clearInterval iid
        , []
        ret
    but can this
      fun c
        [ s, sets ] = useState 0
        useEffect _ =>
          iid = setInterval _ =>
            ss = 0
            if ss > 10
              clearInterval iid
            sets s =>
              ss = s + 1               <- u must buffer value in sets-callback
              ret ss
          ret _ =>
            clearInterval iid
        , []
        ret
