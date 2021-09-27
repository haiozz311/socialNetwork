import React from "react";
import Slider from "react-slick";

const Carousel = ({ images, _id }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true
  };
  return (
    <>
      <Slider {...settings}>
        {
          images.map((img, index) => (
            <div key={index}>
              <img src={img.url} style={{ maxWidth: '100%', height: 'auto', margin: '0 auto' }} alt={img.url} />
            </div>
          ))
        }
      </Slider>
    </>
  )
}

export default Carousel
