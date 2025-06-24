import { useState } from "react";
import toast from "react-hot-toast";
import FeedbackHeader from "../components/FeedbackHeader";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const criteriaLabels = [
  { en: "Welcome", si: "පිළිගැනීම", ta: "ஏற்றுக்கொள்ளுதல்" },
  { en: "Friendliness", si: "සුහදත්වය", ta: "நட்பு" },
  { en: "Information", si: "තොරතුරු සැපයීම", ta: "தகவல் வழங்குதல்" },
  { en: "Hospitality", si: "ආගන්තුක සත්කාර", ta: "விருந்தோம்பல்" },
  { en: "Time taken for the entire process", si: "සමස්ත ක්‍රියාවලිය සදහා ගතවූ කාලය", ta: "முழு செயல்முறைக்கும் எடுக்கப்பட்ட நேரம்" },
  { en: "Satisfaction with our service compared to others", si: "අනෙක් ආයතන සමග සැසදීමේදී අපගේ සේවාවේ තෘප්තිමත්භාවය", ta: "மற்ற நிறுவனங்களுடன் ஒப்பிடும்போது எங்கள் சேவையில் திருப்தி" },
  { en: "Overall satisfaction", si: "සමස්ත තෘප්තිය", ta: "ஒட்டுமொத்த திருப்தி" },
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
      if (step < 8) setStep(step + 1);
    }, 800);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      console.log("Submitted:", form);
      toast.success("🎉 Thank you for your feedback!");
      setForm({ name: "", passport: "", reference: "", ratings: Array(7).fill(0), comment: "" });
      setStep(0);
    } catch (err) {
      toast.error("Submission failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <FeedbackHeader />

      <div className="flex flex-col items-center justify-start px-4 pt-6 overflow-hidden h-[calc(100vh-115px)]">
        <h1 className="text-3xl sm:text-3xl font-medium text-gray-800 text-center mb-6">
          Can You Please Rate Us
        </h1>

        {/* Step 0 – Personal Info */}
        {step === 0 && (
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-4xl p-8 sm:p-12 min-h-[480px] mx-auto flex flex-col justify-center">
            <div className="space-y-8">
              <input
                className="w-full py-3 px-4 text-lg border rounded-xl"
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                className="w-full py-3 px-4 text-lg border rounded-xl"
                placeholder="Passport Number"
                value={form.passport}
                onChange={(e) => setForm({ ...form, passport: e.target.value })}
              />
              <input
                className="w-full py-3 px-4 text-lg border rounded-xl"
                placeholder="Reference Number"
                value={form.reference}
                onChange={(e) => setForm({ ...form, reference: e.target.value })}
              />
            </div>

            <div className="mt-8 flex justify-center">
              <button
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
                onClick={handleNext}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Rating Steps */}
        {step >= 1 && step <= 7 && (
          <div className="relative w-full max-w-5xl mx-auto flex items-center justify-center px-4">
            <IconButton
              onClick={handleBack}
              className="!absolute -left-16 hover:scale-110 transition-transform"
              sx={{
                width: 56,
                height: 56,
                borderRadius: '9999px',
                border: '2px solid #d1d5dc',
                backgroundColor: '#ffffff',
              }}
            >
              <ArrowBackIosNewIcon sx={{ color: '#4a5565' }} />
            </IconButton>

            <div className="bg-white rounded-2xl shadow-lg w-full max-w-4xl p-8 sm:p-12 min-h-[480px] mx-auto flex flex-col justify-center text-center">
              <p className="text-2xl sm:text-3xl text-gray-600 mb-2 break-words">{criteriaLabels[step - 1].si}</p>
              <h3 className="text-3xl sm:text-4xl font-bold mb-3">{criteriaLabels[step - 1].en}</h3>
              <p className="text-xl sm:text-2xl text-gray-600 mb-4 break-words">{criteriaLabels[step - 1].ta}</p>

              <div className="flex justify-center gap-4 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRating(step - 1, star)}
                    className="text-8xl transition-transform duration-200 hover:scale-110"
                  >
                    <span className={star <= form.ratings[step - 1] ? "text-yellow-400" : "text-gray-300"}>
                      ★
                    </span>
                  </button>
                ))}
              </div>

              <p className="text-gray-600 mt-auto pt-6">Step {step + 1} of 9</p>
            </div>

            <IconButton
              onClick={handleNext}
              className="!absolute -right-16 hover:scale-110 transition-transform"
              sx={{
                width: 56,
                height: 56,
                borderRadius: '9999px',
                border: '2px solid #d1d5dc',
                backgroundColor: '#ffffff',
              }}
            >
              <ArrowForwardIosIcon sx={{ color: '#4a5565' }} />
            </IconButton>
          </div>
        )}

        {/* Step 8 – Comment */}
        {step === 8 && (
          <div className="relative w-full max-w-5xl mx-auto flex items-center justify-center px-4">
            <IconButton
              onClick={handleBack}
              className="!absolute -left-16 hover:scale-110 transition-transform"
              sx={{
                width: 56,
                height: 56,
                borderRadius: '9999px',
                border: '2px solid #d1d5dc',
                backgroundColor: '#ffffff',
              }}
            >
              <ArrowBackIosNewIcon sx={{ color: '#4a5565' }} />
            </IconButton>

            <div className="bg-white rounded-2xl shadow-lg w-full max-w-4xl p-8 sm:p-12 min-h-[480px] mx-auto flex flex-col justify-center">
              <h3 className="text-2xl font-bold mb-6 text-center">Leave a Comment (Optional)</h3>
              <textarea
                className="w-full min-h-[120px] p-4 border rounded-xl mb-4"
                placeholder="Your comment..."
                value={form.comment}
                onChange={(e) => setForm({ ...form, comment: e.target.value })}
              />
              <div className="mt-4 flex justify-center">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition"
                >
                  {loading && (
                    <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2 inline-block align-middle"></span>
                  )}
                  Submit Feedback
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
