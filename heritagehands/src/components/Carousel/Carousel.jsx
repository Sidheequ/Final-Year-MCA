import React from 'react';
import b1 from '../../assets/b1.png'
import b2 from '../../assets/b2.png';
import b3 from '../../assets/b3.png';
import b4 from '../../assets/b4.png';
import b5 from '../../assets/b5.png';
import b6 from '../../assets/b6.png';
import b7 from '../../assets/b7.png';

const Carousel = () => {
    return (
        //<div style={{ overflowY: "auto", height: "50vh" }}>
              <section className="hero">
                <div style={{ marginTop: "2px" }}>
                  <div id="carouselExampleInterval" className="carousel slide" data-bs-ride="carousel">
                    <div className="carousel-inner">
                      <div className="carousel-item active" data-bs-interval="2000">
                        <img
                          src={b1}
                          className="d-block"
                          alt="banner"
                          style={{ width: "100%", height: "500px", objectFit: "cover" }}
                        />
                      </div>
                      <div className="carousel-item" data-bs-interval="2000" >
                        <img
                          src={b2}
                          className="d-block"
                          alt="banner"
                          style={{ width: "100%", height: "500px", objectFit: "cover" }}
                        />
                      </div>
                      <div className="carousel-item" data-bs-interval="2000">
                        <img
                          src={b3}
                          className="d-block"
                          alt="banner"
                          style={{ width: "100%", height: "500px", objectFit: "cover" }}
                        />
                      </div>
                       <div className="carousel-item" data-bs-interval="2000">
                        <img
                          src={b4}
                          className="d-block"
                          alt="banner"
                          style={{ width: "100%", height: "500px", objectFit: "cover" }}
                        />
                      </div>
                       <div className="carousel-item" data-bs-interval="2000">
                        <img
                          src={b5}
                          className="d-block"
                          alt="banner"
                          style={{ width: "100%", height: "500px", objectFit: "cover" }}
                        />
                      </div>
                       <div className="carousel-item" data-bs-interval="2000">
                        <img
                          src={b6}
                          className="d-block"
                          alt="banner"
                          style={{ width: "100%", height: "500px", objectFit: "cover" }}
                        />
                      </div>
                       <div className="carousel-item" data-bs-interval="2000">
                        <img
                          src={b7}
                          className="d-block"
                          alt="banner"
                          style={{ width: "100%", height: "500px", objectFit: "cover" }}
                        />
                      </div>
                    </div>
                    <button
                      className="carousel-control-prev"
                      type="button"
                      data-bs-target="#carouselExampleInterval"
                      data-bs-slide="prev"
                    >
                      <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                      <span className="visually-hidden">Previous</span>
                    </button>
                    <button
                      className="carousel-control-next"
                      type="button"
                      data-bs-target="#carouselExampleInterval"
                      data-bs-slide="next"
                    >
                      <span className="carousel-control-next-icon" aria-hidden="true"></span>
                      <span className="visually-hidden">Next</span>
                    </button>
                  </div>
                </div>
              </section>
            //</div>
    )
}

export default Carousel