import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";
import { CiMail } from "react-icons/ci"

const Footer = () => {
  return (
    <footer className="bg-[#F6F6F7] padding-x py-4 max-container dark:bg-[#141624]">
      <div className="flex max-md:justify-center">
        <div className="flex flex-col gap-6 items-center">
          <h1 className="text-[#141624] text-2xl dark:text-[#FFFFFF] ">
            SDA
          </h1>

          <p className="text-[14px] text-[#696A75] max-md:text-center dark:text-[#97989F]">
            SDA es un sistema de gestión de archivos intuitivo que facilita su digitalización y gestión de contenido. 
            Desarrollado con React.js, Tailwind CSS y Django, ofrece funciones como autenticación de usuarios y 
            temas claros/oscuros personalizables.
          </p>
        </div>

      </div>

      <div className="py-3 flex items-center gap-6 cursor-pointer max-md:mt-6 max-md:justify-center">
        <FaInstagram className="dark:text-white text-[20px] text-[#141624]" />
        <FaFacebookF className="dark:text-white text-[20px] text-[#141624]" />
        <BsTwitterX className="dark:text-white text-[20px] text-[#141624]" />
        <FaYoutube className="dark:text-white text-[20px] text-[#141624]" />
      </div>
    </footer>
  );
};

export default Footer;
