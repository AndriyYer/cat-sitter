import { Fragment, useEffect, useState } from "react";
import CalendarContainer from "./components/Calendar/CalendarContainer";
import ModalComponent from "./components/Modal/ModalComponent";
import Checklist from "./components/Checklist/ChecklistComponent";
import { useClaimedDates } from "./hooks/useClaimedDates";
import { Transition } from "@headlessui/react";
import "./App.css";

const dateOptions: Intl.DateTimeFormatOptions = {
  weekday: "long",
  month: "long",
  day: "numeric",
};

function App() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);

  const {
    claimedDates,
    whoClaimedDate,
    updateClaimedDates,
    isDateClaimed,
    fetchWhoClaimedDate,
  } = useClaimedDates();

  useEffect(() => {
    fetchWhoClaimedDate(selectedDate);
  }, [selectedDate, claimedDates]);

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  const toggleChecklist = () => setShowChecklist((prev) => !prev);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 px-4 py-6">
      <h1 className="text-3xl font-extrabold text-gray-800 mt-6 mb-6">
        The Mizu and Binki Calendar
      </h1>

      <div className="w-full max-w-2xl flex flex-col items-center space-y-6">
        <CalendarContainer
          setSelectedDate={setSelectedDate}
          setClaimedDatesInApp={updateClaimedDates}
        />

        {!selectedDate && (
          <p className="text-center text-gray-700 text-base">
            Ideally pick a day so that the cats are visited at least every
            second day.
          </p>
        )}

        {selectedDate && (
          <>
            {isDateClaimed(selectedDate) ? (
              <div className="w-full max-w-md text-center text-lg text-gray-700 bg-white p-4 rounded-lg shadow">
                <p className="mb-2">
                  Sorry,{" "}
                  <strong>
                    {selectedDate.toLocaleString("en-US", dateOptions)}
                  </strong>{" "}
                  has already been claimed by{" "}
                  <strong>{whoClaimedDate}</strong>.
                </p>
                <p>If that's you, thank you! If you need to cancel, text Andriy</p>
                <p className="text-red-600 mt-2 font-semibold">
                  Please pick a different date.
                </p>
              </div>
            ) : (
              <div className="w-full max-w-md bg-white p-4 rounded-lg shadow text-center">
                <span className="text-lg text-gray-700">
                  You can stop by on{" "}
                  <strong>
                    {selectedDate.toLocaleString("en-US", dateOptions)}?
                  </strong>
                </span>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={handleModalOpen}
                    className="px-5 py-2.5 rounded-full text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        <ModalComponent
          isModalOpen={isModalOpen}
          closeModal={handleModalClose}
          selectedDate={selectedDate!}
        />

        <button
          type="button"
          onClick={toggleChecklist}
          className="inline-block text-white text-sm font-semibold px-6 py-3 rounded-full focus:outline-none focus:ring-2 transition-all
            bg-gradient-to-r from-teal-500 via-teal-600 to-teal-700
            hover:from-teal-600 hover:via-teal-700 hover:to-teal-800
            focus:ring-teal-300"
        >
          {showChecklist ? "Hide Checklist" : "Show Checklist"}
        </button>

        <Transition
          show={showChecklist}
          as={Fragment}
          enter="transition ease-out duration-300"
          enterFrom="transform opacity-0 -translate-y-4"
          enterTo="transform opacity-100 translate-y-0"
          leave="transition ease-in duration-200"
          leaveFrom="transform opacity-100 translate-y-0"
          leaveTo="transform opacity-0 -translate-y-4"
        >
          <div className="mt-4">
            <Checklist />
          </div>
        </Transition>
      </div>
    </div>
  );
}

export default App;
