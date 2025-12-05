import Button from "@mui/material/Button";
import { colors } from "../../../utils/colors";
import {
  FaUsers,
  FaGraduationCap,
  FaTrophy,
  FaHeart,
  FaCheckCircle,
  FaLightbulb,
  FaGlobe,
  FaBook,
} from "react-icons/fa";
import "./AboutPage.scss";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";

const AboutPage = () => {
  const navigate = useNavigate();

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const stats = [
    { icon: FaUsers, label: "Học viên", value: 50000 },
    { icon: FaGraduationCap, label: "Khóa học", value: 1000 },
    { icon: FaTrophy, label: "Giảng viên", value: 500 },
    { icon: FaBook, label: "Bài giảng", value: 10000 },
  ];

  const values = [
    {
      icon: FaLightbulb,
      title: "Chất Lượng Hàng Đầu",
      description:
        "Nội dung được tuyển chọn kỹ lưỡng từ các chuyên gia hàng đầu trong ngành công nghệ, đảm bảo kiến thức luôn cập nhật với xu hướng thị trường.",
    },
    {
      icon: FaGlobe,
      title: "Cộng Đồng Toàn Cầu",
      description:
        "Kết nối với hàng nghìn học viên từ khắp nơi trên thế giới, chia sẻ kinh nghiệm và hỗ trợ lẫn nhau trong hành trình học tập.",
    },
    {
      icon: FaCheckCircle,
      title: "Hỗ Trợ Toàn Diện",
      description:
        "Đội ngũ hỗ trợ 24/7 sẵn sàng giải đáp mọi thắc mắc, cùng với các tài liệu bổ sung và diễn đàn cộng đồng năng động.",
    },
    {
      icon: FaHeart,
      title: "Cam Kết Thành Công",
      description:
        "Chúng tôi cam kết với sự thành công của bạn, cung cấp các công cụ, tài nguyên và hỗ trợ cần thiết để đạt mục tiêu.",
    },
  ];

  const achievements = [
    {
      title: "Được Thành Lập",
      description:
        "CodeLearn được thành lập vào năm 2025 với mục đích mang giáo dục chất lượng cao đến mọi người.",
    },
    {
      title: "Sứ Mệnh",
      description:
        "Cung cấp giáo dục công nghệ tiếp cận được, chất lượng cao cho mọi người, bất kể vị trí hoặc hoàn cảnh của họ.",
    },
    {
      title: "Tầm Nhìn",
      description:
        "Trở thành nền tảng học tập hàng đầu khu vực, góp phần phát triển nguồn nhân lực IT chất lượng cao cho Việt Nam.",
    },
    {
      title: "Giá Trị Cốt Lõi",
      description:
        "Đổi mới, Chất lượng, Cộng đồng - Ba giá trị này hướng dẫn mọi quyết định và hành động của chúng tôi.",
    },
  ];

  return (
    <div className="about-page fade-in-up">
      <section className="about-hero bg-secondary py-20">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-white mb-6">
              Về <span className="text-primary-300">CodeLearn</span>
            </h1>
            <p className="text-lg text-gray-300 mb-8">
              Chúng tôi tin rằng giáo dục là chìa khóa để mở ra những cơ hội
              mới. CodeLearn được tạo ra để giúp bạn đạt được tiềm năng tối đa
              của mình.
            </p>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/khoa-hoc")}
              sx={{
                backgroundColor: colors.primary.DEFAULT,
                fontWeight: 600,
                "&:hover": { backgroundColor: colors.secondary },
              }}
            >
              Khám Phá Khóa Học
            </Button>
          </div>
        </div>
      </section>

      <section ref={ref} className="py-16 bg-white">
        <div className="container">
          <div className="grid grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <Icon className="text-5xl text-primary mx-auto mb-4" />

                  {inView && (
                    <p className="text-3xl font-bold text-primary mb-2">
                      <CountUp
                        start={0}
                        end={stat.value}
                        duration={3}
                        delay={0}
                      />{" "}
                      +
                    </p>
                  )}
                  <p className="text-gray-600">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-600">
            Các Giá Trị Của Chúng Tôi
          </h2>
          <div className="grid grid-cols-2 gap-10">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                >
                  <Icon className="text-5xl text-primary mb-4" />
                  <h3 className="text-xl font-bold text-primary mb-4">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-secondary">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-16 text-white">
            Câu Chuyện Của Chúng Tôi
          </h2>
          <div className="grid grid-cols-2 gap-10">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className="bg-white bg-opacity-10 p-8 rounded-lg backdrop-blur-sm border border-white border-opacity-20"
              >
                <h3 className="text-2xl font-bold text-primary-300 mb-4">
                  {achievement.title}
                </h3>
                <p className="text-gray-200 leading-relaxed">
                  {achievement.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-600">
            Tại Sao Chọn <strong className="text-primary">CodeLearn </strong>?
          </h2>
          <div className="grid grid-cols-3 gap-10">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Khóa Học Chất Lượng
              </h3>
              <p className="text-gray-600">
                Được thiết kế bởi chuyên gia ngành với nội dung cập nhật thường
                xuyên.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Giá Cả Hợp Lý
              </h3>
              <p className="text-gray-600">
                Giáo dục tốt không phải quá đắt đỏ. Chúng tôi cung cấp giá phù
                hợp.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Hỗ Trợ Cộng Đồng
              </h3>
              <p className="text-gray-600">
                Được hỗ trợ bởi cộng đồng học tập năng động và giảng viên tâm
                huyết.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-secondary">
        <div className="container text-center">
          <h2 className="text-4xl font-bold text-white mb-8">
            Bắt Đầu Hành Trình Học Tập Của Bạn Ngay Hôm Nay
          </h2>
          <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
            Hơn 50,000 học viên đã tin tưởng{" "}
            <strong className="text-primary-300">CodeLearn</strong> để phát
            triển kỹ năng của họ. Bạn sẽ là người tiếp theo?
          </p>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/khoa-hoc")}
            sx={{
              backgroundColor: colors.primary.DEFAULT,
              fontWeight: 600,
              fontSize: "16px",
              padding: "12px 40px",
              "&:hover": { backgroundColor: colors.secondary },
            }}
          >
            Khám Phá Ngay
          </Button>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
