import { FaUser } from "react-icons/fa";

const FeedbackCard = ({ feedback }) => {
  return (
    <div className="bg-white col-span-1 p-5 rounded-md hover:-translate-y-2 duration-300 cursor-pointer">
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center rounded-full bg-primary w-12 h-12">
          <FaUser className="w-10 h-10 text-white" />
        </div>
        <div>
          <h5 className="text-primary font-bold text-sm">{feedback.name}</h5>
          <p className="text-xs text-gray-500 font-[400]">{feedback.role}</p>
        </div>
      </div>
      <p className="mt-3 text-sm line-clamp-6 text-gray-500">
        {feedback.content}
      </p>
    </div>
  );
};

export default FeedbackCard;
