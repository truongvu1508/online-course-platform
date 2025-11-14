import { useSwiper } from "swiper/react";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useEffect, useState } from "react";

export const SwiperNavButton = () => {
  const swiper = useSwiper();
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  useEffect(() => {
    if (swiper) {
      // init state
      setIsBeginning(swiper.isBeginning);
      setIsEnd(swiper.isEnd);

      // update state when slide change
      const handleSlideChange = () => {
        setIsBeginning(swiper.isBeginning);
        setIsEnd(swiper.isEnd);
      };

      swiper.on("slideChange", handleSlideChange);

      // remove event listener khi component unmount
      return () => {
        swiper.off("slideChange", handleSlideChange);
      };
    }
  }, [swiper]);

  return (
    <div className="swiper-nav-btns">
      <button
        onClick={() => swiper.slidePrev()}
        disabled={isBeginning}
        className={`absolute z-50 left-0 top-1/2 -translate-y-1/2 border-[1px] rounded-full transition-all duration-500 ease-out opacity-0 group-hover:opacity-100 ${
          isBeginning
            ? "bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed"
            : "bg-white border-primary text-primary hover:bg-primary hover:text-white"
        }`}
      >
        <KeyboardArrowLeftIcon />
      </button>
      <button
        onClick={() => swiper.slideNext()}
        disabled={isEnd}
        className={`absolute z-50 right-0 top-1/2 -translate-y-1/2 border-[1px] rounded-full transition-all duration-500 ease-out opacity-0 group-hover:opacity-100 ${
          isEnd
            ? "bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed"
            : "bg-white border-primary text-primary hover:bg-primary hover:text-white"
        }`}
      >
        <KeyboardArrowRightIcon />
      </button>
    </div>
  );
};
