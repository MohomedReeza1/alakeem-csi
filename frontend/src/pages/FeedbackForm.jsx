import { useState } from "react";
import toast from "react-hot-toast";

const criteriaLabels = [
  { en: "Welcome", si: "පිළිගැනීම", ta: "ஏற்குக்களுதல்" },
  { en: "Friendliness", si: "මිත්‍රශීලීභාවය", ta: "நட்புறவு" },
  { en: "Information", si: "තොරතුරු", ta: "தகவல்கள்" },
  { en: "Hospitality", si: "සත්කාරකම", ta: "உபசரிப்பு" },
  { en: "Time taken for the entire process", si: "ක්‍රියාවලිය සඳහා ගත වූ කාලය", ta: "முறையியல் நீடித்த நேரம்" },
  { en: "Satisfaction with our service compared to others", si: "වෙනත් ආයතන වලින් වඩාත් සෑහීමකට", ta: "பிற நிறுவனங்களுடன் ஒப்பீடு" },
  { en: "Overall satisfaction", si: "සමස්ත සෑහීම", ta: "மொத்த திருப்தி" },
];

export default function FeedbackForm() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    passport: "",
    reference: "",
    ratings: Array(7).fill(0),
    comment: "",
  });

  const handleNext = () => step < 8 && setStep(step + 1);
  const handleBack = () => step > 0 && setStep(step - 1);

  const handleRating = (index, value) => {
    const updated = [...form.ratings];
    updated[index] = value;
    setForm({ ...form, ratings: updated });

    setTimeout(() => {
      if (step < 7) setStep(step + 1);
    }, 800);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Replace this with actual API call
      console.log("Submitted:", form);

      toast.success("🎉 Thank you for your feedback!");
      setForm({
        name: "",
        passport: "",
        reference: "",
        ratings: Array(7).fill(0),
        comment: "",
      });
      setStep(0);
    } catch (err) {
      toast.error("Submission failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen max-w-[720px] mx-auto px-6 text-center">
      {step === 0 && (
        <>
          <h2 className="text-2xl font-bold mb-4">Customer Feedback Form</h2>
          <input
            className="w-full py-3 px-4 text-lg border rounded-xl mb-4"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="w-full py-3 px-4 text-lg border rounded-xl mb-4"
            placeholder="Passport Number"
            value={form.passport}
            onChange={(e) => setForm({ ...form, passport: e.target.value })}
          />
          <input
            className="w-full py-3 px-4 text-lg border rounded-xl mb-4"
            placeholder="Reference Number"
            value={form.reference}
            onChange={(e) => setForm({ ...form, reference: e.target.value })}
          />
          <button
            className="bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition"
            onClick={handleNext}
          >
            Next ➡️
          </button>
        </>
      )}

      {step >= 1 && step <= 7 && (
        <>
          <div className="mb-6">
            <p className="text-sm">{criteriaLabels[step - 1].si}</p>
            <h3 className="text-2xl font-bold">{criteriaLabels[step - 1].en}</h3>
            <p className="text-sm">{criteriaLabels[step - 1].ta}</p>
          </div>
          <div className="flex justify-center gap-3 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRating(step - 1, star)}
                className="text-5xl"
              >
                <span
                  className={
                    star <= form.ratings[step - 1]
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }
                >
                  ★
                </span>
              </button>
            ))}
          </div>
          <div className="flex justify-between w-full mt-6 px-6">
            <button onClick={handleBack} className="text-3xl">⬅️</button>
            <span>Step {step + 1} of 9</span>
            <button onClick={handleNext} className="text-3xl">➡️</button>
          </div>
        </>
      )}

      {step === 8 && (
        <>
          <h3 className="text-2xl font-bold mb-4">Leave a Comment (Optional)</h3>
          <textarea
            className="w-full min-h-[120px] p-4 border rounded-xl mb-4"
            placeholder="Your comment..."
            value={form.comment}
            onChange={(e) => setForm({ ...form, comment: e.target.value })}
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-green-600 text-white py-3 px-6 rounded-xl hover:bg-green-700 transition flex items-center gap-2"
          >
            {loading && (
              <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
            )}
            Submit Feedback ✅
          </button>
        </>
      )}
    </div>
  );
}
