import { ChangeEvent, Fragment, useState } from "react";
import { db } from "../../services/firebaseService";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { ref, update } from "firebase/database";

interface Props {
  isModalOpen: boolean;
  closeModal: () => void;
  selectedDate: Date;
}

const dateOptions: Intl.DateTimeFormatOptions = {
  weekday: "long",
  month: "long",
  day: "numeric",
};

export default function ModalComponent({
  isModalOpen,
  closeModal,
  selectedDate,
}: Props) {
  const [isButtonDisabled, setButtonDisabled] = useState(true);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    setButtonDisabled(newName.trim().length === 0);
  };

  const handlePhoneNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, "");
    setPhoneNumber(input);
  };

  const handleConfirmDate = () => {
    const dateKey = selectedDate.toISOString().split("T")[0];
    const dayRef = ref(db, `calendar/${dateKey}`);

    // Optional: If phoneNumber is not empty, validate it.
    const phoneRegex = /^[2-9]\d{9}$/;
    let finalPhone = "";
    if (phoneNumber.trim() !== "") {
      if (!phoneRegex.test(phoneNumber)) {
        alert("Please enter a valid 10-digit Canadian phone number");
        return;
      } else {
        finalPhone = phoneNumber;
      }
    }

    update(dayRef, {
      status: "claimed",
      name: name,
      phone: finalPhone,
    })
      .then(() => {
        console.log("Date updated successfully!");
        closeModal();
      })
      .catch((error) => {
        console.error("Error updating date:", error);
      });
  };

  return (
    <Transition appear show={isModalOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        {/* Background overlay */}
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          {/* Modal panel transition */}
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className="w-full max-w-lg rounded-lg bg-white p-6 shadow-md">
              <DialogTitle className="text-xl font-bold text-gray-900">
                Confirm Date
              </DialogTitle>

              {selectedDate && (
                <p className="mt-3 text-gray-700">
                  Are you sure you can make it on{" "}
                  <strong>
                    {selectedDate.toLocaleString("en-US", dateOptions)}
                  </strong>
                  ?
                </p>
              )}

              {/* Name */}
              <div className="mt-5">
                <label
                  htmlFor="name"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Your Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={handleNameChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              {/* Phone Number */}
              <div className="mt-5">
                <label
                  htmlFor="phoneNumber"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Phone Number (Optional)
                </label>
                <p className="mb-2 text-xs italic text-gray-500">
                  Providing your phone number is optional. If you do, you'll
                  receive a text reminder the day before your scheduled visit.
                </p>
                <input
                  id="phoneNumber"
                  type="text"
                  placeholder="(555) 123-4567"
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              {/* Modal Actions */}
              <div className="mt-8 flex items-center justify-end gap-3">
                <button
                  onClick={closeModal}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDate}
                  disabled={isButtonDisabled}
                  className="rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
                >
                  Confirm Date
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
