import { useEffect, useState } from "react";

interface ChecklistItem {
  label: string;
  checked: boolean;
}

const defaultChecklist: ChecklistItem[] = [
  { label: "Feed cats one wet food each", checked: false },
  { label: "Top up dry food", checked: false },
  { label: "Clean litterbox", checked: false },
  { label: "Water plants", checked: false },
  { label: "Take trash to garbage room if full", checked: false },
  { label: "Make sure heat is on if temp below 0°", checked: false },
  { label: "Bonus: Play with the cats for a bit!", checked: false },
];

function Checklist() {
  const [items, setItems] = useState<ChecklistItem[]>(() => {
    const saved = sessionStorage.getItem("cat-checklist");
    return saved ? JSON.parse(saved) : defaultChecklist;
  });

  useEffect(() => {
    sessionStorage.setItem("cat-checklist", JSON.stringify(items));
  }, [items]);

  const toggleItem = (idx: number) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[idx].checked = !updated[idx].checked;
      return updated;
    });
  };

  return (
    <div className="p-6 max-w-sm w-full bg-white rounded-xl shadow-lg border border-gray-100 transition-all">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Cat Care Checklist
      </h2>
      <ul className="space-y-3">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center">
            <input
              id={`check-${idx}`}
              type="checkbox"
              checked={item.checked}
              onChange={() => toggleItem(idx)}
              className="h-5 w-5 text-teal-600 border-2 border-teal-300 rounded focus:ring-2 focus:ring-offset-2 focus:ring-teal-400 mr-3 cursor-pointer"
            />
            <label
              htmlFor={`check-${idx}`}
              className={`cursor-pointer select-none ${
                item.checked ? "line-through text-gray-400" : "text-gray-700"
              }`}
            >
              {item.label}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Checklist;
