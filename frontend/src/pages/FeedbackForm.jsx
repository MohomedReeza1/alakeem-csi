import { useState } from "react";
import toast from "react-hot-toast";
import FeedbackHeader from "../components/FeedbackHeader";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import api from "../api/axios";

const criteriaLabels = [
  { en: "Security Guards Welcome", si: "ආරක්ෂක නිළධාරීන්ගේ පිළිගැනීම", ta: "பாதுகாப்பு பணியாளர்களின் வரவேற்பு" },
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
    ratings: Array(8).fill(0),
    comment: "",
  });
  const [passportError, setPassportError] = useState("");
  const [referenceError, setReferenceError] = useState("");

  const handleNext = () => step < 12 && setStep(step + 1);
  const handleBack = () => step > 0 && setStep(step - 1);
  const handleToSubmitStep = () => setStep(12);

  const handleRating = (index, value) => {
    const updated = [...form.ratings];
    updated[index] = value;
    setForm({ ...form, ratings: updated });
    setTimeout(() => {
      if (step < 11) setStep(step + 1);
    }, 800);
  };

  const checkPassportExists = async (passportNumber) => {
    try {
      const res = await api.get(`/feedback/check-passport/${passportNumber}`);
      setPassportError(res.data.exists ? "A candidate with this passport already exists." : "");
    } catch (err) {
      console.error(err);
    }
  };

  const checkReferenceExists = async (referenceNumber) => {
    try {
      const res = await api.get(`/feedback/check-reference/${referenceNumber}`);
      setReferenceError(res.data.exists ? "A candidate with this reference number already exists." : "");
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.passport.trim() || !form.reference.trim() || form.ratings.some(r => r === 0)) {
      toast.error("Please complete all required fields and ratings before submitting.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/feedback", {
        name: form.name,
        passport_number: form.passport,
        reference_number: form.reference,
        comment: form.comment,
        security_welcome: form.ratings[0],
        criteria_1: form.ratings[1],
        criteria_2: form.ratings[2],
        criteria_3: form.ratings[3],
        criteria_4: form.ratings[4],
        criteria_5: form.ratings[5],
        criteria_6: form.ratings[6],
        criteria_7: form.ratings[7],
      });
      toast.success("🎉 Thank you for your feedback!");
      setForm({ name: "", passport: "", reference: "", ratings: Array(8).fill(0), comment: "" });
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
        <h1 className="text-3xl font-medium text-gray-800 text-center mb-6">Can You Please Rate Us</h1>

        {step === 0 && (
          <InputStep
            labelSi="සම්පූර්ණ නම"
            labelEn="Full Name"
            labelTa="முழு பெயர்"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            step={1}
            handleNext={handleNext}
            handleBack={handleBack}
          />
        )}

        {step === 1 && (
          <InputStep
            labelSi="පාස්පෝට් අංකය"
            labelEn="Passport Number"
            labelTa="கடவுச்சீட்டு எண்"
            value={form.passport}
            onChange={(e) => {
              const value = e.target.value;
              setForm({ ...form, passport: value });
              checkPassportExists(value);
            }}
            error={passportError}
            disabled={!!passportError}
            step={2}
            handleNext={handleNext}
            handleBack={handleBack}
          />
        )}

        {step === 2 && (
          <InputStep
            labelSi="යොමු අංකය"
            labelEn="Reference Number"
            labelTa="குறிப்பு எண்"
            value={form.reference}
            onChange={(e) => {
              const value = e.target.value;
              setForm({ ...form, reference: value });
              checkReferenceExists(value);
            }}
            error={referenceError}
            disabled={!!referenceError}
            step={3}
            handleNext={handleNext}
            handleBack={handleBack}
          />
        )}

        {step >= 3 && step <= 10 && (
          <RatingStep step={step} handleBack={handleBack} handleNext={handleNext} form={form} handleRating={handleRating} />
        )}

        {step === 11 && (
          <CommentStep form={form} setForm={setForm} handleToSubmitStep={handleToSubmitStep} handleBack={handleBack} />
        )}

        {step === 12 && (
          <SubmitStep loading={loading} handleSubmit={handleSubmit} handleBack={handleBack} />
        )}
      </div>
    </>
  );
}

