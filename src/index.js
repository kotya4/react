import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom'
import './index.css'



ReactDOM.render ( <React.StrictMode>
                    <BrowserRouter basename="/react"> {/* same as package.json -> homepage */}
                      <Suspense fallback={ <div>Loading...</div> }>
                        <Switch>

                          <Route exact path="/">
                            <div className="container">
                              <div>available subapplications</div>
                              <br />
                              <Link to="/rick"> RickAndMorty </Link>
                              <Link to="/mush"> MushroomSearch </Link>
                            </div>
                          </Route>

                          <Route path="/rick" component={ lazy ( () => import ( './RickAndMorty/RickAndMorty' ) ) } />
                          <Route path="/mush" component={ lazy ( () => import ( './MushroomSearch/MushroomSearch' ) ) } />

                        </Switch>
                      </Suspense>
                    </BrowserRouter>
                  </React.StrictMode>
                , document.getElementById ( 'root' )
                )
