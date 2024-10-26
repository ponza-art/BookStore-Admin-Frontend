/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { Link } from "react-router-dom";

export default function NotFound({ setNotFound }) {
  useEffect(() => {
    setNotFound(false);
  }, []);
  return (
    <div className="bg-[#f7f9fc] px-5 py-5">
      <div className="mx-auto max-w-[410px]">
        <img src="/illustration-not-found.svg" alt="" />
        <div className="mt-7.5 text-center ">
          <h2 className="mb-3 text-2xl font-bold text-black">
            Sorry, the page can’t be found
          </h2>
          <p className="font-medium mb-3">
            The page you were looking for appears to have been moved, deleted or
            does not exist.
          </p>
          <Link
            className="mt-7.5 inline-flex items-center gap-2 rounded-md btn bg-blue-800 py-3 px-6 font-medium text-white hover:bg-blue-950"
            to={"/"}
          >
            <svg
              className="fill-current"
              width="16"
              height="14"
              viewBox="0 0 16 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.7492 6.38125H2.73984L7.52109 1.51562C7.77422 1.2625 7.77422 0.86875 7.52109 0.615625C7.26797 0.3625 6.87422 0.3625 6.62109 0.615625L0.799219 6.52187C0.546094 6.775 0.546094 7.16875 0.799219 7.42188L6.62109 13.3281C6.73359 13.4406 6.90234 13.525 7.07109 13.525C7.23984 13.525 7.38047 13.4687 7.52109 13.3562C7.77422 13.1031 7.77422 12.7094 7.52109 12.4563L2.76797 7.64687H14.7492C15.0867 7.64687 15.368 7.36562 15.368 7.02812C15.368 6.6625 15.0867 6.38125 14.7492 6.38125Z"
                fill=""
              ></path>
            </svg>
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
