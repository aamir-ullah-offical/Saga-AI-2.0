import Header from "../components/common/Header";
import Profile from "../components/settings/Profile";

const SettingsPage = () => {
  return (
    <div className="flex-1 overflow-auto relative z-10 bg-gray-50 min-h-screen">
      <Header
        title="My Profile"
        className="text-center text-4xl font-bold text-[#2C4964] mb-8 tracking-wide"
      />
      <main className="max-w-4xl mx-auto px-4 py-6 lg:px-8">
        <Profile />
      </main>
    </div>
  );
};

export default SettingsPage;
