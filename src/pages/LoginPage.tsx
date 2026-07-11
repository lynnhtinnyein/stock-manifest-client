import { useMemo, useState, type ChangeEvent, type SubmitEvent } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { login } from "@/store/features/auth/authThunk";
import PasswordVisibilityToggle from "@/components/ui/PasswordVisibilityToggle";
import { APP_VERSION } from "@/configs/env";

// Manifest palette — matches the stock-manifest dashboard's design tokens.
const ink = "#1B2430";
const paper = "#F5F5F1";
const paperLine = "#E4E3DC";
const okGreen = "#3F8F5F";
const alertRed = "#C1443C";
const muted = "#8A93A0";

const LoginPage = () => {
    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector((state) => state.auth);

    const [formData, setFormData] = useState<LoginFormData>({
        username: "",
        password: "",
        remember: false
    });

    const [showPassword, setShowPassword] = useState(false);
    const [isErrorCheckable, setIsErrorCheckable] = useState(false);
    const [showClearance, setShowClearance] = useState(false);

    const formErrors = useMemo(() => {
        const errors: string[] = [];
        const requiredFields = ["username", "password"];
        requiredFields.forEach((field) => {
            if (!formData[field as keyof typeof formData]) {
                errors.push(field);
            }
        });
        return errors;
    }, [formData]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsErrorCheckable(true);

        if (formErrors.length === 0) {
            const resultAction = await dispatch(
                login({
                    username: formData.username,
                    password: formData.password,
                    remember: formData.remember
                })
            );

            if (login.fulfilled.match(resultAction)) {
                setShowClearance(true);
                setTimeout(() => setShowClearance(false), 1400);
            }
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4 sm:p-6 relative"
            style={{ backgroundColor: paper }}
        >
            {/* faint ledger-rule backdrop */}
            <div
                className="absolute inset-0 pointer-events-none opacity-50"
                style={{
                    backgroundImage: `repeating-linear-gradient(to bottom, transparent, transparent 38px, ${paperLine} 38px, ${paperLine} 39px)`
                }}
            />

            {/* claim-ticket stub */}
            <div
                className="relative z-[1] w-full max-w-3xl grid grid-cols-1 md:grid-cols-[1fr_auto_1.15fr] rounded-lg overflow-hidden bg-white"
                style={{
                    border: `1px solid ${paperLine}`,
                    boxShadow: "0 24px 60px -30px rgba(27,36,48,0.25)"
                }}
            >
                {/* perforated top edge */}
                <div
                    className="absolute top-0 left-0 right-0 h-2.5 pointer-events-none z-[2]"
                    style={{
                        backgroundImage: `radial-gradient(circle 3px, ${paper} 3px, transparent 3px)`,
                        backgroundSize: "14px 10px",
                        backgroundPosition: "6px -5px",
                        backgroundRepeat: "repeat-x",
                        transform: "translateY(-5px)"
                    }}
                />

                {/* LEFT: identity panel */}
                <div
                    className="relative overflow-hidden flex flex-row md:flex-col items-center md:items-stretch justify-between md:justify-start gap-4 p-5 sm:p-6 md:p-10 order-1 min-h-0 md:min-h-0"
                    style={{ backgroundColor: ink, color: paper }}
                >
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            backgroundImage:
                                "radial-gradient(circle at 85% 12%, rgba(201,134,43,0.18), transparent 45%), radial-gradient(circle at 10% 92%, rgba(58,90,120,0.35), transparent 50%)"
                        }}
                    />

                    <div className="relative z-[1] hidden md:block">
                        <p
                            className="font-['IBM_Plex_Mono',monospace] text-[10px] tracking-[0.16em] uppercase"
                            style={{ color: "rgba(245,245,241,0.55)" }}
                        >
                            STOCK MANIFEST
                        </p>
                    </div>

                    {/* logo — small + inline on mobile, big + centered on desktop */}
                    <div className="relative z-[1] flex-1 flex items-center justify-center md:py-6">
                        <img
                            src="/assets/logos/logo-long.png"
                            alt="Logo"
                            className="w-auto h-24 md:w-auto md:h-auto md:scale-105"
                        />
                    </div>

                    <div className="relative z-[1] hidden md:block">
                        <div
                            className="h-px mb-4"
                            style={{ backgroundColor: "rgba(245,245,241,0.15)" }}
                        />
                        <p
                            className="font-['IBM_Plex_Mono',monospace] text-[10px] tracking-[0.16em] uppercase"
                            style={{ color: "rgba(245,245,241,0.55)" }}
                        >
                            ONLINE SALE · BANGKOK DEPOT
                        </p>
                    </div>
                </div>

                {/* perforated tear divider */}
                <div
                    className="relative order-2 hidden md:block w-px"
                    style={{
                        backgroundImage: `repeating-linear-gradient(to bottom, ${paperLine}, ${paperLine} 6px, transparent 6px, transparent 13px)`
                    }}
                >
                    <span
                        className="absolute -top-[11px] left-1/2 -translate-x-1/2 w-[22px] h-[22px] rounded-full"
                        style={{ backgroundColor: paper }}
                    />
                    <span
                        className="absolute -bottom-[11px] left-1/2 -translate-x-1/2 w-[22px] h-[22px] rounded-full"
                        style={{ backgroundColor: paper }}
                    />
                </div>
                <div
                    className="relative order-2 md:hidden h-px"
                    style={{
                        backgroundImage: `repeating-linear-gradient(to right, ${paperLine}, ${paperLine} 6px, transparent 6px, transparent 13px)`
                    }}
                >
                    <span
                        className="absolute top-1/2 -left-[11px] -translate-y-1/2 w-[22px] h-[22px] rounded-full"
                        style={{ backgroundColor: paper }}
                    />
                    <span
                        className="absolute top-1/2 -right-[11px] -translate-y-1/2 w-[22px] h-[22px] rounded-full"
                        style={{ backgroundColor: paper }}
                    />
                </div>

                {/* RIGHT: form panel */}
                <div className="p-8 sm:p-10 flex flex-col justify-center order-3">
                    <p
                        className="font-['IBM_Plex_Mono',monospace] text-[10px] tracking-[0.18em] uppercase mb-1.5"
                        style={{ color: muted }}
                    >
                        Welcome Back
                    </p>
                    <h2
                        className="font-['Space_Grotesk',sans-serif] font-bold text-[22px] tracking-tight mb-6"
                        style={{ color: ink }}
                    >
                        Sign in to the manifest
                    </h2>

                    {error && (
                        <div
                            className="flex items-start gap-2.5 rounded-md px-3.5 py-3 mb-5"
                            style={{
                                backgroundColor: "#C1443C0D",
                                border: `1px solid ${alertRed}33`
                            }}
                        >
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                className="mt-0.5 shrink-0"
                            >
                                <circle cx="8" cy="8" r="6.5" stroke={alertRed} strokeWidth="1.4" />
                                <path
                                    d="M8 5v4"
                                    stroke={alertRed}
                                    strokeWidth="1.4"
                                    strokeLinecap="round"
                                />
                                <circle cx="8" cy="10.8" r="0.75" fill={alertRed} />
                            </svg>
                            <span className="text-sm" style={{ color: alertRed }}>
                                {error}
                            </span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate>
                        <div className="mb-5">
                            <div className="flex items-center justify-between mb-1.5">
                                <label
                                    htmlFor="username"
                                    className="font-['IBM_Plex_Mono',monospace] text-[10px] tracking-[0.14em] uppercase"
                                    style={{ color: muted }}
                                >
                                    Username
                                </label>
                                {isErrorCheckable && formErrors.includes("username") && (
                                    <span
                                        className="font-['IBM_Plex_Mono',monospace] text-[10.5px]"
                                        style={{ color: alertRed }}
                                    >
                                        Required!
                                    </span>
                                )}
                            </div>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                placeholder="Enter username"
                                autoComplete="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                className="w-full text-[14.5px] font-medium bg-transparent outline-none py-2 px-0.5 transition-colors"
                                style={{
                                    color: ink,
                                    borderBottom: `1.5px solid ${
                                        isErrorCheckable && formErrors.includes("username")
                                            ? alertRed
                                            : paperLine
                                    }`
                                }}
                            />
                        </div>

                        <div className="mb-6 relative">
                            <div className="flex items-center justify-between mb-1.5">
                                <label
                                    htmlFor="password"
                                    className="font-['IBM_Plex_Mono',monospace] text-[10px] tracking-[0.14em] uppercase"
                                    style={{ color: muted }}
                                >
                                    Password
                                </label>
                                {isErrorCheckable && formErrors.includes("password") && (
                                    <span
                                        className="font-['IBM_Plex_Mono',monospace] text-[10.5px]"
                                        style={{ color: alertRed }}
                                    >
                                        Required!
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter password"
                                    autoComplete="current-password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full text-[14.5px] font-medium bg-transparent outline-none py-2 px-0.5 transition-colors"
                                    style={{
                                        color: ink,
                                        borderBottom: `1.5px solid ${
                                            isErrorCheckable && formErrors.includes("password")
                                                ? alertRed
                                                : paperLine
                                        }`
                                    }}
                                />
                                <div className="pb-2">
                                    <PasswordVisibilityToggle
                                        show={showPassword}
                                        onToggle={setShowPassword}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* stamp-style checkbox — controlled, so it actually toggles */}
                        <label
                            className="flex items-center gap-2 mb-6 text-sm cursor-pointer select-none"
                            style={{ color: ink }}
                        >
                            <span
                                className="relative inline-flex items-center justify-center w-4 h-4 rounded-xs shrink-0 transition-colors"
                                style={{
                                    border: `1.5px solid ${formData.remember ? okGreen : paperLine}`,
                                    backgroundColor: formData.remember ? "#3F8F5F0D" : "transparent"
                                }}
                            >
                                <input
                                    type="checkbox"
                                    name="remember"
                                    checked={formData.remember}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            remember: e.target.checked
                                        }))
                                    }
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    aria-label="Keep me signed in for 30 days"
                                />
                                {formData.remember && (
                                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                        <path
                                            d="M1.5 5.2 3.8 7.5 8.5 2.5"
                                            stroke={okGreen}
                                            strokeWidth="1.6"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                )}
                            </span>
                            Keep me signed in for 30 days
                        </label>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full font-['Space_Grotesk',sans-serif] font-semibold text-[14.5px] rounded-md py-3 flex items-center justify-center gap-2 transition-opacity hover:opacity-90 active:scale-[0.99] disabled:opacity-55 disabled:cursor-default"
                            style={{ backgroundColor: ink, color: paper }}
                        >
                            {loading ? "Signing in…" : "Sign me in"}
                        </button>
                    </form>

                    <div
                        className="mt-8 pt-5 flex flex-col items-center gap-0.5"
                        style={{ borderTop: `1px solid ${paperLine}` }}
                    >
                        <span
                            className="font-['IBM_Plex_Mono',monospace] text-[10px] tracking-[0.1em]"
                            style={{ color: muted }}
                        >
                            v{APP_VERSION}
                        </span>
                        <span className="text-[11px]" style={{ color: muted }}>
                            Copyright &copy; {new Date().getFullYear()} All Rights Reserved
                        </span>
                    </div>
                </div>
            </div>

            {/* signature moment: clearance stamp on successful sign-in */}
            <div
                className="fixed inset-0 flex items-center justify-center z-50 transition-colors duration-300"
                style={{
                    backgroundColor: showClearance ? "rgba(27,36,48,0.28)" : "rgba(27,36,48,0)",
                    pointerEvents: showClearance ? "auto" : "none"
                }}
            >
                <div
                    className="font-['Space_Grotesk',sans-serif] font-bold uppercase rounded-md px-8 py-4 text-[22px] flex flex-col items-center gap-0.5 transition-all duration-300"
                    style={{
                        color: okGreen,
                        border: `3px solid ${okGreen}`,
                        backgroundColor: "rgba(245,245,241,0.97)",
                        letterSpacing: "0.1em",
                        boxShadow: "0 20px 50px -20px rgba(63,143,95,0.45)",
                        transform: showClearance
                            ? "scale(1) rotate(-4deg)"
                            : "scale(2.6) rotate(-8deg)",
                        opacity: showClearance ? 1 : 0
                    }}
                >
                    Cleared
                    <span
                        className="font-['IBM_Plex_Mono',monospace] text-[9.5px] tracking-[0.18em] normal-case"
                        style={{ color: muted }}
                    >
                        Manifest access granted
                    </span>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
