import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/utils/supabase";

export default function EmailConfirmation() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      // Get the hash and other parameters from the URL
      const token_hash = searchParams.get("token_hash");
      const type = searchParams.get("type");
      const redirect_to = searchParams.get("redirect_to");

      if (!token_hash) {
        setStatus("error");
        setMessage("Invalid confirmation link. No token found.");
        return;
      }

      try {
        // Verify the email confirmation token
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash,
          type: type as any, // email is the common type for email verification
        });

        if (error) {
          setStatus("error");
          setMessage(error.message || "Failed to verify email");
          return;
        }

        if (data.session) {
          // Store the session access token for backward compatibility with the existing auth system
          localStorage.setItem("auth_token", data.session.access_token);
          
          setStatus("success");
          setMessage("Email confirmed successfully! Redirecting...");
          
          // Redirect after a brief delay
          setTimeout(() => {
            navigate(redirect_to || "/");
          }, 2000);
        } else {
          setStatus("error");
          setMessage("Email confirmed but no session created. Please try logging in.");
          
          // Redirect to login after a brief delay
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        }
      } catch (err) {
        console.error("Email confirmation error:", err);
        setStatus("error");
        setMessage(err instanceof Error ? err.message : "An error occurred during email confirmation");
        
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    };

    handleEmailConfirmation();
  }, [searchParams, navigate]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-4 text-lg">Confirming your email...</p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="mb-4 mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-green-600">Success!</h2>
          <p className="mt-2 text-muted-foreground">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="mb-4 mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <svg
            className="h-6 w-6 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-red-600">Error</h2>
        <p className="mt-2 text-muted-foreground">{message}</p>
        <p className="mt-4 text-sm text-muted-foreground">Redirecting to login...</p>
      </div>
    </div>
  );
}

