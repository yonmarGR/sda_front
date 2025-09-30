import { FormatDate } from "@/services/formatDate";
import pic from "../images/pic.jpg"
import { BASE_URL } from "@/api";
 

const BlogWriter = ({blog}) => {
  return (
    <div className="flex items-center gap=4 ">
      <span className="flex items-center gap-2">
        <div className="w-[40px] h-[40px] rounded-full overflow-hidden">
          <img
            //src={pic}
            src={blog?.author.profile_picture ? `${BASE_URL}${blog.author.profile_picture}` : pic}
            alt="Img Profile}"
            className="c rounded-full w-full h-full object-cover"
            onError={(e) => {
              e.target.src = '/placeholder-image.jpg'
            }}
          />
        </div>

        <small className="text-[#696A75] text-[14px]">
          {blog.author.first_name}
          {blog.author.last_name}
        </small>
      </span>

      <small className="text-[#696A75] text-[14px] ml-3">
        {FormatDate(blog.published_date)}
      </small>
    </div>
  );
};

export default BlogWriter;
