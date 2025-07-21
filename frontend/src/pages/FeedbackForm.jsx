import { useState } from "react";
import toast from "react-hot-toast";
import FeedbackHeader from "../components/FeedbackHeader";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import api from "../api/axios";

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

  const handleNext = () => step < 11 && setStep(step + 1);
  const handleBack = () => step > 0 && setStep(step - 1);
  const handleToSubmitStep = () => setStep(11);

  const handleRating = (index, value) => {
    const updated = [...form.ratings];
    updated[index] = value;
    setForm({ ...form, ratings: updated });

    setTimeout(() => {
      if (step < 10) setStep(step + 1);
    }, 800);
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.passport.trim() || !form.reference.trim() || form.ratings.some(r => r === 0)) {
      toast.error("Please complete all required fields and ratings before submitting.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: form.name,
        passport_number: form.passport,
        reference_number: form.reference,
        comment: form.comment,
        criteria_1: form.ratings[0],
        criteria_2: form.ratings[1],
        criteria_3: form.ratings[2],
        criteria_4: form.ratings[3],
        criteria_5: form.ratings[4],
        criteria_6: form.ratings[5],
        criteria_7: form.ratings[6],
      };
      await api.post("/feedback", payload);
      toast.success("🎉 Thank you for your feedback!");
      setForm({ name: "", passport: "", reference: "", ratings: Array(7).fill(0), comment: "" });
      setStep(0);
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <FeedbackHeader />
      <div className="flex flex-col items-center justify-start px-4 pt-6 overflow-hidden h-[calc(100vh-115px)]">
        <h1 className="text-3xl sm:text-3xl font-medium text-gray-800 text-center mb-6">Can You Please Rate Us</h1>

        {/* Step 0 – Name */}
        {step === 0 && (
          <div className="relative w-full max-w-5xl mx-auto flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-4xl p-8 sm:p-12 min-h-[480px] mx-auto flex flex-col justify-center text-center">
              <p className="text-2xl text-gray-600 mb-2">සම්පූර්ණ නම</p>
              <h3 className="text-3xl font-bold mb-3">Full Name</h3>
              <p className="text-xl text-gray-600 mb-4">முழு பெயர்</p>
              <input className="w-full py-3 px-4 text-lg border rounded-xl" placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <div className="mt-8 flex justify-center">
                <button onClick={handleNext} className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition">Next</button>
              </div>
              <p className="text-gray-600 mt-auto pt-6">Step 1 of 11</p>
            </div>
            <IconButton onClick={handleNext} className="!absolute -right-16 hover:scale-110 transition-transform" sx={{ width: 56, height: 56, borderRadius: "9999px", border: "2px solid #d1d5dc", backgroundColor: "#ffffff" }}>
              <ArrowForwardIosIcon sx={{ color: "#4a5565" }} />
            </IconButton>
          </div>
        )}

        {/* Step 1 – Passport */}
        {step === 1 && (
          <InputStep labelSi="පාස්පෝට් අංකය" labelEn="Passport Number" labelTa="கடவுச்சீட்டு எண்" value={form.passport} onChange={(e) => setForm({ ...form, passport: e.target.value })} step={2} handleNext={handleNext} handleBack={handleBack} />
        )}

        {/* Step 2 – Reference */}
        {step === 2 && (
          <InputStep labelSi="යොමු අංකය" labelEn="Reference Number" labelTa="குறிப்பு எண்" value={form.reference} onChange={(e) => setForm({ ...form, reference: e.target.value })} step={3} handleNext={handleNext} handleBack={handleBack} />
        )}

        {/* Step 3–9 – Ratings */}
        {step >= 3 && step <= 9 && (
          <div className="relative w-full max-w-5xl mx-auto flex items-center justify-center px-4">
            <IconButton onClick={handleBack} className="!absolute -left-16 hover:scale-110 transition-transform" sx={{ width: 56, height: 56, borderRadius: "9999px", border: "2px solid #d1d5dc", backgroundColor: "#ffffff" }}>
              <ArrowBackIosNewIcon sx={{ color: "#4a5565" }} />
            </IconButton>
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-4xl p-8 sm:p-12 min-h-[480px] mx-auto flex flex-col justify-center text-center">
              <p className="text-2xl text-gray-600 mb-2">{criteriaLabels[step - 3].si}</p>
              <h3 className="text-3xl font-bold mb-3">{criteriaLabels[step - 3].en}</h3>
              <p className="text-xl text-gray-600 mb-4">{criteriaLabels[step - 3].ta}</p>
              <div className="flex justify-center gap-4 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => handleRating(step - 3, star)} className="text-8xl transition-transform duration-200 hover:scale-110">
                    <span className={star <= form.ratings[step - 3] ? "text-yellow-400" : "text-gray-300"}>★</span>
                  </button>
                ))}
              </div>
              <p className="text-gray-600 mt-auto pt-6">Step {step + 1} of 11</p>
            </div>
            <IconButton onClick={handleNext} className="!absolute -right-16 hover:scale-110 transition-transform" sx={{ width: 56, height: 56, borderRadius: "9999px", border: "2px solid #d1d5dc", backgroundColor: "#ffffff" }}>
              <ArrowForwardIosIcon sx={{ color: "#4a5565" }} />
            </IconButton>
          </div>
        )}

        {/* Step 10 – Comment */}
        {step === 10 && (
          <div className="relative w-full max-w-5xl mx-auto flex items-center justify-center px-4">
            <IconButton
              onClick={handleBack}
              className="!absolute -left-16 hover:scale-110 transition-transform"
              sx={{ width: 56, height: 56, borderRadius: "9999px", border: "2px solid #d1d5dc", backgroundColor: "#ffffff" }}
            >
              <ArrowBackIosNewIcon sx={{ color: "#4a5565" }} />
            </IconButton>

            <div className="bg-white rounded-2xl shadow-lg w-full max-w-4xl p-8 sm:p-12 min-h-[480px] mx-auto flex flex-col justify-center text-center">
              <p className="text-2xl text-gray-600 mb-2">අදහසක් දක්වන්න (අත්‍යවශ්‍ය නොවේ)</p>
              <h3 className="text-2xl font-bold mb-3">Leave a Comment (Optional)</h3>
              <p className="text-xl text-gray-600 mb-4">ஒரு கருத்தை இடுங்கள் (விருப்பத்தேர்வு)</p>

              <textarea
                className="w-full min-h-[120px] p-4 border rounded-xl mb-4"
                placeholder="Your comment..."
                value={form.comment}
                onChange={(e) => setForm({ ...form, comment: e.target.value })}
              />
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleToSubmitStep}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  Next
                </button>
              </div>
              <p className="text-gray-600 mt-auto pt-6 text-center">Step {step + 1} of 11</p>
            </div>

            <IconButton
              onClick={handleToSubmitStep}
              className="!absolute -right-16 hover:scale-110 transition-transform"
              sx={{ width: 56, height: 56, borderRadius: "9999px", border: "2px solid #d1d5dc", backgroundColor: "#ffffff" }}
            >
              <ArrowForwardIosIcon sx={{ color: "#4a5565" }} />
            </IconButton>
          </div>
        )}

        {/* Step 11 – Submit */}
        {step === 11 && (
          <div className="relative w-full max-w-5xl mx-auto flex items-center justify-center px-4">
            <IconButton
              onClick={handleBack}
              className="!absolute -left-16 hover:scale-110 transition-transform"
              sx={{ width: 56, height: 56, borderRadius: "9999px", border: "2px solid #d1d5dc", backgroundColor: "#ffffff" }}
            >
              <ArrowBackIosNewIcon sx={{ color: "#4a5565" }} />
            </IconButton>

            <div className="bg-white rounded-2xl shadow-lg w-full max-w-4xl p-8 sm:p-12 min-h-[480px] mx-auto flex flex-col justify-start items-center text-center pt-6">
              <p className="text-2xl text-gray-600 mb-2">ඉදිරිපත් කිරීමට සූදානම්ද?</p>
              <h3 className="text-3xl font-bold mb-3">Ready to Submit?</h3>
              <p className="text-xl text-gray-600 mb-4">சமர்ப்பிக்க தயார்?</p>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-indigo-600 text-white py-4 px-10 rounded-lg hover:bg-indigo-700 transition text-3xl font-semibold"
              >
                {loading ? (
                  <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full inline-block"></span>
                ) : (
                  <>
                    <span className="block">ප්‍රතිචාරය යොමු කරන්න</span>
                    <span className="block">Submit Feedback</span>
                    <span className="block text-2xl">கருத்தை சமர்ப்பிக்கவும்</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// Reusable Input Step Component
function InputStep({ labelSi, labelEn, labelTa, value, onChange, step, handleNext, handleBack }) {
  return (
    <div className="relative w-full max-w-5xl mx-auto flex items-center justify-center px-4">
      <IconButton onClick={handleBack} className="!absolute -left-16 hover:scale-110 transition-transform" sx={{ width: 56, height: 56, borderRadius: "9999px", border: "2px solid #d1d5dc", backgroundColor: "#ffffff" }}>
        <ArrowBackIosNewIcon sx={{ color: "#4a5565" }} />
      </IconButton>
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-4xl p-8 sm:p-12 min-h-[480px] mx-auto flex flex-col justify-center text-center">
        <p className="text-2xl text-gray-600 mb-2">{labelSi}</p>
        <h3 className="text-3xl font-bold mb-3">{labelEn}</h3>
        <p className="text-xl text-gray-600 mb-4">{labelTa}</p>
        <input className="w-full py-3 px-4 text-lg border rounded-xl" placeholder={labelEn} value={value} onChange={onChange} required />
        <div className="mt-8 flex justify-center">
          <button onClick={handleNext} className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition">Next</button>
        </div>
        <p className="text-gray-600 mt-auto pt-6">Step {step} of 11</p>
      </div>
      <IconButton onClick={handleNext} className="!absolute -right-16 hover:scale-110 transition-transform" sx={{ width: 56, height: 56, borderRadius: "9999px", border: "2px solid #d1d5dc", backgroundColor: "#ffffff" }}>
        <ArrowForwardIosIcon sx={{ color: "#4a5565" }} />
      </IconButton>
    </div>
  );
}
