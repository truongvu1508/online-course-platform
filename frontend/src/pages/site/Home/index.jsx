import { Cursor, useTypewriter } from "react-simple-typewriter";
import { colors } from "../../../utils/colors";
import Button from "@mui/material/Button";
import LaptopMacIcon from "@mui/icons-material/LaptopMac";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import CloudIcon from "@mui/icons-material/Cloud";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import "./HomePage.scss";
import CourseSections from "./CourseSections";
import CategoryMarquee from "./CategoryMarquee";
import FeedbackCard from "../../../components/site/FeedbackCard";

const HomePage = () => {
  const [text] = useTypewriter({
    words: [
      "CodeLearn - Website Bán Khóa học Tốt Nhất Hiện Nay",
      "Giáo Dục Tạo Ra Tương Lai Tốt Đẹp Hơn",
    ],
    loop: true,
    typeSpeed: 100,
    deleteSpeed: 50,
  });

  const feedbacks = [
    {
      id: 1,
      name: "Nguyễn Trường Vũ",
      role: "Học viên",
      avatar: null,
      content:
        "Khóa học rất bổ ích, giảng viên nhiệt tình và dễ hiểu. Tôi đã học được rất nhiều kiến thức thực tế và áp dụng ngay vào công việc. Nội dung được cập nhật liên tục, phù hợp với xu hướng hiện tại.",
      rating: 5,
      course: "React.js từ cơ bản đến nâng cao",
    },
    {
      id: 2,
      name: "Phan Minh Tài",
      role: "Học viên",
      avatar: null,
      content:
        "Chất lượng khóa học vượt mong đợi! Giảng viên giải thích chi tiết từng khái niệm, có nhiều bài tập thực hành. Sau khóa học tôi đã tự tin hơn rất nhiều trong việc phát triển ứng dụng web.",
      rating: 5,
      course: "Lập trình Web Full Stack",
    },
    {
      id: 3,
      name: "Đỗ Thành Bảo",
      role: "Học viên",
      avatar: null,
      content:
        "Khóa học phù hợp cho người mới bắt đầu như mình. Nội dung dễ hiểu, có nhiều ví dụ minh họa cụ thể. Hỗ trợ của giảng viên và cộng đồng rất tốt, mọi thắc mắc đều được giải đáp nhanh chóng.",
      rating: 5,
      course: "Python cơ bản",
    },
    {
      id: 4,
      name: "Nguyễn Xuân Hoàng",
      role: "Học viên",
      avatar: null,
      content:
        "Tôi đã hoàn thành khóa học và thấy kiến thức rất thực tế. Đặc biệt phần dự án cuối khóa giúp tôi hiểu rõ quy trình làm việc thực tế. Rất đáng đồng tiền bát gạo!",
      rating: 5,
      course: "Node.js & MongoDB",
    },
    {
      id: 5,
      name: "EnTiVi",
      role: "Học viên",
      avatar: null,
      content:
        "Platform học rất tốt, video chất lượng cao, âm thanh rõ ràng. Tốc độ học tùy chỉnh được nên rất phù hợp với lịch trình của tôi. Đã giới thiệu cho nhiều bạn bè rồi!",
      rating: 5,
      course: "Node.js & MongoDB",
    },
  ];

  const renderColoredText = (text) => {
    if (text.includes("CodeLearn")) {
      return text.split("CodeLearn").map((part, index) => (
        <span key={index}>
          {part}
          {index === 0 && (
            <span className="text-primary-400 font-[700]">CodeLearn</span>
          )}
        </span>
      ));
    }
    if (text.includes("Tương Lai")) {
      return text.split("Tương Lai").map((part, index) => (
        <span key={index}>
          {part}
          {index === 0 && (
            <span className="text-primary-400 font-[700]">Tương Lai</span>
          )}
        </span>
      ));
    }
    return text;
  };

  return (
    <>
      <section className="introduce-homepage h-[90vh] bg-secondary">
        <div className="container grid grid-cols-2 gap-3 h-full items-center">
          <div className="col-span-1">
            <div className="flex items-center gap-2">
              <h3 className="uppercase font-[600] text-base text-white">
                Học từ hôm nay
              </h3>
              <h3 className="uppercase font-[600] bg-primary text-white px-3 py-2 rounded-full text-base">
                Nhận ưu đãi liền tay
              </h3>
            </div>
            <h1 className="font-[600] text-5xl mt-5 text-white w-[70%] h-[150px]">
              <span>{renderColoredText(text)}</span>
              <span>
                <Cursor className="text-black" />
              </span>
            </h1>
            <p className="text-sm text-gray-500 mt-5 text-justify leading-relaxed">
              Mỗi hành trình học tập đều bắt đầu từ một bước đi nhỏ. Tại
              <strong className="text-primary-400"> CodeLearn</strong>, chúng
              tôi mang đến cho bạn không chỉ là kiến thức mà còn là cơ hội để
              thay đổi tương lai. Với hơn 1000+ khóa học được cập nhật liên tục,
              đội ngũ giảng viên giàu kinh nghiệm, và cộng đồng học viên năng
              động, bạn sẽ có tất cả những gì cần thiết để đạt được mục tiêu của
              mình. Hãy bắt đầu ngay hôm nay!
            </p>
            <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: colors.primary.DEFAULT,
                marginTop: "20px",
                marginBottom: "50px",
                fontWeight: 600,
                "&:hover": { backgroundColor: colors.secondary },
              }}
            >
              Bắt đầu học ngay
            </Button>
          </div>
          <div className="col-span-1 h-full flex items-center justify-center">
            <div className="relative w-full max-w-md lg:max-w-lg">
              <img
                src={
                  "https://res.cloudinary.com/dopxef4b6/image/upload/v1762877722/banner-home-4_zqs0q0.png"
                }
                alt="language introduction"
                className="rounded-lg w-full h-auto animate-float-slower"
              />

              <div className="absolute animate-float bg-primary rounded-[8px] px-3 py-2 top-2 -left-5 flex items-center gap-2 text-white">
                <LaptopMacIcon className="text-lg" />
                <div className="whitespace-nowrap text-xs font-semibold">
                  Web Developer
                </div>
              </div>

              <div className="absolute animate-float bg-primary rounded-[8px] px-3 py-2 -top-4 -right-2 flex items-center gap-2 text-white">
                <PhoneIphoneIcon className="text-lg" />
                <div className="whitespace-nowrap text-xs font-semibold">
                  Mobile Developer
                </div>
              </div>

              <div className="absolute animate-float bg-primary rounded-[8px] px-3 py-2 -bottom-2 -left-8 flex items-center gap-2 text-white">
                <CloudIcon className="text-lg sm:text-2xl text-dark-2" />
                <div className="whitespace-nowrap text-xs font-semibold ">
                  Network Engineer
                </div>
              </div>

              <div className="absolute animate-float bg-primary rounded-[8px] px-3 py-2 bottom-5 -right-10 flex items-center gap-2 text-white">
                <ColorLensIcon className="text-lg" />
                <div className="whitespace-nowrap text-xs font-semibold">
                  UX Design
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Wave animations */}
        <div className="introduce-homepage__wave introduce-homepage__wave--1"></div>
        <div className="introduce-homepage__wave introduce-homepage__wave--2"></div>
        <div className="introduce-homepage__wave introduce-homepage__wave--3"></div>
        <div className="introduce-homepage__wave introduce-homepage__wave--4"></div>
      </section>
      <CategoryMarquee />
      <CourseSections />
      <section className="py-20 bg-secondary">
        <div className="container">
          <h3 className="text-4xl font-bold text-center mb-16 text-white">
            Học viên nói gì về{" "}
            <span className="text-primary-300">CodeLearn</span>
          </h3>
          <div className="grid grid-cols-5 gap-3">
            {feedbacks.map((feedback) => (
              <FeedbackCard key={feedback.id} feedback={feedback} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
