import React, { useState } from "react";
import Modal from "@components/common/Modal";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { ProfileView } from "./ProfileView";
import { useAuth } from "@context/AuthContext";

interface AuthModalProps {
  onClose: () => void;
}

type GuestView = "login" | "register";

export const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const { user } = useAuth();
  const [guestView, setGuestView] = useState<GuestView>("login");

  return (
    <Modal className="w-full max-w-sm" onClickOverlay={onClose}>
      {user ? (
        <ProfileView onClose={onClose} />
      ) : guestView === "login" ? (
        <LoginForm
          onSuccess={onClose}
          onSwitchToRegister={() => setGuestView("register")}
        />
      ) : (
        <RegisterForm
          onSuccess={onClose}
          onSwitchToLogin={() => setGuestView("login")}
        />
      )}
    </Modal>
  );
};
