import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoSearch } from "react-icons/go";
import { FaSearchLocation } from "react-icons/fa";
import { FaCalendarDay } from "react-icons/fa";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css files
import { DateRangePicker } from "react-date-range";
import { format } from "date-fns";

export default function Header() {
  const [openDate, setOpenDate] = useState(false); // State to manage date picker visibility
  // const [openOptions, setOpenOptions] = useState(false); // State to manage options dropdown visibility
  const [cityName, setCityName] = useState("");
  const navigate = useNavigate();
  // const [options, setOptions] = useState({
  //   adults: 1,
  //   children: 0,
  // });
  // State to manage the number of adults and children
  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]); // State to manage selected date range
  // The object represents the initial date range selection with two properties

  // // Define a function to handle changes in the number of adults or children
  // const handleOption = (name, operation) => {
  //   // name is to specify where I am handling adult or children options
  //   // operation is to indicate where I want to decrease or increase for the specified option
  //   setOptions((prev) => {
  //     // setOptions is used to update the options state variable. It takes the previous state (prev) as argument and returns a new state based on the operation.
  //     return {
  //       ...prev,
  //       // It is to create a shallow copy of the previous state object.
  //       // it's important to create a new object that includes the properties of the previous state.
  //       [name]:
  //         operation === "increase" ? options[name] + 1 : options[name] - 1,
  //       // If the operation is "increase," it increments the count for the specified name (adults or children) by 1.
  //     };
  //   });
  // };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    console.log("Submitting form with data:", {
      cityName,
      dates: date[0],
      // options,
    }); // Log the captured data
    navigate("/searchExperience/:cityName", {
      state: { cityName, dates: date[0] },
    }); // Programmatically navigate with state
  };

  return (
    <header className="relative bg-white">
      <section className="pt-20 pb-80 sm:pt-24 sm:pb-40 lg:pt-40 lg:pb-48">
        <div className="relative mx-auto max-w-7xl px-4 sm:static sm:px-6 lg:px-8">
          <div className="sm:max-w-lg">
            <h1 className="font text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Enjoy foods and explore cultures
            </h1>
            <p className="mt-4 text-xl text-gray-500">
              No longer grab a bite alone! Just make friends and explore new
              cultures having delicious foods you like.
            </p>
          </div>
          <div>
            <div className="mt-10">
              <form
                className="flex relative justify-between px-2 pl-7 py-1 items-center text-center w-4/5 h-auto shadow-md shadow-gray-400 bg-white border rounded-full sm:text-xs"
                onSubmit={handleSubmit}
              >
                <section className="flex text-lg items-center gap-0.3">
                  <label htmlFor="locationInput" className="text-gray-300">
                    <FaSearchLocation />
                  </label>
                  <input
                    type="text"
                    placeholder="Please input city name"
                    className="border-none outline-none sm:placeholder-opacity-25 focus:border-none focus:outline-none focus:ring-0"
                    value={cityName}
                    onChange={(e) => setCityName(e.target.value)}
                  />
                </section>
                <div className="border-l border-gray-300"></div>
                <section className="flex text-lg items-center gap-1.5">
                  <label htmlFor="dateInput" className="text-gray-300">
                    <FaCalendarDay />
                  </label>
                  <span
                    onClick={() => setOpenDate(!openDate)}
                    className="text-gray-400 cursor-pointer"
                  >
                    {`${format(date[0].startDate, "MM/dd/yyyy")} to 
                    ${format(date[0].endDate, "MM/dd/yyyy")}`}
                    {/* The format function is used to format the date objects into a readable string representation. */}
                  </span>
                  {openDate && (
                    <div className="z-40">
                      <DateRangePicker
                        rangeColors={["#b91c1c"]}
                        onChange={(item) => setDate([item.selection])}
                        // This line is using the state updater function setDate to update the date state.
                        // It sets the date state to an array containing the selected date range (item.selection).
                        // This will cause a re-render of this component with the new selected date range.
                        minDate={new Date()}
                        // This property sets a minimum date for the date picker.
                        // Users won't be able to select dates earlier than the current date.
                        ranges={date}
                        // The ranges property receives the current date state.
                        // This determines the initially selected date range in the picker.
                        className="absolute top-16"
                      />
                    </div>
                  )}
                </section>
                <button
                  type="submit"
                  className="flex bg-red-700 p-4 flex-row-reverse rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-offset-2"
                >
                  <GoSearch className="text-white font-bold text-xl" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </header>
  );
}
