import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const getLocalIpAddress = () => {
  // Replace with your IP Address
  return "192.168.0.106"; // e.g. "192.168.1.10"
};

const Dashboard = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [messageSent, setMessageSent] = useState(false);

  const sendWhatsAppMessage = () => {
    if (phoneNumber) {
      const ipAddress = getLocalIpAddress();
      const appLink = `https://${ipAddress}:3000/capture`; // HTTPS link with IP address
      const whatsappLink = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=Hello! Click this secure link to use the Camera Capture feature: ${appLink}`;
      window.open(whatsappLink, "_blank");
      setMessageSent(true);
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>

      <div className="action-buttons mt-4">
        <button
          className="btn btn-primary"
          onClick={() => (window.location.href = "/capture")}
        >
          Go to Camera Measure App
        </button>
      </div>

      <div className="whatsapp-section mt-5">
        <h3>Send "Hello" and Camera Capture Link to WhatsApp</h3>
        <div className="input-group mt-3">
          <input
            type="tel"
            className="form-control"
            placeholder="Enter WhatsApp number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <button
            className="btn btn-success"
            onClick={sendWhatsAppMessage}
            disabled={!phoneNumber}
          >
            Send Message
          </button>
        </div>
        {messageSent && <p className="text-success mt-2">Message sent!</p>}
      </div>
    </div>
  );
};

export default Dashboard;
