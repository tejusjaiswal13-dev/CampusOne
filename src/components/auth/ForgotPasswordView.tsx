import { ArrowLeft, Lock } from "lucide-react";
import { useApp } from "../../context/AppState";

export const ForgotPasswordView = () => {
  const { setCurrentTab } = useApp();
  return (
    <section className="max-w-md mx-auto my-8 bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
      <Lock className="h-8 w-8 text-navy-600" aria-hidden="true" />
      <h1 className="text-xl font-bold text-slate-900">Account recovery</h1>
      <p className="text-sm leading-relaxed text-slate-600">
        This version uses local demo profiles and has no password service. No
        reset email can be sent. Return to the profile chooser to continue the
        demo.
      </p>
      <button
        onClick={() => setCurrentTab("login")}
        className="inline-flex items-center gap-2 min-h-11 px-4 rounded-xl bg-navy-900 text-white font-semibold"
      >
        <ArrowLeft size={18} /> Back to demo profiles
      </button>
    </section>
  );
};
