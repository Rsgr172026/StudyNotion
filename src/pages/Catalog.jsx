import React, { useEffect, useState } from 'react'
import Footer from '../components/common/Footer'
import { useParams } from 'react-router-dom'
import { apiConnector } from '../services/apiconnector';
import { categories } from '../services/apis';
import { getCatalogaPageData } from '../services/operations/pageAndComponentData';
import CourseCard from '../components/core/Catalog/Course_Card';
import CourseSlider from '../components/core/Catalog/CourseSlider';
import { useSelector } from "react-redux"
import Error from "./Error"

const Catalog = () => {

    const { loading } = useSelector((state) => state.profile)
  const { catalogName } = useParams()
  const [active, setActive] = useState(1)
    const [catalogPageData, setCatalogPageData] = useState(null);
    const [categoryId, setCategoryId] = useState("");
    const [categoryResolveFailed, setCategoryResolveFailed] = useState(false);

    const scrollToCoursesSection = () => {
      const el = document.getElementById("catalog-courses-section")
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }

    //Fetch all categories
    useEffect(()=> {
        const getCategories = async() => {
            const res = await apiConnector("GET", categories.CATEGORIES_API);
            const list = res?.data?.data || []
            const matched = res?.data?.data?.find(
              (ct) => ct?.name?.split(" ").join("-").toLowerCase() === catalogName
            )
            if (matched?._id) {
              setCategoryId(matched._id)
              setCategoryResolveFailed(false)
              return
            }

            // Fallback: if slug doesn't match, pick first category to avoid blank catalog page
            if (list?.length && list[0]?._id) {
              setCategoryId(list[0]._id)
              setCategoryResolveFailed(true)
              return
            }

            setCategoryId("")
            setCategoryResolveFailed(true)
        }
        getCategories();
    },[catalogName]);

    useEffect(() => {
        const getCategoryDetails = async() => {
            try{
                const res = await getCatalogaPageData(categoryId);
                console.log("PRinting res: ", res);
                setCatalogPageData(res);
            }
            catch(error) {
                console.log(error)
            }
        }
        if(categoryId) {
            getCategoryDetails();
        }
        
    },[categoryId]);


    if (loading || !catalogPageData) {
        return (
          <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
            <div className="spinner"></div>
          </div>
        )
      }
      if (!loading && !catalogPageData.success) {
        return <Error />
      }
    
      return (
        <>
          {/* Hero Section */}
          <div className=" box-content bg-richblack-800 px-4">
            <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent ">
              <p className="text-sm text-richblack-300">
                {`Home / Catalog / `}
                <span className="text-yellow-25">
                  {catalogPageData?.data?.selectedCategory?.name}
                </span>
              </p>
              <p className="text-3xl text-richblack-5">
                {catalogPageData?.data?.selectedCategory?.name}
              </p>
              <p className="max-w-[870px] text-richblack-200">
                {catalogPageData?.data?.selectedCategory?.description}
              </p>

              {categoryResolveFailed ? (
                <p className="text-sm text-richblack-300">
                  Showing a fallback catalog because URL slug didn’t match any category.
                </p>
              ) : null}

              {/* Quick course-name list */}
              {catalogPageData?.data?.selectedCategory?.courses?.length ? (
                <div className="flex flex-col gap-2 pt-2">
                  <p className="text-sm font-semibold text-richblack-50">
                    Courses in this catalog
                  </p>
                  <div className="flex flex-wrap gap-x-3 gap-y-2">
                    {catalogPageData.data.selectedCategory.courses
                      .slice(0, 12)
                      .map((course) => (
                        <button
                          key={course?._id}
                          type="button"
                          onClick={scrollToCoursesSection}
                          className="rounded-full border border-richblack-600 bg-richblack-700 px-3 py-1 text-sm text-richblack-25 hover:border-yellow-25 hover:text-yellow-25"
                        >
                          {course?.courseName}
                        </button>
                      ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
    
          {/* Section 1 */}
          <div
            id="catalog-courses-section"
            className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent"
          >
            <div className="section_heading">Courses to get you started</div>
            <div className="my-4 flex border-b border-b-richblack-600 text-sm">
              <p
                className={`px-4 py-2 ${
                  active === 1
                    ? "border-b border-b-yellow-25 text-yellow-25"
                    : "text-richblack-50"
                } cursor-pointer`}
                onClick={() => setActive(1)}
              >
                Most Populer
              </p>
              <p
                className={`px-4 py-2 ${
                  active === 2
                    ? "border-b border-b-yellow-25 text-yellow-25"
                    : "text-richblack-50"
                } cursor-pointer`}
                onClick={() => setActive(2)}
              >
                New
              </p>
            </div>
            <div>
              <CourseSlider
                Courses={catalogPageData?.data?.selectedCategory?.courses}
              />
              <p className="text-white mt-4">
                Debug: {JSON.stringify(catalogPageData?.data?.selectedCategory?.courses)}
              </p>
            </div>
          </div>
          {/* Section 2 */}
          <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
            <div className="section_heading">
              Top courses in {catalogPageData?.data?.differentCategory?.name}
            </div>
            <div className="py-8">
              <CourseSlider
                Courses={catalogPageData?.data?.differentCategory?.courses}
              />
            </div>
          </div>
    
          {/* Section 3 */}
          <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
            <div className="section_heading">Frequently Bought</div>
            <div className="py-8">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {catalogPageData?.data?.mostSellingCourses
                  ?.slice(0, 4)
                  .map((course, i) => (
                    <CourseCard course={course} key={i} Height={"h-[400px]"} />
                  ))}
              </div>
            </div>
          </div>
    
          <Footer />
        </>
      )
    }
    
    export default Catalog