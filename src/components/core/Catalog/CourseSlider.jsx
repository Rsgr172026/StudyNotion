import React from 'react'

import {Swiper, SwiperSlide} from "swiper/react"
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import { Autoplay,FreeMode,Navigation, Pagination}  from 'swiper'

import Course_Card from './Course_Card'

const CourseSlider = ({Courses}) => {
  console.log("CourseSlider received Courses:", Courses);
  console.log("Courses length:", Courses?.length);
  
  return (
    <>
      {Courses?.length ? (
        <Swiper
          slidesPerView={1}
          spaceBetween={25}
          loop={true}
          modules={[FreeMode, Pagination]}
          breakpoints={{
            1024: {
              slidesPerView: 3,
            },
          }}
          className="max-h-[30rem]"
        >
          {Courses?.map((course, i) => (
            <SwiperSlide key={i}>
              <Course_Card course={course} Height={"h-[250px]"} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div>
          <p className="text-xl text-richblack-5">No Course Found</p>
          <p className="text-white mt-2">Debug: Courses = {JSON.stringify(Courses)}</p>
        </div>
      )}
    </>
  )
}

export default CourseSlider