function InputStep({ labelSi, labelEn, labelTa, value, onChange, error, disabled, step, handleNext, handleBack }) {
  return (
    <div className="relative w-full max-w-5xl mx-auto flex items-center justify-center px-4">
      <IconButton onClick={handleBack} className="!absolute -left-16" sx={{ width: 56, height: 56, borderRadius: "9999px", border: "2px solid #d1d5dc" }}>
        <ArrowBackIosNewIcon />
      </IconButton>
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-4xl p-8 sm:p-12 flex flex-col justify-center text-center">
        <p className="text-2xl text-gray-600 mb-2">{labelSi}</p>
        <h3 className="text-3xl font-bold mb-3">{labelEn}</h3>
        <p className="text-xl text-gray-600 mb-4">{labelTa}</p>
        <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="flex flex-col">
          <input
            className="w-full py-3 px-4 text-lg border rounded-xl"
            placeholder={labelEn}
            value={value}
            onChange={onChange}
            required
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <div className="mt-8 flex justify-center">
            <button
              type="submit"
              className={`bg-indigo-600 text-white px-6 py-2 rounded-lg ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'}`}
              disabled={disabled}
            >
              Next
            </button>
          </div>
        </form>
        <p className="text-gray-600 pt-6">Step {step} of 12</p>
      </div>
      <IconButton onClick={handleNext} className="!absolute -right-16" sx={{ width: 56, height: 56, borderRadius: "9999px", border: "2px solid #d1d5dc" }}>
        <ArrowForwardIosIcon />
      </IconButton>
    </div>
  );
}

function RatingStep({ step, handleBack, handleNext, form, handleRating }) {
  return (
    <div className="relative w-full max-w-5xl mx-auto flex items-center justify-center px-4">
      <IconButton onClick={handleBack} className="!absolute -left-16" sx={{ width: 56, height: 56, borderRadius: "9999px", border: "2px solid #d1d5dc" }}>
        <ArrowBackIosNewIcon />
      </IconButton>
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-4xl p-8 sm:p-12 flex flex-col justify-center text-center">
        <p className="text-2xl text-gray-600 mb-2">{criteriaLabels[step - 3].si}</p>
        <h3 className="text-3xl font-bold mb-3">{criteriaLabels[step - 3].en}</h3>
        <p className="text-xl text-gray-600 mb-4">{criteriaLabels[step - 3].ta}</p>
        <div className="flex justify-center gap-4 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} onClick={() => handleRating(step - 3, star)} className="text-8xl hover:scale-110">
              <span className={star <= form.ratings[step - 3] ? "text-yellow-400" : "text-gray-300"}>★</span>
            </button>
          ))}
        </div>
        <p className="text-gray-600 pt-6">Step {step + 1} of 12</p>
      </div>
      <IconButton onClick={handleNext} className="!absolute -right-16" sx={{ width: 56, height: 56, borderRadius: "9999px", border: "2px solid #d1d5dc" }}>
        <ArrowForwardIosIcon />
      </IconButton>
    </div>
  );
}

function CommentStep({ form, setForm, handleToSubmitStep, handleBack }) {
  return (
    <div className="relative w-full max-w-5xl mx-auto flex items-center justify-center px-4">
      <IconButton onClick={handleBack} className="!absolute -left-16" sx={{ width: 56, height: 56, borderRadius: "9999px", border: "2px solid #d1d5dc" }}>
        <ArrowBackIosNewIcon />
      </IconButton>
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-4xl p-8 sm:p-12 flex flex-col justify-center text-center">
        <p className="text-2xl text-gray-600 mb-2">ඔබගේ අදහස (අත්‍යවශ්‍ය නොවේ)</p>
        <h3 className="text-2xl font-bold mb-3">Leave a Comment (Optional)</h3>
        <p className="text-xl text-gray-600 mb-4">உங்கள் கருத்து (விருப்பத்தேர்வு)</p>
        <textarea className="w-full min-h-[120px] p-4 border rounded-xl mb-4" placeholder="Your comment..." value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} />
        <div className="mt-8 flex justify-center">
          <button onClick={handleToSubmitStep} className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">Next</button>
        </div>
        <p className="text-gray-600 pt-6">Step 12 of 12</p>
      </div>
      <IconButton onClick={handleToSubmitStep} className="!absolute -right-16" sx={{ width: 56, height: 56, borderRadius: "9999px", border: "2px solid #d1d5dc" }}>
        <ArrowForwardIosIcon />
      </IconButton>
    </div>
  );
}

function SubmitStep({ loading, handleSubmit, handleBack }) {
  return (
    <div className="relative w-full max-w-5xl mx-auto flex items-center justify-center px-4">
      <IconButton onClick={handleBack} className="!absolute -left-16" sx={{ width: 56, height: 56, borderRadius: "9999px", border: "2px solid #d1d5dc" }}>
        <ArrowBackIosNewIcon />
      </IconButton>
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-4xl p-8 sm:p-12 flex flex-col items-center text-center">
        <p className="text-2xl text-gray-600 mb-2">ඉදිරිපත් කිරීමට සූදානම්ද?</p>
        <h3 className="text-3xl font-bold mb-3">Ready to Submit?</h3>
        <p className="text-xl text-gray-600 mb-4">சமர்ப்பிக்க தயார்?</p>
        <button onClick={handleSubmit} disabled={loading} className="bg-indigo-600 text-white py-4 px-10 rounded-lg hover:bg-indigo-700 text-3xl font-semibold">
          {loading ? <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full inline-block"></span> : (
            <>
              <span className="block">ප්‍රතිචාරය යොමු කරන්න</span>
              <span className="block">Submit Feedback</span>
              <span className="block text-2xl">கருத்தை சமர்ப்பிக்கவும்</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
