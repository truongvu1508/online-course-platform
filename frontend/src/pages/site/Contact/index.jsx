import React, { useState } from "react";
import { Form, Input, Button, message, Space, Divider } from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
import "./ContactPage.scss";

const ContactPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const contactInfo = [
    {
      icon: MailOutlined,
      label: "Email",
      value: "support@codelearn.vn",
      link: "mailto:support@codelearn.vn",
    },
    {
      icon: PhoneOutlined,
      label: "Hotline",
      value: "+84 (0) 912 345 678",
      link: "tel:+84912345678",
    },
    {
      icon: EnvironmentOutlined,
      label: "Địa Chỉ",
      value: "48 Cao Thắng, Phường Hải Châu, Thành phố Đà Nẵng",
      link: "#",
    },
  ];

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Giả lập gửi dữ liệu lên server
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Form Values:", values);
      message.success("Cảm ơn bạn! Chúng tôi sẽ liên hệ với bạn sớm nhất.");
      form.resetFields();
    } catch (error) {
      message.error("Có lỗi xảy ra. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <section className="contact-hero bg-secondary py-20">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-white mb-6">
              Liên Hệ Với Chúng Tôi
            </h1>
            <p className="text-lg text-gray-300">
              Có câu hỏi? Chúng tôi ở đây để giúp bạn. Hãy liên hệ với chúng tôi
              qua bất kỳ cách nào dưới đây.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-100">
        <div className="container">
          <h2 className="text-3xl font-bold text-center text-gray-600 mb-10">
            Tìm Chúng Tôi Trên Bản Đồ
          </h2>
          <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3833.771503349087!2d108.21084937490431!3d16.077342784603314!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3142184792140755%3A0xd4058cb259787dac!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBTxrAgUGjhuqFtIEvhu7kgdGh14bqtdCAtIMSQ4bqhaSBo4buNYyDEkMOgIE7hurVuZw!5e0!3m2!1svi!2s!4v1764314361378!5m2!1svi!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container">
          <div className="grid grid-cols-3 gap-10">
            <div className="col-span-1 p-10">
              <h3 className="text-2xl font-bold text-primary mb-8">
                Thông Tin Liên Hệ
              </h3>
              <div className="space-y-8">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <a
                      key={index}
                      href={info.link}
                      className="flex items-start gap-4 hover:transform hover:translate-x-2 duration-300 transition-all group"
                    >
                      <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                        <Icon className="text-white text-xl" />
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm font-semibold">
                          {info.label}
                        </p>
                        <p className="text-gray-800 text-base font-bold group-hover:text-primary-300">
                          {info.value}
                        </p>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="col-span-2 bg-gray-50 p-10 rounded-lg">
              <h3 className="text-2xl font-bold text-primary mb-8">
                Gửi Tin Nhắn Cho Chúng Tôi
              </h3>
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                className="contact-form"
              >
                <div className="grid grid-cols-2 gap-6">
                  <Form.Item
                    name="fullName"
                    label="Họ Và Tên"
                    rules={[
                      { required: true, message: "Vui lòng nhập họ tên" },
                    ]}
                  >
                    <Input
                      placeholder="Nhập họ và tên"
                      className="custom-input"
                      size="large"
                    />
                  </Form.Item>

                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      { required: true, message: "Vui lòng nhập email" },
                      { type: "email", message: "Email không hợp lệ" },
                    ]}
                  >
                    <Input
                      placeholder="Nhập email"
                      className="custom-input"
                      size="large"
                      type="email"
                    />
                  </Form.Item>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <Form.Item
                    name="phone"
                    label="Số Điện Thoại"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập số điện thoại",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Nhập số điện thoại"
                      className="custom-input"
                      size="large"
                    />
                  </Form.Item>

                  <Form.Item
                    name="subject"
                    label="Chủ Đề"
                    rules={[
                      { required: true, message: "Vui lòng chọn chủ đề" },
                    ]}
                  >
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300">
                      <option value="">-- Chọn chủ đề --</option>
                      <option value="support">Hỗ Trợ Kỹ Thuật</option>
                      <option value="billing">Hóa Đơn & Thanh Toán</option>
                      <option value="feedback">Góp Ý & Khiếu Nại</option>
                      <option value="partnership">Hợp Tác & Kinh Doanh</option>
                      <option value="other">Khác</option>
                    </select>
                  </Form.Item>
                </div>

                <Form.Item
                  name="message"
                  label="Tin Nhắn"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập nội dung tin nhắn",
                    },
                  ]}
                >
                  <Input.TextArea
                    placeholder="Nhập nội dung tin nhắn của bạn..."
                    rows={6}
                    className="custom-textarea"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    htmlType="submit"
                    type="primary"
                    loading={loading}
                    className="custom-button-antd w-full text-white hover:text-white"
                    size="large"
                  >
                    Gửi Tin Nhắn
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
