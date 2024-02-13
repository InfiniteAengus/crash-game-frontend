import { setPlayername } from "@/store/reducers/gameStateReducer";
import React, { useState } from "react";
import Modal from "react-modal";
import { useDispatch } from "react-redux";

const customStyles: Modal.Styles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: 0,
    border: "none",
    borderRadius: "24px",
    backgroundColor: "#262350",
  },
  overlay: {
    zIndex: 20,
    backgroundColor: "#26235024",
    backdropFilter: "blur(5px)",
  },
};

const UsernameModal = () => {
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(true);
  const [name, setName] = useState("");

  const closeModal = () => setIsOpen(false);

  const playGame = () => {
    if (name !== "") {
      dispatch(setPlayername(name));
      closeModal();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      style={customStyles}
      shouldCloseOnOverlayClick={false}
      shouldCloseOnEsc={false}
    >
      <div className="bg-bg-1 text-white px-5 py-4">
        <div className="font-medium text-lg pt-3">Player name</div>
        <input
          type="text"
          className="rounded-xl outline-none px-4 py-2 text-lg bg-bg-2 shadow-inner block my-4 text-text-1"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          className="block w-full py-2 text-center rounded-xl bg-gradient-to-br font-medium from-[#796CFF] to-[#574AFF]"
          onClick={playGame}
        >
          PLAY
        </button>
      </div>
    </Modal>
  );
};

export default UsernameModal;
