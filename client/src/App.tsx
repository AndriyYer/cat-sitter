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
        if (selectedDate) {
            fetchWhoClaimedDate(selectedDate);
        }
    }, [selectedDate, claimedDates]);

    const handleModalOpen = () => setModalOpen(true);
    const handleModalClose = () => setModalOpen(false);

    const toggleChecklist = () => setShowChecklist((prev) => !prev);

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-50 px-4 py-8">
            <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
                The Mizu and Binki Calendar
            </h1>
            <p className="text-lg text-gray-600 mb-8">Click on a date below to select it</p>
            <div className="w-full max-w-3xl flex flex-col items-center space-y-8">
                <CalendarContainer
                    setSelectedDate={setSelectedDate}
                    setClaimedDatesInApp={updateClaimedDates}
                />

                {!selectedDate && (
                    <p className="text-center text-gray-700 text-base max-w-md">
                        Ideally pick a day so that the cats are visited at least every second day.
                    </p>
                )}

                {selectedDate && (
                    <>
                        {isDateClaimed(selectedDate) ? (
                            <div className="w-full max-w-md text-center text-lg text-gray-700 bg-white p-6 rounded-lg shadow-md">
                                <p className="mb-3">
                                    Sorry,{" "}
                                    <strong>
                                        {selectedDate.toLocaleString("en-US", dateOptions)}
                                    </strong>{" "}
                                    has already been claimed by{" "}
                                    <strong>{whoClaimedDate}</strong>.
                                </p>
                                <p>
                                    If that's you, thank you! If you need to cancel, text Andriy.
                                </p>
                                <p className="text-red-600 mt-4 font-semibold">
                                    Please pick a different date.
                                </p>
                            </div>
                        ) : (
                            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md text-center">
                                <span className="text-lg text-gray-700">
                                    You can stop by on{" "}
                                    <strong>
                                        {selectedDate.toLocaleString("en-US", dateOptions)}
                                    </strong>
                                    ?
                                </span>
                                <div className="mt-6">
                                    <button
                                        type="button"
                                        onClick={handleModalOpen}
                                        className="px-6 py-2 rounded-full text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                    className="inline-flex items-center justify-center text-teal-600 text-sm font-semibold px-6 py-3 border border-teal-600 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-300 transition-colors
                        bg-transparent
                        hover:bg-teal-600 hover:text-white"
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
                    <div className="mt-4 flex justify-center w-full max-w-md">
                        <Checklist />
                    </div>
                </Transition>
            </div>
        </div>
    );
}

export default App;
