import Marquee from "react-fast-marquee";

const CategoryMarquee = () => {
  const categories = [
    {
      name: "Lập trình Web",
      slug: "lap-trinh-web",
      description:
        "Học xây dựng website và ứng dụng web từ cơ bản đến nâng cao",
      order: 1,
    },
    {
      name: "Lập trình Mobile",
      slug: "lap-trinh-mobile",
      description:
        "Phát triển ứng dụng di động cho iOS, Android và Cross Platform",
      order: 2,
    },
    {
      name: "Frontend Development",
      slug: "frontend-development",
      description:
        "Học các công nghệ frontend như HTML, CSS, JavaScript, React, Vue",
      order: 3,
    },
    {
      name: "Backend Development",
      slug: "backend-development",
      description: "Phát triển server-side với Node.js, PHP, Python, Java",
      order: 4,
    },
    {
      name: "Ngôn ngữ lập trình",
      slug: "ngon-ngu-lap-trinh",
      description:
        "Học các ngôn ngữ lập trình phổ biến như Python, JavaScript, Java, C++",
      order: 5,
    },
    {
      name: "Data Science & AI",
      slug: "data-science-ai",
      description: "Khoa học dữ liệu, Machine Learning và Trí tuệ nhân tạo",
      order: 6,
    },
    {
      name: "Database & SQL",
      slug: "database-sql",
      description: "Quản lý cơ sở dữ liệu SQL và NoSQL",
      order: 7,
    },
    {
      name: "DevOps & Cloud",
      slug: "devops-cloud",
      description:
        "Triển khai và vận hành hệ thống với Docker, Kubernetes, AWS, Azure",
      order: 8,
    },
    {
      name: "Game Development",
      slug: "game-development",
      description: "Phát triển game với Unity, Unreal Engine",
      order: 9,
    },
    {
      name: "Cybersecurity",
      slug: "cybersecurity",
      description: "An ninh mạng, bảo mật thông tin và Ethical Hacking",
      order: 10,
    },
    {
      name: "Blockchain & Web3",
      slug: "blockchain-web3",
      description: "Công nghệ Blockchain, Smart Contract và DApp Development",
      order: 11,
    },
    {
      name: "Testing & QA",
      slug: "testing-qa",
      description: "Kiểm thử phần mềm tự động và thủ công",
      order: 12,
    },
    {
      name: "UI/UX Design",
      slug: "ui-ux-design",
      description: "Thiết kế giao diện và trải nghiệm người dùng",
      order: 13,
    },
    {
      name: "Full Stack Development",
      slug: "full-stack-development",
      description: "Phát triển Full Stack với MERN, MEAN Stack",
      order: 14,
    },
    {
      name: "Software Engineering",
      slug: "software-engineering",
      description: "Kỹ thuật phần mềm, Design Patterns và Best Practices",
      order: 15,
    },
  ];
  return (
    <div className="w-full bg-white py-8">
      <div className="container mx-auto px-4">
        <h3 className="text-3xl font-bold text-center mb-6 text-gray-600">
          Danh mục khóa học tại <span className="text-primary">CodeLearn</span>
        </h3>

        <Marquee speed={80} gradient={true} gradientWidth={50}>
          {categories.map((category) => (
            <div
              key={category.slug}
              className="mx-5 mb-5 px-6 py-4 cursor-pointer rounded-full flex items-center justify-center shadow-[0_4px_15px_rgba(0,0,0,0.1)] hover:bg-primary hover:text-white duration-300 "
            >
              <p className="text-lg font-medium whitespace-nowrap">
                {category.name}
              </p>
            </div>
          ))}
        </Marquee>
        <Marquee
          speed={80}
          gradient={true}
          gradientWidth={50}
          direction="right"
        >
          {categories.map((category) => (
            <div
              key={category.slug}
              className="mx-5 mt-5 mb-5 px-6 py-4 cursor-pointer rounded-full flex items-center justify-center shadow-[0_4px_15px_rgba(0,0,0,0.1)] hover:bg-primary hover:text-white duration-300 "
            >
              <p className="text-lg font-medium whitespace-nowrap">
                {category.name}
              </p>
            </div>
          ))}
        </Marquee>
      </div>
    </div>
  );
};

export default CategoryMarquee;
