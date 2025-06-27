"use client";
import Image from "next/image";

import RotatingDollarIcon from "./rotate-dollar-icon";
import RotatingDollarBagIcon from "./rotate-bag-icon";
import { sponsorsData, sponsorStickerImage } from "@/config/sponsors";
import SectionTitle from "../shared/section-title";

const Sponsors = () => {
  const SponsorGroup = ({ title, sponsors }) => (
    <div className="flex flex-col justify-center items-center  bg-[#EFE7F7] mb-[70px] lg:mb-[120px]">
      <div className=" w-full   flex  justify-center mb-[70px]">
        <span className="font-archivo font-[600]   text-[17px] px-4 py-2 lg:px-8 lg:py-2 bg-[#FFEA89] rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1.00)]   outline-1 outline-offset-[-1px] outline-black inline-flex justify-center items-center gap-2   lg:font-[700] lg:text-[36px] lg:shadow-[6px_6px_0px_0px_rgba(0,0,0,1.00)] text-black ">
          {title.toUpperCase()} SPONSORS
        </span>
      </div>
      <div className="flex flex-wrap justify-center items-center gap-4 px-6 py-8 rounded-3xl border-2 border-gray-400 bg-white shadow-md w-[90%] max-w-[700px]">
        {sponsors.map((sponsor) => (
          <div
            key={sponsor.id}
            className="w-[120px] h-[120px] lg:w-[150px] lg:h-[150px] rounded-full border border-black bg-white flex items-center justify-center p-1 lg:p-2"
          >
            <div className="relative w-full h-full rounded-full border-2 border-dashed border-[#380665] flex items-center justify-center p-5 lg:p-[1.5rem] overflow-hidden">
              <Image
                src={sponsor.image}
                alt={sponsor.alt}
                width={500}
                height={500}
                className="w-auto h-auto max-w-full max-h-full object-contain"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="relative bg-[#EFE7F7] h-full w-full">
      <SectionTitle title="SPONSOR" lineGradient="purple-white" />
      <div className="lg:absolute lg:w-[280.036px] lg:h-[80.2px] lg:top-2 lg:left-0  z-1 absolute top-2 left-0 w-[180px] h-[70px]">
        <Image
          width={280.036}
          height={80.2}
          src={sponsorStickerImage}
          alt="Dev Mode on"
          className="w-auto h-auto object-cover"
        />
      </div>
      <div className="bg-[#EFE7F7] px-8 relative overflow-hidden mt-26">
        <RotatingDollarIcon />
        <RotatingDollarBagIcon />

        <SponsorGroup title="Track " sponsors={sponsorsData.platinum} />
        <SponsorGroup title="Track " sponsors={sponsorsData.gold} />
        {/* <SponsorGroup title="Silver" sponsors={sponsorsData.silver} /> */}
      </div>
    </div>
  );
};

export default Sponsors;
