import logo from '../assets/Al Akeem Logo.png';

export default function FeedbackHeader() {
  return (
    <header className="bg-indigo-600 py-6 px-8 flex justify-center items-center shadow-md">
      <div className="flex items-center gap-4">
        <img
          src={logo}
          alt="Al Akeem Logo"
          className="w-16 h-16 rounded-full bg-white p-1"
        />
        <h1 className="text-white text-3xl md:text-4xl font-semibold">
          Customer Feedback Form
        </h1>
      </div>
    </header>
  );
}
